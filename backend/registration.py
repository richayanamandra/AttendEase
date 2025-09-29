import boto3, json, os, uuid
from boto3.dynamodb.conditions import Attr

s3 = boto3.client("s3")
rekognition = boto3.client("rekognition", region_name="region")
dynamodb = boto3.resource("dynamodb", region_name="region")
employeeTable = dynamodb.Table("student_table")

def generate_roll_number():
    return "R-" + str(uuid.uuid4())[:8]

def lambda_handler(event, context):
    bucket = event["Records"][0]["s3"]["bucket"]["name"]
    key = event["Records"][0]["s3"]["object"]["key"]

    if key.endswith((".jpg", ".jpeg", ".png")):
        handle_image(bucket, key)
    elif key.endswith(".json"):
        handle_metadata(bucket, key)

def handle_image(bucket, key):
    baseName = os.path.splitext(os.path.basename(key))[0]
    firstName, lastName = baseName.split("_")

    response = rekognition.index_faces(
        Image={"S3Object": {"Bucket": bucket, "Name": key}},
        CollectionId="collection_id",
        DetectionAttributes=[],
        ExternalImageId=baseName
    )

    if not response["FaceRecords"]:
        write_status(bucket, baseName, "error", "No face detected in image")
        return

    faceId = response["FaceRecords"][0]["Face"]["FaceId"]

    # Check duplicate by rekognitionId
    existing_face = employeeTable.get_item(Key={"rekognitionId": faceId})
    if "Item" in existing_face:
        write_status(bucket, baseName, "error", "This face is already registered")
        return

    # Check duplicate name
    existing_name = employeeTable.scan(
        FilterExpression=Attr("firstName").eq(firstName) & Attr("lastName").eq(lastName)
    )
    if existing_name["Items"]:
        write_status(bucket, baseName, "error", f"Student {firstName} {lastName} already registered")
        return

    rollNumber = generate_roll_number()
    employeeTable.put_item(
        Item={
            "rekognitionId": faceId,
            "rollNumber": rollNumber,
            "firstName": firstName,
            "lastName": lastName
        }
    )
    write_status(bucket, baseName, "success", f"Student {firstName} {lastName} registered with roll {rollNumber}")

def handle_metadata(bucket, key):
    obj = s3.get_object(Bucket=bucket, Key=key)
    metadata = json.loads(obj["Body"].read())

    firstName = metadata["firstName"]
    lastName = metadata["lastName"]

    scan = employeeTable.scan(
        FilterExpression=Attr("firstName").eq(firstName) & Attr("lastName").eq(lastName)
    )
    if not scan["Items"]:
        write_status(bucket, f"{firstName}_{lastName}", "error", "No student found for metadata")
        return

    item = scan["Items"][0]
    rekognitionId = item["rekognitionId"]
    rollNumber = item["rollNumber"]

    employeeTable.update_item(
        Key={"rekognitionId": rekognitionId},
        UpdateExpression="""
            SET dob=:d, phoneNumber=:p, grade=:g, className=:c, address=:a,
                emergencyContactName=:ecn, emergencyContactPhone=:ecp,
                registrationDate=:rd
        """,
        ExpressionAttributeValues={
            ":d": metadata["dob"],
            ":p": metadata["phoneNumber"],
            ":g": metadata["grade"],
            ":c": metadata["className"],
            ":a": metadata["address"],
            ":ecn": metadata["emergencyContactName"],
            ":ecp": metadata["emergencyContactPhone"],
            ":rd": metadata["registrationDate"]
        }
    )

    write_status(bucket, f"{firstName}_{lastName}", "success", f"Metadata updated for roll {rollNumber}")

def write_status(bucket, baseName, status, message):
    status_key = f"status/{baseName}.json"
    status_data = {"status": status, "message": message}
    s3.put_object(Bucket=bucket, Key=status_key, Body=json.dumps(status_data))
    print(f"Status written: {status_data}")

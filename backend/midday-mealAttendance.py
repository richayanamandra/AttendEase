import boto3
import json
import base64
from datetime import datetime

# AWS clients
rekognition = boto3.client("rekognition")
dynamodb = boto3.resource("dynamodb")

# DynamoDB table names
EMPLOYEE_TABLE = "student_table"
ATTENDANCE_TABLE = "midday-attedance-table"

# Rekognition collection
REKOG_COLLECTION = "collection_id"

# Tables
employee_table = dynamodb.Table(EMPLOYEE_TABLE)
attendance_table = dynamodb.Table(ATTENDANCE_TABLE)


def lambda_handler(event, context):
    try:
        # Parse request from API Gateway
        body = json.loads(event.get("body", "{}"))
        if "image" not in body:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing image in request"})
            }

        # Decode base64 image → bytes
        image_bytes = base64.b64decode(body["image"])

        # Call Rekognition directly with bytes
        response = rekognition.search_faces_by_image(
            CollectionId=REKOG_COLLECTION,
            Image={"Bytes": image_bytes},
            MaxFaces=1,
            FaceMatchThreshold=90
        )

        if not response["FaceMatches"]:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": "No matching student found"})
            }

        face_id = response["FaceMatches"][0]["Face"]["FaceId"]

        # Get employee details from DynamoDB
        emp = employee_table.get_item(Key={"rekognitionId": face_id})
        if "Item" not in emp:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": "Student not found in DB"})
            }

        employee = emp["Item"]
        first_name = employee.get("firstName", "")
        last_name = employee.get("lastName", "")

        # Generate date & timestamp
        now = datetime.utcnow()
        today = now.strftime("%Y-%m-%d")
        timestamp = now.strftime("%Y-%m-%d %H:%M:%S")

        # Check if attendance already exists
        existing = attendance_table.get_item(
            Key={"rekognitionId": face_id, "date": today}
        )
        if "Item" in existing:
            return {
                "statusCode": 200,
                "body": json.dumps({
                    "firstName": first_name,
                    "lastName": last_name,
                    "date": today,
                    "timestamp": timestamp,
                    "message": "Attendance already marked"
                })
            }

        # Insert into attendance table
        attendance_table.put_item(
            Item={
                "rekognitionId": face_id,
                "date": today,
                "timestamp": timestamp,
                "firstName": first_name,
                "lastName": last_name,
                "midday-attendance": "present"
            }
        )

        # ✅ Return success JSON
        return {
            "statusCode": 200,
            "body": json.dumps({
                "firstName": first_name,
                "lastName": last_name,
                "date": today,
                "timestamp": timestamp,
                "message": "Mid-day Meal Attendance marked successfully"
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }


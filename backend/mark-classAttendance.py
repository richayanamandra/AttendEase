import boto3
import json
import base64
from datetime import datetime

rekognition = boto3.client("rekognition")
dynamodb = boto3.resource("dynamodb")

EMPLOYEE_TABLE = "student_table"
ATTENDANCE_TABLE = "attendance_table"
REKOG_COLLECTION = "collection_id"

employee_table = dynamodb.Table(EMPLOYEE_TABLE)
attendance_table = dynamodb.Table(ATTENDANCE_TABLE)

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        if "image" not in body:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({"error": "Missing image in request"})
            }

        image_bytes = base64.b64decode(body["image"])

        response = rekognition.search_faces_by_image(
            CollectionId=REKOG_COLLECTION,
            Image={"Bytes": image_bytes},
            MaxFaces=1,
            FaceMatchThreshold=90
        )

        if not response["FaceMatches"]:
            return {
                "statusCode": 404,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({"message": "No matching student found"})
            }

        face_id = response["FaceMatches"][0]["Face"]["FaceId"]

        emp = employee_table.get_item(Key={"rekognitionId": face_id})
        if "Item" not in emp:
            return {
                "statusCode": 404,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({"message": "Student not found in DB"})
            }

        employee = emp["Item"]
        first_name = employee.get("firstName", "")
        last_name = employee.get("lastName", "")

        now = datetime.utcnow()
        today = now.strftime("%Y-%m-%d")
        timestamp = now.strftime("%Y-%m-%d %H:%M:%S")

        existing = attendance_table.get_item(
            Key={"rekognitionId": face_id, "date": today}
        )
        if "Item" in existing:
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "firstName": first_name,
                    "lastName": last_name,
                    "date": today,
                    "timestamp": timestamp,
                    "message": "Attendance already marked"
                })
            }

        attendance_table.put_item(
            Item={
                "rekognitionId": face_id,
                "date": today,
                "timestamp": timestamp,
                "firstName": first_name,
                "lastName": last_name
            }
        )

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "firstName": first_name,
                "lastName": last_name,
                "date": today,
                "timestamp": timestamp,
                "message": "Attendance marked successfully"
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": str(e)})
        }

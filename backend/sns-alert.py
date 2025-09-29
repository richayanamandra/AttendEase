import json
import boto3
from datetime import datetime

# AWS clients
dynamodb = boto3.resource("dynamodb")
sns = boto3.client("sns")

# Replace with your table name and SNS ARN
TABLE_NAME = "midday-meal-complaints-table"
SNS_TOPIC_ARN = "your-topic-arn"

def lambda_handler(event, context):
    try:
        # Parse JSON body
        body = json.loads(event.get("body", "{}"))

        # Map frontend fields to DynamoDB fields
        schoolName = body.get("schoolName")
        dateofComplaint = body.get("dateOfComplaint")  # Expecting ISO date string from form
        complaintMessage = body.get("complaintMessage") or body.get("complaintText")
        studentName = body.get("studentName")
        studentRollNumber = body.get("studentRollNumber") or body.get("rollNumber")
        parentName = body.get("parentName")
        parentPhone = body.get("parentPhone")

        # Validate required fields
        required_fields = [schoolName, dateofComplaint, complaintMessage, studentName, studentRollNumber, parentName, parentPhone]
        if not all(required_fields):
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing required fields"})
            }

        # Write to DynamoDB
        table = dynamodb.Table(TABLE_NAME)
        table.put_item(Item={
            "schoolName": schoolName,
            "dateofComplaint": dateofComplaint,
            "complaintMessage": complaintMessage,
            "studentName": studentName,
            "studentRollNumber": studentRollNumber,
            "parentName": parentName,
            "parentPhone": parentPhone
        })

        # Send SNS notification
        sns_message = (
            f"New Midday Meal Complaint\n"
            f"School: {schoolName}\n"
            f"Date: {dateofComplaint}\n"
            f"Student: {studentName} (Roll No: {studentRollNumber})\n"
            f"Parent: {parentName}\n"
            f"Phone: {parentPhone}\n"
            f"Complaint: {complaintMessage}"
        )

        sns.publish(
            TopicArn=SNS_TOPIC_ARN,
            Message=sns_message,
            Subject="Midday Meal Complaint"
        )

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Complaint submitted successfully"})
        }

    except Exception as e:
        print("Error:", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal server error"})
        }

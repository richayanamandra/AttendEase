import boto3
import json
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("midday-meal-complaints-table")  # replace with your DynamoDB table name

def lambda_handler(event, context):
    try:
        # Scan the whole table
        response = table.scan()
        complaints = response.get("Items", [])

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"complaints": complaints})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

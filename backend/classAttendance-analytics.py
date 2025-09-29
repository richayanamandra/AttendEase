import json
import boto3

dynamodb = boto3.resource("dynamodb")
attendance_table = dynamodb.Table("attendance-table")

def lambda_handler(event, context):
    try:
        # Scan the attendance2 table
        response = attendance_table.scan()
        records = response.get("Items", [])

        # Handle pagination
        while "LastEvaluatedKey" in response:
            response = attendance_table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
            records.extend(response.get("Items", []))

        # Build the result with only required fields
        result = []
        for r in records:
            result.append({
                "date": r.get("date"),
                "firstName": r.get("firstName"),
                "lastName": r.get("lastName"),
                "timestamp": r.get("timestamp")
            })

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(result)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

import json
import boto3

dynamodb = boto3.resource("dynamodb")
midday_table = dynamodb.Table("midday-attendance-table")

def lambda_handler(event, context):
    try:
        # Scan the mid-day attendance table
        response = midday_table.scan()
        records = response.get("Items", [])

        # Handle pagination
        while "LastEvaluatedKey" in response:
            response = midday_table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
            records.extend(response.get("Items", []))

        # Build the result with only required fields
        result = []
        for r in records:
            result.append({
                "date": r.get("date"),
                "firstName": r.get("firstName"),
                "lastName": r.get("lastName"),
                "middayAttendance": r.get("middayAttendance"),  # or match the exact field name in table
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

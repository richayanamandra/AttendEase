import boto3
import json

dynamodb = boto3.resource("dynamodb")
EMPLOYEE_TABLE = "student-table"   # change if your table name differs
employee_table = dynamodb.Table(EMPLOYEE_TABLE)

def lambda_handler(event, context):
    try:
        # Fetch all employees
        response = employee_table.scan()
        employees = response.get("Items", [])

        # Keep only the required fields
        result = [
            {
                "firstName": emp.get("firstName"),
                "lastName": emp.get("lastName"),
                "address": emp.get("address"),
                "className": emp.get("className"),
                "dob": emp.get("dob"),
                "emergencyContactName": emp.get("emergencyContactName"),
                "emergencyContactPhone": emp.get("emergencyContactPhone"),
                "grade": emp.get("grade"),
                "phoneNumber": emp.get("phoneNumber"),
                "registrationDate": emp.get("registrationDate"),
                "rollNumber": emp.get("rollNumber")
            }
            for emp in employees
        ]

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"  # allow frontend to call it
            },
            "body": json.dumps(result)
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

import os
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_robustness():
    with open("../demo_data/synthetic_hiring_data.csv", "rb") as f:
        csv_bytes = f.read()

    print("\n=== Test 1: Different Valid Columns (sensitive=region) ===")
    res1 = client.post(
        "/analyze/",
        data={
            "target_column": "hired",
            "sensitive_column": "region",
            "feature_columns": "assessment_score,interview_score"
        },
        files={"file": ("data.csv", csv_bytes, "text/csv")}
    )
    if res1.status_code == 200:
        print("SUCCESS! Status 200.")
        print("Disparity Summaries:", res1.json()["disparity_summaries"])
    else:
        print(f"FAILED: {res1.status_code} - {res1.text}")

    print("\n=== Test 2: Trash Target Column ===")
    res2 = client.post(
        "/analyze/",
        data={
            "target_column": "trash_target",
            "sensitive_column": "gender",
            "feature_columns": "years_experience"
        },
        files={"file": ("data.csv", csv_bytes, "text/csv")}
    )
    print(f"Result: {res2.status_code} - {res2.text}")

    print("\n=== Test 3: Trash Sensitive Column ===")
    res3 = client.post(
        "/analyze/",
        data={
            "target_column": "hired",
            "sensitive_column": "trash_sensitive",
            "feature_columns": "years_experience"
        },
        files={"file": ("data.csv", csv_bytes, "text/csv")}
    )
    print(f"Result: {res3.status_code} - {res3.text}")

    print("\n=== Test 4: Trash Feature Column ===")
    res4 = client.post(
        "/analyze/",
        data={
            "target_column": "hired",
            "sensitive_column": "gender",
            "feature_columns": "years_experience,fake_feature"
        },
        files={"file": ("data.csv", csv_bytes, "text/csv")}
    )
    print(f"Result: {res4.status_code} - {res4.text}")

    print("\n=== Test 5: Non-Binary Target Column ===")
    res5 = client.post(
        "/analyze/",
        data={
            "target_column": "assessment_score",
            "sensitive_column": "gender",
            "feature_columns": "years_experience"
        },
        files={"file": ("data.csv", csv_bytes, "text/csv")}
    )
    print(f"Result: {res5.status_code} - {res5.text}")

    print("\n=== Test 6: Missing Field ===")
    res6 = client.post(
        "/analyze/",
        data={
            "target_column": "hired",
            "sensitive_column": "gender"
            # Missing feature_columns
        },
        files={"file": ("data.csv", csv_bytes, "text/csv")}
    )
    print(f"Result: {res6.status_code} - {res6.text}")

    print("\n=== Test 7: Wrong File Type ===")
    res7 = client.post(
        "/analyze/",
        data={
            "target_column": "hired",
            "sensitive_column": "gender",
            "feature_columns": "years_experience"
        },
        files={"file": ("data.txt", b"just some text", "text/plain")}
    )
    print(f"Result: {res7.status_code} - {res7.text}")

if __name__ == "__main__":
    test_robustness()

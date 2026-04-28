import requests
import json

base_url = "http://localhost:8000"

print("--- Step 1: /analyze ---")
with open("demo_dataset.csv", "rb") as f:
    files = {"file": ("demo_dataset.csv", f, "text/csv")}
    data = {
        "target_column": "hired",
        "sensitive_column": "gender",
        "feature_columns": "years_experience,interview_score,technical_score"
    }
    res = requests.post(f"{base_url}/analyze/", files=files, data=data)

if res.status_code != 200:
    print("FAILED /analyze:", res.text)
    exit(1)

analyze_data = res.json()
analysis_id = analyze_data["analysis_id"]
print("SUCCESS /analyze! analysis_id:", analysis_id)

print("\n--- Step 2: /mitigate ---")
res2 = requests.post(f"{base_url}/mitigate/", json={
    "analysis_id": analysis_id,
    "method": "threshold_tuning"
})

if res2.status_code != 200:
    print("FAILED /mitigate:", res2.text)
    exit(1)

print("SUCCESS /mitigate!")

print("\n--- Step 3: /report ---")
res3 = requests.post(f"{base_url}/report/", json={
    "analysis_id": analysis_id,
    "include_mitigation": True
})

if res3.status_code != 200:
    print("FAILED /report:", res3.text)
    exit(1)

print("SUCCESS /report!")

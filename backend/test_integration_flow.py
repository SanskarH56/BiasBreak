from fastapi.testclient import TestClient
from app.main import app

import io

client = TestClient(app)

print("--- Step 1: /analyze ---")
csv_data = "hired,gender,years_experience,interview_score,technical_score\n1,M,5,80,90\n0,F,2,60,70\n1,F,6,85,88\n0,M,1,50,60\n1,M,4,75,85\n0,F,3,65,75\n"
f = io.BytesIO(csv_data.encode("utf-8"))
f.name = "demo_dataset.csv"

files = {"file": ("demo_dataset.csv", f, "text/csv")}
data = {
    "target_column": "hired",
    "sensitive_column": "gender",
    "feature_columns": "years_experience,interview_score,technical_score"
}
res = client.post("/analyze/", files=files, data=data)

if res.status_code != 200:
    print("FAILED /analyze:", res.text)
    exit(1)

analyze_data = res.json()
analysis_id = analyze_data["analysis_id"]
print("SUCCESS /analyze! analysis_id:", analysis_id)

print("\n--- Step 2: /mitigate ---")
res2 = client.post("/mitigate/", json={
    "analysis_id": analysis_id,
    "method": "threshold_tuning"
})

if res2.status_code != 200:
    print("FAILED /mitigate:", res2.text)
    exit(1)

mitigate_data = res2.json()
print("SUCCESS /mitigate!")
print("Improved?", mitigate_data["comparison"].get("improved"))
disparities = mitigate_data["comparison"]["after_mitigation"]["disparity_summaries"]
for d in disparities:
    if d["metric_name"] == "selection_rate_gap":
        print("After Gap:", d["value"])

print("\n--- Step 3: /report ---")
res3 = client.post("/report/", json={
    "analysis_id": analysis_id,
    "include_mitigation": True
})

if res3.status_code != 200:
    print("FAILED /report:", res3.text)
    exit(1)

print("SUCCESS /report!")
report_data = res3.json()
print("Executive Summary snippet:", report_data["report"]["executive_summary"][:50])

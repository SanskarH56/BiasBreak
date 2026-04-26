import json
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_tests():
    print("--- 1. Testing POST /analyze/ ---")
    with open("../demo_data/synthetic_hiring_data.csv", "rb") as f:
        file_bytes = f.read()

    # Emulate the form data expected by /analyze
    response = client.post(
        "/analyze/",
        data={
            "target_column": "hired",
            "sensitive_column": "gender",
            "feature_columns": "years_experience,assessment_score,interview_score,college_tier"
        },
        files={"file": ("synthetic_hiring_data.csv", file_bytes, "text/csv")}
    )

    if response.status_code != 200:
        print(f"FAILED: {response.text}")
        return

    data = response.json()
    analysis_id = data.get("analysis_id")
    print(f"SUCCESS: Analysis ID generated -> {analysis_id}")
    print(f"Baseline Accuracy: {data['model_summary']['overall_accuracy']:.4f}")
    
    print("\n--- 2. Testing POST /mitigate/ (Threshold Tuning) ---")
    res_tt = client.post(
        "/mitigate/",
        json={
            "analysis_id": analysis_id,
            "method": "threshold_tuning"
        }
    )
    if res_tt.status_code == 200:
        tt_data = res_tt.json()
        print("SUCCESS: Threshold Tuning applied!")
        print(f"Chosen Threshold: {tt_data['chosen_threshold']}")
        comp = tt_data['comparison']
        print(f"Accuracy change: {comp['accuracy_change']:.4f}")
        print(f"Selection Rate Gap change: {comp['selection_rate_gap_change']:.4f}")
        print(f"Improved? {comp['improved']}")
    else:
        print(f"FAILED: {res_tt.text}")

    print("\n--- 3. Testing POST /mitigate/ (Feature Removal) ---")
    res_fr = client.post(
        "/mitigate/",
        json={
            "analysis_id": analysis_id,
            "method": "feature_removal",
            "params": {"feature_to_remove": "college_tier"}
        }
    )
    if res_fr.status_code == 200:
        fr_data = res_fr.json()
        print("SUCCESS: Feature Removal applied!")
        comp = fr_data['comparison']
        print(f"Accuracy change: {comp['accuracy_change']:.4f}")
        print(f"Selection Rate Gap change: {comp['selection_rate_gap_change']:.4f}")
        print(f"Improved? {comp['improved']}")
    else:
        print(f"FAILED: {res_fr.text}")

if __name__ == "__main__":
    run_tests()
    
    print("\n--- 4. Testing Errors ---")
    res_err1 = client.post("/mitigate/", json={"analysis_id": "fake", "method": "threshold_tuning"})
    print(f"Bad ID: {res_err1.status_code} - {res_err1.text}")
    
    res_err2 = client.post("/mitigate/", json={"analysis_id": analysis_id, "method": "magic_wand"})
    print(f"Bad method: {res_err2.status_code} - {res_err2.text}")
    
    res_err3 = client.post("/mitigate/", json={"analysis_id": analysis_id, "method": "feature_removal"})
    print(f"Missing feature: {res_err3.status_code} - {res_err3.text}")
    
    res_err4 = client.post("/mitigate/", json={"analysis_id": analysis_id, "method": "feature_removal", "params": {"feature_to_remove": "not_a_column"}})
    print(f"Wrong feature: {res_err4.status_code} - {res_err4.text}")
    
run_tests()

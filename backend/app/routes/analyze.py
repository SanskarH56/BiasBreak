from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.schemas.response_models import (
    AnalyzeResponse,
    DatasetSummary,
    ModelSummary,
    GroupMetric,
    DisparitySummary,
    RiskFlag
)
from typing import List

router = APIRouter(prefix="/analyze", tags=["Analyze"])

@router.post("/", response_model=AnalyzeResponse)
async def analyze_data(
    # 1. Accept a CSV file upload
    file: UploadFile = File(...),
    # 2. Accept form fields
    target_column: str = Form(...),
    sensitive_column: str = Form(...),
    feature_columns: str = Form(...)
):
    """
    Endpoint to receive a dataset and configuration for bias analysis.
    """
    
    # 3. Light validation: Check if the uploaded file is a CSV
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
        
    # Additional light validation: Ensure form fields are not empty
    if not target_column or not sensitive_column or not feature_columns:
        raise HTTPException(status_code=400, detail="Target, sensitive, and feature columns must be provided.")

    # Convert comma-separated feature_columns string to a list
    features = [f.strip() for f in feature_columns.split(",") if f.strip()]

    # 4. Return dummy JSON matching AnalyzeResponse
    # No real preprocessing or model training yet
    
    # Dummy DatasetSummary
    dataset_summary = DatasetSummary(
        total_records=1000,
        features_analyzed=features,
        sensitive_attribute=sensitive_column
    )
    
    # Dummy ModelSummary
    model_summary = ModelSummary(
        overall_accuracy=0.85,
        model_type="Logistic Regression (Dummy)"
    )
    
    # Dummy GroupMetrics
    group_metrics = [
        GroupMetric(group_name="Group A", pass_rate=0.80),
        GroupMetric(group_name="Group B", pass_rate=0.60)
    ]
    
    # Dummy DisparitySummaries
    disparity_summaries = [
        DisparitySummary(metric_name="Disparate Impact", value=0.75, is_fair=False),
        DisparitySummary(metric_name="Demographic Parity Difference", value=0.20, is_fair=False)
    ]
    
    # Dummy RiskFlags
    risk_flags = [
        RiskFlag(severity="High", description="Significant disparate impact detected for Group B.")
    ]
    
    return AnalyzeResponse(
        status="success",
        dataset_summary=dataset_summary,
        model_summary=model_summary,
        group_metrics=group_metrics,
        disparity_summaries=disparity_summaries,
        risk_flags=risk_flags
    )

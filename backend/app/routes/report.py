from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.schemas.response_models import ReportResponse, ReportContent

router = APIRouter(prefix="/report", tags=["Report"])

class ReportRequest(BaseModel):
    analysis_id: str
    include_mitigation: bool = False

@router.post("/", response_model=ReportResponse)
async def generate_report(request: ReportRequest):
    """
    Endpoint to generate a final report using Gemini based on analysis/mitigation results.
    """
    # 1. Validate input
    if not request.analysis_id.strip():
        raise HTTPException(status_code=400, detail="analysis_id cannot be empty")
        
    # 2. Return dummy JSON matching ReportResponse
    # Later, this will call Gemini to generate the text content based on the data.
    
    executive_summary = (
        "This is a dummy executive summary. The dataset showed significant disparate "
        "impact for Group B. "
    )
    
    detailed_findings = (
        "1. Demographic Parity difference was 0.20.\n"
        "2. Disparate Impact ratio was 0.75, which falls below the 0.8 threshold.\n"
    )
    
    if request.include_mitigation:
        executive_summary += "However, applying the reweighing mitigation strategy improved the fairness metrics to acceptable levels."
        detailed_findings += "3. Post-mitigation, Disparate Impact improved to 0.96, successfully resolving the bias."
    else:
        executive_summary += "No mitigation strategies were applied."

    recommendations = [
        "Investigate the data collection process for Group B.",
        "Consider applying reweighing in your production pipeline.",
        "Regularly monitor these metrics as new data comes in."
    ]

    report_content = ReportContent(
        executive_summary=executive_summary,
        detailed_findings=detailed_findings,
        recommendations=recommendations
    )
    
    return ReportResponse(
        status="success",
        report=report_content
    )

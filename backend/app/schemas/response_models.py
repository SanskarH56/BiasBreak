from pydantic import BaseModel
from typing import List, Optional

# ---------------------------------------------------------
# Shared / Common Models
# ---------------------------------------------------------

class GroupMetric(BaseModel):
    group_name: str
    pass_rate: float

class DisparitySummary(BaseModel):
    metric_name: str
    value: float
    is_fair: bool

class DatasetSummary(BaseModel):
    total_records: int
    features_analyzed: List[str]
    sensitive_attribute: str

class ModelSummary(BaseModel):
    overall_accuracy: float
    model_type: str

    model_config = {'protected_namespaces': ()}

class RiskFlag(BaseModel):
    severity: str
    description: str

# ---------------------------------------------------------
# Models for /analyze Endpoint
# ---------------------------------------------------------

class AnalyzeResponse(BaseModel):
    status: str
    dataset_summary: DatasetSummary
    model_summary: ModelSummary
    group_metrics: List[GroupMetric]
    disparity_summaries: List[DisparitySummary]
    risk_flags: List[RiskFlag]

    model_config = {'protected_namespaces': ()}

# ---------------------------------------------------------
# Models for /mitigate Endpoint
# ---------------------------------------------------------

class MetricsBlock(BaseModel):
    disparity_summaries: List[DisparitySummary]
    group_metrics: List[GroupMetric]

class ComparisonSummary(BaseModel):
    before_mitigation: MetricsBlock
    after_mitigation: MetricsBlock

class MitigationResponse(BaseModel):
    status: str
    strategy_used: str
    comparison: ComparisonSummary

# ---------------------------------------------------------
# Models for /report Endpoint
# ---------------------------------------------------------

class ReportContent(BaseModel):
    executive_summary: str
    detailed_findings: str
    recommendations: List[str]

class ReportResponse(BaseModel):
    status: str
    report: ReportContent

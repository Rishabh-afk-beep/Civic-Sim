from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class DatasetInfo(BaseModel):
    resource_id: str
    title: str
    ministry: str
    sector: Optional[str] = None
    data_sample: List[Dict[str, Any]] = []
    total_records: int = 0
    last_updated: str
    description: Optional[str] = None

class BudgetSummary(BaseModel):
    total_ministries: int
    total_allocation: float
    major_sectors: List[str]

class BudgetOverview(BaseModel):
    total_datasets: int
    datasets: List[DatasetInfo]
    summary: BudgetSummary

class TransparencyResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    error: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)

class BudgetOverviewResponse(TransparencyResponse):
    budget_overview: Optional[BudgetOverview] = None
    transparency_score: Optional[float] = None
    data_source: str
    backend_integration: Optional[str] = None

class SpendingDataItem(BaseModel):
    resource_id: str
    title: str
    ministry: str
    sector: Optional[str] = None
    data_preview: List[Dict[str, Any]] = []
    total_records: int = 0
    last_updated: str

class MinistrySpendingResponse(TransparencyResponse):
    ministry: str
    spending_data: List[SpendingDataItem] = []
    data_source: str

class TransparencyMetrics(BaseModel):
    overall_score: float
    component_scores: Dict[str, float]
    ministry_scores: Optional[Dict[str, float]] = None
    sector_analysis: Optional[Dict[str, Dict[str, Any]]] = None
    trends: Optional[Dict[str, Any]] = None
    recommendations: List[str] = []

class TransparencyMetricsResponse(TransparencyResponse):
    metrics: Optional[TransparencyMetrics] = None
    calculation_method: str

class DatasetSearchResult(BaseModel):
    resource_id: str
    title: str
    description: str
    ministry: str
    sector: Optional[str] = None
    last_updated: str
    format: str
    source: str = "data.gov.in"
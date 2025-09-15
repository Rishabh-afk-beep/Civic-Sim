from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional, List, Dict, Any

class DocumentUpload(BaseModel):
    document_type: str
    
    @validator('document_type')
    def validate_document_type(cls, v):
        allowed_types = ['government_announcement', 'budget_document', 'policy_statement', 'procurement_notice']
        if v not in allowed_types:
            raise ValueError(f'Document type must be one of: {allowed_types}')
        return v

class DocumentAnalysis(BaseModel):
    verdict: str  # verified, suspicious, inconclusive
    confidence_score: float
    ai_analysis: str
    suspicious_elements: List[str]
    metadata_check: str
    processing_time: float

class DocumentResponse(BaseModel):
    id: int
    filename: str
    document_type: str
    verdict: Optional[str] = None
    confidence_score: Optional[float] = None
    ai_analysis: Optional[str] = None
    suspicious_elements: Optional[List[str]] = None
    processing_status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class DocumentVerificationResult(BaseModel):
    document_id: int
    filename: str
    verdict: str
    confidence_score: float
    analysis: DocumentAnalysis
    processing_time: str
    timestamp: datetime

class BinaryVerificationRequest(BaseModel):
    text: str
    document_type: str = 'government_document'
    classification_type: str = 'binary'
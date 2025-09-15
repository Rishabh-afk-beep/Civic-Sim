from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class CorruptionPattern(BaseModel):
    """Individual corruption pattern detected"""
    pattern_type: str = Field(..., description="Type of corruption pattern detected")
    severity: str = Field(..., description="Severity level: low, medium, high, critical")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0-1")
    description: str = Field(..., description="Human-readable description of the pattern")
    evidence: List[str] = Field(default=[], description="List of evidence supporting this pattern")
    location: Optional[str] = Field(None, description="Location in document where pattern was found")

class VendorAnalysis(BaseModel):
    """Analysis of vendor concentration and patterns"""
    total_vendors: int = Field(..., description="Total number of vendors mentioned")
    concentrated_vendors: List[str] = Field(default=[], description="Vendors with suspicious concentration")
    concentration_score: float = Field(..., ge=0.0, le=1.0, description="Vendor concentration risk score")
    repeat_winner_patterns: List[str] = Field(default=[], description="Patterns of repeat winners")

class ContractAnalysis(BaseModel):
    """Analysis of contract terms and conditions"""
    suspicious_terms: List[str] = Field(default=[], description="Suspicious contract terms found")
    missing_clauses: List[str] = Field(default=[], description="Important clauses that are missing")
    unusual_conditions: List[str] = Field(default=[], description="Unusual contract conditions")
    transparency_score: float = Field(..., ge=0.0, le=1.0, description="Contract transparency score")

class ComplianceCheck(BaseModel):
    """Compliance with procurement regulations"""
    missing_documents: List[str] = Field(default=[], description="Required documents that are missing")
    procedural_violations: List[str] = Field(default=[], description="Procedural violations detected")
    regulatory_compliance: float = Field(..., ge=0.0, le=1.0, description="Overall compliance score")
    government_guidelines_followed: bool = Field(..., description="Whether government guidelines are followed")

class CorruptionRiskAssessment(BaseModel):
    """Overall corruption risk assessment"""
    overall_risk_level: str = Field(..., description="Overall risk: low, medium, high, critical")
    risk_score: float = Field(..., ge=0.0, le=1.0, description="Overall risk score between 0-1")
    primary_concerns: List[str] = Field(default=[], description="Primary corruption concerns identified")
    recommendations: List[str] = Field(default=[], description="Recommendations to mitigate risks")

class DataGovCrossReference(BaseModel):
    """Cross-reference with data.gov.in databases"""
    vendor_history_checked: bool = Field(default=False, description="Whether vendor history was checked")
    blacklisted_entities: List[str] = Field(default=[], description="Any blacklisted entities found")
    historical_patterns: List[str] = Field(default=[], description="Historical patterns from government data")
    data_sources_used: List[str] = Field(default=[], description="Government data sources consulted")

class CorruptionAnalysisResponse(BaseModel):
    """Complete corruption analysis response"""
    success: bool = Field(..., description="Whether analysis was successful")
    document_id: Optional[str] = Field(None, description="Document identifier")
    analysis_timestamp: datetime = Field(default_factory=datetime.now, description="When analysis was performed")
    
    # Core Analysis Results
    patterns_detected: List[CorruptionPattern] = Field(default=[], description="Corruption patterns found")
    vendor_analysis: Optional[VendorAnalysis] = Field(None, description="Vendor concentration analysis")
    contract_analysis: Optional[ContractAnalysis] = Field(None, description="Contract terms analysis")
    compliance_check: Optional[ComplianceCheck] = Field(None, description="Regulatory compliance check")
    
    # Risk Assessment
    risk_assessment: CorruptionRiskAssessment = Field(..., description="Overall risk assessment")
    
    # External Data
    datagovindia_cross_reference: Optional[DataGovCrossReference] = Field(None, description="Government data cross-reference")
    
    # Additional Information
    document_type: str = Field(..., description="Type of document analyzed")
    analysis_method: str = Field(default="AI-powered pattern detection", description="Method used for analysis")
    confidence_level: float = Field(..., ge=0.0, le=1.0, description="Overall confidence in analysis")
    
    # Error Handling
    error_message: Optional[str] = Field(None, description="Error message if analysis failed")
    warnings: List[str] = Field(default=[], description="Any warnings during analysis")
    
    # Summary
    executive_summary: str = Field(..., description="Executive summary of findings")
    key_findings: List[str] = Field(default=[], description="Key findings from the analysis")

class CorruptionAnalysisRequest(BaseModel):
    """Request model for corruption analysis"""
    document_text: str = Field(..., description="Text content of the document to analyze")
    document_type: str = Field(..., description="Type of document (contract, tender, etc.)")
    analysis_depth: str = Field(default="standard", description="Analysis depth: basic, standard, comprehensive")
    include_datagovindia_check: bool = Field(default=True, description="Whether to cross-reference with data.gov.in")
    
class CorruptionPatternSummary(BaseModel):
    """Summary of corruption patterns for dashboard display"""
    total_patterns: int = Field(..., description="Total number of patterns detected")
    high_risk_patterns: int = Field(..., description="Number of high-risk patterns")
    pattern_categories: Dict[str, int] = Field(default={}, description="Count by pattern category")
    overall_score: float = Field(..., ge=0.0, le=1.0, description="Overall corruption risk score")
    status: str = Field(..., description="Status: clean, low_risk, medium_risk, high_risk")
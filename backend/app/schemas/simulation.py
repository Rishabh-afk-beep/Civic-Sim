from pydantic import BaseModel, validator
from datetime import datetime
from typing import Dict, Any, List, Optional

class SimulationParameters(BaseModel):
    subsidy_increase_percent: Optional[float] = 0
    budget_allocation_percent: Optional[float] = 10
    beneficiary_expansion_percent: Optional[float] = 0
    
    @validator('*', pre=True)
    def validate_percentages(cls, v):
        if isinstance(v, (int, float)) and (v < 0 or v > 100):
            raise ValueError('Percentage values must be between 0 and 100')
        return v

class SimulationRequest(BaseModel):
    scenario_name: str
    parameters: SimulationParameters
    
    @validator('scenario_name')
    def validate_scenario(cls, v):
        allowed_scenarios = [
            'education_subsidy_increase',
            'healthcare_infrastructure_expansion', 
            'agricultural_support_program',
            'social_welfare_enhancement',
            'infrastructure_development'
        ]
        if v not in allowed_scenarios:
            raise ValueError(f'Scenario must be one of: {allowed_scenarios}')
        return v

class SimulationOutcome(BaseModel):
    beneficiaries_gained: int
    budget_deficit_increase: float
    implementation_cost: int
    roi_years: float
    sector_impact_score: float

class SimulationResult(BaseModel):
    scenario_name: str
    predicted_outcomes: SimulationOutcome
    ai_explanation: str
    confidence_level: str
    assumptions: List[str]
    simulation_version: str = "1.0"

class SimulationResponse(BaseModel):
    id: int
    scenario_name: str
    parameters: Dict[str, Any]
    predicted_outcomes: Dict[str, Any]
    ai_explanation: str
    confidence_level: str
    processing_time: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
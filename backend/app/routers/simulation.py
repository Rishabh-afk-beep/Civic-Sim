from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import time
import logging

from app.database import get_database
from app.models.user import User
from app.models.simulation import PolicySimulation
from app.schemas.simulation import SimulationRequest, SimulationResponse, SimulationResult
from app.services.auth_service import get_current_user
from app.services.simulation_engine import simulation_engine
from app.services.ai_service import ai_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/run", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def run_policy_simulation(
    simulation_request: SimulationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_database)
):
    """Run a policy impact simulation"""
    start_time = time.time()
    
    try:
        # Run the simulation
        outcomes = simulation_engine.run_simulation(
            simulation_request.scenario_name, 
            simulation_request.parameters
        )
        
        # Get AI explanation
        ai_explanation = await ai_service.explain_policy_simulation(
            simulation_request.scenario_name,
            simulation_request.parameters.dict(),
            outcomes
        )
        
        # Get simulation assumptions
        assumptions = simulation_engine.get_simulation_assumptions(simulation_request.scenario_name)
        
        processing_time = time.time() - start_time
        
        # Save simulation to database
        simulation_record = PolicySimulation(
            user_id=current_user.id,
            scenario_name=simulation_request.scenario_name,
            parameters=simulation_request.parameters.dict(),
            predicted_outcomes=outcomes,
            ai_explanation=ai_explanation,
            confidence_level="medium",
            assumptions=assumptions,
            processing_time=processing_time
        )
        
        db.add(simulation_record)
        db.commit()
        db.refresh(simulation_record)
        
        return {
            "status": "success",
            "simulation_id": simulation_record.id,
            "results": {
                "scenario_name": simulation_request.scenario_name,
                "predicted_outcomes": outcomes,
                "ai_explanation": ai_explanation,
                "confidence_level": "medium",
                "assumptions": assumptions,
                "processing_time": f"{processing_time:.2f}s",
                "disclaimer": "These are simplified projections for educational purposes. Real-world outcomes may vary significantly."
            }
        }
        
    except Exception as e:
        logger.error(f"Simulation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Simulation failed. Please try again."
        )

@router.get("/scenarios")
async def get_available_scenarios() -> Dict[str, Any]:
    """Get list of available simulation scenarios"""
    scenarios = [
        {
            "name": "education_subsidy_increase",
            "display_name": "Education Subsidy Increase",
            "description": "Analyze the impact of increasing education subsidies on literacy rates, beneficiaries, and budget",
            "parameters": [
                {"name": "subsidy_increase_percent", "type": "slider", "min": 0, "max": 50, "default": 25},
                {"name": "budget_allocation_percent", "type": "slider", "min": 5, "max": 30, "default": 15},
                {"name": "beneficiary_expansion_percent", "type": "slider", "min": 0, "max": 50, "default": 30}
            ],
            "outcomes": ["beneficiaries_gained", "literacy_improvement", "implementation_cost", "roi_years"]
        },
        {
            "name": "healthcare_infrastructure_expansion", 
            "display_name": "Healthcare Infrastructure Expansion",
            "description": "Simulate expansion of healthcare facilities and analyze impact on access and employment",
            "parameters": [
                {"name": "budget_allocation_percent", "type": "slider", "min": 5, "max": 25, "default": 15}
            ],
            "outcomes": ["new_hospitals", "new_clinics", "jobs_created", "improved_access_percent"]
        },
        {
            "name": "agricultural_support_program",
            "display_name": "Agricultural Support Program", 
            "description": "Evaluate agricultural subsidies impact on farmers, crop yields, and food security",
            "parameters": [
                {"name": "subsidy_increase_percent", "type": "slider", "min": 0, "max": 40, "default": 20},
                {"name": "budget_allocation_percent", "type": "slider", "min": 5, "max": 20, "default": 12}
            ],
            "outcomes": ["farmers_benefited", "crop_yield_increase_percent", "food_security_improvement_percent"]
        }
    ]
    
    return {
        "status": "success",
        "scenarios": scenarios,
        "disclaimer": "Simulations are educational tools with simplified models. Consult experts for policy decisions."
    }

@router.get("/history", response_model=List[SimulationResponse])
async def get_simulation_history(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_database)
):
    """Get user's simulation history"""
    simulations = db.query(PolicySimulation).filter(
        PolicySimulation.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return simulations

@router.get("/{simulation_id}", response_model=SimulationResponse)
async def get_simulation(
    simulation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_database)
):
    """Get specific simulation details"""
    simulation = db.query(PolicySimulation).filter(
        PolicySimulation.id == simulation_id,
        PolicySimulation.user_id == current_user.id
    ).first()
    
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )
    
    return simulation

@router.delete("/{simulation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_simulation(
    simulation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_database)
):
    """Delete a simulation"""
    simulation = db.query(PolicySimulation).filter(
        PolicySimulation.id == simulation_id,
        PolicySimulation.user_id == current_user.id
    ).first()
    
    if not simulation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )
    
    db.delete(simulation)
    db.commit()
    
    return None
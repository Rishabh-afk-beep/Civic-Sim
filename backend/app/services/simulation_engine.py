import math
from typing import Dict, Any, List
import logging
from app.schemas.simulation import SimulationParameters

logger = logging.getLogger(__name__)

class PolicySimulationEngine:
    """Engine for running policy impact simulations"""
    
    @staticmethod
    def simulate_education_subsidy_increase(params: SimulationParameters) -> Dict[str, Any]:
        """Simulate education subsidy increase policy"""
        try:
            # Base values (simplified model)
            base_beneficiaries = 10000000
            base_literacy_rate = 74.0
            base_budget = 50000000000  # 50B
            
            # Calculate impacts based on parameters
            subsidy_multiplier = 1 + (params.subsidy_increase_percent / 100)
            budget_multiplier = 1 + (params.budget_allocation_percent / 100)
            expansion_multiplier = 1 + (params.beneficiary_expansion_percent / 100)
            
            # Projected outcomes
            new_beneficiaries = int(base_beneficiaries * expansion_multiplier * 0.3)
            implementation_cost = int(base_budget * budget_multiplier * subsidy_multiplier * 0.15)
            literacy_improvement = min(params.subsidy_increase_percent * 0.5, 25.0)  # Cap at 25%
            roi_years = max(3.0, 8.0 - (params.budget_allocation_percent / 10))
            budget_deficit_increase = params.budget_allocation_percent * 0.6
            
            return {
                "beneficiaries_gained": new_beneficiaries,
                "budget_deficit_increase": round(budget_deficit_increase, 2),
                "implementation_cost": implementation_cost,
                "literacy_improvement": round(literacy_improvement, 2),
                "roi_years": round(roi_years, 1),
                "sector_impact_score": round(min(95.0, 60 + params.subsidy_increase_percent * 0.8), 1)
            }
            
        except Exception as e:
            logger.error(f"Education simulation failed: {e}")
            return PolicySimulationEngine._get_default_outcomes()
    
    @staticmethod
    def simulate_healthcare_infrastructure_expansion(params: SimulationParameters) -> Dict[str, Any]:
        """Simulate healthcare infrastructure expansion"""
        try:
            # Base calculations for healthcare expansion
            budget_allocation = params.budget_allocation_percent
            
            new_hospitals = int(budget_allocation * 8)  # 8 hospitals per % of budget
            new_clinics = int(budget_allocation * 25)   # 25 clinics per % of budget
            jobs_created = int((new_hospitals * 150) + (new_clinics * 25))
            improved_access_percent = min(budget_allocation * 1.2, 30.0)
            implementation_cost = int(budget_allocation * 2500000000)  # 2.5B per %
            roi_years = max(5.0, 12.0 - (budget_allocation / 5))
            
            return {
                "new_hospitals": new_hospitals,
                "new_clinics": new_clinics,
                "jobs_created": jobs_created,
                "improved_access_percent": round(improved_access_percent, 1),
                "implementation_cost": implementation_cost,
                "roi_years": round(roi_years, 1),
                "sector_impact_score": round(min(90.0, 50 + budget_allocation * 1.5), 1)
            }
            
        except Exception as e:
            logger.error(f"Healthcare simulation failed: {e}")
            return PolicySimulationEngine._get_default_outcomes()
    
    @staticmethod
    def simulate_agricultural_support_program(params: SimulationParameters) -> Dict[str, Any]:
        """Simulate agricultural support program"""
        try:
            subsidy_increase = params.subsidy_increase_percent
            budget_allocation = params.budget_allocation_percent
            
            farmers_benefited = int(budget_allocation * 50000)  # 50k farmers per %
            crop_yield_increase = min(subsidy_increase * 0.8, 40.0)
            food_security_improvement = min(budget_allocation * 0.6, 20.0)
            implementation_cost = int(budget_allocation * 1800000000)  # 1.8B per %
            roi_years = max(2.0, 6.0 - (subsidy_increase / 15))
            
            return {
                "farmers_benefited": farmers_benefited,
                "crop_yield_increase_percent": round(crop_yield_increase, 1),
                "food_security_improvement_percent": round(food_security_improvement, 1),
                "implementation_cost": implementation_cost,
                "roi_years": round(roi_years, 1),
                "sector_impact_score": round(min(85.0, 55 + subsidy_increase * 0.9), 1)
            }
            
        except Exception as e:
            logger.error(f"Agriculture simulation failed: {e}")
            return PolicySimulationEngine._get_default_outcomes()
    
    @staticmethod
    def _get_default_outcomes() -> Dict[str, Any]:
        """Default outcomes when simulation fails"""
        return {
            "error": "Simulation calculation failed",
            "beneficiaries_gained": 0,
            "implementation_cost": 0,
            "roi_years": 0.0,
            "sector_impact_score": 0.0
        }
    
    @staticmethod
    def run_simulation(scenario_name: str, parameters: SimulationParameters) -> Dict[str, Any]:
        """Run simulation based on scenario name"""
        simulation_map = {
            "education_subsidy_increase": PolicySimulationEngine.simulate_education_subsidy_increase,
            "healthcare_infrastructure_expansion": PolicySimulationEngine.simulate_healthcare_infrastructure_expansion,
            "agricultural_support_program": PolicySimulationEngine.simulate_agricultural_support_program,
        }
        
        simulation_func = simulation_map.get(scenario_name)
        if not simulation_func:
            logger.error(f"Unknown simulation scenario: {scenario_name}")
            return PolicySimulationEngine._get_default_outcomes()
        
        return simulation_func(parameters)
    
    @staticmethod
    def get_simulation_assumptions(scenario_name: str) -> List[str]:
        """Get assumptions for each simulation type"""
        assumptions_map = {
            "education_subsidy_increase": [
                "Current enrollment trends continue",
                "Infrastructure capacity can support expansion", 
                "Teacher recruitment meets demand",
                "No major economic disruptions",
                "Policy implementation is effective"
            ],
            "healthcare_infrastructure_expansion": [
                "Healthcare worker availability scales with infrastructure",
                "Land acquisition costs remain stable",
                "No major regulatory changes",
                "Population health trends continue",
                "Equipment and technology costs remain predictable"
            ],
            "agricultural_support_program": [
                "Weather patterns remain within normal ranges",
                "Market prices for crops remain stable",
                "Farmer adoption rates meet expectations",
                "No major pest or disease outbreaks",
                "Distribution systems function effectively"
            ]
        }
        
        return assumptions_map.get(scenario_name, ["General economic assumptions apply"])

# Initialize simulation engine
simulation_engine = PolicySimulationEngine()
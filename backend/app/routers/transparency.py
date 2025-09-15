from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from app.services.datagovindia_service import DataGovIndiaService
from app.services.transparency_service import TransparencyService
from app.schemas.transparency import (
    TransparencyResponse,
    BudgetOverviewResponse,
    MinistrySpendingResponse,
    TransparencyMetricsResponse
)

router = APIRouter(prefix="/api/transparency", tags=["transparency"])

# Initialize services
datagovindia_service = DataGovIndiaService()
transparency_service = TransparencyService()

@router.get("/test-connection")
async def test_connection():
    """Test connection to data.gov.in API"""
    try:
        result = await datagovindia_service.test_connection()
        return {
            "success": True,
            "message": "DataGovIndia API is accessible",
            "datagovindia_available": result,
            "backend": "FastAPI CivicSim Backend"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "backend": "FastAPI CivicSim Backend"
        }

@router.get("/budget-overview", response_model=BudgetOverviewResponse)
async def get_budget_overview():
    """Get government budget overview from real data.gov.in APIs"""
    try:
        # Get budget data using datagovindia service
        budget_data = await datagovindia_service.get_budget_data()
        
        # Calculate transparency score
        transparency_score = transparency_service.calculate_transparency_score(budget_data)
        
        return {
            "success": True,
            "budget_overview": budget_data,
            "transparency_score": transparency_score,
            "data_source": "data.gov.in via CivicSim FastAPI",
            "backend_integration": "FastAPI + DataGovIndia"
        }
    except Exception as e:
        # Return fallback data on error
        fallback_data = datagovindia_service.get_fallback_budget_data()
        return {
            "success": True,
            "budget_overview": fallback_data,
            "transparency_score": 75.5,
            "data_source": "Fallback data (API error)",
            "error": str(e),
            "backend_integration": "FastAPI + DataGovIndia"
        }

@router.get("/ministry-spending", response_model=MinistrySpendingResponse)
async def get_ministry_spending(
    ministry: str = Query("all", description="Ministry name or 'all' for all ministries")
):
    """Get ministry-wise government spending data"""
    try:
        spending_data = await datagovindia_service.get_ministry_spending(ministry)
        
        return {
            "success": True,
            "ministry": ministry,
            "spending_data": spending_data,
            "data_source": "data.gov.in"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail={
            "success": False,
            "error": str(e),
            "ministry": ministry
        })

@router.get("/search-datasets")
async def search_datasets(
    query: str = Query("budget", description="Search query for datasets"),
    limit: int = Query(10, description="Maximum number of results", le=50)
):
    """Search available government datasets"""
    try:
        results = await datagovindia_service.search_datasets(query, limit)
        
        return {
            "success": True,
            "query": query,
            "total_found": len(results),
            "datasets": results,
            "data_source": "data.gov.in search"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail={
            "success": False,
            "error": str(e),
            "query": query
        })

@router.get("/transparency-metrics", response_model=TransparencyMetricsResponse)
async def get_transparency_metrics():
    """Get comprehensive transparency metrics"""
    try:
        metrics = transparency_service.calculate_comprehensive_metrics()
        
        return {
            "success": True,
            "metrics": metrics,
            "calculation_method": "CivicSim Transparency Algorithm"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail={
            "success": False,
            "error": str(e)
        })

@router.get("/ministries")
async def get_major_ministries():
    """Get list of major Indian government ministries"""
    return {
        "success": True,
        "ministries": datagovindia_service.get_major_ministries()
    }
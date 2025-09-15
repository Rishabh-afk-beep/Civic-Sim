import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

try:
    # Import the FastAPI app from backend
    from app.main import app
    
    # Export the app for Vercel
    # Vercel will use this as the ASGI application
    application = app
    
except ImportError as e:
    print(f"Error importing FastAPI app: {e}")
    # Fallback simple app for debugging
    from fastapi import FastAPI
    application = FastAPI()
    
    @application.get("/")
    async def root():
        return {"message": "CivicSim API - Import Error", "error": str(e)}

# Legacy handler function (kept for compatibility)
def handler(request):
    return application(request)
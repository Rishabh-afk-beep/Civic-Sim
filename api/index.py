import sys
import os
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

# Import the FastAPI app from backend
from app.main import app

# This is the handler that Vercel will use
def handler(request):
    return app(request)
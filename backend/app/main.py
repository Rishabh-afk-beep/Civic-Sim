from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
from datetime import datetime
import logging

from app.routers import transparency
from app.config import get_settings
from app.database import create_tables
from app.routers import auth, documents, dashboard, simulation, feedback
from app.routers.documents_test import router as documents_test_router
from app.utils.exceptions import CivicSimException

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

# CORS origins
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    try:
        create_tables()  # Remove await since it's synchronous
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.exception(f"Failed to initialize database: {e}")
    yield

app = FastAPI(title="Civic-Sim API", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with correct prefixes
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(documents.router, prefix="/documents", tags=["documents"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
app.include_router(simulation.router, prefix="/simulation", tags=["simulation"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
app.include_router(documents_test_router, prefix="/documents", tags=["documents-test"])
app.include_router(transparency.router)

# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

# Add WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket):
    from fastapi import WebSocket, WebSocketDisconnect
    import json
    
    await websocket.accept()
    logger.info("WebSocket connection established")
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data) if data else {}
            logger.info(f"Received WebSocket message: {message}")
            
            response = {
                "type": "echo",
                "message": f"Server received: {data}",
                "timestamp": datetime.utcnow().isoformat()
            }
            await websocket.send_text(json.dumps(response))
    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close()

# Exception handlers
@app.exception_handler(CivicSimException)
async def civic_ex_handler(request: Request, exc: CivicSimException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})

@app.exception_handler(RequestValidationError)
async def validation_ex_handler(request: Request, exc: RequestValidationError):
    # Make validation errors JSON serializable
    errors = []
    for error in exc.errors():
        clean_error = {
            "type": error.get("type"),
            "loc": error.get("loc"),
            "msg": error.get("msg"),
            "input": str(error.get("input")) if error.get("input") is not None else None
        }
        if "ctx" in error and isinstance(error["ctx"], dict):
            clean_error["ctx"] = {k: str(v) for k, v in error["ctx"].items()}
        errors.append(clean_error)
    
    return JSONResponse(status_code=422, content={"detail": errors})

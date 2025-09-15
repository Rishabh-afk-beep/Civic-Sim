from fastapi import APIRouter, HTTPException, File, Form, UploadFile
from datetime import datetime
import logging

# Create router without auth dependency
router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/verify-test")
async def verify_document_test(
    file: UploadFile = File(...),
    document_type: str = Form(...)
):
    """Test endpoint for document verification without authentication"""
    try:
        logger.info(f"Received file: {file.filename}, type: {document_type}")

        # Read file content
        file_bytes = await file.read()
        content_text = file_bytes.decode("utf-8", errors="ignore")

        # Try AI service; fall back to mock result
        try:
            from app.services.ai_service import ai_service
            result = await ai_service.analyze_document_authenticity(content_text, document_type)
        except Exception as e:
            logger.warning(f"AI service failed, using mock: {e}")
            # Mock response based on content
            verdict = "verified" if any(k in content_text.lower() for k in ["official", "government", "ministry"]) else "suspicious"
            result = {
                "verdict": verdict,
                "confidence_score": 85.5 if verdict == "verified" else 45.0,
                "explanation": f"Mock analysis: Document appears {'legitimate' if verdict == 'verified' else 'suspicious'} based on basic pattern matching. This is a fallback response when AI service is unavailable.",
                "suspicious_elements": [] if verdict == "verified" else ["Informal language detected", "Missing official headers"],
                "authenticity_indicators": ["Contains official terminology"] if verdict == "verified" else [],
                "recommendations": "Manual review recommended for final verification."
            }

        return {
            "document_id": f"doc_{int(datetime.utcnow().timestamp())}",
            "filename": file.filename,
            "document_type": document_type,
            "results": result,
            "processing_time": "~1s",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
    except Exception as e:
        logger.exception("Document verification failed")
        raise HTTPException(status_code=500, detail=f"Document analysis failed: {str(e)}")
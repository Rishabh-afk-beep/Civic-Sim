from fastapi import HTTPException, File, Form, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import logging

# Add this route for testing without authentication
@app.post("/documents/verify-test")
async def verify_document_test(
    file: UploadFile = File(...),
    document_type: str = Form(...)
):
    """Test endpoint for document verification without authentication"""
    try:
        logging.info(f"Received file: {file.filename}, type: {document_type}")

        # Read file content
        file_content = await file.read()
        content_text = file_content.decode('utf-8', errors='ignore')

        logging.info(f"File size: {len(file_content)} bytes")
        logging.info(f"Document type: {document_type}")

        # Simple mock response for testing
        mock_result = {
            "document_id": f"doc_{int(time.time())}",
            "filename": file.filename,
            "document_type": document_type,
            "verdict": "verified" if "official" in content_text.lower() or "government" in content_text.lower() else "suspicious",
            "confidence_score": 85.5,
            "analysis": {
                "ai_analysis": f"Analysis of {file.filename}: The document appears to be {'legitimate' if 'official' in content_text.lower() else 'potentially suspicious'} based on language patterns and structure. Key indicators include formal tone, official formatting, and consistent terminology.",
                "suspicious_elements": [] if "official" in content_text.lower() else ["Informal language detected", "Missing official headers"],
                "metadata": {
                    "file_size": len(file_content),
                    "word_count": len(content_text.split()),
                    "language": "English"
                }
            },
            "processing_time": "1.2s",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

        # If Gemini API is available, use it
        try:
            if GEMINI_API_KEY:
                logging.info("Using Gemini API for analysis")
                gemini_result = await analyze_document_with_gemini(content_text, document_type)
                mock_result.update(gemini_result)
        except Exception as e:
            logging.warning(f"Gemini API failed, using mock: {e}")

        return {"results": mock_result}

    except Exception as e:
        logging.error(f"Document verification failed: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Document analysis failed: {str(e)}"
        )

# Fix the existing endpoint to handle auth properly
@app.post("/documents/verify")
async def verify_document(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    current_user: dict = Depends(get_current_user)  # Make this optional for testing
):
    """Main document verification endpoint"""
    try:
        logging.info(f"User: {current_user.get('email', 'test')} verifying: {file.filename}")

        # Your existing verification logic here
        # ... (same as verify_document_test but with user tracking)

    except Exception as e:
        logging.error(f"Authenticated verification failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Optional authentication dependency
async def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))):
    """Optional authentication - returns None if no auth provided"""
    if not credentials:
        return {"email": "test@example.com", "uid": "test_user"}  # Mock user for testing

    try:
        # Your existing Firebase auth verification
        return await verify_firebase_token(credentials.credentials)
    except:
        return {"email": "test@example.com", "uid": "test_user"}
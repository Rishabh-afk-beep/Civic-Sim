import pdfplumber
import PyPDF2
from typing import Dict, Any, Optional
import magic
import logging
from fastapi import UploadFile
from app.config import get_settings
from app.utils.exceptions import DocumentProcessingException

settings = get_settings()
logger = logging.getLogger(__name__)

class DocumentProcessor:
    """Handle document upload and text extraction"""
    
    @staticmethod
    def validate_file(file: UploadFile) -> bool:
        """Validate uploaded file"""
        # Check file size
        if file.size and file.size > settings.MAX_FILE_SIZE:
            raise DocumentProcessingException(
                f"File size ({file.size} bytes) exceeds maximum limit ({settings.MAX_FILE_SIZE} bytes)",
                status_code=413
            )
        
        # Check file type
        if file.content_type not in settings.ALLOWED_FILE_TYPES:
            raise DocumentProcessingException(
                f"Invalid file type '{file.content_type}'. Allowed types: {settings.ALLOWED_FILE_TYPES}",
                status_code=400
            )
        
        return True
    
    @staticmethod
    async def extract_text_from_pdf(file: UploadFile) -> str:
        """Extract text from PDF file"""
        try:
            # Reset file pointer
            await file.seek(0)
            content = await file.read()
            
            # Try pdfplumber first (better for complex layouts)
            try:
                import io
                text_content = ""
                with pdfplumber.open(io.BytesIO(content)) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text_content += page_text + "\\n"
                
                if text_content.strip():
                    return text_content
                    
            except Exception as e:
                logger.warning(f"pdfplumber failed, trying PyPDF2: {e}")
            
            # Fallback to PyPDF2
            try:
                import io
                text_content = ""
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
                
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_content += page_text + "\\n"
                
                return text_content
                
            except Exception as e:
                logger.error(f"PyPDF2 also failed: {e}")
                raise DocumentProcessingException("Unable to extract text from PDF")
                
        except Exception as e:
            logger.error(f"PDF text extraction failed: {e}")
            raise DocumentProcessingException(f"PDF processing failed: {str(e)}")
    
    @staticmethod
    async def extract_text_from_file(file: UploadFile) -> str:
        """Extract text content from uploaded file"""
        try:
            DocumentProcessor.validate_file(file)
            
            if file.content_type == "application/pdf":
                return await DocumentProcessor.extract_text_from_pdf(file)
            
            elif file.content_type == "text/plain":
                await file.seek(0)
                content = await file.read()
                return content.decode('utf-8')
            
            elif file.content_type in ["image/jpeg", "image/png"]:
                # For images, we'd need OCR - placeholder for now
                return "[IMAGE CONTENT - OCR PROCESSING NEEDED]"
            
            else:
                raise DocumentProcessingException(f"Unsupported file type: {file.content_type}")
                
        except Exception as e:
            if isinstance(e, DocumentProcessingException):
                raise
            logger.error(f"File processing failed: {e}")
            raise DocumentProcessingException(f"File processing failed: {str(e)}")
    
    @staticmethod
    def get_file_metadata(file: UploadFile) -> Dict[str, Any]:
        """Extract file metadata"""
        return {
            "filename": file.filename,
            "content_type": file.content_type,
            "size": file.size,
            "headers": dict(file.headers) if file.headers else {}
        }

# Initialize processor instance
document_processor = DocumentProcessor()
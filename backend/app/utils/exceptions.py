from fastapi import HTTPException

class CivicSimException(Exception):
    """Base exception for CivicSim application"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class DocumentProcessingException(CivicSimException):
    """Exception for document processing errors"""
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message, status_code)

class AIServiceException(CivicSimException):
    """Exception for AI service errors"""
    def __init__(self, message: str, status_code: int = 503):
        super().__init__(message, status_code)

class AuthenticationException(CivicSimException):
    """Exception for authentication errors"""
    def __init__(self, message: str, status_code: int = 401):
        super().__init__(message, status_code)

class ValidationException(CivicSimException):
    """Exception for validation errors"""
    def __init__(self, message: str, status_code: int = 422):
        super().__init__(message, status_code)
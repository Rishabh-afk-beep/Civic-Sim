from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "sqlite:///./civicsim.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Frontend Config
    REACT_APP_API_BASE_URL: str = "http://127.0.0.1:8000"  # <-- add this
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "https://civicsim.vercel.app"]
    
    # External APIs
    GEMINI_API_KEY: str = ""
    FIREBASE_CREDENTIALS_PATH: str = ""
    DATAGOVINDIA_API_KEY: str = ""
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = ["application/pdf", "text/plain", "image/jpeg", "image/png"]
    UPLOAD_DIRECTORY: str = "./uploads"
    
    # AI Service
    GEMINI_MODEL: str = "gemini-1.5-flash"
    AI_TIMEOUT: int = 30
    AI_PROVIDER: str = "gemini"


    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


    
def get_settings() -> Settings:
    return Settings()
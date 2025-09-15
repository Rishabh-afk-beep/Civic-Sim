from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional

class FeedbackCreate(BaseModel):
    feedback_type: str
    subject: str
    message: str
    rating: Optional[float] = None
    page_url: Optional[str] = None
    
    @validator('feedback_type')
    def validate_feedback_type(cls, v):
        allowed_types = ['bug', 'feature', 'general', 'rating', 'improvement']
        if v not in allowed_types:
            raise ValueError(f'Feedback type must be one of: {allowed_types}')
        return v
    
    @validator('rating')
    def validate_rating(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError('Rating must be between 1 and 5')
        return v

class FeedbackResponse(BaseModel):
    id: int
    feedback_type: str
    subject: str
    message: str
    rating: Optional[float] = None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class FeedbackUpdate(BaseModel):
    status: Optional[str] = None
    admin_response: Optional[str] = None
    
    @validator('status')
    def validate_status(cls, v):
        if v is not None:
            allowed_statuses = ['open', 'in_progress', 'resolved', 'closed']
            if v not in allowed_statuses:
                raise ValueError(f'Status must be one of: {allowed_statuses}')
        return v
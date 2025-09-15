from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import logging

from app.database import get_database
from app.models.user import User
from app.models.feedback import Feedback
from app.schemas.feedback import FeedbackCreate, FeedbackResponse, FeedbackUpdate
from app.services.auth_service import get_current_user, get_current_user_optional

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/submit", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    feedback_data: FeedbackCreate,
    request: Request,
    db: Session = Depends(get_database),
    current_user: User = Depends(get_current_user_optional)
):
    """Submit user feedback"""
    try:
        # Create feedback record
        feedback = Feedback(
            user_id=current_user.id if current_user else None,
            feedback_type=feedback_data.feedback_type,
            subject=feedback_data.subject,
            message=feedback_data.message,
            rating=feedback_data.rating,
            page_url=feedback_data.page_url,
            user_agent=request.headers.get("user-agent"),
            status="open"
        )
        
        db.add(feedback)
        db.commit()
        db.refresh(feedback)
        
        logger.info(f"New feedback submitted: {feedback.feedback_type} - {feedback.subject}")
        
        return feedback
        
    except Exception as e:
        logger.error(f"Feedback submission failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit feedback"
        )

@router.get("/my-feedback", response_model=List[FeedbackResponse])
async def get_my_feedback(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_database)
):
    """Get current user's feedback history"""
    feedback_list = db.query(Feedback).filter(
        Feedback.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return feedback_list

@router.get("/reports", response_model=Dict[str, Any])
async def get_feedback_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_database)
):
    """Get feedback analytics (admin only)"""
    # Check if user has admin role
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    try:
        # Get feedback statistics
        total_feedback = db.query(Feedback).count()
        feedback_by_type = db.query(Feedback.feedback_type, db.func.count(Feedback.id)).group_by(Feedback.feedback_type).all()
        feedback_by_status = db.query(Feedback.status, db.func.count(Feedback.id)).group_by(Feedback.status).all()
        
        # Calculate average rating
        avg_rating = db.query(db.func.avg(Feedback.rating)).filter(Feedback.rating.isnot(None)).scalar()
        
        # Recent feedback
        recent_feedback = db.query(Feedback).order_by(Feedback.created_at.desc()).limit(10).all()
        
        return {
            "status": "success",
            "data": {
                "total_feedback": total_feedback,
                "average_rating": round(avg_rating, 2) if avg_rating else None,
                "feedback_by_type": dict(feedback_by_type),
                "feedback_by_status": dict(feedback_by_status),
                "recent_feedback": [
                    {
                        "id": f.id,
                        "type": f.feedback_type,
                        "subject": f.subject,
                        "rating": f.rating,
                        "status": f.status,
                        "created_at": f.created_at
                    }
                    for f in recent_feedback
                ]
            }
        }
        
    except Exception as e:
        logger.error(f"Feedback reports failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate feedback reports"
        )

@router.put("/{feedback_id}", response_model=FeedbackResponse)
async def update_feedback_status(
    feedback_id: int,
    feedback_update: FeedbackUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_database)
):
    """Update feedback status (admin only)"""
    # Check if user has admin role
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    try:
        for field, value in feedback_update.dict(exclude_unset=True).items():
            setattr(feedback, field, value)
        
        db.commit()
        db.refresh(feedback)
        
        return feedback
        
    except Exception as e:
        logger.error(f"Feedback update failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update feedback"
        )
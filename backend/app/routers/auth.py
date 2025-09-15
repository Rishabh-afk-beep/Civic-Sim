from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_database
from app.models.user import User
from app.schemas.user import UserCreate, User as UserSchema, UserUpdate
from app.services.auth_service import verify_firebase_token, get_current_user
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_database)
):
    """Register a new user with Firebase UID"""
    try:
        existing_user = db.query(User).filter(User.firebase_uid == user_data.firebase_uid).first()
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already registered")

        existing_email = db.query(User).filter(User.email == user_data.email).first()
        if existing_email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already in use")

        db_user = User(**user_data.dict())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        logger.info(f"New user registered: {db_user.email}")
        return db_user

    except Exception as e:
        logger.error(f"User registration failed: {e}")
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Registration failed")


@router.get("/me", response_model=UserSchema)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user


@router.put("/me", response_model=UserSchema)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_database)
):
    """Update current user information"""
    try:
        for field, value in user_update.dict(exclude_unset=True).items():
            setattr(current_user, field, value)

        db.commit()
        db.refresh(current_user)
        return current_user

    except Exception as e:
        logger.error(f"User update failed: {e}")
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Update failed")


@router.post("/logout")
async def logout_user():
    """Logout user (client-side token removal)"""
    return {"message": "Logout successful"}


# 👇 Export this at the end so main.py can include it
auth_router = router

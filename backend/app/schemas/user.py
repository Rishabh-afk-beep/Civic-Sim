from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    display_name: Optional[str] = None
    role: str = "citizen"

class UserCreate(UserBase):
    firebase_uid: str

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    role: Optional[str] = None

class User(UserBase):
    id: int
    firebase_uid: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
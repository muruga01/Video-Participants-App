from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class ParticipantBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    avatar_url: Optional[str] = None
    is_online: bool
    mic_enabled: bool
    camera_enabled: bool

class ParticipantResponse(ParticipantBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MediaStateUpdate(BaseModel):
    enabled: bool

class PresenceUpdate(BaseModel):
    is_online: bool
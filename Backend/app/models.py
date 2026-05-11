from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from .database import Base

class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    role = Column(String(120), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    is_online = Column(Boolean, default=False, nullable=False)
    mic_enabled = Column(Boolean, default=True, nullable=False)
    camera_enabled = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
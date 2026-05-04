import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Integer, Enum as SAEnum
from sqlalchemy.orm import relationship
from app.database import Base


class SessionStatus(str, enum.Enum):
    pending = "pending"
    queued = "queued"
    analyzing = "analyzing"
    complete = "complete"
    failed = "failed"


class TherapySession(Base):
    __tablename__ = "therapy_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(String(1024), nullable=True)
    video_path = Column(String(512), nullable=False)
    duration_sec = Column(Float, nullable=True)
    fps = Column(Float, nullable=True)
    frame_count = Column(Integer, nullable=True)
    status = Column(SAEnum(SessionStatus), default=SessionStatus.pending, nullable=False)
    error_message = Column(String(2048), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    analyzed_at = Column(DateTime, nullable=True)

    frames = relationship("Frame", back_populates="session", cascade="all, delete-orphan")
    emotions = relationship("EmotionRecord", back_populates="session", cascade="all, delete-orphan")
    clips = relationship("EmotionClip", back_populates="session", cascade="all, delete-orphan")
    persons = relationship("TrackedPerson", back_populates="session", cascade="all, delete-orphan")

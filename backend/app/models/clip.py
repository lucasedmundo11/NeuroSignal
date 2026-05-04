import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class EmotionClip(Base):
    __tablename__ = "emotion_clips"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("therapy_sessions.id"), nullable=False, index=True)
    person_id = Column(String(36), ForeignKey("tracked_persons.id"), nullable=True)

    peak_timestamp_ms = Column(Float, nullable=False)
    start_ms = Column(Float, nullable=False)
    end_ms = Column(Float, nullable=False)
    peak_emotion = Column(String(32), nullable=False)
    peak_intensity = Column(Float, nullable=False)

    clip_path = Column(String(512), nullable=False)
    thumbnail_path = Column(String(512), nullable=True)
    duration_sec = Column(Float, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("TherapySession", back_populates="clips")
    person = relationship("TrackedPerson", back_populates="clips")

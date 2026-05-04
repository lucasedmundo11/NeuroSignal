import uuid
from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class TrackedPerson(Base):
    __tablename__ = "tracked_persons"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("therapy_sessions.id"), nullable=False, index=True)
    track_id = Column(Integer, nullable=False)
    first_seen_ms = Column(Float, nullable=False)
    last_seen_ms = Column(Float, nullable=False)
    frame_count = Column(Integer, default=0)
    dominant_emotion = Column(String(32), nullable=True)
    avg_intensity = Column(Float, nullable=True)

    session = relationship("TherapySession", back_populates="persons")
    emotions = relationship("EmotionRecord", back_populates="person")
    clips = relationship("EmotionClip", back_populates="person")

import uuid
from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class EmotionRecord(Base):
    __tablename__ = "emotion_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("therapy_sessions.id"), nullable=False, index=True)
    frame_id = Column(String(36), ForeignKey("frames.id"), nullable=False, index=True)
    person_id = Column(String(36), ForeignKey("tracked_persons.id"), nullable=False, index=True)
    frame_index = Column(Integer, nullable=False)
    timestamp_ms = Column(Float, nullable=False)

    angry = Column(Float, default=0.0)
    disgust = Column(Float, default=0.0)
    fear = Column(Float, default=0.0)
    happy = Column(Float, default=0.0)
    sad = Column(Float, default=0.0)
    surprise = Column(Float, default=0.0)
    neutral = Column(Float, default=0.0)

    dominant_emotion = Column(String(32), nullable=False)
    intensity = Column(Float, nullable=False)

    bbox_x = Column(Float)
    bbox_y = Column(Float)
    bbox_w = Column(Float)
    bbox_h = Column(Float)

    session = relationship("TherapySession", back_populates="emotions")
    frame = relationship("Frame", back_populates="emotions")
    person = relationship("TrackedPerson", back_populates="emotions")

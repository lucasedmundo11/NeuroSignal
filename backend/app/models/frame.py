import uuid
from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Frame(Base):
    __tablename__ = "frames"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("therapy_sessions.id"), nullable=False, index=True)
    frame_index = Column(Integer, nullable=False)
    timestamp_ms = Column(Float, nullable=False)
    person_count = Column(Integer, default=0)

    session = relationship("TherapySession", back_populates="frames")
    emotions = relationship("EmotionRecord", back_populates="frame")

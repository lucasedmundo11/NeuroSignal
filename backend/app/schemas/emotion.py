from typing import Optional
from pydantic import BaseModel


class BBox(BaseModel):
    x: float
    y: float
    w: float
    h: float


class EmotionRecordResponse(BaseModel):
    id: str
    frame_index: int
    timestamp_ms: float
    person_id: str
    angry: float
    disgust: float
    fear: float
    happy: float
    sad: float
    surprise: float
    neutral: float
    dominant_emotion: str
    intensity: float
    bbox: Optional[BBox]

    model_config = {"from_attributes": True}


class TimelineBucket(BaseModel):
    timestamp_ms: float
    angry: float
    disgust: float
    fear: float
    happy: float
    sad: float
    surprise: float
    neutral: float
    intensity: float


class EmotionTimelineResponse(BaseModel):
    session_id: str
    duration_ms: float
    bucket_ms: int
    persons: list[str]
    series: list[TimelineBucket]


class PersonResponse(BaseModel):
    id: str
    track_id: int
    first_seen_ms: float
    last_seen_ms: float
    frame_count: int
    dominant_emotion: Optional[str]
    avg_intensity: Optional[float]

    model_config = {"from_attributes": True}

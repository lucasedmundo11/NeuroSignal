from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ClipResponse(BaseModel):
    id: str
    session_id: str
    person_id: Optional[str]
    peak_timestamp_ms: float
    start_ms: float
    end_ms: float
    peak_emotion: str
    peak_intensity: float
    duration_sec: float
    clip_url: str
    thumbnail_url: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class ClipListResponse(BaseModel):
    items: list[ClipResponse]
    total: int

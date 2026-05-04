from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.models.session import SessionStatus


class SessionCreate(BaseModel):
    title: str
    description: Optional[str] = None


class SessionResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    status: SessionStatus
    duration_sec: Optional[float]
    fps: Optional[float]
    frame_count: Optional[int]
    error_message: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    analyzed_at: Optional[datetime]

    model_config = {"from_attributes": True}


class SessionListResponse(BaseModel):
    items: list[SessionResponse]
    total: int
    page: int
    page_size: int

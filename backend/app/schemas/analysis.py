from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.models.session import SessionStatus


class AnalysisStatusResponse(BaseModel):
    session_id: str
    status: SessionStatus
    progress_pct: int
    error_message: Optional[str]
    analyzed_at: Optional[datetime]

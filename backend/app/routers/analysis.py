from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.ml.pipeline import VideoAnalysisPipeline
from app.models.session import TherapySession, SessionStatus
from app.models.frame import Frame
from app.schemas.analysis import AnalysisStatusResponse
from app.config import settings

router = APIRouter()

# Pre-warm the pipeline at import time so model loading doesn't block requests
_pipeline: VideoAnalysisPipeline | None = None


def get_pipeline() -> VideoAnalysisPipeline:
    global _pipeline
    if _pipeline is None:
        _pipeline = VideoAnalysisPipeline()
    return _pipeline


@router.post("/{session_id}/analyze", status_code=202)
def start_analysis(
    session_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    session = db.get(TherapySession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.status in (SessionStatus.analyzing, SessionStatus.queued):
        raise HTTPException(status_code=409, detail="Analysis already running")
    if session.status == SessionStatus.complete:
        raise HTTPException(status_code=409, detail="Analysis already complete")

    pipeline = get_pipeline()
    session.status = SessionStatus.queued
    db.commit()

    background_tasks.add_task(pipeline.run, session_id)
    return {"session_id": session_id, "status": "queued"}


@router.get("/{session_id}/status", response_model=AnalysisStatusResponse)
def get_status(session_id: str, db: Session = Depends(get_db)):
    session = db.get(TherapySession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    progress_pct = 0
    if session.status == SessionStatus.complete:
        progress_pct = 100
    elif session.status == SessionStatus.analyzing and session.frame_count:
        processed = db.query(Frame).filter(Frame.session_id == session_id).count()
        expected = max(1, session.frame_count // settings.FRAME_SKIP)
        progress_pct = min(99, int(processed / expected * 100))

    return AnalysisStatusResponse(
        session_id=session_id,
        status=session.status,
        progress_pct=progress_pct,
        error_message=session.error_message,
        analyzed_at=session.analyzed_at,
    )

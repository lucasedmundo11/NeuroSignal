from typing import Optional
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.session import TherapySession
from app.models.clip import EmotionClip
from app.schemas.clip import ClipResponse, ClipListResponse

router = APIRouter()


def _clip_to_response(clip: EmotionClip, request_base: str = "") -> ClipResponse:
    return ClipResponse(
        id=clip.id,
        session_id=clip.session_id,
        person_id=clip.person_id,
        peak_timestamp_ms=clip.peak_timestamp_ms,
        start_ms=clip.start_ms,
        end_ms=clip.end_ms,
        peak_emotion=clip.peak_emotion,
        peak_intensity=clip.peak_intensity,
        duration_sec=clip.duration_sec,
        clip_url=f"/clips/{clip.id}/download",
        thumbnail_url=f"/clips/{clip.id}/thumbnail" if clip.thumbnail_path else None,
        created_at=clip.created_at,
    )


@router.get("/sessions/{session_id}/clips", response_model=ClipListResponse)
def list_clips(
    session_id: str,
    person_id: Optional[str] = None,
    emotion: Optional[str] = None,
    sort: str = "intensity_desc",
    db: Session = Depends(get_db),
):
    session = db.get(TherapySession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    q = db.query(EmotionClip).filter(EmotionClip.session_id == session_id)
    if person_id:
        q = q.filter(EmotionClip.person_id == person_id)
    if emotion:
        q = q.filter(EmotionClip.peak_emotion == emotion)

    if sort == "intensity_desc":
        q = q.order_by(EmotionClip.peak_intensity.desc())
    else:
        q = q.order_by(EmotionClip.peak_timestamp_ms)

    clips = q.all()
    return ClipListResponse(items=[_clip_to_response(c) for c in clips], total=len(clips))


@router.get("/clips/{clip_id}/download")
def download_clip(clip_id: str, db: Session = Depends(get_db)):
    clip = db.get(EmotionClip, clip_id)
    if not clip:
        raise HTTPException(status_code=404, detail="Clip not found")
    path = Path(clip.clip_path)
    if not path.exists():
        raise HTTPException(status_code=404, detail="Clip file not found on disk")
    return FileResponse(str(path), media_type="video/mp4", filename=path.name)


@router.get("/clips/{clip_id}/thumbnail")
def get_thumbnail(clip_id: str, db: Session = Depends(get_db)):
    clip = db.get(EmotionClip, clip_id)
    if not clip or not clip.thumbnail_path:
        raise HTTPException(status_code=404, detail="Thumbnail not found")
    path = Path(clip.thumbnail_path)
    if not path.exists():
        raise HTTPException(status_code=404, detail="Thumbnail file not found on disk")
    return FileResponse(str(path), media_type="image/jpeg")

import uuid
import shutil
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.session import TherapySession, SessionStatus
from app.schemas.session import SessionResponse, SessionListResponse

router = APIRouter()

ALLOWED_TYPES = {"video/mp4", "video/avi", "video/quicktime", "video/webm", "video/x-msvideo"}


@router.post("/upload", response_model=SessionResponse, status_code=201)
async def upload_session(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    if file.content_type and file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

    session_id = str(uuid.uuid4())
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    suffix = Path(file.filename or "video.mp4").suffix or ".mp4"
    video_path = str(upload_dir / f"{session_id}{suffix}")

    with open(video_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    session = TherapySession(
        id=session_id,
        title=title,
        description=description,
        video_path=video_path,
        status=SessionStatus.pending,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("", response_model=SessionListResponse)
def list_sessions(
    page: int = 1,
    page_size: int = 20,
    status: Optional[SessionStatus] = None,
    db: Session = Depends(get_db),
):
    query = db.query(TherapySession)
    if status:
        query = query.filter(TherapySession.status == status)
    total = query.count()
    items = query.order_by(TherapySession.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return SessionListResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/{session_id}", response_model=SessionResponse)
def get_session(session_id: str, db: Session = Depends(get_db)):
    session = db.get(TherapySession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.delete("/{session_id}", status_code=204)
def delete_session(session_id: str, db: Session = Depends(get_db)):
    session = db.get(TherapySession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Remove video file
    try:
        Path(session.video_path).unlink(missing_ok=True)
    except Exception:
        pass

    # Remove clip/thumbnail dirs
    for clip in session.clips:
        try:
            Path(clip.clip_path).unlink(missing_ok=True)
        except Exception:
            pass
        try:
            if clip.thumbnail_path:
                Path(clip.thumbnail_path).unlink(missing_ok=True)
        except Exception:
            pass

    db.delete(session)
    db.commit()

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.session import TherapySession
from app.models.emotion import EmotionRecord
from app.models.person import TrackedPerson
from app.schemas.emotion import (
    EmotionRecordResponse,
    BBox,
    EmotionTimelineResponse,
    TimelineBucket,
    PersonResponse,
)

router = APIRouter()

EMOTION_KEYS = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"]


def _to_response(rec: EmotionRecord) -> EmotionRecordResponse:
    bbox = None
    if rec.bbox_x is not None:
        bbox = BBox(x=rec.bbox_x, y=rec.bbox_y, w=rec.bbox_w, h=rec.bbox_h)
    return EmotionRecordResponse(
        id=rec.id,
        frame_index=rec.frame_index,
        timestamp_ms=rec.timestamp_ms,
        person_id=rec.person_id,
        angry=rec.angry,
        disgust=rec.disgust,
        fear=rec.fear,
        happy=rec.happy,
        sad=rec.sad,
        surprise=rec.surprise,
        neutral=rec.neutral,
        dominant_emotion=rec.dominant_emotion,
        intensity=rec.intensity,
        bbox=bbox,
    )


@router.get("/{session_id}/emotions")
def list_emotions(
    session_id: str,
    person_id: Optional[str] = None,
    from_ms: Optional[float] = None,
    to_ms: Optional[float] = None,
    limit: int = 500,
    db: Session = Depends(get_db),
):
    session = db.get(TherapySession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    q = db.query(EmotionRecord).filter(EmotionRecord.session_id == session_id)
    if person_id:
        q = q.filter(EmotionRecord.person_id == person_id)
    if from_ms is not None:
        q = q.filter(EmotionRecord.timestamp_ms >= from_ms)
    if to_ms is not None:
        q = q.filter(EmotionRecord.timestamp_ms <= to_ms)

    total = q.count()
    items = q.order_by(EmotionRecord.timestamp_ms).limit(limit).all()
    return {"items": [_to_response(r) for r in items], "total": total}


@router.get("/{session_id}/timeline", response_model=EmotionTimelineResponse)
def get_timeline(
    session_id: str,
    bucket_ms: int = 1000,
    person_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    session = db.get(TherapySession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    q = db.query(EmotionRecord).filter(EmotionRecord.session_id == session_id)
    if person_id:
        q = q.filter(EmotionRecord.person_id == person_id)
    records = q.order_by(EmotionRecord.timestamp_ms).all()

    if not records:
        return EmotionTimelineResponse(
            session_id=session_id,
            duration_ms=(session.duration_sec or 0) * 1000,
            bucket_ms=bucket_ms,
            persons=[],
            series=[],
        )

    duration_ms = (session.duration_sec or 0) * 1000
    persons = list({r.person_id for r in records})

    # Bucket the emotion records
    buckets: dict[int, list] = {}
    for rec in records:
        bucket_key = int(rec.timestamp_ms // bucket_ms) * bucket_ms
        if bucket_key not in buckets:
            buckets[bucket_key] = []
        buckets[bucket_key].append(rec)

    series = []
    for ts in sorted(buckets.keys()):
        recs = buckets[ts]
        n = len(recs)
        series.append(TimelineBucket(
            timestamp_ms=float(ts),
            angry=sum(r.angry for r in recs) / n,
            disgust=sum(r.disgust for r in recs) / n,
            fear=sum(r.fear for r in recs) / n,
            happy=sum(r.happy for r in recs) / n,
            sad=sum(r.sad for r in recs) / n,
            surprise=sum(r.surprise for r in recs) / n,
            neutral=sum(r.neutral for r in recs) / n,
            intensity=sum(r.intensity for r in recs) / n,
        ))

    return EmotionTimelineResponse(
        session_id=session_id,
        duration_ms=duration_ms,
        bucket_ms=bucket_ms,
        persons=persons,
        series=series,
    )


@router.get("/{session_id}/persons", response_model=list[PersonResponse])
def list_persons(session_id: str, db: Session = Depends(get_db)):
    session = db.get(TherapySession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    persons = db.query(TrackedPerson).filter(TrackedPerson.session_id == session_id).all()
    return persons

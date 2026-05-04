import uuid
import logging
from datetime import datetime

import cv2

from app.config import settings
from app.database import SessionLocal
from app.models.session import TherapySession, SessionStatus
from app.models.frame import Frame
from app.models.person import TrackedPerson
from app.models.emotion import EmotionRecord
from app.models.clip import EmotionClip
from app.ml.detector import FaceBodyDetector
from app.ml.tracker import PersonTracker
from app.ml.emotion_recognizer import EmotionRecognizer
from app.ml.peak_detector import detect_emotional_peaks
from app.ml.clip_generator import generate_clip

logger = logging.getLogger(__name__)


class VideoAnalysisPipeline:
    def __init__(self):
        self._detector = FaceBodyDetector()
        self._tracker = PersonTracker()
        self._recognizer = EmotionRecognizer(use_mtcnn=False)

    def run(self, session_id: str) -> None:
        """Entry point — creates its own DB session to safely run as a background task."""
        db = SessionLocal()
        try:
            self._execute(session_id, db)
        except Exception as exc:
            logger.exception("Pipeline failed for session %s: %s", session_id, exc)
            session = db.get(TherapySession, session_id)
            if session:
                session.status = SessionStatus.failed
                session.error_message = str(exc)[:2000]
                db.commit()
        finally:
            db.close()

    def _execute(self, session_id: str, db) -> None:
        session = db.get(TherapySession, session_id)
        session.status = SessionStatus.analyzing
        db.commit()

        cap = cv2.VideoCapture(session.video_path)
        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration_sec = total_frames / fps if fps else 0

        session.fps = fps
        session.frame_count = total_frames
        session.duration_sec = duration_sec
        db.commit()

        person_id_map: dict[int, str] = {}
        emotion_timelines: dict[int, list] = {}

        frame_index = 0
        processed_count = 0

        while cap.isOpened():
            ret, frame_bgr = cap.read()
            if not ret:
                break

            timestamp_ms = (frame_index / fps) * 1000.0

            if frame_index % settings.FRAME_SKIP == 0:
                detections = self._detector.detect(frame_bgr)
                tracks = self._tracker.update(detections, frame_bgr)

                frame_record = Frame(
                    id=str(uuid.uuid4()),
                    session_id=session_id,
                    frame_index=frame_index,
                    timestamp_ms=timestamp_ms,
                    person_count=len(tracks),
                )
                db.add(frame_record)

                for track in tracks:
                    track_id = track["track_id"]
                    bbox = track["bbox"]

                    if track_id not in person_id_map:
                        person = TrackedPerson(
                            id=str(uuid.uuid4()),
                            session_id=session_id,
                            track_id=track_id,
                            first_seen_ms=timestamp_ms,
                            last_seen_ms=timestamp_ms,
                            frame_count=0,
                        )
                        db.add(person)
                        db.flush()
                        person_id_map[track_id] = person.id
                        emotion_timelines[track_id] = []
                    else:
                        person = db.get(TrackedPerson, person_id_map[track_id])
                        person.last_seen_ms = timestamp_ms

                    person.frame_count += 1

                    emotion_data = self._recognizer.recognize(frame_bgr, bbox)
                    if emotion_data:
                        rec = EmotionRecord(
                            id=str(uuid.uuid4()),
                            session_id=session_id,
                            frame_id=frame_record.id,
                            person_id=person_id_map[track_id],
                            frame_index=frame_index,
                            timestamp_ms=timestamp_ms,
                            angry=emotion_data["angry"],
                            disgust=emotion_data["disgust"],
                            fear=emotion_data["fear"],
                            happy=emotion_data["happy"],
                            sad=emotion_data["sad"],
                            surprise=emotion_data["surprise"],
                            neutral=emotion_data["neutral"],
                            dominant_emotion=emotion_data["dominant_emotion"],
                            intensity=emotion_data["intensity"],
                            bbox_x=bbox[0],
                            bbox_y=bbox[1],
                            bbox_w=bbox[2] - bbox[0],
                            bbox_h=bbox[3] - bbox[1],
                        )
                        db.add(rec)
                        emotion_timelines[track_id].append({
                            "timestamp_ms": timestamp_ms,
                            "intensity": emotion_data["intensity"],
                            "dominant_emotion": emotion_data["dominant_emotion"],
                        })

                processed_count += 1
                if processed_count % 100 == 0:
                    db.commit()
                    logger.info("Session %s: processed %d frames", session_id, processed_count)

            frame_index += 1

        cap.release()
        db.commit()

        # Peak detection + clip generation per person
        for track_id, timeline in emotion_timelines.items():
            peaks = detect_emotional_peaks(timeline, fps, settings.FRAME_SKIP)
            person_id = person_id_map.get(track_id)

            for peak in peaks:
                try:
                    clip_data = generate_clip(
                        video_path=session.video_path,
                        peak_timestamp_ms=peak["timestamp_ms"],
                        session_id=session_id,
                        peak_emotion=peak["peak_emotion"],
                    )
                    clip = EmotionClip(
                        id=str(uuid.uuid4()),
                        session_id=session_id,
                        person_id=person_id,
                        peak_timestamp_ms=peak["timestamp_ms"],
                        start_ms=clip_data["start_ms"],
                        end_ms=clip_data["end_ms"],
                        peak_emotion=peak["peak_emotion"],
                        peak_intensity=peak["peak_intensity"],
                        clip_path=clip_data["clip_path"],
                        thumbnail_path=clip_data["thumbnail_path"],
                        duration_sec=clip_data["duration_sec"],
                    )
                    db.add(clip)
                except Exception as e:
                    logger.warning("Failed to generate clip for peak at %s ms: %s", peak["timestamp_ms"], e)

        # Update person summaries
        for track_id, pid in person_id_map.items():
            person = db.get(TrackedPerson, pid)
            timeline = emotion_timelines.get(track_id, [])
            if timeline:
                from collections import Counter
                emotion_counts = Counter(e["dominant_emotion"] for e in timeline)
                person.dominant_emotion = emotion_counts.most_common(1)[0][0]
                person.avg_intensity = sum(e["intensity"] for e in timeline) / len(timeline)

        session.status = SessionStatus.complete
        session.analyzed_at = datetime.utcnow()
        db.commit()
        logger.info("Session %s analysis complete", session_id)

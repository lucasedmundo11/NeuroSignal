import uuid
from pathlib import Path
from moviepy.editor import VideoFileClip
from app.config import settings


def generate_clip(
    video_path: str,
    peak_timestamp_ms: float,
    session_id: str,
    peak_emotion: str,
) -> dict:
    """
    Extracts a clip centered on peak_timestamp_ms ± PEAK_WINDOW_SEC.
    Returns {clip_path, thumbnail_path, start_ms, end_ms, duration_sec}.
    """
    window_ms = settings.PEAK_WINDOW_SEC * 1000
    start_ms = max(0.0, peak_timestamp_ms - window_ms)
    end_ms = peak_timestamp_ms + window_ms

    clip_dir = Path(settings.CLIPS_DIR) / session_id
    thumb_dir = Path(settings.THUMBS_DIR) / session_id
    clip_dir.mkdir(parents=True, exist_ok=True)
    thumb_dir.mkdir(parents=True, exist_ok=True)

    stem = f"{peak_emotion}_{uuid.uuid4().hex[:8]}"
    clip_path = str(clip_dir / f"{stem}.mp4")
    thumb_path = str(thumb_dir / f"{stem}.jpg")

    source = VideoFileClip(video_path)
    try:
        video_duration_ms = source.duration * 1000
        end_ms = min(end_ms, video_duration_ms)
        subclip = source.subclip(start_ms / 1000, end_ms / 1000)
        subclip.write_videofile(clip_path, codec="libx264", audio_codec="aac", logger=None)
        subclip.save_frame(thumb_path, t=0)
    finally:
        source.close()

    return {
        "clip_path": clip_path,
        "thumbnail_path": thumb_path,
        "start_ms": start_ms,
        "end_ms": end_ms,
        "duration_sec": (end_ms - start_ms) / 1000,
    }

from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    APP_NAME: str = "NeuroSignal"
    DEBUG: bool = False

    DATABASE_URL: str = f"sqlite:///{BASE_DIR}/storage/neurosignal.db"

    UPLOAD_DIR: str = str(BASE_DIR / "storage" / "uploads")
    CLIPS_DIR: str = str(BASE_DIR / "storage" / "clips")
    THUMBS_DIR: str = str(BASE_DIR / "storage" / "thumbnails")

    YOLO_MODEL: str = "yolov8n.pt"
    YOLO_CLASSES: list[int] = [0]
    YOLO_CONFIDENCE: float = 0.4
    DEVICE: str = "auto"

    FRAME_SKIP: int = 3
    TRACKER_MAX_AGE: int = 30

    PEAK_WINDOW_SEC: float = 5.0
    PEAK_MIN_INTENSITY: float = 0.55
    PEAK_MIN_DISTANCE_FRAMES: int = 20

    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    model_config = {"env_file": ".env"}


settings = Settings()

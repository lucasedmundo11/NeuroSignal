from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
import app.models  # noqa: F401 — registers all models
from app.routers import sessions, analysis, emotions, clips

Base.metadata.create_all(bind=engine)

for d in [settings.UPLOAD_DIR, settings.CLIPS_DIR, settings.THUMBS_DIR]:
    Path(d).mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="NeuroSignal API",
    version="0.1.0",
    description="Multimodal emotion analysis platform for therapists",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
app.include_router(analysis.router, prefix="/sessions", tags=["analysis"])
app.include_router(emotions.router, prefix="", tags=["emotions"])
app.include_router(clips.router, prefix="", tags=["clips"])


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok", "version": "0.1.0"}

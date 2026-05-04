import torch
from app.config import settings


def get_device() -> str:
    if settings.DEVICE != "auto":
        return settings.DEVICE
    if torch.backends.mps.is_available():
        return "mps"
    if torch.cuda.is_available():
        return "cuda"
    return "cpu"

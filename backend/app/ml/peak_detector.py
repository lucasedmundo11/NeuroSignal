from typing import List, Dict
import numpy as np
from scipy.signal import find_peaks, savgol_filter
from app.config import settings


def detect_emotional_peaks(
    emotion_timeline: List[Dict],
    fps: float,
    frame_skip: int,
) -> List[Dict]:
    """
    Smooths the per-track intensity signal and finds emotional peaks via scipy.
    Returns list of {timestamp_ms, peak_emotion, peak_intensity}.
    """
    if len(emotion_timeline) < 3:
        return []

    timestamps = np.array([e["timestamp_ms"] for e in emotion_timeline])
    intensities = np.array([e["intensity"] for e in emotion_timeline])

    n = len(intensities)
    window = min(11, n if n % 2 == 1 else n - 1)
    window = max(window, 3)
    if window % 2 == 0:
        window += 1

    if n >= window:
        intensities_smooth = savgol_filter(intensities, window_length=window, polyorder=2)
    else:
        intensities_smooth = intensities

    peak_indices, _ = find_peaks(
        intensities_smooth,
        height=settings.PEAK_MIN_INTENSITY,
        distance=settings.PEAK_MIN_DISTANCE_FRAMES,
    )

    peaks = []
    for idx in peak_indices:
        entry = emotion_timeline[idx]
        peaks.append({
            "timestamp_ms": float(timestamps[idx]),
            "peak_emotion": entry["dominant_emotion"],
            "peak_intensity": float(intensities_smooth[idx]),
        })

    return peaks

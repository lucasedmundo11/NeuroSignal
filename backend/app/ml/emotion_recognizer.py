from typing import Optional, Dict
import numpy as np
from fer.fer import FER

EMOTION_KEYS = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"]


class EmotionRecognizer:
    def __init__(self, use_mtcnn: bool = False):
        # mtcnn=False uses OpenCV Haar (faster, no TF dependency issues)
        self._detector = FER(mtcnn=use_mtcnn)

    def recognize(self, frame_bgr: np.ndarray, person_bbox: list) -> Optional[Dict]:
        """
        Crops the person bbox from frame and runs FER on the face region.
        Returns emotion probabilities + dominant emotion, or None if no face found.
        """
        x1, y1, x2, y2 = [int(v) for v in person_bbox]
        h, w = frame_bgr.shape[:2]
        x1 = max(0, x1)
        y1 = max(0, y1)
        x2 = min(w, x2)
        y2 = min(h, y2)

        crop = frame_bgr[y1:y2, x1:x2]
        if crop.size == 0:
            return None

        detections = self._detector.detect_emotions(crop)
        if not detections:
            return None

        best = max(detections, key=lambda d: sum(d["emotions"].values()))
        emotions = best["emotions"]

        scores = {k: min(1.0, max(0.0, float(emotions.get(k, 0.0)))) for k in EMOTION_KEYS}
        dominant = max(scores, key=scores.get)
        intensity = scores[dominant]

        return {**scores, "dominant_emotion": dominant, "intensity": intensity}

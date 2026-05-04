from typing import List
import numpy as np
from ultralytics import YOLO
from app.config import settings
from app.ml.device import get_device


class FaceBodyDetector:
    def __init__(self):
        self._device = get_device()
        self._model = YOLO(settings.YOLO_MODEL)

    def detect(self, frame_bgr: np.ndarray) -> List[dict]:
        """Returns list of person detections: [{bbox: [x1,y1,x2,y2], confidence: float}]"""
        results = self._model(
            frame_bgr,
            classes=settings.YOLO_CLASSES,
            conf=settings.YOLO_CONFIDENCE,
            device=self._device,
            verbose=False,
        )
        detections = []
        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                detections.append({
                    "bbox": [x1, y1, x2, y2],
                    "confidence": float(box.conf),
                    "class_id": int(box.cls),
                })
        return detections

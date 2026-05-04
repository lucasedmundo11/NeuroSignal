from typing import List
import numpy as np
from deep_sort_realtime.deepsort_tracker import DeepSort
from app.config import settings


class PersonTracker:
    def __init__(self):
        self._tracker = DeepSort(max_age=settings.TRACKER_MAX_AGE)

    def update(self, detections: List[dict], frame_bgr: np.ndarray) -> List[dict]:
        """
        Accepts FaceBodyDetector output, returns confirmed tracks.
        DeepSort expects: [([left, top, w, h], confidence, class_id)]
        """
        ds_input = []
        for d in detections:
            x1, y1, x2, y2 = d["bbox"]
            w, h = x2 - x1, y2 - y1
            ds_input.append(([x1, y1, w, h], d["confidence"], d["class_id"]))

        tracks = self._tracker.update_tracks(ds_input, frame=frame_bgr)
        result = []
        for track in tracks:
            if not track.is_confirmed():
                continue
            ltrb = track.to_ltrb()
            result.append({
                "track_id": track.track_id,
                "bbox": ltrb.tolist(),
            })
        return result

export type EmotionKey = "angry" | "disgust" | "fear" | "happy" | "sad" | "surprise" | "neutral";

export interface EmotionScores {
  angry: number;
  disgust: number;
  fear: number;
  happy: number;
  sad: number;
  surprise: number;
  neutral: number;
}

export interface BBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface EmotionRecord extends EmotionScores {
  id: string;
  frame_index: number;
  timestamp_ms: number;
  person_id: string;
  dominant_emotion: EmotionKey;
  intensity: number;
  bbox: BBox | null;
}

export interface TimelineBucket extends EmotionScores {
  timestamp_ms: number;
  intensity: number;
}

export interface EmotionTimeline {
  session_id: string;
  duration_ms: number;
  bucket_ms: number;
  persons: string[];
  series: TimelineBucket[];
}

export interface TrackedPerson {
  id: string;
  track_id: number;
  first_seen_ms: number;
  last_seen_ms: number;
  frame_count: number;
  dominant_emotion: EmotionKey | null;
  avg_intensity: number | null;
}

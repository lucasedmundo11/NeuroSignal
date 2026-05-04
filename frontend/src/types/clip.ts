export interface EmotionClip {
  id: string;
  session_id: string;
  person_id: string | null;
  peak_timestamp_ms: number;
  start_ms: number;
  end_ms: number;
  peak_emotion: string;
  peak_intensity: number;
  duration_sec: number;
  clip_url: string;
  thumbnail_url: string | null;
  created_at: string;
}

export interface ClipListResponse {
  items: EmotionClip[];
  total: number;
}

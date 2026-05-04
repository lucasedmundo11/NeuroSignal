export type SessionStatus = "pending" | "queued" | "analyzing" | "complete" | "failed";

export interface TherapySession {
  id: string;
  title: string;
  description: string | null;
  status: SessionStatus;
  duration_sec: number | null;
  fps: number | null;
  frame_count: number | null;
  error_message: string | null;
  created_at: string;
  updated_at: string | null;
  analyzed_at: string | null;
}

export interface AnalysisStatus {
  session_id: string;
  status: SessionStatus;
  progress_pct: number;
  error_message: string | null;
  analyzed_at: string | null;
}

export interface SessionListResponse {
  items: TherapySession[];
  total: number;
  page: number;
  page_size: number;
}

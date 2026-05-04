import axios from "axios";
import type { SessionListResponse, TherapySession, AnalysisStatus } from "@/types/session";
import type { EmotionTimeline, TrackedPerson } from "@/types/emotion";
import type { ClipListResponse } from "@/types/clip";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const client = axios.create({ baseURL: BASE_URL });

export const api = {
  // Sessions
  listSessions: (page = 1, pageSize = 20, status?: string) =>
    client
      .get<SessionListResponse>("/sessions", { params: { page, page_size: pageSize, status } })
      .then((r) => r.data),

  getSession: (id: string) =>
    client.get<TherapySession>(`/sessions/${id}`).then((r) => r.data),

  deleteSession: (id: string) =>
    client.delete(`/sessions/${id}`),

  uploadSession: (
    file: File,
    title: string,
    description?: string,
    onProgress?: (pct: number) => void
  ) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);
    if (description) fd.append("description", description);
    return client
      .post<TherapySession>("/sessions/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        },
      })
      .then((r) => r.data);
  },

  // Analysis
  startAnalysis: (id: string) =>
    client.post(`/sessions/${id}/analyze`).then((r) => r.data),

  getStatus: (id: string) =>
    client.get<AnalysisStatus>(`/sessions/${id}/status`).then((r) => r.data),

  // Emotions
  getTimeline: (id: string, bucketMs = 1000, personId?: string) =>
    client
      .get<EmotionTimeline>(`/sessions/${id}/timeline`, {
        params: { bucket_ms: bucketMs, person_id: personId },
      })
      .then((r) => r.data),

  listPersons: (id: string) =>
    client.get<TrackedPerson[]>(`/sessions/${id}/persons`).then((r) => r.data),

  // Clips
  listClips: (id: string, personId?: string, emotion?: string) =>
    client
      .get<ClipListResponse>(`/sessions/${id}/clips`, {
        params: { person_id: personId, emotion },
      })
      .then((r) => r.data),

  clipDownloadUrl: (clipId: string) => `${BASE_URL}/clips/${clipId}/download`,
  clipThumbnailUrl: (clipId: string) => `${BASE_URL}/clips/${clipId}/thumbnail`,
};

// SWR-compatible fetcher
export const fetcher = (url: string) => client.get(url).then((r) => r.data);

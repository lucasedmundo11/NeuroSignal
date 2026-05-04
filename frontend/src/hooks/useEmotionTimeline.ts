"use client";
import useSWR from "swr";
import { api } from "@/lib/api";
import type { EmotionTimeline } from "@/types/emotion";

export function useEmotionTimeline(sessionId: string | null, bucketMs = 1000) {
  const { data, error, isLoading } = useSWR<EmotionTimeline>(
    sessionId ? `timeline:${sessionId}:${bucketMs}` : null,
    () => api.getTimeline(sessionId!, bucketMs)
  );

  return { data, error, isLoading };
}

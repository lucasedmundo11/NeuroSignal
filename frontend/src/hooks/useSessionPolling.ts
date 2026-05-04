"use client";
import useSWR from "swr";
import { api } from "@/lib/api";
import type { SessionStatus, AnalysisStatus } from "@/types/session";

const TERMINAL: SessionStatus[] = ["complete", "failed"];

export function useSessionPolling(sessionId: string | null) {
  const { data, error, mutate } = useSWR<AnalysisStatus>(
    sessionId ? `status:${sessionId}` : null,
    () => api.getStatus(sessionId!),
    {
      refreshInterval: (data) => {
        if (!data || TERMINAL.includes(data.status)) return 0;
        return 2000;
      },
      revalidateOnFocus: false,
    }
  );

  return {
    status: data?.status ?? "pending",
    progress: data?.progress_pct ?? 0,
    errorMsg: data?.error_message ?? null,
    isLoading: !data && !error,
    mutate,
  };
}

"use client";
import useSWR from "swr";
import { api } from "@/lib/api";
import type { SessionListResponse } from "@/types/session";

export function useSessions(page = 1) {
  const { data, error, isLoading, mutate } = useSWR<SessionListResponse>(
    `sessions:${page}`,
    () => api.listSessions(page),
    { refreshInterval: 5000 }
  );

  return { data, error, isLoading, mutate };
}

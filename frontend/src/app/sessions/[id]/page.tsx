"use client";
import { use, useEffect, useState } from "react";
import useSWR from "swr";
import { ArrowLeft, Users, BarChart2, Film } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useEmotionTimeline } from "@/hooks/useEmotionTimeline";
import { useSessionPolling } from "@/hooks/useSessionPolling";
import { AnalysisProgress } from "@/components/analysis/AnalysisProgress";
import { EmotionTimeline } from "@/components/analysis/EmotionTimeline";
import { EmotionSummaryBar } from "@/components/analysis/EmotionSummaryBar";
import { ClipGallery } from "@/components/clips/ClipGallery";
import { AnalysisStatusBadge } from "@/components/sessions/AnalysisStatusBadge";
import { formatDate, formatDuration, EMOTION_LABELS } from "@/lib/utils";
import type { TherapySession } from "@/types/session";
import type { TrackedPerson } from "@/types/emotion";

type Tab = "timeline" | "clips" | "persons";

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tab, setTab] = useState<Tab>("timeline");

  const { data: session, mutate: mutateSession } = useSWR<TherapySession>(
    `session:${id}`,
    () => api.getSession(id),
    { refreshInterval: 0 }
  );

  const { status } = useSessionPolling(id);
  const { data: timeline } = useEmotionTimeline(
    status === "complete" ? id : null
  );
  const { data: persons } = useSWR<TrackedPerson[]>(
    status === "complete" ? `persons:${id}` : null,
    () => api.listPersons(id)
  );

  // Refresh session once analysis completes
  useEffect(() => {
    if (status === "complete" || status === "failed") {
      mutateSession();
    }
  }, [status, mutateSession]);

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-800" />
        <div className="mt-6 h-40 animate-pulse rounded-xl bg-gray-900" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "timeline", label: "Timeline Emocional", icon: <BarChart2 className="h-4 w-4" /> },
    { key: "clips", label: "Clipes", icon: <Film className="h-4 w-4" /> },
    { key: "persons", label: "Pessoas", icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/dashboard"
        className="mb-6 flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Sessões
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="truncate text-xl font-semibold text-white">{session.title}</h1>
            <AnalysisStatusBadge status={session.status} />
          </div>
          {session.description && (
            <p className="mt-1 text-sm text-gray-400">{session.description}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
            <span>Duração: {formatDuration(session.duration_sec)}</span>
            {session.fps && <span>FPS: {session.fps.toFixed(0)}</span>}
            {session.frame_count && <span>Frames: {session.frame_count.toLocaleString()}</span>}
            <span>Criada: {formatDate(session.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Analysis progress bar */}
      {(status === "analyzing" || status === "queued") && (
        <div className="mb-6">
          <AnalysisProgress sessionId={id} />
        </div>
      )}

      {/* Tabs */}
      {status === "complete" && (
        <>
          <div className="mb-6 flex gap-1 rounded-lg border border-white/10 bg-gray-900 p-1 w-fit">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === t.key
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {tab === "timeline" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-white/10 bg-gray-900 p-6">
                <h2 className="mb-4 text-sm font-medium text-gray-300">Intensidade emocional ao longo do tempo</h2>
                {timeline ? (
                  <EmotionTimeline data={timeline} />
                ) : (
                  <div className="h-48 animate-pulse rounded-lg bg-gray-800" />
                )}
              </div>

              {timeline && (
                <div className="rounded-xl border border-white/10 bg-gray-900 p-6">
                  <h2 className="mb-4 text-sm font-medium text-gray-300">Distribuição média de emoções</h2>
                  <EmotionSummaryBar data={timeline} />
                </div>
              )}
            </div>
          )}

          {tab === "clips" && <ClipGallery sessionId={id} />}

          {tab === "persons" && (
            <div className="space-y-3">
              {!persons?.length ? (
                <p className="text-sm text-gray-500">Nenhuma pessoa rastreada</p>
              ) : (
                persons.map((person) => (
                  <div key={person.id} className="rounded-xl border border-white/10 bg-gray-900 p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">Pessoa #{person.track_id}</p>
                      {person.dominant_emotion && (
                        <span className="text-sm text-gray-400">
                          Emoção dominante:{" "}
                          <span className="font-medium text-white">
                            {EMOTION_LABELS[person.dominant_emotion] ?? person.dominant_emotion}
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                      <span>Frames: {person.frame_count.toLocaleString()}</span>
                      <span>Visto de {formatDuration(person.first_seen_ms / 1000)} a {formatDuration(person.last_seen_ms / 1000)}</span>
                      {person.avg_intensity != null && (
                        <span>Intensidade média: {Math.round(person.avg_intensity * 100)}%</span>
                      )}
                    </div>
                    {person.avg_intensity != null && (
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                        <div
                          className="h-full rounded-full bg-violet-500"
                          style={{ width: `${Math.round(person.avg_intensity * 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {status === "failed" && session.error_message && (
        <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-5">
          <p className="text-sm font-medium text-red-400">Análise falhou</p>
          <p className="mt-1 text-xs text-red-300/70">{session.error_message}</p>
        </div>
      )}

      {status === "pending" && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-gray-400">Sessão aguardando análise</p>
          <button
            onClick={async () => {
              await api.startAnalysis(id);
              mutateSession();
            }}
            className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
          >
            Iniciar análise
          </button>
        </div>
      )}
    </div>
  );
}

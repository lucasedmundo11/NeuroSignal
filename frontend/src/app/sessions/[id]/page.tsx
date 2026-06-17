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
import { Navbar } from "@/components/layout/Navbar";
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
  const { data: timeline } = useEmotionTimeline(status === "complete" ? id : null);
  const { data: persons } = useSWR<TrackedPerson[]>(
    status === "complete" ? `persons:${id}` : null,
    () => api.listPersons(id)
  );

  useEffect(() => {
    if (status === "complete" || status === "failed") {
      mutateSession();
    }
  }, [status, mutateSession]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "timeline", label: "Timeline Emocional", icon: <BarChart2 className="h-4 w-4" /> },
    { key: "clips",    label: "Clipes",              icon: <Film className="h-4 w-4" /> },
    { key: "persons",  label: "Pessoas",             icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />

      {/* Subtle top orb */}
      <div className="pointer-events-none fixed right-0 top-0 h-96 w-96 opacity-[0.06]" aria-hidden>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 60deg, #D4A853, #5BCFB4, #7c3aed, #D4A853)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <main className="flex-1">
        {!session ? (
          <div className="mx-auto max-w-5xl px-4 py-10">
            <div className="h-6 w-32 animate-pulse rounded-lg bg-white/[0.05]" />
            <div className="mt-8 h-28 animate-pulse rounded-xl bg-[#0c0c0c]" />
          </div>
        ) : (
          <div className="relative mx-auto max-w-5xl px-4 py-8">
            <Link
              href="/dashboard"
              className="mb-8 inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-white/25 hover:text-white/60 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Sessões
            </Link>

            {/* Header */}
            <div className="mb-8 flex flex-wrap items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-black uppercase tracking-tight text-white leading-none">
                    {session.title}
                  </h1>
                  <AnalysisStatusBadge status={session.status} />
                </div>
                {session.description && (
                  <p className="mt-2 text-sm text-white/35">{session.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-5 text-xs text-white/20">
                  <span>Duração: {formatDuration(session.duration_sec)}</span>
                  {session.fps && <span>FPS: {session.fps.toFixed(0)}</span>}
                  {session.frame_count && (
                    <span>Frames: {session.frame_count.toLocaleString()}</span>
                  )}
                  <span>Criada: {formatDate(session.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Analysis progress */}
            {(status === "analyzing" || status === "queued") && (
              <div className="mb-8">
                <AnalysisProgress sessionId={id} />
              </div>
            )}

            {/* Tabs */}
            {status === "complete" && (
              <>
                <div className="mb-8 flex gap-1 rounded-xl border border-white/[0.06] bg-[#0c0c0c] p-1 w-fit">
                  {tabs.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
                        tab === t.key ? "text-black" : "text-white/35 hover:text-white/70"
                      }`}
                      style={
                        tab === t.key
                          ? { background: "linear-gradient(90deg, #D4A853 0%, #E5C76B 100%)" }
                          : {}
                      }
                    >
                      {t.icon}
                      {t.label}
                    </button>
                  ))}
                </div>

                {tab === "timeline" && (
                  <div className="space-y-6">
                    <div className="rounded-xl border border-white/[0.07] bg-[#0c0c0c] p-6">
                      <p className="mb-5 text-[10px] tracking-[0.3em] uppercase text-white/25 font-medium">
                        Intensidade emocional ao longo do tempo
                      </p>
                      {timeline ? (
                        <EmotionTimeline data={timeline} />
                      ) : (
                        <div className="h-48 animate-pulse rounded-lg bg-white/[0.04]" />
                      )}
                    </div>
                    {timeline && (
                      <div className="rounded-xl border border-white/[0.07] bg-[#0c0c0c] p-6">
                        <p className="mb-5 text-[10px] tracking-[0.3em] uppercase text-white/25 font-medium">
                          Distribuição média de emoções
                        </p>
                        <EmotionSummaryBar data={timeline} />
                      </div>
                    )}
                  </div>
                )}

                {tab === "clips" && <ClipGallery sessionId={id} />}

                {tab === "persons" && (
                  <div className="space-y-3">
                    {!persons?.length ? (
                      <p className="text-sm text-white/25">Nenhuma pessoa rastreada</p>
                    ) : (
                      persons.map((person) => (
                        <div
                          key={person.id}
                          className="rounded-xl border border-white/[0.07] bg-[#0c0c0c] p-5"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-white">Pessoa #{person.track_id}</p>
                            {person.dominant_emotion && (
                              <span className="text-xs text-white/30">
                                Emoção dominante:{" "}
                                <span className="font-semibold text-white/70">
                                  {EMOTION_LABELS[person.dominant_emotion] ?? person.dominant_emotion}
                                </span>
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-4 text-xs text-white/20">
                            <span>Frames: {person.frame_count.toLocaleString()}</span>
                            <span>
                              Visto de {formatDuration(person.first_seen_ms / 1000)} a{" "}
                              {formatDuration(person.last_seen_ms / 1000)}
                            </span>
                            {person.avg_intensity != null && (
                              <span>Intensidade média: {Math.round(person.avg_intensity * 100)}%</span>
                            )}
                          </div>
                          {person.avg_intensity != null && (
                            <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${Math.round(person.avg_intensity * 100)}%`,
                                  background: "linear-gradient(90deg, #D4A853 0%, #E5C76B 100%)",
                                }}
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
              <div className="rounded-xl border border-red-500/15 bg-red-500/[0.06] p-5">
                <p className="text-sm font-semibold text-red-400">Análise falhou</p>
                <p className="mt-1 text-xs text-red-400/60">{session.error_message}</p>
              </div>
            )}

            {status === "pending" && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.07] py-20 text-center">
                <p className="text-sm text-white/35">Sessão aguardando análise</p>
                <button
                  onClick={async () => {
                    await api.startAnalysis(id);
                    mutateSession();
                  }}
                  className="mt-5 rounded-lg px-5 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "linear-gradient(90deg, #D4A853 0%, #E5C76B 100%)" }}
                >
                  Iniciar análise
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

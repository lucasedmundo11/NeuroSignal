"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useSessions } from "@/hooks/useSessions";
import { SessionCard } from "@/components/sessions/SessionCard";
import { UploadForm } from "@/components/sessions/UploadForm";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardPage() {
  const [showUpload, setShowUpload] = useState(false);
  const { data, isLoading, mutate } = useSessions();

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden border-b border-white/[0.05] px-6 py-14">
          {/* Iridescent orb — right side decoration */}
          <div
            className="pointer-events-none absolute -right-48 -top-48 h-[500px] w-[500px] ns-orb ns-orb-pulse"
            aria-hidden
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, #7c3aed, #D4A853, #5BCFB4, #ec4899, #3b82f6, #f97316, #7c3aed)",
                filter: "blur(90px)",
                opacity: 0.14,
              }}
            />
          </div>
          <div
            className="pointer-events-none absolute -left-24 top-8 h-64 w-64 opacity-[0.06]"
            aria-hidden
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, #D4A853 0%, #5BCFB4 50%, transparent 100%)",
                filter: "blur(50px)",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-4xl">
            <p className="mb-3 text-[10px] tracking-[0.35em] uppercase text-white/25 font-medium">
              Copiloto de IA · Análise Emocional Multimodal
            </p>
            <h1 className="text-5xl font-black uppercase tracking-tight text-white leading-none">
              Sessões
            </h1>
            <p className="mt-4 text-sm text-white/35 max-w-sm leading-relaxed">
              Carregue gravações para detectar sinais emocionais sutis e gerar insights clínicos.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs tracking-widest uppercase text-white/20">
              {isLoading ? "…" : `${data?.total ?? 0} sessão${(data?.total ?? 0) !== 1 ? "s" : ""}`}
            </p>
            <button
              onClick={() => setShowUpload((v) => !v)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(90deg, #D4A853 0%, #E5C76B 100%)" }}
            >
              {showUpload ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showUpload ? "Cancelar" : "Nova sessão"}
            </button>
          </div>

          {showUpload && (
            <div className="mb-8 rounded-xl border border-[#D4A853]/15 bg-[#0c0c0c] p-6">
              <p className="mb-5 text-[10px] tracking-[0.3em] uppercase text-white/25 font-medium">
                Enviar vídeo
              </p>
              <UploadForm
                onUploaded={() => {
                  mutate();
                  setShowUpload(false);
                }}
              />
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[88px] rounded-xl bg-[#0c0c0c] animate-pulse" />
              ))}
            </div>
          ) : !data?.items.length ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.07] py-24 text-center">
              <div
                className="mb-6 h-16 w-16 rounded-full opacity-30"
                style={{
                  background:
                    "conic-gradient(from 0deg, #7c3aed, #D4A853, #5BCFB4, #ec4899, #3b82f6, #7c3aed)",
                  filter: "blur(16px)",
                }}
                aria-hidden
              />
              <p className="text-sm text-white/35">Nenhuma sessão ainda</p>
              <p className="mt-1.5 text-xs text-white/18">
                Clique em &quot;Nova sessão&quot; para começar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.items.map((session) => (
                <SessionCard key={session.id} session={session} onDeleted={mutate} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

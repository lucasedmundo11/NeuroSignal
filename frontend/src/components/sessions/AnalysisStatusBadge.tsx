"use client";
import { cn } from "@/lib/utils";
import type { SessionStatus } from "@/types/session";

const CONFIG: Record<SessionStatus, { label: string; class: string }> = {
  pending:   { label: "Aguardando", class: "bg-white/[0.05] text-white/35 border border-white/[0.08]" },
  queued:    { label: "Na fila",    class: "bg-[#D4A853]/10 text-[#D4A853] border border-[#D4A853]/25" },
  analyzing: { label: "Analisando", class: "bg-[#D4A853]/10 text-[#D4A853] border border-[#D4A853]/25 animate-pulse" },
  complete:  { label: "Concluída",  class: "bg-[#5BCFB4]/10 text-[#5BCFB4] border border-[#5BCFB4]/25" },
  failed:    { label: "Erro",       class: "bg-red-500/10 text-red-400 border border-red-500/20" },
};

export function AnalysisStatusBadge({ status }: { status: SessionStatus }) {
  const cfg = CONFIG[status];
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide", cfg.class)}>
      {cfg.label}
    </span>
  );
}

"use client";
import { cn } from "@/lib/utils";
import type { SessionStatus } from "@/types/session";

const CONFIG: Record<SessionStatus, { label: string; class: string }> = {
  pending:   { label: "Aguardando", class: "bg-gray-800 text-gray-300" },
  queued:    { label: "Na fila",    class: "bg-yellow-900/60 text-yellow-300" },
  analyzing: { label: "Analisando", class: "bg-blue-900/60 text-blue-300 animate-pulse" },
  complete:  { label: "Concluída",  class: "bg-emerald-900/60 text-emerald-300" },
  failed:    { label: "Erro",       class: "bg-red-900/60 text-red-300" },
};

export function AnalysisStatusBadge({ status }: { status: SessionStatus }) {
  const cfg = CONFIG[status];
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", cfg.class)}>
      {cfg.label}
    </span>
  );
}

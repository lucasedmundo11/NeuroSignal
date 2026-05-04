"use client";
import { useSessionPolling } from "@/hooks/useSessionPolling";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export function AnalysisProgress({ sessionId }: { sessionId: string }) {
  const { status, progress, errorMsg } = useSessionPolling(sessionId);

  if (status === "complete") return null;
  if (status === "pending") return null;

  return (
    <div className="rounded-xl border border-white/10 bg-gray-900 p-5">
      <div className="flex items-center gap-3">
        {status === "failed" ? (
          <XCircle className="h-5 w-5 text-red-400 shrink-0" />
        ) : status === "analyzing" || status === "queued" ? (
          <Loader2 className="h-5 w-5 animate-spin text-violet-400 shrink-0" />
        ) : (
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">
            {status === "queued" && "Na fila para análise…"}
            {status === "analyzing" && `Analisando vídeo… ${progress}%`}
            {status === "failed" && "Análise falhou"}
          </p>
          {errorMsg && <p className="mt-0.5 text-xs text-red-400 truncate">{errorMsg}</p>}
        </div>
      </div>
      {(status === "analyzing" || status === "queued") && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full bg-violet-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

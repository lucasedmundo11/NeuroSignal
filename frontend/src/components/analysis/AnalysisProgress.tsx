"use client";
import { useSessionPolling } from "@/hooks/useSessionPolling";
import { Loader2, XCircle } from "lucide-react";

export function AnalysisProgress({ sessionId }: { sessionId: string }) {
  const { status, progress, errorMsg } = useSessionPolling(sessionId);

  if (status === "complete") return null;
  if (status === "pending") return null;

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0c0c0c] p-5">
      <div className="flex items-center gap-3">
        {status === "failed" ? (
          <XCircle className="h-5 w-5 text-red-400 shrink-0" />
        ) : (
          <Loader2 className="h-5 w-5 animate-spin shrink-0" style={{ color: "#D4A853" }} />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">
            {status === "queued" && "Na fila para análise…"}
            {status === "analyzing" && `Analisando vídeo… ${progress}%`}
            {status === "failed" && "Análise falhou"}
          </p>
          {errorMsg && <p className="mt-0.5 text-xs text-red-400 truncate">{errorMsg}</p>}
        </div>
        {(status === "analyzing" || status === "queued") && (
          <span className="text-xs tabular-nums text-white/30">{progress}%</span>
        )}
      </div>
      {(status === "analyzing" || status === "queued") && (
        <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #D4A853 0%, #E5C76B 100%)",
            }}
          />
        </div>
      )}
    </div>
  );
}

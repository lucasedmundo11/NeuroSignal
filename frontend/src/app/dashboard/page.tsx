"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useSessions } from "@/hooks/useSessions";
import { SessionCard } from "@/components/sessions/SessionCard";
import { UploadForm } from "@/components/sessions/UploadForm";

export default function DashboardPage() {
  const [showUpload, setShowUpload] = useState(false);
  const { data, isLoading, mutate } = useSessions();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Sessões</h1>
          <p className="mt-1 text-sm text-gray-400">
            Carregue gravações de sessões para análise emocional automática
          </p>
        </div>
        <button
          onClick={() => setShowUpload((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
        >
          {showUpload ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showUpload ? "Cancelar" : "Nova sessão"}
        </button>
      </div>

      {showUpload && (
        <div className="mb-8 rounded-xl border border-white/10 bg-gray-900 p-6">
          <h2 className="mb-4 text-base font-medium text-white">Enviar vídeo</h2>
          <UploadForm onUploaded={() => { mutate(); setShowUpload(false); }} />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-900 animate-pulse" />
          ))}
        </div>
      ) : !data?.items.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-20 text-center">
          <p className="text-gray-400">Nenhuma sessão ainda</p>
          <p className="mt-1 text-sm text-gray-600">
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
  );
}

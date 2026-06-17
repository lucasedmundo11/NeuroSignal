"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, FileVideo } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export function UploadForm({ onUploaded }: { onUploaded?: () => void }) {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
    setError(null);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    setError(null);
    try {
      const session = await api.uploadSession(file, title.trim(), description || undefined, setUploadPct);
      onUploaded?.();
      await api.startAnalysis(session.id);
      router.push(`/sessions/${session.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar vídeo";
      setError(msg);
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all duration-200",
          dragging
            ? "border-[#D4A853]/60 bg-[#D4A853]/[0.04]"
            : "border-white/[0.1] bg-black hover:border-white/20"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {file ? (
          <>
            <FileVideo className="h-10 w-10" style={{ color: "#D4A853" }} />
            <p className="mt-3 text-sm font-medium text-white">{file.name}</p>
            <p className="text-xs text-white/35">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="absolute right-3 top-3 rounded p-1 text-white/25 hover:text-white/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-white/20" />
            <p className="mt-3 text-sm text-white/40">Arraste um vídeo ou clique para selecionar</p>
            <p className="mt-1 text-xs text-white/20">MP4, MOV, AVI, WebM</p>
          </>
        )}
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título da sessão *"
        required
        className="w-full rounded-lg border border-white/[0.08] bg-black px-4 py-2.5 text-sm text-white placeholder-white/25 focus:border-[#D4A853]/50 focus:outline-none transition-colors"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição (opcional)"
        rows={2}
        className="w-full rounded-lg border border-white/[0.08] bg-black px-4 py-2.5 text-sm text-white placeholder-white/25 focus:border-[#D4A853]/50 focus:outline-none resize-none transition-colors"
      />

      {uploading && (
        <div>
          <div className="mb-2 flex justify-between text-xs text-white/35">
            <span>Enviando…</span>
            <span>{uploadPct}%</span>
          </div>
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${uploadPct}%`,
                background: "linear-gradient(90deg, #D4A853 0%, #E5C76B 100%)",
              }}
            />
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={!file || !title || uploading}
        className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: uploading || !file || !title ? "#D4A853" : "linear-gradient(90deg, #D4A853 0%, #E5C76B 100%)" }}
      >
        {uploading ? `Enviando… ${uploadPct}%` : "Enviar e analisar"}
      </button>
    </form>
  );
}

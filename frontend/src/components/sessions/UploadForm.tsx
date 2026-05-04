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
      // Auto-start analysis
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
          "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors",
          dragging
            ? "border-violet-400 bg-violet-950/20"
            : "border-white/20 bg-gray-900 hover:border-white/40"
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
            <FileVideo className="h-10 w-10 text-violet-400" />
            <p className="mt-2 text-sm font-medium text-white">{file.name}</p>
            <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="absolute right-3 top-3 rounded p-1 text-gray-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-gray-500" />
            <p className="mt-2 text-sm text-gray-400">Arraste um vídeo ou clique para selecionar</p>
            <p className="text-xs text-gray-600">MP4, MOV, AVI, WebM</p>
          </>
        )}
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título da sessão *"
        required
        className="w-full rounded-lg border border-white/10 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição (opcional)"
        rows={2}
        className="w-full rounded-lg border border-white/10 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none resize-none"
      />

      {uploading && (
        <div>
          <div className="mb-1 flex justify-between text-xs text-gray-400">
            <span>Enviando…</span><span>{uploadPct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full bg-violet-500 transition-all duration-300"
              style={{ width: `${uploadPct}%` }}
            />
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={!file || !title || uploading}
        className="w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {uploading ? "Enviando…" : "Enviar e analisar"}
      </button>
    </form>
  );
}

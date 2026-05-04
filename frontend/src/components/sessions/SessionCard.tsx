"use client";
import Link from "next/link";
import { Clock, Film, Trash2 } from "lucide-react";
import { AnalysisStatusBadge } from "./AnalysisStatusBadge";
import { formatDate, formatDuration } from "@/lib/utils";
import type { TherapySession } from "@/types/session";
import { api } from "@/lib/api";

interface Props {
  session: TherapySession;
  onDeleted: () => void;
}

export function SessionCard({ session, onDeleted }: Props) {
  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (!confirm("Excluir esta sessão?")) return;
    await api.deleteSession(session.id);
    onDeleted();
  }

  return (
    <Link
      href={`/sessions/${session.id}`}
      className="group block rounded-xl border border-white/10 bg-gray-900 p-5 hover:border-violet-500/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-white">{session.title}</p>
          {session.description && (
            <p className="mt-1 truncate text-sm text-gray-400">{session.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <AnalysisStatusBadge status={session.status} />
          <button
            onClick={handleDelete}
            className="rounded p-1 text-gray-600 hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDuration(session.duration_sec)}
        </span>
        <span className="flex items-center gap-1">
          <Film className="h-3 w-3" />
          {session.frame_count ? `${session.frame_count} frames` : "—"}
        </span>
        <span className="ml-auto">{formatDate(session.created_at)}</span>
      </div>
    </Link>
  );
}

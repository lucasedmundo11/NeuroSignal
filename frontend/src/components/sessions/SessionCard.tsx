"use client";
import Link from "next/link";
import { Clock, Film, Trash2, ArrowRight } from "lucide-react";
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
      className="group block rounded-xl border border-white/[0.07] bg-[#0c0c0c] p-5 hover:border-[#D4A853]/30 hover:bg-[#0f0e0a] transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-white group-hover:text-[#E5C76B] transition-colors">
              {session.title}
            </p>
            <ArrowRight className="h-3.5 w-3.5 text-white/0 group-hover:text-[#D4A853]/60 transition-all duration-200 shrink-0 -translate-x-1 group-hover:translate-x-0" />
          </div>
          {session.description && (
            <p className="mt-1 truncate text-sm text-white/35">{session.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <AnalysisStatusBadge status={session.status} />
          <button
            onClick={handleDelete}
            className="rounded p-1 text-white/15 hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-white/20">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          {formatDuration(session.duration_sec)}
        </span>
        <span className="flex items-center gap-1.5">
          <Film className="h-3 w-3" />
          {session.frame_count ? `${session.frame_count.toLocaleString()} frames` : "—"}
        </span>
        <span className="ml-auto">{formatDate(session.created_at)}</span>
      </div>
    </Link>
  );
}

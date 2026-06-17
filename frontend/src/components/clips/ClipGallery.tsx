"use client";
import { useState } from "react";
import useSWR from "swr";
import { api } from "@/lib/api";
import { ClipCard } from "./ClipCard";
import { EMOTION_KEYS, EMOTION_LABELS } from "@/lib/utils";
import type { ClipListResponse } from "@/types/clip";

export function ClipGallery({ sessionId }: { sessionId: string }) {
  const [emotionFilter, setEmotionFilter] = useState<string>("");

  const { data, isLoading } = useSWR<ClipListResponse>(
    `clips:${sessionId}:${emotionFilter}`,
    () => api.listClips(sessionId, undefined, emotionFilter || undefined)
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setEmotionFilter("")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 ${
            emotionFilter === ""
              ? "text-black"
              : "bg-white/[0.05] text-white/40 hover:text-white/70 hover:bg-white/[0.08]"
          }`}
          style={emotionFilter === "" ? { background: "linear-gradient(90deg, #D4A853, #E5C76B)" } : {}}
        >
          Todos
        </button>
        {EMOTION_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setEmotionFilter(key)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 ${
              emotionFilter === key
                ? "text-black"
                : "bg-white/[0.05] text-white/40 hover:text-white/70 hover:bg-white/[0.08]"
            }`}
          style={emotionFilter === key ? { background: "linear-gradient(90deg, #D4A853, #E5C76B)" } : {}}
          >
            {EMOTION_LABELS[key]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-video rounded-xl bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : !data?.items.length ? (
        <div className="flex h-32 items-center justify-center text-sm text-gray-500">
          {emotionFilter ? `Nenhum clipe de ${EMOTION_LABELS[emotionFilter as keyof typeof EMOTION_LABELS]}` : "Nenhum clipe gerado"}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((clip) => (
            <ClipCard key={clip.id} clip={clip} />
          ))}
        </div>
      )}
    </div>
  );
}

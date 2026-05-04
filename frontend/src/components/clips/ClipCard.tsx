"use client";
import { useState } from "react";
import { Play, Download } from "lucide-react";
import { EMOTION_COLORS, EMOTION_LABELS, formatMs, cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type { EmotionClip } from "@/types/clip";
import type { EmotionKey } from "@/types/emotion";

export function ClipCard({ clip }: { clip: EmotionClip }) {
  const [playing, setPlaying] = useState(false);
  const color = EMOTION_COLORS[clip.peak_emotion as EmotionKey] ?? "#6b7280";
  const label = EMOTION_LABELS[clip.peak_emotion as EmotionKey] ?? clip.peak_emotion;

  return (
    <div className="group rounded-xl border border-white/10 bg-gray-900 overflow-hidden hover:border-white/20 transition-colors">
      <div
        className="relative aspect-video bg-gray-800 cursor-pointer"
        onClick={() => setPlaying((p) => !p)}
      >
        {playing ? (
          <video
            src={api.clipDownloadUrl(clip.id)}
            autoPlay
            controls
            className="w-full h-full object-cover"
          />
        ) : clip.thumbnail_url ? (
          <>
            <img
              src={api.clipThumbnailUrl(clip.id)}
              alt={label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="h-8 w-8 text-gray-600" />
          </div>
        )}

        {/* Intensity badge */}
        <div
          className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ backgroundColor: `${color}33`, color, border: `1px solid ${color}55` }}
        >
          {label}
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>⏱ {formatMs(clip.peak_timestamp_ms)}</span>
          <span>{Math.round(clip.peak_intensity * 100)}% intensidade</span>
        </div>
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full"
            style={{ width: `${Math.round(clip.peak_intensity * 100)}%`, backgroundColor: color }}
          />
        </div>
        <a
          href={api.clipDownloadUrl(clip.id)}
          download
          onClick={(e) => e.stopPropagation()}
          className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <Download className="h-3 w-3" />
          Baixar clipe ({clip.duration_sec.toFixed(0)}s)
        </a>
      </div>
    </div>
  );
}

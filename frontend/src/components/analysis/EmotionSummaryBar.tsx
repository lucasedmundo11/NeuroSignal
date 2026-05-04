"use client";
import { EMOTION_COLORS, EMOTION_KEYS, EMOTION_LABELS } from "@/lib/utils";
import type { EmotionTimeline } from "@/types/emotion";

export function EmotionSummaryBar({ data }: { data: EmotionTimeline }) {
  if (!data.series.length) return null;

  const totals: Record<string, number> = {};
  for (const key of EMOTION_KEYS) {
    totals[key] = data.series.reduce((s, b) => s + b[key], 0) / data.series.length;
  }

  const sorted = EMOTION_KEYS.slice().sort((a, b) => totals[b] - totals[a]);

  return (
    <div className="space-y-2">
      {sorted.map((key) => (
        <div key={key} className="flex items-center gap-3">
          <span className="w-20 text-right text-xs text-gray-400 shrink-0">
            {EMOTION_LABELS[key]}
          </span>
          <div className="flex-1 h-2 rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.round(totals[key] * 100)}%`,
                backgroundColor: EMOTION_COLORS[key],
              }}
            />
          </div>
          <span className="w-10 text-xs text-gray-500">
            {Math.round(totals[key] * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}

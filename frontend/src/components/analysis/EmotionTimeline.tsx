"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { EMOTION_COLORS, EMOTION_KEYS, EMOTION_LABELS, formatMs } from "@/lib/utils";
import type { EmotionTimeline as TimelineData } from "@/types/emotion";

interface Props {
  data: TimelineData;
}

export function EmotionTimeline({ data }: Props) {
  if (!data.series.length) {
    return (
      <div className="flex h-48 items-center justify-center text-gray-500 text-sm">
        Nenhum dado emocional encontrado
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data.series} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <defs>
          {EMOTION_KEYS.map((key) => (
            <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={EMOTION_COLORS[key]} stopOpacity={0.4} />
              <stop offset="95%" stopColor={EMOTION_COLORS[key]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
        <XAxis
          dataKey="timestamp_ms"
          tickFormatter={formatMs}
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 1]}
          tickFormatter={(v) => `${Math.round(v * 100)}%`}
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#0c0c0c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}
          labelFormatter={(v) => `⏱ ${formatMs(Number(v))}`}
          formatter={(value, name) => [
            `${Math.round(Number(value) * 100)}%`,
            EMOTION_LABELS[name as keyof typeof EMOTION_LABELS] ?? String(name),
          ]}
        />
        <Legend
          formatter={(value) => EMOTION_LABELS[value as keyof typeof EMOTION_LABELS] ?? value}
          wrapperStyle={{ fontSize: 12, color: "#9ca3af" }}
        />
        {EMOTION_KEYS.map((key) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={EMOTION_COLORS[key]}
            fill={`url(#grad-${key})`}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

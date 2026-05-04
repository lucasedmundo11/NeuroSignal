import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { EmotionKey } from "@/types/emotion";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number | null): string {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatMs(ms: number): string {
  return formatDuration(ms / 1000);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

export const EMOTION_COLORS: Record<EmotionKey, string> = {
  angry: "#ef4444",
  disgust: "#84cc16",
  fear: "#8b5cf6",
  happy: "#f59e0b",
  sad: "#3b82f6",
  surprise: "#ec4899",
  neutral: "#6b7280",
};

export const EMOTION_LABELS: Record<EmotionKey, string> = {
  angry: "Raiva",
  disgust: "Repulsa",
  fear: "Medo",
  happy: "Alegria",
  sad: "Tristeza",
  surprise: "Surpresa",
  neutral: "Neutro",
};

export const EMOTION_KEYS: EmotionKey[] = [
  "angry",
  "disgust",
  "fear",
  "happy",
  "sad",
  "surprise",
  "neutral",
];

export function intensityLabel(v: number): string {
  if (v >= 0.8) return "Alto";
  if (v >= 0.55) return "Médio";
  return "Baixo";
}

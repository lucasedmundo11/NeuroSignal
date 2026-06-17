import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "NeuroSignal — Análise Emocional Clínica com IA",
  description:
    "Copiloto de IA que amplia a percepção clínica do terapeuta, identificando sinais emocionais sutis nas sessões com segurança, ética e conformidade com LGPD.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}

import Link from "next/link";
import { Brain } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-white/10 bg-gray-950 px-6 py-4">
      <nav className="mx-auto flex max-w-7xl items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-white">
          <Brain className="h-6 w-6 text-violet-400" />
          <span className="text-lg font-semibold tracking-tight">NeuroSignal</span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Sessões
          </Link>
        </div>
      </nav>
    </header>
  );
}

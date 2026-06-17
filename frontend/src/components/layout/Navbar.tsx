import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-white/[0.06] bg-black px-6 py-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <span className="text-base font-black tracking-[0.22em] uppercase text-white select-none">
            NeuroSignal
          </span>
          <span className="hidden sm:inline-flex items-center rounded-full border border-white/[0.12] px-2.5 py-0.5 text-[10px] tracking-[0.18em] uppercase text-white/30">
            Beta
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-[11px] tracking-[0.2em] uppercase text-white/35 hover:text-white/80 transition-colors"
          >
            Sessões
          </Link>
        </div>
      </nav>
    </header>
  );
}

import Link from "next/link";
import { ArrowRight, Check, Shield, Eye, TrendingUp, BarChart2, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-black text-white overflow-x-hidden">

      {/* ─── NAVBAR ─────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-base font-black tracking-[0.22em] uppercase text-white select-none">
            NeuroSignal
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "#como-funciona", label: "Como funciona" },
              { href: "#impacto",       label: "Impacto" },
              { href: "#precos",        label: "Planos" },
              { href: "#equipe",        label: "Equipe" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="text-[11px] tracking-[0.18em] uppercase text-white/35 hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-black transition-all duration-200 hover:scale-[1.02]"
            style={{ background: "linear-gradient(90deg, #D4A853 0%, #E5C76B 100%)" }}
          >
            Acessar Plataforma
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
      </header>

      {/* ─── HERO ────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="ns-orb ns-orb-pulse absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2"
            style={{
              background: "conic-gradient(from 0deg, #7c3aed, #D4A853, #5BCFB4, #ec4899, #3b82f6, #f97316, #7c3aed)",
              filter: "blur(110px)",
              opacity: 0.11,
            }}
          />
          <div className="absolute -right-40 top-0 h-96 w-96" style={{ background: "radial-gradient(circle, #D4A853 0%, transparent 70%)", filter: "blur(70px)", opacity: 0.07 }} />
          <div className="absolute -left-40 bottom-0 h-96 w-96" style={{ background: "radial-gradient(circle, #5BCFB4 0%, transparent 70%)", filter: "blur(70px)", opacity: 0.07 }} />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5BCFB4] animate-pulse inline-block" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/45">Copiloto de IA · Análise Emocional Multimodal</span>
          </div>

          <h1 className="text-[clamp(4rem,12vw,9rem)] font-black uppercase tracking-tight leading-[0.88] text-white">
            Neuro<br />Signal
          </h1>

          <p className="mt-10 text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            O copiloto de IA que amplia a percepção clínica — identificando sinais emocionais que o olho humano não consegue capturar em todos os momentos.
          </p>
          <p className="mt-4 text-sm text-white/25 max-w-lg mx-auto leading-relaxed">
            Tudo com segurança, ética, privacidade e profundo respeito à prática clínica.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-bold text-black transition-all duration-200 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#D4A853]/15"
              style={{ background: "linear-gradient(135deg, #D4A853 0%, #E5C76B 100%)" }}
            >
              Começar agora — é grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#como-funciona"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] px-8 py-4 text-sm font-semibold text-white/60 transition-all duration-200 hover:border-white/25 hover:text-white"
            >
              Ver como funciona
            </a>
          </div>

          {/* Trust bar */}
          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 justify-center">
            {["Conformidade LGPD", "Ética CFP", "Consentimento explícito", "Dados criptografados"].map((t) => (
              <span key={t} className="flex items-center gap-2 text-xs text-white/20">
                <Shield className="h-3 w-3" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROBLEM ─────────────────────────────────────────────────── */}
      <section className="relative py-32 border-t border-white/[0.05] overflow-hidden">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-8">O Problema</p>

          {/* Big statement */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.92] text-white mb-20">
            Em psicoterapia,{" "}
            <span style={{ color: "#D4A853" }}>um olhar ou pausa</span>{" "}
            pode revelar mais do que mil palavras.
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-24">
            <div>
              <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight text-white mb-5">
                Mas quantos desses sinais se perdem em cada sessão?
              </h3>
              <p className="text-sm text-white/40 leading-relaxed mb-4">
                Microexpressões, variações de tom, hesitações, gestos, fala, olhares... Nem sempre perceptíveis, nem sempre registrados.
              </p>
              <p className="text-sm text-white/40 leading-relaxed">
                Sinais emocionais sutis podem indicar o início de quadros complexos. Captar esses detalhes pode transformar a condução clínica.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.07] bg-[#0c0c0c] p-8">
              <h4 className="text-xl md:text-2xl font-black uppercase text-white mb-4 leading-tight">
                Mesmo os melhores profissionais não conseguem captar tudo.
              </h4>
              <p className="text-sm text-white/40 leading-relaxed">
                É humano. É impossível estar atento a cada microgesto, a cada nuance de voz e em todos os atendimentos. Não é uma falha — é uma limitação da atenção simultânea.
              </p>
            </div>
          </div>

          {/* Big question */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#0c0c0c] p-12 text-center">
            <h2 className="text-3xl md:text-5xl font-black uppercase leading-tight">
              E se a{" "}
              <span style={{ color: "#D4A853" }}>tecnologia ampliasse</span>{" "}
              o olhar do terapeuta,{" "}
              <span className="text-white/45">sem nunca substituir seu julgamento?</span>
            </h2>
          </div>
        </div>
      </section>

      {/* ─── STATS ───────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/[0.05]">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-3 text-center">Validação do Problema</p>
          <p className="text-sm text-white/30 text-center mb-16">Pesquisa realizada com psicólogos em exercício</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { pct: "90%", label: "gostariam de apoio analítico em sua prática clínica" },
              { pct: "80%", label: "relatam que não captam todos os sinais emocionais nas sessões", highlight: true },
              { pct: "75%", label: "considerariam pagar por uma ferramenta especializada" },
            ].map((s) => (
              <div
                key={s.pct}
                className="rounded-2xl border p-8 text-center"
                style={{ borderColor: s.highlight ? "#D4A853" + "35" : "rgba(255,255,255,0.07)", backgroundColor: s.highlight ? "#0f0e0a" : "#0c0c0c" }}
              >
                <p className="text-6xl font-black mb-3" style={{ color: "#D4A853" }}>{s.pct}</p>
                <p className="text-sm text-white/40 leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-32 border-t border-white/[0.05] scroll-mt-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-4">A Solução</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-4">Como funciona</h2>
          <p className="text-sm text-white/35 mb-20 max-w-md">Análise multimodal integrada — áudio, vídeo e texto em um só sistema.</p>

          <div className="space-y-0">
            {[
              {
                num: "01",
                title: "Captura multimodal com consentimento",
                desc: "A sessão é gravada em áudio, vídeo e texto sempre com consentimento explícito de todas as partes. Controle total do terapeuta sobre os dados capturados.",
              },
              {
                num: "02",
                title: "Análise de sinais emocionais sutis",
                desc: "Algoritmos de IA identificam microexpressões faciais, variações de tom de voz, hesitações e padrões de fala, integrando múltiplos canais simultaneamente.",
              },
              {
                num: "03",
                title: "Insights práticos para decisões clínicas",
                desc: "Relatórios com momentos-chave, clipes automáticos e sugestões acionáveis para apoiar — nunca substituir — o julgamento clínico do profissional.",
              },
              {
                num: "04",
                title: "Autonomia total do terapeuta",
                desc: "O profissional decide o que revisar, o que usar e o que descartar. O NeuroSignal é um copiloto, não um piloto automático.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="group flex gap-8 items-start border-t border-white/[0.06] py-10 hover:bg-[#0c0c0c] transition-colors px-4 -mx-4 rounded-xl"
              >
                <span className="text-5xl font-black leading-none flex-shrink-0 w-16 text-right" style={{ color: "#D4A853", opacity: 0.5 }}>
                  {step.num}
                </span>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg, #D4A853, #E5C76B)" }} />
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed max-w-xl">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMPETITIVE ADVANTAGE ───────────────────────────────────── */}
      <section className="py-32 border-t border-white/[0.05]">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-4">Diferenciais</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-4">
            Vantagem<br />Competitiva
          </h2>
          <p className="text-sm text-white/35 mb-20 max-w-md">O que torna o NeuroSignal único no mercado de saúde mental digital.</p>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: "Apoio ao profissional",
                desc: "Foco no apoio ao terapeuta, não no diagnóstico automatizado do paciente. A IA amplifica, nunca substitui o julgamento clínico.",
              },
              {
                title: "Momentos críticos em destaque",
                desc: "Destaca automaticamente os momentos mais relevantes da sessão, agilizando revisões, anotações e a produção de relatórios.",
              },
              {
                title: "Integração com prontuários",
                desc: "Pronto para conectar com prontuários eletrônicos e as plataformas de telepsicologia que você já utiliza no dia a dia.",
              },
              {
                title: "Roadmap com wearables e IoT",
                desc: "Visão de futuro: integração com wearables e dispositivos IoT para uma análise ainda mais completa do bem-estar do paciente.",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.07] bg-[#0c0c0c] p-7 hover:border-[#5BCFB4]/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="h-2 w-2 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: "#5BCFB4" }} />
                  <div>
                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border p-6" style={{ borderColor: "#5BCFB4" + "20", backgroundColor: "#5BCFB4" + "07" }}>
            <p className="text-sm text-center leading-relaxed" style={{ color: "#5BCFB4" + "bb" }}>
              <strong className="text-white">Único no mercado:</strong> Integração multimodal (áudio + vídeo + texto) focada em psicoterapia, com design pensado em ética, LGPD e prática clínica real. Controle e consentimento garantidos.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CLINICAL IMPACT ─────────────────────────────────────────── */}
      <section id="impacto" className="py-32 border-t border-white/[0.05] scroll-mt-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-4">Resultados</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-20">Impacto Clínico</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: "Percepção Aprimorada",
                desc: "Aumenta a qualidade da percepção terapêutica ao tornar visível o que antes passava despercebido nas sessões.",
                icon: Eye,
              },
              {
                title: "Continuidade do Cuidado",
                desc: "Melhora a continuidade do cuidado com base em dados longitudinais — a evolução do paciente vista de forma objetiva ao longo do tempo.",
                icon: TrendingUp,
              },
              {
                title: "Potencialização Clínica",
                desc: "Potencializa a prática clínica sem substituí-la. O NeuroSignal é um amplificador das capacidades do profissional.",
                icon: BarChart2,
              },
              {
                title: "Acompanhamento Longitudinal",
                desc: "Estimula o acompanhamento detalhado dos pacientes, revelando padrões emocionais ao longo de todo o tratamento.",
                icon: Clock,
              },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.07] bg-[#0c0c0c] p-8 hover:border-[#D4A853]/20 transition-colors">
                <div className="mb-5 h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#D4A853" + "18" }}>
                  <item.icon className="h-5 w-5" style={{ color: "#D4A853" }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOR WHO ─────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/[0.05]">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-4 text-center">Segmentos</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase text-white mb-20 text-center">Para quem é</h2>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                color: "#D4A853",
                title: "Psicólogos e Terapeutas",
                items: [
                  "Percepção clínica ampliada e mais segura",
                  "Mais tempo para o paciente, menos para anotações",
                  "Evolução longitudinal baseada em dados",
                  "Apoio analítico confiável sem substituir julgamento",
                ],
              },
              {
                color: "#5BCFB4",
                title: "Clínicas de Psicologia",
                items: [
                  "Diferenciação no mercado e inovação",
                  "Maior qualidade e consistência nos atendimentos",
                  "Gestão de sessões com dados objetivos",
                  "Integração com prontuários eletrônicos",
                ],
              },
              {
                color: "#D4A853",
                title: "RH em Empresas",
                items: [
                  "Prevenção proativa do burnout",
                  "Dados objetivos para gestão de pessoas",
                  "Aumento do engajamento e bem-estar",
                  "Decisões de saúde mental mais assertivas",
                ],
              },
            ].map((seg) => (
              <div key={seg.title} className="rounded-2xl border border-white/[0.07] bg-[#0c0c0c] p-7">
                <div className="h-1 w-10 rounded-full mb-6" style={{ backgroundColor: seg.color }} />
                <h3 className="text-base font-bold text-white mb-5">{seg.title}</h3>
                <ul className="space-y-3">
                  {seg.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/40">
                      <Check className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: seg.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─────────────────────────────────────────────────── */}
      <section id="precos" className="py-32 border-t border-white/[0.05] scroll-mt-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-4 text-center">Modelo de venda</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-4 text-center">Planos</h2>
          <p className="text-sm text-white/30 mb-20 text-center">Escolha o plano ideal para o seu momento profissional</p>

          <div className="grid md:grid-cols-3 gap-5 items-start">
            {/* Essencial */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#0c0c0c] p-7">
              <p className="text-[10px] tracking-widest uppercase text-white/30 mb-3">Essencial</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black text-white">$12</span>
                <span className="text-sm text-white/30 mb-1">/mês</span>
              </div>
              <p className="text-xs text-white/20 mb-8">Para começar com o básico</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Dashboard básico",
                  "Análise de áudio",
                  "Análise de sessões (LGPD)",
                  "10 sessões/mês",
                  "Armazenamento limitado",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/45">
                    <Check className="h-3.5 w-3.5 flex-shrink-0 text-white/25" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="block w-full rounded-xl border border-white/[0.1] py-3 text-center text-sm font-semibold text-white/50 hover:border-white/20 hover:text-white transition-colors"
              >
                Começar
              </Link>
            </div>

            {/* Avançado — highlighted */}
            <div className="rounded-2xl p-7 relative" style={{ border: "1px solid #D4A853" + "45", backgroundColor: "#0f0e0a" }}>
              <div
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-black text-black tracking-widest uppercase"
                style={{ background: "linear-gradient(90deg, #D4A853, #E5C76B)" }}
              >
                Mais popular
              </div>
              <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "#D4A853" }}>Avançado</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black text-white">$18</span>
                <span className="text-sm text-white/30 mb-1">/mês</span>
              </div>
              <p className="text-xs text-white/20 mb-8">Para profissionais exigentes</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Dashboard completo",
                  "Análise multimodal",
                  "Cortes automáticos",
                  "40 sessões/mês",
                  "Armazenamento ampliado",
                  "Treinamentos incluídos",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/65">
                    <Check className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#D4A853" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="block w-full rounded-xl py-3 text-center text-sm font-bold text-black transition-all hover:opacity-90"
                style={{ background: "linear-gradient(90deg, #D4A853, #E5C76B)" }}
              >
                Começar
              </Link>
            </div>

            {/* Profissional */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#0c0c0c] p-7">
              <p className="text-[10px] tracking-widest uppercase text-white/30 mb-3">Profissional</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black text-white">$28</span>
                <span className="text-sm text-white/30 mb-1">/mês</span>
              </div>
              <p className="text-xs text-white/20 mb-8">Para clínicas e equipes</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Dashboard avançado",
                  "Histórico do paciente",
                  "Sugestões automáticas",
                  "Sessões ilimitadas",
                  "Armazenamento ilimitado",
                  "Consultoria premium",
                  "Integrações avançadas",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/45">
                    <Check className="h-3.5 w-3.5 flex-shrink-0 text-white/25" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="block w-full rounded-xl border border-white/[0.1] py-3 text-center text-sm font-semibold text-white/50 hover:border-white/20 hover:text-white transition-colors"
              >
                Começar
              </Link>
            </div>
          </div>

          <p className="mt-8 text-xs text-white/20 text-center">
            Todos os planos incluem conformidade com LGPD, consentimento informado e suporte ético.
          </p>
        </div>
      </section>

      {/* ─── TEAM ────────────────────────────────────────────────────── */}
      <section id="equipe" className="py-32 border-t border-white/[0.05] scroll-mt-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-4 text-center">Quem somos</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-4 text-center">Equipe</h2>
          <p className="text-sm text-white/30 mb-20 text-center">FIAP · Startup One</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Lucas Silva",       role: "Engenharia de Dados",                    initials: "LS" },
              { name: "Rodrigo Pagotto",   role: "Data Science &\nArtificial Intelligence", initials: "RP" },
              { name: "William Paulo",     role: "Data Science &\nArtificial Intelligence", initials: "WP" },
              { name: "Vivian Fernandez",  role: "Advanced Marketing\nIA e Novas Tecnologias", initials: "VF" },
            ].map((m) => (
              <div key={m.name} className="text-center">
                <div
                  className="mx-auto mb-4 h-20 w-20 rounded-2xl flex items-center justify-center text-lg font-black"
                  style={{ background: "#1a1208", border: "1px solid #D4A85328" }}
                >
                  <span style={{ color: "#D4A853" }}>{m.initials}</span>
                </div>
                <p className="font-bold text-white text-sm leading-tight">{m.name}</p>
                <p className="text-[11px] text-white/30 mt-1.5 whitespace-pre-line leading-relaxed">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ───────────────────────────────────────────────── */}
      <section className="py-40 border-t border-white/[0.05] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="ns-orb absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2"
            style={{
              background: "conic-gradient(from 0deg, #7c3aed, #D4A853, #5BCFB4, #ec4899, #3b82f6, #7c3aed)",
              filter: "blur(110px)",
              opacity: 0.09,
            }}
          />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.92] text-white mb-10">
            E se a{" "}
            <span style={{ color: "#D4A853" }}>tecnologia ampliasse</span>{" "}
            o olhar do terapeuta, sem nunca substituir seu julgamento?
          </h2>
          <p className="text-white/35 text-base mb-12 max-w-xl mx-auto leading-relaxed">
            Comece gratuitamente. Sem cartão de crédito. Com total conformidade com LGPD e os princípios éticos da prática clínica.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 rounded-2xl px-10 py-5 text-base font-bold text-black transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#D4A853]/15"
            style={{ background: "linear-gradient(135deg, #D4A853 0%, #E5C76B 100%)" }}
          >
            Acessar a Plataforma
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="text-base font-black tracking-[0.22em] uppercase text-white">NeuroSignal</span>
              <p className="mt-1.5 text-xs text-white/20">Copiloto de IA para análise emocional clínica</p>
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              {["Conformidade LGPD", "Ética CFP", "Privacidade garantida", "Consentimento informado"].map((t) => (
                <span key={t} className="text-xs text-white/20">{t}</span>
              ))}
            </div>
            <p className="text-xs text-white/15">© 2026 NeuroSignal · FIAP Startup One</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

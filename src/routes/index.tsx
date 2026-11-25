import { createFileRoute, Link } from "@tanstack/react-router";
import { SimNotice } from "@/components/SiteShell";
import { localStudyStatus } from "@/lib/local-study";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SADRE 2.0 — Painel do projeto" },
      { name: "description", content: "Drenagem, reaproveitamento de água pluvial e estabilização de ruas em Fortaleza: visão geral do SADRE 2.0." },
      { property: "og:title", content: "SADRE 2.0 — Painel do projeto" },
      { property: "og:description", content: "Visão geral, objetivos e indicadores demonstrativos do SADRE 2.0." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const kpis = [
  ["Área piloto conceitual", "12.000 m²"],
  ["Chuva de projeto (exemplo)", "80 mm/evento"],
  ["Água captável estimada", "≈ 460 mil L"],
  ["Redução de escoamento (meta)", "30–50 %"],
];

const fases = [
  ["Concepção e pesquisa de anterioridade", "concluída"],
  ["Modelagem conceitual e simuladores", "concluída"],
  ["Estudo geotécnico e hidrológico local", localStudyStatus.fieldComplete ? "concluída" : localStudyStatus.documentaryComplete ? "documentação concluída · campo pendente" : "em andamento"],
  ["Protótipo em escala reduzida", "pendente"],
  ["Piloto em via de Fortaleza", "pendente"],
];

const modulos = [
  { to: "/tecnologia", t: "B · Funcionamento", d: "Camadas, materiais e limitações." },
  { to: "/simulador-chuva", t: "C · Simulador de águas pluviais", d: "Volume captável e excedente." },
  { to: "/infraestrutura", t: "D · Simulador de infraestrutura", d: "Modelos A, B e C de via." },
  { to: "/telemetria", t: "E · IoT e telemetria", d: "Sensores, alertas e bypass (simulado)." },
  { to: "/estudo-local", t: "Estudo geotécnico e hidrológico", d: "Chuva, solo e alagamentos com fontes reais." },
] as const;

function Index() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8">
        <div>
          <p className="-mt-6 py-6 text-center font-mono text-xs font-bold uppercase tracking-widest text-primary">Fortaleza · Ceará · Brasil</p>
          <div className="mt-3 -mx-4 border-4 border-accent bg-asphalt px-5 py-8 text-center text-asphalt-foreground">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">SADRE 2.0</p>
            <h1 className="mx-auto mt-2 max-w-5xl font-display text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              Sistema Adaptativo de Drenagem, Reaproveitamento e Estabilização de Ruas
            </h1>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-foreground">
            Uma proposta integrada que combina pavimento drenante, filtragem modular, reservatório
            subterrâneo e monitoramento por sensores — para transformar a chuva de problema em recurso.
          </p>
        </div>
        <div className="rounded bg-asphalt p-6 text-asphalt-foreground">
          <p className="font-mono text-xs uppercase text-accent">Referência local</p>
          <p className="mt-2 text-sm">
            O Parque Rio Branco usa infraestrutura permeável e serve como referência em Fortaleza. Ele
            não possui todas as funcionalidades propostas pelo SADRE.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded border border-border bg-card p-6">
          <h2 className="text-xl font-bold">O problema urbano</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Alagamentos recorrentes em vias públicas</li>
            <li>Interrupções no trânsito</li>
            <li>Danos ao pavimento e formação de buracos</li>
            <li>Sobrecarga da drenagem existente</li>
            <li>Desperdício de água pluvial</li>
            <li>Custos recorrentes de manutenção</li>
          </ul>
        </div>
        <div className="rounded border border-border bg-card p-6">
          <h2 className="text-xl font-bold">Objetivos</h2>
          <p className="mt-3 font-mono text-xs uppercase text-primary">Ambientais</p>
          <p className="text-sm text-muted-foreground">Reduzir escoamento superficial, recarregar com segurança, reaproveitar água não potável (irrigação, limpeza urbana).</p>
          <p className="mt-3 font-mono text-xs uppercase text-primary">Econômicos</p>
          <p className="text-sm text-muted-foreground">Prolongar a vida útil do pavimento, reduzir manutenção corretiva e custos de alagamento.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Indicadores demonstrativos</h2>
        <SimNotice>Valores simulados para ilustração. Não são resultados medidos nem garantias de desempenho.</SimNotice>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map(([l, v]) => (
            <div key={l} className="rounded border border-dashed border-primary bg-card p-4">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">SIMULADO · {l}</p>
              <p className="mt-1 text-2xl font-extrabold text-primary">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">Situação de desenvolvimento</h2>
          <ol className="mt-3 space-y-2">
            {fases.map(([f, s], i) => (
              <li key={f} className="flex items-center justify-between gap-2 rounded bg-muted px-3 py-2 text-sm">
                <span><span className="font-mono text-primary">{i + 1}.</span> {f}</span>
                <span className={`max-w-[45%] shrink-0 text-right font-mono text-[10px] uppercase ${s === "pendente" ? "text-muted-foreground" : "font-semibold text-primary"}`}>{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="text-xl font-bold">Módulos</h2>
          <div className="mt-3 space-y-3">
            {modulos.map((m) => (
              <Link key={m.to} to={m.to} className="block rounded border border-border bg-card p-4 transition hover:border-primary">
                <p className="font-bold">{m.t} →</p>
                <p className="text-sm text-muted-foreground">{m.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

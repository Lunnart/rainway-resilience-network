import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SimNotice } from "@/components/SiteShell";
import { bairrosCriticos } from "@/lib/fortaleza";
import { avaliar, LIMITES, simular, type Leitura } from "@/lib/telemetry";

export const Route = createFileRoute("/telemetria")({
  head: () => ({
    meta: [
      { title: "Telemetria e IoT — SADRE 2.0" },
      { name: "description", content: "Monitoramento simulado de reservatórios, saturação do pavimento e qualidade da água do SADRE 2.0 em Fortaleza." },
      { property: "og:title", content: "Telemetria e IoT — SADRE 2.0" },
      { property: "og:description", content: "Sensores, alertas e acionamento do bypass em pontos críticos de Fortaleza (dados simulados)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Telemetria,
});

// Leituras de partida SIMULADAS — não há sensores instalados em nenhum destes bairros.
const bases: Record<string, Leitura> = {
  barroso: { nivelPct: 50, saturacaoPct: 55, turbidezNTU: 4 },
  jangurussu: { nivelPct: 45, saturacaoPct: 50, turbidezNTU: 3.5 },
  passare: { nivelPct: 40, saturacaoPct: 45, turbidezNTU: 3 },
  "conjunto-palmeiras": { nivelPct: 35, saturacaoPct: 40, turbidezNTU: 2.5 },
  "quintino-cunha": { nivelPct: 30, saturacaoPct: 35, turbidezNTU: 2.8 },
  mondubim: { nivelPct: 25, saturacaoPct: 38, turbidezNTU: 2.2 },
  centro: { nivelPct: 20, saturacaoPct: 30, turbidezNTU: 1.8 },
  "vila-velha": { nivelPct: 38, saturacaoPct: 42, turbidezNTU: 3.2 },
  genibau: { nivelPct: 33, saturacaoPct: 36, turbidezNTU: 2.6 },
  "edson-queiroz": { nivelPct: 22, saturacaoPct: 34, turbidezNTU: 2 },
};

const sensores = [
  ["Nível do reservatório", "Ultrassônico ou de pressão hidrostática", "Indica volume armazenado e aciona o bypass."],
  ["Saturação do subleito", "Umidade capacitiva / TDR", "Detecta colmatação e risco à estrutura do pavimento."],
  ["Turbidez", "Óptico (NTU)", "Triagem preliminar antes do reúso não potável."],
  ["Comporta de bypass", "Atuador motorizado + fim de curso", "Desvia o excedente para a drenagem pública."],
  ["Pluviômetro", "Báscula", "Correlaciona chuva local e resposta do sistema."],
  ["Comunicação", "LoRaWAN ou NB-IoT", "Baixo consumo; envio periódico ao painel."],
] as const;

const cor = { normal: "bg-secondary text-secondary-foreground", atencao: "bg-accent text-accent-foreground", alerta: "bg-destructive text-destructive-foreground" };
const rotulo = { normal: "Normal", atencao: "Atenção", alerta: "Alerta" };

function Telemetria() {
  const [chuva, setChuva] = useState(0);
  const pontos = bairrosCriticos.map((b) => {
    const l = simular(bases[b.id] ?? { nivelPct: 0, saturacaoPct: 0, turbidezNTU: 0 }, chuva);
    return { b, l, r: avaliar(l) };
  });
  const alertas = pontos.filter((p) => p.r.estado !== "normal");

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase text-primary">Módulo E</p>
        <h1 className="text-3xl font-extrabold">IoT, sensores e telemetria</h1>
        <p className="max-w-3xl text-muted-foreground">O que torna o SADRE <strong>adaptativo</strong>: sensores informam nível, saturação e qualidade da água, e o sistema decide quando reter, liberar para reúso ou desviar para a drenagem pública.</p>
        <SimNotice>Painel demonstrativo. Os pontos monitorados são os bairros com mais chamados por alagamento na série da Defesa Civil de Fortaleza; as leituras e os limiares são simulados — não há sensores instalados nem dados medidos.</SimNotice>
      </header>

      <section className="space-y-3 rounded border border-border bg-card p-5">
        <label htmlFor="chuva" className="font-bold">Chuva acumulada simulada: <span className="font-mono text-primary">{chuva} mm</span></label>
        <input id="chuva" type="range" min={0} max={150} step={5} value={chuva} onChange={(e) => setChuva(Number(e.target.value))} className="w-full accent-primary" />
        <p className="text-xs text-muted-foreground">Arraste para ver como os pontos reagem a um evento de chuva.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pontos.map(({ b, l, r }) => (
          <div key={b.id} className="space-y-3 rounded border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold">{b.nome}</p>
              <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${cor[r.estado]}`}>{rotulo[r.estado]}</span>
            </div>
            <p className="text-xs text-muted-foreground">{b.via} · Modelo {b.modelo}</p>
            <p className="font-mono text-[10px] uppercase text-primary">Prioridade {b.prioridade} · {b.chamados} chamados por alagamento (2017–2026)</p>
            <Barra nome="Nível do reservatório" v={l.nivelPct} />
            <Barra nome="Saturação do subleito" v={l.saturacaoPct} />
            <p className="font-mono text-xs">Turbidez: {l.turbidezNTU} NTU</p>
            <ul className="space-y-1 font-mono text-[11px]">
              <li>Bypass: <strong>{r.bypassAberto ? "ABERTO → galeria" : "fechado"}</strong></li>
              <li>Reúso: <strong>{r.reusoLiberado ? "liberado" : "bloqueado"}</strong></li>
            </ul>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Mural de alertas</h2>
        {alertas.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum alerta no momento.</p> : (
          <ul className="space-y-2">
            {alertas.map(({ b, r }) => (
              <li key={b.id} className="rounded bg-muted px-3 py-2 text-sm">
                <strong>{b.nome}</strong> — {rotulo[r.estado]}
                {r.bypassAberto && " · excedente desviado para a drenagem pública"}
                {r.colmatacao && " · saturação elevada: inspecionar colmatação e restringir tráfego pesado"}
                {r.estado === "alerta" && " · comunicar Defesa Civil de Fortaleza"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Sensores propostos</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {sensores.map(([n, t, f]) => (
            <div key={n} className="rounded border border-border bg-card p-4">
              <p className="font-bold">{n}</p>
              <p className="font-mono text-xs text-primary">{t}</p>
              <p className="text-sm text-muted-foreground">{f}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded bg-asphalt p-5 text-sm text-asphalt-foreground">
        <p className="font-mono text-xs uppercase text-accent">Regras de decisão (ilustrativas)</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Nível ≥ {LIMITES.nivelAtencao}% → atenção; ≥ {LIMITES.nivelAlerta}% → abre bypass para a galeria.</li>
          <li>Saturação ≥ {LIMITES.saturacaoAlerta}% → alerta de colmatação/estrutura.</li>
          <li>Turbidez ≤ {LIMITES.turbidezReuso} NTU → reúso não potável liberado (triagem; não substitui análise laboratorial).</li>
        </ul>
        <p className="mt-3 text-xs">Limiares reais dependem do projeto executivo, da norma aplicável e dos ensaios de campo do <Link to="/estudo-local" className="underline">estudo local</Link>.</p>
      </section>
    </div>
  );
}

function Barra({ nome, v }: { nome: string; v: number }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-[11px]"><span>{nome}</span><span>{v}%</span></div>
      <div className="h-2 rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${v}%` }} /></div>
    </div>
  );
}

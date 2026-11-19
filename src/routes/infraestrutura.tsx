import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SimNotice } from "@/components/SiteShell";

export const Route = createFileRoute("/infraestrutura")({
  head: () => ({
    meta: [
      { title: "Simulador de infraestrutura — SADRE 2.0" },
      { name: "description", content: "Compare os modelos A, B e C do SADRE 2.0 para diferentes tipos de via em Fortaleza." },
      { property: "og:title", content: "Simulador de infraestrutura — SADRE 2.0" },
      { property: "og:description", content: "Diferenças construtivas, vantagens e limitações por tipo de via." },
    ],
  }),
  component: Infra,
});

const modelos = {
  A: {
    t: "Ruas residenciais e coletoras com alagamentos recorrentes",
    c: ["Pavimento permeável em toda a faixa ou nas faixas de estacionamento", "Reservatório modular raso sob a via", "Filtro e extravasor ligados à galeria existente"],
    v: ["Tráfego leve favorece pavimento poroso", "Obra por trechos, menor interferência", "Água para irrigação de praças próximas"],
    l: ["Depende de solo e lençol freático favoráveis", "Interferência com redes de água/esgoto rasas", "Exige limpeza periódica contra colmatação"],
    e: { custo: "Médio", prazo: "Curto a médio", reserv: "20–80 m³ por quadra" },
    a: "Bairros com pontos crônicos de alagamento e tráfego local.",
  },
  B: {
    t: "Ruas com canteiros centrais ou espaços laterais",
    c: ["Jardins de chuva e valas de biorretenção nos canteiros", "Reservatório sob o canteiro, fora da faixa de rolamento", "Pavimento convencional com sarjetas drenantes"],
    v: ["Preserva a estrutura da pista", "Infraestrutura verde e paisagismo", "Manutenção mais acessível"],
    l: ["Requer largura disponível", "Vegetação exige manejo contínuo", "Capacidade limitada pela área do canteiro"],
    e: { custo: "Baixo a médio", prazo: "Curto", reserv: "30–150 m³ por trecho" },
    a: "Avenidas arborizadas e vias com faixas laterais livres.",
  },
  C: {
    t: "Grandes avenidas e vias de tráfego intenso",
    c: ["Pista em pavimento estrutural convencional ou CPA sobre base reforçada", "Captação por bocas de lobo filtrantes e calçadas permeáveis", "Galerias-reservatório de grande porte e telemetria"],
    v: ["Maior volume de captação", "Integração com centros de controle", "Alto impacto na redução de alagamentos"],
    l: ["Cargas pesadas limitam superfícies porosas", "Custo e complexidade elevados", "Obras com grande impacto no trânsito"],
    e: { custo: "Alto", prazo: "Médio a longo", reserv: "200–1.000+ m³ por trecho" },
    a: "Corredores viários e eixos com drenagem saturada.",
  },
} as const;

type K = keyof typeof modelos;

function Infra() {
  const [k, setK] = useState<K>("A");
  const m = modelos[k];
  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-xs uppercase text-primary">Módulo D</p>
        <h1 className="text-4xl font-extrabold">Simulador de infraestrutura</h1>
        <p className="mt-2 text-muted-foreground">Nenhum modelo é solução única: a escolha depende de cada via, solo e demanda.</p>
      </header>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(modelos) as K[]).map((x) => (
          <button key={x} onClick={() => setK(x)}
            className={`rounded px-4 py-2 font-mono text-sm font-semibold ${k === x ? "bg-asphalt text-asphalt-foreground" : "bg-secondary text-secondary-foreground"}`}>
            Modelo {x}
          </button>
        ))}
      </div>
      <div className="rounded border border-border bg-card p-6">
        <h2 className="text-2xl font-bold">Modelo {k} — {m.t}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <List t="Diferenças construtivas" items={m.c} />
          <List t="Vantagens" items={m.v} />
          <List t="Limitações" items={m.l} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[["Custo relativo", m.e.custo], ["Prazo de implantação", m.e.prazo], ["Reservação típica", m.e.reserv]].map(([l, v]) => (
            <div key={l} className="rounded border border-dashed border-primary p-3">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">ESTIMATIVA CONCEITUAL · {l}</p>
              <p className="font-bold text-primary">{v}</p>
            </div>
          ))}
        </div>
        <p className="mt-6"><span className="font-semibold">Aplicação recomendada:</span> {m.a}</p>
      </div>
      <SimNotice>Estimativas conceituais e qualitativas, sem valor orçamentário. Exigem estudos de engenharia específicos.</SimNotice>
    </div>
  );
}

function List({ t, items }: { t: string; items: readonly string[] }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase text-primary">{t}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </div>
  );
}

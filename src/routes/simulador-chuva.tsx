import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SimNotice } from "@/components/SiteShell";
import { calcRain } from "@/lib/hydro";

export const Route = createFileRoute("/simulador-chuva")({
  head: () => ({
    meta: [
      { title: "Simulador de águas pluviais — SADRE 2.0" },
      { name: "description", content: "Calcule volume de chuva, volume captável e excedente para drenagem pública." },
      { property: "og:title", content: "Simulador de águas pluviais — SADRE 2.0" },
      { property: "og:description", content: "Estimativa preliminar de captação e armazenamento de água da chuva." },
    ],
  }),
  component: Sim,
});

const fmt = (n: number, d = 0) => n.toLocaleString("pt-BR", { maximumFractionDigits: d });

function Field({ label, value, onChange, step = 1, hint }: { label: string; value: number; onChange: (v: number) => void; step?: number; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input type="number" min={0} step={step} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 w-full rounded border border-input bg-background px-3 py-2 font-mono" />
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Sim() {
  const [area, setArea] = useState(1200);
  const [mm, setMm] = useState(80);
  const [c, setC] = useState(0.85);
  const [ef, setEf] = useState(70);
  const [res, setRes] = useState(50000);
  const r = calcRain({ areaM2: area, precipitacaoMm: mm, coeficiente: Math.min(c, 1), eficiencia: Math.min(ef, 100) / 100, reservatorioL: res });
  const pct = Math.min(100, r.ocupacao * 100);
  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-xs uppercase text-primary">Módulo C</p>
        <h1 className="text-4xl font-extrabold">Simulador de águas pluviais</h1>
      </header>
      <div className="grid gap-6 md:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4 rounded border border-border bg-card p-6">
          <Field label="Área de captação (m²)" value={area} onChange={setArea} />
          <Field label="Precipitação (mm)" value={mm} onChange={setMm} />
          <Field label="Coeficiente de escoamento C (0–1)" value={c} onChange={setC} step={0.05} hint="Asfalto ≈ 0,85–0,95 · permeável ≈ 0,3–0,6" />
          <Field label="Eficiência de captação (%)" value={ef} onChange={setEf} />
          <Field label="Capacidade do reservatório (L)" value={res} onChange={setRes} step={1000} />
        </div>
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Out l="Volume de chuva" v={`${fmt(r.volumeChuvaM3, 2)} m³`} s={`${fmt(r.volumeChuvaL)} L`} />
            <Out l="Volume captável" v={`${fmt(r.captavelL)} L`} s={`${fmt(r.captavelL / 1000, 2)} m³`} />
            <Out l="Armazenado no reservatório" v={`${fmt(r.armazenadoL)} L`} s={`Livre: ${fmt(r.capacidadeLivreL)} L`} />
            <Out l="Excedente → drenagem pública" v={`${fmt(r.excedenteL)} L`} s={r.excedenteL > 0 ? "Extravasor acionado" : "Sem excedente"} warn={r.excedenteL > 0} />
          </div>
          <div className="rounded border border-border bg-card p-4">
            <p className="text-sm font-semibold">Balanço: captável vs. capacidade ({fmt(r.ocupacao * 100)}%)</p>
            <div className="mt-2 h-6 overflow-hidden rounded bg-muted">
              <div className={`h-full ${r.excedenteL > 0 ? "bg-destructive" : "bg-primary"}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <p className="rounded bg-muted p-3 font-mono text-xs text-muted-foreground">
            V = A × P · Vcapt = V × C × η · Excedente = máx(0, Vcapt − Cap.)
          </p>
          <SimNotice>Estimativas preliminares. Não substituem projetos hidrológicos executivos (curvas IDF, tempo de concentração, perdas iniciais etc.).</SimNotice>
        </div>
      </div>
    </div>
  );
}

function Out({ l, v, s, warn }: { l: string; v: string; s: string; warn?: boolean }) {
  return (
    <div className={`rounded border bg-card p-4 ${warn ? "border-destructive" : "border-border"}`}>
      <p className="font-mono text-[10px] uppercase text-muted-foreground">{l}</p>
      <p className={`text-2xl font-extrabold ${warn ? "text-destructive" : "text-primary"}`}>{v}</p>
      <p className="text-xs text-muted-foreground">{s}</p>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SimNotice, Tag } from "@/components/SiteShell";

export const Route = createFileRoute("/tecnologia")({
  head: () => ({
    meta: [
      { title: "Funcionamento das camadas — SADRE 2.0" },
      { name: "description", content: "Camadas do SADRE 2.0: superfície drenante, filtragem, estrutura, reservatório, tratamento e sensores." },
      { property: "og:title", content: "Funcionamento das camadas — SADRE 2.0" },
      { property: "og:description", content: "Representação interativa das camadas e materiais do SADRE 2.0." },
    ],
  }),
  component: Tecnologia,
});

type Kind = "existente" | "adaptacao" | "pesquisa";
const camadas: { n: string; h: string; f: string; m: string[]; k: Kind; bg: string }[] = [
  { n: "Superfície drenante", h: "h-10", bg: "bg-asphalt", k: "existente", f: "Recebe a chuva e permite a infiltração rápida, reduzindo lâmina d'água na via.", m: ["Asfalto poroso (CPA)", "Concreto permeável", "Blocos intertravados drenantes"] },
  { n: "Camada filtrante", h: "h-8", bg: "bg-chart-4", k: "existente", f: "Retém sedimentos finos e parte dos poluentes antes da estrutura.", m: ["Areia graduada", "Geotêxtil não tecido", "Brita fina"] },
  { n: "Camada estrutural", h: "h-14", bg: "bg-muted-foreground", k: "adaptacao", f: "Suporta cargas do tráfego e armazena água temporariamente nos vazios.", m: ["Brita graduada aberta", "Geogrelha de reforço", "Base estabilizada"] },
  { n: "Reservatório subterrâneo", h: "h-16", bg: "bg-primary", k: "adaptacao", f: "Armazena a água captada para reaproveitamento posterior.", m: ["Módulos plásticos (caixas-celulares)", "Galerias de concreto", "Tubos de grande diâmetro"] },
  { n: "Sistema de tratamento", h: "h-8", bg: "bg-chart-2", k: "adaptacao", f: "Tratamento modular para uso não potável.", m: ["Separador água/óleo", "Filtro de areia/carvão", "Desinfecção UV ou cloração"] },
  { n: "Sensores e tubulações", h: "h-6", bg: "bg-accent", k: "pesquisa", f: "Medem nível, vazão, turbidez e acionam válvulas de forma adaptativa.", m: ["Sensor ultrassônico de nível", "Sensor de turbidez", "LoRaWAN / NB-IoT", "Válvulas motorizadas"] },
  { n: "Reaproveitamento e drenagem de segurança", h: "h-8", bg: "bg-chart-5", k: "existente", f: "Distribui água para usos não potáveis e envia o excedente à rede pública.", m: ["Extravasor (overflow)", "Ligação à galeria pluvial", "Ponto de abastecimento de caminhão-pipa"] },
];

const limites = [
  ["Infiltração", "Solos argilosos ou compactados limitam infiltração; exige ensaio de permeabilidade."],
  ["Contaminação", "Óleos, metais e resíduos viários podem contaminar o solo e o reservatório."],
  ["Lençol freático", "Lençol raso (comum em áreas litorâneas) restringe infiltração e escavação."],
  ["Tráfego pesado", "Pavimentos porosos têm menor resistência; vias de ônibus/caminhões exigem soluções híbridas."],
  ["Manutenção periódica", "Colmatação dos poros exige limpeza a vácuo/jateamento regular."],
];

function Tecnologia() {
  const [sel, setSel] = useState(0);
  const c = camadas[sel]!;
  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-xs uppercase text-primary">Módulo B</p>
        <h1 className="text-4xl font-extrabold">Funcionamento da tecnologia</h1>
        <p className="mt-2 text-muted-foreground">Clique em uma camada do corte transversal para ver função e materiais.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <div className="overflow-hidden rounded border border-border">
          <div className="bg-secondary px-3 py-2 font-mono text-xs text-secondary-foreground">☂ chuva ↓ ↓ ↓</div>
          {camadas.map((x, i) => (
            <button key={x.n} onClick={() => setSel(i)}
              className={`${x.h} ${x.bg} flex w-full items-center px-3 text-left font-mono text-xs text-primary-foreground transition ${sel === i ? "ring-4 ring-inset ring-accent" : "opacity-80 hover:opacity-100"}`}>
              <span className="rounded bg-background/80 px-1.5 text-foreground">{i + 1}. {x.n}</span>
            </button>
          ))}
        </div>
        <div className="rounded border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-2xl font-bold">{sel + 1}. {c.n}</h2>
            <Tag kind={c.k} />
          </div>
          <p className="mt-3">{c.f}</p>
          <p className="mt-4 font-mono text-xs uppercase text-primary">Materiais tecnicamente possíveis</p>
          <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">{c.m.map((m) => <li key={m}>{m}</li>)}</ul>
        </div>
      </div>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Limitações e alertas técnicos</h2>
        <SimNotice>A viabilidade depende de estudos geotécnicos, hidrológicos e ambientais locais.</SimNotice>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {limites.map(([t, d]) => (
            <div key={t} className="rounded border-l-4 border-destructive bg-card p-4">
              <p className="font-bold">{t}</p><p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

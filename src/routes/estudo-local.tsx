import { createFileRoute } from "@tanstack/react-router";
import { SimNotice } from "@/components/SiteShell";

export const Route = createFileRoute("/estudo-local")({
  head: () => ({
    meta: [
      { title: "Estudo geotécnico e hidrológico local — SADRE 2.0" },
      { name: "description", content: "Chuvas, solos, aquíferos e histórico de alagamentos de Fortaleza com dados de INMET, UFC, UECE e Prefeitura." },
      { property: "og:title", content: "Estudo geotécnico e hidrológico local — SADRE 2.0" },
      { property: "og:description", content: "Base de dados reais e fontes citadas para o SADRE 2.0 em Fortaleza." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Estudo,
});

const fontes = {
  inmet: { n: "INMET — Normais Climatológicas 1991–2020, estação Fortaleza (82397)", u: "https://clima.inmet.gov.br/NormaisClimatologicas/1991-2020/precipitacao_acumulada_mensal_anual" },
  inmetTab: { n: "Olho no Tempo — tabela das normais INMET 1991–2020 (estação 82397)", u: "https://olhonotempo.com.br/clima/fortaleza-ce" },
  funceme: { n: "FUNCEME — Calendário de Chuvas do Ceará", u: "https://chuvas.funceme.br/anual/ceara/media/" },
  abas1: { n: "Ribeiro, Cavalcante & Colares — Aspectos geológicos e hidrogeológicos da faixa costeira leste da RMF (Rev. Águas Subterrâneas/ABAS)", u: "https://aguassubterraneas.abas.org/asubterraneas/article/download/23451/15538/84958" },
  abas2: { n: "Pedrosa et al. — Ocupação das dunas em Fortaleza e impactos nas águas subterrâneas (ABAS)", u: "https://aguassubterraneas.abas.org/asubterraneas/article/download/28076/18201/103332" },
  scielo: { n: "Paisagem dunar em área urbana consolidada: Fortaleza (Sociedade & Natureza/SciELO)", u: "https://www.scielo.br/j/sn/a/zB3xpzPJQqS4JvzjCdH33Yv/?lang=pt" },
  uece: { n: "Santos, J. M. — Alagamentos e inundações em Fortaleza: análise diacrônica (UECE, 2022)", u: "https://siduece.uece.br/siduece/trabalhoAcademicoPublico.jsf?id=105878" },
  maran: { n: "Almeida & Carvalho — Inundações na bacia do rio Maranguapinho (Rev. Bras. Geomorfologia, 2010)", u: "https://rbgeomorfologia.org.br/rbg/article/download/150/144/431" },
  pmf: { n: "Prefeitura de Fortaleza — Índice de Vulnerabilidade às Mudanças Climáticas e Plano de Adaptação", u: "https://urbanismoemeioambiente.fortaleza.ce.gov.br/images/urbanismo-e-meio-ambiente/forclima/indice_de_vulnerabilidade_as_mudancas_climaticas.pdf" },
} as const;
type F = keyof typeof fontes;

const meses: [string, number][] = [
  ["Jan", 156], ["Fev", 187], ["Mar", 337], ["Abr", 385], ["Mai", 229], ["Jun", 130],
  ["Jul", 70], ["Ago", 20], ["Set", 14], ["Out", 10], ["Nov", 10], ["Dez", 37],
];
const max = 385;

function Cite({ f }: { f: F[] }) {
  return (
    <span className="font-mono text-[10px] text-muted-foreground">
      {" "}Fonte: {f.map((k, i) => (
        <span key={k}>{i > 0 && "; "}<a href={fontes[k].u} target="_blank" rel="noreferrer" className="underline hover:text-primary">{fontes[k].n.split(" — ")[0]}</a></span>
      ))}
    </span>
  );
}

function Card({ t, children }: { t: string; children: React.ReactNode }) {
  return <div className="rounded border border-border bg-card p-5"><h3 className="font-bold">{t}</h3><div className="mt-2 space-y-2 text-sm text-muted-foreground">{children}</div></div>;
}

function Estudo() {
  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-xs uppercase text-primary">Fase 3 · Base de dados</p>
        <h1 className="text-4xl font-extrabold">Estudo geotécnico e hidrológico local</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">Levantamento de dados publicados sobre chuva, solo, águas subterrâneas e alagamentos em Fortaleza, com fonte em cada informação.</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">1. Regime de chuvas</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          {[["Chuva média anual", "1.584 mm"], ["Mês mais chuvoso", "Abril · 385 mm"], ["Quadra chuvosa (fev–mai)", "≈ 1.138 mm (72%)"], ["Mês mais seco", "Out/Nov · 10 mm"]].map(([l, v]) => (
            <div key={l} className="rounded border border-border bg-card p-4">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">DADO REAL · {l}</p>
              <p className="text-xl font-extrabold text-primary">{v}</p>
            </div>
          ))}
        </div>
        <div className="rounded border border-border bg-card p-5">
          <p className="text-sm font-semibold">Chuva média mensal (mm) — normal 1991–2020</p>
          <div className="mt-4 flex h-48 items-end gap-1">
            {meses.map(([m, v]) => (
              <div key={m} className="flex flex-1 flex-col items-center justify-end gap-1">
                <span className="font-mono text-[10px]">{v}</span>
                <div className="w-full rounded-t bg-primary" style={{ height: `${(v / max) * 140}px` }} />
                <span className="font-mono text-[10px] text-muted-foreground">{m}</span>
              </div>
            ))}
          </div>
          <Cite f={["inmet", "inmetTab"]} />
        </div>
        <p className="text-sm text-muted-foreground">Leitura para o SADRE: cerca de 72% da chuva cai em quatro meses, e o segundo semestre é quase seco. O reservatório enche em poucos eventos e precisa de uso planejado (irrigação, limpeza urbana) para não ficar parado no período seco. A série anual por posto pode ser consultada na FUNCEME.<Cite f={["funceme"]} /></p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">2. Geologia, solos e águas subterrâneas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card t="Formação Barreiras">
            <p>Sedimentos terciários areno-argilosos que formam os tabuleiros costeiros. Constituem o sistema aquífero Barreiras.<Cite f={["abas1"]} /></p>
            <p><b>Implicação:</b> a fração argilosa pode reduzir a infiltração. São necessários ensaios de permeabilidade em cada local.</p>
          </Card>
          <Card t="Dunas e paleodunas">
            <p>Depósitos quaternários arenosos que formam o sistema aquífero Dunas/Paleodunas. As dunas captam águas pluviais, alimentam o lençol freático e ajudam a evitar cheias urbanas.<Cite f={["abas1", "scielo"]} /></p>
            <p><b>Implicação:</b> boa infiltração, mas o lençol freático pode estar raso e o aquífero é vulnerável a contaminação.</p>
          </Card>
          <Card t="Qualidade da água subterrânea">
            <p>Estudos registram cloretos (intrusão marinha) e nitrato (falta de saneamento) nas águas das dunas de Fortaleza.<Cite f={["abas2"]} /></p>
            <p><b>Implicação:</b> infiltrar água de rua sem filtragem pode agravar a contaminação. Isso justifica a camada filtrante e o tratamento modular.</p>
          </Card>
          <Card t="Relevo">
            <p>O sítio urbano é de topografia plana, o que dificulta o escoamento e favorece as inundações.<Cite f={["maran"]} /></p>
            <p><b>Implicação:</b> reservação local e controle do excedente ganham importância onde a declividade é baixa.</p>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">3. Histórico de alagamentos e risco</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card t="1.479 ocorrências (1983–2019)">
            <p>Levantamento no jornal O Povo, com concentração significativa na área central. As causas apontadas são a impermeabilização, a degradação da drenagem natural e a deficiência da drenagem artificial.<Cite f={["uece"]} /></p>
          </Card>
          <Card t="Bacia do rio Maranguapinho">
            <p>Ocupação de áreas sujeitas a inundação, sobretudo por população vulnerável, formando territórios de risco.<Cite f={["maran"]} /></p>
          </Card>
          <Card t="Plano municipal de adaptação">
            <p>A Prefeitura mapeou índices de risco climático e pontos críticos (hotspots) atuais e futuros, incluindo alagamentos.<Cite f={["pmf"]} /></p>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">4. O que ainda falta (estudos de campo)</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Sondagens SPT e caracterização do subleito em cada trecho-piloto.</li>
          <li>Ensaios de infiltração/permeabilidade in situ.</li>
          <li>Medição da profundidade do lençol freático na quadra chuvosa.</li>
          <li>Análise da qualidade da água escoada nas vias (óleos, metais, sólidos).</li>
          <li>Curvas IDF atualizadas e cadastro da rede de drenagem existente.</li>
        </ul>
        <SimNotice>Esta página reúne dados publicados (estudo de gabinete). Ela não substitui investigações geotécnicas e hidrológicas de campo.</SimNotice>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-bold">Referências</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {Object.values(fontes).map((f) => (
            <li key={f.u}><a href={f.u} target="_blank" rel="noreferrer" className="underline hover:text-primary">{f.n}</a></li>
          ))}
        </ol>
      </section>
    </div>
  );
}

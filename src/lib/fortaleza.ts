// Cenários de referência para Fortaleza. Valores aproximados/ilustrativos — confirmar com FUNCEME e Defesa Civil.
import { alagamentosPorBairro } from "./flood-ranking";

export type Chuva = { id: string; nome: string; mm: number; nota: string };
export const chuvas: Chuva[] = [
  { id: "moderada", nome: "Chuva moderada", mm: 30, nota: "Evento comum na quadra chuvosa (fev–mai)." },
  { id: "forte", nome: "Chuva forte", mm: 60, nota: "Já provoca pontos de alagamento em vias baixas." },
  { id: "intensa", nome: "Chuva intensa", mm: 100, nota: "Ordem de grandeza de dias extremos registrados em abril." },
  { id: "extrema", nome: "Evento extremo", mm: 150, nota: "Cenário de estresse para dimensionamento conceitual." },
];

export type Bairro = { id: string; nome: string; via: string; areaM2: number; c: number; modelo: "A" | "B" | "C" };
export const bairros: Bairro[] = [
  { id: "aldeota", nome: "Aldeota", via: "Trecho de avenida comercial", areaM2: 6000, c: 0.9, modelo: "C" },
  { id: "parangaba", nome: "Parangaba", via: "Rua coletora próxima à lagoa", areaM2: 2500, c: 0.85, modelo: "A" },
  { id: "montese", nome: "Montese", via: "Rua residencial", areaM2: 1200, c: 0.85, modelo: "A" },
  { id: "messejana", nome: "Messejana", via: "Avenida com canteiro central", areaM2: 4000, c: 0.8, modelo: "B" },
  { id: "barra", nome: "Barra do Ceará", via: "Rua residencial de baixada", areaM2: 1500, c: 0.8, modelo: "A" },
];

// Bairros com maior número de chamados por alagamento na série da Defesa Civil (2017–2026).
// A contagem vem do Observatório de Riscos Climáticos; via, área, C e modelo são hipóteses ilustrativas da equipe SADRE.
export type BairroCritico = Bairro & { chamados: number; prioridade: number };

const hipoteses: Record<string, { via: string; areaM2: number; c: number; modelo: "A" | "B" | "C" }> = {
  "Barroso": { via: "Rua residencial de baixada junto a canal", areaM2: 1500, c: 0.85, modelo: "A" },
  "Jangurussu": { via: "Via local com canal lateral", areaM2: 3000, c: 0.8, modelo: "B" },
  "Passaré": { via: "Rua residencial próxima a lagoa", areaM2: 1400, c: 0.85, modelo: "A" },
  "Conjunto Palmeiras": { via: "Rua residencial de baixada", areaM2: 1200, c: 0.85, modelo: "A" },
  "Quintino Cunha": { via: "Via local com trechos em declive", areaM2: 1600, c: 0.8, modelo: "A" },
  "Mondubim": { via: "Rua coletora com passeio estreito", areaM2: 2200, c: 0.85, modelo: "A" },
  "Centro": { via: "Via comercial pavimentada", areaM2: 4000, c: 0.9, modelo: "C" },
  "Vila Velha": { via: "Rua residencial margeando canal", areaM2: 1300, c: 0.85, modelo: "A" },
  "Genibaú": { via: "Rua coletora próxima a linha férrea", areaM2: 2000, c: 0.85, modelo: "A" },
  "Edson Queiroz": { via: "Avenida com canteiro central", areaM2: 3500, c: 0.8, modelo: "B" },
};

const slug = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const bairrosCriticos: BairroCritico[] = alagamentosPorBairro.map((b, i) => {
  const h = hipoteses[b.nome] ?? { via: "Trecho a definir", areaM2: 1200, c: 0.85, modelo: "A" as const };
  return { id: slug(b.nome), nome: b.nome, chamados: b.chamados, prioridade: i + 1, ...h };
});

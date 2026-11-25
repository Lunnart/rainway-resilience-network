// Bairros que mais sofrem com alagamentos no período chuvoso de Fortaleza.
// Dados publicados pela Defesa Civil de Fortaleza / Observatório de Riscos Climáticos (Ipplan).
// Módulo navegador-seguro: só dados literais e funções puras.

export type BairroAlagamento = { nome: string; chamados: number };

// Observatório de Riscos Climáticos de Fortaleza — Análise de ocorrências,
// filtro Tipologia = "Alagamento", período 2017–2026. Extraído em 25/11/2026.
export const alagamentosPorBairro: BairroAlagamento[] = [
  { nome: "Barroso", chamados: 73 },
  { nome: "Jangurussu", chamados: 69 },
  { nome: "Passaré", chamados: 66 },
  { nome: "Conjunto Palmeiras", chamados: 46 },
  { nome: "Quintino Cunha", chamados: 38 },
  { nome: "Mondubim", chamados: 35 },
  { nome: "Centro", chamados: 33 },
  { nome: "Vila Velha", chamados: 31 },
  { nome: "Genibaú", chamados: 30 },
  { nome: "Edson Queiroz", chamados: 28 },
];

// Total informado pela própria página para a tipologia "Alagamento" no período.
export const totalAlagamentosObservatorio = 1305;
// Soma das linhas da tabela por bairro; a diferença não é explicada pela fonte.
export const somaTabelaBairros = 1292;
export const bairrosNaTabela = 121;

// Defesa Civil, série 2012–jul/2025 — ocorrências hidrológicas
// (alagamento, inundação, deslizamento e riscos associados), conforme divulgado à imprensa.
export const hidricas2012a2025: BairroAlagamento[] = [
  { nome: "Barroso", chamados: 217 },
  { nome: "Jangurussu", chamados: 189 },
  { nome: "Genibaú", chamados: 148 },
  { nome: "Quintino Cunha", chamados: 141 },
  { nome: "Passaré", chamados: 134 },
];

// Mesmo órgão, só 2025 até julho: 287 ocorrências hidrológicas na capital.
export const hidricas2025 = { total: 287, top: [
  { nome: "Passaré", chamados: 45 },
  { nome: "Jangurussu", chamados: 24 },
  { nome: "Barroso", chamados: 19 },
  { nome: "Conjunto Palmeiras", chamados: 14 },
  { nome: "Mondubim", chamados: 13 },
] as BairroAlagamento[] };

// Concentração no período chuvoso: os chamados se acumulam entre fevereiro e abril,
// quadra chuvosa do Ceará (Calendário de Chuvas, FUNCEME).
export const quadraChuvosa = { meses: "fevereiro a abril", nota: "maior volume de chamados da série" } as const;

// Escala para as barrinhas da tabela: percentual sobre o bairro mais afetado.
export function escalaRanking(chamados: number, maior = alagamentosPorBairro[0]?.chamados ?? 0): number {
  if (!Number.isFinite(chamados) || !Number.isFinite(maior) || maior <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((chamados / maior) * 100)));
}

// Estado de evidência: a lista vem de registros de chamada, não de medição de campo do SADRE.
export const floodRankingStatus = {
  officialSource: true,
  fieldValidated: false,
} as const;

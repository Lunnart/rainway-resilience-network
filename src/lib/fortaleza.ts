// Cenários de referência para Fortaleza. Valores aproximados/ilustrativos — confirmar com FUNCEME e Defesa Civil.
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

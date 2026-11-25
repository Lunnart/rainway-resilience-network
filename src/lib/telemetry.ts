// Módulo E — lógica de alertas da telemetria SADRE. Limiares demonstrativos, não normativos.
export type Leitura = { nivelPct: number; saturacaoPct: number; turbidezNTU: number };
export type Estado = "normal" | "atencao" | "alerta";
export const LIMITES = { nivelAtencao: 70, nivelAlerta: 90, saturacaoAlerta: 85, turbidezReuso: 5 } as const;

export function avaliar(l: Leitura) {
  const estado: Estado =
    l.nivelPct >= LIMITES.nivelAlerta || l.saturacaoPct >= LIMITES.saturacaoAlerta ? "alerta"
    : l.nivelPct >= LIMITES.nivelAtencao ? "atencao" : "normal";
  return {
    estado,
    bypassAberto: l.nivelPct >= LIMITES.nivelAlerta,
    reusoLiberado: l.turbidezNTU <= LIMITES.turbidezReuso,
    colmatacao: l.saturacaoPct >= LIMITES.saturacaoAlerta,
  };
}

// Leitura simulada a partir da chuva acumulada (mm) e de uma base por ponto.
export function simular(base: Leitura, chuvaMm: number): Leitura {
  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
  return {
    nivelPct: clamp(base.nivelPct + chuvaMm * 0.6),
    saturacaoPct: clamp(base.saturacaoPct + chuvaMm * 0.35),
    turbidezNTU: Math.round((base.turbidezNTU + chuvaMm * 0.08) * 10) / 10,
  };
}

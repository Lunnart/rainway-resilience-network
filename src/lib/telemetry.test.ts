import { describe, expect, it } from "vitest";
import { avaliar } from "./telemetry";

describe("telemetria", () => {
  it("abre o bypass a partir de 90% de nível", () => {
    expect(avaliar({ nivelPct: 90, saturacaoPct: 10, turbidezNTU: 1 }).bypassAberto).toBe(true);
    expect(avaliar({ nivelPct: 89, saturacaoPct: 10, turbidezNTU: 1 }).bypassAberto).toBe(false);
  });
  it("atenção entre 70% e 90%", () => {
    expect(avaliar({ nivelPct: 70, saturacaoPct: 10, turbidezNTU: 1 }).estado).toBe("atencao");
  });
  it("alerta de colmatação com saturação ≥ 85%", () => {
    expect(avaliar({ nivelPct: 10, saturacaoPct: 85, turbidezNTU: 1 }).estado).toBe("alerta");
  });
  it("reúso só com turbidez ≤ 5 NTU", () => {
    expect(avaliar({ nivelPct: 10, saturacaoPct: 10, turbidezNTU: 5.1 }).reusoLiberado).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { localStudyStatus, piciRainfall } from "./local-study";

describe("Estudo documental local", () => {
  it("conclui a documentação sem declarar investigações de campo concluídas", () => {
    expect(localStudyStatus.documentaryComplete).toBe(true);
    expect(localStudyStatus.fieldComplete).toBe(false);
  });
  it.each([[5, 10, 254.0, 21.2], [60, 10, 77.0, 77.0], [120, 10, 48.4, 96.9], [1440, 100, 11.1, 265.3]])("reproduz a tabela CPRM para %s min e TR %s", (duration, tr, intensity, depth) => {
    const r = piciRainfall(duration, tr);
    expect(Math.abs(r.intensityMmH - intensity)).toBeLessThan(0.06);
    expect(Math.abs(r.depthMm - depth)).toBeLessThan(0.06);
  });
  it.each([[4, 10], [1441, 10], [60, 1], [60, 101], [NaN, 10]])("não extrapola a faixa publicada: %s min, TR %s", (duration, tr) => {
    expect(() => piciRainfall(duration, tr)).toThrow(RangeError);
  });
});
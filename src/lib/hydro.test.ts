import { describe, expect, it } from "vitest";
import { calcRain } from "./hydro";

describe("calcRain", () => {
  it("volume de chuva = área × precipitação", () => {
    const r = calcRain({ areaM2: 1000, precipitacaoMm: 50, coeficiente: 1, eficiencia: 1, reservatorioL: 0 });
    expect(r.volumeChuvaM3).toBe(50);
    expect(r.volumeChuvaL).toBe(50000);
  });
  it("captável aplica coeficiente e eficiência", () => {
    const r = calcRain({ areaM2: 1000, precipitacaoMm: 50, coeficiente: 0.8, eficiencia: 0.5, reservatorioL: 100000 });
    expect(r.captavelL).toBeCloseTo(20000);
    expect(r.excedenteL).toBe(0);
  });
  it("excedente vai para drenagem quando reservatório enche", () => {
    const r = calcRain({ areaM2: 1000, precipitacaoMm: 50, coeficiente: 0.8, eficiencia: 0.5, reservatorioL: 15000 });
    expect(r.armazenadoL).toBe(15000);
    expect(r.excedenteL).toBeCloseTo(5000);
  });
});

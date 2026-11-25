import { describe, expect, it } from "vitest";
import {
  alagamentosPorBairro,
  bairrosNaTabela,
  escalaRanking,
  floodRankingStatus,
  hidricas2012a2025,
  hidricas2025,
  somaTabelaBairros,
  totalAlagamentosObservatorio,
} from "./flood-ranking";

describe("Bairros que mais sofrem com alagamentos", () => {
  it("traz o ranking oficial do Observatório na ordem correta", () => {
    expect(alagamentosPorBairro[0]).toEqual({ nome: "Barroso", chamados: 73 });
    expect(alagamentosPorBairro[1]).toEqual({ nome: "Jangurussu", chamados: 69 });
    expect(alagamentosPorBairro[2]).toEqual({ nome: "Passaré", chamados: 66 });
    expect(alagamentosPorBairro.map((b) => b.nome)).toEqual([
      "Barroso", "Jangurussu", "Passaré", "Conjunto Palmeiras", "Quintino Cunha",
      "Mondubim", "Centro", "Vila Velha", "Genibaú", "Edson Queiroz",
    ]);
  });

  it("mantém a contagem da fonte sem reinventar o total", () => {
    const soma = alagamentosPorBairro.reduce((t, b) => t + b.chamados, 0);
    expect(soma).toBe(449);
    expect(somaTabelaBairros).toBe(1292);
    expect(totalAlagamentosObservatorio).toBe(1305);
    expect(bairrosNaTabela).toBe(121);
    expect(totalAlagamentosObservatorio - somaTabelaBairros).toBe(13);
  });

  it("registra a série da Defesa Civil e o recorte de 2025", () => {
    expect(hidricas2012a2025[0]).toEqual({ nome: "Barroso", chamados: 217 });
    expect(hidricas2012a2025.map((b) => b.chamados)).toEqual([217, 189, 148, 141, 134]);
    expect(hidricas2025.total).toBe(287);
    expect(hidricas2025.top[0]).toEqual({ nome: "Passaré", chamados: 45 });
  });

  it("escala as barrinhas sobre o bairro mais afetado", () => {
    expect(escalaRanking(73)).toBe(100);
    expect(escalaRanking(66)).toBe(90);
    expect(escalaRanking(28)).toBe(38);
    expect(escalaRanking(0)).toBe(0);
    expect(escalaRanking(-5)).toBe(0);
    expect(escalaRanking(9999)).toBe(100);
    expect(escalaRanking(NaN)).toBe(0);
  });

  it("não apresenta o ranking como validação de campo do SADRE", () => {
    expect(floodRankingStatus.officialSource).toBe(true);
    expect(floodRankingStatus.fieldValidated).toBe(false);
  });
});

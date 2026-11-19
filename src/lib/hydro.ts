export type RainInput = {
  areaM2: number;
  precipitacaoMm: number;
  coeficiente: number; // 0–1
  eficiencia: number; // 0–1
  reservatorioL: number;
};

export function calcRain(i: RainInput) {
  const volumeChuvaM3 = i.areaM2 * (i.precipitacaoMm / 1000);
  const volumeChuvaL = volumeChuvaM3 * 1000;
  const captavelL = volumeChuvaL * i.coeficiente * i.eficiencia;
  const armazenadoL = Math.min(captavelL, i.reservatorioL);
  const excedenteL = Math.max(0, captavelL - i.reservatorioL);
  const capacidadeLivreL = Math.max(0, i.reservatorioL - captavelL);
  const ocupacao = i.reservatorioL > 0 ? captavelL / i.reservatorioL : 0;
  return { volumeChuvaM3, volumeChuvaL, captavelL, armazenadoL, excedenteL, capacidadeLivreL, ocupacao };
}

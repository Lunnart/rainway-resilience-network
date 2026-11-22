// Farias & Pinto, CPRM (2015), Fortaleza/PICI, equações 02 e 03.
export const localStudyStatus = {
  documentaryComplete: true,
  fieldComplete: false,
} as const;

export function piciRainfall(durationMinutes: number, returnYears: number) {
  if (!Number.isFinite(durationMinutes) || !Number.isFinite(returnYears) || durationMinutes < 5 || durationMinutes > 1440 || returnYears < 2 || returnYears > 100) {
    throw new RangeError("Utilize duração de 5 a 1.440 minutos e retorno de 2 a 100 anos, faixa publicada nas tabelas do relatório.");
  }
  const t = durationMinutes / 60;
  const [a, b, c, d, delta] = t <= 1
    ? [10.2978, 16.1626, 15.5957, 33.2608, 13] as const
    : [7.7298, 10.9037, 17.6152, 36.4305, 0] as const;
  const depthMm = (a * Math.log(returnYears) + b) * Math.log(t + delta / 60) + c * Math.log(returnYears) + d;
  return { depthMm, intensityMmH: depthMm / t };
}
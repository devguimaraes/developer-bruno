import type { ChapterStep } from "./story/chapters";

/** Pontos da cena de Sobre no progresso do capítulo (0 a 1). */
export const ABOUT_TIMELINE = {
  /** Onde a troca começa: os nomes somem, a foto vai para a esquerda e a bio entra. */
  swapStart: 0.42,
  /** Fim da subida da foto, antes da troca. */
  photoSettle: 0.45,
} as const;

/** Duração da troca da foto pela bio, em segundos: é uma batida, toca no tempo. */
export const ABOUT_SWAP = 1.1;

/** Ponto da cena da troca para um progresso do capítulo: nomes e foto (0) ou bio (ABOUT_SWAP). */
export function calcAboutBeatTime(progress: number): number {
  const p = Number.isNaN(progress) ? 0 : progress;
  return p >= ABOUT_TIMELINE.swapStart ? ABOUT_SWAP : 0;
}

/** Onde o Giro deve estar e com que rosto, para um progresso do capítulo (0 a 1). */
export function calcAboutStep(progress: number): ChapterStep {
  const p = Number.isNaN(progress) ? 0 : progress;
  if (p < ABOUT_TIMELINE.swapStart) return { k: "0", stop: "sb-peek", state: "curious" };
  return { k: "1", stop: "sb-peek", state: "done" };
}

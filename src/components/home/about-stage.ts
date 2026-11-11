import type { ChapterStep } from "./story/chapters";

/** Linha do tempo da cena de Sobre, com duração total 1 (o progresso do capítulo é o tempo). */
export const ABOUT_TIMELINE = {
  /** Onde os nomes somem e a foto começa a ir para a esquerda. */
  swapStart: 0.42,
  /** Onde a foto termina de pousar à esquerda. */
  swapEnd: 0.68,
  /** Fim da subida da foto, antes da troca. */
  photoSettle: 0.45,
  /** Duração do sumiço dos nomes. */
  namesFade: 0.14,
  /** Onde a bio começa a entrar pela direita, e quanto dura. */
  bioIn: 0.52,
  bioDuration: 0.2,
} as const;

/** Onde o Giro deve estar e com que rosto, para um progresso do capítulo (0 a 1). */
export function calcAboutStep(progress: number): ChapterStep {
  const p = Number.isNaN(progress) ? 0 : progress;
  if (p < ABOUT_TIMELINE.swapStart) return { k: "0", stop: "sb-peek", state: "curious" };
  return { k: "1", stop: "sb-peek", state: "done" };
}

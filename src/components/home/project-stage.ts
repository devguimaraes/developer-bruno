import type { ChapterStep } from "./story/chapters";

export type ProjectSurface = "g-tinta" | "g-azul" | "g-papel";

/** Superfície de cada janela, na ordem dos cases. */
export const PROJECT_SURFACES: readonly ProjectSurface[] = [
  "g-tinta",
  "g-azul",
  "g-papel",
  "g-tinta",
  "g-azul",
];

export function projectSurface(index: number): ProjectSurface {
  return PROJECT_SURFACES[index % PROJECT_SURFACES.length];
}

/** Endereço para a barra da janela: sem protocolo, sem www e sem barra no fim. */
export function projectHost(url: string): string {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
}

/** Tempo em que a primeira janela entra, na linha do tempo da cena. */
export const PROJECT_T0 = 1.2;
/** Intervalo entre a entrada de uma janela e a da seguinte. */
export const PROJECT_STEP = 1.4;

export interface ProjectTimeline {
  t0: number;
  step: number;
  /** Início da virada: as janelas deitam e viram pilha. */
  tTilt: number;
  /** Duração total: a virada, os números e a passagem para tinta. */
  total: number;
}

export function projectTimeline(count: number): ProjectTimeline {
  const tTilt = PROJECT_T0 + count * PROJECT_STEP;
  return { t0: PROJECT_T0, step: PROJECT_STEP, tTilt, total: tTilt + 4 };
}

/** Quanto dura a entrada de uma janela e a virada em pilha (com os números ao lado). */
export const PROJECT_ENTER = 1;
export const PROJECT_TILT = 1.6;

/**
 * Ponto da linha do tempo em que a batida do progresso atual está completa: nenhuma janela (0),
 * a janela i assentada, ou a pilha deitada com os números. A rolagem escolhe a batida e a cena
 * toca até este ponto.
 */
export function calcProjectBeatTime(progress: number, count: number): number {
  const { t0, step, tTilt, total } = projectTimeline(count);
  const p = Number.isNaN(progress) ? 0 : Math.max(0, Math.min(1, progress));
  const t = p * total;
  if (t < t0) return 0;
  if (t >= tTilt) return tTilt + PROJECT_TILT;
  const i = Math.min(count - 1, Math.floor((t - t0) / step));
  return t0 + i * step + PROJECT_ENTER;
}

/**
 * Onde o Giro deve estar para um progresso do capítulo (0 a 1). Função pura da rolagem:
 * subir e descer dão a mesma chave.
 */
export function calcProjectStep(progress: number, count: number): ChapterStep {
  const { t0, step, tTilt, total } = projectTimeline(count);
  const p = Number.isNaN(progress) ? 0 : Math.max(0, Math.min(1, progress));
  const t = p * total;
  // Os limiares são os das batidas (calcProjectBeatTime): o Giro salta quando a cena dispara, e
  // não depois, senão ficaria no ponto do título já apagado ou numa janela que está deitando.
  if (t < t0) return { k: "t", stop: "pj-dot", state: "idle" };
  if (t >= tTilt + 3) return { k: "x", stop: "pj-exit", state: "curious" };
  if (t >= tTilt) return { k: "o", stop: "pj-out", state: "done" };
  const i = Math.min(count - 1, Math.floor((t - t0) / step));
  return { k: `pj${i}`, stop: `pj${i}`, state: "loading", after: [[820, "done"]] };
}

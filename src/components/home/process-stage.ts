import type { GiroState } from "@/components/brand/giro-states";
import type { ChapterStep } from "./story/chapters";

/** Duração da cena de Processo, em unidades da linha do tempo. */
export const PROCESS_TOTAL = 5;
/** Fim de conversa, desenho e código; depois disso é entrega. */
const STAGE_ENDS = [1.05, 2.1, 3.15] as const;
/** Ponto para onde cada estação leva, como na prancha: logo no começo de cada etapa. */
const STAGE_TARGETS = [0.25, 1.35, 2.4, 3.6] as const;
const STAGE_FACES: readonly GiroState[] = ["curious", "thinking", "loading", "celebrating"];

/** Posição de cada estação na linha, em % da largura. */
export const PROCESS_STATIONS = {
  desktop: [8, 36, 64, 92],
  mobile: [11, 37, 63, 89],
} as const;

/** Etapa (0 a 3) para um progresso do capítulo (0 a 1). */
export function calcProcessStage(progress: number): number {
  const p = Number.isNaN(progress) ? 0 : Math.max(0, Math.min(1, progress));
  const t = p * PROCESS_TOTAL;
  const i = STAGE_ENDS.findIndex(end => t < end);
  return i === -1 ? STAGE_ENDS.length : i;
}

/** Onde o Giro deve estar e com que rosto, para um progresso do capítulo. */
export function calcProcessChapterStep(progress: number): ChapterStep {
  const i = calcProcessStage(progress);
  const step: ChapterStep = { k: `pc${i}`, stop: `pc${i}`, state: STAGE_FACES[i] };
  if (i === 3) step.after = [[1600, "done"]];
  return step;
}

/** Rolagem que leva à etapa `index`, dado o topo e o comprimento rolável do capítulo. */
export function calcProcessScrollTop(index: number, chapterTop: number, chapterLen: number) {
  const i = Math.max(0, Math.min(3, Math.floor(index)));
  return chapterTop + (STAGE_TARGETS[i] / PROCESS_TOTAL) * chapterLen;
}

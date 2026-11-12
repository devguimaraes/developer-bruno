import type { GiroState } from "@/components/brand/giro-states";
import type { ChapterStep } from "./story/chapters";

/** Duração da cena de Processo, em unidades da linha do tempo. */
export const PROCESS_TOTAL = 5;
/** Fim de conversa, desenho e código; depois disso é entrega. */
const STAGE_ENDS = [1.05, 2.1, 3.15] as const;
/** Ponto para onde cada estação leva, como na prancha: logo no começo de cada etapa. */
const STAGE_TARGETS = [0.25, 1.35, 2.4, 3.6] as const;
const STAGE_FACES: readonly GiroState[] = ["curious", "thinking", "loading", "celebrating"];

/**
 * Ponto da linha do tempo em que o desenho de cada etapa está completo. A rolagem só escolhe a
 * etapa: a cena toca sozinha até este ponto, mesmo com a rolagem parada.
 */
export const PROCESS_BEATS = [0.8, 1.95, 2.9, 3.95] as const;
/** Ponto da linha do tempo da etapa `stage`; -1 é o começo, antes de o capítulo entrar. */
export function calcProcessBeatTime(stage: number): number {
  if (stage < 0) return 0;
  return PROCESS_BEATS[Math.min(PROCESS_BEATS.length - 1, Math.floor(stage))];
}

/** A Passagem da saída na linha do tempo: quando o disco começa a abrir e quanto dura. */
export const PROCESS_DISC = { at: 4.4, duration: 0.6 } as const;

/** Raio final do disco da saída, que cresce do centro do palco. */
export function calcProcessDiscRadius(viewportW: number, viewportH: number): number {
  return Math.hypot(viewportW, viewportH) * 0.56;
}

/**
 * Progresso do capítulo em que o disco da saída alcança um ponto a `dist` px do centro do palco
 * (a última estação, onde o Giro está). O disco abre com ease power2.in: raio = final * u².
 */
export function calcProcessCovered(dist: number, radius: number): number {
  const u = radius > 0 ? Math.sqrt(Math.max(0, Math.min(1, dist / radius))) : 1;
  return (PROCESS_DISC.at + PROCESS_DISC.duration * u) / PROCESS_TOTAL;
}

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
export function calcProcessChapterStep(progress: number, covered = 1): ChapterStep {
  const i = calcProcessStage(progress);
  // No fim o disco azul da saída cobre o capítulo: o Giro fica na estação, já vestido de azul.
  if (progress >= covered) {
    return { k: "pc-out", stop: "pc3", state: "done", surface: "g-azul" };
  }
  const step: ChapterStep = { k: `pc${i}`, stop: `pc${i}`, state: STAGE_FACES[i] };
  if (i === 3) step.after = [[1600, "done"]];
  return step;
}

/** Rolagem que leva à etapa `index`, dado o topo e o comprimento rolável do capítulo. */
export function calcProcessScrollTop(index: number, chapterTop: number, chapterLen: number) {
  const i = Math.max(0, Math.min(3, Math.floor(index)));
  return chapterTop + (STAGE_TARGETS[i] / PROCESS_TOTAL) * chapterLen;
}

/** Altura de tela do celular em que a prancha foi desenhada, em px. */
const MOBILE_BOARD_H = 844;

/**
 * Quanto a cena do celular sobe em telas mais baixas que a prancha, em px (0 a 100). O CSS usa a
 * mesma conta em --pc-up para subir a linha de estações e o texto da etapa.
 */
export function calcProcessLift(viewportH: number): number {
  return Math.max(0, Math.min(100, (MOBILE_BOARD_H - viewportH) * 0.6));
}

/** Câmera da pilha no celular: sobe e encolhe junto com a tela, para o texto caber embaixo. */
export function calcProcessMobileCamera(viewportW: number, viewportH: number) {
  const up = calcProcessLift(viewportH);
  return { x: viewportW / 2 + 10, y: 306 - up * 0.62, k: 0.42 - up * 0.0007 };
}

import type { GiroState } from "@/components/brand/giro-states";

/** Corte de celular das cenas: o mesmo do CSS (max-width: 768px), para cena e layout concordarem. */
export const SCENE_MOBILE_QUERY = "(max-width: 768px)";

export type ChapterSurface = "papel" | "azul" | "tinta";

export interface ChapterStep {
  /** Chave única da pose/fase dentro do capítulo. Uma troca de `k` é o único gatilho de mudança. */
  k: string;
  /** Identificador da estação/alvo do Giro (ex: "tokens", "sv-track", "pc-1"). */
  stop: string;
  /** Estado de expressão do mascote Giro. */
  state: GiroState;
  /** Transições tardias opcionais [tempoEmMs, novoEstado]. */
  after?: Array<[ms: number, state: GiroState]>;
  [key: string]: unknown;
}

export interface Chapter {
  id: string;
  label: string;
  top: number;
  len: number;
  y0: number;
  surface: ChapterSurface;
  at: (p: number) => ChapterStep;
}

export interface CreateChapterParams {
  id: string;
  label: string;
  top: number;
  len: number;
  altura?: number;
  lead?: number;
  surface: ChapterSurface;
  at: (p: number) => ChapterStep;
}

/**
 * Cria a definição de um capítulo calculando y0 a partir do topo, altura da viewport e lead.
 * y0 = top - altura * lead
 */
export function createChapter(params: CreateChapterParams): Chapter {
  const altura = params.altura ?? 900;
  const lead = params.lead ?? 0.45;
  const y0 = params.top - altura * lead;
  return {
    id: params.id,
    label: params.label,
    top: params.top,
    len: Math.max(1, params.len),
    y0,
    surface: params.surface,
    at: params.at,
  };
}

/**
 * Determina o capítulo ativo para a coordenada vertical y de rolagem.
 * O capítulo atual é o último com y >= y0.
 */
export function chapterAt(y: number, chapters: readonly Chapter[]): Chapter | undefined {
  if (chapters.length === 0) return undefined;
  let current: Chapter = chapters[0];
  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i];
    if (y >= ch.y0) {
      current = ch;
    }
  }
  return current;
}

/**
 * Calcula o progresso relativo do capítulo preso entre 0 e 1.
 * progress = min(1, max(0, (y - top) / len))
 */
export function progress(y: number, chapter: Chapter): number {
  if (chapter.len <= 0) return 0;
  const p = (y - chapter.top) / chapter.len;
  return Math.min(1, Math.max(0, p));
}

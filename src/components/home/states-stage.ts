import type { ChapterStep } from "./story/chapters";

/** Duração da abertura, em unidades da linha do tempo. */
export const OPENING_TOTAL = 10;
/** A pilha começa a fechar: o Giro da entrada passa para o HomeGiro. */
export const HAND_AT = 0.1;
/**
 * Batida da tela: a partir daqui a pilha fecha e vira a tela de exemplo, tocando no tempo até
 * SCREEN_BEAT (o ponto da linha do tempo em que a tela está montada).
 */
export const SCREEN_FROM = 0.5;
export const SCREEN_BEAT = 2.4;

/** Ponto da linha do tempo da abertura para um progresso do capítulo: pilha aberta ou tela. */
export function calcScreenBeatTime(progress: number): number {
  const t = (Number.isNaN(progress) ? 0 : progress) * OPENING_TOTAL;
  return t >= SCREEN_FROM ? SCREEN_BEAT : 0;
}

/** Faixa das quatro batidas; em BEATS_TO o Giro salta para a saída. */
export const BEATS_FROM = 2.25;
export const BEATS_TO = 9;

export type DemoState = "empty" | "loading" | "error" | "done";

export const DEMO_ORDER: readonly DemoState[] = ["empty", "loading", "error", "done"];

/**
 * Paradas da rolagem no celular, em progresso da abertura (0 a 1): a hero, a tela montada, o
 * meio de cada estado e o fim. Um gesto leva de uma à seguinte, sem pular estado.
 */
export function statesSnapPoints(): number[] {
  const span = (BEATS_TO - BEATS_FROM) / DEMO_ORDER.length;
  const beats = DEMO_ORDER.map((_, i) => (BEATS_FROM + (i + 0.5) * span) / OPENING_TOTAL);
  return [0, (SCREEN_FROM + BEATS_FROM) / 2 / OPENING_TOTAL, ...beats, 1];
}

/** Batida (0 a 3) para um progresso do capítulo (0 a 1). */
export function calcStatesBeat(progress: number): number {
  const p = Number.isNaN(progress) ? 0 : progress;
  const t = p * OPENING_TOTAL;
  const beat = Math.floor(((t - BEATS_FROM) / (BEATS_TO - BEATS_FROM)) * DEMO_ORDER.length);
  return Math.max(0, Math.min(DEMO_ORDER.length - 1, beat));
}

/** Estado que a tela de exemplo mostra por conta do roteiro, sem o visitante ter apertado nada. */
export function calcStatesScript(progress: number): DemoState {
  const t = (Number.isNaN(progress) ? 0 : progress) * OPENING_TOTAL;
  if (t < BEATS_FROM) return "empty";
  return DEMO_ORDER[calcStatesBeat(progress)];
}

// Estado que o visitante escolheu (chip ou botão). Vale até a próxima rolagem. Fica num módulo
// porque o HomeGiro lê o passo do capítulo a cada quadro, fora da árvore do React.
let override: DemoState | null = null;

export function getDemoOverride(): DemoState | null {
  return override;
}

export function setDemoOverride(state: DemoState): void {
  override = state;
}

export function clearDemoOverride(): void {
  override = null;
}

// A cena da tela ainda não voltou ao começo. Enquanto isso o Giro da história segue em cena: se a
// passagem de mão voltasse só pela rolagem, a pilha trocaria no meio da volta.
let screenBusy = false;

export function setScreenBusy(busy: boolean): void {
  screenBusy = busy;
}

function cardStep(k: string, state: DemoState): ChapterStep {
  // Em pronto o próprio Giro já pula com g-done; em erro treme com g-flinch.
  if (state === "done") return { k, stop: "card", state, surface: "g-azul" };
  if (state === "error") return { k, stop: "card", state };
  return { k, stop: "card", state, hop: true };
}

/** Onde o Giro deve estar e com que rosto, para um progresso da abertura. */
export function calcOpeningStep(progress: number): ChapterStep {
  const t = (Number.isNaN(progress) ? 0 : progress) * OPENING_TOTAL;
  if (t < HAND_AT && !screenBusy) return { k: "hand", stop: "hero", state: "done", hidden: true };
  if (t < SCREEN_FROM) return { k: "rest", stop: "hero", state: t < 0.2 ? "done" : "curious" };
  if (t >= BEATS_TO) return { k: "exit", stop: "exit", state: "curious" };
  if (override) return cardStep(`over-${override}`, override);
  // A tela de exemplo se monta onde ficava a estação da hero, e o Giro parado ali caía em cima do
  // botão Publicar. Ele já espera no assento da tela, curioso, até a primeira batida.
  if (t < BEATS_FROM) return { k: "screen", stop: "card", state: "curious" };
  const beat = calcStatesBeat(progress);
  return cardStep(`b${beat}`, DEMO_ORDER[beat]);
}

export interface DemoPress {
  next: DemoState;
  /** Segunda troca, depois de `ms`, se o visitante não rolar antes. */
  later?: { ms: number; state: DemoState };
}

/**
 * O botão da tela de exemplo. A primeira publicação sempre falha e a segunda dá certo.
 * Devolve null quando o botão não responde (carregando).
 */
export function demoPress(current: DemoState): DemoPress | null {
  if (current === "loading") return null;
  if (current === "done") return { next: "empty" };
  if (current === "error") return { next: "loading", later: { ms: 1200, state: "done" } };
  return { next: "loading", later: { ms: 1500, state: "error" } };
}

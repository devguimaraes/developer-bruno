import type { ChapterStep } from "./story/chapters";

/** Duração da abertura, em unidades da linha do tempo. */
export const OPENING_TOTAL = 10;
/** A pilha começa a fechar: o Giro da entrada passa para o HomeGiro. */
export const HAND_AT = 0.1;
/** Faixa das quatro batidas; em BEATS_TO o Giro salta para a saída. */
export const BEATS_FROM = 2.25;
export const BEATS_TO = 9;

export type DemoState = "empty" | "loading" | "error" | "done";

export const DEMO_ORDER: readonly DemoState[] = ["empty", "loading", "error", "done"];

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

function stopFor(state: DemoState): string {
  return state === "done" ? "card-done" : "card";
}

/** Onde o Giro deve estar e com que rosto, para um progresso da abertura. */
export function calcOpeningStep(progress: number): ChapterStep {
  const t = (Number.isNaN(progress) ? 0 : progress) * OPENING_TOTAL;
  if (t < HAND_AT) return { k: "hand", stop: "hero", state: "done", hidden: true };
  if (t < BEATS_FROM) return { k: "rest", stop: "hero", state: t < 0.2 ? "done" : "curious" };
  if (t >= BEATS_TO) return { k: "exit", stop: "exit", state: "curious" };
  if (override) return { k: `over-${override}`, stop: stopFor(override), state: override };
  const beat = calcStatesBeat(progress);
  const state = DEMO_ORDER[beat];
  return { k: `b${beat}`, stop: stopFor(state), state };
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

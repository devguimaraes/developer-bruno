import { useSyncExternalStore } from "react";
import type { GiroMoment } from "@/components/brand/giro-states";
import { isTypingTarget, onGiroWake } from "./useGiroEggs";

// Um ponto só decide qual momento toca no Giro da navegação. Pedido de prioridade maior
// interrompe o que está tocando; o resto espera o intervalo mínimo e é descartado (sem fila).

export type DirectedMoment = Extract<GiroMoment, "wink" | "hello" | "dizzy">;

// Durações iguais às de giro.css (g-moment).
const MOMENT_MS: Readonly<Record<DirectedMoment, number>> = {
  wink: 1720,
  hello: 2000,
  dizzy: 1400,
};
const PRIORITY: Readonly<Record<DirectedMoment, number>> = { dizzy: 3, hello: 2, wink: 1 };

/** Intervalo mínimo entre o fim de um momento e o pedido seguinte. */
const MOMENT_GAP_MS = 6000;

export interface DirectorState {
  moment: DirectedMoment | null;
  /** Até quando o momento atual toca (performance.now). */
  playingUntil: number;
  /** Até quando pedidos novos são descartados. */
  blockedUntil: number;
}

const IDLE_DIRECTOR: DirectorState = { moment: null, playingUntil: 0, blockedUntil: 0 };

/** Função pura. Devolve o novo estado ou null se o pedido for descartado. */
export function decideMoment(
  state: DirectorState,
  request: DirectedMoment,
  now: number
): DirectorState | null {
  const current = state.moment;
  if (current !== null && now < state.playingUntil) {
    if (PRIORITY[request] <= PRIORITY[current]) return null;
  } else if (now < state.blockedUntil) {
    return null;
  }
  const playingUntil = now + MOMENT_MS[request];
  return { moment: request, playingUntil, blockedUntil: playingUntil + MOMENT_GAP_MS };
}

type Listener = () => void;

const listeners = new Set<Listener>();
let director: DirectorState = IDLE_DIRECTOR;
let endTimer: ReturnType<typeof setTimeout> | null = null;

function emit(): void {
  for (const listener of listeners) listener();
}

function clearEndTimer(): void {
  if (endTimer === null) return;
  clearTimeout(endTimer);
  endTimer = null;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function endMoment(): void {
  endTimer = null;
  director = { ...director, moment: null };
  emit();
}

// Giros da navegação: a ilha no computador e o trilho no celular.
const NAV_GIRO = ".g-island .g-giro, .g-dock .g-giro";

/** Algum Giro da navegação está à vista. A ilha escondida no hero e o Giro emprestado
 * ao título não contam: o momento tocaria sem ninguém ver e gastaria o intervalo. */
function navGiroOnScreen(): boolean {
  for (const giro of document.querySelectorAll(NAV_GIRO)) {
    // Com o HomeGiro em cena o trilho mostra só o arco: o rosto que reagiria não está à vista.
    if (giro.closest('[data-stage="true"]')) continue;
    // Sem checkVisibility (Safari antes do 17.4), vale como visível.
    if (typeof giro.checkVisibility !== "function") return true;
    if (giro.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return true;
  }
  return false;
}

/** Pede um momento (relógio performance.now()). Devolve se foi aceito. */
export function requestGiroMoment(moment: DirectedMoment): boolean {
  if (prefersReducedMotion() || !navGiroOnScreen()) return false;
  const now = performance.now();
  const next = decideMoment(director, moment, now);
  if (next === null) return false;
  director = next;
  clearEndTimer();
  endTimer = setTimeout(endMoment, next.playingUntil - now);
  emit();
  return true;
}

function subscribeDirector(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getDirectedMoment(): DirectedMoment | undefined {
  return director.moment ?? undefined;
}

function getServerDirectedMoment(): undefined {
  return undefined;
}

export function useDirectedMoment(): DirectedMoment | undefined {
  return useSyncExternalStore(subscribeDirector, getDirectedMoment, getServerDirectedMoment);
}

/** Só para testes: volta ao estado inicial e limpa timers. */
export function resetGiroDirector(): void {
  clearEndTimer();
  director = IDLE_DIRECTOR;
  emit();
}

function onClick(event: MouseEvent): void {
  if (!(event.target instanceof Element)) return;
  if (event.target.closest("[data-giro-wink]")) requestGiroMoment("wink");
}

function onCopy(event: ClipboardEvent): void {
  if (isTypingTarget(event.target)) return;
  requestGiroMoment("wink");
}

// click e copy saem do document; ao acordar (cochilo ou volta da aba), o Giro diz oi.
// No servidor não há document e nada é registrado.
if (typeof document !== "undefined") {
  document.addEventListener("click", onClick);
  document.addEventListener("copy", onCopy);
  onGiroWake(() => requestGiroMoment("hello"));
}

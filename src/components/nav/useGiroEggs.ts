import { useEffect, useSyncExternalStore } from "react";
import type { GiroState } from "@/components/brand/giro-states";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Atalho escondido: digitar as letras g, i, r, o, nessa ordem, em até 1,5s.
// Vale quando o alvo do evento não é input, textarea, select nem contenteditable.
// No fim, o buffer zera. Com movimento reduzido, a sequência é ignorada.
const GIRO_SHORTCUT = "giro";
const GIRO_SHORTCUT_MS = 1500;
const PARTY_MS = 2400;
const NAP_AFTER_MS = 60_000;

export interface GiroShortcutBuffer {
  progress: string;
  startedAt: number | null;
}

export const EMPTY_GIRO_SHORTCUT: GiroShortcutBuffer = { progress: "", startedAt: null };

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target.closest("input, textarea, select")) return true;
  const editable = target.closest("[contenteditable]");
  if (!editable) return false;
  return editable.getAttribute("contenteditable") !== "false";
}

/** Avança o buffer do atalho. Não muta o buffer recebido. */
export function pushGiroShortcut(
  buffer: GiroShortcutBuffer,
  key: string,
  now: number,
  target: EventTarget | null = null
): { buffer: GiroShortcutBuffer; triggered: boolean } {
  if (isTypingTarget(target)) return { buffer, triggered: false };

  const expired = buffer.startedAt !== null && now - buffer.startedAt > GIRO_SHORTCUT_MS;
  const current = expired ? EMPTY_GIRO_SHORTCUT : buffer;
  const letter = key.toLowerCase();
  if (letter.length !== 1) return { buffer: current, triggered: false };

  const expected = GIRO_SHORTCUT.charAt(current.progress.length);
  if (letter !== expected) {
    if (letter === "g") return { buffer: { progress: "g", startedAt: now }, triggered: false };
    return { buffer: current.progress === "" ? current : EMPTY_GIRO_SHORTCUT, triggered: false };
  }

  const progress = current.progress + letter;
  if (progress === GIRO_SHORTCUT) return { buffer: EMPTY_GIRO_SHORTCUT, triggered: true };
  return { buffer: { progress, startedAt: current.startedAt ?? now }, triggered: false };
}

interface GiroEggsSnapshot {
  asleep: boolean;
  celebrating: boolean;
}

const SERVER_EGGS: GiroEggsSnapshot = { asleep: false, celebrating: false };

type Listener = () => void;

const listeners = new Set<Listener>();
let eggs: GiroEggsSnapshot = SERVER_EGGS;
let buffer: GiroShortcutBuffer = EMPTY_GIRO_SHORTCUT;
let partyTimer: ReturnType<typeof setTimeout> | null = null;
let reducedMotion = false;
let reducedHolders = 0;
let napping = false;
let lastActivity = 0;
let napTimer: ReturnType<typeof setTimeout> | null = null;
const wakeListeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function clearPartyTimer(): void {
  if (partyTimer === null) return;
  clearTimeout(partyTimer);
  partyTimer = null;
}

function suppressEggs(): void {
  clearPartyTimer();
  buffer = EMPTY_GIRO_SHORTCUT;
  if (!eggs.asleep && !eggs.celebrating) return;
  eggs = SERVER_EGGS;
  emit();
}

function eggsBlocked(): boolean {
  if (reducedMotion) return true;
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function syncAsleepFromDocument(): void {
  if (typeof document === "undefined" || eggsBlocked()) return;
  const next = document.hidden || napping;
  if (next === eggs.asleep) return;
  const woke = eggs.asleep && !next;
  eggs = { asleep: next, celebrating: eggs.celebrating };
  emit();
  if (woke) for (const listener of wakeListeners) listener();
}

function scheduleNapCheck(delay: number): void {
  if (napTimer !== null) return;
  napTimer = setTimeout(checkNap, delay);
}

// Um timer só. Se houve atividade depois do disparo, reagenda pelo tempo que falta.
function checkNap(): void {
  napTimer = null;
  const idle = performance.now() - lastActivity;
  if (idle < NAP_AFTER_MS) {
    scheduleNapCheck(NAP_AFTER_MS - idle);
    return;
  }
  if (eggsBlocked()) {
    scheduleNapCheck(NAP_AFTER_MS);
    return;
  }
  napping = true;
  syncAsleepFromDocument();
}

function registerActivity(): void {
  lastActivity = performance.now();
  if (napping) {
    napping = false;
    syncAsleepFromDocument();
  }
  scheduleNapCheck(NAP_AFTER_MS);
}

function onVisibilityChange(): void {
  if (!document.hidden) registerActivity();
  syncAsleepFromDocument();
}

export function endGiroParty(): void {
  clearPartyTimer();
  if (!eggs.celebrating) return;
  buffer = EMPTY_GIRO_SHORTCUT;
  eggs = { asleep: eggs.asleep, celebrating: false };
  emit();
}

function startParty(): void {
  if (eggsBlocked() || eggs.celebrating) return;
  clearPartyTimer();
  eggs = { asleep: eggs.asleep, celebrating: true };
  emit();
  // Sem tirar o estado, a regra de celebrating deixaria o g-party em loop.
  partyTimer = setTimeout(() => {
    partyTimer = null;
    endGiroParty();
  }, PARTY_MS);
}

function onKeyDown(event: KeyboardEvent): void {
  if (eggsBlocked()) return;
  if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
  if (typeof event.key !== "string") return;
  const result = pushGiroShortcut(buffer, event.key, performance.now(), event.target);
  buffer = result.buffer;
  if (result.triggered) startParty();
}

function onAnimationEnd(event: AnimationEvent): void {
  if (event.animationName !== "g-party") return;
  const target = event.target;
  if (!(target instanceof Element) || !target.classList.contains("g-giro__body")) return;
  endGiroParty();
}

/** Listener chamado quando o Giro acorda. Devolve a função que remove. */
export function onGiroWake(listener: () => void): () => void {
  wakeListeners.add(listener);
  return () => {
    wakeListeners.delete(listener);
  };
}

// visibilitychange, keydown, animationend e a atividade saem do document; scroll sai da window.
// No servidor não há document e nada é registrado.
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", onVisibilityChange);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("animationend", onAnimationEnd);
  for (const type of ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"]) {
    document.addEventListener(type, registerActivity, { passive: true });
  }
  window.addEventListener("scroll", registerActivity, { passive: true });
  lastActivity = performance.now();
  scheduleNapCheck(NAP_AFTER_MS);
}

function setReducedHold(hold: boolean): void {
  reducedHolders += hold ? 1 : -1;
  if (reducedHolders < 0) reducedHolders = 0;
  const next = reducedHolders > 0;
  if (next === reducedMotion) {
    if (next) suppressEggs();
    return;
  }
  reducedMotion = next;
  if (next) suppressEggs();
  else {
    // O tempo parado com movimento reduzido não conta: o cochilo espera 60 s inteiros.
    lastActivity = performance.now();
    syncAsleepFromDocument();
  }
}

function subscribeGiroEggs(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getGiroEggs(): GiroEggsSnapshot {
  return eggs;
}

function getServerGiroEggs(): GiroEggsSnapshot {
  return SERVER_EGGS;
}

export function useGiroEggs(): GiroEggsSnapshot {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setReducedHold(true);
      return () => setReducedHold(false);
    }
    syncAsleepFromDocument();
  }, [prefersReduced]);

  const snapshot = useSyncExternalStore(subscribeGiroEggs, getGiroEggs, getServerGiroEggs);
  if (prefersReduced) return SERVER_EGGS;
  return snapshot;
}

/** Prioridade do Giro na ilha e na barra. O primeiro que casa vence. */
export function resolveNavGiro(input: {
  navigating: boolean;
  celebrating: boolean;
  asleep: boolean;
  progress: number;
  pageGiro: GiroState | null;
}): { state: GiroState; hop: boolean; party: boolean } {
  if (input.navigating) return { state: "loading", hop: false, party: false };
  if (input.celebrating) return { state: "celebrating", hop: false, party: true };
  if (input.asleep) return { state: "sleeping", hop: false, party: false };
  if (input.progress >= 100) return { state: "done", hop: true, party: false };
  if (input.pageGiro !== null) return { state: input.pageGiro, hop: false, party: false };
  return { state: "idle", hop: false, party: false };
}

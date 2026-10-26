import type { GiroState } from "@/components/brand/giro-states";

type Listener = () => void;

const listeners = new Set<Listener>();
let pageGiro: GiroState | null = null;

export function getPageGiro(): GiroState | null {
  return pageGiro;
}

export function setPageGiro(next: GiroState | null): void {
  if (next === pageGiro) return;
  pageGiro = next;
  for (const listener of listeners) listener();
}

export function subscribePageGiro(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

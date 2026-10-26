import { useSyncExternalStore } from "react";

// Estado da troca de página do ClientRouter. Segue o padrão do store de locale (src/lib/i18n.ts):
// um módulo com subscribe, lido por hooks. A ilha de rolagem (desktop) e a barra de abas (celular)
// usam para girar o Giro enquanto a página nova chega. A tela de carregamento não passa por aqui.
type Listener = () => void;

const listeners = new Set<Listener>();
let navigating = false;

function setNavigating(next: boolean): void {
  if (next === navigating) return;
  navigating = next;
  for (const listener of listeners) listener();
}

export function isNavigating(): boolean {
  return navigating;
}

export function subscribeNavigating(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Os eventos do ClientRouter saem do document. O módulo é carregado uma vez por página, então
// registrar aqui basta. No servidor não há document e nada é registrado.
if (typeof document !== "undefined") {
  document.addEventListener("astro:before-preparation", () => setNavigating(true));
  document.addEventListener("astro:after-swap", () => setNavigating(false));
  document.addEventListener("astro:page-load", () => setNavigating(false));
}

/** true enquanto o ClientRouter troca de página. */
export function useNavigating(): boolean {
  return useSyncExternalStore(subscribeNavigating, isNavigating, () => false);
}

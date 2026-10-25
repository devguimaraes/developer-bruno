import { useEffect } from "react";

/** Fecha o menu com Escape e devolve o foco ao botão que o abriu. */
export function useEscapeToClose(open: boolean, close: () => void, toggleId: string): void {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      document.getElementById(toggleId)?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close, toggleId]);
}

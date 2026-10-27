import { useEffect } from "react";

/**
 * Fecha o menu aberto. Escape devolve o foco ao botão que o abriu. Clique fora, troca de página
 * e mudança de hash só fecham, porque o foco já foi para onde o usuário clicou.
 */
export function useMenuDismiss(
  open: boolean,
  close: () => void,
  toggleId: string,
  menuId: string
): void {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      document.getElementById(toggleId)?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const inside =
        document.getElementById(menuId)?.contains(target) ||
        document.getElementById(toggleId)?.contains(target);
      if (!inside) close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    // A ilha e a barra persistem entre páginas, então o menu aberto sobreviveria à troca.
    document.addEventListener("astro:before-preparation", close);
    document.addEventListener("astro:after-swap", close);
    window.addEventListener("hashchange", close);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("astro:before-preparation", close);
      document.removeEventListener("astro:after-swap", close);
      window.removeEventListener("hashchange", close);
    };
  }, [open, close, toggleId, menuId]);
}

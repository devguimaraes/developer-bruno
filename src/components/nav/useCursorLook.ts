import { type RefObject, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { LOOK_PX } from "./useScrollState";

/** Distância, em px, em que o Giro passa a olhar para o mouse. */
export const CURSOR_RADIUS_PX = 240;

type Point = { x: number; y: number };

/** Arredonda a 1 casa e troca -0 por 0, para o olhar não mudar à toa. */
function round1(value: number): number {
  const rounded = Math.round(value * 10) / 10;
  return rounded === 0 ? 0 : rounded;
}

/** Função pura: deslocamento dos olhos em direção ao ponteiro, ou null se ele estiver além do raio. */
export function cursorLook(
  center: Point,
  pointer: Point,
  radius = CURSOR_RADIUS_PX,
  maxPx = LOOK_PX
): Point | null {
  const dx = pointer.x - center.x;
  const dy = pointer.y - center.y;
  const distance = Math.hypot(dx, dy);
  if (distance > radius) return null;
  if (distance === 0) return { x: 0, y: 0 };
  return { x: round1((dx / distance) * maxPx), y: round1((dy / distance) * maxPx) };
}

function sameLook(a: Point | null, b: Point | null): boolean {
  if (a === null || b === null) return a === b;
  return a.x === b.x && a.y === b.y;
}

/** Olhar do Giro que está em `targetRef` seguindo o mouse. null quando longe, desligado ou com movimento reduzido. */
export function useCursorLook(
  targetRef: RefObject<Element | null>,
  enabled: boolean
): Point | null {
  const reducedMotion = useReducedMotion();
  const active = enabled && !reducedMotion;
  const [look, setLook] = useState<Point | null>(null);
  const shownRef = useRef<Point | null>(null);

  useEffect(() => {
    if (!active) return;

    // Só chama setState quando o olhar muda de fato.
    const show = (next: Point | null) => {
      if (sameLook(shownRef.current, next)) return;
      shownRef.current = next;
      setLook(next);
    };

    let pointer: Point | null = null;
    let frame: number | null = null;

    const measure = () => {
      frame = null;
      const target = targetRef.current;
      if (!target || !pointer) return;
      const rect = target.getBoundingClientRect();
      const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      show(cursorLook(center, pointer));
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      frame ??= requestAnimationFrame(measure);
    };

    // O mouse saiu da janela: o html recebe o leave, o document não.
    const onLeave = () => {
      pointer = null;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      show(null);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (frame !== null) cancelAnimationFrame(frame);
      show(null);
    };
  }, [active, targetRef]);

  return active ? look : null;
}

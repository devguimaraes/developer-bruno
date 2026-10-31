import { type CSSProperties, useEffect, useRef, useState } from "react";

export interface PeekPose {
  look: { x: number; y: number }; // px
  /** Duração e curva da transição dos olhos até este ponto. */
  durationMs: number;
  ease: "resolve" | "inOut";
}

/** Parado este tempo numa seção, o Giro começa a espiar. */
export const PEEK_AFTER_MS = 5000;

/** Passos da leitura, em ordem. `holdMs` é quanto esperar depois deste passo antes do próximo. */
export const PEEK_STEPS: readonly (PeekPose & { holdMs: number })[] = [
  { look: { x: -2.5, y: 0.5 }, durationMs: 340, ease: "resolve", holdMs: 400 },
  { look: { x: 3, y: 0.5 }, durationMs: 1100, ease: "inOut", holdMs: 1100 },
  { look: { x: -2.5, y: 1.5 }, durationMs: 200, ease: "resolve", holdMs: 250 },
  { look: { x: 3, y: 1.5 }, durationMs: 1100, ease: "inOut", holdMs: 1100 },
  { look: { x: -2.5, y: 2.5 }, durationMs: 200, ease: "resolve", holdMs: 250 },
  // Último passo: fica nesta pose até a próxima rolagem.
  { look: { x: 3, y: 2.5 }, durationMs: 1100, ease: "inOut", holdMs: 0 },
];

/** Espiando do Giro numa seção. Cada chave espia uma vez por mount. */
const PEEK_TILT = "3deg";
const PEEK_EASE: Record<PeekPose["ease"], string> = {
  resolve: "var(--ease-resolve)",
  inOut: "var(--g-ease-in-out)",
};

/** Chave do espiando: na home, a seção em leitura (nada no hero); fora dela, a página inteira. */
export function peekKey(pathname: string, activeId: string | null): string | null {
  return pathname === "/" ? activeId : pathname;
}

type PeekStyle = CSSProperties & { [name: `--${string}`]: string };

/** Variáveis que o Giro herda da caixa dele: tempo do passo dos olhos e a inclinação do corpo. */
export function peekStyle(peek: PeekPose | null): PeekStyle | undefined {
  if (!peek) return undefined;
  return {
    "--g-look-dur": `${peek.durationMs}ms`,
    "--g-look-ease": PEEK_EASE[peek.ease],
    "--g-tilt": PEEK_TILT,
  };
}

export function usePeek(key: string | null, enabled: boolean): PeekPose | null {
  const [peek, setPeek] = useState<{ key: string; index: number } | null>(null);
  const usedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (key === null || !enabled) return;

    let peeking = false;
    let idleTimer: number | undefined;
    let stepTimer: number | undefined;

    const showStep = (index: number) => {
      peeking = true;
      setPeek({ key, index });
      if (index + 1 < PEEK_STEPS.length) {
        stepTimer = window.setTimeout(() => showStep(index + 1), PEEK_STEPS[index].holdMs);
      }
    };

    // Reinicia a contagem. Chave já usada não agenda nada.
    const schedule = () => {
      window.clearTimeout(idleTimer);
      if (usedRef.current.has(key)) return;
      idleTimer = window.setTimeout(() => {
        usedRef.current.add(key);
        showStep(0);
      }, PEEK_AFTER_MS);
    };

    // Rolagem durante a leitura encerra o espiando. A chave já ficou gasta.
    const onScroll = () => {
      if (peeking) {
        peeking = false;
        window.clearTimeout(stepTimer);
        setPeek(null);
        return;
      }
      schedule();
    };

    schedule();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idleTimer);
      window.clearTimeout(stepTimer);
      setPeek(null);
    };
  }, [key, enabled]);

  // A pose só vale para a chave atual, mesmo antes do cleanup limpar o estado.
  if (key === null || !enabled || peek === null || peek.key !== key) return null;
  return PEEK_STEPS[peek.index];
}

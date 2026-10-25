import { useEffect, useState } from "react";
import { activeSectionAt, scrollPercent, subscribeFrames } from "./scroll";
import type { SectionTop } from "./scroll";

/** Linha de leitura: a seção em leitura é a que já passou dela, a 35% do topo da janela. */
const READ_LINE_RATIO = 0.35;
/** Um quadro com pelo menos isso de deslocamento conta como rolagem rápida. */
const FAST_STEP_PX = 60;
/** Depois da última rolagem rápida, o giro extra espera isso antes de terminar. */
const FAST_HOLD_MS = 350;

// Deslocamento dos olhos do Giro, em px, quando a rolagem tem direção ou o menu está aberto.
export const LOOK_PX = 3;

export interface ScrollState {
  /** 0 a 100. Lido da página inteira, ou só do artigo quando existe [data-reading-root]. */
  progress: number;
  /** 1 descendo, -1 subindo. Mantém o último sentido enquanto a página está parada. */
  direction: 1 | -1 | 0;
  /** true enquanto a rolagem está rápida: o Giro dá um giro a mais. */
  fast: boolean;
  /** Seção da home em leitura, ou null (no hero e nas outras páginas). */
  activeId: string | null;
  /** O hero já saiu da tela. Sem hero, vale o header da página (data-site-header). */
  pastHero: boolean;
  pathname: string;
}

const INITIAL_STATE: ScrollState = {
  progress: 0,
  direction: 0,
  fast: false,
  activeId: null,
  pastHero: false,
  pathname: "/",
};

function readSections(sectionIds: readonly string[]): SectionTop[] {
  const sections: SectionTop[] = [];
  for (const id of sectionIds) {
    const element = document.getElementById(id);
    if (element) sections.push({ id, top: element.getBoundingClientRect().top });
  }
  return sections;
}

function readProgress(): number {
  const viewport = window.innerHeight;
  const reading = document.querySelector<HTMLElement>("[data-reading-root]");
  if (reading) {
    const rect = reading.getBoundingClientRect();
    return scrollPercent(-rect.top, rect.height - viewport);
  }
  return scrollPercent(window.scrollY, document.documentElement.scrollHeight - viewport);
}

function readPastHero(): boolean {
  const anchor =
    document.getElementById("hero") ?? document.querySelector<HTMLElement>("[data-site-header]");
  // Sem âncora (a página não tem hero nem header visível), a ilha aparece direto.
  return anchor ? anchor.getBoundingClientRect().bottom <= 0 : true;
}

/** Estado da rolagem para as ilhas da navegação. Escuta a página uma vez por quadro. */
export function useScrollState(sectionIds: readonly string[]): ScrollState {
  const [state, setState] = useState<ScrollState>(INITIAL_STATE);
  const [fast, setFast] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let fastTimer: number | undefined;

    const unsubscribe = subscribeFrames(() => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;

      const progress = Math.round(readProgress());
      const activeId = activeSectionAt(
        readSections(sectionIds),
        window.innerHeight * READ_LINE_RATIO
      );
      const pastHero = readPastHero();
      const pathname = window.location.pathname;

      setState(prev => {
        const direction: ScrollState["direction"] = delta > 0 ? 1 : delta < 0 ? -1 : prev.direction;
        if (
          prev.progress === progress &&
          prev.direction === direction &&
          prev.activeId === activeId &&
          prev.pastHero === pastHero &&
          prev.pathname === pathname
        ) {
          return prev;
        }
        return { ...prev, progress, direction, activeId, pastHero, pathname };
      });

      if (Math.abs(delta) >= FAST_STEP_PX) {
        setFast(true);
        window.clearTimeout(fastTimer);
        fastTimer = window.setTimeout(() => setFast(false), FAST_HOLD_MS);
      }
    });

    return () => {
      unsubscribe();
      window.clearTimeout(fastTimer);
    };
  }, [sectionIds]);

  return { ...state, fast };
}

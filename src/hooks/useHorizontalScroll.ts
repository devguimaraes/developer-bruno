import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook que controla scroll horizontal entre seções,
 * com suporte a scroll vertical interno em seções com conteúdo longo.
 *
 * Lógica:
 * 1. Captura `wheel` events no container principal (passive: false).
 * 2. Detecta a seção ativa pelo scrollLeft atual.
 * 3. Se a seção tem um container interno scrollável (marcado via data-vertical-scroll):
 *    - Enquanto houver conteúdo para rolar verticalmente, bloqueia o scroll horizontal.
 *    - Ao atingir o topo/fim do conteúdo vertical, libera o próximo gesto para navegar horizontalmente.
 * 4. Usa scrollTo com behavior smooth para transição entre seções.
 */

interface UseHorizontalScrollOptions {
  /** Threshold mínimo de deltaY para considerar intenção de scroll (evita ruído de trackpad) */
  threshold?: number;
  /** Tolerância em px para considerar "chegou ao limite" do scroll vertical */
  edgeTolerance?: number;
}

interface UseHorizontalScrollReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  activeIndex: number;
  scrollToSection: (index: number) => void;
  totalSections: number;
}

export function useHorizontalScroll(
  sectionCount: number,
  options: UseHorizontalScrollOptions = {}
): UseHorizontalScrollReturn {
  const { threshold = 15, edgeTolerance = 2 } = options;

  const containerRef = useRef<HTMLDivElement>(null!);
  const [activeIndex, setActiveIndex] = useState(0);

  // Ref espelho do activeIndex para uso em event handlers sem stale closures
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  // Controle de estado para evitar disparos múltiplos durante animação
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Acumula delta de trackpad para detecção de intenção
  const accumulatedDeltaRef = useRef(0);
  const accumulatedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Flag para controle de "edge reached" — evita pular seção
  // no momento exato em que atinge o limite vertical
  const edgeReachedRef = useRef(false);

  /**
   * Retorna a largura real de uma seção individual.
   * Usa o primeiro filho [data-section] como referência.
   */
  const getSectionWidth = useCallback((): number => {
    const container = containerRef.current;
    if (!container) return 0;
    const firstSection = container.querySelector<HTMLElement>(':scope > [data-section]');
    return firstSection ? firstSection.offsetWidth : container.clientWidth;
  }, []);

  const scrollToSection = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container || index < 0 || index >= sectionCount) return;

    isScrollingRef.current = true;

    const sectionWidth = getSectionWidth();
    container.scrollTo({
      left: index * sectionWidth,
      behavior: 'smooth',
    });

    setActiveIndex(index);

    // Reset do estado de scrolling após a animação
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      edgeReachedRef.current = false;
      accumulatedDeltaRef.current = 0;
    }, 700);
  }, [sectionCount, getSectionWidth]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Atualiza activeIndex quando o scroll-snap resolve a posição
    const handleScroll = () => {
      const sectionWidth = getSectionWidth();
      if (sectionWidth === 0) return;
      const newIndex = Math.round(container.scrollLeft / sectionWidth);
      const clampedIndex = Math.max(0, Math.min(newIndex, sectionCount - 1));
      if (clampedIndex !== activeIndexRef.current) {
        activeIndexRef.current = clampedIndex;
        setActiveIndex(clampedIndex);
      }
    };

    /**
     * Encontra o container interno scrollável verticalmente na seção ativa.
     * Marcado com data-vertical-scroll no DOM.
     */
    const getVerticalContainer = (): HTMLElement | null => {
      const sections = container.querySelectorAll<HTMLElement>(':scope > [data-section]');
      const section = sections[activeIndexRef.current];
      if (!section) return null;
      return section.querySelector<HTMLElement>('[data-vertical-scroll]');
    };

    /**
     * Verifica se o container vertical atingiu o limite no sentido do delta.
     */
    const isAtVerticalEdge = (el: HTMLElement, deltaY: number): boolean => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (deltaY > 0) {
        // Scrollando para baixo — chegou ao fim?
        return scrollTop + clientHeight >= scrollHeight - edgeTolerance;
      }
      // Scrollando para cima — chegou ao topo?
      return scrollTop <= edgeTolerance;
    };

    const handleWheel = (e: WheelEvent) => {
      // Se está no meio de uma animação de troca de seção, bloqueia tudo
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }

      const currentIndex = activeIndexRef.current;
      const verticalContainer = getVerticalContainer();

      // ---------- Seção COM scroll vertical interno ----------
      if (verticalContainer && verticalContainer.scrollHeight > verticalContainer.clientHeight + edgeTolerance) {
        const atEdge = isAtVerticalEdge(verticalContainer, e.deltaY);

        if (!atEdge) {
          // Ainda tem conteúdo vertical para rolar — deixa o scroll acontecer
          // no container interno e bloqueia o horizontal
          edgeReachedRef.current = false;
          // Não previne default: o browser vai rolar o container interno
          return;
        }

        // Atingiu o limite vertical
        if (!edgeReachedRef.current) {
          // Primeiro evento no limite: marca e consome o evento
          // (evita "pular" instantaneamente para a próxima seção)
          edgeReachedRef.current = true;
          e.preventDefault();
          return;
        }

        // Já estava no limite e continuou scrollando → libera para horizontal
        e.preventDefault();

        const absDelta = Math.abs(e.deltaY);
        if (absDelta < threshold) return;

        const direction = e.deltaY > 0 ? 1 : -1;
        const nextIndex = currentIndex + direction;
        if (nextIndex >= 0 && nextIndex < sectionCount) {
          scrollToSection(nextIndex);
        }
        return;
      }

      // ---------- Seção SEM scroll vertical ----------
      e.preventDefault();

      // Para trackpad, acumula delta para detectar intenção real
      accumulatedDeltaRef.current += e.deltaY;
      if (accumulatedTimeoutRef.current) clearTimeout(accumulatedTimeoutRef.current);
      accumulatedTimeoutRef.current = setTimeout(() => {
        accumulatedDeltaRef.current = 0;
      }, 150);

      const absAccumulated = Math.abs(accumulatedDeltaRef.current);
      if (absAccumulated < threshold) return;

      const direction = accumulatedDeltaRef.current > 0 ? 1 : -1;
      const nextIndex = currentIndex + direction;

      if (nextIndex >= 0 && nextIndex < sectionCount) {
        accumulatedDeltaRef.current = 0;
        scrollToSection(nextIndex);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (accumulatedTimeoutRef.current) clearTimeout(accumulatedTimeoutRef.current);
    };
  // Registra listeners uma única vez — usa refs para estado atualizado
   
  }, [sectionCount, threshold, edgeTolerance, scrollToSection, getSectionWidth]);

  return {
    containerRef,
    activeIndex,
    scrollToSection,
    totalSections: sectionCount,
  };
}

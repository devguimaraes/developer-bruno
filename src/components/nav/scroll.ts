export interface SectionTop {
  id: string;
  /** Distância do topo da seção até o topo da janela, em px. */
  top: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Progresso de 0 a 100 de uma faixa de rolagem. Se a faixa não existe (o conteúdo cabe na tela),
 * ele já está lido assim que a página é mostrada.
 */
export function scrollPercent(scrolled: number, range: number): number {
  if (range <= 0) return scrolled >= 0 ? 100 : 0;
  return clamp((scrolled / range) * 100, 0, 100);
}

/**
 * Seção em leitura: a que começou mais perto da linha de leitura sem tê-la passado do outro lado.
 * Seções abaixo da linha ainda não foram alcançadas, então não contam.
 */
export function activeSectionAt(sections: readonly SectionTop[], readLine: number): string | null {
  let activeId: string | null = null;
  let activeTop = Number.NEGATIVE_INFINITY;
  for (const section of sections) {
    if (section.top <= readLine && section.top > activeTop) {
      activeId = section.id;
      activeTop = section.top;
    }
  }
  return activeId;
}

/**
 * Chama `onFrame` no máximo uma vez por quadro enquanto a página rola, muda de tamanho ou troca
 * de rota (o ClientRouter dispara astro:page-load). Devolve a função que desfaz tudo.
 */
export function subscribeFrames(onFrame: () => void): () => void {
  let frame = 0;
  const schedule = () => {
    if (frame !== 0) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      onFrame();
    });
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  document.addEventListener("astro:page-load", schedule);
  schedule();

  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    document.removeEventListener("astro:page-load", schedule);
    if (frame !== 0) window.cancelAnimationFrame(frame);
  };
}

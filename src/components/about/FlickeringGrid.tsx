import { useEffect, useRef } from "react";

// Mesmos parâmetros do Flickering Grid da referência (ADR 0001, revisão de 15 de novembro de 2026).
const SQUARE_PX = 4;
const GAP_PX = 6;
const STEP_PX = SQUARE_PX + GAP_PX;
const MAX_OPACITY = 0.3;
/** Chance de um quadrado trocar de opacidade, por segundo. */
const FLICKER_PER_SECOND = 0.3;
/** Um quadro mais longo que isso (aba voltando) não faz a grade inteira trocar de uma vez. */
const MAX_FRAME_S = 0.1;

/**
 * Faixa decorativa de quadrados que piscam ao acaso. Para com movimento reduzido, fora da tela
 * e com a aba escondida. A cor vem do `color` do próprio canvas, no CSS.
 */
export function FlickeringGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // O jsdom não tem contexto 2D: sem ele não há o que desenhar.
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let ratio = 1;
    let cells = new Float32Array(0);
    let color = "";
    let frameId: number | null = null;
    let last = 0;
    let onScreen = true;

    function setup() {
      if (!canvas) return;
      ratio = window.devicePixelRatio || 1;
      color = getComputedStyle(canvas).color;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      columns = Math.ceil(width / STEP_PX);
      rows = Math.ceil(height / STEP_PX);
      cells = new Float32Array(columns * rows);
      for (let i = 0; i < cells.length; i += 1) cells[i] = Math.random() * MAX_OPACITY;
    }

    function draw() {
      if (!canvas || !context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = color;
      for (let x = 0; x < columns; x += 1) {
        for (let y = 0; y < rows; y += 1) {
          context.globalAlpha = cells[x * rows + y] ?? 0;
          context.fillRect(
            x * STEP_PX * ratio,
            y * STEP_PX * ratio,
            SQUARE_PX * ratio,
            SQUARE_PX * ratio
          );
        }
      }
      context.globalAlpha = 1;
    }

    function frame(time: number) {
      const elapsed = Math.min((time - last) / 1000, MAX_FRAME_S);
      last = time;
      for (let i = 0; i < cells.length; i += 1) {
        if (Math.random() < FLICKER_PER_SECOND * elapsed) cells[i] = Math.random() * MAX_OPACITY;
      }
      draw();
      frameId = requestAnimationFrame(frame);
    }

    function stop() {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
    }

    function sync() {
      const shouldRun = !motionQuery.matches && onScreen && !document.hidden;
      if (shouldRun && frameId === null) {
        last = performance.now();
        frameId = requestAnimationFrame(frame);
      } else if (!shouldRun) {
        stop();
      }
    }

    setup();
    draw();

    const resizeObserver = new ResizeObserver(() => {
      if (canvas.clientWidth === width && canvas.clientHeight === height) return;
      setup();
      draw();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(entries => {
      onScreen = entries.some(entry => entry.isIntersecting);
      sync();
    });
    intersectionObserver.observe(canvas);

    document.addEventListener("visibilitychange", sync);
    motionQuery.addEventListener("change", sync);
    sync();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  // O canvas preenche a moldura (CSS de quem usa). A moldura esconde a faixa do leitor de tela.
  return (
    <div className={className} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

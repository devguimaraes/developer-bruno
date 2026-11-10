export type SurfaceClass = "g-azul" | "g-papel" | "g-tinta";

/**
 * Trava o valor v entre min e max.
 */
export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/**
 * Calcula a duração do salto em ms a partir da distância euclidiana.
 * Fórmula do handoff: T = limita(320 + dist / 2.3, 340, 820)
 */
export function calcJumpDuration(dist: number): number {
  return clamp(320 + dist / 2.3, 340, 820);
}

/**
 * Calcula a altura máxima do arco parabólico em px.
 * Fórmula do handoff: h = limita(dist * 0.3, 30, 190) (ou 110 no celular)
 */
export function calcJumpArcHeight(dist: number, isMobile = false): number {
  const maxH = isMobile ? 110 : 190;
  return clamp(dist * 0.3, 30, maxH);
}

/**
 * Calcula a rotação angular do salto em graus.
 * Fórmula do handoff: giro = dist * 0.9
 */
export function calcJumpSpin(dist: number): number {
  return dist * 0.9;
}

/**
 * Calcula a posição na trajetória parabólica com interpolação linear em x e arco parabólico em y.
 * Fórmula do handoff:
 *   x = x0 + (x1 - x0) * u
 *   y = y0 + (y1 - y0) * u - h * 4 * u * (1 - u)
 */
export function calcTrajectory(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  u: number,
  h: number
): { x: number; y: number } {
  const clampedU = clamp(u, 0, 1);
  const x = p0.x + (p1.x - p0.x) * clampedU;
  const y = p0.y + (p1.y - p0.y) * clampedU - h * 4 * clampedU * (1 - clampedU);
  return { x, y };
}

/**
 * Calcula a escala em relação à base de 96px do Giro ator.
 * kT = targetSize / 96
 */
export function calcTargetScale(targetSize: number): number {
  const size = targetSize > 0 ? targetSize : 64;
  return size / 96;
}

/**
 * Extrai o tamanho de parada configurado nos atributos de dados do elemento.
 * Usa data-size-m no celular quando presente; fallback para data-size ou 64.
 */
export function readStopSize(el: HTMLElement, isMobile: boolean): number {
  const sizeM = isMobile && el.dataset.sizeM ? Number(el.dataset.sizeM) : NaN;
  if (!Number.isNaN(sizeM) && sizeM > 0) return sizeM;
  const size = el.dataset.size ? Number(el.dataset.size) : NaN;
  if (!Number.isNaN(size) && size > 0) return size;
  return 64;
}

/**
 * Detecta a classe de superfície mais próxima do elemento (".g-azul", ".g-papel", ".g-tinta").
 * Retorna "g-azul" como fallback seguro.
 */
export function detectSurface(el: Element | null): SurfaceClass {
  if (!el) return "g-azul";
  const surf = el.closest(".g-azul, .g-papel, .g-tinta");
  if (!surf) return "g-azul";
  if (surf.classList.contains("g-papel")) return "g-papel";
  if (surf.classList.contains("g-tinta")) return "g-tinta";
  return "g-azul";
}

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
 * Detecta a superfície da parada: a declarada em data-surface ou a classe de superfície mais
 * próxima no DOM (".g-azul", ".g-papel", ".g-tinta").
 * Retorna "g-azul" como fallback seguro.
 */
export function detectSurface(el: Element | null): SurfaceClass {
  if (!el) return "g-azul";
  // A parada pode dizer a superfície que estará pintada embaixo dela (um disco de troca de cor
  // que não é ancestral dela no DOM).
  const declared = el instanceof HTMLElement ? el.dataset.surface : undefined;
  if (declared === "g-azul" || declared === "g-papel" || declared === "g-tinta") return declared;
  const surf = el.closest(".g-azul, .g-papel, .g-tinta");
  if (!surf) return "g-azul";
  if (surf.classList.contains("g-papel")) return "g-papel";
  if (surf.classList.contains("g-tinta")) return "g-tinta";
  return "g-azul";
}

/** Um eixo do Giro: onde está e com que velocidade (px e px/s). */
export interface SpringAxis {
  x: number;
  v: number;
}

/** Passo máximo da integração, em segundos: acima disso a mola é dividida em subpassos. */
const SPRING_STEP = 1 / 120;
/** Quadro mais longo aceito, em segundos: voltar de uma aba parada não vira um salto. */
export const MAX_FRAME = 0.05;

/**
 * Avança uma mola amortecida em direção ao alvo, sem depender da taxa de quadros.
 * omega é a frequência natural em rad/s e zeta o amortecimento (1 é o crítico, sem ultrapassar).
 */
export function stepSpring(
  axis: SpringAxis,
  target: number,
  omega: number,
  zeta: number,
  dt: number
): SpringAxis {
  let { x, v } = axis;
  let left = clamp(dt, 0, MAX_FRAME);
  while (left > 1e-6) {
    const h = Math.min(SPRING_STEP, left);
    v += (-omega * omega * (x - target) - 2 * zeta * omega * v) * h;
    x += v * h;
    left -= h;
  }
  return { x, v };
}

/**
 * Frequência da mola durante um salto de duração T (ms): chega perto do alvo por volta de 3/4 do
 * voo e assenta na aterrissagem, levando junto a velocidade que já tinha.
 */
export function calcFlightOmega(durationMs: number): number {
  return 6.5 / (Math.max(1, durationMs) / 1000);
}

/**
 * Esticada na direção do movimento: ângulo da velocidade (graus) e quanto estica (0 a 0.2).
 * Abaixo de 300 px/s não estica, para a rolagem lenta não deformar o rosto.
 */
export function calcStretch(vx: number, vy: number): { angle: number; amount: number } {
  const speed = Math.hypot(vx, vy);
  const amount = clamp((speed - 300) / 3000, 0, 0.2);
  if (amount === 0) return { angle: 0, amount: 0 };
  return { angle: (Math.atan2(vy, vx) * 180) / Math.PI, amount };
}

/** Altura do arco em u (0 a 1): parábola que sai do chão e volta a ele. */
export function calcArcLift(u: number, height: number): number {
  const c = clamp(u, 0, 1);
  return height * 4 * c * (1 - c);
}

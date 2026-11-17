/**
 * Lógica pura da transição de deitar do loader (Issue #105).
 * Sem DOM: calcula câmera, projeção isométrica, geometria e wipe das 3 placas
 * durante o pouso no palco da hero.
 */

import { layoutScale, type Point, type StackConfig, stackOrigin } from "@/components/hero/stack";

export const LAY_DOWN_DURATION_MS = 950;

export type RGBColor = readonly [number, number, number];

export const PLATE_EDGE_COLORS: readonly RGBColor[] = [
  [166, 204, 51],
  [201, 202, 233],
  [42, 45, 85],
];

export const PAPER_EDGE_COLOR: RGBColor = [201, 202, 233];

export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/**
 * cubic-bezier(.66, 0, .14, 1): curva com peso inicial e chegada suave.
 * Mesma curva do Loader.dc.html (lcCurve).
 */
export function layDownCurve(p: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  let lo = 0;
  let hi = 1;
  let t = p;
  for (let i = 0; i < 16; i += 1) {
    t = (lo + hi) / 2;
    const x = 3 * (1 - t) * (1 - t) * t * 0.66 + 3 * (1 - t) * t * t * 0.14 + t * t * t;
    if (x < p) lo = t;
    else hi = t;
  }
  return 3 * (1 - t) * t * t + t * t * t;
}

export function lcMix(a: RGBColor, b: RGBColor, t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

export interface LayDownParams {
  u: number;
  cfg: StackConfig;
  W: number;
  H: number;
  /** Altura visível que a hero usa para encolher a pilha (documentElement.clientHeight). */
  viewH: number;
  origin?: Point;
  stageTop?: number;
  fontBody?: number;
  open?: number;
}

export interface PlatePose {
  index: number;
  x: number;
  y: number;
  zc: number;
  z: number;
  sx: number;
  sy: number;
  ww: number;
  wh: number;
  transform: string;
  borderRadius: string;
  edgeColor: string;
  tagTransform: string;
  tagOpacity: number;
  paperClipPath: string;
  wipe: number;
}

export interface LayDownCamera {
  cx: number;
  cy: number;
  k: number;
  tilt: number;
  shrink: number;
  spread: number;
  rxDeg: number;
  rzDeg: number;
  transform: string;
}

export interface LayDownState {
  u: number;
  camera: LayDownCamera;
  plates: PlatePose[];
}

export function computeLayDown({
  u: rawU,
  cfg,
  W,
  H,
  viewH,
  origin,
  stageTop = 0,
  fontBody = 20,
  open = 1,
}: LayDownParams): LayDownState {
  const u = clamp01(rawU);
  const c = layDownCurve;

  const tilt = c(clamp01(u / 0.54));
  const shrink = c(clamp01((u - 0.03) / 0.6));
  const spread = c(clamp01((u - 0.08) / 0.5));

  const k = cfg.k * layoutScale(cfg, W, viewH);
  const targetOrigin = origin ?? stackOrigin(cfg, W, H, viewH);
  const ox = targetOrigin.x;
  const oy = targetOrigin.y + stageTop;

  const cx = W / 2 + (ox - W / 2) * shrink;
  const cy = H / 2 + (oy - H / 2) * shrink;

  const rxDeg = 60 * tilt;
  const rzDeg = -45 * tilt === 0 ? 0 : -45 * tilt;
  const camTransform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0) scale(${k}) rotateX(${rxDeg.toFixed(3)}deg) rotateZ(${rzDeg.toFixed(3)}deg)`;

  const camera: LayDownCamera = {
    cx,
    cy,
    k,
    tilt,
    shrink,
    spread,
    rxDeg,
    rzDeg,
    transform: camTransform,
  };

  // Tamanho das placas em progressão geométrica
  const ww = (W / k) ** (1 - shrink) * cfg.lw ** shrink;
  const wh = (H / k) ** (1 - shrink) * cfg.lh ** shrink;
  const sx = ww / W;
  const sy = wh / H;

  const q = clamp01((u - 0.16) / 0.42);
  const brX = (18 * q) / sx;
  const brY = (18 * q) / sy;
  const borderRadius = `${brX.toFixed(2)}px / ${brY.toFixed(2)}px`;

  const f = (1 / k) ** (1 - shrink) * ((cfg.mobile ? 12 : 15) / fontBody) ** shrink;

  const tagScaleX = f / sx;
  const tagScaleY = f / sy;
  const tagTransform = `scale(${tagScaleX.toFixed(4)}, ${tagScaleY.toFixed(4)})`;
  const tagOpacity = Number((1 - clamp01((u - 0.66) / 0.12)).toFixed(3));

  const diag = Math.hypot(cfg.lw, cfg.lh);

  const plates: PlatePose[] = [];
  for (let i = 0; i < 3; i += 1) {
    const fall = clamp01((u - (i === 1 ? 0.72 : 0.77)) / 0.23);
    const land = i === 0 ? 1 : fall * fall;
    const zc = cfg.Z0 + i * cfg.Gc;
    const zo = cfg.Z0 + i * cfg.Go * open;
    const z = zc + (zo - zc) * spread * (1 - land) + i * 0.1;
    const x = cfg.s * i * shrink || 0;
    const y = -cfg.s * i * shrink === 0 ? 0 : -cfg.s * i * shrink;

    const plateTransform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) scale3d(${sx.toFixed(5)}, ${sy.toFixed(5)}, 1)`;

    const wipe = c(clamp01((u - (0.7 + 0.04 * i)) / 0.22));
    const R = (wipe * diag * 1.05) / 2;
    const clipX = R / sx;
    const clipY = R / sy;
    const paperClipPath = `ellipse(${clipX.toFixed(1)}px ${clipY.toFixed(1)}px at 50% 50%)`;

    const edgeColor = lcMix(PLATE_EDGE_COLORS[i], PAPER_EDGE_COLOR, wipe);

    plates.push({
      index: i,
      x,
      y,
      zc,
      z,
      sx,
      sy,
      ww,
      wh,
      transform: plateTransform,
      borderRadius,
      edgeColor,
      tagTransform,
      tagOpacity,
      paperClipPath,
      wipe,
    });
  }

  return {
    u,
    camera,
    plates,
  };
}

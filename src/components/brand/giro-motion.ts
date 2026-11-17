// Pose do Giro durante o carregamento, calculada pelo tempo. Espelha o loading de
// src/styles/giro.css (g-spin-in, g-spin, a transição de 320 ms do arco e g-dash) e os valores
// aprovados no estudo motion/assets/giro-rig.js. Mudou um número lá, muda aqui.

/** Circunferência do arco (raio 44). */
export const CIRCUMFERENCE = 277;

const SPIN_IN_S = 1;
/** --dur-spin é 900 ms por volta. */
const SPIN_DEG_PER_S = 360 / 0.9;
const DASH_IN_S = 0.32;
const DASH_CYCLE_S = 1.8;
const DASH_REST = 240;
const DASH_MIN = 24;
const DASH_MAX = 150;
const DASH_MID_OFFSET = -60;

/** cubic-bezier do CSS: x é o tempo, y o progresso. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveT = (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const error = sampleX(t) - x;
      if (Math.abs(error) < 1e-6) return t;
      const slope = slopeX(t);
      if (Math.abs(slope) < 1e-6) break;
      t -= error / slope;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    for (let i = 0; i < 30; i++) {
      const value = sampleX(t);
      if (Math.abs(value - x) < 1e-6) return t;
      if (value < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return t;
  };

  return (progress: number) => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;
    return sampleY(solveT(progress));
  };
}

const spinIn = cubicBezier(0.5, 0, 0.7, 0.67);
const resolve = cubicBezier(0.2, 0.8, 0.2, 1);
const easeInOut = cubicBezier(0.42, 0, 0.58, 1);

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export interface LoadingPose {
  /** Rotação acumulada do giro, em graus. */
  rotation: number;
  /** Comprimento visível do arco. O resto do padrão é CIRCUMFERENCE - dash. */
  dash: number;
  /** stroke-dashoffset do arco. */
  offset: number;
}

/** Onde o arco está depois de `seconds` em loading. */
export function loadingPose(seconds: number): LoadingPose {
  const e = Math.max(0, seconds);
  const rotation =
    e < SPIN_IN_S ? 360 * spinIn(e / SPIN_IN_S) : 360 + SPIN_DEG_PER_S * (e - SPIN_IN_S);

  if (e < DASH_IN_S) {
    return { rotation, dash: lerp(DASH_REST, DASH_MIN, resolve(e / DASH_IN_S)), offset: 0 };
  }
  const half = DASH_CYCLE_S / 2;
  const cycle = (e - DASH_IN_S) % DASH_CYCLE_S;
  if (cycle < half) {
    const k = easeInOut(cycle / half);
    return { rotation, dash: lerp(DASH_MIN, DASH_MAX, k), offset: lerp(0, DASH_MID_OFFSET, k) };
  }
  const k = easeInOut((cycle - half) / half);
  return {
    rotation,
    dash: lerp(DASH_MAX, DASH_MIN, k),
    offset: lerp(DASH_MID_OFFSET, -CIRCUMFERENCE, k),
  };
}

export interface SpinFinish {
  /** Ângulo de partida dentro da volta (0 a 360). */
  from: number;
  /** Duração em ms para completar a volta. */
  duration: number;
  /** Offset em que o traço do arco fecha o ciclo: 0 ou -CIRCUMFERENCE, o mais perto. */
  offsetTo: number;
}

/** Como terminar a volta a partir da pose: quanto falta e em quanto tempo. */
export function spinFinish(pose: LoadingPose): SpinFinish {
  const from = ((pose.rotation % 360) + 360) % 360;
  const duration = Math.max(280, Math.min(720, (360 - from) * 2.2));
  const offsetTo = pose.offset < -CIRCUMFERENCE / 2 ? -CIRCUMFERENCE : 0;
  return { from, duration, offsetTo };
}

export const FINISH_EASING = "cubic-bezier(0.25, 0.6, 0.3, 1)";
export const RESOLVE_EASING = "cubic-bezier(0.2, 0.8, 0.2, 1)";

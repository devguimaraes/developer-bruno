/**
 * Lógica pura da pilha de camadas da hero (porte da prancha B).
 * Sem DOM: câmera, projeção, molas, estações da linha e agenda do ciclo.
 * Os números são os da prancha. Onde a API pede algo diferente, o desvio está no comentário da função.
 */

export interface Point {
  x: number;
  y: number;
}

export interface StackConfig {
  mobile: boolean;
  /** Recuo por camada, em px. */
  s: number;
  lw: number;
  lh: number;
  Z0: number;
  /** Vão fechado entre camadas. */
  Gc: number;
  /** Vão aberto entre camadas. */
  Go: number;
  /** Vão extra só entre a camada 2 e a de estado, em px, cresce com a abertura. */
  topExtra: number;
  /** Estação de partida, abaixo de Z0. */
  rest: number;
  gap: number;
  tagGap: number;
  /** Escala na largura de referência. */
  k: number;
  /** Tamanho do Giro em px. */
  gs: number;
  est: { cx: number; cy: number; w: number; h: number };
}

export const DESKTOP_STACK: StackConfig = {
  mobile: false,
  s: 30,
  lw: 330,
  lh: 230,
  Z0: 14,
  Gc: 16,
  Go: 150,
  topExtra: 0,
  rest: 170,
  gap: 40,
  tagGap: 46,
  k: 0.92,
  gs: 64,
  est: { cx: 10, cy: -6, w: 170, h: 62 },
};

export const MOBILE_STACK: StackConfig = {
  mobile: true,
  s: 30,
  lw: 330,
  lh: 230,
  Z0: 14,
  Gc: 16,
  Go: 100,
  // No celular o aviso de estado ficava quase em cima da tela: vão extra só para ele, que
  // cresce com a abertura, para ficar perto do vão das outras camadas.
  topExtra: 60,
  rest: 120,
  gap: 22,
  tagGap: 30,
  k: 0.5,
  gs: 44,
  est: { cx: 10, cy: -6, w: 170, h: 62 },
};

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** Escala do layout pela largura do palco: desktop min(1, W/1440); mobile min(1.15, W/390). */
export function layoutScale(cfg: StackConfig, W: number): number {
  return cfg.mobile ? Math.min(1.15, W / 390) : Math.min(1, W / 1440);
}

/**
 * Origem da cena no palco. Desvio da prancha: a origem do desktop escala o recuo de 270px
 * pela escala do layout, como pede a API. A prancha usava 270 fixo.
 */
export function stackOrigin(cfg: StackConfig, W: number, H: number): Point {
  const sc = layoutScale(cfg, W);
  if (cfg.mobile) {
    return { x: W / 2 - 65 * sc, y: 452 };
  }
  return { x: W / 2 + 270 * sc, y: H * 0.69 };
}

/** O `ease` da prancha. */
export function easeInOutQuad(p: number): number {
  return p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
}

export interface Camera {
  ox: number;
  oy: number;
  k: number;
  cx: number;
  sx: number;
  cz: number;
  sz: number;
  rxDeg: number;
  rzDeg: number;
  /** 1 - easeInOutQuad(scroll). Vai para --lo e --fo. */
  fade: number;
}

/** applyCam da prancha. scroll em 0..1, tiltX e tiltY em -1..1. */
export function makeCamera(
  cfg: StackConfig,
  origin: Point,
  scale: number,
  scroll: number,
  tiltX: number,
  tiltY: number
): Camera {
  const e = easeInOutQuad(scroll);
  const rxDeg = (60 - 4 * tiltY) * (1 - e);
  const rzDeg = (-45 + 5 * tiltX) * (1 - e);
  const rx = (rxDeg * Math.PI) / 180;
  const rz = (rzDeg * Math.PI) / 180;
  return {
    ox: origin.x,
    oy: origin.y,
    k: cfg.k * scale * (1 - 0.08 * e),
    cx: Math.cos(rx),
    sx: Math.sin(rx),
    cz: Math.cos(rz),
    sz: Math.sin(rz),
    rxDeg,
    rzDeg,
    fade: 1 - e,
  };
}

export function project(cam: Camera, x: number, y: number, z: number): Point {
  const x1 = x * cam.cz - y * cam.sz;
  const y1 = x * cam.sz + y * cam.cz;
  return { x: cam.ox + cam.k * x1, y: cam.oy + cam.k * (y1 * cam.cx - z * cam.sx) };
}

/** Inverso de project no plano de altura z. */
export function unproject(cam: Camera, px: number, py: number, z: number): Point {
  const x1 = (px - cam.ox) / cam.k;
  const y1 = ((py - cam.oy) / cam.k + z * cam.sx) / cam.cx;
  return { x: x1 * cam.cz + y1 * cam.sz, y: -x1 * cam.sz + y1 * cam.cz };
}

export interface LayerGeo {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const LAYER_COUNT = 4;

/** Geometria da camada i. A camada 3 é o estado, menor e deslocada. */
export function layerGeo(cfg: StackConfig, i: number): LayerGeo {
  if (i === 3) {
    return { x: cfg.est.cx, y: cfg.est.cy, w: cfg.est.w, h: cfg.est.h };
  }
  return { x: cfg.s * i, y: -cfg.s * i, w: cfg.lw, h: cfg.lh };
}

/**
 * computeZ da prancha: altura de cada camada. open[0] não entra no cálculo, a camada de baixo
 * fica sempre em Z0. lift soma por camada, sem acumular.
 */
export function layerHeights(
  cfg: StackConfig,
  open: readonly number[],
  lift: readonly number[]
): number[] {
  const zs: number[] = [];
  let z = cfg.Z0;
  for (let i = 0; i < LAYER_COUNT; i += 1) {
    if (i > 0) {
      z += cfg.Gc + (cfg.Go - cfg.Gc) * Math.max(-0.08, open[i]);
      if (i === 3) {
        z += cfg.topExtra * Math.max(0, open[i]);
      }
    }
    zs.push(z + lift[i]);
  }
  return zs;
}

/**
 * Molas da abertura, frame da prancha: só i=1..3, rigidez 120 + 40*i, amortecimento 15.
 * Muta open e vel. Integração semi-implícita, como na prancha.
 */
export function stepSprings(open: number[], vel: number[], target: number, dt: number): void {
  for (let i = 1; i < LAYER_COUNT; i += 1) {
    const stiff = 120 + 40 * i;
    const acc = (target - open[i]) * stiff - vel[i] * 15;
    vel[i] += acc * dt;
    open[i] += vel[i] * dt;
  }
}

/** Aproximação exponencial. */
export function approach(current: number, target: number, rate: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-dt * rate));
}

export interface Station {
  x: number;
  y: number;
  cx: number;
}

/**
 * Estações da linha: 5 itens, índices -1..3 em st[0..4]. O gap é multiplicado pela escala.
 * Desvio: a prancha não escalava o rest, então ele também fica sem escala aqui.
 */
export function stations(
  cfg: StackConfig,
  cam: Camera,
  zs: readonly number[],
  scale: number
): Station[] {
  const out: Station[] = [];
  for (let i = -1; i <= 3; i += 1) {
    const z = i < 0 ? cfg.Z0 - cfg.rest : zs[i];
    const col = Math.max(0, Math.min(i, 2));
    const cc = project(cam, cfg.s * col + cfg.lw / 2, -cfg.s * col + cfg.lh / 2, z);
    const own =
      i === 3 ? project(cam, cfg.est.cx + cfg.est.w / 2, cfg.est.cy + cfg.est.h / 2, z) : cc;
    out.push({ x: cc.x + cfg.gap * scale, y: own.y, cx: own.x });
  }
  return out;
}

/** Ponto do Giro na linha. rp em -1..3, interpolado entre estações. */
export function riderAt(st: readonly Station[], rp: number): Point {
  const r = Math.max(-1, Math.min(3, rp));
  const a = Math.min(2, Math.floor(r));
  const f = r - a;
  const near = st[a + 1];
  const far = st[a + 2];
  return { x: near.x + (far.x - near.x) * f, y: near.y + (far.y - near.y) * f };
}

export interface Damped {
  value: number;
  vel: number;
}

/**
 * Amortecimento crítico com teto de velocidade (o SmoothDamp de Game Programming Gems 4).
 * Trocar o alvo no meio do caminho mantém a velocidade, então não há tranco na troca.
 * Nunca passa do alvo e assenta exatamente nele.
 */
export function smoothDamp(
  current: number,
  target: number,
  vel: number,
  smoothTime: number,
  maxSpeed: number,
  dt: number
): Damped {
  const omega = 2 / smoothTime;
  const x = omega * dt;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const maxChange = maxSpeed * smoothTime;
  const change = Math.max(-maxChange, Math.min(maxChange, current - target));
  const goal = current - change;
  const temp = (vel + omega * change) * dt;
  let nextVel = (vel - omega * temp) * decay;
  let value = goal + (change + temp) * decay;
  // Passou do alvo, ou ficou a menos de um centésimo de px dele: assenta, senão nunca chega.
  if (target - current > 0 === value > target || Math.abs(target - value) < 1e-4) {
    value = target;
    nextVel = 0;
  }
  return { value, vel: nextVel };
}

/** Viagem na linha: tempo de assentar, em s, e teto em estações por segundo. */
export const RIDE_SMOOTH_S = 0.2;
export const RIDE_MAX_SPEED = 7;
/** A chegada conta a esta distância da estação, antes do último milímetro do amortecimento. */
export const RIDE_ARRIVE = 0.04;

/**
 * Giro do anel, em graus por px andado. Metade de rolar de verdade num Giro de 64 px:
 * rolar inteiro dá mais de 200 graus por estação e o anel vira um borrão.
 */
export const ROLL_PER_PX = 0.9;
/** Uma volta a cada 900 ms, o --dur-spin do loading. */
export const LOADING_SPIN = 400;

/** Camada sob o ponto, de cima para baixo, ou -1. */
export function hitLayer(cfg: StackConfig, cam: Camera, zs: readonly number[], p: Point): number {
  for (let i = LAYER_COUNT - 1; i >= 0; i -= 1) {
    const geo = layerGeo(cfg, i);
    const f = unproject(cam, p.x, p.y, zs[i]);
    if (Math.abs(f.x - geo.x) < geo.w / 2 && Math.abs(f.y - geo.y) < geo.h / 2) {
      return i;
    }
  }
  return -1;
}

/** Abertura pelo ponteiro: quanto mais perto, mais aberta a pilha. */
export function pointerOpen(distance: number): number {
  return clamp01(1 - (distance - 160) / 300);
}

/** Centro que o ponteiro usa para medir distância. */
export function stackCenter(cfg: StackConfig, cam: Camera, zs: readonly number[]): Point {
  return project(cam, cfg.s, -cfg.s, (zs[0] + zs[2]) / 2);
}

/** Progresso da rolagem pela altura da hero. */
export function scrollProgress(scrollY: number, heroHeight: number): number {
  if (heroHeight <= 0) {
    return 0;
  }
  return clamp01(scrollY / (0.7 * heroHeight));
}

export type StackMood = "idle" | "loading" | "done" | "error" | "curious";

export type CycleStep =
  | { at: number; kind: "open" }
  | { at: number; kind: "visit"; layer: number; error: boolean }
  | { at: number; kind: "home" }
  | { at: number; kind: "next" };

/**
 * Agenda de um ciclo, em ms a partir do início. loopN começa em 1, e o erro da camada 1
 * acontece quando loopN é par, então um ciclo dá certo e o seguinte falha.
 */
export function cycleSteps(loopN: number): CycleStep[] {
  return [
    { at: 200, kind: "open" },
    { at: 1100, kind: "visit", layer: 0, error: false },
    { at: 2700, kind: "visit", layer: 1, error: loopN % 2 === 0 },
    { at: 4300, kind: "visit", layer: 2, error: false },
    { at: 5900, kind: "visit", layer: 3, error: false },
    { at: 7600, kind: "home" },
    { at: 10200, kind: "next" },
  ];
}

export interface Beat {
  at: number;
  mood: StackMood;
  watch?: boolean;
  clearError?: boolean;
}

/** O que o Giro faz ao chegar numa estação, em ms depois da chegada. */
export function visitBeats(layer: number, error: boolean): Beat[] {
  if (layer === 0) {
    return [
      { at: 0, mood: "loading" },
      { at: 1000, mood: "idle", watch: true },
    ];
  }
  if (layer === 1 && error) {
    return [
      { at: 0, mood: "error" },
      { at: 800, mood: "loading" },
      { at: 1300, mood: "done", clearError: true },
    ];
  }
  if (layer === 1) {
    return [
      { at: 0, mood: "curious" },
      { at: 1000, mood: "idle", watch: true },
    ];
  }
  if (layer === 2) {
    return [
      { at: 0, mood: "loading" },
      { at: 1000, mood: "done" },
    ];
  }
  return [{ at: 0, mood: "done" }];
}

/** Atraso entre a chegada e o disparo da camada. */
export const FIRE_DELAY_MS = 220;

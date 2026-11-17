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
  /** Altura do pico do salto em px. */
  hopH: number;
  /** Amplitude lateral do salto em px. */
  hopX: number;
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
  hopH: 26,
  hopX: 16,
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
  hopH: 14,
  hopX: 10,
  est: { cx: 10, cy: -6, w: 170, h: 62 },
};

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** Altura da prancha do celular. */
const MOBILE_BOARD_H = 844;
/** Até onde a conta vai: uma tela de 600 px. Espelhado em --hb-short no giro-hero.css. */
const MOBILE_MAX_SHORTFALL = 244;
/**
 * Até 60 px a menos o texto de baixo quase não sobe e a pilha fica onde está. Dali em diante
 * ela sobe e encolhe por px que falta, medido em 375 x 667 e 360 x 640.
 */
const MOBILE_FIT_START = 60;
const MOBILE_SHRINK_PER_PX = 0.0015;
const MOBILE_LIFT_PER_PX = 0.66;

/**
 * Quanto a tela do celular é mais baixa que a prancha, de 0 a 244 px (tela de 600 px).
 * viewH é a altura visível com a barra do navegador aberta (documentElement.clientHeight),
 * a mesma que o CSS lê em 100svh.
 */
export function mobileShortfall(viewH: number): number {
  return Math.max(0, Math.min(MOBILE_MAX_SHORTFALL, MOBILE_BOARD_H - viewH));
}

function mobileFitPx(viewH: number): number {
  return Math.max(0, mobileShortfall(viewH) - MOBILE_FIT_START);
}

/**
 * Escala do layout: desktop min(1, W/1440); mobile min(1.15, W/390), encolhida em telas mais
 * baixas que a prancha para a pilha caber entre o título e o texto de baixo.
 */
export function layoutScale(cfg: StackConfig, W: number, viewH: number): number {
  if (!cfg.mobile) return Math.min(1, W / 1440);
  return Math.min(1.15, W / 390) * (1 - MOBILE_SHRINK_PER_PX * mobileFitPx(viewH));
}

/**
 * Origem da cena no palco. Desvio da prancha: a origem do desktop escala o recuo de 270px
 * pela escala do layout, como pede a API. A prancha usava 270 fixo. No celular a origem sobe
 * em telas mais baixas que a prancha, junto com o texto de baixo da hero.
 */
export function stackOrigin(cfg: StackConfig, W: number, H: number, viewH: number): Point {
  const sc = layoutScale(cfg, W, viewH);
  if (cfg.mobile) {
    return { x: W / 2 - 65 * sc, y: 452 - MOBILE_LIFT_PER_PX * mobileFitPx(viewH) };
  }
  return { x: W / 2 + 270 * sc, y: H * 0.69 };
}

/** O `ease` da prancha. */
function easeInOutQuad(p: number): number {
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

/** Flutuação da pilha em repouso: amplitude em px, período em s e defasagem entre camadas. */
const FLOAT_AMP = 5;
const FLOAT_PERIOD = 3.4;
const FLOAT_PHASE = 0.7;

/**
 * Quanto a camada `index` sobe ou desce no instante `seconds`. As camadas flutuam em onda, cada
 * uma um pouco depois da de baixo. Com 5 px e essa defasagem, duas vizinhas se aproximam no
 * máximo 3,5 px: menos que o vão da pilha fechada, então nunca se atravessam.
 */
export function layerFloat(index: number, seconds: number): number {
  return FLOAT_AMP * Math.sin((seconds / FLOAT_PERIOD) * Math.PI * 2 - index * FLOAT_PHASE);
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
  const safeRp = Number.isFinite(rp) ? rp : 0;
  const r = Math.max(-1, Math.min(3, safeRp));
  const a = Math.min(2, Math.floor(r));
  const f = r - a;
  const near = st[a + 1] ?? st[0] ?? { x: 0, y: 0, cx: 0 };
  const far = st[a + 2] ?? near;
  return { x: near.x + (far.x - near.x) * f, y: near.y + (far.y - near.y) * f };
}

export interface HopRideParams {
  from: number;
  to: number;
  D: number;
  g: number;
  hopH: number;
}

export interface HopRide {
  from: number;
  to: number;
  D: number;
  v: number;
  T: number;
  up: boolean;
}

/**
 * Salto entre estações com a mesma gravidade da entrada:
 * Subindo: v = sqrt(2g(D + h)), T = (v + sqrt(max(0, v² - 2gD))) / g
 * Descendo: h = 1.2 * hopH, v = sqrt(2gh), T = (v + sqrt(v² + 2gD)) / g
 */
export function createHopRide(params: HopRideParams): HopRide {
  const { from, to, D, g, hopH } = params;
  const up = to > from;
  const h = up ? hopH : hopH * 1.2;
  const v = up ? Math.sqrt(2 * g * (D + h)) : Math.sqrt(2 * g * h);
  const T = up
    ? (v + Math.sqrt(Math.max(0, v * v - 2 * g * D))) / g
    : (v + Math.sqrt(v * v + 2 * g * D)) / g;
  return { from, to, D, v, T, up };
}

export interface StepHopResult {
  rp: number;
  jumpY: number;
  hopX: number;
  stretch: number;
  done: boolean;
}

/**
 * Passo temporal de um salto na linha.
 * u = t / T, arco lateral hopX = baseHopX * 4u(1 - u),
 * deformação stretch = min(1, |v - gt| / 1400).
 */
export function stepHop(ride: HopRide, t: number, g: number, baseHopX: number): StepHopResult {
  const clampedT = Math.min(ride.T, Math.max(0, t));
  const s = ride.up
    ? ride.v * clampedT - 0.5 * g * clampedT * clampedT
    : -ride.v * clampedT + 0.5 * g * clampedT * clampedT;
  const rp = ride.from + (ride.to - ride.from) * Math.max(0, Math.min(1, s / ride.D));
  const jumpY = s > ride.D ? s - ride.D : s < 0 ? -s : 0;
  const u = clampedT / ride.T;
  const hopX = baseHopX * 4 * u * (1 - u);
  const stretch = Math.min(1, Math.abs(ride.v - g * clampedT) / 1400);
  const done = t >= ride.T;
  return {
    rp: done ? ride.to : rp,
    jumpY: done ? 0 : jumpY,
    hopX: done ? 0 : hopX,
    stretch,
    done,
  };
}

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
  | { at: number; kind: "visit"; layer: number; error: boolean }
  | { at: number; kind: "home" };

/**
 * Agenda de um ciclo, contada em ms a partir do pouso em tokens (ou de uma base deslocada):
 * camada 1 em 1350; camada 2 depois de 2100 com erro ou 1500 sem; camada 3 depois de 1400; volta ao chão depois de 1250.
 * O erro vale quando loopN é ímpar, e a primeira volta é a 1.
 */
export function cycleSteps(loopN: number, base = 0): CycleStep[] {
  const error = loopN % 2 === 1;
  const t1 = base + 1350;
  const t2 = t1 + (error ? 2100 : 1500);
  const t3 = t2 + 1400;
  const tHome = t3 + 1250;
  return [
    { at: t1, kind: "visit", layer: 1, error },
    { at: t2, kind: "visit", layer: 2, error: false },
    { at: t3, kind: "visit", layer: 3, error: false },
    { at: tHome, kind: "home" },
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
      { at: 800, mood: "done" },
    ];
  }
  return [{ at: 0, mood: "done" }];
}

/** Atraso entre a chegada e o disparo da camada. */
export const FIRE_DELAY_MS = 220;

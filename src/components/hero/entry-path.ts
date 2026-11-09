/**
 * Lógica pura da Entrada do Giro desenhada em arcos (porte de Trajeto.dc.html).
 * Sem dependências de DOM: cálculo dos arcos de gravidade, passo da trajetória,
 * amasso, estica, rolagem e molas das letras. Coordenadas do palco em px, y para baixo, tempo em s.
 */
import type { Point } from "./stack";

export type { Point };

export interface Letter {
  /** Borda esquerda e direita da letra, já descontado o recuo da tinta. */
  l: number;
  r: number;
  /** Topo de tinta da letra. */
  top: number;
  /** Linha do título (0 ou 1). */
  line: number;
}

export interface LetterSpring {
  y: number;
  v: number;
}

export interface EntryPathConfig {
  /** Gravidade em px/s². */
  g: number;
  /** Raio do Giro em px (diâmetro / 2). */
  R: number;
  /** Índices das letras tocadas na primeira linha. */
  hops: readonly [number, number];
  /** Altura do topo do primeiro arco em relação ao menor entre S.y e P1.y. */
  h0: number;
  /** Alturas de pico dos 4 arcos seguintes. */
  h: readonly [number, number, number, number];
}

export const DESKTOP_ENTRY_PATH: EntryPathConfig = {
  g: 2600,
  R: 32,
  hops: [3, 8],
  h0: 70,
  h: [55, 10, 80, 50],
};

export const MOBILE_ENTRY_PATH: EntryPathConfig = {
  g: 2400,
  R: 22,
  hops: [3, 8],
  h0: 46,
  h: [34, 8, 46, 34],
};

export type PathHitType = "letter" | "dot" | "pile" | "land";

export interface PathHit {
  type: PathHitType;
  kind: PathHitType;
  index?: number;
  vi: number;
}

export interface ArcSegment {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  /** Duração do arco em segundos. */
  T: number;
  /** Velocidade horizontal em px/s. */
  vx: number;
  /** Velocidade vertical inicial em px/s. */
  vy: number;
  /** Gravidade em px/s². */
  g: number;
  /** Tipo de contato ao término do segmento. */
  hit: PathHitType;
  /** Índice da letra atingida (apenas para hit="letter" ou "dot"). */
  i?: number;
  /** Se o Giro voa pela frente das letras (efeito de relevo/profundidade). */
  front?: boolean;
}

export interface EntryPathBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  segs: ArcSegment[];
  /** Índice do segmento atual (0..segs.length - 1). */
  i: number;
  /** Tempo decorrido no segmento atual em segundos. */
  t: number;
  /** Velocidade angular em rad/s. */
  w: number;
  /** Ângulo de rolagem em graus. */
  roll: number;
  /** Amasso (squash) e sua velocidade. */
  q: number;
  qv: number;
  /** Normal do contato. */
  nx: number;
  ny: number;
  /** Deformação de estica pelo voo (stretch). */
  s: number;
  /** Escala base que cresce até 1. */
  scale: number;
  /** Escala renderizada (soma relevo no arco front). */
  gscale: number;
  /** Se o trajeto terminou. */
  done: boolean;
  /** Configuração ativa da trajetória. */
  cfg: EntryPathConfig;
}

export interface StepPathResult {
  hit: PathHit | null;
  done: boolean;
}

export const KICK_MIN_VI = 120;
export const DIP_MAX = 240;
export const DIP_PER_VI = 0.16;
export const DIP_NEIGHBOR = 0.35;
export const LETTER_SPRING_K = 900;
export const LETTER_SPRING_D = 20;
export const SETTLE_EPS = 0.02;

export const SQUASH_SPRING_K = 1400;
export const SQUASH_SPRING_D = 26;
export const SQUASH_MIN = -0.22;
export const SQUASH_MAX = 0.32;
export const STRETCH_MAX = 0.14;
export const STRETCH_DIVISOR = 12000;

/**
 * Arco de A até B com a gravidade da cena e o topo em yA.
 * O tempo sai da altura, como na física.
 */
export function arc(
  a: Point,
  b: Point,
  yA: number,
  gOrCfg: number | EntryPathConfig,
  extra?: { hit?: PathHitType; i?: number; front?: boolean }
): ArcSegment {
  const g = typeof gOrCfg === "number" ? gOrCfg : gOrCfg.g;
  const top = Math.min(a.y, b.y, yA);
  const up = Math.sqrt((2 * (a.y - top)) / g);
  const dn = Math.sqrt((2 * (b.y - top)) / g);
  const T = Math.max(0.08, up + dn);
  const vx = (b.x - a.x) / T;
  const vy = -g * up;
  return {
    ax: a.x,
    ay: a.y,
    bx: b.x,
    by: b.y,
    T,
    vx,
    vy,
    g,
    hit: extra?.hit ?? "land",
    i: extra?.i,
    front: extra?.front,
  };
}

/**
 * Contato de término de segmento: devolve o tipo de contato,
 * o índice da letra se aplicável, e a velocidade de impacto vi = vy + g * T.
 */
export function pathHit(seg: ArcSegment, gOrVi?: number): PathHit {
  let vi: number;
  if (gOrVi === undefined) {
    vi = seg.vy + seg.g * seg.T;
  } else if (gOrVi === seg.g || gOrVi > 1500) {
    vi = seg.vy + gOrVi * seg.T;
  } else {
    vi = gOrVi;
  }
  return {
    type: seg.hit,
    kind: seg.hit,
    index: seg.i,
    vi,
  };
}

/**
 * Ponto de contato na camada superior fechada da pilha: (c.x, c.y - 0.9 * R).
 */
export function computePileContact(c: Point, R: number): Point {
  return { x: c.x, y: c.y - 0.9 * R };
}

export interface EntrySegmentsParams {
  cfg: EntryPathConfig;
  start: Point;
  letters: readonly Letter[];
  pilePoint: Point;
  stationPoint: Point;
  stageTop?: number;
}

/**
 * Constrói os cinco arcos da Entrada do Giro:
 * 1. origem -> letra (hops[0])
 * 2. letra -> letra (hops[1])
 * 3. letra -> ponto final (front: true)
 * 4. ponto final -> pilha
 * 5. pilha -> estação 0
 */
export function createEntrySegments(params: EntrySegmentsParams): ArcSegment[] {
  const { cfg, start, letters, pilePoint, stationPoint, stageTop = 0 } = params;
  if (letters.length === 0) return [];

  const on = (i: number): Point => {
    const idx = Math.max(0, Math.min(letters.length - 1, i));
    const L = letters[idx];
    return {
      x: (L.l + L.r) / 2,
      y: L.top - cfg.R,
    };
  };

  const dotIndex = letters.length - 1;
  const P1 = on(cfg.hops[0]);
  const P2 = on(cfg.hops[1]);
  const P3 = on(dotIndex);
  const P4 = pilePoint;
  const P5 = stationPoint;

  const limit = cfg.R + 6 - stageTop;
  const first = Math.max(limit, Math.min(start.y, P1.y) - cfg.h0);

  return [
    arc(start, P1, first, cfg.g, { hit: "letter", i: cfg.hops[0] }),
    arc(P1, P2, Math.min(P1.y, P2.y) - cfg.h[0], cfg.g, { hit: "letter", i: cfg.hops[1] }),
    arc(P2, P3, Math.min(P2.y, P3.y) - cfg.h[1], cfg.g, { hit: "dot", i: dotIndex, front: true }),
    arc(P3, P4, Math.min(P3.y, P4.y) - cfg.h[2], cfg.g, { hit: "pile" }),
    arc(P4, P5, Math.min(P4.y, P5.y) - cfg.h[3], cfg.g, { hit: "land" }),
  ];
}

export interface LaunchPathOptions {
  cfg?: EntryPathConfig;
  start: Point;
  letters: readonly Letter[];
  pilePoint?: Point;
  c?: Point;
  pile?: Point;
  stationPoint?: Point;
  station?: Point;
  stageTop?: number;
  initialScale?: number;
}

/**
 * Inicializa a bola na origem para percorrer os 5 arcos.
 * Suporta chamada posicional ou via objeto de opções.
 */
export function launchPath(
  cfgOrOptions: EntryPathConfig | LaunchPathOptions,
  startArg?: Point,
  lettersArg?: readonly Letter[],
  pilePointArg?: Point,
  stationPointArg?: Point,
  stageTopArg = 0,
  initialScaleArg = 1
): EntryPathBall | null {
  let cfg: EntryPathConfig;
  let start: Point;
  let letters: readonly Letter[];
  let pilePoint: Point;
  let stationPoint: Point;
  let stageTop = 0;
  let initialScale = 1;

  if ("start" in cfgOrOptions) {
    cfg = cfgOrOptions.cfg ?? DESKTOP_ENTRY_PATH;
    start = cfgOrOptions.start;
    letters = cfgOrOptions.letters;
    if (cfgOrOptions.pilePoint) {
      pilePoint = cfgOrOptions.pilePoint;
    } else if (cfgOrOptions.c) {
      pilePoint = computePileContact(cfgOrOptions.c, cfg.R);
    } else if (cfgOrOptions.pile) {
      pilePoint = cfgOrOptions.pile;
    } else {
      pilePoint = { x: 0, y: 0 };
    }
    stationPoint = cfgOrOptions.stationPoint ?? cfgOrOptions.station ?? { x: 0, y: 0 };
    stageTop = cfgOrOptions.stageTop ?? 0;
    initialScale = cfgOrOptions.initialScale ?? 1;
  } else {
    cfg = cfgOrOptions;
    if (!startArg || !lettersArg || !pilePointArg || !stationPointArg) {
      return null;
    }
    start = startArg;
    letters = lettersArg;
    pilePoint = pilePointArg;
    stationPoint = stationPointArg;
    stageTop = stageTopArg;
    initialScale = initialScaleArg;
  }

  if (!letters || letters.length === 0) {
    return null;
  }

  const segs = createEntrySegments({
    cfg,
    start,
    letters,
    pilePoint,
    stationPoint,
    stageTop,
  });

  if (segs.length === 0) return null;

  return {
    x: start.x,
    y: start.y,
    vx: segs[0].vx,
    vy: segs[0].vy,
    segs,
    i: 0,
    t: 0,
    w: 0,
    roll: 0,
    q: 0,
    qv: 0,
    nx: 0,
    ny: -1,
    s: 0,
    scale: initialScale,
    gscale: initialScale,
    done: false,
    cfg,
  };
}

/**
 * Avança o tempo dt na trajetória do Giro.
 * Trata passagem de arcos, contatos, mola de amasso, estica, rolagem e escala.
 */
export function stepPath(
  ball: EntryPathBall,
  dt: number,
  overrideCfg?: EntryPathConfig
): StepPathResult {
  if (ball.done || ball.i >= ball.segs.length) {
    return { hit: null, done: true };
  }

  const cfg = overrideCfg ?? ball.cfg ?? DESKTOP_ENTRY_PATH;
  const R = cfg.R;
  const g = cfg.g;

  ball.t += dt;
  ball.qv += (-SQUASH_SPRING_K * ball.q - SQUASH_SPRING_D * ball.qv) * dt;
  ball.q = Math.max(SQUASH_MIN, Math.min(SQUASH_MAX, ball.q + ball.qv * dt));

  let seg = ball.segs[ball.i];
  let hitResult: PathHit | null = null;

  while (ball.t >= seg.T) {
    const over = ball.t - seg.T;
    ball.x = seg.bx;
    ball.y = seg.by;
    const hit = pathHit(seg, g);
    hitResult = hit;

    if (seg.hit === "land") {
      ball.done = true;
      ball.scale = 1;
      ball.gscale = 1;
      return { hit, done: true };
    }

    // Impacto mecânico no contato com letra, ponto ou pilha
    ball.qv += Math.min(10, hit.vi / 170);
    ball.nx = 0;
    ball.ny = -1;

    ball.i += 1;
    if (ball.i >= ball.segs.length) {
      ball.done = true;
      return { hit, done: true };
    }
    ball.t = over;
    seg = ball.segs[ball.i];
  }

  const t = ball.t;
  ball.x = seg.ax + seg.vx * t;
  ball.y = seg.ay + seg.vy * t + 0.5 * g * t * t;
  ball.vx = seg.vx;
  ball.vy = seg.vy + g * t;

  const speed = Math.hypot(ball.vx, ball.vy);
  const stretch = Math.min(STRETCH_MAX, speed / STRETCH_DIVISOR);
  ball.s += (stretch - ball.s) * (1 - Math.exp(-dt * 18));
  ball.w += (ball.vx / R - ball.w) * (1 - Math.exp(-dt * 9));
  ball.roll += ball.w * dt * 57.2958;
  ball.scale = Math.min(1, ball.scale + (1.001 - ball.scale) * (1 - Math.exp(-dt * 7)));

  ball.gscale = ball.scale + (seg.front ? 0.14 * Math.sin((Math.PI * t) / seg.T) : 0);

  return { hit: hitResult, done: ball.done };
}

/** Afunda a letra tocada e 35% nas vizinhas da mesma linha; ignora vi <= 120. */
export function dipLetters(
  springs: LetterSpring[],
  letters: readonly Letter[],
  index: number,
  vi: number
): void {
  if (vi <= KICK_MIN_VI) return;
  const L = letters[index];
  if (!L) return;
  const k = Math.min(DIP_MAX, vi * DIP_PER_VI);
  for (let j = index - 1; j <= index + 1; j += 1) {
    const n = letters[j];
    const spring = springs[j];
    if (n && spring && n.line === L.line) {
      spring.v += j === index ? k : k * DIP_NEIGHBOR;
    }
  }
}

/**
 * Avança as molas das letras. As que assentam (|y| e |v| < 0,02) vão a 0.
 * Devolve true quando todas estão paradas.
 */
export function stepLetterSprings(springs: LetterSpring[], dt: number): boolean {
  for (const spring of springs) {
    if (Math.abs(spring.y) < SETTLE_EPS && Math.abs(spring.v) < SETTLE_EPS) {
      spring.y = 0;
      spring.v = 0;
      continue;
    }
    spring.v += (-LETTER_SPRING_K * spring.y - LETTER_SPRING_D * spring.v) * dt;
    spring.y += spring.v * dt;
  }
  return springs.every(spring => spring.y === 0 && spring.v === 0);
}

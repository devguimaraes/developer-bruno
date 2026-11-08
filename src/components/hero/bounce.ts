/**
 * Física da bola do hero (porte do quique da prancha Quique.dc.html).
 * Lógica pura, sem DOM: lançamento, quique sobre as letras, chão, rolagem até a estação e
 * as molas do amasso e do afundar das letras. Coordenadas do palco em px, y para baixo, tempo em s.
 * Rastro, acúmulo do ângulo do anel e gscale ficam no runtime.
 */
import type { Point } from "./stack";

export interface Letter {
  /** Borda esquerda e direita da letra, já descontado o recuo da tinta. */
  l: number;
  r: number;
  /** Topo de tinta da letra. */
  top: number;
  /** Linha do título (0 ou 1). */
  line: number;
}

export interface BallConfig {
  /** Gravidade em px/s². */
  g: number;
  /** Altura do arco acima da origem no computador. */
  popH: number;
  /** Altura do arco acima do topo do título no celular. */
  lift: number;
  /** Onde no título da linha 0 o primeiro toque é mirado (0 a 1). */
  aim: number;
  /** Velocidade de saída abaixo da qual o quique vira rolagem. */
  vRoll: number;
  /** Piso da saída em cima do título, para os pulinhos não morrerem. */
  vMinTitle: number;
  /** Desaceleração da rolagem em px/s². */
  aRoll: number;
  /** Toques no título até as letras deixarem de contar (0 = sem limite). */
  titleHops: number;
}

export const BALL_ELASTICITY = 0.58;

export const DESKTOP_BALL: BallConfig = {
  g: 2600,
  popH: 70,
  lift: 0,
  aim: 0.5,
  vRoll: 320,
  vMinTitle: 170,
  aRoll: 900,
  titleHops: 0,
};

export const MOBILE_BALL: BallConfig = {
  g: 2400,
  popH: 0,
  lift: 70,
  aim: 1,
  vRoll: 280,
  vMinTitle: 150,
  aRoll: 700,
  titleHops: 2,
};

/** Parede a WALL_K * R de cada borda do palco. */
export const WALL_K = 1.4;

/** Deslize de segurança: depois desse tempo a bola vai para a estação sem quicar. */
export const GLIDE_AFTER_S = 7;

export interface BallWorld {
  letters: readonly Letter[];
  /** Y do chão, que é também o y da estação. */
  floorY: number;
  /** X da estação de partida. */
  stationX: number;
  /** Largura do palco. */
  width: number;
  /** Raio do Giro. */
  R: number;
  /** Elasticidade do quique (BALL_ELASTICITY na produção). */
  e: number;
}

export type BallPhase = "air" | "roll" | "glide" | "parked";

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: BallPhase;
  /** Já tocou o chão uma vez (o toque mirado já foi usado). */
  floor: boolean;
  /** As letras deixaram de contar (o Giro cai pela frente delas). */
  offTitle: boolean;
  /** Toques no título até agora. */
  hops: number;
  /** Tempo de voo desde o lançamento, em s. */
  t: number;
  /** Velocidade angular do Giro, em rad/s. */
  w: number;
  /** Amasso (squash) e a mola dele. */
  q: number;
  qv: number;
  /** Normal do último contato (vertical no chão e nas letras, horizontal nas paredes). */
  nx: number;
  ny: number;
  /** Esticado no voo. */
  s: number;
}

export interface Surface {
  /** Altura do centro do Giro apoiado em x. */
  cy: number;
  /** Índice da letra que sustenta, ou -1 para o chão. */
  letter: number;
}

// Constantes do quique, iguais à referência.
const KICK_MIN_VI = 120;
const FRICTION_MIN_VI = 300;
const FRICTION = 0.92;
const WALL_BOUNCE = 0.6;
const SPIN_FOLLOW = 0.7;
const SLOW_ROLL = 30;
const STRETCH_MAX = 0.14;
const DIP_MAX = 240;
const DIP_PER_VI = 0.16;
const DIP_NEIGHBOR = 0.35;
const SPRING_K = 1400;
const SPRING_D = 26;
const LETTER_SPRING_K = 900;
const LETTER_SPRING_D = 20;
const SETTLE_EPS = 0.02;

/** Altura do centro do Giro apoiado em x. A quina de cada letra é redonda para quem rola. */
export function surface(
  letters: readonly Letter[],
  x: number,
  fromY: number,
  floorY: number,
  R: number
): Surface {
  let best: Surface = { cy: floorY, letter: -1 };
  for (let i = 0; i < letters.length; i += 1) {
    const L = letters[i];
    const dx = x < L.l ? L.l - x : x > L.r ? x - L.r : 0;
    if (dx >= R) continue;
    const cy = L.top - Math.sqrt(R * R - dx * dx);
    // Letra só conta quando o Giro está acima dela; senão quem sobe do chão seria puxado para cima.
    if (cy >= best.cy || fromY > cy + 2) continue;
    best = { cy, letter: i };
  }
  return best;
}

/**
 * Lançamento a partir da origem `start`. O primeiro contato é mirado num ponto da linha 0.
 * Devolve null se não houver letra na linha 0.
 */
export function launchBall(world: BallWorld, cfg: BallConfig, start: Point): Ball | null {
  const line = world.letters.filter(L => L.line === 0);
  if (line.length === 0) return null;
  const first = line[0];
  const last = line[line.length - 1];
  const R = world.R;
  const top = Math.min(...world.letters.map(L => L.top)) - R;
  const apexY = Math.min(start.y - cfg.popH, top - cfg.lift);
  const end = last.r;
  const tx = Math.min(end - R * 0.6, first.l + cfg.aim * (end - first.l));
  const ty = surface(world.letters, tx, -Infinity, world.floorY, R).cy;
  const tUp = Math.sqrt((2 * Math.max(0, start.y - apexY)) / cfg.g);
  const tDown = Math.sqrt((2 * Math.max(0, ty - apexY)) / cfg.g);
  return {
    x: start.x,
    y: start.y,
    vx: (tx - start.x) / Math.max(0.2, tUp + tDown),
    vy: -cfg.g * tUp,
    phase: "air",
    floor: false,
    offTitle: false,
    hops: 0,
    t: 0,
    w: 0,
    q: 0,
    qv: 0,
    nx: 0,
    ny: -1,
    s: 0,
  };
}

/**
 * Aderência do primeiro toque no chão: a vx que, somando os quiques até parar e a rolagem com
 * desaceleração constante, termina exatamente na estação.
 */
function aimFloor(x: number, vyOut: number, stationX: number, cfg: BallConfig, e: number): number {
  let T = 0;
  for (let v = vyOut; v >= cfg.vRoll; v *= e) T += (2 * v) / cfg.g;
  const D = stationX - x;
  const a = cfg.aRoll;
  return Math.sign(D) * a * (-T + Math.sqrt(T * T + (2 * Math.abs(D)) / a));
}

export interface BallContact {
  /** Índice da letra tocada, ou -1 para o chão. */
  letter: number;
  /** Velocidade de queda no contato. */
  vi: number;
}

export interface BallStep {
  contact: BallContact | null;
  /** A bola entrou na rolagem neste passo. */
  rolled: boolean;
  /** A bola estacionou neste passo. */
  parked: boolean;
}

function kick(ball: Ball, nx: number, ny: number, vi: number): void {
  ball.qv += Math.min(10, vi / 170);
  ball.nx = nx;
  ball.ny = ny;
}

function park(ball: Ball, world: BallWorld): BallStep {
  ball.phase = "parked";
  ball.x = world.stationX;
  ball.y = world.floorY;
  ball.vx = 0;
  ball.vy = 0;
  return { contact: null, rolled: false, parked: true };
}

const NO_STEP: BallStep = { contact: null, rolled: false, parked: false };

/** Avança a bola dt segundos mutando `ball`. */
export function stepBall(ball: Ball, world: BallWorld, cfg: BallConfig, dt: number): BallStep {
  if (ball.phase === "parked") return NO_STEP;
  const R = world.R;
  const sx = world.stationX;
  const floorY = world.floorY;
  ball.t += dt;

  // Mola do amasso: o contato empurra, ela volta passando um pouco e assenta.
  ball.qv += (-SPRING_K * ball.q - SPRING_D * ball.qv) * dt;
  ball.q = Math.max(-0.22, Math.min(0.32, ball.q + ball.qv * dt));
  const speed = Math.hypot(ball.vx, ball.vy);
  const stretch = ball.phase === "air" ? Math.min(STRETCH_MAX, speed / 12000) : 0;
  ball.s += (stretch - ball.s) * (1 - Math.exp(-dt * 18));

  if (ball.t > GLIDE_AFTER_S && ball.phase !== "glide") ball.phase = "glide";

  if (ball.phase === "glide") {
    const k = 1 - Math.exp(-dt * 8);
    ball.x += (sx - ball.x) * k;
    ball.y += (floorY - ball.y) * k;
    if (Math.hypot(sx - ball.x, floorY - ball.y) < 1) return park(ball, world);
    return NO_STEP;
  }

  if (ball.phase === "roll") {
    const d = sx - ball.x;
    if (Math.abs(d) < 0.5 || Math.sign(d) !== Math.sign(ball.vx) || Math.abs(ball.vx) < 4) {
      return park(ball, world);
    }
    if (Math.abs(ball.vx) < SLOW_ROLL && Math.abs(d) > 8) {
      ball.phase = "glide";
      return NO_STEP;
    }
    ball.vx -= Math.sign(ball.vx) * ((ball.vx * ball.vx) / (2 * Math.abs(d))) * dt;
    ball.x += ball.vx * dt;
    ball.y = floorY;
    ball.w = ball.vx / R;
    return NO_STEP;
  }

  // Voo.
  ball.vy += cfg.g * dt;
  let nx = ball.x + ball.vx * dt;
  let ny = ball.y + ball.vy * dt;
  // A parede vale para a caixa inteira do Giro, por isso fica a WALL_K * R da borda.
  const wallR = R * WALL_K;
  if (nx > world.width - wallR) {
    nx = world.width - wallR;
    kick(ball, 1, 0, Math.abs(ball.vx));
    ball.vx = -Math.abs(ball.vx) * WALL_BOUNCE;
  } else if (nx < wallR) {
    nx = wallR;
    kick(ball, -1, 0, Math.abs(ball.vx));
    ball.vx = Math.abs(ball.vx) * WALL_BOUNCE;
  }

  const s = surface(world.letters, nx, ball.offTitle ? Infinity : ball.y, floorY, R);
  let contact: BallContact | null = null;
  let rolled = false;
  if (ny >= s.cy && ball.vy > 0) {
    ny = s.cy;
    const vi = ball.vy;
    const onFloor = s.letter < 0;
    let out = world.e * vi;
    const toStation = Math.sign(sx - nx);
    if (
      onFloor &&
      !ball.floor &&
      (Math.abs(ball.vx) < SLOW_ROLL || Math.sign(ball.vx) === toStation)
    ) {
      // Primeiro toque no chão: mira a estação.
      ball.floor = true;
      ball.vx = aimFloor(nx, out, sx, cfg, world.e);
    } else {
      // Atrito só em contato forte; nos pulinhos do título o Giro não perde o passo.
      if (vi > FRICTION_MIN_VI && !(onFloor && ball.floor)) ball.vx *= FRICTION;
      if (!onFloor && out < cfg.vMinTitle) out = cfg.vMinTitle;
      if (onFloor && !ball.floor) out = Math.max(out, cfg.vRoll);
    }
    ball.vy = -out;
    ball.w += (ball.vx / R - ball.w) * SPIN_FOLLOW;
    if (vi > KICK_MIN_VI) kick(ball, 0, -1, vi);
    contact = { letter: s.letter, vi };
    if (s.letter >= 0) {
      ball.hops += 1;
      if (cfg.titleHops > 0 && ball.hops >= cfg.titleHops) ball.offTitle = true;
    }
    if (onFloor && ball.floor && out < cfg.vRoll) {
      ball.phase = "roll";
      ball.vy = 0;
      ny = floorY;
      rolled = true;
    }
  }
  ball.x = nx;
  ball.y = ny;
  return { contact, rolled, parked: false };
}

export interface LetterSpring {
  y: number;
  v: number;
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

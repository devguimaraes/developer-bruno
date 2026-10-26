/**
 * Motor do hero "O Giro roda" (prancha Hero2-Campo, decisão 52).
 *
 * Lógica pura: sem DOM e sem React. Quem mede o DOM e aplica o estado é useHeroEngine.
 * Distâncias em px da área do hero, sem escala de CSS.
 */

export type HeroPhase = "wait" | "air" | "ground" | "smile" | "live";
export type GiroMood = "idle" | "celebrating" | "done";
export type HudLabel = "signature" | "air" | "bounce" | "roll" | "done" | "jump" | "idle";
export type LetterLine = 1 | 2;

export interface HeroConfig {
  /** Margem lateral mínima do Giro. */
  pad: number;
  /** Distância entre a última letra e o repouso do Giro. */
  gap: number;
  /** wdth da linha 1 em repouso, wdth máximo da linha 1 sob o cursor e wdth da linha 2. */
  w1: number;
  w1max: number;
  w2: number;
  /** Largura de influência do cursor sobre a linha 1 e alcance vertical dela. */
  sigma: number;
  reachY: number;
  /** Início das molas (s) e instante do lançamento (s). */
  inAt: number;
  launchAt: number;
  /** Duração do voo (s), gravidade (px/s²), restituição, mola e amortecimento do Giro. */
  flight: number;
  gravity: number;
  bounce: number;
  spring: number;
  damp: number;
  /** Velocidade vertical do pulo ao clicar (px/s). */
  hop: number;
  /** Raio do rastro que o cursor acende no campo (px). */
  pointerBurst: number;
}

export const DESKTOP_HERO: HeroConfig = {
  pad: 64,
  gap: 24,
  w1: 92,
  w2: 100,
  w1max: 40,
  sigma: 170,
  reachY: 420,
  inAt: 0.15,
  launchAt: 1.0,
  flight: 0.62,
  gravity: 4600,
  bounce: 0.36,
  spring: 26,
  damp: 9.5,
  hop: 1250,
  pointerBurst: 90,
};

export const MOBILE_HERO: HeroConfig = {
  pad: 16,
  gap: 8,
  w1: 72,
  w2: 74,
  w1max: 34,
  sigma: 70,
  reachY: 200,
  inAt: 0.15,
  launchAt: 1.0,
  flight: 0.72,
  gravity: 3600,
  bounce: 0.36,
  spring: 30,
  damp: 10,
  hop: 900,
  pointerBurst: 65,
};

export interface LetterGeometry {
  line: LetterLine;
  cx: number;
  cy: number;
  /** Borda direita da letra. */
  r: number;
}

export interface HeroGeometry {
  W: number;
  H: number;
  /** Raio do Giro voando. */
  R: number;
  /** Origem do lançamento: assinatura no computador, aba no celular. */
  homeX: number;
  homeY: number;
  /** Escala do Giro na origem em relação ao Giro voando. */
  homeS: number;
  /** Centro do Giro quando encosta no chão. */
  groundY: number;
  letters: readonly LetterGeometry[];
}

export interface Burst {
  x: number;
  y: number;
  radius: number;
  power: number;
}

export interface Hole {
  x: number;
  y: number;
  r: number;
}

interface LetterState {
  line: LetterLine;
  /** Atraso da mola da letra em relação a inAt (s). */
  offset: number;
  inAt: number;
  w: number;
  g: number;
  vw: number;
  vg: number;
  f: number;
}

export interface HeroState {
  t: number;
  phase: HeroPhase;
  x: number;
  y: number;
  vx: number;
  vy: number;
  sc: number;
  rot: number;
  sq: number;
  calm: number;
  holdX: number;
  holdUntil: number;
  partyUntil: number;
  smileAt: number;
  rotFrom: number;
  rotTo: number;
  air: { sx: number; sy: number; T: number; tau: number; vy0: number } | null;
  mood: GiroMood;
  look: { x: number; y: number };
  pointer: { in: boolean; x: number; y: number };
  letters: LetterState[];
  /** Rastros emitidos no último passo, para o campo. */
  bursts: Burst[];
}

// Molas das letras (eixo wdth da Anybody) e limites dos eixos.
const LETTER_K = 230;
const LETTER_C = 15;
const W_MIN = 50;
const W_MAX = 150;
const G_MIN = 100;
const G_MAX = 900;
const G_START = 250;
const G_REST_1 = 860;
const G_REST_2 = 900;
const W_CONTACT = 48;
const STAGGER = 0.045;
const DEG = 180 / Math.PI;

const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));
const smooth = (v: number): number => v * v * (3 - 2 * v);

/** Raio da trilha do Giro (50/60 do raio total, como na prancha). */
export function arcRadius(R: number): number {
  return (R * 50) / 60;
}

/** Divide o título em duas linhas: a primeira palavra e o resto. */
export function splitTitle(title: string): [string, string] {
  const at = title.indexOf(" ");
  return at === -1 ? [title, ""] : [title.slice(0, at), title.slice(at + 1)];
}

export function createHeroState(cfg: HeroConfig, lines: readonly LetterLine[]): HeroState {
  const n1 = lines.filter(line => line === 1).length;
  let i2 = 0;
  const letters = lines.map((line, i): LetterState => {
    let offset: number;
    if (line === 1) {
      offset = i * STAGGER;
    } else {
      offset = (n1 * 0.55 + i2) * STAGGER;
      i2 += 1;
    }
    return {
      line,
      offset,
      inAt: cfg.inAt + offset,
      w: W_MIN,
      g: G_START,
      vw: 0,
      vg: 0,
      f: 0,
    };
  });
  return {
    t: 0,
    phase: "wait",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    sc: 1,
    rot: 0,
    sq: 0,
    calm: 0,
    holdX: 0,
    holdUntil: -1,
    partyUntil: -1,
    smileAt: 0,
    rotFrom: 0,
    rotTo: 0,
    air: null,
    mood: "idle",
    look: { x: 0, y: 0 },
    pointer: { in: false, x: 0, y: 0 },
    letters,
    bursts: [],
  };
}

/** Posição de repouso: à direita da última letra. */
export function restXOf(cfg: HeroConfig, g: HeroGeometry): number {
  const last = g.letters[g.letters.length - 1];
  return (last ? last.r : g.homeX) + cfg.gap + g.R;
}

/** Volta ao início: Giro na origem, letras finas, sem voo. */
export function resetHero(s: HeroState, cfg: HeroConfig, g: HeroGeometry): void {
  s.t = 0;
  s.phase = "wait";
  s.vx = 0;
  s.vy = 0;
  s.rot = 0;
  s.sq = 0;
  s.calm = 0;
  s.holdX = restXOf(cfg, g);
  s.holdUntil = -1;
  s.partyUntil = -1;
  s.air = null;
  s.look = { x: 0, y: 0 };
  s.mood = "idle";
  s.bursts.length = 0;
  s.x = g.homeX;
  s.y = g.homeY;
  s.sc = g.homeS;
  for (const c of s.letters) {
    c.w = W_MIN;
    c.g = G_START;
    c.vw = 0;
    c.vg = 0;
    c.f = 0;
    c.inAt = cfg.inAt + c.offset;
  }
}

/** Movimento reduzido: o quadro final, sem voo nem mola. */
export function stillHero(s: HeroState, cfg: HeroConfig, g: HeroGeometry): void {
  for (const c of s.letters) {
    c.w = c.line === 1 ? cfg.w1 : cfg.w2;
    c.g = c.line === 1 ? G_REST_1 : G_REST_2;
    c.vw = 0;
    c.vg = 0;
  }
  s.phase = "live";
  s.x = restXOf(cfg, g);
  s.y = g.groundY;
  s.sc = 1;
  s.vx = 0;
  s.vy = 0;
  s.sq = 0;
  s.mood = "idle";
  s.bursts.length = 0;
}

function launch(s: HeroState, cfg: HeroConfig, g: HeroGeometry): void {
  const lineTwo = g.letters.filter(l => l.line === 2);
  const landX = (lineTwo[1] ?? lineTwo[0] ?? { cx: g.homeX }).cx;
  const T = cfg.flight;
  const G = cfg.gravity;
  s.air = {
    sx: g.homeX,
    sy: g.homeY,
    T,
    tau: 0,
    vy0: (g.groundY - g.homeY - 0.5 * G * T * T) / T,
  };
  s.vx = (landX - g.homeX) / T;
  s.phase = "air";
}

/** Empurra as letras da linha 2 perto do ponto de contato e acende o rastro. */
function impact(s: HeroState, g: HeroGeometry, strength: number): void {
  const reach = g.R * 2.6;
  s.letters.forEach((c, i) => {
    const gl = g.letters[i];
    if (!gl || c.line !== 2) return;
    const d = Math.abs(gl.cx - s.x);
    if (d > reach) return;
    const f = (1 - d / reach) * strength;
    c.vw -= 1300 * f;
    c.vg -= 3200 * f;
  });
  s.sq = Math.max(s.sq, strength);
  s.bursts.push({
    x: s.x,
    y: s.y + arcRadius(g.R),
    radius: g.R * 2.2 * strength,
    power: 1,
  });
}

/** Pulo ao clicar. Só vale com o Giro parado no chão. Devolve se pulou. */
export function hopHero(s: HeroState, cfg: HeroConfig, g: HeroGeometry): boolean {
  if (s.phase !== "live" || s.y < g.groundY - 1) return false;
  s.vy = -cfg.hop;
  s.mood = "celebrating";
  s.partyUntil = s.t + 1.1;
  return true;
}

export function pointerMove(s: HeroState, x: number, y: number): void {
  s.pointer.in = true;
  s.pointer.x = x;
  s.pointer.y = y;
}

export function pointerLeave(s: HeroState): void {
  s.pointer.in = false;
  s.holdUntil = s.t + 1.2;
}

/** Avança a simulação em dt segundos. Preenche s.bursts com os rastros do passo. */
export function stepHero(s: HeroState, dt: number, g: HeroGeometry, cfg: HeroConfig): void {
  s.t += dt;
  s.bursts.length = 0;
  const G = cfg.gravity;
  const Rc = arcRadius(g.R);
  const rest = restXOf(cfg, g);

  if (s.phase === "wait") {
    s.x = g.homeX;
    s.y = g.homeY;
    s.sc = g.homeS;
    if (s.t >= cfg.launchAt) launch(s, cfg, g);
  } else if (s.phase === "air") {
    const a = s.air;
    if (a) {
      a.tau += dt;
      const tau = Math.min(a.tau, a.T);
      const p = tau / a.T;
      s.x = a.sx + s.vx * tau;
      s.y = a.sy + a.vy0 * tau + 0.5 * G * tau * tau;
      s.sc = g.homeS + (1 - g.homeS) * (1 - (1 - p) ** 3);
      s.rot += ((s.vx * dt) / Rc) * DEG * 0.5;
      if (a.tau >= a.T) {
        s.y = g.groundY;
        s.sc = 1;
        s.vy = -(a.vy0 + G * a.T) * cfg.bounce;
        s.vx *= 0.25;
        s.phase = "ground";
        impact(s, g, 1);
      }
    }
  } else {
    if (s.y < g.groundY - 0.5 || s.vy < 0) {
      s.vy += G * dt;
      s.y += s.vy * dt;
      if (s.y >= g.groundY) {
        s.y = g.groundY;
        if (s.vy > 300) {
          const strength = clamp(s.vy / 1600, 0.2, 0.8);
          s.vy = -s.vy * cfg.bounce;
          impact(s, g, strength);
        } else {
          s.vy = 0;
        }
      }
    } else {
      s.y = g.groundY;
      s.vy = 0;
    }

    let tx = rest;
    if (s.phase === "live") {
      const lo = cfg.pad + g.R;
      const hi = g.W - cfg.pad - g.R;
      if (s.pointer.in) s.holdX = clamp(s.pointer.x, lo, hi);
      if (s.pointer.in || s.t < s.holdUntil) tx = s.holdX;
    }
    const ax = cfg.spring * (tx - s.x) - cfg.damp * s.vx;
    s.vx = clamp(s.vx + ax * dt, -2600, 2600);
    const dx = s.vx * dt;
    s.x += dx;
    s.rot += (dx / Rc) * DEG;

    if (s.phase === "ground") {
      const settled = Math.abs(s.vx) < 6 && Math.abs(s.x - rest) < 3 && s.vy === 0;
      s.calm = settled ? s.calm + dt : 0;
      if (s.calm > 0.15) {
        s.phase = "smile";
        s.smileAt = s.t;
        s.rotFrom = s.rot;
        s.rotTo = Math.round(s.rot / 360) * 360;
      }
    } else if (s.phase === "smile") {
      const p = Math.min(1, (s.t - s.smileAt) / 0.3);
      s.rot = s.rotFrom + (s.rotTo - s.rotFrom) * (1 - (1 - p) ** 3);
      if (p >= 1) s.mood = "done";
      const since = s.t - s.smileAt;
      if (since > 1.8 || (s.pointer.in && since > 0.6)) {
        s.phase = "live";
        s.mood = "idle";
      }
    } else if (s.mood === "celebrating" && s.t > s.partyUntil) {
      s.mood = "idle";
    }
  }

  s.sq = Math.max(0, s.sq - dt / 0.18);

  // Olhos: para a frente quando rolam, no cursor quando estão parados.
  let lx = 0;
  let ly = 0;
  if (Math.abs(s.vx) > 60) {
    lx = Math.sign(s.vx) * 5;
    ly = 1;
  } else if (s.pointer.in) {
    const ex = s.pointer.x - s.x;
    const ey = s.pointer.y - s.y;
    const len = Math.hypot(ex, ey) || 1;
    lx = (ex / len) * 5;
    ly = (ey / len) * 4;
  }
  const ease = 1 - Math.exp(-dt * 12);
  s.look.x += (lx - s.look.x) * ease;
  s.look.y += (ly - s.look.y) * ease;

  // Letras: a linha 1 segue o cursor; a linha 2 se espreme quando o Giro encosta nela.
  const out = s.phase !== "wait" && s.phase !== "air";
  const contact = out ? clamp(1 - (g.groundY - s.y) / (g.R * 0.6), 0, 1) : 0;
  s.letters.forEach((c, i) => {
    const gl = g.letters[i];
    if (!gl) return;
    let tw: number;
    let tg: number;
    if (s.t < c.inAt) {
      tw = W_MIN;
      tg = G_START;
    } else if (c.line === 1) {
      let f = 0;
      if (s.pointer.in) {
        const dx = gl.cx - s.pointer.x;
        const near = clamp(1 - Math.abs(s.pointer.y - gl.cy) / cfg.reachY, 0, 1);
        f = Math.exp(-(dx * dx) / (2 * cfg.sigma * cfg.sigma)) * near;
      }
      c.f += (f - c.f) * (1 - Math.exp(-dt * 10));
      tw = cfg.w1 + cfg.w1max * c.f;
      tg = G_REST_1 + 40 * c.f;
    } else {
      const d = Math.abs(gl.cx - s.x) / (g.R * 1.15);
      const f = d < 1 ? smooth(1 - d) * contact : 0;
      tw = cfg.w2 - (cfg.w2 - W_CONTACT) * f;
      tg = G_REST_2 - 460 * f;
    }
    c.vw += (LETTER_K * (tw - c.w) - LETTER_C * c.vw) * dt;
    c.vg += (LETTER_K * (tg - c.g) - LETTER_C * c.vg) * dt;
    c.w += c.vw * dt;
    c.g += c.vg * dt;
    if (c.w < W_MIN || c.w > W_MAX) {
      c.w = clamp(c.w, W_MIN, W_MAX);
      c.vw = 0;
    }
    if (c.g < G_MIN || c.g > G_MAX) {
      c.g = clamp(c.g, G_MIN, G_MAX);
      c.vg = 0;
    }
  });

  if (s.phase !== "wait") {
    s.bursts.push({ x: s.x, y: s.y, radius: g.R * 1.25 * s.sc, power: 1 });
  }
  if (s.pointer.in) {
    s.bursts.push({ x: s.pointer.x, y: s.pointer.y, radius: cfg.pointerBurst, power: 0.85 });
  }
}

/** Amassado do Giro no quique, de 0 a 1. */
export function squashOf(s: HeroState): number {
  return smooth(s.sq);
}

/** Região do campo que fica vazia: o anel do Giro com folga. */
export function giroHole(s: HeroState, g: HeroGeometry): Hole {
  if (s.phase === "wait") {
    return { x: g.homeX, y: g.homeY, r: g.homeS * g.R + 2 };
  }
  const grow = 1 + 0.16 * smooth(s.sq);
  return { x: s.x, y: s.y, r: (arcRadius(g.R) + g.R / 10) * s.sc * grow + 3 };
}

/** Rótulo do painel de estado (chave sem o prefixo giro.state.). */
export function hudLabel(s: HeroState): HudLabel {
  switch (s.phase) {
    case "wait":
      return "signature";
    case "air":
      return "air";
    case "ground":
      return s.vy !== 0 ? "bounce" : "roll";
    case "smile":
      return "done";
    case "live":
      if (s.mood === "celebrating") return "jump";
      return Math.abs(s.vx) > 25 || s.vy !== 0 ? "roll" : "idle";
  }
}

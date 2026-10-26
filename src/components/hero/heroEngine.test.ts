import { describe, expect, it } from "vitest";
import type { HeroGeometry, HeroState, LetterLine } from "./heroEngine";
import {
  arcRadius,
  createHeroState,
  DESKTOP_HERO,
  giroHole,
  hopHero,
  hudLabel,
  pointerMove,
  resetHero,
  restXOf,
  splitTitle,
  stepHero,
  stillHero,
} from "./heroEngine";

const cfg = DESKTOP_HERO;
const DT = 1 / 120;

const LINES: LetterLine[] = [1, 1, 2, 2, 2];

// Geometria fixa: chão em y=600, origem acima da tela, duas linhas de letras.
function geometry(): HeroGeometry {
  return {
    W: 1440,
    H: 812,
    R: 75,
    homeX: 120,
    homeY: -40,
    homeS: 0.13,
    groundY: 600,
    letters: [
      { line: 1, cx: 200, cy: 300, r: 230 },
      { line: 1, cx: 260, cy: 300, r: 290 },
      { line: 2, cx: 700, cy: 500, r: 740 },
      { line: 2, cx: 760, cy: 500, r: 800 },
      { line: 2, cx: 820, cy: 500, r: 860 },
    ],
  };
}

function newState(g: HeroGeometry): HeroState {
  const s = createHeroState(cfg, LINES);
  resetHero(s, cfg, g);
  return s;
}

function runUntil(
  s: HeroState,
  g: HeroGeometry,
  done: (state: HeroState) => boolean,
  maxSeconds: number
): boolean {
  const steps = Math.ceil(maxSeconds / DT);
  for (let i = 0; i < steps; i += 1) {
    stepHero(s, DT, g, cfg);
    if (done(s)) return true;
  }
  return false;
}

describe("heroEngine: lançamento", () => {
  it("sai da origem e chega ao chão na segunda letra da linha 2", () => {
    const g = geometry();
    const s = newState(g);

    const landed = runUntil(s, g, state => state.phase === "ground", 5);

    expect(landed).toBe(true);
    expect(s.y).toBeCloseTo(g.groundY, 5);
    // A mira é a segunda letra da linha 2 ("o" de "com"): cx 760.
    expect(s.x).toBeCloseTo(760, 0);
  });

  it("não lança antes de launchAt", () => {
    const g = geometry();
    const s = newState(g);
    runUntil(s, g, () => false, cfg.launchAt - 0.1);
    expect(s.phase).toBe("wait");
    expect(s.x).toBe(g.homeX);
    expect(s.y).toBe(g.homeY);
  });
});

describe("heroEngine: quique", () => {
  it("cada quique perde energia pela restituição", () => {
    const g = geometry();
    const s = newState(g);
    s.phase = "ground";
    s.y = g.groundY - 400;
    s.vy = 0;

    // Altura máxima entre um toque no chão e o seguinte.
    const apexes: number[] = [];
    let apex = 0;
    let prevHeight = 0;
    for (let i = 0; i < 3 * 120; i += 1) {
      stepHero(s, DT, g, cfg);
      const height = g.groundY - s.y;
      apex = Math.max(apex, height);
      if (height <= 0 && prevHeight > 0) {
        apexes.push(apex);
        apex = 0;
      }
      prevHeight = height;
    }

    // O primeiro item é a queda inicial; os seguintes são os quiques.
    const bounces = apexes.slice(1).filter(h => h > 0.5);
    expect(bounces.length).toBeGreaterThanOrEqual(2);
    // Altura cai com o quadrado da restituição (0,36²), com folga para a integração.
    expect(bounces[1] / bounces[0]).toBeCloseTo(cfg.bounce ** 2, 1);
    expect(bounces[1]).toBeLessThan(bounces[0]);
  });
});

describe("heroEngine: parada e sorriso", () => {
  it("entra em sorriso quando a velocidade cai e volta ao repouso depois", () => {
    const g = geometry();
    const s = newState(g);

    expect(runUntil(s, g, state => state.phase === "smile", 8)).toBe(true);
    expect(Math.abs(s.vx)).toBeLessThan(6);

    // O sorriso fecha 0,3 s depois do início.
    runUntil(s, g, state => state.mood === "done", 1);
    expect(s.mood).toBe("done");

    // Sem cursor, o estado volta a repouso 1,8 s depois do sorriso.
    expect(runUntil(s, g, state => state.phase === "live", 4)).toBe(true);
    expect(s.mood).toBe("idle");
  });
});

describe("heroEngine: molas das letras", () => {
  it("convergem para o repouso da linha 2 depois de assentar", () => {
    const g = geometry();
    const s = newState(g);
    runUntil(s, g, state => state.phase === "live", 10);
    runUntil(s, g, () => false, 4);

    const line2 = s.letters.filter(c => c.line === 2);
    for (const c of line2) {
      expect(c.w).toBeCloseTo(cfg.w2, 0);
      expect(c.g).toBeCloseTo(900, 0);
    }
  });

  it("mantém o wdth dentro dos limites da Anybody", () => {
    const g = geometry();
    const s = newState(g);
    pointerMove(s, 200, 300);
    runUntil(s, g, () => false, 3);
    for (const c of s.letters) {
      expect(c.w).toBeGreaterThanOrEqual(50);
      expect(c.w).toBeLessThanOrEqual(150);
      expect(c.g).toBeGreaterThanOrEqual(100);
      expect(c.g).toBeLessThanOrEqual(900);
    }
  });
});

describe("heroEngine: pulo, rastro e campo", () => {
  it("só pula com o Giro parado no chão", () => {
    const g = geometry();
    const s = newState(g);
    expect(hopHero(s, cfg, g)).toBe(false);

    s.phase = "live";
    s.y = g.groundY;
    expect(hopHero(s, cfg, g)).toBe(true);
    expect(s.mood).toBe("celebrating");
    expect(hudLabel(s)).toBe("jump");
  });

  it("o cursor acende um rastro no campo", () => {
    const g = geometry();
    const s = newState(g);
    pointerMove(s, 400, 300);
    stepHero(s, DT, g, cfg);
    expect(s.bursts.some(b => b.radius === cfg.pointerBurst && b.x === 400)).toBe(true);
  });

  it("o buraco do campo cobre o anel do Giro", () => {
    const g = geometry();
    const s = newState(g);
    runUntil(s, g, state => state.phase === "ground", 5);
    const hole = giroHole(s, g);
    expect(hole.x).toBe(s.x);
    expect(hole.y).toBe(s.y);
    expect(hole.r).toBeGreaterThanOrEqual(arcRadius(g.R) * s.sc);
  });

  it("movimento reduzido vai direto ao quadro final", () => {
    const g = geometry();
    const s = createHeroState(cfg, LINES);
    stillHero(s, cfg, g);
    expect(s.phase).toBe("live");
    expect(s.x).toBe(restXOf(cfg, g));
    expect(s.y).toBe(g.groundY);
    expect(s.letters.find(c => c.line === 2)?.w).toBe(cfg.w2);
  });
});

describe("heroEngine: rótulos e título", () => {
  it("divide o título na primeira palavra", () => {
    expect(splitTitle("Interfaces com vida.")).toEqual(["Interfaces", "com vida."]);
    expect(splitTitle("Interfaces that live.")).toEqual(["Interfaces", "that live."]);
    expect(splitTitle("Interfaces")).toEqual(["Interfaces", ""]);
  });

  it("nomeia o estado pela fase", () => {
    const g = geometry();
    const s = newState(g);
    expect(hudLabel(s)).toBe("signature");
    s.phase = "air";
    expect(hudLabel(s)).toBe("air");
    s.phase = "ground";
    s.vy = 100;
    expect(hudLabel(s)).toBe("bounce");
    s.vy = 0;
    expect(hudLabel(s)).toBe("roll");
    s.phase = "smile";
    expect(hudLabel(s)).toBe("done");
  });
});

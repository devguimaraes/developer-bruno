import { describe, expect, it } from "vitest";
import {
  BALL_ELASTICITY,
  type Ball,
  type BallConfig,
  type BallWorld,
  DESKTOP_BALL,
  dipLetters,
  GLIDE_AFTER_S,
  type Letter,
  type LetterSpring,
  launchBall,
  MOBILE_BALL,
  stepBall,
  stepLetterSprings,
  surface,
  WALL_K,
} from "./bounce";
import type { Point } from "./stack";

const FPS = 60;
const DT = 1 / FPS;
const MAX_S = 12;

// Geometria da prancha: "Interfaces", com 3 px de recuo em cada lado de cada letra.
const TOPO = [72, 94, 82, 94, 94, 68, 94, 94, 94, 94];
const LARGURAS = [36, 78, 50, 72, 54, 46, 72, 66, 72, 64];

function letras(x0: number, larguras: number[], topos: number[]): Letter[] {
  let x = x0;
  return larguras.map((w, i) => {
    const letra = { l: x + 3, r: x + w - 3, top: topos[i], line: 0 };
    x += w;
    return letra;
  });
}

const MUNDO_COMPUTADOR: BallWorld = {
  letters: letras(
    64,
    LARGURAS,
    TOPO.map(v => v + 28)
  ),
  floorY: 668,
  stationX: 1212,
  width: 1440,
  R: 32,
  e: BALL_ELASTICITY,
};
const ORIGEM_COMPUTADOR: Point = { x: 155, y: -46 };

const MUNDO_CELULAR: BallWorld = {
  letters: letras(
    16,
    LARGURAS.map(v => v * 0.45),
    TOPO.map(v => v * 0.45 + 92)
  ),
  floorY: 489,
  stationX: 251,
  width: 390,
  R: 22,
  e: BALL_ELASTICITY,
};
const ORIGEM_CELULAR: Point = { x: 195, y: 770 };

function lancar(mundo: BallWorld, cfg: BallConfig, origem: Point): Ball {
  const bola = launchBall(mundo, cfg, origem);
  if (!bola) throw new Error("sem letra na linha 0");
  return bola;
}

function bolaEm(x: number, y: number, vx: number, vy: number): Ball {
  return {
    x,
    y,
    vx,
    vy,
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

interface Voo {
  contatos: { letra: number; vi: number; offTitle: boolean }[];
  estacionouEm: number | null;
  deslizou: boolean;
  rolou: boolean;
  offTitle: boolean;
  bordaMin: number;
  bordaMax: number;
  distanciaAntesDeParar: number;
}

/** Roda a bola quadro a quadro a 60 fps até estacionar ou esgotar o tempo. */
function voar(mundo: BallWorld, cfg: BallConfig, bola: Ball): Voo {
  const voo: Voo = {
    contatos: [],
    estacionouEm: null,
    deslizou: false,
    rolou: false,
    offTitle: false,
    bordaMin: bola.x - WALL_K * mundo.R,
    bordaMax: bola.x + WALL_K * mundo.R,
    distanciaAntesDeParar: Number.NaN,
  };
  for (let quadro = 1; quadro <= MAX_S * FPS; quadro += 1) {
    const xAntes = bola.x;
    const passo = stepBall(bola, mundo, cfg, DT);
    voo.bordaMin = Math.min(voo.bordaMin, bola.x - WALL_K * mundo.R);
    voo.bordaMax = Math.max(voo.bordaMax, bola.x + WALL_K * mundo.R);
    if (passo.contact) {
      voo.contatos.push({
        letra: passo.contact.letter,
        vi: passo.contact.vi,
        offTitle: bola.offTitle,
      });
    }
    if (passo.rolled) voo.rolou = true;
    if (bola.phase === "glide") voo.deslizou = true;
    if (passo.parked) {
      voo.estacionouEm = quadro * DT;
      voo.distanciaAntesDeParar = Math.abs(xAntes - mundo.stationX);
      break;
    }
  }
  voo.offTitle = bola.offTitle;
  return voo;
}

describe("superfície", () => {
  const umaLetra: Letter[] = [{ l: 0, r: 100, top: 100, line: 0 }];

  it("apoia o Giro em cima da letra, a R do topo de tinta", () => {
    expect(surface(umaLetra, 50, -Infinity, 668, 32)).toEqual({ cy: 68, letter: 0 });
  });

  it("arredonda a quina: fora da letra o centro desce conforme a distância", () => {
    const cy = surface(umaLetra, 116, -Infinity, 668, 32).cy;
    expect(cy).toBeCloseTo(100 - Math.sqrt(32 * 32 - 16 * 16), 6);
  });

  it("a letra mais alta vence quando duas se sobrepõem", () => {
    const duas: Letter[] = [
      { l: 0, r: 100, top: 100, line: 0 },
      { l: 60, r: 160, top: 90, line: 0 },
    ];
    expect(surface(duas, 80, -Infinity, 668, 32)).toEqual({ cy: 58, letter: 1 });
  });

  it("ignora letra quando o Giro está abaixo do topo dela", () => {
    expect(surface(umaLetra, 50, 200, 668, 32)).toEqual({ cy: 668, letter: -1 });
  });

  it("fora do título a superfície é o chão", () => {
    expect(surface(umaLetra, 500, -Infinity, 668, 32)).toEqual({ cy: 668, letter: -1 });
  });
});

describe("lançamento", () => {
  it("não lança sem letra na linha 0", () => {
    const soNaLinha1 = MUNDO_COMPUTADOR.letters.map(L => ({ ...L, line: 1 }));
    expect(
      launchBall({ ...MUNDO_COMPUTADOR, letters: soNaLinha1 }, DESKTOP_BALL, ORIGEM_COMPUTADOR)
    ).toBeNull();
  });

  it("sai da origem subindo e indo para a direita", () => {
    const bola = lancar(MUNDO_COMPUTADOR, DESKTOP_BALL, ORIGEM_COMPUTADOR);
    expect(bola.phase).toBe("air");
    expect(bola.vx).toBeGreaterThan(0);
    expect(bola.vy).toBeLessThan(0);
  });
});

describe("quique no computador", () => {
  it("chega à estação em menos de 6 s, sem deslize de segurança", () => {
    const voo = voar(
      MUNDO_COMPUTADOR,
      DESKTOP_BALL,
      lancar(MUNDO_COMPUTADOR, DESKTOP_BALL, ORIGEM_COMPUTADOR)
    );
    expect(voo.estacionouEm ?? Number.POSITIVE_INFINITY).toBeLessThan(6);
    expect(voo.deslizou).toBe(false);
  });

  it("toca pelo menos duas letras antes de cair no chão", () => {
    const voo = voar(
      MUNDO_COMPUTADOR,
      DESKTOP_BALL,
      lancar(MUNDO_COMPUTADOR, DESKTOP_BALL, ORIGEM_COMPUTADOR)
    );
    const letrasTocadas = new Set(voo.contatos.filter(c => c.letra >= 0).map(c => c.letra));
    expect(letrasTocadas.size).toBeGreaterThanOrEqual(2);
    expect(voo.contatos.some(c => c.letra < 0)).toBe(true);
  });

  it("sem limite de toques, o título nunca desliga a física", () => {
    const voo = voar(
      MUNDO_COMPUTADOR,
      DESKTOP_BALL,
      lancar(MUNDO_COMPUTADOR, DESKTOP_BALL, ORIGEM_COMPUTADOR)
    );
    expect(voo.offTitle).toBe(false);
  });
});

describe("quique no celular", () => {
  it("chega à estação em menos de 6 s, sem deslize de segurança", () => {
    const voo = voar(
      MUNDO_CELULAR,
      MOBILE_BALL,
      lancar(MUNDO_CELULAR, MOBILE_BALL, ORIGEM_CELULAR)
    );
    expect(voo.estacionouEm ?? Number.POSITIVE_INFINITY).toBeLessThan(6);
    expect(voo.deslizou).toBe(false);
  });

  it("toca o título e liga offTitle no segundo toque", () => {
    const voo = voar(
      MUNDO_CELULAR,
      MOBILE_BALL,
      lancar(MUNDO_CELULAR, MOBILE_BALL, ORIGEM_CELULAR)
    );
    const noTitulo = voo.contatos.filter(c => c.letra >= 0);
    expect(noTitulo.length).toBeGreaterThanOrEqual(2);
    expect(noTitulo[0].offTitle).toBe(false);
    expect(noTitulo[1].offTitle).toBe(true);
  });
});

describe("paredes", () => {
  it("computador: a caixa do Giro fica dentro do palco em todo quadro", () => {
    const voo = voar(
      MUNDO_COMPUTADOR,
      DESKTOP_BALL,
      lancar(MUNDO_COMPUTADOR, DESKTOP_BALL, ORIGEM_COMPUTADOR)
    );
    expect(voo.bordaMin).toBeGreaterThanOrEqual(0);
    expect(voo.bordaMax).toBeLessThanOrEqual(MUNDO_COMPUTADOR.width + 1e-6);
  });

  it("celular: a caixa do Giro fica dentro do palco em todo quadro", () => {
    const voo = voar(
      MUNDO_CELULAR,
      MOBILE_BALL,
      lancar(MUNDO_CELULAR, MOBILE_BALL, ORIGEM_CELULAR)
    );
    expect(voo.bordaMin).toBeGreaterThanOrEqual(0);
    expect(voo.bordaMax).toBeLessThanOrEqual(MUNDO_CELULAR.width + 1e-6);
  });

  it("parede direita prende a 1,4 R da borda, devolve com 0,6 e amassa na horizontal", () => {
    const bola = bolaEm(1390, 300, 1000, 0);
    stepBall(bola, { ...MUNDO_COMPUTADOR, letters: [] }, DESKTOP_BALL, DT);
    expect(bola.x).toBeCloseTo(MUNDO_COMPUTADOR.width - WALL_K * 32, 6);
    expect(bola.vx).toBeCloseTo(-600, 6);
    expect(bola.nx).toBe(1);
    expect(bola.ny).toBe(0);
    expect(bola.qv).toBeGreaterThan(0);
  });
});

describe("rolagem", () => {
  it("o toque mirado mais a rolagem param na estação, a menos de 1 px", () => {
    const semLetras: BallWorld = { ...MUNDO_COMPUTADOR, letters: [] };
    const voo = voar(semLetras, DESKTOP_BALL, bolaEm(300, 600, 0, 0));
    expect(voo.rolou).toBe(true);
    expect(voo.estacionouEm ?? Number.POSITIVE_INFINITY).toBeLessThan(6);
    expect(voo.distanciaAntesDeParar).toBeLessThan(1);
  });
});

describe("pulinho no título", () => {
  it("sobe pelo menos vMinTitle, para o pulinho não morrer em cima das letras", () => {
    const umaLetra: Letter[] = [{ l: 0, r: 200, top: 100, line: 0 }];
    const bola = bolaEm(100, 67, 0, 100);
    const passo = stepBall(bola, { ...MUNDO_COMPUTADOR, letters: umaLetra }, DESKTOP_BALL, DT);
    expect(passo.contact?.letter).toBe(0);
    expect(passo.contact?.vi).toBeCloseTo(100 + 2600 * DT, 6);
    expect(bola.vy).toBeCloseTo(-DESKTOP_BALL.vMinTitle, 6);
  });
});

describe("elasticidade", () => {
  for (const e of [0.45, 0.72]) {
    it(`com e=${e} o computador também chega à estação sem deslize`, () => {
      const mundo = { ...MUNDO_COMPUTADOR, e };
      const voo = voar(mundo, DESKTOP_BALL, lancar(mundo, DESKTOP_BALL, ORIGEM_COMPUTADOR));
      expect(voo.estacionouEm ?? Number.POSITIVE_INFINITY).toBeLessThan(7);
      expect(voo.deslizou).toBe(false);
    });

    it(`com e=${e} o celular também chega à estação sem deslize`, () => {
      const mundo = { ...MUNDO_CELULAR, e };
      const voo = voar(mundo, MOBILE_BALL, lancar(mundo, MOBILE_BALL, ORIGEM_CELULAR));
      expect(voo.estacionouEm ?? Number.POSITIVE_INFINITY).toBeLessThan(7);
      expect(voo.deslizou).toBe(false);
    });
  }
});

describe("molas das letras", () => {
  const trio: Letter[] = [
    { l: 0, r: 30, top: 100, line: 0 },
    { l: 30, r: 60, top: 100, line: 0 },
    { l: 60, r: 90, top: 100, line: 0 },
  ];
  const zeros = (): LetterSpring[] => [
    { y: 0, v: 0 },
    { y: 0, v: 0 },
    { y: 0, v: 0 },
  ];

  it("afunda a letra tocada e 35% nas vizinhas da mesma linha", () => {
    const molas = zeros();
    dipLetters(molas, trio, 1, 200);
    expect(molas[1].v).toBeCloseTo(32, 6);
    expect(molas[0].v).toBeCloseTo(32 * 0.35, 6);
    expect(molas[2].v).toBeCloseTo(32 * 0.35, 6);
  });

  it("não afunda com contato leve (vi <= 120)", () => {
    const molas = zeros();
    dipLetters(molas, trio, 1, 120);
    expect(molas).toEqual(zeros());
  });

  it("não afunda vizinha que está em outra linha", () => {
    const outraLinha = trio.map((L, i) => (i === 2 ? { ...L, line: 1 } : L));
    const molas = zeros();
    dipLetters(molas, outraLinha, 1, 200);
    expect(molas[2].v).toBe(0);
    expect(molas[0].v).toBeCloseTo(32 * 0.35, 6);
  });

  it("zera as molas que assentam e avisa quando todas param", () => {
    const molas: LetterSpring[] = [
      { y: 0.005, v: 0 },
      { y: 0, v: 0.001 },
    ];
    expect(stepLetterSprings(molas, DT)).toBe(true);
    expect(molas).toEqual([
      { y: 0, v: 0 },
      { y: 0, v: 0 },
    ]);
  });

  it("não zera mola que ainda oscila", () => {
    const molas: LetterSpring[] = [{ y: 10, v: 0 }];
    expect(stepLetterSprings(molas, DT)).toBe(false);
    expect(molas[0].y).not.toBe(0);
  });
});

describe("constantes", () => {
  it("usa os números da referência em cada config", () => {
    expect(DESKTOP_BALL).toMatchObject({
      g: 2600,
      popH: 70,
      lift: 0,
      aim: 0.5,
      vRoll: 320,
      vMinTitle: 170,
      aRoll: 900,
      titleHops: 0,
    });
    expect(MOBILE_BALL).toMatchObject({
      g: 2400,
      popH: 0,
      lift: 70,
      aim: 1,
      vRoll: 280,
      vMinTitle: 150,
      aRoll: 700,
      titleHops: 2,
    });
    expect(GLIDE_AFTER_S).toBe(7);
    expect(BALL_ELASTICITY).toBe(0.58);
  });
});

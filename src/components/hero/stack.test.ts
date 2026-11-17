import { describe, expect, it } from "vitest";
import {
  approach,
  createHopRide,
  cycleSteps,
  DESKTOP_STACK,
  FIRE_DELAY_MS,
  hitLayer,
  layerGeo,
  layerFloat,
  layerHeights,
  layoutScale,
  mobileShortfall,
  MOBILE_STACK,
  makeCamera,
  pointerOpen,
  project,
  riderAt,
  scrollProgress,
  stackCenter,
  stackOrigin,
  stations,
  stepHop,
  stepSprings,
  unproject,
  visitBeats,
} from "./stack";

const W = 1440;
const H = 900;
const origin = stackOrigin(DESKTOP_STACK, W, H, H);
const scale = layoutScale(DESKTOP_STACK, W, 844);
const cam = makeCamera(DESKTOP_STACK, origin, scale, 0, 0, 0);
const zsClosed = layerHeights(DESKTOP_STACK, [0, 0, 0, 0], [0, 0, 0, 0]);

describe("configs e escala", () => {
  it("usa os números da prancha em cada config", () => {
    expect(DESKTOP_STACK.k).toBe(0.92);
    expect(DESKTOP_STACK.Go).toBe(150);
    // Estação de partida mais baixa: o chão da entrada quicando fica abaixo da quina da pilha.
    expect(DESKTOP_STACK.rest).toBe(170);
    expect(DESKTOP_STACK.hopH).toBe(26);
    expect(DESKTOP_STACK.hopX).toBe(16);
    expect(MOBILE_STACK.rest).toBe(120);
    expect(MOBILE_STACK.k).toBe(0.5);
    expect(MOBILE_STACK.Go).toBe(100);
    expect(MOBILE_STACK.hopH).toBe(14);
    expect(MOBILE_STACK.hopX).toBe(10);
  });

  it("layoutScale do desktop limita em 1 e do mobile em 1.15", () => {
    expect(layoutScale(DESKTOP_STACK, 720, 844)).toBeCloseTo(0.5);
    expect(layoutScale(DESKTOP_STACK, 1920, 844)).toBe(1);
    expect(layoutScale(MOBILE_STACK, 195, 844)).toBeCloseTo(0.5);
    expect(layoutScale(MOBILE_STACK, 390, 844)).toBe(1);
    expect(layoutScale(MOBILE_STACK, 1000, 844)).toBe(1.15);
  });

  it("stackOrigin no desktop segue a escala do layout", () => {
    const full = stackOrigin(DESKTOP_STACK, 1440, 900, 900);
    expect(full.x).toBeCloseTo(990);
    expect(full.y).toBeCloseTo(621);

    const half = stackOrigin(DESKTOP_STACK, 720, 500, 500);
    expect(half.x).toBeCloseTo(495);
    expect(half.y).toBeCloseTo(345);
  });

  it("stackOrigin no mobile fica em y 452 e recua 65px pela escala", () => {
    const full = stackOrigin(MOBILE_STACK, 390, 844, 844);
    expect(full.x).toBeCloseTo(130);
    expect(full.y).toBe(452);

    const small = stackOrigin(MOBILE_STACK, 195, 844, 844);
    expect(small.x).toBeCloseTo(65);
    expect(small.y).toBe(452);
  });

  it("mobileShortfall mede o que falta até a prancha de 844 px, até 244", () => {
    expect(mobileShortfall(915)).toBe(0);
    expect(mobileShortfall(844)).toBe(0);
    expect(mobileShortfall(667)).toBe(177);
    expect(mobileShortfall(500)).toBe(244);
  });

  it("no celular baixo a pilha sobe e encolhe; até 60 px a menos fica igual (#125)", () => {
    expect(stackOrigin(MOBILE_STACK, 390, 900, 784)).toEqual(
      stackOrigin(MOBILE_STACK, 390, 900, 844)
    );
    expect(layoutScale(MOBILE_STACK, 390, 784)).toBe(1);

    const low = stackOrigin(MOBILE_STACK, 375, 760, 667);
    expect(low.y).toBeCloseTo(452 - 0.66 * 117);
    expect(layoutScale(MOBILE_STACK, 375, 667)).toBeCloseTo((375 / 390) * (1 - 0.0015 * 117));
    expect(stackOrigin(MOBILE_STACK, 375, 760, 640).y).toBeLessThan(low.y);
  });

  it("a altura visível não mexe no desktop", () => {
    expect(stackOrigin(DESKTOP_STACK, 1440, 900, 600)).toEqual(
      stackOrigin(DESKTOP_STACK, 1440, 900, 900)
    );
    expect(layoutScale(DESKTOP_STACK, 1440, 600)).toBe(1);
  });
});

describe("câmera e projeção", () => {
  it("unproject desfaz project na mesma altura", () => {
    const points = [
      { x: 0, y: 0 },
      { x: 120, y: -45 },
      { x: -80, y: 200 },
    ];
    for (const z of zsClosed) {
      for (const p of points) {
        const screen = project(cam, p.x, p.y, z);
        const back = unproject(cam, screen.x, screen.y, z);
        expect(back.x).toBeCloseTo(p.x, 6);
        expect(back.y).toBeCloseTo(p.y, 6);
      }
    }
  });

  it("com rolagem 1 a câmera fica de frente", () => {
    const front = makeCamera(DESKTOP_STACK, origin, scale, 1, 0.3, -0.2);
    expect(front.rxDeg).toBeCloseTo(0);
    expect(front.rzDeg).toBeCloseTo(0);
    expect(front.fade).toBeCloseTo(0);
  });

  it("no repouso a câmera tem a inclinação da prancha", () => {
    expect(cam.rxDeg).toBeCloseTo(60);
    expect(cam.rzDeg).toBeCloseTo(-45);
    expect(cam.fade).toBe(1);
  });
});

describe("camadas e molas", () => {
  it("camadas fechadas ficam em 14, 30, 46 e 62", () => {
    expect(zsClosed).toEqual([14, 30, 46, 62]);
  });

  it("lift soma só na camada que recebe", () => {
    const zs = layerHeights(DESKTOP_STACK, [0, 0, 0, 0], [0, 0, 0, 14]);
    expect(zs).toEqual([14, 30, 46, 76]);
  });

  it("no celular, com a pilha aberta, o vão até a camada de estado leva o extra de 60", () => {
    const zs = layerHeights(MOBILE_STACK, [0, 1, 1, 1], [0, 0, 0, 0]);
    expect(zs[3] - zs[2]).toBe(MOBILE_STACK.Go + 60);
    expect(zs[2] - zs[1]).toBe(MOBILE_STACK.Go);
  });

  it("no computador o vão até a camada de estado não muda com a pilha aberta", () => {
    const zs = layerHeights(DESKTOP_STACK, [0, 1, 1, 1], [0, 0, 0, 0]);
    expect(zs[3] - zs[2]).toBe(DESKTOP_STACK.Go);
  });

  it("com a pilha fechada, o celular tem as mesmas alturas de antes", () => {
    expect(layerHeights(MOBILE_STACK, [0, 0, 0, 0], [0, 0, 0, 0])).toEqual([14, 30, 46, 62]);
  });

  it("geometria da camada 3 é a do estado", () => {
    const base = layerGeo(DESKTOP_STACK, 0);
    expect(base.x).toBeCloseTo(0);
    expect(base.y).toBeCloseTo(0);
    expect(base.w).toBe(330);
    expect(base.h).toBe(230);
    expect(layerGeo(DESKTOP_STACK, 3)).toEqual({ x: 10, y: -6, w: 170, h: 62 });
  });

  it("stepSprings converge para o alvo e não mexe na camada 0", () => {
    const open = [0, 0, 0, 0];
    const vel = [0, 0, 0, 0];
    for (let n = 0; n < 600; n += 1) {
      stepSprings(open, vel, 1, 1 / 60);
    }
    expect(open[1]).toBeCloseTo(1, 3);
    expect(open[2]).toBeCloseTo(1, 3);
    expect(open[3]).toBeCloseTo(1, 3);
    expect(open[0]).toBe(0);
  });

  it("approach segue a aproximação exponencial", () => {
    expect(approach(0, 10, 5, 0.1)).toBeCloseTo(10 * (1 - Math.exp(-0.5)), 6);
  });
});

describe("estações e linha", () => {
  // Pilha aberta: a ordem de altura das estações só é estrita nesse caso.
  const zsOpen = layerHeights(DESKTOP_STACK, [0, 1, 1, 1], [0, 0, 0, 0]);

  it("stations tem 5 itens e y decresce de baixo para cima com a pilha aberta", () => {
    const st = stations(DESKTOP_STACK, cam, zsOpen, 1);
    expect(st).toHaveLength(5);
    for (let i = 1; i < st.length; i += 1) {
      expect(st[i].y).toBeLessThan(st[i - 1].y);
    }
  });

  it("riderAt em inteiro cai na estação", () => {
    const st = stations(DESKTOP_STACK, cam, zsOpen, 1);
    const p = riderAt(st, 1);
    expect(p.x).toBeCloseTo(st[2].x, 6);
    expect(p.y).toBeCloseTo(st[2].y, 6);
  });

  it("riderAt em 0.5 cai no meio de duas estações", () => {
    const st = stations(DESKTOP_STACK, cam, zsOpen, 1);
    const p = riderAt(st, 0.5);
    expect(p.x).toBeCloseTo((st[1].x + st[2].x) / 2, 6);
    expect(p.y).toBeCloseTo((st[1].y + st[2].y) / 2, 6);
  });

  it("FIRE_DELAY_MS segue a prancha", () => {
    expect(FIRE_DELAY_MS).toBe(220);
  });

  it("createHopRide calcula velocidade e duração de subida física", () => {
    const hop = createHopRide({ from: 0, to: 1, D: 100, g: 2600, hopH: 26 });
    expect(hop.up).toBe(true);
    expect(hop.v).toBeGreaterThan(0);
    expect(hop.T).toBeGreaterThan(0.2);
    expect(hop.T).toBeLessThan(0.7);
  });

  it("createHopRide calcula velocidade e duração de descida física", () => {
    const hop = createHopRide({ from: 3, to: -1, D: 300, g: 2600, hopH: 26 });
    expect(hop.up).toBe(false);
    expect(hop.v).toBeGreaterThan(0);
    expect(hop.T).toBeGreaterThan(0.3);
  });

  it("stepHop interpola rp, calcula arco hopX e termina em done", () => {
    const hop = createHopRide({ from: 0, to: 1, D: 100, g: 2600, hopH: 26 });
    const early = stepHop(hop, hop.T * 0.25, 2600, 16);
    expect(early.rp).toBeGreaterThan(0);
    expect(early.rp).toBeLessThan(1);
    expect(early.hopX).toBeGreaterThan(0);
    expect(early.done).toBe(false);

    const mid = stepHop(hop, hop.T / 2, 2600, 16);
    expect(mid.jumpY).toBeGreaterThan(0);
    expect(mid.hopX).toBeGreaterThan(0);

    const end = stepHop(hop, hop.T, 2600, 16);
    expect(end.rp).toBe(1);
    expect(end.hopX).toBe(0);
    expect(end.jumpY).toBe(0);
    expect(end.done).toBe(true);
  });
});

describe("ponteiro", () => {
  it("hitLayer acerta o centro projetado da camada 2", () => {
    const c2 = layerGeo(DESKTOP_STACK, 2);
    const p = project(cam, c2.x, c2.y, zsClosed[2]);
    expect(hitLayer(DESKTOP_STACK, cam, zsClosed, p)).toBe(2);
  });

  it("hitLayer devolve -1 longe da pilha", () => {
    expect(hitLayer(DESKTOP_STACK, cam, zsClosed, { x: -5000, y: -5000 })).toBe(-1);
  });

  it("pointerOpen vai de 1 perto a 0 longe", () => {
    expect(pointerOpen(0)).toBe(1);
    expect(pointerOpen(160)).toBe(1);
    expect(pointerOpen(310)).toBeCloseTo(0.5);
    expect(pointerOpen(5000)).toBe(0);
  });

  it("stackCenter é a projeção de (s, -s) na altura média de 0 e 2", () => {
    const c = stackCenter(DESKTOP_STACK, cam, zsClosed);
    const expected = project(
      cam,
      DESKTOP_STACK.s,
      -DESKTOP_STACK.s,
      (zsClosed[0] + zsClosed[2]) / 2
    );
    expect(c.x).toBeCloseTo(expected.x, 6);
    expect(c.y).toBeCloseTo(expected.y, 6);
  });
});

describe("ciclo do Giro", () => {
  const visit1 = (n: number) => cycleSteps(n).find(s => s.kind === "visit" && s.layer === 1);

  it("cycleSteps segue a agenda nova contada do pouso em tokens", () => {
    // Primeira volta (loopN=1) tem o erro na camada 1 e fecha a pilha em home
    expect(cycleSteps(1).map(s => s.at)).toEqual([1350, 3450, 4850, 6100]);
    // Segunda volta (loopN=2) sem o erro na camada 1
    expect(cycleSteps(2).map(s => s.at)).toEqual([1350, 2850, 4250, 5500]);
    // Volta iniciada pelo ponteiro deslocada pela base de 950ms
    expect(cycleSteps(2, 950).map(s => s.at)).toEqual([2300, 3800, 5200, 6450]);
  });

  it("cycleSteps(1) tem erro na camada 1 e cycleSteps(2) não", () => {
    expect(visit1(1)).toEqual({ at: 1350, kind: "visit", layer: 1, error: true });
    expect(visit1(2)).toEqual({ at: 1350, kind: "visit", layer: 1, error: false });
  });

  it("visitBeats com erro termina limpando o erro", () => {
    const beats = visitBeats(1, true);
    expect(beats.at(-1)?.clearError).toBe(true);
    expect(beats.at(-1)?.mood).toBe("done");
  });

  it("visitBeats sem erro não limpa nada", () => {
    expect(visitBeats(1, false).some(b => b.clearError)).toBe(false);
  });

  it("visitBeats da estação 2 cai para done aos 800 ms", () => {
    expect(visitBeats(2, false)).toEqual([
      { at: 0, mood: "loading" },
      { at: 800, mood: "done" },
    ]);
  });

  it("visitBeats da estação 0 carrega e volta a olhar a linha", () => {
    expect(visitBeats(0, false)).toEqual([
      { at: 0, mood: "loading" },
      { at: 1000, mood: "idle", watch: true },
    ]);
  });
});

describe("rolagem", () => {
  it("scrollProgress é 0.5 na metade de 0.7 da altura", () => {
    expect(scrollProgress(350, 1000)).toBeCloseTo(0.5);
  });

  it("scrollProgress limita em 0 e 1", () => {
    expect(scrollProgress(10000, 1000)).toBe(1);
    expect(scrollProgress(-40, 1000)).toBe(0);
  });

  it("scrollProgress devolve 0 sem altura", () => {
    expect(scrollProgress(100, 0)).toBe(0);
  });
});

describe("layerFloat", () => {
  it("duas camadas vizinhas nunca se aproximam mais que o vão da pilha fechada", () => {
    const gap = Math.min(DESKTOP_STACK.Gc, MOBILE_STACK.Gc);
    let closest = Number.POSITIVE_INFINITY;
    for (let s = 0; s < 8; s += 0.02) {
      for (let i = 0; i < 3; i += 1) {
        closest = Math.min(closest, gap + layerFloat(i + 1, s) - layerFloat(i, s));
      }
    }
    expect(closest).toBeGreaterThan(gap / 2);
  });

  it("flutua em onda: no mesmo instante as camadas estão em alturas diferentes", () => {
    expect(layerFloat(0, 1)).not.toBeCloseTo(layerFloat(2, 1), 1);
    expect(Math.abs(layerFloat(0, 0.85))).toBeLessThanOrEqual(5);
  });
});

import { describe, expect, it } from "vitest";
import {
  approach,
  cycleSteps,
  DESKTOP_STACK,
  FIRE_DELAY_MS,
  hitLayer,
  layerGeo,
  layerHeights,
  layoutScale,
  MOBILE_STACK,
  makeCamera,
  pointerOpen,
  project,
  RIDE_ARRIVE,
  RIDE_MAX_SPEED,
  RIDE_SMOOTH_S,
  riderAt,
  scrollProgress,
  smoothDamp,
  stackCenter,
  stackOrigin,
  stations,
  stepSprings,
  unproject,
  visitBeats,
} from "./stack";

const W = 1440;
const H = 900;
const origin = stackOrigin(DESKTOP_STACK, W, H);
const scale = layoutScale(DESKTOP_STACK, W);
const cam = makeCamera(DESKTOP_STACK, origin, scale, 0, 0, 0);
const zsClosed = layerHeights(DESKTOP_STACK, [0, 0, 0, 0], [0, 0, 0, 0]);

describe("configs e escala", () => {
  it("usa os números da prancha em cada config", () => {
    expect(DESKTOP_STACK.k).toBe(0.92);
    expect(DESKTOP_STACK.Go).toBe(150);
    // Estação de partida mais baixa: o chão da entrada quicando fica abaixo da quina da pilha.
    expect(DESKTOP_STACK.rest).toBe(170);
    expect(MOBILE_STACK.rest).toBe(120);
    expect(MOBILE_STACK.k).toBe(0.5);
    expect(MOBILE_STACK.Go).toBe(100);
  });

  it("layoutScale do desktop limita em 1 e do mobile em 1.15", () => {
    expect(layoutScale(DESKTOP_STACK, 720)).toBeCloseTo(0.5);
    expect(layoutScale(DESKTOP_STACK, 1920)).toBe(1);
    expect(layoutScale(MOBILE_STACK, 195)).toBeCloseTo(0.5);
    expect(layoutScale(MOBILE_STACK, 390)).toBe(1);
    expect(layoutScale(MOBILE_STACK, 1000)).toBe(1.15);
  });

  it("stackOrigin no desktop segue a escala do layout", () => {
    const full = stackOrigin(DESKTOP_STACK, 1440, 900);
    expect(full.x).toBeCloseTo(990);
    expect(full.y).toBeCloseTo(621);

    const half = stackOrigin(DESKTOP_STACK, 720, 500);
    expect(half.x).toBeCloseTo(495);
    expect(half.y).toBeCloseTo(345);
  });

  it("stackOrigin no mobile fica em y 452 e recua 65px pela escala", () => {
    const full = stackOrigin(MOBILE_STACK, 390, 844);
    expect(full.x).toBeCloseTo(130);
    expect(full.y).toBe(452);

    const small = stackOrigin(MOBILE_STACK, 195, 844);
    expect(small.x).toBeCloseTo(65);
    expect(small.y).toBe(452);
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

  // Simula a viagem a 60 quadros por segundo e devolve posição e velocidade a cada quadro.
  function ride(from: number, to: number, frames = 120, vel = 0) {
    const out: { value: number; vel: number }[] = [];
    let cur = { value: from, vel };
    for (let i = 0; i < frames; i += 1) {
      cur = smoothDamp(cur.value, to, cur.vel, RIDE_SMOOTH_S, RIDE_MAX_SPEED, 1 / 60);
      out.push(cur);
    }
    return out;
  }

  it("smoothDamp sai do repouso sem salto, não passa do alvo e assenta", () => {
    const path = ride(-1, 0);
    // Primeiro quadro: anda pouco, sem o salto de uma velocidade cheia.
    expect(path[0].value + 1).toBeLessThan(0.05);
    expect(path.every(p => p.value <= 0)).toBe(true);
    expect(path[path.length - 1].value).toBe(0);
    // Uma estação chega perto do alvo antes de 1 s, a tempo da batida seguinte do ciclo.
    const arrive = path.findIndex(p => Math.abs(p.value) < RIDE_ARRIVE);
    expect(arrive).toBeGreaterThan(0);
    expect(arrive).toBeLessThan(60);
  });

  it("smoothDamp respeita o teto de velocidade numa viagem longa", () => {
    const path = ride(3, -1);
    expect(Math.max(...path.map(p => Math.abs(p.vel)))).toBeLessThanOrEqual(RIDE_MAX_SPEED + 1e-6);
  });

  it("smoothDamp troca de alvo no meio sem zerar a velocidade", () => {
    const going = ride(-1, 3, 20);
    const last = going[going.length - 1];
    const back = smoothDamp(last.value, 0, last.vel, RIDE_SMOOTH_S, RIDE_MAX_SPEED, 1 / 60);
    // Ainda indo para cima no quadro da troca: freia em vez de inverter na hora.
    expect(back.vel).toBeGreaterThan(0);
    expect(back.vel).toBeLessThan(last.vel);
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

  it("cycleSteps segue a agenda de 200 a 10200 ms", () => {
    expect(cycleSteps(1).map(s => s.at)).toEqual([200, 1100, 2700, 4300, 5900, 7600, 10200]);
  });

  it("cycleSteps(2) tem erro na camada 1 e cycleSteps(1) não", () => {
    expect(visit1(2)).toEqual({ at: 2700, kind: "visit", layer: 1, error: true });
    expect(visit1(1)).toEqual({ at: 2700, kind: "visit", layer: 1, error: false });
  });

  it("visitBeats com erro termina limpando o erro", () => {
    const beats = visitBeats(1, true);
    expect(beats.at(-1)?.clearError).toBe(true);
    expect(beats.at(-1)?.mood).toBe("done");
  });

  it("visitBeats sem erro não limpa nada", () => {
    expect(visitBeats(1, false).some(b => b.clearError)).toBe(false);
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

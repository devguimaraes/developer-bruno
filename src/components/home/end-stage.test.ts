import { describe, expect, it } from "vitest";
import { project } from "@/components/hero/stack";
import { calcEndFloat, calcEndGap, calcEndStep, END_LAYERS, fitEndCamera } from "./end-stage";

describe("END_LAYERS", () => {
  it("lista as oito camadas em ordem de leitura, início em cima, com paradas fn0 a fn7", () => {
    expect(END_LAYERS.map(l => l.id)).toEqual([
      "start",
      "states",
      "services",
      "projects",
      "process",
      "about",
      "blog",
      "contact",
    ]);
    expect(END_LAYERS.map(l => l.stop)).toEqual([
      "fn0",
      "fn1",
      "fn2",
      "fn3",
      "fn4",
      "fn5",
      "fn6",
      "fn7",
    ]);
    expect(END_LAYERS.map(l => l.anchor)).toEqual([
      "hero",
      "hero",
      "servicos",
      "projetos",
      "processo",
      "sobre",
      "blog",
      "contato",
    ]);
  });
});

describe("calcEndGap", () => {
  it("começa em 6 px e termina em 92 px no computador e 62 px no celular", () => {
    expect(calcEndGap(0, false)).toBe(6);
    expect(calcEndGap(0.7, false)).toBe(92);
    expect(calcEndGap(1, false)).toBe(92);
    expect(calcEndGap(0, true)).toBe(6);
    expect(calcEndGap(0.7, true)).toBe(62);
  });

  it("abre rápido no começo (power2.out) e fica dentro dos limites", () => {
    expect(calcEndGap(0.35, false)).toBeCloseTo(6 + 86 * 0.75, 5);
    expect(calcEndGap(-1, false)).toBe(6);
    expect(calcEndGap(Number.NaN, false)).toBe(6);
  });
});

describe("calcEndStep", () => {
  it("hover numa placa leva o Giro à estação dela, curioso", () => {
    expect(calcEndStep(0.9, { endHover: 3 })).toEqual({ k: "h3", stop: "fn3", state: "curious" });
    expect(calcEndStep(0, { endHover: 0 })).toEqual({ k: "h0", stop: "fn0", state: "curious" });
  });

  it("sobe carregando antes de 55% do capítulo", () => {
    expect(calcEndStep(0.54, { endHover: -1 })).toEqual({
      k: "up",
      stop: "fn0",
      state: "loading",
    });
  });

  it("comemora no topo e depois descansa", () => {
    expect(calcEndStep(0.55, { endHover: -1 })).toEqual({
      k: "top",
      stop: "fn0",
      state: "celebrating",
      after: [
        [2200, "done"],
        [7000, "sleeping"],
      ],
    });
  });
});

describe("fitEndCamera", () => {
  // Contorno da pilha aberta no celular, projetado com a câmera da cena (rotateX 60, rotateZ -45).
  const bounds = ({ y, k }: { y: number; k: number }) => {
    const rx = (60 * Math.PI) / 180;
    const rz = (-45 * Math.PI) / 180;
    const cam = {
      ox: 0,
      oy: y,
      k,
      cx: Math.cos(rx),
      sx: Math.sin(rx),
      cz: Math.cos(rz),
      sz: Math.sin(rz),
      rxDeg: 60,
      rzDeg: -45,
      fade: 1,
    };
    const ys = [0, 7 * 62 + 30].flatMap(z =>
      [
        [0, 0],
        [420, 0],
        [0, 280],
        [420, 280],
      ].map(([x, yy]) => project(cam, x, yy, z).y)
    );
    return { top: Math.min(...ys), bottom: Math.max(...ys) };
  };

  it("mantém a escala da prancha quando há espaço e centra a pilha no vão", () => {
    const cam = fitEndCamera({ top: 200, bottom: 800 }, 0.42);
    expect(cam.k).toBe(0.42);
    const b = bounds(cam);
    expect(b.top - 200).toBeCloseTo(800 - b.bottom, 0);
  });

  it("encolhe a pilha numa tela baixa para ela caber entre o texto e o rodapé", () => {
    const cam = fitEndCamera({ top: 210, bottom: 420 }, 0.42);
    expect(cam.k).toBeLessThan(0.42);
    expect(bounds(cam).top).toBeGreaterThanOrEqual(209.5);
    expect(bounds(cam).bottom).toBeLessThanOrEqual(420.5);
  });
});

describe("calcEndFloat", () => {
  it("com a pilha fechada a flutuação cabe no vão: duas vizinhas nunca se atravessam", () => {
    const gap = 6;
    for (let s = 0; s < 8; s += 0.05) {
      const lower = 0 * gap + calcEndFloat(1, s, gap);
      const upper = 1 * gap + calcEndFloat(0, s, gap);
      expect(upper).toBeGreaterThan(lower);
    }
  });

  it("aberta, a amplitude tem teto e as placas não se movem todas juntas", () => {
    let max = 0;
    for (let s = 0; s < 8; s += 0.05) max = Math.max(max, Math.abs(calcEndFloat(0, s, 92)));
    expect(max).toBeLessThanOrEqual(7);
    expect(max).toBeGreaterThan(6);
    expect(calcEndFloat(0, 1, 92)).not.toBeCloseTo(calcEndFloat(3, 1, 92), 1);
  });

  it("sem vão não há flutuação", () => {
    expect(calcEndFloat(2, 1.3, 0)).toBeCloseTo(0, 10);
  });
});

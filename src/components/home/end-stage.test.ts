import { describe, expect, it } from "vitest";
import { calcEndGap, calcEndStep, END_LAYERS } from "./end-stage";

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

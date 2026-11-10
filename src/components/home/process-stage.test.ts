import { describe, expect, it } from "vitest";
import { calcProcessChapterStep, calcProcessScrollTop, calcProcessStage } from "./process-stage";

// Linha do tempo de 5 unidades: conversa até 1,05, desenho até 2,1, código até 3,15, depois entrega.
const at = (t: number) => calcProcessStage(t / 5);

describe("calcProcessStage", () => {
  it("troca de etapa nas fronteiras da prancha", () => {
    expect(at(0)).toBe(0);
    expect(at(1.0)).toBe(0);
    expect(at(1.1)).toBe(1);
    expect(at(2.05)).toBe(1);
    expect(at(2.2)).toBe(2);
    expect(at(3.1)).toBe(2);
    expect(at(3.2)).toBe(3);
    expect(at(5)).toBe(3);
  });

  it("prende o progresso fora de 0 a 1", () => {
    expect(calcProcessStage(-0.4)).toBe(0);
    expect(calcProcessStage(1.7)).toBe(3);
    expect(calcProcessStage(Number.NaN)).toBe(0);
  });
});

describe("calcProcessChapterStep", () => {
  it("põe o Giro na estação da etapa com o rosto dela", () => {
    expect(calcProcessChapterStep(0.1)).toEqual({ k: "pc0", stop: "pc0", state: "curious" });
    expect(calcProcessChapterStep(1.5 / 5)).toMatchObject({ stop: "pc1", state: "thinking" });
    expect(calcProcessChapterStep(2.5 / 5)).toMatchObject({ stop: "pc2", state: "loading" });
  });

  it("na entrega comemora e fica pronto 1600 ms depois", () => {
    expect(calcProcessChapterStep(0.9)).toEqual({
      k: "pc3",
      stop: "pc3",
      state: "celebrating",
      after: [[1600, "done"]],
    });
  });
});

describe("calcProcessScrollTop", () => {
  it("leva cada estação a um ponto que cai dentro da etapa dela", () => {
    const top = 1000;
    const len = 4000;
    for (const i of [0, 1, 2, 3]) {
      const y = calcProcessScrollTop(i, top, len);
      expect(calcProcessStage((y - top) / len)).toBe(i);
    }
  });

  it("a entrega para antes da passagem para o azul, em t = 4,4", () => {
    const y = calcProcessScrollTop(3, 0, 5000);
    expect(y / 1000).toBeLessThan(4.4);
  });
});

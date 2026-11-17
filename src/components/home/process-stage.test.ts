import { describe, expect, it } from "vitest";
import {
  calcProcessBeatTime,
  calcProcessCovered,
  calcProcessDiscRadius,
  calcProcessChapterStep,
  calcProcessLift,
  calcProcessMobileCamera,
  calcProcessScrollTop,
  calcProcessStage,
  PROCESS_DISC,
  PROCESS_TOTAL,
  PROCESS_BEATS,
} from "./process-stage";

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

describe("calcProcessBeatTime", () => {
  it("leva ao ponto em que o desenho da etapa está completo", () => {
    expect(calcProcessBeatTime(0)).toBe(PROCESS_BEATS[0]);
    expect(calcProcessBeatTime(3)).toBe(PROCESS_BEATS[3]);
  });

  it("volta ao começo antes de o capítulo entrar", () => {
    expect(calcProcessBeatTime(-1)).toBe(0);
  });

  it("não passa da última etapa", () => {
    expect(calcProcessBeatTime(9)).toBe(PROCESS_BEATS[3]);
  });
});

describe("saída do Processo", () => {
  it("o disco alcança um ponto mais perto do centro mais cedo", () => {
    const radius = calcProcessDiscRadius(1440, 900);
    expect(calcProcessCovered(100, radius)).toBeLessThan(calcProcessCovered(700, radius));
  });

  it("no centro é quando o disco começa a abrir; na borda, quando termina", () => {
    expect(calcProcessCovered(0, 500)).toBeCloseTo(PROCESS_DISC.at / PROCESS_TOTAL, 5);
    expect(calcProcessCovered(500, 500)).toBeCloseTo(1, 5);
    expect(calcProcessCovered(900, 500)).toBeCloseTo(1, 5);
  });

  it("no celular (375 x 667, estação a 129 px do centro) cobre perto de 95% do capítulo", () => {
    const covered = calcProcessCovered(129, calcProcessDiscRadius(375, 667));
    expect(covered).toBeGreaterThan(0.94);
    expect(covered).toBeLessThan(0.96);
  });

  it("coberto, o Giro fica na última estação vestido de azul", () => {
    expect(calcProcessChapterStep(0.97, 0.96)).toMatchObject({
      k: "pc-out",
      stop: "pc3",
      surface: "g-azul",
    });
  });

  it("antes disso segue na superfície da própria estação", () => {
    expect(calcProcessChapterStep(0.95, 0.96).surface).toBeUndefined();
    expect(calcProcessChapterStep(0.999).surface).toBeUndefined();
  });
});

describe("Processo em telas baixas", () => {
  it("na altura da prancha a câmera fica onde foi desenhada", () => {
    expect(calcProcessLift(844)).toBe(0);
    expect(calcProcessMobileCamera(390, 844)).toEqual({ x: 205, y: 306, k: 0.42 });
  });

  it("em tela baixa a cena sobe e encolhe, com teto de 100 px", () => {
    expect(calcProcessLift(667)).toBe(100);
    const cam = calcProcessMobileCamera(375, 667);
    expect(cam.y).toBeCloseTo(244, 5);
    expect(cam.k).toBeCloseTo(0.35, 5);
  });

  it("tela mais alta que a prancha não desce a cena", () => {
    expect(calcProcessLift(932)).toBe(0);
  });
});

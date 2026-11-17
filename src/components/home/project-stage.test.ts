import { describe, expect, it } from "vitest";
import {
  calcProjectBeatTime,
  calcProjectStep,
  PROJECT_ENTER,
  PROJECT_TILT,
  projectTimeline,
} from "./project-stage";

// Linha do tempo da prancha com cinco janelas: t0 1.2, passo 1.4, virada em 8.2, total 12.2.
const TOTAL = 12.2;
const at = (t: number) => calcProjectStep(t / TOTAL, 5);

describe("calcProjectStep", () => {
  it("começa no ponto do título, parado", () => {
    expect(at(0)).toMatchObject({ k: "t", stop: "pj-dot", state: "idle" });
    expect(at(1.19)).toMatchObject({ k: "t", stop: "pj-dot" });
  });

  it("pousa na vaga de cada janela carregando e marca pronto 820 ms depois", () => {
    expect(at(1.25)).toEqual({
      k: "pj0",
      stop: "pj0",
      state: "loading",
      after: [[820, "done"]],
    });
    expect(at(3.0).stop).toBe("pj1");
    expect(at(7.4).stop).toBe("pj4");
  });

  it("depois da virada vai para os números e, no fim, para a saída", () => {
    expect(at(9.5)).toMatchObject({ k: "o", stop: "pj-out", state: "done" });
    expect(at(11.2)).toMatchObject({ k: "x", stop: "pj-exit", state: "curious" });
    expect(at(TOTAL)).toMatchObject({ k: "x" });
  });

  it("fica na última vaga até a virada e sai dela assim que a pilha começa a deitar", () => {
    expect(at(8.1).stop).toBe("pj4");
    expect(at(8.2).stop).toBe("pj-out");
  });

  it("o Giro troca de parada no mesmo ponto em que a batida dispara", () => {
    const { t0, step, tTilt, total } = projectTimeline(5);
    for (const t of [t0, t0 + step, t0 + step * 4, tTilt]) {
      const before = (t - 0.01) / total;
      const after = (t + 0.01) / total;
      expect(calcProjectBeatTime(before, 5)).not.toBe(calcProjectBeatTime(after, 5));
      expect(calcProjectStep(before, 5).k).not.toBe(calcProjectStep(after, 5).k);
    }
  });

  it("prende o progresso fora de 0 a 1", () => {
    expect(calcProjectStep(-1, 5).k).toBe("t");
    expect(calcProjectStep(2, 5).k).toBe("x");
    expect(calcProjectStep(Number.NaN, 5).k).toBe("t");
  });
});

describe("calcProjectBeatTime", () => {
  const count = 5;
  const { t0, step, tTilt, total } = projectTimeline(count);
  const at = (t: number) => t / total;

  it("antes da primeira janela a cena fica no começo", () => {
    expect(calcProjectBeatTime(0, count)).toBe(0);
    expect(calcProjectBeatTime(at(t0 - 0.01), count)).toBe(0);
  });

  it("cada janela toca até assentar, antes de a seguinte começar", () => {
    expect(calcProjectBeatTime(at(t0), count)).toBe(t0 + PROJECT_ENTER);
    expect(calcProjectBeatTime(at(t0 + step * 2.5), count)).toBe(t0 + step * 2 + PROJECT_ENTER);
    expect(t0 + PROJECT_ENTER).toBeLessThanOrEqual(t0 + step);
  });

  it("na virada vai até a pilha deitada com os números", () => {
    expect(calcProjectBeatTime(at(tTilt), count)).toBe(tTilt + PROJECT_TILT);
    expect(calcProjectBeatTime(1, count)).toBe(tTilt + PROJECT_TILT);
  });
});

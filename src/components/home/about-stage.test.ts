import { describe, expect, it } from "vitest";
import { ABOUT_TIMELINE, calcAboutStep } from "./about-stage";

describe("calcAboutStep", () => {
  it("antes da troca o Giro espia curioso no ombro da foto", () => {
    expect(calcAboutStep(0)).toEqual({ k: "0", stop: "sb-peek", state: "curious" });
    expect(calcAboutStep(0.41)).toEqual({ k: "0", stop: "sb-peek", state: "curious" });
  });

  it("a partir de 0,42 a bio entra e o Giro fica satisfeito, na mesma parada", () => {
    expect(calcAboutStep(0.42)).toEqual({ k: "1", stop: "sb-peek", state: "done" });
    expect(calcAboutStep(1)).toEqual({ k: "1", stop: "sb-peek", state: "done" });
  });

  it("trata progresso inválido ou fora da faixa como começo ou fim", () => {
    expect(calcAboutStep(Number.NaN).k).toBe("0");
    expect(calcAboutStep(-1).k).toBe("0");
    expect(calcAboutStep(7).k).toBe("1");
  });
});

describe("ABOUT_TIMELINE", () => {
  it("a troca começa onde o Giro muda e a bio entra durante ela", () => {
    const { swapStart, swapEnd, bioIn } = ABOUT_TIMELINE;
    expect(swapStart).toBe(0.42);
    expect(swapEnd).toBe(0.68);
    expect(bioIn).toBeGreaterThan(swapStart);
    expect(bioIn).toBeLessThan(swapEnd);
  });
});

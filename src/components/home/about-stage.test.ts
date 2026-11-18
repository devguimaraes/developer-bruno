import { describe, expect, it } from "vitest";
import {
  ABOUT_SNAP_POINTS,
  ABOUT_SWAP,
  ABOUT_TIMELINE,
  calcAboutBeatTime,
  calcAboutStep,
} from "./about-stage";

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

describe("calcAboutBeatTime", () => {
  it("a troca começa onde o Giro muda de rosto e toca até a bio estar em cena", () => {
    const { swapStart } = ABOUT_TIMELINE;
    expect(calcAboutBeatTime(swapStart - 0.01)).toBe(0);
    expect(calcAboutBeatTime(swapStart)).toBe(ABOUT_SWAP);
    expect(calcAboutStep(swapStart).k).toBe("1");
  });

  it("progresso inválido fica no começo", () => {
    expect(calcAboutBeatTime(Number.NaN)).toBe(0);
  });
});

describe("ABOUT_SNAP_POINTS", () => {
  it("para na foto com os nomes e na bio", () => {
    expect(ABOUT_SNAP_POINTS.map(calcAboutBeatTime)).toEqual([0, ABOUT_SWAP]);
  });
});

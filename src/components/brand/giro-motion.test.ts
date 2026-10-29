import { describe, expect, it } from "vitest";
import { CIRCUMFERENCE, cubicBezier, loadingPose, spinFinish } from "./giro-motion";

describe("cubicBezier", () => {
  it("começa em 0, termina em 1 e passa pelo meio numa curva simétrica", () => {
    const ease = cubicBezier(0.42, 0, 0.58, 1);
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    expect(ease(0.5)).toBeCloseTo(0.5, 4);
  });

  it("acompanha a reta quando os pontos de controle estão nela", () => {
    const linear = cubicBezier(0.25, 0.25, 0.75, 0.75);
    expect(linear(0.3)).toBeCloseTo(0.3, 4);
  });
});

describe("loadingPose", () => {
  it("no primeiro quadro o arco está em repouso e sem giro", () => {
    expect(loadingPose(0)).toEqual({ rotation: 0, dash: 240, offset: 0 });
  });

  it("a primeira volta acelera e termina em 360° em 1 s", () => {
    expect(loadingPose(0.5).rotation).toBeLessThan(180);
    expect(loadingPose(1).rotation).toBeCloseTo(360, 5);
  });

  it("depois da primeira volta gira a uma volta a cada 900 ms", () => {
    expect(loadingPose(1.9).rotation).toBeCloseTo(720, 5);
  });

  it("o arco encolhe em 320 ms e depois cresce e encolhe num ciclo de 1,8 s", () => {
    expect(loadingPose(0.32).dash).toBeCloseTo(24, 5);
    const mid = loadingPose(0.32 + 0.9);
    expect(mid.dash).toBeCloseTo(150, 5);
    expect(mid.offset).toBeCloseTo(-60, 5);
    const end = loadingPose(0.32 + 1.8 - 1e-9);
    expect(end.dash).toBeCloseTo(24, 3);
    expect(end.offset).toBeCloseTo(-CIRCUMFERENCE, 3);
  });
});

describe("spinFinish", () => {
  it("falta pouco: termina rápido, no mínimo de 280 ms", () => {
    const finish = spinFinish({ rotation: 350, dash: 24, offset: 0 });
    expect(finish.from).toBeCloseTo(350, 5);
    expect(finish.duration).toBe(280);
  });

  it("falta quase uma volta: limita em 720 ms", () => {
    expect(spinFinish({ rotation: 370, dash: 24, offset: 0 }).duration).toBe(720);
  });

  it("no meio: 2,2 ms por grau que falta", () => {
    expect(spinFinish({ rotation: 900, dash: 24, offset: 0 }).duration).toBeCloseTo(396, 5);
  });

  it("o traço fecha o ciclo no offset mais perto", () => {
    expect(spinFinish({ rotation: 0, dash: 24, offset: -40 }).offsetTo).toBe(0);
    expect(spinFinish({ rotation: 0, dash: 24, offset: -200 }).offsetTo).toBe(-CIRCUMFERENCE);
  });
});

import { describe, expect, it } from "vitest";
import {
  calcJumpArcHeight,
  calcJumpDuration,
  calcJumpSpin,
  calcTargetScale,
  calcTrajectory,
  clamp,
  detectSurface,
  readStopSize,
} from "./giro-jump";

describe("giro-jump pure functions", () => {
  describe("clamp", () => {
    it("mantém valor dentro dos limites", () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe("calcJumpDuration", () => {
    it("limita ao piso de 340 ms para distâncias curtas", () => {
      expect(calcJumpDuration(0)).toBe(340);
      expect(calcJumpDuration(10)).toBe(340);
      expect(calcJumpDuration(40)).toBe(340);
    });

    it("calcula linearmente no intervalo médio", () => {
      // 320 + 230 / 2.3 = 320 + 100 = 420
      expect(calcJumpDuration(230)).toBe(420);
      // 320 + 460 / 2.3 = 320 + 200 = 520
      expect(calcJumpDuration(460)).toBe(520);
    });

    it("limita ao teto de 820 ms para distâncias longas", () => {
      expect(calcJumpDuration(1200)).toBe(820);
      expect(calcJumpDuration(3000)).toBe(820);
    });
  });

  describe("calcJumpArcHeight", () => {
    it("limita ao piso de 30 px para distâncias curtas", () => {
      expect(calcJumpArcHeight(0)).toBe(30);
      expect(calcJumpArcHeight(50)).toBe(30);
    });

    it("calcula linearmente no desktop com teto de 190 px", () => {
      // 300 * 0.3 = 90
      expect(calcJumpArcHeight(300, false)).toBe(90);
      // 500 * 0.3 = 150
      expect(calcJumpArcHeight(500, false)).toBe(150);
      // 700 * 0.3 = 210 -> limitado a 190
      expect(calcJumpArcHeight(700, false)).toBe(190);
    });

    it("limita ao teto de 110 px no celular", () => {
      // 300 * 0.3 = 90 (abaixo de 110)
      expect(calcJumpArcHeight(300, true)).toBe(90);
      // 400 * 0.3 = 120 -> limitado a 110
      expect(calcJumpArcHeight(400, true)).toBe(110);
      expect(calcJumpArcHeight(800, true)).toBe(110);
    });
  });

  describe("calcJumpSpin", () => {
    it("aplica rotação proporcional à distância", () => {
      expect(calcJumpSpin(0)).toBe(0);
      expect(calcJumpSpin(100)).toBe(90);
      expect(calcJumpSpin(400)).toBe(360);
    });
  });

  describe("calcTrajectory", () => {
    const p0 = { x: 100, y: 200 };
    const p1 = { x: 500, y: 600 };
    const h = 100;

    it("retorna p0 quando u = 0", () => {
      const pt = calcTrajectory(p0, p1, 0, h);
      expect(pt.x).toBe(100);
      expect(pt.y).toBe(200);
    });

    it("retorna pico da parábola quando u = 0.5", () => {
      // x médio = 300
      // y base médio = 400
      // arco = - 100 * 4 * 0.5 * 0.5 = -100
      // y = 400 - 100 = 300
      const pt = calcTrajectory(p0, p1, 0.5, h);
      expect(pt.x).toBe(300);
      expect(pt.y).toBe(300);
    });

    it("retorna p1 quando u = 1", () => {
      const pt = calcTrajectory(p0, p1, 1, h);
      expect(pt.x).toBe(500);
      expect(pt.y).toBe(600);
    });

    it("trava u fora do intervalo [0, 1]", () => {
      const below = calcTrajectory(p0, p1, -0.5, h);
      expect(below.x).toBe(100);
      expect(below.y).toBe(200);

      const above = calcTrajectory(p0, p1, 1.5, h);
      expect(above.x).toBe(500);
      expect(above.y).toBe(600);
    });
  });

  describe("calcTargetScale e readStopSize", () => {
    it("calcula a escala com base em 96 px", () => {
      expect(calcTargetScale(96)).toBe(1);
      expect(calcTargetScale(48)).toBe(0.5);
      expect(calcTargetScale(0)).toBe(64 / 96);
    });

    it("extrai tamanho de parada de elementos do DOM", () => {
      const el = document.createElement("div");
      el.dataset.size = "72";
      el.dataset.sizeM = "40";

      expect(readStopSize(el, false)).toBe(72);
      expect(readStopSize(el, true)).toBe(40);

      const elDefault = document.createElement("div");
      expect(readStopSize(elDefault, false)).toBe(64);
    });
  });

  describe("detectSurface", () => {
    it("retorna g-azul quando null ou sem container de cor", () => {
      expect(detectSurface(null)).toBe("g-azul");
      const div = document.createElement("div");
      expect(detectSurface(div)).toBe("g-azul");
    });

    it("detecta g-papel", () => {
      const parent = document.createElement("section");
      parent.className = "g-papel home-section";
      const child = document.createElement("i");
      parent.appendChild(child);

      expect(detectSurface(child)).toBe("g-papel");
    });

    it("detecta g-tinta", () => {
      const parent = document.createElement("section");
      parent.className = "g-tinta home-section";
      const child = document.createElement("i");
      parent.appendChild(child);

      expect(detectSurface(child)).toBe("g-tinta");
    });

    it("detecta g-azul", () => {
      const parent = document.createElement("section");
      parent.className = "g-azul home-section";
      const child = document.createElement("i");
      parent.appendChild(child);

      expect(detectSurface(child)).toBe("g-azul");
    });
  });
});

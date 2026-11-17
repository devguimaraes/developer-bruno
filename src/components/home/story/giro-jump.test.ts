import { describe, expect, it } from "vitest";
import {
  calcArcLift,
  calcFlightOmega,
  calcJumpArcHeight,
  calcJumpDuration,
  calcJumpSpin,
  calcStretch,
  calcTargetScale,
  clamp,
  detectSurface,
  MAX_FRAME,
  readStopSize,
  type SpringAxis,
  stepSpring,
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

  describe("calcArcLift", () => {
    it("sai do chão, chega ao pico no meio e volta ao chão", () => {
      expect(calcArcLift(0, 100)).toBe(0);
      expect(calcArcLift(0.5, 100)).toBe(100);
      expect(calcArcLift(1, 100)).toBe(0);
    });

    it("trava u fora do intervalo [0, 1]", () => {
      expect(calcArcLift(-0.5, 100)).toBe(0);
      expect(calcArcLift(1.5, 100)).toBe(0);
    });
  });

  describe("stepSpring", () => {
    const run = (axis: SpringAxis, target: number, seconds: number, dt: number) => {
      let a = axis;
      for (let t = 0; t < seconds; t += dt) a = stepSpring(a, target, 38, 0.78, dt);
      return a;
    };

    it("assenta no alvo e para", () => {
      const a = run({ x: 0, v: 0 }, 300, 1, 1 / 60);
      expect(a.x).toBeCloseTo(300, 0);
      expect(Math.abs(a.v)).toBeLessThan(1);
    });

    it("chega ao mesmo lugar em 30 e em 120 quadros por segundo", () => {
      const slow = run({ x: 0, v: 0 }, 300, 0.2, 1 / 30);
      const fast = run({ x: 0, v: 0 }, 300, 0.2, 1 / 120);
      expect(Math.abs(slow.x - fast.x)).toBeLessThan(3);
    });

    it("leva a velocidade que já tinha quando o alvo muda", () => {
      const moving = stepSpring({ x: 0, v: 900 }, 0, 38, 0.78, 1 / 60);
      expect(moving.x).toBeGreaterThan(0);
    });

    it("um quadro longo demais não vira um salto", () => {
      const long = stepSpring({ x: 0, v: 0 }, 300, 38, 0.78, 5);
      const capped = stepSpring({ x: 0, v: 0 }, 300, 38, 0.78, MAX_FRAME);
      expect(long.x).toBe(capped.x);
    });

    it("no voo chega perto do alvo antes do fim do salto", () => {
      const T = 600;
      let a: SpringAxis = { x: 0, v: 0 };
      for (let t = 0; t < T / 1000; t += 1 / 60) {
        a = stepSpring(a, 400, calcFlightOmega(T), 0.82, 1 / 60);
      }
      expect(Math.abs(a.x - 400)).toBeLessThan(12);
    });
  });

  describe("calcStretch", () => {
    it("não estica em movimento lento", () => {
      expect(calcStretch(120, 80).amount).toBe(0);
    });

    it("estica na direção da velocidade e tem teto", () => {
      const right = calcStretch(600, 0);
      expect(right.angle).toBe(0);
      expect(right.amount).toBeCloseTo(0.1, 5);
      expect(calcStretch(0, 9000).angle).toBe(90);
      expect(calcStretch(0, 9000).amount).toBe(0.2);
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

    it("a superfície declarada na parada vence a do DOM", () => {
      const parent = document.createElement("section");
      parent.className = "g-azul";
      const child = document.createElement("i");
      child.dataset.surface = "g-papel";
      parent.appendChild(child);

      expect(detectSurface(child)).toBe("g-papel");
    });

    it("ignora uma superfície declarada que não existe", () => {
      const parent = document.createElement("section");
      parent.className = "g-tinta";
      const child = document.createElement("i");
      child.dataset.surface = "g-roxo";
      parent.appendChild(child);

      expect(detectSurface(child)).toBe("g-tinta");
    });
  });
});

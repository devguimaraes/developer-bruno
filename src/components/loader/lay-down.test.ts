import { describe, expect, it } from "vitest";
import {
  DESKTOP_STACK,
  layerGeo,
  layerHeights,
  layoutScale,
  MOBILE_STACK,
  stackOrigin,
} from "@/components/hero/stack";
import {
  clamp01,
  computeLayDown,
  layDownCurve,
  lcMix,
  PAPER_EDGE_COLOR,
  PLATE_EDGE_COLORS,
} from "./lay-down";

describe("lay-down pure logic", () => {
  describe("clamp01 and layDownCurve", () => {
    it("clamp01 limita valores no intervalo [0, 1]", () => {
      expect(clamp01(-0.5)).toBe(0);
      expect(clamp01(0)).toBe(0);
      expect(clamp01(0.42)).toBe(0.42);
      expect(clamp01(1)).toBe(1);
      expect(clamp01(1.5)).toBe(1);
    });

    it("layDownCurve cumpre limites 0 e 1 e é monotonicamente crescente", () => {
      expect(layDownCurve(0)).toBe(0);
      expect(layDownCurve(1)).toBe(1);

      let prev = -1;
      for (let i = 0; i <= 20; i += 1) {
        const val = layDownCurve(i / 20);
        expect(val).toBeGreaterThanOrEqual(prev);
        prev = val;
      }
    });

    it("lcMix faz interpolação linear RGB entre duas cores", () => {
      expect(lcMix([0, 0, 0], [100, 200, 50], 0)).toBe("rgb(0, 0, 0)");
      expect(lcMix([0, 0, 0], [100, 200, 50], 1)).toBe("rgb(100, 200, 50)");
      expect(lcMix([0, 0, 0], [100, 200, 50], 0.5)).toBe("rgb(50, 100, 25)");
    });
  });

  describe("em u = 0", () => {
    it("tela cheia cobre viewport sem rotação (desktop)", () => {
      const W = 1440;
      const H = 900;
      const cfg = DESKTOP_STACK;
      const state = computeLayDown({ u: 0, cfg, W, H, viewH: H });

      // Câmera sem rotação e no centro da tela
      expect(state.camera.tilt).toBe(0);
      expect(state.camera.shrink).toBe(0);
      expect(state.camera.rxDeg).toBe(0);
      expect(state.camera.rzDeg).toBe(0);
      expect(state.camera.cx).toBe(W / 2);
      expect(state.camera.cy).toBe(H / 2);

      const k = cfg.k * layoutScale(cfg, W, H);
      expect(state.camera.k).toBeCloseTo(k);
      expect(state.camera.transform).toContain("rotateX(0.000deg) rotateZ(0.000deg)");

      // As 3 placas cobrem a viewport
      expect(state.plates).toHaveLength(3);
      for (const plate of state.plates) {
        expect(plate.x).toBe(0);
        expect(plate.y).toBe(0);
        // Dimensões escaladas para preencher a tela através da câmera
        expect(plate.ww).toBeCloseTo(W / k);
        expect(plate.wh).toBeCloseTo(H / k);
        expect(plate.ww * k).toBeCloseTo(W);
        expect(plate.wh * k).toBeCloseTo(H);

        expect(plate.sx).toBeCloseTo(1 / k);
        expect(plate.sy).toBeCloseTo(1 / k);

        // Sem quina arredondada (retangular como o viewport)
        expect(plate.borderRadius).toBe("0.00px / 0.00px");

        // Rótulo visível
        expect(plate.tagOpacity).toBe(1);

        // Wipe de papel ainda zerado
        expect(plate.wipe).toBe(0);
        expect(plate.paperTransform).toBe("scale(0.0000, 0.0000)");

        // Cor de borda original
        expect(plate.edgeColor).toBe(
          `rgb(${PLATE_EDGE_COLORS[plate.index][0]}, ${PLATE_EDGE_COLORS[plate.index][1]}, ${PLATE_EDGE_COLORS[plate.index][2]})`
        );
      }
    });

    it("tela cheia cobre viewport sem rotação (mobile)", () => {
      const W = 390;
      const H = 844;
      const cfg = MOBILE_STACK;
      const state = computeLayDown({ u: 0, cfg, W, H, viewH: H });

      expect(state.camera.tilt).toBe(0);
      expect(state.camera.rxDeg).toBe(0);
      expect(state.camera.rzDeg).toBe(0);
      expect(state.camera.cx).toBe(W / 2);
      expect(state.camera.cy).toBe(H / 2);

      const k = cfg.k * layoutScale(cfg, W, H);
      expect(state.camera.k).toBeCloseTo(k);

      for (const plate of state.plates) {
        expect(plate.x).toBe(0);
        expect(plate.y).toBe(0);
        expect(plate.ww * k).toBeCloseTo(W);
        expect(plate.wh * k).toBeCloseTo(H);
        expect(plate.borderRadius).toBe("0.00px / 0.00px");
      }
    });
  });

  describe("em u = 1", () => {
    it("posição, escala e Z de cada placa bate exatamente com layerGeo e layerHeights da pilha fechada (desktop)", () => {
      const W = 1440;
      const H = 900;
      const cfg = DESKTOP_STACK;
      const origin = stackOrigin(cfg, W, H, H);
      const state = computeLayDown({ u: 1, cfg, W, H, viewH: H });

      // Câmera pousou na rotação isométrica da hero (60deg, -45deg) e na origem
      expect(state.camera.tilt).toBe(1);
      expect(state.camera.shrink).toBe(1);
      expect(state.camera.rxDeg).toBeCloseTo(60);
      expect(state.camera.rzDeg).toBeCloseTo(-45);
      expect(state.camera.cx).toBeCloseTo(origin.x);
      expect(state.camera.cy).toBeCloseTo(origin.y);

      const closedHeights = layerHeights(cfg, [0, 0, 0, 0], [0, 0, 0, 0]);

      for (let i = 0; i < 3; i += 1) {
        const plate = state.plates[i];
        const geo = layerGeo(cfg, i);

        // Posição x, y bate exatamente com layerGeo
        expect(plate.x).toBeCloseTo(geo.x);
        expect(plate.y).toBeCloseTo(geo.y);

        // Dimensões ww, wh batem exatamente com layerGeo
        expect(plate.ww).toBeCloseTo(geo.w);
        expect(plate.wh).toBeCloseTo(geo.h);

        // Z bate com a pilha fechada da hero (zc), mais o micro-offset i * 0.1 que evita coplanaridade
        expect(plate.zc).toBeCloseTo(closedHeights[i]);
        expect(plate.z).toBeCloseTo(closedHeights[i] + i * 0.1);
        expect(Math.abs(plate.z - closedHeights[i])).toBeLessThanOrEqual(0.21);

        // Rótulos sumiram na pose assentada
        expect(plate.tagOpacity).toBe(0);

        // Wipe de papel completo (todas viraram papel)
        expect(plate.wipe).toBe(1);
        expect(plate.edgeColor).toBe(
          `rgb(${PAPER_EDGE_COLOR[0]}, ${PAPER_EDGE_COLOR[1]}, ${PAPER_EDGE_COLOR[2]})`
        );
      }
    });

    it("posição, escala e Z de cada placa bate exatamente com layerGeo e layerHeights da pilha fechada (mobile)", () => {
      const W = 390;
      const H = 844;
      const cfg = MOBILE_STACK;
      const origin = stackOrigin(cfg, W, H, H);
      const state = computeLayDown({ u: 1, cfg, W, H, viewH: H });

      expect(state.camera.tilt).toBe(1);
      expect(state.camera.rxDeg).toBeCloseTo(60);
      expect(state.camera.rzDeg).toBeCloseTo(-45);
      expect(state.camera.cx).toBeCloseTo(origin.x);
      expect(state.camera.cy).toBeCloseTo(origin.y);

      const closedHeights = layerHeights(cfg, [0, 0, 0, 0], [0, 0, 0, 0]);

      for (let i = 0; i < 3; i += 1) {
        const plate = state.plates[i];
        const geo = layerGeo(cfg, i);

        expect(plate.x).toBeCloseTo(geo.x);
        expect(plate.y).toBeCloseTo(geo.y);
        expect(plate.ww).toBeCloseTo(geo.w);
        expect(plate.wh).toBeCloseTo(geo.h);
        expect(plate.zc).toBeCloseTo(closedHeights[i]);
        expect(plate.z).toBeCloseTo(closedHeights[i] + i * 0.1);
      }
    });
  });

  describe("abertura no ar durante a transição", () => {
    it("as placas se separam em Z no meio do vôo (spread > 0) e pousam fechadas", () => {
      const W = 1440;
      const H = 900;
      const cfg = DESKTOP_STACK;

      const midState = computeLayDown({ u: 0.5, cfg, W, H, viewH: H });
      const endState = computeLayDown({ u: 1, cfg, W, H, viewH: H });

      expect(midState.camera.spread).toBeGreaterThan(0);
      // Na placa 2, o Z no ar com spread deve ser maior do que assentado
      expect(midState.plates[2].z).toBeGreaterThan(endState.plates[2].z);
    });
  });
});

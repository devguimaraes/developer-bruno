import { describe, expect, it } from "vitest";
import { SERVICES, calcServiceScrollTop, calcServiceStep } from "./service-stage";

describe("service-stage", () => {
  describe("SERVICES", () => {
    it("possui exatamente cinco serviços com artes, paradas e cores esperadas", () => {
      expect(SERVICES).toHaveLength(5);
      expect(SERVICES.map(s => s.stop)).toEqual(["sv0", "sv1", "sv2", "sv3", "sv4"]);
      expect(SERVICES.map(s => s.color)).toEqual(["azul", "nevoa", "tinta", "nevoa", "azul"]);
      expect(SERVICES.map(s => s.art)).toEqual([
        "sites-completos",
        "landing-pages",
        "product-ui",
        "full-stack",
        "branding",
      ]);
    });
  });

  describe("calcServiceStep", () => {
    it("retorna 0 para progresso no início ou abaixo de zero", () => {
      expect(calcServiceStep(-0.5)).toBe(0);
      expect(calcServiceStep(0)).toBe(0);
      expect(calcServiceStep(0.1)).toBe(0);
      expect(calcServiceStep(0.199)).toBe(0);
    });

    it("distribui os 5 passos proporcionalmente entre 0 e 1", () => {
      expect(calcServiceStep(0.2)).toBe(1);
      expect(calcServiceStep(0.35)).toBe(1);
      expect(calcServiceStep(0.399)).toBe(1);

      expect(calcServiceStep(0.4)).toBe(2);
      expect(calcServiceStep(0.5)).toBe(2);
      expect(calcServiceStep(0.599)).toBe(2);

      expect(calcServiceStep(0.6)).toBe(3);
      expect(calcServiceStep(0.75)).toBe(3);
      expect(calcServiceStep(0.799)).toBe(3);

      expect(calcServiceStep(0.8)).toBe(4);
      expect(calcServiceStep(0.95)).toBe(4);
      expect(calcServiceStep(1.0)).toBe(4);
    });

    it("prende em 4 para valores acima de 1", () => {
      expect(calcServiceStep(1.2)).toBe(4);
      expect(calcServiceStep(5.0)).toBe(4);
    });

    it("trata NaN retornando 0", () => {
      expect(calcServiceStep(Number.NaN)).toBe(0);
    });
  });

  describe("calcServiceScrollTop", () => {
    it("calcula a posição de rolagem centralizada em cada degrau de serviço", () => {
      const top = 1000;
      const len = 2500;

      expect(calcServiceScrollTop(0, top, len)).toBe(1000 + 0.1 * 2500);
      expect(calcServiceScrollTop(1, top, len)).toBe(1000 + 0.3 * 2500);
      expect(calcServiceScrollTop(2, top, len)).toBe(1000 + 0.5 * 2500);
      expect(calcServiceScrollTop(3, top, len)).toBe(1000 + 0.7 * 2500);
      expect(calcServiceScrollTop(4, top, len)).toBe(1000 + 0.9 * 2500);
    });

    it("limita índices fora do intervalo 0-4", () => {
      const top = 500;
      const len = 1000;
      expect(calcServiceScrollTop(-1, top, len)).toBe(500 + 0.1 * 1000);
      expect(calcServiceScrollTop(10, top, len)).toBe(500 + 0.9 * 1000);
    });
  });
});

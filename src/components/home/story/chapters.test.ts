import { describe, expect, it } from "vitest";
import { type Chapter, chapterAt, createChapter, progress } from "./chapters";

describe("chapters logic", () => {
  const ch1 = createChapter({
    id: "hero",
    label: "// início",
    top: 0,
    len: 2000,
    altura: 1000,
    lead: 0.5,
    surface: "azul",
    at: p => {
      if (p < 0.25) return { k: "entrada", stop: "tokens", state: "idle" };
      if (p < 0.75) return { k: "ciclo", stop: "componentes", state: "loading" };
      return { k: "descanso", stop: "chao", state: "done" };
    },
  });

  const ch2 = createChapter({
    id: "servicos",
    label: "// serviços",
    top: 2500,
    len: 3000,
    altura: 1000,
    lead: 0.5,
    surface: "papel",
    at: p => {
      if (p < 0.5) return { k: "sv1", stop: "sv-track", state: "curious" };
      return { k: "sv2", stop: "sv-track", state: "done" };
    },
  });

  const ch3 = createChapter({
    id: "projetos",
    label: "// projetos",
    top: 6000,
    len: 4000,
    altura: 1000,
    lead: 0.5,
    surface: "papel",
    at: p => {
      if (p < 0.3) return { k: "no-ar", stop: "pj-ch", state: "idle" };
      if (p < 0.8) return { k: "janela", stop: "pj-ch", state: "loading" };
      return { k: "pilha", stop: "pj-ch", state: "done" };
    },
  });

  const chapters: Chapter[] = [ch1, ch2, ch3];

  describe("createChapter e lead", () => {
    it("calcula y0 corretamente usando top - altura * lead", () => {
      // ch2: top 2500, altura 1000, lead 0.5 => y0 = 2500 - 500 = 2000
      expect(ch2.y0).toBe(2000);
      // ch3: top 6000, altura 1000, lead 0.5 => y0 = 6000 - 500 = 5500
      expect(ch3.y0).toBe(5500);
    });

    it("adota lead padrão 0.45 quando omitido", () => {
      const ch = createChapter({
        id: "test",
        label: "// teste",
        top: 1000,
        len: 500,
        altura: 1000,
        surface: "azul",
        at: () => ({ k: "0", stop: "s", state: "idle" }),
      });
      expect(ch.y0).toBe(1000 - 1000 * 0.45);
    });
  });

  describe("chapterAt e fronteira entre capítulos", () => {
    it("retorna o primeiro capítulo quando antes de y0 do segundo capítulo", () => {
      expect(chapterAt(-100, chapters)?.id).toBe("hero");
      expect(chapterAt(0, chapters)?.id).toBe("hero");
      expect(chapterAt(1999, chapters)?.id).toBe("hero");
    });

    it("troca para o capítulo exatamente na fronteira y0", () => {
      // Exatamente no y0 de ch2 (2000)
      expect(chapterAt(2000, chapters)?.id).toBe("servicos");
      expect(chapterAt(2500, chapters)?.id).toBe("servicos");
      expect(chapterAt(5499, chapters)?.id).toBe("servicos");

      // Exatamente no y0 de ch3 (5500)
      expect(chapterAt(5500, chapters)?.id).toBe("projetos");
      expect(chapterAt(7000, chapters)?.id).toBe("projetos");
    });

    it("retorna undefined para lista vazia de capítulos", () => {
      expect(chapterAt(100, [])).toBeUndefined();
    });
  });

  describe("progress preso entre 0 e 1", () => {
    it("trava em 0 quando y é menor que top", () => {
      expect(progress(-500, ch1)).toBe(0);
      expect(progress(0, ch1)).toBe(0);
      expect(progress(2400, ch2)).toBe(0);
    });

    it("calcula valores fracionários corretos dentro do intervalo", () => {
      // ch1: top 0, len 2000 -> em 1000 é 0.5
      expect(progress(1000, ch1)).toBe(0.5);
      // ch2: top 2500, len 3000 -> em 4000 é 1500/3000 = 0.5
      expect(progress(4000, ch2)).toBe(0.5);
      // ch2: em 3250 é 750/3000 = 0.25
      expect(progress(3250, ch2)).toBe(0.25);
    });

    it("trava em 1 quando y é maior que top + len", () => {
      expect(progress(2000, ch1)).toBe(1);
      expect(progress(3000, ch1)).toBe(1);
      expect(progress(5500, ch2)).toBe(1);
      expect(progress(10000, ch3)).toBe(1);
    });

    it("trata len <= 0 sem divisão por zero", () => {
      const zeroLenCh: Chapter = {
        id: "zero",
        label: "// zero",
        top: 100,
        len: 0,
        y0: 100,
        surface: "papel",
        at: () => ({ k: "0", stop: "s", state: "idle" }),
      };
      expect(progress(150, zeroLenCh)).toBe(0);
    });
  });

  describe("subir e descer dão a mesma chave (pureza / determinismo)", () => {
    it("gera exatamente a mesma chave k tanto avançando quanto retrocedendo na rolagem", () => {
      const scrollPoints = [100, 500, 1200, 1999, 2000, 3000, 4200, 5499, 5500, 6500, 8000, 10000];

      // Simulando descida (scroll down)
      const downKeys = scrollPoints.map(y => {
        const ch = chapterAt(y, chapters);
        if (!ch) throw new Error(`Capítulo não encontrado para y=${y}`);
        const p = progress(y, ch);
        return `${ch.id}:${ch.at(p).k}`;
      });

      // Simulando subida (scroll up - array invertido e depois revertido)
      const upKeysReversed = [...scrollPoints].reverse().map(y => {
        const ch = chapterAt(y, chapters);
        if (!ch) throw new Error(`Capítulo não encontrado para y=${y}`);
        const p = progress(y, ch);
        return `${ch.id}:${ch.at(p).k}`;
      });
      const upKeys = upKeysReversed.reverse();

      expect(downKeys).toEqual(upKeys);
    });
  });
});

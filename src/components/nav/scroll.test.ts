import { describe, expect, it } from "vitest";
import { activeSectionAt, articleProgress, clamp, readLineRatioOf, scrollPercent } from "./scroll";

describe("clamp", () => {
  it("prende o valor no intervalo", () => {
    expect(clamp(-5, 0, 100)).toBe(0);
    expect(clamp(120, 0, 100)).toBe(100);
    expect(clamp(40, 0, 100)).toBe(40);
  });
});

describe("scrollPercent", () => {
  it("calcula a porcentagem da faixa rolada", () => {
    expect(scrollPercent(250, 1000)).toBe(25);
    expect(scrollPercent(1000, 1000)).toBe(100);
  });

  it("não passa de 100 nem fica abaixo de 0", () => {
    expect(scrollPercent(1500, 1000)).toBe(100);
    expect(scrollPercent(-20, 1000)).toBe(0);
  });

  it("sem faixa para rolar, o conteúdo já está lido", () => {
    expect(scrollPercent(0, 0)).toBe(100);
    expect(scrollPercent(0, -300)).toBe(100);
  });

  it("um artigo que ainda não chegou ao topo está em 0", () => {
    expect(scrollPercent(-40, 800)).toBe(0);
  });
});

describe("readLineRatioOf", () => {
  it("lê a fração e ignora ausência ou texto inválido", () => {
    expect(readLineRatioOf("0.7")).toBe(0.7);
    expect(readLineRatioOf(null)).toBeNull();
    expect(readLineRatioOf("")).toBeNull();
    expect(readLineRatioOf("  ")).toBeNull();
    expect(readLineRatioOf("alto")).toBeNull();
  });
});

describe("articleProgress", () => {
  it("sem linha de leitura, 0 no topo da janela e 100 quando a base chega na base", () => {
    expect(articleProgress(0, 2000, 800, null)).toBe(0);
    expect(articleProgress(-600, 2000, 800, null)).toBe(50);
    expect(articleProgress(-1200, 2000, 800, null)).toBe(100);
  });

  it("com a linha a 70%, 0 quando o topo do artigo está na linha", () => {
    const viewport = 1000;
    expect(articleProgress(viewport * 0.7, 2000, viewport, 0.7)).toBe(0);
  });

  it("com a linha a 70%, 100 quando a base do artigo chega na mesma linha", () => {
    const viewport = 1000;
    const height = 2000;
    const top = viewport * 0.7 - height;
    expect(articleProgress(top, height, viewport, 0.7)).toBe(100);
  });

  it("com a linha a 70%, o meio do percurso é 50", () => {
    const viewport = 1000;
    const height = 2000;
    const top = viewport * 0.7 - height / 2;
    expect(articleProgress(top, height, viewport, 0.7)).toBe(50);
  });

  it("antes da linha, o progresso fica em 0", () => {
    expect(articleProgress(900, 2000, 1000, 0.7)).toBe(0);
  });

  it("a linha a 70% não usa o topo da janela como zero", () => {
    expect(articleProgress(0, 2000, 1000, null)).toBe(0);
    expect(articleProgress(0, 2000, 1000, 0.7)).toBe(35);
  });
});

describe("activeSectionAt", () => {
  const sections = [
    { id: "projetos", top: -900 },
    { id: "processo", top: 120 },
    { id: "sobre", top: 900 },
  ];

  it("é a última seção que já passou da linha de leitura", () => {
    expect(activeSectionAt(sections, 300)).toBe("processo");
  });

  it("uma seção abaixo da linha ainda não conta", () => {
    expect(activeSectionAt(sections, 100)).toBe("projetos");
  });

  it("sem seção passada da linha, não há seção ativa", () => {
    expect(activeSectionAt([{ id: "projetos", top: 800 }], 300)).toBeNull();
  });

  it("ignora a ordem da lista e escolhe a mais próxima da linha", () => {
    const shuffled = [sections[2], sections[0], sections[1]];
    expect(activeSectionAt(shuffled, 300)).toBe("processo");
  });

  it("sem seções nenhuma, devolve null", () => {
    expect(activeSectionAt([], 300)).toBeNull();
  });
});

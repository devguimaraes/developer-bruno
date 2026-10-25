import { describe, it, expect } from "vitest";
import { activeSectionAt, clamp, scrollPercent } from "./scroll";

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

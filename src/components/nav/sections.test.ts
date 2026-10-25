import { describe, it, expect } from "vitest";
import { HOME_SECTIONS, SECTION_IDS, TABS, tabForLocation } from "./sections";

describe("HOME_SECTIONS", () => {
  it("lista as cinco seções da home na ordem do documento", () => {
    expect(SECTION_IDS).toEqual(["projetos", "processo", "sobre", "blog", "contato"]);
  });

  it("o menu da ilha leva só Projetos, Processo e Sobre", () => {
    const inMenu = HOME_SECTIONS.filter(section => section.inMenu).map(section => section.id);
    expect(inMenu).toEqual(["projetos", "processo", "sobre"]);
  });
});

describe("TABS", () => {
  it("são Início, Projetos, Blog e Contato, nessa ordem", () => {
    expect(TABS.map(tab => tab.href)).toEqual(["/", "/#projetos", "/blog", "/#contato"]);
  });
});

describe("tabForLocation", () => {
  it("no topo da home, a aba é Início", () => {
    expect(tabForLocation("/", null)).toBe("home");
  });

  it("nas seções com aba, a aba segue a seção", () => {
    expect(tabForLocation("/", "projetos")).toBe("projects");
    expect(tabForLocation("/", "blog")).toBe("blog");
    expect(tabForLocation("/", "contato")).toBe("contact");
  });

  it("processo e sobre não têm aba", () => {
    expect(tabForLocation("/", "processo")).toBeNull();
    expect(tabForLocation("/", "sobre")).toBeNull();
  });

  it("a rota do blog e do case vale mesmo sem seção", () => {
    expect(tabForLocation("/blog/", null)).toBe("blog");
    expect(tabForLocation("/blog/meu-post", null)).toBe("blog");
    expect(tabForLocation("/projetos/atlas", null)).toBe("projects");
  });

  it("outras páginas não acendem aba", () => {
    expect(tabForLocation("/404", null)).toBeNull();
  });
});

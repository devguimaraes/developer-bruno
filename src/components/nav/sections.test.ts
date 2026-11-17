import { describe, it, expect } from "vitest";
import {
  HOME_SECTIONS,
  SECTION_IDS,
  TABS,
  islandLabel,
  routeSectionId,
  sectionHref,
  tabForLocation,
} from "./sections";

describe("HOME_SECTIONS", () => {
  it("lista as seções da home na ordem do documento, com serviços logo depois do hero", () => {
    expect(SECTION_IDS).toEqual(["servicos", "projetos", "processo", "sobre", "blog", "contato"]);
  });

  it("o menu da ilha leva as cinco seções, para o computador não ficar sem Blog e Contato", () => {
    const inMenu = HOME_SECTIONS.filter(section => section.inMenu).map(section => section.id);
    expect(inMenu).toEqual(["projetos", "processo", "sobre", "blog", "contato"]);
  });
});

describe("sectionHref", () => {
  it("Sobre tem página própria e as outras seções levam ao capítulo na home", () => {
    const hrefs = Object.fromEntries(
      HOME_SECTIONS.map(section => [section.id, sectionHref(section)])
    );
    expect(hrefs).toMatchObject({
      projetos: "/#projetos",
      sobre: "/sobre",
      contato: "/#contato",
    });
  });
});

describe("routeSectionId", () => {
  it("a página Sobre representa a seção sobre, com ou sem barra no fim", () => {
    expect(routeSectionId("/sobre")).toBe("sobre");
    expect(routeSectionId("/sobre/")).toBe("sobre");
  });

  it("as outras rotas não representam seção", () => {
    expect(routeSectionId("/")).toBeNull();
    expect(routeSectionId("/blog")).toBeNull();
    expect(routeSectionId("/sobre-nos")).toBeNull();
  });
});

describe("islandLabel", () => {
  it("na página Sobre a ilha mostra o rótulo da seção", () => {
    expect(islandLabel("pt", null, "/sobre/")).toBe("// sobre");
    expect(islandLabel("en", null, "/sobre")).toBe("// about");
  });

  it("no blog continua valendo a aba da rota", () => {
    expect(islandLabel("pt", null, "/blog")).toBe("// blog");
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

  // Regressão: com serviços no scroll spy, nenhuma aba acendia logo depois do hero.
  it("em serviços, logo depois do hero, a aba continua Início", () => {
    expect(tabForLocation("/", "servicos")).toBe("home");
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

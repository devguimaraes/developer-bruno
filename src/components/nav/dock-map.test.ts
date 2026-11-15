import { describe, expect, it } from "vitest";
import {
  DOCK_ITEMS,
  chapterToDockIndex,
  dockIndexFor,
  dockToneFor,
  routeToDockIndex,
} from "./dock-map";

describe("DOCK_ITEMS", () => {
  it("são seis, na ordem do trilho: Início, Serviços, Projetos, Sobre, Blog, Contato", () => {
    expect(DOCK_ITEMS.map(item => item.id)).toEqual([
      "home",
      "services",
      "projects",
      "about",
      "blog",
      "contact",
    ]);
  });

  it("Serviços leva para a home, e Sobre e Blog para as suas páginas", () => {
    const hrefs = Object.fromEntries(DOCK_ITEMS.map(item => [item.id, item.href]));
    expect(hrefs).toMatchObject({
      services: "/#servicos",
      about: "/sobre",
      blog: "/blog",
    });
  });
});

describe("chapterToDockIndex", () => {
  it("mapeia cada capítulo da home para o seu ícone", () => {
    expect(chapterToDockIndex("hero")).toBe(0);
    expect(chapterToDockIndex("servicos")).toBe(1);
    expect(chapterToDockIndex("projetos")).toBe(2);
    expect(chapterToDockIndex("processo")).toBe(2);
    expect(chapterToDockIndex("sobre")).toBe(3);
    expect(chapterToDockIndex("blog")).toBe(4);
    expect(chapterToDockIndex("contato")).toBe(5);
    expect(chapterToDockIndex("fim")).toBe(5);
  });

  it("capítulo desconhecido fica em Início", () => {
    expect(chapterToDockIndex("nao-existe")).toBe(0);
  });
});

describe("routeToDockIndex", () => {
  it("os cases acendem Projetos e o blog e seus posts acendem Blog", () => {
    expect(routeToDockIndex("/projetos/atlas")).toBe(2);
    expect(routeToDockIndex("/blog")).toBe(4);
    expect(routeToDockIndex("/blog/")).toBe(4);
    expect(routeToDockIndex("/blog/meu-post")).toBe(4);
  });

  it("a página Sobre acende Sobre, em tinta por ser página de papel", () => {
    expect(routeToDockIndex("/sobre")).toBe(3);
    expect(routeToDockIndex("/sobre/")).toBe(3);
    expect(dockToneFor("/sobre", null)).toBe("dark");
  });

  it("só Sobre abre a própria página a partir da home", () => {
    expect(DOCK_ITEMS.filter(item => item.opensPage).map(item => item.id)).toEqual(["about"]);
  });

  it("a home e as outras rotas não têm ícone próprio", () => {
    expect(routeToDockIndex("/")).toBeNull();
    expect(routeToDockIndex("/404")).toBeNull();
  });
});

describe("dockIndexFor", () => {
  it("na home segue o capítulo, e sem capítulo é o hero", () => {
    expect(dockIndexFor("/", "sobre")).toBe(3);
    expect(dockIndexFor("/", null)).toBe(0);
  });

  it("fora da home a rota vale e o capítulo é ignorado", () => {
    expect(dockIndexFor("/blog/post", "projetos")).toBe(4);
    expect(dockIndexFor("/projetos/atlas", null)).toBe(2);
  });

  it("rota sem ícone não acende nenhum", () => {
    expect(dockIndexFor("/404", null)).toBeNull();
  });
});

describe("dockToneFor", () => {
  it("tinta sobre serviços, projetos e blog, papel nas outras", () => {
    expect(dockToneFor("/", "servicos")).toBe("dark");
    expect(dockToneFor("/", "projetos")).toBe("dark");
    expect(dockToneFor("/", "blog")).toBe("dark");
    expect(dockToneFor("/", null)).toBe("light");
    expect(dockToneFor("/", "processo")).toBe("light");
    expect(dockToneFor("/", "sobre")).toBe("light");
    expect(dockToneFor("/", "contato")).toBe("light");
    expect(dockToneFor("/", "fim")).toBe("light");
  });

  it("o blog e os cases são de papel, então o trilho é de tinta", () => {
    expect(dockToneFor("/blog/post", null)).toBe("dark");
    expect(dockToneFor("/projetos/atlas", null)).toBe("dark");
  });

  it("o 404 é azul, então o trilho é de papel", () => {
    expect(dockToneFor("/404", null)).toBe("light");
  });
});

import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setLocale } from "@/lib/i18n";
import AboutPage, { type AboutPost } from "./AboutPage";

// A grade do topo é canvas e o jsdom não desenha: a página é testada sem ela.
vi.mock("@/components/about/FlickeringGrid", () => ({ FlickeringGrid: () => null }));

// Renderização pesada: com a suíte inteira em paralelo passa dos 5s padrão.
vi.setConfig({ testTimeout: 20_000 });

const posts: AboutPost[] = [
  {
    slug: "vercel-lovable",
    title: "Vercel + Lovable: o que realmente vazou",
    date: "2026-04-22",
    category: "Segurança",
    readTime: 8,
  },
  {
    slug: "react-19",
    title: "React 19 e Server Components",
    date: "2026-04-10",
    category: "React",
    readTime: 7,
  },
];

// 2026-11-01 é domingo: duas semanas inteiras.
const contributions = { total: 2381, start: "2026-11-01", levels: "01234012340123" };

afterEach(() => {
  setLocale("pt");
});

describe("AboutPage", () => {
  it("abre com o título da página e as seções na ordem do desenho", () => {
    render(<AboutPage posts={posts} contributions={contributions} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Oi, eu sou o Bruno.");
    const sections = screen.getAllByRole("heading", { level: 2 }).map(h => h.textContent);
    expect(sections).toEqual([
      "Sobre",
      "Experiência",
      "Formação",
      "Stack",
      "GitHub",
      "No ar.",
      "Blog",
      "Vamos conversar.",
    ]);
  });

  it("lista a experiência com cargo e período, e a formação", () => {
    render(<AboutPage posts={posts} contributions={contributions} />);
    const experience = screen.getByRole("region", { name: "Experiência" });
    const rows = within(experience).getAllByRole("listitem");
    expect(rows).toHaveLength(5);
    expect(rows[0]?.textContent).toContain("Pixel Pro Technologies");
    expect(rows[0]?.textContent).toContain("mar 2024 a hoje");
    expect(rows[3]?.textContent).toContain("Instituto Hélice");
    expect(rows[3]?.textContent).toContain("Newsletter Manager");
    const education = screen.getByRole("region", { name: "Formação" });
    expect(within(education).getByText("Senac RJ")).toBeTruthy();
  });

  it("mostra o total de contribuições e uma grade para cada tamanho de tela", () => {
    render(<AboutPage posts={posts} contributions={contributions} />);
    const github = screen.getByRole("region", { name: "GitHub" });
    expect(within(github).getByText("2.381")).toBeTruthy();
    const grids = within(github).getAllByRole("img");
    expect(grids.map(grid => grid.getAttribute("aria-label"))).toEqual([
      "Calendário de contribuições no GitHub: 2.381 nos últimos 12 meses",
      "Calendário de contribuições no GitHub nos últimos 6 meses. Total de 2.381 em 12 meses",
    ]);
    expect(grids[0]?.querySelectorAll("rect")).toHaveLength(14);
  });

  it("sem calendário, avisa e mantém o link do perfil", () => {
    render(<AboutPage posts={posts} contributions={null} />);
    const github = screen.getByRole("region", { name: "GitHub" });
    expect(within(github).queryByRole("img")).toBeNull();
    expect(within(github).getByText(/não carregou desta vez/)).toBeTruthy();
    expect(
      within(github).getByRole("link", { name: "Ver perfil no GitHub" }).getAttribute("href")
    ).toBe("https://github.com/devguimaraes");
  });

  it("liga cada case à sua página e cada post ao blog", () => {
    render(<AboutPage posts={posts} contributions={contributions} />);
    const projects = screen.getByRole("region", { name: "No ar." });
    const cases = within(projects)
      .getAllByRole("link")
      .map(link => link.getAttribute("href"));
    expect(cases).toHaveLength(6);
    expect(cases[0]).toBe("/projetos/estudio-entre");
    expect(cases[5]).toBe("/#projetos");

    const blog = screen.getByRole("region", { name: "Blog" });
    expect(
      within(blog).getByRole("link", { name: "React 19 e Server Components" }).getAttribute("href")
    ).toBe("/blog/react-19");
    expect(within(blog).getByRole("link", { name: "Ver todos" }).getAttribute("href")).toBe(
      "/blog"
    );
  });

  it("o contato leva ao formulário da home e oferece copiar o e-mail", () => {
    render(<AboutPage posts={posts} contributions={contributions} />);
    const contact = screen.getByRole("region", { name: "Vamos conversar." });
    expect(within(contact).getByRole("link", { name: "Falar comigo" }).getAttribute("href")).toBe(
      "/#contato"
    );
    expect(within(contact).getByRole("button", { name: "Copiar e-mail" })).toBeTruthy();
  });

  it("em inglês traduz títulos, cargos e períodos e avisa que os posts estão em português", () => {
    setLocale("en");
    render(<AboutPage posts={posts} contributions={contributions} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Hi, I'm Bruno.");
    const experience = screen.getByRole("region", { name: "Experience" });
    expect(within(experience).getByText("Mar 2024 to present")).toBeTruthy();
    expect(screen.getByText("2,381")).toBeTruthy();
    expect(screen.getAllByText(/In Portuguese/)).toHaveLength(2);
  });
});

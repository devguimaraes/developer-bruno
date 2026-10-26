import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { homeCases } from "@/data/projects";
import { setLocale } from "@/lib/i18n";
import { HomeProjects } from "./HomeProjects";

describe("HomeProjects", () => {
  afterEach(() => {
    setLocale("pt");
  });

  it("mostra o título da seção com a âncora de projetos na home", () => {
    render(<HomeProjects />);
    expect(screen.getByRole("heading", { level: 2, name: "Projetos" })).toBeInTheDocument();
    expect(screen.getByText("// projetos")).toBeInTheDocument();
  });

  it("renderiza um card por case, na ordem de homeCases", () => {
    const { container } = render(<HomeProjects />);
    const titles = Array.from(container.querySelectorAll(".g-project-card__title")).map(
      el => el.textContent
    );
    expect(titles).toEqual(homeCases.map(project => project.title));
  });

  it("cada card é um link para o case", () => {
    const { container } = render(<HomeProjects />);
    const links = Array.from(container.querySelectorAll("a.g-project-card"));
    expect(links.map(link => link.getAttribute("href"))).toEqual(
      homeCases.map(project => `/projetos/${project.slug}`)
    );
  });

  it("o primeiro case (Estúdio Entre) fica no destaque largo", () => {
    const { container } = render(<HomeProjects />);
    const items = container.querySelectorAll(".home-cases__item");
    expect(items[0]).toHaveClass("home-cases__item--wide");
    expect(items[1]).not.toHaveClass("home-cases__item--wide");
    expect(within(items[0] as HTMLElement).getByText("Estúdio Entre")).toBeInTheDocument();
  });

  it("troca o idioma do resumo e do rótulo de ação", () => {
    setLocale("en");
    render(<HomeProjects />);
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getAllByText("View case study")).toHaveLength(homeCases.length);
  });
});

import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { homeCases } from "@/data/projects";
import { setLocale } from "@/lib/i18n";
import { HomeProjects } from "./HomeProjects";

afterEach(() => {
  setLocale("pt");
});

describe("HomeProjects", () => {
  it("mostra o título e uma janela por case, com link para a página do case", () => {
    render(<HomeProjects />);

    expect(screen.getByRole("heading", { level: 2, name: "No ar." })).toBeInTheDocument();
    const windows = screen.getAllByRole("article");
    expect(windows).toHaveLength(homeCases.length);

    homeCases.forEach((project, i) => {
      const win = windows[i];
      expect(win).toHaveAccessibleName(project.title);
      expect(within(win).getByRole("heading", { level: 3, name: project.title })).toBeVisible();
      expect(within(win).getByText(project.label.pt)).toBeInTheDocument();
      expect(within(win).getByText(project.summary.pt)).toBeInTheDocument();
      expect(within(win).getByRole("link", { name: new RegExp(project.title) })).toHaveAttribute(
        "href",
        `/projetos/${project.slug}`
      );
    });
  });

  it("põe o endereço do site na barra da janela, sem protocolo nem www", () => {
    render(<HomeProjects />);
    const [entre] = screen.getAllByRole("article");
    expect(within(entre).getByText("estudioentre.com.br")).toBeInTheDocument();
    expect(within(entre).getByText("01/05")).toBeInTheDocument();
  });

  it("alterna as superfícies das janelas como na prancha", () => {
    render(<HomeProjects />);
    const surfaces = screen
      .getAllByRole("article")
      .map(win => [...win.classList].find(c => c.startsWith("g-")));
    expect(surfaces).toEqual(["g-tinta", "g-azul", "g-papel", "g-tinta", "g-azul"]);
  });

  it("lista a stack de cada case em texto", () => {
    render(<HomeProjects />);
    const stacks = screen.getAllByRole("list", { name: "Stack" });
    expect(stacks).toHaveLength(homeCases.length);
    expect(
      within(stacks[0])
        .getAllByRole("listitem")
        .map(li => li.textContent)
    ).toEqual([...homeCases[0].stack]);
  });

  it("mostra os outros sites no ar como links externos com o número e o que ele mede", () => {
    render(<HomeProjects />);
    expect(screen.getByText("// outros sites no ar")).toBeInTheDocument();
    expect(screen.getByText("números medidos em cada projeto")).toBeInTheDocument();

    const external = screen
      .getAllByRole("link")
      .filter(link => link.getAttribute("target") === "_blank");
    expect(external.map(link => link.getAttribute("href"))).toEqual([
      "https://www.agenciamultibr.com/",
      "https://atlasmarinesolutions.com/",
      "https://societyshow.com.br/",
    ]);
    for (const link of external) {
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    }
    expect(within(external[0]).getByText("−30%")).toBeInTheDocument();
    expect(
      within(external[0]).getByText("na taxa de rejeição depois do redesign")
    ).toBeInTheDocument();
  });

  it("marca as estações do Giro: título, vaga de cada janela, números e saída", () => {
    const { container } = render(<HomeProjects />);
    const stops = [...container.querySelectorAll("[data-stop]")].map(n =>
      n.getAttribute("data-stop")
    );
    expect(stops).toEqual(["pj-dot", "pj0", "pj1", "pj2", "pj3", "pj4", "pj-out", "pj-exit"]);
  });

  it("troca título, textos e chamada quando o idioma é inglês", () => {
    setLocale("en");
    render(<HomeProjects />);
    expect(screen.getByRole("heading", { level: 2, name: "Live." })).toBeInTheDocument();
    expect(screen.getByText(homeCases[0].label.en)).toBeInTheDocument();
    expect(screen.getByText(homeCases[0].summary.en)).toBeInTheDocument();
    expect(screen.getAllByText("View case study")).toHaveLength(homeCases.length);
    expect(screen.getByText("// other live sites")).toBeInTheDocument();
  });
});

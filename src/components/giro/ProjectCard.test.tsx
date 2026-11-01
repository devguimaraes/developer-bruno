import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard, type ProjectCardProps } from "./ProjectCard";

const withCover: ProjectCardProps["project"] = {
  title: "Estúdio Entre",
  stack: ["Astro", "React"],
  image: "/capa-estudio-entre.webp",
};

const withoutCover: ProjectCardProps["project"] = { ...withCover, image: null };

function renderCard(project: ProjectCardProps["project"] = withCover) {
  return render(
    <ProjectCard
      project={project}
      kicker="Hub cultural · Méier, RJ"
      summary="Plataforma cultural com eventos e loja."
      ctaLabel="Ver case"
      href="/projetos/estudio-entre"
    />
  );
}

describe("ProjectCard", () => {
  it("o card inteiro é um link para o case", () => {
    renderCard();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/projetos/estudio-entre");
    expect(link).toHaveTextContent("Estúdio Entre");
    expect(link).toHaveTextContent("Ver case");
  });

  it("a capa é decorativa (alt vazio)", () => {
    const { container } = renderCard();
    expect(container.querySelector("img")?.getAttribute("alt")).toBe("");
  });

  it("com capa, a imagem entra e não há Giro sobre ela", () => {
    const { container } = renderCard();
    expect(container.querySelector("img")).not.toBeNull();
    expect(container.querySelector(".g-giro")).toBeNull();
  });

  it("sem capa não renderiza a imagem", () => {
    const { container } = renderCard(withoutCover);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByRole("link")).toBeInTheDocument();
  });
});

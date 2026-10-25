import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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

// jsdom não tem PointerEvent; um MouseEvent basta para carregar clientX e clientY.
beforeAll(() => {
  if (!window.PointerEvent) {
    class PointerEventFallback extends MouseEvent {}
    Object.defineProperty(window, "PointerEvent", {
      value: PointerEventFallback,
      configurable: true,
    });
  }
});

// Centro do disco do Giro em (24, 24), com 48 px de lado.
function mockGiroRect() {
  const rect = { left: 0, top: 0, width: 48, height: 48, right: 48, bottom: 48, x: 0, y: 0 };
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect as DOMRect);
}

afterEach(() => {
  vi.restoreAllMocks();
});

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

  it("com capa, o Giro fica curious", () => {
    const { container } = renderCard();
    expect(container.querySelector('svg[data-state="curious"]')).not.toBeNull();
  });

  it("sem capa não renderiza a imagem nem o Giro", () => {
    const { container } = renderCard(withoutCover);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector(".g-project-card__giro")).toBeNull();
    expect(container.querySelector("svg[data-state]")).toBeNull();
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("os olhos seguem o ponteiro e o alcance para em 6 unidades", () => {
    mockGiroRect();
    const { container } = renderCard();
    const link = screen.getByRole("link");
    const giro = container.querySelector('svg[data-state="curious"]');

    // Longe do disco: o olhar satura em 6.
    fireEvent.pointerMove(link, { clientX: 500, clientY: 24 });
    expect(giro?.getAttribute("style")).toContain("--g-look-x: 6px");
    expect(giro?.getAttribute("style")).toContain("--g-look-y: 0px");

    // 96 px abaixo do centro, com 48 px de alcance por unidade: o olhar chega a 2.
    fireEvent.pointerMove(link, { clientX: 24, clientY: 120 });
    expect(giro?.getAttribute("style")).toContain("--g-look-x: 0px");
    expect(giro?.getAttribute("style")).toContain("--g-look-y: 2px");
  });

  it("ao sair do card os olhos voltam ao centro", () => {
    mockGiroRect();
    const { container } = renderCard();
    const link = screen.getByRole("link");
    fireEvent.pointerMove(link, { clientX: 500, clientY: 24 });
    fireEvent.pointerLeave(link);
    expect(container.querySelector("svg")?.getAttribute("style")).toContain("--g-look-x: 0px");
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeServices } from "./HomeServices";

vi.mock("./story/useChapterScenes", () => ({
  loadGsap: vi.fn().mockResolvedValue({
    gsap: {
      killTweensOf: vi.fn(),
      fromTo: vi.fn(),
    },
    ScrollTrigger: {},
  }),
}));

describe("HomeServices", () => {
  it("renderiza o palco com título, os cinco serviços e as paradas do Giro", () => {
    const { container } = render(<HomeServices />);

    expect(
      screen.getAllByRole("heading", { level: 2, name: "O que eu faço." }).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("// serviços").length).toBeGreaterThan(0);

    const titles = screen
      .getAllByRole("heading", { level: 3, hidden: true })
      .map(heading => heading.textContent);
    expect(titles).toEqual([
      "Sites completos",
      "Landing pages",
      "Interfaces de produto",
      "Full stack",
      "Branding",
    ]);

    const stops = container.querySelectorAll(".hs-stop.sv-dot");
    expect(stops).toHaveLength(5);
    expect(Array.from(stops).map(s => s.getAttribute("data-stop"))).toEqual([
      "sv0",
      "sv1",
      "sv2",
      "sv3",
      "sv4",
    ]);

    // Primeiro serviço ativo por padrão
    const rows = container.querySelectorAll(".sv-row");
    expect(rows).toHaveLength(5);
    expect(rows[0]).toHaveClass("is-on");
    expect(rows[1]).not.toHaveClass("is-on");

    const details = container.querySelectorAll(".sv-detail");
    expect(details[0]).toHaveClass("is-on");
    expect(details[1]).not.toHaveClass("is-on");
    expect(details[0]).toHaveAttribute("aria-hidden", "false");
    expect(details[1]).toHaveAttribute("aria-hidden", "true");

    const tags = Array.from(details[0].querySelectorAll(".sv-tags li")).map(el => el.textContent);
    expect(tags).toEqual(["Astro", "SEO", "CMS"]);
  });

  it("alterna o serviço ativo ao clicar numa linha da lista", () => {
    const { container } = render(<HomeServices />);

    const rows = container.querySelectorAll<HTMLButtonElement>(".sv-row");
    fireEvent.click(rows[1]); // Landing pages

    expect(rows[0]).not.toHaveClass("is-on");
    expect(rows[1]).toHaveClass("is-on");

    const details = container.querySelectorAll(".sv-detail");
    expect(details[0]).not.toHaveClass("is-on");
    expect(details[1]).toHaveClass("is-on");
    expect(details[0]).toHaveAttribute("aria-hidden", "true");
    expect(details[1]).toHaveAttribute("aria-hidden", "false");

    const panel = container.querySelector(".sv-panel");
    expect(panel).toHaveAttribute("data-c", "nevoa");
  });

  it("mantém as 5 artes carregáveis no palco com apenas a primeira ativa inicialmente", () => {
    const { container } = render(<HomeServices />);
    const arts = container.querySelectorAll(".sv-art");
    expect(arts).toHaveLength(5);
    expect(arts[0]).toHaveClass("is-on");
    expect(arts[0]).toHaveAttribute("aria-hidden", "false");
    expect(arts[1]).not.toHaveClass("is-on");
    expect(arts[1]).toHaveAttribute("aria-hidden", "true");
  });
});

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeServices } from "./HomeServices";

describe("HomeServices", () => {
  it("lista os cinco serviços com título, texto e tags", () => {
    render(<HomeServices />);
    expect(screen.getByRole("heading", { level: 2, name: "O que eu faço." })).toBeInTheDocument();
    expect(screen.getByText("// serviços")).toBeInTheDocument();

    const titles = screen.getAllByRole("heading", { level: 3 }).map(heading => heading.textContent);
    expect(titles).toEqual([
      "Sites completos",
      "Landing pages",
      "Interfaces de produto",
      "Full stack",
      "Branding",
    ]);

    const first = screen.getByRole("heading", { level: 3, name: "Sites completos" }).closest("li");
    if (!first) throw new Error("card sem li");
    expect(first).toHaveClass("g-azul");
    expect(
      within(first)
        .getAllByRole("listitem")
        .map(tag => tag.textContent)
    ).toEqual(["Astro", "SEO", "CMS"]);
  });

  it("mostra o Giro no lugar de cada arte antes de ela chegar", () => {
    const { container } = render(<HomeServices />);
    const arts = container.querySelectorAll(".service-art");
    expect(arts).toHaveLength(5);
    for (const art of arts) {
      expect(art).toHaveAttribute("data-ready", "false");
      expect(art.querySelector(".service-art__svg")?.childElementCount).toBe(0);
      expect(art.querySelector(".service-art__loading svg")).not.toBeNull();
    }
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeOtherSites } from "./HomeOtherSites";

describe("HomeOtherSites", () => {
  it("mostra os três sites no ar como links externos", () => {
    render(<HomeOtherSites />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    }
    expect(links.map(link => link.getAttribute("href"))).toEqual([
      "https://www.agenciamultibr.com/",
      "https://atlasmarinesolutions.com/",
      "https://societyshow.com.br/",
    ]);
  });

  it("separa o que cada número mede e a fonte", () => {
    render(<HomeOtherSites />);
    expect(screen.getByText("na taxa de rejeição depois do redesign")).toBeInTheDocument();
    expect(screen.getByText("Next.js · Core Web Vitals")).toBeInTheDocument();
    expect(screen.getByText("de contatos de novos clientes internacionais")).toBeInTheDocument();
    expect(screen.getByText("Next.js · site em quatro idiomas")).toBeInTheDocument();
    expect(screen.getByText("mais rápido para carregar que o site anterior")).toBeInTheDocument();
    expect(screen.getByText("Astro · Vercel")).toBeInTheDocument();
  });

  it("tem o rótulo // outros sites no ar", () => {
    render(<HomeOtherSites />);
    expect(screen.getByText("// outros sites no ar")).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { SiteHeader } from "./SiteHeader";
import { useScrollState } from "./useScrollState";
import type { ScrollState } from "./useScrollState";

vi.mock("./useScrollState", () => ({
  LOOK_PX: 3,
  useScrollState: vi.fn(),
}));

const SCROLL: ScrollState = {
  progress: 0,
  direction: 0,
  fast: false,
  activeId: "processo",
  pastHero: false,
  pathname: "/",
};

beforeEach(() => {
  vi.mocked(useScrollState).mockReturnValue(SCROLL);
});

describe("SiteHeader", () => {
  it("tem a assinatura e as cinco seções no menu principal", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Bruno Guimarães, início" })).toBeTruthy();
    const nav = screen.getByRole("navigation", { name: "Principal" });
    const items = within(nav)
      .getAllByRole("link")
      .map(link => link.textContent);
    expect(items).toEqual(["Projetos", "Processo", "Sobre", "Blog", "Contato"]);
  });

  it("marca só a seção atual com aria-current", () => {
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Principal" });
    expect(within(nav).getByRole("link", { name: "Processo" }).getAttribute("aria-current")).toBe(
      "true"
    );
    const sobre = within(nav).getByRole("link", { name: "Sobre" });
    expect(sobre.getAttribute("aria-current")).toBeNull();
  });

  it("os links apontam para a seção na home", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Contato" }).getAttribute("href")).toBe("/#contato");
  });

  it("traz a troca de idioma pt e en", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("group", { name: "Idioma" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "pt" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "en" })).toBeTruthy();
  });

  it("fica escondido no celular (hidden, md:block)", () => {
    const { container } = render(<SiteHeader />);
    expect(container.firstElementChild?.className).toContain("hidden");
    expect(container.querySelector("[data-site-header]")).not.toBeNull();
  });
});

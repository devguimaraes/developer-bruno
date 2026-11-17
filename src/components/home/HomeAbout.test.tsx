import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HomeAbout } from "./HomeAbout";

afterEach(() => {
  document.documentElement.removeAttribute("data-scenes");
});

describe("HomeAbout", () => {
  it("usa a foto duotone com o alt em português", () => {
    render(<HomeAbout />);
    expect(screen.getByAltText("Bruno Guimarães, de braços cruzados, sorrindo")).toHaveAttribute(
      "src",
      "/bruno-duo.webp"
    );
  });

  it("é a seção #sobre, nomeada pelo h2 da bio", () => {
    const { container } = render(<HomeAbout />);
    const section = container.querySelector("section#sobre");
    expect(section).not.toBeNull();
    const title = screen.getByRole("heading", { level: 2, name: "Bruno Guimarães" });
    expect(section?.getAttribute("aria-labelledby")).toBe(title.id);
  });

  it("esconde os dois nomes grandes dos leitores de tela", () => {
    const { container } = render(<HomeAbout />);
    const names = [...container.querySelectorAll(".sb-back, .sb-front")];
    expect(names.map(n => n.textContent)).toEqual(["Bruno", "Guimarães"]);
    for (const name of names) expect(name).toHaveAttribute("aria-hidden", "true");
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });

  it("marca a parada do Giro no ombro da foto", () => {
    const { container } = render(<HomeAbout />);
    const stop = container.querySelector(".sb-photo [data-stop]");
    expect(stop).toHaveAttribute("data-stop", "sb-peek");
    expect(stop).toHaveAttribute("data-size", "120");
    expect(stop).toHaveAttribute("data-size-m", "76");
    expect(stop).toHaveAttribute("aria-hidden", "true");
  });

  it("sem cenas lê em ordem: foto, bio, capacidades e fatos", () => {
    const { container } = render(<HomeAbout />);
    const order = [".sb-photo", ".sb-bio", ".sb-caps", ".sb-facts"].map(
      s => container.querySelector(s) as Element
    );
    for (let i = 0; i < order.length - 1; i++) {
      expect(
        order[i].compareDocumentPosition(order[i + 1]) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    }
  });

  it("mostra a bio em dois parágrafos", () => {
    render(<HomeAbout />);
    expect(
      screen.getByText(/no ponto em que design e engenharia se encontram/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Crio e mantenho design systems/)).toBeInTheDocument();
  });

  it("mostra os fatos: +5 anos, Senac e RJ", () => {
    const { container } = render(<HomeAbout />);
    const facts = Array.from(container.querySelectorAll(".sb-facts dt")).map(el => el.textContent);
    expect(facts).toEqual(["+5 anos", "Senac", "RJ"]);
  });

  it("leva para a página Sobre", () => {
    render(<HomeAbout />);
    expect(screen.getByRole("link", { name: "Ver minha trajetória" }).getAttribute("href")).toBe(
      "/sobre"
    );
  });

  it("lista as seis capacidades", () => {
    const { container } = render(<HomeAbout />);
    expect(container.querySelectorAll(".sb-caps li")).toHaveLength(6);
  });

  it("não mostra a linha AI-Native Development", () => {
    render(<HomeAbout />);
    expect(screen.queryByText(/AI-Native/i)).not.toBeInTheDocument();
  });
});

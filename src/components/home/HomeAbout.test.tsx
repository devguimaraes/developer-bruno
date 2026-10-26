import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeAbout } from "./HomeAbout";

describe("HomeAbout", () => {
  it("usa a foto com o alt em português", () => {
    render(<HomeAbout />);
    expect(screen.getByAltText("Bruno Guimarães, de braços cruzados, sorrindo")).toHaveAttribute(
      "src",
      "/brunoGuimaraes.webp"
    );
  });

  it("mostra a bio em dois parágrafos", () => {
    render(<HomeAbout />);
    expect(
      screen.getByText(/formado em Desenvolvimento de Sistemas Web pelo Senac/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Trabalho com React, TypeScript/)).toBeInTheDocument();
  });

  it("mostra os fatos: 5 anos, Senac e Rio de Janeiro", () => {
    const { container } = render(<HomeAbout />);
    const facts = Array.from(container.querySelectorAll(".home-about__facts dt")).map(
      el => el.textContent
    );
    expect(facts).toEqual(["5 anos", "Senac", "Rio de Janeiro"]);
  });

  it("lista as seis capacidades", () => {
    const { container } = render(<HomeAbout />);
    expect(container.querySelectorAll(".home-about__caps li")).toHaveLength(6);
  });

  it("não mostra a linha AI-Native Development", () => {
    render(<HomeAbout />);
    expect(screen.queryByText(/AI-Native/i)).not.toBeInTheDocument();
  });
});

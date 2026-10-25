import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Signature } from "./Signature";

describe("Signature", () => {
  it("é um link para o início com o nome acessível", () => {
    render(<Signature />);
    const link = screen.getByRole("link", { name: "Bruno Guimarães, início" });
    expect(link.getAttribute("href")).toBe("/");
  });

  it("põe o Giro de assinatura no lugar do o de bruno", () => {
    const { container } = render(<Signature />);
    const mark = container.querySelector(".g-signature__o svg.g-giro--signature");
    expect(mark).not.toBeNull();
  });

  it("aplica o tamanho como font-size quando recebe size", () => {
    render(<Signature size={72} />);
    const link = screen.getByRole("link", { name: "Bruno Guimarães, início" });
    expect(link.style.fontSize).toBe("72px");
  });

  it("sem size, deixa o tamanho para o CSS", () => {
    render(<Signature />);
    const link = screen.getByRole("link", { name: "Bruno Guimarães, início" });
    expect(link.style.fontSize).toBe("");
  });
});

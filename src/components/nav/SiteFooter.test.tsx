import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { contactData } from "@/config/site";
import { SiteFooter } from "./SiteFooter";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SiteFooter", () => {
  it("tem a assinatura, o botão de copiar e os links de GitHub e LinkedIn", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "Bruno Guimarães, início" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Copiar e-mail" })).toBeTruthy();

    const github = screen.getByRole("link", { name: /GitHub/ });
    const linkedin = screen.getByRole("link", { name: /LinkedIn/ });
    expect(github.getAttribute("href")).toContain("github.com");
    expect(linkedin.getAttribute("href")).toContain("linkedin.com");
    expect(screen.queryByRole("link", { name: /Instagram/ })).toBeNull();
  });

  it("traz a linha de base com o copyright e a origem do site", () => {
    render(<SiteFooter />);
    expect(screen.getByText("© 2026 Bruno Guimarães")).toBeTruthy();
    expect(screen.getByText("Feito com Astro")).toBeTruthy();
  });

  it("copia o e-mail de contato e responde no próprio botão", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });

    render(<SiteFooter />);
    fireEvent.click(screen.getByRole("button", { name: "Copiar e-mail" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Copiado" })).toBeTruthy();
    });
    expect(writeText).toHaveBeenCalledWith(contactData.email);
  });
});

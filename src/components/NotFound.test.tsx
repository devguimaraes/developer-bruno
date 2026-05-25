import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NotFound from "./pages/NotFound";

describe("NotFound page", () => {
  it("deve renderizar o status 404 e os caminhos principais de recuperação", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/PAGE/);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/NOT_FOUND/);
    expect(screen.getByRole("link", { name: /Voltar ao início/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /Ir para o blog/i })).toHaveAttribute("href", "/blog");
  });

  it("deve exibir o pathname atual quando disponível", () => {
    window.history.pushState({}, "", "/rota-inexistente");

    render(<NotFound />);

    expect(screen.getByText(/PATH: \/rota-inexistente/i)).toBeInTheDocument();
  });

  it("não deve vazar pathname no console", () => {
    window.history.pushState({}, "", "/rota-inexistente");
    const consoleSpy = vi.spyOn(console, "error");

    render(<NotFound />);

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NotFound from "./pages/NotFound";

describe("NotFound page", () => {
  it("renderiza o rótulo, o título e o texto de recuperação", () => {
    render(<NotFound />);

    expect(screen.getByText("// erro 404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Essa página se perdeu.");
    expect(
      screen.getByText("O endereço que você abriu não existe ou mudou de lugar.")
    ).toBeInTheDocument();
  });

  it("aponta os dois botões para o início e para o blog", () => {
    render(<NotFound />);

    expect(screen.getByRole("link", { name: /Voltar ao início/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /Ir para o blog/i })).toHaveAttribute("href", "/blog");
  });

  it("mostra o Giro no estado perdido", () => {
    const { container } = render(<NotFound />);

    expect(container.querySelector('svg[data-state="lost"]')).not.toBeNull();
  });

  it("não usa mais o tom de terminal antigo", () => {
    window.history.pushState({}, "", "/rota-inexistente");

    const { container } = render(<NotFound />);

    expect(container.textContent).not.toMatch(/LOST_SIGNAL|PAGE|NOT_FOUND|POS:|VER:/);
  });

  it("mostra o endereço atual depois da montagem", async () => {
    window.history.pushState({}, "", "/rota-inexistente");

    render(<NotFound />);

    expect(await screen.findByText("// endereço: /rota-inexistente")).toBeInTheDocument();
  });

  it("não escreve erro no console ao renderizar", () => {
    window.history.pushState({}, "", "/rota-inexistente");
    const consoleSpy = vi.spyOn(console, "error");

    render(<NotFound />);

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatesDemo } from "./StatesDemo";

describe("StatesDemo", () => {
  it("cada estado mostra a mensagem dele, e pronto não tem mensagem", () => {
    const { rerender } = render(<StatesDemo locale="pt" state="empty" />);
    expect(screen.getByText("Nada publicado ainda.")).toBeInTheDocument();

    rerender(<StatesDemo locale="pt" state="error" />);
    expect(screen.getByText("Não deu para publicar.")).toBeInTheDocument();
    expect(screen.getByText("estado: erro")).toBeInTheDocument();

    rerender(<StatesDemo locale="pt" state="done" />);
    expect(document.querySelector(".dm-msg")).toBeNull();
    expect(document.querySelector(".dm")?.getAttribute("data-st")).toBe("done");
  });

  it("só a tela de exemplo tem botão e paradas do Giro; a de leitura não", () => {
    const onPress = vi.fn();
    const { container, rerender } = render(
      <StatesDemo locale="pt" state="empty" onPress={onPress} />
    );
    expect(container.querySelectorAll("[data-stop]")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Publicar" }));
    expect(onPress).toHaveBeenCalledTimes(1);

    rerender(<StatesDemo locale="pt" state="empty" />);
    expect(container.querySelectorAll("[data-stop]")).toHaveLength(0);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("o botão desliga durante o carregamento", () => {
    render(<StatesDemo locale="pt" state="loading" onPress={() => {}} />);
    expect(screen.getByRole("button", { name: "Publicando" })).toBeDisabled();
  });
});

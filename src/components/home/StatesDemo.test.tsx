import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatesDemo } from "./StatesDemo";

describe("StatesDemo", () => {
  it("mostra a palavra e a mensagem de cada estado em português, sem barra nem título antigo", () => {
    const { container, rerender } = render(<StatesDemo locale="pt" state="empty" />);
    expect(container.querySelector(".dm-word")).toHaveTextContent("vazio");
    expect(screen.getAllByText("vazio")[0]).toHaveClass("g-sr");
    expect(screen.getByText("Nada publicado ainda.")).toBeInTheDocument();
    expect(container.querySelector(".dm-prog")).toBeNull();
    expect(container.querySelector(".dm-page__title")).toBeNull();

    rerender(<StatesDemo locale="pt" state="loading" />);
    expect(container.querySelector(".dm-word")).toHaveTextContent("carregando");
    expect(container.querySelector(".dm")?.getAttribute("data-from")).toBe("empty");
    expect(container.querySelector(".dm-word--fill")).not.toBeNull();

    rerender(<StatesDemo locale="pt" state="error" />);
    expect(container.querySelector(".dm-word")).toHaveTextContent("erro");
    expect(screen.getByText("Não deu para publicar.")).toBeInTheDocument();
    expect(screen.getByText("estado: erro")).toBeInTheDocument();
    expect(container.querySelector(".dm")?.getAttribute("data-from")).toBe("loading");

    rerender(<StatesDemo locale="pt" state="loading" />);
    expect(container.querySelector(".dm")?.getAttribute("data-from")).toBe("error");

    rerender(<StatesDemo locale="pt" state="done" />);
    expect(container.querySelector(".dm-word")).toHaveTextContent("No ar.");
    expect(container.querySelector(".dm-msg")).toBeNull();
    expect(container.querySelector(".dm")?.getAttribute("data-st")).toBe("done");
    expect(container.querySelector(".dm")?.getAttribute("data-from")).toBe("loading");
  });

  it("mostra a palavra de cada estado em inglês", () => {
    const { container, rerender } = render(<StatesDemo locale="en" state="empty" />);
    expect(container.querySelector(".dm-word")).toHaveTextContent("empty");

    rerender(<StatesDemo locale="en" state="loading" />);
    expect(container.querySelector(".dm-word")).toHaveTextContent("loading");

    rerender(<StatesDemo locale="en" state="error" />);
    expect(container.querySelector(".dm-word")).toHaveTextContent("error");

    rerender(<StatesDemo locale="en" state="done" />);
    expect(container.querySelector(".dm-word")).toHaveTextContent("Live.");
  });

  it("separa as letras em onda a partir do Giro, com índice crescente", () => {
    const { container } = render(<StatesDemo locale="pt" state="empty" />);
    const letters = [
      ...container.querySelectorAll<HTMLElement>(".dm-word:not(.dm-word--fill) .dm-ch"),
    ];
    expect(letters.map(el => el.textContent)).toEqual(["v", "a", "z", "i", "o"]);
    expect(letters.map(el => el.style.getPropertyValue("--i"))).toEqual(["0", "1", "2", "3", "4"]);
  });

  it("só a tela de exemplo tem botão e um único assento do Giro; a de leitura não", () => {
    const onPress = vi.fn();
    const { container, rerender } = render(
      <StatesDemo locale="pt" state="empty" onPress={onPress} />
    );
    const stops = container.querySelectorAll("[data-stop]");
    expect(stops).toHaveLength(1);
    expect(stops[0]).toHaveAttribute("data-stop", "card");
    expect(stops[0]).toHaveAttribute("data-size", "64");
    expect(stops[0]).toHaveAttribute("data-size-m", "44");
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

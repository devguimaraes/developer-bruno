import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setLocale } from "@/lib/i18n";
import { HomeOpening } from "./HomeOpening";
import { clearDemoOverride, getDemoOverride } from "./states-stage";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
});

afterEach(() => {
  vi.useRealTimers();
  clearDemoOverride();
  act(() => setLocale("pt"));
});

// A tela de exemplo interativa fica dentro de .ab-demo; as quatro de leitura, em .ab-grid.
const demo = () => within(document.querySelector(".ab-demo") as HTMLElement);
const demoState = () => document.querySelector(".ab-demo .dm")?.getAttribute("data-st");

describe("HomeOpening", () => {
  it("a abertura é uma seção #hero com a hero dentro e o título do capítulo Estados", () => {
    render(<HomeOpening />);

    const section = document.getElementById("hero");
    expect(section?.tagName).toBe("SECTION");
    expect(section?.querySelector("section.hb")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Interfaces com vida.");
    expect(
      screen.getByRole("heading", { level: 2, name: "Uma interface não é uma tela." })
    ).toBeInTheDocument();
  });

  it("sem as cenas há os quatro estados lado a lado, cada um com a sua frase e sem botão", () => {
    render(<HomeOpening />);

    const cells = [...document.querySelectorAll(".ab-grid .ab-cell")];
    expect(cells.map(c => c.querySelector(".dm")?.getAttribute("data-st"))).toEqual([
      "empty",
      "loading",
      "error",
      "done",
    ]);
    expect(cells[2]).toHaveTextContent("Quando falha, ela diz o que houve e como sair.");
    expect(document.querySelectorAll(".ab-grid button")).toHaveLength(0);
  });

  it("as paradas do Giro existem uma vez só: card na tela de exemplo, exit na saída", () => {
    render(<HomeOpening />);

    for (const name of ["hero", "card", "exit"]) {
      expect(document.querySelectorAll(`[data-stop="${name}"]`)).toHaveLength(1);
    }
    expect(document.querySelectorAll('[data-stop="card-done"]')).toHaveLength(0);
  });

  it("publicar vai a carregando e, em 1500 ms, a erro; tentar de novo vai a pronto em 1200 ms", () => {
    render(<HomeOpening />);
    expect(demoState()).toBe("empty");

    fireEvent.click(demo().getByRole("button", { name: "Publicar" }));
    expect(demoState()).toBe("loading");
    expect(getDemoOverride()).toBe("loading");

    act(() => vi.advanceTimersByTime(1499));
    expect(demoState()).toBe("loading");
    act(() => vi.advanceTimersByTime(1));
    expect(demoState()).toBe("error");

    fireEvent.click(demo().getByRole("button", { name: "Tentar de novo" }));
    expect(demoState()).toBe("loading");
    act(() => vi.advanceTimersByTime(1200));
    expect(demoState()).toBe("done");

    fireEvent.click(demo().getByRole("button", { name: "Publicar de novo" }));
    expect(demoState()).toBe("empty");
  });

  it("apertar durante o carregamento não faz nada: o botão está desligado", () => {
    render(<HomeOpening />);
    fireEvent.click(demo().getByRole("button", { name: "Publicar" }));

    const busy = demo().getByRole("button", { name: "Publicando" });
    expect(busy).toBeDisabled();
    fireEvent.click(busy);
    act(() => vi.advanceTimersByTime(1500));

    expect(demoState()).toBe("error");
  });

  it("os chips escolhem o estado e a frase acompanha", () => {
    render(<HomeOpening />);

    fireEvent.click(screen.getByRole("button", { name: "erro" }));

    expect(demoState()).toBe("error");
    expect(screen.getByRole("button", { name: "erro" })).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector(".ab-beat.is-on")).toHaveTextContent(
      "Quando falha, ela diz o que houve e como sair."
    );
    expect(getDemoOverride()).toBe("error");
  });

  it("rolar devolve a tela ao roteiro e cancela a troca que estava marcada", () => {
    render(<HomeOpening />);
    fireEvent.click(demo().getByRole("button", { name: "Publicar" }));
    expect(demoState()).toBe("loading");

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(getDemoOverride()).toBeNull();
    expect(demoState()).toBe("empty");

    // O erro que viria em 1500 ms não acontece mais.
    act(() => vi.advanceTimersByTime(3000));
    expect(demoState()).toBe("empty");
  });

  it("em inglês troca título, chips e tela de exemplo", () => {
    render(<HomeOpening />);
    act(() => setLocale("en"));

    expect(
      screen.getByRole("heading", { level: 2, name: "An interface is not a screen." })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ready" })).toBeInTheDocument();
    expect(demo().getByRole("button", { name: "Publish" })).toBeInTheDocument();
  });
});

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setLocale } from "@/lib/i18n";
import { HomeEnd } from "./HomeEnd";
import { getStorySignals, resetStorySignals } from "./story/story-signals";

afterEach(() => {
  setLocale("pt");
  resetStorySignals();
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("HomeEnd", () => {
  it("tem o título e o convite em pt e en", () => {
    const { unmount } = render(<HomeEnd />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Esta página também era camadas." })
    ).toBeInTheDocument();
    expect(screen.getByText("Escolha uma para voltar a ela.")).toBeInTheDocument();
    unmount();

    act(() => setLocale("en"));
    render(<HomeEnd />);
    expect(
      screen.getByRole("heading", { level: 2, name: "This page was layers too." })
    ).toBeInTheDocument();
    expect(screen.getByText("Pick one to go back to it.")).toBeInTheDocument();
  });

  it("é a seção #fim, nomeada pelo título", () => {
    render(<HomeEnd />);
    const section = document.getElementById("fim");
    expect(section).toHaveAttribute("aria-labelledby", "fn-title");
    expect(document.getElementById("fn-title")).toBeInTheDocument();
  });

  it("lista as oito camadas em ordem de leitura, com links para as âncoras dos capítulos", () => {
    render(<HomeEnd />);
    const nav = screen.getByRole("navigation", { name: "Camadas da página" });
    const links = within(nav).getAllByRole("link");
    expect(links.map(a => a.textContent)).toEqual([
      "// início",
      "// estados",
      "// serviços",
      "// projetos",
      "// processo",
      "// sobre",
      "// blog",
      "// contato",
    ]);
    expect(links.map(a => a.getAttribute("href"))).toEqual([
      "#hero",
      "#hero",
      "#servicos",
      "#projetos",
      "#processo",
      "#sobre",
      "#blog",
      "#contato",
    ]);
    const stops = [...nav.querySelectorAll("[data-stop]")].map(n => n.getAttribute("data-stop"));
    expect(stops).toEqual(["fn0", "fn1", "fn2", "fn3", "fn4", "fn5", "fn6", "fn7"]);
  });

  it("indexa as placas pelo data-i: no DOM a de baixo vem primeiro", () => {
    const { container } = render(<HomeEnd />);
    const order = [...container.querySelectorAll<HTMLElement>(".fn-pl")].map(p => p.dataset.i);
    expect(order).toEqual(["7", "6", "5", "4", "3", "2", "1", "0"]);
    const first = container.querySelector<HTMLElement>('.fn-pl[data-i="0"]');
    expect(first?.dataset.to).toBe("hero");
    expect(first?.textContent).toContain("Interfaces com vida.");
  });

  it("clicar num rótulo rola até o capítulo", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const target = document.createElement("section");
    target.id = "projetos";
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue({ top: 1200 } as DOMRect);
    document.body.append(target);
    render(<HomeEnd />);

    fireEvent.click(screen.getByRole("link", { name: "// projetos" }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 1200, behavior: "smooth" });
  });

  it("clicar numa placa também leva ao capítulo dela", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const target = document.createElement("section");
    target.id = "blog";
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue({ top: 900 } as DOMRect);
    document.body.append(target);
    const { container } = render(<HomeEnd />);

    const plate = container.querySelector<HTMLElement>('.fn-pl[data-i="6"]');
    if (!plate) throw new Error("placa 6 ausente");
    fireEvent.click(plate);
    expect(scrollTo).toHaveBeenCalledWith({ top: 900, behavior: "smooth" });
  });

  it("clicar no rótulo de início leva ao topo da página", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<HomeEnd />);
    fireEvent.click(screen.getByRole("link", { name: "// início" }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("hover ou foco num rótulo sobe a placa e avisa o Giro; sair e desmontar zeram o sinal", () => {
    const { container, unmount } = render(<HomeEnd />);
    const link = screen.getByRole("link", { name: "// serviços" });

    fireEvent.pointerEnter(link);
    expect(getStorySignals().endHover).toBe(2);
    const plate = container.querySelector<HTMLElement>('.fn-pl[data-i="2"]');
    expect(plate).toHaveClass("is-on");
    expect(plate).toHaveAttribute("data-lift", "30");

    fireEvent.pointerLeave(link);
    expect(getStorySignals().endHover).toBe(-1);
    expect(plate).not.toHaveClass("is-on");

    fireEvent.focus(link);
    expect(getStorySignals().endHover).toBe(2);
    unmount();
    expect(getStorySignals().endHover).toBe(-1);
  });

  it("hover numa placa também acende o rótulo dela", () => {
    const { container } = render(<HomeEnd />);
    const plate = container.querySelector<HTMLElement>('.fn-pl[data-i="5"]');
    if (!plate) throw new Error("placa 5 ausente");
    fireEvent.pointerEnter(plate);
    expect(screen.getByRole("link", { name: "// sobre" })).toHaveClass("is-on");
    expect(getStorySignals().endHover).toBe(5);
  });

  it("traz assinatura, LinkedIn, GitHub e a linha legal no rodapé da cena", () => {
    render(<HomeEnd />);
    expect(screen.getByRole("link", { name: "Bruno Guimarães, início" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/bcguimaraes/"
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/devguimaraes"
    );
    expect(screen.getByText("© 2026 Bruno Guimarães")).toBeInTheDocument();
  });
});

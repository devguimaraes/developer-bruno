import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { ScrollIsland, ScrollIslandView } from "./ScrollIsland";
import { useScrollState } from "./useScrollState";
import type { ScrollState } from "./useScrollState";

vi.mock("./useScrollState", () => ({
  LOOK_PX: 3,
  useScrollState: vi.fn(),
}));

const SCROLL: ScrollState = {
  progress: 62,
  direction: 1,
  fast: false,
  activeId: "processo",
  pastHero: true,
  pathname: "/",
};

beforeEach(() => {
  vi.mocked(useScrollState).mockReturnValue(SCROLL);
});

describe("ScrollIslandView", () => {
  it("mostra o rótulo da seção e o arco com o progresso", () => {
    const { container } = render(
      <ScrollIslandView progress={62} label="// processo" direction={1} />
    );
    expect(screen.getByText("// processo")).toBeTruthy();
    const giro = container.querySelector("svg.g-giro");
    expect(giro?.getAttribute("data-progress")).toBe("62");
    expect(giro?.getAttribute("data-state")).toBeNull();
  });

  it("no fim da página, o Giro fecha em sorriso e pula", () => {
    const { container } = render(
      <ScrollIslandView progress={100} label="// sobre" direction={1} />
    );
    const giro = container.querySelector("svg.g-giro");
    expect(giro?.getAttribute("data-state")).toBe("done");
    expect(giro?.classList.contains("is-hop")).toBe(true);
  });

  it("o botão do menu anuncia o estado e vira fechar quando aberto", () => {
    const { rerender } = render(
      <ScrollIslandView progress={10} label="// projetos" direction={0} />
    );
    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    rerender(<ScrollIslandView progress={10} label="// projetos" direction={0} menuOpen />);
    const closeToggle = screen.getByRole("button", { name: "Fechar menu" });
    expect(closeToggle.getAttribute("aria-expanded")).toBe("true");
  });

  it("menu aberto lista Projetos, Processo e Sobre num diálogo", () => {
    render(<ScrollIslandView progress={10} label="// projetos" direction={0} menuOpen />);
    const dialog = screen.getByRole("dialog");
    const items = within(dialog)
      .getAllByRole("link")
      .map(link => link.textContent);
    expect(items).toEqual(["Projetos", "Processo", "Sobre"]);
  });

  it("marca a seção atual no menu com aria-current", () => {
    render(
      <ScrollIslandView
        progress={10}
        label="// processo"
        direction={0}
        menuOpen
        activeId="processo"
      />
    );
    const current = within(screen.getByRole("dialog")).getByRole("link", { name: "Processo" });
    expect(current.getAttribute("aria-current")).toBe("true");
  });

  it("chama onToggleMenu ao tocar no botão", () => {
    const onToggleMenu = vi.fn();
    render(
      <ScrollIslandView
        progress={10}
        label="// projetos"
        direction={0}
        onToggleMenu={onToggleMenu}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
    expect(onToggleMenu).toHaveBeenCalledTimes(1);
  });

  it("some (data-visible=false) quando a ilha não deve aparecer", () => {
    const { container } = render(
      <ScrollIslandView progress={0} label="// início" direction={0} visible={false} />
    );
    expect(container.querySelector(".g-island-dock")?.getAttribute("data-visible")).toBe("false");
  });

  it("liga data-fast para o giro extra na rolagem rápida", () => {
    const { container } = render(
      <ScrollIslandView progress={30} label="// processo" direction={1} fast />
    );
    expect(container.querySelector(".g-island")?.getAttribute("data-fast")).toBe("true");
  });
});

describe("ScrollIsland", () => {
  it("usa o rótulo da seção em leitura", () => {
    render(<ScrollIsland />);
    expect(screen.getByText("// processo")).toBeTruthy();
  });

  it("sem seção, usa a aba da rota", () => {
    vi.mocked(useScrollState).mockReturnValue({ ...SCROLL, activeId: null, pathname: "/blog" });
    render(<ScrollIsland />);
    expect(screen.getByText("// blog")).toBeTruthy();
  });

  it("abre e fecha o menu, e Escape fecha e devolve o foco ao botão", () => {
    render(<ScrollIsland />);
    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    fireEvent.click(toggle);
    expect(screen.getByRole("dialog")).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(document.getElementById("scroll-island-toggle"));
  });

  it("não mostra giro extra quando o movimento está reduzido", () => {
    const matchMedia = vi.mocked(window.matchMedia);
    const original = matchMedia.getMockImplementation();
    matchMedia.mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    vi.mocked(useScrollState).mockReturnValue({ ...SCROLL, fast: true });

    try {
      const { container } = render(<ScrollIsland />);
      expect(container.querySelector(".g-island")?.getAttribute("data-fast")).toBeNull();
    } finally {
      if (original) matchMedia.mockImplementation(original);
    }
  });
});

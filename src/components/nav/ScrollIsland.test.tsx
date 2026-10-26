import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { setPageGiro } from "@/lib/page-giro";
import { ScrollIsland, ScrollIslandView } from "./ScrollIsland";
import { endGiroParty } from "./useGiroEggs";
import { useScrollState } from "./useScrollState";
import type { ScrollState } from "./useScrollState";

vi.mock("./useScrollState", () => ({
  LOOK_PX: 3,
  useScrollState: vi.fn(),
}));

function setDocumentHidden(hidden: boolean): void {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => hidden,
  });
}

function restoreDocumentHidden(): void {
  Reflect.deleteProperty(document, "hidden");
}

function typeGiro(): void {
  act(() => {
    for (const key of ["g", "i", "r", "o"]) {
      document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
    }
  });
}

function endPartyAnimation(target: Element): void {
  const event = new Event("animationend", { bubbles: true });
  Object.defineProperty(event, "animationName", { value: "g-party" });
  act(() => {
    target.dispatchEvent(event);
  });
}

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

afterEach(() => {
  restoreDocumentHidden();
  act(() => {
    document.dispatchEvent(new Event("visibilitychange"));
    endGiroParty();
    setPageGiro(null);
  });
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

  it("durante a troca de página, o Giro gira em carregando sem pular", () => {
    const { container } = render(
      <ScrollIslandView progress={100} label="// sobre" direction={1} navigating />
    );
    const giro = container.querySelector("svg.g-giro");
    expect(giro?.getAttribute("data-state")).toBe("loading");
    expect(giro?.classList.contains("is-hop")).toBe(false);
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

  it("dorme quando a prop asleep está ligada, mesmo no fim da página", () => {
    const { container } = render(
      <ScrollIslandView progress={100} label="// sobre" direction={1} asleep />
    );
    const giro = container.querySelector("svg.g-giro");
    expect(giro?.getAttribute("data-state")).toBe("sleeping");
    expect(giro?.classList.contains("is-hop")).toBe(false);
    expect(giro?.classList.contains("is-party")).toBe(false);
  });

  it("festeja com data-state celebrating e a classe is-party", () => {
    const { container } = render(
      <ScrollIslandView progress={100} label="// sobre" direction={1} celebrating />
    );
    const giro = container.querySelector("svg.g-giro");
    expect(giro?.getAttribute("data-state")).toBe("celebrating");
    expect(giro?.classList.contains("is-party")).toBe(true);
    expect(giro?.classList.contains("is-hop")).toBe(false);
  });

  it("no fim da página, o sorriso e o pulo vencem o Giro de erro da página", () => {
    const { container } = render(
      <ScrollIslandView progress={100} label="// sobre" direction={1} pageGiro="error" />
    );
    const giro = container.querySelector("svg.g-giro");
    expect(giro?.getAttribute("data-state")).toBe("done");
    expect(giro?.classList.contains("is-hop")).toBe(true);
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

  it("mostra o Giro da página enquanto a leitura não acabou", () => {
    setPageGiro("error");
    const { container } = render(<ScrollIsland />);
    expect(container.querySelector("svg.g-giro")?.getAttribute("data-state")).toBe("error");
  });

  it("dorme com a aba inativa e acorda quando ela volta", () => {
    setDocumentHidden(true);
    const { container } = render(<ScrollIsland />);
    expect(container.querySelector("svg.g-giro")?.getAttribute("data-state")).toBe("sleeping");

    setDocumentHidden(false);
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(container.querySelector("svg.g-giro")?.getAttribute("data-state")).toBeNull();
  });

  it("festeja ao digitar giro e encerra quando a animação acaba", () => {
    const { container } = render(<ScrollIsland />);
    typeGiro();
    const giro = container.querySelector("svg.g-giro");
    expect(giro?.getAttribute("data-state")).toBe("celebrating");
    expect(giro?.classList.contains("is-party")).toBe(true);

    const body = giro?.querySelector(".g-giro__body");
    expect(body).toBeTruthy();
    if (body) endPartyAnimation(body);
    expect(container.querySelector("svg.g-giro")?.getAttribute("data-state")).toBeNull();
    expect(container.querySelector("svg.g-giro")?.classList.contains("is-party")).toBe(false);
  });
});

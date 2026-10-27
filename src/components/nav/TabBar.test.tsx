import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { setPageGiro } from "@/lib/page-giro";
import { TabBar, TabBarView } from "./TabBar";
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
  progress: 40,
  direction: 1,
  fast: false,
  activeId: null,
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

describe("TabBarView", () => {
  it("tem as quatro abas, com a ativa marcada com aria-current=page", () => {
    render(<TabBarView progress={40} activeTab="projects" />);
    const nav = screen.getByRole("navigation", { name: "Navegação" });
    const tabs = within(nav)
      .getAllByRole("link")
      .map(link => link.textContent);
    expect(tabs).toEqual(["Início", "Projetos", "Blog", "Contato"]);

    const current = within(nav).getByRole("link", { name: "Projetos" });
    expect(current.getAttribute("aria-current")).toBe("page");
    expect(within(nav).getByRole("link", { name: "Blog" }).getAttribute("aria-current")).toBeNull();
  });

  it("durante a troca de página, o Giro central gira em carregando", () => {
    const { container } = render(<TabBarView progress={100} activeTab={null} navigating />);
    const giro = container.querySelector(".g-tabbar__giro svg.g-giro");
    expect(giro?.getAttribute("data-state")).toBe("loading");
    expect(giro?.classList.contains("is-hop")).toBe(false);
  });

  it("o Giro central diz quanto da leitura já foi feita", () => {
    render(<TabBarView progress={40} activeTab={null} />);
    expect(screen.getByRole("button", { name: "Abrir menu, 40% lido" })).toBeTruthy();
  });

  it("o botão do Giro abre o menu com Processo, Sobre e idioma", () => {
    const onToggleMenu = vi.fn();
    const { rerender } = render(
      <TabBarView progress={40} activeTab={null} onToggleMenu={onToggleMenu} />
    );
    const toggle = screen.getByRole("button", { name: "Abrir menu, 40% lido" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(onToggleMenu).toHaveBeenCalledTimes(1);

    rerender(<TabBarView progress={40} activeTab={null} menuOpen />);
    expect(screen.getByRole("button", { name: "Fechar menu" }).getAttribute("aria-expanded")).toBe(
      "true"
    );
    const dialog = screen.getByRole("dialog");
    const items = within(dialog)
      .getAllByRole("link")
      .map(link => link.textContent);
    expect(items).toEqual(["Processo", "Sobre"]);
    expect(within(dialog).getByRole("group", { name: "Idioma" })).toBeTruthy();
  });

  it("o Giro fecha em sorriso quando a leitura chega ao fim", () => {
    const { container } = render(<TabBarView progress={100} activeTab="contact" />);
    expect(container.querySelector(".g-tabbar__giro svg")?.getAttribute("data-state")).toBe("done");
  });

  it("dorme quando a prop asleep está ligada, mesmo no fim da página", () => {
    const { container } = render(<TabBarView progress={100} activeTab="contact" asleep />);
    const giro = container.querySelector(".g-tabbar__giro svg.g-giro");
    expect(giro?.getAttribute("data-state")).toBe("sleeping");
    expect(giro?.classList.contains("is-hop")).toBe(false);
    expect(giro?.classList.contains("is-party")).toBe(false);
  });

  it("festeja com data-state celebrating e a classe is-party", () => {
    const { container } = render(<TabBarView progress={100} activeTab="contact" celebrating />);
    const giro = container.querySelector(".g-tabbar__giro svg.g-giro");
    expect(giro?.getAttribute("data-state")).toBe("celebrating");
    expect(giro?.classList.contains("is-party")).toBe(true);
    expect(giro?.classList.contains("is-hop")).toBe(false);
  });

  it("no fim da página, o sorriso e o pulo vencem o Giro de erro da página", () => {
    const { container } = render(
      <TabBarView progress={100} activeTab="contact" pageGiro="error" />
    );
    const giro = container.querySelector(".g-tabbar__giro svg.g-giro");
    expect(giro?.getAttribute("data-state")).toBe("done");
    expect(giro?.classList.contains("is-hop")).toBe(true);
  });
});

describe("TabBar", () => {
  it("acende o Blog na rota /blog", () => {
    vi.mocked(useScrollState).mockReturnValue({ ...SCROLL, pathname: "/blog/post-x" });
    render(<TabBar />);
    const blog = screen.getByRole("link", { name: "Blog" });
    expect(blog.getAttribute("aria-current")).toBe("page");
  });

  it("acende Contato quando a seção em leitura é contato", () => {
    vi.mocked(useScrollState).mockReturnValue({ ...SCROLL, activeId: "contato" });
    render(<TabBar />);
    expect(screen.getByRole("link", { name: "Contato" }).getAttribute("aria-current")).toBe("page");
  });

  it("sem seção com aba (processo), nenhuma aba fica marcada", () => {
    vi.mocked(useScrollState).mockReturnValue({ ...SCROLL, activeId: "processo" });
    const { container } = render(<TabBar />);
    expect(container.querySelector('.g-tab[aria-current="page"]')).toBeNull();
  });

  it("mostra o Giro da página enquanto a leitura não acabou", () => {
    setPageGiro("error");
    const { container } = render(<TabBar />);
    expect(container.querySelector(".g-tabbar__giro svg")?.getAttribute("data-state")).toBe(
      "error"
    );
  });

  it("dorme com a aba inativa e acorda quando ela volta", () => {
    setDocumentHidden(true);
    const { container } = render(<TabBar />);
    const giro = () => container.querySelector(".g-tabbar__giro svg");
    expect(giro()?.getAttribute("data-state")).toBe("sleeping");

    setDocumentHidden(false);
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(giro()?.getAttribute("data-state")).toBeNull();
  });

  it("festeja ao digitar giro e encerra quando a animação acaba", () => {
    const { container } = render(<TabBar />);
    typeGiro();
    const giro = () => container.querySelector(".g-tabbar__giro svg");
    expect(giro()?.getAttribute("data-state")).toBe("celebrating");
    expect(giro()?.classList.contains("is-party")).toBe(true);

    const body = giro()?.querySelector(".g-giro__body");
    expect(body).toBeTruthy();
    if (body) endPartyAnimation(body);
    expect(giro()?.getAttribute("data-state")).toBeNull();
    expect(giro()?.classList.contains("is-party")).toBe(false);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { TabBar, TabBarView } from "./TabBar";
import { useScrollState } from "./useScrollState";
import type { ScrollState } from "./useScrollState";

vi.mock("./useScrollState", () => ({
  LOOK_PX: 3,
  useScrollState: vi.fn(),
}));

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
});

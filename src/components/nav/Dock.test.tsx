import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetGiroOnStageForTesting, setGiroOnStage } from "@/lib/giroOnStage";
import { setPageGiro } from "@/lib/page-giro";
import { Dock, DockView } from "./Dock";
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

function typeGiro(): void {
  act(() => {
    for (const key of ["g", "i", "r", "o"]) {
      document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
    }
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
  Reflect.deleteProperty(document, "hidden");
  act(() => {
    document.dispatchEvent(new Event("visibilitychange"));
    endGiroParty();
    setPageGiro(null);
    resetGiroOnStageForTesting();
  });
});

const NAMES = ["Início", "Serviços", "Projetos", "Sobre", "Blog", "Contato"];

describe("DockView", () => {
  it("tem os seis ícones na ordem, com o ativo marcado com aria-current=page", () => {
    render(<DockView activeIndex={2} tone="dark" progress={40} />);
    const nav = screen.getByRole("navigation", { name: "Navegação" });
    const links = within(nav).getAllByRole("link");
    expect(links.map(link => link.getAttribute("aria-label"))).toEqual(NAMES);
    expect(links.map(link => link.getAttribute("aria-current"))).toEqual([
      null,
      null,
      "page",
      null,
      null,
      null,
    ]);
  });

  it("mostra o nome embaixo dos ícones fora do arco e nenhum no do arco", () => {
    const { container } = render(<DockView activeIndex={2} tone="dark" progress={40} />);
    const names = [...container.querySelectorAll(".g-dock__item")].map(
      item => item.querySelector(".g-dock__name")?.textContent ?? null
    );
    expect(names).toEqual(["Início", "Serviços", null, "Sobre", "Blog", "Contato"]);
  });

  it("leva Serviços para a home e Sobre e Blog para as suas páginas", () => {
    render(<DockView activeIndex={0} tone="light" progress={0} />);
    const href = (name: string) => screen.getByRole("link", { name }).getAttribute("href");
    expect(href("Início")).toBe("/");
    expect(href("Serviços")).toBe("/#servicos");
    expect(href("Sobre")).toBe("/sobre");
    expect(href("Blog")).toBe("/blog");
  });

  it("a superfície do trilho vem do tom e o arco fica na estação ativa", () => {
    const { container } = render(<DockView activeIndex={4} tone="dark" progress={40} />);
    const nav = container.querySelector(".g-dock");
    expect(nav?.getAttribute("data-tone")).toBe("dark");
    expect(nav?.getAttribute("style")).toContain("--dock-i: 4");
  });

  it("sem ícone próprio nenhum fica aceso e o arco espera em Início", () => {
    const { container } = render(<DockView activeIndex={null} tone="light" progress={0} />);
    expect(container.querySelector("[aria-current]")).toBeNull();
    expect(container.querySelector(".g-dock")?.getAttribute("style")).toContain("--dock-i: 0");
  });

  it("com o HomeGiro em cena só o arco aparece, e fora dela o Giro ocupa o ícone", () => {
    const { container, rerender } = render(
      <DockView activeIndex={0} tone="light" progress={40} onStage />
    );
    expect(container.querySelector(".g-dock")?.getAttribute("data-stage")).toBe("true");
    rerender(<DockView activeIndex={0} tone="light" progress={40} />);
    expect(container.querySelector(".g-dock")?.getAttribute("data-stage")).toBe("false");
  });

  it("durante a troca de página, o arco gira em carregando", () => {
    const { container } = render(
      <DockView activeIndex={null} tone="light" progress={100} navigating />
    );
    const giro = container.querySelector(".g-dock__ring svg.g-giro");
    expect(giro?.getAttribute("data-state")).toBe("loading");
    expect(giro?.classList.contains("is-hop")).toBe(false);
  });

  it("fora da cena, o momento tonto do diretor chega ao Giro", () => {
    const { container } = render(
      <DockView activeIndex={4} tone="dark" progress={40} moment="dizzy" />
    );
    expect(container.querySelector(".g-dock__ring .g-giro")?.getAttribute("data-moment")).toBe(
      "dizzy"
    );
  });

  it("em cena, o Giro da home toca os momentos e o trilho não", () => {
    const { container } = render(
      <DockView activeIndex={0} tone="light" progress={40} moment="dizzy" onStage />
    );
    expect(container.querySelector(".g-dock__ring .g-giro")?.hasAttribute("data-moment")).toBe(
      false
    );
  });

  it("no fim da leitura o pulo do pronto vence o tonto", () => {
    const { container } = render(
      <DockView activeIndex={4} tone="dark" progress={100} moment="dizzy" />
    );
    const giro = container.querySelector(".g-dock__ring .g-giro");
    expect(giro?.getAttribute("data-state")).toBe("done");
    expect(giro?.classList.contains("is-hop")).toBe(true);
    expect(giro?.hasAttribute("data-moment")).toBe(false);
  });

  it("dorme quando a prop asleep está ligada, mesmo no fim da página", () => {
    const { container } = render(<DockView activeIndex={4} tone="dark" progress={100} asleep />);
    const giro = container.querySelector(".g-dock__ring svg.g-giro");
    expect(giro?.getAttribute("data-state")).toBe("sleeping");
    expect(giro?.classList.contains("is-hop")).toBe(false);
  });

  it("festeja com data-state celebrating e a classe is-party", () => {
    const { container } = render(
      <DockView activeIndex={4} tone="dark" progress={100} celebrating />
    );
    const giro = container.querySelector(".g-dock__ring svg.g-giro");
    expect(giro?.getAttribute("data-state")).toBe("celebrating");
    expect(giro?.classList.contains("is-party")).toBe(true);
  });

  it("mostra o nome do capítulo acima do arco, colado à borda nas pontas", () => {
    const { container, rerender } = render(
      <DockView activeIndex={0} tone="light" progress={0} tag={{ text: "// início", key: 1 }} />
    );
    expect(container.querySelector(".g-dock__tag")?.textContent).toBe("// início");
    expect(container.querySelector(".g-dock__tag")?.getAttribute("data-edge")).toBe("start");
    rerender(
      <DockView activeIndex={2} tone="dark" progress={0} tag={{ text: "// projetos", key: 2 }} />
    );
    expect(container.querySelector(".g-dock__tag")?.hasAttribute("data-edge")).toBe(false);
  });
});

describe("Dock", () => {
  it("acende o ícone do capítulo em leitura na home", () => {
    vi.mocked(useScrollState).mockReturnValue({ ...SCROLL, activeId: "processo" });
    render(<Dock />);
    expect(screen.getByRole("link", { name: "Projetos" }).getAttribute("aria-current")).toBe(
      "page"
    );
  });

  it("no topo da home acende Início e o trilho é de papel", () => {
    const { container } = render(<Dock />);
    expect(screen.getByRole("link", { name: "Início" }).getAttribute("aria-current")).toBe("page");
    expect(container.querySelector(".g-dock")?.getAttribute("data-tone")).toBe("light");
  });

  it("serviços, projetos e blog viram tinta", () => {
    vi.mocked(useScrollState).mockReturnValue({ ...SCROLL, activeId: "servicos" });
    const { container } = render(<Dock />);
    expect(container.querySelector(".g-dock")?.getAttribute("data-tone")).toBe("dark");
  });

  it("acende o Blog na rota /blog e Projetos num case", () => {
    vi.mocked(useScrollState).mockReturnValue({ ...SCROLL, pathname: "/blog/post-x" });
    const { unmount } = render(<Dock />);
    expect(screen.getByRole("link", { name: "Blog" }).getAttribute("aria-current")).toBe("page");
    unmount();

    vi.mocked(useScrollState).mockReturnValue({ ...SCROLL, pathname: "/projetos/atlas" });
    render(<Dock />);
    expect(screen.getByRole("link", { name: "Projetos" }).getAttribute("aria-current")).toBe(
      "page"
    );
  });

  it("segue o HomeGiro: em cena, só o arco", () => {
    const { container } = render(<Dock />);
    expect(container.querySelector(".g-dock")?.getAttribute("data-stage")).toBe("false");
    act(() => setGiroOnStage(true));
    expect(container.querySelector(".g-dock")?.getAttribute("data-stage")).toBe("true");
  });

  it("mostra o Giro da página enquanto a leitura não acabou", () => {
    setPageGiro("error");
    const { container } = render(<Dock />);
    expect(container.querySelector(".g-dock__ring svg")?.getAttribute("data-state")).toBe("error");
  });

  it("dorme com a aba inativa e acorda quando ela volta", () => {
    setDocumentHidden(true);
    const { container } = render(<Dock />);
    const giro = () => container.querySelector(".g-dock__ring svg");
    expect(giro()?.getAttribute("data-state")).toBe("sleeping");

    setDocumentHidden(false);
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(giro()?.getAttribute("data-state")).toBeNull();
  });

  it("festeja ao digitar giro", () => {
    const { container } = render(<Dock />);
    typeGiro();
    expect(container.querySelector(".g-dock__ring svg")?.getAttribute("data-state")).toBe(
      "celebrating"
    );
  });

  describe("toque", () => {
    let scrollTo: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      scrollTo = vi.fn();
      Object.defineProperty(window, "scrollTo", { configurable: true, value: scrollTo });
      const section = document.createElement("section");
      section.id = "servicos";
      document.body.append(section);
    });

    afterEach(() => {
      document.getElementById("servicos")?.remove();
    });

    it("na home não troca de página: salta para o capítulo", () => {
      vi.spyOn(window, "matchMedia").mockImplementation(
        query =>
          ({
            matches: query.includes("prefers-reduced-motion"),
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
          }) as unknown as MediaQueryList
      );
      render(<Dock />);
      const notPrevented = fireEvent.click(screen.getByRole("link", { name: "Serviços" }));
      expect(notPrevented).toBe(false);
      expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "instant" }));
      vi.restoreAllMocks();
    });

    it("na home, Sobre abre a própria página em vez de saltar para o capítulo", () => {
      render(<Dock />);
      const notPrevented = fireEvent.click(screen.getByRole("link", { name: "Sobre" }));
      expect(notPrevented).toBe(true);
      expect(scrollTo).not.toHaveBeenCalled();
    });

    it("fora da home deixa o link seguir para a página", () => {
      vi.mocked(useScrollState).mockReturnValue({ ...SCROLL, pathname: "/blog" });
      render(<Dock />);
      const notPrevented = fireEvent.click(screen.getByRole("link", { name: "Sobre" }));
      expect(notPrevented).toBe(true);
      expect(scrollTo).not.toHaveBeenCalled();
    });
  });
});

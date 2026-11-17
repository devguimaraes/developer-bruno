import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setLocale } from "@/lib/i18n";
import { Hero } from "./Hero";

const originalMatchMedia = window.matchMedia;
let rafSpy: { mockRestore: () => void } | undefined;

// Movimento reduzido ligado: só a consulta de prefers-reduced-motion responde true.
function mockReducedMotion(reduced: boolean): void {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduced && query === "(prefers-reduced-motion: reduce)",
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  rafSpy?.mockRestore();
  rafSpy = undefined;
  act(() => setLocale("pt"));
});

describe("Hero", () => {
  it("renderiza rótulo, título, abertura e os dois botões com destino", () => {
    mockReducedMotion(false);
    render(<Hero />);

    expect(screen.getByText("// desenvolvedor front-end · design systems")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Interfaces com vida." })).toBeInTheDocument();
    expect(screen.getByText(/Construo interfaces em React, Next.js e Astro/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver projetos" })).toHaveAttribute("href", "#projetos");
    expect(screen.getByRole("link", { name: "Falar comigo" })).toHaveAttribute("href", "#contato");
  });

  it("o título vira uma letra por caractere, sem espaço, e o nome continua inteiro", () => {
    mockReducedMotion(false);
    const { container } = render(<Hero />);

    // "Interfaces com vida." tem 18 letras; o espaço fica como texto.
    expect(container.querySelectorAll(".hb-ch")).toHaveLength(18);
    expect(screen.getByRole("heading", { name: "Interfaces com vida." })).toBeInTheDocument();

    act(() => setLocale("en"));

    // "Interfaces that live." tem 19 letras.
    expect(container.querySelectorAll(".hb-ch")).toHaveLength(19);
    expect(screen.getByRole("heading", { name: "Interfaces that live." })).toBeInTheDocument();
  });

  it("dá nome ao botão do pulo e o deixa ativo fora do movimento reduzido", () => {
    mockReducedMotion(false);
    render(<Hero />);

    expect(screen.getByRole("button", { name: "Fazer o Giro pular" })).toBeEnabled();
  });

  it("monta as quatro camadas e as estações fora do leitor de tela", () => {
    mockReducedMotion(false);
    const { container } = render(<Hero />);

    expect(container.querySelectorAll("[data-layer]")).toHaveLength(4);
    expect(container.querySelectorAll(".hb-stop")).toHaveLength(5);
    expect(container.querySelector(".hb-line")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".hb-world")).toHaveAttribute("aria-hidden", "true");
  });

  it("troca os rótulos da linha com o idioma", () => {
    mockReducedMotion(false);
    const { container } = render(<Hero />);
    const tags = () => Array.from(container.querySelectorAll(".hb-tag"), n => n.textContent);

    expect(tags()).toEqual(["// tokens", "// componentes", "// tela", "// estado"]);
    act(() => setLocale("en"));
    expect(tags()).toEqual(["// tokens", "// components", "// screen", "// state"]);
  });

  it("só lança o Giro depois que a tela de carregamento sai e devolve a origem ao desmontar", async () => {
    vi.useFakeTimers({
      toFake: [
        "setTimeout",
        "clearTimeout",
        "requestAnimationFrame",
        "cancelAnimationFrame",
        "performance",
      ],
    });
    // Computador: a origem é o Giro da assinatura no header.
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(min-width: 768px)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const header = document.createElement("header");
    header.setAttribute("data-site-header", "");
    header.innerHTML = '<span class="g-signature__o"><svg class="g-giro"></svg></span>';
    document.body.append(header);
    const source = header.querySelector<SVGElement>(".g-giro");
    document.documentElement.setAttribute("data-loader", "on");

    try {
      const { container, unmount } = render(<Hero />);
      const stage = container.querySelector(".hb");
      const rider = screen.getByRole("button", { name: "Fazer o Giro pular" });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });
      expect(stage).not.toHaveClass("is-away");
      expect(rider).toHaveAttribute("tabindex", "-1");

      document.documentElement.removeAttribute("data-loader");
      // 300 ms de espera, 110 ms de amasso na origem e só então o Giro sai.
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });
      expect(stage).toHaveClass("is-away");
      expect(rider).toHaveAttribute("tabindex", "0");
      expect(source?.style.opacity).toBe("0");

      unmount();
      expect(source?.style.opacity).toBe("");
    } finally {
      document.documentElement.removeAttribute("data-loader");
      header.remove();
      vi.useRealTimers();
    }
  });

  it("com movimento reduzido, não roda o laço e deixa o pulo inerte", async () => {
    mockReducedMotion(true);
    const raf = vi.spyOn(window, "requestAnimationFrame");
    rafSpy = raf;
    const { container } = render(<Hero />);

    // Dá tempo para os efeitos assentarem; o laço não pode voltar a pedir quadros.
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    const calls = raf.mock.calls.length;
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(raf.mock.calls.length).toBe(calls);
    expect(container.querySelector(".hb")).toHaveClass("is-still", "is-away");
    expect(screen.getByRole("button", { name: "Fazer o Giro pular" })).toBeDisabled();
  });
});

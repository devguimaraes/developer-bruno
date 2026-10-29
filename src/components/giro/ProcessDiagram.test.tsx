import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { animate } from "framer-motion";
import { ProcessDiagram } from "./ProcessDiagram";

// Renderização pesada: com a suíte inteira em paralelo passa dos 5s padrão.
vi.setConfig({ testTimeout: 20_000 });

// Tabela de ferramentas por etapa (ProcessDiagram do DS, decisão 49).
const TOOLS_BY_STEP: Record<string, string[]> = {
  talk: ["Google Meet", "WhatsApp", "Google Drive", "Slack", "Linear"],
  design: ["Figma", "Claude"],
  code: [
    "React",
    "Next.js",
    "Astro",
    "TypeScript",
    "Tailwind CSS",
    "shadcn/ui",
    "Motion",
    "Sanity",
    "WordPress",
    "GitHub",
    "Claude Code",
  ],
  launch: ["Vercel", "Cloudflare", "Hostinger", "AWS", "GitHub Actions", "Playwright", "Plausible"],
};

const STEP_NAMES = ["Conversa", "Desenho", "Código", "Entrega"];

type MatchFn = (query: string) => boolean;

// Substitui o matchMedia do setup (que devolve sempre false) e devolve a função de restauração.
function mockMatchMedia(matches: MatchFn) {
  const mock = vi.mocked(window.matchMedia);
  const previous = mock.getMockImplementation();
  mock.mockImplementation(
    (query: string) =>
      ({
        matches: matches(query),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList
  );
  return () => {
    if (previous) mock.mockImplementation(previous);
  };
}

function toolNamesIn(container: HTMLElement, stepId: string): string[] {
  return Array.from(container.querySelectorAll(`[data-step="${stepId}"] .g-metro__name`)).map(
    el => el.textContent ?? ""
  );
}

describe("ProcessDiagram", () => {
  let restore: (() => void) | undefined;

  afterEach(() => {
    restore?.();
    restore = undefined;
  });

  it("mostra as quatro etapas como botões dentro do grupo rotulado", () => {
    render(<ProcessDiagram />);

    const group = screen.getByRole("region", { name: "Processo em quatro etapas" });
    const buttons = within(group).getAllByRole("button");
    expect(buttons).toHaveLength(4);
    for (const name of STEP_NAMES) {
      expect(within(group).getByRole("button", { name: new RegExp(name) })).toBeInTheDocument();
    }
  });

  it("traz todas as ferramentas da tabela no DOM", () => {
    render(<ProcessDiagram />);

    for (const tools of Object.values(TOOLS_BY_STEP)) {
      for (const name of tools) {
        expect(screen.getByText(name, { selector: ".g-metro__name" })).toBeInTheDocument();
      }
    }
  });

  it("cada etapa mostra só as suas ferramentas", () => {
    const { container } = render(<ProcessDiagram />);

    for (const [stepId, tools] of Object.entries(TOOLS_BY_STEP)) {
      expect(toolNamesIn(container, stepId).sort()).toEqual([...tools].sort());
    }
  });

  it("clique numa etapa abre o detalhe e clicar de novo fecha", () => {
    render(<ProcessDiagram />);

    const button = screen.getByRole("button", { name: /Conversa/ });
    const body = screen.getByText(/Entendo o negócio/);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(body).not.toBeVisible();

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(body).toBeVisible();

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(body).not.toBeVisible();
  });

  it("só uma etapa fica aberta por vez", () => {
    render(<ProcessDiagram />);

    const talk = screen.getByRole("button", { name: /Conversa/ });
    const design = screen.getByRole("button", { name: /Desenho/ });

    fireEvent.click(talk);
    fireEvent.click(design);

    expect(talk).toHaveAttribute("aria-expanded", "false");
    expect(design).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/Entendo o negócio/)).not.toBeVisible();
    expect(screen.getByText(/Defino tokens, componentes/)).toBeVisible();
  });

  it("aria-controls aponta para o painel do detalhe da etapa", () => {
    render(<ProcessDiagram />);

    const button = screen.getByRole("button", { name: /Código/ });
    const controls = button.getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    const panel = document.getElementById(controls ?? "");
    expect(panel?.tagName).toBe("SECTION");
    expect(panel).toHaveTextContent("Construo sobre o design system");
  });

  it("a etapa é um botão nativo, focável, que Enter e Espaço acionam", () => {
    render(<ProcessDiagram />);

    const button = screen.getByRole("button", { name: /Entrega/ });
    expect(button.tagName).toBe("BUTTON");
    button.focus();
    expect(button).toHaveFocus();
  });

  it("mostra a dica de uso abaixo do diagrama", () => {
    render(<ProcessDiagram />);

    expect(screen.getByText(/clique numa etapa para ver o detalhe/)).toBeInTheDocument();
  });

  describe("no computador (trilho com painel)", () => {
    const desktop = () => {
      restore = mockMatchMedia(query => query === "(min-width: 1024px)");
    };
    const panelTools = (container: HTMLElement) =>
      Array.from(container.querySelectorAll(".g-track__slide.is-active .g-tool__name")).map(
        el => el.textContent ?? ""
      );

    it("abre em Conversa, com as ferramentas agrupadas da etapa", () => {
      desktop();
      const { container } = render(<ProcessDiagram />);

      const group = screen.getByRole("region", { name: "Processo em quatro etapas" });
      expect(group).toHaveClass("g-track");
      expect(screen.getByRole("button", { name: /Conversa/ })).toHaveAttribute(
        "aria-expanded",
        "true"
      );
      expect(screen.getByRole("heading", { level: 3, name: "Conversa" })).toBeInTheDocument();
      expect(screen.getByText("etapa 01 de 04")).toBeInTheDocument();
      expect(panelTools(container).sort()).toEqual([...TOOLS_BY_STEP.talk].sort());
      expect(screen.getByText("conversa")).toBeInTheDocument();
      expect(screen.getByText("organização")).toBeInTheDocument();
    });

    it("clicar numa etapa troca o painel, e aria-controls aponta para ele", () => {
      desktop();
      const { container } = render(<ProcessDiagram />);

      const code = screen.getByRole("button", { name: /Código/ });
      fireEvent.click(code);

      expect(code).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByRole("button", { name: /Conversa/ })).toHaveAttribute(
        "aria-expanded",
        "false"
      );
      const panel = document.getElementById(code.getAttribute("aria-controls") ?? "");
      expect(panel).toHaveTextContent("Construo sobre o design system");
      expect(panelTools(container).sort()).toEqual([...TOOLS_BY_STEP.code].sort());
      expect(screen.getByText("interface e design system")).toBeInTheDocument();
    });

    it("anterior e próxima andam pelas etapas e travam nas pontas", () => {
      desktop();
      render(<ProcessDiagram />);

      // Cada etapa tem os seus botões; só os da etapa aberta ficam visíveis para o leitor.
      const prev = () => screen.getByRole("button", { name: "Etapa anterior" });
      const next = () => screen.getByRole("button", { name: "Próxima etapa" });
      expect(prev()).toBeDisabled();

      fireEvent.click(next());
      fireEvent.click(next());
      fireEvent.click(next());
      expect(screen.getByRole("heading", { level: 3, name: "Entrega" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { level: 3, name: "Código" })).not.toBeInTheDocument();
      expect(next()).toBeDisabled();

      fireEvent.click(prev());
      expect(screen.getByRole("heading", { level: 3, name: "Código" })).toBeInTheDocument();
    });

    it("com movimento, o autoplay começa ao entrar na tela e pode ser pausado", () => {
      desktop();
      render(<ProcessDiagram />);

      const group = screen.getByRole("region", { name: "Processo em quatro etapas" });
      expect(group).toHaveAttribute("data-motion", "on");
      const pause = screen.getByRole("button", { name: "pausar" });
      fireEvent.click(pause);
      expect(screen.getByRole("button", { name: "reproduzir" })).toBeInTheDocument();
    });

    it("o autoplay avança uma etapa quando a borda fecha e para no fim da volta", () => {
      desktop();
      vi.mocked(animate).mockClear();
      render(<ProcessDiagram />);

      // Cada etapa termina quando a animação do cronômetro chama onComplete.
      const finishStep = () => {
        const calls = vi.mocked(animate).mock.calls;
        const options = calls[calls.length - 1]?.[2] as { onComplete?: () => void } | undefined;
        act(() => options?.onComplete?.());
      };

      expect(screen.getByRole("heading", { level: 3, name: "Conversa" })).toBeInTheDocument();
      finishStep();
      expect(screen.getByRole("heading", { level: 3, name: "Desenho" })).toBeInTheDocument();
      finishStep();
      finishStep();
      expect(screen.getByRole("heading", { level: 3, name: "Entrega" })).toBeInTheDocument();
      finishStep();
      const replay = screen.getByRole("button", { name: "ver de novo" });

      fireEvent.click(replay);
      expect(screen.getByRole("heading", { level: 3, name: "Conversa" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "pausar" })).toBeInTheDocument();
    });

    it("com o foco dentro, o autoplay espera", () => {
      desktop();
      render(<ProcessDiagram />);
      vi.mocked(animate).mockClear();

      fireEvent.focus(screen.getByRole("button", { name: "pausar" }));
      expect(animate).not.toHaveBeenCalled();
    });

    it("anterior e próxima levam o foco para o botão da etapa nova", () => {
      desktop();
      render(<ProcessDiagram />);

      fireEvent.click(screen.getByRole("button", { name: "Próxima etapa" }));
      expect(screen.getByRole("button", { name: "Próxima etapa" })).toHaveFocus();
    });

    it("escolher uma etapa para o autoplay", () => {
      desktop();
      render(<ProcessDiagram />);

      fireEvent.click(screen.getByRole("button", { name: /Desenho/ }));
      expect(screen.getByRole("button", { name: "reproduzir" })).toBeInTheDocument();
    });

    it("com movimento reduzido não há autoplay nem botão de pausa", () => {
      restore = mockMatchMedia(
        query => query === "(min-width: 1024px)" || query.includes("prefers-reduced-motion")
      );
      vi.mocked(animate).mockClear();
      render(<ProcessDiagram />);

      const group = screen.getByRole("region", { name: "Processo em quatro etapas" });
      expect(group).not.toHaveAttribute("data-motion");
      expect(screen.queryByRole("button", { name: "pausar" })).not.toBeInTheDocument();
      expect(animate).not.toHaveBeenCalled();
    });
  });

  it("com movimento reduzido não liga a animação", async () => {
    restore = mockMatchMedia(query => query.includes("prefers-reduced-motion"));
    render(<ProcessDiagram />);

    const group = screen.getByRole("region", { name: "Processo em quatro etapas" });
    await waitFor(() => expect(group).not.toHaveAttribute("data-motion"));
  });
});

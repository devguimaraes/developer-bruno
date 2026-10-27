import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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
    expect(screen.getByText(/Desenho as telas/)).toBeVisible();
  });

  it("aria-controls aponta para o painel do detalhe da etapa", () => {
    render(<ProcessDiagram />);

    const button = screen.getByRole("button", { name: /Código/ });
    const controls = button.getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    const panel = document.getElementById(controls ?? "");
    expect(panel?.tagName).toBe("SECTION");
    expect(panel).toHaveTextContent("Construo com componentes");
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

  it("no computador usa o layout de linha com as mesmas ferramentas", () => {
    restore = mockMatchMedia(query => query === "(min-width: 1024px)");
    const { container } = render(<ProcessDiagram />);

    const group = screen.getByRole("region", { name: "Processo em quatro etapas" });
    expect(group.querySelector(".g-metro__frame")).toBeInTheDocument();
    expect(group).toHaveAttribute("data-motion", "on");
    expect(within(group).getAllByRole("button")).toHaveLength(4);
    for (const [stepId, tools] of Object.entries(TOOLS_BY_STEP)) {
      expect(toolNamesIn(container, stepId).sort()).toEqual([...tools].sort());
    }
  });

  it("com movimento reduzido não liga a animação", async () => {
    restore = mockMatchMedia(query => query.includes("prefers-reduced-motion"));
    render(<ProcessDiagram />);

    const group = screen.getByRole("region", { name: "Processo em quatro etapas" });
    await waitFor(() => expect(group).not.toHaveAttribute("data-motion"));
  });
});

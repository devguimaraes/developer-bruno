import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { CopyButton, COPIED_FEEDBACK_MS } from "./CopyButton";

const VALUE = "https://devguimaraes.com.br/blog/post";
const HINT = "Copie o endereço da barra do navegador.";

const props = {
  value: VALUE,
  copyLabel: "Copiar link",
  copiedLabel: "Link copiado",
  errorLabel: "Não deu para copiar",
  errorHint: HINT,
};

const writeText = vi.fn<(text: string) => Promise<void>>();

async function clicarNoBotao(name: string) {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name }));
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  writeText.mockReset();
  writeText.mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("CopyButton — copiar", () => {
  it("começa em repouso com o texto de copiar e o ícone da Lucide", () => {
    const { container } = render(<CopyButton {...props} />);
    const button = screen.getByRole("button", { name: "Copiar link" });
    expect(button.className).toContain("g-button--secondary");
    expect(button.className).toContain("g-button--sm");
    expect(container.querySelector('svg[data-state="done"]')).toBeNull();
  });

  it("copia o valor com navigator.clipboard e mostra copiado com Giro done", async () => {
    const { container } = render(<CopyButton {...props} />);
    await clicarNoBotao("Copiar link");

    expect(writeText).toHaveBeenCalledWith(VALUE);
    expect(screen.getByRole("button", { name: "Link copiado" })).toBeTruthy();
    expect(container.querySelector('svg[data-state="done"]')).not.toBeNull();
  });

  it("volta ao repouso depois de 1,8 s", async () => {
    render(<CopyButton {...props} />);
    await clicarNoBotao("Copiar link");

    act(() => {
      vi.advanceTimersByTime(COPIED_FEEDBACK_MS - 1);
    });
    expect(screen.getByRole("button", { name: "Link copiado" })).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole("button", { name: "Copiar link" })).toBeTruthy();
  });

  it("o tempo de feedback é 1,8 s", () => {
    expect(COPIED_FEEDBACK_MS).toBe(1800);
  });
});

describe("CopyButton — falha", () => {
  it("mostra no botão o que houve e a instrução fora dele, numa região viva", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    writeText.mockRejectedValue(new Error("permissão negada"));

    const { container } = render(<CopyButton {...props} />);
    await clicarNoBotao("Copiar link");

    const button = screen.getByRole("button", { name: "Não deu para copiar" });
    expect(button.textContent).not.toContain(HINT);

    const hint = screen.getByText(HINT);
    expect(hint.closest("button")).toBeNull();

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion?.textContent).toContain(HINT);
  });

  it("registra a falha no console, como o resto do site", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    writeText.mockRejectedValue(new Error("permissão negada"));

    render(<CopyButton {...props} />);
    await clicarNoBotao("Copiar link");

    expect(errorSpy).toHaveBeenCalledWith("Failed to copy text:", expect.any(Error));
  });
});

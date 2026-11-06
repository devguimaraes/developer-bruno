import { act, render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setLocale, t } from "@/lib/i18n";
import { useLocale } from "./useLocale";

function Title() {
  const locale = useLocale();
  return <h1>{t(locale, "hero.title")}</h1>;
}

let hydrated: { root: ReturnType<typeof hydrateRoot>; container: HTMLElement } | null = null;

afterEach(() => {
  if (hydrated) {
    const { root, container } = hydrated;
    act(() => root.unmount());
    container.remove();
    hydrated = null;
  }
  act(() => setLocale("pt"));
});

describe("useLocale", () => {
  it("hidrata no idioma do HTML do servidor e só depois troca para o idioma salvo", async () => {
    // As páginas saem pré-renderizadas em pt; o visitante tem en salvo no navegador.
    setLocale("pt");
    const container = document.createElement("div");
    container.innerHTML = renderToString(<Title />);
    document.body.appendChild(container);
    setLocale("en");

    const onRecoverableError = vi.fn();
    await act(async () => {
      hydrated = { root: hydrateRoot(container, <Title />, { onRecoverableError }), container };
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(container.textContent).toBe("Interfaces that live.");
  });

  it("acompanha a troca de idioma depois de montado", () => {
    render(<Title />);
    expect(screen.getByRole("heading")).toHaveTextContent("Interfaces com vida.");

    act(() => setLocale("en"));

    expect(screen.getByRole("heading")).toHaveTextContent("Interfaces that live.");
  });
});

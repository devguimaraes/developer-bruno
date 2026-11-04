import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PEEK_AFTER_MS, PEEK_STEPS, usePeek } from "./usePeek";

interface Props {
  section: string | null;
  enabled: boolean;
}

function setup(section: string | null = "hero", enabled = true) {
  return renderHook(({ section, enabled }: Props) => usePeek(section, enabled), {
    initialProps: { section, enabled },
  });
}

function advance(ms: number): void {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function scroll(): void {
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("usePeek", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("tabela de passos com duração, curva e holds da leitura", () => {
    expect(PEEK_STEPS.map(s => [s.look.x, s.look.y, s.durationMs, s.ease, s.holdMs])).toEqual([
      [-2.5, 0.5, 340, "resolve", 400],
      [3, 0.5, 1100, "inOut", 1100],
      [-2.5, 1.5, 200, "resolve", 250],
      [3, 1.5, 1100, "inOut", 1100],
      [-2.5, 2.5, 200, "resolve", 250],
      [3, 2.5, 1100, "inOut", 0],
    ]);
  });

  // Regressão: a tela de carregamento dura mais de 5 s e o espiando acontecia escondido atrás dela,
  // gastando a seção antes de o Giro aparecer.
  it("não conta o tempo parado enquanto a tela de carregamento está de pé", async () => {
    document.documentElement.setAttribute("data-loader", "on");
    try {
      const { result } = setup();
      advance(PEEK_AFTER_MS * 2);
      expect(result.current).toBeNull();

      document.documentElement.removeAttribute("data-loader");
      // O MutationObserver avisa num microtask.
      await act(async () => {
        await Promise.resolve();
      });
      advance(PEEK_AFTER_MS - 1);
      expect(result.current).toBeNull();
      advance(1);
      expect(result.current).toMatchObject({ look: { x: -2.5, y: 0.5 } });
    } finally {
      document.documentElement.removeAttribute("data-loader");
    }
  });

  it("não espia antes de 5 s parado", () => {
    const { result } = setup();
    advance(PEEK_AFTER_MS - 1);
    expect(result.current).toBeNull();
  });

  it("aos 5 s devolve o passo 1 e avança respeitando os holds", () => {
    const { result } = setup();
    advance(PEEK_AFTER_MS);
    expect(result.current).toMatchObject({ look: { x: -2.5, y: 0.5 }, durationMs: 340 });

    advance(399);
    expect(result.current?.look).toEqual({ x: -2.5, y: 0.5 });
    advance(1);
    expect(result.current).toMatchObject({ look: { x: 3, y: 0.5 }, durationMs: 1100 });

    advance(1099);
    expect(result.current?.look).toEqual({ x: 3, y: 0.5 });
    advance(1);
    expect(result.current?.look).toEqual({ x: -2.5, y: 1.5 });
  });

  it("percorre todos os passos e fica no último sem rolagem", () => {
    const { result } = setup();
    advance(PEEK_AFTER_MS);

    const expected = [
      { x: -2.5, y: 0.5, hold: 400 },
      { x: 3, y: 0.5, hold: 1100 },
      { x: -2.5, y: 1.5, hold: 250 },
      { x: 3, y: 1.5, hold: 1100 },
      { x: -2.5, y: 2.5, hold: 250 },
      { x: 3, y: 2.5, hold: 0 },
    ];
    for (const { x, y, hold } of expected) {
      expect(result.current?.look).toEqual({ x, y });
      if (hold > 0) advance(hold);
    }

    expect(result.current?.look).toEqual({ x: 3, y: 2.5 });
    advance(60_000);
    expect(result.current?.look).toEqual({ x: 3, y: 2.5 });
  });

  it("rolagem antes dos 5 s reinicia a contagem", () => {
    const { result } = setup();
    advance(4000);
    scroll();
    advance(PEEK_AFTER_MS - 1);
    expect(result.current).toBeNull();
    advance(1);
    expect(result.current?.look).toEqual({ x: -2.5, y: 0.5 });
  });

  it("rolagem durante a leitura devolve null e não volta", () => {
    const { result } = setup();
    advance(PEEK_AFTER_MS + 400);
    expect(result.current?.look).toEqual({ x: 3, y: 0.5 });
    scroll();
    expect(result.current).toBeNull();
    advance(60_000);
    expect(result.current).toBeNull();
  });

  it("rolagem na pose final encerra o espiando", () => {
    const { result } = setup();
    advance(PEEK_AFTER_MS + 400 + 1100 + 250 + 1100 + 250);
    expect(result.current?.look).toEqual({ x: 3, y: 2.5 });
    scroll();
    expect(result.current).toBeNull();
  });

  it("a mesma chave não espia de novo, mas chave nova espia", () => {
    const { result, rerender } = setup("a");
    advance(PEEK_AFTER_MS);
    scroll();
    expect(result.current).toBeNull();

    rerender({ section: "b", enabled: true });
    advance(PEEK_AFTER_MS);
    expect(result.current?.look).toEqual({ x: -2.5, y: 0.5 });

    rerender({ section: "a", enabled: true });
    expect(result.current).toBeNull();
    advance(60_000);
    expect(result.current).toBeNull();
  });

  it("chave já usada não espia ao voltar, mesmo sem rolagem", () => {
    const { result, rerender } = setup("a");
    advance(PEEK_AFTER_MS);
    expect(result.current).not.toBeNull();

    rerender({ section: "b", enabled: true });
    expect(result.current).toBeNull();
    rerender({ section: "a", enabled: true });
    advance(60_000);
    expect(result.current).toBeNull();
  });

  it("key null ou enabled false devolvem null sem contar tempo", () => {
    const nullKey = setup(null);
    advance(60_000);
    expect(nullKey.result.current).toBeNull();

    const disabled = setup("a", false);
    advance(60_000);
    expect(disabled.result.current).toBeNull();
  });

  it("enabled ligando começa a contagem do zero", () => {
    const { result, rerender } = setup("a", false);
    advance(10_000);
    rerender({ section: "a", enabled: true });
    advance(PEEK_AFTER_MS - 1);
    expect(result.current).toBeNull();
    advance(1);
    expect(result.current?.look).toEqual({ x: -2.5, y: 0.5 });
  });

  it("enabled desligando no meio encerra e a chave fica gasta", () => {
    const { result, rerender } = setup("a");
    advance(PEEK_AFTER_MS);
    expect(result.current).not.toBeNull();

    rerender({ section: "a", enabled: false });
    expect(result.current).toBeNull();

    rerender({ section: "a", enabled: true });
    advance(60_000);
    expect(result.current).toBeNull();
  });

  it("desmontar limpa os timers", () => {
    const { unmount } = setup();
    advance(PEEK_AFTER_MS + 400);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

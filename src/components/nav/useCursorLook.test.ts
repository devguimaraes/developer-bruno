import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CURSOR_RADIUS_PX, cursorLook, useCursorLook } from "./useCursorLook";

const ORIGIN = { x: 0, y: 0 };

describe("cursorLook", () => {
  it("aponta para o ponteiro dentro do raio, com módulo 3 (LOOK_PX)", () => {
    // (30, 40) está a 50 px: o unitário é (0,6; 0,8), e vezes 3 dá (1,8; 2,4), de módulo 3.
    expect(cursorLook(ORIGIN, { x: 30, y: 40 })).toEqual({ x: 1.8, y: 2.4 });
  });

  it("aponta nos quatro sentidos", () => {
    expect(cursorLook(ORIGIN, { x: 100, y: 0 })).toEqual({ x: 3, y: 0 });
    expect(cursorLook(ORIGIN, { x: -100, y: 0 })).toEqual({ x: -3, y: 0 });
    expect(cursorLook(ORIGIN, { x: 0, y: 100 })).toEqual({ x: 0, y: 3 });
    expect(cursorLook(ORIGIN, { x: 0, y: -100 })).toEqual({ x: 0, y: -3 });
  });

  it("não devolve -0 quando o eixo fica perto de zero", () => {
    // -1 / 100,005 * 3 arredonda para -0; tem que sair 0.
    expect(cursorLook(ORIGIN, { x: -1, y: -100 })).toEqual({ x: 0, y: -3 });
  });

  it("fora do raio devolve null", () => {
    expect(cursorLook(ORIGIN, { x: CURSOR_RADIUS_PX + 1, y: 0 })).toBeNull();
  });

  it("na borda do raio ainda olha", () => {
    expect(cursorLook(ORIGIN, { x: CURSOR_RADIUS_PX, y: 0 })).toEqual({ x: 3, y: 0 });
  });

  it("no centro devolve 0,0", () => {
    expect(cursorLook(ORIGIN, ORIGIN)).toEqual({ x: 0, y: 0 });
  });

  it("aceita raio e deslocamento máximo customizados", () => {
    expect(cursorLook(ORIGIN, { x: 10, y: 0 }, 5)).toBeNull();
    expect(cursorLook(ORIGIN, { x: 10, y: 0 }, 20, 6)).toEqual({ x: 6, y: 0 });
  });

  it("mede a partir do centro informado", () => {
    expect(cursorLook({ x: 100, y: 100 }, { x: 100, y: 100 })).toEqual({ x: 0, y: 0 });
    expect(cursorLook({ x: 100, y: 100 }, { x: 200, y: 100 })).toEqual({ x: 3, y: 0 });
  });
});

describe("useCursorLook", () => {
  // Alvo de 100 x 100 na origem: o centro fica em (50, 50).
  const TARGET_CENTER = { x: 50, y: 50 };
  let frames: Map<number, FrameRequestCallback>;
  let nextFrameId: number;
  let target: Element;
  // Ref estável, como o de useRef: um objeto novo a cada render reinscreveria o efeito.
  let targetRef: { current: Element };

  /** Roda os quadros pendentes, como o navegador faria no próximo frame. */
  function flushFrame(): void {
    const callbacks = [...frames.values()];
    frames.clear();
    act(() => {
      for (const callback of callbacks) callback(0);
    });
  }

  /** Dispara pointermove no window. Um Event com as props do ponteiro, sem depender de PointerEvent. */
  function movePointer(x: number, y: number, pointerType = "mouse"): void {
    const event = new Event("pointermove");
    Object.assign(event, { clientX: x, clientY: y, pointerType });
    window.dispatchEvent(event);
  }

  beforeEach(() => {
    frames = new Map();
    nextFrameId = 1;
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      const id = nextFrameId++;
      frames.set(id, callback);
      return id;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      frames.delete(id);
    });

    target = document.createElement("div");
    targetRef = { current: target };
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue(
      DOMRect.fromRect({ x: 0, y: 0, width: 100, height: 100 })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("mouse perto do Giro devolve o olhar", () => {
    const { result } = renderHook(() => useCursorLook(targetRef, true));
    movePointer(TARGET_CENTER.x + 100, TARGET_CENTER.y);
    flushFrame();
    expect(result.current).toEqual({ x: 3, y: 0 });
  });

  it("mouse que se afasta além do raio volta a null", () => {
    const { result } = renderHook(() => useCursorLook(targetRef, true));
    movePointer(TARGET_CENTER.x + 100, TARGET_CENTER.y);
    flushFrame();
    expect(result.current).not.toBeNull();

    movePointer(TARGET_CENTER.x + 300, TARGET_CENTER.y);
    flushFrame();
    expect(result.current).toBeNull();
  });

  it("ignora ponteiro que não é mouse", () => {
    const { result } = renderHook(() => useCursorLook(targetRef, true));
    movePointer(TARGET_CENTER.x + 100, TARGET_CENTER.y, "touch");
    expect(frames.size).toBe(0);
    flushFrame();
    expect(result.current).toBeNull();
  });

  it("com enabled false não registra nada", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const { result } = renderHook(() => useCursorLook(targetRef, false));
    movePointer(TARGET_CENTER.x + 100, TARGET_CENTER.y);
    expect(frames.size).toBe(0);
    expect(result.current).toBeNull();
    expect(addSpy).not.toHaveBeenCalledWith("pointermove", expect.any(Function), expect.anything());
  });

  it("com movimento reduzido não registra nada", () => {
    // Once: o hook consulta uma vez por montagem e o mock não vaza para os testes seguintes.
    vi.mocked(window.matchMedia).mockImplementationOnce(
      (query: string) =>
        ({
          matches: true,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList
    );
    const { result } = renderHook(() => useCursorLook(targetRef, true));
    movePointer(TARGET_CENTER.x + 100, TARGET_CENTER.y);
    expect(frames.size).toBe(0);
    expect(result.current).toBeNull();
  });

  it("o mouse saindo da janela zera o olhar", () => {
    const { result } = renderHook(() => useCursorLook(targetRef, true));
    movePointer(TARGET_CENTER.x + 100, TARGET_CENTER.y);
    flushFrame();
    expect(result.current).not.toBeNull();

    act(() => {
      document.documentElement.dispatchEvent(new Event("mouseleave"));
    });
    expect(result.current).toBeNull();
  });

  it("mede no máximo uma vez por quadro", () => {
    const rect = vi.mocked(target.getBoundingClientRect);
    renderHook(() => useCursorLook(targetRef, true));
    movePointer(TARGET_CENTER.x + 100, TARGET_CENTER.y);
    movePointer(TARGET_CENTER.x + 120, TARGET_CENTER.y);
    movePointer(TARGET_CENTER.x + 140, TARGET_CENTER.y);
    expect(frames.size).toBe(1);

    flushFrame();
    expect(rect).toHaveBeenCalledTimes(1);
  });

  it("não re-renderiza quando o olhar não muda", () => {
    let renders = 0;
    const { result } = renderHook(() => {
      renders += 1;
      return useCursorLook(targetRef, true);
    });
    movePointer(TARGET_CENTER.x + 100, TARGET_CENTER.y);
    flushFrame();
    expect(result.current).toEqual({ x: 3, y: 0 });
    const afterFirst = renders;

    // Um pixel a mais na mesma direção dá o mesmo olhar arredondado.
    movePointer(TARGET_CENTER.x + 101, TARGET_CENTER.y);
    flushFrame();
    expect(renders).toBe(afterFirst);
  });

  it("cancela o quadro pendente ao desmontar", () => {
    const { unmount } = renderHook(() => useCursorLook(targetRef, true));
    movePointer(TARGET_CENTER.x + 100, TARGET_CENTER.y);
    expect(frames.size).toBe(1);

    unmount();
    expect(frames.size).toBe(0);
  });
});

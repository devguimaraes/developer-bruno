import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { isNavigating, subscribeNavigating, useNavigating } from "./navigation-state";

describe("navigation-state", () => {
  it("segue a troca de página do ClientRouter e avisa quem assina", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeNavigating(listener);

    document.dispatchEvent(new Event("astro:before-preparation"));
    expect(isNavigating()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);

    document.dispatchEvent(new Event("astro:after-swap"));
    expect(isNavigating()).toBe(false);

    unsubscribe();
  });

  it("o hook acompanha o início e o fim da troca", () => {
    const { result } = renderHook(() => useNavigating());
    expect(result.current).toBe(false);

    act(() => {
      document.dispatchEvent(new Event("astro:before-preparation"));
    });
    expect(result.current).toBe(true);

    act(() => {
      document.dispatchEvent(new Event("astro:page-load"));
    });
    expect(result.current).toBe(false);
  });
});

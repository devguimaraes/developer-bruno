import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setGiroOnStage } from "@/lib/giroOnStage";
import { useGiroOnStage } from "./useGiroOnStage";

// hydrateRoot direto, sem Testing Library: o React só aceita act() com esta flag.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function Probe() {
  return <span data-on-stage={useGiroOnStage() ? "true" : "false"} />;
}

describe("useGiroOnStage", () => {
  afterEach(() => {
    act(() => setGiroOnStage(false));
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("hidrata com o valor do servidor quando outra ilha já pôs o Giro no palco", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<Probe />);
    document.body.append(container);
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});

    // A ilha da home hidratou antes do Dock e já marcou o Giro no palco.
    setGiroOnStage(true);
    await act(async () => {
      hydrateRoot(container, <Probe />);
    });

    expect(errors).not.toHaveBeenCalled();
    expect(container.querySelector("span")?.dataset.onStage).toBe("true");
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { act, createEvent, fireEvent, render } from "@testing-library/react";
import { Giro } from "./Giro";
import { GIRO_STATES, type GiroState, playGiroMoment } from "./giro-states";

function getSvg(props: Parameters<typeof Giro>[0] = {}) {
  const { container } = render(<Giro {...props} />);
  const svg = container.querySelector("svg");
  if (!svg) throw new Error("Giro não renderizou um svg");
  return svg;
}

describe("Giro — estados", () => {
  it.each(GIRO_STATES.filter(state => state !== "idle"))(
    "estado %s gera data-state com o mesmo nome",
    (state: GiroState) => {
      expect(getSvg({ state }).getAttribute("data-state")).toBe(state);
    }
  );

  it("idle não tem data-state (o CSS trata o repouso pela ausência do atributo)", () => {
    expect(getSvg({ state: "idle" }).hasAttribute("data-state")).toBe(false);
    expect(getSvg().hasAttribute("data-state")).toBe(false);
  });

  it("cobre os dez estados do glossário", () => {
    expect(GIRO_STATES).toHaveLength(10);
  });
});

describe("Giro — progresso", () => {
  it("50 gera data-progress e --g-dash com metade visível e metade do resto", () => {
    // Circunferência 277: 50% visível = 138.5, resto = 277 - 138.5 = 138.5.
    // Os dois somam a circunferência, então o padrão de traço fecha o círculo.
    const svg = getSvg({ progress: 50 });
    expect(svg.getAttribute("data-progress")).toBe("50");
    expect(svg.getAttribute("style")).toContain("--g-dash: 138.5 138.5");
  });

  it("0 e 100 cobrem os extremos do arco", () => {
    expect(getSvg({ progress: 0 }).getAttribute("style")).toContain("--g-dash: 0 277");
    expect(getSvg({ progress: 100 }).getAttribute("style")).toContain("--g-dash: 277 0");
  });

  it("sem progress não gera data-progress nem --g-dash", () => {
    const svg = getSvg();
    expect(svg.hasAttribute("data-progress")).toBe(false);
    expect(svg.getAttribute("style") ?? "").not.toContain("--g-dash");
  });
});

describe("Giro — olhar e pulo", () => {
  it("look define --g-look-x e --g-look-y em px", () => {
    const style = getSvg({ look: { x: 4, y: -3 } }).getAttribute("style") ?? "";
    expect(style).toContain("--g-look-x: 4px");
    expect(style).toContain("--g-look-y: -3px");
  });

  it("curioso inclina o corpo na direção do alvo, até 8° com os olhos em 6", () => {
    const tilt = (x: number) =>
      getSvg({ state: "curious", look: { x, y: 0 } }).getAttribute("style") ?? "";
    expect(tilt(6)).toContain("--g-tilt: 8deg");
    expect(tilt(-3)).toContain("--g-tilt: -4deg");
    expect(tilt(20)).toContain("--g-tilt: 8deg");
  });

  it("só o curioso inclina: outros estados e curioso sem alvo não definem --g-tilt", () => {
    expect(getSvg({ state: "thinking", look: { x: 6, y: 0 } }).getAttribute("style")).not.toContain(
      "--g-tilt"
    );
    expect(getSvg({ state: "curious" }).getAttribute("style") ?? "").not.toContain("--g-tilt");
  });

  it("a classe base g-giro vai junto de qualquer modificador de tamanho", () => {
    for (const props of [
      {},
      { size: 72 },
      { size: 40 },
      { size: 28 },
      { size: 16 },
      { signature: true },
    ]) {
      expect(getSvg(props).classList.contains("g-giro")).toBe(true);
    }
  });

  it("hop adiciona is-hop", () => {
    expect(getSvg({ hop: true }).classList.contains("is-hop")).toBe(true);
    expect(getSvg().classList.contains("is-hop")).toBe(false);
  });
});

describe("Giro — acessibilidade", () => {
  it("é decorativo: aria-hidden=true e sem role", () => {
    const svg = getSvg({ state: "loading" });
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("role")).toBeNull();
  });
});

describe("Giro — tamanho", () => {
  it("define font-size pelo size em px", () => {
    expect(getSvg({ size: 48 }).getAttribute("style")).toContain("font-size: 48px");
  });

  it.each([
    [96, "g-giro"],
    [60, "g-giro"],
    [59, "g-giro--md"],
    [32, "g-giro--md"],
    [31, "g-giro--sm"],
    [24, "g-giro--sm"],
    [23, "g-giro--xs"],
    [16, "g-giro--xs"],
  ])("size %i usa a classe %s", (size, className) => {
    expect(getSvg({ size }).classList.contains(className)).toBe(true);
  });

  it("sem size usa a classe base, que herda o tamanho do pai", () => {
    const svg = getSvg();
    expect(svg.getAttribute("class")).toBe("g-giro");
    expect(svg.getAttribute("style") ?? "").not.toContain("font-size");
  });

  it("signature usa o traço da assinatura, mesmo com size de outra faixa", () => {
    expect(getSvg({ size: 40, signature: true }).classList.contains("g-giro--signature")).toBe(
      true
    );
    expect(getSvg({ size: 40, signature: true }).classList.contains("g-giro--md")).toBe(false);
  });

  it("className é somado às classes do Giro", () => {
    const svg = getSvg({ size: 16, className: "ml-2" });
    expect(svg.classList.contains("g-giro--xs")).toBe(true);
    expect(svg.classList.contains("ml-2")).toBe(true);
  });
});

describe("Giro — estado anterior (data-from)", () => {
  it("no primeiro render não há estado anterior", () => {
    expect(getSvg({ state: "loading" }).hasAttribute("data-from")).toBe(false);
  });

  it("ao trocar de estado, data-from guarda o anterior", () => {
    const { container, rerender } = render(<Giro state="sleeping" />);
    rerender(<Giro state="idle" />);
    expect(container.querySelector("svg")?.getAttribute("data-from")).toBe("sleeping");
    rerender(<Giro state="error" />);
    expect(container.querySelector("svg")?.hasAttribute("data-from")).toBe(false);
  });

  it("re-render no mesmo estado mantém o anterior", () => {
    const { container, rerender } = render(<Giro state="error" />);
    rerender(<Giro state="idle" />);
    rerender(<Giro state="idle" look={{ x: 1, y: 0 }} />);
    expect(container.querySelector("svg")?.getAttribute("data-from")).toBe("error");
  });
});

describe("Giro — saída do carregamento", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function spinCalls() {
    return vi
      .mocked(Element.prototype.animate)
      .mock.calls.filter(
        ([frames]) => Array.isArray(frames) && frames[0] && "transform" in frames[0]
      );
  }

  it("de loading para done termina a volta a partir do ângulo em que estava", () => {
    // A animação de giro começou em 1000 ms; 2 s depois o giro está em 760°, ou seja, 40° na volta.
    vi.spyOn(Element.prototype, "getAnimations").mockReturnValue([
      { startTime: 1000 } as unknown as Animation,
    ]);
    const now = vi.spyOn(performance, "now").mockReturnValue(1000);
    const animate = vi.mocked(Element.prototype.animate);
    animate.mockClear();

    const { rerender } = render(<Giro state="loading" />);
    now.mockReturnValue(3000);
    rerender(<Giro state="done" />);

    const calls = spinCalls();
    expect(calls).toHaveLength(1);
    const [frames, timing] = calls[0] as [Keyframe[], KeyframeAnimationOptions];
    expect(Number.parseFloat(String(frames[0].transform).slice(7))).toBeCloseTo(40, 3);
    expect(frames[1].transform).toBe("rotate(360deg)");
    // Faltam 320°: 2,2 ms por grau.
    expect(timing.duration).toBeCloseTo(704, 3);
  });

  it("sem ter passado por loading, nada é animado por JS", () => {
    const animate = vi.mocked(Element.prototype.animate);
    animate.mockClear();
    const { rerender } = render(<Giro state="idle" />);
    rerender(<Giro state="done" />);
    expect(animate).not.toHaveBeenCalled();
  });

  it("com movimento reduzido a troca é direta", () => {
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
    const animate = vi.mocked(Element.prototype.animate);
    animate.mockClear();
    const { rerender } = render(<Giro state="loading" />);
    rerender(<Giro state="done" />);
    expect(animate).not.toHaveBeenCalled();
  });

  function dashCalls() {
    return vi
      .mocked(Element.prototype.animate)
      .mock.calls.filter(
        ([frames]) => Array.isArray(frames) && frames[0] && "strokeDasharray" in frames[0]
      );
  }

  it("a transição do arco volta quando o traço termina de resolver", () => {
    const animate = vi.mocked(Element.prototype.animate);
    animate.mockClear();
    const { container, rerender } = render(<Giro state="loading" />);
    rerender(<Giro state="done" />);

    const arc = container.querySelector<SVGCircleElement>(".g-giro__arc");
    expect(arc?.style.transition).toBe("none");
    const resolve = animate.mock.results.at(-1)?.value as Animation;
    resolve.onfinish?.call(resolve, new Event("finish") as AnimationPlaybackEvent);
    expect(arc?.style.transition).toBe("");
  });

  it("voltar a loading antes do fim cancela a saída e devolve a transição", () => {
    const animate = vi.mocked(Element.prototype.animate);
    animate.mockClear();
    const { container, rerender } = render(<Giro state="loading" />);
    rerender(<Giro state="done" />);
    const exits = animate.mock.results.map(result => result.value as Animation);
    expect(exits).toHaveLength(3);

    rerender(<Giro state="loading" />);
    for (const exit of exits) expect(exit.cancel).toHaveBeenCalledOnce();
    expect(container.querySelector<SVGCircleElement>(".g-giro__arc")?.style.transition).toBe("");
  });

  it("thinking e lost têm giro próprio: a volta não é terminada por JS", () => {
    const animate = vi.mocked(Element.prototype.animate);
    for (const target of ["thinking", "lost"] as const) {
      animate.mockClear();
      const { rerender, unmount } = render(<Giro state="loading" />);
      rerender(<Giro state={target} />);
      expect(animate).not.toHaveBeenCalled();
      unmount();
    }
  });

  it("sleeping e progresso mantêm a transição própria do traço", () => {
    const animate = vi.mocked(Element.prototype.animate);
    animate.mockClear();
    const sleep = render(<Giro state="loading" />);
    sleep.rerender(<Giro state="sleeping" />);
    expect(spinCalls()).toHaveLength(1);
    expect(dashCalls()).toHaveLength(0);
    sleep.unmount();

    animate.mockClear();
    const progress = render(<Giro state="loading" progress={40} />);
    progress.rerender(<Giro state="done" progress={100} />);
    expect(spinCalls()).toHaveLength(1);
    expect(dashCalls()).toHaveLength(0);
  });
});

describe("Giro — momentos", () => {
  // O jsdom não tem AnimationEvent: o nome da animação vai à mão.
  function endAnimation(target: Element, animationName: string) {
    const event = createEvent.animationEnd(target);
    Object.defineProperty(event, "animationName", { value: animationName });
    fireEvent(target, event);
  }

  it("a piscadela toca uma vez e sai quando o relógio do momento termina", () => {
    const { container } = render(<Giro moment="wink" />);
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg.getAttribute("data-moment")).toBe("wink");

    // O fim de uma animação de dentro (o corpo) não encerra o momento.
    endAnimation(svg.querySelector(".g-giro__body") as Element, "g-wink-body");
    expect(svg.getAttribute("data-moment")).toBe("wink");

    endAnimation(svg, "g-moment");
    expect(svg.hasAttribute("data-moment")).toBe(false);
  });

  it("relógio cancelado (svg escondido no meio) também encerra o momento", () => {
    const { container } = render(<Giro moment="wink" />);
    const svg = container.querySelector("svg") as SVGSVGElement;
    const cancel = new Event("animationcancel");
    Object.defineProperty(cancel, "animationName", { value: "g-moment" });
    act(() => {
      svg.dispatchEvent(cancel);
    });
    expect(svg.hasAttribute("data-moment")).toBe(false);
  });

  it("toca de novo quando a prop troca", () => {
    const { container, rerender } = render(<Giro moment="wink" />);
    const svg = container.querySelector("svg") as SVGSVGElement;
    endAnimation(svg, "g-moment");
    rerender(<Giro />);
    rerender(<Giro moment="wink" />);
    expect(svg.getAttribute("data-moment")).toBe("wink");
  });

  it("outra ilha toca o momento pelo evento", () => {
    const { container } = render(<Giro state="done" />);
    const svg = container.querySelector("svg") as SVGSVGElement;
    act(() => playGiroMoment(svg, "hello"));
    expect(svg.getAttribute("data-moment")).toBe("hello");
    expect(svg.getAttribute("data-state")).toBe("done");
  });

  it("no ouvindo, o pulso alterna a cada mudança", () => {
    const { container, rerender } = render(<Giro moment="listening" pulse={0} />);
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg.getAttribute("data-pulse")).toBe("0");
    rerender(<Giro moment="listening" pulse={1} />);
    expect(svg.getAttribute("data-pulse")).toBe("1");
    expect(svg.getAttribute("data-moment")).toBe("listening");
  });

  it("com movimento reduzido, nenhum momento toca", () => {
    vi.mocked(window.matchMedia).mockImplementationOnce(
      (query: string) =>
        ({
          matches: true,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList
    );
    const { container } = render(<Giro moment="listening" pulse={2} />);
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg.hasAttribute("data-moment")).toBe(false);
    expect(svg.hasAttribute("data-pulse")).toBe(false);
  });
});

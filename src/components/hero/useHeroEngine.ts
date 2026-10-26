import type { MutableRefObject, RefObject } from "react";
import { useEffect, useRef } from "react";
import type { FieldOptions, SpinnerField } from "./field";
import { createSpinnerField, DESKTOP_FIELD, MOBILE_FIELD, readFieldColors } from "./field";
import type {
  GiroMood,
  HeroConfig,
  HeroGeometry,
  HeroState,
  HudLabel,
  LetterLine,
} from "./heroEngine";
import {
  arcRadius,
  createHeroState,
  DESKTOP_HERO,
  giroHole,
  hopHero,
  hudLabel,
  MOBILE_HERO,
  pointerLeave,
  pointerMove,
  resetHero,
  squashOf,
  stepHero,
  stillHero,
} from "./heroEngine";

const DESKTOP_QUERY = "(min-width: 768px)";
// Origem do lançamento: a assinatura no cabeçalho (computador) ou a aba do Giro (celular).
const SOURCE_DESKTOP = "[data-site-header] .g-signature__o .g-giro";
const SOURCE_MOBILE = ".g-tabbar__giro .g-giro";
const FIELD_STEP_S = 1 / 30;
const HUD_STEP_S = 0.1;
const MAX_DT_S = 0.034;

export interface HudLabels {
  states: Record<HudLabel, string>;
  numberLocale: string;
}

export interface HeroEngineOptions {
  stageRef: RefObject<HTMLElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  giroRef: RefObject<HTMLButtonElement>;
  seatRef: RefObject<SVGSVGElement>;
  labelsRef: MutableRefObject<HudLabels>;
  reduced: boolean;
  titleKey: string;
}

interface HeroRuntime {
  start(): void;
  setTitle(key: string): void;
  destroy(): void;
}

interface HeroElements {
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
  giro: HTMLButtonElement;
  seat: SVGSVGElement | null;
}

/** Liga o motor ao DOM. Desliga o loop fora da tela, com a aba oculta e com movimento reduzido. */
export function useHeroEngine(opts: HeroEngineOptions): void {
  const { stageRef, canvasRef, giroRef, seatRef, labelsRef, reduced, titleKey } = opts;
  const runtimeRef = useRef<HeroRuntime | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const giro = giroRef.current;
    if (!stage || !canvas || !giro) return;
    const runtime = createRuntime(
      { stage, canvas, giro, seat: seatRef.current },
      labelsRef,
      reduced
    );
    if (!runtime) return;
    runtimeRef.current = runtime;
    runtime.start();
    return () => {
      runtime.destroy();
      runtimeRef.current = null;
    };
  }, [reduced, stageRef, canvasRef, giroRef, seatRef, labelsRef]);

  useEffect(() => {
    runtimeRef.current?.setTitle(titleKey);
  }, [titleKey]);
}

const lineOf = (el: HTMLElement): LetterLine => (el.dataset.line === "1" ? 1 : 2);

function createRuntime(
  els: HeroElements,
  labelsRef: MutableRefObject<HudLabels>,
  reduced: boolean
): HeroRuntime | null {
  const { stage, canvas, giro, seat } = els;
  const inner = giro.querySelector<HTMLElement>(".hr-giro-in");
  const svg = giro.querySelector<SVGSVGElement>(".g-giro");
  const spin = svg?.querySelector<SVGGElement>(".g-giro__spin");
  const baseEl = stage.querySelector<HTMLElement>(".hr-base");
  if (!inner || !svg || !spin || !baseEl) return null;
  const hudState = stage.querySelector<HTMLElement>(".hr-hud-st");
  const hudX = stage.querySelector<HTMLElement>(".hr-hud-x");
  const hudRot = stage.querySelector<HTMLElement>(".hr-hud-rot");
  const desktopQuery = window.matchMedia(DESKTOP_QUERY);

  let desktop = desktopQuery.matches;
  let cfg: HeroConfig = desktop ? DESKTOP_HERO : MOBILE_HERO;
  let fieldOpts: FieldOptions = desktop ? DESKTOP_FIELD : MOBILE_FIELD;
  let titleKey = "";
  let letterEls: HTMLElement[] = [];
  let state: HeroState = createHeroState(cfg, []);
  let geo: HeroGeometry | null = null;
  let source: SVGElement | null = null;
  let field: SpinnerField | null = null;
  let fieldTried = false;
  let fieldW = -1;
  let fieldH = -1;
  let fieldDpr = -1;
  let raf = 0;
  let running = false;
  let last = 0;
  let fieldAcc = 0;
  let visible = true;
  let destroyed = false;
  let hudAt = -1;
  let lastMood: GiroMood | null = null;
  let lastOut: boolean | null = null;
  let io: IntersectionObserver | null = null;

  const findSource = (): SVGElement | null => {
    if (!source?.isConnected) {
      source = document.querySelector<SVGElement>(desktop ? SOURCE_DESKTOP : SOURCE_MOBILE);
    }
    return source;
  };

  // Medidas no mesmo sistema do palco. Lidas a cada quadro, porque a aba do celular é fixa.
  const measure = (): HeroGeometry => {
    const origin = stage.getBoundingClientRect();
    const rel = (el: Element) => {
      const b = el.getBoundingClientRect();
      return { l: b.left - origin.left, t: b.top - origin.top, w: b.width, h: b.height };
    };
    // offsetWidth ignora o transform que o motor aplica ao Giro.
    const R = giro.offsetWidth / 2;
    const src = findSource();
    const home = src ? rel(src) : { l: R, t: R, w: 0, h: 0 };
    const homeS = R > 0 && home.w > 0 ? home.w / (2 * R) : 1;
    const letters = letterEls.map(el => {
      const b = rel(el);
      return { line: lineOf(el), cx: b.l + b.w / 2, cy: b.t + b.h / 2, r: b.l + b.w };
    });
    const base = rel(baseEl);
    const g: HeroGeometry = {
      W: stage.offsetWidth,
      H: stage.offsetHeight,
      R,
      homeX: home.l + home.w / 2,
      homeY: home.t + home.h / 2,
      homeS,
      groundY: base.t - arcRadius(R),
      letters,
    };
    geo = g;
    return g;
  };

  const syncField = (g: HeroGeometry): void => {
    if (!field && !fieldTried) {
      fieldTried = true;
      field = createSpinnerField(canvas, fieldOpts, readFieldColors(stage));
    }
    if (!field) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (g.W !== fieldW || g.H !== fieldH || dpr !== fieldDpr) {
      fieldW = g.W;
      fieldH = g.H;
      fieldDpr = dpr;
      field.resize(g.W, g.H, dpr);
    }
  };

  const render = (g: HeroGeometry, paint: boolean): void => {
    state.letters.forEach((c, i) => {
      const el = letterEls[i];
      if (el)
        el.style.fontVariationSettings = `"wdth" ${c.w.toFixed(1)}, "wght" ${Math.round(c.g)}`;
    });
    giro.style.transform = `translate(${(state.x - g.R).toFixed(2)}px, ${(state.y - g.R).toFixed(2)}px) scale(${state.sc.toFixed(4)})`;
    const q = squashOf(state);
    inner.style.transform = `scale(${(1 + 0.16 * q).toFixed(3)}, ${(1 - 0.2 * q).toFixed(3)})`;
    spin.style.transform = `rotate(${state.rot.toFixed(2)}deg)`;
    svg.style.setProperty("--g-look-x", `${state.look.x.toFixed(2)}px`);
    svg.style.setProperty("--g-look-y", `${state.look.y.toFixed(2)}px`);
    if (state.mood !== lastMood) {
      lastMood = state.mood;
      svg.setAttribute("data-state", state.mood);
    }
    const out = state.phase !== "wait";
    if (out !== lastOut) {
      lastOut = out;
      stage.classList.toggle("is-out", out);
    }
    // O Giro da origem some enquanto o Giro voa e volta com o reset.
    const src = findSource();
    if (src) src.style.opacity = out ? "0" : "";
    if (seat) {
      const size = g.homeS * 2 * g.R;
      seat.style.width = `${size}px`;
      seat.style.height = `${size}px`;
      seat.style.transform = `translate(${(g.homeX - size / 2).toFixed(2)}px, ${(g.homeY - size / 2).toFixed(2)}px)`;
    }
    if (hudState && hudX && hudRot && state.t - hudAt > HUD_STEP_S) {
      hudAt = state.t;
      const labels = labelsRef.current;
      hudState.textContent = labels.states[hudLabel(state)];
      hudX.textContent = String(Math.max(0, Math.round(state.x))).padStart(4, "0");
      hudRot.textContent = `${Math.round(Math.abs(state.rot)).toLocaleString(labels.numberLocale)}°`;
    }
    if (field) {
      if (paint) field.paint(state.t);
      field.present(giroHole(state, g));
    }
  };

  const rebuild = (): void => {
    letterEls = Array.from(stage.querySelectorAll<HTMLElement>(".hr-c"));
    state = createHeroState(
      cfg,
      letterEls.map(el => lineOf(el))
    );
    hudAt = -1;
    lastMood = null;
    lastOut = null;
    const g = measure();
    if (reduced) {
      stillHero(state, cfg, g);
    } else {
      resetHero(state, cfg, g);
    }
    syncField(g);
    render(g, true);
  };

  const frame = (now: number): void => {
    raf = 0;
    if (!running) return;
    const dt = Math.min(MAX_DT_S, (now - last) / 1000 || 0.016);
    last = now;
    const g = measure();
    stepHero(state, dt, g, cfg);
    syncField(g);
    if (field) {
      field.decay(dt);
      field.burst(state.bursts);
    }
    fieldAcc += dt;
    const paint = fieldAcc >= FIELD_STEP_S;
    if (paint) fieldAcc = 0;
    render(g, paint);
    raf = requestAnimationFrame(frame);
  };

  // Roda só quando o hero está na tela, a aba está visível e o movimento não é reduzido.
  const sync = (): void => {
    if (destroyed) return;
    const should = !reduced && visible && !document.hidden;
    if (should && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else if (!should && running) {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const onMove = (e: PointerEvent): void => {
    const r = stage.getBoundingClientRect();
    pointerMove(state, e.clientX - r.left, e.clientY - r.top);
  };

  const onLeave = (): void => {
    pointerLeave(state);
  };

  const onHop = (): void => {
    if (geo) hopHero(state, cfg, geo);
  };

  const onResize = (): void => {
    if (reduced) rebuild();
  };

  const onVariant = (): void => {
    if (desktopQuery.matches === desktop) return;
    desktop = desktopQuery.matches;
    cfg = desktop ? DESKTOP_HERO : MOBILE_HERO;
    fieldOpts = desktop ? DESKTOP_FIELD : MOBILE_FIELD;
    if (source) source.style.opacity = "";
    source = null;
    field = null;
    fieldTried = false;
    fieldW = -1;
    fieldH = -1;
    rebuild();
  };

  const start = (): void => {
    rebuild();
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    giro.addEventListener("click", onHop);
    window.addEventListener("resize", onResize);
    desktopQuery.addEventListener("change", onVariant);
    document.addEventListener("visibilitychange", sync);
    io = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      // Fora da tela o Giro da origem (assinatura ou aba) volta ao lugar dele.
      if (!visible) {
        const src = findSource();
        if (src) src.style.opacity = "";
      }
      sync();
    });
    io.observe(stage);
    sync();
  };

  const setTitle = (key: string): void => {
    if (key === titleKey) return;
    titleKey = key;
    rebuild();
  };

  const destroy = (): void => {
    destroyed = true;
    running = false;
    cancelAnimationFrame(raf);
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerleave", onLeave);
    giro.removeEventListener("click", onHop);
    window.removeEventListener("resize", onResize);
    desktopQuery.removeEventListener("change", onVariant);
    document.removeEventListener("visibilitychange", sync);
    io?.disconnect();
    if (source) source.style.opacity = "";
  };

  return { start, setTitle, destroy };
}

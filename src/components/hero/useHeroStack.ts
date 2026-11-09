import type { MutableRefObject, RefObject } from "react";
import { useEffect, useRef } from "react";
import { playGiroMoment } from "@/components/brand/giro-states";
import type { EntryPathBall, EntryPathConfig, Letter, LetterSpring } from "./entry-path";
import {
  computePileContact,
  createEntrySegments,
  DESKTOP_ENTRY_PATH,
  dipLetters,
  lookAhead,
  MOBILE_ENTRY_PATH,
  stepLetterSprings,
  stepPath,
} from "./entry-path";
import type { Camera, Point, StackConfig, StackMood, Station } from "./stack";
import {
  approach,
  createHopRide,
  cycleSteps,
  DESKTOP_STACK,
  FIRE_DELAY_MS,
  hitLayer,
  LAYER_COUNT,
  LOADING_SPIN,
  layerHeights,
  layoutScale,
  MOBILE_STACK,
  makeCamera,
  pointerOpen,
  project,
  ROLL_PER_PX,
  riderAt,
  scrollProgress,
  stackCenter,
  stackOrigin,
  stations,
  stepHop,
  stepSprings,
  visitBeats,
} from "./stack";
import type { HopRide } from "./stack";

const DESKTOP_QUERY = "(min-width: 768px)";
// Origem do lançamento: a assinatura no cabeçalho (computador) ou a aba do Giro (celular).
const SOURCE_DESKTOP = "[data-site-header] .g-signature__o .g-giro";
const SOURCE_MOBILE = ".g-tabbar__giro .g-giro";
const LAUNCH_MS = 1000;
// Com a tela de carregamento, o Giro sai logo depois que a assinatura pousa e o loader some.
const LAUNCH_AFTER_LOADER_MS = 300;
// Tempo do amasso na origem antes de soltar o Giro.
const PRELAUNCH_MS = 110;
const LOADER_ATTR = "data-loader";
const LOOP_AFTER_LAND_MS = 350;
const CLICK_RETURN_MS = 3200;
const STILL_OPEN = 0.72;
const HOVER_LIFT = 14;
const HOP_SPEED = 560;
const GRAVITY = 2200;
const HUD_STEP_MS = 200;
const MAX_DT_S = 0.05;
// Rapidez com que o giro do anel acompanha a velocidade: alto o bastante para parecer preso ao chão.
const ROLL_FOLLOW = 10;
const GROW_RATE = 7;
const TRAIL_MAX = 90;

export type HudMood = StackMood | "air" | "roll";

export interface HudLabels {
  states: Record<HudMood, string>;
  layers: readonly [string, string, string, string];
  floor: string;
}

export interface HeroStackOptions {
  stageRef: RefObject<HTMLElement>;
  riderRef: RefObject<HTMLButtonElement>;
  seatRef: RefObject<SVGSVGElement>;
  labelsRef: MutableRefObject<HudLabels>;
  reduced: boolean;
  locale: string;
}

interface Runtime {
  start(): void;
  relabel(): void;
  destroy(): void;
}

type Mode = "seat" | "ball" | "rail";
type HudLayer = { kind: "none" } | { kind: "floor" } | { kind: "at" | "to"; layer: number };

/** Liga a pilha ao DOM. O laço por quadro para fora da tela, com a aba oculta e com movimento reduzido. */
export function useHeroStack(opts: HeroStackOptions): void {
  const { stageRef, riderRef, seatRef, labelsRef, reduced, locale } = opts;
  const runtimeRef = useRef<Runtime | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const rider = riderRef.current;
    if (!stage || !rider) return;
    const runtime = createRuntime(stage, rider, seatRef.current, labelsRef, reduced);
    if (!runtime) return;
    runtimeRef.current = runtime;
    runtime.start();
    return () => {
      runtime.destroy();
      runtimeRef.current = null;
    };
  }, [reduced, stageRef, riderRef, seatRef, labelsRef]);

  // A troca de idioma só reescreve o painel de estado; o resto da pilha é texto do React.
  useEffect(() => {
    if (locale) runtimeRef.current?.relabel();
  }, [locale]);
}

function byData(root: Element, attr: string): Map<number, HTMLElement | SVGElement> {
  const out = new Map<number, HTMLElement | SVGElement>();
  for (const node of root.querySelectorAll<HTMLElement | SVGElement>(`[${attr}]`)) {
    out.set(Number(node.getAttribute(attr)), node);
  }
  return out;
}

/** Reinicia uma animação de classe: tira, força o layout e põe de novo. */
function restartClass(el: Element, ...names: string[]): void {
  el.classList.remove(...names);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(...names);
}

function createRuntime(
  stage: HTMLElement,
  rider: HTMLButtonElement,
  seat: SVGSVGElement | null,
  labelsRef: MutableRefObject<HudLabels>,
  reduced: boolean
): Runtime | null {
  const inner = rider.querySelector<HTMLElement>(".hb-rider__in");
  const svg = rider.querySelector<SVGSVGElement>(".g-giro");
  const rail = stage.querySelector<SVGPolylineElement>(".hb-rail");
  const isoEls = Array.from(stage.querySelectorAll<HTMLElement>("[data-iso]"));
  const layerMap = byData(stage, "data-layer");
  const layers = Array.from({ length: LAYER_COUNT }, (_, i) => layerMap.get(i) as HTMLElement);
  if (!inner || !svg || !rail || isoEls.length === 0 || layers.some(n => !n)) return null;
  const stops = byData(stage, "data-stop");
  const links = byData(stage, "data-link");
  const tags = byData(stage, "data-tag");
  const hudState = stage.querySelector<HTMLElement>('[data-hud="state"]');
  const hudLayer = stage.querySelector<HTMLElement>('[data-hud="layer"]');
  const hudOpen = stage.querySelector<HTMLElement>('[data-hud="open"]');
  const title = stage.querySelector<HTMLElement>(".hb-title");
  const trailPath = stage.querySelector<SVGPathElement>(".hb-trail__p");
  const desktopQuery = window.matchMedia(DESKTOP_QUERY);

  let cfg: StackConfig = desktopQuery.matches ? DESKTOP_STACK : MOBILE_STACK;
  let entryCfg: EntryPathConfig = desktopQuery.matches ? DESKTOP_ENTRY_PATH : MOBILE_ENTRY_PATH;
  let scale = 1;
  let origin: Point = { x: 0, y: 0 };
  let cam: Camera | null = null;
  let zs: number[] = [];
  const open = [0, 0, 0, 0];
  const vel = [0, 0, 0, 0];
  const lift = [0, 0, 0, 0];
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  let openAuto = 0;
  let openPtr = 0;
  let hover = -1;
  let mode: Mode = "seat";
  let rp = -1;
  interface ActiveRide {
    ride: HopRide;
    t: number;
    done?: () => void;
  }
  let activeRide: ActiveRide | null = null;
  let hopX = 0;
  // A bola da entrada desenhada em arcos e as letras medidas (mesma ordem do DOM).
  let ball: EntryPathBall | null = null;
  let letters: Letter[] = [];
  let letterEls: HTMLElement[] = [];
  let springs: LetterSpring[] = [];
  let springsLive = false;
  let trail: { x: number; y: number; t: number }[] = [];
  // Relógio do rastro. Anda sempre, para o rastro morrer também depois de estacionar.
  let simT = 0;
  let inkCtx: CanvasRenderingContext2D | null | undefined;
  let jumpY = 0;
  let jumpV = 0;
  let roll = 0;
  let spinVel = 0;
  let mood: StackMood = "idle";
  let gscale = 1;
  let lastPos: Point | null = null;
  let loopN = 0;
  let cycleBusy = false;
  let restAt = 0;
  let firstCycleCompleted = false;
  let gen = 0;
  let timers: number[] = [];
  const hud: { mood: HudMood; layer: HudLayer } = { mood: "idle", layer: { kind: "none" } };
  let hudAt = 0;
  let source: SVGElement | null = null;
  let raf = 0;
  let running = false;
  let last = 0;
  let visible = true;
  let destroyed = false;
  let io: IntersectionObserver | null = null;
  let ro: ResizeObserver | null = null;
  let mo: MutationObserver | null = null;
  let launchQueued = false;

  const findSource = (): SVGElement | null => {
    if (!source?.isConnected) {
      source = document.querySelector<SVGElement>(
        desktopQuery.matches ? SOURCE_DESKTOP : SOURCE_MOBILE
      );
    }
    return source;
  };

  const after = (ms: number, fn: () => void): void => {
    const g = gen;
    const id = window.setTimeout(() => {
      if (!destroyed && g === gen) fn();
    }, ms);
    timers.push(id);
  };

  const clearTimers = (): void => {
    gen += 1;
    launchQueued = false;
    for (const id of timers) window.clearTimeout(id);
    timers = [];
  };

  // ---------- Painel de estado ----------

  const layerText = (l: HudLayer): string => {
    const labels = labelsRef.current;
    if (l.kind === "floor") return labels.floor;
    if (l.kind === "at") return labels.layers[l.layer] ?? "—";
    if (l.kind === "to") return `→ ${labels.layers[l.layer] ?? labels.floor}`;
    return "—";
  };

  const writeHud = (): void => {
    if (hudState) hudState.textContent = labelsRef.current.states[hud.mood];
    if (hudLayer) hudLayer.textContent = layerText(hud.layer);
    if (hudOpen) hudOpen.textContent = `${Math.round(Math.max(0, open[2] ?? 0) * 100)}%`;
  };

  const setHud = (nextMood: HudMood | null, layer?: HudLayer): void => {
    if (nextMood) hud.mood = nextMood;
    if (layer) hud.layer = layer;
    writeHud();
  };

  // ---------- Giro ----------

  const look = (x: number, y: number): void => {
    svg.style.setProperty("--g-look-x", `${x.toFixed(1)}px`);
    svg.style.setProperty("--g-look-y", `${y.toFixed(1)}px`);
  };

  // Na estação o Giro olha para a esquerda, para a camada que ele acabou de acender.
  const setMood = (next: StackMood, watch = false): void => {
    mood = next;
    svg.setAttribute("data-state", next);
    svg.classList.remove("is-hop");
    if (next === "done") restartClass(svg, "is-hop");
    if (next === "curious") {
      look(-6, -1);
      svg.style.setProperty("--g-tilt", "-7deg");
    } else {
      svg.style.setProperty("--g-tilt", "0deg");
      look(watch ? -5 : 0, 0);
    }
    if (mode !== "seat") setHud(next);
  };

  const squash = (): void => restartClass(inner, "is-squash");

  const squint = (): void => {
    svg.classList.add("is-squint");
    after(130, () => svg.classList.remove("is-squint"));
  };

  // ---------- Geometria ----------

  const layout = (scroll: number): void => {
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    scale = layoutScale(cfg, W);
    origin = stackOrigin(cfg, W, H);
    for (const n of isoEls) {
      n.style.setProperty("--ox", `${origin.x.toFixed(1)}px`);
      n.style.setProperty("--oy", `${origin.y.toFixed(1)}px`);
    }
    rider.style.setProperty("--gs", `${cfg.gs}px`);
    applyCamera(scroll);
  };

  // Câmera: inclina com o ponteiro e, com a rolagem, gira até ficar de frente.
  const applyCamera = (scroll: number): void => {
    cam = makeCamera(cfg, origin, scale, scroll, tilt.x, tilt.y);
    const s = stage.style;
    s.setProperty("--rx", `${cam.rxDeg.toFixed(2)}deg`);
    s.setProperty("--rz", `${cam.rzDeg.toFixed(2)}deg`);
    s.setProperty("--k", cam.k.toFixed(4));
    s.setProperty("--lo", cam.fade.toFixed(3));
    s.setProperty("--fo", cam.fade.toFixed(3));
  };

  const renderLayers = (): void => {
    zs = layerHeights(cfg, open, lift);
    layers.forEach((n, i) => {
      n.style.setProperty("--zr", `${(zs[i] ?? 0).toFixed(1)}px`);
    });
  };

  const placeSeat = (): void => {
    const src = findSource();
    if (!seat || !src) return;
    const o = stage.getBoundingClientRect();
    const b = src.getBoundingClientRect();
    seat.style.width = `${b.width}px`;
    seat.style.height = `${b.height}px`;
    seat.style.transform = `translate(${(b.left - o.left).toFixed(1)}px, ${(b.top - o.top).toFixed(1)}px)`;
  };

  const syncSource = (): void => {
    const src = findSource();
    const away = mode !== "seat";
    stage.classList.toggle("is-away", away);
    // Antes do lançamento o botão está invisível: fora do Tab, para não haver foco que não se vê.
    rider.tabIndex = away ? 0 : -1;
    // O Giro da origem some enquanto o Giro está na linha e volta quando o hero sai da tela.
    if (src) src.style.opacity = away && visible ? "0" : "";
    if (away) placeSeat();
  };

  // dt > 0 só no laço: é ele que integra o giro do anel.
  const drawLine = (dt = 0): void => {
    if (!cam) return;
    const st: Station[] = stations(cfg, cam, zs, scale);
    rail.setAttribute("points", st.map(s => `${s.x.toFixed(1)},${s.y.toFixed(1)}`).join(" "));
    st.forEach((s, idx) => {
      const i = idx - 1;
      const stop = stops.get(i);
      if (stop) {
        stop.setAttribute("cx", s.x.toFixed(1));
        stop.setAttribute("cy", s.y.toFixed(1));
      }
      if (i < 0) return;
      const link = links.get(i);
      if (link) {
        link.style.left = `${s.cx.toFixed(1)}px`;
        link.style.top = `${(s.y - 1).toFixed(1)}px`;
        link.style.width = `${Math.max(0, s.x - s.cx).toFixed(1)}px`;
      }
      const tag = tags.get(i);
      if (tag) {
        tag.style.left = `${(s.x + cfg.tagGap * scale).toFixed(1)}px`;
        tag.style.top = `${(s.y - 9).toFixed(1)}px`;
      }
    });
    // Na bola quem posiciona o Giro é placeBall; na linha, a estação.
    if (mode !== "rail") return;
    const pos = riderAt(st, rp);
    if (dt > 0) {
      const moved = lastPos ? -(pos.y - lastPos.y) + (pos.x - lastPos.x) * 0.5 : 0;
      const target = (moved * ROLL_PER_PX) / dt + (mood === "loading" ? LOADING_SPIN : 0);
      spinVel = approach(spinVel, target, ROLL_FOLLOW, dt);
      roll = (roll + spinVel * dt) % 360;
    }
    lastPos = pos;
    rider.style.transform = `translate(${(pos.x + hopX).toFixed(1)}px, ${(pos.y - jumpY).toFixed(1)}px)`;
    svg.style.setProperty("--roll", `${roll.toFixed(1)}deg`);
    inner.style.setProperty("--gscale", gscale.toFixed(3));
  };

  // ---------- Estações e ciclo ----------

  const clearLinks = (): void => {
    for (const link of links.values()) link.classList.remove("is-live");
  };

  const setLit = (i: number): void => {
    for (const [k, n] of tags) n.classList.toggle("is-on", k === i);
    for (const [k, n] of stops) n.classList.toggle("is-on", k === i);
  };

  const showTag = (i: number): void => {
    tags.get(i)?.classList.add("is-shown");
  };

  const hideTags = (): void => {
    for (const n of tags.values()) n.classList.remove("is-shown");
  };

  const startRide = (to: number, done?: () => void): void => {
    clearLinks();
    setMood("idle");
    look(0, to > rp ? -4 : 4);
    setHud(null, to < 0 ? { kind: "to", layer: -1 } : { kind: "to", layer: to });

    if (!cam) return;
    const from = rp;
    const st = stations(cfg, cam, zs, scale);
    const fromIdx = Math.max(-1, Math.min(3, Math.round(from))) + 1;
    const toIdx = to + 1;
    const fromStation = st[fromIdx] ?? st[0];
    const toStation = st[toIdx] ?? st[0];
    const D = Math.max(1, Math.abs(toStation.y - fromStation.y));
    const g = entryCfg.g;
    const hop = createHopRide({ from, to, D, g, hopH: cfg.hopH });

    inner.classList.remove("is-crouch", "is-squash");
    void inner.offsetWidth;
    inner.classList.add("is-crouch");

    after(95, () => {
      inner.classList.remove("is-crouch");
      activeRide = { ride: hop, t: 0, done };
    });
  };

  const fire = (i: number, error: boolean): void => {
    const n = layers[i];
    if (!n) return;
    restartClass(n, "is-fire", "is-fresh");
    if (i === 1) n.classList.toggle("is-error", error);
  };

  // Na estação, o Giro olha para a camada, o sinal corre pela ligação e a camada dispara.
  const arrive = (i: number, error: boolean, face?: StackMood): void => {
    setLit(i);
    showTag(i);
    const link = links.get(i);
    if (link) restartClass(link, "is-live");
    setHud(null, { kind: "at", layer: i });
    after(FIRE_DELAY_MS, () => fire(i, error));
    if (face === "done") {
      setMood("done");
      after(1000, () => {
        if (mode === "rail" && !activeRide && mood === "done") setMood("idle", true);
      });
      return;
    }
    for (const beat of visitBeats(i, error)) {
      const run = (): void => {
        if (beat.clearError) layers[1]?.classList.remove("is-error");
        setMood(beat.mood, beat.watch === true);
      };
      if (beat.at === 0) run();
      else after(beat.at, run);
    }
  };

  const visit = (i: number, error: boolean): void => {
    if (mode !== "rail") return;
    startRide(i, () => arrive(i, error));
  };

  const rest = (): void => {
    cycleBusy = false;
    restAt = performance.now();
    setHud("idle", { kind: "floor" });
    after(700, () => {
      if (mode === "rail" && !activeRide && rp < 0) {
        setMood("idle");
      }
    });
  };

  const home = (done?: () => void): void => {
    startRide(-1, () => {
      openAuto = 0;
      hideTags();
      setLit(hover);
      setMood("done");
      firstCycleCompleted = true;
      rest();
      done?.();
    });
  };

  // Uma volta depois do descanso, quando o ponteiro chega perto da pilha.
  const runCycle = (): void => {
    cycleBusy = true;
    loopN += 1;
    openAuto = 1;
    after(350, () => visit(0, false));
    for (const step of cycleSteps(loopN, 950)) {
      after(step.at, () => {
        if (step.kind === "visit") visit(step.layer, step.error);
        else if (step.kind === "home") home();
      });
    }
  };

  const runFirstCycle = (): void => {
    cycleBusy = true;
    loopN = 1;
    openAuto = 1;
    visit(0, false);
    for (const step of cycleSteps(loopN)) {
      after(step.at, () => {
        if (step.kind === "visit") visit(step.layer, step.error);
        else if (step.kind === "home") home();
      });
    }
  };

  // Começa o ciclo do chão se a primeira volta não terminou; senão, descansa.
  const restartCycle = (): void => {
    rp = -1;
    openAuto = 0;
    clearLinks();
    setLit(-1);
    setMood("idle");
    setHud("idle", { kind: "floor" });
    if (!firstCycleCompleted) {
      after(LOOP_AFTER_LAND_MS, runFirstCycle);
    } else {
      rest();
    }
  };

  // ---------- Entrada desenhada (Issue #107) ----------

  const measure = (): void => {
    if (!title) return;
    if (inkCtx === undefined) inkCtx = document.createElement("canvas").getContext("2d");
    const ctx = inkCtx;
    const st = stage.getBoundingClientRect();
    const cs = getComputedStyle(title);
    const size = parseFloat(cs.fontSize);
    const lh = parseFloat(cs.lineHeight) || size * 0.94;
    let A = size * 0.9;
    let D = size * 0.25;
    if (ctx) {
      ctx.font = `${cs.fontWeight} ${size}px ${cs.fontFamily}`;
      const fm = ctx.measureText("Hx");
      A = fm.fontBoundingBoxAscent || A;
      D = fm.fontBoundingBoxDescent || D;
    }
    const els: HTMLElement[] = [];
    const next: Letter[] = [];
    const groups = Array.from(title.querySelectorAll<HTMLElement>(".hb-title__line"), lineEl =>
      Array.from(lineEl.querySelectorAll<HTMLElement>(".hb-ch"))
    );
    for (const group of groups) for (const n of group) n.style.transform = "";
    groups.forEach((group, line) => {
      for (const n of group) {
        const r = n.getBoundingClientRect();
        let top = r.top - st.top;
        if (ctx) {
          const base = r.top - st.top + (lh - (A + D)) / 2 + A;
          top = base - ctx.measureText(n.textContent ?? "").actualBoundingBoxAscent;
        }
        els.push(n);
        next.push({ l: r.left - st.left + 2, r: r.right - st.left - 2, top, line });
      }
    });
    letters = next;
    letterEls = els;
    springs = next.map(() => ({ y: 0, v: 0 }));
  };

  const hitPile = (): void => {
    openAuto = 1;
    for (let i = 1; i < LAYER_COUNT; i += 1) vel[i] = -2.4;
    lift[2] = -9;
    lift[1] = -5;
    const top = layers[2];
    if (top) {
      restartClass(top, "is-hit");
      after(260, () => top.classList.remove("is-hit"));
    }
    svg.classList.remove("is-wide");
    playGiroMoment(svg, "dizzy");
    setHud("loading", { kind: "to", layer: 0 });
  };

  const landStation = (): void => {
    ball = null;
    inner.style.transform = "";
    mode = "rail";
    rp = 0;
    spinVel = 0;
    lastPos = null;
    gscale = 1;
    squash();
    arrive(0, false, "done");
    loopN = 1;
    cycleBusy = true;
    for (const step of cycleSteps(loopN)) {
      after(step.at, () => {
        if (step.kind === "visit") visit(step.layer, step.error);
        else if (step.kind === "home") home();
      });
    }
  };

  const placeBall = (): void => {
    if (!ball) return;
    const b = ball;
    const R = entryCfg.R;
    rider.style.transform = `translate(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px)`;
    const cx = -b.nx * R;
    const cy = -b.ny * R;
    const a = Math.atan2(b.nx, -b.ny);
    const q = b.q;
    const dir = Math.atan2(b.vy, b.vx);
    const pressed = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px) rotate(${a.toFixed(3)}rad) scale(${(1 + q * 0.7).toFixed(3)}, ${(1 - q).toFixed(3)}) rotate(${(-a).toFixed(3)}rad) translate(${(-cx).toFixed(1)}px, ${(-cy).toFixed(1)}px)`;
    const stretched = `rotate(${dir.toFixed(3)}rad) scale(${(1 + b.s).toFixed(3)}, ${(1 / (1 + b.s)).toFixed(3)}) rotate(${(-dir).toFixed(3)}rad)`;
    inner.style.transform = `${pressed} ${stretched}`;
    inner.style.setProperty("--gscale", b.gscale.toFixed(3));
    svg.style.setProperty("--roll", `${b.roll.toFixed(1)}deg`);
    const lookDir = lookAhead(b);
    look(lookDir.x, lookDir.y);
  };

  const endBall = (): void => {
    ball = null;
    mode = "rail";
    gscale = 1;
    inner.style.transform = "";
    svg.classList.remove("is-squint", "is-wide");
    trail = [];
    trailPath?.setAttribute("d", "");
    for (const el of letterEls) {
      el.style.transform = "";
      el.classList.remove("is-tramp");
    }
    for (const spring of springs) {
      spring.y = 0;
      spring.v = 0;
    }
    springsLive = false;
  };

  const launch = (): void => {
    if (!cam) {
      launchQueued = false;
      return;
    }
    const st = stations(cfg, cam, zs, scale);
    const s0 = st[1]; // estação 0 (tokens)
    if (!s0) {
      launchQueued = false;
      return;
    }
    measure();
    if (letters.length === 0) {
      landStation();
      syncSource();
      return;
    }
    const src = findSource();
    const stageRect = stage.getBoundingClientRect();
    const srcRect = src?.getBoundingClientRect();
    const from: Point = srcRect
      ? {
          x: srcRect.left + srcRect.width / 2 - stageRect.left,
          y: srcRect.top + srcRect.height / 2 - stageRect.top,
        }
      : { x: origin.x, y: origin.y - 200 };

    const topLayer = layers[2];
    let pilePoint: Point;
    if (topLayer) {
      const r = topLayer.getBoundingClientRect();
      pilePoint = {
        x: r.left + r.width * 0.5 - stageRect.left,
        y: r.top + r.height * 0.35 - stageRect.top,
      };
    } else {
      const p = project(cam, cfg.s * 2 + cfg.lw / 2, -cfg.s * 2 + cfg.lh / 2, zs[2] ?? cfg.Z0);
      pilePoint = computePileContact(p, entryCfg.R);
    }

    const stationPoint: Point = { x: s0.x, y: s0.y };
    const segs = createEntrySegments({
      cfg: entryCfg,
      start: from,
      letters,
      pilePoint,
      stationPoint,
      stageTop: 0,
    });

    if (segs.length === 0) {
      landStation();
      syncSource();
      return;
    }

    trail = [];
    lastPos = null;
    mode = "ball";
    const srcScale = srcRect && srcRect.width > 0 ? Math.max(0.2, srcRect.width / cfg.gs) : 1;
    gscale = srcScale;
    ball = {
      x: from.x,
      y: from.y,
      vx: segs[0].vx,
      vy: segs[0].vy,
      segs,
      i: 0,
      t: 0,
      w: 0,
      roll: 0,
      q: 0,
      qv: 0,
      nx: 0,
      ny: -1,
      s: 0,
      scale: srcScale,
      gscale: srcScale,
      done: false,
      cfg: entryCfg,
    };
    syncSource();
    setMood("idle");
    setHud("air", { kind: "to", layer: -1 });
    placeBall();
  };

  const prelaunch = (): void => {
    const src = findSource();
    if (src && typeof src.animate === "function") {
      src.animate(
        [
          { transform: "scale(1, 1)" },
          { transform: "scale(1.22, 0.74)" },
          { transform: "scale(1, 1)" },
        ],
        { duration: 180, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
      );
    }
    after(PRELAUNCH_MS, launch);
  };

  const pushTrail = (p: Point): void => {
    trail.push({ x: p.x, y: p.y, t: simT });
    if (trail.length > TRAIL_MAX) trail.shift();
  };

  const trailLifeS = (): number => (desktopQuery.matches ? 0.32 : 0.19);

  const drawTrail = (): void => {
    if (!trailPath) return;
    const life = trailLifeS();
    trail = trail.filter(p => simT - p.t < life);
    if (trail.length < 2) {
      if (trailPath.getAttribute("d")) trailPath.setAttribute("d", "");
      return;
    }
    const w0 = (cfg.gs / 2) * 0.9;
    const pts = trail;
    const last = pts.length - 1;
    const left: string[] = [];
    const right: string[] = [];
    for (let i = last; i >= 0; i -= 1) {
      const p = pts[i];
      const a = pts[Math.min(last, i + 1)];
      const b = pts[Math.max(0, i - 1)];
      if (!p || !a || !b) continue;
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      const len = Math.hypot(dx, dy) || 1;
      dx /= len;
      dy /= len;
      const f = Math.min(1, (simT - p.t) / life);
      const h = (w0 / 2) * (1 - f) ** 0.9;
      left.push(`${(p.x - dy * h).toFixed(1)},${(p.y + dx * h).toFixed(1)}`);
      right.push(`${(p.x + dy * h).toFixed(1)},${(p.y - dx * h).toFixed(1)}`);
    }
    trailPath.setAttribute("d", `M${left.join("L")}L${right.reverse().join("L")}Z`);
  };

  const stepLetters = (dt: number): void => {
    if (!springsLive) return;
    const settled = stepLetterSprings(springs, dt);
    springs.forEach((spring, i) => {
      const el = letterEls[i];
      if (el) el.style.transform = spring.y === 0 ? "" : `translateY(${spring.y.toFixed(2)}px)`;
    });
    springsLive = !settled;
  };

  // ---------- Laço ----------

  const readScroll = (): number => {
    if (reduced) return 0;
    const top = stage.getBoundingClientRect().top;
    return scrollProgress(Math.max(0, -top), stage.offsetHeight);
  };

  const step = (dt: number, now: number): void => {
    const scroll = readScroll();
    simT += dt;
    tilt.x = approach(tilt.x, tilt.tx, 5, dt);
    tilt.y = approach(tilt.y, tilt.ty, 5, dt);
    applyCamera(scroll);
    const e = 1 - (cam?.fade ?? 1);
    stepSprings(open, vel, Math.max(openAuto, openPtr) * (1 - e), dt);
    for (let i = 0; i < LAYER_COUNT; i += 1) {
      lift[i] = approach(lift[i] ?? 0, i === hover ? HOVER_LIFT : 0, 10, dt);
    }
    renderLayers();

    if (ball) {
      const r = stepPath(ball, dt);
      roll = ball.roll % 360;
      if (r.hit) {
        if (r.hit.type === "letter") {
          dipLetters(springs, letters, r.hit.index ?? 0, r.hit.vi);
          springsLive = true;
          squint();
        } else if (r.hit.type === "dot") {
          dipLetters(springs, letters, r.hit.index ?? letters.length - 1, r.hit.vi * 2);
          springsLive = true;
          const dotEl = letterEls[r.hit.index ?? letterEls.length - 1];
          if (dotEl) restartClass(dotEl, "is-tramp");
          svg.classList.remove("is-squint");
          svg.classList.add("is-wide");
        } else if (r.hit.type === "pile") {
          hitPile();
        } else if (r.hit.type === "land") {
          landStation();
        }
      }
      if (ball) {
        pushTrail(ball);
        placeBall();
      }
    } else if (activeRide) {
      activeRide.t += dt;
      const res = stepHop(activeRide.ride, activeRide.t, entryCfg.g, cfg.hopX);
      rp = res.rp;
      jumpY = res.jumpY;
      hopX = res.hopX;
      inner.style.transform = `scale(${(1 - 0.1 * res.stretch).toFixed(3)}, ${(1 + 0.14 * res.stretch).toFixed(3)})`;
      if (res.done) {
        const done = activeRide.done;
        activeRide = null;
        rp = res.rp;
        jumpY = 0;
        hopX = 0;
        inner.style.transform = "";
        squash();
        done?.();
      }
    }

    stepLetters(dt);
    drawTrail();
    if (jumpV !== 0 || jumpY > 0) {
      jumpV -= GRAVITY * dt;
      jumpY += jumpV * dt;
      if (jumpY <= 0) {
        jumpY = 0;
        jumpV = 0;
        squash();
      }
    }
    if (gscale < 1) gscale = Math.min(1, approach(gscale, 1.001, GROW_RATE, dt));
    drawLine(dt);
    if (mode !== "seat") placeSeat();
    if (now - hudAt > HUD_STEP_MS) {
      hudAt = now;
      writeHud();
    }
  };

  const frame = (now: number): void => {
    raf = 0;
    if (!running) return;
    const dt = Math.min(MAX_DT_S, (now - last) / 1000 || 0.016);
    last = now;
    step(dt, now);
    raf = requestAnimationFrame(frame);
  };

  const loaderOn = (): boolean => document.documentElement.hasAttribute(LOADER_ATTR);

  const queueLaunch = (ms: number): void => {
    if (mode !== "seat" || launchQueued || loaderOn()) return;
    launchQueued = true;
    after(ms, prelaunch);
  };

  const onLoader = (): void => {
    if (running) queueLaunch(LAUNCH_AFTER_LOADER_MS);
  };

  const resume = (): void => {
    clearTimers();
    hideTags();
    activeRide = null;
    jumpY = 0;
    hopX = 0;
    spinVel = 0;
    lastPos = null;
    inner.classList.remove("is-crouch");
    inner.style.transform = "";
    for (const n of layers) n.classList.remove("is-fire", "is-fresh", "is-error");
    if (mode === "seat") {
      queueLaunch(LAUNCH_MS);
    } else if (!firstCycleCompleted) {
      if (mode === "ball") endBall();
      restartCycle();
    } else {
      rp = -1;
      openAuto = 0;
      clearLinks();
      setLit(-1);
      setMood("idle");
      rest();
    }
  };

  const sync = (): void => {
    if (destroyed) return;
    syncSource();
    const should = !reduced && visible && !document.hidden;
    if (should && !running) {
      running = true;
      last = performance.now();
      resume();
      raf = requestAnimationFrame(frame);
    } else if (!should && running) {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
      clearTimers();
    }
  };

  const renderStill = (): void => {
    mode = "rail";
    rp = -1;
    for (let i = 0; i < LAYER_COUNT; i += 1) open[i] = STILL_OPEN;
    layout(0);
    renderLayers();
    drawLine();
    setLit(-1);
    for (let i = 0; i < LAYER_COUNT; i += 1) showTag(i);
    setMood("idle");
    syncSource();
    setHud("idle", { kind: "floor" });
  };

  // ---------- Ponteiro ----------

  const local = (e: PointerEvent | MouseEvent): Point => {
    const r = stage.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const overCopy = (e: Event): boolean =>
    e.target instanceof Element &&
    e.target.closest(".hb-copy, .hb-foot, .hb-top, .hb-hud") !== null;

  const setHover = (i: number): void => {
    if (i === hover) return;
    layers[hover]?.classList.remove("is-hover");
    hover = i;
    layers[i]?.classList.add("is-hover");
    const at = Math.round(rp);
    setLit(i >= 0 ? i : !activeRide && at >= 0 && Math.abs(rp - at) < 0.01 ? at : -1);
  };

  const onMove = (e: PointerEvent): void => {
    if (e.pointerType !== "mouse" || !cam || mode === "seat") return;
    if (overCopy(e)) {
      openPtr = 0;
      setHover(-1);
      return;
    }
    const p = local(e);
    const c = stackCenter(cfg, cam, zs);
    openPtr = pointerOpen(Math.hypot(p.x - c.x, p.y - c.y));
    const w2 = stage.clientWidth / 2;
    const h2 = stage.clientHeight / 2;
    tilt.tx = w2 > 0 ? Math.max(-1, Math.min(1, (p.x - c.x) / w2)) : 0;
    tilt.ty = h2 > 0 ? Math.max(-1, Math.min(1, (p.y - c.y) / h2)) : 0;
    setHover(hitLayer(cfg, cam, zs, p));
    if (
      openPtr > 0.6 &&
      !cycleBusy &&
      mode === "rail" &&
      !activeRide &&
      performance.now() - restAt > 1500
    ) {
      runCycle();
    }
  };

  const onLeave = (): void => {
    openPtr = 0;
    tilt.tx = 0;
    tilt.ty = 0;
    setHover(-1);
  };

  const onClick = (e: MouseEvent): void => {
    if (!cam || mode !== "rail" || !running) return;
    if (e.target instanceof Element && e.target.closest("a, button")) return;
    if (overCopy(e)) return;
    const i = hitLayer(cfg, cam, zs, local(e));
    if (i < 0) return;
    clearTimers();
    activeRide = null;
    jumpY = 0;
    hopX = 0;
    openAuto = 1;
    visit(i, false);
    cycleBusy = true;
    after(CLICK_RETURN_MS, () => home());
  };

  const onHop = (): void => {
    if (reduced || mode !== "rail" || jumpY > 0 || activeRide) return;
    jumpV = HOP_SPEED;
    if (!running) jumpV = 0;
  };

  const onResize = (): void => {
    if (reduced) renderStill();
    else layout(readScroll());
    if (mode === "ball") {
      measure();
    }
  };

  const onVariant = (): void => {
    entryCfg = desktopQuery.matches ? DESKTOP_ENTRY_PATH : MOBILE_ENTRY_PATH;
    const next = desktopQuery.matches ? DESKTOP_STACK : MOBILE_STACK;
    if (next === cfg) return;
    cfg = next;
    if (source) source.style.opacity = "";
    source = null;
    if (mode === "ball") {
      endBall();
      if (running) restartCycle();
    }
    onResize();
    syncSource();
  };

  const start = (): void => {
    for (const n of layers) n.classList.remove("is-fire", "is-fresh", "is-error", "is-hover");
    clearLinks();
    setLit(-1);
    hideTags();
    setMood("idle");
    look(0, 0);
    stage.classList.toggle("is-still", reduced);
    if (reduced) {
      renderStill();
    } else {
      layout(readScroll());
      renderLayers();
      drawLine();
      setHud("idle", { kind: "none" });
    }
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("click", onClick);
    rider.addEventListener("click", onHop);
    window.addEventListener("resize", onResize);
    desktopQuery.addEventListener("change", onVariant);
    document.addEventListener("visibilitychange", sync);
    ro = new ResizeObserver(onResize);
    ro.observe(stage);
    io = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      sync();
    });
    io.observe(stage);
    mo = new MutationObserver(onLoader);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: [LOADER_ATTR] });
    document.fonts?.ready.then(() => {
      if (!destroyed) measure();
    });
    sync();
  };

  const relabel = (): void => {
    writeHud();
    if (mode === "ball" || springsLive) measure();
  };

  const destroy = (): void => {
    if (mode === "ball") endBall();
    destroyed = true;
    running = false;
    cancelAnimationFrame(raf);
    clearTimers();
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerleave", onLeave);
    stage.removeEventListener("click", onClick);
    rider.removeEventListener("click", onHop);
    window.removeEventListener("resize", onResize);
    desktopQuery.removeEventListener("change", onVariant);
    document.removeEventListener("visibilitychange", sync);
    io?.disconnect();
    ro?.disconnect();
    mo?.disconnect();
    if (source) source.style.opacity = "";
  };

  return { start, relabel, destroy };
}

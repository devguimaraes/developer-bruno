import type { MutableRefObject, RefObject } from "react";
import { useEffect, useRef } from "react";
import type { Camera, Point, StackConfig, StackMood, Station } from "./stack";
import {
  approach,
  cycleSteps,
  DESKTOP_STACK,
  easeInOutCubic,
  FIRE_DELAY_MS,
  FLIGHT_S,
  flightAt,
  hitLayer,
  LAYER_COUNT,
  layerHeights,
  layoutScale,
  MOBILE_STACK,
  makeCamera,
  pointerOpen,
  rideDuration,
  riderAt,
  scrollProgress,
  stackCenter,
  stackOrigin,
  stations,
  stepSprings,
  visitBeats,
} from "./stack";

const DESKTOP_QUERY = "(min-width: 768px)";
// Origem do lançamento: a assinatura no cabeçalho (computador) ou a aba do Giro (celular).
const SOURCE_DESKTOP = "[data-site-header] .g-signature__o .g-giro";
const SOURCE_MOBILE = ".g-tabbar__giro .g-giro";
const LAUNCH_MS = 1000;
// Com a tela de carregamento, o Giro sai logo depois que a assinatura pousa e o loader some.
const LAUNCH_AFTER_LOADER_MS = 300;
const LOADER_ATTR = "data-loader";
const LOOP_AFTER_LAND_MS = 350;
const CLICK_RETURN_MS = 3200;
const CLICK_RESTART_MS = 1400;
const STILL_OPEN = 0.72;
const HOVER_LIFT = 14;
const HOP_SPEED = 560;
const GRAVITY = 2200;
const HUD_STEP_MS = 200;
const MAX_DT_S = 0.05;

export type HudMood = StackMood | "air";

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

type Mode = "seat" | "fly" | "rail";
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
  const desktopQuery = window.matchMedia(DESKTOP_QUERY);

  let cfg: StackConfig = desktopQuery.matches ? DESKTOP_STACK : MOBILE_STACK;
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
  let ride: { from: number; to: number; t: number; T: number; done?: () => void } | null = null;
  let fly: { from: Point; t: number } | null = null;
  let jumpY = 0;
  let jumpV = 0;
  let roll = 0;
  let gscale = 1;
  let lastPos: Point | null = null;
  let loopN = 0;
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

  const setHud = (mood: HudMood | null, layer?: HudLayer): void => {
    if (mood) hud.mood = mood;
    if (layer) hud.layer = layer;
    writeHud();
  };

  // ---------- Giro ----------

  const look = (x: number, y: number): void => {
    svg.style.setProperty("--g-look-x", `${x.toFixed(1)}px`);
    svg.style.setProperty("--g-look-y", `${y.toFixed(1)}px`);
  };

  // Na estação o Giro olha para a esquerda, para a camada que ele acabou de acender.
  const setMood = (mood: StackMood, watch = false): void => {
    svg.setAttribute("data-state", mood);
    svg.classList.remove("is-hop");
    if (mood === "done") restartClass(svg, "is-hop");
    if (mood === "curious") {
      look(-6, -1);
      svg.style.setProperty("--g-tilt", "-7deg");
    } else {
      svg.style.setProperty("--g-tilt", "0deg");
      look(watch ? -5 : 0, 0);
    }
    if (mode !== "seat") setHud(mood);
  };

  const squash = (): void => restartClass(inner, "is-squash");

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

  const drawLine = (): void => {
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
    if (mode === "seat") return;
    const start = st[0];
    const pos =
      fly && start
        ? flightAt(fly.from, start, Math.min(1, fly.t / FLIGHT_S), cfg.arc)
        : riderAt(st, rp);
    if (lastPos) roll += (pos.y - lastPos.y) * -2.4 + (pos.x - lastPos.x) * 1.2;
    lastPos = pos;
    rider.style.transform = `translate(${pos.x.toFixed(1)}px, ${(pos.y - jumpY).toFixed(1)}px)`;
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

  const startRide = (to: number, done?: () => void): void => {
    clearLinks();
    setMood("idle");
    look(0, to > rp ? -4 : 4);
    ride = { from: rp, to, t: 0, T: rideDuration(rp, to), done };
    setHud(null, to < 0 ? { kind: "to", layer: -1 } : { kind: "to", layer: to });
  };

  const fire = (i: number, error: boolean): void => {
    const n = layers[i];
    if (!n) return;
    restartClass(n, "is-fire", "is-fresh");
    if (i === 1) n.classList.toggle("is-error", error);
  };

  // Na estação, o Giro olha para a camada, o sinal corre pela ligação e a camada dispara.
  const visit = (i: number, error: boolean): void => {
    if (mode !== "rail") return;
    startRide(i, () => {
      setLit(i);
      const link = links.get(i);
      if (link) restartClass(link, "is-live");
      setHud(null, { kind: "at", layer: i });
      after(FIRE_DELAY_MS, () => fire(i, error));
      for (const beat of visitBeats(i, error)) {
        const run = (): void => {
          if (beat.clearError) layers[1]?.classList.remove("is-error");
          setMood(beat.mood, beat.watch === true);
        };
        if (beat.at === 0) run();
        else after(beat.at, run);
      }
    });
  };

  const home = (done?: () => void): void => {
    startRide(-1, () => {
      openAuto = 0;
      setLit(hover);
      setHud("idle", { kind: "floor" });
      done?.();
    });
  };

  // Um ciclo: a pilha abre, o Giro sobe a linha parando em cada estação, volta e a pilha fecha.
  const loop = (): void => {
    loopN += 1;
    openAuto = 0;
    for (const step of cycleSteps(loopN)) {
      after(step.at, () => {
        if (step.kind === "open") openAuto = 1;
        else if (step.kind === "visit") visit(step.layer, step.error);
        else if (step.kind === "home") home();
        else loop();
      });
    }
  };

  const landed = (): void => {
    fly = null;
    mode = "rail";
    rp = -1;
    squash();
    setHud("idle", { kind: "floor" });
    after(LOOP_AFTER_LAND_MS, loop);
  };

  const launch = (): void => {
    const src = findSource();
    const o = stage.getBoundingClientRect();
    const b = src?.getBoundingClientRect();
    const from = b
      ? { x: b.left + b.width / 2 - o.left, y: b.top + b.height / 2 - o.top }
      : { x: origin.x, y: origin.y - 200 };
    mode = "fly";
    lastPos = null;
    gscale = b && b.width > 0 ? Math.max(0.2, b.width / cfg.gs) : 1;
    fly = { from, t: 0 };
    syncSource();
    setHud("air", { kind: "none" });
  };

  // ---------- Laço ----------

  const readScroll = (): number => {
    if (reduced) return 0;
    const top = stage.getBoundingClientRect().top;
    return scrollProgress(Math.max(0, -top), stage.offsetHeight);
  };

  const step = (dt: number, now: number): void => {
    const scroll = readScroll();
    tilt.x = approach(tilt.x, tilt.tx, 5, dt);
    tilt.y = approach(tilt.y, tilt.ty, 5, dt);
    applyCamera(scroll);
    // Abertura: uma mola por camada, as de cima mais rápidas, então abre em cascata.
    const e = 1 - (cam?.fade ?? 1);
    stepSprings(open, vel, Math.max(openAuto, openPtr) * (1 - e), dt);
    for (let i = 0; i < LAYER_COUNT; i += 1) {
      lift[i] = approach(lift[i] ?? 0, i === hover ? HOVER_LIFT : 0, 10, dt);
    }
    renderLayers();
    if (fly) {
      fly.t += dt;
      if (fly.t >= FLIGHT_S) landed();
    } else if (ride) {
      const m = ride;
      m.t += dt;
      const u = Math.min(1, m.t / m.T);
      rp = m.from + (m.to - m.from) * easeInOutCubic(u);
      if (u >= 1) {
        ride = null;
        rp = m.to;
        squash();
        m.done?.();
      }
    }
    if (jumpV !== 0 || jumpY > 0) {
      jumpV -= GRAVITY * dt;
      jumpY += jumpV * dt;
      if (jumpY <= 0) {
        jumpY = 0;
        jumpV = 0;
        squash();
      }
    }
    if (gscale < 1) gscale = Math.min(1, gscale + dt * 2.4);
    drawLine();
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

  // Enquanto a tela de carregamento está de pé, o lançamento espera o atributo sair.
  const queueLaunch = (ms: number): void => {
    if (mode !== "seat" || launchQueued || loaderOn()) return;
    launchQueued = true;
    after(ms, launch);
  };

  const onLoader = (): void => {
    if (running) queueLaunch(LAUNCH_AFTER_LOADER_MS);
  };

  // Ao voltar para a tela, o ciclo recomeça do chão em vez de retomar timers pela metade.
  const resume = (): void => {
    clearTimers();
    ride = null;
    lastPos = null;
    // Uma pausa no meio de uma batida cancelou o timer que limparia a camada.
    for (const n of layers) n.classList.remove("is-fire", "is-fresh", "is-error");
    if (mode === "seat") {
      queueLaunch(LAUNCH_MS);
    } else {
      if (fly) {
        fly = null;
        mode = "rail";
      }
      rp = -1;
      openAuto = 0;
      clearLinks();
      setLit(-1);
      setMood("idle");
      setHud("idle", { kind: "floor" });
      after(LOOP_AFTER_LAND_MS, loop);
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

  // Movimento reduzido: a pilha meio aberta, parada, com o Giro na estação de partida.
  const renderStill = (): void => {
    mode = "rail";
    rp = -1;
    for (let i = 0; i < LAYER_COUNT; i += 1) open[i] = STILL_OPEN;
    layout(0);
    renderLayers();
    drawLine();
    setLit(-1);
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
    setLit(i >= 0 ? i : !ride && at >= 0 && Math.abs(rp - at) < 0.01 ? at : -1);
  };

  // Ponteiro fino: chegar perto abre a pilha, a posição inclina a câmera e a camada sob ele sobe.
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
    tilt.tx = Math.max(-1, Math.min(1, (p.x - c.x) / (stage.clientWidth / 2)));
    tilt.ty = Math.max(-1, Math.min(1, (p.y - c.y) / (stage.clientHeight / 2)));
    setHover(hitLayer(cfg, cam, zs, p));
  };

  const onLeave = (): void => {
    openPtr = 0;
    tilt.tx = 0;
    tilt.ty = 0;
    setHover(-1);
  };

  // Clique numa camada: o Giro vai até a estação dela e o ciclo recomeça depois.
  const onClick = (e: MouseEvent): void => {
    if (!cam || mode !== "rail" || !running) return;
    if (e.target instanceof Element && e.target.closest("a, button")) return;
    if (overCopy(e)) return;
    const i = hitLayer(cfg, cam, zs, local(e));
    if (i < 0) return;
    clearTimers();
    ride = null;
    openAuto = 1;
    visit(i, false);
    after(CLICK_RETURN_MS, () => home(() => after(CLICK_RESTART_MS, loop)));
  };

  const onHop = (): void => {
    if (reduced || mode !== "rail" || jumpY > 0) return;
    jumpV = HOP_SPEED;
    // Sem laço rodando não há quem desça o Giro.
    if (!running) jumpV = 0;
  };

  const onResize = (): void => {
    if (reduced) renderStill();
    else layout(readScroll());
  };

  const onVariant = (): void => {
    const next = desktopQuery.matches ? DESKTOP_STACK : MOBILE_STACK;
    if (next === cfg) return;
    cfg = next;
    if (source) source.style.opacity = "";
    source = null;
    onResize();
    syncSource();
  };

  const start = (): void => {
    for (const n of layers) n.classList.remove("is-fire", "is-fresh", "is-error", "is-hover");
    clearLinks();
    setLit(-1);
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
    sync();
  };

  const relabel = (): void => writeHud();

  const destroy = (): void => {
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

import { motion } from "framer-motion";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { Giro } from "@/components/brand/Giro";
import { type GiroState, playGiroMoment } from "@/components/brand/giro-states";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { t } from "@/lib/i18n";
import { claimFirstVisit } from "./loader-flag";
import { waitForFirstPaint } from "./ready";

// Coreografia do estudo (motion/SPEC.md), adaptada para camadas (issue #104).
// O relógio só começa quando a Anybody cumpre document.fonts.load.
// Até lá o Giro gira sozinho. O tamanho é a variante A.
const READY_MS = 2560;
const EXIT_MS = 2780;
const SMILE_MS = EXIT_MS - READY_MS;
const FLIGHT_MS = 780;
const FADE_MS = 360;
const REDUCED_HOLD_MS = 600;
const UNFOLD_START = 120;
const STAGGER_MS = 53;
const FLIGHT_EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const DESKTOP_MIN_WIDTH = 768;
const LOADER_ATTR = "data-loader";
const HERO_GIRO = ".hb-rider";
const ANYBODY_SPEC = '800 16px "Anybody"';
// O desdobramento termina aos 1197 ms. O centro do Giro é medido aos 1140 ms, antes do 1º disco (1200 ms).
const DISK_ORIGIN_MS = 1140;
const LEFT = ["b", "r", "u", "n"] as const;
const RIGHT = ["g", "u", "i", "m", "a", "r", "ã", "e", "s"] as const;

type Phase = "pending" | "wait" | "play" | "still" | "exit" | "fading" | "hidden";
type Visit = "unknown" | "first" | "skip";
type Run = "wait" | "play" | "still";

type Flight = {
  x: number;
  y: number;
  scale: number;
};

type LoaderStyle = CSSProperties & { [name: `--${string}`]: string };

const REST: Flight = { x: 0, y: 0, scale: 1 };

function flightTarget(): Element | null {
  if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
    return document.querySelector("[data-site-header] .g-signature__o .g-giro");
  }
  return document.querySelector(".g-tabbar__giro .g-giro");
}

/** Deslocamento e escala do elemento voando até o alvo. Null se algum dos dois não tem área. */
function measureFlight(from: Element, to: Element): Flight | null {
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  if (a.width === 0 || b.width === 0) return null;
  return {
    x: b.left + b.width / 2 - (a.left + a.width / 2),
    y: b.top + b.height / 2 - (a.top + a.height / 2),
    scale: b.width / a.width,
  };
}

/** Solta o relógio quando a Anybody está usável. Lista vazia ou falha não prendem a página. */
async function waitForAnybody(): Promise<void> {
  const fonts = document.fonts;
  if (typeof fonts?.load !== "function") return;
  try {
    await fonts.load(ANYBODY_SPEC, "bruno guimarães");
  } catch {
    // A tela segue no fallback. Sem isso um load() rejeitado deixaria o overlay preso.
  }
}

function letterDelay(fromO: number): LoaderStyle {
  return { "--d": `${UNFOLD_START + fromO * STAGGER_MS}ms` };
}

function keyedChars(chars: readonly string[]) {
  let cursor = "";
  return chars.map(ch => {
    cursor += ch;
    return { ch, key: cursor, place: cursor.length };
  });
}

function NameSides({ mark }: { mark: ReactNode }) {
  return (
    <span className="g-loader__row">
      <span className="g-loader__left">
        {LEFT.map((ch, index) => (
          <span key={ch} className="g-loader__lt" style={letterDelay(LEFT.length - 1 - index)}>
            {ch}
          </span>
        ))}
      </span>
      {mark}
      <span className="g-loader__right">
        <span className="g-loader__gap g-loader__lt" style={letterDelay(0)}>
          {"\u00a0"}
        </span>
        {keyedChars(RIGHT).map(({ ch, key, place }) => (
          <span key={key} className="g-loader__lt" style={letterDelay(place)}>
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}

export function LoadingScreen() {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const [visit, setVisit] = useState<Visit>("unknown");
  const [phase, setPhase] = useState<Phase>("pending");
  const [face, setFace] = useState<GiroState>("loading");
  const [nameFlight, setNameFlight] = useState<Flight>(REST);
  const [giroFlight, setGiroFlight] = useState<Flight>(REST);
  const [origin, setOrigin] = useState("center");
  const [waving, setWaving] = useState(false);
  const nameRef = useRef<HTMLDivElement>(null);
  const giroRef = useRef<HTMLSpanElement>(null);
  const layersRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<Element | null>(null);
  const started = useRef(false);
  const mode = useRef<Run>("wait");
  const leftStage = useRef(false);
  const stop = useRef(false);

  useEffect(() => {
    setVisit(claimFirstVisit() ? "first" : "skip");
  }, []);

  // A marca só pode ser lida uma vez. Se o efeito rodasse de novo, a segunda chamada esconderia
  // a tela no meio da coreografia.
  useEffect(() => {
    if (visit === "skip") setPhase("hidden");
  }, [visit]);

  useEffect(() => {
    if (visit !== "first" || started.current) return;
    // O hook nasce false na hidratação e só lê o sistema depois. A trava não pode esperar isso,
    // senão a coreografia começa e o movimento reduzido nunca entra.
    const reduced = reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    started.current = true;
    setPhase(reduced ? "still" : "wait");
  }, [visit, reducedMotion]);

  useEffect(() => {
    if (phase === "hidden") {
      document.documentElement.removeAttribute(LOADER_ATTR);
      return;
    }
    if (phase === "pending") return;
    const showExit = phase === "exit" || (phase === "fading" && leftStage.current);
    document.documentElement.setAttribute(LOADER_ATTR, showExit ? "exit" : "mounted");
  }, [phase]);

  useEffect(() => {
    return () => document.documentElement.removeAttribute(LOADER_ATTR);
  }, []);

  useEffect(() => {
    if (phase !== "wait") return;
    let cancelled = false;
    void waitForAnybody().then(() => {
      if (!cancelled && !stop.current) setPhase("play");
    });
    return () => {
      cancelled = true;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return;
    const timer = setTimeout(() => {
      const mark = giroRef.current;
      const layers = layersRef.current;
      if (!mark || !layers) return;
      const o = mark.getBoundingClientRect();
      const root = layers.getBoundingClientRect();
      if (o.width === 0) return;
      const ox = `${o.left + o.width / 2 - root.left}px`;
      const oy = `${o.top + o.height / 2 - root.top}px`;
      for (const node of [layers, inkRef.current]) {
        node?.style.setProperty("--g-ox", ox);
        node?.style.setProperty("--g-oy", oy);
      }
    }, DISK_ORIGIN_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "play" && phase !== "wait" && phase !== "still") return;
    const skip = (event: Event) => {
      if (event.type === "wheel" || event.type === "touchmove") {
        if (event.cancelable) event.preventDefault();
      }
      stop.current = true;
      if (phase === "still") {
        setPhase("fading");
        return;
      }
      setFace("done");
      setPhase("exit");
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: false });
    window.addEventListener("touchmove", skip, { passive: false });
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
    };
  }, [phase]);

  // Com a página pronta no começo, o sorriso entra aos 2560 ms e a saída aos 2780 ms. Se a página
  // demora, o Giro segue em loading e a saída espera 220 ms depois que os dois estão prontos.
  useEffect(() => {
    if (phase !== "play") return;
    let pageReady = false;
    let clockReady = false;
    let leaving = false;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const later = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    const smileAndLeave = () => {
      if (leaving || cancelled || stop.current) return;
      leaving = true;
      setFace("done");
      later(() => {
        if (!cancelled) setPhase("exit");
      }, SMILE_MS);
    };

    later(() => {
      clockReady = true;
      if (pageReady) smileAndLeave();
    }, READY_MS);

    void waitForFirstPaint().then(() => {
      if (cancelled) return;
      pageReady = true;
      if (clockReady) smileAndLeave();
    });

    return () => {
      cancelled = true;
      for (const timer of timers) clearTimeout(timer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "still") return;
    let pageReady = false;
    let held = false;
    let gone = false;
    const fade = () => {
      if (!gone && pageReady && held) {
        gone = true;
        setPhase("fading");
      }
    };
    const timer = setTimeout(() => {
      held = true;
      fade();
    }, REDUCED_HOLD_MS);
    void waitForFirstPaint().then(() => {
      pageReady = true;
      fade();
    });
    return () => {
      gone = true;
      clearTimeout(timer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "exit") return;
    const desktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
    const name = nameRef.current;
    const mark = giroRef.current;
    const target = flightTarget();
    const measured = !desktop && mark && target ? measureFlight(mark, target) : null;
    if (!mark || !target || (desktop ? !name : !measured)) {
      setPhase("fading");
      return;
    }
    targetRef.current = target;
    if (desktop && name) {
      const nameBox = name.getBoundingClientRect();
      const oBox = mark.getBoundingClientRect();
      const targetBox = target.getBoundingClientRect();
      if (oBox.width === 0 || targetBox.width === 0) {
        setPhase("fading");
        return;
      }
      const oCx = oBox.left + oBox.width / 2;
      const oCy = oBox.top + oBox.height / 2;
      setOrigin(`${oCx - nameBox.left}px ${oCy - nameBox.top}px`);
      setNameFlight({
        x: targetBox.left + targetBox.width / 2 - oCx,
        y: targetBox.top + targetBox.height / 2 - oCy,
        scale: targetBox.width / oBox.width,
      });
    } else if (measured) {
      setGiroFlight(measured);
    }
    const timer = setTimeout(() => {
      const landed = targetRef.current;
      const shown =
        landed !== null &&
        document.querySelector(HERO_GIRO) === null &&
        getComputedStyle(landed).opacity !== "0";
      setWaving(shown);
      if (landed && shown) playGiroMoment(landed, "hello");
      setPhase("fading");
    }, FLIGHT_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "fading") return;
    const timer = setTimeout(() => setPhase("hidden"), FADE_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "play" || phase === "still") mode.current = phase;
  if (phase === "exit") leftStage.current = true;
  if (phase === "hidden" || visit === "skip") return null;

  const showExit = phase === "exit" || (phase === "fading" && leftStage.current);
  const run: Run =
    phase === "play" || phase === "still"
      ? phase
      : phase === "fading" && mode.current === "still"
        ? "still"
        : showExit
          ? mode.current
          : "wait";
  const giroFace: GiroState = phase === "still" || mode.current === "still" ? "idle" : face;

  return (
    <motion.div
      className="g-azul g-loader"
      role="status"
      data-run={run}
      data-exit={showExit ? "1" : undefined}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "fading" ? 0 : 1 }}
      transition={{ duration: FADE_MS / 1000 }}
    >
      <div ref={layersRef} className="g-loader__layers" aria-hidden="true">
        <div className="g-loader__layer g-loader__layer--azul" />
        <div className="g-loader__layer g-loader__layer--lima">
          <span className="g-loader__layer-tag g-loader__tag">{`// ${t(locale, "hero.layer.tokens")}`}</span>
        </div>
        <div className="g-loader__layer g-loader__layer--papel">
          <span className="g-loader__layer-tag g-loader__tag">{`// ${t(locale, "hero.layer.components")}`}</span>
        </div>
        <div className="g-loader__layer g-loader__layer--tinta">
          <span className="g-loader__layer-tag g-loader__tag">{`// ${t(locale, "hero.layer.screen")}`}</span>
        </div>
      </div>
      <div className="g-loader__stage" aria-hidden="true">
        <motion.div
          ref={nameRef}
          className="g-loader__name"
          initial={false}
          animate={nameFlight}
          transition={{ duration: FLIGHT_MS / 1000, ease: FLIGHT_EASE }}
          style={{ transformOrigin: origin }}
        >
          <NameSides
            mark={
              <span className="g-loader__o">
                <motion.span
                  ref={giroRef}
                  className="g-loader__fly"
                  initial={false}
                  animate={giroFlight}
                  transition={{ duration: FLIGHT_MS / 1000, ease: FLIGHT_EASE }}
                  style={{ transformOrigin: "center" }}
                >
                  <Giro
                    state={giroFace}
                    signature
                    hop={face === "done"}
                    moment={waving ? "hello" : undefined}
                  />
                </motion.span>
                <span className="g-loader__sel">
                  <span className="g-loader__tag">{"<Giro />"}</span>
                  <span className="g-loader__hd" />
                  <span className="g-loader__hd" />
                  <span className="g-loader__hd" />
                  <span className="g-loader__hd" />
                </span>
              </span>
            }
          />
        </motion.div>
      </div>
      <div ref={inkRef} className="g-loader__ink" aria-hidden="true">
        <div className="g-loader__name">
          <NameSides mark={<span className="g-loader__o" />} />
        </div>
      </div>
      <span className="g-sr">{t(locale, "loader.label")}</span>
    </motion.div>
  );
}

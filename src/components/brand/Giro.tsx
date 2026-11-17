import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  CIRCUMFERENCE,
  FINISH_EASING,
  loadingPose,
  RESOLVE_EASING,
  spinFinish,
} from "./giro-motion";
import { GIRO_MOMENT_EVENT, type GiroMoment, type GiroState, isGiroMoment } from "./giro-states";

// Alcance dos olhos no curioso (unidades do quadro) e a inclinação máxima que ele rende.
const MAX_LOOK = 6;
const MAX_TILT_DEG = 8;
const DASH_RESOLVE_MS = 520;
// Destinos com giro próprio no CSS: terminar a volta por cima dele faria o arco saltar no fim.
const OWN_SPIN: ReadonlySet<GiroState> = new Set(["thinking", "lost"]);
// Relógio de cada momento de uma vez só (giro.css): quando ele termina, o momento sai do svg.
const MOMENT_CLOCK = "g-moment";

// A saída do giro precisa rodar antes da pintura; no servidor não há o que medir.
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type GiroStyle = CSSProperties & { [name: `--${string}`]: string };

export interface GiroProps {
  state?: GiroState;
  /** Tamanho em px. Define o font-size; sem ele o Giro herda o do pai. */
  size?: number;
  /** Assinatura no "o" de bruno: traço 22, independente do tamanho. */
  signature?: boolean;
  /** 0 a 100. Desenha o arco de progresso a partir do topo. */
  progress?: number;
  /** Deslocamento dos olhos em px. */
  look?: { x: number; y: number };
  /** Dá o pulo do fim (classe is-hop). */
  hop?: boolean;
  /** Reação por cima do estado. Piscadela, oi e tonto tocam uma vez a cada troca; ouvindo dura enquanto
   * a prop estiver ligada. Com movimento reduzido, nenhuma toca. */
  moment?: GiroMoment;
  /** No ouvindo, o arco pulsa a cada mudança deste número. */
  pulse?: number;
  className?: string;
}

// Modificador de traço por tamanho. A classe base g-giro vai sempre junto: é ela que o CSS usa
// nos estados e dentro de avisos e botões.
function sizeClass(size: number | undefined, signature: boolean): string | undefined {
  if (signature) return "g-giro--signature";
  if (size === undefined || size >= 60) return undefined;
  if (size >= 32) return "g-giro--md";
  if (size >= 24) return "g-giro--sm";
  return "g-giro--xs";
}

/** O relógio do momento (no próprio svg, não num filho) terminou ou foi cancelado. */
function isMomentClock(event: AnimationEvent, svg: Element): boolean {
  return event.target === svg && event.animationName === MOMENT_CLOCK;
}

/** Início da animação de giro em curso, no relógio de performance.now(). */
function spinStart(spin: SVGGElement): number {
  const starts = spin
    .getAnimations()
    .map(animation => animation.startTime)
    .filter((time): time is number => typeof time === "number");
  return starts.length > 0 ? Math.min(...starts) : performance.now();
}

// Ao sair de loading o CSS tira a animação de giro e o arco voltaria a 0° num quadro. Aqui a volta
// termina a partir de onde estava, e o traço do arco fecha o ciclo no mesmo tempo. Com `dash` falso
// o destino tem transição própria do traço (sleeping, progresso) e ela fica valendo.
function finishSpin(
  spin: SVGGElement,
  arc: SVGCircleElement,
  elapsedMs: number,
  dash: boolean
): Animation[] {
  const pose = loadingPose(elapsedMs / 1000);
  const finish = spinFinish(pose);
  const timing = { duration: finish.duration, easing: FINISH_EASING };
  const animations = [
    spin.animate(
      [{ transform: `rotate(${finish.from}deg)` }, { transform: "rotate(360deg)" }],
      timing
    ),
    arc.animate(
      [{ strokeDashoffset: `${pose.offset}` }, { strokeDashoffset: `${finish.offsetTo}` }],
      timing
    ),
  ];
  if (!dash) return animations;
  // Transição de CSS vence animação na cascata: sem desligá-la, o traço saltaria para o valor novo.
  arc.style.transition = "none";
  const target = getComputedStyle(arc).strokeDasharray;
  const resolve = arc.animate(
    [{ strokeDasharray: `${pose.dash} ${CIRCUMFERENCE - pose.dash}` }, { strokeDasharray: target }],
    { duration: DASH_RESOLVE_MS, easing: RESOLVE_EASING }
  );
  // onfinish não dispara no cancel; quem cancela devolve a transição (cancelFinish).
  resolve.onfinish = () => arc.style.removeProperty("transition");
  animations.push(resolve);
  return animations;
}

export function Giro({
  state = "idle",
  size,
  signature = false,
  progress,
  look,
  hop = false,
  moment,
  pulse,
  className,
}: GiroProps) {
  const reducedMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const spinRef = useRef<SVGGElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const loadingSince = useRef<number | null>(null);
  const finishing = useRef<Animation[]>([]);

  // Estado anterior, para o CSS coreografar cada par (data-from).
  const [trail, setTrail] = useState<{ state: GiroState; from?: GiroState }>({ state });
  if (trail.state !== state) setTrail({ state, from: trail.state });
  const from = trail.state === state ? trail.from : trail.state;
  const hasProgress = progress !== undefined;

  // O momento toca de novo a cada troca da prop, ou quando outra ilha manda pelo evento.
  const [played, setPlayed] = useState<{ prop?: GiroMoment; playing?: GiroMoment }>({
    prop: moment,
    playing: moment,
  });
  if (played.prop !== moment) setPlayed({ prop: moment, playing: moment });
  const playing = played.prop === moment ? played.playing : moment;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const play = (event: Event) => {
      if (!(event instanceof CustomEvent) || !isGiroMoment(event.detail)) return;
      const next: GiroMoment = event.detail;
      setPlayed(current => ({ ...current, playing: next }));
    };
    // Relógio cancelado (svg escondido no meio) também encerra: senão o momento tocaria de novo
    // quando o Giro reaparecesse. O React 18 não tem onAnimationCancel.
    const cancel = (event: AnimationEvent) => {
      if (isMomentClock(event, svg)) setPlayed(current => ({ ...current, playing: undefined }));
    };
    svg.addEventListener(GIRO_MOMENT_EVENT, play);
    svg.addEventListener("animationcancel", cancel);
    return () => {
      svg.removeEventListener(GIRO_MOMENT_EVENT, play);
      svg.removeEventListener("animationcancel", cancel);
    };
  }, []);

  useBrowserLayoutEffect(() => {
    const spin = spinRef.current;
    const arc = arcRef.current;
    if (!spin || !arc) return;
    // Uma saída ainda em curso ficaria por cima das animações de CSS do próximo estado.
    const cancelFinish = () => {
      for (const animation of finishing.current) animation.cancel();
      finishing.current = [];
      arc.style.removeProperty("transition");
    };
    if (state === "loading") {
      cancelFinish();
      loadingSince.current = spinStart(spin);
      return;
    }
    const since = loadingSince.current;
    loadingSince.current = null;
    if (since === null || from !== "loading" || reducedMotion || OWN_SPIN.has(state)) return;
    cancelFinish();
    const dash = state !== "sleeping" && !hasProgress;
    finishing.current = finishSpin(spin, arc, performance.now() - since, dash);
  }, [state, from, reducedMotion, hasProgress]);

  const style: GiroStyle = {};
  if (size !== undefined) style.fontSize = `${size}px`;
  if (progress !== undefined) {
    const visible = (progress / 100) * CIRCUMFERENCE;
    style["--g-dash"] = `${visible} ${CIRCUMFERENCE - visible}`;
  }
  if (look) {
    style["--g-look-x"] = `${look.x}px`;
    style["--g-look-y"] = `${look.y}px`;
    // Curioso: o corpo inclina na direção do alvo, até 8° quando os olhos chegam em 6 unidades.
    if (state === "curious") {
      const ratio = Math.max(-1, Math.min(1, look.x / MAX_LOOK));
      style["--g-tilt"] = `${ratio * MAX_TILT_DEG}deg`;
    }
  }

  const classes = ["g-giro", sizeClass(size, signature), hop && "is-hop", className].filter(
    Boolean
  );

  return (
    <svg
      ref={svgRef}
      className={classes.join(" ")}
      data-state={state === "idle" ? undefined : state}
      data-from={from === undefined || from === "idle" ? undefined : from}
      data-progress={progress}
      data-moment={reducedMotion ? undefined : playing}
      data-pulse={reducedMotion || pulse === undefined ? undefined : pulse % 2}
      onAnimationEnd={event => {
        if (isMomentClock(event.nativeEvent, event.currentTarget)) {
          setPlayed(current => ({ ...current, playing: undefined }));
        }
      }}
      style={style}
      viewBox="0 0 120 120"
      aria-hidden="true"
    >
      <g className="g-giro__body">
        <circle className="g-giro__track" cx="60" cy="60" r="44" />
        <g className="g-giro__turn">
          <g className="g-giro__spin" ref={spinRef}>
            <circle className="g-giro__arc" ref={arcRef} cx="60" cy="60" r="44" />
          </g>
        </g>
        {/* Cada olho tem a sua pálpebra: piscam com 40 ms de diferença. */}
        <g className="g-giro__lid g-giro__lid--l">
          <ellipse className="g-giro__eye" cx="46" cy="54" rx="6" ry="9" />
        </g>
        <g className="g-giro__lid g-giro__lid--r">
          <ellipse className="g-giro__eye" cx="74" cy="54" rx="6" ry="9" />
        </g>
        {/* Rostos separados por lado e por traço, para serem desenhados um depois do outro. */}
        <path className="g-giro__face g-giro__face--happy" d="M38 60 Q46 46 54 60" />
        <path
          className="g-giro__face g-giro__face--happy g-giro__face--r"
          d="M66 60 Q74 46 82 60"
        />
        <path className="g-giro__face g-giro__face--x" d="M39 52 L53 62" />
        <path className="g-giro__face g-giro__face--x g-giro__face--l2" d="M53 52 L39 62" />
        <path className="g-giro__face g-giro__face--x g-giro__face--r" d="M67 52 L81 62" />
        <path className="g-giro__face g-giro__face--x g-giro__face--r2" d="M81 52 L67 62" />
        <path className="g-giro__face g-giro__face--flat" d="M39 58 H53" />
        <path className="g-giro__face g-giro__face--flat g-giro__face--r" d="M67 58 H81" />
        <path className="g-giro__face g-giro__face--sleep" d="M39 55 Q46 62 53 55" />
        <path
          className="g-giro__face g-giro__face--sleep g-giro__face--r"
          d="M67 55 Q74 62 81 55"
        />
        <path className="g-giro__z" d="M88 22 H98 L88 34 H98" />
      </g>
    </svg>
  );
}

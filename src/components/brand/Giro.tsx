import type { CSSProperties } from "react";
import type { GiroState } from "./giro-states";

// Circunferência do arco (raio 44). --g-dash é "<visível> <resto>" e precisa somar 277.
const CIRCUMFERENCE = 277;

// Alcance dos olhos no curioso (unidades do quadro) e a inclinação máxima que ele rende.
const MAX_LOOK = 6;
const MAX_TILT_DEG = 8;

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
  className?: string;
}

function sizeClass(size: number | undefined, signature: boolean): string {
  if (signature) return "g-giro--signature";
  if (size === undefined || size >= 60) return "g-giro";
  if (size >= 32) return "g-giro--md";
  if (size >= 24) return "g-giro--sm";
  return "g-giro--xs";
}

export function Giro({
  state = "idle",
  size,
  signature = false,
  progress,
  look,
  hop = false,
  className,
}: GiroProps) {
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

  const classes = [sizeClass(size, signature), hop && "is-hop", className].filter(Boolean);

  return (
    <svg
      className={classes.join(" ")}
      data-state={state === "idle" ? undefined : state}
      data-progress={progress}
      style={style}
      viewBox="0 0 120 120"
      aria-hidden="true"
    >
      <g className="g-giro__body">
        <circle className="g-giro__track" cx="60" cy="60" r="44" />
        <g className="g-giro__turn">
          <g className="g-giro__spin">
            <circle className="g-giro__arc" cx="60" cy="60" r="44" />
          </g>
        </g>
        <g className="g-giro__blink">
          <ellipse className="g-giro__eye" cx="46" cy="54" rx="6" ry="9" />
          <ellipse className="g-giro__eye" cx="74" cy="54" rx="6" ry="9" />
        </g>
        <path
          className="g-giro__face g-giro__face--happy"
          d="M38 60 Q46 46 54 60 M66 60 Q74 46 82 60"
        />
        <path
          className="g-giro__face g-giro__face--x"
          d="M39 52 L53 62 M53 52 L39 62 M67 52 L81 62 M81 52 L67 62"
        />
        <path className="g-giro__face g-giro__face--flat" d="M39 58 H53 M67 58 H81" />
        <path
          className="g-giro__face g-giro__face--sleep"
          d="M39 55 Q46 62 53 55 M67 55 Q74 62 81 55"
        />
        <path className="g-giro__z" d="M88 22 H98 L88 34 H98" />
      </g>
    </svg>
  );
}

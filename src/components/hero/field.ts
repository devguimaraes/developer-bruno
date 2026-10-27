/**
 * Campo de spinners braille do hero. Quadros de spinner de terminal desenhados como pontos,
 * com um rastro lima onde o Giro e o cursor passam (prancha Hero2-Campo).
 *
 * O campo é pintado num buffer a 30 fps. Todo quadro copia o buffer para o canvas e recorta o
 * anel do Giro, então nenhum pixel do campo aparece dentro dele.
 */
import type { Burst, Hole } from "./heroEngine";

export interface FieldOptions {
  /** Tamanho da célula em px CSS. */
  cell: number;
  /** Raio base do ponto em px CSS. */
  dot: number;
}

export const DESKTOP_FIELD: FieldOptions = { cell: 18, dot: 1.15 };
export const MOBILE_FIELD: FieldOptions = { cell: 13, dot: 0.9 };

export interface FieldColors {
  ink: string;
  lime: string;
}

export interface SpinnerField {
  /** Ajusta o canvas e a grade ao tamanho (px CSS) e ao devicePixelRatio. Zera o rastro. */
  resize(W: number, H: number, dpr: number): void;
  /** Acende o rastro dos rastros emitidos pelo motor. */
  burst(bursts: readonly Burst[]): void;
  /** Apaga o rastro com o tempo (meia-vida de 1,1 s). */
  decay(dt: number): void;
  /** Repinta o buffer com os quadros do instante t. */
  paint(t: number): void;
  /** Copia o buffer para o canvas e recorta o anel do Giro. */
  present(hole: Hole): void;
}

// Oito pontos de braille por quadro; cada quadro é um bitmask. Dez quadros de spinner.
const SPINNER = [0x0b, 0x19, 0x39, 0x38, 0x3c, 0x34, 0x26, 0x27, 0x07, 0x0f];
const BRAILLE: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 0],
  [1, 1],
  [1, 2],
  [0, 3],
  [1, 3],
];
// Último quadro do atlas: o ponto lima do rastro.
const LIME_FRAME = SPINNER.length;
const ENERGY_HALF_LIFE_S = 1.1;

const FALLBACK_INK = "#d4d5fa";
const FALLBACK_LIME = "#d2ff4d";

/** Cores do campo lidas dos papéis --s-* da superfície em que ele está. */
export function readFieldColors(el: HTMLElement): FieldColors {
  const css = getComputedStyle(el);
  return {
    ink: css.getPropertyValue("--s-muted").trim() || FALLBACK_INK,
    lime: css.getPropertyValue("--s-accent").trim() || FALLBACK_LIME,
  };
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Devolve null quando o navegador não dá contexto 2D (jsdom, por exemplo). */
export function createSpinnerField(
  canvas: HTMLCanvasElement,
  opts: FieldOptions,
  colors: FieldColors
): SpinnerField | null {
  const ctx = canvas.getContext("2d");
  const buffer = document.createElement("canvas");
  const bufferCtx = buffer.getContext("2d");
  const atlas = document.createElement("canvas");
  const atlasCtx = atlas.getContext("2d");
  if (!ctx || !bufferCtx || !atlasCtx) return null;

  let dpr = 1;
  let cols = 0;
  let rows = 0;
  let cs = 0;
  let energy = new Float32Array(0);

  const drawAtlas = (): void => {
    const r = opts.dot * dpr;
    atlasCtx.clearRect(0, 0, atlas.width, atlas.height);
    atlasCtx.fillStyle = colors.ink;
    SPINNER.forEach((bits, f) => {
      BRAILLE.forEach(([col, row], b) => {
        if (bits & (1 << b)) {
          dot(atlasCtx, f * cs + cs * (0.36 + col * 0.28), cs * (0.2 + row * 0.2), r);
        }
      });
    });
    atlasCtx.fillStyle = colors.lime;
    dot(atlasCtx, LIME_FRAME * cs + cs / 2, cs / 2, r * 2.1);
  };

  const addEnergy = (x: number, y: number, radius: number, power: number): void => {
    if (radius <= 0) return;
    const { cell } = opts;
    const c0 = Math.max(0, Math.floor((x - radius) / cell));
    const c1 = Math.min(cols - 1, Math.floor((x + radius) / cell));
    const r0 = Math.max(0, Math.floor((y - radius) / cell));
    const r1 = Math.min(rows - 1, Math.floor((y + radius) / cell));
    for (let r = r0; r <= r1; r += 1) {
      for (let c = c0; c <= c1; c += 1) {
        const d = Math.hypot((c + 0.5) * cell - x, (r + 0.5) * cell - y) / radius;
        if (d >= 1) continue;
        const i = r * cols + c;
        energy[i] = Math.max(energy[i] ?? 0, (1 - d * d) * power);
      }
    }
  };

  return {
    resize(W, H, d) {
      dpr = d;
      const pw = Math.round(W * d);
      const ph = Math.round(H * d);
      canvas.width = pw;
      canvas.height = ph;
      buffer.width = pw;
      buffer.height = ph;
      cols = Math.ceil(W / opts.cell);
      rows = Math.ceil(H / opts.cell);
      energy = new Float32Array(cols * rows);
      cs = Math.round(opts.cell * d);
      atlas.width = cs * (LIME_FRAME + 1);
      atlas.height = cs;
      drawAtlas();
    },

    burst(bursts) {
      for (const b of bursts) addEnergy(b.x, b.y, b.radius, b.power);
    },

    decay(dt) {
      const k = Math.exp(-dt / ENERGY_HALF_LIFE_S);
      for (let i = 0; i < energy.length; i += 1) energy[i] = (energy[i] ?? 0) * k;
    },

    paint(t) {
      // Palco ainda sem tamanho: o WebKit lança InvalidStateError ao desenhar canvas de largura 0.
      if (buffer.width === 0 || buffer.height === 0 || cs === 0) return;
      bufferCtx.clearRect(0, 0, buffer.width, buffer.height);
      // Ondas separáveis: uma por coluna, uma por linha e uma por diagonal, calculadas a cada quadro.
      const sc = new Float32Array(cols);
      const ac = new Float32Array(cols);
      const sr = new Float32Array(rows);
      const ar = new Float32Array(rows);
      const sd = new Float32Array(cols + rows);
      for (let c = 0; c < cols; c += 1) {
        sc[c] = Math.sin(c * 0.21 + t * 0.8);
        ac[c] = c * 0.06 + t * 0.7;
      }
      for (let r = 0; r < rows; r += 1) {
        sr[r] = Math.sin(r * 0.33 - t * 0.6);
        ar[r] = r * 0.09;
      }
      for (let d = 0; d < cols + rows; d += 1) sd[d] = Math.sin((d - rows) * 0.11 + t * 0.4);

      const spin = t * 9;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const i = r * cols + c;
          const ph = (sc[c] ?? 0) + (sr[r] ?? 0) + (sd[c - r + rows] ?? 0);
          const fi = ((Math.floor(spin + ph * 2.2) % 10) + 10) % 10;
          const base = 0.08 + 0.06 * (1 + Math.sin((ac[c] ?? 0) - (ar[r] ?? 0)));
          const e = energy[i] ?? 0;
          const x = c * cs;
          const y = r * cs;
          if (e < 0.97) {
            bufferCtx.globalAlpha = base * (1 - e);
            bufferCtx.drawImage(atlas, fi * cs, 0, cs, cs, x, y, cs, cs);
          }
          if (e > 0.03) {
            bufferCtx.globalAlpha = Math.min(1, e);
            bufferCtx.drawImage(atlas, LIME_FRAME * cs, 0, cs, cs, x, y, cs, cs);
          }
        }
      }
      bufferCtx.globalAlpha = 1;
    },

    present(hole) {
      if (buffer.width === 0 || buffer.height === 0) return;
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(buffer, 0, 0);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(hole.x * dpr, hole.y * dpr, hole.r * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    },
  };
}

// src/components/brand/BrandIcon.tsx
import type React from "react";

export type IconName =
  | "codigo"
  | "terminal"
  | "deploy"
  | "documentacao"
  | "erro"
  | "sucesso"
  | "alerta"
  | "settings"
  | "usuario"
  | "comunidade"
  | "api";

type IconVariant = "line" | "solid";

interface BrandIconProps {
  name: IconName;
  size?: number;
  variant?: IconVariant;
  className?: string;
  decorative?: boolean;
}

/** Paths extraídos dos SVGs do brand-kit/icons/svg/.
 *  stroke="#fff" / stroke="#F1C232" — trocados para "currentColor" e "var(--icon-accent)"
 *  para que o CSS controle as cores, permitindo variant solid.
 *  Usamos placeholders que são substituídos na renderização. */
const ICON_PATHS: Record<
  IconName,
  { elements: Array<{ type: string; key: string; props: Record<string, unknown> }> }
> = {
  codigo: {
    elements: [
      {
        type: "path",
        key: "left",
        props: {
          d: "M12 10 L6 16 L12 22",
          fill: "none",
          stroke: "white",
          strokeWidth: 2.6,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        },
      },
      {
        type: "path",
        key: "right",
        props: {
          d: "M20 10 L26 16 L20 22",
          fill: "none",
          stroke: "white",
          strokeWidth: 2.6,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        },
      },
      {
        type: "line",
        key: "accent",
        props: {
          x1: 18,
          y1: 9,
          x2: 14,
          y2: 23,
          stroke: "accent",
          strokeWidth: 2.6,
          strokeLinecap: "round",
        },
      },
    ],
  },
  terminal: {
    elements: [
      {
        type: "rect",
        key: "frame",
        props: {
          x: 5,
          y: 7,
          width: 22,
          height: 18,
          rx: 5,
          fill: "none",
          stroke: "white",
          strokeWidth: 2.6,
        },
      },
      {
        type: "path",
        key: "chevron",
        props: {
          d: "M10 14 l3.5 3 l-3.5 3",
          fill: "none",
          stroke: "white",
          strokeWidth: 2.6,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        },
      },
      {
        type: "line",
        key: "accent",
        props: {
          x1: 16,
          y1: 20,
          x2: 22,
          y2: 20,
          stroke: "accent",
          strokeWidth: 2.6,
          strokeLinecap: "round",
        },
      },
    ],
  },
  deploy: {
    elements: [
      {
        type: "path",
        key: "stem",
        props: { d: "M16 23 V11", stroke: "white", strokeWidth: 2.6, strokeLinecap: "round" },
      },
      {
        type: "path",
        key: "arrow",
        props: {
          d: "M10 15 L16 9 L22 15",
          fill: "none",
          stroke: "white",
          strokeWidth: 2.6,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        },
      },
      {
        type: "line",
        key: "accent",
        props: {
          x1: 10,
          y1: 25,
          x2: 22,
          y2: 25,
          stroke: "accent",
          strokeWidth: 2.6,
          strokeLinecap: "round",
        },
      },
    ],
  },
  documentacao: {
    elements: [
      {
        type: "rect",
        key: "page",
        props: {
          x: 8,
          y: 5,
          width: 16,
          height: 22,
          rx: 4,
          fill: "none",
          stroke: "white",
          strokeWidth: 2.6,
        },
      },
      {
        type: "line",
        key: "accent",
        props: {
          x1: 12,
          y1: 11,
          x2: 20,
          y2: 11,
          stroke: "accent",
          strokeWidth: 2.4,
          strokeLinecap: "round",
        },
      },
      {
        type: "line",
        key: "line2",
        props: {
          x1: 12,
          y1: 16,
          x2: 20,
          y2: 16,
          stroke: "white",
          strokeWidth: 2.4,
          strokeLinecap: "round",
        },
      },
      {
        type: "line",
        key: "line3",
        props: {
          x1: 12,
          y1: 21,
          x2: 17,
          y2: 21,
          stroke: "white",
          strokeWidth: 2.4,
          strokeLinecap: "round",
        },
      },
    ],
  },
  erro: {
    elements: [
      {
        type: "circle",
        key: "ring",
        props: { cx: 16, cy: 16, r: 10, fill: "none", stroke: "white", strokeWidth: 2.6 },
      },
      {
        type: "path",
        key: "accent",
        props: {
          d: "M12.5 12.5 L19.5 19.5 M19.5 12.5 L12.5 19.5",
          stroke: "accent",
          strokeWidth: 2.6,
          strokeLinecap: "round",
        },
      },
    ],
  },
  sucesso: {
    elements: [
      {
        type: "circle",
        key: "ring",
        props: { cx: 16, cy: 16, r: 10, fill: "none", stroke: "white", strokeWidth: 2.6 },
      },
      {
        type: "path",
        key: "accent",
        props: {
          d: "M11 16.5 L14.5 20 L21 12.5",
          fill: "none",
          stroke: "accent",
          strokeWidth: 2.6,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        },
      },
    ],
  },
  alerta: {
    elements: [
      {
        type: "path",
        key: "triangle",
        props: {
          d: "M16 6 L27 25 H5 Z",
          fill: "none",
          stroke: "white",
          strokeWidth: 2.6,
          strokeLinejoin: "round",
        },
      },
      {
        type: "line",
        key: "excl",
        props: {
          x1: 16,
          y1: 13,
          x2: 16,
          y2: 19,
          stroke: "accent",
          strokeWidth: 2.6,
          strokeLinecap: "round",
        },
      },
      { type: "circle", key: "dot", props: { cx: 16, cy: 22, r: 1.4, fill: "currentColor" } },
    ],
  },
  settings: {
    elements: [
      {
        type: "line",
        key: "top",
        props: {
          x1: 7,
          y1: 11,
          x2: 25,
          y2: 11,
          stroke: "white",
          strokeWidth: 2.6,
          strokeLinecap: "round",
        },
      },
      {
        type: "line",
        key: "bottom",
        props: {
          x1: 7,
          y1: 21,
          x2: 25,
          y2: 21,
          stroke: "white",
          strokeWidth: 2.6,
          strokeLinecap: "round",
        },
      },
      {
        type: "circle",
        key: "knob1",
        props: { cx: 19, cy: 11, r: 3.4, fill: "none", stroke: "accent", strokeWidth: 2.6 },
      },
      {
        type: "circle",
        key: "knob2",
        props: { cx: 12, cy: 21, r: 3.4, fill: "none", stroke: "accent", strokeWidth: 2.6 },
      },
    ],
  },
  usuario: {
    elements: [
      {
        type: "circle",
        key: "head",
        props: { cx: 16, cy: 12, r: 4.5, fill: "none", stroke: "white", strokeWidth: 2.6 },
      },
      {
        type: "path",
        key: "body",
        props: {
          d: "M8 24 C8 18.5 24 18.5 24 24",
          fill: "none",
          stroke: "white",
          strokeWidth: 2.6,
          strokeLinecap: "round",
        },
      },
      { type: "circle", key: "accentL", props: { cx: 12, cy: 26.5, r: 1.3, fill: "currentColor" } },
      { type: "circle", key: "accentR", props: { cx: 20, cy: 26.5, r: 1.3, fill: "currentColor" } },
    ],
  },
  comunidade: {
    elements: [
      {
        type: "circle",
        key: "head1",
        props: { cx: 11, cy: 13, r: 3.6, fill: "none", stroke: "white", strokeWidth: 2.4 },
      },
      {
        type: "circle",
        key: "head2",
        props: { cx: 21, cy: 13, r: 3.6, fill: "none", stroke: "accent", strokeWidth: 2.4 },
      },
      {
        type: "path",
        key: "body1",
        props: {
          d: "M5 24 C5 19 17 19 17 24",
          fill: "none",
          stroke: "white",
          strokeWidth: 2.4,
          strokeLinecap: "round",
        },
      },
      {
        type: "path",
        key: "body2",
        props: {
          d: "M15 24 C15 19 27 19 27 24",
          fill: "none",
          stroke: "accent",
          strokeWidth: 2.4,
          strokeLinecap: "round",
        },
      },
    ],
  },
  api: {
    elements: [
      {
        type: "path",
        key: "left",
        props: {
          d: "M13 7 C10 7 11 12 8 14 C7 14.6 7 17.4 8 18 C11 20 10 25 13 25",
          fill: "none",
          stroke: "white",
          strokeWidth: 2.4,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        },
      },
      {
        type: "path",
        key: "right",
        props: {
          d: "M19 7 C22 7 21 12 24 14 C25 14.6 25 17.4 24 18 C21 20 22 25 19 25",
          fill: "none",
          stroke: "white",
          strokeWidth: 2.4,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        },
      },
      { type: "circle", key: "accent", props: { cx: 16, cy: 16, r: 2, fill: "currentColor" } },
    ],
  },
};

/** Resolve "white" → #FFFFFF, "accent" → #F1C232, "currentColor" → herdado */
function resolveColor(color: string, variant: IconVariant): string {
  if (color === "currentColor") {
    return variant === "solid" ? "#F1C232" : "#F1C232";
  }
  if (color === "accent") return "#F1C232";
  if (color === "white") return "#FFFFFF";
  return color;
}

function renderElement(
  el: ICON_PATHS[string]["elements"][number],
  variant: IconVariant,
  idx: number
) {
  const props: Record<string, unknown> = { ...el.props };
  // Resolve cores
  if (typeof props.stroke === "string") props.stroke = resolveColor(props.stroke, variant);
  if (typeof props.fill === "string" && props.fill !== "none")
    props.fill = resolveColor(props.fill, variant);

  const Tag = el.type as keyof JSX.IntrinsicElements;
  return <Tag key={el.key || idx} {...props} />;
}

export const BrandIcon: React.FC<BrandIconProps> = ({
  name,
  size = 24,
  variant = "line",
  className,
  decorative = false,
}) => {
  const data = ICON_PATHS[name];
  const a11y = decorative
    ? ({ "aria-hidden": true, focusable: "false" } as const)
    : ({ role: "img", "aria-label": `Ícone ${name}` } as const);

  return (
    // biome-ignore lint: aria-label is conditionally set based on decorative prop
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      data-icon={name}
      style={{ minWidth: size, minHeight: size }}
      {...a11y}
    >
      {data.elements.map((el, idx) => renderElement(el, variant, idx))}
    </svg>
  );
};

export default BrandIcon;

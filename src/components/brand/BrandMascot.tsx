// src/components/brand/BrandMascot.tsx
import type React from "react";

export type MascotVariant = "cor" | "negativo" | "mono-preto" | "mono-branco" | "mono-dourado";

interface BrandMascotProps {
  variant?: MascotVariant;
  size?: number;
  className?: string;
}

/** Cores por variante — os fills do SVG */
const FILLS: Record<MascotVariant, { body: string; eyes: string; feet: string }> = {
  cor: { body: "#FFFFFF", eyes: "#000000", feet: "#F1C232" },
  negativo: { body: "#000000", eyes: "#FFFFFF", feet: "#F1C232" },
  "mono-preto": { body: "#000000", eyes: "#000000", feet: "#000000" },
  "mono-branco": { body: "#FFFFFF", eyes: "#FFFFFF", feet: "#FFFFFF" },
  "mono-dourado": { body: "#F1C232", eyes: "#F1C232", feet: "#F1C232" },
};

export const BrandMascot: React.FC<BrandMascotProps> = ({
  variant = "cor",
  size = 32,
  className,
}) => {
  const s = Math.max(16, size);
  const scale = s / 32;
  const c = FILLS[variant];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={s}
      height={s}
      viewBox="0 0 32 32"
      className={className}
      aria-label={`Mascote BLOCO — ${variant}`}
      role="img"
      style={{ minWidth: s, minHeight: s }}
    >
      {/* Corpo — cápsula arredondada 22×19, rx=6 */}
      <rect x="5" y="6" width="22" height="19" rx="6" fill={c.body} />
      {/* Olhos — duas pílulas verticais */}
      <rect x="11" y="12" width="3.6" height="7" rx="1.8" fill={c.eyes} />
      <rect x="17.4" y="12" width="3.6" height="7" rx="1.8" fill={c.eyes} />
      {/* Pés — dois blocos horizontais dourados */}
      <rect x="8.5" y="25" width="6" height="3.5" rx="1.5" fill={c.feet} />
      <rect x="17.5" y="25" width="6" height="3.5" rx="1.5" fill={c.feet} />
    </svg>
  );
};

export default BrandMascot;

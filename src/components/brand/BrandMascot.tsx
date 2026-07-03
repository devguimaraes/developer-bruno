// src/components/brand/BrandMascot.tsx
import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type MascotVariant = "cor" | "negativo" | "mono-preto" | "mono-branco" | "mono-dourado";

export type MascotState = "idle" | "focused" | "happy" | "confused" | "curious";

interface BrandMascotProps {
  variant?: MascotVariant;
  size?: number;
  state?: MascotState;
  className?: string;
}

const FILLS: Record<MascotVariant, { body: string; eyes: string; feet: string }> = {
  cor: { body: "#FFFFFF", eyes: "#000000", feet: "#F1C232" },
  negativo: { body: "#000000", eyes: "#FFFFFF", feet: "#F1C232" },
  "mono-preto": { body: "#000000", eyes: "#000000", feet: "#000000" },
  "mono-branco": { body: "#FFFFFF", eyes: "#FFFFFF", feet: "#FFFFFF" },
  "mono-dourado": { body: "#F1C232", eyes: "#F1C232", feet: "#F1C232" },
};

/** Configuracoes de animacao por estado */
interface AnimConfig {
  leftEye: Record<string, unknown>;
  rightEye: Record<string, unknown>;
  leftFoot: Record<string, unknown>;
  rightFoot: Record<string, unknown>;
  blinkEnabled: boolean;
}

const spring = { type: "spring" as const, stiffness: 200, damping: 20 };

const STATE_ANIM: Record<MascotState, AnimConfig> = {
  idle: {
    leftEye: {},
    rightEye: {},
    leftFoot: {},
    rightFoot: {},
    blinkEnabled: true,
  },
  focused: {
    leftEye: { scaleX: 0.6 },
    rightEye: { scaleX: 0.6 },
    leftFoot: { translateY: [0, -1, 1, 0] },
    rightFoot: { translateY: [0, 1, -1, 0] },
    blinkEnabled: true,
  },
  happy: {
    leftEye: { translateY: -2 },
    rightEye: { translateY: -2 },
    leftFoot: { rotate: [0, -5, 5, 0] },
    rightFoot: { rotate: [0, 5, -5, 0] },
    blinkEnabled: true,
  },
  confused: {
    leftEye: { translateX: [-1.5, 1.5, -1] },
    rightEye: { translateX: [1.5, -1.5, 1] },
    leftFoot: { translateY: -3, rotate: -5 },
    rightFoot: {},
    blinkEnabled: true,
  },
  curious: {
    leftEye: {},
    rightEye: {},
    leftFoot: { scaleY: [1, 0.85, 1] },
    rightFoot: { scaleY: [1, 0.85, 1] },
    blinkEnabled: true,
  },
};

export const BrandMascot: React.FC<BrandMascotProps> = ({
  variant = "cor",
  size = 32,
  state = "idle",
  className,
}) => {
  const s = Math.max(16, size);
  const c = FILLS[variant];
  const reducedMotion = useReducedMotion();
  const [blink, setBlink] = useState(false);

  const anim = reducedMotion ? STATE_ANIM.idle : STATE_ANIM[state];

  // Piscada com jitter aleatorio (3-5s)
  useEffect(() => {
    if (reducedMotion || !anim.blinkEnabled) return;

    let timeout: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 2000;
      timeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();

    return () => clearTimeout(timeout);
  }, [reducedMotion, anim.blinkEnabled]);

  // Olhos: quando piscando, scaleY -> 0
  const eyeScaleY = blink ? 0.1 : 1;

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
      {/* Corpo — estatico */}
      <rect x="5" y="6" width="22" height="19" rx="6" fill={c.body} />

      {/* Olho esquerdo */}
      <motion.rect
        x="11"
        y="12"
        width="3.6"
        height="7"
        rx="1.8"
        fill={c.eyes}
        animate={{
          ...anim.leftEye,
          scaleY: eyeScaleY,
          originY: 15.5,
        }}
        transition={spring}
        style={{ transformOrigin: "12.8px 15.5px" }}
      />

      {/* Olho direito */}
      <motion.rect
        x="17.4"
        y="12"
        width="3.6"
        height="7"
        rx="1.8"
        fill={c.eyes}
        animate={{
          ...anim.rightEye,
          scaleY: eyeScaleY,
          originY: 15.5,
        }}
        transition={spring}
        style={{ transformOrigin: "19.2px 15.5px" }}
      />

      {/* Pe esquerdo */}
      <motion.rect
        x="8.5"
        y="25"
        width="6"
        height="3.5"
        rx="1.5"
        fill={c.feet}
        animate={anim.leftFoot}
        transition={spring}
        style={{ transformOrigin: "11.5px 26.75px" }}
      />

      {/* Pe direito */}
      <motion.rect
        x="17.5"
        y="25"
        width="6"
        height="3.5"
        rx="1.5"
        fill={c.feet}
        animate={anim.rightFoot}
        transition={spring}
        style={{ transformOrigin: "20.5px 26.75px" }}
      />
    </svg>
  );
};

export default BrandMascot;

import type React from "react";
import { useId, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useLiquidGlassContext } from "./LiquidGlassProvider";
import "./LiquidGlassLens.css";

export interface LiquidGlassLensProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  height?: number | string;
  width?: number | string;
  /** Opacidade do fundo (0-1) */
  backgroundOpacity?: number;
  /** Intensidade do blur backdrop-filter */
  blur?: number;
  /** Saturação do backdrop-filter */
  saturation?: number;
  // Props específicas do liquidGL (usadas apenas quando WebGL disponível)
  refraction?: number;
  bevelDepth?: number;
  bevelWidth?: number;
  frost?: number;
  specular?: boolean;
  shadow?: boolean;
  tilt?: boolean;
  tiltFactor?: number;
  magnify?: number;
  snapshot?: string;
}

export const LiquidGlassLens: React.FC<LiquidGlassLensProps> = ({
  children,
  className,
  style,
  height = "auto",
  width = "100%",
  backgroundOpacity = 0.05,
  blur = 10,
  saturation = 1.1,
  refraction = 0.026,
  bevelDepth = 0.08,
  bevelWidth = 0.15,
  frost = 0,
  specular = true,
  shadow = true,
  tilt = false,
  tiltFactor = 5,
  magnify = 1,
  snapshot,
}) => {
  const { isSupported, registerLens, unregisterLens } = useLiquidGlassContext();
  const reactId = useId();
  const lensId = `liquid-glass-lens-${reactId.replace(/:/g, "")}`;

  // Armazena opções em ref para evitar re-register em cada mudança de prop
  const optionsRef = useRef({
    refraction,
    bevelDepth,
    bevelWidth,
    frost,
    specular,
    shadow,
    tilt,
    tiltFactor,
    magnify,
    snapshot,
  });
  optionsRef.current = {
    refraction,
    bevelDepth,
    bevelWidth,
    frost,
    specular,
    shadow,
    tilt,
    tiltFactor,
    magnify,
    snapshot,
  };

  // Registra a lente apenas uma vez (mount/unmount)
  useEffect(() => {
    if (!isSupported) return;

    registerLens({
      id: lensId,
      selector: `#${lensId}`,
      options: optionsRef.current,
    });

    return () => {
      unregisterLens(lensId);
    };
  }, [isSupported, lensId, registerLens, unregisterLens]);

  const containerStyle: React.CSSProperties = {
    ...style,
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    // CSS custom properties para fallback
    // @ts-expect-error Custom properties
    "--glass-frost": backgroundOpacity,
    // @ts-expect-error Custom properties
    "--glass-saturation": saturation,
    // @ts-expect-error Custom properties
    "--glass-blur": `${blur}px`,
  };

  return (
    <div
      id={lensId}
      className={cn("liquid-glass-lens", !isSupported && "liquid-glass-lens--fallback", className)}
      style={containerStyle}
    >
      <div className="liquid-glass-lens__content">{children}</div>
    </div>
  );
};

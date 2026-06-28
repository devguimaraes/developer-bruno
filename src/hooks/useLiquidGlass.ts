import { useState, useMemo } from "react";
import type { LiquidGLOptions } from "@/types/liquidGL";

export interface LiquidGlassLensConfig {
  id: string;
  selector: string;
  options: Partial<LiquidGLOptions>;
}

export interface UseLiquidGlassReturn {
  isSupported: boolean;
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  registerLens: (config: LiquidGlassLensConfig) => void;
  unregisterLens: (id: string) => void;
  refreshSnapshot: () => void;
  /** Resolução adaptativa: 1 (mobile), 1.5 (tablet), 2 (desktop) */
  resolution: number;
  /** Specular desabilitado em mobile */
  isSpecularEnabled: boolean;
  /** Tilt 3D desabilitado em mobile/touch */
  isTiltEnabled: boolean;
}

interface NavigatorConnection {
  effectiveType?: string;
  saveData?: boolean;
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return !!gl;
  } catch {
    return false;
  }
}

function getConnection(): NavigatorConnection | undefined {
  try {
    return (navigator as { connection?: NavigatorConnection }).connection;
  } catch {
    return undefined;
  }
}

function isSlowConnection(): boolean {
  const conn = getConnection();
  if (!conn?.effectiveType) return false;
  return conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
}

function hasSaveData(): boolean {
  const conn = getConnection();
  return conn?.saveData === true;
}

function getBreakpoint(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function isTouchOnly(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function shouldEnable(): boolean {
  if (typeof window === "undefined") return false;
  if (isReducedMotion()) return false;
  if (hasSaveData()) return false;
  if (isSlowConnection()) return false;
  const bp = getBreakpoint();
  if (isTouchOnly() && bp === "mobile") return false;
  return hasWebGL();
}

function getResolution(): number {
  const bp = getBreakpoint();
  switch (bp) {
    case "mobile":
      return 1;
    case "tablet":
      return 1.5;
    default:
      return 2;
  }
}

const noop = () => {};

export function useLiquidGlass(_options: Partial<LiquidGLOptions> = {}): UseLiquidGlassReturn {
  // Todos os hooks no topo (sem early return — regras dos hooks)
  const isSsr = typeof window === "undefined";
  const [isSupported] = useState<boolean>(() => (isSsr ? false : shouldEnable()));
  const [isReady] = useState(false);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const resolution = useMemo(() => (isSsr ? 2 : getResolution()), [isSsr]);
  const bp = useMemo(() => (isSsr ? "desktop" : getBreakpoint()), [isSsr]);
  const isSpecularEnabled = useMemo(() => bp !== "mobile", [bp]);
  const isTiltEnabled = useMemo(() => bp === "desktop" && !isTouchOnly(), [bp]);

  // SSR-safe return
  if (isSsr) {
    return {
      isSupported: false,
      isReady: false,
      isLoading: false,
      error: null,
      registerLens: noop,
      unregisterLens: noop,
      refreshSnapshot: noop,
      resolution,
      isSpecularEnabled,
      isTiltEnabled,
    };
  }

  return {
    isSupported,
    isReady,
    isLoading,
    error,
    registerLens: noop,
    unregisterLens: noop,
    refreshSnapshot: noop,
    resolution,
    isSpecularEnabled,
    isTiltEnabled,
  };
}

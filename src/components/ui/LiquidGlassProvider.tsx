import type React from "react";
import { createContext, useContext } from "react";
import { useLiquidGlass, type LiquidGlassLensConfig } from "@/hooks/useLiquidGlass";

export interface LiquidGlassContextValue {
  isSupported: boolean;
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  registerLens: (config: LiquidGlassLensConfig) => void;
  unregisterLens: (id: string) => void;
  refreshSnapshot: () => void;
}

/** Valor default SSR-safe — retorna isSupported=false e noops */
const defaultContextValue: LiquidGlassContextValue = {
  isSupported: false,
  isReady: false,
  isLoading: false,
  error: null,
  registerLens: () => {},
  unregisterLens: () => {},
  refreshSnapshot: () => {},
};

const LiquidGlassContext = createContext<LiquidGlassContextValue>(defaultContextValue);

export function useLiquidGlassContext(): LiquidGlassContextValue {
  return useContext(LiquidGlassContext);
}

interface LiquidGlassProviderProps {
  children: React.ReactNode;
}

export const LiquidGlassProvider: React.FC<LiquidGlassProviderProps> = ({ children }) => {
  const glass = useLiquidGlass({});

  return <LiquidGlassContext.Provider value={glass}>{children}</LiquidGlassContext.Provider>;
};

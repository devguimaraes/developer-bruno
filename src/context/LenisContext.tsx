import type React from "react";
import { createContext, useContext, useState, useCallback } from "react";

export interface LenisContextValue {
  lenis: unknown;
  setLenis: (instance: unknown) => void;
}

const defaultLenisValue: LenisContextValue = {
  lenis: null,
  setLenis: () => {},
};

const LenisContext = createContext<LenisContextValue>(defaultLenisValue);

export function useLenis(): LenisContextValue {
  return useContext(LenisContext);
}

export const LenisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lenis, setLenisState] = useState<unknown>(null);

  const setLenis = useCallback((instance: unknown) => {
    setLenisState(instance);
  }, []);

  return <LenisContext.Provider value={{ lenis, setLenis }}>{children}</LenisContext.Provider>;
};

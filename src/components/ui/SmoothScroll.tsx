import type React from "react";
import { useEffect } from "react";
import Lenis from "lenis";
import { LenisProvider, useLenis } from "@/context/LenisContext";

/** Componente interno que cria Lenis e expõe via contexto. */
const LenisController: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setLenis } = useLenis();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    setLenis(lenis);

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenis(null);
    };
  }, [setLenis]);

  return <>{children}</>;
};

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LenisProvider>
      <LenisController>{children}</LenisController>
    </LenisProvider>
  );
};

export default SmoothScroll;

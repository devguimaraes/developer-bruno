import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock de IntersectionObserver
class IntersectionObserverMock {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

// Mock de window.matchMedia (necessário para useReducedMotion hook)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de ResizeObserver (necessário para GlassSurface e outros componentes dinâmicos)
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

// Mock de Framer Motion robusto
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const motionPropNames = new Set([
    "animate",
    "exit",
    "initial",
    "layout",
    "layoutId",
    "transition",
    "variants",
    "viewport",
    "whileDrag",
    "whileFocus",
    "whileHover",
    "whileInView",
    "whileTap",
  ]);

  const motionProxy = new Proxy(
    {},
    {
      get: (_target, key) => {
        return React.forwardRef(
          (
            { children, ...props }: React.HTMLAttributes<HTMLElement>,
            ref: React.Ref<HTMLElement>
          ) => {
            const forwardedProps = Object.fromEntries(
              Object.entries(props).filter(([propName]) => !motionPropNames.has(propName))
            );

            return React.createElement(key as string, { ...forwardedProps, ref }, children);
          }
        );
      },
    }
  );

  return {
    motion: motionProxy,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useScroll: () => ({
      scrollY: { get: () => 0, onChange: vi.fn(), on: vi.fn() },
      scrollYProgress: { get: () => 0, onChange: vi.fn(), on: vi.fn() },
    }),
    useTransform: () => ({ get: () => 0 }),
    useSpring: (_value: unknown, _config?: { damping?: number; stiffness?: number }) => ({
      get: () => 0,
      set: vi.fn(),
    }),
    useMotionValue: (initial?: number | string) => ({ get: () => initial ?? 0, set: vi.fn() }),
    useInView: () => true, // Hook crítico para ScrollReveal e Contact
    useAnimation: () => ({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn(),
    }),
  };
});

// Mock de Dither (React Three Fiber — WebGL não disponível em jsdom)
vi.mock("@/components/backgrounds/Dither", () => ({
  default: () => null,
}));

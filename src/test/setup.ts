import '@testing-library/jest-dom';
import { vi } from 'vitest';

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

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock
});

// Mock de ResizeObserver (necessário para GlassSurface e outros componentes dinâmicos)
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock
});

// Mock de Framer Motion robusto
vi.mock('framer-motion', async () => {
  const React = await import('react');
  
  const motionProxy = new Proxy({}, {
    get: (_target, key) => {
      return React.forwardRef(({ children, ...props }: React.HTMLAttributes<HTMLElement>, ref: React.Ref<HTMLElement>) => {
        return React.createElement(key as string, { ...props, ref }, children);
      });
    }
  });

  return {
    motion: motionProxy,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useScroll: () => ({ 
      scrollY: { get: () => 0, onChange: vi.fn(), on: vi.fn() }, 
      scrollYProgress: { get: () => 0, onChange: vi.fn(), on: vi.fn() } 
    }),
    useTransform: () => ({ get: () => 0 }),
    useSpring: () => ({ get: () => 0 }),
    useInView: () => true, // Hook crítico para ScrollReveal e Contact
    useAnimation: () => ({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn(),
    }),
  };
});

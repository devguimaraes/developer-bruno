/** Tipagem mínima para a biblioteca liquidGL (window.liquidGL). */

export interface LiquidGLOptions {
  target: string;
  snapshot?: string;
  resolution?: number;
  refraction?: number;
  bevelDepth?: number;
  bevelWidth?: number;
  frost?: number;
  shadow?: boolean;
  specular?: boolean;
  reveal?: "none" | "fade";
  tilt?: boolean;
  tiltFactor?: number;
  magnify?: number;
  on?: {
    init?: (instance: LiquidGLLens) => void;
  };
}

export interface LiquidGLLens {
  el: HTMLElement;
  options: LiquidGLOptions;
  setShadow(enabled: boolean): void;
  setTilt(enabled: boolean): void;
}

export interface LiquidGLInstance {
  (options: LiquidGLOptions): LiquidGLLens | LiquidGLLens[];
  registerDynamic(elements: string | HTMLElement | NodeList | HTMLElement[]): void;
  syncWith(config?: { lenis?: unknown }): void;
}

export interface LiquidGLRenderer {
  canvas: HTMLCanvasElement;
}

declare global {
  interface Window {
    liquidGL?: LiquidGLInstance;
    __liquidGLRenderer__?: LiquidGLRenderer;
  }
}

export interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  inp?: number;
}

export interface WebVitalsThresholds {
  LCP: number;
  FID: number;
  CLS: number;
  FCP: number;
  TTFB: number;
  INP: number;
}

export const BRAZILIAN_WEB_VITALS_THRESHOLDS: WebVitalsThresholds = {
  LCP: 2800, // Largest Contentful Paint (2.8s for Brazilian mobile networks)
  FID: 100,  // First Input Delay (100ms)
  CLS: 0.25, // Cumulative Layout Shift
  FCP: 1800, // First Contentful Paint (1.8s)
  TTFB: 800, // Time to First Byte (800ms for Brazilian servers)
  INP: 200,  // Interaction to Next Paint (200ms)
};
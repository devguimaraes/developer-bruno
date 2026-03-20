import { useEffect, useCallback } from 'react';
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';
import type { PerformanceMetrics, WebVitalsThresholds } from '../types';
import { BRAZILIAN_WEB_VITALS_THRESHOLDS } from '../types';

interface NetworkConnection {
  effectiveType: string;
  downlink: number;
  rtt: number;
}

declare global {
  interface Navigator {
    connection?: NetworkConnection;
  }
}

export type ExtendedNavigator = Navigator;

/**
 * Web Vitals monitoring hook for Brazilian market
 */
export const useWebVitals = (
  onReport?: (metric: PerformanceMetrics) => void,
  thresholds: WebVitalsThresholds = BRAZILIAN_WEB_VITALS_THRESHOLDS
) => {
  const reportMetric = useCallback((metric: Partial<PerformanceMetrics>) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const metricName = Object.keys(metric)[0] as keyof PerformanceMetrics;
      const metricValue = metric[metricName] as number;
      
      // Safe threshold lookup
      let threshold = 0;
      if (metricName === 'lcp') threshold = thresholds.LCP;
      if (metricName === 'fid') threshold = thresholds.FID;
      if (metricName === 'cls') threshold = thresholds.CLS;
      if (metricName === 'fcp') threshold = thresholds.FCP;
      if (metricName === 'ttfb') threshold = thresholds.TTFB;
      if (metricName === 'inp') threshold = thresholds.INP;

      console.log('📊 Web Vitals:', {
        metric: metricName,
        value: metricValue,
        threshold,
        status: getMetricStatus(metricValue, threshold)
      });
    }

    // Call custom report function if provided
    if (onReport) {
      onReport(metric as PerformanceMetrics);
    }

    // Send to analytics
    const win = window as typeof window & { gtag?: (event: string, name: string, data: Record<string, unknown>) => void };
    if (typeof window !== 'undefined' && win.gtag) {
      const metricName = Object.keys(metric)[0];
      const metricValue = Object.values(metric)[0] as number;
      
      win.gtag('event', metricName, {
        event_category: 'Web Vitals',
        value: Math.round(metricValue),
        non_interaction: true,
        custom_map: {
          [metricName]: 'custom_dimension_1'
        }
      });
    }
  }, [onReport, thresholds]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    onLCP((metric: Metric) => reportMetric({ lcp: metric.value }));
    onCLS((metric: Metric) => reportMetric({ cls: metric.value }));
    onINP((metric: Metric) => reportMetric({ inp: metric.value }));
    onTTFB((metric: Metric) => reportMetric({ ttfb: metric.value }));
    onFCP((metric: Metric) => reportMetric({ fcp: metric.value }));
  }, [reportMetric]);
};

const getMetricStatus = (
  value: number,
  threshold: number
): 'good' | 'needs-improvement' | 'poor' => {
  if (value <= threshold) return 'good';
  if (value <= threshold * 2) return 'needs-improvement';
  return 'poor';
};

export const usePerformanceMonitoring = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const resourceEntry = entry as PerformanceResourceTiming;
        if (entry.name.includes('.js') && 'transferSize' in entry) {
          const size = resourceEntry.transferSize || 0;
          const sizeKB = Math.round(size / 1024);
          if (sizeKB > 300) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`⚠️ Large JavaScript bundle detected: ${sizeKB}KB (threshold: 300KB)`);
            }
          }
        }
        if (entry.name.match(/\.(png|jpg|jpeg|webp)$/i)) {
          const size = resourceEntry.transferSize || 0;
          const sizeKB = Math.round(size / 1024);
          if (sizeKB > 500) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`⚠️ Large image detected: ${entry.name} (${sizeKB}KB)`);
            }
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Performance observer not supported:', error);
      }
    }

    if ('connection' in navigator) {
      const connection = navigator.connection;
      if (connection && process.env.NODE_ENV === 'development') {
        console.log('🌐 Connection Quality:', {
          effectiveType: connection.effectiveType,
          downlink: `${connection.downlink} Mbps`,
          rtt: `${connection.rtt} ms`
        });
      }
    }

    return () => observer.disconnect();
  }, []);
};

export const usePerformanceBudget = (budget = { total: 1000000, javascript: 300000 }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkPerformanceBudget = () => {
      const entries = performance.getEntriesByType('resource');
      let totalSize = 0;
      let jsSize = 0;

      entries.forEach((entry) => {
        const resourceEntry = entry as PerformanceResourceTiming;
        const size = resourceEntry.transferSize || 0;
        totalSize += size;
        if (entry.name.includes('.js')) jsSize += size;
      });

      const totalKB = Math.round(totalSize / 1024);
      const jsKB = Math.round(jsSize / 1024);
      const budgetKB = Math.round(budget.total / 1024);
      const jsBudgetKB = Math.round(budget.javascript / 1024);

      if (totalKB > budgetKB && process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ Performance budget exceeded: ${totalKB}/${budgetKB}KB`);
      }
      if (jsKB > jsBudgetKB && process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ JavaScript budget exceeded: ${jsKB}/${jsBudgetKB}KB`);
      }
    };

    if (document.readyState === 'complete') {
      setTimeout(checkPerformanceBudget, 1000);
    } else {
      window.addEventListener('load', () => setTimeout(checkPerformanceBudget, 1000));
    }
  }, [budget]);
};

export const useBrazilianPerformanceReporting = () => {
  useWebVitals();
  usePerformanceMonitoring();
  usePerformanceBudget();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const startTime = performance.now();
    const checkTTI = () => {
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        const tti = performance.now() - startTime;
        if (process.env.NODE_ENV === 'development') {
          console.log(`⚡ Time to Interactive: ${Math.round(tti)}ms`);
        }
      }
    };
    document.addEventListener('readystatechange', checkTTI);
    return () => document.removeEventListener('readystatechange', checkTTI);
  }, []);
};

export default useWebVitals;

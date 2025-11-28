import { useEffect, useCallback } from 'react';
import type { PerformanceMetrics, WebVitalsThresholds } from '../types';
import { BRAZILIAN_WEB_VITALS_THRESHOLDS } from '../types';

// Type definitions for extended interfaces
interface ExtendedPerformanceEntry extends PerformanceEntry {
  transferSize?: number;
}

interface NetworkConnection {
  effectiveType: string;
  downlink: number;
  rtt: number;
}

interface ExtendedNavigator extends Navigator {
  connection?: NetworkConnection;
}

declare global {
  interface Navigator extends ExtendedNavigator {}
}

/**
 * Web Vitals monitoring hook for Brazilian market
 */
export { type ExtendedNavigator } from './useWebVitals';

export const useWebVitals = (
  onReport?: (metric: PerformanceMetrics) => void,
  thresholds: WebVitalsThresholds = BRAZILIAN_WEB_VITALS_THRESHOLDS
) => {
  const reportMetric = useCallback((metric: PerformanceMetrics) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Web Vitals:', {
        metric: Object.keys(metric)[0],
        value: Object.values(metric)[0],
        threshold: thresholds[Object.keys(metric)[0] as keyof WebVitalsThresholds],
        status: getMetricStatus(Object.values(metric)[0], thresholds[Object.keys(metric)[0] as keyof WebVitalsThresholds])
      });
    }

    // Call custom report function if provided
    if (onReport) {
      onReport(metric);
    }

    // Send to analytics (will be implemented with Plausible)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', Object.keys(metric)[0], {
        event_category: 'Web Vitals',
        value: Math.round(Object.values(metric)[0] as number),
        non_interaction: true,
        custom_map: {
          [Object.keys(metric)[0]]: 'custom_dimension_1'
        }
      });
    }
  }, [onReport, thresholds]);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const loadWebVitals = async () => {
      try {
        const { onCLS, onFID, onLCP, onINP, onTTFB, onFCP } = await import('web-vitals');

        // Largest Contentful Paint (LCP)
        onLCP((metric) => {
          reportMetric({ lcp: metric.value });
        });

        // First Input Delay (FID) - legacy, replaced by INP
        onFID((metric) => {
          reportMetric({ fid: metric.value });
        });

        // Cumulative Layout Shift (CLS)
        onCLS((metric) => {
          reportMetric({ cls: metric.value });
        });

        // Interaction to Next Paint (INP) - replaces FID
        onINP((metric) => {
          reportMetric({ inp: metric.value });
        });

        // Time to First Byte (TTFB)
        onTTFB((metric) => {
          reportMetric({ ttfb: metric.value });
        });

        // First Contentful Paint (FCP)
        onFCP((metric) => {
          reportMetric({ fcp: metric.value });
        });

      } catch (error) {
        console.error('Error loading web-vitals:', error);
      }
    };

    // Load web-vitals after initial page load to not affect performance
    if (document.readyState === 'complete') {
      loadWebVitals();
    } else {
      window.addEventListener('load', loadWebVitals, { once: true });
    }
  }, [reportMetric]);
};

/**
 * Get performance status based on Brazilian thresholds
 */
const getMetricStatus = (
  value: number,
  threshold: number
): 'good' | 'needs-improvement' | 'poor' => {
  if (value <= threshold) {
    return 'good';
  } else if (value <= threshold * 2) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
};

/**
 * Performance monitoring hook for Brazilian mobile networks
 */
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Monitor performance budget for Brazilian networks
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach((entry) => {
        // Monitor JavaScript bundle sizes
        if (entry.name.includes('.js') && 'transferSize' in entry) {
          const size = entry.transferSize || 0;
          const sizeKB = Math.round(size / 1024);

          if (sizeKB > 300) { // 300KB threshold for Brazilian mobile
            console.warn(`⚠️ Large JavaScript bundle detected: ${sizeKB}KB (threshold: 300KB)`);

            // Report to analytics
            if (window.gtag) {
              window.gtag('event', 'large_bundle', {
                event_category: 'Performance',
                value: sizeKB,
                non_interaction: true
              });
            }
          }
        }

        // Monitor image sizes for Brazilian networks
        if (entry.name.includes('.png') || entry.name.includes('.jpg') || entry.name.includes('.jpeg')) {
          const size = (entry as ExtendedPerformanceEntry).transferSize || 0;
          const sizeKB = Math.round(size / 1024);

          if (sizeKB > 500) { // 500KB threshold for images
            console.warn(`⚠️ Large image detected: ${entry.name} (${sizeKB}KB)`);
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.error('Performance observer not supported:', error);
    }

    // Monitor connection quality for Brazilian users
    if ('connection' in navigator) {
      const connection = (navigator as ExtendedNavigator).connection;
      console.log('🌐 Connection Quality:', {
        effectiveType: connection.effectiveType,
        downlink: `${connection.downlink} Mbps`,
        rtt: `${connection.rtt} ms`
      });

      // Report connection quality
      if (window.gtag) {
        window.gtag('event', 'connection_quality', {
          event_category: 'Performance',
          effective_type: connection.effectiveType,
          downlink: Math.round(connection.downlink),
          rtt: connection.rtt,
          non_interaction: true
        });
      }
    }

    return () => {
      observer.disconnect();
    };
  }, []);
};

/**
 * Performance budget monitoring hook
 */
export const usePerformanceBudget = (budget = { total: 1000000, javascript: 300000 }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkPerformanceBudget = () => {
      // Get performance entries
      const entries = performance.getEntriesByType('resource');

      let totalSize = 0;
      let jsSize = 0;
      let cssSize = 0;
      let imageSize = 0;

      entries.forEach((entry) => {
        const size = (entry as ExtendedPerformanceEntry).transferSize || 0;
        totalSize += size;

        if (entry.name.includes('.js')) {
          jsSize += size;
        } else if (entry.name.includes('.css')) {
          cssSize += size;
        } else if (entry.name.match(/\.(png|jpg|jpeg|webp|gif)$/)) {
          imageSize += size;
        }
      });

      // Convert to KB
      const totalKB = Math.round(totalSize / 1024);
      const jsKB = Math.round(jsSize / 1024);
      const cssKB = Math.round(cssSize / 1024);
      const imageKB = Math.round(imageSize / 1024);

      // Check against budget
      const budgetKB = Math.round(budget.total / 1024);
      const jsBudgetKB = Math.round(budget.javascript / 1024);

      if (totalKB > budgetKB) {
        console.warn(`⚠️ Performance budget exceeded: ${totalKB}/${budgetKB}KB`);
      }

      if (jsKB > jsBudgetKB) {
        console.warn(`⚠️ JavaScript budget exceeded: ${jsKB}/${jsBudgetKB}KB`);
      }

      // Log performance metrics
      console.log('📊 Performance Budget Report:', {
        total: `${totalKB}KB`,
        javascript: `${jsKB}KB`,
        css: `${cssKB}KB`,
        images: `${imageKB}KB`,
        resources: entries.length
      });

      // Report to analytics
      if (window.gtag) {
        window.gtag('event', 'performance_budget', {
          event_category: 'Performance',
          total_size_kb: totalKB,
          js_size_kb: jsKB,
          css_size_kb: cssKB,
          image_size_kb: imageKB,
          resource_count: entries.length,
          non_interaction: true
        });
      }
    };

    // Check after page load
    if (document.readyState === 'complete') {
      setTimeout(checkPerformanceBudget, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(checkPerformanceBudget, 1000);
      });
    }
  }, [budget]);
};

/**
 * Custom hook for Brazilian market performance reporting
 */
export const useBrazilianPerformanceReporting = () => {
  useWebVitals();
  usePerformanceMonitoring();
  usePerformanceBudget();

  useEffect(() => {
    // Set up Brazilian market specific monitoring
    if (typeof window !== 'undefined') {
      // Monitor time to interactive for Brazilian users
      const startTime = performance.now();

      const checkTimeToInteractive = () => {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
          const tti = performance.now() - startTime;
          console.log(`⚡ Time to Interactive: ${Math.round(tti)}ms`);

          // Report to analytics
          if (window.gtag) {
            window.gtag('event', 'time_to_interactive', {
              event_category: 'Performance',
              value: Math.round(tti),
              non_interaction: true
            });
          }
        }
      };

      document.addEventListener('readystatechange', checkTimeToInteractive);
    }
  }, []);
};

export default useWebVitals;
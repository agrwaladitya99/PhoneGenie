/**
 * Performance monitoring utilities for tracking application performance
 */

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 100;

  startMeasure(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric({
        name,
        duration,
        timestamp: Date.now(),
      });
    };
  }

  private recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(m => m.name === name);
    }
    return [...this.metrics];
  }

  getAverageDuration(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    
    const total = metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / metrics.length;
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Measure async function execution time
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const end = performanceMonitor.startMeasure(name);
  try {
    return await fn();
  } finally {
    end();
  }
}

// Measure sync function execution time
export function measureSync<T>(
  name: string,
  fn: () => T
): T {
  const end = performanceMonitor.startMeasure(name);
  try {
    return fn();
  } finally {
    end();
  }
}

// Web Vitals tracking
export interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Reports web vitals metrics (can be extended to send to analytics)
 * @param metric - Web vitals metric to report
 */
export function reportWebVitals(metric: WebVitalsMetric): void {
  // In production, send this to an analytics service
  // Example: analytics.track('web_vitals', metric);
}

// Check if performance API is available
export function isPerformanceSupported(): boolean {
  return typeof window !== 'undefined' && 'performance' in window;
}

// Get page load metrics
export function getPageLoadMetrics() {
  if (!isPerformanceSupported()) return null;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!navigation) return null;

  return {
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    request: navigation.responseStart - navigation.requestStart,
    response: navigation.responseEnd - navigation.responseStart,
    dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    load: navigation.loadEventEnd - navigation.loadEventStart,
    total: navigation.loadEventEnd - navigation.fetchStart,
  };
}


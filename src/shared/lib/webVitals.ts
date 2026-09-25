const WEB_VITALS_ENDPOINT = '/api/vitals';

/** Core Web Vitals we track (FID was replaced by INP). */
const TRACKED_METRICS = ['CLS', 'FCP', 'INP', 'LCP', 'TTFB'] as const;
export type TrackedMetricName = (typeof TRACKED_METRICS)[number];

export type MetricRating = 'good' | 'needs-improvement' | 'poor';
const RATINGS: readonly MetricRating[] = ['good', 'needs-improvement', 'poor'];

/** Which storefront surface the metric was measured on, so PLP and PDP can be compared. */
export type PageType = 'plp' | 'pdp' | 'other';
const PAGE_TYPES: readonly PageType[] = ['plp', 'pdp', 'other'];

/** The subset of the `web-vitals` `Metric` that we use. */
export interface WebVitalMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating: MetricRating;
  navigationType: string;
}

export interface WebVitalReport extends WebVitalMetric {
  name: TrackedMetricName;
  pageType: PageType;
  path: string;
}

export function getPageType(pathname: string): PageType {
  if (pathname === '/') return 'plp';
  if (pathname.startsWith('/products/')) return 'pdp';
  return 'other';
}

const isTrackedMetric = (name: string): name is TrackedMetricName =>
  (TRACKED_METRICS as readonly string[]).includes(name);

/** Returns `null` for metrics we don't track (e.g. Next.js custom hydration timings). */
export function buildWebVitalReport(
  metric: WebVitalMetric,
  pathname: string
): WebVitalReport | null {
  if (!isTrackedMetric(metric.name)) return null;

  return {
    id: metric.id,
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
    rating: metric.rating,
    navigationType: metric.navigationType,
    pageType: getPageType(pathname),
    path: pathname,
  };
}

/** Validates an untrusted JSON payload received by the endpoint. */
export function parseWebVitalReport(payload: unknown): WebVitalReport | null {
  if (typeof payload !== 'object' || payload === null) return null;
  const data = payload as Record<string, unknown>;

  const { id, name, value, delta, rating, navigationType, pageType, path } = data;

  if (
    typeof id !== 'string' ||
    typeof name !== 'string' ||
    !isTrackedMetric(name) ||
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    typeof delta !== 'number' ||
    !Number.isFinite(delta) ||
    !RATINGS.includes(rating as MetricRating) ||
    typeof navigationType !== 'string' ||
    !PAGE_TYPES.includes(pageType as PageType) ||
    typeof path !== 'string' ||
    !path.startsWith('/') ||
    path.length > 200
  ) {
    return null;
  }

  return {
    id: id.slice(0, 100),
    name,
    value,
    delta,
    rating: rating as MetricRating,
    navigationType: navigationType.slice(0, 40),
    pageType: pageType as PageType,
    path,
  };
}

/** `sendBeacon` survives page unloads (LCP/CLS are final when the tab is hidden); fetch is the fallback. */
export function sendWebVitalReport(report: WebVitalReport, endpoint = WEB_VITALS_ENDPOINT) {
  const body = JSON.stringify(report);

  if (typeof navigator.sendBeacon === 'function') {
    navigator.sendBeacon(endpoint, body);
  } else {
    fetch(endpoint, { body, method: 'POST', keepalive: true });
  }
}

/**
 * Callback for `useReportWebVitals`. Keep the reference stable (module level) so metrics are
 * not reported twice. In development it only logs; in production it also ships the metric.
 */
export function reportWebVital(metric: WebVitalMetric) {
  const report = buildWebVitalReport(metric, window.location.pathname);
  if (!report) return;

  if (process.env.NODE_ENV !== 'production') {
    console.debug(
      `[web-vitals] ${report.pageType} ${report.name}=${report.value} (${report.rating})`
    );
    return;
  }

  sendWebVitalReport(report);
}

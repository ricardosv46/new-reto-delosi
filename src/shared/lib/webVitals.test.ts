import {
  buildWebVitalReport,
  getPageType,
  parseWebVitalReport,
  reportWebVital,
  sendWebVitalReport,
  WebVitalMetric,
} from './webVitals';

const metric: WebVitalMetric = {
  id: 'v5-123',
  name: 'LCP',
  value: 1830.4,
  delta: 1830.4,
  rating: 'good',
  navigationType: 'navigate',
};

const report = buildWebVitalReport(metric, '/products/7')!;

describe('getPageType', () => {
  it.each([
    ['/', 'plp'],
    ['/products/7', 'pdp'],
    ['/products/', 'pdp'],
    ['/carrito', 'other'],
    ['/productsx', 'other'],
  ])('should classify %s as %s', (pathname, expected) => {
    expect(getPageType(pathname)).toBe(expected);
  });
});

describe('buildWebVitalReport', () => {
  it('should tag the metric with the storefront page type and path', () => {
    expect(report).toEqual({ ...metric, pageType: 'pdp', path: '/products/7' });
  });

  it('should ignore metrics that are not Core Web Vitals', () => {
    expect(buildWebVitalReport({ ...metric, name: 'Next.js-hydration' }, '/')).toBeNull();
  });
});

describe('parseWebVitalReport', () => {
  it('should accept a valid report', () => {
    expect(parseWebVitalReport(report)).toEqual(report);
  });

  it.each([
    ['null', null],
    ['a string', 'LCP'],
    ['an unknown metric', { ...report, name: 'FID' }],
    ['a non numeric value', { ...report, value: '1830' }],
    ['a non finite value', { ...report, value: Infinity }],
    ['a non finite delta', { ...report, delta: NaN }],
    ['an unknown rating', { ...report, rating: 'awesome' }],
    ['an unknown page type', { ...report, pageType: 'admin' }],
    ['a missing id', { ...report, id: undefined }],
    ['a missing navigation type', { ...report, navigationType: undefined }],
    ['a path that is not absolute', { ...report, path: 'products/7' }],
    ['an oversized path', { ...report, path: `/${'a'.repeat(300)}` }],
  ])('should reject %s', (_label, payload) => {
    expect(parseWebVitalReport(payload)).toBeNull();
  });

  it('should truncate oversized free-text fields', () => {
    const parsed = parseWebVitalReport({
      ...report,
      id: 'x'.repeat(500),
      navigationType: 'y'.repeat(500),
    });

    expect(parsed?.id).toHaveLength(100);
    expect(parsed?.navigationType).toHaveLength(40);
  });
});

describe('sendWebVitalReport', () => {
  afterEach(() => {
    Object.defineProperty(navigator, 'sendBeacon', { value: undefined, configurable: true });
    jest.restoreAllMocks();
  });

  it('should use sendBeacon when available so the metric survives page unload', () => {
    const sendBeacon = jest.fn();
    Object.defineProperty(navigator, 'sendBeacon', { value: sendBeacon, configurable: true });

    sendWebVitalReport(report);

    expect(sendBeacon).toHaveBeenCalledWith('/api/vitals', JSON.stringify(report));
  });

  it('should fall back to a keepalive fetch when sendBeacon is not available', () => {
    Object.defineProperty(navigator, 'sendBeacon', { value: undefined, configurable: true });
    const fetchMock = jest.fn();
    global.fetch = fetchMock;

    sendWebVitalReport(report);

    expect(fetchMock).toHaveBeenCalledWith('/api/vitals', {
      body: JSON.stringify(report),
      method: 'POST',
      keepalive: true,
    });
  });
});

describe('reportWebVital', () => {
  const sendBeacon = jest.fn();

  beforeEach(() => {
    sendBeacon.mockReset();
    Object.defineProperty(navigator, 'sendBeacon', { value: sendBeacon, configurable: true });
    window.history.pushState({}, '', '/products/3');
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'sendBeacon', { value: undefined, configurable: true });
    jest.restoreAllMocks();
  });

  it('should only log in development and never send anything', () => {
    const debug = jest.spyOn(console, 'debug').mockImplementation(() => {});

    reportWebVital(metric);

    expect(debug).toHaveBeenCalledWith('[web-vitals] pdp LCP=1830.4 (good)');
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it('should send the metric tagged with the current page in production', () => {
    jest.replaceProperty(process.env, 'NODE_ENV', 'production');

    reportWebVital(metric);

    expect(sendBeacon).toHaveBeenCalledWith(
      '/api/vitals',
      JSON.stringify({ ...metric, pageType: 'pdp', path: '/products/3' })
    );
  });

  it('should skip metrics we do not track', () => {
    jest.replaceProperty(process.env, 'NODE_ENV', 'production');

    reportWebVital({ ...metric, name: 'Next.js-render' });

    expect(sendBeacon).not.toHaveBeenCalled();
  });
});

import { parseWebVitalReport } from '@/shared/lib/webVitals';

/**
 * Receives real-user Core Web Vitals from the browser and writes one structured log line per
 * metric (visible in Vercel's runtime logs, or pipe it to any log/analytics drain).
 */
export async function POST(request: Request) {
  const report = parseWebVitalReport(await request.json().catch(() => null));

  if (!report) {
    return new Response(null, { status: 400 });
  }

  console.log('[web-vitals]', JSON.stringify(report));
  return new Response(null, { status: 204 });
}

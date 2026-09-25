'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVital } from '@/shared/lib/webVitals';

/** Mount once in the root layout: streams real-user Core Web Vitals to `/api/vitals`. */
export function WebVitals() {
  useReportWebVitals(reportWebVital);

  return null;
}

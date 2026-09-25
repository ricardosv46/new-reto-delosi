import { render } from '@testing-library/react';
import { WebVitals } from './WebVitals';
import { reportWebVital } from '@/shared/lib/webVitals';
import { useReportWebVitals } from 'next/web-vitals';

jest.mock('next/web-vitals', () => ({ useReportWebVitals: jest.fn() }));

describe('WebVitals', () => {
  it('should register the stable reporter with Next and render nothing', () => {
    const { container } = render(<WebVitals />);

    expect(useReportWebVitals).toHaveBeenCalledWith(reportWebVital);
    expect(container).toBeEmptyDOMElement();
  });
});

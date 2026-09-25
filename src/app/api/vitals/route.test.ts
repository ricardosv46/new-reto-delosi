/** @jest-environment node */
import { POST } from './route';

const validReport = {
  id: 'v5-123',
  name: 'CLS',
  value: 0.04,
  delta: 0.04,
  rating: 'good',
  navigationType: 'navigate',
  pageType: 'plp',
  path: '/',
};

const post = (body: string) =>
  POST(new Request('http://localhost/api/vitals', { method: 'POST', body }));

describe('POST /api/vitals', () => {
  let log: jest.SpyInstance;

  beforeEach(() => {
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    log.mockRestore();
  });

  it('should log a valid metric as one structured line and answer 204', async () => {
    const response = await post(JSON.stringify(validReport));

    expect(response.status).toBe(204);
    expect(log).toHaveBeenCalledWith('[web-vitals]', JSON.stringify(validReport));
  });

  it('should reject a payload that is not a valid report', async () => {
    const response = await post(JSON.stringify({ ...validReport, name: 'FID' }));

    expect(response.status).toBe(400);
    expect(log).not.toHaveBeenCalled();
  });

  it('should reject a body that is not JSON', async () => {
    const response = await post('not json');

    expect(response.status).toBe(400);
    expect(log).not.toHaveBeenCalled();
  });
});

import { getSiteUrl } from './siteUrl';

describe('getSiteUrl', () => {
  it('should fall back to localhost when nothing is configured', () => {
    expect(getSiteUrl({})).toBe('http://localhost:3000');
  });

  it('should prefer the explicit SITE_URL override', () => {
    expect(
      getSiteUrl({
        SITE_URL: 'https://tienda.delosi.com',
        VERCEL_PROJECT_PRODUCTION_URL: 'reto.vercel.app',
        VERCEL_URL: 'reto-abc123.vercel.app',
      })
    ).toBe('https://tienda.delosi.com');
  });

  it('should use the Vercel production domain over the deployment domain and add https', () => {
    expect(
      getSiteUrl({
        VERCEL_PROJECT_PRODUCTION_URL: 'reto.vercel.app',
        VERCEL_URL: 'reto-abc123.vercel.app',
      })
    ).toBe('https://reto.vercel.app');
  });

  it('should use the deployment domain as the last resort on Vercel', () => {
    expect(getSiteUrl({ VERCEL_URL: 'reto-abc123.vercel.app' })).toBe(
      'https://reto-abc123.vercel.app'
    );
  });

  it('should keep an explicit protocol and drop trailing slashes', () => {
    expect(getSiteUrl({ SITE_URL: 'http://localhost:4000//' })).toBe('http://localhost:4000');
  });

  it('should ignore surrounding whitespace', () => {
    expect(getSiteUrl({ SITE_URL: '  https://tienda.delosi.com  ' })).toBe(
      'https://tienda.delosi.com'
    );
  });
});

const LOCAL_URL = 'http://localhost:3000';

const withProtocol = (host: string) => (/^https?:\/\//.test(host) ? host : `https://${host}`);

/**
 * Absolute base URL of the site, used for canonical links, Open Graph URLs, JSON-LD, the
 * sitemap and robots.txt. Resolution order:
 *  1. `SITE_URL` — explicit override (e.g. a custom domain).
 *  2. `VERCEL_PROJECT_PRODUCTION_URL` — the project's production domain, set by Vercel on every
 *     deployment (so canonicals from preview deployments still point to production).
 *  3. `VERCEL_URL` — the current deployment's domain.
 *  4. `http://localhost:3000` for local development.
 * Vercel's variables come without protocol, so `https://` is added when missing.
 */
export function getSiteUrl(env: Record<string, string | undefined> = process.env): string {
  const raw = env.SITE_URL || env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL;

  return (raw ? withProtocol(raw.trim()) : LOCAL_URL).replace(/\/+$/, '');
}

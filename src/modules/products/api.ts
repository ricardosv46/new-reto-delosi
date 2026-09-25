import { cache } from 'react';
import { Product } from './types';

const API_URL = 'https://fakestoreapi.com';
const REVALIDATE_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 8000;

/**
 * GET against FakeStoreAPI using Next's extended fetch so responses land in the Data Cache
 * (`revalidate`). Returns `null` when the API answers 200 with an empty body, which is how
 * FakeStoreAPI reports an unknown product id. Any other failure throws, so the route's
 * `error.tsx` can show a real error state instead of stale or made-up data.
 */
async function request<T>(path: string): Promise<T | null> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      // FakeStoreAPI sits behind Cloudflare, which rejects requests without a browser-like UA.
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`FakeStoreAPI ${path} responded with ${response.status}`);
  }

  const body = await response.text();
  return body ? (JSON.parse(body) as T) : null;
}

async function requestRequired<T>(path: string): Promise<T> {
  const data = await request<T>(path);
  if (data === null) {
    throw new Error(`FakeStoreAPI ${path} returned an empty response`);
  }
  return data;
}

export const getProducts = cache((): Promise<Product[]> => requestRequired<Product[]>('/products'));

export const getCategories = cache(
  (): Promise<string[]> => requestRequired<string[]>('/products/categories')
);

/** Resolves to `null` when the product does not exist. */
export const getProductById = cache(
  (id: number): Promise<Product | null> => request<Product>(`/products/${id}`)
);

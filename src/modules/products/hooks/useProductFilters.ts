'use client';

import { useCallback, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ProductFilters } from '../types';

type FilterKey = keyof ProductFilters;

/**
 * Client-side handle on the catalog filters. The URL is the single source of truth: changing a
 * filter rewrites the query string and the server re-renders the page with the new results,
 * so every filtered view is shareable and crawlable.
 */
export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setFilter = useCallback(
    (key: FilterKey, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const setSearch = useCallback((value: string) => setFilter('search', value), [setFilter]);
  const setCategory = useCallback((value: string) => setFilter('category', value), [setFilter]);
  const setSortBy = useCallback((value: string) => setFilter('sortBy', value), [setFilter]);

  return { isPending, setSearch, setCategory, setSortBy };
}

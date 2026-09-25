import { ProductFilters, RawSearchParams, SortOption } from '../types';

const SORT_OPTIONS: readonly SortOption[] = ['price-asc', 'price-desc'];

const firstValue = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? '';

/** Turns untrusted URL search params into a well-formed `ProductFilters`. */
export function parseProductFilters(params: RawSearchParams): ProductFilters {
  const sortBy = firstValue(params.sortBy);

  return {
    search: firstValue(params.search),
    category: firstValue(params.category),
    sortBy: SORT_OPTIONS.find((option) => option === sortBy) ?? '',
  };
}

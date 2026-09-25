export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export type SortOption = '' | 'price-asc' | 'price-desc';

export interface ProductFilters {
  search: string;
  category: string;
  sortBy: SortOption;
}

/** Raw `searchParams` as Next.js hands them to a page. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

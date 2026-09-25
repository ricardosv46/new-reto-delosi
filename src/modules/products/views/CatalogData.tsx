import { getCategories, getProducts } from '../api';
import { filterAndSortProducts } from '../lib/filterAndSortProducts';
import { parseProductFilters } from '../lib/parseProductFilters';
import { RawSearchParams } from '../types';
import { ProductCatalogView } from './ProductCatalogView';

interface CatalogDataProps {
  searchParams: Promise<RawSearchParams>;
}

/**
 * Server Component: reads the filters from the URL, loads the (cached) catalog and returns the
 * already-filtered HTML, so shared/indexed URLs like `/?category=jewelery` arrive complete.
 */
export async function CatalogData({ searchParams }: CatalogDataProps) {
  const filters = parseProductFilters(await searchParams);
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <ProductCatalogView
      products={filterAndSortProducts(products, filters)}
      categories={categories}
      filters={filters}
    />
  );
}

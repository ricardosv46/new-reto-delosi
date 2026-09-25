import { Product, ProductFilters } from '../types';

export function filterAndSortProducts(
  products: Product[],
  { category, search, sortBy }: ProductFilters
): Product[] {
  let list = [...products];

  if (category) {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const term = search.toLowerCase();
    list = list.filter(
      (p) => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
    );
  }

  if (sortBy === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  }

  return list;
}

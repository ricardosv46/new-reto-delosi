import { filterAndSortProducts } from './filterAndSortProducts';
import { Product } from '../types';

const buildProduct = (overrides: Partial<Product>): Product => ({
  id: 1,
  title: 'Generic Product',
  price: 10,
  description: 'A generic description',
  category: 'electronics',
  image: 'https://images.unsplash.com/photo-1',
  ...overrides,
});

const products: Product[] = [
  buildProduct({ id: 1, title: 'Mechanical Keyboard', category: 'electronics', price: 100 }),
  buildProduct({ id: 2, title: 'Leather Watch', category: 'accessories', price: 50 }),
  buildProduct({ id: 3, title: 'Wireless Headphones', category: 'electronics', price: 200 }),
];

describe('filterAndSortProducts', () => {
  it('should return every product when there is no active filter', () => {
    const result = filterAndSortProducts(products, { category: '', search: '', sortBy: '' });

    expect(result).toHaveLength(3);
  });

  it('should only keep products matching the active category', () => {
    const result = filterAndSortProducts(products, {
      category: 'accessories',
      search: '',
      sortBy: '',
    });

    expect(result.map((p) => p.title)).toEqual(['Leather Watch']);
  });

  it('should only keep products matching the search term in title or description', () => {
    const result = filterAndSortProducts(products, {
      category: '',
      search: 'headphones',
      sortBy: '',
    });

    expect(result.map((p) => p.title)).toEqual(['Wireless Headphones']);
  });

  it('should sort products by price ascending when sortBy is price-asc', () => {
    const result = filterAndSortProducts(products, {
      category: '',
      search: '',
      sortBy: 'price-asc',
    });

    expect(result.map((p) => p.title)).toEqual([
      'Leather Watch',
      'Mechanical Keyboard',
      'Wireless Headphones',
    ]);
  });

  it('should sort products by price descending when sortBy is price-desc', () => {
    const result = filterAndSortProducts(products, {
      category: '',
      search: '',
      sortBy: 'price-desc',
    });

    expect(result.map((p) => p.title)).toEqual([
      'Wireless Headphones',
      'Mechanical Keyboard',
      'Leather Watch',
    ]);
  });

  it('should return an empty list when no product matches the filters', () => {
    const result = filterAndSortProducts(products, {
      category: '',
      search: 'nonexistent-product',
      sortBy: '',
    });

    expect(result).toEqual([]);
  });
});

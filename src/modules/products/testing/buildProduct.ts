import { Product } from '../types';

/** Test fixture: a valid product with sensible defaults, overridable per test. */
export const buildProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  title: 'Generic Product',
  price: 10,
  description: 'A generic description',
  category: 'electronics',
  image: 'https://fakestoreapi.com/img/1.jpg',
  ...overrides,
});

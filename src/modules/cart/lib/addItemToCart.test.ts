import { addItemToCart } from './addItemToCart';
import { Product } from '@/modules/products/types';

const buildProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  title: 'Minimalist Leather Watch',
  price: 189.99,
  description: 'A sleek watch.',
  category: 'accessories',
  image: 'https://images.unsplash.com/photo-1',
  ...overrides,
});

describe('addItemToCart', () => {
  it('should add a new product with quantity 1 when the cart is empty', () => {
    const product = buildProduct();

    const result = addItemToCart([], product);

    expect(result).toEqual([{ product, quantity: 1 }]);
  });

  it('should increase quantity instead of duplicating when the product is already in the cart', () => {
    const product = buildProduct();

    const result = addItemToCart([{ product, quantity: 1 }], product);

    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(2);
  });

  it('should not affect other items already in the cart', () => {
    const productA = buildProduct({ id: 1 });
    const productB = buildProduct({ id: 2 });

    const result = addItemToCart([{ product: productA, quantity: 1 }], productB);

    expect(result).toEqual([
      { product: productA, quantity: 1 },
      { product: productB, quantity: 1 },
    ]);
  });

  it('should only increase the matching product and leave the others untouched', () => {
    const watch = buildProduct({ id: 1 });
    const phone = buildProduct({ id: 2 });

    const result = addItemToCart(
      [
        { product: watch, quantity: 1 },
        { product: phone, quantity: 4 },
      ],
      watch
    );

    expect(result).toEqual([
      { product: watch, quantity: 2 },
      { product: phone, quantity: 4 },
    ]);
  });
});

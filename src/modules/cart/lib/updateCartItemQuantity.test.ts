import { updateCartItemQuantity } from './updateCartItemQuantity';
import { Product } from '@/modules/products/types';

const product: Product = {
  id: 1,
  title: 'Minimalist Leather Watch',
  price: 189.99,
  description: 'A sleek watch.',
  category: 'accessories',
  image: 'https://images.unsplash.com/photo-1',
};

describe('updateCartItemQuantity', () => {
  it('should update the quantity of the matching item', () => {
    const result = updateCartItemQuantity([{ product, quantity: 1 }], product.id, 5);

    expect(result[0].quantity).toBe(5);
  });

  it('should not allow quantity to drop below 1', () => {
    const result = updateCartItemQuantity([{ product, quantity: 1 }], product.id, 0);

    expect(result[0].quantity).toBe(1);
  });

  it('should leave the other items untouched', () => {
    const other = { ...product, id: 2 };

    const result = updateCartItemQuantity(
      [
        { product, quantity: 1 },
        { product: other, quantity: 3 },
      ],
      product.id,
      5
    );

    expect(result[1]).toEqual({ product: other, quantity: 3 });
  });
});

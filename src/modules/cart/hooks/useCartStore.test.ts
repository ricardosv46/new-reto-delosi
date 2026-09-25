import { useCartStore } from './useCartStore';
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

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('should add a product to the state when addItem is called', () => {
    const product = buildProduct();

    useCartStore.getState().addItem(product);

    expect(useCartStore.getState().items).toEqual([{ product, quantity: 1 }]);
  });

  it('should remove an item by product id', () => {
    const product = buildProduct();
    useCartStore.getState().addItem(product);

    useCartStore.getState().removeItem(product.id);

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('should update an item quantity', () => {
    const product = buildProduct();
    useCartStore.getState().addItem(product);

    useCartStore.getState().updateQuantity(product.id, 3);

    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it('should clear all items', () => {
    useCartStore.getState().addItem(buildProduct());
    useCartStore.getState().addItem(buildProduct({ id: 2 }));

    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toEqual([]);
  });
});

import { CartItem } from '../types';
import { Product } from '@/modules/products/types';

export function addItemToCart(items: CartItem[], product: Product): CartItem[] {
  const existingItem = items.find((item) => item.product.id === product.id);

  if (existingItem) {
    return items.map((item) =>
      item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
  }

  return [...items, { product, quantity: 1 }];
}

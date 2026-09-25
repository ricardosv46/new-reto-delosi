import { CartItem } from '../types';

export function removeItemFromCart(items: CartItem[], productId: number): CartItem[] {
  return items.filter((item) => item.product.id !== productId);
}

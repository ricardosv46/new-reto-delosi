import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';
import { Product } from '@/modules/products/types';
import { addItemToCart } from '../lib/addItemToCart';
import { removeItemFromCart } from '../lib/removeItemFromCart';
import { updateCartItemQuantity } from '../lib/updateCartItemQuantity';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product: Product) =>
        set((state) => ({
          items: addItemToCart(state.items, product),
        })),

      removeItem: (productId: number) =>
        set((state) => ({
          items: removeItemFromCart(state.items, productId),
        })),

      updateQuantity: (productId: number, quantity: number) =>
        set((state) => ({
          items: updateCartItemQuantity(state.items, productId, quantity),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'delosi-cart-storage',
    }
  )
);

'use client';

import React from 'react';
import { Product } from '@/modules/products/types';
import { useCartStore } from '../hooks/useCartStore';
import { useCartDrawerStore } from '../hooks/useCartDrawerStore';

interface AddToCartButtonProps {
  product: Product;
}

/** Adds the product to the global cart and opens the drawer as feedback. */
export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.openCart);

  const handleClick = () => {
    addItem(product);
    openCart();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-xs font-medium text-primary-foreground transition-colors hover:bg-[#2B2B30]"
    >
      Agregar al carrito
    </button>
  );
};

'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../hooks/useCartStore';
import { useCartDrawerStore } from '../hooks/useCartDrawerStore';
import { useMounted } from '@/shared/hooks/useMounted';

export const CartButton: React.FC = () => {
  const items = useCartStore((state) => state.items);
  const openCart = useCartDrawerStore((state) => state.openCart);
  const mounted = useMounted();

  const totalCount = mounted ? items.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <button
      onClick={openCart}
      aria-label="Abrir carrito"
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
    >
      <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
      {totalCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-badge px-1 text-[10px] font-medium text-white">
          {totalCount}
        </span>
      )}
    </button>
  );
};

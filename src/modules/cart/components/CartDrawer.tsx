'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingCart, BadgeCheck, ArrowRight } from 'lucide-react';
import { useCartStore } from '../hooks/useCartStore';
import { useCartDrawerStore } from '../hooks/useCartDrawerStore';
import { useMounted } from '@/shared/hooks/useMounted';

interface ConfirmedOrder {
  code: string;
  total: number;
  itemCount: number;
}

export const CartDrawer: React.FC = () => {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isOpen, closeCart } = useCartDrawerStore();
  const mounted = useMounted();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<ConfirmedOrder | null>(null);

  const handleClose = useCallback(() => {
    closeCart();
    setOrder(null);
  }, [closeCart]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  const totalPrice = mounted
    ? items.reduce((total, item) => total + item.product.price * item.quantity, 0)
    : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/30" onClick={handleClose} />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        className="drawer-in relative z-10 flex h-full w-full max-w-md flex-col overflow-hidden border-l border-field bg-background text-foreground shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:rounded-l-[28px]"
      >
        <div className="flex items-center justify-between border-b border-field px-6 py-5">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
            {order ? 'Pedido confirmado' : 'Tu carrito'}
          </h2>
          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Cerrar carrito"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {order ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-dark text-white">
              <BadgeCheck className="h-7 w-7" strokeWidth={1.5} />
            </div>

            <p className="mt-6 text-[11px] font-medium tracking-[0.16em] text-tertiary uppercase">
              Pedido confirmado
            </p>
            <h3 className="mt-2 text-[28px] leading-[1.2] font-bold tracking-[-0.02em] text-foreground">
              Gracias por tu compra
            </h3>
            <p className="mx-auto mt-2 max-w-[260px] text-sm leading-relaxed text-muted-foreground">
              Tu orden <span className="font-semibold text-foreground">#{order.code}</span> por{' '}
              {order.itemCount} {order.itemCount === 1 ? 'artículo' : 'artículos'} fue procesada
              correctamente.
            </p>

            <div className="mt-6 flex w-full max-w-[220px] items-center justify-between rounded-2xl bg-card px-4 py-3">
              <span className="text-[11px] font-medium text-tertiary">Total</span>
              <span className="text-[15px] font-bold text-foreground">
                ${order.total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleClose}
              className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-foreground"
            >
              Seguir comprando
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
              {!mounted || items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-canvas">
                    <ShoppingCart className="h-6 w-6 text-tertiary" strokeWidth={1.5} />
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">
                    Tu carrito está vacío
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-3 text-xs font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Explorar catálogo
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 rounded-2xl bg-card p-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-background">
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        fill
                        sizes="64px"
                        className="object-contain p-1.5"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <h3
                          className="truncate text-[15px] font-semibold text-foreground"
                          title={item.product.title}
                        >
                          {item.product.title}
                        </h3>
                        <p className="mt-0.5 text-[11px] font-medium text-tertiary capitalize">
                          {item.product.category}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-border bg-background">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                          <span className="min-w-5 text-center text-xs font-medium text-foreground select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-bold text-foreground">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-tertiary transition-colors hover:bg-background hover:text-accent"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {mounted && items.length > 0 && (
              <div className="space-y-4 border-t border-field px-6 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-[15px] font-bold text-foreground">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      const code = Math.floor(100000 + Math.random() * 900000).toString();
                      const itemCount = items.reduce((total, item) => total + item.quantity, 0);
                      setOrder({ code, total: totalPrice, itemCount });
                      clearCart();
                    }}
                    className="w-full rounded-full bg-primary py-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-[#2B2B30]"
                  >
                    Completar Compra
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full rounded-full border border-border bg-background py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const href = `/products/${product.id}`;

  return (
    <article className="relative flex h-full flex-col rounded-3xl bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-0.5">
      <span className="absolute top-3 right-3 z-10 max-w-[58%] truncate rounded-full border border-border bg-background px-2.5 py-[3px] text-[11px] font-medium text-muted-foreground capitalize">
        {product.category}
      </span>

      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className="flex h-[170px] items-center justify-center"
      >
        <Image
          src={product.image}
          alt=""
          width={220}
          height={170}
          sizes="(min-width: 1280px) 220px, (min-width: 640px) 40vw, 80vw"
          className="h-full w-full object-contain"
        />
      </Link>

      <div className="mt-3 flex items-start justify-between gap-3">
        <h3 className="text-[15px] leading-[1.3] font-semibold tracking-[-0.01em] text-foreground">
          <Link href={href} className="line-clamp-2 hover:opacity-70">
            {product.title}
          </Link>
        </h3>
        <span className="shrink-0 text-[15px] leading-none font-bold text-foreground">
          ${product.price.toFixed(2)}
        </span>
      </div>

      {product.rating && (
        <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
          <Star className="h-3 w-3 fill-star text-star" strokeWidth={1.5} />
          <span>{product.rating.rate.toFixed(1)}</span>
          <span className="text-tertiary">({product.rating.count})</span>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          aria-label="Agregar al carrito"
          className="flex-1 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Al carrito
        </button>
        <Link
          href={href}
          className="flex-1 rounded-full bg-primary px-3 py-2 text-center text-xs font-medium text-primary-foreground transition-colors hover:bg-[#2B2B30]"
        >
          Comprar
        </Link>
      </div>
    </article>
  );
};

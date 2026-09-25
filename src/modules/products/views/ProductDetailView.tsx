import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product } from '../types';
import { AddToCartButton } from '@/modules/cart/components/AddToCartButton';
import { getSiteUrl } from '@/shared/lib/siteUrl';
import { ProductJsonLd } from '../components/ProductJsonLd';

interface ProductDetailViewProps {
  product: Product;
}

const perks = [
  { icon: Truck, title: 'Envío express', detail: 'Gratis desde $99' },
  { icon: ShieldCheck, title: 'Garantía oficial', detail: '100% asegurado' },
  { icon: RefreshCw, title: 'Retornos gratis', detail: 'Hasta 30 días' },
];

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  return (
    <div className="rise space-y-8">
      <ProductJsonLd product={product} siteUrl={getSiteUrl()} />
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative flex aspect-square items-center justify-center rounded-3xl bg-card p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <Image
            src={product.image}
            alt={product.title}
            fill
            priority
            sizes="(min-width: 768px) 45vw, 90vw"
            className="object-contain p-8"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground capitalize">
              {product.category}
            </span>
            <h1 className="text-[28px] leading-[1.2] font-bold tracking-[-0.02em] text-foreground">
              {product.title}
            </h1>

            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      strokeWidth={1.5}
                      className={`h-3.5 w-3.5 ${
                        i < Math.round(product.rating!.rate) ? 'fill-star text-star' : 'text-border'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {product.rating.rate.toFixed(1)} · {product.rating.count} valoraciones
                </span>
              </div>
            )}
          </div>

          <div className="flex items-end justify-between gap-4 border-y border-field py-5">
            <p className="text-[28px] leading-none font-bold tracking-[-0.02em] text-foreground">
              ${product.price.toFixed(2)}
            </p>
            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              En stock
            </span>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <AddToCartButton product={product} />

          <div className="grid grid-cols-3 gap-3 pt-2">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="flex flex-col items-center rounded-2xl bg-card px-2 py-4 text-center"
              >
                <perk.icon className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                <span className="mt-2 text-[11px] font-medium text-foreground">{perk.title}</span>
                <span className="mt-0.5 text-[11px] text-tertiary">{perk.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import Image from 'next/image';
import { Product, ProductFilters } from '../types';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilters } from '../components/CategoryFilters';
import { SortSelect } from '../components/SortSelect';
import { useProductFilters } from '../hooks/useProductFilters';
import { useCartStore } from '@/modules/cart/hooks/useCartStore';

interface ProductCatalogViewProps {
  /** Products already filtered and sorted on the server from the URL search params. */
  products: Product[];
  categories: string[];
  filters: ProductFilters;
}

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80';

export const ProductCatalogView: React.FC<ProductCatalogViewProps> = ({
  products,
  categories,
  filters,
}) => {
  const { isPending, setSearch, setCategory, setSortBy } = useProductFilters();
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="rise">
      <section className="relative mb-8">
        <div className="relative min-h-[240px] overflow-hidden rounded-[28px] sm:aspect-[21/9] sm:min-h-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="(min-width: 1280px) 1232px, 100vw"
            className="object-cover grayscale brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/25" />
          <div className="absolute inset-0 flex items-center justify-center px-6 pb-6 text-center text-white">
            <h1 className="text-[clamp(64px,10vw,130px)] leading-[0.95] font-extrabold tracking-[-0.04em]">
              Catálogo
            </h1>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-1/2 justify-center px-4 sm:px-10">
          <div className="w-full max-w-[560px]">
            <SearchBar initialValue={filters.search} onSearch={setSearch} />
          </div>
        </div>
      </section>

      <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
        Explora nuestra colección seleccionada de productos premium. Filtra por categoría, busca por
        texto y ordena por precio.
      </p>

      <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
        <aside className="space-y-8">
          <div>
            <p className="mb-3 px-3 text-[11px] font-medium text-tertiary">Categorías</p>
            <CategoryFilters
              categories={categories}
              activeCategory={filters.category}
              onSelectCategory={setCategory}
              activeCount={products.length}
            />
          </div>

          <div className="rounded-3xl bg-surface-dark p-6 text-white">
            <p className="text-[11px] font-medium text-white/60">Delosi</p>
            <p className="mt-3 text-[15px] leading-snug font-semibold tracking-[-0.01em]">
              Piezas seleccionadas, entrega cuidada.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/70">
              Envío express, garantía oficial y retornos hasta 30 días.
            </p>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] font-medium text-tertiary">
              {products.length} {products.length === 1 ? 'producto' : 'productos'}
            </p>
            <SortSelect value={filters.sortBy} onChange={setSortBy} />
          </div>

          {products.length === 0 ? (
            <div className="rounded-3xl bg-card px-6 py-16 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <p className="text-[15px] font-semibold text-foreground">
                No encontramos coincidencias
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Prueba ajustando los filtros o el término de búsqueda.
              </p>
            </div>
          ) : (
            <div
              aria-busy={isPending}
              className={`grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 transition-opacity ${
                isPending ? 'opacity-60' : ''
              }`}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addItem} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

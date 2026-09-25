import { Suspense } from 'react';
import { Metadata } from 'next';
import { getCategories } from '@/modules/products/api';
import { parseProductFilters } from '@/modules/products/lib/parseProductFilters';
import { RawSearchParams } from '@/modules/products/types';
import { CatalogData } from '@/modules/products/views/CatalogData';
import { CatalogSkeleton } from '@/modules/products/components/CatalogSkeleton';

interface PageProps {
  searchParams: Promise<RawSearchParams>;
}

const SITE_TITLE = 'Catálogo de Productos | Delosi E-commerce';
const SITE_DESCRIPTION =
  'Explora nuestra colección de productos premium: filtra por categoría, busca por texto y ordena por precio.';

// 1200x630 is the size social networks expect for a large link preview.
const OG_IMAGE = {
  url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&h=630&q=80',
  width: 1200,
  height: 630,
  alt: 'Catálogo de Delosi Store',
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * A category is a real, indexable page: it gets its own title, description and canonical.
 * Search and sort variants are the same content, so they canonicalize to the category (or `/`)
 * instead of competing with it as duplicates. Unknown categories fall back to the home page.
 */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { category } = parseProductFilters(await searchParams);
  const categories = category ? await getCategories().catch(() => []) : [];
  const knownCategory = categories.find((item) => item.toLowerCase() === category.toLowerCase());

  const title = knownCategory ? `${capitalize(knownCategory)} | ${SITE_TITLE}` : SITE_TITLE;
  const description = knownCategory
    ? `Compra productos de ${knownCategory} en Delosi E-commerce: busca por texto y ordena por precio.`
    : SITE_DESCRIPTION;
  const canonical = knownCategory ? `/?category=${encodeURIComponent(knownCategory)}` : '/';

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'website', images: [OG_IMAGE] },
  };
}

export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogData searchParams={searchParams} />
    </Suspense>
  );
}

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductById, getProducts } from '@/modules/products/api';
import { ProductDetailView } from '@/modules/products/views/ProductDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Known products are prerendered and refreshed hourly; unknown ids render on demand.
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({ id: String(product.id) }));
  } catch (error) {
    // Don't fail the whole build if the API is down: pages will render on demand instead.
    console.error('generateStaticParams: could not load products', error);
    return [];
  }
}

const parseProductId = (rawId: string): number | null => {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
};

async function loadProduct(params: PageProps['params']) {
  const id = parseProductId((await params).id);
  return id === null ? null : getProductById(id);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // A failing API is reported by the page itself (error.tsx); metadata just falls back.
  const product = await loadProduct(params).catch(() => null);

  if (!product) {
    return {
      title: 'Producto no encontrado | Delosi E-commerce',
      description: 'El artículo solicitado no existe o no está disponible en este momento.',
      robots: { index: false },
    };
  }

  const canonical = `/products/${product.id}`;

  return {
    title: `${product.title} | Delosi E-commerce`,
    description: product.description,
    alternates: { canonical },
    openGraph: {
      title: product.title,
      description: product.description,
      url: canonical,
      images: [{ url: product.image, alt: product.title }],
      type: 'website',
    },
  };
}

export default async function Page({ params }: PageProps) {
  const product = await loadProduct(params);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}

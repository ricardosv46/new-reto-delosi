import type { MetadataRoute } from 'next';
import { getCategories, getProducts } from '@/modules/products/api';
import { getSiteUrl } from '@/shared/lib/siteUrl';

// Regenerated hourly, in line with the product data cache, so new products get listed.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const home = [{ url: siteUrl, changeFrequency: 'daily' as const, priority: 1 }];

  try {
    const [products, categories] = await Promise.all([getProducts(), getCategories()]);

    return [
      ...home,
      ...categories.map((category) => ({
        url: `${siteUrl}/?category=${encodeURIComponent(category)}`,
        changeFrequency: 'daily' as const,
        priority: 0.8,
      })),
      ...products.map((product) => ({
        url: `${siteUrl}/products/${product.id}`,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
    ];
  } catch (error) {
    // Keep the sitemap valid (home only) if the API is down; it is rebuilt on the next revalidation.
    console.error('sitemap: could not load the catalog', error);
    return home;
  }
}

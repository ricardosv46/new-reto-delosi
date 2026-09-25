import React from 'react';
import { Product } from '../types';

interface ProductJsonLdProps {
  product: Product;
  /** Absolute base URL of the site, e.g. `https://tienda.com`. */
  siteUrl: string;
}

/** schema.org `Product` markup: lets search engines show price and rating in rich results. */
export function buildProductJsonLd(product: Product, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image,
    sku: String(product.id),
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.id}`,
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.rate,
        reviewCount: product.rating.count,
      },
    }),
  };
}

export const ProductJsonLd: React.FC<ProductJsonLdProps> = ({ product, siteUrl }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      // `<` is escaped so product text can never close the script tag (XSS).
      __html: JSON.stringify(buildProductJsonLd(product, siteUrl)).replace(/</g, '\\u003c'),
    }}
  />
);

import { render } from '@testing-library/react';
import { buildProductJsonLd, ProductJsonLd } from './ProductJsonLd';
import { buildProduct } from '../testing/buildProduct';

const SITE = 'https://tienda.com';

describe('buildProductJsonLd', () => {
  it('should describe the product as a schema.org Product with an Offer', () => {
    const product = buildProduct({
      id: 7,
      title: 'Leather Watch',
      price: 55.5,
      description: 'A watch.',
      category: 'accessories',
      image: 'https://fakestoreapi.com/img/7.jpg',
    });

    expect(buildProductJsonLd(product, SITE)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Leather Watch',
      description: 'A watch.',
      image: 'https://fakestoreapi.com/img/7.jpg',
      sku: '7',
      category: 'accessories',
      offers: {
        '@type': 'Offer',
        url: 'https://tienda.com/products/7',
        priceCurrency: 'USD',
        price: '55.50',
        availability: 'https://schema.org/InStock',
      },
    });
  });

  it('should include the aggregate rating only when the product has one', () => {
    const rated = buildProductJsonLd(buildProduct({ rating: { rate: 4.7, count: 500 } }), SITE);
    const unrated = buildProductJsonLd(buildProduct({ rating: undefined }), SITE);

    expect(rated.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.7,
      reviewCount: 500,
    });
    expect(unrated).not.toHaveProperty('aggregateRating');
  });
});

describe('ProductJsonLd', () => {
  it('should render a ld+json script with parseable JSON', () => {
    const { container } = render(
      <ProductJsonLd product={buildProduct({ id: 3 })} siteUrl={SITE} />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(JSON.parse(script!.innerHTML)['@type']).toBe('Product');
  });

  it('should escape "<" so product text cannot break out of the script tag', () => {
    const product = buildProduct({ description: '</script><script>alert(1)</script>' });

    const { container } = render(<ProductJsonLd product={product} siteUrl={SITE} />);

    const html = container.querySelector('script')!.innerHTML;
    expect(html).not.toContain('</script>');
    expect(JSON.parse(html).description).toBe('</script><script>alert(1)</script>');
  });
});

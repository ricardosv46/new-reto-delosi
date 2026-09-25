import { render, screen } from '@testing-library/react';
import { ProductDetailView } from './ProductDetailView';
import { buildProduct } from '../testing/buildProduct';

describe('ProductDetailView', () => {
  const product = buildProduct({
    id: 3,
    title: 'Mens Cotton Jacket',
    price: 55.99,
    category: "men's clothing",
    description: 'Great outerwear jackets for Spring/Autumn/Winter.',
    rating: { rate: 4.7, count: 500 },
  });

  it('should render the product information', () => {
    render(<ProductDetailView product={product} />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Mens Cotton Jacket' })
    ).toBeInTheDocument();
    expect(screen.getByText('$55.99')).toBeInTheDocument();
    expect(screen.getByText("men's clothing")).toBeInTheDocument();
    expect(
      screen.getByText('Great outerwear jackets for Spring/Autumn/Winter.')
    ).toBeInTheDocument();
  });

  it('should render the rating with the number of reviews', () => {
    render(<ProductDetailView product={product} />);

    expect(screen.getByText('4.7 · 500 valoraciones')).toBeInTheDocument();
  });

  it('should omit the rating block when the product has no rating', () => {
    render(<ProductDetailView product={buildProduct({ rating: undefined })} />);

    expect(screen.queryByText(/valoraciones/)).not.toBeInTheDocument();
  });

  it('should show an image with the product title as alt text', () => {
    render(<ProductDetailView product={product} />);

    expect(screen.getByAltText('Mens Cotton Jacket')).toBeInTheDocument();
  });

  it('should offer the add to cart button and a link back to the catalog', () => {
    render(<ProductDetailView product={product} />);

    expect(screen.getByRole('button', { name: 'Agregar al carrito' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Volver al catálogo/ })).toHaveAttribute('href', '/');
  });

  it('should fill as many stars as the rounded rating', () => {
    const { container } = render(
      <ProductDetailView product={buildProduct({ rating: { rate: 2.4, count: 10 } })} />
    );

    expect(container.querySelectorAll('svg.fill-star')).toHaveLength(2);
  });

  it('should embed schema.org Product structured data with the product price', () => {
    const { container } = render(<ProductDetailView product={product} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.innerHTML);
    expect(data['@type']).toBe('Product');
    expect(data.offers.price).toBe('55.99');
  });
});

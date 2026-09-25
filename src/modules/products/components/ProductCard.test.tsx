import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { buildProduct } from '../testing/buildProduct';

describe('ProductCard', () => {
  it('should call onAddToCart with the product when clicking "Agregar al carrito"', () => {
    const product = buildProduct({ id: 7, title: 'Leather Watch' });
    const onAddToCart = jest.fn();
    render(<ProductCard product={product} onAddToCart={onAddToCart} />);

    fireEvent.click(screen.getByLabelText('Agregar al carrito'));

    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(product);
  });

  it('should link the title to the product detail page', () => {
    const product = buildProduct({ id: 7, title: 'Leather Watch' });
    render(<ProductCard product={product} onAddToCart={jest.fn()} />);

    expect(screen.getByRole('link', { name: 'Leather Watch' })).toHaveAttribute(
      'href',
      '/products/7'
    );
  });
});

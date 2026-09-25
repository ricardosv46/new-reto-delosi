import { render, screen, fireEvent } from '@testing-library/react';
import { AddToCartButton } from './AddToCartButton';
import { useCartStore } from '../hooks/useCartStore';
import { useCartDrawerStore } from '../hooks/useCartDrawerStore';
import { buildProduct } from '@/modules/products/testing/buildProduct';

describe('AddToCartButton', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useCartDrawerStore.setState({ isOpen: false });
  });

  it('should add the product to the cart and open the drawer when clicked', () => {
    const product = buildProduct();
    render(<AddToCartButton product={product} />);

    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));

    expect(useCartStore.getState().items).toEqual([{ product, quantity: 1 }]);
    expect(useCartDrawerStore.getState().isOpen).toBe(true);
  });
});

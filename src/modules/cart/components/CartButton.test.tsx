import { render, screen, fireEvent } from '@testing-library/react';
import { CartButton } from './CartButton';
import { useCartStore } from '../hooks/useCartStore';
import { useCartDrawerStore } from '../hooks/useCartDrawerStore';
import { buildProduct } from '@/modules/products/testing/buildProduct';

describe('CartButton', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useCartDrawerStore.setState({ isOpen: false });
  });

  it('should not display a badge when the cart is empty', () => {
    render(<CartButton />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('should display the total quantity badge after a product is added to the cart', async () => {
    const product = buildProduct();
    useCartStore.getState().addItem(product);
    useCartStore.getState().addItem(product);

    render(<CartButton />);

    expect(await screen.findByText('2')).toBeInTheDocument();
  });

  it('should open the cart drawer when clicked', () => {
    render(<CartButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Abrir carrito' }));

    expect(useCartDrawerStore.getState().isOpen).toBe(true);
  });
});

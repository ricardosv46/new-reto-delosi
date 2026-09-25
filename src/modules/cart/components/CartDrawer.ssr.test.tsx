import { render, screen } from '@testing-library/react';
import { CartDrawer } from './CartDrawer';
import { useCartStore } from '../hooks/useCartStore';
import { useCartDrawerStore } from '../hooks/useCartDrawerStore';
import { buildProduct } from '@/modules/products/testing/buildProduct';

// Before hydration the persisted (localStorage) cart must not leak into the markup,
// otherwise the server HTML and the first client render would disagree.
jest.mock('../../../shared/hooks/useMounted', () => ({ useMounted: () => false }));

describe('CartDrawer before hydration', () => {
  it('should render the empty state instead of the persisted items', () => {
    useCartStore.setState({ items: [{ product: buildProduct(), quantity: 3 }] });
    useCartDrawerStore.setState({ isOpen: true });

    render(<CartDrawer />);

    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
    expect(screen.queryByText('Generic Product')).not.toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { CartButton } from './CartButton';
import { useCartStore } from '../hooks/useCartStore';
import { buildProduct } from '@/modules/products/testing/buildProduct';

// Before hydration the badge must stay hidden even if localStorage already has items.
jest.mock('../../../shared/presentation/hooks/useMounted', () => ({ useMounted: () => false }));

describe('CartButton before hydration', () => {
  it('should not render the badge from persisted items', () => {
    useCartStore.setState({ items: [{ product: buildProduct(), quantity: 5 }] });

    render(<CartButton />);

    expect(screen.queryByText('5')).not.toBeInTheDocument();
  });
});

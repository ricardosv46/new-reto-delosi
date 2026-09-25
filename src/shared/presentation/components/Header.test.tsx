import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('should link the brand to the home page', () => {
    render(<Header />);

    expect(screen.getByRole('link', { name: /Delosi/ })).toHaveAttribute('href', '/');
  });

  it('should include the cart button so the item count is always visible', () => {
    render(<Header />);

    expect(screen.getByRole('button', { name: 'Abrir carrito' })).toBeInTheDocument();
  });
});

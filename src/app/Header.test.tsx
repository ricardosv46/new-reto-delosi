import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('should link the brand to the home page', () => {
    render(
      <Header>
        <span />
      </Header>
    );

    expect(screen.getByRole('link', { name: /Delosi/ })).toHaveAttribute('href', '/');
  });

  it('should render the slot the layout passes in, such as the cart button', () => {
    render(
      <Header>
        <button type="button">Abrir carrito</button>
      </Header>
    );

    expect(screen.getByRole('button', { name: 'Abrir carrito' })).toBeInTheDocument();
  });
});

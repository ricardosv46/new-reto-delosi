import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

describe('not-found page', () => {
  it('should explain the resource does not exist and link back to the catalog', () => {
    render(<NotFound />);

    expect(screen.getByText('Recurso no encontrado')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Volver al catálogo/ })).toHaveAttribute('href', '/');
  });
});

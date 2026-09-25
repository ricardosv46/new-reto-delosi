import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './error';

describe('error boundary', () => {
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('should log the error and show a friendly message', () => {
    const error = new Error('FakeStoreAPI /products responded with 403');

    render(<ErrorBoundary error={error} reset={jest.fn()} />);

    expect(screen.getByText('Error en la tienda')).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalledWith('E-commerce error details:', error);
  });

  it('should retry when clicking "Reintentar carga"', () => {
    const reset = jest.fn();
    render(<ErrorBoundary error={new Error('boom')} reset={reset} />);

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar carga' }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});

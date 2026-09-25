import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCatalogView } from './ProductCatalogView';
import { ProductFilters } from '../types';
import { buildProduct } from '../testing/buildProduct';
import { useProductFilters } from '../hooks/useProductFilters';
import { useCartStore } from '@/modules/cart/hooks/useCartStore';
import { useCartDrawerStore } from '@/modules/cart/hooks/useCartDrawerStore';

jest.mock('../hooks/useProductFilters');

const mockedUseProductFilters = useProductFilters as jest.Mock;

const products = [
  buildProduct({ id: 1, title: 'Mechanical Keyboard', category: 'electronics', price: 100 }),
  buildProduct({ id: 2, title: 'Leather Watch', category: 'accessories', price: 50 }),
];

const noFilters: ProductFilters = { search: '', category: '', sortBy: '' };

const setupHook = (isPending = false) => {
  const handlers = { setSearch: jest.fn(), setCategory: jest.fn(), setSortBy: jest.fn() };
  mockedUseProductFilters.mockReturnValue({ isPending, ...handlers });
  return handlers;
};

const renderView = (overrides: Partial<React.ComponentProps<typeof ProductCatalogView>> = {}) =>
  render(
    <ProductCatalogView
      products={products}
      categories={['electronics', 'accessories']}
      filters={noFilters}
      {...overrides}
    />
  );

describe('ProductCatalogView', () => {
  beforeEach(() => {
    setupHook();
    useCartStore.setState({ items: [] });
    useCartDrawerStore.setState({ isOpen: false });
  });

  it('should render the products it receives from the server', () => {
    renderView();

    expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument();
    expect(screen.getByText('Leather Watch')).toBeInTheDocument();
    expect(screen.getByText('2 productos')).toBeInTheDocument();
  });

  it('should show an empty state when the server returned no products', () => {
    renderView({ products: [] });

    expect(screen.getByText('No encontramos coincidencias')).toBeInTheDocument();
  });

  it('should ask the filters hook to change category when a category is selected', () => {
    const handlers = setupHook();
    renderView();

    fireEvent.click(screen.getByRole('button', { name: 'accessories' }));

    expect(handlers.setCategory).toHaveBeenCalledWith('accessories');
  });

  it('should ask the filters hook to change the sort order', () => {
    const handlers = setupHook();
    renderView();

    fireEvent.change(screen.getByLabelText('Ordenar'), { target: { value: 'price-asc' } });

    expect(handlers.setSortBy).toHaveBeenCalledWith('price-asc');
  });

  it('should add a product to the cart from the listing without opening the drawer', () => {
    renderView();

    fireEvent.click(screen.getAllByLabelText('Agregar al carrito')[0]);

    expect(useCartStore.getState().items).toEqual([{ product: products[0], quantity: 1 }]);
    expect(useCartDrawerStore.getState().isOpen).toBe(false);
  });

  it('should use the singular label when there is a single product', () => {
    renderView({ products: [products[0]] });

    expect(screen.getByText('1 producto')).toBeInTheDocument();
  });

  it('should mark the grid as busy while the server is resolving a new filter', () => {
    setupHook(true);
    renderView();

    const grid = screen.getAllByLabelText('Agregar al carrito')[0].closest('[aria-busy]');
    expect(grid).toHaveAttribute('aria-busy', 'true');
  });
});

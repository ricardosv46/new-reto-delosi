import { render, screen } from '@testing-library/react';
import { CatalogData } from './CatalogData';
import { getCategories, getProducts } from '../api';
import { buildProduct } from '../testing/buildProduct';

jest.mock('../api');
jest.mock('../hooks/useProductFilters', () => ({
  useProductFilters: () => ({
    isPending: false,
    setSearch: jest.fn(),
    setCategory: jest.fn(),
    setSortBy: jest.fn(),
  }),
}));

const mockedGetProducts = getProducts as jest.Mock;
const mockedGetCategories = getCategories as jest.Mock;

const products = [
  buildProduct({ id: 1, title: 'Gaming Monitor', category: 'electronics', price: 300 }),
  buildProduct({ id: 2, title: 'Gold Ring', category: 'jewelery', price: 90 }),
  buildProduct({ id: 3, title: 'External SSD', category: 'electronics', price: 120 }),
];

const load = async (params: Record<string, string>) =>
  render(await CatalogData({ searchParams: Promise.resolve(params) }));

describe('CatalogData', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedGetProducts.mockResolvedValue(products);
    mockedGetCategories.mockResolvedValue(['electronics', 'jewelery']);
  });

  it('should render every product when the URL has no filters', async () => {
    await load({});

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });

  it('should filter by the category in the URL on the server', async () => {
    await load({ category: 'jewelery' });

    expect(screen.getByText('Gold Ring')).toBeInTheDocument();
    expect(screen.queryByText('Gaming Monitor')).not.toBeInTheDocument();
  });

  it('should search and sort using the URL params', async () => {
    await load({ category: 'electronics', sortBy: 'price-asc' });

    const titles = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent);
    expect(titles).toEqual(['External SSD', 'Gaming Monitor']);
  });

  it('should show the empty state when nothing matches', async () => {
    await load({ search: 'zzz' });

    expect(screen.getByText('No encontramos coincidencias')).toBeInTheDocument();
  });

  it('should let API failures reach the error boundary', async () => {
    mockedGetProducts.mockRejectedValue(new Error('FakeStoreAPI down'));

    await expect(CatalogData({ searchParams: Promise.resolve({}) })).rejects.toThrow(
      'FakeStoreAPI down'
    );
  });
});

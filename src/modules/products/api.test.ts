import { getCategories, getProductById, getProducts } from './api';

const fetchMock = jest.fn();

const jsonResponse = (body: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => (body === undefined ? '' : JSON.stringify(body)),
  }) as Response;

describe('products api', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
  });

  it('should return the products served by the API and cache them for an hour', async () => {
    const apiProducts = [{ id: 99, title: 'From API' }];
    fetchMock.mockResolvedValue(jsonResponse(apiProducts));

    await expect(getProducts()).resolves.toEqual(apiProducts);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://fakestoreapi.com/products',
      expect.objectContaining({ next: { revalidate: 3600 } })
    );
  });

  it('should return the categories served by the API', async () => {
    fetchMock.mockResolvedValue(jsonResponse(['electronics', 'jewelery']));

    await expect(getCategories()).resolves.toEqual(['electronics', 'jewelery']);
  });

  it('should throw when the API responds with an error status', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, 403));

    await expect(getProducts()).rejects.toThrow('/products responded with 403');
  });

  it('should throw when the request itself fails', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));

    await expect(getCategories()).rejects.toThrow('network down');
  });

  it('should throw when the product list comes back empty', async () => {
    fetchMock.mockResolvedValue(jsonResponse(undefined));

    await expect(getProducts()).rejects.toThrow('returned an empty response');
  });

  it('should return the requested product', async () => {
    const product = { id: 1, title: 'Backpack' };
    fetchMock.mockResolvedValue(jsonResponse(product));

    await expect(getProductById(1)).resolves.toEqual(product);
  });

  it('should return null for an unknown id when the API answers with an empty body', async () => {
    fetchMock.mockResolvedValue(jsonResponse(undefined));

    await expect(getProductById(9999)).resolves.toBeNull();
  });
});

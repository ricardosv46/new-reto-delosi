import sitemap, { revalidate } from './sitemap';
import { getCategories, getProducts } from '../modules/products/api';
import { buildProduct } from '../modules/products/testing/buildProduct';

jest.mock('../modules/products/api');

const mockedGetProducts = getProducts as jest.Mock;
const mockedGetCategories = getCategories as jest.Mock;

describe('sitemap', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.SITE_URL = 'https://tienda.com';
  });

  afterEach(() => {
    delete process.env.SITE_URL;
  });

  it('should be regenerated hourly', () => {
    expect(revalidate).toBe(3600);
  });

  it('should list the home page, every category and every product detail page', async () => {
    mockedGetProducts.mockResolvedValue([buildProduct({ id: 1 }), buildProduct({ id: 2 })]);
    mockedGetCategories.mockResolvedValue(['electronics', "men's clothing"]);

    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).toEqual([
      'https://tienda.com',
      'https://tienda.com/?category=electronics',
      "https://tienda.com/?category=men's%20clothing",
      'https://tienda.com/products/1',
      'https://tienda.com/products/2',
    ]);
  });

  it('should still return a valid sitemap with the home page when the API is down', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedGetProducts.mockRejectedValue(new Error('403'));
    mockedGetCategories.mockResolvedValue([]);

    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).toEqual(['https://tienda.com']);
    consoleError.mockRestore();
  });
});

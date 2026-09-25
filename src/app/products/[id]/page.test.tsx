import { render, screen } from '@testing-library/react';
import Page, { generateMetadata, generateStaticParams, revalidate } from './page';
import { getProductById, getProducts } from '../../../modules/products/api';
import { buildProduct } from '../../../modules/products/testing/buildProduct';

jest.mock('../../../modules/products/api');

const mockedGetProducts = getProducts as jest.Mock;
const mockedGetProductById = getProductById as jest.Mock;

const paramsFor = (id: string) => ({ params: Promise.resolve({ id }) });

const product = buildProduct({
  id: 1,
  title: 'Fjallraven Backpack',
  description: 'Your perfect pack for everyday use.',
  image: 'https://fakestoreapi.com/img/1.jpg',
});

describe('product detail page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should refresh the prerendered pages every hour', () => {
    expect(revalidate).toBe(3600);
  });

  describe('generateStaticParams', () => {
    it('should prerender one page per product', async () => {
      mockedGetProducts.mockResolvedValue([product, buildProduct({ id: 2 })]);

      await expect(generateStaticParams()).resolves.toEqual([{ id: '1' }, { id: '2' }]);
    });

    it('should not break the build when the API is down, rendering on demand instead', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockedGetProducts.mockRejectedValue(new Error('403'));

      await expect(generateStaticParams()).resolves.toEqual([]);

      consoleError.mockRestore();
    });
  });

  describe('generateMetadata', () => {
    it('should build the title, description and Open Graph tags from the product', async () => {
      mockedGetProductById.mockResolvedValue(product);

      const metadata = await generateMetadata(paramsFor('1'));

      expect(mockedGetProductById).toHaveBeenCalledWith(1);
      expect(metadata.title).toBe('Fjallraven Backpack | Delosi E-commerce');
      expect(metadata.description).toBe('Your perfect pack for everyday use.');
      expect(metadata.alternates?.canonical).toBe('/products/1');
      expect(metadata.openGraph).toEqual(
        expect.objectContaining({
          url: '/products/1',
          title: 'Fjallraven Backpack',
          description: 'Your perfect pack for everyday use.',
          images: [{ url: 'https://fakestoreapi.com/img/1.jpg', alt: 'Fjallraven Backpack' }],
        })
      );
    });

    it('should fall back to a "not found" title when the product does not exist', async () => {
      mockedGetProductById.mockResolvedValue(null);

      const metadata = await generateMetadata(paramsFor('9999'));

      expect(metadata.title).toBe('Producto no encontrado | Delosi E-commerce');
      expect(metadata.robots).toEqual({ index: false });
    });

    it('should not call the API for an invalid id', async () => {
      const metadata = await generateMetadata(paramsFor('abc'));

      expect(mockedGetProductById).not.toHaveBeenCalled();
      expect(metadata.title).toBe('Producto no encontrado | Delosi E-commerce');
    });

    it('should fall back instead of throwing when the API fails', async () => {
      mockedGetProductById.mockRejectedValue(new Error('403'));

      const metadata = await generateMetadata(paramsFor('1'));

      expect(metadata.title).toBe('Producto no encontrado | Delosi E-commerce');
    });
  });

  describe('page', () => {
    it('should render the product detail for a valid id', async () => {
      mockedGetProductById.mockResolvedValue(product);

      render(await Page(paramsFor('1')));

      expect(
        screen.getByRole('heading', { level: 1, name: 'Fjallraven Backpack' })
      ).toBeInTheDocument();
    });

    it('should trigger a 404 when the product does not exist', async () => {
      mockedGetProductById.mockResolvedValue(null);

      await expect(Page(paramsFor('9999'))).rejects.toMatchObject({
        digest: expect.stringContaining('404'),
      });
    });

    it('should trigger a 404 for a non numeric id without calling the API', async () => {
      await expect(Page(paramsFor('abc'))).rejects.toMatchObject({
        digest: expect.stringContaining('404'),
      });
      expect(mockedGetProductById).not.toHaveBeenCalled();
    });

    it('should let API failures reach the error boundary', async () => {
      mockedGetProductById.mockRejectedValue(new Error('FakeStoreAPI down'));

      await expect(Page(paramsFor('1'))).rejects.toThrow('FakeStoreAPI down');
    });
  });
});

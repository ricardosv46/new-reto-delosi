import { ReactElement } from 'react';
import Page, { generateMetadata } from './page';
import { getCategories } from '../modules/products/api';

jest.mock('../modules/products/api');

const mockedGetCategories = getCategories as jest.Mock;

const metadataFor = (params: Record<string, string | string[] | undefined>) =>
  generateMetadata({ searchParams: Promise.resolve(params) });

describe('catalog page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedGetCategories.mockResolvedValue(['electronics', 'jewelery', "men's clothing"]);
  });

  describe('generateMetadata', () => {
    it('should describe the whole catalog and canonicalize to the home page by default', async () => {
      const metadata = await metadataFor({});

      expect(metadata.title).toBe('Catálogo de Productos | Delosi E-commerce');
      expect(metadata.alternates?.canonical).toBe('/');
      expect(metadata.openGraph).toEqual(
        expect.objectContaining({ url: '/', title: 'Catálogo de Productos | Delosi E-commerce' })
      );
      expect(mockedGetCategories).not.toHaveBeenCalled();
    });

    it('should share the catalog with a 1200x630 preview image', async () => {
      const metadata = await metadataFor({});

      expect(metadata.openGraph?.images).toEqual([
        expect.objectContaining({
          url: expect.stringContaining('w=1200&h=630'),
          width: 1200,
          height: 630,
        }),
      ]);
    });

    it('should give a known category its own title, description and canonical URL', async () => {
      const metadata = await metadataFor({ category: 'jewelery' });

      expect(metadata.title).toBe('Jewelery | Catálogo de Productos | Delosi E-commerce');
      expect(metadata.description).toContain('jewelery');
      expect(metadata.alternates?.canonical).toBe('/?category=jewelery');
      expect(metadata.openGraph).toEqual(expect.objectContaining({ url: '/?category=jewelery' }));
    });

    it('should normalize the category casing and encode special characters', async () => {
      const metadata = await metadataFor({ category: "MEN'S CLOTHING" });

      expect(metadata.alternates?.canonical).toBe("/?category=men's%20clothing");
    });

    it('should canonicalize search and sort variants to the category page, not to themselves', async () => {
      const metadata = await metadataFor({
        category: 'electronics',
        search: 'ssd',
        sortBy: 'price-asc',
      });

      expect(metadata.alternates?.canonical).toBe('/?category=electronics');
    });

    it('should canonicalize a search without category to the home page', async () => {
      const metadata = await metadataFor({ search: 'backpack' });

      expect(metadata.alternates?.canonical).toBe('/');
    });

    it('should fall back to the home page metadata for an unknown category', async () => {
      const metadata = await metadataFor({ category: 'does-not-exist' });

      expect(metadata.title).toBe('Catálogo de Productos | Delosi E-commerce');
      expect(metadata.alternates?.canonical).toBe('/');
    });

    it('should fall back to the home page metadata when the API fails', async () => {
      mockedGetCategories.mockRejectedValue(new Error('403'));

      const metadata = await metadataFor({ category: 'jewelery' });

      expect(metadata.alternates?.canonical).toBe('/');
    });
  });

  describe('page', () => {
    it('should hand the URL search params to the server component that loads the catalog', () => {
      const searchParams = Promise.resolve({ category: 'jewelery' });

      const suspense = Page({ searchParams }) as ReactElement<{
        children: ReactElement<{ searchParams: unknown }>;
      }>;

      expect(suspense.props.children.props.searchParams).toBe(searchParams);
    });
  });
});

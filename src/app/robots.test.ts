import robots from './robots';

describe('robots', () => {
  afterEach(() => {
    delete process.env.SITE_URL;
  });

  it('should allow crawling everything and point to the sitemap of the deployed domain', () => {
    process.env.SITE_URL = 'https://tienda.delosi.com';

    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://tienda.delosi.com/sitemap.xml',
    });
  });
});

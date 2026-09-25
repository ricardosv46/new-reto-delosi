import { parseProductFilters } from './parseProductFilters';

describe('parseProductFilters', () => {
  it('should return empty filters when the URL has no params', () => {
    expect(parseProductFilters({})).toEqual({ search: '', category: '', sortBy: '' });
  });

  it('should read search, category and a valid sortBy from the URL', () => {
    expect(
      parseProductFilters({ search: ' watch ', category: 'electronics', sortBy: 'price-desc' })
    ).toEqual({ search: 'watch', category: 'electronics', sortBy: 'price-desc' });
  });

  it('should ignore an unknown sortBy value', () => {
    expect(parseProductFilters({ sortBy: 'drop-table' }).sortBy).toBe('');
  });

  it('should keep only the first value when a param is repeated', () => {
    expect(parseProductFilters({ category: ['jewelery', 'electronics'] }).category).toBe(
      'jewelery'
    );
  });
});

import { renderHook, act } from '@testing-library/react';
import { useProductFilters } from './useProductFilters';

const replace = jest.fn();
let mockQuery = '';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(mockQuery),
}));

describe('useProductFilters', () => {
  beforeEach(() => {
    replace.mockClear();
    mockQuery = 'category=electronics&search=watch';
  });

  it('should write the new category to the URL while keeping the other filters', () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setCategory('jewelery');
    });

    expect(replace).toHaveBeenCalledWith('/?category=jewelery&search=watch', { scroll: false });
  });

  it('should remove the param from the URL when the value is empty', () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setCategory('');
    });

    expect(replace).toHaveBeenCalledWith('/?search=watch', { scroll: false });
  });

  it('should navigate to the bare pathname when the last filter is cleared', () => {
    mockQuery = 'search=watch';
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setSearch('');
    });

    expect(replace).toHaveBeenCalledWith('/', { scroll: false });
  });

  it('should write the search term to the URL', () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setSearch('backpack');
    });

    expect(replace).toHaveBeenCalledWith('/?category=electronics&search=backpack', {
      scroll: false,
    });
  });

  it('should set sortBy in the URL', () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setSortBy('price-asc');
    });

    expect(replace).toHaveBeenCalledWith('/?category=electronics&search=watch&sortBy=price-asc', {
      scroll: false,
    });
  });

  it('should not be pending when idle', () => {
    const { result } = renderHook(() => useProductFilters());

    expect(result.current.isPending).toBe(false);
  });
});

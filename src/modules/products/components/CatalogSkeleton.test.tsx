import { render } from '@testing-library/react';
import { CatalogSkeleton } from './CatalogSkeleton';

describe('CatalogSkeleton', () => {
  it('should render animated placeholders for the hero, filters and product grid', () => {
    const { container } = render(<CatalogSkeleton />);

    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(10);
  });
});

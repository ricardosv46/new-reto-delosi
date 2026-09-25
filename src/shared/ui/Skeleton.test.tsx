import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('should render an animated placeholder', () => {
    const { container } = render(<Skeleton />);

    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('should merge the extra class names it receives', () => {
    const { container } = render(<Skeleton className="h-4 w-20" />);

    expect(container.firstChild).toHaveClass('animate-pulse', 'h-4', 'w-20');
  });
});

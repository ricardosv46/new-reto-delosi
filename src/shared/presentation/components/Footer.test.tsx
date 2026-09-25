import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('should show the copyright with the current year', () => {
    render(<Footer />);

    expect(
      screen.getByText(new RegExp(`© ${new Date().getFullYear()} Delosi`))
    ).toBeInTheDocument();
  });
});

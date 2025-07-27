import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotFound } from './NotFound';

describe('NotFound page', () => {
  it('renders 404 image and texts', () => {
    render(<NotFound />);
    expect(screen.getByAltText(/404-pikachu/i)).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/Not Found/i)).toBeInTheDocument();
  });
});

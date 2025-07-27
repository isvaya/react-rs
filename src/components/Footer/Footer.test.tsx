// src/components/Footer/Footer.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders GitHub and RS School links with correct hrefs and images', () => {
    render(<Footer />);
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/isvaya');
    expect(screen.getByAltText(/github-logo/i)).toBeInTheDocument();

    const rsLink = screen.getByRole('link', { name: /rs school/i });
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(screen.getByAltText(/rs-logo/i)).toBeInTheDocument();

    expect(screen.getByText(/2025 ⓒ/)).toBeInTheDocument();
  });
});

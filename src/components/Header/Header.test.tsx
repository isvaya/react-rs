import { describe, it, beforeEach, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import { Header } from './Header';
import { PATHS } from '../../enums/enum';

describe('Header component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </MemoryRouter>
    );
  });

  it('renders the logo image and title', () => {
    const img = screen.getByAltText(/pikachu/i);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images.jpeg');

    const title = screen.getByText('PokéApi');
    expect(title).toBeInTheDocument();
  });

  it('renders navigation items with correct links', () => {
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);

    const [mainLink, aboutLink] = links;
    expect(mainLink).toHaveTextContent(/main/i);
    expect(mainLink).toHaveAttribute('href', PATHS.MAIN);

    expect(aboutLink).toHaveTextContent(/about/i);
    expect(aboutLink).toHaveAttribute('href', PATHS.ABOUT);
  });
});

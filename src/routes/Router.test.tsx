import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AppRoutes } from './Router';
import { PATHS } from '../enums/enum';

describe('AppRoutes', () => {
  it('renders the main App page at PATHS.MAIN', () => {
    render(
      <MemoryRouter initialEntries={[PATHS.MAIN]}>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(
      screen.getByPlaceholderText(/Search full name of Pokemon/i)
    ).toBeInTheDocument();
  });

  it('renders the About page at PATHS.ABOUT', () => {
    render(
      <MemoryRouter initialEntries={[PATHS.ABOUT]}>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { level: 1, name: /^About$/i })
    ).toBeInTheDocument();
  });

  it('renders the NotFound page for an unknown path', () => {
    render(
      <MemoryRouter initialEntries={['/this-does-not-exist']}>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/Not Found/i)).toBeInTheDocument();
  });
});

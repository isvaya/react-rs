import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext';

describe('ThemeContext', () => {
  it('useTheme throws if there is no provider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be inside ThemeProvider');
  });

  it('the provider sets the class to <html> and switches the theme', () => {
    document.documentElement.className = '';
    localStorage.clear();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(localStorage.getItem('app-theme')).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('app-theme')).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('light');
  });
});

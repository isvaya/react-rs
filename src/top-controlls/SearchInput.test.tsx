import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchControls } from './SearchInput';

describe('SearchControls', () => {
  const onInputChange = vi.fn();
  const onSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('disable button when searchTemr empty', () => {
    render(
      <SearchControls
        searchTerm=""
        onInputChange={onInputChange}
        onSearch={onSearch}
        loading={false}
        error={null}
        onRetry={onSearch}
      />
    );
    const btn = screen.getByRole('button', { name: /search/i });
    expect(btn).toBeDisabled();
  });

  it('unlock button when searchTerm is full', () => {
    render(
      <SearchControls
        searchTerm="pikachu"
        onInputChange={onInputChange}
        onSearch={onSearch}
        loading={false}
        error={null}
        onRetry={onSearch}
      />
    );
    const btn = screen.getByRole('button', { name: /search/i });
    expect(btn).toBeEnabled();
  });

  it('calls onInputChange when typing in input', () => {
    render(
      <SearchControls
        searchTerm=""
        onInputChange={onInputChange}
        onSearch={onSearch}
        loading={false}
        error={null}
        onRetry={onSearch}
      />
    );
    const input = screen.getByPlaceholderText(
      /Search full name of Pokemon.../i
    );
    fireEvent.change(input, { target: { value: 'charizard' } });
    expect(onInputChange).toHaveBeenCalled();
  });

  it('calls onSearch when click to button', () => {
    render(
      <SearchControls
        searchTerm="bulbasaur"
        onInputChange={onInputChange}
        onSearch={onSearch}
        loading={false}
        error={null}
        onRetry={onSearch}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearch).toHaveBeenCalled();
  });
});

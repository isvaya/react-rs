import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { PokemonList } from './PokemonList';

vi.mock('../servise/pokeApi', () => ({
  fetchPokemonList: vi.fn(),
  fetchPokemonDescription: vi.fn(),
}));

import { fetchPokemonList, fetchPokemonDescription } from '../servise/pokeApi';

const mockFetchPokemonList = fetchPokemonList as unknown as ReturnType<
  typeof vi.fn
>;
const mockFetchPokemonDescription =
  fetchPokemonDescription as unknown as ReturnType<typeof vi.fn>;

describe('PokemonList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows "Loading..." when mounting', () => {
    mockFetchPokemonList.mockReturnValue(new Promise(() => {}));

    render(<PokemonList />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders a list of Pokemon with descriptions on success', async () => {
    mockFetchPokemonList.mockResolvedValue({
      results: [
        { name: 'pikachu', url: 'url1' },
        { name: 'bulbasaur', url: 'url2' },
      ],
    });

    mockFetchPokemonDescription
      .mockResolvedValueOnce('Electric mouse')
      .mockResolvedValueOnce('Seed Pokémon');

    render(<PokemonList />);

    await waitFor(() => {
      expect(screen.getByText(/pikachu-Electric mouse/)).toBeInTheDocument();
      expect(screen.getByText(/bulbasaur-Seed Pokémon/)).toBeInTheDocument();
    });

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
  });

  it('shows error message when fetchPokemonList crashes', async () => {
    mockFetchPokemonList.mockRejectedValue(new Error('Network fail'));

    render(<PokemonList />);

    await waitFor(() => {
      expect(screen.getByText(/Network fail/i)).toBeInTheDocument();
    });
  });

  it('sets "Error loading description" if the description did not load for one element', async () => {
    mockFetchPokemonList.mockResolvedValue({
      results: [
        { name: 'charmander', url: 'u1' },
        { name: 'squirtle', url: 'u2' },
      ],
    });

    mockFetchPokemonDescription
      .mockResolvedValueOnce('Fire lizard')
      .mockRejectedValueOnce(new Error('desc fail'));

    render(<PokemonList />);

    await waitFor(() => {
      expect(screen.getByText(/charmander-Fire lizard/)).toBeInTheDocument();
      expect(
        screen.getByText(/squirtle-Error loading description/)
      ).toBeInTheDocument();
    });
  });
});

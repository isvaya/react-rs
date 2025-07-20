import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from './App';

interface PokemonEntry {
  name: string;
  description: string;
}
interface PokemonListApiResult {
  results: Array<{ name: string }>;
}
type FetchPokemonListFn = (
  limit: number,
  offset: number
) => Promise<PokemonListApiResult>;
type FetchPokemonByNameFn = (name: string) => Promise<PokemonEntry>;

vi.mock('./servise/pokeApi', () => ({
  fetchPokemonList: vi.fn<FetchPokemonListFn>(),
  fetchPokemonByName: vi.fn<FetchPokemonByNameFn>(),
}));

import { fetchPokemonList, fetchPokemonByName } from './servise/pokeApi';

type FetchListMock = ReturnType<typeof vi.fn<FetchPokemonListFn>>;
type FetchByNameMock = ReturnType<typeof vi.fn<FetchPokemonByNameFn>>;

const mockFetchList = fetchPokemonList as unknown as FetchListMock;
const mockFetchByName = fetchPokemonByName as unknown as FetchByNameMock;

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  (console.error as unknown as { mockRestore: () => void }).mockRestore();
});

function getInput(): HTMLInputElement {
  return screen.getByPlaceholderText(/search full name/i) as HTMLInputElement;
}

describe('App integration', () => {
  it('autoloads list on mount with empty lastSearch (list branch)', async () => {
    mockFetchList.mockResolvedValue({
      results: [{ name: 'pikachu' }, { name: 'bulbasaur' }],
    });
    mockFetchByName
      .mockResolvedValueOnce({
        name: 'pikachu',
        description: 'Electric mouse',
      })
      .mockResolvedValueOnce({
        name: 'bulbasaur',
        description: 'Seed',
      });

    render(<App />);

    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
      expect(screen.getByText(/Electric mouse/i)).toBeInTheDocument();
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    });

    await screen.findByRole('button', { name: /search/i });

    expect(mockFetchList).toHaveBeenCalledTimes(1);
    expect(mockFetchByName).toHaveBeenCalledTimes(2);
  });

  it('uses lastSearch from localStorage on mount (single fetch branch)', async () => {
    localStorage.setItem('lastSearch', 'eevee');
    mockFetchByName.mockResolvedValue({
      name: 'eevee',
      description: 'Evolution Pokémon',
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/eevee/i)).toBeInTheDocument();
    });

    const input = getInput();
    expect(input.value).toBe('eevee');
    expect(mockFetchByName).toHaveBeenCalledTimes(1);
    expect(mockFetchList).not.toHaveBeenCalled();
  });

  it('performs search by name and stores term to localStorage', async () => {
    mockFetchList.mockResolvedValue({ results: [] });
    mockFetchByName.mockResolvedValue({
      name: 'charizard',
      description: 'Fire dragon',
    });

    render(<App />);

    const searchButton = await screen.findByRole('button', {
      name: /search/i,
    });

    fireEvent.change(getInput(), { target: { value: 'charizard' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/charizard/i)).toBeInTheDocument();
      expect(screen.getByText(/Fire dragon/i)).toBeInTheDocument();
    });

    expect(localStorage.getItem('lastSearch')).toBe('charizard');
  });

  it('shows error then retry loads new result (resetHistory path)', async () => {
    mockFetchList.mockResolvedValue({ results: [] });

    mockFetchByName.mockRejectedValueOnce(
      new Error('Pokemon "mewthree" not found')
    );

    render(<App />);

    const searchButton = await screen.findByRole('button', {
      name: /search/i,
    });

    fireEvent.change(getInput(), { target: { value: 'mewthree' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Pokemon "mewthree" not found/i)
      ).toBeInTheDocument();
    });

    mockFetchByName.mockResolvedValueOnce({
      name: 'mew',
      description: 'Ancient',
    });

    const retryBtn = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText(/mew/i)).toBeInTheDocument();
    });

    expect(mockFetchByName).toHaveBeenCalledTimes(2);
  });

  it('prepends items on multiple successive searches', async () => {
    mockFetchList.mockResolvedValue({ results: [] });
    mockFetchByName
      .mockResolvedValueOnce({ name: 'ditto', description: 'Copy' })
      .mockResolvedValueOnce({ name: 'snorlax', description: 'Sleep' });

    render(<App />);

    const searchButton = await screen.findByRole('button', {
      name: /search/i,
    });

    fireEvent.change(getInput(), { target: { value: 'ditto' } });
    fireEvent.click(searchButton);
    await waitFor(() => {
      expect(screen.getByText(/ditto/i)).toBeInTheDocument();
    });

    fireEvent.change(getInput(), { target: { value: 'snorlax' } });
    fireEvent.click(searchButton);
    await waitFor(() => {
      expect(screen.getByText(/snorlax/i)).toBeInTheDocument();
    });

    const rowsText = screen.getAllByRole('row').map((r) => r.textContent ?? '');
    const snorlaxIndex = rowsText.findIndex((t) => /snorlax/i.test(t));
    const dittoIndex = rowsText.findIndex((t) => /ditto/i.test(t));
    expect(snorlaxIndex).toBeLessThan(dittoIndex);
  });

  it('shows ErrorBoundary fallback after Crash App! button', async () => {
    mockFetchList.mockResolvedValue({ results: [] });

    render(<App />);

    const crashBtn = screen.getByRole('button', { name: /crash app/i });
    fireEvent.click(crashBtn);

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });
});

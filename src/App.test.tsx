import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

let queryClient: QueryClient;

import { fetchPokemonList, fetchPokemonByName } from './servise/pokeApi';

type FetchListMock = ReturnType<typeof vi.fn<FetchPokemonListFn>>;
type FetchByNameMock = ReturnType<typeof vi.fn<FetchPokemonByNameFn>>;

const mockFetchList = fetchPokemonList as unknown as FetchListMock;
const mockFetchByName = fetchPokemonByName as unknown as FetchByNameMock;

beforeEach(() => {
  vi.clearAllMocks();
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
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

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="*" element={<App />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

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

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="*" element={<App />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

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

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="*" element={<App />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const searchButton = await screen.findByRole('button', {
      name: /search/i,
    });

    fireEvent.change(getInput(), { target: { value: 'charizard' } });
    fireEvent.click(searchButton);

    const nameCell = await screen.findByText(/charizard/i);
    expect(nameCell).toBeInTheDocument();
    expect(screen.getByText(/Fire dragon/i)).toBeInTheDocument();

    expect(localStorage.getItem('lastSearch')).toBe('charizard');
  });

  it('shows error then retry loads new result (resetHistory path)', async () => {
    mockFetchList.mockResolvedValue({ results: [] });

    mockFetchByName.mockRejectedValueOnce(
      new Error('Pokemon "mewthree" not found')
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="*" element={<App />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

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
      expect(screen.getByText(/Ancient/i)).toBeInTheDocument();
    });

    expect(mockFetchByName).toHaveBeenCalledTimes(2);
  });

  it('replaces list on successive manual searches', async () => {
    mockFetchList.mockResolvedValue({ results: [] });
    mockFetchByName
      .mockResolvedValueOnce({ name: 'ditto', description: 'Copy' })
      .mockResolvedValueOnce({ name: 'snorlax', description: 'Sleep' });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="*" element={<App />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

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

    expect(screen.queryByText(/ditto/i)).toBeNull();
  });
});

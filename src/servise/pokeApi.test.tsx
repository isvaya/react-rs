import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  fetchPokemonList,
  fetchPokemonDescription,
  fetchPokemonByName,
} from './pokeApi';

type JsonValue = unknown;
interface MockResponse {
  ok: boolean;
  status: number;
  json: () => Promise<JsonValue>;
}

afterEach(() => {
  vi.restoreAllMocks();
});

const mockFetch = (impls: MockResponse[]) => {
  let call = 0;
  const fn = vi.fn<(...args: unknown[]) => Promise<MockResponse>>(() => {
    const response = impls[call];
    call += 1;
    if (!response) {
      return Promise.reject(new Error('Unexpected fetch call'));
    }
    return Promise.resolve(response);
  });
  (globalThis.fetch as unknown as typeof fetch) = fn as unknown as typeof fetch;
  return fn;
};

describe('fetchPokemonList', () => {
  it('returns a list of Pokemon on success', async () => {
    const listPayload = {
      count: 2,
      next: null,
      previous: null,
      results: [
        { name: 'pikachu', url: 'url1' },
        { name: 'bulbasaur', url: 'url2' },
      ],
    };

    mockFetch([
      {
        ok: true,
        status: 200,
        json: async () => listPayload,
      },
    ]);

    const data = await fetchPokemonList(2, 0);
    expect(data.results).toHaveLength(2);
    expect(data.results[0].name).toBe('pikachu');
  });

  it('throws an error if the answer is not ok', async () => {
    mockFetch([
      {
        ok: false,
        status: 500,
        json: async () => ({}),
      },
    ]);

    await expect(fetchPokemonList(1, 0)).rejects.toThrow(/HTTP error: 500/);
  });
});

describe('fetchPokemonDescription', () => {
  it('returns the English description and cleans up spaces', async () => {
    const pokemonPayload = { species: { url: 'https://pokeapi/species/25' } };
    const speciesPayload = {
      flavor_text_entries: [
        {
          flavor_text: 'Cute  mouse \nPokemon.',
          language: { name: 'en' },
        },
      ],
    };

    mockFetch([
      {
        ok: true,
        status: 200,
        json: async () => pokemonPayload,
      },
      {
        ok: true,
        status: 200,
        json: async () => speciesPayload,
      },
    ]);

    const desc = await fetchPokemonDescription('https://pokeapi/pokemon/25');
    expect(desc).toBe('Cute mouse Pokemon.');
  });

  it('returns "No description" if there is no English entry', async () => {
    const pokemonPayload = { species: { url: 'https://pokeapi/species/1' } };
    const speciesPayload = {
      flavor_text_entries: [
        {
          flavor_text: 'Beschreibung',
          language: { name: 'de' },
        },
      ],
    };

    mockFetch([
      { ok: true, status: 200, json: async () => pokemonPayload },
      { ok: true, status: 200, json: async () => speciesPayload },
    ]);

    const desc = await fetchPokemonDescription('https://pokeapi/pokemon/1');
    expect(desc).toBe('No description');
  });

  it('throws an error if the first fetch is not ok', async () => {
    mockFetch([{ ok: false, status: 404, json: async () => ({}) }]);

    await expect(
      fetchPokemonDescription('https://pokeapi/pokemon/999')
    ).rejects.toThrow(/HTTP error: 404/);
  });

  it('throws an error if the second fetch is not ok', async () => {
    const pokemonPayload = { species: { url: 'https://pokeapi/species/2' } };

    mockFetch([
      { ok: true, status: 200, json: async () => pokemonPayload },
      { ok: false, status: 503, json: async () => ({}) },
    ]);

    await expect(
      fetchPokemonDescription('https://pokeapi/pokemon/2')
    ).rejects.toThrow(/HTTP error: 503/);
  });
});

describe('fetchPokemonByName', () => {
  it('returns an object with a name and description on success', async () => {
    const pokemonPayload = { species: { url: 'https://pokeapi/species/25' } };
    const speciesPayload = {
      flavor_text_entries: [
        {
          flavor_text: 'Electric mouse',
          language: { name: 'en' },
        },
      ],
    };

    mockFetch([
      { ok: true, status: 200, json: async () => pokemonPayload },
      { ok: true, status: 200, json: async () => speciesPayload },
    ]);

    const result = await fetchPokemonByName('pikachu');
    expect(result).toEqual({
      name: 'pikachu',
      description: 'Electric mouse',
    });
  });

  it('throws "not found" if the inner function fails', async () => {
    mockFetch([{ ok: false, status: 404, json: async () => ({}) }]);

    await expect(fetchPokemonByName('missingmon')).rejects.toThrow(
      /Pokemon "missingmon" not found/
    );
  });
});

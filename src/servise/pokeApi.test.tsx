import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  fetchPokemonList,
  fetchPokemonDescription,
  fetchPokemonByName,
} from './pokeApi';
import type {
  PokemonApiResponse,
  PokemonSpeciesResponse,
  PokemonDetail,
} from '../interface/interface';
import { fetchPokemonDetail } from './pokeApi';

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

describe('fetchPokemonDetail', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns full detail with official artwork', async () => {
    vi.useFakeTimers();

    const apiRes: PokemonApiResponse = {
      name: 'pikachu',
      species: { url: 'https://pokeapi.co/api/v2/pokemon-species/25/' },
      sprites: {
        other: { 'official-artwork': { front_default: 'art.png' } },
        front_default: 'front.png',
      },
      abilities: [{ ability: { name: 'static' } }],
      types: [{ type: { name: 'electric' } }],
      stats: [{ stat: { name: 'speed' }, base_stat: 90 }],
    };

    const speciesRes: PokemonSpeciesResponse = {
      flavor_text_entries: [
        { flavor_text: 'Electric mouse', language: { name: 'en' } },
        { flavor_text: 'Мышь', language: { name: 'ru' } },
      ],
    };

    const fetchMock = mockFetch([
      { ok: true, status: 200, json: async () => apiRes },
      { ok: true, status: 200, json: async () => speciesRes },
    ]);

    const promise = fetchPokemonDetail('pikachu');
    vi.advanceTimersByTime(1500);

    const detail: PokemonDetail = await promise;

    expect(fetchMock).toHaveBeenCalledTimes(2);

    expect(detail).toEqual({
      name: 'pikachu',
      image: 'art.png',
      description: 'Electric mouse',
      abilities: ['static'],
      types: ['electric'],
      stats: [{ name: 'speed', value: 90 }],
    });
  });

  it('falls back to front_default if official artwork missing', async () => {
    vi.useFakeTimers();

    const apiRes: PokemonApiResponse = {
      name: 'eevee',
      species: { url: 'url-species' },
      sprites: {
        other: {},
        front_default: 'front.png',
      },
      abilities: [{ ability: { name: 'run-away' } }],
      types: [{ type: { name: 'normal' } }],
      stats: [{ stat: { name: 'hp' }, base_stat: 55 }],
    };
    const speciesRes: PokemonSpeciesResponse = {
      flavor_text_entries: [
        { flavor_text: 'Evolution Pokémon', language: { name: 'en' } },
      ],
    };

    mockFetch([
      { ok: true, status: 200, json: async () => apiRes },
      { ok: true, status: 200, json: async () => speciesRes },
    ]);

    const promise = fetchPokemonDetail('eevee');
    vi.advanceTimersByTime(1500);
    const detail = await promise;

    expect(detail.image).toBe('front.png');
  });

  it('uses front_default when official-artwork is missing', async () => {
    vi.useFakeTimers();

    const apiRes: PokemonApiResponse = {
      name: 'eevee',
      species: { url: 'url-species' },
      sprites: {
        other: undefined,
        front_default: 'front.png',
      },
      abilities: [{ ability: { name: 'run-away' } }],
      types: [{ type: { name: 'normal' } }],
      stats: [{ stat: { name: 'hp' }, base_stat: 55 }],
    };

    const speciesRes: PokemonSpeciesResponse = {
      flavor_text_entries: [
        { flavor_text: 'Evolution Pokémon', language: { name: 'en' } },
      ],
    };

    mockFetch([
      { ok: true, status: 200, json: async () => apiRes },
      { ok: true, status: 200, json: async () => speciesRes },
    ]);

    const promise = fetchPokemonDetail('eevee');
    vi.advanceTimersByTime(1500);
    const detail = await promise;

    expect(detail.image).toBe('front.png');
  });

  it('throws if first fetch (getJSON) fails', async () => {
    vi.useFakeTimers();
    mockFetch([{ ok: false, status: 404, json: async () => ({}) }]);

    const promise = fetchPokemonDetail('none');
    vi.advanceTimersByTime(1500);

    await expect(promise).rejects.toThrow(/Network error: 404/);
  });

  it('falls back to empty string when no sprites at all', async () => {
    vi.useFakeTimers();

    const apiRes: PokemonApiResponse = {
      name: 'missingno',
      species: { url: 'url-species' },
      sprites: {
        other: undefined,
        front_default: null,
      },
      abilities: [],
      types: [],
      stats: [],
    };

    const speciesRes: PokemonSpeciesResponse = {
      flavor_text_entries: [
        { flavor_text: 'Glitch', language: { name: 'en' } },
      ],
    };

    mockFetch([
      { ok: true, status: 200, json: async () => apiRes },
      { ok: true, status: 200, json: async () => speciesRes },
    ]);

    const promise = fetchPokemonDetail('missingno');
    vi.advanceTimersByTime(1500);
    const detail = await promise;

    expect(detail.image).toBe('');
  });
});

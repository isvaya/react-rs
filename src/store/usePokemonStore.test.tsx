import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { usePokemonStore } from './usePokemonStore';
import type { PokemonListResponse } from '../interface/interface';
import * as api from '../servise/pokeApi';

describe('usePokemonStore', () => {
  beforeEach(() => {
    usePokemonStore.setState({
      loading: false,
      error: null,
      searchTerm: '',
      page: 1,
      history: [],
      selected: {},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('must have a valid initial state', () => {
    const s = usePokemonStore.getState();
    expect(s.loading).toBe(false);
    expect(s.error).toBeNull();
    expect(s.searchTerm).toBe('');
    expect(s.page).toBe(1);
    expect(s.history).toEqual([]);
    expect(s.selected).toEqual({});
  });

  it('toggleSelect adds and removes an element', () => {
    const item = { name: 'a', description: 'd' };
    usePokemonStore.getState().toggleSelect(item);
    expect(usePokemonStore.getState().selected).toHaveProperty('a', item);
    usePokemonStore.getState().toggleSelect(item);
    expect(usePokemonStore.getState().selected).not.toHaveProperty('a');
  });

  it('clearAll clears selected', () => {
    usePokemonStore.getState().toggleSelect({ name: 'x', description: 'd' });
    usePokemonStore.getState().toggleSelect({ name: 'y', description: 'd2' });
    expect(Object.keys(usePokemonStore.getState().selected)).toHaveLength(2);

    usePokemonStore.getState().clearAll();
    expect(usePokemonStore.getState().selected).toEqual({});
  });

  it('load loads the list when searchTerm is empty', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'p', url: 'u' }],
    } as PokemonListResponse);
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue({
      name: 'p',
      description: 'desc',
    });

    usePokemonStore.setState({ searchTerm: '', page: 2 });
    const promise = usePokemonStore.getState().load();

    expect(usePokemonStore.getState().loading).toBe(true);

    await promise;
    const s = usePokemonStore.getState();
    expect(s.history).toEqual([{ name: 'p', description: 'desc' }]);
    expect(s.loading).toBe(false);
    expect(s.error).toBeNull();
  });

  it('load loads a single element when searchTerm is not empty', async () => {
    vi.spyOn(api, 'fetchPokemonByName').mockResolvedValue({
      name: 'z',
      description: 'zzz',
    });
    usePokemonStore.setState({ searchTerm: 'z' });
    await usePokemonStore.getState().load();

    expect(usePokemonStore.getState().history).toEqual([
      { name: 'z', description: 'zzz' },
    ]);
  });

  it('load sets error when API error occurs', async () => {
    vi.spyOn(api, 'fetchPokemonList').mockRejectedValue(new Error('fail'));
    usePokemonStore.setState({ searchTerm: '', page: 1 });
    await usePokemonStore.getState().load();
    expect(usePokemonStore.getState().error).toBe('fail');
  });

  it('retry calls load', async () => {
    const loadSpy = vi.spyOn(usePokemonStore.getState(), 'load');
    await usePokemonStore.getState().retry();
    expect(loadSpy).toHaveBeenCalled();
  });
});

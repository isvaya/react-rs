// src/store/usePokemonStore.ts
import { create } from 'zustand';
import { fetchPokemonList, fetchPokemonByName } from '../servise/pokeApi';
import type { PokemonWithDescription } from '../interface/interface';

interface PokemonState {
  loading: boolean;
  error: string | null;
  searchTerm: string;
  page: number;
  history: PokemonWithDescription[];
  selected: Record<string, PokemonWithDescription>;

  setSearchTerm: (term: string) => void;
  setPage: (p: number) => void;
  retry: () => Promise<void>;
  load: () => Promise<void>;
  toggleSelect: (p: PokemonWithDescription) => void;
  clearAll: () => void;
}

export const usePokemonStore = create<PokemonState>((set, get) => ({
  loading: false,
  error: null,
  searchTerm: localStorage.getItem('lastSearch') ?? '',
  page: 1,
  history: [],
  selected: {},

  setSearchTerm: (term: string) => {
    localStorage.setItem('lastSearch', term);
    set({ searchTerm: term, page: 1 });
    get().load();
  },

  setPage: (p: number) => {
    set({ page: p });
    get().load();
  },

  retry: async () => {
    await get().load();
  },

  load: async () => {
    set({ loading: true, error: null });
    try {
      let list: PokemonWithDescription[];
      if (!get().searchTerm) {
        const offset = (get().page - 1) * 20;
        const res = await fetchPokemonList(20, offset);
        list = await Promise.all(
          res.results.map((r) => fetchPokemonByName(r.name))
        );
      } else {
        const one = await fetchPokemonByName(get().searchTerm);
        list = [one];
      }
      set({ history: list });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : String(e) });
    } finally {
      set({ loading: false });
    }
  },

  toggleSelect: (p) => {
    const sel = get().selected;
    if (sel[p.name]) {
      const newSel = Object.fromEntries(
        Object.entries(sel).filter(([k]) => k !== p.name)
      );
      set({ selected: newSel });
    } else {
      set({ selected: { ...sel, [p.name]: p } });
    }
  },

  clearAll: () => set({ selected: {} }),
}));

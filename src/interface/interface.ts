export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export interface PokemonWithDescription {
  name: string;
  description: string;
}

export interface State {
  loading: boolean;
  error: string | null;
  pokemons: PokemonWithDescription[];
}

export interface PokemonSpeciesResponse {
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
}

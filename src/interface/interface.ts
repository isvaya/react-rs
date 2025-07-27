/* istanbul ignore file */
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

export interface SearchPokemonState {
  searchTerm: string;
  history: PokemonWithDescription[];
  loading: boolean;
  error: string | null;
  crash: boolean;
}

export interface SearchResultsProps {
  history: PokemonWithDescription[];
  loading: boolean;
}

export interface SearchControlsProps {
  searchTerm: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

export interface PokemonApiResponse {
  name: string;
  species: { url: string };
  sprites: PokemonSprites;
  abilities: Array<{
    ability: { name: string };
  }>;
  types: Array<{
    type: { name: string };
  }>;
  stats: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
}

export interface PokemonSpeciesResponse {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
}

export interface PokemonDetail {
  name: string;
  image: string;
  abilities: string[];
  types: string[];
  stats: Array<{
    name: string;
    value: number;
  }>;
  description: string;
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
}

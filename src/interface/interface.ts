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
  error: string | null;
  loading: boolean;
  onRetry: () => void;
}

export interface SearchControlsProps {
  searchTerm: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  loading: boolean;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

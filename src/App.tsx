import './App.css';
import type { SearchPokemonState } from './interface/interface';
import React from 'react';
import { SearchControls } from './top-controlls/SearchInput';
import { SearchResult } from './result/SearchResults';
import { fetchPokemonByName } from './servise/pokeApi';

export class App extends React.Component<unknown, SearchPokemonState> {
  state: SearchPokemonState = {
    searchTerm: '',
    history: [],
    loading: false,
    error: null,
  };

  private handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: e.target.value });
  };

  private handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const name = this.state.searchTerm.trim();
    if (!name) return;

    this.setState({ loading: true, error: null });

    try {
      console.log('Looking for pokemon:', this.state.searchTerm);
      const entry = await fetchPokemonByName(name);
      localStorage.setItem('lastSearch', name);
      this.setState((prev) => ({
        history: [entry, ...prev.history],
        loading: false,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.setState({ error: message, loading: false });
    }
  };

  componentDidMount() {
    const saved = localStorage.getItem('lastSearch');
    if (saved) {
      this.setState({ searchTerm: saved });
    }
  }

  render() {
    return (
      <>
        <SearchControls
          searchTerm={this.state.searchTerm}
          onInputChange={this.handleInputChange}
          onSearch={this.handleSearch}
          loading={this.state.loading}
        />
        <SearchResult
          history={this.state.history}
          error={this.state.error}
          onRetry={this.handleSearch}
        />
      </>
    );
  }
}

import './App.css';
import type { SearchPokemonState } from './interface/interface';
import React from 'react';
import { SearchControls } from './top-controlls/SearchInput';
import { SearchResult } from './result/SearchResults';
import { fetchPokemonByName, fetchPokemonList } from './servise/pokeApi';
import { ErrorBoundary } from './errorCatching/ErrorBoundary';
import { Bomb } from './errorCatching/CrashButton';

export class App extends React.Component<unknown, SearchPokemonState> {
  state: SearchPokemonState = {
    searchTerm: '',
    history: [],
    loading: false,
    error: null,
    crash: false,
  };

  private loadResults = async (term: string) => {
    this.setState({ loading: true, error: null });

    try {
      let entries: { name: string; description: string }[];

      if (term === '') {
        const list = await fetchPokemonList(20, 0);
        entries = await Promise.all(
          list.results.map((r) => fetchPokemonByName(r.name))
        );
      } else {
        const single = await fetchPokemonByName(term);
        entries = [single];
      }

      this.setState((prev) => ({
        history: [...entries, ...prev.history],
        loading: false,
      }));
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      this.setState({ error: message, loading: false });
    }
  };

  private handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: e.target.value });
  };

  private handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const term = this.state.searchTerm.trim();

    if (!term && term !== '') return;
    localStorage.setItem('lastSearch', term);
    await this.loadResults(term);
  };

  componentDidMount() {
    const saved = localStorage.getItem('lastSearch') || '';
    this.setState({ searchTerm: saved }, () => {
      this.loadResults(saved);
    });
  }

  render() {
    return (
      <ErrorBoundary>
        <SearchControls
          searchTerm={this.state.searchTerm}
          onInputChange={this.handleInputChange}
          onSearch={this.handleSearch}
          loading={this.state.loading}
        />
        <SearchResult
          history={this.state.history}
          error={this.state.error}
          loading={this.state.loading}
          onRetry={this.handleSearch}
        />
        <button onClick={() => this.setState({ crash: true })}>
          Crash App!
        </button>
        {this.state.crash && <Bomb />}
      </ErrorBoundary>
    );
  }
}

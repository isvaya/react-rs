import React from 'react';
import type { SearchPokemonState } from '../interface/interface';
import { fetchPokemonByName } from '../servise/pokeApi';

export class SearchControls extends React.Component<
  unknown,
  SearchPokemonState
> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      searchTerm: '',
      history: [],
      loading: false,
      error: null,
    };
  }

  private handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: e.target.value });
  };

  private handleSearch = async () => {
    const name = this.state.searchTerm.trim();
    if (!name) return;

    this.setState({ loading: true, error: null });

    try {
      console.log('Looking for pokemon:', this.state.searchTerm);
      const entry = await fetchPokemonByName(name);
      this.setState((prev) => ({
        history: [entry, ...prev.history],
        loading: false,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.setState({ error: message, loading: false });
    }
  };

  render() {
    return (
      <div>
        <input
          value={this.state.searchTerm}
          onChange={this.handleInputChange}
          type="text"
          placeholder="Search..."
        />
        <button onClick={this.handleSearch}>Search</button>
      </div>
    );
  }
}

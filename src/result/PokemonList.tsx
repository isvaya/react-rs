import React from 'react';
import { fetchPokemonList } from '../servise/pokeApi';
import type { State, Pokemon } from '../interface/interface';

export class PokemonList extends React.Component<unknown, State> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      pokemons: [],
    };
  }

  componentDidMount(): void {
    this.loadPokemons();
  }

  async loadPokemons() {
    this.setState({ loading: true, error: null });
    try {
      const data = await fetchPokemonList(20, 0);
      this.setState({ pokemons: data.results, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.setState({ error: message, loading: false });
    }
  }

  render() {
    const { loading, error, pokemons } = this.state;

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
      <ul>
        {pokemons.map((p: Pokemon) => (
          <li key={p.name}>
            {p.name}-{p.url}
          </li>
        ))}
      </ul>
    );
  }
}

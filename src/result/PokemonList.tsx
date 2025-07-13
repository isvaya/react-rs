import React from 'react';
import { fetchPokemonDescription, fetchPokemonList } from '../servise/pokeApi';
import type { State, PokemonWithDescription } from '../interface/interface';

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
    this.loadPokemonsWithDescription();
  }

  private async loadPokemonsWithDescription() {
    this.setState({ loading: true, error: null });
    try {
      const listData = await fetchPokemonList(20, 0);

      const detailed: PokemonWithDescription[] = await Promise.all(
        listData.results.map(async ({ name, url }) => {
          let description: string;
          try {
            description = await fetchPokemonDescription(url);
          } catch {
            description = 'Error loading description';
          }
          return { name, description };
        })
      );

      this.setState({
        pokemons: detailed,
        loading: false,
      });
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
        {pokemons.map((p) => (
          <li key={p.name}>
            {p.name}-{p.description}
          </li>
        ))}
      </ul>
    );
  }
}

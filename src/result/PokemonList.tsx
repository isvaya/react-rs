import React, { useEffect, useState } from 'react';
import { fetchPokemonDescription, fetchPokemonList } from '../servise/pokeApi';
import type { PokemonWithDescription } from '../interface/interface';

export const PokemonList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pokemons, setPokemons] = useState<PokemonWithDescription[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadPokemons = async () => {
      setLoading(true);
      setError(null);

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

        if (!cancelled) {
          setPokemons(detailed);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err);
          setError(message);
          setLoading(false);
        }
      }
    };

    loadPokemons();

    return () => {
      cancelled = true;
    };
  }, []);

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
};

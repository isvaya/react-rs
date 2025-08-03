import type { SearchResultsProps } from '../interface/interface';
import React from 'react';
import { PokemonCardRow } from '../card/PokemonCard';

export const SearchResult: React.FC<SearchResultsProps> = ({
  history,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bottom-section">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="bottom-section">
      <h4>RESULTS:</h4>
      <div className="results-container">
        <table>
          <thead>
            <tr className="tr-results">
              <th className="select">Select</th>
              <th className="name">Pokémon&apos;s name</th>
              <th className="description">Pokémon&apos;s description</th>
            </tr>
          </thead>
          <tbody>
            {history.map((p) => (
              <PokemonCardRow key={p.name} {...p} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

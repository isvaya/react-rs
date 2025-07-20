import type { SearchResultsProps } from '../interface/interface';
import React from 'react';
import { PokemonCardRow } from '../card/PokemonCard';

export class SearchResult extends React.Component<SearchResultsProps> {
  render() {
    const { history, loading } = this.props;

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
  }
}

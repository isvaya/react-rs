import type { SearchResultsProps } from '../interface/interface';
import React from 'react';

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
              {history.map((p, idx) => (
                <tr key={idx}>
                  <td className="name-result">{p.name}</td>
                  <td className="description-result">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

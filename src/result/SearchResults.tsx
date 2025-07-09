import type { SearchResultsProps } from '../interface/interface';
import React from 'react';

export class SearchResult extends React.Component<SearchResultsProps> {
  render() {
    const { history, error, loading, onRetry } = this.props;

    if (loading) {
      return <p>Loading...</p>;
    }

    return (
      <div>
        {error ? (
          <div>
            <div className="error">{error}</div>
            <div onClick={onRetry}>Try again!</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {history.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

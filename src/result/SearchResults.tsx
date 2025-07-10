import type { SearchResultsProps } from '../interface/interface';
import React from 'react';

export class SearchResult extends React.Component<SearchResultsProps> {
  render() {
    const { history, error, onRetry } = this.props;
    if (error) {
      return (
        <div className="bottom-section">
          <div className="error">{error}</div>
          <button onClick={onRetry}>Try again!</button>
        </div>
      );
    }
    return (
      <div className="bottom-section">
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
      </div>
    );
  }
}

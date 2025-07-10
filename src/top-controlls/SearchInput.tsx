import React from 'react';
import type { SearchControlsProps } from '../interface/interface';

export class SearchControls extends React.Component<SearchControlsProps> {
  render() {
    const { searchTerm, onInputChange, onSearch, loading } = this.props;
    return (
      <form className="top-section" onSubmit={onSearch}>
        <input
          value={searchTerm}
          onChange={onInputChange}
          type="text"
          placeholder="Search..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>
    );
  }
}

import React from 'react';
import type { SearchControlsProps } from '../interface/interface';

export const SearchControls: React.FC<SearchControlsProps> = ({
  searchTerm,
  onInputChange,
  onSearch,
  loading,
  error,
  onRetry,
}) => {
  const isDisabled = loading || searchTerm.trim() === '';

  return (
    <form className="top-section" onSubmit={onSearch}>
      <div className="logo-title">
        <img className="pokemon-img" src="/images.jpeg" alt="pikachu" />
        <h1 className="title-pokemon">PokéApi</h1>
        <h4>Find your Pokémon</h4>
      </div>
      <input
        value={searchTerm}
        onChange={onInputChange}
        type="text"
        placeholder="Search full name of Pokemon..."
        className="search-input"
      />
      <button
        type="submit"
        disabled={isDisabled}
        className="search-button button"
      >
        {loading ? 'Loading...' : 'Search'}
      </button>
      {error && (
        <div className="error-section">
          <span className="error-message">{error}</span>
          <button
            type="button"
            onClick={onRetry}
            className="retry-button button"
          >
            Try again
          </button>
        </div>
      )}
    </form>
  );
};

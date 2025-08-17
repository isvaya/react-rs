'use client';

import React from 'react';
import type { SearchControlsProps } from '../interface/interface';
import { useTranslations } from 'next-intl';

export const SearchControls: React.FC<SearchControlsProps> = ({
  searchTerm,
  onInputChange,
  onSearch,
  loading,
  error,
  onRetry,
}) => {
  const isDisabled = loading || searchTerm.trim() === '';
  const t = useTranslations('Top-controls');

  return (
    <form className="top-section" onSubmit={onSearch}>
      <div className="logo-title">
        <h4>{t('title')}</h4>
      </div>
      <input
        value={searchTerm}
        onChange={onInputChange}
        type="text"
        placeholder={t('placeholder')}
        className="search-input"
      />
      <button
        type="submit"
        disabled={isDisabled}
        className="search-button button"
      >
        {loading ? t('loading') : t('search')}
      </button>
      {error && (
        <div className="error-section">
          <span className="error-message">{error}</span>
          <button
            type="button"
            onClick={onRetry}
            className="retry-button button"
          >
            {t('retry')}
          </button>
        </div>
      )}
    </form>
  );
};

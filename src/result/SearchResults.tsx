'use client';

import type { SearchResultsProps } from '../interface/interface';
import React from 'react';
import { PokemonCardRow } from '../card/PokemonCard';
import { useTranslations } from 'next-intl';

export const SearchResult: React.FC<SearchResultsProps> = ({
  history,
  loading,
}) => {
  const t = useTranslations('Results');

  if (loading) {
    return (
      <div className="bottom-section">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="bottom-section">
      <h4>{t('title')}</h4>
      <div className="results-container">
        <table>
          <thead>
            <tr className="tr-results">
              <th className="select">{t('select')}</th>
              <th className="name">{t('name')}</th>
              <th className="description">{t('description')}</th>
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

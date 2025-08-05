import './App.css';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueries } from '@tanstack/react-query';
import { SearchControls } from './top-controlls/SearchInput';
import { SearchResult } from './result/SearchResults';
import { fetchPokemonByName, fetchPokemonList } from './servise/pokeApi';
import { ErrorBoundary } from './errorCatching/ErrorBoundary';
import { Bomb } from './errorCatching/CrashButton';

import { useSearchQuery } from './hooks/useSearchQuery';
import { SelectionPopup } from './components/SelectionPopup/SelectionPopup';

import type { PokemonListResponse } from './interface/interface';

export const App: React.FC = () => {
  const [crash, setCrash] = useState(false);

  const [searchQuery, setSearchQuery] = useSearchQuery();
  const [params, setParams] = useSearchParams();
  const pageParam = parseInt(params.get('page') ?? '1', 10);
  const pageSize = 5;

  const [draft, setDraft] = useState(searchQuery);
  useEffect(() => {
    setDraft(searchQuery);
  }, [searchQuery]);

  const listQuery = useQuery<PokemonListResponse, Error>({
    queryKey: ['pokemonList', pageParam],
    queryFn: () => fetchPokemonList(pageSize, (pageParam - 1) * pageSize),
  });

  const detailQueries = useQueries({
    queries: searchQuery
      ? [
          {
            queryKey: ['pokemon', searchQuery] as const,
            queryFn: () => fetchPokemonByName(searchQuery),
          },
        ]
      : (listQuery.data?.results.map((r) => ({
          queryKey: ['pokemon', r.name] as const,
          queryFn: () => fetchPokemonByName(r.name),
        })) ?? []),
  });

  const isLoading =
    listQuery.isLoading || detailQueries.some((q) => q.isLoading);
  const error =
    (listQuery.error as Error | null) ||
    (detailQueries.find((q) => q.error)?.error as Error | null);

  const history = detailQueries
    .map((q) => q.data)
    .filter((d): d is { name: string; description: string } => Boolean(d));

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSearchQuery(draft);
    setParams({ search: draft, page: '1' });
  };

  const handleRetry = () => {
    if (searchQuery) {
      detailQueries.forEach((q) => q.refetch());
    } else {
      listQuery.refetch();
    }
  };

  const goPage = (newPage: number) => {
    setParams({ search: searchQuery, page: String(newPage) });
  };

  return (
    <ErrorBoundary>
      <SearchControls
        searchTerm={draft}
        onInputChange={(e) => setDraft(e.target.value)}
        onSearch={handleSubmit}
        loading={isLoading}
        error={error ? error.message : null}
        onRetry={handleRetry}
      />

      {isLoading && (
        <div className="bottom-section">
          <div className="spinner" />
        </div>
      )}

      {!isLoading && history.length > 0 && (
        <SearchResult history={history} loading={false} />
      )}

      {searchQuery === '' && listQuery.data && history.length > 0 && (
        <div className="pagination">
          <button
            disabled={pageParam <= 1}
            onClick={() => goPage(pageParam - 1)}
          >
            Prev
          </button>
          <span>Page {pageParam}</span>
          <button
            disabled={history.length < pageSize}
            onClick={() => goPage(pageParam + 1)}
          >
            Next
          </button>
        </div>
      )}

      <SelectionPopup />

      <button className="crash-button" onClick={() => setCrash(true)}>
        Crash App!
      </button>
      {crash && <Bomb />}
    </ErrorBoundary>
  );
};

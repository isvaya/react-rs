'use client';

import './App.css';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';

import { SearchControls } from './top-controlls/SearchInput';
import { SearchResult } from './result/SearchResults';
import { fetchPokemonByName, fetchPokemonList } from './servise/pokeApi';
import { ErrorBoundary } from './errorCatching/ErrorBoundary';
import { Bomb } from './errorCatching/CrashButton';
import { SelectionPopup } from './components/SelectionPopup/SelectionPopup';

import type { PokemonListResponse } from './interface/interface';

export const App: React.FC = () => {
  const qc = useQueryClient();
  const [crash, setCrash] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const searchRaw = searchParams?.get('search') ?? '';
  const pageParam = parseInt(searchParams?.get('page') ?? '1', 10);
  const pageSize = 5;

  const [searchQuery, setSearchQuery] = useState(searchRaw);
  const [draft, setDraft] = useState(searchRaw);

  useEffect(() => {
    setDraft(searchRaw);
  }, [searchRaw]);

  const listQuery = useQuery<PokemonListResponse, Error>({
    queryKey: ['pokemonList', pageParam],
    queryFn: () => fetchPokemonList(pageSize, (pageParam - 1) * pageSize),
    enabled: searchQuery === '',
    staleTime: 1000 * 60 * 5,
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

  const setSearchParams = (search: string, page: string) => {
    const newParams = new URLSearchParams();
    newParams.set('search', search);
    newParams.set('page', page);
    router.push(`/?${newParams.toString()}`);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSearchQuery(draft);
    setSearchParams(draft, '1');
  };

  const handleRetry = () => {
    if (searchQuery) {
      detailQueries.forEach((q) => q.refetch());
    } else {
      listQuery.refetch();
    }
  };

  const goPage = (newPage: number) => {
    setSearchParams(searchQuery, String(newPage));
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

      <div className="controls">
        <button
          onClick={() => qc.invalidateQueries({ queryKey: ['pokemonList'] })}
        >
          Update list
        </button>
        {searchQuery && (
          <button
            onClick={() =>
              qc.invalidateQueries({ queryKey: ['pokemon', searchQuery] })
            }
          >
            Update {searchQuery}
          </button>
        )}
      </div>

      <button className="crash-button" onClick={() => setCrash(true)}>
        Crash App!
      </button>
      {crash && <Bomb />}
    </ErrorBoundary>
  );
};

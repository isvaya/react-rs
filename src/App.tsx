import './App.css';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchControls } from './top-controlls/SearchInput';
import { SearchResult } from './result/SearchResults';
import { fetchPokemonByName, fetchPokemonList } from './servise/pokeApi';
import { ErrorBoundary } from './errorCatching/ErrorBoundary';
import { Bomb } from './errorCatching/CrashButton';

import { useSearchQuery } from './hooks/useSearchQuery';

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useSearchQuery();

  const [params, setParams] = useSearchParams();
  const pageParam = parseInt(params.get('page') ?? '1', 10);
  const pageSize = 5;

  const [draft, setDraft] = useState(searchQuery);

  useEffect(() => {
    setDraft(searchQuery);
  }, [searchQuery]);

  const [history, setHistory] = useState<
    Array<{ name: string; description: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [crash, setCrash] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const offset = (pageParam - 1) * pageSize;
      const list = await fetchPokemonList(pageSize, offset);
      const pages = await Promise.all(
        list.results.map((r) => fetchPokemonByName(r.name))
      );
      setHistory(pages);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const fetchSingle = async () => {
    setLoading(true);
    setError(null);
    try {
      const single = await fetchPokemonByName(searchQuery);
      setHistory([single]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery === '') {
      fetchList();
    } else {
      fetchSingle();
    }
  }, [searchQuery, pageParam]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSearchQuery(draft);
  };
  const handleRetry = () => {
    if (searchQuery === '') fetchList();
    else fetchSingle();
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
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />

      <SearchResult history={history} loading={loading} />

      {searchQuery === '' && history.length > 0 && (
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

      <button className="crash-button" onClick={() => setCrash(true)}>
        Crash App!
      </button>
      {crash && <Bomb />}
    </ErrorBoundary>
  );
};

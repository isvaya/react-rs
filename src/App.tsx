import './App.css';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchControls } from './top-controlls/SearchInput';
import { SearchResult } from './result/SearchResults';
import { fetchPokemonByName, fetchPokemonList } from './servise/pokeApi';
import { ErrorBoundary } from './errorCatching/ErrorBoundary';
import { Bomb } from './errorCatching/CrashButton';

export const App: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') ?? '';
  const pageParam = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = 5;

  const [draft, setDraft] = useState(searchQuery);
  const [history, setHistory] = useState<
    Array<{ name: string; description: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [crash, setCrash] = useState(false);

  useEffect(() => {
    setDraft(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    (async () => {
      try {
        let entries: Array<{ name: string; description: string }>;
        if (searchQuery === '') {
          const offset = (pageParam - 1) * pageSize;
          const list = await fetchPokemonList(pageSize, offset);
          entries = await Promise.all(
            list.results.map((r) => fetchPokemonByName(r.name))
          );
        } else {
          const single = await fetchPokemonByName(searchQuery);
          entries = [single];
        }
        setHistory(entries);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [searchQuery, pageParam]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSearchParams({ search: draft, page: '1' });
  };

  return (
    <ErrorBoundary>
      <SearchControls
        searchTerm={draft}
        onInputChange={(e) => setDraft(e.target.value)}
        onSearch={handleSubmit}
        loading={loading}
        error={error}
        onRetry={() => setSearchParams({ search: draft, page: '1' })}
      />

      <SearchResult history={history} loading={loading} />

      {history.length > 0 && (
        <div className="pagination">
          <button
            onClick={() =>
              setSearchParams({
                search: searchQuery,
                page: String(pageParam - 1),
              })
            }
            disabled={pageParam <= 1}
          >
            Prev
          </button>

          <span>Page {pageParam}</span>

          <button
            onClick={() =>
              setSearchParams({
                search: searchQuery,
                page: String(pageParam + 1),
              })
            }
            disabled={history.length < pageSize}
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

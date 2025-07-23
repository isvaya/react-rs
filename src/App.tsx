import './App.css';
import type { SearchPokemonState } from './interface/interface';
import React, { useCallback, useEffect, useState } from 'react';
import { SearchControls } from './top-controlls/SearchInput';
import { SearchResult } from './result/SearchResults';
import { fetchPokemonByName, fetchPokemonList } from './servise/pokeApi';
import { ErrorBoundary } from './errorCatching/ErrorBoundary';
import { Bomb } from './errorCatching/CrashButton';

export const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [history, setHistory] = useState<SearchPokemonState['history']>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [crash, setCrash] = useState<boolean>(false);

  const loadResults = useCallback(
    async (term: string, resetHistory = false) => {
      setLoading(true);
      setError(null);
      try {
        let entries: { name: string; description: string }[];

        if (term === '') {
          const list = await fetchPokemonList(20, 0);
          entries = await Promise.all(
            list.results.map((r) => fetchPokemonByName(r.name))
          );
        } else {
          const single = await fetchPokemonByName(term);
          entries = [single];
        }

        setHistory((prev) => (resetHistory ? entries : [...entries, ...prev]));
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const term = searchTerm.trim();
    if (term === '' && term !== '') return;
    localStorage.setItem('lastSearch', term);
    await loadResults(term);
  };

  useEffect(() => {
    const saved = localStorage.getItem('lastSearch') || '';
    setSearchTerm(saved);
    loadResults(saved, true);
  }, [loadResults]);

  return (
    <ErrorBoundary>
      <SearchControls
        searchTerm={searchTerm}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        loading={loading}
        error={error}
        onRetry={() => loadResults(searchTerm.trim(), true)}
      />
      <SearchResult history={history} loading={loading} />
      <button className="crash-button" onClick={() => setCrash(true)}>
        Crash App!
      </button>
      {crash && <Bomb />}
    </ErrorBoundary>
  );
};

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSearchQuery(): readonly [string, (next: string) => void] {
  const [params, setParams] = useSearchParams();
  const raw = params.get('search');
  const stored = localStorage.getItem('lastSearch') ?? '';

  const search = raw !== null ? raw : stored;

  useEffect(() => {
    if (raw !== null) {
      localStorage.setItem('lastSearch', raw);
    }
  }, [raw]);

  const setSearch = (next: string) => {
    setParams({ search: next, page: '1' });
  };

  return [search, setSearch] as const;
}

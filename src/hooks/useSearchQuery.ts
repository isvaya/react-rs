'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function useSearchQuery(): readonly [string, (next: string) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();

  const raw = searchParams?.get('search') ?? undefined;
  const stored =
    typeof window !== 'undefined'
      ? (localStorage.getItem('lastSearch') ?? '')
      : '';

  const search: string = raw ?? stored;

  useEffect(() => {
    if (raw !== undefined) {
      localStorage.setItem('lastSearch', raw);
    }
  }, [raw]);

  const setSearch = (next: string) => {
    const page = '1';
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('search', next);
    newSearchParams.set('page', page);
    router.push(`/?${newSearchParams.toString()}`);
  };

  return [search, setSearch] as const;
}

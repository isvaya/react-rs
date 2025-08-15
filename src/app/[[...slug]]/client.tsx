'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const App = dynamic(
  () => import('../../App').then((mod) => ({ default: mod.App })),
  {
    ssr: false,
  }
);

const queryClient = new QueryClient();

export function ClientOnly() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

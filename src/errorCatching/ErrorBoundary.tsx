import * as React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import type { FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  console.error('ErrorBoundary caught an error', error);
  return (
    <div className="error-bounder">
      <img className="error-pikachu" src="/pikachu.jpg" alt="sad-pikachu" />
      Something went wrong...{' '}
      <button onClick={resetErrorBoundary}>Reload page</button>
    </div>
  );
}

export const ErrorBoundary: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

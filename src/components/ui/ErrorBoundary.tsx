'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center bg-black px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-zinc-100 mb-2">Qualcosa è andato storto</h2>
            <p className="text-sm text-zinc-500 mb-6">
              Si è verificato un errore imprevisto. Prova a ricaricare la pagina.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-orange-600 text-white font-bold text-sm hover:bg-orange-500 transition-all rounded-xl"
            >
              Ricarica pagina
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

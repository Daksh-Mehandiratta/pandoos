import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { App } from './App';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

// TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on mobile app foreground
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes default
    },
  },
});

// Remove Vite loading spinner if present in index.html
const loader = document.getElementById('loader');
if (loader) {
  loader.remove();
}

// Electron desktop uses file:// protocol, which breaks BrowserRouter.
// We must use HashRouter for the desktop app, and BrowserRouter for the web app.
const Router = window.location.protocol === 'file:' ? HashRouter : BrowserRouter;

// If running in Electron, intercept all /api/* fetch requests and route them to the local API server
if (window.location.protocol === 'file:' && (window as any).electronAPI?.getApiUrl) {
  const originalFetch = window.fetch;
  const apiUrl = (window as any).electronAPI.getApiUrl();
  window.fetch = async (input, init) => {
    let url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input instanceof Request ? input.url : '';
    if (url.startsWith('/api/')) {
      input = `${apiUrl}${url}`;
    }
    return originalFetch(input, init);
  };
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ErrorBoundary>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || '529626065517-rvrjir6ugvkred5ln3vuev30lfnfnsth.apps.googleusercontent.com'}>
              <App />
            </GoogleOAuthProvider>
          </ErrorBoundary>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);

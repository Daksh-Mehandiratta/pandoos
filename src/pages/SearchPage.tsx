import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useSearch } from '@/features/search/hooks/useSearch';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { getBestThumbnail } from '@/services/youtube';
import { SEARCH_DEBOUNCE_MS } from '@/utils/constants';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const { data: results, isLoading } = useSearch(debouncedQuery);
  const playTrack = usePlayerStore((state) => state.playTrack);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="w-full h-full flex flex-col px-4">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-10 pt-2 pb-4 bg-surface-base/95 backdrop-blur-md">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-text-muted" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists..."
            className="w-full h-12 pl-11 pr-10 bg-surface-elevated border border-white/10 rounded-full text-white placeholder-text-muted focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 shadow-inner"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 pb-20">
        {!query && (
          <div className="h-full flex flex-col items-center justify-center text-text-muted mt-20">
            <SearchIcon className="h-12 w-12 mb-4 opacity-20" />
            <p>Find your next favorite track</p>
          </div>
        )}

        {isLoading && query.length > 2 && (
          <div className="flex flex-col gap-4 mt-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-16 rounded-xl skeleton" />
            ))}
          </div>
        )}

        {results && results.length === 0 && !isLoading && query.length > 2 && (
          <div className="text-center text-text-muted mt-10">
            No results found for "{query}"
          </div>
        )}

        {results && results.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {results.map((track) => (
              <button
                key={track.id}
                onClick={() => playTrack(track, results)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 touch-highlight text-left group transition-colors"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 shadow-sm relative">
                  <img 
                    src={getBestThumbnail(track.videoId)} 
                    alt={track.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M5 3v18l15-9L5 3z"/></svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-sm font-semibold text-white truncate">{track.title}</p>
                  <p className="text-xs text-text-muted truncate mt-0.5">{track.artist}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

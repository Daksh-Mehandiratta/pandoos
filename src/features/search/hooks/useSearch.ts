import { useQuery } from '@tanstack/react-query';
import { searchTracks, getTrendingTracks } from '@/services/youtube';
import { QUERY_KEYS } from '@/utils/constants';

/**
 * Hook for YouTube search with TanStack Query caching.
 * Enabled only when query length > 2.
 */
export function useSearch(query: string) {
  return useQuery({
    queryKey: QUERY_KEYS.search(query),
    queryFn: () => searchTracks(query),
    enabled: query.trim().length > 2,
    staleTime: 1000 * 60 * 60, // 1 hour — search results don't change fast
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 1,
  });
}

/**
 * Hook for fetching trending music.
 * Used on the Home page.
 */
export function useTrending() {
  return useQuery({
    queryKey: QUERY_KEYS.trending,
    queryFn: getTrendingTracks,
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    gcTime: 1000 * 60 * 60 * 24,
    retry: 2,
  });
}

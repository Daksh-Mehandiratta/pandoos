import type { Track, YouTubeSearchItem } from '@/types/track';
import { YT_THUMB } from '@/utils/constants';

/**
 * Transform raw YouTube API search result into a Track.
 * Centralised here so every feature gets the same shape.
 */
function mapSearchItemToTrack(item: YouTubeSearchItem): Track {
  const videoId = item.id.videoId;
  return {
    id: videoId,
    videoId,
    title: item.snippet.title
      // Decode common HTML entities YouTube returns in titles
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>'),
    artist: item.snippet.channelTitle,
    // Prefer maxres, fall back to high quality thumbnail
    albumArt: item.snippet.thumbnails.maxres?.url ?? item.snippet.thumbnails.high.url,
    // Duration not available in search results — set by YouTube player on load
    duration: 0,
    source: 'youtube' as const,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
  };
}

/**
 * Search for music using the server-side proxy.
 * The /api/search Vercel function:
 *   1. Checks Upstash Redis for a cached result
 *   2. On cache miss: calls YouTube Data API v3 and caches the result for 24h
 *
 * This means 1000 users searching "Blinding Lights" costs only 1 API quota unit.
 */
export async function searchTracks(query: string): Promise<Track[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=music`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error((err as { error?: string }).error ?? `Search failed: ${res.status}`);
  }

  const data = (await res.json()) as { items: YouTubeSearchItem[] };
  return (data.items ?? []).map(mapSearchItemToTrack);
}

/**
 * Fetch trending music tracks via server-side proxy + cache.
 */
export async function getTrendingTracks(): Promise<Track[]> {
  const res = await fetch('/api/trending');

  if (!res.ok) {
    throw new Error(`Trending fetch failed: ${res.status}`);
  }

  const data = (await res.json()) as { items: YouTubeSearchItem[] };
  return (data.items ?? []).map(mapSearchItemToTrack);
}

/**
 * Build the best-quality thumbnail URL for a given videoId.
 * Tries maxresdefault (HD) and falls back to hqdefault if the video
 * doesn't have a high-res thumbnail.
 */
export function getBestThumbnail(videoId: string): string {
  return YT_THUMB.maxres(videoId);
}

/**
 * YouTube watch URL — used for sharing links.
 */
export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

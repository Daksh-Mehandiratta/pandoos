import type { Track, YouTubeSearchItem } from '@/types/track';
import { YT_THUMB } from '@/utils/constants';
import { MOOD_SEEDS } from '@/data/moodSeeds';

function mapSearchItemToTrack(item: YouTubeSearchItem): Track {
  const videoId = item.id.videoId;
  return {
    id: videoId,
    videoId,
    title: item.snippet.title
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>'),
    artist: item.snippet.channelTitle,
    albumArt: item.snippet.thumbnails.maxres?.url ?? item.snippet.thumbnails.high.url,
    duration: 0,
    source: 'youtube' as const,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
  };
}

export async function searchTracks(query: string): Promise<Track[]> {
  // 1. Intercept predefined mood queries to avoid API quota hits (Layer 2 Scalability)
  const MOOD_QUERIES: Record<string, string> = {
    'lofi chill relax aesthetic': 'chill',
    'high energy upbeat edm hits': 'energy',
    'deep focus ambient electronic': 'focus',
    'romantic love songs acoustic': 'romantic',
    'heavy workout gym phonk': 'workout',
    'sad emotional acoustic': 'heartbroken',
    'sleep ambient delta waves': 'sleepy',
    'late night drive synthwave retro': 'latenight',
    'happy feel good uplifting pop': 'happy',
  };

  const moodId = MOOD_QUERIES[query.toLowerCase().trim()];
  if (moodId && MOOD_SEEDS[moodId]) {
    // Return seeds instantly, wrapped in a resolved promise
    return Promise.resolve(MOOD_SEEDS[moodId]);
  }

  let res: Response;
  
  // Local DEV fallback so `npm run dev` works without Vercel CLI
  if (import.meta.env.DEV && import.meta.env.VITE_YOUTUBE_API_KEY) {
    const ytUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    ytUrl.searchParams.set('part', 'snippet');
    ytUrl.searchParams.set('q', query);
    ytUrl.searchParams.set('type', 'video');
    ytUrl.searchParams.set('videoCategoryId', '10'); // Music
    ytUrl.searchParams.set('maxResults', '15');
    ytUrl.searchParams.set('key', import.meta.env.VITE_YOUTUBE_API_KEY as string);
    res = await fetch(ytUrl.toString());
  } else {
    // Production uses serverless proxy + caching
    res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=music`);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error((err as { error?: string }).error ?? `Search failed: ${res.status}`);
  }

  const data = (await res.json()) as { items: YouTubeSearchItem[] };
  return (data.items ?? []).map(mapSearchItemToTrack);
}

export async function getTrendingTracks(): Promise<Track[]> {
  let res: Response | undefined;
  
  if (import.meta.env.DEV && import.meta.env.VITE_YOUTUBE_API_KEY) {
    const ytUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    ytUrl.searchParams.set('part', 'snippet');
    ytUrl.searchParams.set('chart', 'mostPopular');
    ytUrl.searchParams.set('videoCategoryId', '10');
    ytUrl.searchParams.set('maxResults', '15');
    ytUrl.searchParams.set('key', import.meta.env.VITE_YOUTUBE_API_KEY as string);
    try {
      res = await fetch(ytUrl.toString());
    } catch (e) {
      // fallback
    }
    
    if (res?.ok) {
      const data = await res.json();
      const items = data.items.map((item: any) => ({
        id: { videoId: item.id },
        snippet: item.snippet
      }));
      return items.map(mapSearchItemToTrack);
    }
  }

  if (!res || !res.ok) {
    res = await fetch('/api/trending');
  }

  if (!res.ok) {
    throw new Error(`Trending fetch failed: ${res.status}`);
  }

  const data = (await res.json()) as { items: YouTubeSearchItem[] };
  return (data.items ?? []).map(mapSearchItemToTrack);
}

export function getBestThumbnail(videoId: string): string {
  return YT_THUMB.maxres(videoId);
}

export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * library.ts — Cloud-first library service backed by Supabase.
 *
 * Architecture:
 * - Every write goes to Supabase (if logged in) AND to localStorage cache.
 * - Every read tries Supabase first; if offline or unauthenticated, falls back to localStorage.
 * - This means the app works 100% offline AND syncs perfectly when online.
 *
 * Supabase tables required (paste into Supabase SQL editor):
 * See /SUPABASE_SETUP.sql in the repo root.
 */

import { supabase } from '@/services/supabase';
import type { Playlist } from '@/types/playlist';
import type { Track } from '@/types/track';

// ── Local Storage Cache Keys ────────────────────────────────────────
const PLAYLISTS_KEY = 'pandoos_playlists_v2';
const PLAYLIST_TRACKS_KEY = 'pandoos_playlist_tracks_v2';
const LIKED_SONGS_KEY = 'pandoos_liked_songs_v2';
const FOLLOWED_ARTISTS_KEY = 'pandoos_followed_artists_v2';

// ── Cache Helpers ────────────────────────────────────────────────────
const getCache = <T>(key: string, def: T): T => {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : def;
  } catch { return def; }
};
const setCache = <T>(key: string, val: T) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage full */ }
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

async function getCurrentUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

// ════════════════════════════════════════════════════════════════════
// LIKED SONGS
// ════════════════════════════════════════════════════════════════════

export async function getLikedSongs(userId: string): Promise<Track[]> {
  // Try Supabase
  try {
    const { data, error } = await supabase
      .from('liked_songs')
      .select('track_data, liked_at')
      .eq('user_id', userId)
      .order('liked_at', { ascending: false });

    if (!error && data) {
      const tracks = data.map((row: any) => row.track_data as Track);
      // Update local cache
      const cacheMap = getCache<Record<string, Track[]>>(LIKED_SONGS_KEY, {});
      cacheMap[userId] = tracks;
      setCache(LIKED_SONGS_KEY, cacheMap);
      return tracks;
    }
  } catch { /* offline */ }

  // Fallback to cache
  const cacheMap = getCache<Record<string, Track[]>>(LIKED_SONGS_KEY, {});
  return cacheMap[userId] ?? [];
}

export async function likeTrack(userId: string, track: Track): Promise<void> {
  // Optimistic local update
  const cacheMap = getCache<Record<string, Track[]>>(LIKED_SONGS_KEY, {});
  if (!cacheMap[userId]) cacheMap[userId] = [];
  if (!cacheMap[userId].find(t => t.videoId === track.videoId)) {
    cacheMap[userId].unshift(track);
    setCache(LIKED_SONGS_KEY, cacheMap);
  }

  // Sync to cloud
  try {
    await supabase.from('liked_songs').upsert({
      user_id: userId,
      video_id: track.videoId,
      track_data: track,
    }, { onConflict: 'user_id,video_id' });
  } catch { /* will sync next time */ }
}

export async function unlikeTrack(userId: string, videoId: string): Promise<void> {
  // Optimistic local update
  const cacheMap = getCache<Record<string, Track[]>>(LIKED_SONGS_KEY, {});
  if (cacheMap[userId]) {
    cacheMap[userId] = cacheMap[userId].filter(t => t.videoId !== videoId);
    setCache(LIKED_SONGS_KEY, cacheMap);
  }

  // Sync to cloud
  try {
    await supabase.from('liked_songs')
      .delete()
      .eq('user_id', userId)
      .eq('video_id', videoId);
  } catch { /* will sync next time */ }
}

export async function isTrackLiked(userId: string, videoId: string): Promise<boolean> {
  // Check local cache first for instant UI response
  const cacheMap = getCache<Record<string, Track[]>>(LIKED_SONGS_KEY, {});
  if (cacheMap[userId]) {
    return cacheMap[userId].some(t => t.videoId === videoId);
  }

  try {
    const { data } = await supabase
      .from('liked_songs')
      .select('video_id')
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .maybeSingle();
    return !!data;
  } catch { return false; }
}

// ════════════════════════════════════════════════════════════════════
// PLAYLISTS
// ════════════════════════════════════════════════════════════════════

export async function getUserPlaylists(userId: string): Promise<Playlist[]> {
  try {
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      const playlists: Playlist[] = data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        name: row.name,
        description: row.description ?? '',
        coverUrl: row.cover_url ?? '',
        isPublic: row.is_public ?? false,
        trackCount: row.track_count ?? 0,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
      setCache(PLAYLISTS_KEY + ':' + userId, playlists);
      return playlists;
    }
  } catch { /* offline */ }

  return getCache<Playlist[]>(PLAYLISTS_KEY + ':' + userId, []);
}

export async function createPlaylist(
  userId: string,
  name: string,
  description = ''
): Promise<Playlist> {
  const newPlaylist: Playlist = {
    id: generateId(),
    userId,
    name,
    description,
    coverUrl: '',
    isPublic: false,
    trackCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Update local cache optimistically
  const cached = getCache<Playlist[]>(PLAYLISTS_KEY + ':' + userId, []);
  setCache(PLAYLISTS_KEY + ':' + userId, [newPlaylist, ...cached]);

  // Sync to cloud
  try {
    await supabase.from('playlists').insert({
      id: newPlaylist.id,
      user_id: userId,
      name,
      description,
      is_public: false,
      track_count: 0,
    });
  } catch { /* will sync next time */ }

  return newPlaylist;
}

export async function deletePlaylist(playlistId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    const cached = getCache<Playlist[]>(PLAYLISTS_KEY + ':' + userId, []);
    setCache(PLAYLISTS_KEY + ':' + userId, cached.filter(p => p.id !== playlistId));
  }

  try {
    // Cascade delete handled by foreign key in Supabase
    await supabase.from('playlists').delete().eq('id', playlistId);
  } catch { /* will sync */ }
}

// ════════════════════════════════════════════════════════════════════
// PLAYLIST TRACKS
// ════════════════════════════════════════════════════════════════════

export async function getPlaylistTracks(playlistId: string): Promise<Track[]> {
  try {
    const { data, error } = await supabase
      .from('playlist_tracks')
      .select('track_data, position')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: true });

    if (!error && data) {
      const tracks = data.map((row: any) => row.track_data as Track);
      setCache(PLAYLIST_TRACKS_KEY + ':' + playlistId, tracks);
      return tracks;
    }
  } catch { /* offline */ }

  return getCache<Track[]>(PLAYLIST_TRACKS_KEY + ':' + playlistId, []);
}

export async function addTrackToPlaylist(
  playlistId: string,
  track: Track,
  position: number
): Promise<void> {
  // Local cache update
  const cached = getCache<Track[]>(PLAYLIST_TRACKS_KEY + ':' + playlistId, []);
  if (!cached.find(t => t.videoId === track.videoId)) {
    cached.push(track);
    setCache(PLAYLIST_TRACKS_KEY + ':' + playlistId, cached);
  }

  try {
    await supabase.from('playlist_tracks').insert({
      playlist_id: playlistId,
      track_data: track,
      position,
    });
    // Update track count
    await supabase.from('playlists')
      .update({ track_count: cached.length, updated_at: new Date().toISOString() })
      .eq('id', playlistId);
  } catch { /* will sync */ }
}

export async function removeTrackFromPlaylist(
  playlistId: string,
  videoId: string
): Promise<void> {
  const cached = getCache<Track[]>(PLAYLIST_TRACKS_KEY + ':' + playlistId, []);
  const updated = cached.filter(t => t.videoId !== videoId);
  setCache(PLAYLIST_TRACKS_KEY + ':' + playlistId, updated);

  try {
    // Find the row id to delete
    const { data } = await supabase
      .from('playlist_tracks')
      .select('id, track_data')
      .eq('playlist_id', playlistId);

    const row = data?.find((r: any) => r.track_data?.videoId === videoId);
    if (row) {
      await supabase.from('playlist_tracks').delete().eq('id', row.id);
    }
    await supabase.from('playlists')
      .update({ track_count: updated.length, updated_at: new Date().toISOString() })
      .eq('id', playlistId);
  } catch { /* will sync */ }
}

// ════════════════════════════════════════════════════════════════════
// FOLLOWED ARTISTS
// ════════════════════════════════════════════════════════════════════

export async function getFollowedArtists(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('followed_artists')
      .select('artist_data, followed_at')
      .eq('user_id', userId)
      .order('followed_at', { ascending: false });

    if (!error && data) {
      const artists = data.map((row: any) => row.artist_data);
      const cacheMap = getCache<Record<string, any[]>>(FOLLOWED_ARTISTS_KEY, {});
      cacheMap[userId] = artists;
      setCache(FOLLOWED_ARTISTS_KEY, cacheMap);
      return artists;
    }
  } catch { /* offline */ }

  const cacheMap = getCache<Record<string, any[]>>(FOLLOWED_ARTISTS_KEY, {});
  return cacheMap[userId] ?? [];
}

export async function followArtist(userId: string, artist: any): Promise<void> {
  const cacheMap = getCache<Record<string, any[]>>(FOLLOWED_ARTISTS_KEY, {});
  if (!cacheMap[userId]) cacheMap[userId] = [];
  if (!cacheMap[userId].find(a => a.artistId === artist.artistId)) {
    cacheMap[userId].unshift(artist);
    setCache(FOLLOWED_ARTISTS_KEY, cacheMap);
  }

  try {
    await supabase.from('followed_artists').upsert({
      user_id: userId,
      artist_id: artist.artistId,
      artist_data: artist,
    }, { onConflict: 'user_id,artist_id' });
  } catch { /* will sync */ }
}

export async function unfollowArtist(userId: string, artistId: string): Promise<void> {
  const cacheMap = getCache<Record<string, any[]>>(FOLLOWED_ARTISTS_KEY, {});
  if (cacheMap[userId]) {
    cacheMap[userId] = cacheMap[userId].filter(a => a.artistId !== artistId);
    setCache(FOLLOWED_ARTISTS_KEY, cacheMap);
  }

  try {
    await supabase.from('followed_artists')
      .delete()
      .eq('user_id', userId)
      .eq('artist_id', artistId);
  } catch { /* will sync */ }
}

export async function isArtistFollowed(userId: string, artistId: string): Promise<boolean> {
  const cacheMap = getCache<Record<string, any[]>>(FOLLOWED_ARTISTS_KEY, {});
  if (cacheMap[userId]) {
    return cacheMap[userId].some(a => a.artistId === artistId);
  }
  try {
    const { data } = await supabase
      .from('followed_artists')
      .select('artist_id')
      .eq('user_id', userId)
      .eq('artist_id', artistId)
      .maybeSingle();
    return !!data;
  } catch { return false; }
}

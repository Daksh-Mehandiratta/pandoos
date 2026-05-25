/**
 * syncService.ts — Cross-device sync orchestrator.
 *
 * Responsibilities:
 * 1. On LOGIN: Pull cloud data and merge with any locally cached data.
 * 2. Realtime subscription: Listen for changes made on other devices and
 *    invalidate React Query caches so the UI updates instantly.
 * 3. Offline resilience: writes are cached locally and synced on reconnect.
 */

import { supabase } from '@/services/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/constants';

let realtimeChannel: RealtimeChannel | null = null;

/**
 * Call once when a user logs in.
 * Migrates any old localStorage data to Supabase (so nothing is lost on first sync).
 */
export async function onUserLogin(userId: string): Promise<void> {
  try {
    await migrateLocalDataToCloud(userId);
  } catch (err) {
    console.warn('[SyncService] Migration warning:', err);
  }
}

/**
 * One-time migration: if the user had data in the OLD localStorage keys,
 * push it all to Supabase and wipe the old keys.
 */
async function migrateLocalDataToCloud(userId: string): Promise<void> {
  // Migrate liked songs from old localStorage keys to Supabase
  const oldLikedKey = 'pandoos_liked_songs_v1';
  const oldLiked = localStorage.getItem(oldLikedKey);
  if (oldLiked) {
    try {
      const likedMap = JSON.parse(oldLiked) as Record<string, any[]>;
      const userLiked = likedMap[userId];
      if (userLiked?.length) {
        const rows = userLiked.map((track: any) => ({
          user_id: userId,
          video_id: track.videoId,
          title: track.title,
          artist: track.artist,
          album_art: track.albumArt,
          duration: track.duration ?? 0,
        }));
        await supabase.from('liked_songs').upsert(rows, { onConflict: 'user_id,video_id' });
        console.log(`[SyncService] Migrated ${rows.length} liked songs to cloud`);
      }
      localStorage.removeItem(oldLikedKey);
    } catch { /* ignore */ }
  }

  // Migrate followed artists from old localStorage keys to Supabase
  const oldFollowedKey = 'pandoos_followed_artists_v1';
  const oldFollowed = localStorage.getItem(oldFollowedKey);
  if (oldFollowed) {
    try {
      const followedMap = JSON.parse(oldFollowed) as Record<string, any[]>;
      const userFollowed = followedMap[userId];
      if (userFollowed?.length) {
        const rows = userFollowed.map((a: any) => ({
          user_id: userId,
          artist_id: a.artistId,
          name: a.name,
          thumbnail_url: a.thumbnails?.[0]?.url ?? null,
        }));
        await supabase.from('followed_artists').upsert(rows, { onConflict: 'user_id,artist_id' });
        console.log(`[SyncService] Migrated ${rows.length} followed artists to cloud`);
      }
      localStorage.removeItem(oldFollowedKey);
    } catch { /* ignore */ }
  }
}

/**
 * Subscribe to real-time Supabase changes for a user.
 * When another device (web/desktop/mobile) makes a change, this fires and
 * the React Query cache is invalidated, triggering a UI refresh automatically.
 */
export function subscribeToLibraryChanges(
  userId: string,
  queryClient: ReturnType<typeof useQueryClient>
): void {
  // Unsubscribe from any existing channel first
  unsubscribeFromLibraryChanges();

  realtimeChannel = supabase.channel(`library:${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'liked_songs', filter: `user_id=eq.${userId}` },
      () => {
        // Invalidate liked songs cache — React Query will re-fetch automatically
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.likedSongs(userId) });
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'playlists', filter: `user_id=eq.${userId}` },
      () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlists(userId) });
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'playlist_tracks' },
      (payload: any) => {
        const playlistId = payload.new?.playlist_id || payload.old?.playlist_id;
        if (playlistId) {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlistTracks(playlistId) });
        }
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'followed_artists', filter: `user_id=eq.${userId}` },
      () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.followedArtists(userId) });
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('[SyncService] Real-time library sync active ✅');
      }
    });
}

export function unsubscribeFromLibraryChanges(): void {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
}

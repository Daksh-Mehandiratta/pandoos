/**
 * nowPlayingSync.ts — Spotify-style "Now Playing" cross-device sync.
 *
 * What it does:
 * - Writes the current track + play state to Supabase's `now_playing` table every ~5s.
 * - Subscribes to real-time changes — if you open a second device, it sees what's playing.
 * - On open, if another device was playing, shows "Continue on this device?" prompt.
 */

import { supabase } from '@/services/supabase';
import type { Track } from '@/types/track';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Platform detection — shown in the "Now Playing on..." tooltip
function getDeviceName(): string {
  const isElectron = typeof window !== 'undefined' && !!(window as any).electronAPI;
  if (isElectron) return 'Desktop App';
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return 'Android';
  if (/ipad|iphone|ipod/.test(ua)) return 'iPhone/iPad';
  return 'Web';
}

const DEVICE_NAME = getDeviceName();
let writeInterval: ReturnType<typeof setInterval> | null = null;
let realtimeChannel: RealtimeChannel | null = null;

// Called by the audio engine when track or play state changes
let _lastTrack: Track | null = null;
let _isPlaying = false;
let _progress = 0;
let _userId: string | null = null;

export function initNowPlayingSync(userId: string): void {
  _userId = userId;
  startWriteLoop();
}

export function updateNowPlayingState(track: Track | null, isPlaying: boolean, progress: number): void {
  _lastTrack = track;
  _isPlaying = isPlaying;
  _progress = progress;
}

function startWriteLoop(): void {
  if (writeInterval) clearInterval(writeInterval);

  // Write immediately, then every 5 seconds
  writeNowPlaying();
  writeInterval = setInterval(writeNowPlaying, 5000);
}

async function writeNowPlaying(): Promise<void> {
  if (!_userId || !_lastTrack) return;

  try {
    await supabase.from('now_playing').upsert({
      user_id: _userId,
      track_data: _lastTrack,
      is_playing: _isPlaying,
      progress: _progress,
      device_name: DEVICE_NAME,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  } catch { /* silent — not critical */ }
}

/**
 * Get what's currently playing on another device for this user.
 * Returns null if nothing is playing or data is stale (>30s old).
 */
export async function getOtherDeviceNowPlaying(
  userId: string
): Promise<{ track: Track; deviceName: string; isPlaying: boolean } | null> {
  try {
    const { data, error } = await supabase
      .from('now_playing')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;

    // Ignore if it's stale (>30 seconds old) or from the current device
    const updatedAt = new Date(data.updated_at).getTime();
    const isStale = Date.now() - updatedAt > 30_000;
    if (isStale || data.device_name === DEVICE_NAME) return null;

    return {
      track: data.track_data as Track,
      deviceName: data.device_name,
      isPlaying: data.is_playing,
    };
  } catch {
    return null;
  }
}

/**
 * Subscribe to real-time "now playing" changes from other devices.
 * Callback fires when another device starts playing a track.
 */
export function subscribeToNowPlaying(
  userId: string,
  onUpdate: (track: Track, deviceName: string, isPlaying: boolean) => void
): void {
  unsubscribeFromNowPlaying();

  realtimeChannel = supabase.channel(`now_playing:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'now_playing',
        filter: `user_id=eq.${userId}`,
      },
      (payload: any) => {
        const data = payload.new;
        if (!data || data.device_name === DEVICE_NAME) return;
        if (data.track_data) {
          onUpdate(data.track_data as Track, data.device_name, data.is_playing);
        }
      }
    )
    .subscribe();
}

export function unsubscribeFromNowPlaying(): void {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
}

export function stopNowPlayingSync(): void {
  if (writeInterval) {
    clearInterval(writeInterval);
    writeInterval = null;
  }
  unsubscribeFromNowPlaying();
  _userId = null;
  _lastTrack = null;
}

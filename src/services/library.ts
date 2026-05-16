import { supabase } from './supabase';
import type { Playlist, SupabasePlaylist } from '@/types/playlist';
import type { Track } from '@/types/track';

// ── Type converters ──────────────────────────────────────────────

function dbToPlaylist(row: SupabasePlaylist): Playlist {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    coverUrl: row.cover_url ?? '',
    userId: row.user_id,
    isPublic: row.is_public,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    trackCount: row.track_count,
  };
}

// ── Playlists ────────────────────────────────────────────────────

export async function getUserPlaylists(userId: string): Promise<Playlist[]> {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as SupabasePlaylist[]).map(dbToPlaylist);
}

export async function createPlaylist(
  userId: string,
  name: string,
  description = ''
): Promise<Playlist> {
  const { data, error } = await supabase
    .from('playlists')
    .insert({ user_id: userId, name, description, is_public: false, track_count: 0 })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return dbToPlaylist(data as SupabasePlaylist);
}

export async function deletePlaylist(playlistId: string): Promise<void> {
  const { error } = await supabase
    .from('playlists')
    .delete()
    .eq('id', playlistId);
  if (error) throw new Error(error.message);
}

// ── Playlist Tracks ──────────────────────────────────────────────

export async function addTrackToPlaylist(
  playlistId: string,
  track: Track,
  position: number
): Promise<void> {
  const { error } = await supabase.from('playlist_tracks').insert({
    playlist_id: playlistId,
    video_id: track.videoId,
    title: track.title,
    artist: track.artist,
    album_art: track.albumArt,
    duration: track.duration,
    position,
  });
  if (error) throw new Error(error.message);
}

export async function removeTrackFromPlaylist(
  playlistId: string,
  videoId: string
): Promise<void> {
  const { error } = await supabase
    .from('playlist_tracks')
    .delete()
    .eq('playlist_id', playlistId)
    .eq('video_id', videoId);
  if (error) throw new Error(error.message);
}

export async function getPlaylistTracks(playlistId: string): Promise<Track[]> {
  const { data, error } = await supabase
    .from('playlist_tracks')
    .select('*')
    .eq('playlist_id', playlistId)
    .order('position', { ascending: true });

  if (error) throw new Error(error.message);
  // Reconstruct Track objects from stored data
  return (data as Array<{
    video_id: string; title: string; artist: string;
    album_art: string; duration: number;
  }>).map((row) => ({
    id: row.video_id,
    videoId: row.video_id,
    title: row.title,
    artist: row.artist,
    albumArt: row.album_art,
    duration: row.duration,
    source: 'youtube' as const,
  }));
}

// ── Liked Songs ──────────────────────────────────────────────────

export async function getLikedSongs(userId: string): Promise<Track[]> {
  const { data, error } = await supabase
    .from('liked_songs')
    .select('*')
    .eq('user_id', userId)
    .order('liked_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Array<{
    video_id: string; title: string; artist: string;
    album_art: string; duration: number;
  }>).map((row) => ({
    id: row.video_id,
    videoId: row.video_id,
    title: row.title,
    artist: row.artist,
    albumArt: row.album_art,
    duration: row.duration,
    source: 'youtube' as const,
  }));
}

export async function likeTrack(userId: string, track: Track): Promise<void> {
  const { error } = await supabase.from('liked_songs').upsert({
    user_id: userId,
    video_id: track.videoId,
    title: track.title,
    artist: track.artist,
    album_art: track.albumArt,
    duration: track.duration,
    liked_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function unlikeTrack(userId: string, videoId: string): Promise<void> {
  const { error } = await supabase
    .from('liked_songs')
    .delete()
    .eq('user_id', userId)
    .eq('video_id', videoId);
  if (error) throw new Error(error.message);
}

export async function isTrackLiked(userId: string, videoId: string): Promise<boolean> {
  const { data } = await supabase
    .from('liked_songs')
    .select('video_id')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .single();
  return !!data;
}

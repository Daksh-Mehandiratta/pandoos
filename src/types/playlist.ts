import type { Track } from './track';

export interface Playlist {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  /** URL of playlist cover image */
  readonly coverUrl: string;
  readonly userId: string;
  readonly isPublic: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  /** Tracks are lazy-loaded; not always populated */
  readonly tracks?: Track[];
  readonly trackCount: number;
}

/** Shape stored in Supabase playlist_tracks join table */
export interface PlaylistTrack {
  readonly playlistId: string;
  readonly trackId: string;
  /** YouTube video ID — track data re-fetched from YouTube */
  readonly videoId: string;
  readonly addedAt: string;
  readonly position: number;
}

/** Supabase row shape for playlists table */
export interface SupabasePlaylist {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  user_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  track_count: number;
}

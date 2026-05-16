import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserPlaylists,
  createPlaylist,
  deletePlaylist,
  getPlaylistTracks,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  getLikedSongs,
  likeTrack,
  unlikeTrack,
  isTrackLiked
} from '@/services/library';
import { QUERY_KEYS } from '@/utils/constants';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Track } from '@/types/track';

// ── Playlists ─────────────────────────────────────────────────────────

export function usePlaylists() {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: QUERY_KEYS.playlists(user?.id ?? ''),
    queryFn: () => getUserPlaylists(user!.id),
    enabled: !!user,
  });
}

export function usePlaylistTracks(playlistId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.playlist(playlistId),
    queryFn: () => getPlaylistTracks(playlistId),
    enabled: !!playlistId,
  });
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) =>
      createPlaylist(user!.id, name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlists(user!.id) });
    },
  });
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (playlistId: string) => deletePlaylist(playlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlists(user!.id) });
    },
  });
}

export function useAddTrackToPlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, track, position }: { playlistId: string; track: Track; position: number }) =>
      addTrackToPlaylist(playlistId, track, position),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlist(variables.playlistId) });
    },
  });
}

export function useRemoveTrackFromPlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, videoId }: { playlistId: string; videoId: string }) =>
      removeTrackFromPlaylist(playlistId, videoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.playlist(variables.playlistId) });
    },
  });
}

// ── Liked Songs ───────────────────────────────────────────────────────

export function useLikedSongs() {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: QUERY_KEYS.likedSongs(user?.id ?? ''),
    queryFn: () => getLikedSongs(user!.id),
    enabled: !!user,
  });
}

export function useIsTrackLiked(videoId: string) {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: [...QUERY_KEYS.likedSongs(user?.id ?? ''), 'check', videoId],
    queryFn: () => isTrackLiked(user!.id, videoId),
    enabled: !!user && !!videoId,
  });
}

export function useLikeTrack() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (track: Track) => likeTrack(user!.id, track),
    onMutate: async (track) => {
      // Optimistic update
      const checkKey = [...QUERY_KEYS.likedSongs(user!.id), 'check', track.videoId];
      await queryClient.cancelQueries({ queryKey: checkKey });
      queryClient.setQueryData(checkKey, true);
    },
    onSettled: (_, __, track) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.likedSongs(user!.id) });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.likedSongs(user!.id), 'check', track.videoId] });
    },
  });
}

export function useUnlikeTrack() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (videoId: string) => unlikeTrack(user!.id, videoId),
    onMutate: async (videoId) => {
      // Optimistic update
      const checkKey = [...QUERY_KEYS.likedSongs(user!.id), 'check', videoId];
      await queryClient.cancelQueries({ queryKey: checkKey });
      queryClient.setQueryData(checkKey, false);
    },
    onSettled: (_, __, videoId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.likedSongs(user!.id) });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.likedSongs(user!.id), 'check', videoId] });
    },
  });
}

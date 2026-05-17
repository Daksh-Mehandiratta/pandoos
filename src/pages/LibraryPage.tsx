import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Heart, Music2, LogIn } from 'lucide-react';
import { usePlaylists, useLikedSongs, useCreatePlaylist } from '@/features/library/hooks/useLibrary';
import { useAuthStore } from '@/stores/useAuthStore';
import { getBestThumbnail } from '@/services/youtube';
import { cn } from '@/utils/cn';

export function LibraryPage() {
  const user = useAuthStore((state) => state.user);
  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle);
  
  const { data: playlists, isLoading: loadingPlaylists } = usePlaylists();
  const { data: likedSongs, isLoading: loadingLiked } = useLikedSongs();
  
  const createPlaylist = useCreatePlaylist();
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center pb-20">
        <Helmet>
          <title>Library | Pandoos</title>
        </Helmet>
        <div className="w-20 h-20 bg-surface-elevated rounded-full flex items-center justify-center mb-6 shadow-glass">
          <Music2 size={36} className="text-brand-primary" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 font-display">Your Library</h2>
        <p className="text-text-muted mb-8">Sign in to save playlists and like your favorite tracks.</p>
        <button 
          onClick={() => signInWithGoogle()}
          className="flex items-center gap-2 px-6 py-3 bg-white text-surface-base font-semibold rounded-full touch-highlight"
        >
          <LogIn size={20} />
          Sign in with Google
        </button>
      </div>
    );
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    createPlaylist.mutate(
      { name: newPlaylistName },
      {
        onSuccess: () => {
          setNewPlaylistName('');
          setIsCreating(false);
        }
      }
    );
  };

  return (
    <div className="w-full px-4 pb-20">
      <Helmet>
        <title>Your Library | Pandoos</title>
        <meta name="description" content="Your saved playlists and liked songs on Pandoos." />
      </Helmet>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white font-display">Library</h1>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="p-2 bg-surface-elevated rounded-full text-text-muted hover:text-white touch-highlight border border-white/5"
        >
          <Plus size={20} />
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 flex gap-2">
          <input 
            type="text" 
            autoFocus
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Playlist name..."
            className="flex-1 bg-surface-elevated border border-brand-primary/50 rounded-xl px-4 py-2 text-white focus:outline-none"
          />
          <button 
            type="submit"
            disabled={!newPlaylistName.trim() || createPlaylist.isPending}
            className="px-4 py-2 bg-brand-primary text-white rounded-xl font-medium touch-highlight disabled:opacity-50"
          >
            Create
          </button>
        </form>
      )}

      {/* Liked Songs Card */}
      <button className="w-full relative overflow-hidden rounded-2xl p-4 mb-6 text-left group touch-highlight">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/40 to-brand-accent/20" />
        <div className="absolute inset-0 bg-surface-elevated/50 backdrop-blur-sm" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl flex items-center justify-center shadow-lg">
            <Heart size={28} fill="white" className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Liked Songs</h2>
            <p className="text-sm text-text-muted">
              {loadingLiked ? 'Loading...' : `${likedSongs?.length ?? 0} tracks`}
            </p>
          </div>
        </div>
      </button>

      {/* Playlists Grid */}
      <h2 className="text-lg font-bold text-white mb-4">Your Playlists</h2>
      
      {loadingPlaylists ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-xl skeleton" />
          ))}
        </div>
      ) : playlists && playlists.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {playlists.map((playlist) => (
            <button key={playlist.id} className="flex flex-col text-left group touch-highlight">
              <div className="w-full aspect-square rounded-xl bg-surface-elevated mb-2 overflow-hidden shadow-md flex items-center justify-center border border-white/5">
                {playlist.coverUrl ? (
                  <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" />
                ) : (
                  <Music2 size={32} className="text-text-muted" />
                )}
              </div>
              <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
              <p className="text-xs text-text-muted">{playlist.trackCount} tracks</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-text-muted bg-surface-elevated/30 rounded-2xl border border-white/5">
          <p>No playlists yet.</p>
          <p className="text-sm mt-1">Tap the + button to create one.</p>
        </div>
      )}
    </div>
  );
}

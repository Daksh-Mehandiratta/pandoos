import React from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { APP_VERSION } from '@/utils/constants';

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <div className="w-full px-4 pb-20">
      <h1 className="text-2xl font-bold text-white font-display mb-6">Profile</h1>

      {user ? (
        <>
          {/* User Card */}
          <div className="bg-surface-elevated rounded-2xl p-6 flex flex-col items-center border border-white/5 shadow-glass mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-base border-4 border-surface-elevated shadow-lg mb-4">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  <UserIcon size={40} />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-white">{user.username}</h2>
            <p className="text-sm text-text-muted mb-6">{user.email}</p>
            
            <button 
              onClick={() => signOut()}
              className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-full font-medium transition-colors border border-white/10"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </>
      ) : (
        <div className="bg-surface-elevated rounded-2xl p-8 flex flex-col items-center text-center border border-white/5 shadow-glass mb-8">
          <div className="w-16 h-16 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center mb-4">
            <UserIcon size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Not Signed In</h2>
          <p className="text-sm text-text-muted mb-6">
            Sign in to sync your playlists and liked songs across devices.
          </p>
          <button 
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-surface-base font-semibold rounded-xl touch-highlight"
          >
            Sign in with Google
          </button>
        </div>
      )}

      {/* App Info */}
      <div className="flex flex-col items-center justify-center text-text-muted mt-12 gap-2">
        <img src="/panda-icon.svg" alt="Logo" className="w-10 h-10 opacity-50 grayscale" />
        <p className="text-sm font-semibold tracking-wide">PANDOOS MUSIC</p>
        <p className="text-xs">Version {APP_VERSION}</p>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs mt-2 hover:text-white transition-colors"
        >
          Open Source
        </a>
      </div>
    </div>
  );
}

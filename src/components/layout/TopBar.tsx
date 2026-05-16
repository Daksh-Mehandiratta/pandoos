import React from 'react';
import { Settings } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUIStore } from '@/stores/useUIStore';

export function TopBar() {
  const user = useAuthStore((state) => state.user);
  const isPlayerOpen = useUIStore((state) => state.isPlayerOpen);

  // Hide the top bar when the full-screen player is open for a cleaner look
  if (isPlayerOpen) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-30 pt-safe bg-surface-base/80 backdrop-blur-xl border-b border-white/5 transition-opacity duration-300">
      <div className="flex items-center justify-between h-[var(--top-bar-height)] px-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <img src="/panda_favicon.png" alt="Pandoos" className="w-8 h-8 drop-shadow-glow-sm object-contain" />
          <span className="font-display font-bold text-xl tracking-tight text-white">
            Pandoos
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-sm font-medium text-text-muted truncate max-w-[100px]">
              Hi, {user.username.split(' ')[0]}
            </span>
          )}
          <button className="p-2 -mr-2 text-text-secondary hover:text-white transition-colors touch-highlight">
            <Settings size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}

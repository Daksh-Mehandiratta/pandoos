import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/useAuthStore';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/search', icon: Search, label: 'Search' },
  { path: '/library', icon: Library, label: 'Library' },
];

export function BottomNav() {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-elevated/80 backdrop-blur-xl border-t border-white/5 pb-safe">
      <div className="flex items-center justify-around h-[var(--bottom-nav-height)] px-2">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 touch-highlight transition-colors',
                isActive ? 'text-brand-primary' : 'text-text-muted hover:text-text-secondary'
              )
            }
          >
            <Icon size={24} strokeWidth={2.5} />
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
          </NavLink>
        ))}

        {/* Profile / Auth Tab */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-full h-full space-y-1 touch-highlight transition-colors',
              isActive ? 'text-brand-primary' : 'text-text-muted hover:text-text-secondary'
            )
          }
        >
          {user?.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt="Profile" 
              className="w-6 h-6 rounded-full border border-white/20"
            />
          ) : (
            <User size={24} strokeWidth={2.5} />
          )}
          <span className="text-[10px] font-medium tracking-wide">
            {user ? 'Profile' : 'Sign In'}
          </span>
        </NavLink>
      </div>
    </nav>
  );
}

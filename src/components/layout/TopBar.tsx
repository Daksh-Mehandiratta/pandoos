import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUIStore } from '@/stores/useUIStore';
import { useGamificationStore, computeXP, getRankForXP } from '@/stores/useGamificationStore';
import { motion } from 'framer-motion';
import { Flame, User } from 'lucide-react';

export function TopBar() {
  const user = useAuthStore((state) => state.user);
  const isPlayerOpen = useUIStore((state) => state.isPlayerOpen);
  const navigate = useNavigate();

  const gamification = useGamificationStore();
  const xp = computeXP(gamification);
  const rank = getRankForXP(xp);
  const streak = gamification.streakDays;

  // Hide the top bar when the full-screen player is open
  if (isPlayerOpen) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-30 pt-safe backdrop-blur-2xl border-b border-white/5 transition-opacity duration-300"
      style={{ background: 'rgba(10,10,15,0.85)' }}
    >
      <div className="flex items-center justify-between h-[var(--top-bar-height)] px-4">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Pandoos" className="w-8 h-8 object-contain" />
          <span className="font-display font-bold text-xl tracking-tight text-white">
            Pandoos
          </span>
        </div>

        {/* Right: Streak pill + Profile Avatar */}
        <div className="flex items-center gap-2">

          {/* Streak pill — only show if user has a streak */}
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30"
            >
              <Flame size={13} className="text-orange-400" />
              <span className="text-xs font-bold text-orange-300">{streak}d</span>
            </motion.div>
          )}

          {/* Profile Avatar Button */}
          <motion.button
            onClick={() => navigate('/profile')}
            whileTap={{ scale: 0.92 }}
            className="relative group"
          >
            {/* Glowing rank ring */}
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${rank.color} p-[2px] shadow-lg group-hover:shadow-xl transition-shadow`}>
              <div className="w-full h-full rounded-full bg-surface-base overflow-hidden flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm">{rank.emoji}</span>
                )}
              </div>
            </div>

            {/* XP badge tooltip on hover */}
            <div className="absolute -bottom-7 right-0 hidden group-hover:flex items-center gap-1 bg-black/90 border border-white/10 rounded-full px-2 py-0.5 text-[10px] font-bold text-white whitespace-nowrap shadow-xl z-50">
              ⭐ {xp} XP
            </div>

            {/* Pulse ring for logged-in users */}
            {user && (
              <span className="absolute inset-0 rounded-full ring-2 ring-brand-primary/0 group-hover:ring-brand-primary/40 transition-all duration-300" />
            )}
          </motion.button>

          {/* Show "Sign In" button if not logged in */}
          {!user && (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-brand-primary text-xs font-bold hover:bg-brand-primary/30 transition-colors"
            >
              <User size={12} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

import { ALL_BADGES, type Badge, PANDA_RANKS, getRankForXP, getXPProgress, computeXP, useGamificationStore } from '@/stores/useGamificationStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { LogOut, Flame, Clock, Trophy, Heart, Music, Star, Share2, Lock } from 'lucide-react';
import { APP_VERSION } from '@/utils/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// ─────────────────────────────────────────────
// Badge Card
// ─────────────────────────────────────────────
function BadgeCard({ badge, earned, index }: { badge: Badge; earned: boolean; index: number }) {
  const [copied, setCopied] = useState(false);

  const rarityLabel = {
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary ✨',
  }[badge.rarity];

  const rarityBorder = {
    common: 'border-white/10',
    rare: 'border-blue-400/40',
    epic: 'border-purple-400/50',
    legendary: 'border-amber-400/60',
  }[badge.rarity];

  const handleShare = () => {
    const text = `🐼 I just earned the "${badge.name}" ${badge.emoji} badge on Pandoos Music! ${badge.description} #PandoosMusic #PandaLife`;
    if (navigator.share) {
      navigator.share({ title: 'My Pandoos Badge!', text });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: 'easeOut' }}
      className={`relative group rounded-2xl border ${rarityBorder} p-4 flex flex-col items-center gap-2 transition-all duration-300 ${
        earned
          ? 'bg-white/5 hover:bg-white/8 hover:scale-[1.03]'
          : 'bg-white/[0.02] opacity-50 grayscale'
      }`}
    >
      {/* Glow for earned badges */}
      {earned && badge.rarity !== 'common' && (
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${badge.color} opacity-10 blur-sm pointer-events-none`} />
      )}

      {/* Emoji */}
      <div className={`text-3xl w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${earned ? badge.color : 'from-gray-600 to-gray-700'} shadow-lg`}>
        {earned ? badge.emoji : <Lock size={20} className="text-white/40" />}
      </div>

      {/* Name */}
      <p className="text-xs font-bold text-white text-center leading-tight mt-1">{badge.name}</p>

      {/* Rarity */}
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
        badge.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-400' :
        badge.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
        badge.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
        'bg-white/10 text-white/50'
      }`}>{rarityLabel}</span>

      {/* Share button — only show on hover for earned badges */}
      {earned && (
        <button
          onClick={handleShare}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white/10 rounded-lg hover:bg-white/20"
          title="Share badge"
        >
          {copied ? <span className="text-[10px] text-green-400 font-bold">✓</span> : <Share2 size={12} className="text-white/70" />}
        </button>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Stat Pill
// ─────────────────────────────────────────────
function StatPill({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-white/5 border border-white/8 min-w-0 flex-1`}>
      <div className={`p-2 rounded-xl bg-gradient-to-br ${color} shadow-md`}>
        {icon}
      </div>
      <span className="text-xl font-display font-extrabold text-white">{value}</span>
      <span className="text-[11px] text-white/50 font-medium">{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// XP Ring
// ─────────────────────────────────────────────
function XPRing({ xp, rank, progress }: { xp: number; rank: typeof PANDA_RANKS[0]; progress: ReturnType<typeof getXPProgress> }) {
  const circumference = 2 * Math.PI * 54;
  const dash = (progress.percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        {/* Glow */}
        <div className={`absolute inset-4 rounded-full bg-gradient-to-br ${rank.color} opacity-20 blur-xl`} />
        {/* Ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            className="transition-all duration-1000"
            style={{ stroke: 'url(#xpGrad)' }}
          />
          <defs>
            <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--color-primary))" />
              <stop offset="100%" stopColor="hsl(var(--color-accent))" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl">{rank.emoji}</span>
          <span className="text-xs font-bold text-white/80 mt-0.5">{xp} XP</span>
        </div>
      </div>
      <p className={`mt-3 text-sm font-bold bg-gradient-to-r ${rank.color} bg-clip-text text-transparent`}>
        {rank.name}
      </p>
      <p className="text-[11px] text-white/40 mt-0.5">{progress.current} / {progress.next} XP to next rank</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Top Mood Card
// ─────────────────────────────────────────────
function TopMoodBadge({ moodCounts }: { moodCounts: Record<string, number> }) {
  const entries = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return null;
  const [topMood, topCount] = entries[0]!;

  const moodEmoji: Record<string, string> = {
    happy: '😊', sad: '😢', chill: '😎', energy: '⚡',
    romantic: '💕', angry: '😤', sleepy: '😴', workout: '💪',
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/8">
      <span className="text-2xl">{moodEmoji[topMood] ?? '🎵'}</span>
      <div>
        <p className="text-xs text-white/50">Top Mood</p>
        <p className="text-sm font-bold text-white capitalize">{topMood}</p>
      </div>
      <div className="ml-auto text-right">
        <p className="text-xs text-white/50">Sessions</p>
        <p className="text-sm font-bold text-brand-primary">{topCount}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Recent Listening History
// ─────────────────────────────────────────────
function RecentHistory() {
  const history = usePlayerStore((s) => s.history).slice(0, 6);

  if (!history.length) return null;

  return (
    <div className="mt-4">
      <h3 className="text-sm font-bold text-white/70 mb-3 flex items-center gap-2">
        <Music size={14} />
        Recent Jams
      </h3>
      <div className="flex flex-col gap-2">
        {history.map((track, i) => (
          <div key={`${track.id}-${i}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <img
              src={`https://img.youtube.com/vi/${track.videoId}/default.jpg`}
              alt={track.title}
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{track.title}</p>
              <p className="text-xs text-white/50 truncate">{track.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Profile Page
// ─────────────────────────────────────────────
export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const signOut = useAuthStore((s) => s.signOut);
  const [activeTab, setActiveTab] = useState<'badges' | 'history' | 'stats'>('badges');

  const gamification = useGamificationStore();
  const xp = computeXP(gamification);
  const rank = getRankForXP(xp);
  const xpProgress = getXPProgress(xp);
  const earnedCount = gamification.earnedBadges.length;
  const listenHours = Math.floor(gamification.listenMinutes / 60);

  // Award first_song if player history exists
  const history = usePlayerStore((s) => s.history);
  if (history.length > 0 && !gamification.earnedBadges.includes('first_song')) {
    gamification.checkAndAwardBadges();
  }

  return (
    <div className="w-full min-h-full pb-32 scroll-container">
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-b-3xl mb-6 pb-8 pt-4 px-4">
        {/* Background aurora */}
        <div className={`absolute inset-0 bg-gradient-to-br ${rank.color} opacity-20 pointer-events-none`} />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-base to-transparent pointer-events-none" />

        <div className="relative flex flex-col items-center gap-4">
          {/* Avatar */}
          <div className={`relative w-24 h-24 rounded-full overflow-hidden border-4 bg-gradient-to-br ${rank.color} p-0.5 shadow-xl`}>
            <div className="w-full h-full rounded-full overflow-hidden bg-surface-base">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-surface-elevated">
                  🐼
                </div>
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-surface-base" />
          </div>

          {user ? (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-display font-extrabold text-white">{user.username}</h1>
                <p className="text-sm text-white/50 mt-0.5">{user.email}</p>
              </div>
              <XPRing xp={xp} rank={rank} progress={xpProgress} />
            </>
          ) : (
            <div className="text-center py-6">
              <span className="text-5xl mb-4 block">🐼</span>
              <h2 className="text-xl font-bold text-white mb-2">Meet Your Panda!</h2>
              <p className="text-sm text-white/60 mb-6 max-w-xs">Sign in to unlock your Panda Rank, earn badges, and track your music journey.</p>
              <button
                onClick={() => signInWithGoogle()}
                className="flex items-center gap-3 px-8 py-3.5 bg-white text-gray-900 font-bold rounded-2xl shadow-xl hover:shadow-white/20 transition-all hover:scale-105"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>
            </div>
          )}
        </div>
      </div>

      {user && (
        <div className="px-4 space-y-6">
          {/* ── Stats Row ── */}
          <div className="flex gap-3">
            <StatPill icon={<Flame size={16} className="text-white" />} label="Day Streak" value={gamification.streakDays} color="from-orange-400 to-red-500" />
            <StatPill icon={<Clock size={16} className="text-white" />} label="Hrs Listened" value={listenHours} color="from-blue-400 to-indigo-500" />
            <StatPill icon={<Trophy size={16} className="text-white" />} label="Badges" value={`${earnedCount}/${ALL_BADGES.length}`} color="from-amber-400 to-orange-500" />
            <StatPill icon={<Heart size={16} className="text-white" />} label="Liked" value={gamification.likedSongs.length} color="from-pink-400 to-rose-500" />
          </div>

          {/* Top Mood */}
          {Object.keys(gamification.moodSessionCounts).length > 0 && (
            <TopMoodBadge moodCounts={gamification.moodSessionCounts} />
          )}

          {/* ── Tabs ── */}
          <div className="flex rounded-2xl bg-white/5 p-1 gap-1">
            {(['badges', 'history', 'stats'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-white/15 text-white shadow'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <AnimatePresence mode="wait">
            {activeTab === 'badges' && (
              <motion.div key="badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Earned count banner */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-white/70">
                    <span className="text-brand-primary text-lg font-extrabold">{earnedCount}</span> / {ALL_BADGES.length} badges earned
                  </p>
                  {earnedCount === ALL_BADGES.length && (
                    <span className="text-xs bg-amber-400/20 text-amber-400 px-2 py-1 rounded-full font-bold">ALL UNLOCKED 👑</span>
                  )}
                </div>

                {/* Badge grid */}
                <div className="grid grid-cols-3 gap-3">
                  {ALL_BADGES.map((badge, i) => (
                    <BadgeCard
                      key={badge.id}
                      badge={badge}
                      earned={gamification.earnedBadges.includes(badge.id)}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <RecentHistory />
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <div className="space-y-3">
                  {[
                    { label: 'Total Minutes Listened', value: Math.floor(gamification.listenMinutes), icon: '⏱️' },
                    { label: 'Longest Streak (days)', value: gamification.longestStreak, icon: '🔥' },
                    { label: 'Unique Moods Tried', value: Object.keys(gamification.moodSessionCounts).length, icon: '🎭' },
                    { label: 'Night Owl Sessions', value: gamification.nightOwlSessions, icon: '🌙' },
                    { label: 'Early Bird Sessions', value: gamification.earlyBirdSessions, icon: '🌅' },
                    { label: 'Liked Songs', value: gamification.likedSongs.length, icon: '💕' },
                    { label: 'Total XP Earned', value: xp, icon: '⭐' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/8">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{icon}</span>
                        <span className="text-sm font-medium text-white/70">{label}</span>
                      </div>
                      <span className="text-lg font-extrabold text-white font-display">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Rank progression */}
                <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/8">
                  <p className="text-sm font-bold text-white/70 mb-4 flex items-center gap-2"><Star size={14} /> Rank Progression</p>
                  <div className="space-y-2">
                    {PANDA_RANKS.map((r) => (
                      <div key={r.name} className={`flex items-center gap-3 p-2 rounded-xl ${rank.name === r.name ? 'bg-white/10 border border-white/20' : ''}`}>
                        <span className="text-lg w-8 text-center">{r.emoji}</span>
                        <span className={`text-sm font-semibold flex-1 ${rank.name === r.name ? 'text-white' : 'text-white/40'}`}>{r.name}</span>
                        <span className="text-xs text-white/30">{r.minXP} XP</span>
                        {rank.name === r.name && <span className="text-[10px] bg-brand-primary/30 text-brand-primary px-2 py-0.5 rounded-full font-bold">CURRENT</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Logout ── */}
          <div className="pt-4 border-t border-white/5">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold border border-red-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          {/* ── Footer ── */}
          <div className="flex flex-col items-center gap-2 text-white/30 pt-4 pb-6">
            <img src="/panda_favicon.png" alt="Pandoos" className="w-8 h-8 opacity-30 grayscale object-contain" />
            <p className="text-xs font-semibold tracking-widest">PANDOOS MUSIC</p>
            <p className="text-[10px]">v{APP_VERSION} · Where Pandas Vibe 🐼</p>
          </div>
        </div>
      )}
    </div>
  );
}

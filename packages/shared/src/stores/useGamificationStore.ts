import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ─────────────────────────────────────────────
// Badge Definitions
// ─────────────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string; // gradient CSS string
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const ALL_BADGES: Badge[] = [
  {
    id: 'welcome_panda',
    name: 'Welcome, Panda!',
    emoji: '🐾',
    description: 'You joined the Pandoos family. The vibe starts now!',
    color: 'from-violet-400 via-pink-400 to-amber-400',
    rarity: 'epic',
  },
  {
    id: 'first_song',
    name: 'First Groove',
    emoji: '🎵',
    description: 'Played your very first song on Pandoos!',
    color: 'from-emerald-400 to-teal-500',
    rarity: 'common',
  },
  {
    id: 'week_one',
    name: 'Week Warrior',
    emoji: '🐼',
    description: 'Listened 7 days in a row. Consistency is key!',
    color: 'from-blue-400 to-indigo-500',
    rarity: 'rare',
  },
  {
    id: 'loyal_fan',
    name: 'Loyal Panda',
    emoji: '🤝',
    description: 'Achieved a 14-day listening streak!',
    color: 'from-violet-400 to-purple-600',
    rarity: 'rare',
  },
  {
    id: 'month_one',
    name: 'Monthly Maven',
    emoji: '🏆',
    description: 'An epic 30-day streak! You are unstoppable.',
    color: 'from-amber-400 to-orange-500',
    rarity: 'epic',
  },
  {
    id: 'hundred_min',
    name: 'Century Listener',
    emoji: '⏱️',
    description: '100 minutes of music listened. Time flies!',
    color: 'from-cyan-400 to-blue-500',
    rarity: 'common',
  },
  {
    id: 'gold_ears',
    name: 'Gold Ears',
    emoji: '👂',
    description: '500 minutes of pure musical immersion.',
    color: 'from-yellow-400 to-amber-500',
    rarity: 'epic',
  },
  {
    id: 'romantic_listener',
    name: 'Lover Panda',
    emoji: '💕',
    description: 'A hopeless romantic — 10 romantic mood sessions.',
    color: 'from-pink-400 to-rose-500',
    rarity: 'rare',
  },
  {
    id: 'chill_vibes',
    name: 'Chill Panda',
    emoji: '😎',
    description: 'Master of relaxation. 10 chill mood sessions.',
    color: 'from-sky-400 to-cyan-500',
    rarity: 'common',
  },
  {
    id: 'beast_mode',
    name: 'Beast Mode',
    emoji: '🔥',
    description: 'Pure energy! 10 workout mood sessions crushed.',
    color: 'from-red-400 to-orange-500',
    rarity: 'rare',
  },
  {
    id: 'night_owl',
    name: 'Night Owl Panda',
    emoji: '🦉',
    description: 'Caught vibing after midnight. The night is yours.',
    color: 'from-indigo-500 to-violet-700',
    rarity: 'rare',
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    emoji: '🌅',
    description: 'Started the day with music before 7am. Rise & groove!',
    color: 'from-orange-400 to-pink-400',
    rarity: 'rare',
  },
  {
    id: 'explorer',
    name: 'Music Explorer',
    emoji: '🗺️',
    description: 'Explored all 8 Panda moods. The true adventurer!',
    color: 'from-lime-400 to-emerald-500',
    rarity: 'epic',
  },
  {
    id: 'mood_master',
    name: 'Mood Master',
    emoji: '🎭',
    description: 'Used 5 different moods in your sessions.',
    color: 'from-fuchsia-400 to-pink-500',
    rarity: 'rare',
  },
  {
    id: 'night_warrior',
    name: 'Night Warrior',
    emoji: '🌙',
    description: 'Survived 7 late-night listening sessions.',
    color: 'from-slate-600 to-indigo-700',
    rarity: 'epic',
  },
  {
    id: 'queue_master',
    name: 'Queue Master',
    emoji: '📋',
    description: 'Built a massive queue of 10+ songs. Party starter!',
    color: 'from-teal-400 to-green-500',
    rarity: 'common',
  },
  {
    id: 'legendary',
    name: 'Legend Panda',
    emoji: '👑',
    description: 'Reached 1000 XP. You are the ultimate Pandoos legend.',
    color: 'from-yellow-300 via-amber-400 to-orange-500',
    rarity: 'legendary',
  },
];

// ─────────────────────────────────────────────
// Rank System
// ─────────────────────────────────────────────

export interface PandaRank {
  name: string;
  emoji: string;
  minXP: number;
  maxXP: number;
  color: string;
}

export const PANDA_RANKS: PandaRank[] = [
  { name: 'Panda Egg',    emoji: '🐣', minXP: 0,    maxXP: 49,   color: 'from-gray-400 to-slate-500' },
  { name: 'Panda Cub',   emoji: '🐼', minXP: 50,   maxXP: 199,  color: 'from-emerald-400 to-teal-500' },
  { name: 'Groove Panda',emoji: '🎵', minXP: 200,  maxXP: 499,  color: 'from-blue-400 to-indigo-500' },
  { name: 'Star Panda',  emoji: '⭐', minXP: 500,  maxXP: 799,  color: 'from-violet-400 to-purple-600' },
  { name: 'Fire Panda',  emoji: '🔥', minXP: 800,  maxXP: 999,  color: 'from-orange-400 to-red-500' },
  { name: 'Legend Panda',emoji: '👑', minXP: 1000, maxXP: 9999, color: 'from-yellow-300 via-amber-400 to-orange-500' },
];

export function getRankForXP(xp: number): PandaRank {
  return PANDA_RANKS.slice().reverse().find((r) => xp >= r.minXP) ?? PANDA_RANKS[0]!;
}

export function getXPProgress(xp: number): { current: number; next: number; percent: number } {
  const rank = getRankForXP(xp);
  const current = xp - rank.minXP;
  const range = rank.maxXP - rank.minXP;
  return { current, next: range, percent: Math.min((current / range) * 100, 100) };
}

// ─────────────────────────────────────────────
// Store State & Actions
// ─────────────────────────────────────────────

interface GamificationState {
  listenMinutes: number;
  streakDays: number;
  longestStreak: number;
  lastListenDate: string | null; // ISO date string 'YYYY-MM-DD'
  likedSongs: string[];          // videoIds
  favoriteMoods: string[];       // mood strings, may have duplicates (use for counting)
  earnedBadges: string[];        // badge ids
  nightOwlSessions: number;
  earlyBirdSessions: number;
  queueMaxSize: number;
  moodSessionCounts: Record<string, number>;
  /** Badge IDs queued for reveal animation, consumed one at a time */
  pendingReveal: string[];
}

interface GamificationActions {
  recordListenSession: (durationSeconds: number, mood?: string, queueSize?: number) => void;
  likeSong: (videoId: string) => void;
  unlikeSong: (videoId: string) => void;
  toggleLike: (videoId: string) => void;
  checkAndAwardBadges: () => void;
  /** Award a badge immediately and queue it for reveal animation */
  awardBadge: (id: string) => void;
  /** Called after the reveal modal is shown — removes the badge from the queue */
  consumeReveal: () => void;
  reset: () => void;
}

type GamificationStore = GamificationState & GamificationActions;

const DEFAULT_STATE: GamificationState = {
  listenMinutes: 0,
  streakDays: 0,
  longestStreak: 0,
  lastListenDate: null,
  likedSongs: [],
  favoriteMoods: [],
  earnedBadges: [],
  nightOwlSessions: 0,
  earlyBirdSessions: 0,
  queueMaxSize: 0,
  moodSessionCounts: {},
  pendingReveal: [],
};

export const useGamificationStore = create<GamificationStore>()(
  persist(
    immer((set, get) => ({
      ...DEFAULT_STATE,

      recordListenSession: (durationSeconds, mood, queueSize) => {
        set((state) => {
          const minutes = durationSeconds / 60;
          state.listenMinutes += minutes;

          // Streak logic
          const today = new Date().toISOString().split('T')[0]!;
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]!;
          if (state.lastListenDate !== today) {
            if (state.lastListenDate === yesterday) {
              state.streakDays += 1;
            } else {
              state.streakDays = 1; // reset
            }
            state.lastListenDate = today;
            if (state.streakDays > state.longestStreak) {
              state.longestStreak = state.streakDays;
            }
          }

          // Time of day tracking
          const hour = new Date().getHours();
          if (hour >= 0 && hour < 4) state.nightOwlSessions += 1;
          if (hour >= 4 && hour < 7) state.earlyBirdSessions += 1;

          // Mood tracking
          if (mood) {
            state.favoriteMoods.push(mood);
            state.moodSessionCounts[mood] = (state.moodSessionCounts[mood] ?? 0) + 1;
          }

          // Queue tracking
          if (queueSize && queueSize > state.queueMaxSize) {
            state.queueMaxSize = queueSize;
          }
        });

        // Check badges after state is set
        get().checkAndAwardBadges();
      },

      likeSong: (videoId) => {
        set((state) => {
          if (!state.likedSongs.includes(videoId)) {
            state.likedSongs.push(videoId);
          }
        });
        get().checkAndAwardBadges();
      },

      unlikeSong: (videoId) => {
        set((state) => {
          state.likedSongs = state.likedSongs.filter((id) => id !== videoId);
        });
      },

      toggleLike: (videoId) => {
        const isLiked = get().likedSongs.includes(videoId);
        if (isLiked) {
          get().unlikeSong(videoId);
        } else {
          get().likeSong(videoId);
        }
      },

      checkAndAwardBadges: () => {
        set((state) => {
          const {
            listenMinutes, streakDays, earnedBadges, moodSessionCounts,
            nightOwlSessions, earlyBirdSessions, queueMaxSize, favoriteMoods,
          } = state;

          const award = (id: string) => {
            if (!earnedBadges.includes(id)) earnedBadges.push(id);
          };

          // Listen counts
          if (listenMinutes > 0) award('first_song');
          if (listenMinutes >= 100) award('hundred_min');
          if (listenMinutes >= 500) award('gold_ears');

          // Streaks
          if (streakDays >= 7) award('week_one');
          if (streakDays >= 14) award('loyal_fan');
          if (streakDays >= 30) award('month_one');

          // Mood badges
          if ((moodSessionCounts['romantic'] ?? 0) >= 10) award('romantic_listener');
          if ((moodSessionCounts['chill'] ?? 0) >= 10) award('chill_vibes');
          if ((moodSessionCounts['energy'] ?? 0) >= 10) award('beast_mode');

          // Time of day
          if (nightOwlSessions >= 1) award('night_owl');
          if (earlyBirdSessions >= 1) award('early_bird');
          if (nightOwlSessions >= 7) award('night_warrior');

          // Exploration
          const uniqueMoods = new Set(Object.keys(moodSessionCounts)).size;
          if (uniqueMoods >= 5) award('mood_master');
          if (uniqueMoods >= 8) award('explorer');

          // Queue
          if (queueMaxSize >= 10) award('queue_master');

          // XP milestone
          const xp = Math.floor((listenMinutes * 2) + (streakDays * 10) + (earnedBadges.length * 25));
          if (xp >= 1000) award('legendary');
        });
      },

      awardBadge: (id) => {
        set((state) => {
          if (!state.earnedBadges.includes(id)) {
            state.earnedBadges.push(id);
            state.pendingReveal.push(id);
          }
        });
      },

      consumeReveal: () => {
        set((state) => {
          state.pendingReveal.shift();
        });
      },

      reset: () => set(() => ({ ...DEFAULT_STATE })),
    })),
    {
      name: 'pandoos-gamification-v1',
    }
  )
);

// Derived XP selector (not stored, always computed)
export function computeXP(state: GamificationState): number {
  return Math.floor(
    (state.listenMinutes * 2) +
    (state.streakDays * 10) +
    (state.earnedBadges.length * 25)
  );
}

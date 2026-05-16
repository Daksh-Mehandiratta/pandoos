import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useGamificationStore, ALL_BADGES, type Badge } from '@/stores/useGamificationStore';
import { Share2 } from 'lucide-react';

// ─── Confetti Particle ────────────────────────────────────────────────────────
function Particle({ x, y, emoji, delay, angle }: {
  x: number; y: number; emoji: string; delay: number; angle: number;
}) {
  const rad = (angle * Math.PI) / 180;
  const distance = 120 + Math.random() * 160;
  return (
    <motion.div
      className="absolute text-xl pointer-events-none select-none z-10"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.4, 1, 0.6],
        x: Math.cos(rad) * distance,
        y: Math.sin(rad) * distance,
        rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
      }}
      transition={{ duration: 1.4 + Math.random() * 0.6, delay, ease: [0.2, 0, 0.4, 1] }}
    >
      {emoji}
    </motion.div>
  );
}

// ─── Shockwave Ring ───────────────────────────────────────────────────────────
function ShockWave({ delay, color }: { delay: number; color: string }) {
  return (
    <motion.div
      className={`absolute inset-0 rounded-full border-4 ${color}`}
      initial={{ scale: 0.5, opacity: 0.9 }}
      animate={{ scale: 3.5, opacity: 0 }}
      transition={{ duration: 0.9, delay, ease: 'easeOut' }}
    />
  );
}

// ─── Rarity Config ────────────────────────────────────────────────────────────
const RARITY_CONFIG = {
  common: {
    label: 'COMMON',
    outerRing: 'from-slate-400 to-slate-500',
    glow: 'rgba(148,163,184,0.5)',
    shockColor: 'border-slate-400',
    bg: 'from-slate-900 via-slate-800 to-slate-900',
    pandas: ['🐼', '🎵', '✨', '⭐'],
    message: '"Great start! Every journey begins with one step 🐾"',
  },
  rare: {
    label: 'RARE',
    outerRing: 'from-blue-400 to-indigo-500',
    glow: 'rgba(99,102,241,0.7)',
    shockColor: 'border-blue-400',
    bg: 'from-blue-950 via-indigo-900 to-blue-950',
    pandas: ['🐼', '🌟', '💙', '🎵', '✨', '🌀'],
    message: '"Rare achievement unlocked! You\'re becoming a legend! 🌟"',
  },
  epic: {
    label: 'EPIC',
    outerRing: 'from-violet-400 to-fuchsia-500',
    glow: 'rgba(167,139,250,0.8)',
    shockColor: 'border-violet-400',
    bg: 'from-violet-950 via-purple-900 to-fuchsia-950',
    pandas: ['🐼', '💜', '🎊', '🌟', '✨', '🔮', '💫', '🎵'],
    message: '"EPIC!! You\'re on another level. The Panda Oracle is proud! 🔮"',
  },
  legendary: {
    label: 'LEGENDARY',
    outerRing: 'from-yellow-300 via-amber-400 to-orange-400',
    glow: 'rgba(251,191,36,0.9)',
    shockColor: 'border-amber-400',
    bg: 'from-amber-950 via-orange-900 to-yellow-950',
    pandas: ['🐼', '👑', '⚡', '🌟', '💛', '🏆', '✨', '🔥', '💫', '🎊', '💎', '🌠'],
    message: '"LEGENDARY. You are the ultimate Pandoos champion. BOW DOWN 👑"',
  },
};

// ─── Phase-based reveal sequence ──────────────────────────────────────────────
type Phase = 'idle' | 'charge' | 'burst' | 'reveal' | 'done';

function BadgeReveal({ badge, onDismiss }: { badge: Badge; onDismiss: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [copied, setCopied] = useState(false);
  const glowControls = useAnimation();
  const config = RARITY_CONFIG[badge.rarity];

  // Build burst particles (360° spread from center)
  const particles = Array.from({ length: config.pandas.length * 2 }, (_, i) => ({
    id: i,
    x: 50,
    y: 50,
    emoji: config.pandas[i % config.pandas.length]!,
    delay: 0.02 * i,
    angle: (360 / (config.pandas.length * 2)) * i,
  }));

  // Auto-advance phases
  useEffect(() => {
    setPhase('idle');
    const t1 = setTimeout(() => setPhase('charge'), 100);
    const t2 = setTimeout(() => setPhase('burst'), 1100);
    const t3 = setTimeout(() => setPhase('reveal'), 1400);
    const t4 = setTimeout(() => setPhase('done'), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [badge.id]);

  // Continuous glow pulse after reveal
  useEffect(() => {
    if (phase === 'done') {
      glowControls.start({
        opacity: [0.4, 0.9, 0.4],
        scale: [1, 1.15, 1],
        transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
      });
    }
  }, [phase, glowControls]);

  const handleShare = () => {
    const text = `🐼 I just earned the "${badge.name}" ${badge.emoji} badge on Pandoos Music!\n\n"${badge.description}"\n\nJoin me → #PandoosMusic #WhereePandasVibe`;
    if (navigator.share) {
      navigator.share({ title: `I earned: ${badge.name}!`, text });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      {/* ── Full-screen backdrop ── */}
      <motion.div
        className="fixed inset-0 z-[200]"
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* ── Modal container ── */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-hidden">

        {/* ── CHARGE phase: building energy bar ── */}
        <AnimatePresence>
          {phase === 'charge' && (
            <motion.div
              key="charge"
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
            >
              {/* Charging panda */}
              <motion.div
                className="text-7xl"
                animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 0.3 }}
              >
                🐼
              </motion.div>
              <motion.p
                className="text-white/70 text-sm font-bold tracking-widest uppercase"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                Unlocking Badge...
              </motion.p>
              {/* Charging bar */}
              <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${badge.color}`}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.85, ease: 'easeIn' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BURST phase: explosion ── */}
        <AnimatePresence>
          {phase === 'burst' && (
            <div key="burst" className="relative flex items-center justify-center w-48 h-48">
              {/* Multiple shockwaves */}
              <ShockWave delay={0}    color={config.shockColor} />
              <ShockWave delay={0.15} color={config.shockColor} />
              <ShockWave delay={0.30} color={config.shockColor} />
              {/* Burst particles fly out */}
              {particles.map((p) => (
                <Particle key={p.id} {...p} />
              ))}
              {/* Central flash */}
              <motion.div
                className={`w-24 h-24 rounded-full bg-gradient-to-br ${badge.color}`}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 2.5, 0], opacity: [1, 0.8, 0] }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          )}
        </AnimatePresence>

        {/* ── REVEAL & DONE phases: full card ── */}
        <AnimatePresence>
          {(phase === 'reveal' || phase === 'done') && (
            <motion.div
              key="card"
              className={`relative w-full max-w-sm rounded-3xl bg-gradient-to-b ${config.bg} border border-white/10 overflow-hidden`}
              initial={{ scale: 0.3, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 18, stiffness: 220 }}
            >
              {/* Top accent bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${badge.color}`} />

              {/* Roaming background glow */}
              <motion.div
                className={`absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl bg-gradient-to-br ${badge.color} opacity-20 pointer-events-none`}
                animate={{ y: [0, 20, 0], opacity: [0.15, 0.35, 0.15] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              />

              <div className="flex flex-col items-center px-6 pt-8 pb-7 gap-5">

                {/* "NEW BADGE" pill */}
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${badge.color} text-black text-[11px] font-black tracking-[0.15em] uppercase shadow-lg`}
                >
                  🎉 Badge Unlocked!
                </motion.div>

                {/* Badge emoji with glow halo */}
                <motion.div
                  className="relative"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 160, delay: 0.05 }}
                >
                  {/* Animated glow halo */}
                  <motion.div
                    className={`absolute inset-0 rounded-full blur-2xl scale-150 bg-gradient-to-br ${badge.color}`}
                    animate={glowControls}
                    initial={{ opacity: 0.4, scale: 1.3 }}
                  />
                  {/* Ring */}
                  <div className={`w-32 h-32 rounded-full p-[3px] bg-gradient-to-br ${config.outerRing} shadow-2xl`}>
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-5xl shadow-inner`}>
                      <motion.span
                        animate={{ rotate: [0, -8, 8, -4, 4, 0], scale: [1, 1.1, 1] }}
                        transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                      >
                        {badge.emoji}
                      </motion.span>
                    </div>
                  </div>
                </motion.div>

                {/* Badge name + rarity */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-display font-black text-white drop-shadow-lg mb-1">
                    {badge.name}
                  </h2>
                  <motion.span
                    className={`inline-block text-[11px] font-black tracking-[0.2em] px-3 py-1 rounded-full bg-gradient-to-r ${badge.color} text-black uppercase`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.3, stiffness: 300 }}
                  >
                    ✦ {config.label} ✦
                  </motion.span>
                  <motion.p
                    className="text-sm text-white/65 leading-relaxed mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {badge.description}
                  </motion.p>
                </motion.div>

                {/* Panda speech bubble */}
                <motion.div
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.span
                    className="text-3xl shrink-0"
                    animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  >
                    🐼
                  </motion.span>
                  <p className="text-sm text-white/75 italic leading-relaxed pt-1">
                    {badge.id === 'welcome_panda'
                      ? '"Welcome to the Pandoos family! The greatest music journey of your life starts NOW 🐾"'
                      : config.message}
                  </p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  className="flex w-full gap-3"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.button
                    onClick={handleShare}
                    whileTap={{ scale: 0.94 }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r ${badge.color} text-black font-black text-sm shadow-xl active:scale-95 transition-opacity hover:opacity-90`}
                  >
                    <Share2 size={15} />
                    {copied ? 'Copied ✓' : 'Share 🎊'}
                  </motion.button>

                  <motion.button
                    onClick={onDismiss}
                    whileTap={{ scale: 0.94 }}
                    className="flex-1 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/10 transition-all"
                  >
                    Awesome 🐾
                  </motion.button>
                </motion.div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// ─── Main export — consumes pending reveal queue ──────────────────────────────
export function BadgeRevealModal() {
  const pendingReveal = useGamificationStore((s) => s.pendingReveal);
  const consumeReveal = useGamificationStore((s) => s.consumeReveal);

  const badgeId = pendingReveal[0];
  const badge = badgeId ? ALL_BADGES.find((b) => b.id === badgeId) : null;

  return (
    <AnimatePresence mode="wait">
      {badge && (
        <BadgeReveal key={badge.id} badge={badge} onDismiss={consumeReveal} />
      )}
    </AnimatePresence>
  );
}

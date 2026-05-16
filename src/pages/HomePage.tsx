import React from 'react';
import { motion } from 'framer-motion';
import { PandaMascot } from '@/features/panda/components/PandaMascot';
import { useTrending } from '@/features/search/hooks/useSearch';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { getBestThumbnail } from '@/services/youtube';
import { MOODS } from '@/utils/constants';

export function HomePage() {
  const { data: trending, isLoading } = useTrending();
  const playTrack = usePlayerStore((state) => state.playTrack);

  return (
    <div className="w-full min-h-full pb-20 relative">
      {/* Aurora Background covering the whole page */}
      <div className="fixed inset-0 mood-bg -z-20 pointer-events-none" />

      <div className="px-4 pt-4 relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full rounded-[2.5rem] overflow-hidden glass-heavy p-6 mb-10 flex flex-col items-center justify-center min-h-[280px]"
        >
          <div className="z-10 flex flex-col items-center">
            {/* The Mascot is the centerpiece */}
            <PandaMascot size={140} className="-mt-8 drop-shadow-2xl" />
            <h1 className="text-4xl font-display font-extrabold text-white mt-4 text-center text-gradient tracking-tight drop-shadow-md">
              What's the vibe today?
            </h1>
            <p className="text-white/60 font-medium mt-2">Pick a mood to start playing</p>
          </div>
        </motion.div>

        {/* Mood Grid */}
        <h2 className="text-2xl font-display font-bold text-white mb-5 pl-2 drop-shadow-md">
          Mood Engine
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {MOODS.map((mood, i) => (
            <motion.button
              key={mood.id}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-4 rounded-[1.5rem] glass-mood text-left"
              style={{ 
                background: `linear-gradient(135deg, rgba(255,255,255,0.05), hsl(${mood.color} / 0.1))`
              }}
            >
              <span className="text-3xl drop-shadow-md">{mood.emoji}</span>
              <span className="font-bold text-[15px] text-white/90">{mood.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Trending Now */}
        <h2 className="text-2xl font-display font-bold text-white mb-5 pl-2 drop-shadow-md">
          Trending Now
        </h2>
        
        {isLoading ? (
          <div className="flex gap-5 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[150px] w-[150px] h-[200px] rounded-[2rem] skeleton shrink-0" />
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto scroll-container gap-5 pb-6 -mx-4 px-4 snap-x snap-mandatory">
            {trending?.map((track) => (
              <motion.button
                key={track.id}
                whileTap={{ scale: 0.92 }}
                whileHover={{ y: -5 }}
                onClick={() => playTrack(track, trending)}
                className="flex flex-col min-w-[150px] w-[150px] shrink-0 snap-start text-left group"
              >
                <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-4 relative shadow-glass border border-white/5">
                  <img 
                    src={getBestThumbnail(track.videoId)} 
                    alt={track.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-brand-primary/90 text-white flex items-center justify-center shadow-glow-md backdrop-blur-md">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3v18l15-9L5 3z"/></svg>
                    </div>
                  </div>
                </div>
                <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-brand-primary transition-colors">{track.title}</h3>
                <p className="text-sm text-text-muted line-clamp-1 mt-1 font-medium">{track.artist}</p>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

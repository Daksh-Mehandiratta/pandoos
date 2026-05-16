import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { PandaMascot } from '@/features/panda/components/PandaMascot';
import { useTrending } from '@/features/search/hooks/useSearch';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { getBestThumbnail } from '@/services/youtube';

export function HomePage() {
  const { data: trending, isLoading } = useTrending();
  const playTrack = usePlayerStore((state) => state.playTrack);

  return (
    <div className="w-full min-h-full pb-20 px-8 pt-8">
      {/* Hero Section */}
      <div className="relative w-full flex items-center justify-between mb-16 mt-4">
        <div className="flex flex-col z-10">
          <span className="text-white/60 font-semibold mb-1 tracking-wide">Daily Mix</span>
          <h1 className="text-6xl font-display font-extrabold text-white tracking-tight drop-shadow-md mb-6">
            Good evening
          </h1>
          <div className="flex items-center gap-4">
            <button 
              className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform"
            >
              <Play fill="currentColor" size={20} />
              Listen Now
            </button>
            <button 
              className="px-6 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-colors"
            >
              Explore Vibes
            </button>
          </div>
        </div>

        {/* Floating Panda Widget */}
        <motion.div 
          initial={{ y: 0 }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="relative z-10 hidden md:block"
        >
          <div className="absolute -top-6 -right-4 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg">
            Evening mood 🌃
          </div>
          <div className="w-40 h-40 rounded-full bg-surface-elevated border border-white/5 shadow-glow-lg flex items-center justify-center p-4">
            <PandaMascot size={120} />
          </div>
        </motion.div>
      </div>

      {/* Curated Section */}
      <h2 className="text-2xl font-display font-bold text-white mb-6 drop-shadow-md">
        Made For You <span className="text-white/50 text-xl font-normal ml-2">AI CURATED</span>
      </h2>
      
      {isLoading ? (
        <div className="flex gap-6 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="min-w-[180px] w-[180px] h-[240px] rounded-xl skeleton shrink-0" />
          ))}
        </div>
      ) : (
        <div className="flex overflow-x-auto scroll-container gap-6 pb-8 snap-x snap-mandatory">
          {trending?.map((track) => (
            <motion.button
              key={track.id}
              whileHover={{ y: -8 }}
              onClick={() => playTrack(track, trending)}
              className="flex flex-col min-w-[180px] w-[180px] shrink-0 snap-start text-left group bg-surface-elevated/40 p-4 rounded-xl border border-white/5 hover:bg-surface-elevated transition-colors"
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden mb-4 relative shadow-md">
                <img 
                  src={getBestThumbnail(track.videoId)} 
                  alt={track.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <Play fill="currentColor" size={24} className="ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="text-base font-bold text-white line-clamp-1">{track.title}</h3>
              <p className="text-sm text-white/50 line-clamp-1 mt-1 font-medium">{track.artist}</p>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

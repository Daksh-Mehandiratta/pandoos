import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { PandaMascot } from '@/features/panda/components/PandaMascot';
import { useTrending, useSearch } from '@/features/search/hooks/useSearch';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { getBestThumbnail } from '@/services/youtube';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const { data: trending, isLoading: trendingLoading } = useTrending();
  const { data: chillMix, isLoading: chillLoading } = useSearch('lofi chill beats');
  const { data: popHits, isLoading: popLoading } = useSearch('top pop hits');
  
  const playTrack = usePlayerStore((state) => state.playTrack);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // Dynamic greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const TrackRow = ({ title, subtitle, data, isLoading }: { title: string, subtitle?: string, data: any[], isLoading: boolean }) => (
    <div className="mb-10">
      <h2 className="text-2xl font-display font-bold text-white mb-4 drop-shadow-md flex items-baseline gap-2">
        {title} 
        {subtitle && <span className="text-white/50 text-sm font-normal uppercase tracking-wider">{subtitle}</span>}
      </h2>
      
      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="min-w-[160px] w-[160px] h-[220px] rounded-xl skeleton shrink-0" />
          ))}
        </div>
      ) : (
        <div className="flex overflow-x-auto scroll-container gap-4 pb-4 snap-x snap-mandatory">
          {data?.map((track) => (
            <motion.button
              key={track.id}
              whileHover={{ y: -6 }}
              onClick={() => playTrack(track, data)}
              className="flex flex-col min-w-[160px] w-[160px] shrink-0 snap-start text-left group bg-surface-elevated/40 p-3 rounded-xl border border-white/5 hover:bg-surface-elevated transition-colors"
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 relative shadow-md">
                <img 
                  src={getBestThumbnail(track.videoId)} 
                  alt={track.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <Play fill="currentColor" size={20} className="ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-1">{track.title}</h3>
              <p className="text-xs text-white/50 line-clamp-1 mt-1 font-medium">{track.artist}</p>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full min-h-full pb-20 px-6 md:px-8 pt-8">
      {/* Hero Section */}
      <div className="relative w-full flex items-center justify-between mb-12 mt-2 md:mt-4">
        <div className="flex flex-col z-10 w-full md:w-auto">
          {user ? (
            <span className="text-brand-primary font-semibold mb-1 tracking-wide uppercase text-xs">Welcome back, {user.username.split(' ')[0]}</span>
          ) : (
            <span className="text-white/60 font-semibold mb-1 tracking-wide uppercase text-xs">Pandoos Music</span>
          )}
          
          <h1 className="text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight drop-shadow-md mb-2 line-clamp-2">
            {greeting}
          </h1>
          
          <p className="text-white/60 italic font-medium mb-8 max-w-sm drop-shadow-sm">
            "Life is short relax like a Panda and enjoy music"
          </p>
          
          <div className="flex items-center gap-3">
            {trending && trending.length > 0 && (
              <button 
                onClick={() => playTrack(trending[0], trending)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
              >
                <Play fill="currentColor" size={20} />
                Play Daily Mix
              </button>
            )}
            {!user && (
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-primary/90 transition-colors shadow-lg"
              >
                Log In
              </button>
            )}
          </div>
        </div>

        {/* Floating Panda Widget (Hidden on very small screens) */}
        <motion.div 
          initial={{ y: 0 }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="relative z-10 hidden sm:block md:mr-8"
        >
          <div className="absolute -top-6 -right-4 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg whitespace-nowrap">
            {user ? 'Ready to jam 🎧' : 'Log in for magic ✨'}
          </div>
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-surface-elevated border border-white/5 shadow-glow-lg flex items-center justify-center p-4">
            <PandaMascot size={100} />
          </div>
        </motion.div>
      </div>

      {/* Track Rows */}
      <TrackRow 
        title="Trending Hits" 
        subtitle="Global Top" 
        data={trending || []} 
        isLoading={trendingLoading} 
      />
      
      <TrackRow 
        title="Pop Essentials" 
        subtitle="Chart Toppers" 
        data={popHits || []} 
        isLoading={popLoading} 
      />
      
      <TrackRow 
        title="Chill Vibes" 
        subtitle="Lofi Beats to relax to" 
        data={chillMix || []} 
        isLoading={chillLoading} 
      />
      
    </div>
  );
}

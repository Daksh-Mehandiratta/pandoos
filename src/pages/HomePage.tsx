import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, TrendingUp, Music, Clock, Zap, Brain, Dumbbell, Moon, Compass } from 'lucide-react';
import { PandaMascot } from '@/features/panda/components/PandaMascot';
import { useSearch, useTrending } from '@/features/search/hooks/useSearch';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useGamificationStore } from '@/stores/useGamificationStore';
import { getBestThumbnail } from '@/services/youtube';
import { MOOD_SEEDS } from '@/data/moodSeeds';
import type { Track } from '@/types/track';

const MOODS = [
  { id: 'bollywood', label: 'Bollywood 💫', query: 'bollywood pop romantic hits' },
  { id: 'desi', label: 'Desi Swag 🔥', query: 'desi hip hop punjabi swag' },
  { id: 'sufi', label: 'Sufi Soul 🕊️', query: 'sufi ghazal peaceful lo-fi' },
  { id: 'chill', label: 'Chill 🍃', query: 'lofi chill relax aesthetic' },
  { id: 'energy', label: 'Energy ⚡', query: 'high energy upbeat edm hits' },
  { id: 'focus', label: 'Focus 🧠', query: 'deep focus ambient electronic' },
  { id: 'workout', label: 'Workout 🏋️', query: 'heavy workout gym phonk' },
  { id: 'latenight', label: 'Night 🌃', query: 'late night drive synthwave retro' }
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const getQuickPicks = (): Track[] => {
  const allTracks = Object.values(MOOD_SEEDS).flat();
  return allTracks.sort(() => 0.5 - Math.random()).slice(0, 6);
};

export function HomePage() {
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [customQuery, setCustomQuery] = useState(MOODS[0].query);
  const [userInput, setUserInput] = useState("");
  const [greeting] = useState(getGreeting());

  const playTrack = usePlayerStore((state) => state.playTrack);
  const history = usePlayerStore((state) => state.history);
  const recordListenSession = useGamificationStore((s) => s.recordListenSession);

  const historyPicks = useMemo(() => {
    if (history && history.length >= 4) return history.slice(0, 6);
    return getQuickPicks();
  }, [history]);

  const recentArtist = history.length > 0 ? history[0].artist : null;

  // --- Fetching Data ---
  const { data: moodTracks, isLoading: isMoodLoading } = useSearch(customQuery);
  const { data: trendingTracks, isLoading: isTrendingLoading } = useTrending();
  const { data: dynamicArtistTracks, isLoading: isDynamicLoading } = useSearch(recentArtist ? `${recentArtist} top hits` : '');
  
  // Fast exact-match queries
  // Fast exact-match queries
  const { data: chillTracks, isLoading: isChillLoading } = useSearch('lofi chill relax aesthetic');
  const { data: workoutTracks, isLoading: isWorkoutLoading } = useSearch('heavy workout gym phonk');
  const { data: lateNightTracks, isLoading: isLateNightLoading } = useSearch('late night drive synthwave retro');
  
  // Indian Fast exact-match queries
  const { data: bollywoodTracks, isLoading: isBollywoodLoading } = useSearch('bollywood pop romantic hits');
  const { data: desiTracks, isLoading: isDesiLoading } = useSearch('desi hip hop punjabi swag');
  const { data: sufiTracks, isLoading: isSufiLoading } = useSearch('sufi ghazal peaceful lo-fi');

  const handleMoodClick = (mood: typeof MOODS[0]) => {
    setSelectedMood(mood);
    setCustomQuery(mood.query);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setSelectedMood({ id: 'custom', label: 'Custom', query: userInput } as any);
    setCustomQuery(userInput + ' music vibes');
  };

  const handlePlayTrack = (track: Track, contextList: Track[] = []) => {
    playTrack(track, contextList);
    recordListenSession(0, selectedMood.id, contextList.length);
  };

  return (
    <div className="w-full min-h-full pb-32 flex flex-col items-center overflow-x-hidden">
      
      {/* HEADER */}
      <header className="w-full max-w-7xl px-4 md:px-8 pt-10 flex items-center justify-between mb-8 z-20">
        <h1 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tight drop-shadow-lg">
          {greeting}
        </h1>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center overflow-hidden shadow-glow-sm cursor-pointer hover:scale-105 transition-transform">
          <span className="text-white font-bold text-lg md:text-xl">P</span>
        </div>
      </header>

      {/* --- HERO: THE ORACLE'S PEDESTAL --- */}
      <section className="relative w-full max-w-7xl px-4 md:px-8 mb-20 flex flex-col items-center">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] max-w-3xl h-64 bg-brand-primary/20 blur-[100px] -z-10 rounded-[100%]" />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-40 h-40 md:w-48 md:h-48 rounded-full glass-mood border border-white/20 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] mb-8"
        >
          <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_10s_linear_infinite] opacity-50" />
          <PandaMascot size={150} emotion={selectedMood.id} />
        </motion.div>

        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-4 text-center tracking-tight drop-shadow-lg">
          Where are we traveling today?
        </h2>

        {/* Portal Pills */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 max-w-2xl">
          {MOODS.map(mood => (
            <button
              key={mood.id}
              onClick={() => handleMoodClick(mood)}
              className={`px-5 py-2 md:py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300 backdrop-blur-md border ${
                selectedMood.id === mood.id 
                ? 'bg-white text-black shadow-glow-md border-white scale-105' 
                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white hover:scale-105'
              }`}
            >
              {mood.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleChatSubmit} className="relative w-full max-w-lg">
           <input 
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Or tell me how you feel..."
              className="w-full bg-black/40 text-white placeholder-white/40 px-6 py-4 rounded-full border border-white/10 focus:outline-none focus:border-brand-primary focus:bg-black/60 text-base md:text-lg backdrop-blur-xl transition-all shadow-inner"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-glow-sm"
            >
               <Play size={16} fill="currentColor" className="ml-1" />
            </button>
        </form>
      </section>

      {/* --- THE REALMS --- */}
      <div className="w-full max-w-7xl px-4 md:px-8 flex flex-col gap-8 md:gap-16">
        
        {/* Dynamic Vibe / Oracle's Pick */}
        <RealmSection 
          title="The Oracle's Vision"
          description={`Portals aligned to: ${selectedMood.label}`}
          gradient="from-brand-primary to-brand-secondary"
          emotion={selectedMood.id}
          icon={Sparkles}
          tracks={moodTracks}
          isLoading={isMoodLoading}
          onPlay={handlePlayTrack}
          highlight
        />

        {/* Memory Lane */}
        <RealmSection 
          title="Memory Lane"
          description="Familiar vibes you recently traveled through."
          gradient="from-slate-600 to-transparent"
          emotion="neutral"
          icon={Clock}
          tracks={historyPicks}
          isLoading={false}
          onPlay={handlePlayTrack}
        />

        {/* Dynamic Artist Row */}
        {recentArtist && dynamicArtistTracks && dynamicArtistTracks.length > 0 && (
          <RealmSection 
            title={`Echoes of ${recentArtist}`}
            description="The timeline shifts based on your last adventure."
            gradient="from-indigo-600 to-transparent"
            emotion="focus"
            icon={Compass}
            tracks={dynamicArtistTracks}
            isLoading={isDynamicLoading}
            onPlay={handlePlayTrack}
          />
        )}

        {/* Chill Bamboo Forest */}
        <RealmSection 
          title="The Chill Bamboo Forest"
          description="Rest your soul. Deep greens, low-fi beats, pure tranquility."
          gradient="from-emerald-700 to-transparent"
          emotion="chill"
          icon={Music}
          tracks={chillTracks}
          isLoading={isChillLoading}
          onPlay={handlePlayTrack}
        />

        {/* Neon City Nights */}
        <RealmSection 
          title="Neon City Nights"
          description="Cruise down the retro highway under purple skies."
          gradient="from-fuchsia-700 to-purple-900"
          emotion="latenight"
          icon={Moon}
          tracks={lateNightTracks}
          isLoading={isLateNightLoading}
          onPlay={handlePlayTrack}
        />

        {/* The Bollywood Gala */}
        <RealmSection 
          title="The Bollywood Gala"
          description="Starry-eyed romance and vibrant pop hits."
          gradient="from-pink-600 to-amber-600"
          emotion="bollywood"
          icon={Sparkles}
          tracks={bollywoodTracks}
          isLoading={isBollywoodLoading}
          onPlay={handlePlayTrack}
        />

        {/* The Desi Gully */}
        <RealmSection 
          title="The Desi Gully"
          description="High-energy Punjabi beats and pure street swag."
          gradient="from-yellow-500 to-red-600"
          emotion="desi"
          icon={Zap}
          tracks={desiTracks}
          isLoading={isDesiLoading}
          onPlay={handlePlayTrack}
        />

        {/* The Sufi Darbar */}
        <RealmSection 
          title="The Sufi Darbar"
          description="Deep, soulful ghazals to bring you peace."
          gradient="from-indigo-800 to-purple-900"
          emotion="sufi"
          icon={Moon}
          tracks={sufiTracks}
          isLoading={isSufiLoading}
          onPlay={handlePlayTrack}
        />

        {/* The Iron Dojo */}
        <RealmSection 
          title="The Iron Dojo"
          description="Beast mode activated. Heavy phonk and relentless energy."
          gradient="from-red-700 to-orange-800"
          emotion="workout"
          icon={Dumbbell}
          tracks={workoutTracks}
          isLoading={isWorkoutLoading}
          onPlay={handlePlayTrack}
        />

        {/* The Archive (Trending) */}
        <RealmSection 
          title="The Global Archive"
          description="What the rest of the world is traveling to right now."
          gradient="from-blue-600 to-transparent"
          emotion="focus"
          icon={TrendingUp}
          tracks={trendingTracks}
          isLoading={isTrendingLoading}
          onPlay={handlePlayTrack}
        />

      </div>
    </div>
  );
}

// ----- Helper Components -----

interface RealmSectionProps {
  title: string;
  description: string;
  gradient: string;
  emotion: string;
  icon: React.ElementType;
  tracks?: Track[];
  isLoading: boolean;
  onPlay: (track: Track, list: Track[]) => void;
  highlight?: boolean;
}

function RealmSection({ title, description, gradient, emotion, icon: Icon, tracks, isLoading, onPlay, highlight }: RealmSectionProps) {
  if (!isLoading && (!tracks || tracks.length === 0)) return null;

  return (
    <section className="relative w-full rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-white/5 overflow-hidden">
      {/* Localized Background Glow - hardware accelerated for smooth scrolling */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 md:opacity-30 blur-[80px] -z-10`} 
        style={{ transform: 'translateZ(0)', willChange: 'transform' }} 
      />
      
      <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 items-center xl:items-start relative z-10">
         
         {/* Storytelling & Panda Column */}
         <div className="flex flex-col items-center xl:items-start text-center xl:text-left shrink-0 w-full xl:w-72">
           <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/10 backdrop-blur-md shadow-inner">
             <Icon className="text-white" size={24} />
           </div>
           
           <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-3 drop-shadow-md leading-tight">
             {title}
           </h2>
           
           <p className="text-white/70 text-sm md:text-base font-medium mb-8 leading-relaxed max-w-md">
             {description}
           </p>
           
           <motion.div 
             whileHover={{ scale: 1.05, rotate: 5 }}
             className="relative w-32 h-32 md:w-40 md:h-40 rounded-full glass-mood border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]"
           >
             <PandaMascot size={120} emotion={emotion} />
           </motion.div>
         </div>

         {/* Tracks Carousel */}
         <div className="flex-1 w-full min-w-0 pt-4 xl:pt-0">
            <TrackList tracks={tracks} isLoading={isLoading} onPlay={onPlay} highlight={highlight} />
         </div>
      </div>
    </section>
  );
}

function TrackList({ tracks, isLoading, onPlay, highlight }: { tracks?: Track[], isLoading: boolean, onPlay: any, highlight?: boolean }) {
  return (
    <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x snap-mandatory scroll-container px-2 -mx-2">
      {isLoading ? (
        [...Array(6)].map((_, i) => (
          <div key={i} className={`shrink-0 snap-start rounded-2xl skeleton ${highlight ? 'w-[200px] h-[280px] md:w-[240px] md:h-[320px]' : 'w-[140px] h-[140px] md:w-[180px] md:h-[180px]'}`} />
        ))
      ) : (
        <AnimatePresence mode="popLayout">
          {tracks?.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`shrink-0 snap-start group cursor-pointer ${highlight ? 'w-[200px] md:w-[240px]' : 'w-[140px] md:w-[180px]'}`}
              onClick={() => onPlay(track, tracks)}
            >
              {/* Image Container */}
              <div className={`relative w-full rounded-2xl overflow-hidden mb-4 shadow-lg border border-white/10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${highlight ? 'aspect-[4/5] glass-mood' : 'aspect-square'}`}>
                <img 
                  src={getBestThumbnail(track.videoId)} 
                  alt={track.title} 
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${highlight ? 'opacity-80 mix-blend-overlay saturate-150' : ''}`}
                  loading="lazy"
                />
                
                {/* Gradients */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${highlight ? 'bg-gradient-to-t from-black/90 via-black/20 to-transparent' : 'bg-black/20 group-hover:bg-transparent'}`} />
                
                {/* Play Overlay */}
                <div className={`absolute ${highlight ? 'bottom-4 right-4' : 'inset-0 flex items-center justify-center'} opacity-0 group-hover:opacity-100 transition-all duration-300 ${highlight ? 'translate-y-4 group-hover:translate-y-0' : 'bg-black/40 backdrop-blur-sm'}`}>
                  <div className={`rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${highlight ? 'w-12 h-12 bg-white text-black' : 'w-14 h-14 bg-brand-primary text-white scale-75 group-hover:scale-100'}`}>
                    <Play fill="currentColor" size={highlight ? 20 : 24} className="ml-1" />
                  </div>
                </div>
              </div>

              {/* Text */}
              <h3 className="text-sm md:text-base font-bold text-white leading-tight line-clamp-2 mb-1 group-hover:text-brand-primary transition-colors drop-shadow-sm">
                {track.title}
              </h3>
              <p className="text-xs md:text-sm text-white/50 line-clamp-1 font-medium">
                {track.artist}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}

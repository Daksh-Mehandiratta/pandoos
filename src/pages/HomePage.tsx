import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, TrendingUp, Music, Clock, Zap, Brain, Dumbbell, Moon, Compass, Heart, Radio, Flame } from 'lucide-react';
import { PandaMascot } from '@/features/panda/components/PandaMascot';
import { useSearch, useTrending } from '@/features/search/hooks/useSearch';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGamificationStore } from '@/stores/useGamificationStore';
import { useTasteStore } from '@/stores/useTasteStore';
import { getBestThumbnail, searchTracks } from '@/services/youtube';
import { MOOD_SEEDS } from '@/data/moodSeeds';
import { buildSearchQuery } from '@/services/recommendEngine';
import type { Track } from '@/types/track';

const MOODS = [
  { id: 'bollywood',   label: 'Bollywood 💫', query: 'bollywood pop romantic hits' },
  { id: 'desi',        label: 'Desi Swag 🔥', query: 'desi hip hop punjabi swag' },
  { id: 'sufi',        label: 'Sufi Soul 🕊️', query: 'sufi ghazal peaceful lo-fi' },
  { id: 'chill',       label: 'Chill 🍃',      query: 'lofi chill relax aesthetic' },
  { id: 'energy',      label: 'Energy ⚡',     query: 'high energy upbeat edm hits' },
  { id: 'focus',       label: 'Focus 🧠',      query: 'deep focus ambient electronic' },
  { id: 'workout',     label: 'Workout 🏋️',   query: 'heavy workout gym phonk' },
  { id: 'latenight',   label: 'Night 🌃',      query: 'late night drive synthwave retro' },
  { id: 'happy',       label: 'Happy ☀️',      query: 'happy feel good uplifting pop' },
  { id: 'romantic',    label: 'Romantic 💖',   query: 'romantic love songs acoustic' },
  { id: 'heartbroken', label: 'Sad 🌧️',        query: 'sad emotional acoustic' },
  { id: 'sleepy',      label: 'Sleepy 💤',     query: 'sleep ambient delta waves' },
];

const GENRE_LABELS: Record<string, string> = {
  bollywood: 'Bollywood 💫', desi: 'Desi 🔥', punjabi: 'Punjabi 🎵',
  sufi: 'Sufi 🕊️', lofi: 'Lo-Fi 🍃', electronic: 'Electronic ⚡',
  rock: 'Rock 🎸', acoustic: 'Acoustic 🎻', pop: 'Pop ✨',
};

const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';
};

export function HomePage() {
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [customQuery, setCustomQuery] = useState(MOODS[0].query);
  const [userInput, setUserInput] = useState('');
  const [greeting] = useState(getGreeting);

  const playTrack = usePlayerStore(s => s.playTrack);
  const history = usePlayerStore(s => s.history);
  const currentTrack = usePlayerStore(s => s.currentTrack);
  const recordListenSession = useGamificationStore(s => s.recordListenSession);
  const user = useAuthStore(s => s.user);

  // Taste profile
  const topGenres = useTasteStore(s => s.topGenres);
  const topArtists = useTasteStore(s => s.topArtists);
  const recentArtists = useTasteStore(s => s.recentArtists);
  const lovedIds = useTasteStore(s => s.lovedIds);

  const isPersonalized = topGenres.length > 0 || recentArtists.length > 0;

  // Quick picks from history or seeds
  const quickPicks = useMemo(() => {
    if (history.length >= 4) return history.slice(0, 8);
    return Object.values(MOOD_SEEDS).flat().sort(() => 0.5 - Math.random()).slice(0, 8);
  }, [history]);

  // "For You" — seeded from top genre
  const forYouQuery = useMemo(() => {
    if (topGenres[0] === 'bollywood') return 'bollywood pop romantic hits';
    if (topGenres[0] === 'desi' || topGenres[0] === 'punjabi') return 'desi hip hop punjabi swag';
    if (topGenres[0] === 'sufi') return 'sufi ghazal peaceful lo-fi';
    if (topGenres[0] === 'lofi') return 'lofi chill relax aesthetic';
    if (topGenres[0] === 'rock') return 'rock alternative best hits';
    if (topGenres[0] === 'electronic') return 'high energy upbeat edm hits';
    return customQuery;
  }, [topGenres, customQuery]);

  // "Because you listened to X" — top recent artist
  const recentArtist = recentArtists[0] ?? (history[0]?.artist ?? null);
  const artistDisplayName = recentArtist
    ? recentArtist.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : null;

  // "Now Vibe" — derived from current track if playing
  const nowVibeQuery = useMemo(() => {
    if (!currentTrack) return null;
    return buildSearchQuery(currentTrack);
  }, [currentTrack?.videoId]);

  // Searches
  const { data: moodTracks,     isLoading: isMoodLoading }     = useSearch(customQuery);
  const { data: trendingTracks, isLoading: isTrendingLoading } = useTrending();
  const { data: forYouTracks,   isLoading: isForYouLoading }   = useSearch(isPersonalized ? forYouQuery : '');
  const { data: artistTracks,   isLoading: isArtistLoading }   = useSearch(recentArtist ? `${recentArtist} top songs` : '');
  const { data: nowVibeTracks,  isLoading: isNowVibeLoading }  = useSearch(nowVibeQuery ?? '');
  const { data: bollywoodTracks,isLoading: isBollyLoading }    = useSearch('bollywood pop romantic hits');
  const { data: desiTracks,     isLoading: isDesiLoading }     = useSearch('desi hip hop punjabi swag');
  const { data: sufiTracks,     isLoading: isSufiLoading }     = useSearch('sufi ghazal peaceful lo-fi');
  const { data: chillTracks,    isLoading: isChillLoading }    = useSearch('lofi chill relax aesthetic');
  const { data: workoutTracks,  isLoading: isWorkoutLoading }  = useSearch('heavy workout gym phonk');
  const { data: lateNightTracks,isLoading: isLateLoading }     = useSearch('late night drive synthwave retro');

  const handleMoodClick = (mood: typeof MOODS[0]) => {
    setSelectedMood(mood);
    setCustomQuery(mood.query);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    const query = userInput + ' music vibes';
    const normalized = userInput.toLowerCase();
    
    // Robust emotion detection for Panda graphic
    let moodId = 'chill'; // default fallback
    if (normalized.includes('sad') || normalized.includes('saad') || normalized.includes('cry') || normalized.includes('break')) moodId = 'heartbroken';
    else if (normalized.includes('work') || normalized.includes('gym')) moodId = 'workout';
    else if (normalized.includes('sleep') || normalized.includes('bed')) moodId = 'sleepy';
    else if (normalized.includes('love') || normalized.includes('romanc')) moodId = 'romantic';
    else if (normalized.includes('party') || normalized.includes('dance')) moodId = 'energy';
    else if (normalized.includes('happy') || normalized.includes('good')) moodId = 'happy';
    else if (normalized.includes('focus') || normalized.includes('study')) moodId = 'focus';
    else if (normalized.includes('bolly')) moodId = 'bollywood';
    else if (normalized.includes('desi') || normalized.includes('punjab')) moodId = 'desi';
    else if (normalized.includes('sufi')) moodId = 'sufi';
    else if (normalized.includes('night') || normalized.includes('late')) moodId = 'latenight';
    
    setSelectedMood({ id: moodId, label: 'Custom', query: userInput } as any);
    setCustomQuery(query);
    setUserInput('');
  };

  const handlePlayTrack = (track: Track, list: Track[] = []) => {
    playTrack(track, list.length > 0 ? list : [track]);
    recordListenSession(0, selectedMood.id, list.length);
  };

  return (
    <div className="w-full min-h-full pb-32 flex flex-col items-center overflow-x-hidden">

      {/* ── HEADER ── */}
      <header className="w-full max-w-7xl px-4 md:px-8 pt-10 flex items-center justify-between mb-6 z-20">
        <div>
          <h1 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tight drop-shadow-lg flex items-center flex-wrap gap-2">
            {greeting}{user ? <span className="text-brand-primary">, {user.username}</span> : ''}
            <span className="inline-block animate-[wave_2s_ease-in-out_infinite] origin-bottom-right">👋</span>
          </h1>
          {isPersonalized && (
            <p className="text-white/50 text-sm mt-1 flex items-center gap-1">
              <Sparkles size={12} className="text-brand-primary" />
              Personalized for your taste · {topGenres.slice(0, 3).map(g => GENRE_LABELS[g] ?? g).join(' · ')}
            </p>
          )}
        </div>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-glow-sm cursor-pointer hover:scale-105 transition-transform">
          <span className="text-white font-bold text-lg">P</span>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative w-full max-w-7xl px-4 md:px-8 mb-14 flex flex-col items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] max-w-3xl h-64 bg-brand-primary/20 blur-[80px] -z-10 rounded-[100%] pointer-events-none" style={{ willChange: 'transform' }} />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-36 h-36 md:w-44 md:h-44 rounded-full glass-mood border border-white/20 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] mb-6"
        >
          <PandaMascot size={140} emotion={selectedMood.id} />
        </motion.div>

        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-4 text-center tracking-tight drop-shadow-lg">
          Where are we traveling today?
        </h2>

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-5 max-w-2xl">
          {MOODS.map(mood => (
            <button
              key={mood.id}
              onClick={() => handleMoodClick(mood)}
              className={`px-5 py-2 rounded-full text-sm md:text-base font-bold transition-all duration-300 backdrop-blur-md border ${
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
            onChange={e => setUserInput(e.target.value)}
            placeholder="Or tell me how you feel..."
            className="w-full bg-black/40 text-white placeholder-white/40 px-6 py-4 rounded-full border border-white/10 focus:outline-none focus:border-brand-primary focus:bg-black/60 text-base backdrop-blur-xl transition-all shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center transition-transform shadow-glow-sm hover:scale-110 active:scale-95"
          >
            <Sparkles size={16} fill="currentColor" />
          </button>
        </form>
      </section>

      {/* ── SECTIONS ── */}
      <div className="w-full max-w-7xl px-4 md:px-8 flex flex-col gap-10 md:gap-16">

        {/* NOW VIBE — if a track is playing */}
        {currentTrack && nowVibeTracks && nowVibeTracks.length > 0 && (
          <RealmSection
            title="Because You're Listening"
            description={`More like "${currentTrack.title.slice(0, 40)}…"`}
            gradient="from-violet-600 to-fuchsia-700"
            emotion="energy"
            icon={Radio}
            tracks={nowVibeTracks}
            isLoading={isNowVibeLoading}
            onPlay={handlePlayTrack}
            lovedIds={lovedIds}
            badge="🎯 Live Recommendation"
            highlight
          />
        )}

        {/* FOR YOU — personalized */}
        {isPersonalized && (
          <RealmSection
            title="Made For You"
            description={`Based on your love for ${topGenres.slice(0, 2).map(g => GENRE_LABELS[g] ?? g).join(' & ')}`}
            gradient="from-brand-primary to-brand-secondary"
            emotion={selectedMood.id}
            icon={Heart}
            tracks={forYouTracks}
            isLoading={isForYouLoading}
            onPlay={handlePlayTrack}
            lovedIds={lovedIds}
            badge="✨ Personalized"
            highlight
          />
        )}

        {/* ORACLE — mood-based */}
        <RealmSection
          title="The Oracle's Vision"
          description={`Portals aligned to: ${selectedMood.label}`}
          gradient="from-indigo-600 to-purple-700"
          emotion={selectedMood.id}
          icon={Sparkles}
          tracks={moodTracks}
          isLoading={isMoodLoading}
          onPlay={handlePlayTrack}
          lovedIds={lovedIds}
          highlight={!isPersonalized}
        />

        {/* MEMORY LANE — history */}
        <RealmSection
          title="Memory Lane"
          description="Familiar vibes you recently traveled through."
          gradient="from-slate-600 to-slate-800"
          emotion="neutral"
          icon={Clock}
          tracks={quickPicks}
          isLoading={false}
          onPlay={handlePlayTrack}
          lovedIds={lovedIds}
        />

        {/* BECAUSE YOU LISTENED TO X */}
        {artistDisplayName && artistTracks && artistTracks.length > 0 && (
          <RealmSection
            title={`Echoes of ${artistDisplayName}`}
            description="The timeline shifts based on your last adventure."
            gradient="from-cyan-600 to-blue-700"
            emotion="focus"
            icon={Compass}
            tracks={artistTracks}
            isLoading={isArtistLoading}
            onPlay={handlePlayTrack}
            lovedIds={lovedIds}
            badge={`🎵 Because you played ${artistDisplayName}`}
          />
        )}

        {/* BOLLYWOOD GALA */}
        <RealmSection
          title="The Bollywood Gala"
          description="Starry-eyed romance and vibrant pop hits."
          gradient="from-pink-600 to-amber-600"
          emotion="bollywood"
          icon={Sparkles}
          tracks={bollywoodTracks}
          isLoading={isBollyLoading}
          onPlay={handlePlayTrack}
          lovedIds={lovedIds}
        />

        {/* DESI GULLY */}
        <RealmSection
          title="The Desi Gully"
          description="High-energy Punjabi beats and pure street swag."
          gradient="from-yellow-500 to-red-600"
          emotion="desi"
          icon={Zap}
          tracks={desiTracks}
          isLoading={isDesiLoading}
          onPlay={handlePlayTrack}
          lovedIds={lovedIds}
        />

        {/* SUFI DARBAR */}
        <RealmSection
          title="The Sufi Darbar"
          description="Deep, soulful ghazals to bring you peace."
          gradient="from-indigo-800 to-purple-900"
          emotion="sufi"
          icon={Moon}
          tracks={sufiTracks}
          isLoading={isSufiLoading}
          onPlay={handlePlayTrack}
          lovedIds={lovedIds}
        />

        {/* CHILL BAMBOO */}
        <RealmSection
          title="The Chill Bamboo Forest"
          description="Rest your soul. Deep greens, lo-fi beats, pure tranquility."
          gradient="from-emerald-700 to-teal-900"
          emotion="chill"
          icon={Music}
          tracks={chillTracks}
          isLoading={isChillLoading}
          onPlay={handlePlayTrack}
          lovedIds={lovedIds}
        />

        {/* NEON CITY NIGHTS */}
        <RealmSection
          title="Neon City Nights"
          description="Cruise down the retro highway under purple skies."
          gradient="from-fuchsia-700 to-purple-900"
          emotion="latenight"
          icon={Moon}
          tracks={lateNightTracks}
          isLoading={isLateLoading}
          onPlay={handlePlayTrack}
          lovedIds={lovedIds}
        />

        {/* IRON DOJO */}
        <RealmSection
          title="The Iron Dojo"
          description="Beast mode activated. Heavy phonk and relentless energy."
          gradient="from-red-700 to-orange-800"
          emotion="workout"
          icon={Dumbbell}
          tracks={workoutTracks}
          isLoading={isWorkoutLoading}
          onPlay={handlePlayTrack}
          lovedIds={lovedIds}
        />

        {/* GLOBAL TRENDING */}
        <RealmSection
          title="The Global Archive"
          description="What the world is traveling to right now."
          gradient="from-blue-600 to-sky-800"
          emotion="focus"
          icon={TrendingUp}
          tracks={trendingTracks}
          isLoading={isTrendingLoading}
          onPlay={handlePlayTrack}
          lovedIds={lovedIds}
        />

      </div>

      {/* ── FOOTER SLOGAN ── */}
      <footer className="w-full max-w-7xl px-4 md:px-8 mt-8 mb-12 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 shadow-lg backdrop-blur-md">
            <PandaMascot size={32} emotion="chill" />
          </div>
          <p className="text-lg md:text-xl font-medium italic text-white/70 drop-shadow-md px-4 tracking-wide">
            "Life is short relax like a Panda and enjoy music"
          </p>
          <div className="w-24 h-[2px] mt-4 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent rounded-full" />
        </motion.div>
      </footer>

    </div>
  );
}

// ─── Helper Components ─────────────────────────────────────────────────────────

interface RealmSectionProps {
  title: string;
  description: string;
  gradient: string;
  emotion: string;
  icon: React.ElementType;
  tracks?: Track[];
  isLoading: boolean;
  onPlay: (track: Track, list: Track[]) => void;
  lovedIds?: string[];
  badge?: string;
  highlight?: boolean;
}

function RealmSection({ title, description, gradient, emotion, icon: Icon, tracks, isLoading, onPlay, lovedIds = [], badge, highlight }: RealmSectionProps) {
  if (!isLoading && (!tracks || tracks.length === 0)) return null;

  return (
    <section className="relative w-full rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-white/5 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 blur-[80px] -z-10`} style={{ transform: 'translateZ(0)' }} />

      <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 items-center xl:items-start relative z-10">
        {/* Left column */}
        <div className="flex flex-col items-center xl:items-start text-center xl:text-left shrink-0 w-full xl:w-64">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
              <Icon className="text-white" size={20} />
            </div>
            {badge && (
              <span className="text-xs font-bold bg-white/10 text-white/80 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                {badge}
              </span>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white mb-2 drop-shadow-md leading-tight">
            {title}
          </h2>
          <p className="text-white/60 text-sm font-medium mb-6 leading-relaxed max-w-xs">
            {description}
          </p>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-28 h-28 md:w-36 md:h-36 rounded-full glass-mood border border-white/10 flex items-center justify-center"
          >
            <PandaMascot size={110} emotion={emotion} />
          </motion.div>
        </div>

        {/* Track list */}
        <div className="flex-1 w-full min-w-0">
          <TrackList tracks={tracks} isLoading={isLoading} onPlay={onPlay} highlight={highlight} lovedIds={lovedIds} />
        </div>
      </div>
    </section>
  );
}

function TrackList({ tracks, isLoading, onPlay, highlight, lovedIds = [] }: {
  tracks?: Track[];
  isLoading: boolean;
  onPlay: (t: Track, list: Track[]) => void;
  highlight?: boolean;
  lovedIds?: string[];
}) {
  return (
    <div className="flex overflow-x-auto gap-4 md:gap-5 pb-6 snap-x snap-mandatory scroll-container px-1 -mx-1">
      {isLoading
        ? [...Array(6)].map((_, i) => (
            <div key={i} className={`shrink-0 snap-start rounded-2xl skeleton ${highlight ? 'w-[200px] h-[280px]' : 'w-[150px] h-[150px]'}`} />
          ))
        : (
          <AnimatePresence mode="popLayout">
            {tracks?.map((track, i) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`shrink-0 snap-start group cursor-pointer ${highlight ? 'w-[200px] md:w-[220px]' : 'w-[150px] md:w-[170px]'}`}
                onClick={() => onPlay(track, tracks ?? [])}
              >
                {/* Thumbnail */}
                <div className={`relative w-full rounded-2xl overflow-hidden mb-3 shadow-lg border border-white/10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${highlight ? 'aspect-[4/5]' : 'aspect-square'}`}>
                  <img
                    src={getBestThumbnail(track.videoId)}
                    alt={track.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Loved badge */}
                  {lovedIds.includes(track.videoId) && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center">
                      <Heart size={12} fill="white" className="text-white" />
                    </div>
                  )}

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play fill="black" size={20} className="ml-1 text-black" />
                    </div>
                  </div>
                </div>

                {/* Text */}
                <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 mb-1 group-hover:text-brand-primary transition-colors">
                  {track.title}
                </h3>
                <p className="text-xs text-white/50 line-clamp-1 font-medium">
                  {track.artist}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
    </div>
  );
}

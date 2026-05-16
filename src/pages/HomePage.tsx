import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { PandaMascot } from '@/features/panda/components/PandaMascot';
import { useSearch } from '@/features/search/hooks/useSearch';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useGamificationStore } from '@/stores/useGamificationStore';
import { getBestThumbnail } from '@/services/youtube';

const MOODS = [
  { id: 'chill', label: 'Chill & Relax 🍃', query: 'lofi chill relax aesthetic' },
  { id: 'energy', label: 'Need Energy ⚡', query: 'high energy upbeat edm hits' },
  { id: 'focus', label: 'Laser Focus 🧠', query: 'deep focus ambient electronic' },
  { id: 'romantic', label: 'Feeling Romantic 💖', query: 'romantic love songs acoustic' },
  { id: 'workout', label: 'Beast Mode 🏋️', query: 'heavy workout gym phonk' },
  { id: 'heartbroken', label: 'Heartbroken 🌧️', query: 'sad emotional acoustic' },
  { id: 'sleepy', label: 'Sleepy Time 💤', query: 'sleep ambient delta waves' },
  { id: 'latenight', label: 'Late Night 🌃', query: 'late night drive synthwave retro' },
  { id: 'happy', label: 'Pure Joy ✨', labelShort: 'Joy', query: 'happy feel good uplifting pop' }
];

export function HomePage() {
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [customQuery, setCustomQuery] = useState(MOODS[0].query);
  const { data: moodTracks, isLoading } = useSearch(customQuery);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const recordListenSession = useGamificationStore((s) => s.recordListenSession);

  // Panda conversational logic
  const [pandaMessage, setPandaMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  
  useEffect(() => {
    // Initial greeting
    setPandaMessage("Tell me how you feel, and I'll find the perfect vibe to melt it away.");
  }, []);

  const handleMoodClick = (mood: typeof MOODS[0]) => {
    setSelectedMood(mood);
    setCustomQuery(mood.query);
    setUserInput("");
    setIsTyping(true);
    setPandaMessage("");
    
    setTimeout(() => {
      setIsTyping(false);
      setPandaMessage(`Ah, ${mood.label}. I know exactly what you need. Listen to this...`);
    }, 800);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    // Clear selected predefined mood
    setSelectedMood({ id: 'custom', label: 'Custom Vibe', query: userInput } as any);
    setCustomQuery(userInput + ' music vibes');
    
    setIsTyping(true);
    setPandaMessage("");
    
    setTimeout(() => {
      setIsTyping(false);
      setPandaMessage(`I hear you. Let me find some tracks to perfectly match that feeling...`);
    }, 1200);
  };

  return (
    <div className="w-full min-h-full pb-24 px-4 md:px-8 pt-8 flex flex-col items-center">
      
      {/* Top Brand & Slogan */}
      <div className="w-full text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight drop-shadow-md mb-2">
          Pandoos Oracle
        </h1>
        <p className="text-white/60 italic font-medium drop-shadow-sm text-sm">
          "Life is short relax like a Panda and enjoy music"
        </p>
      </div>

      {/* The Oracle Panda (Centerpiece) */}
      <div className="relative flex flex-col items-center w-full max-w-2xl mb-12">
        <motion.div 
          className="relative z-10 w-48 h-48 md:w-56 md:h-56 rounded-full bg-black/30 border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)] flex items-center justify-center p-4 backdrop-blur-xl mb-6"
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          {/* Subtle glowing ring */}
          <div className="absolute inset-0 rounded-full border border-white/5 shadow-glow-lg animate-[spin_10s_linear_infinite] opacity-50" />
          <PandaMascot size={160} emotion={selectedMood.id} />
        </motion.div>

        {/* Panda Chat Bubble */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={isTyping ? "typing" : pandaMessage}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 max-w-md text-center shadow-xl relative"
          >
            {/* Bubble Tail */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white/10" />
            
            {isTyping ? (
              <div className="flex items-center justify-center gap-1 h-7">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-white/70 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-white/70 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-white/70 rounded-full" />
              </div>
            ) : (
              <p className="text-white/90 font-medium text-lg md:text-xl leading-relaxed">
                {pandaMessage}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Chat Input for Custom Mood */}
      <div className="w-full max-w-xl mb-8 relative z-20">
        <form onSubmit={handleChatSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/50 to-brand-secondary/50 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          <input 
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type how you feel..."
            className="relative w-full bg-surface-elevated/80 text-white placeholder-white/40 px-6 py-4 rounded-full border border-white/10 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-inner backdrop-blur-sm text-lg"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black rounded-full p-3 hover:scale-105 active:scale-95 transition-transform"
          >
            <Play fill="currentColor" size={16} />
          </button>
        </form>
      </div>

      {/* Mood Matrix */}
      <div className="w-full max-w-4xl mb-12">
        <h3 className="text-xs font-bold text-white/40 tracking-wider uppercase mb-4 text-center">How are you feeling?</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodClick(mood)}
              className={`px-5 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-lg border ${
                selectedMood.id === mood.id
                  ? 'bg-white text-black border-white scale-105 shadow-glow-sm'
                  : 'bg-surface-elevated/50 text-white/70 border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              {mood.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mesmerizing Vibe Cards */}
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white mb-6 drop-shadow-md flex items-center gap-3">
          Your Vibe
          <span className="text-white/40 text-sm font-normal uppercase tracking-wider bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {selectedMood.label.split(' ')[0]}
          </span>
        </h2>

        {isLoading ? (
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x scroll-container">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[280px] w-[280px] h-[360px] rounded-3xl skeleton shrink-0" />
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto scroll-container gap-6 pb-8 snap-x snap-mandatory pt-4">
            <AnimatePresence mode="popLayout">
              {moodTracks?.map((track, i) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                  className="min-w-[280px] w-[280px] h-[360px] shrink-0 snap-center relative group cursor-pointer"
                  onClick={() => { playTrack(track, moodTracks); recordListenSession(0, selectedMood.id, moodTracks?.length); }}
                >
                  {/* Glassmorphic Vibe Card */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden glass-mood border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                    <img 
                      src={getBestThumbnail(track.videoId)} 
                      alt={track.title} 
                      className="absolute inset-0 w-full h-full object-cover saturate-150 opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="w-14 h-14 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-glow-lg mb-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <Play fill="currentColor" size={24} className="ml-1" />
                      </div>
                      <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 mb-2 drop-shadow-md">
                        {track.title}
                      </h3>
                      <p className="text-sm text-white/70 line-clamp-1 font-medium">
                        {track.artist}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
}

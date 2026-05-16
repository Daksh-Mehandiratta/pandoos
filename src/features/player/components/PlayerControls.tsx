import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from 'lucide-react';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { cn } from '@/utils/cn';

export function PlayerControls({ className }: { className?: string }) {
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const isLoading = usePlayerStore((state) => state.isLoading);
  const isLooping = usePlayerStore((state) => state.isLooping);
  const isShuffling = usePlayerStore((state) => state.isShuffling);
  const queue = usePlayerStore((state) => state.queue);

  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const nextTrack = usePlayerStore((state) => state.nextTrack);
  const prevTrack = usePlayerStore((state) => state.prevTrack);
  const toggleLoop = usePlayerStore((state) => state.toggleLoop);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);

  const hasNext = queue.length > 1; // Simplification

  return (
    <div className={cn("flex items-center justify-between w-full max-w-[280px] mx-auto", className)}>
      {/* Shuffle Button */}
      <button 
        onClick={toggleShuffle}
        className={cn(
          "p-2 touch-highlight transition-colors",
          isShuffling ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "text-white/50 hover:text-white"
        )}
      >
        <Shuffle size={20} strokeWidth={2.5} />
        {isShuffling && <div className="w-1 h-1 bg-emerald-400 rounded-full mx-auto mt-1" />}
      </button>

      {/* Prev Button */}
      <button 
        onClick={prevTrack}
        className="p-2 text-white/80 hover:text-emerald-400 hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] touch-highlight transition-all active:scale-90"
      >
        <SkipBack size={28} strokeWidth={2.5} fill="currentColor" />
      </button>

      {/* Play/Pause Button */}
      <button 
        onClick={togglePlayPause}
        disabled={isLoading}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] touch-highlight transition-transform active:scale-90 border-2 border-emerald-300/20",
          isLoading && "opacity-80 scale-95"
        )}
      >
        {isLoading ? (
          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause size={28} strokeWidth={3} fill="currentColor" />
        ) : (
          <Play size={28} strokeWidth={3} fill="currentColor" className="ml-1" />
        )}
      </button>

      {/* Next Button */}
      <button 
        onClick={nextTrack}
        disabled={!hasNext && !isLooping}
        className={cn(
          "p-2 text-white/80 touch-highlight transition-all active:scale-90",
          (!hasNext && !isLooping) ? "opacity-30" : "hover:text-emerald-400 hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
        )}
      >
        <SkipForward size={28} strokeWidth={2.5} fill="currentColor" />
      </button>

      {/* Loop Button */}
      <button 
        onClick={toggleLoop}
        className={cn(
          "p-2 touch-highlight transition-colors",
          isLooping ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "text-white/50 hover:text-white"
        )}
      >
        <Repeat size={20} strokeWidth={2.5} />
        {isLooping && <div className="w-1 h-1 bg-emerald-400 rounded-full mx-auto mt-1" />}
      </button>
    </div>
  );
}

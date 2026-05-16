import React from 'react';
import { ChevronDown, MoreVertical, ListMusic } from 'lucide-react';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useUIStore } from '@/stores/useUIStore';
import { useColorExtractor } from '@/features/player/hooks/useColorExtractor';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { VinylRecord } from './VinylRecord';
import { Tonearm } from './Tonearm';
import { SeekBar } from './SeekBar';
import { PlayerControls } from './PlayerControls';

export function FullscreenPlayer() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const isPlayerOpen = useUIStore((state) => state.isPlayerOpen);
  const closePlayer = useUIStore((state) => state.closePlayer);
  const toggleQueue = useUIStore((state) => state.toggleQueue);

  // Mount the color extractor hook here so it runs when a track is active
  useColorExtractor();

  return (
    <BottomSheet 
      isOpen={isPlayerOpen} 
      onClose={closePlayer} 
      fullScreen 
      className="bg-transparent border-none shadow-none"
    >
      {/* 
        Ultra-heavy glassmorphism background.
        This allows the root Aurora background to bleed through softly,
        creating an immersive iOS-like frosted glass feel.
      */}
      <div className="absolute inset-0 glass-heavy -z-10" />

      {/* Top Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <button 
          onClick={closePlayer}
          className="p-2 -ml-2 text-white/70 hover:text-white touch-highlight"
        >
          <ChevronDown size={28} />
        </button>
        <span className="text-xs font-semibold tracking-widest text-white/50 uppercase">
          Now Playing
        </span>
        <button className="p-2 -mr-2 text-white/70 hover:text-white touch-highlight">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Main Content Area: Vinyl & Tonearm */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-sm mx-auto px-6 mt-4 mb-8">
        {/* The Tonearm is absolutely positioned relative to the vinyl container */}
        <div className="relative w-full aspect-square flex items-center justify-center">
          <VinylRecord 
            track={currentTrack} 
            isPlaying={isPlaying} 
            size={300} 
            className="z-10"
          />
          <Tonearm 
            isPlaying={isPlaying} 
            size={220}
            className="top-[-10px] right-[-10px]"
          />
        </div>
      </div>

      {/* Bottom Controls Area */}
      <div className="w-full px-8 pb-10 flex flex-col gap-6 max-w-md mx-auto">
        {/* Track Info & Queue Button */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col min-w-0 pr-4">
            <h2 className="text-2xl font-bold text-white truncate drop-shadow-md">
              {currentTrack?.title ?? 'Not Playing'}
            </h2>
            <p className="text-lg text-white/70 truncate drop-shadow-sm">
              {currentTrack?.artist ?? 'Select a track'}
            </p>
          </div>
          <button 
            onClick={toggleQueue}
            className="p-3 bg-white/10 rounded-full text-white backdrop-blur-md touch-highlight border border-white/5 shadow-glass"
          >
            <ListMusic size={22} />
          </button>
        </div>

        {/* Scrubbing & Controls */}
        <SeekBar />
        <PlayerControls className="mt-2" />
      </div>
    </BottomSheet>
  );
}

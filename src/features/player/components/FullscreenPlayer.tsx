import React from 'react';
import { ChevronDown, MoreVertical } from 'lucide-react';
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

  // Mount the color extractor hook here so it runs when a track is active
  useColorExtractor();

  return (
    <BottomSheet 
      isOpen={isPlayerOpen} 
      onClose={closePlayer} 
      fullScreen 
      className="bg-transparent border-none shadow-none"
    >
      {/* Heavy glassmorphism background allowing Aurora to bleed through */}
      <div className="absolute inset-0 glass-heavy -z-10" />

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 pt-8 pb-4 z-50">
        <button 
          onClick={closePlayer}
          className="p-3 bg-white/5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md border border-white/10"
        >
          <ChevronDown size={28} />
        </button>
        <span className="text-sm font-bold tracking-[0.2em] text-brand-primary uppercase drop-shadow-md">
          Now Playing From YouTube
        </span>
        <button className="p-3 bg-white/5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md border border-white/10">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Main Content: Flexible vertical stack */}
      <div className="w-full h-full flex flex-col pt-[var(--top-bar-height)] pb-safe px-6 md:px-12">
        
        {/* Top Spacer for breathing room */}
        <div className="flex-grow max-h-[10vh]" />

        {/* Massive Vinyl Player (Responsive Square) */}
        <div className="w-full flex items-center justify-center relative shrink-0">
          <div className="relative w-[75vw] max-w-[360px] md:max-w-[440px] aspect-square flex items-center justify-center">
            <VinylRecord 
              track={currentTrack} 
              isPlaying={isPlaying} 
              className="z-10 drop-shadow-2xl"
            />
            <Tonearm 
              isPlaying={isPlaying} 
              className="top-[-10%] right-[-10%]"
            />
          </div>
        </div>

        {/* Middle Spacer for breathing room */}
        <div className="flex-grow max-h-[10vh]" />

        {/* Bottom Controls Area (Clean Stack) */}
        <div className="w-full flex flex-col items-center justify-center gap-6 pb-8 shrink-0">
          
          {/* Track Info */}
          <div className="flex flex-col w-full max-w-lg text-center md:text-left md:flex-row md:items-end md:justify-between px-2">
            <div className="flex flex-col min-w-0">
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white truncate drop-shadow-md">
                {currentTrack?.title ?? 'Not Playing'}
              </h2>
              <p className="text-lg text-white/70 truncate drop-shadow-sm font-medium mt-1">
                {currentTrack?.artist ?? 'Select a track'}
              </p>
            </div>
            {/* Desktop right-aligned actions could go here */}
          </div>

          {/* SeekBar */}
          <div className="w-full max-w-lg">
            <SeekBar />
          </div>

          {/* Controls */}
          <div className="w-full max-w-lg pb-4">
            <PlayerControls className="scale-105 md:scale-110" />
          </div>
        </div>
        
      </div>


    </BottomSheet>
  );
}

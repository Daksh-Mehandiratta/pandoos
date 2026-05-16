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
      className="bg-black border-none shadow-none"
    >
      {/* Base solid background to prevent ANY bleed-through from Home Page */}
      <div className="absolute inset-0 bg-black -z-20" />
      
      {/* Dynamic mood gradient background (Performant, no blur needed) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--color-primary)/0.6)] via-[hsl(var(--surface-base))] to-black -z-10 transition-colors duration-1000" />
      
      {/* Extra dark gradient overlay at bottom to ensure text and controls perfectly pop out */}
      <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none -z-10" />

      {/* Main Content: Flexible vertical stack */}
      <div className="w-full h-full flex flex-col pb-safe">
        
        {/* Top Header */}
        <div className="w-full flex items-center justify-between px-6 pt-safe mt-4 pb-2 shrink-0 z-50">
          <button 
            onClick={closePlayer}
            className="p-3 rounded-full text-white/80 hover:text-white transition-colors touch-highlight"
          >
            <ChevronDown size={28} />
          </button>
          <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-brand-primary uppercase drop-shadow-lg text-center px-4">
            Now Playing
          </span>
          <button className="p-3 rounded-full text-white/80 hover:text-white transition-colors touch-highlight">
            <MoreVertical size={24} />
          </button>
        </div>

        {/* Top Spacer */}
        <div className="flex-grow max-h-[6vh]" />

        {/* Massive Vinyl Player (Responsive Square) */}
        <div className="w-full flex items-center justify-center relative shrink-0">
          <div className="relative w-[82vw] max-w-[320px] md:max-w-[440px] aspect-square flex items-center justify-center">
            <VinylRecord 
              track={currentTrack} 
              isPlaying={isPlaying} 
              className="z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            />
            <Tonearm 
              isPlaying={isPlaying} 
              className="top-[-8%] right-[-8%]"
            />
          </div>
        </div>

        {/* Middle Spacer */}
        <div className="flex-grow max-h-[8vh]" />

        {/* Bottom Controls Area (Clean Stack) */}
        <div className="w-full flex flex-col items-center justify-center gap-5 pb-6 px-6 md:px-12 shrink-0">
          
          {/* Track Info */}
          <div className="flex flex-col w-full max-w-lg text-center md:text-left md:flex-row md:items-end md:justify-between px-2">
            <div className="flex flex-col min-w-0">
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white truncate drop-shadow-xl tracking-tight">
                {currentTrack?.title ?? 'Not Playing'}
              </h2>
              <p className="text-base md:text-lg text-white/80 truncate drop-shadow-md font-semibold mt-1">
                {currentTrack?.artist ?? 'Select a track'}
              </p>
            </div>
          </div>

          {/* SeekBar */}
          <div className="w-full max-w-lg mt-2">
            <SeekBar />
          </div>

          {/* Controls */}
          <div className="w-full max-w-lg pb-4 pt-2">
            <PlayerControls className="scale-105 md:scale-110" />
          </div>
        </div>
        
      </div>


    </BottomSheet>
  );
}

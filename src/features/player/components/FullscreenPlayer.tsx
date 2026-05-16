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

      {/* Main Content: Split View */}
      <div className="w-full h-full pt-24 pb-[120px] px-12 flex flex-col md:flex-row items-center justify-center gap-16">
        
        {/* Left Side: Massive Vinyl Player */}
        <div className="flex-1 flex items-center justify-end w-full max-w-2xl relative">
          <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
            <VinylRecord 
              track={currentTrack} 
              isPlaying={isPlaying} 
              size={500} 
              className="z-10 drop-shadow-2xl"
            />
            <Tonearm 
              isPlaying={isPlaying} 
              size={360}
              className="top-[-20px] right-[-30px]"
            />
          </div>
        </div>

        {/* Right Side: Lyrics Area */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white/60 transition-colors cursor-pointer hover:text-white">
              Maybe I was wrong and you were right
            </h3>
            <h2 className="text-5xl font-display font-extrabold text-white leading-tight drop-shadow-lg scale-105 origin-left transition-transform cursor-pointer">
              But I don't really wanna have this fight
            </h2>
            <h3 className="text-3xl font-bold text-white/40 transition-colors cursor-pointer hover:text-white">
              I just wanna feel like I belong
            </h3>
            <h3 className="text-3xl font-bold text-white/30 transition-colors cursor-pointer hover:text-white">
              And every time my heart swings back to you
            </h3>
          </div>
        </div>
      </div>

      {/* Bottom Controls Area */}
      <div className="absolute bottom-0 left-0 right-0 px-12 pb-10 pt-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between">
        
        {/* Track Info */}
        <div className="flex flex-col min-w-0 w-[30%]">
          <h2 className="text-2xl font-bold text-white truncate drop-shadow-md">
            {currentTrack?.title ?? 'Not Playing'}
          </h2>
          <p className="text-lg text-white/70 truncate drop-shadow-sm">
            {currentTrack?.artist ?? 'Select a track'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center justify-center w-[40%] gap-4">
          <PlayerControls className="scale-110" />
          <div className="w-full max-w-lg">
            <SeekBar />
          </div>
        </div>

        {/* Empty right area for balance */}
        <div className="w-[30%] flex justify-end">
        </div>
      </div>
    </BottomSheet>
  );
}

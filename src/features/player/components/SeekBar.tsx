import React, { useRef, useState, useEffect } from 'react';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { formatTimePadded } from '@/utils/formatTime';
import { cn } from '@/utils/cn';

export function SeekBar({ className }: { className?: string }) {
  const progress = usePlayerStore((state) => state.progress);
  const duration = usePlayerStore((state) => state.duration);
  const seekTo = usePlayerStore((state) => state.seekTo);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  // Use the dragged progress if user is dragging, otherwise the actual playback progress
  const displayProgress = isDragging ? dragProgress : progress;
  const currentTime = displayProgress * duration;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || duration === 0) return;
    setIsDragging(true);
    updateProgressFromEvent(e.clientX);
    
    // Capture pointer to track dragging outside the element
    containerRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    updateProgressFromEvent(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    setIsDragging(false);
    containerRef.current.releasePointerCapture(e.pointerId);
    
    // Commit the seek
    seekTo(dragProgress);
  };

  const updateProgressFromEvent = (clientX: number) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setDragProgress(x / rect.width);
  };

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {/* Time labels */}
      <div className="flex justify-between items-center text-xs text-text-muted font-mono px-1 select-none">
        <span>{formatTimePadded(currentTime)}</span>
        <span>{formatTimePadded(duration)}</span>
      </div>

      {/* The Bar */}
      <div 
        ref={containerRef}
        className="seek-bar h-8 flex items-center group touch-none relative cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Base Track (Blank Grey Line) */}
        <div 
          className={cn(
            "w-full bg-white/20 rounded-full relative overflow-hidden transition-all duration-300 ease-out",
            isDragging ? "h-2.5" : "h-1.5 group-hover:h-2"
          )}
        >
          {/* Played Portion (The Bamboo Growing) */}
          <div 
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 rounded-full"
            style={{ 
              width: `${displayProgress * 100}%`,
              transition: isDragging ? 'none' : 'width 0.1s linear',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
            }}
          />
        </div>
        
        {/* Playhead thumb (The Panda) */}
        <div 
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -ml-3 flex items-center justify-center text-xl transition-transform drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] z-10",
            isDragging ? "scale-125" : "scale-100"
          )}
          style={{ left: `${displayProgress * 100}%` }}
        >
          🐼
        </div>
      </div>
    </div>
  );
}

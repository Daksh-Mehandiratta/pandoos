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
        className="seek-bar h-6 flex items-center group touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Track background */}
        <div className="w-full h-1.5 bg-white/10 rounded-full relative overflow-hidden">
          {/* Fill progress */}
          <div 
            className="seek-bar-fill h-full bg-brand-primary"
            style={{ 
              width: `${displayProgress * 100}%`,
              transition: isDragging ? 'none' : 'width 0.1s linear'
            }}
          />
        </div>
        
        {/* Playhead thumb (visible on drag or hover) */}
        <div 
          className={cn(
            "absolute w-3.5 h-3.5 bg-white rounded-full shadow-lg border border-white/20 top-1/2 -translate-y-1/2 -ml-1.5",
            "transition-transform scale-0 group-hover:scale-100 focus:scale-100",
            isDragging ? "scale-125" : ""
          )}
          style={{ left: `${displayProgress * 100}%` }}
        />
      </div>
    </div>
  );
}

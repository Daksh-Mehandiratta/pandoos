import React, { useRef, useState, useCallback } from 'react';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { formatTimePadded } from '@/utils/formatTime';
import { cn } from '@/utils/cn';

export function SeekBar({ className }: { className?: string }) {
  const progress = usePlayerStore((state) => state.progress);
  const duration = usePlayerStore((state) => state.duration);
  const seekTo = usePlayerStore((state) => state.seekTo);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  // While dragging, use the dragged value; otherwise use store progress
  const displayProgress = isDragging ? dragProgress : progress;
  const currentTime = displayProgress * (duration > 0 ? duration : 0);

  const getProgressFromClientX = useCallback((clientX: number): number => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return x / rect.width;
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const newProgress = getProgressFromClientX(e.clientX);
    setIsDragging(true);
    setDragProgress(newProgress);
    containerRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setDragProgress(getProgressFromClientX(e.clientX));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const finalProgress = getProgressFromClientX(e.clientX);
    setIsDragging(false);
    containerRef.current?.releasePointerCapture(e.pointerId);
    // Only commit the seek if we have a valid duration; otherwise store the progress
    // so the audio engine picks it up once duration is ready
    seekTo(finalProgress);
  };

  const percent = `${displayProgress * 100}%`;

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {/* Time Labels */}
      <div className="flex justify-between items-center text-[11px] text-white/40 font-mono px-0.5 select-none tabular-nums">
        <span>{formatTimePadded(currentTime)}</span>
        <span>{duration > 0 ? formatTimePadded(duration) : '--:--'}</span>
      </div>

      {/* Slider Track Container */}
      <div
        ref={containerRef}
        className="relative flex items-center cursor-pointer touch-none select-none"
        style={{ height: '20px' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Background Track */}
        <div
          className="absolute left-0 right-0 rounded-full overflow-hidden"
          style={{
            height: isDragging ? '5px' : isHovering ? '4px' : '3px',
            transition: 'height 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'rgba(255,255,255,0.12)',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {/* Buffered ghost (subtle) */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
            }}
          />
          {/* Played Fill — uses song theme color already extracted by the mood engine */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: percent,
              background: 'linear-gradient(90deg, hsl(var(--color-primary, 4 90% 60%)) 0%, hsl(var(--color-primary, 4 90% 60%) / 0.8) 100%)',
              boxShadow: isDragging || isHovering
                ? '0 0 8px hsl(var(--color-primary, 4 90% 60%) / 0.6), 0 0 16px hsl(var(--color-primary, 4 90% 60%) / 0.3)'
                : '0 0 4px hsl(var(--color-primary, 4 90% 60%) / 0.35)',
              transition: isDragging
                ? 'none'
                : 'width 0.08s linear, box-shadow 0.3s ease',
            }}
          />
        </div>

        {/* Thumb Dot */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: isDragging ? '14px' : isHovering ? '12px' : '0px',
            height: isDragging ? '14px' : isHovering ? '12px' : '0px',
            left: percent,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#ffffff',
            boxShadow: isDragging
              ? '0 0 0 3px rgba(255,255,255,0.2), 0 0 12px rgba(255,95,86,0.5), 0 2px 8px rgba(0,0,0,0.4)'
              : '0 0 0 2px rgba(255,255,255,0.15), 0 2px 6px rgba(0,0,0,0.4)',
            transition: isDragging
              ? 'width 0.1s ease, height 0.1s ease, box-shadow 0.1s ease'
              : 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1), height 0.2s cubic-bezier(0.4, 0, 0.2, 1), left 0.08s linear, box-shadow 0.2s ease',
            opacity: isHovering || isDragging ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}

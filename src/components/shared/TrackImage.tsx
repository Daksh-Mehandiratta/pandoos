import React, { useState, useEffect } from 'react';
import { Music2 } from 'lucide-react';

interface TrackImageProps {
  videoId: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

// YouTube's grey "no thumbnail" placeholder dimensions are 120x90.
// We detect a broken thumbnail by checking naturalWidth after load.
const YOUTUBE_PLACEHOLDER_WIDTH = 120;

/**
 * TrackImage — Robust album art with:
 * 1. Gradient background while loading (NEVER blank/grey)
 * 2. Fallback chain: hqdefault → sddefault → gradient placeholder
 * 3. Detects YouTube's grey "no thumbnail" stub and skips it
 * 
 * NOTE: We intentionally skip maxresdefault — it 404s for ~40% of videos.
 * hqdefault (480x360) always exists and looks great at our card sizes.
 */
export function TrackImage({ videoId, title, className = '', style }: TrackImageProps) {
  // Deterministic color per videoId — unique gradient for every song
  const hue = videoId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  const hue2 = (hue + 60) % 360;

  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [src, setSrc] = useState(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
  const [triedSd, setTriedSd] = useState(false);

  // Reset when videoId changes
  useEffect(() => {
    setStatus('loading');
    setSrc(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
    setTriedSd(false);
  }, [videoId]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    // YouTube serves a 120x90 grey stub when the thumbnail doesn't exist
    if (img.naturalWidth <= YOUTUBE_PLACEHOLDER_WIDTH && !triedSd) {
      setTriedSd(true);
      setSrc(`https://i.ytimg.com/vi/${videoId}/sddefault.jpg`);
      setStatus('loading');
      return;
    }
    if (img.naturalWidth <= YOUTUBE_PLACEHOLDER_WIDTH) {
      setStatus('error');
      return;
    }
    setStatus('loaded');
  };

  const handleError = () => {
    if (!triedSd) {
      setTriedSd(true);
      setSrc(`https://i.ytimg.com/vi/${videoId}/sddefault.jpg`);
    } else {
      setStatus('error');
    }
  };

  const gradientBg = {
    background: `linear-gradient(135deg, hsl(${hue},55%,22%), hsl(${hue2},65%,30%))`,
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ ...gradientBg, ...style }}
    >
      {/* Gradient is ALWAYS visible — no grey/blank flash */}
      {status !== 'loaded' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {status === 'error' ? (
            <div className="flex flex-col items-center gap-1 opacity-60">
              <Music2 size={22} className="text-white/70" />
              {title && <span className="text-[9px] text-white/50 text-center px-2 line-clamp-2">{title}</span>}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white/80 animate-spin" />
          )}
        </div>
      )}

      {/* Actual image — invisible until loaded */}
      {status !== 'error' && (
        <img
          src={src}
          alt={title ?? ''}
          onLoad={handleLoad}
          onError={handleError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}

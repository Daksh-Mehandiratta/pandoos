import React, { useState } from 'react';
import { Music } from 'lucide-react';

interface TrackImageProps {
  videoId: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * TrackImage — A robust thumbnail component with a multi-level fallback chain.
 * YouTube's maxresdefault.jpg frequently 404s on older/smaller videos.
 * Fallback chain: maxresdefault → hqdefault → sddefault → gradient placeholder
 */
export function TrackImage({ videoId, title, className = '', style }: TrackImageProps) {
  const [fallbackLevel, setFallbackLevel] = useState(0);

  const srcs = [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
  ];

  const handleError = () => {
    setFallbackLevel((prev) => prev + 1);
  };

  // All image sources exhausted — show a styled gradient placeholder
  if (fallbackLevel >= srcs.length) {
    // Generate a deterministic color from the videoId for a unique look per song
    const hue = videoId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
    return (
      <div
        className={`flex items-center justify-center shrink-0 ${className}`}
        style={{
          background: `linear-gradient(135deg, hsl(${hue}, 60%, 25%), hsl(${(hue + 60) % 360}, 70%, 35%))`,
          ...style,
        }}
      >
        <Music className="text-white/50" size={Math.min(24, 24)} />
      </div>
    );
  }

  return (
    <img
      src={srcs[fallbackLevel]}
      alt={title ?? 'Album Art'}
      className={className}
      style={style}
      onError={handleError}
    />
  );
}

import { useEffect } from 'react';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { extractColors } from '@/services/color';
import { getBestThumbnail } from '@/services/youtube';

/**
 * useColorExtractor — The heart of the Mood Engine.
 * 
 * Automatically listens to track changes, fetches the highest-res thumbnail,
 * extracts the dominant/vibrant/muted palette, and updates the ThemeStore
 * (which in turn injects the CSS variables for 60fps transitions).
 * 
 * Mount this once in the App shell or FullscreenPlayer.
 */
export function useColorExtractor() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const applyColors = useThemeStore((state) => state.applyColors);
  const resetToDefault = useThemeStore((state) => state.resetToDefault);
  const setIsExtracting = useThemeStore((state) => state.setIsExtracting);

  useEffect(() => {
    if (!currentTrack) {
      resetToDefault();
      return;
    }

    let isMounted = true;

    async function runExtraction() {
      setIsExtracting(true);
      try {
        // Prefer maxres for better color extraction if available
        const imageUrl = getBestThumbnail(currentTrack!.videoId);
        
        // Due to CORS, we need the image to be served with proper headers.
        // YouTube's i.ytimg.com supports CORS.
        const colors = await extractColors(imageUrl);
        
        if (isMounted && colors) {
          applyColors(colors);
        }
      } catch (err) {
        console.error('Mood Engine color extraction failed:', err);
        // We leave the previous colors (or default) instead of resetting
        // to prevent jarring flashes.
      } finally {
        if (isMounted) {
          setIsExtracting(false);
        }
      }
    }

    runExtraction();

    return () => {
      isMounted = false;
    };
  }, [currentTrack?.videoId, applyColors, resetToDefault, setIsExtracting]);
}

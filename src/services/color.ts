import Vibrant from 'node-vibrant';
import type { Palette } from 'node-vibrant/lib/color';

interface ExtractedColors {
  primary: string;    // HSL without hsl() wrapper
  secondary: string;
  accent: string;
  muted: string;
}

/**
 * Convert a Vibrant Swatch RGB to an HSL CSS variable value.
 * Returns a string like "270 80% 68%" — ready for CSS var injection.
 */
function rgbToHslString(r: number, g: number, b: number): string {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    if (max === rNorm) h = ((gNorm - bNorm) / delta) % 6;
    else if (max === gNorm) h = (bNorm - rNorm) / delta + 2;
    else h = (rNorm - gNorm) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  // Boost saturation for dark images to keep the theme vivid
  const boostedS = Math.min(Math.round(s * 100) + 15, 95);
  // Keep lightness in a usable range (not too dark, not washed out)
  const clampedL = Math.max(50, Math.min(75, Math.round(l * 100)));

  return `${h} ${boostedS}% ${clampedL}%`;
}

function paletteToHsl(swatch: Palette[keyof Palette]): string | null {
  if (!swatch) return null;
  const [r, g, b] = swatch.getRgb();
  return rgbToHslString(r, g, b);
}

/**
 * Extract dominant, vibrant, and muted colors from an image URL.
 * Uses node-vibrant (browser build) — runs in the main thread but is fast enough
 * for album art thumbnails (typically < 100ms on mid-range devices).
 *
 * @param imageUrl - Any cross-origin URL. YouTube thumbnails are CORS-enabled.
 * @returns Extracted color palette or null on failure.
 */
export async function extractColors(imageUrl: string): Promise<ExtractedColors | null> {
  try {
    const palette = await Vibrant.from(imageUrl)
      .quality(5)   // quality 1=best, 10=fastest; 5 is a good balance
      .getPalette();

    // Vibrant = most colorful (primary accent)
    // LightVibrant = lighter variant (secondary)
    // Muted = desaturated version (background tints)
    // DarkVibrant = dark accent for contrast elements
    const primary = paletteToHsl(palette.Vibrant)
      ?? paletteToHsl(palette.DarkVibrant)
      ?? null;

    const secondary = paletteToHsl(palette.LightVibrant)
      ?? paletteToHsl(palette.LightMuted)
      ?? null;

    const accent = paletteToHsl(palette.DarkVibrant)
      ?? paletteToHsl(palette.Muted)
      ?? null;

    const muted = paletteToHsl(palette.Muted)
      ?? paletteToHsl(palette.DarkMuted)
      ?? null;

    if (!primary) return null;

    return {
      primary,
      secondary: secondary ?? primary,
      accent: accent ?? primary,
      muted: muted ?? `${primary.split(' ')[0]} 25% 55%`,
    };
  } catch {
    // Silently fail — caller falls back to default theme
    return null;
  }
}

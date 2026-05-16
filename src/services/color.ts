interface ExtractedColors {
  primary: string;    // HSL without hsl() wrapper, e.g. "270 80% 68%"
  secondary: string;
  accent: string;
  muted: string;
}

/** Convert RGB (0-255) to an HSL string "H S% L%" for CSS var injection */
function rgbToHslString(r: number, g: number, b: number): string {
  const rN = r / 255, gN = g / 255, bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const delta = max - min;

  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    if (max === rN) h = ((gN - bN) / delta) % 6;
    else if (max === gN) h = (bN - rN) / delta + 2;
    else h = (rN - gN) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  // Boost saturation so album-art dark images still produce vivid theme colors
  const S = Math.min(Math.round(s * 100) + 15, 95);
  // Keep lightness in a usable range — not too dark, not washed out
  const L = Math.max(50, Math.min(75, Math.round(l * 100)));
  return `${h} ${S}% ${L}%`;
}

/**
 * Load an image into an offscreen canvas, sample pixels in a grid,
 * and return up to `k` dominant color clusters (k-means lite).
 *
 * This replaces node-vibrant which doesn't have a default export in Vite's
 * browser bundler and crashes the entire module graph with a SyntaxError.
 */
async function sampleImageColors(
  imageUrl: string,
  sampleSize = 200
): Promise<Array<[number, number, number]>> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const SIZE = 64; // downscale for speed
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve([]); return; }

      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

      const pixels: Array<[number, number, number]> = [];
      const step = Math.max(1, Math.floor(data.length / 4 / sampleSize));

      for (let i = 0; i < data.length; i += 4 * step) {
        const r = data[i] ?? 0;
        const g = data[i + 1] ?? 0;
        const b = data[i + 2] ?? 0;
        const a = data[i + 3] ?? 0;
        // Skip near-transparent, near-black, and near-white pixels
        if (a < 128) continue;
        const brightness = (r + g + b) / 3;
        if (brightness < 20 || brightness > 240) continue;
        pixels.push([r, g, b]);
      }
      resolve(pixels);
    };

    img.onerror = () => resolve([]);
    img.src = imageUrl;
  });
}

/** Find the most-saturated pixel cluster among sampled pixels */
function dominantColors(
  pixels: Array<[number, number, number]>
): { vibrant: [number,number,number] | null; muted: [number,number,number] | null } {
  if (pixels.length === 0) return { vibrant: null, muted: null };

  // Sort by saturation descending
  const withSat = pixels.map(([r, g, b]) => {
    const rN = r / 255, gN = g / 255, bN = b / 255;
    const max = Math.max(rN, gN, bN);
    const min = Math.min(rN, gN, bN);
    const sat = max === 0 ? 0 : (max - min) / max;
    return { r, g, b, sat };
  });
  withSat.sort((a, b) => b.sat - a.sat);

  const vibrant = withSat[0];
  const muted = withSat[Math.floor(withSat.length * 0.7)];

  return {
    vibrant: vibrant ? [vibrant.r, vibrant.g, vibrant.b] : null,
    muted: muted ? [muted.r, muted.g, muted.b] : null,
  };
}

/**
 * Extract dominant, vibrant, and muted colors from an image URL using
 * the browser Canvas API — no external dependencies required.
 *
 * @param imageUrl - Any CORS-enabled URL (YouTube thumbnails work fine).
 * @returns Extracted palette or null on failure.
 */
export async function extractColors(imageUrl: string): Promise<ExtractedColors | null> {
  try {
    const pixels = await sampleImageColors(imageUrl);
    if (pixels.length < 5) return null;

    const { vibrant, muted } = dominantColors(pixels);
    if (!vibrant) return null;

    const primary = rgbToHslString(...vibrant);

    // Derive secondary as a lighter/shifted variant
    const [ph] = primary.split(' ');
    const hue = parseInt(ph ?? '270', 10);
    const secondary = `${(hue + 30) % 360} 70% 65%`;
    const accent    = `${(hue + 180) % 360} 75% 60%`;
    const mutedStr  = muted
      ? rgbToHslString(...muted)
      : `${hue} 25% 55%`;

    return { primary, secondary, accent, muted: mutedStr };
  } catch {
    // Silently fail — caller uses DEFAULT_THEME as fallback
    return null;
  }
}

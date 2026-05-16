interface ExtractedColors {
  primary: string;    // HSL without hsl() wrapper, e.g. "270 80% 68%"
  secondary: string;
  accent: string;
  muted: string;
}

/** Convert RGB (0-255) to an HSL string "H S% L%" for CSS var injection */
function rgbToHslString(r: number, g: number, b: number): string {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Provide fallback defaults using || to catch any NaN results from floating point math
  const H = Math.round((h || 0) * 360) % 360;
  // Force a vibrant saturation
  const S = Math.min(Math.round((s || 0) * 100) + 25, 95);
  // Strictly clamp lightness to ensure it NEVER goes black or white
  const L = Math.max(45, Math.min(65, Math.round((l || 0) * 100)));
  
  return `${H} ${S}% ${L}%`;
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

      // Crop top and bottom 15% to avoid YouTube's black bars on hqdefault
      const sy = img.height * 0.15;
      const sHeight = img.height * 0.7;
      
      ctx.drawImage(img, 0, sy, img.width, sHeight, 0, 0, SIZE, SIZE);
      const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

      const pixels: Array<[number, number, number]> = [];
      const step = Math.max(1, Math.floor(data.length / 4 / sampleSize));

      for (let i = 0; i < data.length; i += 4 * step) {
        const r = data[i] ?? 0;
        const g = data[i + 1] ?? 0;
        const b = data[i + 2] ?? 0;
        const a = data[i + 3] ?? 0;
        // Skip transparent and low-saturation/dark pixels (black bars with JPEG noise)
        if (a < 128) continue;
        const brightness = (r + g + b) / 3;
        if (brightness < 40 || brightness > 230) continue; // Skip darks and pure whites
        
        // Skip grey pixels (low saturation)
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        if (max - min < 20) continue; 
        
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

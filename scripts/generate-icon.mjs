/**
 * generate-icon.mjs
 * Converts /public/logo.png → /build/icon.ico (required by electron-builder for Windows)
 * Run with: node scripts/generate-icon.mjs
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'public', 'logo.png');
const buildDir = path.join(root, 'build');
const dest = path.join(buildDir, 'icon.png');

if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// electron-builder accepts a .png at build/icon.png for all platforms.
// For Windows it auto-converts to ICO. We just need a 512x512 PNG.
await sharp(src)
  .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(dest);

console.log('✅ Icon generated at build/icon.png');

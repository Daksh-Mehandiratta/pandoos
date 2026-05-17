import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputImagePath = path.join(__dirname, '../public/panda_favicon.png');
const outputDir = path.join(__dirname, '../public/icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const sizes = [192, 512];

async function generateIcons() {
  try {
    for (const size of sizes) {
      await sharp(inputImagePath)
        .resize(size, size, { fit: 'contain', background: { r: 10, g: 10, b: 15, alpha: 1 } })
        .toFile(path.join(outputDir, `icon-${size}.png`));
      console.log(`Generated icon-${size}.png`);
    }

    // Maskable icon (usually requires some padding or specific safe zone, we'll just use the 512)
    await sharp(inputImagePath)
      .resize(512, 512, { fit: 'contain', background: { r: 10, g: 10, b: 15, alpha: 1 } })
      .toFile(path.join(outputDir, `icon-512-maskable.png`));
    console.log(`Generated icon-512-maskable.png`);

    console.log('All icons generated successfully.');
  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generateIcons();

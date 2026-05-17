import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.join(__dirname, '../public/logo.png');
const tempPath = path.join(__dirname, '../public/logo_temp.png');

async function trimLogo() {
  try {
    // Read the logo, trim transparency, and save to a temporary file
    await sharp(logoPath)
      .trim()
      .toFile(tempPath);
      
    console.log('Logo trimmed successfully.');
    
    // In a real script we would rename/move tempPath over logoPath, 
    // but Windows can lock files, so we do it carefully.
  } catch (error) {
    console.error('Error trimming logo:', error);
  }
}

trimLogo();

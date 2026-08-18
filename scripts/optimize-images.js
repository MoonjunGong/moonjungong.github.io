import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

async function processDirectory(directory, rootDir) {
  if (!fs.existsSync(directory)) {
    return;
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath, rootDir);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        const baseName = entry.name.slice(0, -ext.length);
        const webpPath = path.join(directory, `${baseName}.webp`);

        try {
          const originalStats = fs.statSync(fullPath);
          await sharp(fullPath)
            .webp({ quality: 85, effort: 4 })
            .toFile(webpPath);
          
          const newStats = fs.statSync(webpPath);
          const savedPercent = (((originalStats.size - newStats.size) / originalStats.size) * 100).toFixed(1);
          console.log(`[optimize-images] Converted: ${path.relative(rootDir, fullPath)} -> ${path.relative(rootDir, webpPath)} (${(newStats.size / 1024).toFixed(1)} KB, saved ${savedPercent}%)`);
        } catch (err) {
          console.error(`[optimize-images] Error converting ${fullPath}:`, err);
        }
      }
    }
  }
}

async function run() {
  const target = process.argv[2];
  if (target === 'public' || !target) {
    console.log('[optimize-images] Processing public/ assets...');
    await processDirectory(PUBLIC_DIR, PUBLIC_DIR);
  }
  if (target === 'dist' || !target) {
    if (fs.existsSync(DIST_DIR)) {
      console.log('[optimize-images] Processing dist/ assets...');
      await processDirectory(DIST_DIR, DIST_DIR);
    }
  }
  console.log('[optimize-images] Image optimization completed!');
}

run();

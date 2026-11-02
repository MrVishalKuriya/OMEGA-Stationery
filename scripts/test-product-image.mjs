import sharp from 'sharp';
import fs from 'node:fs';

const TEST_DIR = 'public/test-bad-images';
if (!fs.existsSync(TEST_DIR)) fs.mkdirSync(TEST_DIR, { recursive: true });

// 1. Very wide (1800x400)
await sharp({
  create: {
    width: 1800,
    height: 400,
    channels: 4,
    background: { r: 214, g: 58, b: 58, alpha: 1 },
  },
})
  .png()
  .toFile(`${TEST_DIR}/very-wide.png`);

// 2. Very tall (400x1800)
await sharp({
  create: {
    width: 400,
    height: 1800,
    channels: 4,
    background: { r: 233, g: 180, b: 76, alpha: 1 },
  },
})
  .png()
  .toFile(`${TEST_DIR}/very-tall.png`);

// 3. Tiny (64x64)
await sharp({
  create: {
    width: 64,
    height: 64,
    channels: 4,
    background: { r: 27, g: 26, b: 28, alpha: 1 },
  },
})
  .png()
  .toFile(`${TEST_DIR}/tiny.png`);

console.log('✅ Created 3 test images in public/test-bad-images:');
console.log('• very-wide.png (1800x400)');
console.log('• very-tall.png (400x1800)');
console.log('• tiny.png (64x64)');


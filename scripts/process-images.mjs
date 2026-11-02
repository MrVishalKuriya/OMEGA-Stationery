import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = path.resolve('public/products-original');
const DEST_DIR = path.resolve('public/products');
const INITIAL_PRODUCTS_FILE = path.resolve('src/data/initialProducts.json');

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

console.log('🚀 Starting OMEGA Standardized Image Pipeline...');
console.log(`Source directory: ${SOURCE_DIR}`);
console.log(`Output directory: ${DEST_DIR}`);

// Load initial products to know which products map to which files
const products = JSON.parse(fs.readFileSync(INITIAL_PRODUCTS_FILE, 'utf8'));

// Slugify helper
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const report = {
  processed: [],
  flagged: [],
  skipped: [],
};

// Process each product image
for (const product of products) {
  let origRel = product.image;
  if (!origRel) continue;

  // Normalize path
  let filename = path.basename(origRel);
  let srcPath = path.join(SOURCE_DIR, filename);

  // If not found in products-original, check public/omega-products or public/
  if (!fs.existsSync(srcPath)) {
    srcPath = path.resolve('public', origRel.replace(/^\//, ''));
  }

  if (!fs.existsSync(srcPath)) {
    report.flagged.push({
      productId: product.id,
      name: product.name,
      reason: `Original file not found: ${origRel}`,
    });
    continue;
  }

  const stat = fs.statSync(srcPath);
  const ext = path.extname(filename).toLowerCase();
  const slug = slugify(product.name || path.parse(filename).name);

  // Check if image is a multi-product catalog sheet or promotional banner
  const isSheet = filename.includes('catalog-sheet') || filename.includes('banner') || filename.includes('desk');

  try {
    const meta = await sharp(srcPath).metadata();
    const hasAlpha = Boolean(meta.hasAlpha || meta.channels === 4 || ext === '.png');
    const shorter = Math.min(meta.width || 0, meta.height || 0);

    if (isSheet || shorter < 400) {
      report.flagged.push({
        productId: product.id,
        name: product.name,
        file: filename,
        dimensions: `${meta.width}x${meta.height}`,
        reason: isSheet ? 'Multi-product catalog sheet / busy background' : 'Resolution too low (< 400px)',
      });
    }

    // Pipeline processing:
    // 1. Trim empty/uniform outer borders
    // 2. Resize inside 1008x1008 (1200 with ~8% margin on all 4 sides = 1200 * 0.84 = 1008)
    // 3. Extend / center onto 1200x1200 square canvas
    const bgType = hasAlpha ? 'transparent' : 'white';
    const canvasBg = hasAlpha
      ? { r: 0, g: 0, b: 0, alpha: 0 }
      : { r: 255, g: 255, b: 255, alpha: 1 };

    // Standard square canvas 1200x1200
    const innerSize = Math.round(1200 * (1 - 2 * 0.08)); // 1008

    let pipeline = sharp(srcPath);

    // Only auto-trim if it's not a complex catalog sheet
    if (!isSheet) {
      try {
        pipeline = pipeline.trim();
      } catch (err) {
        // If trim fails, continue with original
      }
    }

    const trimmedBuffer = await pipeline
      .resize(innerSize, innerSize, {
        fit: 'inside',
        withoutEnlargement: false,
        background: canvasBg,
      })
      .toBuffer();

    // Composite centered on 1200x1200 canvas
    const base1200 = await sharp({
      create: {
        width: 1200,
        height: 1200,
        channels: 4,
        background: canvasBg,
      },
    })
      .composite([{ input: trimmedBuffer, gravity: 'center' }])
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    // Export 1200
    const file1200 = path.join(DEST_DIR, `${slug}-1200.webp`);
    await sharp(base1200).toFile(file1200);

    // Export 800
    const file800 = path.join(DEST_DIR, `${slug}-800.webp`);
    await sharp(base1200)
      .resize(800, 800)
      .webp({ quality: 80, effort: 4 })
      .toFile(file800);

    // Export 400
    const file400 = path.join(DEST_DIR, `${slug}-400.webp`);
    await sharp(base1200)
      .resize(400, 400)
      .webp({ quality: 80, effort: 4 })
      .toFile(file400);

    const size400Kb = (fs.statSync(file400).size / 1024).toFixed(1);
    const size800Kb = (fs.statSync(file800).size / 1024).toFixed(1);
    const size1200Kb = (fs.statSync(file1200).size / 1024).toFixed(1);

    // Update product object
    product.image = {
      src: `/products/${slug}-1200.webp`,
      src400: `/products/${slug}-400.webp`,
      src800: `/products/${slug}-800.webp`,
      src1200: `/products/${slug}-1200.webp`,
      width: 1200,
      height: 1200,
      bg: bgType,
      alt: product.name || 'OMEGA Stationery Product',
    };

    report.processed.push({
      id: product.id,
      name: product.name,
      slug,
      bg: bgType,
      sizes: `400px: ${size400Kb}KB | 800px: ${size800Kb}KB | 1200px: ${size1200Kb}KB`,
    });
  } catch (err) {
    console.error(`Error processing ${filename}:`, err);
    report.flagged.push({
      productId: product.id,
      name: product.name,
      file: filename,
      reason: err.message,
    });
  }
}

// Write updated initialProducts.json
fs.writeFileSync(INITIAL_PRODUCTS_FILE, JSON.stringify(products, null, 2));

console.log('\n============================================================');
console.log('✅ IMAGE PIPELINE REPORT');
console.log('============================================================');
console.log(`Processed: ${report.processed.length} products`);
console.log(`Flagged / Needing Reshoot: ${report.flagged.length} products\n`);

console.log('--- PROCESSED PRODUCTS (Sample first 10) ---');
for (const p of report.processed.slice(0, 10)) {
  console.log(`• [${p.id}] ${p.name}`);
  console.log(`  BG: ${p.bg} | ${p.sizes}`);
}

console.log('\n--- IMAGES FLAGGED FOR RESHOOT / ISOLATION ---');
for (const f of report.flagged) {
  console.log(`⚠️ [${f.productId}] ${f.name}`);
  console.log(`   File: ${f.file || 'N/A'} | Reason: ${f.reason}`);
}

// Save detailed report
fs.writeFileSync(
  'C:/Users/Hp/.gemini/antigravity/brain/d5efd49d-c8e5-4173-862e-20ef1281d6fd/scratch/pipeline_report.json',
  JSON.stringify(report, null, 2)
);
console.log('\nPipeline complete!');


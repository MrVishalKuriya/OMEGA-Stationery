/**
 * High-Fidelity Client-Side Canvas Image Compression Utility
 *
 * Uses progressive multi-step downscaling (halving step-down for >2x reductions),
 * automatic pixel-level transparency detection, and an adaptive quality-first
 * budget loop so OMEGA Stationery product photos stay razor-sharp while keeping
 * payload sizes small and fast for MongoDB Atlas & mobile 4G networks.
 */

export interface ImageCompressionOptions {
  /** Maximum output width in pixels (default: 1600) */
  maxWidth?: number;
  /** Maximum output height in pixels (default: 1600) */
  maxHeight?: number;
  /** Target maximum file size in kilobytes (default: 480 KB) */
  maxSizeKB?: number;
  /** Starting encoder quality 0..1 (default: 0.94) */
  initialQuality?: number;
  /** Quality floor 0..1 — never degrades below this threshold (default: 0.82) */
  minQuality?: number;
  /** Preferred MIME type ('auto' picks best sharp/compact format) */
  preferredFormat?: 'auto' | 'image/webp' | 'image/jpeg' | 'image/png';
  /** Background fill color when flattening opaque/JPEG output (default: '#ffffff') */
  backgroundColor?: string;
  /** Force keeping alpha channel even if mostly opaque */
  preserveAlpha?: boolean;
  /** Original filename (used to derive clean output filename extension) */
  fileName?: string;
}

export interface CompressedImageResult {
  dataUrl: string;
  mimeType: 'image/webp' | 'image/jpeg' | 'image/png';
  fileName: string;
  width: number;
  height: number;
  originalBytes: number;
  compressedBytes: number;
  savingsPercent: number;
  qualityUsed: number;
  hasTransparency: boolean;
}

let cachedWebpEncodeSupport: boolean | null = null;

/**
 * Checks whether the current browser natively supports canvas WebP encoding.
 */
export function supportsCanvasWebp(): boolean {
  if (cachedWebpEncodeSupport !== null) return cachedWebpEncodeSupport;
  if (typeof document === 'undefined') {
    cachedWebpEncodeSupport = false;
    return false;
  }
  try {
    const testCanvas = document.createElement('canvas');
    testCanvas.width = 2;
    testCanvas.height = 2;
    const dataUrl = testCanvas.toDataURL('image/webp', 0.9);
    cachedWebpEncodeSupport = dataUrl.startsWith('data:image/webp');
  } catch {
    cachedWebpEncodeSupport = false;
  }
  return cachedWebpEncodeSupport;
}

/**
 * Accurately estimates decoded binary byte size from a base64 data URI.
 */
export function estimateDataUrlBytes(dataUrl: string): number {
  if (!dataUrl) return 0;
  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx === -1) return dataUrl.length;
  const base64 = dataUrl.slice(commaIdx + 1);
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

/**
 * Human-readable byte formatter (e.g. "248 KB", "1.42 MB").
 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Samples the canvas alpha channel to detect whether the image truly uses transparency.
 * Avoids encoding completely opaque PNGs as giant 2MB+ PNG payloads.
 */
export function detectCanvasTransparency(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx || canvas.width === 0 || canvas.height === 0) return false;
  try {
    // Sample on a small copy if canvas is large for instant O(1) speed on mobile
    const sampleMax = 256;
    const scale = Math.min(1, sampleMax / Math.max(canvas.width, canvas.height));
    const sw = Math.max(1, Math.round(canvas.width * scale));
    const sh = Math.max(1, Math.round(canvas.height * scale));

    let data: Uint8ClampedArray;
    if (scale < 1) {
      const sampleCanvas = document.createElement('canvas');
      sampleCanvas.width = sw;
      sampleCanvas.height = sh;
      const sCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
      if (!sCtx) return false;
      sCtx.drawImage(canvas, 0, 0, sw, sh);
      data = sCtx.getImageData(0, 0, sw, sh).data;
    } else {
      data = ctx.getImageData(0, 0, sw, sh).data;
    }

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 250) return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Progressive multi-step canvas downscaler.
 * Single-step drawImage downscaling by >2x introduces aliasing and softness on fine typography;
 * stepping down by 50% increments keeps text, grid rulings, and product labels crisp.
 */
export function stepDownScaleToCanvas(
  source: HTMLImageElement | HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
  fillBackground?: string
): HTMLCanvasElement {
  const srcW =
    source instanceof HTMLImageElement
      ? source.naturalWidth || source.width
      : source.width;
  const srcH =
    source instanceof HTMLImageElement
      ? source.naturalHeight || source.height
      : source.height;

  const finalW = Math.max(1, Math.round(targetWidth));
  const finalH = Math.max(1, Math.round(targetHeight));

  // If no significant downscaling (>2x) is needed, do a single high-quality pass
  if (srcW <= finalW * 2 && srcH <= finalH * 2) {
    const out = document.createElement('canvas');
    out.width = finalW;
    out.height = finalH;
    const ctx = out.getContext('2d');
    if (ctx) {
      if (fillBackground) {
        ctx.fillStyle = fillBackground;
        ctx.fillRect(0, 0, finalW, finalH);
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(source, 0, 0, finalW, finalH);
    }
    return out;
  }

  // Multi-step halving passes until within 2x of target dimensions
  let curCanvas = document.createElement('canvas');
  let curW = Math.max(finalW, Math.round(srcW * 0.5));
  let curH = Math.max(finalH, Math.round(srcH * 0.5));
  curCanvas.width = curW;
  curCanvas.height = curH;
  const firstCtx = curCanvas.getContext('2d');
  if (firstCtx) {
    firstCtx.imageSmoothingEnabled = true;
    firstCtx.imageSmoothingQuality = 'high';
    firstCtx.drawImage(source, 0, 0, curW, curH);
  }

  while (curW * 0.5 > finalW && curH * 0.5 > finalH) {
    const nextW = Math.max(finalW, Math.round(curW * 0.5));
    const nextH = Math.max(finalH, Math.round(curH * 0.5));
    const nextCanvas = document.createElement('canvas');
    nextCanvas.width = nextW;
    nextCanvas.height = nextH;
    const nextCtx = nextCanvas.getContext('2d');
    if (nextCtx) {
      nextCtx.imageSmoothingEnabled = true;
      nextCtx.imageSmoothingQuality = 'high';
      nextCtx.drawImage(curCanvas, 0, 0, curW, curH, 0, 0, nextW, nextH);
    }
    curCanvas = nextCanvas;
    curW = nextW;
    curH = nextH;
  }

  // Final pass to exact target dimensions
  const out = document.createElement('canvas');
  out.width = finalW;
  out.height = finalH;
  const outCtx = out.getContext('2d');
  if (outCtx) {
    if (fillBackground) {
      outCtx.fillStyle = fillBackground;
      outCtx.fillRect(0, 0, finalW, finalH);
    }
    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = 'high';
    outCtx.drawImage(curCanvas, 0, 0, curW, curH, 0, 0, finalW, finalH);
  }
  return out;
}

function replaceFileExtension(fileName: string | undefined, mimeType: string): string {
  const base = (fileName || 'product_photo')
    .replace(/\.[^/.]+$/, '')
    .trim() || 'product_photo';
  const ext =
    mimeType === 'image/webp'
      ? 'webp'
      : mimeType === 'image/png'
      ? 'png'
      : 'jpg';
  return `${base}.${ext}`;
}

/**
 * Compresses an already-rendered HTMLCanvasElement to an optimal high-quality data URL.
 * Preserves high visual fidelity with an adaptive quality floor (default >= 0.82).
 */
export function compressCanvasToDataUrl(
  sourceCanvas: HTMLCanvasElement,
  options: ImageCompressionOptions & { originalBytes?: number } = {}
): CompressedImageResult {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    maxSizeKB = 480,
    initialQuality = 0.94,
    minQuality = 0.82,
    preferredFormat = 'auto',
    backgroundColor = '#ffffff',
    preserveAlpha = false,
    fileName,
    originalBytes,
  } = options;

  const srcW = sourceCanvas.width;
  const srcH = sourceCanvas.height;
  const scale = Math.min(1, maxWidth / Math.max(1, srcW), maxHeight / Math.max(1, srcH));
  const targetW = Math.max(1, Math.round(srcW * scale));
  const targetH = Math.max(1, Math.round(srcH * scale));

  const hasTransparency = preserveAlpha || detectCanvasTransparency(sourceCanvas);
  const canWebp = supportsCanvasWebp();

  let targetMime: 'image/webp' | 'image/jpeg' | 'image/png';
  if (preferredFormat === 'image/png') {
    targetMime = 'image/png';
  } else if (preferredFormat === 'image/jpeg') {
    targetMime = 'image/jpeg';
  } else if (preferredFormat === 'image/webp') {
    targetMime = canWebp ? 'image/webp' : hasTransparency ? 'image/png' : 'image/jpeg';
  } else {
    // 'auto': WebP gives sharpest quality-per-byte for both transparent and opaque photos;
    // falls back to PNG for transparent cutouts or JPEG for opaque photos when WebP unsupported.
    if (canWebp) {
      targetMime = 'image/webp';
    } else {
      targetMime = hasTransparency ? 'image/png' : 'image/jpeg';
    }
  }

  const workingCanvas =
    scale < 1 || (targetMime === 'image/jpeg' && hasTransparency)
      ? stepDownScaleToCanvas(
          sourceCanvas,
          targetW,
          targetH,
          targetMime === 'image/jpeg' ? backgroundColor : undefined
        )
      : sourceCanvas;

  // For JPEG output on a canvas that might have unpainted transparent regions, ensure clean white matte
  let encodeCanvas = workingCanvas;
  if (targetMime === 'image/jpeg' && workingCanvas === sourceCanvas) {
    const matte = document.createElement('canvas');
    matte.width = workingCanvas.width;
    matte.height = workingCanvas.height;
    const mCtx = matte.getContext('2d');
    if (mCtx) {
      mCtx.fillStyle = backgroundColor;
      mCtx.fillRect(0, 0, matte.width, matte.height);
      mCtx.drawImage(workingCanvas, 0, 0);
      encodeCanvas = matte;
    }
  }

  const targetMaxBytes = maxSizeKB * 1024;
  let qualityUsed = initialQuality;
  let dataUrl: string;

  if (targetMime === 'image/png') {
    dataUrl = encodeCanvas.toDataURL('image/png');
    qualityUsed = 1;
  } else {
    // Adaptive high-quality loop: step down gently by 0.03 until within target budget or quality floor
    dataUrl = encodeCanvas.toDataURL(targetMime, qualityUsed);
    let currentBytes = estimateDataUrlBytes(dataUrl);

    while (currentBytes > targetMaxBytes && qualityUsed > minQuality) {
      qualityUsed = Math.max(minQuality, Math.round((qualityUsed - 0.03) * 100) / 100);
      const candidate = encodeCanvas.toDataURL(targetMime, qualityUsed);
      const candidateBytes = estimateDataUrlBytes(candidate);
      dataUrl = candidate;
      currentBytes = candidateBytes;
      if (qualityUsed <= minQuality) break;
    }

    // If WebP somehow produced a larger file than JPEG on an opaque photo, compare with JPEG
    if (targetMime === 'image/webp' && !hasTransparency) {
      const jpegCandidate = encodeCanvas.toDataURL('image/jpeg', Math.max(minQuality, qualityUsed));
      const jpegBytes = estimateDataUrlBytes(jpegCandidate);
      if (jpegBytes < currentBytes * 0.92) {
        dataUrl = jpegCandidate;
        targetMime = 'image/jpeg';
      }
    }
  }

  const compressedBytes = estimateDataUrlBytes(dataUrl);
  const baselineBytes = originalBytes && originalBytes > 0 ? originalBytes : compressedBytes;
  const savingsPercent =
    baselineBytes > 0
      ? Math.max(0, Math.round(((baselineBytes - compressedBytes) / baselineBytes) * 100))
      : 0;

  return {
    dataUrl,
    mimeType: targetMime,
    fileName: replaceFileExtension(fileName, targetMime),
    width: encodeCanvas.width,
    height: encodeCanvas.height,
    originalBytes: baselineBytes,
    compressedBytes,
    savingsPercent,
    qualityUsed,
    hasTransparency,
  };
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!src.startsWith('data:') && !src.startsWith('blob:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode image for compression'));
    img.src = src;
  });
}

/**
 * Compresses a browser File (from <input type="file"> or drag-and-drop) using multi-step canvas scaling.
 * Preserves SVG files untouched.
 */
export async function compressImageFile(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<CompressedImageResult> {
  // Never rasterize vector SVGs
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read SVG file'));
      reader.readAsDataURL(file);
    });
    return {
      dataUrl,
      mimeType: 'image/png',
      fileName: file.name,
      width: 1200,
      height: 1200,
      originalBytes: file.size,
      compressedBytes: file.size,
      savingsPercent: 0,
      qualityUsed: 1,
      hasTransparency: true,
    };
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImageElement(objectUrl);
    const naturalW = img.naturalWidth || img.width || 1200;
    const naturalH = img.naturalHeight || img.height || 1200;
    const maxWidth = options.maxWidth ?? 1600;
    const maxHeight = options.maxHeight ?? 1600;
    const scale = Math.min(1, maxWidth / Math.max(1, naturalW), maxHeight / Math.max(1, naturalH));
    const targetW = Math.max(1, Math.round(naturalW * scale));
    const targetH = Math.max(1, Math.round(naturalH * scale));

    const canvas = stepDownScaleToCanvas(img, targetW, targetH);
    return compressCanvasToDataUrl(canvas, {
      ...options,
      fileName: options.fileName || file.name,
      originalBytes: file.size,
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Compresses an image data URI (e.g. from Studio Pro or FileReader) using multi-step canvas optimization.
 * If the image is already within target dimensions and byte budget, avoids unnecessary re-encoding.
 */
export async function compressImageDataUrl(
  dataUrl: string,
  options: ImageCompressionOptions = {}
): Promise<CompressedImageResult> {
  const originalBytes = estimateDataUrlBytes(dataUrl);
  if (dataUrl.startsWith('data:image/svg+xml')) {
    return {
      dataUrl,
      mimeType: 'image/png',
      fileName: options.fileName || 'vector_product.svg',
      width: 1200,
      height: 1200,
      originalBytes,
      compressedBytes: originalBytes,
      savingsPercent: 0,
      qualityUsed: 1,
      hasTransparency: true,
    };
  }

  const img = await loadImageElement(dataUrl);
  const naturalW = img.naturalWidth || img.width || 1200;
  const naturalH = img.naturalHeight || img.height || 1200;
  const maxWidth = options.maxWidth ?? 1600;
  const maxHeight = options.maxHeight ?? 1600;
  const maxSizeKB = options.maxSizeKB ?? 480;

  // If already within target dimensions AND compact size budget, skip lossy re-compression
  const alreadyOptimal =
    naturalW <= maxWidth &&
    naturalH <= maxHeight &&
    originalBytes <= maxSizeKB * 1024 &&
    (dataUrl.startsWith('data:image/webp') || dataUrl.startsWith('data:image/jpeg'));

  if (alreadyOptimal) {
    const mimeType = dataUrl.startsWith('data:image/webp') ? 'image/webp' : 'image/jpeg';
    return {
      dataUrl,
      mimeType,
      fileName: replaceFileExtension(options.fileName, mimeType),
      width: naturalW,
      height: naturalH,
      originalBytes,
      compressedBytes: originalBytes,
      savingsPercent: 0,
      qualityUsed: 1,
      hasTransparency: false,
    };
  }

  const scale = Math.min(1, maxWidth / Math.max(1, naturalW), maxHeight / Math.max(1, naturalH));
  const targetW = Math.max(1, Math.round(naturalW * scale));
  const targetH = Math.max(1, Math.round(naturalH * scale));

  const canvas = stepDownScaleToCanvas(img, targetW, targetH);
  const result = compressCanvasToDataUrl(canvas, {
    ...options,
    originalBytes,
  });

  // Never return a larger file than the already-sized input if no resizing was required
  if (scale === 1 && result.compressedBytes >= originalBytes && dataUrl.startsWith('data:image/')) {
    const fallbackMime = dataUrl.startsWith('data:image/png')
      ? 'image/png'
      : dataUrl.startsWith('data:image/webp')
      ? 'image/webp'
      : 'image/jpeg';
    return {
      dataUrl,
      mimeType: fallbackMime,
      fileName: replaceFileExtension(options.fileName, fallbackMime),
      width: naturalW,
      height: naturalH,
      originalBytes,
      compressedBytes: originalBytes,
      savingsPercent: 0,
      qualityUsed: 1,
      hasTransparency: result.hasTransparency,
    };
  }

  return result;
}

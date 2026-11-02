import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Crop,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Sliders,
  Maximize2,
  RefreshCw,
  Check,
  X,
  Eye,
  Sparkles,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  Layers,
  Wand2,
  Sun,
  Contrast,
  SlidersHorizontal,
  Palette,
  Compass,
  Aperture,
  Grid,
  Maximize,
  Minimize,
  Paintbrush,
  Image as ImageIcon,
  Scissors,
  Box,
  ArrowLeft,
} from 'lucide-react';

interface ImageEditorModalProps {
  isOpen: boolean;
  imageSrc: string;
  fileName?: string;
  productName?: string;
  initialImageFit?: 'cover' | 'contain';
  initialImageBackground?: string;
  onClose: () => void;
  onApply: (
    croppedDataUrl: string,
    fileName?: string,
    imageFit?: 'cover' | 'contain',
    imageBackground?: string
  ) => Promise<void> | void;
  isProcessing?: boolean;
}

export type AspectRatioMode = '1:1' | '4:5' | '16:9' | 'original' | 'free';
export type BackgroundPreset = 'transparent' | 'white' | 'linen' | 'beige' | 'spotlight' | 'dark' | 'custom';
export type ShadowStyle = 'soft' | 'ground' | 'crisp' | 'none';

interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Instagram Filter Presets Definition
export interface InstagramFilter {
  id: string;
  name: string;
  cssFilter: string;
  tint?: { r: number; g: number; b: number; alpha: number; blend: GlobalCompositeOperation };
  description: string;
}

export const INSTAGRAM_FILTERS: InstagramFilter[] = [
  {
    id: 'normal',
    name: 'Normal',
    cssFilter: 'none',
    description: 'Original colors without filter',
  },
  {
    id: 'clarendon',
    name: 'Clarendon',
    cssFilter: 'contrast(120%) brightness(105%) saturate(125%) hue-rotate(4deg)',
    tint: { r: 127, g: 187, b: 227, alpha: 0.1, blend: 'overlay' },
    description: 'Crisp contrast with cool cyan highlights',
  },
  {
    id: 'juno',
    name: 'Juno',
    cssFilter: 'contrast(118%) brightness(108%) saturate(135%) sepia(12%)',
    tint: { r: 255, g: 140, b: 0, alpha: 0.12, blend: 'soft-light' },
    description: 'Warm glowing tones and punchy vibrancy',
  },
  {
    id: 'lark',
    name: 'Lark',
    cssFilter: 'contrast(106%) brightness(114%) saturate(112%) hue-rotate(-4deg)',
    description: 'Clean bright whites and natural daylight',
  },
  {
    id: 'valencia',
    name: 'Valencia',
    cssFilter: 'contrast(108%) brightness(108%) sepia(24%) saturate(110%)',
    tint: { r: 255, g: 225, b: 80, alpha: 0.12, blend: 'soft-light' },
    description: 'Warm vintage antique paper finish',
  },
  {
    id: 'gingham',
    name: 'Gingham',
    cssFilter: 'contrast(92%) brightness(108%) sepia(10%) saturate(92%)',
    description: 'Soft washed vintage with subtle matte shadows',
  },
  {
    id: 'moon',
    name: 'Moon',
    cssFilter: 'grayscale(100%) contrast(140%) brightness(108%)',
    description: 'Dramatic high-contrast black & white',
  },
  {
    id: 'ludwig',
    name: 'Ludwig',
    cssFilter: 'contrast(122%) brightness(110%) saturate(98%)',
    tint: { r: 255, g: 200, b: 150, alpha: 0.08, blend: 'overlay' },
    description: 'Sharp architectural details and clean lines',
  },
  {
    id: 'slumber',
    name: 'Slumber',
    cssFilter: 'contrast(95%) brightness(105%) saturate(85%) sepia(30%)',
    description: 'Mellow golden-hour nostalgic feel',
  },
  {
    id: 'aden',
    name: 'Aden',
    cssFilter: 'contrast(90%) brightness(112%) saturate(92%) hue-rotate(12deg) sepia(10%)',
    description: 'Pastel palette with gentle softened contrast',
  },
  {
    id: 'perpetua',
    name: 'Perpetua',
    cssFilter: 'contrast(112%) brightness(108%) saturate(118%) hue-rotate(-8deg)',
    description: 'Fresh earthy greens and deep blues',
  },
];

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  isOpen,
  imageSrc,
  fileName = 'product_photo.jpg',
  productName = 'Product Preview',
  initialImageFit = 'cover',
  initialImageBackground = '',
  onClose,
  onApply,
  isProcessing = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Loaded source image
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [imgLoadError, setImgLoadError] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(true);

  // Active Studio Tab: 'crop' | 'filter' | 'adjust' | 'studio' | 'preview'
  const [studioTab, setStudioTab] = useState<'crop' | 'filter' | 'adjust' | 'studio' | 'preview'>('crop');

  // Selected Instagram Filter
  const [selectedFilterId, setSelectedFilterId] = useState<string>('normal');
  const [filterIntensity, setFilterIntensity] = useState<number>(100);

  // Crop & Framing options
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('1:1');
  const [zoom, setZoom] = useState<number>(1);
  const [fineAngle, setFineAngle] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [fitMode, setFitMode] = useState<'fit' | 'fill'>('fill');

  // Background Studio & Transparency options (With / Without Background)
  const [bgPreset, setBgPreset] = useState<BackgroundPreset>('transparent');
  const [customBgColor, setCustomBgColor] = useState<string>('#f8f7f5');
  const [studioPadding, setStudioPadding] = useState<number>(0); // 0% to 25% padding for cutouts
  const [shadowStyle, setShadowStyle] = useState<ShadowStyle>('soft');
  const [shadowIntensity, setShadowIntensity] = useState<number>(35); // 0% to 100%
  const [storeImageFit, setStoreImageFit] = useState<'cover' | 'contain'>(initialImageFit);

  // Magic Background Remover state
  const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);
  const [bgRemoveTolerance, setBgRemoveTolerance] = useState<number>(20);

  // Instagram Adjustments
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [warmth, setWarmth] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [vignette, setVignette] = useState<number>(0);
  const [sharpness, setSharpness] = useState<number>(0);

  // Crop box state in normalized coordinates [0..1]
  const [cropBox, setCropBox] = useState<CropBox>({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
  const [isDraggingCrop, setIsDraggingCrop] = useState<boolean>(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cropBoxStart, setCropBoxStart] = useState<CropBox>({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });

  // Filter thumbnails
  const [filterThumbnails, setFilterThumbnails] = useState<Record<string, string>>({});

  // Live preview data url for simulated Product Card
  const [livePreviewUrl, setLivePreviewUrl] = useState<string>('');

  // 3x3 Rule of Thirds alignment grid
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Load image on source change
  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    setIsLoadingImage(true);
    setImgLoadError(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setSourceImg(img);
      setIsLoadingImage(false);
      resetToDefaultCrop(img, '1:1');
      generateFilterThumbnails(img);
    };
    img.onerror = () => {
      setIsLoadingImage(false);
      setImgLoadError('Failed to load image for editing.');
    };
    img.src = imageSrc;

    setSelectedFilterId('normal');
    setFilterIntensity(100);
    setZoom(1);
    setFineAngle(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(0);
    setContrast(0);
    setWarmth(0);
    setSaturation(0);
    setVignette(0);
    setSharpness(0);
    setFitMode('fill');
    setBgPreset('transparent');
    setStudioPadding(0);
    setShadowStyle('soft');
    setShadowIntensity(35);
    setStoreImageFit(initialImageFit || 'cover');
    setStudioTab('crop');
  }, [isOpen, imageSrc, initialImageFit]);

  // Generate thumbnail icons for each filter preset
  const generateFilterThumbnails = (img: HTMLImageElement) => {
    try {
      const thumbs: Record<string, string> = {};
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = 80;
      thumbCanvas.height = 80;
      const ctx = thumbCanvas.getContext('2d');
      if (!ctx) return;

      INSTAGRAM_FILTERS.forEach((filter) => {
        ctx.clearRect(0, 0, 80, 80);
        ctx.save();
        if (filter.cssFilter !== 'none') {
          ctx.filter = filter.cssFilter;
        }

        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 80, 80);

        if (filter.tint) {
          ctx.globalCompositeOperation = filter.tint.blend;
          ctx.fillStyle = `rgba(${filter.tint.r}, ${filter.tint.g}, ${filter.tint.b}, ${filter.tint.alpha})`;
          ctx.fillRect(0, 0, 80, 80);
        }

        ctx.restore();
        thumbs[filter.id] = thumbCanvas.toDataURL('image/jpeg', 0.8);
      });

      setFilterThumbnails(thumbs);
    } catch {
      // Ignored fallback
    }
  };

  // Reset crop box based on aspect ratio
  const resetToDefaultCrop = (img: HTMLImageElement | null, ratioMode: AspectRatioMode) => {
    if (!img) return;

    let targetRatio = 1;
    if (ratioMode === '1:1') targetRatio = 1;
    else if (ratioMode === '4:5') targetRatio = 4 / 5;
    else if (ratioMode === '16:9') targetRatio = 16 / 9;
    else if (ratioMode === 'original') targetRatio = img.width / img.height;
    else targetRatio = 1;

    let w = 0.84;
    let h = 0.84;
    if (targetRatio > 1) {
      h = w / targetRatio;
    } else {
      w = h * targetRatio;
    }

    if (w > 0.94) {
      w = 0.94;
      h = w / targetRatio;
    }
    if (h > 0.94) {
      h = 0.94;
      w = h * targetRatio;
    }

    setCropBox({
      x: (1 - w) / 2,
      y: (1 - h) / 2,
      width: w,
      height: h,
    });
  };

  const handleRatioChange = (mode: AspectRatioMode) => {
    setAspectRatio(mode);
    resetToDefaultCrop(sourceImg, mode);
  };

  // Combined CSS filter string
  const getComputedFilterString = useCallback(() => {
    const activePreset = INSTAGRAM_FILTERS.find((f) => f.id === selectedFilterId);
    let base = activePreset && activePreset.cssFilter !== 'none' ? activePreset.cssFilter : '';

    const bVal = 100 + brightness;
    const cVal = 100 + contrast;
    const sVal = 100 + saturation;

    let adjustStr = `brightness(${bVal}%) contrast(${cVal}%) saturate(${sVal}%)`;
    if (sharpness > 0) {
      adjustStr += ` contrast(${100 + sharpness * 0.4}%)`;
    }

    return base ? `${base} ${adjustStr}` : adjustStr;
  }, [selectedFilterId, brightness, contrast, saturation, sharpness]);

  // Magic 1-Click Background Remover (Color Threshold Cutout)
  const handleMagicRemoveWhiteBg = () => {
    if (!sourceImg) return;
    setIsRemovingBg(true);

    try {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = sourceImg.width;
      offCanvas.height = sourceImg.height;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) {
        setIsRemovingBg(false);
        return;
      }

      offCtx.drawImage(sourceImg, 0, 0);
      const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
      const data = imgData.data;

      // Sample corner color as candidate background
      const cornerR = data[0];
      const cornerG = data[1];
      const cornerB = data[2];

      const tol = bgRemoveTolerance * 3;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Check if pixel is near-white or matches corner background color
        const isNearWhite = r > 240 - bgRemoveTolerance && g > 240 - bgRemoveTolerance && b > 240 - bgRemoveTolerance;
        const isCornerMatch =
          Math.abs(r - cornerR) < tol &&
          Math.abs(g - cornerG) < tol &&
          Math.abs(b - cornerB) < tol;

        if (isNearWhite || isCornerMatch) {
          data[i + 3] = 0; // Transparent
        }
      }

      offCtx.putImageData(imgData, 0, 0);

      const newImg = new Image();
      newImg.onload = () => {
        setSourceImg(newImg);
        setIsRemovingBg(false);
        setStoreImageFit('contain'); // Auto switch to contain for clean cutout!
        setStudioPadding(8);
      };
      newImg.src = offCanvas.toDataURL('image/png');
    } catch {
      setIsRemovingBg(false);
    }
  };

  // Render Background Fill on Canvas
  const drawStudioBackground = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    if (bgPreset === 'white') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    } else if (bgPreset === 'linen') {
      ctx.fillStyle = '#f8f7f5';
      ctx.fillRect(0, 0, w, h);
    } else if (bgPreset === 'beige') {
      ctx.fillStyle = '#f3ede6';
      ctx.fillRect(0, 0, w, h);
    } else if (bgPreset === 'dark') {
      ctx.fillStyle = '#1c1a18';
      ctx.fillRect(0, 0, w, h);
    } else if (bgPreset === 'spotlight') {
      const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h) * 0.7);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.65, '#f5efe9');
      grad.addColorStop(1, '#e8ded4');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else if (bgPreset === 'custom') {
      ctx.fillStyle = customBgColor;
      ctx.fillRect(0, 0, w, h);
    }
    // 'transparent' leaves canvas clear
  };

  // Redraw canvas whenever state changes
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sourceImg) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw background preset first
    drawStudioBackground(ctx, w, h);

    // Save context for image drawing
    ctx.save();

    // Center translation
    ctx.translate(w / 2, h / 2);
    const totalAngle = ((rotation + fineAngle) * Math.PI) / 180;
    ctx.rotate(totalAngle);
    ctx.scale((flipH ? -1 : 1) * zoom, (flipV ? -1 : 1) * zoom);

    // Compute fitted image dimensions inside canvas considering studioPadding
    const padFactor = 1 - (studioPadding / 100) * 0.7;
    const availW = w * padFactor;
    const availH = h * padFactor;

    const imgAspect = sourceImg.width / sourceImg.height;
    const canvasAspect = availW / availH;
    let drawW = availW;
    let drawH = availH;

    if (fitMode === 'fit') {
      if (imgAspect > canvasAspect) {
        drawW = availW;
        drawH = availW / imgAspect;
      } else {
        drawH = availH;
        drawW = availH * imgAspect;
      }
    } else {
      if (imgAspect > canvasAspect) {
        drawH = availH;
        drawW = availH * imgAspect;
      } else {
        drawW = availW;
        drawH = availW / imgAspect;
      }
    }

    // Apply combined filters
    ctx.filter = getComputedFilterString();

    // 3D Product Drop Shadow for transparent cutouts
    if (shadowStyle !== 'none' && shadowIntensity > 0) {
      const alpha = (shadowIntensity / 100) * 0.45;
      if (shadowStyle === 'soft') {
        ctx.shadowColor = `rgba(0, 0, 0, ${alpha})`;
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 14;
        ctx.shadowOffsetX = 0;
      } else if (shadowStyle === 'ground') {
        ctx.shadowColor = `rgba(0, 0, 0, ${alpha * 1.3})`;
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 18;
        ctx.shadowOffsetX = 0;
      } else if (shadowStyle === 'crisp') {
        ctx.shadowColor = `rgba(0, 0, 0, ${alpha * 1.1})`;
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 8;
        ctx.shadowOffsetX = 4;
      }
    }

    ctx.drawImage(sourceImg, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.shadowColor = 'transparent'; // Reset shadow

    // Warmth / Temperature Tint layer
    if (warmth !== 0) {
      ctx.globalCompositeOperation = 'soft-light';
      ctx.fillStyle =
        warmth > 0
          ? `rgba(255, 140, 20, ${Math.abs(warmth) / 300})`
          : `rgba(0, 160, 255, ${Math.abs(warmth) / 300})`;
      ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
    }

    // Filter Preset Tint overlay
    const activePreset = INSTAGRAM_FILTERS.find((f) => f.id === selectedFilterId);
    if (activePreset?.tint && filterIntensity > 0) {
      ctx.globalCompositeOperation = activePreset.tint.blend;
      const alpha = activePreset.tint.alpha * (filterIntensity / 100);
      ctx.fillStyle = `rgba(${activePreset.tint.r}, ${activePreset.tint.g}, ${activePreset.tint.b}, ${alpha})`;
      ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
    }

    // Vignette Effect
    if (vignette > 0) {
      ctx.globalCompositeOperation = 'multiply';
      const radius = Math.max(drawW, drawH) * 0.75;
      const grad = ctx.createRadialGradient(0, 0, radius * 0.3, 0, 0, radius);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(1, `rgba(0, 0, 0, ${(vignette / 100) * 0.85})`);
      ctx.fillStyle = grad;
      ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
    }

    ctx.restore();

    // Dark Overlay outside of crop box
    const cbX = cropBox.x * w;
    const cbY = cropBox.y * h;
    const cbW = cropBox.width * w;
    const cbH = cropBox.height * h;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, w, cbY);
    ctx.fillRect(0, cbY + cbH, w, h - (cbY + cbH));
    ctx.fillRect(0, cbY, cbX, cbH);
    ctx.fillRect(cbX + cbW, cbY, w - (cbX + cbW), cbH);

    // Instagram white hairline border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cbX, cbY, cbW, cbH);

    // Rule of thirds grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cbX + cbW / 3, cbY);
    ctx.lineTo(cbX + cbW / 3, cbY + cbH);
    ctx.moveTo(cbX + (cbW * 2) / 3, cbY);
    ctx.lineTo(cbX + (cbW * 2) / 3, cbY + cbH);
    ctx.moveTo(cbX, cbY + cbH / 3);
    ctx.lineTo(cbX + cbW, cbY + cbH / 3);
    ctx.moveTo(cbX, cbY + (cbH * 2) / 3);
    ctx.lineTo(cbX + cbW, cbY + (cbH * 2) / 3);
    ctx.stroke();

    // Corner brackets
    const bracketLen = 16;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(cbX, cbY + bracketLen);
    ctx.lineTo(cbX, cbY);
    ctx.lineTo(cbX + bracketLen, cbY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cbX + cbW - bracketLen, cbY);
    ctx.lineTo(cbX + cbW, cbY);
    ctx.lineTo(cbX + cbW, cbY + bracketLen);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cbX, cbY + cbH - bracketLen);
    ctx.lineTo(cbX, cbY + cbH);
    ctx.lineTo(cbX + bracketLen, cbY + cbH);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cbX + cbW - bracketLen, cbY + cbH);
    ctx.lineTo(cbX + cbW, cbY + cbH);
    ctx.lineTo(cbX + cbW, cbY + cbH - bracketLen);
    ctx.stroke();

    updateLivePreview(canvas, cbX, cbY, cbW, cbH);
  }, [
    sourceImg,
    rotation,
    fineAngle,
    flipH,
    flipV,
    zoom,
    fitMode,
    bgPreset,
    customBgColor,
    studioPadding,
    shadowStyle,
    shadowIntensity,
    getComputedFilterString,
    selectedFilterId,
    filterIntensity,
    warmth,
    vignette,
    cropBox,
  ]);

  // Generate cropped preview snippet
  const updateLivePreview = (
    srcCanvas: HTMLCanvasElement,
    cbX: number,
    cbY: number,
    cbW: number,
    cbH: number
  ) => {
    if (cbW <= 0 || cbH <= 0) return;
    try {
      const offscreen = document.createElement('canvas');
      offscreen.width = 400;
      offscreen.height = Math.max(100, Math.round((400 * cbH) / cbW));
      const offCtx = offscreen.getContext('2d');
      if (offCtx && sourceImg) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = srcCanvas.width;
        tempCanvas.height = srcCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          drawStudioBackground(tempCtx, tempCanvas.width, tempCanvas.height);
          tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
          const totalAngle = ((rotation + fineAngle) * Math.PI) / 180;
          tempCtx.rotate(totalAngle);
          tempCtx.scale((flipH ? -1 : 1) * zoom, (flipV ? -1 : 1) * zoom);
          tempCtx.filter = getComputedFilterString();

          const padFactor = 1 - (studioPadding / 100) * 0.7;
          const availW = tempCanvas.width * padFactor;
          const availH = tempCanvas.height * padFactor;

          const imgAspect = sourceImg.width / sourceImg.height;
          const canvasAspect = availW / availH;
          let drawW = availW;
          let drawH = availH;
          if (fitMode === 'fit') {
            if (imgAspect > canvasAspect) {
              drawW = availW;
              drawH = availW / imgAspect;
            } else {
              drawH = availH;
              drawW = availH * imgAspect;
            }
          } else {
            if (imgAspect > canvasAspect) {
              drawH = availH;
              drawW = availH * imgAspect;
            } else {
              drawW = availW;
              drawH = availW / imgAspect;
            }
          }

          if (shadowStyle !== 'none' && shadowIntensity > 0) {
            const alpha = (shadowIntensity / 100) * 0.45;
            tempCtx.shadowColor = `rgba(0, 0, 0, ${alpha})`;
            tempCtx.shadowBlur = 20;
            tempCtx.shadowOffsetY = 12;
          }

          tempCtx.drawImage(sourceImg, -drawW / 2, -drawH / 2, drawW, drawH);
          tempCtx.shadowColor = 'transparent';

          if (warmth !== 0) {
            tempCtx.globalCompositeOperation = 'soft-light';
            tempCtx.fillStyle =
              warmth > 0
                ? `rgba(255, 140, 20, ${Math.abs(warmth) / 300})`
                : `rgba(0, 160, 255, ${Math.abs(warmth) / 300})`;
            tempCtx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
          }

          if (vignette > 0) {
            tempCtx.globalCompositeOperation = 'multiply';
            const radius = Math.max(drawW, drawH) * 0.75;
            const grad = tempCtx.createRadialGradient(0, 0, radius * 0.3, 0, 0, radius);
            grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
            grad.addColorStop(1, `rgba(0, 0, 0, ${(vignette / 100) * 0.85})`);
            tempCtx.fillStyle = grad;
            tempCtx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
          }

          offCtx.drawImage(tempCanvas, cbX, cbY, cbW, cbH, 0, 0, offscreen.width, offscreen.height);
          setLivePreviewUrl(offscreen.toDataURL(bgPreset === 'transparent' ? 'image/png' : 'image/jpeg', 0.9));
        }
      }
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Handle canvas sizing
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height > 200 ? rect.height : 460);
      canvas.width = Math.max(300, Math.floor(size));
      canvas.height = Math.max(300, Math.floor(size));
      redrawCanvas();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [redrawCanvas]);

  // Pointer drag interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const cb = cropBox;
    const tolerance = 0.12;

    if (Math.abs(px - cb.x) < tolerance && Math.abs(py - cb.y) < tolerance) {
      setDragHandle('nw');
    } else if (Math.abs(px - (cb.x + cb.width)) < tolerance && Math.abs(py - cb.y) < tolerance) {
      setDragHandle('ne');
    } else if (Math.abs(px - cb.x) < tolerance && Math.abs(py - (cb.y + cb.height)) < tolerance) {
      setDragHandle('sw');
    } else if (
      Math.abs(px - (cb.x + cb.width)) < tolerance &&
      Math.abs(py - (cb.y + cb.height)) < tolerance
    ) {
      setDragHandle('se');
    } else if (px >= cb.x && px <= cb.x + cb.width && py >= cb.y && py <= cb.y + cb.height) {
      setDragHandle('move');
    } else {
      setDragHandle(null);
      return;
    }

    setIsDraggingCrop(true);
    setDragStart({ x: px, y: py });
    setCropBoxStart({ ...cb });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingCrop || !dragHandle) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const dx = px - dragStart.x;
    const dy = py - dragStart.y;
    const start = cropBoxStart;

    let newBox = { ...start };

    if (dragHandle === 'move') {
      newBox.x = Math.max(0, Math.min(1 - start.width, start.x + dx));
      newBox.y = Math.max(0, Math.min(1 - start.height, start.y + dy));
    } else if (dragHandle === 'se') {
      let nw = Math.max(0.15, Math.min(1 - start.x, start.width + dx));
      let nh = Math.max(0.15, Math.min(1 - start.y, start.height + dy));
      if (aspectRatio === '1:1') {
        const side = Math.min(nw, nh);
        nw = side;
        nh = side;
      } else if (aspectRatio === '4:5') {
        nw = nh * (4 / 5);
      }
      newBox.width = nw;
      newBox.height = nh;
    } else if (dragHandle === 'nw') {
      let nx = Math.max(0, Math.min(start.x + start.width - 0.15, start.x + dx));
      let ny = Math.max(0, Math.min(start.y + start.height - 0.15, start.y + dy));
      let nw = start.width - (nx - start.x);
      let nh = start.height - (ny - start.y);
      if (aspectRatio === '1:1') {
        const side = Math.min(nw, nh);
        nw = side;
        nh = side;
        nx = start.x + (start.width - nw);
        ny = start.y + (start.height - nh);
      }
      newBox.x = nx;
      newBox.y = ny;
      newBox.width = nw;
      newBox.height = nh;
    } else if (dragHandle === 'ne') {
      let nw = Math.max(0.15, Math.min(1 - start.x, start.width + dx));
      let ny = Math.max(0, Math.min(1 - start.y, start.height + dy));
      let nh = start.height - (ny - start.y);
      if (aspectRatio === '1:1') {
        const side = Math.min(nw, nh);
        nw = side;
        nh = side;
        ny = start.y + (start.height - nh);
      }
      newBox.width = nw;
      newBox.height = nh;
    } else if (dragHandle === 'sw') {
      let nx = Math.max(0, Math.min(start.x + start.width - 0.15, start.x + dx));
      let nw = start.width - (nx - start.x);
      let nh = Math.max(0.15, Math.min(1 - start.y, start.height + dy));
      if (aspectRatio === '1:1') {
        const side = Math.min(nw, nh);
        nw = side;
        nh = side;
        nx = start.x + (start.width - nw);
      }
      newBox.x = nx;
      newBox.width = nw;
      newBox.height = nh;
    }

    setCropBox(newBox);
  };

  const handlePointerUp = () => {
    setIsDraggingCrop(false);
    setDragHandle(null);
  };

  // Reset all adjustments
  const handleResetAll = () => {
    setSelectedFilterId('normal');
    setFilterIntensity(100);
    setZoom(1);
    setFineAngle(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(0);
    setContrast(0);
    setWarmth(0);
    setSaturation(0);
    setVignette(0);
    setSharpness(0);
    setFitMode('fill');
    setBgPreset('transparent');
    setStudioPadding(0);
    setShadowStyle('soft');
    setShadowIntensity(35);
    resetToDefaultCrop(sourceImg, aspectRatio);
  };

  // Final Master Export
  const handleApplyExport = async () => {
    if (!sourceImg || !canvasRef.current) return;

    const exportDim = 1200;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportDim;
    exportCanvas.height =
      aspectRatio === '1:1' ? exportDim : Math.round((exportDim * cropBox.height) / cropBox.width);

    const exportCtx = exportCanvas.getContext('2d');
    if (!exportCtx) return;

    const displayCanvas = canvasRef.current;
    const offscreen = document.createElement('canvas');
    offscreen.width = displayCanvas.width;
    offscreen.height = displayCanvas.height;
    const offCtx = offscreen.getContext('2d');

    if (!offCtx) return;

    drawStudioBackground(offCtx, offscreen.width, offscreen.height);

    offCtx.translate(offscreen.width / 2, offscreen.height / 2);
    const totalAngle = ((rotation + fineAngle) * Math.PI) / 180;
    offCtx.rotate(totalAngle);
    offCtx.scale((flipH ? -1 : 1) * zoom, (flipV ? -1 : 1) * zoom);
    offCtx.filter = getComputedFilterString();

    const padFactor = 1 - (studioPadding / 100) * 0.7;
    const availW = offscreen.width * padFactor;
    const availH = offscreen.height * padFactor;

    const imgAspect = sourceImg.width / sourceImg.height;
    const canvasAspect = availW / availH;
    let drawW = availW;
    let drawH = availH;
    if (fitMode === 'fit') {
      if (imgAspect > canvasAspect) {
        drawW = availW;
        drawH = availW / imgAspect;
      } else {
        drawH = availH;
        drawW = availH * imgAspect;
      }
    } else {
      if (imgAspect > canvasAspect) {
        drawH = availH;
        drawW = availH * imgAspect;
      } else {
        drawW = availW;
        drawH = availW / imgAspect;
      }
    }

    if (shadowStyle !== 'none' && shadowIntensity > 0) {
      const alpha = (shadowIntensity / 100) * 0.45;
      offCtx.shadowColor = `rgba(0, 0, 0, ${alpha})`;
      offCtx.shadowBlur = 24;
      offCtx.shadowOffsetY = 14;
    }

    offCtx.drawImage(sourceImg, -drawW / 2, -drawH / 2, drawW, drawH);
    offCtx.shadowColor = 'transparent';

    if (warmth !== 0) {
      offCtx.globalCompositeOperation = 'soft-light';
      offCtx.fillStyle =
        warmth > 0
          ? `rgba(255, 140, 20, ${Math.abs(warmth) / 300})`
          : `rgba(0, 160, 255, ${Math.abs(warmth) / 300})`;
      offCtx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
    }

    const activePreset = INSTAGRAM_FILTERS.find((f) => f.id === selectedFilterId);
    if (activePreset?.tint && filterIntensity > 0) {
      offCtx.globalCompositeOperation = activePreset.tint.blend;
      const alpha = activePreset.tint.alpha * (filterIntensity / 100);
      offCtx.fillStyle = `rgba(${activePreset.tint.r}, ${activePreset.tint.g}, ${activePreset.tint.b}, ${alpha})`;
      offCtx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
    }

    if (vignette > 0) {
      offCtx.globalCompositeOperation = 'multiply';
      const radius = Math.max(drawW, drawH) * 0.75;
      const grad = offCtx.createRadialGradient(0, 0, radius * 0.3, 0, 0, radius);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(1, `rgba(0, 0, 0, ${(vignette / 100) * 0.85})`);
      offCtx.fillStyle = grad;
      offCtx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
    }

    const sx = cropBox.x * offscreen.width;
    const sy = cropBox.y * offscreen.height;
    const sWidth = cropBox.width * offscreen.width;
    const sHeight = cropBox.height * offscreen.height;

    exportCtx.imageSmoothingEnabled = true;
    exportCtx.imageSmoothingQuality = 'high';
    exportCtx.drawImage(offscreen, sx, sy, sWidth, sHeight, 0, 0, exportCanvas.width, exportCanvas.height);

    const isPng = bgPreset === 'transparent';
    const finalDataUrl = exportCanvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.92);

    await onApply(
      finalDataUrl,
      fileName,
      storeImageFit,
      bgPreset === 'custom' ? customBgColor : bgPreset !== 'transparent' ? bgPreset : undefined
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-[#FAF8F5] text-zinc-900 flex flex-col overflow-hidden select-none animate-in fade-in duration-150 font-sans">
      {/* ================= TOP APP BAR (STITCH DESIGN) ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-3 xs:px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
        {/* Left: Back Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="w-8 h-8 xs:w-9 xs:h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200 transition active:scale-95 shrink-0 cursor-pointer"
          title="Return to Product Form"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Center: Brand Title + Status */}
        <div className="flex flex-col items-center min-w-0 mx-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--red)] animate-pulse shrink-0" />
            <h1 className="text-xs xs:text-sm font-bold tracking-wider font-mono uppercase text-zinc-900 flex items-center gap-1 truncate">
              OMEGA <span className="text-[var(--red)] font-extrabold text-[10px] xs:text-[11px] px-1.5 py-0.5 rounded bg-[var(--red)]/10 border border-[var(--red)]/20">STUDIO PRO</span>
            </h1>
          </div>
          <p className="text-[9px] xs:text-[10px] text-zinc-500 font-mono tracking-tight mt-0.5 truncate max-w-[140px] xs:max-w-xs sm:max-w-md">
            {fileName} {sourceImg ? `• ${sourceImg.width}×${sourceImg.height}px` : ''}
          </p>
        </div>

        {/* Right: Quick Reset & Apply Button */}
        <div className="flex items-center gap-1.5 xs:gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetAll}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 px-2.5 py-1.5 transition active:scale-95 flex items-center gap-1 cursor-pointer font-mono"
            title="Reset All Edits"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={handleApplyExport}
            disabled={isProcessing || !sourceImg}
            className="bg-[var(--red)] hover:bg-[var(--red-hover)] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer font-mono"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden xs:inline">Saving...</span>
              </>
            ) : (
              <>
                <span>Apply</span>
                <Check className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </header>

      {/* ================= RATIO & FRAMING HUD BAR (STITCH) ================= */}
      <div className="bg-zinc-50 border-b border-zinc-200 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mr-1 hidden xs:inline font-mono">Ratio</span>
          {[
            { id: '1:1', label: '1:1 Sq' },
            { id: '4:5', label: '4:5 Insta' },
            { id: '16:9', label: '16:9 Wide' },
            { id: 'original', label: 'Orig' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => handleRatioChange(r.id as AspectRatioMode)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer font-mono ${
                aspectRatio === r.id
                  ? 'bg-zinc-900 text-white font-bold shadow-xs'
                  : 'bg-white text-zinc-700 hover:text-zinc-900 border border-zinc-200 shadow-2xs'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowGrid((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border transition-all cursor-pointer font-mono ${
              showGrid
                ? 'bg-[var(--red)]/10 border-[var(--red)] text-[var(--red)]'
                : 'bg-white border-zinc-200 text-zinc-700 hover:text-zinc-900 shadow-2xs'
            }`}
            title="Toggle 3x3 Rule of Thirds Grid"
          >
            <Grid className="w-3 h-3 text-[var(--red)]" />
            <span className="hidden sm:inline">3x3 Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setFitMode((prev) => (prev === 'fill' ? 'fit' : 'fill'))}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-900 shadow-2xs transition-all cursor-pointer font-mono"
            title={fitMode === 'fill' ? 'Switch to Fit Entire Object' : 'Switch to Fill Edge'}
          >
            {fitMode === 'fill' ? (
              <>
                <Minimize className="w-3 h-3 text-[var(--red)]" />
                <span className="hidden sm:inline">Fit</span>
              </>
            ) : (
              <>
                <Maximize className="w-3 h-3 text-[var(--red)]" />
                <span className="hidden sm:inline">Fill</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ================= MAIN STUDIO VIEWPORT & CONTROLS ================= */}
      {/* On mobile: Upper half fixed preview, Lower half scrollable controls; On desktop: 2-column grid */}
      <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-12 overflow-hidden bg-zinc-100/60">
        {/* UPPER (Mobile) / LEFT (Desktop): Viewport */}
        <div className="h-[36vh] xs:h-[40vh] sm:h-[44vh] lg:h-auto lg:col-span-7 xl:col-span-8 p-2 xs:p-3 sm:p-5 lg:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-zinc-200 relative bg-zinc-100/70 shrink-0 min-h-0 overflow-hidden">
          <div
            ref={containerRef}
            className={`relative w-full h-full max-h-[32vh] xs:max-h-[36vh] sm:max-h-[40vh] lg:max-h-[min(72vh,680px)] aspect-square rounded-2xl overflow-hidden shadow-sm flex items-center justify-center select-none border border-zinc-200/80 bg-white ${
              bgPreset === 'transparent'
                ? 'bg-[linear-gradient(45deg,#e4e4e7_25%,transparent_25%),linear-gradient(-45deg,#e4e4e7_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e4e4e7_75%),linear-gradient(-45deg,transparent_75%,#e4e4e7_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0px] bg-white'
                : 'bg-white'
            }`}
          >
            {isLoadingImage ? (
              <div className="flex flex-col items-center gap-2 text-zinc-500">
                <RefreshCw className="w-8 h-8 text-[var(--red)] animate-spin" />
                <span className="text-xs font-bold font-mono">Loading Photo...</span>
              </div>
            ) : imgLoadError ? (
              <div className="p-4 text-center text-red-600 text-xs font-bold font-mono">
                {imgLoadError}
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="w-full h-full object-contain cursor-grab active:cursor-grabbing touch-none"
              />
            )}

            {/* 3x3 Rule of Thirds Guide Grid Overlay */}
            {showGrid && !isLoadingImage && !imgLoadError && (
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-5">
                <div className="border-r border-b border-black/15" />
                <div className="border-r border-b border-black/15" />
                <div className="border-b border-black/15" />
                <div className="border-r border-b border-black/15" />
                <div className="border-r border-b border-black/15" />
                <div className="border-b border-black/15" />
                <div className="border-r border-b border-black/15" />
                <div className="border-r border-b border-black/15" />
                <div />
              </div>
            )}

            {/* Corner Framing L-accents */}
            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[var(--red)] pointer-events-none z-10" />
            <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[var(--red)] pointer-events-none z-10" />
            <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[var(--red)] pointer-events-none z-10" />
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[var(--red)] pointer-events-none z-10" />

            {/* Floating Live Zoom Pill */}
            <div className="absolute top-2.5 left-2.5 z-10 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-zinc-200 text-[10px] font-mono font-bold text-zinc-900 shadow-xs pointer-events-none">
              {Math.round(zoom * 100)}%
            </div>

            {/* Floating Quick Transform Bar (Stitch) */}
            <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-zinc-200 shadow-sm">
              <button
                type="button"
                onClick={() => setFlipH((prev) => !prev)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  flipH ? 'bg-[var(--red)] text-white' : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
                title="Flip Horizontally"
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFlipV((prev) => !prev)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  flipV ? 'bg-[var(--red)] text-white' : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
                title="Flip Vertically"
              >
                <FlipVertical className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="w-7 h-7 rounded-lg text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 flex items-center justify-center transition-all cursor-pointer"
                title="Rotate 90° Clockwise"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-[10px] sm:text-[11px] text-zinc-500 font-medium mt-1.5 hidden xs:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)]" />
            <span>Pinch / wheel to zoom · Drag center to reposition · Drag corners to crop</span>
          </p>
        </div>

        {/* LOWER (Mobile) / RIGHT (Desktop): Tabs & Controls */}
        <div className="flex-1 min-h-0 flex flex-col lg:col-span-5 xl:col-span-4 bg-white overflow-hidden border-l border-zinc-200">
          {/* Segmented Studio Navigation Tabs Header (Stitch) */}
          <div className="p-2 border-b border-zinc-200 bg-zinc-50 shrink-0">
            <div className="grid grid-cols-5 p-1 bg-zinc-100 rounded-xl border border-zinc-200/80 gap-1">
              <button
                type="button"
                onClick={() => setStudioTab('crop')}
                className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                  studioTab === 'crop'
                    ? 'bg-[var(--red)] text-white font-bold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                <Crop className="w-3.5 h-3.5" />
                <span className="text-[9px] xs:text-[10px] font-semibold">Crop</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioTab('studio')}
                className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                  studioTab === 'studio'
                    ? 'bg-[var(--red)] text-white font-bold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                <Paintbrush className="w-3.5 h-3.5" />
                <span className="text-[9px] xs:text-[10px] font-semibold">Studio BG</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioTab('filter')}
                className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                  studioTab === 'filter'
                    ? 'bg-[var(--red)] text-white font-bold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span className="text-[9px] xs:text-[10px] font-semibold">Filters</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioTab('adjust')}
                className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                  studioTab === 'adjust'
                    ? 'bg-[var(--red)] text-white font-bold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="text-[9px] xs:text-[10px] font-semibold">Adjust</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioTab('preview')}
                className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                  studioTab === 'preview'
                    ? 'bg-[var(--red)] text-white font-bold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="text-[9px] xs:text-[10px] font-semibold">Card View</span>
              </button>
            </div>
          </div>

          {/* TAB CONTENTS */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 pb-6 overscroll-contain">
              {/* ================= TAB 1: CROP & FRAMING ================= */}
              {studioTab === 'crop' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">
                      Aspect Ratio Preset
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: '1:1', label: '1:1 Square', note: 'OMEGA Best' },
                        { id: '4:5', label: '4:5 Portrait', note: 'Instagram Feed' },
                        { id: '16:9', label: '16:9 Wide', note: 'Hero / Banner' },
                        { id: 'original', label: 'Original', note: 'As Uploaded' },
                        { id: 'free', label: 'Freeform', note: 'Custom Box' },
                      ].map((ratio) => (
                        <button
                          key={ratio.id}
                          type="button"
                          onClick={() => handleRatioChange(ratio.id as AspectRatioMode)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            aspectRatio === ratio.id
                              ? 'border-[var(--red)] bg-[var(--red)]/5 text-[var(--red)] shadow-xs ring-1 ring-[var(--red)]/20'
                              : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                          }`}
                        >
                          <div className="font-bold text-xs">{ratio.label}</div>
                          <div className="text-[10px] text-zinc-500">{ratio.note}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Straighten Angle with -1° and +1° micro adjust */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-[var(--red)]" />
                        <span>Straighten Leveler</span>
                      </span>
                      <span className="font-mono font-bold text-[var(--red)]">{fineAngle > 0 ? `+${fineAngle}` : fineAngle}°</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFineAngle((prev) => Math.max(-45, +(prev - 1).toFixed(1)))}
                        className="w-7 h-7 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 text-xs font-bold shrink-0 transition cursor-pointer"
                      >
                        -1°
                      </button>
                      <input
                        type="range"
                        min="-45"
                        max="45"
                        step="0.5"
                        value={fineAngle}
                        onChange={(e) => setFineAngle(parseFloat(e.target.value))}
                        className="flex-1 accent-[var(--red)] h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => setFineAngle((prev) => Math.min(45, +(prev + 1).toFixed(1)))}
                        className="w-7 h-7 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 text-xs font-bold shrink-0 transition cursor-pointer"
                      >
                        +1°
                      </button>
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                      <span>-45°</span>
                      <button
                        type="button"
                        onClick={() => setFineAngle(0)}
                        className="hover:text-zinc-900 cursor-pointer"
                      >
                        0° Center
                      </button>
                      <span>+45°</span>
                    </div>
                  </div>

                  {/* Zoom Slider */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                        <ZoomIn className="w-3.5 h-3.5 text-[var(--red)]" />
                        <span>Scale &amp; Zoom</span>
                      </span>
                      <span className="font-mono font-bold text-[var(--red)]">
                        {Math.round(zoom * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-[var(--red)] h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Rotation & Flip */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFlipH((prev) => !prev)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        flipH
                          ? 'bg-[var(--red)]/10 border-[var(--red)] text-[var(--red)]'
                          : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300'
                      }`}
                    >
                      <FlipHorizontal className="w-4 h-4" />
                      <span>Flip Horizontal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFlipV((prev) => !prev)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        flipV
                          ? 'bg-[var(--red)]/10 border-[var(--red)] text-[var(--red)]'
                          : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300'
                      }`}
                    >
                      <FlipVertical className="w-4 h-4" />
                      <span>Flip Vertical</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ================= TAB 2: STUDIO BACKGROUND & SHADOW SETUP ================= */}
              {studioTab === 'studio' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Background Presets: With / Without Background */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">
                        Background Canvas Style
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {bgPreset === 'transparent' ? 'Without BG (PNG)' : 'With Studio BG'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'transparent', label: 'Transparent', note: 'No Background' },
                        { id: 'white', label: 'Clean White', note: '#ffffff Studio' },
                        { id: 'linen', label: 'OMEGA Linen', note: '#f8f7f5 Canvas' },
                        { id: 'spotlight', label: 'Spotlight', note: 'Radial Gradient' },
                        { id: 'beige', label: 'Warm Beige', note: '#f3ede6 Classic' },
                        { id: 'dark', label: 'Dark Studio', note: '#1c1a18 Luxury' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setBgPreset(item.id as BackgroundPreset)}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            bgPreset === item.id
                              ? 'border-[var(--red)] bg-[var(--red)]/5 text-[var(--red)] shadow-xs ring-1 ring-[var(--red)]/20'
                              : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                          }`}
                        >
                          <div className="font-bold text-xs">{item.label}</div>
                          <div className="text-[10px] text-zinc-500">{item.note}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3D Realistic Product Drop Shadow */}
                  <div className="space-y-2 p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[var(--red)]" />
                        <span>3D Product Drop Shadow</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase font-mono">
                        {shadowStyle}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Gives isolated products and transparent cutouts physical depth as if sitting on a table.
                    </p>

                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      {[
                        { id: 'soft', label: 'Soft 3D' },
                        { id: 'ground', label: 'Ground' },
                        { id: 'crisp', label: 'Crisp' },
                        { id: 'none', label: 'None' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setShadowStyle(s.id as ShadowStyle)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono ${
                            shadowStyle === s.id
                              ? 'bg-[var(--red)] text-white shadow-xs'
                              : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200 shadow-2xs'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>

                    {shadowStyle !== 'none' && (
                      <div className="pt-2 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-600">Shadow Depth &amp; Strength</span>
                          <span className="font-mono text-zinc-900 font-bold">{shadowIntensity}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={shadowIntensity}
                          onChange={(e) => setShadowIntensity(parseInt(e.target.value))}
                          className="w-full accent-[var(--red)] h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Studio Sizing & Breathing Margin (Fit any image size) */}
                  <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5 text-[var(--red)]" />
                        <span>Studio Framing Margin</span>
                      </span>
                      <span className="font-mono text-[var(--red)] font-bold">
                        {studioPadding}% padding
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Ensures tall notebooks, wide paper reams or pens fit 100% inside card without border clipping.
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={studioPadding}
                      onChange={(e) => setStudioPadding(parseInt(e.target.value))}
                      className="w-full accent-[var(--red)] h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* 1-Click Magic White BG Remover */}
                  <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                        <Scissors className="w-4 h-4 text-purple-600" />
                        <span>1-Click Magic Cutout</span>
                      </span>
                      <span className="text-[10px] text-purple-700 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-full font-mono font-bold">
                        Auto Cutout
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-800">
                      Turns solid white or plain background photos into a clean transparent PNG cutout instantly!
                    </p>

                    <button
                      type="button"
                      onClick={handleMagicRemoveWhiteBg}
                      disabled={isRemovingBg}
                      className="w-full py-2 px-3 bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer font-mono"
                    >
                      {isRemovingBg ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Extracting Product Cutout...</span>
                        </>
                      ) : (
                        <>
                          <Scissors className="w-3.5 h-3.5 text-white" />
                          <span>Remove White Background Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ================= TAB 3: INSTAGRAM FILTERS ================= */}
              {studioTab === 'filter' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">
                      Instagram Color Grades
                    </span>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      1-Tap color filters optimized for stationery &amp; book paper.
                    </p>
                  </div>

                  {selectedFilterId !== 'normal' && (
                    <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-800">Filter Intensity</span>
                        <span className="font-mono text-[var(--red)] font-bold">
                          {filterIntensity}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterIntensity}
                        onChange={(e) => setFilterIntensity(parseInt(e.target.value))}
                        className="w-full accent-[var(--red)] h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {INSTAGRAM_FILTERS.map((filter) => {
                      const isSelected = selectedFilterId === filter.id;
                      const thumb = filterThumbnails[filter.id];
                      return (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => setSelectedFilterId(filter.id)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[var(--red)] bg-[var(--red)]/5 shadow-xs scale-[1.02] ring-1 ring-[var(--red)]/20'
                              : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
                          }`}
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={filter.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400 font-mono">
                                {filter.name[0]}
                              </div>
                            )}
                          </div>
                          <span
                            className={`text-[11px] font-bold truncate max-w-full font-mono ${
                              isSelected ? 'text-[var(--red)]' : 'text-zinc-700'
                            }`}
                          >
                            {filter.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= TAB 4: ADJUSTMENTS ================= */}
              {studioTab === 'adjust' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">
                    Lighting &amp; Color Sliders
                  </span>

                  {/* Brightness */}
                  <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-[var(--red)]" /> Brightness
                      </span>
                      <span className="font-mono text-zinc-900 font-bold">
                        {brightness > 0 ? `+${brightness}` : brightness}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full accent-[var(--red)] h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                        <Contrast className="w-3.5 h-3.5 text-[var(--red)]" /> Contrast
                      </span>
                      <span className="font-mono text-zinc-900 font-bold">
                        {contrast > 0 ? `+${contrast}` : contrast}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="w-full accent-[var(--red)] h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Warmth */}
                  <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-[var(--red)]" /> Warmth / Tone
                      </span>
                      <span className="font-mono text-zinc-900 font-bold">
                        {warmth > 0 ? `+${warmth}` : warmth}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={warmth}
                      onChange={(e) => setWarmth(parseInt(e.target.value))}
                      className="w-full accent-[var(--red)] h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--red)]" /> Saturation
                      </span>
                      <span className="font-mono text-zinc-900 font-bold">
                        {saturation > 0 ? `+${saturation}` : saturation}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={saturation}
                      onChange={(e) => setSaturation(parseInt(e.target.value))}
                      className="w-full accent-[var(--red)] h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Vignette */}
                  <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                        <Aperture className="w-3.5 h-3.5 text-[var(--red)]" /> Vignette Spotlight
                      </span>
                      <span className="font-mono text-zinc-900 font-bold">{vignette}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={vignette}
                      onChange={(e) => setVignette(parseInt(e.target.value))}
                      className="w-full accent-[var(--red)] h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* ================= TAB 5: LIVE CARD PREVIEW WITH FIT TOGGLE ================= */}
              {studioTab === 'preview' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">
                      Live Store Card Preview
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-mono">
                      Perfect Display
                    </span>
                  </div>

                  {/* Website Card Display Mode Toggle */}
                  <div className="bg-zinc-50 p-2.5 rounded-2xl border border-zinc-200 space-y-1.5">
                    <span className="text-[11px] font-bold text-zinc-800 block">
                      Card Display Style on Website:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setStoreImageFit('cover')}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer font-mono ${
                          storeImageFit === 'cover'
                            ? 'bg-[var(--red)] text-white shadow-xs'
                            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        Edge-to-Edge Cover (With BG)
                      </button>
                      <button
                        type="button"
                        onClick={() => setStoreImageFit('contain')}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer font-mono ${
                          storeImageFit === 'contain'
                            ? 'bg-[var(--red)] text-white shadow-xs'
                            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        Studio Pedestal Fit (Without BG)
                      </button>
                    </div>
                  </div>

                  {/* Realistic Mini OMEGA Product Card */}
                  <div className="max-w-[260px] mx-auto w-full bg-white text-zinc-900 rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col">
                    {/* Region 1: Adaptive display */}
                    <div
                      className={`relative aspect-square w-full bg-white overflow-hidden border-b border-zinc-100 ${
                        storeImageFit === 'contain' ? 'p-3 flex items-center justify-center' : ''
                      }`}
                    >
                      <span className="absolute top-2 left-2 z-10 bg-zinc-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs tracking-wider font-mono">
                        7% OFF
                      </span>
                      <div className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/95 text-zinc-900 border border-zinc-200 flex items-center justify-center shadow-xs">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      </div>

                      {livePreviewUrl ? (
                        <img
                          src={livePreviewUrl}
                          alt="Live Instagram Preview"
                          className={`w-full h-full transition-transform duration-300 ${
                            storeImageFit === 'contain'
                              ? 'object-contain'
                              : 'object-cover'
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-mono">
                          Generating card...
                        </div>
                      )}
                    </div>

                    {/* Region 2: Metadata */}
                    <div className="p-3 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-zinc-500 font-bold uppercase truncate max-w-[65%] font-mono">
                          OMEGA · Official
                        </span>
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/60 font-bold px-1.5 py-0.5 rounded-full text-[9px] font-mono">
                          In Stock
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-zinc-900 line-clamp-1 leading-tight font-serif">
                        {productName || 'OMEGA Exercise Book 200 Pages'}
                      </h4>

                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                        <span className="bg-amber-50 border border-amber-200 text-amber-800 px-1.5 py-0.2 rounded font-bold font-mono">
                          4.9 ★
                        </span>
                        <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" /> Assured
                        </span>
                      </div>

                      <div>
                        <div className="text-sm font-extrabold text-zinc-900 font-mono">TSh 25,500</div>
                        <div className="text-[10px] font-semibold text-zinc-500 font-mono">
                          Wholesale: TSh 23,000
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[10px]">
                        <Truck className="w-3 h-3 text-emerald-600" />
                        <span>Fast Dispatch</span>
                      </div>

                      {/* Region 3: Single Add to Cart */}
                      <div className="pt-1">
                        <div className="w-full py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[var(--red)] text-white flex items-center justify-center gap-1.5 shadow-xs font-mono cursor-pointer">
                          <ShoppingBag className="w-3.5 h-3.5 text-white" />
                          <span>Add to Cart</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* ================= STUDIO BOTTOM STATUS BAR (STITCH) ================= */}
      <div className="px-3 xs:px-4 sm:px-6 py-2.5 bg-white border-t border-zinc-200 flex items-center justify-between gap-2 xs:gap-3 text-xs text-zinc-600 shrink-0 shadow-2xs">
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 text-[10px] sm:text-xs min-w-0 truncate font-mono">
          <span className="truncate">
            Mode: <strong className="text-zinc-900">{storeImageFit === 'contain' ? 'Studio' : 'Cover'}</strong>
          </span>
          <span className="text-zinc-300">·</span>
          <span className="truncate">
            BG: <strong className="text-zinc-900">{bgPreset.toUpperCase()}</strong>
          </span>
          <span className="hidden sm:inline text-zinc-300">·</span>
          <span className="hidden sm:inline text-zinc-500 text-[11px] font-mono">1200×1200px • Lossless PNG • 300 DPI</span>
        </div>

        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0 ml-auto">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-3.5 sm:px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/80 transition-colors cursor-pointer font-mono"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplyExport}
            disabled={isProcessing || !sourceImg}
            className="px-4 sm:px-5 py-2 rounded-xl text-xs font-bold text-white bg-[var(--red)] hover:bg-[var(--red-hover)] shadow-xs active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer font-mono"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap font-bold">Apply &amp; Save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

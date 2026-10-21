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
    const tolerance = 0.06;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 md:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121212] text-white w-full max-w-5xl h-full sm:h-auto max-h-full sm:max-h-[94vh] rounded-none sm:rounded-[26px] shadow-2xl flex flex-col overflow-hidden border-0 sm:border border-[#262626]">
        {/* ================= INSTAGRAM TOP APP BAR ================= */}
        <div className="px-3 sm:px-5 py-2.5 sm:py-3.5 bg-[#1a1a1a] flex items-center justify-between border-b border-[#262626] shrink-0 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="text-stone-400 hover:text-white p-1 rounded-full transition-colors shrink-0"
              title="Cancel"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-xs sm:text-sm tracking-tight text-white truncate">
                  OMEGA Product Studio
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs shrink-0">
                  Pro Studio
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-400 font-mono truncate max-w-[140px] xs:max-w-[220px] sm:max-w-sm">
                {fileName} {sourceImg ? `· ${sourceImg.width}×${sourceImg.height}px` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={handleResetAll}
              className="text-xs font-semibold text-stone-400 hover:text-stone-200 hidden sm:block px-2.5 py-1"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleApplyExport}
              disabled={isProcessing || !sourceImg}
              className="px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#c49b7c] to-[#a46b44] hover:brightness-110 shadow-md active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden xs:inline">Uploading...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  <span className="whitespace-nowrap">Done / Apply</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================= MAIN STUDIO VIEWPORT & CONTROLS ================= */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0 bg-[#0a0a0a]">
          {/* LEFT: Viewport with checkered transparency background (7 Cols) */}
          <div className="lg:col-span-7 p-2.5 sm:p-4 md:p-5 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[#262626] relative bg-[#000000] shrink-0">
            <div
              ref={containerRef}
              className={`relative w-full aspect-square max-h-[220px] xs:max-h-[270px] sm:max-h-[340px] lg:max-h-[460px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center select-none ${
                bgPreset === 'transparent'
                  ? 'bg-[linear-gradient(45deg,#1f1f1f_25%,transparent_25%),linear-gradient(-45deg,#1f1f1f_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1f1f1f_75%),linear-gradient(-45deg,transparent_75%,#1f1f1f_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] bg-[#141414]'
                  : 'bg-[#1a1a1a]'
              }`}
            >
              {isLoadingImage ? (
                <div className="flex flex-col items-center gap-2 text-stone-400">
                  <RefreshCw className="w-8 h-8 text-[#c49b7c] animate-spin" />
                  <span className="text-xs font-bold">Loading Photo...</span>
                </div>
              ) : imgLoadError ? (
                <div className="p-4 text-center text-red-400 text-xs font-bold">
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

              {/* Floating Corner Controls */}
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFitMode((prev) => (prev === 'fill' ? 'fit' : 'fill'))}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-md active:scale-90 transition-transform"
                  title={fitMode === 'fill' ? 'Switch to Fit Entire Object' : 'Switch to Fill Edge'}
                >
                  {fitMode === 'fill' ? (
                    <Minimize className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Maximize className="w-3.5 h-3.5 text-white" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleRatioChange('1:1')}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border shadow-md transition-all ${
                    aspectRatio === '1:1'
                      ? 'bg-white text-black border-white'
                      : 'bg-black/60 text-white border-white/20'
                  }`}
                >
                  1:1 Square
                </button>
              </div>

              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-md active:scale-90 transition-transform"
                title="Rotate 90°"
              >
                <RotateCw className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            <p className="text-[11px] text-stone-500 font-medium mt-2 flex items-center gap-1.5">
              <Grid className="w-3 h-3 text-stone-400" />
              <span>Drag corners to crop · Center to reposition · Works with and without background</span>
            </p>
          </div>

          {/* RIGHT: Tabs & Controls (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col bg-[#141414] overflow-hidden">
            {/* Studio Navigation Tabs Header */}
            <div className="grid grid-cols-5 border-b border-[#262626] bg-[#1a1a1a] text-xs font-bold text-center shrink-0">
              <button
                type="button"
                onClick={() => setStudioTab('crop')}
                className={`py-3 flex flex-col items-center gap-1 transition-all ${
                  studioTab === 'crop'
                    ? 'text-white border-b-2 border-[#c49b7c] bg-white/5'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Crop className="w-4 h-4 text-[#c49b7c]" />
                <span className="text-[10px] sm:text-[11px]">Crop</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioTab('studio')}
                className={`py-3 flex flex-col items-center gap-1 transition-all ${
                  studioTab === 'studio'
                    ? 'text-white border-b-2 border-[#c49b7c] bg-white/5'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Paintbrush className="w-4 h-4 text-[#c49b7c]" />
                <span className="text-[10px] sm:text-[11px]">Studio BG</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioTab('filter')}
                className={`py-3 flex flex-col items-center gap-1 transition-all ${
                  studioTab === 'filter'
                    ? 'text-white border-b-2 border-[#c49b7c] bg-white/5'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Wand2 className="w-4 h-4 text-[#c49b7c]" />
                <span className="text-[10px] sm:text-[11px]">Filters</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioTab('adjust')}
                className={`py-3 flex flex-col items-center gap-1 transition-all ${
                  studioTab === 'adjust'
                    ? 'text-white border-b-2 border-[#c49b7c] bg-white/5'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sliders className="w-4 h-4 text-[#c49b7c]" />
                <span className="text-[10px] sm:text-[11px]">Adjust</span>
              </button>

              <button
                type="button"
                onClick={() => setStudioTab('preview')}
                className={`py-3 flex flex-col items-center gap-1 transition-all ${
                  studioTab === 'preview'
                    ? 'text-white border-b-2 border-[#c49b7c] bg-white/5'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Eye className="w-4 h-4 text-[#c49b7c]" />
                <span className="text-[10px] sm:text-[11px]">Card View</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* ================= TAB 1: CROP & FRAMING ================= */}
              {studioTab === 'crop' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
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
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            aspectRatio === ratio.id
                              ? 'border-[#c49b7c] bg-[#c49b7c]/15 text-white shadow-xs'
                              : 'border-[#2c2c2c] bg-[#1a1a1a] text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <div className="font-bold text-xs">{ratio.label}</div>
                          <div className="text-[10px] text-stone-400">{ratio.note}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Straighten Angle */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-[#1c1c1c] border border-[#2c2c2c]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-300 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-[#c49b7c]" />
                        <span>Straighten Leveler</span>
                      </span>
                      <span className="font-mono font-bold text-[#c49b7c]">{fineAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      step="0.5"
                      value={fineAngle}
                      onChange={(e) => setFineAngle(parseFloat(e.target.value))}
                      className="w-full accent-[#c49b7c] h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                      <span>-45°</span>
                      <button
                        type="button"
                        onClick={() => setFineAngle(0)}
                        className="hover:text-white"
                      >
                        0° Center
                      </button>
                      <span>+45°</span>
                    </div>
                  </div>

                  {/* Zoom Slider */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-[#1c1c1c] border border-[#2c2c2c]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-300 flex items-center gap-1.5">
                        <ZoomIn className="w-3.5 h-3.5 text-[#c49b7c]" />
                        <span>Scale &amp; Zoom</span>
                      </span>
                      <span className="font-mono font-bold text-[#c49b7c]">
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
                      className="w-full accent-[#c49b7c] h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Rotation & Flip */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFlipH((prev) => !prev)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        flipH
                          ? 'bg-[#c49b7c]/20 border-[#c49b7c] text-[#c49b7c]'
                          : 'bg-[#1a1a1a] border-[#2c2c2c] text-stone-300 hover:text-white'
                      }`}
                    >
                      <FlipHorizontal className="w-4 h-4" />
                      <span>Flip Horizontal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFlipV((prev) => !prev)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        flipV
                          ? 'bg-[#c49b7c]/20 border-[#c49b7c] text-[#c49b7c]'
                          : 'bg-[#1a1a1a] border-[#2c2c2c] text-stone-300 hover:text-white'
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
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        Background Canvas Style
                      </span>
                      <span className="text-[10px] text-stone-400">
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
                          className={`p-2 rounded-xl border text-left transition-all ${
                            bgPreset === item.id
                              ? 'border-[#c49b7c] bg-[#c49b7c]/20 text-white shadow-xs'
                              : 'border-[#262626] bg-[#1a1a1a] text-stone-400 hover:border-stone-600'
                          }`}
                        >
                          <div className="font-bold text-xs">{item.label}</div>
                          <div className="text-[10px] text-stone-400">{item.note}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3D Realistic Product Drop Shadow */}
                  <div className="space-y-2 p-3 rounded-2xl bg-[#1c1c1c] border border-[#2c2c2c]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#c49b7c]" />
                        <span>3D Product Drop Shadow</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">
                        {shadowStyle}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">
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
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                            shadowStyle === s.id
                              ? 'bg-[#c49b7c] text-stone-900 shadow-xs'
                              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>

                    {shadowStyle !== 'none' && (
                      <div className="pt-2 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-400">Shadow Depth &amp; Strength</span>
                          <span className="font-mono text-stone-300">{shadowIntensity}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={shadowIntensity}
                          onChange={(e) => setShadowIntensity(parseInt(e.target.value))}
                          className="w-full accent-[#c49b7c] h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Studio Sizing & Breathing Margin (Fit any image size) */}
                  <div className="p-3 rounded-2xl bg-[#1c1c1c] border border-[#2c2c2c] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-300 flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5 text-[#c49b7c]" />
                        <span>Studio Framing Margin</span>
                      </span>
                      <span className="font-mono text-[#c49b7c] font-bold">
                        {studioPadding}% padding
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Ensures tall notebooks, wide paper reams or pens fit 100% inside card without border clipping.
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      value={studioPadding}
                      onChange={(e) => setStudioPadding(parseInt(e.target.value))}
                      className="w-full accent-[#c49b7c] h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* 1-Click Magic White BG Remover */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-stone-900 to-amber-950/30 border border-purple-800/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Scissors className="w-4 h-4 text-purple-400" />
                        <span>1-Click Magic Cutout</span>
                      </span>
                      <span className="text-[10px] text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded-full font-mono">
                        Auto Cutout
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-300">
                      Turns solid white or plain background photos into a clean transparent PNG cutout instantly!
                    </p>

                    <button
                      type="button"
                      onClick={handleMagicRemoveWhiteBg}
                      disabled={isRemovingBg}
                      className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
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
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                      Instagram Color Grades
                    </span>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      1-Tap color filters optimized for stationery &amp; book paper.
                    </p>
                  </div>

                  {selectedFilterId !== 'normal' && (
                    <div className="p-3 rounded-2xl bg-[#1c1c1c] border border-[#2c2c2c] space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-300">Filter Intensity</span>
                        <span className="font-mono text-[#c49b7c] font-bold">
                          {filterIntensity}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterIntensity}
                        onChange={(e) => setFilterIntensity(parseInt(e.target.value))}
                        className="w-full accent-[#c49b7c] h-1.5 bg-stone-700 rounded-lg cursor-pointer"
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
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? 'border-[#c49b7c] bg-[#c49b7c]/15 shadow-md scale-[1.02]'
                              : 'border-[#262626] bg-[#1a1a1a] hover:border-stone-600'
                          }`}
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-800 border border-white/10 shrink-0">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={filter.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                                {filter.name[0]}
                              </div>
                            )}
                          </div>
                          <span
                            className={`text-[11px] font-bold truncate max-w-full ${
                              isSelected ? 'text-[#c49b7c]' : 'text-stone-300'
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
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Lighting &amp; Color Sliders
                  </span>

                  {/* Brightness */}
                  <div className="p-3 rounded-2xl bg-[#1c1c1c] border border-[#2c2c2c] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-300 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-[#c49b7c]" /> Brightness
                      </span>
                      <span className="font-mono text-stone-300 font-bold">
                        {brightness > 0 ? `+${brightness}` : brightness}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full accent-[#c49b7c] h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="p-3 rounded-2xl bg-[#1c1c1c] border border-[#2c2c2c] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-300 flex items-center gap-1.5">
                        <Contrast className="w-3.5 h-3.5 text-[#c49b7c]" /> Contrast
                      </span>
                      <span className="font-mono text-stone-300 font-bold">
                        {contrast > 0 ? `+${contrast}` : contrast}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="w-full accent-[#c49b7c] h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Warmth */}
                  <div className="p-3 rounded-2xl bg-[#1c1c1c] border border-[#2c2c2c] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-300 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-[#c49b7c]" /> Warmth / Tone
                      </span>
                      <span className="font-mono text-stone-300 font-bold">
                        {warmth > 0 ? `+${warmth}` : warmth}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={warmth}
                      onChange={(e) => setWarmth(parseInt(e.target.value))}
                      className="w-full accent-[#c49b7c] h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="p-3 rounded-2xl bg-[#1c1c1c] border border-[#2c2c2c] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-300 flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#c49b7c]" /> Saturation
                      </span>
                      <span className="font-mono text-stone-300 font-bold">
                        {saturation > 0 ? `+${saturation}` : saturation}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={saturation}
                      onChange={(e) => setSaturation(parseInt(e.target.value))}
                      className="w-full accent-[#c49b7c] h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Vignette */}
                  <div className="p-3 rounded-2xl bg-[#1c1c1c] border border-[#2c2c2c] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-300 flex items-center gap-1.5">
                        <Aperture className="w-3.5 h-3.5 text-[#c49b7c]" /> Vignette Spotlight
                      </span>
                      <span className="font-mono text-stone-300 font-bold">{vignette}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={vignette}
                      onChange={(e) => setVignette(parseInt(e.target.value))}
                      className="w-full accent-[#c49b7c] h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* ================= TAB 5: LIVE CARD PREVIEW WITH FIT TOGGLE ================= */}
              {studioTab === 'preview' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                      Live Store Card Preview
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                      Perfect Display
                    </span>
                  </div>

                  {/* Website Card Display Mode Toggle */}
                  <div className="bg-[#1c1c1c] p-2.5 rounded-2xl border border-[#2c2c2c] space-y-1.5">
                    <span className="text-[11px] font-bold text-stone-300 block">
                      Card Display Style on Website:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setStoreImageFit('cover')}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                          storeImageFit === 'cover'
                            ? 'bg-[#c49b7c] text-stone-900 shadow-xs'
                            : 'bg-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        Edge-to-Edge Cover (With BG)
                      </button>
                      <button
                        type="button"
                        onClick={() => setStoreImageFit('contain')}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                          storeImageFit === 'contain'
                            ? 'bg-[#c49b7c] text-stone-900 shadow-xs'
                            : 'bg-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        Studio Pedestal Fit (Without BG)
                      </button>
                    </div>
                  </div>

                  {/* Realistic Mini OMEGA Product Card */}
                  <div className="max-w-[260px] mx-auto w-full bg-white text-[#2b2520] rounded-[22px] border border-[#e2dedb] shadow-xl overflow-hidden flex flex-col">
                    {/* Region 1: Adaptive display */}
                    <div
                      className={`relative aspect-square w-full bg-[#f8f7f5] overflow-hidden border-b border-[#e2dedb] ${
                        storeImageFit === 'contain' ? 'p-3 flex items-center justify-center' : ''
                      }`}
                    >
                      <span className="absolute top-2 left-2 z-10 bg-[#4b423b] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wider">
                        7% OFF
                      </span>
                      <div className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/95 text-[#4b423b] border border-[#e2dedb] flex items-center justify-center shadow-xs">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      </div>

                      {livePreviewUrl ? (
                        <img
                          src={livePreviewUrl}
                          alt="Live Instagram Preview"
                          className={`w-full h-full transition-transform duration-300 ${
                            storeImageFit === 'contain'
                              ? 'object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.14)]'
                              : 'object-cover'
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                          Generating card...
                        </div>
                      )}
                    </div>

                    {/* Region 2: Metadata */}
                    <div className="p-3 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-stone-400 font-bold uppercase truncate max-w-[65%]">
                          OMEGA · Official
                        </span>
                        <span className="text-[#2A9D8F] bg-emerald-50 border border-emerald-200/60 font-bold px-1.5 py-0.5 rounded-full text-[9px]">
                          In Stock
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#2b2520] line-clamp-1 leading-tight">
                        {productName || 'OMEGA Exercise Book 200 Pages'}
                      </h4>

                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                        <span className="bg-amber-50 border border-amber-200 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                          4.9 ★
                        </span>
                        <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" /> Assured
                        </span>
                      </div>

                      <div>
                        <div className="text-sm font-extrabold text-[#2b2520]">TSh 25,500</div>
                        <div className="text-[10px] font-semibold text-[#8c847e]">
                          Wholesale: TSh 23,000
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[#2A9D8F] font-semibold text-[10px]">
                        <Truck className="w-3 h-3 text-[#2A9D8F]" />
                        <span>Fast Dispatch</span>
                      </div>

                      {/* Region 3: Single Add to Cart */}
                      <div className="pt-1">
                        <div className="w-full py-2 px-3 rounded-full text-xs font-bold uppercase tracking-wider btn-ledup-copper text-white flex items-center justify-center gap-1.5 shadow-xs">
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

        {/* ================= INSTAGRAM BOTTOM STATUS BAR ================= */}
        <div className="px-3 sm:px-5 py-2 sm:py-3 bg-[#1a1a1a] border-t border-[#262626] flex items-center justify-between gap-2 text-xs text-stone-400 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-xs min-w-0 truncate">
            <span className="truncate">
              Mode: <strong className="text-white">{storeImageFit === 'contain' ? 'Studio' : 'Edge Cover'}</strong>
            </span>
            <span className="text-stone-600">·</span>
            <span className="truncate">
              Canvas: <strong className="text-white">{bgPreset.toUpperCase()}</strong>
            </span>
            <span className="hidden md:inline text-stone-600">·</span>
            <span className="hidden md:inline text-stone-500 text-[11px]">1200×1200 Export</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-stone-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApplyExport}
              disabled={isProcessing || !sourceImg}
              className="px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#c49b7c] to-[#a46b44] hover:brightness-110 shadow-md active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  <span className="whitespace-nowrap">Done / Apply</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ProductImageMeta } from '@/types/store';

export type ProductImageVariant = 'card' | 'tile' | 'thumb' | 'hero' | 'gallery';

export function getProductImageSrc(image?: string | ProductImageMeta | null): string {
  if (!image) return '/products/omega-hardcover-counter-book-q3-288-pages-1200.webp';
  if (typeof image === 'string') return image;
  return image.src || image.src1200 || '/products/omega-hardcover-counter-book-q3-288-pages-1200.webp';
}

export interface ProductImageProps {
  /** The product image: can be a ProductImageMeta object or a raw string URL */
  image?: string | ProductImageMeta | null;
  /** Explicit src override */
  src?: string;
  /** Accessible alt text */
  alt?: string;
  /** Background type: "white" or "transparent" */
  bg?: 'white' | 'transparent';
  /** Display variant: card (1/1), tile (4/5), thumb (1/1), hero (cutout), gallery (1/1) */
  variant?: ProductImageVariant;
  /** If true, loads with eager priority without lazy loading */
  priority?: boolean;
  /** Extra classes for the outer aspect-ratio wrapper */
  className?: string;
  /** Extra classes for the <img> element */
  imgClassName?: string;
  /** Responsive sizes attribute for srcset */
  sizes?: string;
  /** Optional click handler */
  onClick?: () => void;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  image,
  src: propSrc,
  alt: propAlt,
  bg: propBg,
  variant = 'card',
  priority = false,
  className = '',
  imgClassName = '',
  sizes,
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Normalize image data from object or string
  let resolvedSrc = propSrc || '';
  let resolvedAlt = propAlt || 'OMEGA Stationery Product';
  let resolvedBg: 'white' | 'transparent' = propBg || 'white';
  let src400 = '';
  let src800 = '';
  let src1200 = '';

  if (typeof image === 'object' && image !== null) {
    resolvedSrc = resolvedSrc || image.src;
    resolvedAlt = resolvedAlt !== 'OMEGA Stationery Product' ? resolvedAlt : image.alt || resolvedAlt;
    resolvedBg = propBg || image.bg || 'white';
    src400 = image.src400 || '';
    src800 = image.src800 || '';
    src1200 = image.src1200 || image.src || '';
  } else if (typeof image === 'string') {
    resolvedSrc = resolvedSrc || image;
    // If string points to standardized webp in /products/, derive srcset
    if (resolvedSrc.includes('/products/') && resolvedSrc.endsWith('-1200.webp')) {
      const base = resolvedSrc.replace(/-1200\.webp$/, '');
      src400 = `${base}-400.webp`;
      src800 = `${base}-800.webp`;
      src1200 = resolvedSrc;
    }
  }

  // Variant-specific aspect ratio and padding configurations
  let aspectClass = 'aspect-square';
  let paddingStyle = 'clamp(8px, 6%, 20px)';
  let objectPosition = 'center';
  let defaultSizes = '(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw';
  let bgWrapper = 'bg-white';

  switch (variant) {
    case 'card':
      aspectClass = 'aspect-square';
      paddingStyle = '2px';
      objectPosition = 'center';
      defaultSizes = '(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw';
      break;
    case 'tile':
      aspectClass = 'aspect-[4/5]';
      paddingStyle = 'clamp(8px, 5%, 16px)';
      objectPosition = 'center bottom';
      defaultSizes = '(min-width: 1024px) 25vw, 50vw';
      break;
    case 'thumb':
      aspectClass = 'aspect-square';
      paddingStyle = '4px';
      objectPosition = 'center';
      defaultSizes = '72px';
      break;
    case 'hero':
      aspectClass = 'aspect-square';
      paddingStyle = '0px';
      objectPosition = 'center';
      bgWrapper = 'bg-transparent';
      defaultSizes = '(min-width: 1024px) 45vw, 90vw';
      break;
    case 'gallery':
      aspectClass = 'aspect-square';
      paddingStyle = 'clamp(12px, 8%, 24px)';
      objectPosition = 'center';
      defaultSizes = '(min-width: 1024px) 50vw, 100vw';
      break;
  }

  // Construct responsive srcset if available
  const srcSetString =
    src400 && src800 && src1200
      ? `${src400} 400w, ${src800} 800w, ${src1200} 1200w`
      : undefined;

  // Blending & Shadow Rules:
  // - White-background photos: apply mix-blend-mode: multiply so the white disappears into the cream panel
  // - Transparent cutouts get a soft drop shadow
  let blendClass = '';
  let dropShadowStyle = '';

  if (variant === 'hero') {
    dropShadowStyle = 'drop-shadow(0 12px 20px rgba(0,0,0,0.35))';
  } else if (resolvedBg === 'white') {
    blendClass = 'mix-blend-multiply';
  } else {
    dropShadowStyle = '';
  }

  function resolveSmartFallback(altText: string): string {
    const lower = (altText || '').toLowerCase();
    if (lower.includes('q2') || lower.includes('192')) {
      return '/products/omega-hardcover-counter-book-q2-192-pages-1200.webp';
    }
    if (lower.includes('q4') || lower.includes('384')) {
      return '/products/omega-hardcover-counter-book-q4-384-pages-1200.webp';
    }
    if (lower.includes('bahasha') || lower.includes('envelope')) {
      return '/products/omega-heavy-kraft-bahasha-envelopes-a4-pack-of-50-1200.webp';
    }
    if (lower.includes('exercise')) {
      return '/products/omega-exercise-book-200-pages-single-line-sl-1200.webp';
    }
    if (lower.includes('register') || lower.includes('visitor') || lower.includes('attendance')) {
      return '/products/omega-security-gate-visitors-register-executive-foil-1200.webp';
    }
    return '/products/omega-hardcover-counter-book-q3-288-pages-1200.webp';
  }

  const effectiveSrc = hasError || !resolvedSrc ? resolveSmartFallback(resolvedAlt) : resolvedSrc;
  const effectiveSrcSet = hasError ? undefined : srcSetString;

  return (
    <div
      onClick={onClick}
      className={`relative w-full ${aspectClass} overflow-hidden rounded-[inherit] ${bgWrapper} select-none ${className}`}
      style={{ isolation: 'isolate' }}
    >
      {/* 1. Skeleton Shimmer while loading */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-[#F4F1EA] animate-pulse pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* 2. Standardized Responsive Image with Automatic Local Fallback */}
      <img
        src={effectiveSrc}
        srcSet={effectiveSrcSet}
        sizes={sizes || defaultSizes}
        alt={resolvedAlt}
        width={1200}
        height={1200}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setIsLoaded(true);
          }
        }}
        className={`absolute inset-0 w-full h-full object-contain ${blendClass} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
        style={{
          boxSizing: 'border-box',
          padding: paddingStyle,
          objectPosition,
          filter: dropShadowStyle || undefined,
        }}
      />
    </div>
  );
};

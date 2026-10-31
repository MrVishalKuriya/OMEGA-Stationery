import React from 'react';
import { motion } from 'framer-motion';

interface ProductCardSkeletonProps {
  index?: number;
}

/**
 * ProductCardSkeleton — Warm Tactile Minimal Skeleton Loader
 * Uses the brand's 'paper-base' (#F9F8F6) and 'charcoal-ink' (#111113) colors
 * with a subtle, unhurried pulsing rhythm to improve perceived performance during data fetching.
 */
export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ index = 0 }) => {
  const delayStyle = { animationDelay: `${(index % 8) * 90}ms` };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: (index % 8) * 0.03 }}
      role="status"
      aria-label="Loading stationery product"
      className="flex flex-col h-full bg-paper-base rounded-lg overflow-hidden border border-[#E7E5E0] shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] p-3.5 text-left relative"
    >
      {/* 1. 1:1 Aspect Square Image Container */}
      <div
        style={delayStyle}
        className="relative aspect-square w-full shrink-0 rounded-lg overflow-hidden border border-charcoal-ink/10 skeleton-paper-ink flex flex-col justify-between p-2.5"
      >
        <div className="flex items-start justify-between w-full">
          {/* Badge Placeholder */}
          <div
            style={delayStyle}
            className="h-4 w-16 rounded-[4px] skeleton-charcoal-bar"
          />
          {/* Wishlist Icon Placeholder */}
          <div
            style={delayStyle}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-md skeleton-charcoal-bar"
          />
        </div>

        {/* Subtle Center Book Silhouette */}
        <div className="my-auto mx-auto w-20 h-24 rounded-md border border-charcoal-ink/10 bg-paper-base/80 flex flex-col items-center justify-between p-2.5">
          <div style={delayStyle} className="w-10 h-1.5 rounded-xs skeleton-charcoal-bar" />
          <div style={delayStyle} className="w-8 h-8 rounded-sm skeleton-charcoal-bar" />
          <div style={delayStyle} className="w-12 h-1.5 rounded-xs skeleton-charcoal-bar" />
        </div>

        <div className="h-2" />
      </div>

      {/* 2. Metadata & Content Skeleton */}
      <div className="flex flex-col flex-1 justify-between pt-3 gap-2.5">
        <div className="space-y-2 text-left">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between">
            <div
              style={delayStyle}
              className="h-3 w-24 rounded-xs skeleton-charcoal-bar"
            />
            <div
              style={delayStyle}
              className="h-3 w-10 rounded-xs skeleton-charcoal-bar"
            />
          </div>

          {/* Product Title (2 lines) */}
          <div className="space-y-1.5 py-0.5">
            <div
              style={delayStyle}
              className="h-3.5 w-11/12 rounded-xs skeleton-charcoal-bar"
            />
            <div
              style={delayStyle}
              className="h-3.5 w-2/3 rounded-xs skeleton-charcoal-bar"
            />
          </div>

          {/* Unboxed Metadata Spec Line */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div style={delayStyle} className="h-2.5 w-8 rounded-xs skeleton-charcoal-bar" />
            <span className="text-charcoal-ink/20 text-[10px]">·</span>
            <div style={delayStyle} className="h-2.5 w-12 rounded-xs skeleton-charcoal-bar" />
            <span className="text-charcoal-ink/20 text-[10px]">·</span>
            <div style={delayStyle} className="h-2.5 w-14 rounded-xs skeleton-charcoal-bar" />
          </div>

          {/* Aligned Baseline Pricing */}
          <div className="pt-2.5 mt-auto border-t border-charcoal-ink/10 space-y-1.5">
            <div className="flex items-baseline gap-2">
              <div
                style={delayStyle}
                className="h-4 sm:h-5 w-24 rounded-xs skeleton-charcoal-bar"
              />
              <div
                style={delayStyle}
                className="h-3 w-14 rounded-xs skeleton-charcoal-bar"
              />
            </div>
            <div
              style={delayStyle}
              className="h-2.5 w-28 rounded-xs skeleton-charcoal-bar"
            />
          </div>
        </div>

        {/* 3. Primary Action Button Skeleton */}
        <div className="pt-2 mt-auto">
          <div
            style={delayStyle}
            className="w-full min-h-[38px] rounded-[2px] skeleton-charcoal-bar"
          />
        </div>
      </div>
    </motion.div>
  );
};

export const ProductListRowSkeleton: React.FC<ProductCardSkeletonProps> = ({ index = 0 }) => {
  const delayStyle = { animationDelay: `${(index % 6) * 90}ms` };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: (index % 6) * 0.04 }}
      role="status"
      aria-label="Loading stationery row"
      className="bg-paper-base rounded-lg p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5 border border-[#E7E5E0] shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] text-left relative overflow-hidden"
    >
      {/* 1:1 Aspect Square Image Stage */}
      <div
        style={delayStyle}
        className="w-full sm:w-36 md:w-36 aspect-square rounded-lg shrink-0 overflow-hidden relative border border-charcoal-ink/10 skeleton-paper-ink flex items-center justify-center"
      >
        <div className="w-14 h-18 rounded-sm border border-charcoal-ink/10 bg-paper-base/80 flex flex-col items-center justify-between p-2">
          <div style={delayStyle} className="w-8 h-1 rounded-xs skeleton-charcoal-bar" />
          <div style={delayStyle} className="w-6 h-6 rounded-xs skeleton-charcoal-bar" />
          <div style={delayStyle} className="w-9 h-1 rounded-xs skeleton-charcoal-bar" />
        </div>
      </div>

      {/* Information Column */}
      <div className="flex-1 space-y-2.5 w-full min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <div style={delayStyle} className="h-4 w-32 rounded-[4px] skeleton-charcoal-bar" />
          <div style={delayStyle} className="h-4 w-20 rounded-[4px] skeleton-charcoal-bar" />
        </div>

        <div style={delayStyle} className="h-5 w-3/4 max-w-md rounded-xs skeleton-charcoal-bar" />

        <div className="space-y-1.5">
          <div style={delayStyle} className="h-3 w-full max-w-xl rounded-xs skeleton-charcoal-bar" />
          <div style={delayStyle} className="h-3 w-2/3 max-w-md rounded-xs skeleton-charcoal-bar" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <div style={delayStyle} className="h-5 w-16 rounded-[4px] skeleton-charcoal-bar" />
          <div style={delayStyle} className="h-5 w-20 rounded-[4px] skeleton-charcoal-bar" />
          <div style={delayStyle} className="h-5 w-24 rounded-[4px] skeleton-charcoal-bar" />
        </div>
      </div>

      {/* Price & Action Column */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-44 gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-charcoal-ink/10">
        <div className="space-y-1.5 text-left md:text-right">
          <div style={delayStyle} className="h-5 w-24 rounded-xs skeleton-charcoal-bar md:ml-auto" />
          <div style={delayStyle} className="h-3 w-28 rounded-xs skeleton-charcoal-bar md:ml-auto" />
        </div>

        <div className="flex items-center gap-2">
          <div style={delayStyle} className="h-8 w-20 rounded-[2px] skeleton-charcoal-bar" />
          <div style={delayStyle} className="h-8 w-8 rounded-[2px] skeleton-charcoal-bar" />
        </div>
      </div>
    </motion.div>
  );
};

interface CatalogSkeletonGridProps {
  viewMode?: 'grid' | 'list';
  count?: number;
  columns?: 3 | 4;
}

export const CatalogSkeletonGrid: React.FC<CatalogSkeletonGridProps> = ({
  viewMode = 'grid',
  count = 6,
  columns = 3,
}) => {
  if (viewMode === 'list') {
    return (
      <div className="space-y-3.5" aria-busy="true" aria-live="polite">
        {Array.from({ length: count }).map((_, idx) => (
          <ProductListRowSkeleton key={`list-skeleton-${idx}`} index={idx} />
        ))}
      </div>
    );
  }

  const gridColsClass =
    columns === 4
      ? 'grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'
      : 'grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5';

  return (
    <div className={gridColsClass} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={`card-skeleton-${idx}`} index={idx} />
      ))}
    </div>
  );
};

export default ProductCardSkeleton;

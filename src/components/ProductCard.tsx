import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ShoppingBag,
  Check,
  Heart,
  Star,
  Eye,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { Product, formatPrice } from '../types/store';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';
import { triggerCartConfetti } from '@/utils/confetti';

interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard — Implemented strictly according to public/uploads/DESIGN.md
 * "Warm Tactile Minimal" Architecture:
 * - Charcoal Ink (#111113)
 * - Soft Paper Base (#F9F8F6)
 * - Pure Paper Surface (#FFFFFF)
 * - Wax Seal Vermilion (#DC2626)
 * - Leather Ochre (#8C7355)
 * - Hairline Border (#E7E5E0)
 * - Card radius: rounded-lg (8px)
 * - Controls radius: rounded-md (6px)
 * - Motion easing: cubic-bezier(0.16, 1, 0.3, 1)
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    storeConfig,
    language,
    isInWishlist,
    toggleWishlist,
  } = useStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const effectivePrice =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  const hasDiscount = effectivePrice < product.price;
  const discountPercent =
    hasDiscount && product.price > 0
      ? Math.round(((product.price - effectivePrice) / product.price) * 100)
      : 0;

  const isOutOfStock = product.stockStatus === 'Out of Stock';
  const currency = storeConfig?.currencySymbol || 'TSh';
  const isWishlisted = isInWishlist(product.id);

  const ratingVal = product.rating || 4.9;
  const reviewCountVal = product.reviewCount || 120;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product.id, 1, false);
    triggerCartConfetti();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
      className="group flex flex-col h-full bg-[#FFFFFF] rounded-lg overflow-hidden border border-[#E7E5E0] hover:border-[#8C7355]/60 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04),0_1px_3px_0_rgba(17,17,19,0.02)] hover:shadow-[0_12px_28px_-6px_rgba(35,27,18,0.08),0_4px_12px_-2px_rgba(35,27,18,0.03)] p-3 sm:p-3.5 transition-all text-left relative"
    >
      {/* ================= REGION 1: IMAGE CONTAINER (Centered, Symmetrical, No Overflow) ================= */}
      <div className="relative aspect-square w-full bg-[#F9F8F6] rounded-md flex items-center justify-center overflow-hidden p-3 sm:p-4 border border-[#E7E5E0] group-hover:border-[#D5D2CC] transition-colors">
        {/* Top Badges (DESIGN.md: Wax Seal #DC2626 & Vellum #F2EFEB) */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start max-w-[70%]">
          {hasDiscount && (
            <span className="bg-[#DC2626] text-[#FFFFFF] text-[9px] font-bold px-2 py-0.5 rounded-[4px] shadow-2xs font-mono tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          {product.badge ? (
            <span className="bg-[#111113] text-[#FFFFFF] text-[8px] sm:text-[9px] font-semibold px-2 py-0.5 rounded-[4px] shadow-2xs tracking-wider truncate max-w-full font-mono">
              {product.badge}
            </span>
          ) : product.bestSeller && !hasDiscount ? (
            <span className="bg-[#F2EFEB] text-[#8C7355] border border-[#E7E5E0] text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-[4px] shadow-2xs tracking-wider font-mono">
              ★ BESTSELLER
            </span>
          ) : null}
        </div>

        {/* Wishlist Button (Pill Exception per DESIGN.md) */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-2xs cursor-pointer ${
            isWishlisted
              ? 'bg-[#DC2626] text-white shadow-sm'
              : 'bg-[#FFFFFF] text-[#111113] hover:text-[#DC2626] hover:bg-[#F9F8F6] border border-[#E7E5E0]'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isWishlisted ? 'fill-white stroke-none scale-110' : 'stroke-[1.75]'
            }`}
          />
        </motion.button>

        {/* View Details Quick Action Overlay */}
        <Link
          to={`/product/${product.id}`}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1.5 group-hover:translate-y-0 px-3 py-1.5 rounded-[4px] bg-[#111113] hover:bg-[#262524] text-[#FFFFFF] text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-md whitespace-nowrap cursor-pointer hidden sm:flex"
        >
          <Eye className="w-3 h-3 text-[#8C7355]" />
          <span>View Details</span>
        </Link>

        {/* Clickable Image (Scales 1.015x per DESIGN.md on hover) */}
        <Link
          to={`/product/${product.id}`}
          className="w-full h-full flex items-center justify-center overflow-hidden"
          style={product.imageBackground ? { backgroundColor: product.imageBackground } : undefined}
        >
          {!imgError && product.image ? (
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
              className="w-full h-full object-contain object-center drop-shadow-sm transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-[#F9F8F6] text-center rounded-md">
              <div className="w-14 h-20 sm:w-16 sm:h-24 bg-[#FFFFFF] rounded-[4px] p-2 flex flex-col items-center justify-between shadow-2xs border border-[#E7E5E0]">
                <span className="text-[8px] sm:text-[9px] font-bold tracking-widest text-[#111113]">OMEGA</span>
                <BookOpen className="w-5 h-5 text-[#8C7355] stroke-[1.5]" />
                <span className="text-[7px] sm:text-[8px] text-[#6E6B66] font-mono">{product.sku}</span>
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* ================= REGION 2: METADATA & ICON-BASED ATTRIBUTES ================= */}
      <div className="flex flex-col flex-1 justify-between pt-3 pb-0.5 px-0.5 gap-2 bg-[#FFFFFF]">
        <div className="space-y-1.5 text-left">
          {/* Row 1: Rating Stars & SKU */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
            {isOutOfStock ? (
              <span className="text-[9px] font-bold text-[#6E6B66] bg-[#F2EFEB] border border-[#E7E5E0] px-2 py-0.5 rounded-[4px] font-mono">
                Out of Stock
              </span>
            ) : (
              <div className="flex items-center gap-1 text-[10px] font-semibold text-[#111113]">
                <Star className="w-3 h-3 fill-[#8C7355] text-[#8C7355]" />
                <span className="font-mono">{ratingVal.toFixed(1)}</span>
                <span className="text-[#6E6B66] font-normal">({reviewCountVal})</span>
              </div>
            )}
            <span className="text-[9px] font-mono text-[#6E6B66] font-medium tracking-wide">
              {product.sku}
            </span>
          </div>

          {/* Row 2: Product Title (Plus Jakarta Sans) */}
          <div className="min-h-[2.4rem] flex items-start">
            <h3 className="font-heading text-xs sm:text-sm font-semibold text-[#111113] group-hover:text-[#DC2626] transition-colors line-clamp-2 leading-snug">
              <Link to={`/product/${product.id}`} className="focus:outline-none">
                {language === 'sw' && product.nameSw ? product.nameSw : product.name}
              </Link>
            </h3>
          </div>

          {/* Row 3: Visual Icon Chips (More Icons, Concise Metadata) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {product.quire ? (
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold text-[#111113] bg-[#F2EFEB] px-2 py-0.5 rounded-[4px] border border-[#E7E5E0]">
                <Layers className="w-2.5 h-2.5 text-[#8C7355]" />
                <span>{product.quire}</span>
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold text-[#111113] bg-[#F2EFEB] px-2 py-0.5 rounded-[4px] border border-[#E7E5E0]">
              <ShieldCheck className="w-2.5 h-2.5 text-[#8C7355]" />
              <span>70 GSM</span>
            </span>
          </div>

          {/* Row 4: Pricing Block */}
          <div className="pt-1.5 mt-auto space-y-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-[#111113] font-mono tracking-tight leading-none">
                {formatPrice(effectivePrice, currency)}
              </span>
              {hasDiscount && (
                <span className="text-[11px] sm:text-xs text-[#6E6B66] line-through font-mono">
                  {formatPrice(product.price, currency)}
                </span>
              )}
            </div>
            {product.wholesalePrice ? (
              <span className="text-[10px] text-[#8C7355] font-mono font-semibold block truncate">
                Carton: {formatPrice(product.wholesalePrice, currency)}
              </span>
            ) : null}
          </div>
        </div>

        {/* ================= REGION 3: PRIMARY ACTION BUTTON (Charcoal Ink #111113) ================= */}
        <div className="pt-2 mt-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-3 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 min-h-[38px] transition-all duration-200 shadow-2xs cursor-pointer font-sans ${
              isOutOfStock
                ? 'bg-[#F2EFEB] text-[#6E6B66] border border-[#E7E5E0] cursor-not-allowed'
                : justAdded
                ? 'bg-[#16a34a] text-white shadow-xs'
                : 'bg-[#111113] hover:bg-[#262524] text-[#FFFFFF] hover:shadow-sm'
            }`}
          >
            {isOutOfStock ? (
              <span>{language === 'sw' ? 'Imeisha kwa Sasa' : 'Out of Stock'}</span>
            ) : justAdded ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span className="text-white">{language === 'sw' ? 'Imewekwa!' : 'Added!'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-white shrink-0" />
                <span>{language === 'sw' ? 'Weka Kwenye Oda' : 'Add to Cart'}</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;

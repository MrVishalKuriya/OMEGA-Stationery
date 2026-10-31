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
} from 'lucide-react';
import { Product, formatPrice } from '../types/store';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';
import { triggerCartConfetti } from '@/utils/confetti';

interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard — Modern Swiss Editorial Architecture
 * - 65% Dominant Image Container on Crisp Off-White Canvas (#F8F9FA)
 * - Pure White Card Surface (#FFFFFF) with 1px Hairline Border (#E5E7EB)
 * - Zero-Pill Discipline: Unboxed metadata separated by quiet dots
 * - Signature OMEGA Crimson Red (#B91C1C) Accent & Charcoal Ink (#0F1115)
 * - Tabular Numerals for Price Alignment
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
  const [imgLoaded, setImgLoaded] = useState(false);
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      className="group flex flex-col h-full bg-[#FFFFFF] rounded-lg overflow-hidden border border-[#E7E5E0] hover:border-[#DC2626] shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(17,17,19,0.1)] p-3.5 transition-all text-left relative"
    >
      {/* ================= 1. IMAGE CONTAINER ================= */}
      <div className="relative aspect-square w-full shrink-0 bg-[#FFFFFF] rounded-lg overflow-hidden border border-[#E7E5E0] group-hover:border-[#DC2626]/40 transition-colors">
        {/* Discount Tag */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start pointer-events-none">
          {hasDiscount && (
            <span className="bg-[#DC2626] text-[#FFFFFF] text-[10px] font-mono font-bold px-2 py-0.5 rounded-[4px] shadow-xs tracking-tight">
              {discountPercent}% OFF
            </span>
          )}
          {product.badge && !hasDiscount && (
            <span className="bg-[#111113] text-[#FFFFFF] text-[9px] font-mono font-bold px-2 py-0.5 rounded-[4px] tracking-wide uppercase">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isWishlisted
              ? 'bg-[#DC2626] text-white shadow-xs'
              : 'bg-white/95 backdrop-blur-xs text-[#111113] hover:text-[#DC2626] hover:bg-white border border-[#E7E5E0]'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isWishlisted ? 'fill-white stroke-none scale-110' : 'stroke-[1.75]'
            }`}
          />
        </button>

        {/* View Details Quick Action Overlay on Hover */}
        <Link
          to={`/product/${product.id}`}
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 px-3 py-1.5 rounded-md bg-[#111113] hover:bg-[#DC2626] text-[#FFFFFF] text-[10px] font-sans font-bold uppercase tracking-wider items-center gap-1.5 shadow-md whitespace-nowrap cursor-pointer hidden sm:flex"
        >
          <Eye className="w-3 h-3 text-white/90" />
          <span>{language === 'sw' ? 'Tazama' : 'View Details'}</span>
        </Link>

        {/* Product Image Stage */}
        <Link
          to={`/product/${product.id}`}
          className="absolute inset-0 aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-[#FFFFFF]"
          style={product.imageBackground ? { backgroundColor: product.imageBackground } : undefined}
        >
          {!imgError && product.image ? (
            <>
              {!imgLoaded && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 aspect-square rounded-lg skeleton-paper-ink flex items-center justify-center"
                >
                  <div className="w-16 h-20 rounded-md border border-charcoal-ink/10 bg-paper-base/80 flex flex-col items-center justify-between p-2">
                    <div className="w-8 h-1 rounded-xs skeleton-charcoal-bar" />
                    <div className="w-6 h-6 rounded-xs skeleton-charcoal-bar" />
                    <div className="w-10 h-1 rounded-xs skeleton-charcoal-bar" />
                  </div>
                </div>
              )}
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`w-full h-full aspect-square object-cover object-center rounded-lg transition-all duration-300 ease-out group-hover:scale-105 ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </>
          ) : (
            <div className="w-full h-full aspect-square flex flex-col items-center justify-center p-3 bg-[#F9F8F6] text-center rounded-lg">
              <div className="w-14 h-20 bg-white rounded-md p-2 flex flex-col items-center justify-between border border-[#E7E5E0]">
                <span className="text-[9px] font-bold tracking-widest text-[#111113]">OMEGA</span>
                <BookOpen className="w-5 h-5 text-[#DC2626] stroke-[1.5]" />
                <span className="text-[8px] text-[#6E6B66] font-mono">{product.sku}</span>
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* ================= 2. METADATA & CONTENT ================= */}
      <div className="flex flex-col flex-1 justify-between pt-3 gap-2">
        <div className="space-y-1.5 text-left">
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between text-[11px] text-charcoal-ink">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#3F3F46] font-semibold truncate max-w-[65%]">
              {product.category || 'Stationery'}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-medium text-charcoal-ink">
              <Star className="w-3 h-3 fill-[#DC2626] text-[#DC2626]" />
              <span className="font-mono font-bold">{ratingVal.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Title */}
          <div className="min-h-[2.3rem] flex items-start">
            <h3 className="font-sans text-xs sm:text-sm font-bold text-charcoal-ink group-hover:text-[#DC2626] transition-colors line-clamp-2 leading-snug">
              <Link to={`/product/${product.id}`} className="focus:outline-none">
                {language === 'sw' && product.nameSw ? product.nameSw : product.name}
              </Link>
            </h3>
          </div>

          {/* Unboxed Metadata Line */}
          <div className="flex items-center gap-1.5 text-[10px] text-[#3F3F46] font-mono pt-0.5">
            {product.quire && (
              <>
                <span className="font-semibold text-charcoal-ink">{product.quire}</span>
                <span aria-hidden="true" className="text-[#71717A]">·</span>
              </>
            )}
            <span>70 GSM</span>
            <span aria-hidden="true" className="text-[#71717A]">·</span>
            <span className="truncate">{product.packaging ? product.packaging.split('/')[0] : 'Authentic'}</span>
          </div>

          {/* Aligned Baseline Pricing */}
          <div className="pt-2 mt-auto border-t border-[#E7E5E0]">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-black text-charcoal-ink font-mono tracking-tight tabular-nums">
                {formatPrice(effectivePrice, currency)}
              </span>
              {hasDiscount && (
                <span className="text-[11px] text-[#3F3F46] line-through font-mono tabular-nums">
                  {formatPrice(product.price, currency)}
                </span>
              )}
            </div>
            {product.wholesalePrice ? (
              <span className="text-[10px] text-[#B91C1C] font-mono font-bold block truncate mt-0.5">
                Carton: {formatPrice(product.wholesalePrice, currency)}
              </span>
            ) : null}
          </div>
        </div>

        {/* ================= 3. PRIMARY BUY ACTION BUTTON ================= */}
        <div className="pt-2 mt-auto">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-3 rounded-[2px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 min-h-[38px] transition-all duration-200 cursor-pointer font-sans ${
              isOutOfStock
                ? 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB] cursor-not-allowed'
                : justAdded
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-[#111113] hover:bg-[#DC2626] text-[#FFFFFF] shadow-xs'
            }`}
          >
            {isOutOfStock ? (
              <span>{language === 'sw' ? 'Imeisha' : 'Out of Stock'}</span>
            ) : justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>{language === 'sw' ? 'Imeongezwa!' : 'Added!'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-white/90" />
                <span>{language === 'sw' ? 'Weka Kwenye Kikapu' : 'Add to Cart'}</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;

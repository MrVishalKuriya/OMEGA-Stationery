import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ShoppingBag,
  Check,
  Heart,
  Star,
  Eye,
  Sparkles,
  Truck,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { Product, formatPrice } from '../types/store';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    storeConfig,
    language,
    isInWishlist,
    toggleWishlist,
    setQuickViewProduct,
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

  // Extract packaging from product.packaging or specifications
  const packagingInfo =
    product.packaging ||
    product.specifications?.find(
      (s) =>
        s.label.toLowerCase().includes('packaging') ||
        s.label.toLowerCase().includes('pack')
    )?.value;

  const ratingVal = product.rating || 4.9;
  const reviewCountVal = product.reviewCount || 120;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product.id, 1, false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <article className="group flex flex-col h-full rounded-2xl overflow-hidden border border-[#e4e4e7] hover:border-[#dc2626] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative">
      {/* ================= REGION 1: PRODUCT SHOWCASE IMAGE ================= */}
      <div className="relative block aspect-square w-full bg-[#fafafa] overflow-hidden border-b border-[#e4e4e7]">
        {/* Top Badges (Discount & Tag) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start max-w-[70%]">
          {hasDiscount && (
            <span className="bg-[#111113] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm font-mono tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          {product.badge ? (
            <span className="bg-[#dc2626] text-white text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wider truncate max-w-full font-mono">
              {product.badge}
            </span>
          ) : product.bestSeller && !hasDiscount ? (
            <span className="bg-[#111113] text-[#ef4444] border border-[#dc2626]/40 text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wider flex items-center gap-1 font-mono">
              <Sparkles className="w-2.5 h-2.5 text-[#ef4444]" />
              <span>Bestseller</span>
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shadow-sm backdrop-blur-xs cursor-pointer ${
            isWishlisted
              ? 'bg-[#dc2626] text-white shadow-md scale-105'
              : 'bg-white/95 text-[#18181b] hover:text-[#dc2626] hover:bg-white hover:scale-105 border border-[#e4e4e7]'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${
              isWishlisted ? 'fill-white scale-110' : 'stroke-[2]'
            }`}
          />
        </button>

        {/* Quick View Button Hover Overlay (Desktop) */}
        <button
          type="button"
          onClick={handleQuickView}
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 px-3 py-1.5 rounded-full bg-[#111113]/90 hover:bg-black text-[#ef4444] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-[#dc2626]/50 backdrop-blur-sm whitespace-nowrap cursor-pointer hidden sm:flex"
        >
          <Eye className="w-3.5 h-3.5 text-[#ef4444]" />
          <span>Quick View</span>
        </button>

        {/* Clickable Image */}
        <Link
          to={`/product/${product.id}`}
          className="w-full h-full p-4 flex items-center justify-center overflow-hidden"
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
              className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#f4f4f5] text-center">
              <div className="w-16 h-22 sm:w-20 sm:h-28 border-2 border-[#111113] bg-white p-2 flex flex-col items-center justify-between shadow-xs rounded-[6px]">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#111113]">OMEGA</span>
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#111113] stroke-[1.5]" />
                <span className="text-[8px] sm:text-[9px] text-[#71717a] font-mono">{product.sku}</span>
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* ================= REGION 2: METADATA & SPECS ================= */}
      <div className="flex flex-col flex-1 justify-between p-3.5 sm:p-4 gap-2.5 sm:gap-3 bg-white">
        <div className="space-y-1.5">
          {/* Row 1: Clean Category Tag */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
            <span className="text-[#dc2626] font-bold uppercase tracking-wider text-[9px] sm:text-[10px] font-mono truncate max-w-[80%]">
              {product.category || 'Stationery'}
            </span>
            {isOutOfStock ? (
              <span className="text-[9px] font-bold text-stone-500 bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded-full">
                Out of Stock
              </span>
            ) : (
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#18181b]">
                <Star className="w-3 h-3 fill-[#dc2626] text-[#dc2626]" />
                <span>{ratingVal.toFixed(1)}</span>
                <span className="text-zinc-400 font-normal">({reviewCountVal})</span>
              </div>
            )}
          </div>

          {/* Row 2: Product Title (2 Lines max) */}
          <h3 className="font-heading text-xs sm:text-sm font-bold text-[#18181b] group-hover:text-[#dc2626] transition-colors line-clamp-2 leading-snug">
            <Link to={`/product/${product.id}`} className="focus:outline-none">
              {language === 'sw' && product.nameSw ? product.nameSw : product.name}
            </Link>
          </h3>

          {/* Row 3: Pricing Block */}
          <div className="pt-2 border-t border-[#e4e4e7] mt-2 space-y-1.5">
            {/* Retail Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-[#18181b] font-mono tracking-tight">
                {formatPrice(effectivePrice, currency)}
              </span>
              {hasDiscount && (
                <span className="text-[11px] sm:text-xs text-[#71717a] line-through font-mono">
                  {formatPrice(product.price, currency)}
                </span>
              )}
            </div>

            {/* Enhanced Wholesale Carton Strip */}
            {product.wholesalePrice && (
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] bg-[#dc2626]/5 hover:bg-[#dc2626]/10 border border-[#dc2626]/20 rounded-xl px-2.5 py-1.5 transition-colors">
                <span className="text-[#71717a] font-bold uppercase tracking-wider text-[9px] sm:text-[10px] font-mono truncate">
                  Wholesale {packagingInfo ? `(${packagingInfo})` : 'Carton'}
                </span>
                <span className="font-mono font-black text-[#dc2626] text-xs shrink-0 ml-1">
                  {formatPrice(product.wholesalePrice, currency)}
                </span>
              </div>
            )}
          </div>

          {/* Row 4: Dispatch Guarantee (Subtle & Clean) */}
          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[10px] pt-0.5">
            <Truck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">Fast Dispatch Available</span>
          </div>
        </div>

        {/* ================= REGION 3: PRIMARY ACTION BUTTON ================= */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[42px] transition-all duration-200 active:scale-95 shadow-sm cursor-pointer font-mono ${
              isOutOfStock
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-[#e4e4e7]'
                : justAdded
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white hover:shadow-md'
            }`}
          >
            {isOutOfStock ? (
              <span>{language === 'sw' ? 'Imeisha kwa Sasa' : 'Out of Stock'}</span>
            ) : justAdded ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span className="text-white">{language === 'sw' ? 'Imewekwa Kwenye Oda!' : 'Added to Cart!'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-white shrink-0" />
                <span>{language === 'sw' ? 'Weka Kwenye Oda' : 'Add to Cart'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

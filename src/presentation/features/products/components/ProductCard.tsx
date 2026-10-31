import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ShoppingBag,
  Check,
  Heart,
  Star,
  Eye,
} from 'lucide-react';
import { Product, formatPrice } from '@/types/store';
import { useStore } from '@/context/StoreContext';

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
  } = useStore();

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

  return (
    <article className="group flex flex-col justify-between h-full rounded-[22px] sm:rounded-[24px] p-2.5 sm:p-3.5 border border-[#e4e4e7] hover:border-[#dc2626]/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative">
      {/* ================= REGION 1: PRODUCT SHOWCASE IMAGE ================= */}
      <div>
        <div className="relative block aspect-square w-full rounded-[16px] sm:rounded-[18px] bg-[#f6f5f2] overflow-hidden border border-[#e4e4e7]/60">
          {/* Top Badge (Single Clean Tag) */}
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1">
            {hasDiscount ? (
              <span className="bg-[#111113] text-white text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs font-mono tracking-wider">
                -{discountPercent}%
              </span>
            ) : product.badge ? (
              <span className="bg-white/95 text-[#111113] border border-[#e4e4e7] text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs tracking-wide font-mono">
                {product.badge}
              </span>
            ) : product.bestSeller ? (
              <span className="bg-white/95 text-[#dc2626] border border-[#dc2626]/20 text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs tracking-wide font-mono">
                Bestseller
              </span>
            ) : null}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shadow-2xs cursor-pointer ${
              isWishlisted
                ? 'bg-[#dc2626] text-white shadow-md scale-105'
                : 'bg-white/95 text-[#18181b] hover:text-[#dc2626] hover:bg-white border border-[#e4e4e7]'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${
                isWishlisted ? 'fill-white scale-110' : 'stroke-[2]'
              }`}
            />
          </button>

          {/* View Details Hover Pill (Desktop) */}
          <Link
            to={`/product/${product.id}`}
            className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 px-3 py-1.5 rounded-full bg-[#111113]/90 hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider items-center gap-1.5 shadow-lg backdrop-blur-xs whitespace-nowrap cursor-pointer hidden sm:flex"
          >
            <Eye className="w-3 h-3 text-[#ef4444]" />
            <span>{language === 'sw' ? 'Tazama' : 'Quick View'}</span>
          </Link>

          {/* Clickable Image */}
          <Link
            to={`/product/${product.id}`}
            className="w-full h-full p-3.5 sm:p-5 flex items-center justify-center overflow-hidden"
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

        {/* ================= REGION 2: METADATA & TITLE ================= */}
        <div className="pt-3 px-1 space-y-1 text-left">
          <div className="flex items-center justify-between text-[10px] text-[#71717a]">
            <span className="font-medium truncate pr-2">
              {product.category || 'Stationery'}
            </span>
            <span className="inline-flex items-center gap-0.5 font-bold text-[#18181b] shrink-0">
              <Star className="w-3 h-3 fill-[#dc2626] text-[#dc2626]" />
              {ratingVal.toFixed(1)}
            </span>
          </div>

          <h3 className="font-heading text-xs sm:text-sm font-bold text-[#111113] group-hover:text-[#dc2626] transition-colors line-clamp-2 leading-snug">
            <Link to={`/product/${product.id}`} className="focus:outline-none">
              {language === 'sw' && product.nameSw ? product.nameSw : product.name}
            </Link>
          </h3>
        </div>
      </div>

      {/* ================= REGION 3: PRICE + ACTION ROW ================= */}
      <div className="pt-3 px-1 mt-2 flex items-center justify-between gap-2 border-t border-[#e4e4e7]/70">
        <div className="min-w-0 text-left">
          <span className="block text-sm sm:text-base font-black text-[#111113] font-mono tracking-tight truncate">
            {formatPrice(effectivePrice, currency)}
          </span>
          {hasDiscount && (
            <span className="block text-[10px] sm:text-[11px] text-[#71717a] line-through font-mono">
              {formatPrice(product.price, currency)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          aria-label={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          className={`h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer shrink-0 ${
            isOutOfStock
              ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-[#e4e4e7]'
              : justAdded
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-[#111113] hover:bg-[#dc2626] text-white'
          }`}
        >
          {isOutOfStock ? (
            <span className="text-[10px] uppercase font-mono">Sold</span>
          ) : justAdded ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
              <span className="hidden sm:inline text-[11px] font-mono uppercase tracking-wider">
                {language === 'sw' ? 'Weka' : 'Add'}
              </span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;

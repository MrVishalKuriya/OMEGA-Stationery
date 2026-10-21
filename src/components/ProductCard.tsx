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
  Package,
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

/**
 * ProductCard Component
 * Redesigned applying fundamental UI/UX Laws:
 * - Hick's Law: Reduced cognitive load with high visual hierarchy, single prominent primary CTA and direct WhatsApp secondary action.
 * - Fitts's Law: Ergonomic touch targets (min 44px height), thumb-friendly layout on mobile devices.
 * - Law of Proximity & Common Region: Clear visual grouping of Imagery, Metadata, Pricing, and Action regions.
 * - Jakob's Law: Standard, familiar e-commerce patterns (top-right wishlist, top-left discount badge, bottom action bar).
 * - Rustic Charm Palette: #6D4C41 (Warm Brown Primary), #8D6E63 (Secondary), #A1887F (Taupe), #D7CCC8 (Linen), #F5F5F5 (Canvas).
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    storeConfig,
    language,
    isInWishlist,
    toggleWishlist,
    setQuickViewProduct,
  } = useStore();
  const t = TRANSLATIONS[language];

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
  const currency = storeConfig.currencySymbol || 'TSh';
  const isWishlisted = isInWishlist(product.id);

  // Extract packaging from product.packaging or specifications
  const packagingInfo =
    product.packaging ||
    product.specifications?.find(
      (s) =>
        s.label.toLowerCase().includes('packaging') ||
        s.label.toLowerCase().includes('pack')
    )?.value;

  // Extract quire/pages if available
  const pagesInfo = product.specifications?.find(
    (s) =>
      s.label.toLowerCase().includes('pages') ||
      s.label.toLowerCase().includes('quire') ||
      s.label.toLowerCase().includes('sheets')
  )?.value;

  const ratingVal = product.rating || 4.9;
  const reviewCountVal = product.reviewCount || 180;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product.id, 1, true);
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
    <article className="group flex flex-col h-full rounded-[22px] overflow-hidden border border-[#e2dedb] hover:border-[#c49b7c] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative">
      {/* ================= REGION 1: PRODUCT SHOWCASE (Edge-to-Edge Border Fill) ================= */}
      <div className="relative block aspect-square w-full bg-[#f8f7f5] overflow-hidden border-b border-[#e2dedb]">
        {/* Top Badges (Pill Badges) */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start max-w-[70%]">
          {hasDiscount && (
            <span className="bg-[#4b423b] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          {product.badge ? (
            <span className="bg-[#c49b7c] text-white text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wider truncate max-w-full">
              {product.badge}
            </span>
          ) : product.bestSeller && !hasDiscount ? (
            <span className="bg-[#4b423b] text-[#c49b7c] border border-[#c49b7c]/40 text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#c49b7c]" />
              <span>Bestseller</span>
            </span>
          ) : null}
        </div>

        {/* Fitts's Law: Ergonomic Touch Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2 right-2 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-transform duration-200 active:scale-90 shadow-sm backdrop-blur-xs ${
            isWishlisted
              ? 'bg-[#D64545] text-white shadow-md scale-105'
              : 'bg-white/95 text-[#4b423b] hover:text-[#D64545] hover:bg-white hover:scale-110 border border-[#e2dedb]'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${
              isWishlisted ? 'fill-white scale-110' : 'stroke-[2]'
            }`}
          />
        </button>

        {/* Quick View Button Hover Overlay */}
        <button
          type="button"
          onClick={handleQuickView}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1.5 group-hover:translate-y-0 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#3b352f]/90 hover:bg-[#292420] text-[#c49b7c] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 shadow-lg border border-[#c49b7c]/50 backdrop-blur-sm whitespace-nowrap min-h-[30px] sm:min-h-[36px]"
        >
          <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#c49b7c]" />
          <span>Peek Inside</span>
        </button>

        {/* Clickable Image: Adaptive for both Photos with Background and Cutouts without Background */}
        <Link
          to={`/product/${product.id}`}
          className={`w-full h-full block relative overflow-hidden ${
            product.imageFit === 'contain' ? 'p-3.5 sm:p-4 flex items-center justify-center' : ''
          }`}
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
              className={`w-full h-full transition-transform duration-500 ease-out group-hover:scale-105 ${
                product.imageFit === 'contain'
                  ? 'object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.14)]'
                  : 'object-cover'
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#EFEBE9] text-center">
              <div className="w-16 h-22 sm:w-20 sm:h-28 border-2 border-[#6D4C41] bg-white p-2 flex flex-col items-center justify-between shadow-xs rounded-[6px]">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#6D4C41]">OMEGA</span>
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#6D4C41] stroke-[1.5]" />
                <span className="text-[8px] sm:text-[9px] text-[#8D6E63] font-mono-tabular">{product.sku}</span>
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* ================= REGION 2: METADATA & SPECS (Law of Proximity) ================= */}
      <div className="flex flex-col flex-1 justify-between p-2.5 sm:p-4 gap-2 sm:gap-3 bg-white">
        <div className="space-y-1 sm:space-y-1.5">
          {/* Row 1: Brand & Category Header + Stock Status */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
            <span className="text-[#8c847e] font-bold uppercase tracking-wider text-[9px] sm:text-[10px] truncate max-w-[60%] sm:max-w-[65%]">
              OMEGA · {product.category}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full border ${
                isOutOfStock
                  ? 'text-stone-500 bg-stone-100 border-stone-200'
                  : 'text-[#2A9D8F] bg-emerald-50 border-emerald-200/60'
              }`}
            >
              <span
                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                  isOutOfStock ? 'bg-stone-400' : 'bg-[#2A9D8F] animate-pulse'
                }`}
              />
              <span>{isOutOfStock ? 'Out' : 'In Stock'}</span>
            </span>
          </div>

          {/* Row 2: Product Title */}
          <h3 className="font-heading text-xs sm:text-[15px] font-bold text-[#3b352f] group-hover:text-[#4b423b] transition-colors line-clamp-2 leading-snug">
            <Link to={`/product/${product.id}`} className="focus:outline-none">
              {language === 'sw' && product.nameSw ? product.nameSw : product.name}
            </Link>
          </h3>

          {/* Row 3: Rating Pill & OMEGA Assured Badge */}
          <div className="flex items-center flex-wrap gap-1 sm:gap-2 pt-0.5">
            <div className="inline-flex items-center gap-0.5 sm:gap-1 bg-[#2A9D8F] text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded shadow-2xs">
              <span>{ratingVal.toFixed(1)}</span>
              <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-white stroke-white" />
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#8c847e] font-medium hidden sm:inline">
              ({reviewCountVal.toLocaleString()})
            </span>

            <span className="inline-flex items-center gap-0.5 text-[8px] sm:text-[10px] font-bold text-[#4b423b] bg-[#fafafa] border border-[#e2dedb] px-1 sm:px-1.5 py-0.5 rounded">
              <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#2A9D8F]" />
              <span className="truncate">Assured</span>
            </span>
          </div>

          {/* Row 4: Specs Chips (Quire / Pages / Packaging) */}
          {(pagesInfo || packagingInfo) && (
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-0.5">
              {pagesInfo && (
                <span className="inline-flex items-center gap-1 bg-[#fafafa] border border-[#e2dedb] text-[#4b423b] text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-[6px]">
                  <Layers className="w-2.5 h-2.5 text-[#c49b7c]" />
                  <span>{pagesInfo}</span>
                </span>
              )}
              {packagingInfo && (
                <span
                  className="inline-flex items-center gap-1 bg-[#fafafa] border border-[#e2dedb] text-[#4b423b] text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-[6px] truncate max-w-[110px] sm:max-w-[150px]"
                  title={packagingInfo}
                >
                  <Package className="w-2.5 h-2.5 text-[#c49b7c] shrink-0" />
                  <span className="truncate">{packagingInfo}</span>
                </span>
              )}
            </div>
          )}

          {/* Row 5: Pricing Block */}
          <div className="pt-1 border-t border-[#e2dedb] mt-1">
            <div className="flex items-baseline flex-wrap gap-1 sm:gap-2">
              <span className="text-sm sm:text-lg font-black text-[#3b352f] font-mono-tabular">
                {formatPrice(effectivePrice, currency)}
              </span>
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs text-[#8c847e] line-through font-mono-tabular">
                  {formatPrice(product.price, currency)}
                </span>
              )}
            </div>

            {product.wholesalePrice && (
              <div className="text-[9px] sm:text-[11px] text-[#4b423b] font-bold mt-0.5 font-mono truncate">
                Wholesale: {formatPrice(product.wholesalePrice, currency)}
              </div>
            )}
          </div>

          {/* Row 6: Dispatch Guarantee */}
          <div className="flex items-center gap-1 text-[#2A9D8F] font-semibold text-[10px] sm:text-[11px] pt-0.5">
            <Truck className="w-3 h-3 text-[#2A9D8F] shrink-0" />
            <span className="truncate">Fast Dispatch</span>
            {product.dispatchTime && (
              <span className="text-[#8c847e] font-normal truncate hidden sm:inline">· {product.dispatchTime}</span>
            )}
          </div>
        </div>

        {/* ================= REGION 3: ACTION BUTTON (Single Full-Width Add to Cart) ================= */}
        <div className="pt-1.5 font-sans">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`w-full py-2 sm:py-2.5 px-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[40px] sm:min-h-[44px] transition-all duration-200 active:scale-95 shadow-sm ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-[#e2dedb]'
                : justAdded
                ? 'bg-[#2A9D8F] text-white shadow-md'
                : 'btn-ledup-copper text-white hover:shadow-md'
            }`}
          >
            {isOutOfStock ? (
              <span>{language === 'sw' ? 'Imeisha kwa Sasa' : 'Out of Stock'}</span>
            ) : justAdded ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>{language === 'sw' ? 'Imewekwa Kwenye Oda!' : 'Added to Cart!'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-white shrink-0" />
                <span className="text-white font-bold">{language === 'sw' ? 'Weka Kwenye Oda' : 'Add to Cart'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

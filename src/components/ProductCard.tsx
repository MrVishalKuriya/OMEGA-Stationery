import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ShoppingBag,
  Check,
  Heart,
  Star,
  MessageCircle,
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

  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');
  const directWhatsappUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    `Hello OMEGA Tanzania, I would like to order: ${product.name} (SKU: ${product.sku}) - Price: ${currency} ${effectivePrice.toLocaleString()}. Please confirm availability and delivery.`
  )}`;

  return (
    <article className="group flex flex-col h-full rounded-[24px] overflow-hidden border border-[#e2dedb] hover:border-[#c49b7c] bg-white ledup-card ledup-sheen transition-all duration-300 relative">
      {/* ================= REGION 1: PRODUCT SHOWCASE (LEDUP 3D Stage & Sheen) ================= */}
      <div className="relative block aspect-[4/3] w-full bg-[#fafafa] overflow-hidden border-b border-[#e2dedb] p-3 sm:p-4">
        {/* Top Badges (LEDUP Pill Badges) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start max-w-[70%]">
          {hasDiscount && (
            <span className="bg-[#4b423b] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          {product.badge ? (
            <span className="bg-[#c49b7c] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm tracking-wider truncate max-w-full">
              {product.badge}
            </span>
          ) : product.bestSeller && !hasDiscount ? (
            <span className="bg-[#4b423b] text-[#c49b7c] border border-[#c49b7c]/40 text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#c49b7c]" />
              <span>Bestseller</span>
            </span>
          ) : null}
        </div>

        {/* Fitts's Law: Ergonomic Touch Wishlist Button (Min 40px hit area) */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-200 active:scale-90 shadow-sm backdrop-blur-xs ${
            isWishlisted
              ? 'bg-[#D64545] text-white shadow-md scale-105'
              : 'bg-white/95 text-[#4b423b] hover:text-[#D64545] hover:bg-white hover:scale-110 border border-[#e2dedb]'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              isWishlisted ? 'fill-white scale-110' : 'stroke-[2]'
            }`}
          />
        </button>

        {/* Quick View Button Hover Overlay (Peek Inside with LEDUP copper) */}
        <button
          type="button"
          onClick={handleQuickView}
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 px-3.5 py-1.5 rounded-full bg-[#4b423b]/95 hover:bg-[#3b352f] text-[#c49b7c] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xl border border-[#c49b7c]/50 backdrop-blur-xs whitespace-nowrap min-h-[36px]"
        >
          <Eye className="w-3.5 h-3.5 text-[#c49b7c]" />
          <span>Peek Inside</span>
        </button>

        {/* Clickable Image with Hardbound Book Spine & 3D Stage */}
        <Link
          to={`/product/${product.id}`}
          className="w-full h-full flex items-center justify-center relative aardvark-sheen overflow-hidden rounded-[8px]"
        >
          {/* Authentic hardbound book spine line */}
          <div className="aardvark-book-spine" />

          {!imgError && product.image ? (
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImgError(true)}
              className="aardvark-book-3d w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="aardvark-book-3d w-full h-full flex flex-col items-center justify-center p-6 bg-[#EFEBE9] text-center rounded-[8px]">
              <div className="w-20 h-28 border-2 border-[#6D4C41] bg-white p-2 flex flex-col items-center justify-between shadow-xs rounded-[6px]">
                <span className="text-[10px] font-bold tracking-widest text-[#6D4C41]">OMEGA</span>
                <BookOpen className="w-6 h-6 text-[#6D4C41] stroke-[1.5]" />
                <span className="text-[9px] text-[#8D6E63] font-mono-tabular">{product.sku}</span>
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* ================= REGION 2: METADATA & SPECS (Law of Proximity) ================= */}
      <div className="flex flex-col flex-1 justify-between p-3.5 sm:p-4 gap-3 bg-white">
        <div className="space-y-1.5">
          {/* Row 1: Brand & Category Header + Stock Status */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#8c847e] font-bold uppercase tracking-wider text-[10px] truncate max-w-[65%]">
              OMEGA · {product.category}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isOutOfStock
                  ? 'text-stone-500 bg-stone-100 border-stone-200'
                  : 'text-[#2A9D8F] bg-emerald-50 border-emerald-200/60'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isOutOfStock ? 'bg-stone-400' : 'bg-[#2A9D8F] animate-pulse'
                }`}
              />
              <span>{isOutOfStock ? 'Out of Stock' : 'In Stock'}</span>
            </span>
          </div>

          {/* Row 2: Product Title (LEDUP Deep Espresso #3b352f) */}
          <h3 className="font-heading text-[14px] sm:text-[15px] font-bold text-[#3b352f] group-hover:text-[#4b423b] transition-colors line-clamp-2 leading-snug">
            <Link to={`/product/${product.id}`} className="focus:outline-none">
              {language === 'sw' && product.nameSw ? product.nameSw : product.name}
            </Link>
          </h3>

          {/* Row 3: Rating Pill & OMEGA Assured Badge */}
          <div className="flex items-center flex-wrap gap-2 pt-0.5">
            <div className="inline-flex items-center gap-1 bg-[#2A9D8F] text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-2xs">
              <span>{ratingVal.toFixed(1)}</span>
              <Star className="w-2.5 h-2.5 fill-white stroke-white" />
            </div>
            <span className="text-[11px] text-[#8c847e] font-medium">
              ({reviewCountVal.toLocaleString()})
            </span>

            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#4b423b] bg-[#fafafa] border border-[#e2dedb] px-1.5 py-0.5 rounded">
              <ShieldCheck className="w-3 h-3 text-[#2A9D8F]" />
              <span>OMEGA Assured</span>
            </span>
          </div>

          {/* Row 4: Specs Chips (Quire / Pages / Packaging) */}
          {(pagesInfo || packagingInfo) && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {pagesInfo && (
                <span className="inline-flex items-center gap-1 bg-[#fafafa] border border-[#e2dedb] text-[#4b423b] text-[10px] font-semibold px-2 py-0.5 rounded-[6px]">
                  <Layers className="w-2.5 h-2.5 text-[#c49b7c]" />
                  <span>{pagesInfo}</span>
                </span>
              )}
              {packagingInfo && (
                <span
                  className="inline-flex items-center gap-1 bg-[#fafafa] border border-[#e2dedb] text-[#4b423b] text-[10px] font-semibold px-2 py-0.5 rounded-[6px] truncate max-w-[150px]"
                  title={packagingInfo}
                >
                  <Package className="w-2.5 h-2.5 text-[#c49b7c] shrink-0" />
                  <span className="truncate">{packagingInfo}</span>
                </span>
              )}
            </div>
          )}

          {/* Row 5: Pricing Block (Prominent, High Contrast) */}
          <div className="pt-1 border-t border-[#e2dedb] mt-1">
            <div className="flex items-baseline flex-wrap gap-2">
              <span className="text-base sm:text-lg font-black text-[#3b352f] font-mono-tabular">
                {formatPrice(effectivePrice, currency)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xs text-[#8c847e] line-through font-mono-tabular">
                    {formatPrice(product.price, currency)}
                  </span>
                  <span className="text-xs font-black text-[#2A9D8F]">
                    {discountPercent}% off
                  </span>
                </>
              )}
            </div>

            {product.wholesalePrice && (
              <div className="text-[11px] text-[#4b423b] font-bold mt-0.5 font-mono">
                Wholesale: {formatPrice(product.wholesalePrice, currency)}
              </div>
            )}
          </div>

          {/* Row 6: Dispatch Guarantee */}
          <div className="flex items-center gap-1 text-[#2A9D8F] font-semibold text-[11px] pt-0.5">
            <Truck className="w-3 h-3 text-[#2A9D8F]" />
            <span>Fast Dispatch</span>
            {product.dispatchTime && (
              <span className="text-[#8c847e] font-normal">· {product.dispatchTime}</span>
            )}
          </div>
        </div>

        {/* ================= REGION 3: ACTION BUTTONS (LEDUP Copper Gradient + Mocha) ================= */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-1 font-sans">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`py-2 px-2 sm:px-3 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 min-h-[44px] transition-all duration-200 active:scale-95 shadow-sm ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-[#e2dedb]'
                : justAdded
                ? 'bg-[#4b423b] text-white shadow-md'
                : 'btn-ledup-copper'
            }`}
          >
            {isOutOfStock ? (
              t.outOfStock
            ) : justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>{language === 'sw' ? 'Ipo!' : 'Added'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
                <span className="text-white">{language === 'sw' ? 'Weka Oda' : 'Add to Bag'}</span>
              </>
            )}
          </button>

          <a
            href={directWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Direct WhatsApp Order"
            className="py-2 px-2 sm:px-3 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider btn-ledup-mocha text-white flex items-center justify-center gap-1 sm:gap-1.5 min-h-[44px] transition-all duration-200 active:scale-95 shadow-sm group"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
};

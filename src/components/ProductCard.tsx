import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShoppingBag, Check, Heart, Star, MessageCircle, Eye, Sparkles } from 'lucide-react';
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
  const t = TRANSLATIONS[language];

  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const effectivePrice =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  const hasDiscount = effectivePrice < product.price;
  const isOutOfStock = product.stockStatus === 'Out of Stock';
  const currency = storeConfig.currencySymbol || 'TSh';
  const isWishlisted = isInWishlist(product.id);

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
    <article className="group flex flex-col card-ink-paper rounded-[12px] overflow-hidden hover-lift border border-[#E6E0D2] bg-white relative">
      {/* Product Image Container */}
      <div className="relative block aspect-[4/3] w-full bg-[#FBF8F1] overflow-hidden border-b border-[#E6E0D2] p-4">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          {product.badge ? (
            <span className="badge-clear-sale">
              {product.badge}
            </span>
          ) : product.bestSeller ? (
            <span className="badge-clear-sale flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#F5A623]" />
              <span>Bestseller</span>
            </span>
          ) : product.featured ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#1E2A5E] text-white shadow-xs">
              Featured
            </span>
          ) : null}

          {hasDiscount && (
            <span className="badge-clear-sale text-[9px] px-2 py-0.5 font-mono">
              Save {Math.round(((product.price - effectivePrice) / product.price) * 100)}%
            </span>
          )}
        </div>

        {/* Wishlist Button (Heart) */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs backdrop-blur-xs ${
            isWishlisted
              ? 'bg-[#D64545] text-white shadow-md'
              : 'bg-white/95 text-[#6B7280] hover:text-[#D64545] hover:bg-white'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              isWishlisted ? 'fill-white scale-110' : 'stroke-[1.75]'
            }`}
          />
        </button>

        {/* Quick View Button Hover Overlay */}
        <button
          type="button"
          onClick={handleQuickView}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 px-3.5 py-1.5 rounded-full bg-[#1E2A5E] hover:bg-[#162047] text-[#F5A623] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-[#F5A623]/40 backdrop-blur-xs whitespace-nowrap"
        >
          <Eye className="w-3.5 h-3.5 text-[#F5A623]" />
          <span>Quick View</span>
        </button>

        {/* Clickable Image */}
        <Link
          to={`/product/${product.id}`}
          className="w-full h-full flex items-center justify-center overflow-hidden"
        >
          {!imgError && product.image ? (
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-stone-100 text-center">
              <div className="w-20 h-28 border-2 border-[#1E2A5E] bg-white p-2 flex flex-col items-center justify-between shadow-xs rounded-[8px]">
                <span className="text-[10px] font-bold tracking-widest text-[#1E2A5E]">OMEGA</span>
                <BookOpen className="w-6 h-6 text-[#1E2A5E] stroke-[1.5]" />
                <span className="text-[9px] text-[#6B7280] font-mono-tabular">{product.sku}</span>
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 justify-between p-4 sm:p-5 gap-3 bg-white">
        <div className="space-y-1.5">
          {/* Subtitle / Category & Quire pills */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#6B7280]">
            <span className="text-[#1E2A5E] font-bold uppercase tracking-wider text-[10px] truncate">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#F5A623] stroke-[#F5A623]" />
              <span className="text-xs font-bold text-[#1B1F2A]">4.9</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-heading text-[15px] font-bold text-[#1B1F2A] group-hover:text-[#1E2A5E] transition-colors line-clamp-2 leading-snug">
            <Link to={`/product/${product.id}`} className="focus:outline-none">
              {language === 'sw' && product.nameSw ? product.nameSw : product.name}
            </Link>
          </h3>

          {/* Key specs badge line: Quire / Pages / Size */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.quire && (
              <span className="text-[10px] font-bold bg-[#1E2A5E]/10 text-[#1E2A5E] border border-[#1E2A5E]/20 px-2 py-0.5 rounded-[6px]">
                {product.quire}
              </span>
            )}
            {product.pageCount && (
              <span className="text-[10px] font-medium bg-[#FBF8F1] text-[#6B7280] border border-[#E6E0D2] px-2 py-0.5 rounded-[6px]">
                {product.pageCount}
              </span>
            )}
            {product.size && (
              <span className="text-[10px] font-medium bg-[#FBF8F1] text-[#6B7280] border border-[#E6E0D2] px-2 py-0.5 rounded-[6px]">
                {product.size}
              </span>
            )}
          </div>
        </div>

        {/* Pricing Line: Retail & Wholesale */}
        <div className="pt-2 border-t border-[#E6E0D2] flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] block font-semibold">
              {t.retailPrice}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-[#1B1F2A] font-mono-tabular">
                {formatPrice(effectivePrice, currency)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-[#6B7280] line-through font-mono-tabular">
                  {formatPrice(product.price, currency)}
                </span>
              )}
            </div>
          </div>

          {product.wholesalePrice && (
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#1E2A5E] block font-bold">
                {t.wholesalePrice}
              </span>
              <span className="text-xs font-bold text-[#1E2A5E] font-mono-tabular">
                {formatPrice(product.wholesalePrice, currency)}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons: Add to Cart (Yellow CTA) + Direct WhatsApp */}
        <div className="grid grid-cols-2 gap-2 pt-1 font-sans">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`py-2.5 px-3 rounded-[8px] text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm min-h-[42px] ${
              isOutOfStock
                ? 'bg-stone-100 text-[#6B7280] cursor-not-allowed border border-[#E6E0D2]'
                : justAdded
                ? 'bg-[#1E2A5E] text-white'
                : 'btn-cta-yellow'
            }`}
          >
            {isOutOfStock ? (
              t.outOfStock
            ) : justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#2A9D8F]" />
                <span>{language === 'sw' ? 'Ipo!' : 'Added'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#1E2A5E]" />
                <span className="text-[#1E2A5E]">{language === 'sw' ? 'Weka Oda' : 'Add'}</span>
              </>
            )}
          </button>

          <a
            href={directWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Direct WhatsApp Order"
            className="py-2.5 px-3 rounded-[8px] text-xs font-bold uppercase tracking-wider bg-[#2A9D8F] hover:bg-[#238276] text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors min-h-[42px] active:scale-[0.98]"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
};

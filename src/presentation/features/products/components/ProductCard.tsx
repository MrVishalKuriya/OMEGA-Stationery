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
import { TRANSLATIONS } from '@/data/translations';

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

  const subtitle = product.specifications?.find((s) => s.label.toLowerCase().includes('pages') || s.label.toLowerCase().includes('quire'))?.value
    || product.category
    || 'STATIONERY';

  return (
    <article className="group flex flex-col justify-between h-full bg-white rounded-lg border border-[#e7e5e0] hover:border-[#111113]/40 transition-all duration-300 hover:shadow-md relative p-4 text-center">
      {/* Top Controls: Badges Left, Heart Right */}
      <div className="flex items-center justify-between w-full relative z-10 min-h-[24px]">
        <div>
          {hasDiscount ? (
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#dc2626] bg-[#dc2626]/10 px-2 py-0.5 rounded-sm">
              -{discountPercent}%
            </span>
          ) : product.badge ? (
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#111113] bg-[#f4f3ef] px-2 py-0.5 rounded-sm">
              {product.badge}
            </span>
          ) : product.bestSeller ? (
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#8c7355] bg-[#8c7355]/10 px-2 py-0.5 rounded-sm">
              Bestseller
            </span>
          ) : null}
        </div>

        {/* Minimalist Heart Outline / Filled Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="w-7 h-7 flex items-center justify-center text-[#6E6B66] hover:text-[#dc2626] transition-colors cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              isWishlisted ? 'fill-[#dc2626] text-[#dc2626] scale-110' : 'stroke-[1.5]'
            }`}
          />
        </button>
      </div>

      {/* Product Image Canvas */}
      <Link
        to={`/product/${product.id}`}
        className="block aspect-square w-full my-3 p-2 relative flex items-center justify-center overflow-hidden"
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
          <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-[#f9f8f6] rounded">
            <BookOpen className="w-8 h-8 text-[#111113]/40 stroke-[1.5]" />
            <span className="text-[9px] text-[#6E6B66] font-mono mt-1">{product.sku}</span>
          </div>
        )}
      </Link>

      {/* Centered Editorial Typography */}
      <div className="space-y-1 my-2">
        <h3 className="font-heading font-bold text-xs sm:text-sm text-[#111113] tracking-wide uppercase line-clamp-1 group-hover:text-[#8c7355] transition-colors">
          <Link to={`/product/${product.id}`} className="focus:outline-none">
            {language === 'sw' && product.nameSw ? product.nameSw : product.name}
          </Link>
        </h3>

        <p className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#6E6B66] uppercase truncate">
          {subtitle}
        </p>

        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-xs sm:text-sm font-mono font-bold text-[#111113]">
            {formatPrice(effectivePrice, currency)}
          </span>
          {hasDiscount && (
            <span className="text-[10px] sm:text-[11px] text-[#6E6B66] line-through font-mono">
              {formatPrice(product.price, currency)}
            </span>
          )}
        </div>
      </div>

      {/* Full-width "ADD TO CART" Button */}
      <div className="pt-2 mt-auto">
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={`w-full py-2.5 px-3 rounded-md text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 active:scale-98 cursor-pointer ${
            isOutOfStock
              ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-[#e7e5e0]'
              : justAdded
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-[#111113] hover:bg-[#8c7355] text-white shadow-xs'
          }`}
        >
          {isOutOfStock ? (
            <span>{language === 'sw' ? 'Imeisha' : 'Out of Stock'}</span>
          ) : justAdded ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>{language === 'sw' ? 'Imewekwa!' : 'Added!'}</span>
            </>
          ) : (
            <span>{language === 'sw' ? 'Weka Kwenye Oda' : 'Add to Cart'}</span>
          )}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;

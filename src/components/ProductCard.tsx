import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Layers,
  ShieldCheck,
  Heart,
  ShoppingBag,
  Check,
  Truck,
  Star,
  Tag,
} from 'lucide-react';
import { toast } from 'sonner';
import { Product, formatPrice } from '../types/store';
import { useStore } from '../context/StoreContext';
import { TRANSLATIONS } from '../data/translations';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    language,
    isInWishlist,
    toggleWishlist,
    setIsCartDrawerOpen,
  } = useStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const effectivePrice =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  const hasDiscount =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;

  const discountPercentage = hasDiscount
    ? Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)
    : 0;

  const isFavorited = isInWishlist ? isInWishlist(product.id) : false;
  const isOutOfStock = product.stockStatus === 'Out of Stock';

  const productName = language === 'sw' && product.nameSw ? product.nameSw : product.name;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);

    toast.success(language === 'sw' ? 'Imeongezwa kwenye kikapu' : 'Added to cart', {
      description: productName,
      action: {
        label: language === 'sw' ? 'Tazama Kikapu' : 'View Cart',
        onClick: () => setIsCartDrawerOpen(true),
      },
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggleWishlist) {
      toggleWishlist(product.id);
    }
  };

  return (
    <div className="group relative bg-white rounded-lg border border-[#E7E5E0] hover:border-[#111113]/30 transition-all duration-300 hover:shadow-md flex flex-col p-3 text-left h-full">
      {/* 1:1 Aspect Ratio Image Container */}
      <div className="relative w-full aspect-square bg-[#F9F8F6] rounded-md overflow-hidden flex items-center justify-center p-3 border border-[#E7E5E0]/60">
        <Link
          to={`/product/${product.id}`}
          className="w-full h-full flex items-center justify-center"
          aria-label={productName}
        >
          {product.image && !imgError ? (
            <img
              src={product.image}
              alt={productName}
              loading="lazy"
              onError={() => setImgError(true)}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-[#6E6B66]">
              <BookOpen size={32} strokeWidth={1.75} />
              <span className="text-[10px] font-mono mt-1">OMEGA</span>
            </div>
          )}
        </Link>

        {/* Top-Left Badge (Discount or Best Seller) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
          {hasDiscount ? (
            <span className="px-2 py-0.5 rounded-sm bg-[#DC2626] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs">
              -{discountPercentage}%
            </span>
          ) : product.bestSeller ? (
            <span className="px-2 py-0.5 rounded-sm bg-[#111113] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs">
              {language === 'sw' ? 'BORA' : 'BEST SELLER'}
            </span>
          ) : null}
        </div>

        {/* Top-Right Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isFavorited ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
          title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-1 right-1 w-11 h-11 flex items-center justify-center rounded-full text-[#111113] hover:text-[#DC2626] bg-white/80 backdrop-blur-xs transition-colors cursor-pointer"
        >
          <Heart
            size={18}
            strokeWidth={1.75}
            className={`transition-transform duration-200 hover:scale-110 ${
              isFavorited ? 'fill-[#DC2626] text-[#DC2626]' : 'text-[#111113]'
            }`}
          />
        </button>
      </div>

      {/* Product Title (Max 2 lines) */}
      <div className="mt-2.5 min-h-[2.5rem]">
        <Link
          to={`/product/${product.id}`}
          className="font-heading text-xs sm:text-sm font-bold text-[#111113] hover:text-[#DC2626] line-clamp-2 leading-snug transition-colors"
          title={productName}
        >
          {productName}
        </Link>
      </div>

      {/* Icon Metadata Chips */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2 py-1">
        {product.quire && (
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-[#F2EFEB] text-[#111113] text-[10px] font-mono font-medium"
            title={`Quire / Model: ${product.quire}`}
          >
            <BookOpen size={12} strokeWidth={1.75} className="text-[#8C7355]" />
            <span>{product.quire}</span>
          </span>
        )}

        {product.pageCount && (
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-[#F2EFEB] text-[#111113] text-[10px] font-mono font-medium"
            title={`Page count: ${product.pageCount}`}
          >
            <Layers size={12} strokeWidth={1.75} className="text-[#8C7355]" />
            <span>{product.pageCount}</span>
          </span>
        )}

        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-[#F2EFEB] text-[#111113] text-[10px] font-mono font-medium"
          title="70 GSM Bleed-Proof"
        >
          <ShieldCheck size={12} strokeWidth={1.75} className="text-[#8C7355]" />
          <span>70 GSM</span>
        </span>
      </div>

      {/* Price & Delivery Strip */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E7E5E0] mt-1">
        <div>
          {effectivePrice > 0 ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs sm:text-sm font-mono font-bold text-[#111113]">
                {formatPrice(effectivePrice, 'TSh')}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-[#6E6B66] line-through font-mono">
                  {formatPrice(product.price, 'TSh')}
                </span>
              )}
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#8C7355]">
              <Tag size={13} strokeWidth={1.75} />
              <span>Ask price</span>
            </span>
          )}
        </div>

        {/* Small Delivery Truck Icon */}
        <div className="flex items-center gap-1 shrink-0">
          {product.rating && product.rating > 0 ? (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-[#111113] mr-1">
              <Star size={11} strokeWidth={1.75} className="fill-[#DC2626] text-[#DC2626]" />
              <span>{product.rating.toFixed(1)}</span>
            </span>
          ) : null}
          <span
            title="Nationwide Bus Parcel Dispatch Available"
            aria-label="Nationwide Bus Parcel Dispatch Available"
            className="text-emerald-700 p-0.5"
          >
            <Truck size={15} strokeWidth={1.75} />
          </span>
        </div>
      </div>

      {/* Single Red Full-Width Button: ADD TO CART (Pushed to bottom with mt-auto, touch target >= 44px) */}
      <div className="mt-auto pt-3">
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          aria-label={isOutOfStock ? 'Out of stock' : `Add ${productName} to cart`}
          title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
          className={`w-full min-h-[44px] px-4 rounded-xl text-xs sm:text-sm font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer shadow-md ${
            isOutOfStock
              ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed border border-[#E7E5E0]'
              : justAdded
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-[#DC2626] hover:bg-[#b91c1c] text-white hover:shadow-lg'
          }`}
        >
          {justAdded ? (
            <>
              <Check size={18} strokeWidth={1.75} />
              <span>{language === 'sw' ? 'IMEWEKWA' : 'ADDED TO CART'}</span>
            </>
          ) : (
            <>
              <ShoppingBag size={18} strokeWidth={1.75} />
              <span>{language === 'sw' ? 'WEKA KWENYE KIKAPU' : 'ADD TO CART'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

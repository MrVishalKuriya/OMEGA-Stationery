import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShoppingBag, Check, Heart, Star } from 'lucide-react';
import { Product, formatPrice } from '../types/store';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, storeConfig } = useStore();
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const effectivePrice =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  const hasDiscount = effectivePrice < product.price;
  const isOutOfStock = product.stockStatus === 'Out of Stock';
  const currency = storeConfig.currencySymbol || 'TSh';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  const rating = product.rating ?? 4.9;
  const reviewCount = product.reviewCount ?? 128;

  return (
    <article className="group flex flex-col bg-white border border-[#ebdcd0] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#4a121c]/30 hover:-translate-y-1">
      {/* Product Image Container */}
      <div className="relative block aspect-[4/3] w-full bg-[#fcfaf7] overflow-hidden border-b border-[#ebdcd0]/70 p-4">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          {product.badge ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#4a121c] text-white shadow-xs">
              {product.badge}
            </span>
          ) : product.bestSeller ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#4a121c] text-white shadow-xs">
              Bestseller
            </span>
          ) : product.featured ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-stone-900 text-white shadow-xs">
              Featured
            </span>
          ) : null}

          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-amber-700 text-white shadow-xs">
              Save {Math.round(((product.price - effectivePrice) / product.price) * 100)}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-xs backdrop-blur-xs ${
            isWishlisted
              ? 'bg-[#4a121c] text-white'
              : 'bg-white/90 text-stone-600 hover:text-[#4a121c] hover:bg-white'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              isWishlisted ? 'fill-white scale-110' : 'stroke-[1.75]'
            }`}
          />
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
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#faf6f0] text-center">
              <div className="w-20 h-28 border-2 border-[#4a121c] bg-white p-2 flex flex-col items-center justify-between shadow-xs">
                <span className="text-[10px] font-bold tracking-widest text-[#4a121c]">OMEGA</span>
                <BookOpen className="w-6 h-6 text-[#4a121c] stroke-[1.5]" />
                <span className="text-[9px] text-stone-500 font-mono-tabular">{product.sku}</span>
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 justify-between p-4 sm:p-5 gap-3.5 bg-white">
        <div className="space-y-1.5">
          {/* Subtitle / Category */}
          <p className="text-[11px] uppercase tracking-wider font-semibold text-[#8b3d4d] truncate">
            {product.subtitle || product.category}
          </p>

          {/* Product Name */}
          <h3 className="font-serif text-[15px] sm:text-base font-semibold text-stone-900 group-hover:text-[#4a121c] transition-colors line-clamp-2 leading-snug">
            <Link to={`/product/${product.id}`} className="focus:outline-none">
              {product.name}
            </Link>
          </h3>

          {/* Star Ratings */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center text-amber-500" aria-label={`Rating: ${rating} out of 5 stars`}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(rating)
                      ? 'fill-amber-400 text-amber-500'
                      : i < rating
                      ? 'fill-amber-200 text-amber-400'
                      : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-stone-500 font-medium">({reviewCount})</span>
          </div>
        </div>

        {/* Color Swatches if available */}
        {product.colorOptions && product.colorOptions.length > 0 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-[11px] text-stone-400 mr-1">Shades:</span>
            {product.colorOptions.map((opt, idx) => (
              <button
                key={opt.name}
                type="button"
                onClick={() => setSelectedColorIndex(idx)}
                title={opt.name}
                aria-label={`Select ${opt.name}`}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedColorIndex === idx
                    ? 'ring-2 ring-[#4a121c] ring-offset-1 scale-110'
                    : 'border-stone-300 hover:scale-105'
                }`}
                style={{ backgroundColor: opt.hex }}
              />
            ))}
          </div>
        )}

        {/* Pricing Line */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base sm:text-lg font-bold text-stone-900 font-mono-tabular">
            {formatPrice(effectivePrice, currency)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-stone-400 line-through font-mono-tabular">
              {formatPrice(product.price, currency)}
            </span>
          )}
        </div>

        {/* Action Button: Velvet Note style full-width button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={`w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-xs ${
            isOutOfStock
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
              : justAdded
              ? 'bg-stone-900 text-white'
              : 'bg-[#4a121c] text-white hover:bg-[#340b13] hover:shadow-md active:scale-[0.99]'
          }`}
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : justAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};

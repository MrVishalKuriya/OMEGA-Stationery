import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Check,
  Plus,
  Minus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Product, formatPrice } from '../types/store';
import { useStore } from '../context/StoreContext';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    cart,
    updateCartQuantity,
    removeFromCart,
    language,
    isInWishlist,
    toggleWishlist,
    setIsCartDrawerOpen,
    setQuickViewProduct,
  } = useStore();

  const [justAdded, setJustAdded] = useState(false);

  const effectivePrice =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  const hasDiscount =
    Boolean(product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price);

  const discountPercentage = hasDiscount
    ? Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)
    : 0;

  const isFavorited = isInWishlist ? isInWishlist(product.id) : false;
  const isOutOfStock = product.stockStatus === 'Out of Stock';
  const productName = language === 'sw' && product.nameSw ? product.nameSw : product.name;

  // Cart quantity state
  const cartItem = cart?.find((item) => item.productId === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleCardClick = () => {
    setQuickViewProduct(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);

    toast.success(language === 'sw' ? 'Imeongezwa kwenye kikapu' : 'Added to cart', {
      description: productName,
      action: {
        label: language === 'sw' ? 'Tazama' : 'View Cart',
        onClick: () => setIsCartDrawerOpen(true),
      },
    });
  };

  const handleQtyChange = (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCartQty + delta <= 0) {
      removeFromCart(product.id);
      toast(language === 'sw' ? 'Imeondolewa kwenye kikapu' : 'Removed from cart', {
        action: {
          label: language === 'sw' ? 'Rudisha' : 'Undo',
          onClick: () => addToCart(product.id, 1),
        },
      });
    } else {
      updateCartQuantity(product.id, inCartQty + delta);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggleWishlist) {
      toggleWishlist(product.id);
      const wasFav = isFavorited;
      toast(wasFav ? 'Removed from wishlist' : 'Saved to wishlist', {
        action: {
          label: 'Undo',
          onClick: () => toggleWishlist(product.id),
        },
      });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className="group relative bg-white rounded-[20px] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-200 h-full text-left border-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer"
    >
      {/* Top Image Panel: Pure White Background */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white flex items-center justify-center">
        {/* Wishlist Heart Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-1.5 right-1.5 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center text-[#161518] hover:text-[#D63A3A] transition-all duration-200 cursor-pointer border-0 shadow-none opacity-90 sm:opacity-0 group-hover:opacity-100"
        >
          <Heart
            size={16}
            strokeWidth={1.75}
            className={`transition-transform duration-200 ${
              isFavorited ? 'fill-[#D63A3A] text-[#D63A3A]' : ''
            }`}
          />
        </motion.button>

        {/* Badges: Best Seller, New, or Discount */}
        <div className="absolute top-1.5 left-1.5 z-20 flex flex-col gap-1 pointer-events-none">
          {hasDiscount ? (
            <span className="px-2.5 py-1 rounded-full bg-[#F4F1EA] text-[#7A6852] text-[9.5px] sm:text-[10px] font-sans font-bold uppercase tracking-wider leading-none">
              -{discountPercentage}%
            </span>
          ) : product.bestSeller ? (
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#F3D28A] via-[#E9B44C] to-[#B8862B] text-[#121214] text-[9.5px] sm:text-[10px] font-sans font-extrabold uppercase tracking-wider leading-none inline-flex items-center gap-1">
              <span>★</span>
              <span>{language === 'sw' ? 'BORA' : 'BEST SELLER'}</span>
            </span>
          ) : product.featured ? (
            <span className="px-2.5 py-1 rounded-full bg-[#F4F1EA] text-[#7A6852] text-[9.5px] sm:text-[10px] font-sans font-bold uppercase tracking-wider leading-none">
              NEW
            </span>
          ) : null}
        </div>

        {/* Standardized Product Image with Multiply Blend on Pure White BG */}
        <div className="w-full h-full flex items-center justify-center">
          <ProductImage
            image={product.image}
            alt={productName}
            variant="card"
            bg="white"
            imgClassName="transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Middle Content: Title */}
      <div className="mt-3">
        <h3
          className="font-sans text-[13px] sm:text-[14px] font-bold text-[#161518] group-hover:text-[#D63A3A] line-clamp-2 leading-[1.35] transition-colors"
          title={productName}
        >
          {productName}
        </h3>
      </div>

      {/* Bottom Row: Price & Red Action Bag Button */}
      <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-0">
        {/* Price */}
        <div className="flex flex-col">
          <span className="text-[15px] sm:text-[16.5px] font-sans font-extrabold text-[#161518] tabular-nums tracking-tight">
            {formatPrice(effectivePrice, 'TSh')}
          </span>
          {hasDiscount && (
            <span className="text-[10.5px] text-[#71717A] line-through font-sans tabular-nums">
              {formatPrice(product.price, 'TSh')}
            </span>
          )}
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-1.5 shrink-0">
          {inCartQty > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 bg-zinc-100 rounded-xl px-1.5 py-0.5"
            >
              <button
                type="button"
                onClick={(e) => handleQtyChange(e, -1)}
                className="w-6 h-6 flex items-center justify-center text-zinc-700 hover:bg-white rounded-md transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={12} strokeWidth={2.5} />
              </button>
              <span className="text-xs font-sans font-bold text-[#161518] px-1 tabular-nums">
                {inCartQty}
              </span>
              <button
                type="button"
                onClick={(e) => handleQtyChange(e, 1)}
                className="w-6 h-6 flex items-center justify-center text-zinc-700 hover:bg-white rounded-md transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus size={12} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: isOutOfStock ? 1 : 1.06 }}
              whileTap={{ scale: isOutOfStock ? 1 : 0.92 }}
              type="button"
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
              aria-label={isOutOfStock ? 'Out of stock' : 'Add to cart'}
              className={`w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-[11px] flex items-center justify-center font-bold text-white transition-colors duration-200 shadow-none cursor-pointer ${
                isOutOfStock
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  : justAdded
                  ? 'bg-emerald-600'
                  : 'bg-[#D63A3A] hover:bg-[#b91c1c]'
              }`}
            >
              <AnimatePresence mode="wait">
                {justAdded ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <Check size={16} strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="bag"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                  >
                    <ShoppingBag size={16} strokeWidth={2} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

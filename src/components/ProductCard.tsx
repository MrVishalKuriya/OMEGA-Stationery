import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  } = useStore();

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

  // Cart quantity state
  const cartItem = cart?.find((item) => item.productId === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

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
      className="group relative bg-white rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-200 h-full text-left border-0 shadow-none hover:shadow-none"
    >
      {/* Top Image Panel: Pure White Background, No Borders, No Shadows */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white flex items-center justify-center">
        
        {/* Wishlist Heart Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center text-[var(--text)] hover:text-[var(--red)] transition-all duration-200 cursor-pointer border-0 shadow-none opacity-90 sm:opacity-0 group-hover:opacity-100"
        >
          <Heart
            size={16}
            strokeWidth={1.75}
            className={`transition-transform duration-200 ${
              isFavorited ? 'fill-[var(--red)] text-[var(--red)]' : ''
            }`}
          />
        </motion.button>

        {/* Badges: Best Seller, New, or Discount */}
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1 pointer-events-none">
          {hasDiscount ? (
            <span className="px-2 py-0.5 rounded-full bg-[var(--red)] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
              -{discountPercentage}%
            </span>
          ) : product.bestSeller ? (
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#F3D28A] via-[#E9B44C] to-[#B8862B] text-[#121214] text-[9.5px] font-mono font-black uppercase tracking-wider">
              ★ {language === 'sw' ? 'BORA' : 'BEST SELLER'}
            </span>
          ) : product.featured ? (
            <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-[#8C7355] text-[9.5px] font-mono font-bold uppercase tracking-wider">
              NEW
            </span>
          ) : null}
        </div>

        {/* Standardized Product Image with Multiply Blend on Pure White BG */}
        <Link
          to={`/product/${product.id}`}
          className="w-full h-full block flex items-center justify-center"
          aria-label={productName}
        >
          <ProductImage
            image={product.image}
            alt={productName}
            variant="card"
            bg="white"
            imgClassName="transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Middle Content: Title & Meta */}
      <div className="mt-3 space-y-1">
        <Link
          to={`/product/${product.id}`}
          className="font-sans text-xs sm:text-sm font-bold text-[var(--text)] hover:text-[var(--red)] line-clamp-2 leading-snug transition-colors"
          title={productName}
        >
          {productName}
        </Link>
        <p className="text-[11px] text-[var(--text-muted)] font-mono">
          {product.quire || product.pageCount || product.category} • 70 GSM Bond
        </p>
      </div>

      {/* Bottom Row: Tabular Price & Action Button (No Border-T) */}
      <div className="mt-auto pt-2.5 flex items-center justify-between gap-2 border-0">
        
        {/* Tabular Price */}
        <div className="flex flex-col">
          <span className="text-sm sm:text-base font-mono font-black text-[var(--text)] tabular-nums tracking-tight">
            {formatPrice(effectivePrice, 'TSh')}
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-[var(--text-muted)] line-through font-mono tabular-nums">
              {formatPrice(product.price, 'TSh')}
            </span>
          )}
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Stepper or Action Button */}
          {inCartQty > 0 ? (
            <div className="flex items-center gap-1 bg-zinc-100 rounded-xl px-1.5 py-0.5">
              <button
                type="button"
                onClick={(e) => handleQtyChange(e, -1)}
                className="w-6 h-6 flex items-center justify-center text-zinc-700 hover:bg-white rounded-md transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={12} strokeWidth={2.5} />
              </button>
              <span className="text-xs font-mono font-bold text-[var(--text)] px-1 tabular-nums">
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
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white transition-colors duration-200 shadow-none cursor-pointer ${
                isOutOfStock
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  : justAdded
                  ? 'bg-emerald-600'
                  : 'bg-[var(--red)] hover:opacity-90'
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

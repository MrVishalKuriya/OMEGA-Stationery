import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Check,
  Plus,
  Minus,
  Eye,
  BellRing,
  ArrowLeftRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Product, formatPrice } from '../types/store';
import { useStore } from '../context/StoreContext';
import { ProductImage } from './ProductImage';
import { StarRatingBadge } from './StarRatingBadge';
import { isProductSubscribedForAlert } from '../services/api';
import { SpotlightCard } from './ui/ReactBitsAnimations';

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
    isInCompare,
    openCompareWithProduct,
    setIsCartDrawerOpen,
    setQuickViewProduct,
  } = useStore();

  const [justAdded, setJustAdded] = useState(false);
  const [hasAlertSubscription, setHasAlertSubscription] = useState<boolean>(() =>
    Boolean(isProductSubscribedForAlert(product.id))
  );

  useEffect(() => {
    setHasAlertSubscription(Boolean(isProductSubscribedForAlert(product.id)));
    const handleAlertUpdate = () => {
      setHasAlertSubscription(Boolean(isProductSubscribedForAlert(product.id)));
    };
    window.addEventListener('omega-stock-alert-updated', handleAlertUpdate);
    return () => {
      window.removeEventListener('omega-stock-alert-updated', handleAlertUpdate);
    };
  }, [product.id]);

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
  const isCompared = isInCompare ? isInCompare(product.id) : false;
  const isOutOfStock =
    product.stockStatus === 'Out of Stock' ||
    (typeof product.stockQuantity === 'number' && product.stockQuantity <= 0);
  const productName = language === 'sw' && product.nameSw ? product.nameSw : product.name;

  // Cart quantity state
  const cartItem = cart?.find((item) => item.productId === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleOpenQuickView = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setQuickViewProduct(product);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openCompareWithProduct(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      setQuickViewProduct(product);
      return;
    }
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
    <div className="omega-card-container h-full">
      <SpotlightCard
        spotlightTone="dual"
        className="h-full rounded-[20px] border border-[var(--border)]/50 hover:border-[var(--gold)]/45 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(22,21,24,0.08)] transition-all duration-300 bg-white"
      >
        <motion.div
          whileHover={{ y: -3, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
          onClick={() => setQuickViewProduct(product)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setQuickViewProduct(product);
            }
          }}
          className="omega-card-inner omega-hover-lift group relative bg-transparent rounded-[20px] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-200 h-full text-left cursor-pointer"
        >
        {/* Top Image Panel: Click to Open Quick View Modal */}
        <div
          onClick={handleOpenQuickView}
          title={
            language === 'sw'
              ? 'Bonyeza picha kuona maelezo kamili (Quick View)'
              : 'Click image for Quick View & enlarged photo'
          }
          className="relative w-full aspect-square rounded-xl overflow-hidden bg-white flex items-center justify-center cursor-pointer"
        >
          {/* Top-Right Floating Action Stack: Wishlist + Compare Icon */}
          <div className="absolute top-1.5 right-1.5 z-20 flex flex-col gap-1.5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleWishlistToggle}
              aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center text-[#161518] hover:text-[#D63A3A] transition-all duration-200 cursor-pointer border-0 shadow-xs opacity-90 sm:opacity-0 group-hover:opacity-100"
            >
              <Heart
                size={15}
                strokeWidth={1.75}
                className={`transition-transform duration-200 ${
                  isFavorited ? 'fill-[#D63A3A] text-[#D63A3A]' : ''
                }`}
              />
            </motion.button>
          </div>

          {/* Badges: Out of Stock, Discount, Best Seller, or New */}
          <div className="absolute top-1.5 left-1.5 z-20 flex flex-col gap-1 pointer-events-none">
            {isOutOfStock ? (
              <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[9.5px] sm:text-[10px] font-sans font-bold uppercase tracking-wider leading-none">
                {language === 'sw' ? 'Imeisha' : 'Out of Stock'}
              </span>
            ) : hasDiscount ? (
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

          {/* Hover Quick View Trigger Pill on Product Image */}
          <div className="absolute bottom-2 inset-x-0 z-20 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/85 backdrop-blur-xs text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
              <Eye size={12} />
              <span>{language === 'sw' ? 'Tazama Haraka' : 'Quick View'}</span>
            </span>
          </div>

          {/* Standardized Product Image with Multiply Blend on Pure White BG */}
          <div className="w-full h-full flex items-center justify-center">
            <ProductImage
              image={product.image}
              alt={productName}
              variant="card"
              bg="white"
              imgClassName={`transition-transform duration-500 group-hover:scale-105 ${
                isOutOfStock ? 'opacity-75' : ''
              }`}
            />
          </div>
        </div>

        {/* Middle Content: Title, Star Rating & Compare Button Row */}
        <div className="mt-3 space-y-2">
          <Link
            to={`/product/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="omega-card-title font-sans text-[13px] sm:text-[14px] font-bold text-[#161518] hover:text-[#D63A3A] line-clamp-2 leading-[1.35] transition-colors block"
            title={productName}
          >
            {productName}
          </Link>

          {/* Star Rating & Labeled Compare Button Row */}
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <StarRatingBadge product={product} size="sm" allowQuickRate={true} />

            <button
              type="button"
              onClick={handleCompareClick}
              title={
                language === 'sw'
                  ? 'Linganisha vipimo vya bidhaa hii na nyingine'
                  : 'Compare specifications side-by-side'
              }
              aria-label={`Compare ${productName}`}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9.5px] sm:text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                isCompared
                  ? 'bg-[#D63A3A]/10 text-[#D63A3A] border-[#D63A3A]/30'
                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-[#161518] border-zinc-200/80'
              }`}
            >
              <ArrowLeftRight size={10} strokeWidth={2.2} />
              <span>{language === 'sw' ? 'Linganisha' : 'Compare'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Price & Sleek Pill Action Button */}
        <div className="mt-auto pt-2.5 flex items-center justify-between gap-2 border-t border-zinc-100">
          {/* Price Block */}
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 leading-none mb-1 truncate">
              {product.packaging || product.quire || (language === 'sw' ? 'Bei ya Kiwandani' : 'Factory Rate')}
            </span>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="omega-card-price text-[14.5px] sm:text-[16px] font-mono font-extrabold text-[#161518] tabular-nums tracking-tight leading-none">
                {formatPrice(effectivePrice, 'TSh')}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-zinc-400 line-through font-mono tabular-nums leading-none">
                  {formatPrice(product.price, 'TSh')}
                </span>
              )}
            </div>
          </div>

          {/* Action Group */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isOutOfStock ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleOpenQuickView}
                title={
                  language === 'sw'
                    ? 'Jisajili kupokea ujumbe wa WhatsApp bidhaa ikirudi'
                    : 'Sign up with WhatsApp to be notified when back in stock'
                }
                aria-label="Notify me when back in stock"
                className={`h-8 sm:h-9 px-3 sm:px-3.5 rounded-full flex items-center justify-center gap-1.5 font-mono text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs ${
                  hasAlertSubscription
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#25D366] hover:bg-[#1ebe5d] text-white'
                }`}
              >
                {hasAlertSubscription ? (
                  <>
                    <Check size={12} strokeWidth={2.5} />
                    <span>{language === 'sw' ? 'Imewekwa' : 'Alert Set'}</span>
                  </>
                ) : (
                  <>
                    <BellRing size={12} strokeWidth={2.2} />
                    <span>{language === 'sw' ? 'Nijulishe' : 'Notify Me'}</span>
                  </>
                )}
              </motion.button>
            ) : inCartQty > 0 ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 bg-zinc-100 rounded-full px-1.5 py-1 border border-zinc-200/70"
              >
                <button
                  type="button"
                  onClick={(e) => handleQtyChange(e, -1)}
                  className="w-6 h-6 flex items-center justify-center text-zinc-700 hover:bg-white rounded-full transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus size={11} strokeWidth={2.5} />
                </button>
                <span className="text-xs font-mono font-bold text-[#161518] px-1 tabular-nums">
                  {inCartQty}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleQtyChange(e, 1)}
                  className="w-6 h-6 flex items-center justify-center text-zinc-700 hover:bg-white rounded-full transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus size={11} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={handleQuickAdd}
                title="Add to cart"
                aria-label="Add to cart"
                className={`h-8 sm:h-9 px-3 sm:px-3.5 rounded-full flex items-center justify-center gap-1.5 font-mono text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-white transition-all duration-200 cursor-pointer ${
                  justAdded
                    ? 'bg-emerald-600 shadow-xs'
                    : 'bg-[#161518] hover:bg-[#D63A3A] shadow-xs hover:shadow-md hover:shadow-red-600/20'
                }`}
              >
                <AnimatePresence mode="wait">
                  {justAdded ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex items-center gap-1"
                    >
                      <Check size={13} strokeWidth={2.5} />
                      <span>{language === 'sw' ? 'Sawa' : 'Added'}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="bag"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <ShoppingBag size={13} strokeWidth={2.2} />
                      <span>{language === 'sw' ? 'Weka' : 'Add'}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        </div>
        </motion.div>
      </SpotlightCard>
    </div>
  );
};

export default ProductCard;

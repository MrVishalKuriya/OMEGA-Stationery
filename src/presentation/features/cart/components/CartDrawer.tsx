import React, { useState } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Truck,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/types/store';
import { toast } from 'sonner';
import { ProductImage } from '@/components/ProductImage';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    detailedCart,
    cartItemCount,
    subtotal,
    estimatedDelivery,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    addToCart,
    storeConfig,
    language,
  } = useStore();

  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!isCartDrawerOpen) return null;

  const currency = storeConfig.currencySymbol || 'TSh';
  const freeThreshold = storeConfig.freeDeliveryThreshold || 250000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const remainingForFree = Math.max(0, freeThreshold - subtotal);

  // Formatted WhatsApp order message
  const cleanWhatsappDigits = (storeConfig.whatsappNumber || '255746268391').replace(/\D/g, '');
  const itemsText = detailedCart
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (SKU: ${item.product.sku}) - Qty: ${
          item.quantity
        } × ${currency} ${item.effectiveUnitPrice.toLocaleString()} = ${currency} ${item.lineTotal.toLocaleString()}`
    )
    .join('\n');

  const rawOrderSummary =
    `*OMEGA STATIONERY ORDER*\n` +
    `----------------------------------------\n` +
    `Items:\n${itemsText}\n\n` +
    `Subtotal: ${currency} ${subtotal.toLocaleString()}\n` +
    `Estimated Delivery: ${
      estimatedDelivery === 0 ? 'FREE' : `${currency} ${estimatedDelivery.toLocaleString()}`
    }\n` +
    `*Total: ${currency} ${cartTotal.toLocaleString()}*\n` +
    `----------------------------------------\n` +
    `Please confirm stock availability and bus parcel dispatch.`;

  const whatsappCheckoutUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    rawOrderSummary
  )}`;

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(rawOrderSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Order summary copied to clipboard!');
  };

  const handleRemoveWithUndo = (productId: string, productName: string, qty: number) => {
    removeFromCart(productId);
    toast('Removed from cart', {
      description: productName,
      action: {
        label: 'Undo',
        onClick: () => addToCart(productId, qty),
      },
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs flex justify-end animate-fadeIn"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div
        className="relative w-full max-w-md bg-[var(--surface-1)] h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[var(--border)] text-[var(--text)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-[var(--surface-1)] px-5 sm:px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-base sm:text-lg font-bold text-[var(--text)] tracking-tight">
              {language === 'sw' ? 'Kikapu Chako' : 'Shopping Bag'}
            </h2>
            <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[11px] font-mono font-bold text-[var(--gold)] flex items-center justify-center">
              {cartItemCount}
            </span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="w-8 h-8 rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-[var(--surface-2)]/60 px-5 sm:px-6 py-3 border-b border-[var(--border)]">
          <div className="flex items-center justify-between text-xs text-[var(--text)] mb-1.5 font-sans">
            <span className="flex items-center gap-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
              {remainingForFree > 0 ? (
                <span>
                  {language === 'sw' ? 'Ongeza ' : 'Add '}
                  <strong className="font-mono text-[var(--red)] font-bold">
                    {formatPrice(remainingForFree, currency)}
                  </strong>
                  {language === 'sw' ? ' upate Usafirishaji BURE!' : ' for FREE Delivery!'}
                </span>
              ) : (
                <span className="text-[#25D366] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {language === 'sw' ? 'Umepata Usafirishaji BURE!' : 'FREE Nationwide Delivery Unlocked!'}
                </span>
              )}
            </span>
            <span className="font-mono text-[11px] font-bold text-[var(--gold)] tabular-nums">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-[var(--border)] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[var(--gold)] to-[var(--red)] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-2 divide-y divide-[var(--border)]">
          {detailedCart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-[var(--surface-2)] border border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold)] shadow-lg">
                <ShoppingBag className="w-8 h-8 stroke-[1.75]" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--gold)] font-bold block">
                  {language === 'sw' ? 'KIKAPU KIKO WAZI' : 'BAG IS EMPTY'}
                </span>
                <h3 className="font-heading font-bold text-[var(--text)] text-lg">
                  {language === 'sw' ? 'Kikapu Chako Kiko Wazi' : 'Your Cart is Empty'}
                </h3>
                <p className="text-xs text-[var(--text-muted)] max-w-xs font-sans leading-relaxed">
                  {language === 'sw'
                    ? 'Hujaweka madaftari bado. Gundua vitabu bora vya OMEGA (Q1-Q6) na bahasha za kudumu.'
                    : 'Explore authentic OMEGA Smyth-sewn Counter Books, Exercise Books, and heavy kraft Bahasha.'}
                </p>
              </div>

              {/* Single Red Primary Action Button */}
              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/catalog');
                }}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#D63A3A] hover:bg-[#b91c1c] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-950/40 cursor-pointer group"
                style={{ backgroundColor: '#D63A3A', color: '#FFFFFF' }}
              >
                <span>{language === 'sw' ? 'ANZA KUNUNUA' : 'START SHOPPING'}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Quick Category Chips */}
              <div className="pt-2 w-full space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold block">
                  {language === 'sw' ? 'VIWANGO VINAVYOONGOZA' : 'POPULAR CATEGORIES'}
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {[
                    { label: 'Counter Books', href: '/catalog?category=Counter+Books' },
                    { label: 'Exercise Books', href: '/catalog?category=Exercise+Books' },
                    { label: 'Kraft Bahasha', href: '/catalog?category=Bahasha+%26+Envelopes' },
                    { label: 'Registers', href: '/catalog?category=Registers' },
                  ].map((cat) => (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        navigate(cat.href);
                      }}
                      className="px-3 py-1 rounded-full bg-[var(--surface-2)] hover:border-[var(--gold)] border border-[var(--border)] text-[11px] font-mono font-bold text-[var(--text)] transition-colors cursor-pointer"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            detailedCart.map((item) => (
              <div
                key={item.product.id}
                className="py-4 flex gap-3.5 items-start first:pt-3 group"
              >
                {/* Product Thumbnail on paper surface */}
                <div className="w-16 h-20 rounded-xl bg-[var(--paper)] p-1.5 shrink-0 border border-[var(--border)] shadow-2xs flex items-center justify-center">
                  <ProductImage
                    image={item.product.image}
                    alt={item.product.name}
                    variant="thumb"
                    className="w-full h-full object-contain drop-shadow-xs"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-bold text-[var(--text)] line-clamp-2 leading-snug">
                        {item.product.name}
                      </h4>
                      <p className="text-[10.5px] text-[var(--gold)] font-mono font-bold mt-0.5">
                        {item.product.quire || item.product.pageCount || item.product.category}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveWithUndo(item.product.id, item.product.name, item.quantity)
                      }
                      className="text-[var(--text-muted)] hover:text-[var(--red)] p-1 rounded-md transition-colors shrink-0 cursor-pointer"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Compact Tactile Stepper */}
                    <div className="inline-flex items-center border border-[var(--border)] rounded-full bg-[var(--surface-2)] h-7 px-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity <= 1) {
                            handleRemoveWithUndo(item.product.id, item.product.name, item.quantity);
                          } else {
                            updateCartQuantity(item.product.id, item.quantity - 1);
                          }
                        }}
                        className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[var(--text)] hover:text-[var(--red)] transition-colors rounded-full cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold text-[var(--text)] tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, Math.min(999, item.quantity + 1))}
                        className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[var(--text)] hover:text-[var(--red)] transition-colors rounded-full cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-bold font-mono text-[var(--text)] tabular-nums">
                        {formatPrice(item.lineTotal, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Streamlined Actions */}
        {detailedCart.length > 0 && (
          <div className="p-5 sm:p-6 bg-[var(--surface-1)] border-t border-[var(--border)] space-y-4 shadow-xl">
            <div className="space-y-1.5 text-xs font-sans">
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>{language === 'sw' ? 'Jumla Ndogo' : 'Subtotal'}</span>
                <span className="font-mono font-bold text-[var(--text)] tabular-nums">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>{language === 'sw' ? 'Usafirishaji (Mizigo ya Mabasi)' : 'Delivery (Nationwide Bus Parcel)'}</span>
                <span className="font-mono font-bold text-[#25D366] tabular-nums">
                  {estimatedDelivery === 0 ? 'FREE' : formatPrice(estimatedDelivery, currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[var(--text)] pt-2 border-t border-[var(--border)]">
                <span className="font-heading">{language === 'sw' ? 'Jumla Kuu' : 'Estimated Total'}</span>
                <span className="font-mono text-base sm:text-lg font-black text-[var(--red)] tabular-nums">
                  {formatPrice(cartTotal, currency)}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {/* PRIMARY ACTION: Single Red Button for Checkout */}
              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/cart');
                }}
                className="w-full h-12 px-5 rounded-full bg-[#D63A3A] hover:bg-[#b91c1c] text-white text-xs sm:text-sm font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition-all active:scale-[0.98] cursor-pointer"
                style={{ backgroundColor: '#D63A3A', color: '#FFFFFF' }}
              >
                <span>{language === 'sw' ? 'KAGUA & KUKAMILISHA ODA' : 'REVIEW CART & CHECKOUT'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* SECONDARY ACTION: Direct WhatsApp Order */}
              <a
                href={whatsappCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 px-4 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
                <span>{language === 'sw' ? 'Tuma Oda WhatsApp' : 'Quick Order via WhatsApp'}</span>
              </a>

              {/* SUBTLE FALLBACK: Copy Order Text Link */}
              <button
                type="button"
                onClick={handleCopyOrder}
                className="text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text)] flex items-center justify-center gap-1.5 mx-auto pt-0.5 cursor-pointer transition-colors"
              >
                {copied ? <Check size={12} className="text-[#25D366]" /> : <Copy size={12} />}
                <span>{copied ? 'Order Text Copied!' : 'Copy order summary text'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;

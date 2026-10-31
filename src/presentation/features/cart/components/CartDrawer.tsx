import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, MessageCircle, Truck, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/types/store';

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
    clearCart,
    storeConfig,
    language,
  } = useStore();

  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const currency = storeConfig.currencySymbol || 'TSh';
  const freeThreshold = storeConfig.freeDeliveryThreshold || 250000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const remainingForFree = Math.max(0, freeThreshold - subtotal);

  // Formatted WhatsApp order message
  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');
  const itemsText = detailedCart
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (SKU: ${item.product.sku}) - Qty: ${
          item.quantity
        } × ${currency} ${item.effectiveUnitPrice.toLocaleString()} = ${currency} ${item.lineTotal.toLocaleString()}`
    )
    .join('\n');

  const whatsappCheckoutMessage = encodeURIComponent(
    `*OMEGA STATIONERY ORDER ENQUIRY*\n` +
      `----------------------------------------\n` +
      `Items:\n${itemsText}\n\n` +
      `Subtotal: ${currency} ${subtotal.toLocaleString()}\n` +
      `Estimated Delivery: ${
        estimatedDelivery === 0 ? 'FREE' : `${currency} ${estimatedDelivery.toLocaleString()}`
      }\n` +
      `*Total: ${currency} ${cartTotal.toLocaleString()}*\n` +
      `----------------------------------------\n` +
      `Please confirm stock availability and dispatch time to Dar es Salaam / Upcountry.`
  );

  const whatsappCheckoutUrl = `https://wa.me/${cleanWhatsappDigits}?text=${whatsappCheckoutMessage}`;

  const handleCheckoutPage = () => {
    setIsCartDrawerOpen(false);
    navigate('/cart');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div
        className="relative w-full max-w-md bg-[#FAF6F0] h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slideInRight border-l border-[#E5D8C8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header: Deep Studio Brown #111113 */}
        <div className="bg-gradient-to-r from-[#6B140B] via-[#852512] to-[#9E3618] text-white px-5 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-none bg-white flex items-center justify-center text-[#9E3618] shadow-xs">
              <ShoppingBag className="w-4 h-4 text-[#9E3618]" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase font-heading text-white">
                {language === 'sw' ? 'Mfuko wa Manunuzi' : 'Shopping Bag'}
              </h2>
              <span className="text-[11px] text-amber-200 font-mono font-bold">
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-none text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
          

        {/* Free Shipping Progress Meter */}
        <div className="bg-white border-b border-[#E5D8C8] px-5 py-3 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-[#26130F] mb-1.5">
            <span className="flex items-center gap-1.5 font-bold">
              <Truck className="w-4 h-4 text-[#26130F]" />
              {remainingForFree > 0 ? (
                <span>
                  Add <strong className="text-[#9E3618]">{formatPrice(remainingForFree, currency)}</strong> for FREE Delivery!
                </span>
              ) : (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> You unlocked FREE Delivery!
                </span>
              )}
            </span>
            <span className="font-mono text-[11px] text-[#26130F] font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#f0eee9] rounded-none h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#dc2626] to-amber-500 h-2 rounded-none transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {detailedCart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-none bg-white border border-[#E5D8C8] flex items-center justify-center text-[#a1a1aa] shadow-xs">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-bold text-[#26130F] text-base font-heading">Your shopping bag is empty</h3>
                <p className="text-xs text-[#a1a1aa] mt-1 max-w-xs">
                  Explore our authentic OMEGA Counter Books, Exercise Books, and Bahasha envelopes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/catalog');
                }}
                className="px-6 py-2.5 rounded-none bg-[#9E3618] hover:bg-[#852512] text-white shadow-xs text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            detailedCart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3.5 p-3.5 rounded-none bg-white border border-[#E5D8C8] shadow-2xs hover:border-[#9E3618] transition-all group"
              >
                {/* Clean Product Thumbnail - pure white background, , scale-110 to eliminate white letterboxing */}
                <div className="w-16 h-16 bg-[#FAF6F0] p-2 shadow-2xs shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain  group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-bold text-[#26130F] line-clamp-2 leading-snug">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-500 font-mono">
                        <span>SKU: {item.product.sku}</span>
                        {item.product.category && (
                          <>
                            <span>·</span>
                            <span className="text-[#9E3618] font-semibold">{item.product.category}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-400 hover:text-[#d9534f] p-1 rounded-none hover:bg-stone-50 transition-colors shrink-0"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-1 border-t border-stone-100">
                    {/* Stepper with comfortable tap targets */}
                    <div className="inline-flex items-center border border-[#E5D8C8] rounded-none bg-[#FAF6F0]">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-xs font-bold text-stone-600 hover:text-[#26130F] hover:bg-white transition-colors rounded-l-md"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-7 text-center text-xs font-mono font-bold text-[#26130F]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-xs font-bold text-stone-600 hover:text-[#26130F] hover:bg-white transition-colors rounded-r-md"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-bold font-mono text-[#26130F]">
                        {formatPrice(item.lineTotal, currency)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-stone-400 font-mono block">
                          ({formatPrice(item.effectiveUnitPrice, currency)} ea)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout Actions */}
        {detailedCart.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#E5D8C8] space-y-3.5 shadow-md">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#71717a]">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-[#26130F]">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>
              <div className="flex justify-between text-[#71717a]">
                <span>Delivery (Dar es Salaam / Upcountry)</span>
                <span className="font-mono font-bold text-emerald-600 font-bold">
                  {estimatedDelivery === 0 ? 'FREE' : formatPrice(estimatedDelivery, currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#26130F] pt-2 border-t border-[#E5D8C8]">
                <span className="font-heading">Estimated Total</span>
                <span className="font-mono text-base sm:text-lg font-black text-[#26130F]">
                  {formatPrice(cartTotal, currency)}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {/* WhatsApp Checkout Button (Official WhatsApp Green #25D366) */}
              <a
                href={whatsappCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-none bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Instant Order via WhatsApp</span>
              </a>

              {/* View Full Cart Button (Architectural Studio Copper/Brown) */}
              <button
                type="button"
                onClick={handleCheckoutPage}
                className="w-full py-3.5 px-4 rounded-none bg-[#9E3618] hover:bg-[#852512] text-white shadow-xs text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm group active:scale-[0.98]"
              >
                <span>Review Cart &amp; Invoice Details</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;

import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, MessageCircle, Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../types/store';

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
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div
        className="relative w-full max-w-md bg-[#FBF8F1] h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 border-l border-[#E6E0D2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header: Deep Ink Blue #1E2A5E */}
        <div className="bg-[#1E2A5E] text-white px-5 py-4 border-b border-[#E6E0D2]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#F5A623] flex items-center justify-center text-[#1E2A5E] font-bold">
              <ShoppingBag className="w-4 h-4 text-[#1E2A5E]" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase font-heading text-white">
                Shopping Bag
              </h2>
              <span className="text-[11px] text-[#F5A623] font-mono">
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-white border-b border-[#E6E0D2] px-5 py-3">
          <div className="flex items-center justify-between text-xs font-semibold text-[#1B1F2A] mb-1.5">
            <span className="flex items-center gap-1.5 font-bold">
              <Truck className="w-4 h-4 text-[#1E2A5E]" />
              {remainingForFree > 0 ? (
                <span>
                  Add <strong className="text-[#D64545]">{formatPrice(remainingForFree, currency)}</strong> for FREE Delivery!
                </span>
              ) : (
                <span className="text-[#2A9D8F] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> You unlocked FREE Delivery!
                </span>
              )}
            </span>
            <span className="font-mono text-[11px] text-[#1E2A5E] font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#E6E0D2] rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#F5A623] to-[#2A9D8F] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {detailedCart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-white border border-[#E6E0D2] flex items-center justify-center text-[#6B7280]">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1B1F2A] text-base font-heading">Your shopping bag is empty</h3>
                <p className="text-xs text-[#6B7280] mt-1 max-w-xs">
                  Explore our authentic OMEGA Counter Books, Exercise Books, and Bahasha envelopes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/catalog');
                }}
                className="px-6 py-2.5 rounded-[8px] btn-cta-yellow text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            detailedCart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3.5 p-3 rounded-[12px] bg-white border border-[#E6E0D2] shadow-xs hover:border-[#1E2A5E] transition-colors"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-contain rounded-[8px] bg-[#FBF8F1] p-1 border border-[#E6E0D2] shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-[#1B1F2A] truncate">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[#6B7280] hover:text-[#D64545] p-1 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-[#6B7280] font-mono">
                    {formatPrice(item.effectiveUnitPrice, currency)}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-[#E6E0D2] rounded-[6px] bg-[#FBF8F1]">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-[#1B1F2A] hover:bg-white font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-[#1B1F2A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-[#1B1F2A] hover:bg-white font-bold"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-bold font-mono text-[#1B1F2A]">
                      {formatPrice(item.lineTotal, currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout Actions */}
        {detailedCart.length > 0 && (
          <div className="p-5 bg-white border-t border-[#E6E0D2] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B7280]">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-[#1B1F2A]">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>
              <div className="flex justify-between text-[#6B7280]">
                <span>Delivery (Dar es Salaam / Upcountry)</span>
                <span className="font-mono font-bold text-[#2A9D8F]">
                  {estimatedDelivery === 0 ? 'FREE' : formatPrice(estimatedDelivery, currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1B1F2A] pt-2 border-t border-[#E6E0D2]">
                <span>Estimated Total</span>
                <span className="font-mono text-base font-black text-[#1E2A5E]">
                  {formatPrice(cartTotal, currency)}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {/* WhatsApp Checkout Button */}
              <a
                href={whatsappCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-[12px] bg-[#2A9D8F] hover:bg-[#238276] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Instant Order via WhatsApp</span>
              </a>

              {/* View Full Cart Button (Yellow CTA) */}
              <button
                type="button"
                onClick={handleCheckoutPage}
                className="w-full py-3 px-4 rounded-[12px] btn-cta-yellow text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>Review Cart &amp; Invoice Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

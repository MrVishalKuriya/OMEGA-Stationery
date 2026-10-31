import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  MessageCircle,
  Truck,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    detailedCart,
    cartItemCount,
    subtotal,
    estimatedDelivery,
    cartTotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    storeConfig,
    language,
  } = useStore();

  const currency = storeConfig.currencySymbol || 'TSh';
  const freeShippingThreshold = 150000;
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartDrawerOpen) {
        setIsCartDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartDrawerOpen, setIsCartDrawerOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const cleanWhatsappDigits = (storeConfig.whatsappNumber || '255715268391').replace(/\D/g, '');

  const generateQuickWhatsAppUrl = () => {
    const lines = [
      `*${storeConfig.businessName} — Quick Order*`,
      `----------------------------------------`,
      ...detailedCart.map(
        (item, idx) =>
          `${idx + 1}. ${item.product.name} (${item.product.sku})\n   Qty: ${item.quantity} × ${currency} ${item.effectiveUnitPrice.toLocaleString()} = ${currency} ${item.lineTotal.toLocaleString()}`
      ),
      `----------------------------------------`,
      `*Total: ${currency} ${cartTotal.toLocaleString()}*`,
      `Please confirm availability and delivery schedule.`,
    ];
    return `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111113]/65 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel - Global OMEGA Charcoal & Paper Theme */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={language === 'sw' ? 'Kikapu chako' : 'Shopping Bag'}
        className="relative w-full max-w-md bg-paper-base text-charcoal-ink h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-[#E7E5E0]"
      >
        {/* Header - Global OMEGA Charcoal (#111113) & Crimson (#DC2626) */}
        <div className="px-6 py-5 bg-[#111113] text-white border-b-2 border-[#DC2626] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[4px] bg-[#DC2626] flex items-center justify-center text-white shadow-sm shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg tracking-wider uppercase leading-tight">
                {language === 'sw' ? 'Kikapu Chako' : 'Shopping Bag'}
              </h2>
              <p className="text-xs font-mono font-bold text-[#E4E4E7] mt-0.5">
                {cartItemCount}{' '}
                {language === 'sw'
                  ? 'bidhaa zimechaguliwa'
                  : cartItemCount === 1
                  ? 'item'
                  : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-2 rounded-[4px] bg-[#1C1C20] hover:bg-[#DC2626] text-white transition-colors border border-[#2E2E34] cursor-pointer"
            aria-label="Close shopping bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Progress Bar */}
        {detailedCart.length > 0 && (
          <div className="px-6 py-3.5 bg-white border-b border-[#E7E5E0]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 font-bold text-charcoal-ink">
                <Truck className="w-4 h-4 text-[#DC2626]" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-[#15803D] flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {language === 'sw'
                      ? 'Usafiri wa BURE umefunguliwa!'
                      : 'You unlocked FREE Delivery!'}
                  </span>
                ) : (
                  <span>
                    {language === 'sw'
                      ? `Ongeza ${currency} ${remainingForFreeShipping.toLocaleString()} kupata usafiri BURE`
                      : `Add ${currency} ${remainingForFreeShipping.toLocaleString()} more for FREE Delivery`}
                  </span>
                )}
              </span>
              <span className="font-mono font-bold text-[#B91C1C]">{shippingProgress}%</span>
            </div>
            <div className="w-full h-2 bg-[#E7E5E0] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  remainingForFreeShipping === 0 ? 'bg-[#15803D]' : 'bg-[#DC2626]'
                }`}
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-paper-base">
          {detailedCart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-full bg-white border border-[#E7E5E0] flex items-center justify-center mb-4 text-charcoal-ink shadow-sm">
                <ShoppingBag className="w-9 h-9 text-[#DC2626]" />
              </div>
              <h3 className="font-display text-xl font-bold text-charcoal-ink mb-2">
                {language === 'sw' ? 'Kikapu chako ni tupu' : 'Your shopping bag is empty'}
              </h3>
              <p className="text-sm text-[#3F3F46] font-medium max-w-xs mb-6 leading-relaxed">
                {language === 'sw'
                  ? 'Ongeza madaftari ya OMEGA, counter books, au bahasha za jumla na rejareja kuanza oda yako.'
                  : 'Explore our catalog of OMEGA counter books, student exercise books, and stationery supplies.'}
              </p>
              <Link
                to="/catalog"
                onClick={() => setIsCartDrawerOpen(false)}
                className="px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider rounded-[4px] transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <span>{language === 'sw' ? 'Angalia Bidhaa' : 'Browse Catalog'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            detailedCart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 rounded-[4px] bg-white border border-[#E7E5E0] hover:border-[#DC2626] transition-all shadow-sm"
              >
                <Link
                  to={`/product/${item.product.id}`}
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-20 h-20 aspect-square rounded-lg bg-paper-base border border-[#E7E5E0] p-1.5 shrink-0 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full aspect-square object-cover rounded-lg"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.product.id}`}
                        onClick={() => setIsCartDrawerOpen(false)}
                        className="font-bold text-sm text-charcoal-ink hover:text-[#DC2626] transition-colors line-clamp-2 leading-snug"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#52525B] hover:text-[#DC2626] transition-colors p-1 -mr-1 shrink-0 cursor-pointer"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#3F3F46] font-mono font-semibold mt-0.5">
                      SKU: {item.product.sku} ·{' '}
                      <span className="text-[#B91C1C] font-bold">{item.product.category}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E7E5E0]">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-[#D4D2CD] rounded-[4px] bg-paper-base">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 text-charcoal-ink hover:text-[#DC2626] hover:bg-white transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-mono font-bold text-charcoal-ink">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 text-charcoal-ink hover:text-[#DC2626] hover:bg-white transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-charcoal-ink">
                        {currency} {item.lineTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {detailedCart.length > 0 && (
          <div className="p-6 bg-white border-t-2 border-[#E7E5E0] space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#3F3F46] font-medium">
                <span>{language === 'sw' ? 'Jumla Ndogo' : 'Subtotal'}</span>
                <span className="font-mono font-bold text-charcoal-ink">
                  {currency} {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#3F3F46] font-medium">
                <span>
                  {language === 'sw'
                    ? 'Usafiri (Dar es Salaam / Mikoani)'
                    : 'Delivery (Dar es Salaam / Upcountry)'}
                </span>
                <span className="font-mono font-bold text-[#15803D]">
                  {estimatedDelivery === 0
                    ? language === 'sw'
                      ? 'BURE'
                      : 'FREE'
                    : `${currency} ${estimatedDelivery.toLocaleString()}`}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2.5 border-t border-[#E7E5E0]">
                <span className="font-display font-bold text-charcoal-ink text-base uppercase tracking-wide">
                  {language === 'sw' ? 'Jumla Kuu' : 'Estimated Total'}
                </span>
                <span className="font-mono font-bold text-xl text-charcoal-ink">
                  {currency} {cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <a
                href={generateQuickWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs uppercase tracking-wider rounded-[4px] flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                <span>
                  {language === 'sw'
                    ? 'Agiza Haraka kupitia WhatsApp'
                    : 'Instant Order via WhatsApp'}
                </span>
              </a>

              <Link
                to="/cart"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-3.5 px-4 bg-[#111113] hover:bg-[#DC2626] text-white font-bold text-xs uppercase tracking-wider rounded-[4px] flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>
                  {language === 'sw'
                    ? 'Kagua Kikapu & Maelezo ya Ankara'
                    : 'Review Cart & Invoice Details'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#3F3F46] font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>
                {language === 'sw'
                  ? 'Risiti rasmi ya EFD inatolewa kwa kila oda'
                  : 'Official TRA EFD tax invoice included with every dispatch'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CartDrawer;

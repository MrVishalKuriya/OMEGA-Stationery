import React, { useState } from 'react';
import { X, ShoppingBag, MessageCircle, Heart, Star, Check, ShieldCheck, Truck, Sparkles, Layers, Feather, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../types/store';
import { TRANSLATIONS } from '../data/translations';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    isInWishlist,
    toggleWishlist,
    storeConfig,
    language,
  } = useStore();

  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [selectedQuire, setSelectedQuire] = useState<string>('Q2 (198 Pages)');

  if (!quickViewProduct) return null;

  const t = TRANSLATIONS[language];
  const p = quickViewProduct;
  const currency = storeConfig.currencySymbol || 'TSh';
  const effectivePrice =
    p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price
      ? p.discountPrice
      : p.price;
  const hasDiscount = effectivePrice < p.price;
  const isOutOfStock = p.stockStatus === 'Out of Stock';
  const isWishlisted = isInWishlist(p.id);

  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');
  const directWhatsappUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    `Hello OMEGA Stationery Tanzania, I would like to order: ${p.name} (SKU: ${p.sku}) | Quantity: ${quantity} | Total: ${currency} ${(
      effectivePrice * quantity
    ).toLocaleString()}. Please confirm stock and delivery.`
  )}`;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(p.id, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setQuickViewProduct(null)}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-[24px] overflow-hidden shadow-2xl border border-[#e2dedb] max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon: Deep Mocha #4b423b */}
        <div className="bg-[#4b423b] px-6 py-4 flex items-center justify-between border-b border-[#e2dedb]/20 text-white">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c49b7c] animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#c49b7c] font-mono">
              OMEGA PRODUCT PREVIEW
            </span>
            <span className="text-[#beb5ae] font-mono text-xs">| {p.sku}</span>
          </div>
          <button
            onClick={() => setQuickViewProduct(null)}
            className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-7 flex-1 bg-[#fafafa]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Left: Product Image & Badges */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square w-full rounded-[20px] bg-white border border-[#e2dedb] overflow-hidden p-6 flex items-center justify-center group shadow-sm ledup-card ledup-sheen">
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {p.badge && (
                    <span className="badge-rustic-primary text-[10px] px-2.5 py-1 rounded-full font-bold">
                      {p.badge}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="badge-rustic-secondary text-[9px] px-2 py-0.5 rounded-full font-mono font-bold">
                      Save {Math.round(((p.price - effectivePrice) / p.price) * 100)}%
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors ${
                    isWishlisted ? 'bg-[#D64545] text-white' : 'bg-white text-[#8c847e] hover:text-[#D64545]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>

                <img
                  src={p.image}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Trust micro-badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-[#736c67]">
                <div className="p-2.5 rounded-[14px] bg-white border border-[#e2dedb] flex items-center gap-2 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-[#2A9D8F] shrink-0" />
                  <span>100% Genuine OMEGA</span>
                </div>
                <div className="p-2.5 rounded-[14px] bg-white border border-[#e2dedb] flex items-center gap-2 shadow-xs">
                  <Truck className="w-4 h-4 text-[#c49b7c] shrink-0" />
                  <span>Dar &amp; Upcountry Dispatch</span>
                </div>
              </div>
            </div>

            {/* Right: Details & Purchase Actions */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#c49b7c] font-mono">
                  {p.category}
                </span>

                <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#3b352f] mt-1">
                  {language === 'sw' && p.nameSw ? p.nameSw : p.name}
                </h2>

                {/* Star rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-[#c49b7c]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#c49b7c] stroke-[#c49b7c]" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#3b352f]">4.9</span>
                  <span className="text-xs text-[#8c847e] font-mono">(140+ reviews)</span>
                  <span className="text-xs text-[#2A9D8F] font-semibold bg-emerald-50 px-2 py-0.5 rounded ml-auto">
                    ● {isOutOfStock ? 'Out of Stock' : 'In Stock (Warehouse)'}
                  </span>
                </div>

                {/* Pricing Box */}
                <div className="mt-4 p-4 rounded-[16px] bg-white border border-[#e2dedb] flex items-baseline justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8c847e] block font-mono">
                      Retail Unit Price
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#3b352f] font-mono">
                        {formatPrice(effectivePrice, currency)}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-[#8c847e] line-through font-mono">
                          {formatPrice(p.price, currency)}
                        </span>
                      )}
                    </div>
                  </div>

                  {p.wholesalePrice && (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#c49b7c] block font-mono">
                        Wholesale Carton
                      </span>
                      <span className="text-sm font-bold text-[#4b423b] font-mono">
                        {formatPrice(p.wholesalePrice, currency)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="mt-3 text-xs sm:text-sm text-[#736c67] leading-relaxed">
                  {language === 'sw' && p.descriptionSw ? p.descriptionSw : p.description}
                </p>

                {/* Quire selection if applicable */}
                {p.category === 'Counter Books' && (
                  <div className="mt-4 space-y-1.5">
                    <span className="text-[11px] font-bold text-[#3b352f] uppercase tracking-wider block font-heading">
                      Select Quire Size:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {['Q2 (198 Pages)', 'Q3 (288 Pages)', 'Q4 (384 Pages)'].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setSelectedQuire(q)}
                          className={`py-2 px-2 text-xs font-bold rounded-[12px] border transition-all text-center ${
                            selectedQuire === q
                              ? 'bg-gradient-to-r from-[#a46b44] via-[#c49b7c] to-[#a46b44] text-[#23201d] border-transparent shadow-xs font-bold'
                              : 'bg-white text-[#3b352f] border-[#e2dedb] hover:border-[#c49b7c]'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs font-bold text-[#3b352f] uppercase tracking-wider font-heading">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-[#e2dedb] rounded-[10px] bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-[#3b352f] hover:bg-stone-50 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-mono font-bold text-[#3b352f]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      className="px-3 py-1.5 text-[#3b352f] hover:bg-stone-50 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-[#8c847e] font-mono">
                    Total: {formatPrice(effectivePrice * quantity, currency)}
                  </span>
                </div>
              </div>

              {/* Actions: Add to Cart (Copper CTA) & WhatsApp */}
              <div className="space-y-2 pt-2 border-t border-[#e2dedb]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`py-3 px-4 rounded-[14px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md group ${
                      isOutOfStock
                        ? 'bg-stone-200 text-[#8c847e] cursor-not-allowed'
                        : justAdded
                        ? 'bg-[#4b423b] text-white'
                        : 'btn-ledup-copper'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4 text-[#2A9D8F]" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add {quantity} to Cart</span>
                      </>
                    )}
                  </button>

                  <a
                    href={directWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-[14px] text-xs font-bold uppercase tracking-wider bg-[#4b423b] hover:bg-[#3b352f] text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WhatsApp Order</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  Package,
  Layers,
  BookOpen,
  FileText,
  Plus,
  Minus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/types/store';
import { toast } from 'sonner';
import { getProductImageSrc } from '@/components/ProductImage';
import {
  getProductFamilyOptions,
  normalizeQuireBadge,
  ResolvedProductOption,
} from '@/utils/productVariants';

export const CartDrawer: React.FC = () => {
  const {
    products,
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
    addToCart,
    storeConfig,
    language,
  } = useStore();

  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!isCartDrawerOpen) return null;

  const currency = storeConfig.currencySymbol || 'TSh';
  const freeThreshold = storeConfig.freeDeliveryThreshold || 150000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const remainingForFree = Math.max(0, freeThreshold - subtotal);

  // Formatted WhatsApp order message
  const cleanWhatsappDigits = (storeConfig.whatsappNumber || '255715268391').replace(/\D/g, '');
  const itemsText = detailedCart
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (SKU: ${item.product.sku}) — Qty: ${item.quantity} × ${currency} ${item.effectiveUnitPrice.toLocaleString()} = ${currency} ${item.lineTotal.toLocaleString()}`
    )
    .join('\n');

  const rawOrderSummary =
    `*${storeConfig.businessName || 'OMEGA STATIONERY'} — ORDER*\n` +
    `----------------------------------------\n` +
    `${itemsText}\n\n` +
    `Subtotal: ${currency} ${subtotal.toLocaleString()}\n` +
    `Delivery: ${estimatedDelivery === 0 ? 'FREE' : `${currency} ${estimatedDelivery.toLocaleString()}`}\n` +
    `*Total: ${currency} ${cartTotal.toLocaleString()}*`;

  const whatsappCheckoutUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    rawOrderSummary
  )}`;

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(rawOrderSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied!');
  };

  const handleRemoveWithUndo = (productId: string, productName: string, qty: number) => {
    removeFromCart(productId);
    toast('Removed', {
      description: productName,
      action: {
        label: 'Undo',
        onClick: () => addToCart(productId, qty),
      },
    });
  };

  const handleSwitchCartItemVariant = (
    currentProductId: string,
    currentQty: number,
    targetOption: ResolvedProductOption
  ) => {
    if (!targetOption.targetProduct || targetOption.targetProduct.id === currentProductId) return;
    removeFromCart(currentProductId);
    addToCart(targetOption.targetProduct.id, currentQty);
    toast.success(`${targetOption.shortLabel} · ${formatPrice(targetOption.price, currency)}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div
        className="relative w-full max-w-[360px] sm:max-w-[380px] bg-[#F9F8F6] h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-stone-200/90 text-[#111113]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= 1. COMPACT ICON HEADER ================= */}
        <div className="bg-white px-3.5 py-2.5 border-b border-stone-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#111113] text-white flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5 text-[#dc2626]" />
            </div>
            <h2 className="font-serif text-sm font-bold text-[#111113] tracking-tight">
              {language === 'sw' ? 'Kikapu' : 'Bag'}
            </h2>
            <span className="min-w-[20px] h-[18px] px-1.5 rounded-full bg-[#dc2626]/10 text-[10px] font-mono font-extrabold text-[#dc2626] flex items-center justify-center">
              {cartItemCount}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {detailedCart.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  toast('Bag cleared');
                }}
                title="Clear bag"
                aria-label="Clear bag"
                className="w-7 h-7 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(false)}
              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-[#111113] text-stone-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* ================= 2. SLIM 1-LINE DELIVERY BAR ================= */}
        <div className="bg-white/90 px-3.5 py-1.5 border-b border-stone-200/70 flex items-center gap-2 shrink-0">
          {remainingForFree > 0 ? (
            <Truck className="w-3.5 h-3.5 text-[#8C7355] shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          )}
          <div className="flex-1 bg-stone-200 rounded-full h-1 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-[#dc2626] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-700 shrink-0">
            {remainingForFree > 0 ? `+${formatPrice(remainingForFree, currency)}` : 'Free Ship'}
          </span>
        </div>

        {/* ================= 3. COMPACT CART ITEMS LIST ================= */}
        <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-2">
          {detailedCart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-[#dc2626] shadow-2xs">
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              </div>
              <p className="text-xs font-bold text-stone-600">
                {language === 'sw' ? 'Kikapu Kiko Wazi' : 'Empty Bag'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/catalog');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#111113] hover:bg-[#dc2626] text-white text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{language === 'sw' ? 'Katalogi' : 'Catalog'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            detailedCart.map((item) => {
              const imgSrc = getProductImageSrc(item.product.image);
              const familyOptions = getProductFamilyOptions(item.product, products).filter(
                (opt) => opt.targetProduct
              );
              const qBadge = normalizeQuireBadge(
                item.product.quire,
                item.product.name,
                item.product.category
              );
              const shortPages = item.product.pageCount
                ? item.product.pageCount.replace(/\s*Pages/i, 'P')
                : null;
              const shortPack = item.product.packaging
                ? item.product.packaging.match(/(\d+)\s*(?:Pcs|Boxes|Pkts|Sheets|Sets|Rolls)/i)?.[1]
                : null;

              return (
                <div
                  key={item.product.id}
                  className="p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-2xs hover:border-stone-300 transition-all space-y-2"
                >
                  <div className="flex gap-2.5 items-center">
                    {/* Compact 52x52 Thumbnail */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        navigate(`/product/${item.product.id}`);
                      }}
                      className="w-13 h-13 rounded-lg bg-[#FAF8F5] border border-stone-200/80 p-1 shrink-0 flex items-center justify-center overflow-hidden hover:border-[#dc2626] transition-colors cursor-pointer"
                    >
                      <img
                        src={imgSrc}
                        alt={item.product.name}
                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                        loading="lazy"
                      />
                    </button>

                    {/* Compact Info & Controls */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCartDrawerOpen(false);
                            navigate(`/product/${item.product.id}`);
                          }}
                          className="text-left text-xs font-bold text-[#111113] hover:text-[#dc2626] transition-colors truncate cursor-pointer"
                        >
                          {language === 'sw' && item.product.nameSw
                            ? item.product.nameSw
                            : item.product.name}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveWithUndo(
                              item.product.id,
                              item.product.name,
                              item.quantity
                            )
                          }
                          className="text-stone-400 hover:text-red-600 p-0.5 rounded transition-colors shrink-0 cursor-pointer"
                          title="Remove"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Micro Icon Chips (Minimum Text) */}
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        {qBadge && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-[#dc2626]/10 text-[#dc2626] text-[9.5px] font-mono font-bold">
                            <BookOpen className="w-2.5 h-2.5" />
                            {qBadge}
                          </span>
                        )}
                        {shortPages && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 text-[9.5px] font-mono">
                            <FileText className="w-2.5 h-2.5" />
                            {shortPages}
                          </span>
                        )}
                        {shortPack && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 text-[9.5px] font-mono">
                            <Package className="w-2.5 h-2.5 text-[#8C7355]" />
                            {shortPack}/Box
                          </span>
                        )}
                      </div>

                      {/* Stepper & Price on 1 Compact Line */}
                      <div className="flex items-center justify-between gap-2 mt-1.5">
                        <div className="inline-flex items-center border border-stone-200 rounded-lg bg-stone-50 h-6 px-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity <= 1) {
                                handleRemoveWithUndo(
                                  item.product.id,
                                  item.product.name,
                                  item.quantity
                                );
                              } else {
                                updateCartQuantity(item.product.id, item.quantity - 1);
                              }
                            }}
                            className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-[#111113] hover:bg-white rounded transition-all cursor-pointer"
                            aria-label="Decrease"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-6 text-center text-[11px] font-mono font-extrabold text-[#111113] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                Math.min(999, item.quantity + 1)
                              )
                            }
                            className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-[#111113] hover:bg-white rounded transition-all cursor-pointer"
                            aria-label="Increase"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <span className="text-xs font-black font-mono text-[#111113] tabular-nums">
                          {formatPrice(item.lineTotal, currency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ultra-Compact 1-Line Edition Pill Bar (e.g. Q2 | Q3 | Q4) */}
                  {familyOptions.length > 1 && (
                    <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between gap-1.5">
                      <span className="text-[9.5px] font-mono font-bold text-stone-400 inline-flex items-center gap-1 shrink-0">
                        <Layers className="w-2.5 h-2.5 text-[#dc2626]" />
                      </span>
                      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                        {familyOptions.map((opt) => {
                          const isCurrent = opt.id === item.product.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() =>
                                handleSwitchCartItemVariant(
                                  item.product.id,
                                  item.quantity,
                                  opt
                                )
                              }
                              title={`${opt.shortLabel} · ${formatPrice(opt.price, currency)}`}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all cursor-pointer whitespace-nowrap ${
                                isCurrent
                                  ? 'bg-[#111113] text-white border-[#111113]'
                                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-[#111113]'
                              }`}
                            >
                              {opt.shortLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ================= 4. COMPACT ICON FOOTER ================= */}
        {detailedCart.length > 0 && (
          <div className="p-3 bg-white border-t border-stone-200/90 space-y-2.5 shrink-0">
            {/* Compact 1-Row Total Bar */}
            <div className="px-3 py-2 rounded-xl bg-[#F9F8F6] border border-stone-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-mono text-stone-600">
                <span className="inline-flex items-center gap-1 font-bold text-[#111113]">
                  <Package className="w-3.5 h-3.5 text-[#8C7355]" />
                  {cartItemCount}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <Truck className="w-3.5 h-3.5" />
                  {estimatedDelivery === 0 ? 'Free' : formatPrice(estimatedDelivery, currency)}
                </span>
              </div>

              <div className="text-right">
                <span className="font-mono text-sm sm:text-base font-black text-[#dc2626] tabular-nums">
                  {formatPrice(cartTotal, currency)}
                </span>
              </div>
            </div>

            {/* Compact Action Buttons Row */}
            <div className="grid grid-cols-12 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/cart');
                }}
                className="col-span-6 h-9 px-3 rounded-lg bg-[#111113] hover:bg-[#dc2626] text-white text-[11px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{language === 'sw' ? 'Kagua' : 'Checkout'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <a
                href={whatsappCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-5 h-9 px-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleCopyOrder}
                title={copied ? 'Copied!' : 'Copy order summary'}
                aria-label="Copy order summary"
                className="col-span-1 h-9 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;

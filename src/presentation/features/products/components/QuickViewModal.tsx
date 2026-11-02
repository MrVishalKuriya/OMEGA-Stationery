import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  MessageCircle,
  ShoppingBag,
  Check,
  Star,
  Heart,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  Layers,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  Package,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/types/store';
import {
  getProductFamilyOptions,
  applyOptionToProduct,
  ResolvedProductOption,
} from '@/utils/productVariants';

export const QuickViewModal: React.FC = () => {
  const {
    products,
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    storeConfig,
    language,
    isInWishlist,
    toggleWishlist,
  } = useStore();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);
  const [selectedInlineVariantId, setSelectedInlineVariantId] = useState<string | null>(null);

  useEffect(() => {
    if (quickViewProduct) {
      setQuantity(1);
      setSelectedImageIdx(0);
      setImgError(false);
      setJustAdded(false);
      if (quickViewProduct.variants && quickViewProduct.variants.length > 0) {
        setSelectedInlineVariantId(quickViewProduct.variants[0].id);
      } else {
        setSelectedInlineVariantId(null);
      }
    }
  }, [quickViewProduct]);

  useEffect(() => {
    if (!quickViewProduct) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [quickViewProduct, setQuickViewProduct]);

  const familyOptions = useMemo(() => {
    if (!quickViewProduct) return [];
    return getProductFamilyOptions(quickViewProduct, products);
  }, [quickViewProduct, products]);

  const activeOption = useMemo<ResolvedProductOption | null>(() => {
    if (!quickViewProduct || familyOptions.length === 0) return null;
    if (selectedInlineVariantId) {
      const found = familyOptions.find((o) => o.id === selectedInlineVariantId);
      if (found) return found;
    }
    return familyOptions.find((o) => o.id === quickViewProduct.id) || familyOptions[0];
  }, [quickViewProduct, familyOptions, selectedInlineVariantId]);

  if (!quickViewProduct) return null;

  const product = activeOption
    ? applyOptionToProduct(quickViewProduct, activeOption)
    : quickViewProduct;

  const handleSelectVariantOption = (opt: ResolvedProductOption) => {
    setImgError(false);
    setSelectedImageIdx(0);
    if (opt.targetProduct) {
      setSelectedInlineVariantId(null);
      setQuickViewProduct(opt.targetProduct);
    } else {
      setSelectedInlineVariantId(opt.id);
    }
  };

  const currency = storeConfig?.currencySymbol || 'TSh';
  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stockStatus === 'Out of Stock';

  const effectivePrice =
    product.discountPrice &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  const hasDiscount = effectivePrice < product.price;
  const discountPercent =
    hasDiscount && product.price > 0
      ? Math.round(((product.price - effectivePrice) / product.price) * 100)
      : 0;

  const wholesaleMinMoq = product.wholesaleMinQty || 5;
  const wholesaleRate =
    product.wholesalePrice || Math.round(effectivePrice * 0.9);

  const appliedUnitPrice =
    quantity >= wholesaleMinMoq && wholesaleRate < effectivePrice
      ? wholesaleRate
      : effectivePrice;

  const totalAmount = appliedUnitPrice * quantity;

  const rawGallery =
    activeOption?.inlineVariant?.image
      ? [activeOption.inlineVariant.image, ...(product.gallery || [])]
      : product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  const galleryImages: string[] = rawGallery
    .map((item) => (typeof item === 'string' ? item : item?.src || ''))
    .filter(Boolean);

  const cleanWhatsappDigits = storeConfig?.whatsappNumber
    ? storeConfig.whatsappNumber.replace(/\D/g, '')
    : '255715268391';

  const whatsappMessage = [
    `*${storeConfig?.businessName || 'OMEGA Stationery Tanzania'} — Quick Order*`,
    `----------------------------------------`,
    `*Product:* ${product.name}`,
    `*SKU:* ${product.sku}`,
    product.category ? `*Category:* ${product.category}` : null,
    product.quire ? `*Quire / Edition:* ${product.quire}` : null,
    product.pageCount ? `*Page Count:* ${product.pageCount}` : null,
    product.packaging ? `*Packaging:* ${product.packaging}` : null,
    `*Quantity:* ${quantity} ${quantity === 1 ? 'Unit' : 'Units'}`,
    `*Unit Price:* ${formatPrice(appliedUnitPrice, currency)}`,
    `*Estimated Total:* ${formatPrice(totalAmount, currency)}`,
    `----------------------------------------`,
    language === 'sw'
      ? `Tafadhali thibitisha upatikanaji na utaratibu wa usafirishaji.`
      : `Please confirm availability and dispatch details.`,
  ]
    .filter(Boolean)
    .join('\n');

  const whatsappOrderUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product.id, quantity, quantity >= wholesaleMinMoq);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const specsList = [
    product.quire ? { label: 'Quire', value: product.quire } : null,
    product.pageCount ? { label: 'Pages', value: `${product.pageCount}` } : null,
    product.paperType ? { label: 'Paper / Ruling', value: product.paperType } : null,
    product.packaging ? { label: 'Carton Pack', value: product.packaging } : null,
    ...(product.specifications || []).filter(
      (s) =>
        !s.label.toLowerCase().includes('price list') &&
        !s.value.toLowerCase().includes('pl00001')
    ),
  ]
    .filter((item): item is { label: string; value: string } => Boolean(item))
    .slice(0, 4);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-product-title"
      onClick={() => setQuickViewProduct(null)}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[24px] sm:rounded-[28px] bg-white border border-[#e4e4e7] shadow-[0_28px_80px_rgba(9,9,11,0.35)] text-[#18181b]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close quick view"
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-[#111113] text-[#18181b] hover:text-white border border-[#e4e4e7] shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* ================= LEFT COLUMN: PRODUCT VISUAL & GALLERY ================= */}
          <div className="md:col-span-5 bg-[#f6f5f2] p-5 sm:p-7 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e4e4e7]">
            {/* Top Badges */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {hasDiscount && (
                  <span className="bg-[#F4F1EA] text-[#7A6852] text-[10px] font-bold px-2.5 py-1 rounded-full font-sans uppercase tracking-wider">
                    -{discountPercent}%
                  </span>
                )}
                {product.badge ? (
                  <span className="bg-[#dc2626] text-white text-[10px] font-bold px-2.5 py-1 rounded-full font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {product.badge}
                  </span>
                ) : product.bestSeller ? (
                  <span className="bg-white text-[#dc2626] border border-[#dc2626]/25 text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
                    Bestseller
                  </span>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border cursor-pointer ${
                  isWishlisted
                    ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-sm'
                    : 'bg-white text-[#18181b] hover:text-[#dc2626] border-[#e4e4e7]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Main Product Image */}
            <div className="relative aspect-square w-full rounded-2xl bg-white border border-[#e4e4e7] p-4 flex items-center justify-center overflow-hidden shadow-2xs">
              {!imgError && galleryImages[selectedImageIdx] ? (
                <img
                  src={galleryImages[selectedImageIdx]}
                  alt={product.name}
                  onError={() => setImgError(true)}
                  className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <BookOpen className="w-10 h-10 text-[#111113] mb-2 stroke-[1.5]" />
                  <span className="text-xs font-bold font-mono text-[#71717a]">
                    {product.sku}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip (if multiple images) */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={`${imgUrl}-${idx}`}
                    type="button"
                    onClick={() => {
                      setImgError(false);
                      setSelectedImageIdx(idx);
                    }}
                    className={`w-14 h-14 rounded-xl bg-white p-1 border-2 shrink-0 overflow-hidden transition-all cursor-pointer ${
                      selectedImageIdx === idx
                        ? 'border-[#dc2626] shadow-xs'
                        : 'border-[#e4e4e7] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Footer inside Image Column */}
            <div className="mt-4 pt-3 border-t border-[#e4e4e7] flex items-center justify-between text-[11px] text-[#52525b]">
              <span className="inline-flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#dc2626]" />
                70 GSM Bleed-Proof
              </span>
              <span className="inline-flex items-center gap-1 font-medium">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                31 Regions Dispatch
              </span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PRODUCT DETAILS & WHATSAPP ORDER ================= */}
          <div className="md:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-5 text-left">
            <div className="space-y-4">
              {/* Category, SKU & Stock Row */}
              <div className="flex flex-wrap items-center gap-2 pr-8">
                <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 text-[#111113] text-[10px] font-mono uppercase font-bold tracking-wider">
                  {product.category || 'Stationery'}
                </span>
                <span className="text-[11px] font-mono text-[#71717a]">
                  SKU: {product.sku}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isOutOfStock
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isOutOfStock ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'
                    }`}
                  />
                  {product.stockStatus || 'In Stock'}
                </span>
              </div>

              {/* Product Title & Rating */}
              <div className="space-y-1.5">
                <h2
                  id="quick-view-product-title"
                  className="font-heading text-xl sm:text-2xl font-extrabold text-[#111113] leading-snug"
                >
                  {language === 'sw' && product.nameSw ? product.nameSw : product.name}
                </h2>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-0.5 text-[#dc2626]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#dc2626] text-[#dc2626]" />
                    ))}
                  </div>
                  <span className="font-bold text-[#18181b]">
                    {(product.rating || 4.9).toFixed(1)}
                  </span>
                  <span className="text-[#71717a]">
                    ({product.reviewCount || 120} {language === 'sw' ? 'maoni' : 'verified reviews'})
                  </span>
                </div>
              </div>

              {/* Price & Wholesale Carton Rate Box */}
              <div className="p-3.5 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] block font-bold">
                    {language === 'sw' ? 'Bei ya Rejareja' : 'Unit Price'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-[#111113] font-mono">
                      {formatPrice(appliedUnitPrice, currency)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-[#71717a] line-through font-mono">
                        {formatPrice(product.price, currency)}
                      </span>
                    )}
                  </div>
                </div>

                {product.wholesalePrice && (
                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#e4e4e7] w-full sm:w-auto">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#dc2626] block font-bold">
                      {language === 'sw' ? 'Bei ya Jumla / Katoni' : 'Factory Wholesale Carton'}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-emerald-700 font-mono">
                      {formatPrice(product.wholesalePrice, currency)}
                    </span>
                    {product.packaging && (
                      <span className="block text-[10px] text-[#71717a] font-mono">
                        {product.packaging}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Unified Category / Variant Switcher (Compact, Icon-First, Minimal Text) */}
              {familyOptions.length > 1 && (
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-[#e4e4e7] space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#111113] flex items-center gap-1">
                      <Layers className="w-3 h-3 text-[#dc2626]" />
                      {language === 'sw' ? 'Toleo' : 'Edition'}
                    </span>
                    <span className="text-[10px] font-mono text-[#71717a]">
                      {familyOptions.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {familyOptions.map((opt) => {
                      const isSelected = activeOption?.id === opt.id;
                      const optEffectivePrice =
                        opt.discountPrice && opt.discountPrice > 0 && opt.discountPrice < opt.price
                          ? opt.discountPrice
                          : opt.price;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectVariantOption(opt)}
                          className={`px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer inline-flex items-center gap-2 ${
                            isSelected
                              ? 'bg-[#111113] text-white border-[#111113] shadow-2xs'
                              : 'bg-white text-[#18181b] border-[#e4e4e7] hover:border-[#111113]'
                          }`}
                        >
                          <span className="text-xs font-extrabold font-mono">
                            {opt.shortLabel}
                          </span>
                          <span
                            className={`text-[10px] font-mono ${
                              isSelected ? 'text-zinc-300' : 'text-[#71717a]'
                            }`}
                          >
                            {opt.subLabel}
                          </span>
                          <span
                            className={`text-[11px] font-mono font-black ${
                              isSelected ? 'text-[#f87171]' : 'text-[#dc2626]'
                            }`}
                          >
                            {formatPrice(optEffectivePrice, currency)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#52525b] leading-relaxed line-clamp-3">
                {language === 'sw' && product.descriptionSw
                  ? product.descriptionSw
                  : product.description}
              </p>

              {/* Key Specifications Grid */}
              {specsList.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {specsList.map((spec, idx) => (
                    <div
                      key={`${spec.label}-${idx}`}
                      className="p-2.5 rounded-xl bg-zinc-50 border border-[#e4e4e7] flex items-center gap-2"
                    >
                      <Package className="w-3.5 h-3.5 text-[#dc2626] shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-[10px] font-mono uppercase text-[#71717a] truncate">
                          {spec.label}
                        </span>
                        <span className="block text-xs font-bold text-[#111113] truncate">
                          {spec.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Selector & Live Total */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#18181b] font-mono uppercase">
                    {language === 'sw' ? 'Idadi:' : 'Qty:'}
                  </span>
                  <div className="inline-flex items-center rounded-xl border border-[#e4e4e7] bg-zinc-50 p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                      className="w-7 h-7 rounded-lg bg-white hover:bg-zinc-100 text-[#111113] border border-[#e4e4e7] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-xs text-[#111113]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Increase quantity"
                      className="w-7 h-7 rounded-lg bg-white hover:bg-zinc-100 text-[#111113] border border-[#e4e4e7] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quick Qty Presets */}
                  <div className="hidden sm:flex items-center gap-1">
                    {[1, 5, 10].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setQuantity(preset)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold border transition-all cursor-pointer ${
                          quantity === preset
                            ? 'bg-[#111113] text-white border-[#111113]'
                            : 'bg-white text-[#52525b] border-[#e4e4e7] hover:border-[#111113]'
                        }`}
                      >
                        {preset}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-[#71717a] block">
                    {language === 'sw' ? 'Jumla:' : 'Total:'}
                  </span>
                  <span className="text-base sm:text-lg font-black font-mono text-[#dc2626]">
                    {formatPrice(totalAmount, currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* ================= ACTION BUTTONS: PROMINENT WHATSAPP ORDER + ADD TO CART ================= */}
            <div className="space-y-2.5 pt-3 border-t border-[#e4e4e7]">
              {/* Prominent WhatsApp Order CTA Button */}
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_10px_25px_rgba(37,211,102,0.35)] hover:shadow-[0_14px_30px_rgba(37,211,102,0.5)] transition-all active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#25D366] shrink-0" />
                <span>
                  {language === 'sw'
                    ? 'Agiza Sasa Kupitia WhatsApp'
                    : 'Order Instantly on WhatsApp'}
                </span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>

              {/* Secondary Row: Add to Cart + View Full Details Page */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all font-mono cursor-pointer ${
                    isOutOfStock
                      ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-[#e4e4e7]'
                      : justAdded
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-[#111113] hover:bg-[#dc2626] text-white shadow-xs'
                  }`}
                >
                  {isOutOfStock ? (
                    <span>{language === 'sw' ? 'Imeisha' : 'Out of Stock'}</span>
                  ) : justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{language === 'sw' ? 'Imewekwa!' : 'Added to Cart!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{language === 'sw' ? 'Weka Kwenye Oda' : 'Add to Cart'}</span>
                    </>
                  )}
                </button>

                <Link
                  to={`/product/${product.id}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-[#111113] border border-[#e4e4e7] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors font-mono"
                >
                  <Layers className="w-3.5 h-3.5 text-[#dc2626]" />
                  <span>{language === 'sw' ? 'Maelezo Kamili' : 'Full Product Page'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;

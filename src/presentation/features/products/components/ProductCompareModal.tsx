import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  ArrowLeftRight,
  ShoppingBag,
  Check,
  Sparkles,
  Package,
  Layers,
  BookOpen,
  FileText,
  Ruler,
  ShieldCheck,
  Tag,
  TrendingDown,
  RotateCcw,
  Eye,
  BellRing,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Product, formatPrice } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import { ProductImage } from '@/components/ProductImage';

interface ProductCompareModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialProductIds?: string[];
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const {
    products,
    storeConfig,
    language,
    addToCart,
    setQuickViewProduct,
    setIsCartDrawerOpen,
    compareProductIds,
    isCompareModalOpen,
    setIsCompareModalOpen,
    setCompareProductAtSlot,
    clearCompareProducts,
  } = useStore();

  const [highlightDiffsOnly, setHighlightDiffsOnly] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const effectiveIsOpen = Boolean(isCompareModalOpen || propIsOpen);
  const currency = storeConfig?.currencySymbol || 'TSh';
  const cleanWhatsappDigits = (storeConfig?.whatsappNumber || '255624265480').replace(/\D/g, '');

  const handleClose = () => {
    setIsCompareModalOpen(false);
    if (propOnClose) propOnClose();
  };

  // Close on Escape key
  useEffect(() => {
    if (!effectiveIsOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [effectiveIsOpen]);

  // Resolve Product 1 and Product 2
  const { productA, productB, isSlotBAutoSuggested } = useMemo(() => {
    if (!products || products.length === 0) {
      return { productA: null, productB: null, isSlotBAutoSuggested: false };
    }

    const first =
      products.find((p) => p.id === compareProductIds[0]) || products[0] || null;

    if (compareProductIds.length >= 2) {
      const second = products.find((p) => p.id === compareProductIds[1]) || null;
      if (second && first && second.id !== first.id) {
        return { productA: first, productB: second, isSlotBAutoSuggested: false };
      }
    }

    // If only 1 product was selected, auto-suggest the closest comparable OMEGA item from same category
    if (first) {
      const sameCategoryPeer = products.find(
        (p) => p.id !== first.id && p.category === first.category
      );
      const fallbackPeer = products.find((p) => p.id !== first.id) || null;
      return {
        productA: first,
        productB: sameCategoryPeer || fallbackPeer,
        isSlotBAutoSuggested: true,
      };
    }

    return { productA: null, productB: null, isSlotBAutoSuggested: false };
  }, [products, compareProductIds]);

  const handleSwapItems = () => {
    if (!productA || !productB) return;
    setCompareProductAtSlot(0, productB.id);
    setCompareProductAtSlot(1, productA.id);
  };

  const handleQuickAdd = (product: Product) => {
    const isOutOfStock =
      product.stockStatus === 'Out of Stock' ||
      (typeof product.stockQuantity === 'number' && product.stockQuantity <= 0);

    if (isOutOfStock) {
      handleClose();
      setQuickViewProduct(product);
      return;
    }

    addToCart(product.id, 1);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1300);

    toast.success(language === 'sw' ? 'Imeongezwa kwenye kikapu' : 'Added to cart', {
      description: product.name,
      action: {
        label: language === 'sw' ? 'Tazama' : 'View Cart',
        onClick: () => {
          handleClose();
          setIsCartDrawerOpen(true);
        },
      },
    });
  };

  // Helper to extract a custom specification by keyword from product.specifications
  const extractSpec = (p: Product | null, keywords: string[], fallback?: string): string => {
    if (!p) return '—';
    if (fallback && fallback.trim()) return fallback.trim();
    const match = (p.specifications || []).find((s) =>
      keywords.some((kw) => s.label.toLowerCase().includes(kw.toLowerCase()))
    );
    return match ? match.value : '—';
  };

  const comparisonRows = useMemo(() => {
    if (!productA || !productB) return [];

    const priceA =
      productA.discountPrice && productA.discountPrice > 0 && productA.discountPrice < productA.price
        ? productA.discountPrice
        : productA.price;
    const priceB =
      productB.discountPrice && productB.discountPrice > 0 && productB.discountPrice < productB.price
        ? productB.discountPrice
        : productB.price;

    const wholesaleA = productA.wholesalePrice || Math.round(priceA * 0.9);
    const wholesaleB = productB.wholesalePrice || Math.round(priceB * 0.9);

    const savingsPctA = Math.max(0, Math.round(((productA.price - wholesaleA) / productA.price) * 100));
    const savingsPctB = Math.max(0, Math.round(((productB.price - wholesaleB) / productB.price) * 100));

    const rows = [
      {
        id: 'retail_price',
        label: language === 'sw' ? 'Bei ya Rejareja' : 'Retail Factory Price',
        icon: Tag,
        valA: formatPrice(priceA, currency),
        valB: formatPrice(priceB, currency),
        highlightA: priceA < priceB,
        highlightB: priceB < priceA,
        badgeA: priceA < priceB ? (language === 'sw' ? 'Bei Nafuu' : 'Lower Price') : undefined,
        badgeB: priceB < priceA ? (language === 'sw' ? 'Bei Nafuu' : 'Lower Price') : undefined,
      },
      {
        id: 'wholesale_price',
        label: language === 'sw' ? 'Bei ya Jumla (Katoni)' : 'Wholesale Carton Price',
        icon: TrendingDown,
        valA: `${formatPrice(wholesaleA, currency)} (MOQ: ${productA.wholesaleMinQty || 5}+)`,
        valB: `${formatPrice(wholesaleB, currency)} (MOQ: ${productB.wholesaleMinQty || 5}+)`,
        highlightA: wholesaleA < wholesaleB,
        highlightB: wholesaleB < wholesaleA,
        badgeA: savingsPctA > 0 ? `Save ${savingsPctA}%` : undefined,
        badgeB: savingsPctB > 0 ? `Save ${savingsPctB}%` : undefined,
      },
      {
        id: 'category',
        label: language === 'sw' ? 'Kundi la Bidhaa' : 'Product Category',
        icon: Layers,
        valA: productA.category || '—',
        valB: productB.category || '—',
      },
      {
        id: 'quire',
        label: language === 'sw' ? 'Quire / Toleo' : 'Quire / Series Edition',
        icon: BookOpen,
        valA: extractSpec(productA, ['quire', 'series'], productA.quire),
        valB: extractSpec(productB, ['quire', 'series'], productB.quire),
      },
      {
        id: 'pages',
        label: language === 'sw' ? 'Idadi ya Kurasa' : 'Page Count',
        icon: FileText,
        valA: extractSpec(productA, ['page', 'kurasa', 'sheets'], productA.pageCount),
        valB: extractSpec(productB, ['page', 'kurasa', 'sheets'], productB.pageCount),
        highlightA:
          (parseInt(productA.pageCount || '0', 10) || 0) >
          (parseInt(productB.pageCount || '0', 10) || 0),
        highlightB:
          (parseInt(productB.pageCount || '0', 10) || 0) >
          (parseInt(productA.pageCount || '0', 10) || 0),
        badgeA:
          (parseInt(productA.pageCount || '0', 10) || 0) >
          (parseInt(productB.pageCount || '0', 10) || 0)
            ? 'More Pages'
            : undefined,
        badgeB:
          (parseInt(productB.pageCount || '0', 10) || 0) >
          (parseInt(productA.pageCount || '0', 10) || 0)
            ? 'More Pages'
            : undefined,
      },
      {
        id: 'paper',
        label: language === 'sw' ? 'Aina ya Karatasi & Mistari' : 'Paper GSM & Ruling Style',
        icon: Sparkles,
        valA: extractSpec(
          productA,
          ['paper', 'gsm', 'ruling', 'line'],
          productA.paperType || '70 GSM Pure Woodfree Archival Bond'
        ),
        valB: extractSpec(
          productB,
          ['paper', 'gsm', 'ruling', 'line'],
          productB.paperType || '70 GSM Pure Woodfree Archival Bond'
        ),
      },
      {
        id: 'binding',
        label: language === 'sw' ? 'Ufungaji wa Mgongo' : 'Spine & Binding Architecture',
        icon: ShieldCheck,
        valA: extractSpec(
          productA,
          ['binding', 'cover', 'spine'],
          productA.binding ||
            (productA.category === 'Counter Books'
              ? 'Smyth-Sewn Thread Hardcover (180° Lay-Flat)'
              : productA.category === 'Bahasha & Envelopes'
              ? 'Heavy-Duty Reinforced Kraft'
              : 'Center-Stitched Durable Cover')
        ),
        valB: extractSpec(
          productB,
          ['binding', 'cover', 'spine'],
          productB.binding ||
            (productB.category === 'Counter Books'
              ? 'Smyth-Sewn Thread Hardcover (180° Lay-Flat)'
              : productB.category === 'Bahasha & Envelopes'
              ? 'Heavy-Duty Reinforced Kraft'
              : 'Center-Stitched Durable Cover')
        ),
      },
      {
        id: 'size',
        label: language === 'sw' ? 'Ukubwa / Vipimo' : 'Dimensions & Format Size',
        icon: Ruler,
        valA: extractSpec(productA, ['size', 'dimension', 'format'], productA.size || 'Standard A4 / Folio'),
        valB: extractSpec(productB, ['size', 'dimension', 'format'], productB.size || 'Standard A4 / Folio'),
      },
      {
        id: 'packaging',
        label: language === 'sw' ? 'Ujazo wa Boksi' : 'Factory Carton Packaging',
        icon: Package,
        valA: extractSpec(productA, ['pack', 'carton', 'box', 'bundle'], productA.packaging || 'Standard Factory Carton'),
        valB: extractSpec(productB, ['pack', 'carton', 'box', 'bundle'], productB.packaging || 'Standard Factory Carton'),
      },
      {
        id: 'stock',
        label: language === 'sw' ? 'Hali ya Stoo' : 'Warehouse Availability',
        icon: Check,
        valA:
          productA.stockStatus === 'Out of Stock'
            ? 'Out of Stock'
            : `${productA.stockStatus || 'In Stock'}${
                typeof productA.stockQuantity === 'number' ? ` (${productA.stockQuantity} units)` : ''
              }`,
        valB:
          productB.stockStatus === 'Out of Stock'
            ? 'Out of Stock'
            : `${productB.stockStatus || 'In Stock'}${
                typeof productB.stockQuantity === 'number' ? ` (${productB.stockQuantity} units)` : ''
              }`,
      },
    ];

    if (highlightDiffsOnly) {
      return rows.filter((r) => r.valA.trim().toLowerCase() !== r.valB.trim().toLowerCase());
    }
    return rows;
  }, [productA, productB, currency, language, highlightDiffsOnly]);

  // Floating Compare Pill Bar when modal is closed but user has selected 1 or 2 products
  if (!effectiveIsOpen) {
    if (compareProductIds.length === 0) return null;

    return (
      <div className="fixed bottom-5 left-4 sm:left-6 z-40 pointer-events-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#161518] text-white border border-white/15 shadow-2xl"
        >
          <button
            type="button"
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white hover:text-[#E9B44C] transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4 text-[#D63A3A]" />
            <span>
              {language === 'sw' ? 'Linganisha Bidhaa' : 'Compare Items'} ({compareProductIds.length}/2)
            </span>
          </button>
          <button
            type="button"
            onClick={clearCompareProducts}
            title="Clear comparison"
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    );
  }

  if (!productA || !productB) return null;

  const whatsappComparisonQuoteUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    `Hello OMEGA Stationery Tanzania, I am comparing two products:\n1) ${productA.name} (SKU: ${productA.sku})\n2) ${productB.name} (SKU: ${productB.sku})\nPlease advise on wholesale carton availability and pricing.`
  )}`;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 lg:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Side-by-Side Product Specification Comparison"
          className="relative w-full max-w-5xl max-h-[92vh] bg-[#FAF8F5] text-[#161518] rounded-3xl border border-zinc-200/90 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Top Modal Header */}
          <div className="px-4 sm:px-6 py-4 bg-white border-b border-zinc-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D63A3A]/10 border border-[#D63A3A]/20 flex items-center justify-center text-[#D63A3A] shrink-0">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D63A3A]">
                    OMEGA TECHNICAL BENCHMARK
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[10px] font-mono font-bold">
                    2 ITEMS SIDE-BY-SIDE
                  </span>
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-[#161518] tracking-tight">
                  {language === 'sw'
                    ? 'Ulinganisho wa Vipimo vya Bidhaa'
                    : 'Side-by-Side Specification Comparison'}
                </h2>
              </div>
            </div>

            {/* Header Controls: Highlight Differences, Swap, Clear, Close */}
            <div className="flex items-center gap-2 flex-wrap">
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/70 text-xs font-semibold text-zinc-800 cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={highlightDiffsOnly}
                  onChange={(e) => setHighlightDiffsOnly(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#D63A3A] rounded cursor-pointer"
                />
                <span>{language === 'sw' ? 'Tofauti pekee' : 'Differences Only'}</span>
              </label>

              <button
                type="button"
                onClick={handleSwapItems}
                title="Swap Left & Right Items"
                className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-400 text-xs font-mono font-bold text-zinc-700 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#D63A3A]" />
                <span className="hidden sm:inline">{language === 'sw' ? 'Badilisha Nafasi' : 'Swap'}</span>
              </button>

              {compareProductIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    clearCompareProducts();
                    toast(language === 'sw' ? 'Orodha ya ulinganisho imefutwa' : 'Comparison list reset');
                  }}
                  title="Reset selected products"
                  className="px-2.5 py-1.5 rounded-xl border border-zinc-200 bg-white hover:border-red-300 hover:text-red-600 text-xs font-mono font-bold text-zinc-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{language === 'sw' ? 'Safisha' : 'Reset'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close comparison modal"
                className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* 1. Product Selector & Side-by-Side Visual Showcase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { slot: 0 as const, item: productA, isSuggested: false, badgeLabel: 'ITEM 01' },
                {
                  slot: 1 as const,
                  item: productB,
                  isSuggested: isSlotBAutoSuggested,
                  badgeLabel: 'ITEM 02',
                },
              ].map(({ slot, item, isSuggested, badgeLabel }) => {
                const effectivePrice =
                  item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.price
                    ? item.discountPrice
                    : item.price;
                const isOutOfStock =
                  item.stockStatus === 'Out of Stock' ||
                  (typeof item.stockQuantity === 'number' && item.stockQuantity <= 0);
                const isAdded = justAddedId === item.id;

                return (
                  <div
                    key={`${slot}-${item.id}`}
                    className="bg-white rounded-2xl border border-zinc-200/90 p-4 shadow-2xs flex flex-col justify-between gap-4"
                  >
                    {/* Slot Selector Dropdown */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-zinc-100">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                          {badgeLabel}
                        </span>
                        {isSuggested && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono font-semibold">
                            {language === 'sw' ? 'Chaguo la Kulinganisha' : 'Suggested Pair — Change Below'}
                          </span>
                        )}
                      </div>

                      <select
                        aria-label={`Select OMEGA product for comparison slot ${slot + 1}`}
                        value={item.id}
                        onChange={(e) => setCompareProductAtSlot(slot, e.target.value)}
                        className="max-w-[210px] sm:max-w-[250px] text-xs font-sans font-semibold bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-[#161518] focus:outline-none focus:border-[#D63A3A] cursor-pointer truncate"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.sku})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Product Thumbnail + Core Summary */}
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          handleClose();
                          setQuickViewProduct(item);
                        }}
                        title="Open Quick View"
                        className="relative group/img w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-zinc-100 shrink-0 flex items-center justify-center overflow-hidden cursor-pointer"
                      >
                        <ProductImage
                          image={item.image}
                          alt={item.name}
                          variant="card"
                          bg="white"
                          imgClassName="transition-transform duration-300 group-hover/img:scale-105"
                        />
                        <span className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-4 h-4 text-white" />
                        </span>
                      </button>

                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                            {item.category}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              isOutOfStock
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {isOutOfStock ? 'Out of Stock' : item.stockStatus || 'In Stock'}
                          </span>
                        </div>

                        <Link
                          to={`/product/${item.id}`}
                          onClick={handleClose}
                          className="font-heading text-sm sm:text-base font-bold text-[#161518] hover:text-[#D63A3A] transition-colors line-clamp-2 block"
                        >
                          {language === 'sw' && item.nameSw ? item.nameSw : item.name}
                        </Link>

                        <p className="text-[11px] font-mono text-zinc-500">
                          SKU: <strong className="text-zinc-800">{item.sku}</strong>
                          {item.packaging ? ` · ${item.packaging}` : ''}
                        </p>

                        <div className="pt-1 flex items-baseline gap-2">
                          <span className="text-base sm:text-lg font-mono font-extrabold text-[#161518]">
                            {formatPrice(effectivePrice, currency)}
                          </span>
                          {item.wholesalePrice && (
                            <span className="text-[11px] font-mono font-bold text-emerald-700">
                              Wholesale: {formatPrice(item.wholesalePrice, currency)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-zinc-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(item)}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isOutOfStock
                            ? 'bg-[#25D366] hover:bg-[#1ebe5d] text-white'
                            : isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#161518] hover:bg-[#D63A3A] text-white'
                        }`}
                      >
                        {isOutOfStock ? (
                          <>
                            <BellRing className="w-3.5 h-3.5" />
                            <span>{language === 'sw' ? 'Nijulishe WhatsApp' : 'Notify Me'}</span>
                          </>
                        ) : isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{language === 'sw' ? 'Imeongezwa' : 'Added to Cart'}</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{language === 'sw' ? 'Weka Kikapuni' : 'Add to Cart'}</span>
                          </>
                        )}
                      </button>

                      <Link
                        to={`/product/${item.id}`}
                        onClick={handleClose}
                        className="py-2.5 px-3 rounded-xl border border-zinc-200 hover:border-zinc-400 bg-zinc-50 text-xs font-mono font-bold text-zinc-800 transition-colors"
                      >
                        {language === 'sw' ? 'Maelezo' : 'Details'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. Side-by-Side Technical Specification Matrix */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-2xs">
              <div className="px-4 sm:px-5 py-3 bg-zinc-900 text-white flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  {language === 'sw'
                    ? 'Jedwali la Vipimo vya Kiwandani'
                    : 'Factory Technical Specifications Matrix'}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {comparisonRows.length} {language === 'sw' ? 'Vipengele' : 'Attributes Compared'}
                </span>
              </div>

              {comparisonRows.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 font-sans">
                  {language === 'sw'
                    ? 'Vipimo vyote vinafanana kati ya bidhaa hizi mbili.'
                    : 'All technical specifications are identical between these two items.'}
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {comparisonRows.map((row) => {
                    const IconComponent = row.icon;
                    const isDifferent =
                      row.valA.trim().toLowerCase() !== row.valB.trim().toLowerCase();

                    return (
                      <div
                        key={row.id}
                        className={`grid grid-cols-1 md:grid-cols-12 items-stretch transition-colors ${
                          isDifferent ? 'bg-amber-50/20' : 'bg-white'
                        }`}
                      >
                        {/* Spec Label Column */}
                        <div className="md:col-span-4 px-4 py-3 bg-zinc-50/80 border-b md:border-b-0 md:border-r border-zinc-100 flex items-center gap-2.5">
                          <IconComponent className="w-4 h-4 text-[#D63A3A] shrink-0" />
                          <span className="text-xs font-mono font-bold text-zinc-700">
                            {row.label}
                          </span>
                          {isDifferent && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Values differ" />
                          )}
                        </div>

                        {/* Product A Value */}
                        <div
                          className={`md:col-span-4 px-4 py-3 border-b md:border-b-0 md:border-r border-zinc-100 flex items-center justify-between gap-2 text-xs font-sans ${
                            row.highlightA
                              ? 'bg-emerald-50/50 font-bold text-emerald-950'
                              : 'text-zinc-800 font-medium'
                          }`}
                        >
                          <span className="break-words">{row.valA}</span>
                          {row.badgeA && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold shrink-0">
                              {row.badgeA}
                            </span>
                          )}
                        </div>

                        {/* Product B Value */}
                        <div
                          className={`md:col-span-4 px-4 py-3 flex items-center justify-between gap-2 text-xs font-sans ${
                            row.highlightB
                              ? 'bg-emerald-50/50 font-bold text-emerald-950'
                              : 'text-zinc-800 font-medium'
                          }`}
                        >
                          <span className="break-words">{row.valB}</span>
                          {row.badgeB && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold shrink-0">
                              {row.badgeB}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Full Description Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 items-stretch bg-white">
                    <div className="md:col-span-4 px-4 py-3.5 bg-zinc-50/80 border-b md:border-b-0 md:border-r border-zinc-100 flex items-start gap-2.5">
                      <FileText className="w-4 h-4 text-[#D63A3A] shrink-0 mt-0.5" />
                      <span className="text-xs font-mono font-bold text-zinc-700">
                        {language === 'sw' ? 'Maelezo Kamili' : 'Full Product Description'}
                      </span>
                    </div>
                    <div className="md:col-span-4 px-4 py-3.5 border-b md:border-b-0 md:border-r border-zinc-100 text-xs text-zinc-600 leading-relaxed">
                      {language === 'sw' && productA.descriptionSw
                        ? productA.descriptionSw
                        : productA.description}
                    </div>
                    <div className="md:col-span-4 px-4 py-3.5 text-xs text-zinc-600 leading-relaxed">
                      {language === 'sw' && productB.descriptionSw
                        ? productB.descriptionSw
                        : productB.description}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-4 sm:px-6 py-3.5 bg-white border-t border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <p className="text-xs text-zinc-500 font-sans">
              {language === 'sw'
                ? 'Unaweza kubadilisha bidhaa yoyote hapo juu ili kulinganisha daftari au bahasha tofauti za OMEGA.'
                : 'Tip: Click Compare on any two product cards or use the dropdowns above to compare any two OMEGA items.'}
            </p>
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <a
                href={whatsappComparisonQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>{language === 'sw' ? 'Uliza Bei za Jumla' : 'Inquire Both on WhatsApp'}</span>
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {language === 'sw' ? 'Funga' : 'Done'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductCompareModal;

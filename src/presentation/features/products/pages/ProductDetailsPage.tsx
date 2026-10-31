import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  MessageCircle,
  Check,
  CheckCircle2,
  BookOpen,
  Layers,
  ShieldCheck,
  Truck,
  Phone,
  ChevronDown,
  ChevronUp,
  Star,
  Maximize2,
  X,
  FileText,
  Sparkles,
  Clock,
  MapPin,
  Tag,
  HelpCircle,
  CheckCircle,
  Scissors,
  Droplets,
  Package,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { SEOHead } from '@/components/SEOHead';
import { TRANSLATIONS } from '@/data/translations';
import { Product } from '@/types/store';
import { fetchSingleProductFromDb } from '@/services/api';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, storeConfig, language, isCatalogLoading } = useStore();
  const t = TRANSLATIONS[language];

  const [dbProduct, setDbProduct] = useState<Product | null>(null);
  const [isLoadingDirect, setIsLoadingDirect] = useState<boolean>(false);

  const productFromStore = products.find((p) => p.id === id);
  const product = dbProduct || productFromStore;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);
  const [selectedPhoneDesk, setSelectedPhoneDesk] = useState<string>('255715268391');
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Interactive Accordion States (Open by default: overview & specs)
  const [accordionState, setAccordionState] = useState<{
    overview: boolean;
    specs: boolean;
    wholesale: boolean;
    delivery: boolean;
    guide: boolean;
  }>({
    overview: true,
    specs: true,
    wholesale: true,
    delivery: false,
    guide: false,
  });

  const toggleAccordion = (key: keyof typeof accordionState) => {
    setAccordionState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    setQuantity(1);
    setSelectedImageIdx(0);
    setImgError(false);
    setIsLightboxOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  // Fetch directly from MongoDB for live prices/stock
  useEffect(() => {
    if (id) {
      const controller = new AbortController();
      if (!productFromStore) {
        setIsLoadingDirect(true);
      }
      fetchSingleProductFromDb(id, controller.signal)
        .then((res) => {
          if (res.success && res.data) {
            setDbProduct(res.data);
          }
        })
        .finally(() => setIsLoadingDirect(false));

      return () => controller.abort();
    }
  }, [id]);

  if ((isCatalogLoading && !product) || isLoadingDirect) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-stone-200 h-96 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-stone-200 rounded w-3/4" />
            <div className="h-4 bg-stone-200 rounded w-1/2" />
            <div className="h-24 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-5">
        <SEOHead
          title="Product Not Found"
          description="The requested stationery or book item could not be found in our catalog."
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {language === 'sw' ? 'Bidhaa Haikupatikana' : 'Product Not Found'}
        </h1>
        <p className="text-sm text-slate-600">
          {language === 'sw'
            ? 'Bidhaa unayoitafuta inaweza kuwa imeondolewa au kiungo kimebadilika.'
            : 'The product you are looking for may have been removed or its ID has changed.'}
        </p>
        <div className="pt-2">
          <Link
            to="/catalog"
            className="px-6 py-3 bg-[#111113] text-white text-sm font-semibold rounded-xl hover:bg-[#111113] transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.exploreCatalog}</span>
          </Link>
        </div>
      </div>
    );
  }

  const effectivePrice =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;
  const hasDiscount = effectivePrice < product.price;
  const isOutOfStock = product.stockStatus === 'Out of Stock';

  // Dynamic Tier Pricing Calculator
  const wholesaleMinMoq = product.wholesaleMinQty || 5;
  const wholesaleRate = product.wholesalePrice || Math.round(effectivePrice * 0.92);

  const getTierPrice = (qty: number) => {
    if (qty >= 10) return Math.min(wholesaleRate, Math.round(effectivePrice * 0.88));
    if (qty >= wholesaleMinMoq) return wholesaleRate;
    return effectivePrice;
  };

  const unitPrice = getTierPrice(quantity);
  const subtotal = unitPrice * quantity;
  const regularTotal = effectivePrice * quantity;
  const savings = regularTotal - subtotal;

  const galleryImages =
    product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  // Intelligently choose related products (same category or complementary stationery items)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.featured || p.bestSeller))
    .slice(0, 3);

  const unitLabel = useMemo(() => {
    if (!product) return 'Units';
    const cat = product.category?.toLowerCase() || '';
    if (cat.includes('counter') || cat.includes('exercise')) return 'Books';
    if (cat.includes('bahasha') || cat.includes('envelope')) return 'Packs';
    if (cat.includes('roll')) return 'Rolls';
    if (cat.includes('file')) return 'Files';
    return 'Units';
  }, [product]);

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product.id, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const currency = storeConfig.currencySymbol || 'TSh';

  // Direct WhatsApp formatted message with quote
  const directWhatsappText = [
    `*${storeConfig.businessName} — Official Order Enquiry*`,
    `========================================`,
    `Product: ${product.name}`,
    `SKU Code: ${product.sku}`,
    product.category ? `Category: ${product.category}` : null,
    product.packaging ? `Packaging: ${product.packaging}` : null,
    `Quantity: ${quantity} ${quantity > 1 ? 'Units' : 'Unit'}`,
    `Applied Unit Price: ${currency} ${unitPrice.toLocaleString()}`,
    `Estimated Total: ${currency} ${subtotal.toLocaleString()}`,
    savings > 0 ? `Bulk Savings Applied: ${currency} ${savings.toLocaleString()}` : null,
    `----------------------------------------`,
    `Selected Delivery Destination: Please advise (Dar es Salaam / Upcountry Bus Parcel)`,
    `TRA Fiscal EFD Invoicing: Requested`,
    `Please confirm immediate dispatch readiness and bus waybill cargo options.`,
  ]
    .filter(Boolean)
    .join('\n');

  const directWhatsappUrl = `https://wa.me/${selectedPhoneDesk}?text=${encodeURIComponent(
    directWhatsappText
  )}`;

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#18181b]">
      <SEOHead
        title={`${product.name} (${currency} ${effectivePrice.toLocaleString()}) — OMEGA Stationery`}
        description={product.description}
        product={product}
      />

      {/* Top Value Strip */}
      <div className="bg-[#111113] text-white/90 text-xs py-2 px-4 border-b border-[#3b342e]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e5a962] animate-pulse" />
            <span>
              {language === 'sw'
                ? 'Kiwandani moja kwa moja: Uwasilishaji nchi nzima Tanzania kwa njia ya mabasi'
                : 'Factory-Direct Supply: Reliable nationwide bus parcel dispatch across all 31 regions'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-stone-300">
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#2A9D8F]" />
              <span>TRA Tax Invoicing</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#e5a962]" />
              <span>Upcountry Waybills</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#71717a] flex-wrap"
        >
          <Link to="/" className="hover:text-[#111113] font-semibold transition-colors">
            {t.home}
          </Link>
          <span aria-hidden="true" className="text-stone-300">/</span>
          <Link to="/catalog" className="hover:text-[#111113] font-semibold transition-colors">
            {t.catalog}
          </Link>
          <span aria-hidden="true" className="text-stone-300">/</span>
          <Link
            to={`/catalog?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[#111113] font-semibold transition-colors"
          >
            {product.category}
          </Link>
          <span aria-hidden="true" className="text-stone-300">/</span>
          <span className="text-[#18181b] font-bold truncate max-w-sm">
            {language === 'sw' && product.nameSw ? product.nameSw : product.name}
          </span>
        </nav>

        {/* Main Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN: HIGH-RES GALLERY, LIGHTBOX & QUALITY BADGES */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 space-y-5 lg:sticky lg:top-24">
            
            {/* Primary Visual Display Box */}
            <div className="w-full aspect-square bg-white rounded-2xl border border-[#e4e4e7] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex items-center justify-center p-6 sm:p-10 group">
              
              {/* Badges on Visual */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                {product.badge && (
                  <span className="px-2.5 py-1 rounded-md bg-[#111113] text-[#ef4444] border border-[#dc2626]/30 text-[11px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#ef4444]" />
                    <span>{product.badge}</span>
                  </span>
                )}
                {product.freeDelivery && (
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold uppercase tracking-wider">
                    Free Bus Parcel Elig.
                  </span>
                )}
              </div>

              <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 items-end">
                {hasDiscount && (
                  <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] text-white text-xs font-bold shadow-sm tracking-wide">
                    {Math.round(((product.price - effectivePrice) / product.price) * 100)}% OFF
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-mono font-bold border border-stone-200">
                  {product.sku}
                </span>
              </div>

              {/* Main Image Rendering */}
              {selectedImageIdx < galleryImages.length && !imgError ? (
                <div
                  className="w-full h-full flex items-center justify-center cursor-zoom-in"
                  onClick={() => setIsLightboxOpen(true)}
                  title="Click to view full resolution"
                >
                  <img
                    src={galleryImages[selectedImageIdx]}
                    alt={`${product.name} - View ${selectedImageIdx + 1}`}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="max-h-full max-w-full object-contain filter drop-shadow-lg transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              ) : (
                /* Specification Sheet Preview fallback */
                <div className="w-full h-full p-4 flex items-center justify-center">
                  <div className="w-full max-w-sm border-2 border-[#111113] bg-[#fafafa] p-5 space-y-3 rounded-xl shadow-xs">
                    <div className="text-center border-b border-stone-300 pb-2">
                      <p className="text-lg font-bold tracking-widest text-[#111113] font-heading">
                        OMEGA STATIONERY
                      </p>
                      <p className="text-[11px] font-semibold uppercase text-stone-600">
                        {product.category} · Official Specification
                      </p>
                    </div>
                    <div className="space-y-1.5 text-xs text-stone-700 font-mono">
                      <div className="flex justify-between border-b border-stone-200 pb-1">
                        <span className="font-bold text-[#111113]">Item:</span>
                        <span className="truncate max-w-[180px]">{product.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-stone-200 pb-1">
                        <span className="font-bold text-[#111113]">SKU:</span>
                        <span>{product.sku}</span>
                      </div>
                      {product.specifications.slice(0, 4).map((spec) => (
                        <div key={spec.label} className="flex justify-between border-b border-stone-200 pb-1">
                          <span className="font-bold text-[#111113]">{spec.label}:</span>
                          <span className="truncate max-w-[170px]">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Expand Prompt */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 p-2 rounded-xl bg-white/90 hover:bg-white text-stone-700 hover:text-[#111113] border border-stone-200 shadow-xs transition-all flex items-center gap-1.5 text-xs font-semibold"
                aria-label="Expand image"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Zoom Full-Res</span>
              </button>
            </div>

            {/* Thumbnail Navigation Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {galleryImages.map((imgUrl, index) => (
                <button
                  key={`${imgUrl}-${index}`}
                  type="button"
                  onClick={() => {
                    setImgError(false);
                    setSelectedImageIdx(index);
                  }}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all bg-white p-1 flex items-center justify-center ${
                    selectedImageIdx === index
                      ? 'border-[#111113] ring-2 ring-[#dc2626] shadow-sm'
                      : 'border-[#e4e4e7] hover:border-stone-400'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${index + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}

              <button
                type="button"
                onClick={() => setSelectedImageIdx(galleryImages.length)}
                className={`h-16 px-3.5 rounded-xl border-2 shrink-0 flex flex-col items-center justify-center bg-white text-[11px] font-bold transition-all ${
                  selectedImageIdx === galleryImages.length
                    ? 'border-[#111113] text-[#111113] ring-2 ring-[#dc2626]'
                    : 'border-[#e4e4e7] text-stone-600 hover:border-stone-400'
                }`}
              >
                <FileText className="w-4 h-4 mb-0.5 text-[#dc2626]" />
                <span>Specs Sheet</span>
              </button>
            </div>

            {/* 4 Contextual Feature Pills under Visual */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center">
              <div className="p-2.5 rounded-xl bg-white border border-[#e4e4e7] shadow-2xs">
                {product.category?.includes('Bahasha') ? (
                  <ShieldCheck className="w-4 h-4 text-[#2A9D8F] mx-auto mb-1" />
                ) : product.category?.includes('File') || product.name.includes('Jaradio') ? (
                  <Droplets className="w-4 h-4 text-[#2A9D8F] mx-auto mb-1" />
                ) : (
                  <Layers className="w-4 h-4 text-[#dc2626] mx-auto mb-1" />
                )}
                <span className="text-[11px] font-bold text-[#111113] block truncate">
                  {product.category?.includes('Bahasha')
                    ? 'Reinforced'
                    : product.name.includes('Jaradio')
                    ? 'Waterproof'
                    : 'Thread-Sewn'}
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  {product.category?.includes('Bahasha')
                    ? 'Heavy Kraft Paper'
                    : product.name.includes('Jaradio')
                    ? 'Vinyl Moisture Barrier'
                    : 'Durable Spine Binding'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#e4e4e7] shadow-2xs">
                <FileText className="w-4 h-4 text-[#111113] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#111113] block truncate">
                  {product.paperType ? 'Pure Paper' : 'Factory Grade'}
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  {product.paperType || 'Standard Specification'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#e4e4e7] shadow-2xs">
                <Package className="w-4 h-4 text-[#dc2626] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#111113] block truncate">
                  {product.packaging ? 'Master Box' : 'Wholesale'}
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  {product.packaging || 'Bulk Factory Crate'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#e4e4e7] shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#2A9D8F] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#111113] block truncate">Genuine</span>
                <span className="text-[10px] text-stone-500 block truncate">Indigo Printed Ltd</span>
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: INFORMATION, DYNAMIC PRICING, HOTLINES & ACCORDIONS */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header, Title & Tags */}
            <div className="space-y-3 border-b border-[#e4e4e7] pb-5">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-2.5 py-1 rounded-md bg-[#111113] text-white font-mono font-bold">
                  OFFICIAL FACTORY
                </span>
                <span className="px-2.5 py-1 rounded-md bg-stone-200 text-stone-800 font-mono font-semibold">
                  SKU: {product.sku}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#dc2626]/15 text-[#111113] font-bold">
                  {product.category}
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18181b] leading-tight">
                {language === 'sw' && product.nameSw ? product.nameSw : product.name}
              </h1>

              {product.subtitle && (
                <p className="text-sm sm:text-base font-medium text-[#dc2626]">
                  {language === 'sw' && product.subtitleSw ? product.subtitleSw : product.subtitle}
                </p>
              )}

              {/* Rating & Stock Badges */}
              <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-stone-800">{product.rating || 4.8}</span>
                  <span className="text-stone-500">({product.reviewCount || 160} reviews)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-stone-400">·</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                      product.stockStatus === 'In Stock'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        : product.stockStatus === 'Low Stock'
                        ? 'bg-[#dc2626]/20 text-[#ef4444] border border-[#dc2626]/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/25'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {product.stockStatus === 'In Stock'
                      ? 'In Stock · Ready for Bus Dispatch'
                      : product.stockStatus === 'Low Stock'
                      ? `Low Stock (Limited ${unitLabel})`
                      : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Box with Wholesale Tier Indicator */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e4e4e7] shadow-xs space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-500 font-bold block mb-1">
                    {t.retailPrice}
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#111113] font-mono tracking-tight">
                      {currency} {unitPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-base text-stone-400 line-through font-mono">
                        {currency} {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {product.wholesalePrice && (
                  <div className="text-right p-3 rounded-xl bg-[#2A9D8F]/10 border border-[#2A9D8F]/25">
                    <span className="text-[11px] font-bold text-[#2A9D8F] uppercase tracking-wider block">
                      Wholesale Rate (5+ {unitLabel})
                    </span>
                    <span className="text-base font-black text-[#111113] font-mono">
                      {currency} {wholesaleRate.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      Save {currency} {(effectivePrice - wholesaleRate).toLocaleString()} per {unitLabel.toLowerCase().slice(0, -1) || 'unit'}
                    </span>
                  </div>
                )}
              </div>

              {/* Volume Discount Tiers Strip */}
              <div className="pt-2 border-t border-stone-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                  Volume Pricing Tiers:
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div
                    onClick={() => setQuantity(1)}
                    className={`p-2 rounded-xl text-center border cursor-pointer transition-all ${
                      quantity < wholesaleMinMoq
                        ? 'bg-[#111113] text-white border-[#111113] shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span className="block font-bold">1 – 4 {unitLabel}</span>
                    <span className="text-[11px] font-mono">{currency} {effectivePrice.toLocaleString()}</span>
                  </div>

                  <div
                    onClick={() => setQuantity(5)}
                    className={`p-2 rounded-xl text-center border cursor-pointer transition-all ${
                      quantity >= wholesaleMinMoq && quantity < 10
                        ? 'bg-[#111113] text-white border-[#111113] shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span className="block font-bold">5 – 9 {unitLabel}</span>
                    <span className="text-[11px] font-mono">{currency} {wholesaleRate.toLocaleString()}</span>
                    <span className="text-[9px] text-[#e5a962] block font-bold">Bulk Tier</span>
                  </div>

                  <div
                    onClick={() => setQuantity(10)}
                    className={`p-2 rounded-xl text-center border cursor-pointer transition-all ${
                      quantity >= 10
                        ? 'bg-[#111113] text-white border-[#111113] shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span className="block font-bold">10+ {unitLabel}</span>
                    <span className="text-[11px] font-mono">
                      {currency} {getTierPrice(10).toLocaleString()}
                    </span>
                    <span className="text-[9px] text-[#2A9D8F] block font-bold">Carton Rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector, Subtotal & Live Order Action Box */}
            <div className="bg-white border border-[#e4e4e7] rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="pdp-quantity"
                    className="block text-xs font-bold text-[#111113] uppercase tracking-wider"
                  >
                    Select Quantity ({unitLabel})
                  </label>
                  <div className="inline-flex items-center border border-[#e4e4e7] rounded-xl bg-[#fafafa]">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={isOutOfStock || quantity <= 1}
                      aria-label="Decrease quantity"
                      className="p-2.5 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      id="pdp-quantity"
                      type="number"
                      min={1}
                      max={999}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!Number.isNaN(val)) {
                          setQuantity(Math.max(1, Math.min(999, val)));
                        }
                      }}
                      disabled={isOutOfStock}
                      className="w-16 text-center text-sm font-bold text-[#18181b] font-mono focus:outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(999, q + 1))}
                      disabled={isOutOfStock}
                      aria-label="Increase quantity"
                      className="p-2.5 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-stone-500 font-medium">Order Subtotal</p>
                  <p className="text-2xl font-black text-[#111113] font-mono">
                    {currency} {subtotal.toLocaleString()}
                  </p>
                  {savings > 0 && (
                    <span className="text-[11px] font-bold text-[#2A9D8F] block">
                      You save {currency} {savings.toLocaleString()}!
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[10px] font-bold uppercase text-stone-500">Quick Pick:</span>
                {[1, 5, 10, 20, 50].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuantity(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      quantity === preset
                        ? 'bg-[#111113] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    +{preset} {unitLabel}
                  </button>
                ))}
              </div>

              {/* Official Sales Desk Hotline Chooser */}
              <div className="pt-3 border-t border-stone-200/80 space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
                  Select Order Hotline Desk:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { label: 'KANTI BHAI K. HALAI', role: 'Managing Director', digits: '255715268391', number: '+255 715 268 391' },
                    { label: 'VIJESH K. HALAI', role: 'Managing Director', digits: '255624265480', number: '+255 624 265 480' },
                    { label: 'Mbeya Hub', role: 'Soweto SIDO', digits: '255746268391', number: '+255 746 268 391' },
                    { label: 'Mwanza Hub', role: 'Lake Zone Branch', digits: '255699032777', number: '+255 699 032 777' },
                  ].map((d) => (
                    <button
                      key={d.digits}
                      type="button"
                      onClick={() => setSelectedPhoneDesk(d.digits)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        selectedPhoneDesk === d.digits
                          ? 'bg-white border-[#111113] ring-2 ring-[#dc2626] font-bold shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      <p className="text-[10px] text-[#dc2626] font-bold truncate">{d.label}</p>
                      <p className="font-mono text-xs text-stone-900 mt-0.5">{d.number}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Add to Order & Order via WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className={`w-full py-4 px-5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                      : justAdded
                      ? 'bg-[#16a34a] text-white'
                      : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-md shadow-red-600/20 active:scale-[0.98]'
                  }`}
                >
                  {isOutOfStock ? (
                    t.outOfStock
                  ) : justAdded ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>{t.addedToOrder}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t.addToOrder}</span>
                    </>
                  )}
                </button>

                <a
                  href={directWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* ================================================================= */}
            {/* INTERACTIVE ACCORDION DETAILS SECTION (ACORDING DETAILS DISPLAY) */}
            {/* ================================================================= */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#dc2626] font-heading">
                  Product Details &amp; Specifications
                </h2>
                <span className="text-[11px] text-stone-500">Tap sections to expand</span>
              </div>

              {/* 1. OVERVIEW & PROTECTION BENEFITS */}
              <div className="border border-[#e4e4e7] rounded-2xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion('overview')}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-[#111113] hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Droplets className="w-4 h-4 text-[#2A9D8F]" />
                    <span>Product Overview &amp; Shield Features</span>
                  </div>
                  {accordionState.overview ? (
                    <ChevronUp className="w-4 h-4 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </button>
                {accordionState.overview && (
                  <div className="px-5 pb-5 pt-1 space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-stone-100">
                    <p>
                      {language === 'sw' && product.descriptionSw
                        ? product.descriptionSw
                        : product.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-[#fafafa] border border-stone-200/80 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#2A9D8F] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[#111113]">
                            {product.binding ? 'Guaranteed Binding' : 'Factory Grade Craft'}
                          </strong>
                          <span className="text-[11px] text-stone-600">
                            {product.binding || 'Engineered for durability under rigorous daily classroom & office handling.'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#fafafa] border border-stone-200/80 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#2A9D8F] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[#111113]">
                            {product.paperType ? 'Paper Standard' : 'Material Quality'}
                          </strong>
                          <span className="text-[11px] text-stone-600">
                            {product.paperType || 'Standard high-performance material manufactured to strict Tanzanian norms.'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#fafafa] border border-stone-200/80 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#2A9D8F] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[#111113]">Master Packaging</strong>
                          <span className="text-[11px] text-stone-600">
                            {product.packaging ? `${product.packaging} sealed in heavy corrugated protective carton.` : 'Packed in heavy moisture-proof protective cartons for long-distance transit.'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#fafafa] border border-stone-200/80 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#2A9D8F] shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[#111113]">Indigo Printed Limited Hallmark</strong>
                          <span className="text-[11px] text-stone-600">
                            Manufactured at Plot 30, Block F Kilwa Rd, Mkuranga.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. COMPLETE TECHNICAL SPECIFICATIONS ACCORDION */}
              <div className="border border-[#e4e4e7] rounded-2xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion('specs')}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-[#111113] hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-[#dc2626]" />
                    <span>Technical Specifications &amp; Parameters</span>
                  </div>
                  {accordionState.specs ? (
                    <ChevronUp className="w-4 h-4 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </button>
                {accordionState.specs && (
                  <div className="px-5 pb-5 pt-1 space-y-3 border-t border-stone-100">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <tbody className="divide-y divide-stone-200">
                        <tr className="bg-white">
                          <th className="py-2.5 px-3 font-semibold text-stone-600 bg-stone-50 w-2/5">
                            Product SKU
                          </th>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#111113]">
                            {product.sku}
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <th className="py-2.5 px-3 font-semibold text-stone-600 bg-stone-50">
                            Category
                          </th>
                          <td className="py-2.5 px-3 text-[#18181b]">
                            {product.category}
                          </td>
                        </tr>
                        {product.packaging && (
                          <tr className="bg-white">
                            <th className="py-2.5 px-3 font-semibold text-stone-600 bg-stone-50">
                              Packaging Unit
                            </th>
                            <td className="py-2.5 px-3 text-[#18181b]">
                              {product.packaging}
                            </td>
                          </tr>
                        )}
                        {product.specifications.map((spec) => (
                          <tr key={spec.label} className="bg-white">
                            <th className="py-2.5 px-3 font-semibold text-stone-600 bg-stone-50">
                              {spec.label}
                            </th>
                            <td className="py-2.5 px-3 font-medium text-[#18181b]">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-white">
                          <th className="py-2.5 px-3 font-semibold text-stone-600 bg-stone-50">
                            Manufacturer &amp; Factory
                          </th>
                          <td className="py-2.5 px-3 text-[#18181b]">
                            Indigo Printed Limited · Plot 30, Block F Kilwa Rd, Mkuranga, Dar es Salaam
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <th className="py-2.5 px-3 font-semibold text-stone-600 bg-stone-50">
                            Price List Reference
                          </th>
                          <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold">
                            PL00001 (Official Factory Benchmark)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 3. WHOLESALE, SCHOOL TENDERS & TRA INVOICING */}
              <div className="border border-[#e4e4e7] rounded-2xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion('wholesale')}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-[#111113] hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#e5a962]" />
                    <span>Wholesale, School Tenders &amp; TRA Tax Invoicing</span>
                  </div>
                  {accordionState.wholesale ? (
                    <ChevronUp className="w-4 h-4 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </button>
                {accordionState.wholesale && (
                  <div className="px-5 pb-5 pt-1 space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-stone-100">
                    <p>
                      OMEGA Stationery is an authorized manufacturing partner supplying wholesale book covers and writing stationery across Tanzania:
                    </p>
                    <ul className="space-y-1.5 list-disc list-inside text-stone-600">
                      <li><strong>TRA Fiscal EFD Invoices:</strong> Issued with all corporate, school, and government tender consignments.</li>
                      <li><strong>Carton Crate Savings:</strong> Special discounted rates for wholesale carton orders (10+ rolls).</li>
                      <li><strong>School Supplies:</strong> Trusted by primary and secondary academies in Mbeya, Dar es Salaam, Mwanza, Arusha, and Dodoma.</li>
                      <li><strong>Direct Payment Options:</strong> CRDB, NMB, M-Pesa Till, Airtel Money, or Cash on Pickup at Soweto SIDO Viwandani.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* 4. BUS CARGO & UPCOUNTRY REGIONAL DISPATCH */}
              <div className="border border-[#e4e4e7] rounded-2xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion('delivery')}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-[#111113] hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-[#2A9D8F]" />
                    <span>Upcountry Bus Parcel Delivery (All 31 Regions)</span>
                  </div>
                  {accordionState.delivery ? (
                    <ChevronUp className="w-4 h-4 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </button>
                {accordionState.delivery && (
                  <div className="px-5 pb-5 pt-1 space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-stone-100">
                    <p>
                      We deliver daily consignments via reliable scheduled bus companies:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <strong className="block text-[#111113]">Dar es Salaam</strong>
                        <span>Same-day or next-day direct van drop-off.</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <strong className="block text-[#111113]">Upcountry Regions</strong>
                        <span>BM Coach, Shabiby, Dar Express, New Force parcel tracking.</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-500 pt-1">
                      Waybill numbers are forwarded instantly via WhatsApp as soon as parcels are dispatched.
                    </p>
                  </div>
                )}
              </div>

              {/* 5. APPLICATION & COVERING GUIDE */}
              <div className="border border-[#e4e4e7] rounded-2xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion('guide')}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-[#111113] hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#dc2626]" />
                    <span>How to Wrap &amp; Cover Books (Application Guide)</span>
                  </div>
                  {accordionState.guide ? (
                    <ChevronUp className="w-4 h-4 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </button>
                {accordionState.guide && (
                  <div className="px-5 pb-5 pt-1 space-y-2 text-xs sm:text-sm text-stone-700 leading-relaxed border-t border-stone-100">
                    <ol className="list-decimal list-inside space-y-1.5 text-stone-600">
                      <li><strong>Measure:</strong> Open the counter book or exercise book flat on the roll.</li>
                      <li><strong>Cut:</strong> Leave 3 cm margin on top, bottom, and side flaps. Cut with scissors.</li>
                      <li><strong>Fold Spine:</strong> Make small cuts at the top and bottom of the spine fold.</li>
                      <li><strong>Secure:</strong> Fold side flaps neatly inside the cover and secure with clear tape.</li>
                    </ol>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* ===================================================================== */}
        {/* RELATED COMPLEMENTARY PRODUCTS SECTION */}
        {/* ===================================================================== */}
        {relatedProducts.length > 0 && (
          <section className="pt-12 border-t border-[#e4e4e7] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#dc2626] font-heading block">
                  Frequently Purchased Together
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#18181b] tracking-tight">
                  Complementary Books &amp; Stationery
                </h2>
              </div>
              <Link
                to={`/catalog?category=${encodeURIComponent(product.category)}`}
                className="text-xs sm:text-sm font-bold text-[#dc2626] hover:text-[#b91c1c] inline-flex items-center gap-1"
              >
                <span>View Full Catalog →</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* ======================================================================= */}
      {/* HIGH-RES IMAGE LIGHTBOX MODAL */}
      {/* ======================================================================= */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-[#e5a962] transition-colors focus:outline-none"
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Expanded Image */}
            <div className="w-full max-h-[75vh] flex items-center justify-center p-2">
              <img
                src={galleryImages[selectedImageIdx]}
                alt={product.name}
                className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Bottom Thumbnail Strip inside Lightbox */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto p-2 bg-black/40 rounded-xl">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-14 rounded-lg overflow-hidden border-2 transition-all p-0.5 ${
                      selectedImageIdx === idx ? 'border-[#e5a962] scale-105' : 'border-white/30 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Maximize2,
  X,
  FileText,
  Sparkles,
  HelpCircle,
  CheckCircle,
  Droplets,
  Package,
} from 'lucide-react';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { SEOHead } from '@/components/SEOHead';
import { TRANSLATIONS } from '@/data/translations';
import { Product } from '@/types/store';
import { fetchSingleProductFromDb } from '@/services/api';
import { triggerCartConfetti } from '@/utils/confetti';

/**
 * ProductDetailsPage — Built strictly according to public/uploads/DESIGN.md
 * Warm Tactile Minimal architecture:
 * - Charcoal Ink (#111113)
 * - Soft Paper Base (#F9F8F6)
 * - Pure Paper Surface (#FFFFFF)
 * - Wax Seal Vermilion (#DC2626)
 * - Leather Ochre (#8C7355)
 * - Hairline Border (#E7E5E0)
 * - Vellum Highlight (#F2EFEB)
 */
export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, storeConfig, language, isCatalogLoading } = useStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

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

  // Interactive Accordion States
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
          <div className="bg-[#E7E5E0] h-96 rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-[#E7E5E0] rounded-md w-3/4" />
            <div className="h-4 bg-[#E7E5E0] rounded-md w-1/2" />
            <div className="h-24 bg-[#E7E5E0] rounded-md" />
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
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111113] font-heading">
          {language === 'sw' ? 'Bidhaa Haikupatikana' : 'Product Not Found'}
        </h1>
        <p className="text-sm text-[#6E6B66]">
          {language === 'sw'
            ? 'Bidhaa unayoitafuta inaweza kuwa imeondolewa au kiungo kimebadilika.'
            : 'The product you are looking for may have been removed or its ID has changed.'}
        </p>
        <div className="pt-2">
          <Link
            to="/catalog"
            className="px-6 py-3 bg-[#111113] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-[#262524] transition-colors inline-flex items-center gap-2 shadow-2xs"
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

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.featured || p.bestSeller))
    .slice(0, 3);

  const unitLabel = (() => {
    if (!product) return 'Units';
    const cat = product.category?.toLowerCase() || '';
    if (cat.includes('counter') || cat.includes('exercise')) return 'Books';
    if (cat.includes('bahasha') || cat.includes('envelope')) return 'Packs';
    if (cat.includes('roll')) return 'Rolls';
    if (cat.includes('file')) return 'Files';
    return 'Units';
  })();

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product.id, quantity);
    triggerCartConfetti();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const currency = storeConfig.currencySymbol || 'TSh';

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
    <div className="bg-[#F9F8F6] min-h-screen text-[#111113]">
      <SEOHead
        title={`${product.name} (${currency} ${effectivePrice.toLocaleString()}) — OMEGA Stationery`}
        description={product.description}
        product={product}
      />

      {/* Top Value Strip (DESIGN.md: Charcoal Ink #111113 & Ochre #8C7355) */}
      <div className="bg-[#111113] text-white/90 text-xs py-2 px-4 border-b border-[#262524] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8C7355]/60 to-transparent border-t border-dashed border-[#8C7355]/40" />
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-3 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8C7355] animate-pulse" />
            <span className="text-[11px] sm:text-xs">
              {language === 'sw'
                ? 'Kiwandani moja kwa moja: Uwasilishaji nchi nzima Tanzania kwa njia ya mabasi'
                : 'Factory-Direct Supply: Nationwide bus parcel dispatch across all 31 regions'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#D5D2CC]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#8C7355]" />
              <span>TRA Tax Invoicing</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#8C7355]" />
              <span>Upcountry Waybills</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#6E6B66] flex-wrap"
        >
          <Link to="/" className="hover:text-[#111113] font-medium transition-colors">
            {t.home}
          </Link>
          <span aria-hidden="true" className="text-[#D5D2CC]">/</span>
          <Link to="/catalog" className="hover:text-[#111113] font-medium transition-colors">
            {t.catalog}
          </Link>
          <span aria-hidden="true" className="text-[#D5D2CC]">/</span>
          <Link
            to={`/catalog?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[#111113] font-medium transition-colors"
          >
            {product.category}
          </Link>
          <span aria-hidden="true" className="text-[#D5D2CC]">/</span>
          <span className="text-[#111113] font-semibold truncate max-w-sm">
            {language === 'sw' && product.nameSw ? product.nameSw : product.name}
          </span>
        </nav>

        {/* Main Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN: HIGH-RES GALLERY, LIGHTBOX & QUALITY BADGES */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 space-y-5 lg:sticky lg:top-24">
            
            {/* Primary Visual Display Box (DESIGN.md: rounded-lg 8px, pure paper surface) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full aspect-square bg-[#FFFFFF] rounded-lg border border-[#E7E5E0] shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] relative overflow-hidden flex items-center justify-center p-6 sm:p-10 group"
            >
              {/* Badges on Visual */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
                {product.badge && (
                  <Chip
                    size="small"
                    icon={<Sparkles className="w-3 h-3 text-[#FFFFFF]" />}
                    label={product.badge}
                    sx={{
                      bgcolor: '#111113',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '0.68rem',
                      borderRadius: '4px',
                    }}
                  />
                )}
                {product.freeDelivery && (
                  <Chip
                    size="small"
                    label="Free Bus Parcel Elig."
                    sx={{
                      bgcolor: 'rgba(22, 163, 74, 0.08)',
                      color: '#166534',
                      border: '1px solid rgba(22, 163, 74, 0.25)',
                      fontWeight: 600,
                      fontSize: '0.65rem',
                      borderRadius: '4px',
                    }}
                  />
                )}
              </div>

              <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
                {hasDiscount && (
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#DC2626] text-white text-[10px] font-bold shadow-2xs tracking-wide">
                    {Math.round(((product.price - effectivePrice) / product.price) * 100)}% OFF
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-[4px] bg-[#F2EFEB] text-[#111113] border border-[#E7E5E0] text-[10px] font-mono font-medium shadow-2xs">
                  {product.sku}
                </span>
              </div>

              {/* Main Image Rendering (Centered, Symmetrical, Never Clipped) */}
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
                    className="max-h-full max-w-full object-contain object-center drop-shadow-sm transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
                  />
                </div>
              ) : (
                /* Specification Sheet Preview fallback */
                <div className="w-full h-full p-4 flex items-center justify-center">
                  <div className="w-full max-w-sm bg-[#F9F8F6] p-5 space-y-3 rounded-md border border-[#E7E5E0] shadow-2xs">
                    <div className="text-center border-b border-[#E7E5E0] pb-2">
                      <p className="text-lg font-bold tracking-widest text-[#111113] font-heading">
                        OMEGA STATIONERY
                      </p>
                      <p className="text-[11px] font-semibold uppercase text-[#6E6B66]">
                        {product.category} · Official Specification
                      </p>
                    </div>
                    <div className="space-y-1.5 text-xs text-[#111113] font-mono">
                      <div className="flex justify-between border-b border-[#E7E5E0] pb-1">
                        <span className="font-semibold">Item:</span>
                        <span className="truncate max-w-[180px]">{product.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#E7E5E0] pb-1">
                        <span className="font-semibold">SKU:</span>
                        <span>{product.sku}</span>
                      </div>
                      {product.specifications.slice(0, 4).map((spec) => (
                        <div key={spec.label} className="flex justify-between border-b border-[#E7E5E0] pb-1">
                          <span className="font-semibold">{spec.label}:</span>
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
                className="absolute bottom-3 right-3 p-2 rounded-md bg-[#FFFFFF] hover:bg-[#F9F8F6] text-[#111113] shadow-2xs border border-[#E7E5E0] transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                aria-label="Expand image"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#8C7355]" />
                <span className="hidden sm:inline">Zoom Full-Res</span>
              </button>
            </motion.div>

            {/* Thumbnail Navigation Row */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {galleryImages.map((imgUrl, index) => (
                <button
                  key={`${imgUrl}-${index}`}
                  type="button"
                  onClick={() => {
                    setImgError(false);
                    setSelectedImageIdx(index);
                  }}
                  className={`w-18 h-15 rounded-md overflow-hidden border shrink-0 transition-all bg-[#FFFFFF] p-1 flex items-center justify-center cursor-pointer ${
                    selectedImageIdx === index
                      ? 'border-[#111113] ring-1 ring-[#111113] shadow-2xs'
                      : 'border-[#E7E5E0] hover:border-[#8C7355]/60'
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
                className={`h-15 px-3 rounded-md border shrink-0 flex flex-col items-center justify-center bg-[#FFFFFF] text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedImageIdx === galleryImages.length
                    ? 'border-[#111113] text-[#111113] ring-1 ring-[#111113]'
                    : 'border-[#E7E5E0] text-[#6E6B66] hover:border-[#8C7355]/60'
                }`}
              >
                <FileText className="w-4 h-4 mb-0.5 text-[#8C7355]" />
                <span>Specs Sheet</span>
              </button>
            </div>

            {/* 4 Contextual Feature Pills under Visual (DESIGN.md: 4px radius) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
              <div className="p-2.5 rounded-md bg-[#FFFFFF] border border-[#E7E5E0] shadow-2xs">
                {product.category?.includes('Bahasha') ? (
                  <ShieldCheck className="w-4 h-4 text-[#8C7355] mx-auto mb-1" />
                ) : product.category?.includes('File') || product.name.includes('Jaradio') ? (
                  <Droplets className="w-4 h-4 text-[#8C7355] mx-auto mb-1" />
                ) : (
                  <Layers className="w-4 h-4 text-[#8C7355] mx-auto mb-1" />
                )}
                <span className="text-[11px] font-semibold text-[#111113] block truncate">
                  {product.category?.includes('Bahasha')
                    ? 'Reinforced'
                    : product.name.includes('Jaradio')
                    ? 'Waterproof'
                    : 'Thread-Sewn'}
                </span>
                <span className="text-[10px] text-[#6E6B66] block truncate">
                  {product.category?.includes('Bahasha')
                    ? 'Kraft Paper'
                    : product.name.includes('Jaradio')
                    ? 'Moisture Barrier'
                    : '180° Lay-Flat'}
                </span>
              </div>

              <div className="p-2.5 rounded-md bg-[#FFFFFF] border border-[#E7E5E0] shadow-2xs">
                <FileText className="w-4 h-4 text-[#111113] mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-[#111113] block truncate">
                  {product.paperType ? 'Pure Paper' : 'Factory Grade'}
                </span>
                <span className="text-[10px] text-[#6E6B66] block truncate">
                  {product.paperType || 'Standard Spec'}
                </span>
              </div>

              <div className="p-2.5 rounded-md bg-[#FFFFFF] border border-[#E7E5E0] shadow-2xs">
                <Package className="w-4 h-4 text-[#8C7355] mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-[#111113] block truncate">
                  {product.packaging ? 'Master Box' : 'Wholesale'}
                </span>
                <span className="text-[10px] text-[#6E6B66] block truncate">
                  {product.packaging || 'Factory Crate'}
                </span>
              </div>

              <div className="p-2.5 rounded-md bg-[#FFFFFF] border border-[#E7E5E0] shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-[#111113] block truncate">Genuine</span>
                <span className="text-[10px] text-[#6E6B66] block truncate">Indigo Printed Ltd</span>
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: INFORMATION, DYNAMIC PRICING, HOTLINES & ACCORDIONS */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header, Title & Tags */}
            <div className="space-y-3 border-b border-[#E7E5E0] pb-5">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <Chip
                  size="small"
                  label="OFFICIAL FACTORY"
                  sx={{
                    bgcolor: '#111113',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    letterSpacing: '0.04em',
                    borderRadius: '4px',
                  }}
                />
                <Chip
                  size="small"
                  label={`SKU: ${product.sku}`}
                  sx={{
                    bgcolor: '#F2EFEB',
                    color: '#111113',
                    border: '1px solid #E7E5E0',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    fontSize: '0.68rem',
                    borderRadius: '4px',
                  }}
                />
                <Chip
                  size="small"
                  label={product.category}
                  sx={{
                    bgcolor: '#F9F8F6',
                    color: '#111113',
                    border: '1px solid #E7E5E0',
                    fontWeight: 600,
                    fontSize: '0.68rem',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#111113] leading-tight">
                {language === 'sw' && product.nameSw ? product.nameSw : product.name}
              </h1>

              {product.subtitle && (
                <p className="text-sm sm:text-base font-medium text-[#8C7355]">
                  {language === 'sw' && product.subtitleSw ? product.subtitleSw : product.subtitle}
                </p>
              )}

              {/* Rating & Stock Badges */}
              <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Rating
                    value={product.rating || 4.8}
                    precision={0.1}
                    readOnly
                    size="small"
                    sx={{ color: '#8C7355' }}
                  />
                  <span className="font-semibold text-[#111113]">{product.rating || 4.8}</span>
                  <span className="text-[#6E6B66]">({product.reviewCount || 160} reviews)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#D5D2CC]">·</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-xs font-semibold ${
                      product.stockStatus === 'In Stock'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : product.stockStatus === 'Low Stock'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {product.stockStatus === 'In Stock'
                      ? 'In Stock · Ready for Bus Dispatch'
                      : product.stockStatus === 'Low Stock'
                      ? `Low Stock (Limited ${unitLabel})`
                      : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Box with Wholesale Tier Indicator (DESIGN.md: 8px radius) */}
            <div className="p-5 sm:p-6 rounded-lg bg-[#FFFFFF] border border-[#E7E5E0] shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] space-y-4 relative overflow-hidden">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#6E6B66] font-semibold block mb-1">
                    {t.retailPrice}
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-bold text-[#111113] font-mono tracking-tight">
                      {currency} {unitPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-base text-[#6E6B66] line-through font-mono">
                        {currency} {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {product.wholesalePrice && (
                  <div className="text-right p-3 rounded-md bg-[#F9F8F6] border border-[#E7E5E0]">
                    <span className="text-[11px] font-bold text-[#8C7355] uppercase tracking-wider block">
                      Wholesale Rate (5+ {unitLabel})
                    </span>
                    <span className="text-base font-bold text-[#111113] font-mono">
                      {currency} {wholesaleRate.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#6E6B66] block mt-0.5">
                      Save {currency} {(effectivePrice - wholesaleRate).toLocaleString()} per {unitLabel.toLowerCase().slice(0, -1) || 'unit'}
                    </span>
                  </div>
                )}
              </div>

              {/* Volume Discount Tiers Strip */}
              <div className="pt-2 border-t border-[#E7E5E0]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6B66] block mb-2">
                  Volume Pricing Tiers:
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div
                    onClick={() => setQuantity(1)}
                    className={`p-2.5 rounded-md text-center border cursor-pointer transition-all ${
                      quantity < wholesaleMinMoq
                        ? 'bg-[#111113] text-[#FFFFFF] border-[#111113] shadow-2xs'
                        : 'bg-[#F9F8F6] text-[#111113] border-[#E7E5E0] hover:border-[#8C7355]/50'
                    }`}
                  >
                    <span className="block font-semibold">1 – 4 {unitLabel}</span>
                    <span className="text-[11px] font-mono">{currency} {effectivePrice.toLocaleString()}</span>
                  </div>

                  <div
                    onClick={() => setQuantity(5)}
                    className={`p-2.5 rounded-md text-center border cursor-pointer transition-all ${
                      quantity >= wholesaleMinMoq && quantity < 10
                        ? 'bg-[#111113] text-[#FFFFFF] border-[#111113] shadow-2xs'
                        : 'bg-[#F9F8F6] text-[#111113] border-[#E7E5E0] hover:border-[#8C7355]/50'
                    }`}
                  >
                    <span className="block font-semibold">5 – 9 {unitLabel}</span>
                    <span className="text-[11px] font-mono">{currency} {wholesaleRate.toLocaleString()}</span>
                    <span className="text-[9px] text-[#8C7355] block font-semibold">Bulk Tier</span>
                  </div>

                  <div
                    onClick={() => setQuantity(10)}
                    className={`p-2.5 rounded-md text-center border cursor-pointer transition-all ${
                      quantity >= 10
                        ? 'bg-[#111113] text-[#FFFFFF] border-[#111113] shadow-2xs'
                        : 'bg-[#F9F8F6] text-[#111113] border-[#E7E5E0] hover:border-[#8C7355]/50'
                    }`}
                  >
                    <span className="block font-semibold">10+ {unitLabel}</span>
                    <span className="text-[11px] font-mono">
                      {currency} {getTierPrice(10).toLocaleString()}
                    </span>
                    <span className="text-[9px] text-[#8C7355] block font-semibold">Carton Rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector, Subtotal & Live Order Action Box */}
            <div className="bg-[#FFFFFF] rounded-lg p-5 space-y-4 border border-[#E7E5E0] shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="pdp-quantity"
                    className="block text-xs font-semibold text-[#111113] uppercase tracking-wider"
                  >
                    Select Quantity ({unitLabel})
                  </label>
                  <div className="inline-flex items-center rounded-md bg-[#F9F8F6] border border-[#E7E5E0] p-0.5">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={isOutOfStock || quantity <= 1}
                      aria-label="Decrease quantity"
                      className="p-2 text-[#111113] hover:bg-white rounded-[4px] disabled:opacity-40 transition-colors cursor-pointer"
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
                      className="w-16 text-center text-sm font-bold text-[#111113] font-mono focus:outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(999, q + 1))}
                      disabled={isOutOfStock}
                      aria-label="Increase quantity"
                      className="p-2 text-[#111113] hover:bg-white rounded-[4px] disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-[#6E6B66]">Order Subtotal</p>
                  <p className="text-2xl font-bold text-[#111113] font-mono">
                    {currency} {subtotal.toLocaleString()}
                  </p>
                  {savings > 0 && (
                    <span className="text-[11px] font-semibold text-[#DC2626] block">
                      You save {currency} {savings.toLocaleString()}!
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[10px] font-semibold uppercase text-[#6E6B66]">Quick Pick:</span>
                {[1, 5, 10, 20, 50].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuantity(preset)}
                    className={`px-3 py-1 rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
                      quantity === preset
                        ? 'bg-[#111113] text-[#FFFFFF] shadow-2xs'
                        : 'bg-[#F9F8F6] text-[#111113] border border-[#E7E5E0] hover:border-[#8C7355]/50'
                    }`}
                  >
                    +{preset} {unitLabel}
                  </button>
                ))}
              </div>

              {/* Official Sales Desk Hotline Chooser */}
              <div className="pt-3 border-t border-[#E7E5E0] space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6B66] block">
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
                      className={`p-2.5 rounded-md text-left border transition-all cursor-pointer ${
                        selectedPhoneDesk === d.digits
                          ? 'bg-[#F2EFEB] border-[#111113] ring-1 ring-[#111113] font-semibold shadow-2xs'
                          : 'bg-[#FFFFFF] border-[#E7E5E0] text-[#6E6B66] hover:border-[#8C7355]/50'
                      }`}
                    >
                      <p className="text-[10px] text-[#8C7355] font-semibold truncate">{d.label}</p>
                      <p className="font-mono text-xs text-[#111113] mt-0.5">{d.number}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Primary (#111113) & WhatsApp (#25D366) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className={`w-full py-3.5 px-5 rounded-md text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer ${
                    isOutOfStock
                      ? 'bg-[#E7E5E0] text-[#6E6B66] cursor-not-allowed'
                      : justAdded
                      ? 'bg-[#16a34a] text-white'
                      : 'bg-[#111113] hover:bg-[#262524] text-[#FFFFFF] shadow-sm'
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
                </motion.button>

                <motion.a
                  whileTap={{ scale: 0.98 }}
                  href={directWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-md text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Order on WhatsApp</span>
                </motion.a>
              </div>
            </div>

            {/* ================================================================= */}
            {/* INTERACTIVE ACCORDION DETAILS SECTION (DESIGN.md: 8px radius) */}
            {/* ================================================================= */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8C7355] font-heading">
                  Product Details &amp; Specifications
                </h2>
                <span className="text-[11px] text-[#6E6B66]">Tap sections to expand</span>
              </div>

              {/* 1. OVERVIEW & PROTECTION BENEFITS */}
              <div className="rounded-lg bg-[#FFFFFF] border border-[#E7E5E0] overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion('overview')}
                  className="w-full p-4 text-left flex items-center justify-between font-semibold text-sm text-[#111113] hover:bg-[#F9F8F6] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Droplets className="w-4 h-4 text-[#8C7355]" />
                    <span>Product Overview &amp; Shield Features</span>
                  </div>
                  {accordionState.overview ? (
                    <ChevronUp className="w-4 h-4 text-[#6E6B66]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6E6B66]" />
                  )}
                </button>
                <AnimatePresence>
                  {accordionState.overview && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 pt-1 space-y-4 text-xs sm:text-sm text-[#111113] leading-relaxed border-t border-[#E7E5E0]"
                    >
                      <p className="text-[#6E6B66]">
                        {language === 'sw' && product.descriptionSw
                          ? product.descriptionSw
                          : product.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-3.5 rounded-md bg-[#F9F8F6] border border-[#E7E5E0] flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-[#111113]">
                              {product.binding ? 'Guaranteed Binding' : 'Factory Grade Craft'}
                            </strong>
                            <span className="text-[11px] text-[#6E6B66]">
                              {product.binding || 'Engineered for durability under rigorous daily classroom & office handling.'}
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-md bg-[#F9F8F6] border border-[#E7E5E0] flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-[#111113]">
                              {product.paperType ? 'Paper Standard' : 'Material Quality'}
                            </strong>
                            <span className="text-[11px] text-[#6E6B66]">
                              {product.paperType || 'Standard high-performance 70 GSM pulp manufactured to strict Tanzanian norms.'}
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-md bg-[#F9F8F6] border border-[#E7E5E0] flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-[#111113]">Master Packaging</strong>
                            <span className="text-[11px] text-[#6E6B66]">
                              {product.packaging ? `${product.packaging} sealed in heavy corrugated protective carton.` : 'Packed in heavy moisture-proof protective cartons for long-distance transit.'}
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-md bg-[#F9F8F6] border border-[#E7E5E0] flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-[#111113]">Indigo Printed Limited Hallmark</strong>
                            <span className="text-[11px] text-[#6E6B66]">
                              Manufactured at Plot 30, Block F Kilwa Rd, Mkuranga.
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. COMPLETE TECHNICAL SPECIFICATIONS ACCORDION */}
              <div className="rounded-lg bg-[#FFFFFF] border border-[#E7E5E0] overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion('specs')}
                  className="w-full p-4 text-left flex items-center justify-between font-semibold text-sm text-[#111113] hover:bg-[#F9F8F6] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-[#8C7355]" />
                    <span>Technical Specifications &amp; Parameters</span>
                  </div>
                  {accordionState.specs ? (
                    <ChevronUp className="w-4 h-4 text-[#6E6B66]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6E6B66]" />
                  )}
                </button>
                <AnimatePresence>
                  {accordionState.specs && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 pt-1 space-y-3 border-t border-[#E7E5E0]"
                    >
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <tbody className="divide-y divide-[#E7E5E0]">
                          <tr className="bg-[#FFFFFF]">
                            <th className="py-2.5 px-3 font-semibold text-[#6E6B66] bg-[#F9F8F6] w-2/5 rounded-l-md">
                              Product SKU
                            </th>
                            <td className="py-2.5 px-3 font-mono font-bold text-[#111113] rounded-r-md">
                              {product.sku}
                            </td>
                          </tr>
                          <tr className="bg-[#FFFFFF]">
                            <th className="py-2.5 px-3 font-semibold text-[#6E6B66] bg-[#F9F8F6] rounded-l-md">
                              Category
                            </th>
                            <td className="py-2.5 px-3 text-[#111113] rounded-r-md">
                              {product.category}
                            </td>
                          </tr>
                          {product.packaging && (
                            <tr className="bg-[#FFFFFF]">
                              <th className="py-2.5 px-3 font-semibold text-[#6E6B66] bg-[#F9F8F6] rounded-l-md">
                                Packaging Unit
                              </th>
                              <td className="py-2.5 px-3 text-[#111113] rounded-r-md">
                                {product.packaging}
                              </td>
                            </tr>
                          )}
                          {product.specifications.map((spec) => (
                            <tr key={spec.label} className="bg-[#FFFFFF]">
                              <th className="py-2.5 px-3 font-semibold text-[#6E6B66] bg-[#F9F8F6] rounded-l-md">
                                {spec.label}
                              </th>
                              <td className="py-2.5 px-3 font-medium text-[#111113] rounded-r-md">
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-[#FFFFFF]">
                            <th className="py-2.5 px-3 font-semibold text-[#6E6B66] bg-[#F9F8F6] rounded-l-md">
                              Manufacturer &amp; Factory
                            </th>
                            <td className="py-2.5 px-3 text-[#111113] rounded-r-md">
                              Indigo Printed Limited · Plot 30, Block F Kilwa Rd, Mkuranga, Dar es Salaam
                            </td>
                          </tr>
                          <tr className="bg-[#FFFFFF]">
                            <th className="py-2.5 px-3 font-semibold text-[#6E6B66] bg-[#F9F8F6] rounded-l-md">
                              Price List Reference
                            </th>
                            <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold rounded-r-md">
                              PL00001 (Official Factory Benchmark)
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. WHOLESALE, SCHOOL TENDERS & TRA INVOICING */}
              <div className="rounded-lg bg-[#FFFFFF] border border-[#E7E5E0] overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion('wholesale')}
                  className="w-full p-4 text-left flex items-center justify-between font-semibold text-sm text-[#111113] hover:bg-[#F9F8F6] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#8C7355]" />
                    <span>Wholesale, School Tenders &amp; TRA Tax Invoicing</span>
                  </div>
                  {accordionState.wholesale ? (
                    <ChevronUp className="w-4 h-4 text-[#6E6B66]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6E6B66]" />
                  )}
                </button>
                <AnimatePresence>
                  {accordionState.wholesale && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 pt-1 space-y-3 text-xs sm:text-sm text-[#6E6B66] leading-relaxed border-t border-[#E7E5E0]"
                    >
                      <p>
                        OMEGA Stationery is an authorized manufacturing partner supplying wholesale book covers and writing stationery across Tanzania:
                      </p>
                      <ul className="space-y-1.5 list-disc list-inside text-[#111113]">
                        <li><strong>TRA Fiscal EFD Invoices:</strong> Issued with all corporate, school, and government tender consignments.</li>
                        <li><strong>Carton Crate Savings:</strong> Special discounted rates for wholesale carton orders (10+ rolls).</li>
                        <li><strong>School Supplies:</strong> Trusted by primary and secondary academies in Mbeya, Dar es Salaam, Mwanza, Arusha, and Dodoma.</li>
                        <li><strong>Direct Payment Options:</strong> CRDB, NMB, M-Pesa Till, Airtel Money, or Cash on Pickup at Soweto SIDO Viwandani.</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. BUS CARGO & UPCOUNTRY REGIONAL DISPATCH */}
              <div className="rounded-lg bg-[#FFFFFF] border border-[#E7E5E0] overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion('delivery')}
                  className="w-full p-4 text-left flex items-center justify-between font-semibold text-sm text-[#111113] hover:bg-[#F9F8F6] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-[#8C7355]" />
                    <span>Upcountry Bus Parcel Delivery (All 31 Regions)</span>
                  </div>
                  {accordionState.delivery ? (
                    <ChevronUp className="w-4 h-4 text-[#6E6B66]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6E6B66]" />
                  )}
                </button>
                <AnimatePresence>
                  {accordionState.delivery && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 pt-1 space-y-3 text-xs sm:text-sm text-[#6E6B66] leading-relaxed border-t border-[#E7E5E0]"
                    >
                      <p>
                        We deliver daily consignments via reliable scheduled bus companies:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-3 rounded-md bg-[#F9F8F6] border border-[#E7E5E0]">
                          <strong className="block text-[#111113]">Dar es Salaam</strong>
                          <span>Same-day or next-day direct van drop-off.</span>
                        </div>
                        <div className="p-3 rounded-md bg-[#F9F8F6] border border-[#E7E5E0]">
                          <strong className="block text-[#111113]">Upcountry Regions</strong>
                          <span>BM Coach, Shabiby, Dar Express, New Force parcel tracking.</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#6E6B66] pt-1">
                        Waybill numbers are forwarded instantly via WhatsApp as soon as parcels are dispatched.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 5. APPLICATION & COVERING GUIDE */}
              <div className="rounded-lg bg-[#FFFFFF] border border-[#E7E5E0] overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion('guide')}
                  className="w-full p-4 text-left flex items-center justify-between font-semibold text-sm text-[#111113] hover:bg-[#F9F8F6] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#8C7355]" />
                    <span>How to Wrap &amp; Cover Books (Application Guide)</span>
                  </div>
                  {accordionState.guide ? (
                    <ChevronUp className="w-4 h-4 text-[#6E6B66]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6E6B66]" />
                  )}
                </button>
                <AnimatePresence>
                  {accordionState.guide && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 pt-1 space-y-2 text-xs sm:text-sm text-[#6E6B66] leading-relaxed border-t border-[#E7E5E0]"
                    >
                      <ol className="list-decimal list-inside space-y-1.5 text-[#111113]">
                        <li><strong>Measure:</strong> Open the counter book or exercise book flat on the roll.</li>
                        <li><strong>Cut:</strong> Leave 3 cm margin on top, bottom, and side flaps. Cut with scissors.</li>
                        <li><strong>Fold Spine:</strong> Make small cuts at the top and bottom of the spine fold.</li>
                        <li><strong>Secure:</strong> Fold side flaps neatly inside the cover and secure with clear tape.</li>
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>

        </div>

        {/* ===================================================================== */}
        {/* RELATED COMPLEMENTARY PRODUCTS SECTION */}
        {/* ===================================================================== */}
        {relatedProducts.length > 0 && (
          <section className="pt-12 border-t border-[#E7E5E0] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7355] font-heading block">
                  Frequently Purchased Together
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-semibold text-[#111113] tracking-tight">
                  Complementary Books &amp; Stationery
                </h2>
              </div>
              <Link
                to={`/catalog?category=${encodeURIComponent(product.category)}`}
                className="text-xs sm:text-sm font-semibold text-[#111113] hover:text-[#DC2626] inline-flex items-center gap-1 transition-colors"
              >
                <span>View Full Catalog →</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-[#111113]/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-[#8C7355] transition-colors focus:outline-none cursor-pointer"
                aria-label="Close lightbox"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="w-full max-h-[75vh] flex items-center justify-center p-2">
                <img
                  src={galleryImages[selectedImageIdx]}
                  alt={product.name}
                  className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl border border-[#E7E5E0]"
                />
              </div>

              {galleryImages.length > 1 && (
                <div className="flex items-center gap-2 mt-4 overflow-x-auto p-2 bg-black/40 rounded-md border border-white/20">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`w-16 h-14 rounded-[4px] overflow-hidden border transition-all p-0.5 cursor-pointer ${
                        selectedImageIdx === idx ? 'border-[#8C7355] scale-105' : 'border-white/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailsPage;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Feather,
  Package,
  Layers,
  Star,
  Check,
  Truck,
  Eye,
  Percent,
  CheckCircle2,
  BookOpen,
  Award,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';
import { TRANSLATIONS } from '../data/translations';
import { formatPrice } from '../types/store';

export const HomePage: React.FC = () => {
  const {
    products,
    storeConfig,
    language,
    addToCart,
    setQuickViewProduct,
    setIsTrackingModalOpen,
  } = useStore();
  const t = TRANSLATIONS[language];
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'all' | 'counter' | 'exercise' | 'bahasha' | 'registers'
  >('all');

  // Spotlight active quire in hero
  const [spotlightQuire, setSpotlightQuire] = useState<'q2' | 'q3' | 'q4'>('q2');

  // Wholesale calculator state
  const [calcQuantity, setCalcQuantity] = useState<number>(5);
  const [calcBookType, setCalcBookType] = useState<'q2' | 'q3' | 'q4'>('q2');

  const spotlightData = {
    q2: {
      id: 'prod-omega-cb-q2',
      sku: 'OMG-CB-Q2',
      title: 'Counter Book 2 Quire',
      titleSw: 'Counter Book Quire 2',
      pages: '198 Pages (Kurasa 198)',
      size: 'A4 Folio Hardcover',
      cartonPrice: 56000,
      unitPrice: 5800,
      image: '/omega-products/counter-book-q2-catalog.jpeg',
      badge: 'Official 2026 Batch',
      desc: 'Double-sewn binding with 70 GSM feint ruled bleed-proof paper. Best for high-frequency daily notes and store ledgers.',
      descSw: 'Jalada gumu lililoshonwa kwa uzi imara na karatasi ya 70 GSM isiyopenyeza wino.',
    },
    q3: {
      id: 'prod-omega-cb-q3',
      sku: 'OMG-CB-Q3',
      title: 'Counter Book 3 Quire',
      titleSw: 'Counter Book Quire 3',
      pages: '288 Pages (Kurasa 288)',
      size: 'A4 Folio Hardcover',
      cartonPrice: 57000,
      unitPrice: 7500,
      image: '/omega-products/counter-book-q3-catalog.jpeg',
      badge: 'Bestseller Choice',
      desc: 'The corporate and school ledger standard in Tanzania. 288 numbered ruled pages with moisture-resistant laminated cover.',
      descSw: 'Kiwango cha juu cha madaftari ya kibiashara na kitaasisi Tanzania.',
    },
    q4: {
      id: 'prod-omega-cb-q4',
      sku: 'OMG-CB-Q4',
      title: 'Counter Book 4 Quire',
      titleSw: 'Counter Book Quire 4',
      pages: '384 Pages (Kurasa 384)',
      size: 'A4 Folio Hardcover',
      cartonPrice: 60000,
      unitPrice: 9500,
      image: '/omega-products/counter-book-q4-catalog.jpeg',
      badge: 'Maximum Ledger Capacity',
      desc: '384 heavy-duty pages built for full-year academic notes, legal records, and high-volume business bookkeeping.',
      descSw: 'Kurasa 384 za kudumu mwaka mzima kwa ajili ya kumbukumbu na mahesabu mazito.',
    },
  };

  const currentSpotlight = spotlightData[spotlightQuire];
  const currency = storeConfig.currencySymbol || 'TSh';

  // Filter products for the featured section
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'counter') return p.category === 'Counter Books';
    if (activeTab === 'exercise') return p.category === 'Exercise Books';
    if (activeTab === 'bahasha') return p.category === 'Bahasha & Envelopes';
    if (activeTab === 'registers') return p.category === 'Registers' || p.category === 'Ruled Paper';
    return p.featured || p.bestSeller;
  });

  const displayedProducts = filteredProducts.slice(0, 8);

  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');
  const whatsappGreetingUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    language === 'sw'
      ? `Habari OMEGA Tanzania, ninahitaji katalogi na bei za jumla za madaftari (Counter Books, Exercise Books na Bahasha).`
      : `Hello OMEGA Writing Notebooks, I would like to inquire about notebook catalog and wholesale price list.`
  )}`;

  // 5 Signature Category Highlights
  const categoryHighlights = [
    {
      title: language === 'sw' ? 'Counter Books' : 'Counter Books',
      subtitle: language === 'sw' ? 'Q2, Q3, Q4 Majalada Magumu' : 'Hardcover Q2, Q3, Q4 Ledgers',
      link: '/catalog?category=Counter+Books',
      image: '/omega-products/counter-book-q3-catalog.jpeg',
      actionText: language === 'sw' ? 'NUNUA VITABU →' : 'SHOP BOOKS →',
    },
    {
      title: language === 'sw' ? 'Madaftari ya Mazoezi' : 'Exercise Books',
      subtitle: language === 'sw' ? 'Kurasa 32, 80, 100, 200' : 'Notebooks, 32p to 200p',
      link: '/catalog?category=Exercise+Books',
      image: '/omega-products/exercise-book-200p-purple.jpeg',
      actionText: language === 'sw' ? 'NUNUA MADAFTARI →' : 'SHOP STATIONERY →',
    },
    {
      title: language === 'sw' ? 'Bahasha za Kraft' : 'Bahasha & Envelopes',
      subtitle: language === 'sw' ? 'Size A3, A4, A5, A6 Nzito' : 'A3, A4, A5, A6 Heavy Kraft',
      link: '/catalog?category=Bahasha+%26+Envelopes',
      image: '/omega-products/bahasha-a4-catalog.png',
      actionText: language === 'sw' ? 'NUNUA BAHASHA →' : 'SHOP BAHASHA →',
    },
    {
      title: language === 'sw' ? 'Mafaili & Ofisi' : 'Office & School Files',
      subtitle: language === 'sw' ? 'PVC Spring Files & Manila' : 'PVC Spring Files & Manila',
      link: '/catalog?category=Office+Supplies',
      image: '/omega-products/plastic-file-pvc-catalog.jpeg',
      actionText: language === 'sw' ? 'NUNUA MAFAILI →' : 'SHOP FILES →',
    },
    {
      title: language === 'sw' ? 'Wapya 2026' : 'New Arrivals',
      subtitle: language === 'sw' ? 'Katalogi mpya & bei za jumla' : '2026 PPTX catalogue items',
      link: '/catalog?filter=new',
      image: '/omega-products/omega-carton-box-branded.jpeg',
      actionText: language === 'sw' ? 'GUNDUA SASA →' : 'EXPLORE NOW →',
    },
  ];

  // Calculator price computation
  const calcBaseRate =
    calcBookType === 'q2' ? 56000 : calcBookType === 'q3' ? 57000 : 60000;
  const discountRate = calcQuantity >= 20 ? 0.18 : calcQuantity >= 5 ? 0.1 : 0.05;
  const calcGrossTotal = calcBaseRate * calcQuantity;
  const calcSavings = Math.round(calcGrossTotal * discountRate);
  const calcFinalTotal = calcGrossTotal - calcSavings;

  return (
    <div className="bg-[#FBF8F1] min-h-screen font-sans text-[#1B1F2A]">
      <SEOHead
        title="OMEGA Writing Notebooks & Stationery | Premium Quality | Tanzania"
        description="Premium Tanzanian Counter Books (Q2, Q3, Q4), Exercise Books (32-200p), Bahasha envelopes, registers, and school essentials. Factory-direct wholesale and retail delivery."
      />

      {/* ==================== 1. INK & PAPER ATELIER HERO (#1E2A5E) ==================== */}
      <section className="relative overflow-hidden w-full bg-[#1E2A5E] text-white border-b border-[#E6E0D2]/20 py-16 lg:py-24">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#F5A623]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-[#2A9D8F]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Headline & Value Proposition */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-7">
              {/* Brand Hallmark Pill */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-white px-3.5 py-1.5 rounded-[12px] shadow-sm border border-[#E6E0D2]">
                  <img
                    src="/omega-logo.png"
                    alt="OMEGA Logo"
                    className="h-7 sm:h-8 w-auto object-contain"
                  />
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider text-[#F5A623] bg-white/10 border border-[#F5A623]/30">
                  <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />
                  <span className="uppercase text-[10px]">
                    {language === 'sw' ? 'EST. 1998 • DAR ES SALAAM' : 'EST. 1998 • DAR ES SALAAM'}
                  </span>
                </div>
              </div>

              {/* Majestic Fraunces Headline */}
              <div className="space-y-3">
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight">
                  {language === 'sw' ? 'UBORA HALISI.' : 'CRAFTED FOR'} <br />
                  <span className="text-[#F5A623]">
                    {language === 'sw' ? 'KWA KILA UKURASA.' : 'ENDURING RECORD.'}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-stone-200 leading-relaxed font-normal max-w-xl font-sans">
                  {language === 'sw'
                    ? 'Mkusanyiko rasmi wa madaftari ya OMEGA: Hardcover Counter Books (Q2, Q3, Q4), madaftari ya shule kurasa 32–200, na bahasha nzito za kraft. Usafirishaji wa haraka nchi nzima.'
                    : 'Tanzania’s premier stationery house. Engineered with 70 GSM acid-free bleed-proof paper and reinforced thread-sewn hardcovers for schools, accountants, and enterprises.'}
                </p>
              </div>

              {/* Action Buttons: Yellow CTA Button with Dark-Blue Text */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <Link
                  to="/catalog"
                  className="px-8 py-4 rounded-[12px] btn-cta-yellow text-xs sm:text-sm uppercase tracking-wider font-bold inline-flex items-center gap-2 group shrink-0"
                >
                  <ShoppingBag className="w-4 h-4 text-[#1E2A5E]" />
                  <span className="text-[#1E2A5E]">{language === 'sw' ? 'NUNUA SASA' : 'EXPLORE CATALOGUE'}</span>
                  <ArrowRight className="w-4 h-4 text-[#1E2A5E] transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href={whatsappGreetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-4 rounded-[12px] bg-[#2A9D8F] hover:bg-[#238276] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 shrink-0 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{t.orderOnWhatsApp}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsTrackingModalOpen(true)}
                  className="px-6 py-4 rounded-[12px] bg-white/10 hover:bg-white/20 text-white border border-[#E6E0D2]/30 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 shrink-0"
                >
                  <Truck className="w-4 h-4 text-[#F5A623]" />
                  <span>{language === 'sw' ? 'FUATILIA ODA' : 'TRACK PARCEL'}</span>
                </button>
              </div>

              {/* Core Quality Highlights */}
              <div className="pt-6 border-t border-[#E6E0D2]/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[#F5A623]">
                    <Layers className="w-4 h-4" />
                    <span className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                      QUIRE 2, 3, 4
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-300">198p, 288p, 384p</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[#F5A623]">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                      THREAD-SEWN
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-300">Reinforced spine</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[#F5A623]">
                    <Feather className="w-4 h-4" />
                    <span className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                      70 GSM BOND
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-300">Bleed-proof paper</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[#F5A623]">
                    <Package className="w-4 h-4" />
                    <span className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                      60 PCS / CARTON
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-300">Wholesale boxes</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Luxury Book Spotlight Studio */}
            <div className="lg:col-span-6 w-full">
              <div className="bg-[#162047] rounded-[12px] p-6 sm:p-8 shadow-xl border border-[#E6E0D2]/20 relative overflow-hidden flex flex-col justify-between">
                {/* Header Switcher */}
                <div className="flex items-center justify-between pb-5 border-b border-white/15 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2A9D8F] animate-pulse" />
                    <span className="font-heading text-xs font-bold tracking-wider text-[#F5A623] uppercase">
                      Signature Edition
                    </span>
                  </div>

                  {/* Quire Tabs */}
                  <div className="flex items-center gap-1 p-1 bg-[#121B3D] rounded-[8px] border border-white/15">
                    {(['q2', 'q3', 'q4'] as const).map((qKey) => (
                      <button
                        key={qKey}
                        type="button"
                        onClick={() => setSpotlightQuire(qKey)}
                        className={`px-3.5 py-1 rounded-[6px] text-xs font-bold uppercase transition-all ${
                          spotlightQuire === qKey
                            ? 'btn-cta-yellow shadow-sm'
                            : 'text-stone-300 hover:text-white'
                        }`}
                      >
                        {qKey.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spotlight Display Content */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-6">
                  {/* Photo with frame */}
                  <div className="sm:col-span-6 relative aspect-square bg-[#1E2A5E] rounded-[8px] p-4 flex items-center justify-center border border-[#E6E0D2]/20 group overflow-hidden">
                    <span className="absolute top-3 left-3 badge-clear-sale z-10">
                      {currentSpotlight.badge}
                    </span>

                    <img
                      src={currentSpotlight.image}
                      alt={currentSpotlight.title}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Details & Pricing */}
                  <div className="sm:col-span-6 space-y-4">
                    <div className="flex items-center gap-1 text-[#F5A623] text-xs">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#F5A623] stroke-[#F5A623]" />
                      ))}
                      <span className="text-white font-bold ml-1 text-xs">4.9 / 5.0</span>
                    </div>

                    <h3 className="text-2xl font-bold font-heading text-white leading-tight">
                      {language === 'sw' ? currentSpotlight.titleSw : currentSpotlight.title}
                    </h3>

                    <div className="space-y-1 text-xs text-stone-200">
                      <p className="font-semibold text-[#F5A623]">
                        ● {currentSpotlight.pages} • {currentSpotlight.size}
                      </p>
                      <p className="text-stone-300 text-[11px] leading-relaxed line-clamp-2">
                        {language === 'sw' ? currentSpotlight.descSw : currentSpotlight.desc}
                      </p>
                    </div>

                    {/* Pricing Box */}
                    <div className="p-3.5 rounded-[8px] bg-[#121B3D] border border-white/15 space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] uppercase font-bold text-stone-300">
                          Carton (60 Pcs)
                        </span>
                        <span className="text-lg font-black text-[#F5A623] font-mono">
                          {formatPrice(currentSpotlight.cartonPrice, currency)}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-[10px] text-stone-300">Unit Retail</span>
                        <span className="text-stone-100 font-mono font-bold">
                          {formatPrice(currentSpotlight.unitPrice, currency)}
                        </span>
                      </div>
                    </div>

                    {/* Actions: Yellow CTA Button */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => addToCart(currentSpotlight.id, 1, true)}
                        className="py-3 px-3 rounded-[8px] btn-cta-yellow text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#1E2A5E]" />
                        <span className="text-[#1E2A5E]">Add to Bag</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const p = products.find((x) => x.id === currentSpotlight.id);
                          if (p) setQuickViewProduct(p);
                        }}
                        className="py-3 px-3 rounded-[8px] bg-white/10 hover:bg-white/20 text-[#F5A623] border border-[#F5A623]/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Micro-Guarantee */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-300">
                  <span className="flex items-center gap-1 text-[#2A9D8F]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Kariakoo Central Warehouse In-Stock
                  </span>
                  <span className="text-[#F5A623] font-bold">
                    Official 2026 Batch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. PILLARS OF OMEGA EXCELLENCE (Trust Bar) ==================== */}
      <section className="bg-white border-b border-[#E6E0D2] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-4 p-4 rounded-[12px] bg-[#FBF8F1] border border-[#E6E0D2] hover:border-[#1E2A5E] transition-all shadow-xs">
              <div className="w-12 h-12 rounded-[8px] bg-[#1E2A5E] text-[#F5A623] flex items-center justify-center shrink-0 shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#1B1F2A]">
                  {language === 'sw' ? 'Usafirishaji Nchi Nzima' : 'Nationwide Dispatch'}
                </h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Dar es Salaam &amp; Upcountry bus parcels</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-[12px] bg-[#FBF8F1] border border-[#E6E0D2] hover:border-[#1E2A5E] transition-all shadow-xs">
              <div className="w-12 h-12 rounded-[8px] bg-[#1E2A5E] text-[#F5A623] flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#1B1F2A]">
                  {language === 'sw' ? 'Ubora Halisi wa OMEGA' : '100% Genuine OMEGA'}
                </h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Thread-sewn &amp; 70 GSM paper guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-[12px] bg-[#FBF8F1] border border-[#E6E0D2] hover:border-[#1E2A5E] transition-all shadow-xs">
              <div className="w-12 h-12 rounded-[8px] bg-[#F5A623] text-[#1E2A5E] flex items-center justify-center shrink-0 shadow-sm font-bold">
                <Percent className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#1B1F2A]">
                  {language === 'sw' ? 'Bei za Jumla & Zabuni' : 'Wholesale Tier Pricing'}
                </h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Direct carton savings for schools &amp; shops</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-[12px] bg-[#FBF8F1] border border-[#E6E0D2] hover:border-[#1E2A5E] transition-all shadow-xs">
              <div className="w-12 h-12 rounded-[8px] bg-[#2A9D8F] text-white flex items-center justify-center shrink-0 shadow-sm">
                <MessageCircle className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#1B1F2A]">
                  {language === 'sw' ? 'Msaada wa WhatsApp' : '3 WhatsApp Hotlines'}
                </h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Instant order assistance anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. SIGNATURE COLLECTIONS (Category Highlights) ==================== */}
      <section className="py-16 lg:py-24 bg-[#FBF8F1] border-b border-[#E6E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="font-heading text-xs font-bold tracking-[0.2em] text-[#1E2A5E] uppercase block">
              CURATED EDITIONS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1B1F2A] tracking-tight">
              {language === 'sw' ? 'Mkusanyiko Rasmi wa Vitabu' : 'Shop by Category'}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] max-w-lg mx-auto">
              {language === 'sw'
                ? 'Madaftari bora ya OMEGA, bahasha nzito za kraft, na vifaa vya kiofisi vilivyoundwa kwa uimara na ubora nchini Tanzania.'
                : 'From durable hardcover counter books to reinforced kraft envelopes, manufactured for Tanzanian scholars and enterprises.'}
            </p>
          </div>

          {/* 5 Distinct Category Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {categoryHighlights.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                className="group flex flex-col bg-white border border-[#E6E0D2] rounded-[12px] overflow-hidden hover-lift hover:border-[#1E2A5E] p-5 text-center items-center shadow-xs"
              >
                {/* Photo container */}
                <div className="aspect-square w-full bg-[#FBF8F1] rounded-[8px] p-4 overflow-hidden flex items-center justify-center relative mb-4 border border-[#E6E0D2]/60">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Card Text */}
                <h3 className="font-heading font-bold text-sm text-[#1B1F2A] group-hover:text-[#1E2A5E] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-1 line-clamp-1">
                  {cat.subtitle}
                </p>

                <span className="mt-3 text-[10px] font-bold tracking-wider uppercase text-[#1E2A5E] group-hover:text-[#F5A623] inline-flex items-center gap-1">
                  <span>{cat.actionText}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 4. B2B WHOLESALE CARTON CALCULATOR (#1E2A5E) ==================== */}
      <section className="py-16 lg:py-20 bg-[#1E2A5E] text-white border-b border-[#E6E0D2]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold text-[#F5A623] bg-white/10 border border-[#F5A623]/30">
                <Package className="w-3.5 h-3.5 text-[#F5A623]" />
                <span>B2B WHOLESALE &amp; SCHOOL TENDERS</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight">
                {language === 'sw'
                  ? 'Kikokotoo cha Bei za Jumla (Carton Pricing)'
                  : 'Calculate Your Wholesale Carton Savings'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
                {language === 'sw'
                  ? 'Chagua aina ya daftari na idadi ya katoni unazohitaji ili upate punguzo la moja kwa moja la hadi 18% kutoka kiwandani.'
                  : 'Select your preferred ledger quire and order quantity to see instant volume discount savings. We pack in branded OMEGA reinforced cartons with bus parcel waybills.'}
              </p>

              <div className="space-y-2.5 pt-2 text-xs text-stone-200 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2A9D8F]" />
                  <span>5–19 Cartons: Save 10% on factory price</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2A9D8F]" />
                  <span>20+ Cartons: Save 18% + Priority Upcountry dispatch</span>
                </div>
              </div>
            </div>

            {/* Right Calculator Studio: 12px rounded */}
            <div className="lg:col-span-7 bg-[#162047] border border-[#E6E0D2]/20 p-6 sm:p-8 rounded-[12px] shadow-xl space-y-6">
              {/* Step 1: Book Model */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#F5A623] font-heading block">
                  1. Select Notebook Model:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'q2', label: 'Quire 2 (198p)', rate: '56,000/-' },
                    { key: 'q3', label: 'Quire 3 (288p)', rate: '57,000/-' },
                    { key: 'q4', label: 'Quire 4 (384p)', rate: '60,000/-' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setCalcBookType(item.key as any)}
                      className={`p-3.5 rounded-[8px] border text-center transition-all ${
                        calcBookType === item.key
                          ? 'btn-cta-yellow border-transparent shadow-sm'
                          : 'bg-[#1E2A5E] text-stone-200 border-[#E6E0D2]/20 hover:border-[#F5A623]'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[11px] text-[#F5A623] mt-1 font-mono">{item.rate}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Quantity of Cartons */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                  <label className="text-[#F5A623] font-heading">2. Select Cartons (60 Pcs / Carton):</label>
                  <span className="text-white font-mono text-sm">{calcQuantity} Cartons ({calcQuantity * 60} Books)</span>
                </div>
                <div className="flex gap-2">
                  {[1, 5, 10, 20, 50].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setCalcQuantity(qty)}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-[8px] border transition-all font-mono ${
                        calcQuantity === qty
                          ? 'btn-cta-yellow border-transparent shadow-sm'
                          : 'bg-[#1E2A5E] text-stone-300 border-[#E6E0D2]/20 hover:border-white/40'
                      }`}
                    >
                      {qty} {qty === 1 ? 'Box' : 'Boxes'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation Output */}
              <div className="p-4 rounded-[8px] bg-[#121B3D] border border-white/10 space-y-2 font-mono">
                <div className="flex justify-between text-xs text-stone-300">
                  <span>Regular Total:</span>
                  <span className="line-through">{formatPrice(calcGrossTotal, currency)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#2A9D8F] font-bold">
                  <span>Volume Savings ({Math.round(discountRate * 100)}%):</span>
                  <span>- {formatPrice(calcSavings, currency)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                  <span>Calculated Net Price:</span>
                  <span className="text-[#F5A623] text-lg font-black">{formatPrice(calcFinalTotal, currency)}</span>
                </div>
              </div>

              {/* Yellow CTA Button with Dark-Blue Text */}
              <a
                href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                  `*OMEGA WHOLESALE PROFORMA INQUIRY*\n` +
                    `Product: Counter Book ${calcBookType.toUpperCase()}\n` +
                    `Quantity: ${calcQuantity} Cartons (${calcQuantity * 60} Units)\n` +
                    `Calculated Total: ${currency} ${calcFinalTotal.toLocaleString()}\n\n` +
                    `Please share formal invoice and dispatch schedule.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-4 rounded-[8px] btn-cta-yellow text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-[#1E2A5E]" />
                <span className="text-[#1E2A5E]">Request Proforma Invoice on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. FEATURED PICKS SECTION ==================== */}
      <section className="py-16 lg:py-24 bg-white border-b border-[#E6E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-heading text-xs font-bold tracking-[0.2em] text-[#1E2A5E] uppercase block">
                TOP EDITIONS
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1B1F2A] tracking-tight mt-1">
                {language === 'sw' ? 'Bidhaa Teule' : 'Featured Catalog Picks'}
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                {language === 'sw'
                  ? 'Madaftari maarufu yaliyopo stoo tayari kwa oda za jumla na rejareja'
                  : 'Tanzania’s most trusted notebooks and writing ledger editions'}
              </p>
            </div>

            <Link
              to="/catalog"
              className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#1E2A5E] hover:text-[#F5A623] inline-flex items-center gap-1.5 underline"
            >
              <span>{language === 'sw' ? 'TAZAMA ZOTE →' : 'VIEW ALL PRODUCTS →'}</span>
            </Link>
          </div>

          {/* Segmented Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#FBF8F1] rounded-[12px] max-w-fit border border-[#E6E0D2]">
            {[
              { id: 'all', label: t.allProducts },
              { id: 'counter', label: 'Counter Books' },
              { id: 'exercise', label: 'Exercise Books' },
              { id: 'bahasha', label: 'Bahasha' },
              { id: 'registers', label: 'Registers & Paper' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-bold rounded-[8px] transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#1E2A5E] text-white shadow-xs'
                    : 'text-[#1B1F2A] hover:text-[#1E2A5E]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Product Cards Grid with 12px rounded cards & hover-lift */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 6. THE ART OF WRITING (Editorial Thought & Heritage ✍🏻) ==================== */}
      <section className="py-16 lg:py-20 bg-[#FBF8F1] border-b border-[#E6E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="font-heading text-xs font-bold tracking-[0.2em] text-[#1E2A5E] uppercase block">
              POSITIVE THINKING ✍🏻
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1B1F2A] tracking-tight">
              {language === 'sw' ? 'Mawazo na Uongozi wa Uandishi' : 'Ideas &amp; Leadership Inspiration'}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] max-w-lg mx-auto">
              {language === 'sw'
                ? 'Mawazo mazuri huanza kwa kalamu na ukurasa safi wa daftari'
                : 'Great thoughts begin on clean pages. Writing by hand sharpens intellect and cements vision.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Editorial 1 */}
            <div className="bg-white border border-[#E6E0D2] rounded-[12px] overflow-hidden shadow-xs hover-lift flex flex-col justify-between">
              <div className="aspect-[16/10] bg-stone-100 overflow-hidden relative">
                <img
                  src="/omega-products/counter-book-q3-catalog.jpeg"
                  alt="Journaling with OMEGA"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#1B1F2A] leading-snug">
                    {language === 'sw'
                      ? 'Njia za Kuandika Kumbukumbu Zinazojenga Mafanikio'
                      : 'The Cognitive Power of Handwriting in High School'}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                    {language === 'sw'
                      ? 'Kuandika kila siku kwa mkono kunanoa akili, kunaratibu ndoto, na huleta mwanga kwa viongozi.'
                      : 'Handwriting sharpens conceptual retention, clarifies strategic thinking, and preserves vital commitments.'}
                  </p>
                </div>
                <Link
                  to="/about"
                  className="text-xs font-bold uppercase tracking-wider text-[#1E2A5E] hover:text-[#F5A623] inline-flex items-center gap-1 pt-2"
                >
                  <span>{language === 'sw' ? 'SOMA MAKALA →' : 'READ EDITORIAL →'}</span>
                </Link>
              </div>
            </div>

            {/* Editorial 2 */}
            <div className="bg-white border border-[#E6E0D2] rounded-[12px] overflow-hidden shadow-xs hover-lift flex flex-col justify-between">
              <div className="aspect-[16/10] bg-stone-100 overflow-hidden relative">
                <img
                  src="/omega-products/exercise-book-200p-purple.jpeg"
                  alt="Bleed-proof paper quality"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#1B1F2A] leading-snug">
                    {language === 'sw'
                      ? 'Karatasi ya 70 GSM Isiyopenyeza Wino: Sayansi ya OMEGA'
                      : 'Bleed-Proof High-GSM Paper: Why Fiber Density Matters'}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                    {language === 'sw'
                      ? 'Kwanini madaftari ya OMEGA yanadumu miaka mingi bila karatasi kuchanika au wino kupenya upande wa pili.'
                      : 'High-density fiber formation prevents gel and fountain ink feathering for flawless record keeping.'}
                  </p>
                </div>
                <Link
                  to="/about"
                  className="text-xs font-bold uppercase tracking-wider text-[#1E2A5E] hover:text-[#F5A623] inline-flex items-center gap-1 pt-2"
                >
                  <span>{language === 'sw' ? 'GUNDUA ZAIDI →' : 'DISCOVER MORE →'}</span>
                </Link>
              </div>
            </div>

            {/* Editorial 3 */}
            <div className="bg-white border border-[#E6E0D2] rounded-[12px] overflow-hidden shadow-xs hover-lift flex flex-col justify-between">
              <div className="aspect-[16/10] bg-stone-100 overflow-hidden relative">
                <img
                  src="/omega-products/omega-carton-box-branded.jpeg"
                  alt="Wholesale tender distribution"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#1B1F2A] leading-snug">
                    {language === 'sw'
                      ? 'Usambazaji wa Katoni na Zabuni za Shule Tanzania Nzima'
                      : 'Tanzanian Wholesale Tenders & Regional Bus Parcel Delivery'}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                    {language === 'sw'
                      ? 'Mizigo inafungashwa vizuri kwa katoni zilizochapwa chapa ya OMEGA na kusafirishwa mikoani kote.'
                      : 'Securely bundled in branded OMEGA cartons with fast bus parcel dispatch to all upcountry regions.'}
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="text-xs font-bold uppercase tracking-wider text-[#1E2A5E] hover:text-[#F5A623] inline-flex items-center gap-1 pt-2"
                >
                  <span>{language === 'sw' ? 'WASILIANA NASI →' : 'CONNECT WITH DISPATCH →'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 7. TESTIMONIALS (#1E2A5E) ==================== */}
      <section className="py-16 lg:py-24 bg-[#1E2A5E] text-white border-b border-[#E6E0D2]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="font-heading text-xs font-bold tracking-[0.2em] text-[#F5A623] uppercase block">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {language === 'sw' ? 'Kutoka kwa Wateja Wetu' : 'Trusted by Schools &amp; Enterprises'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
              {language === 'sw'
                ? 'Walimu, wahasibu na wanafunzi wanaamini ubora wa madaftari ya OMEGA'
                : 'Loved by school headmasters, certified accountants, and stationery wholesalers across Tanzania'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-[12px] bg-[#162047] border border-[#E6E0D2]/20 space-y-4 shadow-sm">
              <div className="flex text-[#F5A623] text-sm">★★★★★</div>
              <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed">
                “Daftari la OMEGA Quire 3 lina karatasi ngumu sana na jalada lisilopinda. Linanisaidia sana kwenye mahesabu ya kila mwezi.”
              </p>
              <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F5A623] text-[#1E2A5E] font-bold flex items-center justify-center text-sm">
                  EK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Emanuel Kiwanga</h4>
                  <p className="text-[11px] text-stone-300">Chief Accountant · Dar es Salaam</p>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-[12px] bg-[#162047] border border-[#E6E0D2]/20 space-y-4 shadow-sm">
              <div className="flex text-[#F5A623] text-sm">★★★★★</div>
              <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed">
                “The quality of OMEGA stationery is top-notch. Our school orders 200-page single line exercise books every term without fail.”
              </p>
              <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F5A623] text-[#1E2A5E] font-bold flex items-center justify-center text-sm">
                  GM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Grace Mhando</h4>
                  <p className="text-[11px] text-stone-300">Head of Academics · Arusha</p>
                </div>
              </div>
            </div>

            <div className="p-7 rounded-[12px] bg-[#162047] border border-[#E6E0D2]/20 space-y-4 shadow-sm">
              <div className="flex text-[#F5A623] text-sm">★★★★★</div>
              <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed">
                “Fast bus parcel dispatch to Mwanza! The kraft envelopes and ruled reams arrived safely packed in OMEGA branded cartons.”
              </p>
              <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F5A623] text-[#1E2A5E] font-bold flex items-center justify-center text-sm">
                  JM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Joseph Mollel</h4>
                  <p className="text-[11px] text-stone-300">Stationery Store Owner · Mwanza</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 8. STAY CONNECTED BANNER (#F5A623) ==================== */}
      <section className="py-14 bg-[#F5A623] text-[#1E2A5E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1E2A5E] tracking-tight flex items-center justify-center gap-2">
              <span>{language === 'sw' ? 'Tujumuike Pamoja' : "Let's stay in touch"}</span>
              <Sparkles className="w-5 h-5 text-[#1E2A5E]" />
            </h2>
            <p className="text-xs sm:text-sm text-[#1E2A5E]/90 font-medium max-w-lg mx-auto">
              {language === 'sw'
                ? 'Pata taarifa za bei mpya za jumla, katalogi ya 2026 na ofa maalum za vifaa vya shule na ofisi.'
                : 'Get bookish catalog picks, wholesale tender offers, and 2026 price lists delivered directly to you.'}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(language === 'sw' ? 'Asante! Tumepokea ombi lako.' : 'Thank you! We received your enquiry.');
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="text"
              required
              placeholder={language === 'sw' ? 'Weka namba ya simu au email...' : 'Enter your email or phone number...'}
              className="w-full px-5 py-3.5 rounded-[8px] text-xs sm:text-sm bg-white text-[#1B1F2A] placeholder:text-[#6B7280] border border-[#E6E0D2] focus:outline-none focus:border-[#1E2A5E]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-[8px] btn-ink-primary text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-sm shrink-0"
            >
              {language === 'sw' ? 'WASILIANA' : 'SUBSCRIBE'}
            </button>
          </form>

          <p className="text-xs text-[#1E2A5E] font-medium">
            Hotlines: +255 715 268 391 | +255 624 265 480 | +255 699 032 777
          </p>
        </div>
      </section>
    </div>
  );
};

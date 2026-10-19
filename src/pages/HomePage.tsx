import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
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
  Clock,
  Compass,
  FileText,
  MapPin,
  ChevronRight,
  PhoneCall,
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

  // Spotlight active product in Hero
  const [spotlightKey, setSpotlightKey] = useState<'q2' | 'q3' | 'q4' | 'ex200' | 'carton'>('q2');

  // Wholesale calculator state
  const [calcQuantity, setCalcQuantity] = useState<number>(5);
  const [calcBookType, setCalcBookType] = useState<'q2' | 'q3' | 'q4'>('q2');

  const spotlightData = {
    q2: {
      id: 'prod-omega-cb-q2',
      sku: 'OMG-CB-Q2',
      title: 'Counter Book 2 Quire',
      subtitle: '198 Pages · A4 Folio Hardcover',
      cartonPrice: 56000,
      unitPrice: 5800,
      packaging: '48 Pcs / Carton',
      boxPcs: 48,
      image: '/omega-products/counter-book-q2-catalog.jpeg',
      badge: 'Best-Seller 2026',
      desc: 'Double-sewn Smyth binding with 70 GSM feint-ruled bleed-proof paper. Built for high-frequency daily store ledgers and school notes.',
      highlights: ['Smyth Thread Bound (180° Lay-Flat)', '70 GSM Bleed-Proof Woodfree Paper', '198 Numbered Ruled Ledger Pages'],
      spineGauge: '14mm Smyth Spine · 198 Pages',
      cartonYield: 278400,
      dealerProfit: 222400,
    },
    q3: {
      id: 'prod-omega-cb-q3',
      sku: 'OMG-CB-Q3',
      title: 'Counter Book 3 Quire',
      subtitle: '288 Pages · A4 Folio Hardcover',
      cartonPrice: 57000,
      unitPrice: 7500,
      packaging: '36 Pcs / Carton',
      boxPcs: 36,
      image: '/omega-products/counter-book-q3-catalog.jpeg',
      badge: 'Corporate Standard',
      desc: 'The corporate accounting and school standard across Tanzania. 288 numbered ruled pages encased in a moisture-resistant laminated hardcover.',
      highlights: ['Full Academic Year Commercial Ledger', 'Laminated Moisture-Resistant Cover', 'Precision Indigo Millimeter Ruling'],
      spineGauge: '21mm Smyth Spine · 288 Pages',
      cartonYield: 270000,
      dealerProfit: 213000,
    },
    q4: {
      id: 'prod-omega-cb-q4',
      sku: 'OMG-CB-Q4',
      title: 'Counter Book 4 Quire',
      subtitle: '384 Pages · A4 Folio Hardcover',
      cartonPrice: 60000,
      unitPrice: 9500,
      packaging: '24 Pcs / Carton',
      boxPcs: 24,
      image: '/omega-products/counter-book-q4-catalog.jpeg',
      badge: 'Heavy-Duty Archive',
      desc: '384 heavy-duty pages crafted for permanent multi-year legal archives, auditing records, and rigorous university degree notes.',
      highlights: ['Heavyweight 384 Acid-Free Pages', 'Reinforced Heavy-Gauge Spine Cloth', 'Legal & Financial Multi-Year Archive'],
      spineGauge: '28mm Smyth Spine · 384 Pages',
      cartonYield: 228000,
      dealerProfit: 168000,
    },
    ex200: {
      id: 'prod-omega-ex-200p-sl',
      sku: 'OMG-EX-200-SL',
      title: 'Exercise Book 200 Pages',
      subtitle: 'Single Line · Stiff Cover',
      cartonPrice: 48000,
      unitPrice: 2200,
      packaging: '120 Pcs / Carton',
      boxPcs: 120,
      image: '/omega-products/exercise-book-200p-purple.jpeg',
      badge: 'School Benchmark',
      desc: 'The benchmark primary and secondary school exercise book in Tanzania. Heavyweight cover with standard syllabus margin lines.',
      highlights: ['Strong Stapled Centerfold Binding', 'Bright White 60 GSM Woodfree Pages', 'Tanzania National Curriculum Standard'],
      spineGauge: '9mm Stiff Spine · 200 Pages',
      cartonYield: 264000,
      dealerProfit: 216000,
    },
    carton: {
      id: 'prod-carton-bundle-q2',
      sku: 'OMG-CRTN-48',
      title: 'Factory Sealed Wholesale Carton',
      subtitle: '48 Pcs Strapped Corrugated Master Case',
      cartonPrice: 56000,
      unitPrice: 1166,
      packaging: '48 Pcs Master Case',
      boxPcs: 48,
      image: '/omega-products/omega-carton-box-branded.jpeg',
      badge: 'B2B Wholesale Master',
      desc: 'Heavy-duty 5-ply export grade corrugated box strapped with polypropylene security banding. Designed to survive long-distance transit across all Tanzanian bus parcel networks.',
      highlights: ['5-Ply Export Grade Corrugated Box', 'Polypropylene Strapped Security Bands', 'Ready for Upcountry Bus Parcel Transit'],
      spineGauge: '340mm Box Height · 22.5 kg Case',
      cartonYield: 278400,
      dealerProfit: 222400,
    },
  };

  const currentSpotlight = spotlightData[spotlightKey];
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
      ? `Habari OMEGA Tanzania, ninahitaji kuagiza madaftari (Counter Books, Exercise Books na Bahasha) kwa bei ya jumla.`
      : `Hello OMEGA Stationery, I would like to place an order and inquire about wholesale carton pricing.`
  )}`;

  // Signature category cards
  const signatureCategories = [
    {
      title: language === 'sw' ? 'Counter Books' : 'Hardcover Counter Books',
      subtitle: language === 'sw' ? 'Q2, Q3, Q4 Jalada Gumu' : 'Q2, Q3, Q4 Folio Ledgers',
      desc: language === 'sw' ? '198p hadi 384p, ushonaji wa nyuzi madhubuti' : '198 to 384 pages, double thread-bound spine',
      link: '/catalog?category=Counter+Books',
      image: '/omega-products/counter-book-q3-catalog.jpeg',
      tag: 'Accounting & Schools',
    },
    {
      title: language === 'sw' ? 'Madaftari ya Mazoezi' : 'School Exercise Books',
      subtitle: language === 'sw' ? 'Kurasa 32, 80, 100, 200' : '32p, 80p, 100p & 200p',
      desc: language === 'sw' ? 'Mistari mipana, mistari miwili na hesabu' : 'Single line, double line & mathematics squares',
      link: '/catalog?category=Exercise+Books',
      image: '/omega-products/exercise-book-200p-purple.jpeg',
      tag: 'Primary & Secondary',
    },
    {
      title: language === 'sw' ? 'Bahasha za Kraft' : 'Heavy Kraft Bahasha',
      subtitle: language === 'sw' ? 'Size A3, A4, A5, A6 Nzito' : 'A3, A4, A5, A6 Document Envelopes',
      desc: language === 'sw' ? 'Karatasi ya kahawia isiyochanika kwa barua' : 'Tear-resistant kraft for official documents',
      link: '/catalog?category=Bahasha+%26+Envelopes',
      image: '/omega-products/bahasha-a4-catalog.png',
      tag: 'Office Mailers',
    },
    {
      title: language === 'sw' ? 'Mafaili & Ofisi' : 'Office & Filing Supplies',
      subtitle: language === 'sw' ? 'Spring Files PVC & Manila' : 'PVC Spring Files & Manila Folders',
      desc: language === 'sw' ? 'Uwekaji wa kumbukumbu na majarada ya ofisi' : 'Heavy-duty archival binders and record files',
      link: '/catalog?category=Office+Supplies',
      image: '/omega-products/plastic-file-pvc-catalog.jpeg',
      tag: 'Enterprise & Legal',
    },
    {
      title: language === 'sw' ? 'Vifurushi vya Jumla' : 'Wholesale Carton Packs',
      subtitle: language === 'sw' ? 'Katoni za Kiwanda & Zabuni' : 'Factory Sealed Cartons & Tenders',
      desc: language === 'sw' ? 'Punguzo la bei ya moja kwa moja hadi 18%' : 'Volume tier discounts for schools & wholesale shops',
      link: '/wholesale',
      image: '/omega-products/omega-carton-box-branded.jpeg',
      tag: 'B2B Tenders',
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
    <div className="bg-[#fafafa] min-h-screen font-sans text-[#3b352f]">
      <SEOHead
        title="OMEGA Writing Notebooks & Stationery | Premium Quality | Tanzania"
        description="Tanzania's benchmark in Counter Books (Q2, Q3, Q4), Exercise Books, Kraft Bahasha, and Office Files. Factory-direct wholesale and upcountry bus parcel delivery."
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: ARCHITECTURAL LUXURY STUDIO SHOWCASE */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden w-full bg-linear-to-br from-[#161311] via-[#1f1a17] to-[#13100f] text-white py-12 lg:py-18 border-b border-[#2e2621] shadow-2xl">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-[#c49b7c]/14 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-[#a46b44]/12 rounded-full blur-[140px] pointer-events-none" />

        {/* Delicate architectural grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Brand Hallmark & Value Proposition */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
              {/* Brand Hallmark Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="bg-white px-3 py-1.5 rounded-xl shadow-xs border border-white/20 flex items-center">
                  <img
                    src="/omega-logo.png"
                    alt="OMEGA Logo"
                    className="h-6 w-auto object-contain"
                  />
                </div>
                <div className="px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase text-[#c49b7c] bg-white/[0.07] border border-[#c49b7c]/30 backdrop-blur-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Factory Direct · Mbeya &amp; Kariakoo Hubs</span>
                </div>
              </div>

              {/* Bold Editorial Headline */}
              <div className="space-y-3">
                <p className="text-xs font-mono font-bold tracking-widest uppercase text-[#c49b7c]">
                  {language === 'sw' ? 'KIWANGO RASMI CHA TAIFA LA TANZANIA' : 'THE NATIONAL BENCHMARK FOR RECORDS'}
                </p>
                <h1 className="font-heading text-3xl sm:text-5xl lg:text-[3.25rem] font-light text-white leading-[1.08] tracking-tight">
                  {language === 'sw' ? (
                    <>
                      Uadilifu wa Uandishi &amp; <br />
                      <span className="font-serif italic font-bold bg-linear-to-r from-[#fce3c7] via-[#c49b7c] to-[#e8c099] bg-clip-text text-transparent">
                        Kumbukumbu Zinazodumu.
                      </span>
                    </>
                  ) : (
                    <>
                      The Benchmark in <br />
                      <span className="font-serif italic font-bold bg-linear-to-r from-[#fce3c7] via-[#c49b7c] to-[#e8c099] bg-clip-text text-transparent">
                        Precision Books &amp;
                      </span> <br />
                      <span className="font-bold text-white">Permanent Records.</span>
                    </>
                  )}
                </h1>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal max-w-xl">
                  {language === 'sw'
                    ? 'Madaftari rasmi ya OMEGA: Jalada gumu lililoshonwa kwa nyuzi mbili za Smyth (Q2, Q3, Q4), karatasi ya 70 GSM isiyopenyeza wino, na vifurushi vya jumla kwa shule na maduka kote nchini.'
                    : 'Crafted with double thread-sewn Smyth binding, 70 GSM bleed-proof woodfree bond, and precision indigo ruling. Engineered in Tanzania for schools, certified accountants, and corporate enterprises.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/catalog"
                  className="btn-ledup-copper px-7 py-3 rounded-full text-xs sm:text-sm uppercase tracking-wider font-bold inline-flex items-center gap-2 group shrink-0 min-h-[46px] shadow-lg active:scale-95 transition-all text-white"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>{language === 'sw' ? 'NUNUA BIDHAA' : 'EXPLORE COLLECTION'}</span>
                  <ArrowRight className="w-4 h-4 text-white ledup-arrow-icon" />
                </Link>

                <Link
                  to="/wholesale"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 shrink-0 min-h-[46px] group active:scale-95"
                >
                  <Package className="w-4 h-4 text-[#c49b7c]" />
                  <span>{language === 'sw' ? 'BEI ZA JUMLA' : 'WHOLESALE CARTONS'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#c49b7c] ledup-arrow-icon" />
                </Link>

                <a
                  href={whatsappGreetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-300 border border-[#25D366]/40 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 shrink-0 min-h-[46px]"
                >
                  <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* 4 Technical Quality Badges */}
              <div className="pt-3 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-white/[0.04] border border-white/10 rounded-xl hover:border-[#c49b7c]/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-[#c49b7c] mb-0.5">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] font-bold uppercase text-white truncate">Smyth Bound</span>
                  </div>
                  <span className="text-[11px] text-stone-300 block">Opens 180° flat</span>
                </div>

                <div className="p-3 bg-white/[0.04] border border-white/10 rounded-xl hover:border-[#c49b7c]/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-[#c49b7c] mb-0.5">
                    <Feather className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] font-bold uppercase text-white truncate">70 GSM Paper</span>
                  </div>
                  <span className="text-[11px] text-stone-300 block">Zero ink bleed</span>
                </div>

                <div className="p-3 bg-white/[0.04] border border-white/10 rounded-xl hover:border-[#c49b7c]/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-[#c49b7c] mb-0.5">
                    <Truck className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] font-bold uppercase text-white truncate">Bus Parcel</span>
                  </div>
                  <span className="text-[11px] text-stone-300 block">All 31 regions</span>
                </div>

                <div className="p-3 bg-white/[0.04] border border-white/10 rounded-xl hover:border-[#c49b7c]/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-[#c49b7c] mb-0.5">
                    <Percent className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] font-bold uppercase text-white truncate">Factory Bulk</span>
                  </div>
                  <span className="text-[11px] text-stone-300 block">Carton savings</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Porcelain Studio Benchmark Showcase */}
            <div className="lg:col-span-6 w-full">
              <div className="relative group">
                {/* Glowing ambient backlight halo */}
                <div className="absolute -inset-2 bg-linear-to-r from-[#c49b7c]/25 via-amber-500/15 to-[#c49b7c]/30 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Main Porcelain / Alabaster Studio Card */}
                <div className="relative bg-linear-to-b from-[#ffffff] via-[#faf8f6] to-[#f4efe8] rounded-[28px] p-5 sm:p-7 shadow-2xl border border-white/80 overflow-hidden text-[#2b2520]">
                  {/* Studio Header & Tab Switcher */}
                  <div className="flex flex-wrap items-center justify-between pb-3.5 border-b border-[#e8dfd5] gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#4b423b]">
                        Studio Benchmark
                      </span>
                    </div>

                    {/* Interactive Tab Switcher */}
                    <div className="flex items-center gap-1 p-1 bg-[#eae3d9]/70 rounded-full border border-[#ded4c8] overflow-x-auto no-scrollbar max-w-full">
                      {[
                        { key: 'q2', label: 'Quire 2' },
                        { key: 'q3', label: 'Quire 3' },
                        { key: 'q4', label: 'Quire 4' },
                        { key: 'ex200', label: 'Exercise 200P' },
                        { key: 'carton', label: 'Carton Box' },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setSpotlightKey(tab.key as any)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                            spotlightKey === tab.key
                              ? 'bg-[#4b423b] text-white shadow-xs'
                              : 'text-stone-600 hover:text-black hover:bg-white/60'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stage Layout: Product Image & Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center py-4">
                    {/* Seamless Porcelain Pedestal Image Stage */}
                    <div className="sm:col-span-6 relative aspect-square bg-linear-to-b from-[#fdfbf9] to-[#f1ece5] rounded-2xl p-4 flex items-center justify-center border border-[#e5ddd3] shadow-inner group/stage overflow-hidden">
                      {/* Floating Badge */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#4b423b] text-[#f4cca1] shadow-xs z-10">
                        {currentSpotlight.badge}
                      </div>

                      {/* Spine Gauge Badge */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2 py-1 rounded-lg text-[10px] font-mono font-bold text-[#4b423b] bg-white/95 backdrop-blur-xs border border-[#ded5cb] shadow-xs text-center z-10 truncate">
                        {currentSpotlight.spineGauge}
                      </div>

                      {/* The Book Image on pristine background */}
                      <img
                        key={currentSpotlight.id}
                        src={currentSpotlight.image}
                        alt={currentSpotlight.title}
                        className="max-h-[82%] max-w-[85%] object-contain drop-shadow-[0_20px_25px_rgba(43,37,32,0.22)] transition-transform duration-500 group-hover/stage:scale-105"
                      />
                    </div>

                    {/* Details & Commercial Yield */}
                    <div className="sm:col-span-6 space-y-3">
                      <div className="flex items-center gap-1 text-amber-500 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                        ))}
                        <span className="text-[#4b423b] font-bold ml-1 text-xs">5.0 · TBS Certified</span>
                      </div>

                      <div>
                        <h3 className="text-xl font-black font-heading text-[#241f1c] leading-tight">
                          {currentSpotlight.title}
                        </h3>
                        <p className="text-xs text-[#a06f47] font-bold mt-0.5">
                          {currentSpotlight.subtitle}
                        </p>
                      </div>

                      {/* Craft Highlights */}
                      <div className="space-y-1">
                        {currentSpotlight.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-stone-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{h}</span>
                          </div>
                        ))}
                      </div>

                      {/* Dual Pricing & Yield Card */}
                      <div className="p-3 rounded-xl bg-white border border-[#e0d6cb] shadow-2xs space-y-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[10px] uppercase font-bold text-stone-500">
                            Carton ({currentSpotlight.packaging})
                          </span>
                          <span className="text-base font-black text-[#87552e] font-mono">
                            {formatPrice(currentSpotlight.cartonPrice, currency)}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between text-xs pt-1 border-t border-stone-100">
                          <span className="text-[10px] text-stone-500">Retail Unit Rate</span>
                          <span className="text-stone-800 font-mono font-bold">
                            {formatPrice(currentSpotlight.unitPrice, currency)}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between text-xs pt-0.5">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase">Dealer Yield / Case</span>
                          <span className="text-emerald-700 font-mono font-black">
                            +{formatPrice(currentSpotlight.dealerProfit, currency)}
                          </span>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => addToCart(currentSpotlight.id, 1, true)}
                          className="py-2.5 px-3 rounded-xl bg-[#4b423b] hover:bg-[#38312b] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 shadow-md transition-all"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#c49b7c]" />
                          <span>Add to Bag</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const p = products.find((x) => x.id === currentSpotlight.id);
                            if (p) setQuickViewProduct(p);
                          }}
                          className="py-2.5 px-3 rounded-xl bg-white hover:bg-stone-50 text-[#4b423b] border border-[#d5cbbf] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#a06f47]" />
                          <span>Quick View</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stage Bottom Guarantee Pill */}
                  <div className="pt-2.5 border-t border-[#e8dfd5] flex items-center justify-between text-[11px] text-stone-600 font-medium">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ready for Same-Day Bus Parcel Dispatch</span>
                    </span>
                    <span className="text-stone-500 font-mono text-[10px]">
                      SKU: {currentSpotlight.sku}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUST & SCALE METRICS (Indra Notebook Inspired) */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-[#e2dedb] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-4 rounded-[16px] bg-[#fafafa] border border-[#e2dedb] hover:border-[#c49b7c] transition-all">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#4b423b] font-heading block">
                500,000+
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3b352f] mt-1">
                Books Distributed
              </h4>
              <p className="text-[11px] text-[#736c67] mt-0.5">Annual supply to schools &amp; firms</p>
            </div>

            <div className="p-4 rounded-[16px] bg-[#fafafa] border border-[#e2dedb] hover:border-[#c49b7c] transition-all">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#4b423b] font-heading block">
                31 Regions
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3b352f] mt-1">
                Nationwide Bus Parcel
              </h4>
              <p className="text-[11px] text-[#736c67] mt-0.5">Reliable waybills to all towns</p>
            </div>

            <div className="p-4 rounded-[16px] bg-[#fafafa] border border-[#e2dedb] hover:border-[#c49b7c] transition-all">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#c49b7c] font-heading block">
                70 GSM
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3b352f] mt-1">
                Bleed-Proof Paper
              </h4>
              <p className="text-[11px] text-[#736c67] mt-0.5">Zero feathering with fountain ink</p>
            </div>

            <div className="p-4 rounded-[16px] bg-[#fafafa] border border-[#e2dedb] hover:border-[#c49b7c] transition-all">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2A9D8F] font-heading block">
                100%
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3b352f] mt-1">
                Thread-Sewn Guarantee
              </h4>
              <p className="text-[11px] text-[#736c67] mt-0.5">Pages never loosen or fall out</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SIGNATURE CATEGORIES SHOWCASE (Indra Notebook & LEDUP Cards) */}
      {/* ========================================================================= */}
      <section className="py-14 lg:py-20 bg-[#fafafa] border-b border-[#e2dedb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c49b7c] font-heading block">
              Curated Collections
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#3b352f] tracking-tight">
              {language === 'sw' ? 'Mkusanyiko Rasmi wa Vitabu' : 'Explore by Category'}
            </h2>
            <p className="text-xs sm:text-sm text-[#736c67] max-w-lg mx-auto">
              {language === 'sw'
                ? 'Kila daftari linatengenezwa kwa viwango vikali vya kudumu kwa miaka mingi bila kuchanika.'
                : 'From durable hardcover counter books to reinforced kraft envelopes, precision manufactured in Tanzania.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5">
            {signatureCategories.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                className="group flex flex-col bg-white border border-[#e2dedb] rounded-[20px] overflow-hidden hover:border-[#c49b7c] p-4 text-center items-center shadow-xs transition-all hover:shadow-md"
              >
                {/* Tag */}
                <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#e2dedb] text-[10px] font-semibold text-[#8c847e]">
                  <span className="text-[#c49b7c] font-bold">{cat.tag}</span>
                  <span className="text-stone-400">0{idx + 1}</span>
                </div>

                {/* Photo container */}
                <div className="aspect-square w-full bg-[#f5f4f4] rounded-[14px] p-3 overflow-hidden flex items-center justify-center relative mb-3 border border-[#e2dedb]/60 group-hover:bg-[#faf9f8] transition-colors">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <h3 className="font-heading font-bold text-sm text-[#3b352f] group-hover:text-[#c49b7c] transition-colors leading-tight">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-[#736c67] mt-1 line-clamp-1">
                  {cat.subtitle}
                </p>

                <span className="mt-3 text-[11px] font-bold tracking-wider uppercase text-[#c49b7c] group-hover:text-[#a46b44] inline-flex items-center gap-1">
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ledup-arrow-icon" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE ANATOMY OF AN OMEGA NOTEBOOK (Interactive Quality Dissection) */}
      {/* ========================================================================= */}
      <section className="py-14 lg:py-20 bg-white border-b border-[#e2dedb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c49b7c] font-heading block">
              The Engineering Standard
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#3b352f] tracking-tight">
              {language === 'sw' ? 'Sayansi ya Daftari Bora la OMEGA' : 'The Anatomy of an OMEGA Notebook'}
            </h2>
            <p className="text-xs sm:text-sm text-[#736c67] max-w-xl mx-auto">
              {language === 'sw'
                ? 'Kwanini shule, wahasibu, na ofisi kubwa wanachagua OMEGA badala ya madaftari ya kawaida.'
                : 'Every single component is selected to ensure lasting endurance, effortless writing, and complete ink resistance.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {/* Pillar 1 */}
            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-[20px] bg-[#fafafa] border border-[#e2dedb] hover:border-[#c49b7c] transition-all space-y-2 sm:space-y-3 flex flex-col justify-between">
              <div className="space-y-2 sm:space-y-3">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-[14px] bg-[#4b423b] text-[#c49b7c] flex items-center justify-center font-bold shadow-xs">
                  <BookOpen className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-heading font-bold text-xs sm:text-base text-[#3b352f] leading-snug">
                  1. Smyth Thread-Sewn Spine
                </h3>
                <p className="text-[11px] sm:text-xs text-[#736c67] leading-relaxed">
                  Pages are double-stitched with high-tensile cotton-linen thread that never loosens. The book opens completely flat at 180° for effortless two-page writing.
                </p>
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-[#c49b7c] flex items-center gap-1 pt-1 border-t border-stone-200/60">
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">180° Lay-Flat Ergonomics</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-[20px] bg-[#fafafa] border border-[#e2dedb] hover:border-[#c49b7c] transition-all space-y-2 sm:space-y-3 flex flex-col justify-between">
              <div className="space-y-2 sm:space-y-3">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-[14px] bg-[#4b423b] text-[#c49b7c] flex items-center justify-center font-bold shadow-xs">
                  <Feather className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-heading font-bold text-xs sm:text-base text-[#3b352f] leading-snug">
                  2. 70 GSM Bleed-Proof Bond
                </h3>
                <p className="text-[11px] sm:text-xs text-[#736c67] leading-relaxed">
                  High-density virgin wood-pulp paper prevents ink ghosting and feathering from rollerballs, gel pens, and heavy fountain pen inks.
                </p>
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-[#c49b7c] flex items-center gap-1 pt-1 border-t border-stone-200/60">
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">Zero Ink Bleed-Through</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-[20px] bg-[#fafafa] border border-[#e2dedb] hover:border-[#c49b7c] transition-all space-y-2 sm:space-y-3 flex flex-col justify-between">
              <div className="space-y-2 sm:space-y-3">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-[14px] bg-[#4b423b] text-[#c49b7c] flex items-center justify-center font-bold shadow-xs">
                  <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-heading font-bold text-xs sm:text-base text-[#3b352f] leading-snug">
                  3. 1.8mm Laminated Hardcover
                </h3>
                <p className="text-[11px] sm:text-xs text-[#736c67] leading-relaxed">
                  Heavy-duty greyboard wrapped in a water-resistant matt laminated cover. Protects records against humidity, spills, and rough transport.
                </p>
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-[#c49b7c] flex items-center gap-1 pt-1 border-t border-stone-200/60">
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">Multi-Year Durability</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-[20px] bg-[#fafafa] border border-[#e2dedb] hover:border-[#c49b7c] transition-all space-y-2 sm:space-y-3 flex flex-col justify-between">
              <div className="space-y-2 sm:space-y-3">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-[14px] bg-[#4b423b] text-[#c49b7c] flex items-center justify-center font-bold shadow-xs">
                  <Compass className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-heading font-bold text-xs sm:text-base text-[#3b352f] leading-snug">
                  4. Precision Indigo Ruling
                </h3>
                <p className="text-[11px] sm:text-xs text-[#736c67] leading-relaxed">
                  Uniform 8mm feint lines with soft red margin guides calibrated strictly to Tanzanian National Examination Council (NECTA) standards.
                </p>
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-[#c49b7c] flex items-center gap-1 pt-1 border-t border-stone-200/60">
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">NECTA Syllabus Standard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED BENCHMARK PRODUCTS (Tabbed Catalog Grid) */}
      {/* ========================================================================= */}
      <section className="py-14 lg:py-20 bg-[#fafafa] border-b border-[#e2dedb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e2dedb] pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c49b7c] font-heading block">
                Official 2026 Batch
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#3b352f] tracking-tight mt-1">
                {language === 'sw' ? 'Bidhaa Zinazoongoza kwa Mauzo' : 'Benchmark Stationery Picks'}
              </h2>
              <p className="text-xs sm:text-sm text-[#736c67] mt-1">
                {language === 'sw'
                  ? 'Madaftari maarufu yaliyopo stoo tayari kwa oda za jumla na rejareja.'
                  : 'In-stock factory lines ready for instant retail dispatch and wholesale carton delivery.'}
              </p>
            </div>

            <Link
              to="/catalog"
              className="font-mono text-xs font-bold tracking-wider uppercase text-[#4b423b] hover:text-[#c49b7c] inline-flex items-center gap-1.5 border-b border-[#4b423b] hover:border-[#c49b7c] pb-0.5 transition-colors"
            >
              <span>{language === 'sw' ? 'TAZAMA ZOTE' : 'VIEW COMPLETE CATALOGUE'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 ledup-arrow-icon" />
            </Link>
          </div>

          {/* Segmented Filter Pills (Horizontal scroll on mobile, preventing deformed bubble) */}
          <div className="w-full overflow-x-auto no-scrollbar py-1">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-white rounded-2xl sm:rounded-full border border-[#e2dedb] shadow-xs">
              {[
                { id: 'all', label: t.allProducts },
                { id: 'counter', label: 'Counter Books' },
                { id: 'exercise', label: 'Exercise Books' },
                { id: 'bahasha', label: 'Bahasha & Envelopes' },
                { id: 'registers', label: 'Registers & Paper' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 sm:px-4 py-1.5 text-xs font-semibold rounded-xl sm:rounded-full whitespace-nowrap shrink-0 transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#4b423b] text-white shadow-xs'
                      : 'text-[#736c67] hover:text-[#3b352f] hover:bg-[#efeded]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid (2 cols on mobile, 4 on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHOLESALE CARTON CALCULATOR (Interactive B2B Hub) */}
      {/* ========================================================================= */}
      <section className="py-14 lg:py-20 bg-[#4b423b] text-white border-b border-[#3b352f] relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c49b7c]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold text-[#c49b7c] bg-white/10 border border-[#c49b7c]/30">
                <Package className="w-3.5 h-3.5 text-[#c49b7c]" />
                <span>B2B WHOLESALE &amp; SCHOOL TENDERS</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white leading-tight">
                {language === 'sw'
                  ? 'Kikokotoo cha Bei za Jumla (Carton Pricing)'
                  : 'Calculate Your Wholesale Carton Savings'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {language === 'sw'
                  ? 'Chagua aina ya daftari na idadi ya katoni unazohitaji ili upate punguzo la moja kwa moja la hadi 18% kutoka kiwandani.'
                  : 'Select your preferred ledger quire and order quantity to see instant volume discount savings. We pack in branded OMEGA reinforced cartons with bus parcel waybills.'}
              </p>

              <div className="space-y-2 pt-2 text-xs text-stone-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c49b7c]" />
                  <span>5–19 Cartons: Save 10% on factory price</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c49b7c]" />
                  <span>20+ Cartons: Save 18% + Priority Upcountry dispatch</span>
                </div>
              </div>
            </div>

            {/* Right Calculator Studio */}
            <div className="lg:col-span-7 bg-[#3b352f] border border-white/15 p-6 sm:p-8 rounded-[24px] shadow-2xl space-y-5">
              {/* Step 1: Book Model */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#c49b7c] block">
                  1. Select Notebook Model:
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                  {[
                    { key: 'q2', label: 'Quire 2', sub: '198p', rate: '56,000/-' },
                    { key: 'q3', label: 'Quire 3', sub: '288p', rate: '57,000/-' },
                    { key: 'q4', label: 'Quire 4', sub: '384p', rate: '60,000/-' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setCalcBookType(item.key as any)}
                      className={`p-2 sm:p-3 rounded-[12px] border text-center transition-all ${
                        calcBookType === item.key
                          ? 'btn-ledup-copper text-[#23201d] font-bold border-transparent shadow-md'
                          : 'bg-[#4b423b] text-stone-200 border-white/15 hover:border-[#c49b7c]'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{item.label}</div>
                      <div className="text-[10px] opacity-80 font-mono hidden sm:block">{item.sub}</div>
                      <div className={`text-[10px] sm:text-[11px] mt-0.5 font-mono ${calcBookType === item.key ? 'text-[#23201d] font-bold' : 'text-[#c49b7c]'}`}>{item.rate}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Quantity */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                  <label className="text-[#c49b7c]">
                    2. Select Cartons ({calcBookType === 'q2' ? 48 : calcBookType === 'q3' ? 36 : 24} Pcs / Box):
                  </label>
                  <span className="text-white font-mono text-xs">
                    {calcQuantity} Cartons ({calcQuantity * (calcBookType === 'q2' ? 48 : calcBookType === 'q3' ? 36 : 24)} Books)
                  </span>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-1.5 sm:gap-2">
                  {[1, 5, 10, 20, 50].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setCalcQuantity(qty)}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-[10px] border transition-all font-mono ${
                        calcQuantity === qty
                          ? 'btn-ledup-copper text-[#23201d] border-transparent shadow-md'
                          : 'bg-[#4b423b] text-stone-300 border-white/15 hover:border-white/40'
                      }`}
                    >
                      {qty} {qty === 1 ? 'Box' : 'Boxes'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation Output */}
              <div className="p-4 rounded-[14px] bg-[#292420] border border-white/10 space-y-1.5 font-mono">
                <div className="flex justify-between text-xs text-stone-300">
                  <span>Regular Total:</span>
                  <span className="line-through">{formatPrice(calcGrossTotal, currency)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-400 font-bold">
                  <span>Volume Savings ({Math.round(discountRate * 100)}%):</span>
                  <span>- {formatPrice(calcSavings, currency)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                  <span>Calculated Net Price:</span>
                  <span className="text-[#c49b7c] text-lg font-black">{formatPrice(calcFinalTotal, currency)}</span>
                </div>
              </div>

              {/* Copper CTA Button */}
              <a
                href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                  `*OMEGA WHOLESALE PROFORMA INQUIRY*\n` +
                  `Product: Counter Book ${calcBookType.toUpperCase()}\n` +
                  `Quantity: ${calcQuantity} Cartons (${calcQuantity * (calcBookType === 'q2' ? 48 : calcBookType === 'q3' ? 36 : 24)} Units)\n` +
                  `Calculated Total: ${currency} ${calcFinalTotal.toLocaleString()}\n\n` +
                  `Please share formal proforma invoice and dispatch waybill schedule.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-[12px] btn-ledup-copper text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 group"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span className="text-white">Request Proforma Invoice on WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 text-white ledup-arrow-icon" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. NATIONWIDE DISPATCH & LOGISTICS (Upcountry Bus Parcel Hub) */}
      {/* ========================================================================= */}
      <section className="py-14 lg:py-20 bg-white border-b border-[#e2dedb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c49b7c] font-heading block">
              Logistics &amp; Delivery
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#3b352f] tracking-tight">
              {language === 'sw' ? 'Usafirishaji wa Uhakika Mikoani Kote' : 'Reliable Nationwide Bus Parcel Delivery'}
            </h2>
            <p className="text-xs sm:text-sm text-[#736c67] max-w-xl mx-auto">
              {language === 'sw'
                ? 'Tunafikisha mzigo wako mkoa wowote Tanzania kupitia mabasi ya kuaminika ndani ya saa 24–48.'
                : 'Direct carton delivery from our Central Warehouse in Soweto SIDO Mbeya and Kariakoo Dispatch Hub to your local bus terminal.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            <div className="p-3 sm:p-6 rounded-2xl sm:rounded-[20px] bg-[#fafafa] border border-[#e2dedb] hover:border-[#c49b7c] transition-all space-y-2 sm:space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5 sm:space-y-3">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-[10px] sm:rounded-[12px] bg-[#4b423b] text-[#c49b7c] flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-heading font-bold text-xs sm:text-base text-[#3b352f] leading-snug">
                  Daily Regional Bus Waybills
                </h3>
                <p className="text-[10px] sm:text-xs text-[#736c67] leading-relaxed">
                  We partner with Shabiby, BM Coach, Abood, New Force, and Saibaba to ensure same-day parcel drop-off with SMS waybill tracking numbers.
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-6 rounded-2xl sm:rounded-[20px] bg-[#fafafa] border border-[#e2dedb] hover:border-[#c49b7c] transition-all space-y-2 sm:space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5 sm:space-y-3">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-[10px] sm:rounded-[12px] bg-[#4b423b] text-[#c49b7c] flex items-center justify-center font-bold">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-heading font-bold text-xs sm:text-base text-[#3b352f] leading-snug">
                  Heavy Branded Packaging
                </h3>
                <p className="text-[10px] sm:text-xs text-[#736c67] leading-relaxed">
                  Cartons are double-strapped with water-resistant protective tape and official OMEGA branding to prevent transit damage or pilferage.
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-6 rounded-2xl sm:rounded-[20px] bg-[#fafafa] border border-[#e2dedb] hover:border-[#c49b7c] transition-all space-y-2 sm:space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5 sm:space-y-3">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-[10px] sm:rounded-[12px] bg-[#4b423b] text-[#c49b7c] flex items-center justify-center font-bold">
                  <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-heading font-bold text-xs sm:text-base text-[#3b352f] leading-snug">
                  Live Dispatch Confirmation
                </h3>
                <p className="text-[10px] sm:text-xs text-[#736c67] leading-relaxed">
                  Receive instant photo proof of your loaded carton, bus receipt, and driver contact directly on WhatsApp before bus departure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CLIENT TESTIMONIALS */}
      {/* ========================================================================= */}
      <section className="py-14 lg:py-20 bg-[#4b423b] text-white border-b border-[#3b352f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold tracking-[0.2em] text-[#c49b7c] uppercase block font-heading">
              TESTIMONIALS
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white tracking-tight">
              {language === 'sw' ? 'Wateja Wetu Wanasemaje' : 'Trusted by Schools & Enterprises'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
              {language === 'sw'
                ? 'Walimu wakuu, wahasibu, na wamiliki wa maduka ya vifaa vya shule kote nchini wanaamini OMEGA.'
                : 'Loved by headmasters, corporate accountants, and stationery wholesalers across Tanzania.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            <div className="p-3 sm:p-6 rounded-[16px] sm:rounded-[20px] bg-[#3b352f] border border-white/15 space-y-2 sm:space-y-3 shadow-lg flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex gap-0.5 sm:gap-1 text-[#c49b7c]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-[#c49b7c] text-[#c49b7c]" />
                  ))}
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-stone-200 italic leading-relaxed line-clamp-4 sm:line-clamp-none">
                  “Daftari la OMEGA Quire 3 lina karatasi ngumu sana na jalada lisilopinda. Linanisaidia sana kwenye mahesabu ya kila mwezi bila wino kupenya.”
                </p>
              </div>
              <div className="pt-2 sm:pt-3 border-t border-white/10 flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#c49b7c] text-[#3b352f] font-bold flex items-center justify-center text-[10px] sm:text-xs shadow-xs shrink-0">
                  EK
                </div>
                <div className="min-w-0">
                  <h4 className="text-[10px] sm:text-xs font-bold text-white truncate">Emanuel Kiwanga</h4>
                  <p className="text-[9px] sm:text-[11px] text-stone-400 truncate">Chief Accountant · Dar</p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-6 rounded-[16px] sm:rounded-[20px] bg-[#3b352f] border border-white/15 space-y-2 sm:space-y-3 shadow-lg flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex gap-0.5 sm:gap-1 text-[#c49b7c]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-[#c49b7c] text-[#c49b7c]" />
                  ))}
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-stone-200 italic leading-relaxed line-clamp-4 sm:line-clamp-none">
                  “The quality of OMEGA stationery is unmatched. Our secondary school orders 200-page single line exercise books every term without fail.”
                </p>
              </div>
              <div className="pt-2 sm:pt-3 border-t border-white/10 flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#c49b7c] text-[#3b352f] font-bold flex items-center justify-center text-[10px] sm:text-xs shadow-xs shrink-0">
                  GM
                </div>
                <div className="min-w-0">
                  <h4 className="text-[10px] sm:text-xs font-bold text-white truncate">Grace Mhando</h4>
                  <p className="text-[9px] sm:text-[11px] text-stone-400 truncate">Head of Academics · Arusha</p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-6 rounded-[16px] sm:rounded-[20px] bg-[#3b352f] border border-white/15 space-y-2 sm:space-y-3 shadow-lg flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex gap-0.5 sm:gap-1 text-[#c49b7c]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-[#c49b7c] text-[#c49b7c]" />
                  ))}
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-stone-200 italic leading-relaxed line-clamp-4 sm:line-clamp-none">
                  “Fast bus parcel dispatch to Mwanza! The kraft envelopes and ruled reams arrived safely packed in OMEGA branded cartons within 24 hours.”
                </p>
              </div>
              <div className="pt-2 sm:pt-3 border-t border-white/10 flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#c49b7c] text-[#3b352f] font-bold flex items-center justify-center text-[10px] sm:text-xs shadow-xs shrink-0">
                  JM
                </div>
                <div className="min-w-0">
                  <h4 className="text-[10px] sm:text-xs font-bold text-white truncate">Joseph Mollel</h4>
                  <p className="text-[9px] sm:text-[11px] text-stone-400 truncate">Stationery Store · Mwanza</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. STAY CONNECTED BANNER (LEDUP Warm Copper Gradient) */}
      {/* ========================================================================= */}
      <section className="py-12 bg-gradient-to-r from-[#a46b44] via-[#c49b7c] to-[#a46b44] text-[#23201d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="space-y-1.5">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#23201d] tracking-tight flex items-center justify-center gap-2">
              <span>{language === 'sw' ? 'Jiunge na OMEGA Stationery' : 'Connect with OMEGA Stationery'}</span>
              <Sparkles className="w-5 h-5 text-[#23201d]" />
            </h2>
            <p className="text-xs sm:text-sm text-[#3b352f] font-medium max-w-lg mx-auto">
              {language === 'sw'
                ? 'Pata taarifa za bei mpya za jumla, katalogi ya 2026 na ofa maalum za vifaa vya shule na ofisi.'
                : 'Get 2026 catalog updates, wholesale tender offers, and direct factory price lists.'}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(language === 'sw' ? 'Asante! Tumepokea mawasiliano yako.' : 'Thank you! We received your details.');
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="text"
              required
              placeholder={language === 'sw' ? 'Namba ya simu au email...' : 'Enter your email or phone number...'}
              className="w-full px-5 py-3 rounded-full text-xs sm:text-sm bg-white text-[#3b352f] placeholder:text-[#8c847e] border border-white/40 focus:outline-none focus:ring-2 focus:ring-[#4b423b] shadow-sm"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-full btn-ledup-mocha text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md shrink-0 flex items-center justify-center gap-2 group"
            >
              <span>{language === 'sw' ? 'WASILIANA' : 'SUBSCRIBE'}</span>
              <ArrowUpRight className="w-4 h-4 ledup-arrow-icon" />
            </button>
          </form>

          <p className="text-xs text-[#3b352f] font-semibold font-mono">
            Dedicated Hotlines: Boss 1: +255 715 268 391 | Boss 2: +255 624 265 480 | Mbeya: +255 746 268 391 | Mwanza: +255 699 032 777
          </p>
        </div>
      </section>
    </div>
  );
};

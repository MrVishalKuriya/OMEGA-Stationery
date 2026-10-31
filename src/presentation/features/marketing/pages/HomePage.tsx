import React, { useState, useMemo } from 'react';
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
  Plus,
  Minus,
  Navigation,
  Quote,
  Building2,
  GraduationCap,
  Store,
  Phone,
  Calculator,
  Mail,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { Hero } from '../components/Hero';
import { SEOHead } from '@/components/SEOHead';
import { TRANSLATIONS } from '@/data/translations';
import { formatPrice } from '@/types/store';

export const HomePage: React.FC = () => {
  const {
    products,
    storeConfig,
    language,
    addToCart,
    setQuickViewProduct,
    setIsTrackingModalOpen,
  } = useStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'all' | 'counter' | 'exercise' | 'bahasha' | 'registers'
  >('all');

  // Wholesale calculator state
  const [calcQuantity, setCalcQuantity] = useState<number>(5);
  const [calcBookType, setCalcBookType] = useState<'q2' | 'q3' | 'q4'>('q2');

  const currency = storeConfig.currencySymbol || 'TSh';

  // Dynamic products lookup for calculators and signature cards
  const q2Prod = useMemo(() => products.find((p) => p.sku === 'OMG-CB-Q2' || p.id === 'prod-omega-cb-q2' || p.name.includes('Q2')), [products]);
  const q3Prod = useMemo(() => products.find((p) => p.sku === 'OMG-CB-Q3' || p.id === 'prod-omega-cb-q3' || p.name.includes('Q3')), [products]);
  const q4Prod = useMemo(() => products.find((p) => p.sku === 'OMG-CB-Q4' || p.id === 'prod-omega-cb-q4' || p.name.includes('Q4')), [products]);
  const ex200Prod = useMemo(() => products.find((p) => p.sku === 'OMG-EX-200SL' || p.id === 'prod-omega-ex-200sl' || p.name.includes('200 Pages')), [products]);
  const ex100Prod = useMemo(() => products.find((p) => p.sku === 'OMG-EX-100SL' || p.id === 'prod-omega-ex-100sl' || p.name.includes('100 Pages')), [products]);
  const ex80Prod = useMemo(() => products.find((p) => p.sku === 'OMG-EX-80' || p.id === 'prod-omega-ex-80' || p.name.includes('80 Pages')), [products]);
  const bahashaProd = useMemo(() => products.find((p) => p.sku === 'OMG-BAHASHA-A4' || p.id === 'prod-omega-bahasha-a4' || p.name.includes('Bahasha')), [products]);
  const stiffProd = useMemo(() => products.find((p) => p.id === 'prod-omega-stiff-200' || p.name.includes('Stiff')), [products]);

  // Filter products dynamically for the featured catalog section
  const filteredProducts = useMemo(() => {
    if (activeTab === 'counter') return products.filter((p) => p.category === 'Counter Books');
    if (activeTab === 'exercise') return products.filter((p) => p.category === 'Exercise Books');
    if (activeTab === 'bahasha') return products.filter((p) => p.category === 'Bahasha & Envelopes');
    if (activeTab === 'registers') return products.filter((p) => p.category === 'Registers' || p.category === 'Ruled Paper');
    
    // Default 'all' tab: prioritize featured & best sellers, but include all latest products dynamically
    const featured = products.filter((p) => p.featured || p.bestSeller);
    const regular = products.filter((p) => !p.featured && !p.bestSeller);
    return [...featured, ...regular];
  }, [products, activeTab]);

  const displayedProducts = filteredProducts.slice(0, 8);

  const cleanWhatsappDigits = storeConfig.whatsappNumber
    ? storeConfig.whatsappNumber.replace(/\D/g, '')
    : '255746268391';

  const whatsappGreetingUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    language === 'sw'
      ? `Habari OMEGA Tanzania, ninahitaji kuagiza madaftari (Counter Books, Exercise Books na Bahasha) kwa bei ya jumla kiwandani.`
      : `Hello OMEGA Stationery, I would like to place an order and inquire about factory wholesale carton pricing.`
  )}`;

  // Signature category cards (Dynamically linked to live MongoDB products)
  const signatureCategories = useMemo(() => [
    {
      title: q2Prod?.name || 'Counter Book Q2',
      subtitle: language === 'sw' ? 'Q2 Jalada Gumu · Kurasa 192' : '192 Pages · Q2 Folio Ledgers',
      desc: language === 'sw' ? '192p, ushonaji wa nyuzi madhubuti' : '192 pages, thread-sewn hardboard spine',
      link: q2Prod ? `/product/${q2Prod.id}` : '/product/prod-omega-cb-q2',
      image: '/omega-products/omega-counter-book-podium.png',
      tag: 'Accounting & Schools',
      badge: 'Bestseller',
    },
    {
      title: ex200Prod?.name || '200 Pages Exercise',
      subtitle: language === 'sw' ? 'Single Line, Double Line & Hesabu' : 'Single Line, Double Line & Square',
      desc: language === 'sw' ? 'Mistari mipana, mistari miwili na hesabu' : 'Single line, double line & mathematics squares',
      link: ex200Prod ? `/product/${ex200Prod.id}` : '/product/prod-omega-ex-200sl',
      image: '/omega-products/exercise-book-200p-sl-catalog.jpeg',
      tag: 'Primary & Secondary',
      badge: 'Popular',
    },
    {
      title: stiffProd?.name || 'Stiff Cover 200 Pages',
      subtitle: language === 'sw' ? 'Jalada Ngumu ya Jiometri' : 'Geometric Semi-Rigid Edition',
      desc: language === 'sw' ? 'Karatasi 70 GSM isiyopenyeza wino' : 'Bleed-proof 70 GSM with poly-faceted cover',
      link: stiffProd ? `/product/${stiffProd.id}` : '/product/prod-omega-stiff-200',
      image: '/omega-products/stiff-cover-200-catalog.jpeg',
      tag: 'Executive & Office',
      badge: 'Heavy Duty',
    },
    {
      title: ex100Prod?.name || '100 Pages Exercise',
      subtitle: language === 'sw' ? 'Kurasa 100 · SL, DL & Square' : '100p · SL, DL, Square & Plain',
      desc: language === 'sw' ? 'Madaftari ya wanafunzi shuleni' : 'Standard classroom exercise books',
      link: ex100Prod ? `/product/${ex100Prod.id}` : '/product/prod-omega-ex-100sl',
      image: '/omega-products/exercise-book-100p-catalog.jpeg',
      tag: 'Primary & Secondary',
      badge: 'Classroom',
    },
    {
      title: ex80Prod?.name || '80 Pages Notebook',
      subtitle: language === 'sw' ? 'Canary Yellow · Kurasa 80' : '80p Canary Yellow Notebook',
      desc: language === 'sw' ? 'Uzito mwepesi, imara kwa marudio' : 'Lightweight and durable revision books',
      link: ex80Prod ? `/product/${ex80Prod.id}` : '/product/prod-omega-ex-80',
      image: '/omega-products/exercise-book-80p-catalog.jpeg',
      tag: 'Semester & Revision',
      badge: 'Compact',
    },
    {
      title: bahashaProd?.name || 'Heavy Kraft Bahasha',
      subtitle: language === 'sw' ? 'Size A3, A4, A5 · Peel & Seal' : 'A3, A4, A5, A6 Envelopes',
      desc: language === 'sw' ? 'Karatasi ya kahawia isiyochanika kwa nyaraka' : 'Tear-resistant oversized document kraft',
      link: bahashaProd ? `/product/${bahashaProd.id}` : '/product/prod-omega-bahasha-a4',
      image: '/omega-products/bahasha-a4-catalog.png',
      tag: 'Office Mailers',
      badge: 'Tear-Proof',
    },
  ], [q2Prod, ex200Prod, stiffProd, ex100Prod, ex80Prod, bahashaProd, language]);

  // Calculator price computation (Dynamically derived from live MongoDB prices)
  const calcBaseRate = useMemo(() => {
    if (calcBookType === 'q2') return q2Prod?.wholesalePrice || 56000;
    if (calcBookType === 'q3') return q3Prod?.wholesalePrice || 57000;
    return q4Prod?.wholesalePrice || 60000;
  }, [calcBookType, q2Prod, q3Prod, q4Prod]);

  const unitsPerCarton = calcBookType === 'q2' ? 48 : calcBookType === 'q3' ? 36 : 24;
  const totalUnits = calcQuantity * unitsPerCarton;
  const unitPrice = Math.round(calcBaseRate / unitsPerCarton);
  const calcTotal = calcBaseRate * calcQuantity;

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans text-[#18181b] selection:bg-[#dc2626]/30 selection:text-[#09090b]">
      <SEOHead
        title="OMEGA Writing Notebooks & Stationery | Premium Quality | Tanzania"
        description="Tanzania's benchmark in Counter Books (Q2, Q3, Q4), Exercise Books, Kraft Bahasha, and Office Files. Factory-direct wholesale and upcountry bus parcel delivery."
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: 3-COLUMN SHOWCASE & NAVIGATION */}
      {/* ========================================================================= */}
      <Hero whatsappGreetingUrl={whatsappGreetingUrl} />

      {/* ========================================================================= */}
      {/* 2. TRUST & SCALE METRICS BAR (Refined Architectural Cards) */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-[#e4e4e7] py-6 sm:py-10 relative z-20 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            
            {/* Metric 1 */}
            <div className="group p-4 sm:p-5 rounded-2xl bg-[#fafafa] hover:bg-white border border-[#e4e4e7] hover:border-[#dc2626] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col items-start h-full">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center font-bold border border-[#dc2626]/20 group-hover:bg-[#dc2626] group-hover:text-white transition-colors duration-300 mb-3 shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#111113] font-heading tracking-tight block leading-none">
                500,000+
              </span>
              <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#18181b] mt-2 leading-snug">
                Books Distributed
              </h4>
              <p className="text-[11px] sm:text-xs text-[#71717a] mt-1 leading-snug">
                Annual factory supply to schools &amp; firms
              </p>
            </div>

            {/* Metric 2 */}
            <div className="group p-4 sm:p-5 rounded-2xl bg-[#fafafa] hover:bg-white border border-[#e4e4e7] hover:border-[#dc2626] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col items-start h-full">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center font-bold border border-[#dc2626]/20 group-hover:bg-[#dc2626] group-hover:text-white transition-colors duration-300 mb-3 shrink-0">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#111113] font-heading tracking-tight block leading-none">
                31 Regions
              </span>
              <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#18181b] mt-2 leading-snug">
                Nationwide Parcel
              </h4>
              <p className="text-[11px] sm:text-xs text-[#71717a] mt-1 leading-snug">
                Same-day waybills to all bus terminals
              </p>
            </div>

            {/* Metric 3 */}
            <div className="group p-4 sm:p-5 rounded-2xl bg-[#fafafa] hover:bg-white border border-[#e4e4e7] hover:border-[#dc2626] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col items-start h-full">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center font-bold border border-[#dc2626]/20 group-hover:bg-[#dc2626] group-hover:text-white transition-colors duration-300 mb-3 shrink-0">
                <Feather className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#dc2626] font-heading tracking-tight block leading-none">
                70 GSM
              </span>
              <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#18181b] mt-2 leading-snug">
                Bleed-Proof Paper
              </h4>
              <p className="text-[11px] sm:text-xs text-[#71717a] mt-1 leading-snug">
                Zero feathering with fountain &amp; gel ink
              </p>
            </div>

            {/* Metric 4 */}
            <div className="group p-4 sm:p-5 rounded-2xl bg-[#fafafa] hover:bg-white border border-[#e4e4e7] hover:border-[#dc2626] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col items-start h-full">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center font-bold border border-[#dc2626]/20 group-hover:bg-[#dc2626] group-hover:text-white transition-colors duration-300 mb-3 shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#111113] font-heading tracking-tight block leading-none">
                100%
              </span>
              <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#18181b] mt-2 leading-snug">
                Thread-Sewn Spine
              </h4>
              <p className="text-[11px] sm:text-xs text-[#71717a] mt-1 leading-snug">
                Pages never loosen or fall out over years
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SIGNATURE CATEGORIES SHOWCASE (Curated Minimalist Collections) */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-20 bg-[#fafafa] border-b border-[#e4e4e7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-2.5 max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#18181b] tracking-tight">
              {language === 'sw' ? 'Mkusanyiko Rasmi wa Vitabu' : 'Explore by Category'}
            </h2>
            <p className="text-xs sm:text-sm text-[#71717a] leading-relaxed">
              {language === 'sw'
                ? 'Kuanzia madaftari ya Q2, Q3, Q4 yenye jalada gumu hadi madaftari ya shule za msingi na sekondari pamoja na bahasha imara za krafti.'
                : 'From heavy-duty Q2–Q4 counter ledger books to standard school exercise editions and tear-resistant kraft mailers.'}
            </p>
          </div>

          {/* 4 Category Showcase Cards (Refined UI/UX) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {signatureCategories.slice(0, 4).map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                className="group flex flex-col justify-between bg-[#f4f3ef] hover:bg-white border border-[#e4e4e7] hover:border-[#dc2626] rounded-[22px] sm:rounded-[26px] p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Top Header: Title Left + Arrow Icon Right */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-heading font-bold text-xs sm:text-base text-[#111113] group-hover:text-[#dc2626] transition-colors leading-snug line-clamp-2 text-left">
                    {cat.title}
                  </h3>
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 group-hover:bg-[#111113] text-[#111113] group-hover:text-white flex items-center justify-center shrink-0 transition-all shadow-2xs">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>

                {/* Product Photo Canvas */}
                <div className={`aspect-square w-full ${cat.image.includes('podium') ? 'bg-black p-0' : 'bg-white p-3.5 sm:p-5'} rounded-[18px] overflow-hidden flex items-center justify-center relative border border-[#e4e4e7]/60 group-hover:border-[#dc2626]/30 transition-colors shadow-2xs`}>
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className={`w-full h-full ${cat.image.includes('podium') ? 'object-cover' : 'object-contain mix-blend-multiply'} scale-100 group-hover:scale-105 transition-transform duration-500 ease-out`}
                    loading="lazy"
                  />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. EDITORIAL FEATURE & PROMOTIONAL BANNERS (Replacing Anatomy Section) */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-16 bg-white border-b border-[#e4e4e7] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6 relative z-10">
          
          {/* BANNER 1: Editorial "OMEGA." Flagship Bestseller Showcase (matching note act. reference) */}
          <div className="relative rounded-[26px] sm:rounded-[34px] bg-[#f5f3ef] border border-[#e4e4e7] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300">
            {/* Top-Left 3 Feature Pills */}
            <div className="relative z-20 flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
              <span className="px-3.5 py-1 rounded-full bg-white border border-[#e4e4e7] text-[11px] font-semibold text-[#18181b] shadow-2xs">
                {language === 'sw' ? 'Ushonaji wa Uzi' : 'Smyth-Sewn'}
              </span>
              <span className="px-3.5 py-1 rounded-full bg-white border border-[#e4e4e7] text-[11px] font-semibold text-[#18181b] shadow-2xs">
                {language === 'sw' ? 'Karatasi 70 GSM' : '70 GSM Bond'}
              </span>
              <span className="px-3.5 py-1 rounded-full bg-white border border-[#e4e4e7] text-[11px] font-semibold text-[#18181b] shadow-2xs">
                {language === 'sw' ? 'Inafunguka 180°' : '180° Flat Lay'}
              </span>
            </div>

            {/* Giant Bold Editorial Display Wordmark Across Background */}
            <div
              aria-hidden="true"
              className="pointer-events-none select-none font-heading font-black text-[4.25rem] sm:text-[7.5rem] lg:text-[10.5rem] tracking-tight text-[#111113] leading-[0.9] my-1 sm:my-2"
            >
              omega.
            </div>

            {/* Content & Floating Angled Book Grid */}
            <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mt-2 sm:mt-4">
              {/* Bottom-Left Product Info & CTA */}
              <div className="lg:col-span-6 text-left space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#e4e2dd] text-[#111113] text-[11px] font-bold uppercase tracking-wider font-mono">
                  {language === 'sw' ? 'OMEGA BOOK PRODUCTS' : 'OMEGA BOOK PRODUCTS'}
                </span>

                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111113] tracking-tight leading-[1.12]">
                  {language === 'sw' ? (
                    <>
                      Vitabu Bora kwa
                      <span className="block text-[#dc2626]">Maisha Bora</span>
                    </>
                  ) : (
                    <>
                      Premium Books
                      <span className="block text-[#dc2626]">for a Brighter Future</span>
                    </>
                  )}
                </h2>

                <p className="text-xs sm:text-sm text-[#52525b] max-w-md leading-relaxed">
                  {language === 'sw'
                    ? 'Madaftari bora, exercise books, counter books na vifaa vya stationery — vinavyoaminika kote Tanzania.'
                    : 'High-quality notebooks, exercise books, counter books and stationery products — trusted across Tanzania.'}
                </p>

                <div className="text-xl sm:text-2xl font-extrabold text-[#111113] font-mono pt-0.5">
                  {formatPrice(q2Prod?.discountPrice || q2Prod?.price || 3500, currency)}
                </div>

                <div className="pt-1 flex items-center gap-3">
                  <Link
                    to={q2Prod ? `/product/${q2Prod.id}` : '/catalog?category=Counter+Books'}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#111113] hover:bg-[#dc2626] text-white text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95"
                  >
                    <span>{language === 'sw' ? 'Nunua Sasa' : 'Buy Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/wishlist"
                    aria-label="Wishlist"
                    className="w-11 h-11 rounded-full bg-white border border-[#d4d4d8] hover:border-[#dc2626] text-[#111113] hover:text-[#dc2626] flex items-center justify-center transition-colors shadow-2xs"
                  >
                    <Star className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Side: Overlapping Flagship Book */}
              <div className="lg:col-span-6 flex items-center justify-center lg:justify-end lg:-mt-28">
                <Link
                  to={q2Prod ? `/product/${q2Prod.id}` : '/catalog?category=Counter+Books'}
                  className="group relative w-48 sm:w-64 lg:w-72 aspect-[3/4] flex items-center justify-center"
                >
                  <img
                    src="/omega-hero-book.png"
                    alt="OMEGA Smyth-Sewn Hardcover Book"
                    className="w-full h-full object-contain mix-blend-multiply -rotate-6 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 drop-shadow-[0_24px_35px_rgba(0,0,0,0.22)]"
                    loading="lazy"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* BANNERS 2 & 3: Dual Promotional Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            {/* Promo Card Left: 20% OFF Wholesale Special (matching coffee promo reference) */}
            <div className="lg:col-span-6 rounded-[24px] sm:rounded-[28px] bg-[#f4f1ea] border border-[#e4e4e7] p-6 sm:p-8 flex items-center justify-between gap-4 relative overflow-hidden shadow-xs hover:shadow-lg transition-all">
              <div className="space-y-2 text-left relative z-10 max-w-[60%]">
                <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#dc2626] block">
                  {language === 'sw' ? 'OFA YA JUMLA KIWANDANI' : 'WHOLESALE SPECIAL'}
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl font-black text-[#111113] tracking-tight leading-none">
                  20% OFF
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#3f3f46]">
                  {language === 'sw'
                    ? 'Kwa oda zote za katoni za jumla'
                    : 'On all wholesale carton orders'}
                </p>
                <div className="pt-2">
                  <Link
                    to="/wholesale"
                    className="inline-flex items-center gap-2.5 pl-5 pr-2 py-2 rounded-full bg-[#111113] hover:bg-[#dc2626] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                  >
                    <span>{language === 'sw' ? 'AGIZA SASA' : 'ORDER NOW'}</span>
                    <span className="w-6 h-6 rounded-full bg-white text-[#111113] flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-2 shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-2 border border-[#e4e4e7] shadow-sm flex items-center justify-center">
                  <img
                    src="/omega-products/bahasha-a4-catalog.png"
                    alt="OMEGA Wholesale Cartons"
                    className="w-full h-full object-contain mix-blend-multiply"
                    loading="lazy"
                  />
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 -ml-5 rounded-full bg-[#111113] text-white flex flex-col items-center justify-center font-heading font-black shadow-lg border-2 border-[#f4f1ea]">
                  <span className="text-sm sm:text-base leading-none text-[#ef4444]">20%</span>
                  <span className="text-[9px] uppercase tracking-wider">OFF</span>
                </div>
              </div>
            </div>

            {/* Promo Card Right: Dark Exclusive Collection Banner (matching dark car banner reference) */}
            <div className="lg:col-span-6 rounded-[24px] sm:rounded-[28px] bg-[#09090b] border border-[#27272a] p-6 sm:p-8 relative overflow-hidden flex items-center shadow-xs hover:shadow-lg transition-all min-h-[200px]">
              {/* Single Full-Bleed Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-65 pointer-events-none"
                style={{ backgroundImage: "url('/hero-desk-bg.jpg')" }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/85 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10 space-y-2 text-left max-w-xs">
                <span className="text-[11px] sm:text-xs font-bold text-[#ef4444] tracking-wide block">
                  {language === 'sw' ? 'Mkusanyiko Maalum' : 'Exclusive Collection'}
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-white leading-tight tracking-tight">
                  {language === 'sw' ? (
                    <>
                      Imetengenezwa Kudumu
                      <span className="block">Ubora wa Kiwandani</span>
                    </>
                  ) : (
                    <>
                      Built for Durability
                      <span className="block">Driven by Quality</span>
                    </>
                  )}
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-300">
                  {language === 'sw'
                    ? 'Vifaa vya ofisi na shule visivyo na kifani.'
                    : 'Archival books. Unlimited daily performance.'}
                </p>
                <div className="pt-2">
                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-2.5 pl-5 pr-2 py-2 rounded-full bg-white hover:bg-zinc-100 text-[#111113] text-xs font-bold transition-all shadow-md"
                  >
                    <span>{language === 'sw' ? 'Gundua Zaidi' : 'Discover More'}</span>
                    <span className="w-6 h-6 rounded-full bg-[#dc2626] text-white flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED BENCHMARK PRODUCTS (Tabbed Catalog Grid) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[#fafafa] border-b border-[#e4e4e7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center px-3.5 py-1 rounded-md bg-gradient-to-r from-[#dc2626]/15 via-[#dc2626]/5 to-transparent border border-[#dc2626]/30 text-xs font-bold text-[#dc2626] font-mono uppercase tracking-widest shadow-xs">
              <span>{language === 'sw' ? 'VINARA VYA MAUZO KIWANDANI' : 'FACTORY BENCHMARK EDITIONS'}</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#18181b] tracking-tight">
              {language === 'sw' ? 'Bidhaa Zinazoongoza kwa Mauzo' : 'Benchmark Stationery Picks'}
            </h2>
            <p className="text-xs sm:text-sm text-[#71717a] leading-relaxed">
              {language === 'sw'
                ? 'Vitabu na madaftari yanayoongoza kwa mahitaji ya shule, maduka na taasisi kote Tanzania, tayari kwa usafirishaji wa haraka.'
                : 'High-velocity ledger books and student exercise editions in high daily demand across schools, wholesale shops, and commercial offices.'}
            </p>
          </div>

          {/* Filter Bar & Quick Catalog Access */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4 pt-1">
            {/* Filter Pills (Smooth scrollable on mobile, natural left alignment, no clipping) */}
            <div className="w-full sm:w-auto overflow-x-auto no-scrollbar py-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center justify-start gap-2">
              {[
                { id: 'all', label: t.allProducts || 'All Products' },
                { id: 'counter', label: 'Counter Books' },
                { id: 'exercise', label: 'Exercise Books' },
                { id: 'bahasha', label: 'Bahasha & Envelopes' },
                { id: 'registers', label: 'Registers & Paper' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 font-mono tracking-wider uppercase ${
                      isActive
                        ? 'bg-[#111113] text-white shadow-sm border border-zinc-900 ring-1 ring-white/10'
                        : 'bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 border border-zinc-200 shadow-2xs'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* View Complete Catalogue Button */}
            <Link
              to="/catalog"
              className="group inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-zinc-200 hover:border-[#dc2626] shadow-2xs text-xs font-mono font-bold uppercase tracking-wider text-[#18181b] hover:text-[#dc2626] transition-all shrink-0 self-start sm:self-auto"
            >
              <span>{language === 'sw' ? 'TAZAMA CATALOGUE YOTE' : 'VIEW COMPLETE CATALOGUE'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#dc2626]" />
            </Link>
          </div>

          {/* Product Cards Grid (2 cols on mobile, 4 on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View All Products CTA Button */}
          <div className="pt-6 sm:pt-8 flex justify-center">
            <Link
              to="/catalog"
              id="view-all-products-home-btn"
              className="inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#111113] hover:bg-[#111113] text-white text-xs sm:text-sm font-bold tracking-wider uppercase shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 group border border-[#dc2626]/30"
            >
              <span>{language === 'sw' ? 'Tazama Bidhaa Zote' : 'Explore Complete Catalogue'}</span>
              <ArrowRight className="w-4 h-4 text-[#dc2626] transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHOLESALE CARTON PRICING CALCULATOR (Interactive B2B Studio) */}
      {/* ========================================================================= */}
      <section className="py-8 sm:py-14 bg-[#111113] text-white border-b border-[#18181b] relative overflow-hidden">
        {/* Soft radial backlight */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#dc2626]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/30 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-3xl mx-auto px-3.5 sm:px-6 relative z-10 space-y-4 sm:space-y-5">
          <div className="text-center space-y-1.5">
            <span className="inline-flex items-center px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#ef4444] bg-[#dc2626]/10 border border-[#dc2626]/20 font-mono">
              <span>{language === 'sw' ? 'Bei za Jumla za Kiwandani' : 'B2B Factory Direct Pricing'}</span>
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {language === 'sw'
                ? 'Kikokotoo cha Bei za Jumla Kiwandani'
                : 'Wholesale Carton Pricing Calculator'}
            </h2>
          </div>

          {/* Interactive B2B Calculator Studio */}
          <div className="bg-[#131316] border border-white/10 p-4 sm:p-6 rounded-xl shadow-2xl space-y-4 sm:space-y-5 text-left relative overflow-hidden backdrop-blur-md">
            {/* Subtle card glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#dc2626]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Step 1: Select Book Model */}
            <div className="space-y-2 relative z-10">
              <div className="flex items-center justify-between">
                <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-red-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                  1. Select Notebook Model:
                </label>
                <span className="text-[11px] text-zinc-400 font-mono">
                  Smyth-sewn hardcovers
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {[
                  { key: 'q2', label: 'Quire 2 (Q2)', sub: '192p · 48 pcs/box', rate: formatPrice(q2Prod?.wholesalePrice || 56000, currency) },
                  { key: 'q3', label: 'Quire 3 (Q3)', sub: '288p · 36 pcs/box', rate: formatPrice(q3Prod?.wholesalePrice || 57000, currency) },
                  { key: 'q4', label: 'Quire 4 (Q4)', sub: '384p · 24 pcs/box', rate: formatPrice(q4Prod?.wholesalePrice || 60000, currency) },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setCalcBookType(item.key as any)}
                    className={`p-2.5 sm:p-3 rounded-lg border text-center transition-all duration-200 cursor-pointer ${
                      calcBookType === item.key
                        ? 'bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] text-white font-bold border-transparent shadow-md ring-1 ring-white/20'
                        : 'bg-[#0b0b0e] text-zinc-300 border-white/10 hover:border-white/25 hover:bg-[#111115]'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold truncate leading-tight">{item.label}</div>
                    <div className={`text-[10px] font-mono mt-0.5 ${calcBookType === item.key ? 'text-white/80' : 'text-zinc-400'}`}>
                      {item.sub}
                    </div>
                    <div className={`text-xs mt-1 font-mono font-bold ${calcBookType === item.key ? 'text-white' : 'text-red-400'}`}>
                      {item.rate}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Quantity (Responsive Grid + Stepper) */}
            <div className="space-y-2 relative z-10">
              <div className="flex items-center justify-between gap-1">
                <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-red-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                  2. Order Quantity ({unitsPerCarton} Pcs/Box):
                </label>
                <span className="text-white font-mono text-[11px] sm:text-xs font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                  {calcQuantity} Cartons · {totalUnits.toLocaleString()} Books
                </span>
              </div>

              {/* Presets and Stepper row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="grid grid-cols-5 gap-1.5 flex-1">
                  {[1, 5, 10, 20, 50].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setCalcQuantity(qty)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all duration-200 font-mono cursor-pointer flex items-center justify-center ${
                        calcQuantity === qty
                          ? 'bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] text-white border-transparent shadow-sm'
                          : 'bg-[#0b0b0e] text-zinc-300 border-white/10 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {qty} {qty === 1 ? 'Box' : 'Boxes'}
                    </button>
                  ))}
                </div>

                {/* Manual Stepper */}
                <div className="flex items-center justify-between sm:justify-center rounded-lg bg-[#0b0b0e] border border-white/10 p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setCalcQuantity(Math.max(1, calcQuantity - 1))}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 rounded-md bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center font-mono font-bold text-xs text-white">
                    {calcQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCalcQuantity(calcQuantity + 1)}
                    aria-label="Increase quantity"
                    className="w-8 h-8 rounded-md bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Price Calculation Live Studio Breakdown */}
            <div className="p-3.5 sm:p-4 rounded-lg bg-[#0b0b0e] border border-white/10 space-y-2 font-mono text-xs relative z-10">
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-400">Factory Carton Rate:</span>
                <span className="text-white font-bold">{formatPrice(calcBaseRate, currency)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-400">Effective Unit Rate:</span>
                <span className="text-emerald-400 font-bold">~{formatPrice(unitPrice, currency)} / book</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-400">Selected Volume:</span>
                <span className="text-white font-bold">
                  {calcQuantity} {calcQuantity === 1 ? 'Carton' : 'Cartons'} ({totalUnits.toLocaleString()} units)
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2.5 border-t border-white/10">
                <span className="font-sans font-semibold text-xs sm:text-sm text-zinc-200">Total Proforma Amount:</span>
                <span className="text-xl sm:text-2xl font-black font-mono text-[#ef4444] tracking-tight">
                  {formatPrice(calcTotal, currency)}
                </span>
              </div>
            </div>

            {/* WhatsApp Proforma Trigger */}
            <a
              href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                `*OMEGA WHOLESALE PROFORMA INQUIRY*\n` +
                `Product: Counter Book ${calcBookType.toUpperCase()}\n` +
                `Quantity: ${calcQuantity} Cartons (${totalUnits} Units)\n` +
                `Rate per Carton: ${formatPrice(calcBaseRate, currency)}\n` +
                `Total Amount: ${formatPrice(calcTotal, currency)}\n\n` +
                `Please share formal proforma invoice and dispatch waybill schedule.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] hover:from-[#991b1b] hover:to-[#dc2626] text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98 group cursor-pointer font-sans"
            >
              <MessageCircle className="w-4 h-4 fill-white text-transparent shrink-0" />
              <span>Request Proforma Invoice on WhatsApp</span>
              <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
            </a>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CLIENT & ENTERPRISE TESTIMONIALS (Social Proof) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[#111113] text-white border-b border-[#18181b] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center px-3.5 py-1 rounded-lg bg-gradient-to-r from-[#dc2626]/20 via-[#dc2626]/10 to-transparent border border-[#dc2626]/40 text-xs font-bold text-[#ef4444] font-mono uppercase tracking-widest shadow-xs">
              <span>TESTIMONIALS &amp; CLIENT TRUST</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white tracking-tight">
              {language === 'sw' ? 'Wateja Wetu Wanasemaje' : 'Trusted by Schools & Enterprises'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              {language === 'sw'
                ? 'Walimu wakuu, wahasibu, na wamiliki wa maduka ya vifaa vya shule kote nchini wanaamini OMEGA.'
                : 'Loved by headmasters, corporate accountants, and stationery wholesalers across all 31 regions of Tanzania.'}
            </p>
          </div>

          {/* 3 Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Review 1 */}
            <div className="p-6 rounded-2xl bg-[#18181b] border border-white/10 space-y-4 shadow-xl flex flex-col justify-between hover:border-[#dc2626]/40 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-[#dc2626]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#dc2626] text-[#dc2626]" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[#dc2626]/40" />
                </div>
                <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed">
                  “Daftari la OMEGA Quire 3 lina karatasi ngumu sana na jalada lisilopinda. Linanisaidia sana kwenye mahesabu ya kila mwezi bila wino kupenya.”
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#dc2626] text-white font-black flex items-center justify-center text-xs shadow-md shrink-0">
                  EK
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">Emanuel Kiwanga</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                    <Building2 className="w-3 h-3 text-[#dc2626]" />
                    <span className="truncate">Chief Accountant · Dar es Salaam</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-6 rounded-2xl bg-[#18181b] border border-white/10 space-y-4 shadow-xl flex flex-col justify-between hover:border-[#dc2626]/40 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-[#dc2626]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#dc2626] text-[#dc2626]" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[#dc2626]/40" />
                </div>
                <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed">
                  “The quality of OMEGA stationery is unmatched. Our secondary school orders 200-page single line exercise books every term without fail.”
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#dc2626] text-white font-black flex items-center justify-center text-xs shadow-md shrink-0">
                  GM
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">Grace Mhando</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                    <GraduationCap className="w-3 h-3 text-[#dc2626]" />
                    <span className="truncate">Head of Academics · Arusha</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-6 rounded-2xl bg-[#18181b] border border-white/10 space-y-4 shadow-xl flex flex-col justify-between hover:border-[#dc2626]/40 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-[#dc2626]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#dc2626] text-[#dc2626]" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[#dc2626]/40" />
                </div>
                <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed">
                  “Fast bus parcel dispatch to Mwanza! The kraft envelopes and ruled reams arrived safely packed in OMEGA branded cartons within 24 hours.”
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#dc2626] text-white font-black flex items-center justify-center text-xs shadow-md shrink-0">
                  JM
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">Joseph Mollel</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                    <Store className="w-3 h-3 text-[#dc2626]" />
                    <span className="truncate">Stationery Store Owner · Mwanza</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. VIP CONCIERGE & DIRECT FACTORY HOTLINES */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#18181b] via-[#111114] to-[#0a0a0c] text-white relative overflow-hidden">
        {/* Ambient Backlight Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#dc2626]/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="p-6 sm:p-10 rounded-xl bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-sm text-center space-y-5">
            <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#dc2626]/15 border border-[#dc2626]/30 text-xs font-bold uppercase tracking-wider text-[#ef4444] font-mono">
              VIP CONCIERGE &amp; PRICE ALERTS
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {language === 'sw' ? 'Jiunge na OMEGA Stationery' : 'Connect with OMEGA Stationery'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto">
              {language === 'sw'
                ? 'Pata taarifa za bei mpya za jumla, katalogi ya 2026 na ofa maalum za vifaa vya shule na ofisi.'
                : 'Receive official 2026 wholesale catalogs, bulk school tender announcements, and factory-direct price updates.'}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(language === 'sw' ? 'Asante! Tumepokea mawasiliano yako.' : 'Thank you! We received your details.');
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto pt-2 w-full"
            >
              <div className="relative flex-1 w-full">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder={language === 'sw' ? 'Namba ya simu au email...' : 'Enter your email or phone number...'}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-xs sm:text-sm bg-black/50 text-white placeholder:text-zinc-500 border border-white/15 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] backdrop-blur-xs font-sans transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-lg bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] hover:from-[#991b1b] hover:via-[#b91c1c] hover:to-[#dc2626] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-900/30 shrink-0 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>{language === 'sw' ? 'WASILIANA' : 'SUBSCRIBE'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#dc2626]" />
                {language === 'sw' ? 'Hakuna barua taka (No Spam)' : 'Zero Spam Guarantee'}
              </span>
              <span className="hidden sm:inline text-zinc-600">•</span>
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#dc2626]" />
                {language === 'sw' ? 'Katalogi ya 2026 papo hapo' : 'Instant 2026 Price Catalog'}
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

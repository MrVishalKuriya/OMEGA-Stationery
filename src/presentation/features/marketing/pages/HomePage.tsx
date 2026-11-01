import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Feather,
  Package,
  Layers,
  Star,
  Check,
  Truck,
  BookOpen,
  Award,
  ChevronRight,
  ChevronLeft,
  Quote,
  Building2,
  Mail,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { Hero } from '../components/Hero';
import { SEOHead } from '@/components/SEOHead';
import { TRANSLATIONS } from '@/data/translations';

export const HomePage: React.FC = () => {
  const {
    products,
    storeConfig,
    language,
  } = useStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'all' | 'counter' | 'exercise' | 'bahasha' | 'registers'
  >('all');

  const cleanWhatsappDigits = storeConfig.whatsappNumber
    ? storeConfig.whatsappNumber.replace(/\D/g, '')
    : '255746268391';

  const whatsappGreetingUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    language === 'sw'
      ? `Habari OMEGA Tanzania, ninahitaji kuagiza madaftari (Counter Books, Exercise Books na Bahasha) kwa bei ya jumla kiwandani.`
      : `Hello OMEGA Stationery, I would like to place an order and inquire about factory wholesale carton pricing.`
  )}`;

  // Filter products dynamically for the featured catalog section
  const filteredProducts = useMemo(() => {
    if (activeTab === 'counter') return products.filter((p) => p.category === 'Counter Books');
    if (activeTab === 'exercise') return products.filter((p) => p.category === 'Exercise Books');
    if (activeTab === 'bahasha') return products.filter((p) => p.category === 'Bahasha & Envelopes');
    if (activeTab === 'registers') return products.filter((p) => p.category === 'Registers' || p.category === 'Ruled Paper');

    const featured = products.filter((p) => p.featured || p.bestSeller);
    const regular = products.filter((p) => !p.featured && !p.bestSeller);
    return [...featured, ...regular];
  }, [products, activeTab]);

  const displayedProducts = filteredProducts.slice(0, 10);

  // 4 Collections matching the reference "SHOP BY COLLECTION" layout
  const collections = useMemo(() => [
    {
      title: language === 'sw' ? 'COUNTER BOOKS' : 'COUNTER BOOKS',
      desc: language === 'sw' ? 'Jalada Gumu, Q2, Q3 & Q4' : 'Hardcover Ledger Folios',
      sub: 'Archival Smyth-Sewn',
      link: '/catalog?category=Counter+Books',
      image: '/omega-products/omega-counter-book-podium.png',
      bgTone: 'bg-[#111113]',
    },
    {
      title: language === 'sw' ? 'EXERCISE BOOKS' : 'EXERCISE BOOKS',
      desc: language === 'sw' ? 'Kurasa 200, 100 & 80' : 'School & Classroom Editions',
      sub: 'Single & Double Line',
      link: '/catalog?category=Exercise+Books',
      image: '/omega-products/exercise-book-200p-sl-catalog.jpeg',
      bgTone: 'bg-[#2a2421]',
    },
    {
      title: language === 'sw' ? 'KRAFT BAHASHA' : 'KRAFT BAHASHA',
      desc: language === 'sw' ? 'A3, A4, A5 & A6' : 'Tear-Resistant Document Mailers',
      sub: 'Peel & Seal Security',
      link: '/catalog?category=Bahasha+%26+Envelopes',
      image: '/omega-products/bahasha-a4-catalog.png',
      bgTone: 'bg-[#211a16]',
    },
    {
      title: language === 'sw' ? 'OFFICE REGISTERS' : 'OFFICE REGISTERS',
      desc: language === 'sw' ? 'Semi-Rigid & Bond Reams' : 'Commercial Paper Products',
      sub: '70 GSM Pure White',
      link: '/catalog?category=Registers',
      image: '/omega-products/stiff-cover-200-catalog.jpeg',
      bgTone: 'bg-[#1f1f23]',
    },
  ], [language]);

  return (
    <div className="bg-[#FAF9F7] min-h-screen font-sans text-[#111113] selection:bg-[#dc2626]/20 selection:text-[#111113]">
      <SEOHead
        title="OMEGA Writing Notebooks & Stationery | Premium Quality | Tanzania"
        description="Tanzania's benchmark in Counter Books (Q2, Q3, Q4), Exercise Books, Kraft Bahasha, and Office Files. Factory-direct wholesale and upcountry bus parcel delivery."
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Untouched as requested) */}
      {/* ========================================================================= */}
      <Hero whatsappGreetingUrl={whatsappGreetingUrl} />

      {/* ========================================================================= */}
      {/* 2. FOUR-PILLAR HALLMARK STRIP (Text In Front of Logo / Horizontal Row) */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-[#E7E5E0] py-4 sm:py-6">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            
            {/* 1. Books Distributed */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center font-bold border border-[#dc2626]/20 shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-lg font-black text-[#111113] font-heading tracking-tight leading-none">
                  500,000+
                </div>
                <h4 className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#111113] mt-1 leading-snug truncate">
                  Books Distributed
                </h4>
                <p className="text-[9.5px] text-[#6E6B66] hidden sm:block mt-0.5 truncate">
                  Annual supply to schools &amp; firms
                </p>
              </div>
            </div>

            {/* 2. Nationwide Parcel */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center font-bold border border-[#dc2626]/20 shrink-0">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-lg font-black text-[#111113] font-heading tracking-tight leading-none">
                  31 Regions
                </div>
                <h4 className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#111113] mt-1 leading-snug truncate">
                  Nationwide Parcel
                </h4>
                <p className="text-[9.5px] text-[#6E6B66] hidden sm:block mt-0.5 truncate">
                  Same-day waybills to bus terminals
                </p>
              </div>
            </div>

            {/* 3. Bleed-Proof Paper */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center font-bold border border-[#dc2626]/20 shrink-0">
                <Feather className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-lg font-black text-[#dc2626] font-heading tracking-tight leading-none">
                  70 GSM
                </div>
                <h4 className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#111113] mt-1 leading-snug truncate">
                  Bleed-Proof Paper
                </h4>
                <p className="text-[9.5px] text-[#6E6B66] hidden sm:block mt-0.5 truncate">
                  Zero feathering with fountain &amp; gel ink
                </p>
              </div>
            </div>

            {/* 4. Thread-Sewn Spine */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center font-bold border border-[#dc2626]/20 shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-lg font-black text-[#111113] font-heading tracking-tight leading-none">
                  100%
                </div>
                <h4 className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#111113] mt-1 leading-snug truncate">
                  Thread-Sewn Spine
                </h4>
                <p className="text-[9.5px] text-[#6E6B66] hidden sm:block mt-0.5 truncate">
                  Pages never loosen or fall out
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SHOP BY COLLECTION (4 Horizontal Cards Matching Reference Layout) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[#FAF9F7]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">

          {/* Centered Editorial Header */}
          <div className="text-center space-y-2">
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold tracking-wider uppercase text-[#111113]">
              {language === 'sw' ? 'MKUSANYIKO WA VITABU' : 'SHOP BY COLLECTION'}
            </h2>
            <div className="w-12 h-0.5 bg-[#8C7355] mx-auto opacity-60" />
          </div>

          {/* 4 Collection Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {collections.map((col, idx) => (
              <Link
                key={idx}
                to={col.link}
                className="group relative h-48 sm:h-56 rounded-lg overflow-hidden border border-[#E7E5E0] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-5 text-white"
                style={{ backgroundColor: '#111113' }}
              >
                {/* Background Image with Dark Vignette Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover object-center opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
                </div>

                {/* Top Badge / Subtitle */}
                <div className="relative z-10">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#c8a27a] block">
                    {col.sub}
                  </span>
                </div>

                {/* Bottom Title & Action */}
                <div className="relative z-10 space-y-1.5">
                  <h3 className="font-heading text-base sm:text-lg font-bold tracking-wide uppercase text-white leading-snug">
                    {col.title}
                  </h3>
                  <p className="text-[11px] text-zinc-300 line-clamp-1">
                    {col.desc}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono tracking-widest uppercase text-white font-bold group-hover:text-[#c8a27a] border-b border-white/60 group-hover:border-[#c8a27a] pb-0.5 transition-all">
                      <span>SHOP NOW</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURED NOTEBOOKS & BOOKS ("FEATURED FRAGRANCES" Reference Layout) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white border-y border-[#E7E5E0]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

          {/* Centered Editorial Header */}
          <div className="text-center space-y-2">
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold tracking-wider uppercase text-[#111113]">
              {language === 'sw' ? 'Mkusanyiko Bora' : 'FEATURED STATIONERY'}
            </h2>
            <div className="w-12 h-0.5 bg-[#8C7355] mx-auto opacity-60" />
            <p className="text-xs sm:text-sm text-[#6E6B66] max-w-xl mx-auto pt-1">
              {language === 'sw'
                ? 'Vitabu na madaftari yenye viwango vya juu vya ubora vinavyopendwa kote Tanzania.'
                : 'Benchmark ledger books, classroom exercise books and tear-resistant kraft mailers.'}
            </p>
          </div>

          {/* Minimalist Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: t.allProducts || 'All' },
              { id: 'counter', label: 'Counter Books' },
              { id: 'exercise', label: 'Exercise Books' },
              { id: 'bahasha', label: 'Kraft Bahasha' },
              { id: 'registers', label: 'Registers' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 text-[11px] font-mono tracking-wider uppercase rounded-sm transition-all duration-200 cursor-pointer ${isActive
                      ? 'bg-[#111113] text-white font-bold'
                      : 'bg-transparent text-[#6E6B66] hover:text-[#111113] hover:bg-[#FAF9F7]'
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Reference-Style Cards Grid (5 columns on large desktop, 2 on mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Centered "VIEW ALL PRODUCTS" link (matching reference layout) */}
          <div className="pt-4 text-center">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-[#111113] hover:text-[#8C7355] border-b-2 border-[#111113] hover:border-[#8C7355] pb-1 transition-all group"
            >
              <span>{language === 'sw' ? 'TAZAMA BIDHAA ZOTE' : 'VIEW ALL PRODUCTS'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. "OUR STORY" EDITORIAL HERITAGE (Matching Reference Editorial Split) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#FAF9F7] border-b border-[#E7E5E0] overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* Left Column: Editorial Heritage Narrative */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="space-y-2">
                <span className="text-[10.5px] font-mono tracking-widest uppercase text-[#8C7355] font-bold block">
                  {language === 'sw' ? 'HISTORIA YETU' : 'OUR HERITAGE'}
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#111113] leading-tight">
                  {language === 'sw' ? (
                    <>
                      Sanaa ya madaftari bora
                      <span className="block font-normal italic">ndiyo urithi wetu.</span>
                    </>
                  ) : (
                    <>
                      The art of fine stationery
                      <span className="block font-normal italic">is our heritage.</span>
                    </>
                  )}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#6E6B66] leading-relaxed max-w-lg">
                {language === 'sw'
                  ? 'Kiwandani OMEGA, kila daftari ni kazi ya usanifu unaozingatia uimara — lililoundwa Tanzania kwa karatasi ngumu ya 70 GSM isiyopenyeza wino, ushonaji thabiti wa nyuzi, na jalada linalodumu kwa miaka. Tunaamini katika thamani ya kudumu na heshima ya kazi halisi za nyumbani.'
                  : 'At OMEGA Stationery, every book is a work of precision — crafted with pride in Tanzania using 70 GSM bleed-proof bond, Smyth-sewn archival bookbinding, and enduring hardboard covers. We believe in uncompromised factory integrity, tangible paper craft, and the quiet authority that only genuine stationery delivers.'}
              </p>

              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[#111113] hover:bg-[#8C7355] text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors shadow-xs"
                >
                  <span>{language === 'sw' ? 'GUNDUA ZAIDI' : 'DISCOVER OUR CRAFT'}</span>
                </Link>
              </div>

              {/* 4 Hallmark Icons Matching Reference Layout */}
              <div className="pt-6 border-t border-[#E7E5E0] grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Feather className="w-4 h-4 text-[#8C7355]" />
                  <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#111113]">
                    Pure 70 GSM
                  </h5>
                  <p className="text-[9.5px] text-[#6E6B66] leading-tight">
                    Bleed-proof bond paper
                  </p>
                </div>

                <div className="space-y-1">
                  <BookOpen className="w-4 h-4 text-[#8C7355]" />
                  <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#111113]">
                    Master Sewn
                  </h5>
                  <p className="text-[9.5px] text-[#6E6B66] leading-tight">
                    Smyth-threaded spine
                  </p>
                </div>

                <div className="space-y-1">
                  <Building2 className="w-4 h-4 text-[#8C7355]" />
                  <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#111113]">
                    Factory Direct
                  </h5>
                  <p className="text-[9.5px] text-[#6E6B66] leading-tight">
                    Direct from Mkuranga &amp; Mbeya
                  </p>
                </div>

                <div className="space-y-1">
                  <ShieldCheck className="w-4 h-4 text-[#8C7355]" />
                  <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#111113]">
                    Archival Build
                  </h5>
                  <p className="text-[9.5px] text-[#6E6B66] leading-tight">
                    Preserves records for years
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Visual Product Editorial Frame */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden border border-[#E7E5E0] bg-[#111113] p-8 flex items-center justify-center shadow-lg group">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: "url('/hero-desk-bg.jpg')" }}
                  aria-hidden="true"
                />
                <img
                  src="/omega-hero-book.png"
                  alt="OMEGA Smyth-Sewn Archival Notebook"
                  className="relative z-10 max-h-full max-w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute bottom-3 right-4 z-20 text-[10px] font-mono tracking-widest text-[#c8a27a] uppercase">
                  OMEGA ARCHIVAL · EST. TANZANIA
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PROMOTIONAL 20% OFF LUXURY BANNER (Matching Reference Layout) */}
      {/* ========================================================================= */}
      <section className="bg-[#111113] text-white border-y border-[#27272a] py-8 sm:py-10 relative overflow-hidden">
        {/* Subtle Ochre Radial Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#8C7355]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">

            {/* Left: Giant 20% OFF */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-[#c8a27a] tracking-tight leading-none">
                20<span className="text-xl sm:text-2xl font-sans">%</span>
                <span className="block text-[11px] font-mono font-normal tracking-widest uppercase text-white/80">
                  OFF CARTONS
                </span>
              </div>
              <div className="w-px h-12 bg-white/20 hidden sm:block" />
            </div>

            {/* Center: Editorial Offer Copy */}
            <div className="space-y-1 max-w-xl">
              <h3 className="font-heading text-lg sm:text-xl font-medium text-white tracking-wide">
                {language === 'sw'
                  ? 'Kwa sababu taasisi yako inastahili ubora usio na kifani.'
                  : 'Because your institution deserves genuine lasting quality.'}
              </h3>
              <p className="text-xs text-zinc-400">
                {language === 'sw'
                  ? 'Furahia punguzo la 20% kwa oda zote za jumla za katoni za vitabu na bahasha kiwandani.'
                  : 'Enjoy special factory carton rates on all bulk counter books and exercise reams for a limited time.'}
              </p>
            </div>

            {/* Right: CTA Button */}
            <div className="shrink-0">
              <Link
                to="/wholesale"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-white hover:bg-[#c8a27a] text-[#111113] text-xs font-mono font-bold tracking-wider uppercase transition-colors shadow-md"
              >
                <span>{language === 'sw' ? 'AGIZA KWA BEI YA JUMLA' : 'SHOP WHOLESALE CARTONS'}</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. "LOVED BY OUR CLIENTS" (Matching Reference Review Cards) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E7E5E0]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Header with Navigation Indicator */}
          <div className="flex items-center justify-between">
            <div className="w-10 hidden sm:block" />
            <div className="text-center space-y-1 flex-1">
              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold tracking-wider uppercase text-[#111113]">
                {language === 'sw' ? 'WATEJA WETU WANASEMAJE' : 'LOVED BY OUR CLIENTS'}
              </h2>
              <div className="w-12 h-0.5 bg-[#8C7355] mx-auto opacity-60" />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                aria-label="Previous testimonial"
                className="w-8 h-8 rounded-full border border-[#E7E5E0] flex items-center justify-center text-[#111113] hover:bg-[#FAF9F7] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                className="w-8 h-8 rounded-full border border-[#E7E5E0] flex items-center justify-center text-[#111113] hover:bg-[#FAF9F7] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3 Review Cards Matching Reference Styling */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">

            {/* Review 1 */}
            <div className="p-6 rounded-lg bg-[#FAF9F7] border border-[#E7E5E0] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl text-[#8C7355] leading-none">“</span>
                  <div className="flex gap-0.5 text-[#8C7355]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#8C7355] text-[#8C7355]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#47464A] italic leading-relaxed">
                  “Daftari la OMEGA Quire 3 lina karatasi ngumu sana na jalada lisilopinda. Linanisaidia sana kwenye mahesabu ya kila mwezi bila wino kupenya kabisa.”
                </p>
              </div>
              <div className="pt-4 border-t border-[#E7E5E0]/70 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#111113] text-white font-mono font-bold flex items-center justify-center text-xs shrink-0">
                  EK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111113]">Emanuel Kiwanga</h4>
                  <p className="text-[10.5px] text-[#6E6B66] font-mono">
                    Chief Accountant · Dar es Salaam
                  </p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-6 rounded-lg bg-[#FAF9F7] border border-[#E7E5E0] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl text-[#8C7355] leading-none">“</span>
                  <div className="flex gap-0.5 text-[#8C7355]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#8C7355] text-[#8C7355]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#47464A] italic leading-relaxed">
                  “The Smyth-sewn binding of OMEGA exercise books is truly unmatched. Our secondary school orders 200-page single line books every term without fail.”
                </p>
              </div>
              <div className="pt-4 border-t border-[#E7E5E0]/70 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#111113] text-white font-mono font-bold flex items-center justify-center text-xs shrink-0">
                  GM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111113]">Grace Mhando</h4>
                  <p className="text-[10.5px] text-[#6E6B66] font-mono">
                    Head of Academics · Arusha
                  </p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-6 rounded-lg bg-[#FAF9F7] border border-[#E7E5E0] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl text-[#8C7355] leading-none">“</span>
                  <div className="flex gap-0.5 text-[#8C7355]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#8C7355] text-[#8C7355]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#47464A] italic leading-relaxed">
                  “Fast bus parcel dispatch to Mwanza! The kraft envelopes and ruled reams arrived safely packed in OMEGA branded cartons within 24 hours.”
                </p>
              </div>
              <div className="pt-4 border-t border-[#E7E5E0]/70 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#111113] text-white font-mono font-bold flex items-center justify-center text-xs shrink-0">
                  JM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111113]">Joseph Mollel</h4>
                  <p className="text-[10.5px] text-[#6E6B66] font-mono">
                    Stationery Store Owner · Mwanza
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. NEWSLETTER STRIP ("Stay inspired & be the first to know" Reference Layout) */}
      {/* ========================================================================= */}
      <section className="py-8 sm:py-10 bg-[#111113] text-white border-t border-[#27272a] relative overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

            {/* Left: Heading & Description */}
            <div className="flex items-center gap-4 text-center lg:text-left">
              <div className="w-10 h-10 rounded-md bg-[#8C7355]/20 border border-[#8C7355]/30 flex items-center justify-center text-[#c8a27a] shrink-0 hidden sm:flex">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-heading text-base sm:text-lg font-medium text-white tracking-wide">
                  {language === 'sw'
                    ? 'Pata taarifa za bei mpya & matoleo ya kiwandani'
                    : 'Stay inspired & be the first to know'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {language === 'sw'
                    ? 'Katalogi rasmi ya 2026, bei za zabuni za shule na ofa za madaftari.'
                    : 'Exclusive offers, new catalog releases, and factory tender schedules.'}
                </p>
              </div>
            </div>

            {/* Right: Input and Button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(language === 'sw' ? 'Asante! Tumepokea mawasiliano yako.' : 'Thank you! We received your details.');
              }}
              className="flex items-center gap-2 w-full max-w-md shrink-0"
            >
              <input
                type="text"
                required
                placeholder={language === 'sw' ? 'Namba ya simu au email...' : 'Enter your email address'}
                className="flex-1 px-4 py-2.5 rounded-md text-xs bg-white text-[#111113] placeholder:text-zinc-500 border border-transparent focus:outline-none focus:ring-1 focus:ring-[#8C7355] font-sans"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-md bg-[#8C7355] hover:bg-[#a08462] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
              >
                {language === 'sw' ? 'JIUNGE' : 'SIGN ME UP'}
              </button>
            </form>

          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

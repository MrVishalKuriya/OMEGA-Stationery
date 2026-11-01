import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Feather,
  Package,
  Layers,
  Star,
  Truck,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Building2,
  Mail,
  Award,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { Hero } from '../components/Hero';
import { SEOHead } from '@/components/SEOHead';
import { TRANSLATIONS } from '@/data/translations';

export const HomePage: React.FC = () => {
  const {
    products,
    language,
  } = useStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'all' | 'counter' | 'exercise' | 'bahasha' | 'registers'
  >('all');

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
    },
    {
      title: language === 'sw' ? 'EXERCISE BOOKS' : 'EXERCISE BOOKS',
      desc: language === 'sw' ? 'Kurasa 200, 100 & 80' : 'School & Classroom Editions',
      sub: 'Single & Double Line',
      link: '/catalog?category=Exercise+Books',
      image: '/omega-products/exercise-book-200p-sl-catalog.jpeg',
    },
    {
      title: language === 'sw' ? 'KRAFT BAHASHA' : 'KRAFT BAHASHA',
      desc: language === 'sw' ? 'A3, A4, A5 & A6' : 'Tear-Resistant Document Mailers',
      sub: 'Peel & Seal Security',
      link: '/catalog?category=Bahasha+%26+Envelopes',
      image: '/omega-products/bahasha-a4-catalog.png',
    },
    {
      title: language === 'sw' ? 'OFFICE REGISTERS' : 'OFFICE REGISTERS',
      desc: language === 'sw' ? 'Semi-Rigid & Bond Reams' : 'Commercial Paper Products',
      sub: '70 GSM Pure White',
      link: '/catalog?category=Registers',
      image: '/omega-products/stiff-cover-200-catalog.jpeg',
    },
  ], [language]);

  return (
    <div className="bg-[#FAF9F7] min-h-screen font-sans text-[#111113] selection:bg-[#DC2626]/20 selection:text-[#111113]">
      <SEOHead
        title="OMEGA Writing Notebooks & Stationery | Premium Quality | Tanzania"
        description="Tanzania's benchmark in Counter Books (Q2, Q3, Q4), Exercise Books, Kraft Bahasha, and Office Files. Factory-direct wholesale and upcountry bus parcel delivery."
      />

      {/* ========================================================================= */}
      {/* 1. HERO SHOWCASE SLIDER */}
      {/* ========================================================================= */}
      <Hero />

      {/* ========================================================================= */}
      {/* 2. FOUR-PILLAR HALLMARK TRUST STRIP */}
      {/* ========================================================================= */}
      <section className="bg-white border-b border-[#E7E5E0] py-4 sm:py-6">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            
            {/* 1. Books Distributed */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center font-bold border border-[#DC2626]/20 shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-lg font-black text-[#111113] font-heading tracking-tight leading-none">
                  500,000+
                </div>
                <h4 className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#111113] mt-1 leading-snug truncate">
                  Books Distributed
                </h4>
                <p className="text-[9.5px] text-[#6E6B66] hidden sm:block mt-0.5 truncate font-sans">
                  Annual supply to schools &amp; firms
                </p>
              </div>
            </div>

            {/* 2. Nationwide Parcel */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center font-bold border border-[#DC2626]/20 shrink-0">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-lg font-black text-[#111113] font-heading tracking-tight leading-none">
                  31 Regions
                </div>
                <h4 className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#111113] mt-1 leading-snug truncate">
                  Nationwide Parcel
                </h4>
                <p className="text-[9.5px] text-[#6E6B66] hidden sm:block mt-0.5 truncate font-sans">
                  Same-day waybills to bus terminals
                </p>
              </div>
            </div>

            {/* 3. Bleed-Proof Paper */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center font-bold border border-[#DC2626]/20 shrink-0">
                <Feather className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-lg font-black text-[#DC2626] font-heading tracking-tight leading-none">
                  70 GSM
                </div>
                <h4 className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#111113] mt-1 leading-snug truncate">
                  Bleed-Proof Paper
                </h4>
                <p className="text-[9.5px] text-[#6E6B66] hidden sm:block mt-0.5 truncate font-sans">
                  Zero feathering with fountain &amp; gel ink
                </p>
              </div>
            </div>

            {/* 4. Thread-Sewn Spine */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center font-bold border border-[#DC2626]/20 shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-lg font-black text-[#111113] font-heading tracking-tight leading-none">
                  100%
                </div>
                <h4 className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#111113] mt-1 leading-snug truncate">
                  Thread-Sewn Spine
                </h4>
                <p className="text-[9.5px] text-[#6E6B66] hidden sm:block mt-0.5 truncate font-sans">
                  Pages never loosen or fall out
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SHOP BY COLLECTION (4 Editorial Cards) */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-[#FAF9F7]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

          {/* Centered Editorial Header */}
          <div className="text-center space-y-2">
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold tracking-wider uppercase text-[#111113]">
              {language === 'sw' ? 'MKUSANYIKO WA VITABU' : 'SHOP BY COLLECTION'}
            </h2>
            <div className="w-12 h-0.5 bg-[#8C7355] mx-auto opacity-60" />
            <p className="text-xs sm:text-sm text-[#6E6B66] max-w-xl mx-auto pt-1 font-sans">
              {language === 'sw'
                ? 'Gundua aina zote za madaftari ya OMEGA yaliyotengenezwa kwa viwango vya juu vya kimataifa.'
                : 'Explore archival counter folios, classroom exercise books, and tear-resistant kraft mailers.'}
            </p>
          </div>

          {/* 4 Collection Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {collections.map((col, idx) => (
              <Link
                key={idx}
                to={col.link}
                className="group relative h-52 sm:h-60 rounded-xl overflow-hidden border border-[#E7E5E0] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-5 text-white"
                style={{ backgroundColor: '#111113' }}
              >
                {/* Background Image with Dark Gradient Scrim */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover object-center opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
                </div>

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#c8a27a] block font-bold">
                    {col.sub}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-[#DC2626] backdrop-blur-xs flex items-center justify-center text-white transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.75]" />
                  </div>
                </div>

                {/* Bottom Title & Action */}
                <div className="relative z-10 space-y-1.5">
                  <h3 className="font-heading text-base sm:text-lg font-bold tracking-wide uppercase text-white leading-snug">
                    {col.title}
                  </h3>
                  <p className="text-[11px] text-zinc-300 line-clamp-1 font-sans">
                    {col.desc}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono tracking-widest uppercase text-white font-bold group-hover:text-[#c8a27a] border-b border-white/60 group-hover:border-[#c8a27a] pb-0.5 transition-all">
                      <span>SHOP NOW</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1 stroke-[1.75]" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURED NOTEBOOKS & BOOKS (5-Column Grid with Red ADD TO CART Only) */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-white border-y border-[#E7E5E0]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

          {/* Centered Editorial Header */}
          <div className="text-center space-y-2">
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold tracking-wider uppercase text-[#111113]">
              {language === 'sw' ? 'Mkusanyiko Bora' : 'FEATURED STATIONERY'}
            </h2>
            <div className="w-12 h-0.5 bg-[#8C7355] mx-auto opacity-60" />
            <p className="text-xs sm:text-sm text-[#6E6B66] max-w-xl mx-auto pt-1 font-sans">
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
                  className={`px-3.5 py-1.5 text-[11px] font-mono tracking-wider uppercase rounded-md transition-all duration-200 cursor-pointer ${isActive
                      ? 'bg-[#111113] text-white font-bold shadow-xs'
                      : 'bg-transparent text-[#6E6B66] hover:text-[#111113] hover:bg-[#FAF9F7]'
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Centered "VIEW ALL PRODUCTS" link */}
          <div className="pt-4 text-center">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-[#111113] hover:text-[#DC2626] border-b-2 border-[#111113] hover:border-[#DC2626] pb-1 transition-all group"
            >
              <span>{language === 'sw' ? 'TAZAMA BIDHAA ZOTE' : 'VIEW ALL PRODUCTS'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 stroke-[1.75]" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. "OUR STORY" EDITORIAL HERITAGE (Veloura & Note Act Split Layout) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[#FAF9F7] border-b border-[#E7E5E0] overflow-hidden">
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

              <p className="text-xs sm:text-sm text-[#6E6B66] leading-relaxed max-w-lg font-sans">
                {language === 'sw'
                  ? 'Kiwandani OMEGA, kila daftari ni kazi ya usanifu unaozingatia uimara — lililoundwa Tanzania kwa karatasi ngumu ya 70 GSM isiyopenyeza wino, ushonaji thabiti wa nyuzi, na jalada linalodumu kwa miaka.'
                  : 'At OMEGA Stationery, every book is a work of precision — crafted with pride in Tanzania using 70 GSM bleed-proof bond, Smyth-sewn archival bookbinding, and enduring hardboard covers.'}
              </p>

              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#111113] hover:bg-[#8C7355] text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors shadow-xs"
                >
                  <span>{language === 'sw' ? 'GUNDUA ZAIDI' : 'DISCOVER OUR CRAFT'}</span>
                </Link>
              </div>

              {/* 4 Hallmark Icons Grid */}
              <div className="pt-6 border-t border-[#E7E5E0] grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Feather className="w-4 h-4 text-[#8C7355] stroke-[1.75]" />
                  <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#111113]">
                    Pure 70 GSM
                  </h5>
                  <p className="text-[9.5px] text-[#6E6B66] leading-tight font-sans">
                    Bleed-proof bond paper
                  </p>
                </div>

                <div className="space-y-1">
                  <BookOpen className="w-4 h-4 text-[#8C7355] stroke-[1.75]" />
                  <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#111113]">
                    Master Sewn
                  </h5>
                  <p className="text-[9.5px] text-[#6E6B66] leading-tight font-sans">
                    Smyth-threaded spine
                  </p>
                </div>

                <div className="space-y-1">
                  <Building2 className="w-4 h-4 text-[#8C7355] stroke-[1.75]" />
                  <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#111113]">
                    Factory Direct
                  </h5>
                  <p className="text-[9.5px] text-[#6E6B66] leading-tight font-sans">
                    Direct from Mkuranga &amp; Mbeya
                  </p>
                </div>

                <div className="space-y-1">
                  <ShieldCheck className="w-4 h-4 text-[#8C7355] stroke-[1.75]" />
                  <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#111113]">
                    Archival Build
                  </h5>
                  <p className="text-[9.5px] text-[#6E6B66] leading-tight font-sans">
                    Preserves records for years
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Visual Product Editorial Frame */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7E5E0] bg-[#111113] p-8 flex items-center justify-center shadow-lg group">
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
      {/* 6. PROMOTIONAL WHOLESALE CARTON RATES BANNER (Veloura Reference) */}
      {/* ========================================================================= */}
      <section className="bg-[#111113] text-white border-y border-[#27272a] py-8 sm:py-10 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#DC2626]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">

            {/* Left: 20% OFF Cartons */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-[#DC2626] tracking-tight leading-none">
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
              <p className="text-xs text-zinc-400 font-sans">
                {language === 'sw'
                  ? 'Furahia punguzo la kiwandani kwa oda zote za jumla za katoni za vitabu na bahasha.'
                  : 'Enjoy special factory carton rates on all bulk counter books and exercise reams for schools and tenders.'}
              </p>
            </div>

            {/* Right: CTA Button */}
            <div className="shrink-0">
              <Link
                to="/wholesale"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white hover:bg-[#DC2626] hover:text-white text-[#111113] text-xs font-mono font-bold tracking-wider uppercase transition-colors shadow-md cursor-pointer"
              >
                <span>{language === 'sw' ? 'BEI ZA JUMLA' : 'SHOP WHOLESALE CARTONS'}</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. "LOVED BY OUR CLIENTS" (Veloura Reference Testimonials) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white border-b border-[#E7E5E0]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold tracking-wider uppercase text-[#111113]">
              {language === 'sw' ? 'WATEJA WETU WANASEMAJE' : 'LOVED BY OUR CLIENTS'}
            </h2>
            <div className="w-12 h-0.5 bg-[#8C7355] mx-auto opacity-60" />
          </div>

          {/* 3 Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">

            {/* Review 1 */}
            <div className="p-6 rounded-2xl bg-[#FAF9F7] border border-[#E7E5E0] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl text-[#8C7355] leading-none">“</span>
                  <div className="flex gap-0.5 text-[#DC2626]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#DC2626] text-[#DC2626]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#47464A] italic leading-relaxed font-sans">
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
            <div className="p-6 rounded-2xl bg-[#FAF9F7] border border-[#E7E5E0] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl text-[#8C7355] leading-none">“</span>
                  <div className="flex gap-0.5 text-[#DC2626]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#DC2626] text-[#DC2626]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#47464A] italic leading-relaxed font-sans">
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
            <div className="p-6 rounded-2xl bg-[#FAF9F7] border border-[#E7E5E0] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl text-[#8C7355] leading-none">“</span>
                  <div className="flex gap-0.5 text-[#DC2626]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#DC2626] text-[#DC2626]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#47464A] italic leading-relaxed font-sans">
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
      {/* 8. VIP CONCIERGE & PRICE ALERTS (Matching User Uploaded Image) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-18 bg-[#18181b] text-white relative overflow-hidden border-t border-[#27272a]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            
            {/* Red Badge */}
            <div className="inline-flex items-center justify-center px-4 py-1 rounded-full border border-[#DC2626]/40 bg-[#DC2626]/10 text-[#DC2626] text-[11px] font-mono font-bold uppercase tracking-widest">
              VIP CONCIERGE &amp; PRICE ALERTS
            </div>

            {/* Headline */}
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              {language === 'sw' ? 'Ungana na OMEGA Stationery' : 'Connect with OMEGA Stationery'}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto leading-relaxed font-sans">
              {language === 'sw'
                ? 'Pata taarifa za bei mpya za jumla, katalogi ya 2026 na ofa maalum za vifaa vya shule na ofisi.'
                : 'Receive official 2026 wholesale catalogs, bulk school tender announcements, and factory-direct price updates.'}
            </p>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(language === 'sw' ? 'Asante! Tumepokea mawasiliano yako.' : 'Thank you! We received your details.');
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto pt-3"
            >
              <div className="relative w-full">
                <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.75]" />
                <input
                  type="text"
                  required
                  placeholder={language === 'sw' ? 'Weka namba au barua pepe...' : 'Enter your email or phone number...'}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-xs sm:text-sm bg-white/[0.08] text-white placeholder:text-stone-400 border border-white/20 focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] transition-all font-sans"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs sm:text-sm font-bold uppercase tracking-wider font-mono transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>{language === 'sw' ? 'JIUNGE' : 'SUBSCRIBE'}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[1.75]" />
              </button>
            </form>

            {/* Bottom Guarantee Indicators */}
            <div className="flex items-center justify-center gap-4 pt-3 text-[11px] font-mono text-stone-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#DC2626] stroke-[1.75]" />
                <span>Zero Spam Guarantee</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#DC2626] stroke-[1.75]" />
                <span>Instant 2026 Price Catalog</span>
              </span>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

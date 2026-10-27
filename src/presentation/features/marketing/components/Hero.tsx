import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  Handshake,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Award,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { TRANSLATIONS } from '@/data/translations';

interface HeroProps {
  whatsappGreetingUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({ whatsappGreetingUrl }) => {
  const { language, storeConfig } = useStore();
  const t = (TRANSLATIONS[language] || TRANSLATIONS.en) as any;
  const sliderRef = useRef<HTMLDivElement>(null);

  const cleanWhatsappDigits = storeConfig?.whatsappNumber
    ? storeConfig.whatsappNumber.replace(/\D/g, '')
    : '255746268391';
  const whatsappUrl =
    whatsappGreetingUrl ||
    `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
      language === 'sw'
        ? 'Habari OMEGA Stationery, ninahitaji kuagiza madaftari (Counter Books, Exercise Books na Bahasha).'
        : 'Hello OMEGA Stationery, I would like to place an order and inquire about wholesale pricing.'
    )}`;

  // 4 Trust Badges for Left Hero Column
  const trustBadges = [
    {
      icon: ShieldCheck,
      line1: language === 'sw' ? 'Ubora wa' : 'Premium',
      line2: language === 'sw' ? 'Kiwango cha Juu' : 'Quality',
    },
    {
      icon: Truck,
      line1: language === 'sw' ? 'Oda za Jumla' : 'Bulk Orders',
      line2: language === 'sw' ? 'Zinapatikana' : 'Available',
    },
    {
      icon: Handshake,
      line1: language === 'sw' ? 'Msambazaji' : 'Trusted',
      line2: language === 'sw' ? 'Anayeaminika' : 'Supplier',
    },
    {
      icon: MapPin,
      line1: language === 'sw' ? 'Kuhudumia' : 'Serving',
      line2: language === 'sw' ? 'Tanzania Nzima' : 'Tanzania',
    },
  ];

  // Enhanced Product Slider items (Bottom of Hero)
  const productSliderItems = [
    {
      id: 'prod-omega-cb-q2',
      title: language === 'sw' ? 'Counter Book Q2 (192p)' : 'Counter Book Q2 (192 Pages)',
      category: 'Accounting & Schools',
      price: 'TZS 3,500',
      image: '/omega-products/omega-counter-book-podium.png',
      href: '/product/prod-omega-cb-q2',
      tag: 'Bestseller',
    },
    {
      id: 'prod-omega-ex-200-dl',
      title: language === 'sw' ? 'Exercise Book 200p (DL)' : 'Exercise Book 200 Pages (DL)',
      category: 'Primary & Secondary',
      price: 'TZS 1,800',
      image: '/omega-products/exercise-book-200p-dl-catalog.jpeg',
      href: '/product/prod-omega-ex-200-dl',
      tag: 'Double Line',
    },
    {
      id: 'prod-omega-bahasha-a4',
      title: language === 'sw' ? 'Bahasha ya Manila (A4)' : 'Bahasha Envelope Pack (A4)',
      category: 'Office & Postal',
      price: 'TZS 4,200',
      image: '/omega-products/bahasha-a4-catalog.png',
      href: '/product/prod-omega-bahasha-a4',
      tag: 'Peel & Seal',
    },
    {
      id: 'prod-omega-stiff-200',
      title: language === 'sw' ? 'Stiff Cover Exercise (200p)' : 'Stiff Cover Exercise (200 Pages)',
      category: 'Executive & Office',
      price: 'TZS 2,400',
      image: '/omega-products/stiff-cover-200-catalog.jpeg',
      href: '/product/prod-omega-stiff-200',
      tag: 'Hardback',
    },
    {
      id: 'prod-omega-cb-q3',
      title: language === 'sw' ? 'Counter Book Q3 (288p)' : 'Counter Book Q3 (288 Pages)',
      category: 'Audit & Ledgers',
      price: 'TZS 4,800',
      image: '/omega-products/counter-book-q3-catalog.jpeg',
      href: '/product/prod-omega-cb-q3',
      tag: 'Thread-Sewn',
    },
    {
      id: 'prod-omega-ex-100-sl',
      title: language === 'sw' ? 'Exercise Book 100p (Pink)' : 'Exercise Book 100p (Single Line)',
      category: 'Junior School',
      price: 'TZS 1,000',
      image: '/omega-products/exercise-book-100p-catalog.jpeg',
      href: '/product/prod-omega-ex-100-sl',
      tag: 'Single Line',
    },
    {
      id: 'prod-omega-shorthand',
      title: language === 'sw' ? 'Shorthand Notebook' : 'Shorthand Spiral Writing Pad',
      category: 'Conference & Notes',
      price: 'TZS 1,500',
      image: '/omega-products/shorthand-notebook-catalog.jpeg',
      href: '/catalog?category=Ruled+Paper',
      tag: 'Top Spiral',
    },
    {
      id: 'prod-omega-oxford-set',
      title: language === 'sw' ? 'Seti ya Hisabati (Oxford)' : 'Oxford Mathematical Set',
      category: 'STEM & Secondary',
      price: 'TZS 5,500',
      image: '/omega-products/oxford-mathematical-set.jpeg',
      href: '/catalog?category=School+Stationery',
      tag: 'Official Math',
    },
  ];

  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section aria-label="Omega Book Products Hero" className="relative w-full overflow-hidden bg-[#09090b]">
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO MAIN STAGE (STUDIO DESK ATMOSPHERE) */}
      {/* ========================================================================= */}
      <div className="relative w-full min-h-[500px] lg:min-h-[560px] flex items-center overflow-hidden">
        
        {/* Photorealistic Background Image of Wooden Desk Studio */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: "url('/hero-desk-bg.jpg')",
          }}
          aria-hidden="true"
        />

        {/* Ambient Dark Gradient Overlays for High Text Contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#09090b]/95 via-[#09090b]/75 to-[#09090b]/92 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]/50 pointer-events-none"
          aria-hidden="true"
        />

        {/* Dynamic Crimson Red Glow Centered behind the Central PNG Book */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] rounded-full bg-[#dc2626]/20 blur-[120px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Main 3-Column Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-6 xl:gap-8 items-center">
            
            {/* =================================================================== */}
            {/* LEFT COLUMN: BRAND HEADLINE, SUBTITLE, BUTTONS & 4 TRUST BADGES */}
            {/* =================================================================== */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-5 text-left order-1">
              
              {/* Tagline with Crimson Accent Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#dc2626]/20 via-[#dc2626]/10 to-transparent border border-[#dc2626]/40 text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase text-white font-mono backdrop-blur-md shadow-xs">
                  <span>
                    {language === 'sw'
                      ? 'VITABU BORA • MAISHA BORA'
                      : 'QUALITY BOOKS • BETTER FUTURE'}
                  </span>
                </span>
              </div>

              {/* Large Bold H1 & Subheading */}
              <div className="space-y-2">
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.65rem] font-black text-white leading-[1.1] tracking-tight">
                  {language === 'sw' ? (
                    <>
                      Madaftari ya <span className="text-[#dc2626] drop-shadow-[0_2px_15px_rgba(220,38,38,0.45)]">OMEGA</span>
                    </>
                  ) : (
                    <>
                      OMEGA BOOK <span className="text-[#dc2626] drop-shadow-[0_2px_15px_rgba(220,38,38,0.45)]">PRODUCTS</span>
                    </>
                  )}
                </h1>

                <h2 className="text-sm sm:text-base lg:text-lg font-bold text-white/95 leading-snug">
                  {language === 'sw'
                    ? 'Mshirika Wako Anayeaminika Katika Vitabu & Stationery'
                    : 'Your trusted partner in books & stationery.'}
                </h2>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal max-w-md pt-0.5">
                  {language === 'sw'
                    ? 'Tunasambaza madaftari bora ya shule, counter books zenye jalada gumu, na vifaa vya stationery — vinavyoaminika kote Tanzania kwa shule, vyuo, ofisi na biashara.'
                    : 'High-quality notebooks, counter books, and stationery — trusted across Tanzania by schools, offices, and businesses.'}
                </p>
              </div>

              {/* Action Buttons: SHOP NOW & B2B WHOLESALE */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                <Link
                  to="/catalog"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] hover:from-[#991b1b] hover:to-[#dc2626] text-white font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2 shadow-[0_4px_18px_rgba(220,38,38,0.35)] hover:shadow-[0_6px_22px_rgba(220,38,38,0.45)] transition-all active:scale-95"
                >
                  <span>{language === 'sw' ? 'NUNUA SASA' : 'SHOP NOW'}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>

                <Link
                  to="/wholesale"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2 transition-all active:scale-95 backdrop-blur-xs"
                >
                  <span>{language === 'sw' ? 'BEI ZA JUMLA' : 'B2B WHOLESALE'}</span>
                </Link>
              </div>

              {/* Row of 4 Trust Badges (Horizontal Row with Thin Vertical Dividers) */}
              <div className="pt-3 border-t border-white/15 grid grid-cols-4 divide-x divide-white/15 text-center">
                {trustBadges.map((badge, idx) => {
                  const Icon = badge.icon;
                  return (
                    <div key={idx} className="px-1 sm:px-2 flex flex-col items-center">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#dc2626] mb-1">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-white leading-tight block truncate w-full">
                        {badge.line1}
                      </span>
                      <span className="text-[9px] sm:text-[11px] text-zinc-400 font-medium leading-tight block truncate w-full">
                        {badge.line2}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* =================================================================== */}
            {/* CENTER COLUMN: CINEMATIC PODIUM EXHIBITION STAGE */}
            {/* =================================================================== */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center order-2 my-4 lg:my-0 select-none">
              <div className="relative w-full max-w-[320px] sm:max-w-[390px] lg:max-w-[430px] flex items-center justify-center">
                
                {/* Subtle Ambient Radial Backlight behind the stage */}
                <div
                  className="absolute inset-0 m-auto w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-tr from-[#dc2626]/25 via-[#ef4444]/20 to-red-600/10 blur-3xl pointer-events-none"
                  aria-hidden="true"
                />

                {/* Floating Badge 1: 198 Pages · Bleed-Proof Paper (Top-Left) */}
                <div className="absolute top-2 -left-2 sm:-left-4 z-20 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#111113]/90 border border-white/15 backdrop-blur-md shadow-xl flex items-center gap-2 text-[10px] sm:text-xs font-bold text-white tracking-wide">
                  <div className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
                  <span>198 Pages · Bleed-Proof</span>
                </div>

                {/* Floating Badge 2: Wholesale Save up to 40% (Bottom-Right) */}
                <div className="absolute bottom-4 -right-2 sm:-right-4 z-20 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] text-white shadow-xl flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-wide">
                  <Award className="w-3.5 h-3.5" />
                  <span>Wholesale: Save 40%</span>
                </div>

                {/* Central Visual: Genuine OMEGA Flagship Hardcover Book on Spotlight Smoke Podium */}
                <Link
                  to="/product/prod-omega-cb-q2"
                  className="relative z-10 w-full rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_25px_60px_rgba(0,0,0,0.95)] group transition-all duration-500 hover:border-[#dc2626]/70 hover:shadow-[0_30px_70px_rgba(220,38,38,0.25)] block cursor-pointer"
                  title="Explore OMEGA Counter Book Flagship Edition"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden flex items-center justify-center">
                    <img
                      src="/omega-products/omega-counter-book-podium.png"
                      alt="OMEGA Flagship Smyth-Sewn Counter Book on Spotlight Podium"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="eager"
                    />

                    {/* Gradient Overlay for subtle edge softening */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                    {/* Exhibition Podium Plaque at bottom */}
                    <div className="absolute bottom-2.5 inset-x-2.5 sm:bottom-3 sm:inset-x-3 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-between text-left group-hover:border-[#dc2626]/40 transition-colors">
                      <div className="min-w-0 pr-2">
                        <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#ef4444] font-bold block">
                          FLAGSHIP PODIUM EXHIBIT
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-white block truncate">
                          Counter Book (198p · Size A4)
                        </span>
                      </div>
                      <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase font-mono shadow-md inline-flex items-center gap-1 shrink-0 group-hover:translate-x-0.5 transition-transform">
                        <span>EXPLORE</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>

              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. BOTTOM PRODUCT SLIDER: INTERACTIVE BESTSELLER RIBBON */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#111113] border-t border-[#27272a] py-4 sm:py-5 shadow-lg relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Row for Slider */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-zinc-200 font-mono">
                {language === 'sw' ? "Madaftari Bora ya Wiki (Bestsellers)" : "THIS WEEK'S BESTSELLERS"}
              </h3>
            </div>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollSlider('left')}
                aria-label="Scroll left"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95 border border-white/15"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollSlider('right')}
                aria-label="Scroll right"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95 border border-white/15"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <Link
                to="/catalog"
                className="ml-2 text-xs font-bold text-[#dc2626] hover:text-white flex items-center gap-1 transition-colors hidden sm:inline-flex"
              >
                <span>{language === 'sw' ? 'Orodha Kamili' : 'Full Catalog'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Horizontal Product Cards Slider */}
          <div
            ref={sliderRef}
            className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-1 pt-1 touch-pan-x scroll-smooth"
          >
            {productSliderItems.map((prod) => (
              <Link
                key={prod.id}
                to={prod.href}
                className="group flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#dc2626] shrink-0 min-w-[240px] sm:min-w-[270px] max-w-[290px] transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Thumbnail Stage */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${prod.image.includes('podium') ? 'bg-black border-[#dc2626]/40 p-0' : 'bg-white p-1 border-white/20'} flex items-center justify-center shrink-0 overflow-hidden border group-hover:border-[#dc2626] transition-all relative shadow-sm`}>
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className={`w-full h-full ${prod.image.includes('podium') ? 'object-cover' : 'object-contain mix-blend-multiply'} group-hover:scale-110 transition-transform duration-300`}
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1 space-y-0.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#ef4444] font-mono">
                      {prod.tag}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-[#dc2626] transition-colors" />
                  </div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-white truncate group-hover:text-[#ef4444] transition-colors">
                    {prod.title}
                  </h4>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {prod.category}
                  </p>
                  <div className="text-xs font-black text-[#ef4444] font-mono pt-0.5">
                    {prod.price}
                  </div>
                </div>
              </Link>
            ))}

            {/* Final Card: B2B Wholesale Enquiries */}
            <Link
              to="/wholesale"
              className="group flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-[#18181b] to-[#09090b] border border-[#dc2626]/40 hover:border-[#dc2626] shrink-0 min-w-[220px] sm:min-w-[250px] transition-all hover:shadow-md"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-[#fafafa] p-1 flex items-center justify-center shrink-0 border border-zinc-700">
                <svg viewBox="0 0 32 32" className="w-9 h-9 rounded-full overflow-hidden shadow-xs">
                  <polygon points="0,0 32,0 0,32" fill="#1eb53a" />
                  <polygon points="32,0 32,32 0,32" fill="#00a3dd" />
                  <polygon points="0,32 32,0 32,6 6,32" fill="#fcd116" />
                  <polygon points="0,26 26,0 32,0 0,32" fill="#fcd116" />
                  <polygon points="0,29 29,0 32,0 32,3 3,32 0,32" fill="#000000" />
                </svg>
              </div>
              <div className="min-w-0 text-left space-y-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#ef4444] font-mono">
                  Tanzania Freight
                </span>
                <h4 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-[#ef4444] transition-colors">
                  {language === 'sw' ? 'Oda za Jumla (Mikoani)' : 'Wholesale Carton Tender'}
                </h4>
                <p className="text-[10px] text-zinc-400">
                  {language === 'sw' ? 'Mabasi ya mikoa yote' : 'Direct bus waybills'}
                </p>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;

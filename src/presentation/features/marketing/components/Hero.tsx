import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Feather } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/context/StoreContext';
import { HaikeiBlobGlow, HaikeiPaperLines } from '@/components/HaikeiBackgrounds';

interface HeroSlide {
  id: string;
  quire: string;
  pages: number;
  badgeEn: string;
  badgeSw: string;
  headlinePrefix: string;
  headlineGradient: string;
  subEn: string;
  subSw: string;
  ctaEn: string;
  ctaSw: string;
  href: string;
  productImage: string;
  productWebp: string;
  label: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-q2',
    quire: 'Q2',
    pages: 192,
    badgeEn: '2 QUIRE · 192 PAGES · COMMERCIAL LEDGER',
    badgeSw: 'QUIRE 2 · KURASA 192 · DAFTARI LA OFISI',
    headlinePrefix: 'Feel the Power.',
    headlineGradient: 'Own the Race.',
    subEn: '2 Quire (192 Pages) Smyth-sewn hardcover counter book — trusted by students, shops, and institutions across Tanzania.',
    subSw: 'Counter Book ya Quire 2 (Kurasa 192) yenye mshono imara wa nyuzi unaofunguka 180° bila kuchanika.',
    ctaEn: 'Shop Q2 Counter Book',
    ctaSw: 'Nunua Quire 2',
    href: '/catalog?category=Counter+Books',
    productImage: '/omega-hero-q2.png',
    productWebp: '/omega-hero-q2.webp',
    label: '2Quire · 192 Pages',
  },
  {
    id: 'slide-q3',
    quire: 'Q3',
    pages: 288,
    badgeEn: '3 QUIRE · 288 PAGES · ★ BEST SELLER',
    badgeSw: 'QUIRE 3 · KURASA 288 · ★ INAYOPENDWA ZAIDI',
    headlinePrefix: 'Premium Books for a',
    headlineGradient: 'Brighter Future.',
    subEn: '3 Quire (288 Pages) institutional benchmark counter book with reinforced crimson spine and 70 GSM archival white paper.',
    subSw: 'Counter Book ya Quire 3 (Kurasa 288) inayotumika shuleni, vyuoni na maofisini kote Tanzania.',
    ctaEn: 'Shop Q3 Counter Book',
    ctaSw: 'Nunua Quire 3',
    href: '/catalog?category=Counter+Books',
    productImage: '/omega-hero-q3.png',
    productWebp: '/omega-hero-q3.webp',
    label: '3Quire · 288 Pages',
  },
  {
    id: 'slide-q4',
    quire: 'Q4',
    pages: 384,
    badgeEn: '4 QUIRE · 384 PAGES · HEAVYWEIGHT FOLIO',
    badgeSw: 'QUIRE 4 · KURASA 384 · JALADA GUMU ZAIDI',
    headlinePrefix: 'Engineered for',
    headlineGradient: 'Every Page.',
    subEn: '4 Quire (384 Pages) heavy-duty hardcover counter book with reinforced crimson stitched spine and 180° lay-flat binding.',
    subSw: 'Counter Book ya Quire 4 (Kurasa 384) yenye mshono imara wa kudumu miaka mingi.',
    ctaEn: 'Shop Q4 Counter Book',
    ctaSw: 'Nunua Quire 4',
    href: '/catalog?category=Counter+Books',
    productImage: '/omega-hero-q4.png',
    productWebp: '/omega-hero-q4.webp',
    label: '4Quire · 384 Pages',
  },
];

const StudioBookHalo: React.FC = () => {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Soft Warm Radial Studio Glow */}
      <div
        className="absolute w-[76%] h-[76%] rounded-full blur-2xl opacity-75"
        style={{
          background:
            'radial-gradient(circle, rgba(214,58,58,0.12) 0%, rgba(233,180,76,0.14) 48%, rgba(214,58,58,0) 72%)',
        }}
      />

      {/* Ground Pedestal Shadow */}
      <div className="absolute bottom-[9%] w-[54%] h-6 rounded-full bg-black/15 blur-xl" />
    </div>
  );
};

export const Hero: React.FC = () => {
  const { language } = useStore();
  const [currentIdx, setCurrentIdx] = useState(1); // Default to Q3 (Best Seller)
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentIdx];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section
      aria-label="Hero Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden bg-[var(--bg)] min-h-[440px] sm:min-h-[540px] lg:min-h-[600px] flex items-center transition-colors duration-200"
    >
      {/* Clean Light Luxury Paper Canvas */}
      <div
        className="absolute inset-0 pointer-events-none bg-[var(--bg)]"
        aria-hidden="true"
      />

      {/* Haikei Organic Blob Glow Accents */}
      <HaikeiBlobGlow color="mixed" position="bottom-right" size="lg" className="opacity-15" />
      <HaikeiBlobGlow color="red" position="top-left" size="md" className="opacity-10" />

      {/* Haikei Paper Contour Lines */}
      <HaikeiPaperLines opacity={0.03} />

      {/* Main 2-Column Content Layout */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Clean Typography & Anchored Controls (7 cols) */}
          <div className="lg:col-span-7 max-w-2xl text-left space-y-4 sm:space-y-5">
            {/* Animated Headline & Subtitle Only (No layout jump on controls) */}
            <div className="min-h-[132px] sm:min-h-[168px] flex flex-col justify-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* Headline: Serif + Gradient Sans */}
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-[var(--text)] leading-[1.12]">
                    <span>{slide.headlinePrefix}</span>
                    <br />
                    <span className="font-sans font-extrabold text-gradient-headline">
                      {slide.headlineGradient}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-base text-[var(--text-muted)] max-w-lg leading-relaxed font-sans">
                    {language === 'sw' ? slide.subSw : slide.subEn}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Interactive Quire Size Switcher Pills (Q2 to Q4) - Anchored without jumping */}
            <div className="pt-1 space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                {language === 'sw' ? 'CHAGUA UKUBWA WA KITABU (Q2 – Q4):' : 'SELECT QUIRE & PAGE THICKNESS (Q2 – Q4):'}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {HERO_SLIDES.map((s, idx) => {
                  const active = idx === currentIdx;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentIdx(idx)}
                      className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                        active
                          ? 'bg-[#D63A3A] text-white border-[#D63A3A] shadow-md shadow-red-600/20'
                          : 'bg-[var(--surface-1)] text-[var(--text)] border-[var(--border)] hover:border-[#D63A3A]/40'
                      }`}
                    >
                      <span>{s.quire}</span>
                      <span className={`text-[10px] ${active ? 'text-white/90' : 'text-[var(--text-muted)]'}`}>
                        ({s.pages}P)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Specs Micro-Pills */}
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono text-[var(--text)]">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--surface-1)] border border-[var(--border)] shadow-2xs">
                <Feather size={12} className="text-[var(--red)]" />
                <span>70 GSM Bleed-Proof</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--surface-1)] border border-[var(--border)] shadow-2xs">
                <ShieldCheck size={12} className="text-[var(--gold)]" />
                <span>Smyth-Sewn 180° Lay-Flat</span>
              </span>
            </div>

            {/* Primary Action Button: Filled Red Pill */}
            <div className="pt-1">
              <Link
                to={slide.href}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 min-h-[48px] rounded-full bg-[#D63A3A] hover:bg-[#b91c1c] active:scale-95 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-[0_10px_24px_rgba(214,58,58,0.28)] hover:shadow-[0_14px_32px_rgba(214,58,58,0.38)] group cursor-pointer border border-red-400/30"
                style={{ backgroundColor: '#D63A3A', color: '#FFFFFF' }}
              >
                <span>{language === 'sw' ? slide.ctaSw : slide.ctaEn}</span>
                <ArrowRight
                  size={18}
                  strokeWidth={2}
                  className="group-hover:translate-x-1.5 transition-transform"
                />
              </Link>
            </div>
          </div>

          {/* Right Column: Clean Studio Halo + Smooth Instant 3D Books (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[440px] aspect-square flex items-center justify-center">
              
              {/* Clean Studio Halo Pedestal Behind Book */}
              <StudioBookHalo />

              {/* Pre-Mounted Q2-Q4 Books with Smooth Crossfade & Scale */}
              {HERO_SLIDES.map((s, idx) => {
                const isActive = idx === currentIdx;
                return (
                  <motion.div
                    key={s.id}
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scale: isActive ? 1 : 0.94,
                      y: isActive ? 0 : 8,
                    }}
                    transition={{
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={handleNext}
                    style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                    className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer select-none"
                  >
                    <picture className="w-full h-full flex items-center justify-center">
                      <source srcSet={s.productWebp} type="image/webp" />
                      <img
                        src={s.productImage}
                        alt={s.label}
                        width={720}
                        height={720}
                        loading="eager"
                        decoding="sync"
                        fetchPriority={idx <= 1 ? 'high' : 'auto'}
                        className="max-h-[82%] max-w-[82%] object-contain drop-shadow-[0_24px_32px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:scale-103"
                      />
                    </picture>
                  </motion.div>
                );
              })}

              {/* Floating Live Quire & Page Thickness Pill Badge Below Book */}
              <div className="absolute -bottom-1 z-20 px-4 py-1.5 rounded-full bg-[#111111]/90 text-white font-mono text-xs font-bold tracking-wider shadow-lg border border-white/15 flex items-center gap-2 backdrop-blur-md">
                <span className="text-[#EF4444] font-black">{slide.quire}</span>
                <span className="text-white/40">•</span>
                <span>{slide.pages} Pages</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={handlePrev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[var(--surface-1)] hover:bg-[#D63A3A] text-[var(--text)] hover:text-white border border-[var(--border)] hover:border-[var(--gold)]/40 backdrop-blur-md items-center justify-center transition-all cursor-pointer shadow-md"
      >
        <ChevronLeft className="w-5 h-5 stroke-[2]" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={handleNext}
        aria-label="Next slide"
        className="hidden md:flex absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[var(--surface-1)] hover:bg-[#D63A3A] text-[var(--text)] hover:text-white border border-[var(--border)] hover:border-[var(--gold)]/40 backdrop-blur-md items-center justify-center transition-all cursor-pointer shadow-md"
      >
        <ChevronRight className="w-5 h-5 stroke-[2]" />
      </motion.button>

      {/* Pagination Indicators with Active Slide Animated Progress Fill */}
      <div
        role="tablist"
        aria-label="Hero slider pagination"
        className="absolute bottom-5 right-6 sm:bottom-8 sm:right-10 z-20 flex items-center gap-2"
      >
        {HERO_SLIDES.map((s, idx) => {
          const isActive = idx === currentIdx;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to ${s.quire} (${s.pages} Pages)`}
              onClick={() => setCurrentIdx(idx)}
              className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                isActive ? 'w-10 bg-[#D63A3A]/25 shadow-xs' : 'w-2 bg-[var(--text-muted)]/30 hover:bg-[var(--text-muted)]/60'
              }`}
            >
              {isActive && (
                <motion.span
                  key={`progress-${slide.id}-${isPaused}`}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: isPaused ? 0.2 : 4.2, ease: 'linear' }}
                  className="absolute inset-y-0 left-0 bg-[#D63A3A] rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Hero;

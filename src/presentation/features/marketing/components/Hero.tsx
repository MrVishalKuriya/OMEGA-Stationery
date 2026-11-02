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
    id: 'slide-q1',
    quire: 'Q1',
    pages: 96,
    badgeEn: '1 QUIRE · 96 PAGES · COMPACT FOLIO',
    badgeSw: 'QUIRE 1 · KURASA 96 · DAFTARI IMARA',
    headlinePrefix: 'Feel the Power.',
    headlineGradient: 'Own the Race.',
    subEn: '1 Quire (96 Pages) slim hardcover counter book. Pure 70 GSM bleed-proof bond engineered for daily classroom and store records.',
    subSw: 'Counter Book ya Quire 1 (Kurasa 96) yenye jalada gumu na karatasi ya 70 GSM isiyopenyeza wino.',
    ctaEn: 'Shop Counter Books',
    ctaSw: 'Nunua Vitabu Sasa',
    href: '/catalog?category=Counter+Books',
    productImage: '/omega-hero-q1.png',
    productWebp: '/omega-hero-q1.webp',
    label: '1Quire · 96 Pages',
  },
  {
    id: 'slide-q2',
    quire: 'Q2',
    pages: 192,
    badgeEn: '2 QUIRE · 192 PAGES · COMMERCIAL LEDGER',
    badgeSw: 'QUIRE 2 · KURASA 192 · DAFTARI LA OFISI',
    headlinePrefix: 'Premium Books for a',
    headlineGradient: 'Brighter Future.',
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
    badgeSw: 'QUIRE 3 · KURASA 288 · ★ INAYopendwa ZAIDI',
    headlinePrefix: 'Archival Ledgers.',
    headlineGradient: 'Built to Last.',
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
  {
    id: 'slide-q5',
    quire: 'Q5',
    pages: 480,
    badgeEn: '5 QUIRE · 480 PAGES · AUDIT & TENDER EDITION',
    badgeSw: 'QUIRE 5 · KURASA 480 · KUMBUKUMBU KUU',
    headlinePrefix: 'Master Volume.',
    headlineGradient: 'Zero Ink Bleed.',
    subEn: '5 Quire (480 Pages) extended archival ledger built for corporate accounting, hospital registries, and government tenders.',
    subSw: 'Counter Book ya Quire 5 (Kurasa 480) maalum kwa kumbukumbu za muda mrefu za hesabu na ofisi.',
    ctaEn: 'Shop Counter Ledgers',
    ctaSw: 'Tazama Katalogi',
    href: '/catalog?category=Counter+Books',
    productImage: '/omega-hero-q5.png',
    productWebp: '/omega-hero-q5.webp',
    label: '5Quire · 480 Pages',
  },
  {
    id: 'slide-q6',
    quire: 'Q6',
    pages: 576,
    badgeEn: '6 QUIRE · 576 PAGES · MAXIMUM CAPACITY',
    badgeSw: 'QUIRE 6 · KURASA 576 · UJAZO MKUBWA ZAIDI',
    headlinePrefix: 'Maximum Pages.',
    headlineGradient: 'Built to Endure.',
    subEn: '6 Quire (576 Pages) ultra-thick Smyth-sewn master folio with extra-wide crimson spine for full-year institutional records.',
    subSw: 'Counter Book kubwa zaidi ya Quire 6 (Kurasa 576) yenye mgongo mpana na imara.',
    ctaEn: 'Explore Full Range',
    ctaSw: 'Nunua Vitabu Vyote',
    href: '/catalog?category=Counter+Books',
    productImage: '/omega-hero-q6.png',
    productWebp: '/omega-hero-q6.webp',
    label: '6Quire · 576 Pages',
  },
];

/**
 * Generates closed harmonic guilloché / spirograph wave paths
 * matching the 3D twisted circular wave ribbon reference.
 */
function buildCircularWavePaths(
  count: number,
  baseRadius: number,
  amp1: number,
  amp2: number,
  phaseStep: number,
  radiusStep: number
): { d: string; opacity: number }[] {
  const cx = 250;
  const cy = 250;
  const steps = 140;
  const paths: { d: string; opacity: number }[] = [];

  for (let i = 0; i < count; i++) {
    const tNorm = i / Math.max(1, count - 1);
    const phase = i * phaseStep;
    const rOffset = (i - count / 2) * radiusStep;
    const points: string[] = [];

    for (let s = 0; s <= steps; s++) {
      const theta = (s / steps) * Math.PI * 2;
      const wave1 = amp1 * Math.sin(3 * theta + phase);
      const wave2 = amp2 * Math.cos(2 * theta - phase * 0.8);
      const r = baseRadius + rOffset + wave1 + wave2;

      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      points.push(`${s === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    points.push('Z');

    // Bell-curve opacity so outer and inner edges feather smoothly
    const edgeFactor = Math.sin(tNorm * Math.PI);
    const opacity = 0.25 + 0.7 * edgeFactor;

    paths.push({ d: points.join(' '), opacity });
  }

  return paths;
}

const CircularMotionWaves: React.FC = () => {
  const primaryPaths = useMemo(
    () => buildCircularWavePaths(24, 168, 22, 12, 0.085, 1.85),
    []
  );
  const secondaryPaths = useMemo(
    () => buildCircularWavePaths(14, 152, 18, 10, -0.11, 1.6),
    []
  );

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Ambient Warm Radial Aura Behind the Wave Ring */}
      <div
        className="w-[82%] h-[82%] rounded-full blur-2xl opacity-75"
        style={{
          background:
            'radial-gradient(circle, rgba(214,58,58,0.18) 0%, rgba(233,180,76,0.16) 45%, rgba(214,58,58,0) 72%)',
        }}
      />

      {/* Primary Rotating 3D Guilloché Wave Ribbon (24 concentric phase-shifted wave loops) */}
      <motion.svg
        viewBox="0 0 500 500"
        className="absolute inset-0 w-full h-full overflow-visible"
        animate={{
          rotate: [0, 360],
          scale: [0.98, 1.03, 0.98],
        }}
        transition={{
          rotate: { duration: 28, repeat: Infinity, ease: 'linear' },
          scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <defs>
          <linearGradient id="omegaWaveGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5484D" />
            <stop offset="38%" stopColor="#F97316" />
            <stop offset="72%" stopColor="#E9B44C" />
            <stop offset="100%" stopColor="#B8862B" />
          </linearGradient>
          <linearGradient id="omegaWaveGradSecondary" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E9B44C" />
            <stop offset="50%" stopColor="#D63A3A" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>

        {primaryPaths.map((p, idx) => (
          <path
            key={`p-${idx}`}
            d={p.d}
            fill="none"
            stroke="url(#omegaWaveGradPrimary)"
            strokeWidth="1.35"
            strokeOpacity={p.opacity}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </motion.svg>

      {/* Secondary Counter-Rotating Harmonic Wave Ribbon */}
      <motion.svg
        viewBox="0 0 500 500"
        className="absolute inset-0 w-full h-full overflow-visible"
        animate={{
          rotate: [360, 0],
          scale: [1.02, 0.96, 1.02],
        }}
        transition={{
          rotate: { duration: 36, repeat: Infinity, ease: 'linear' },
          scale: { duration: 7.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {secondaryPaths.map((p, idx) => (
          <path
            key={`s-${idx}`}
            d={p.d}
            fill="none"
            stroke="url(#omegaWaveGradSecondary)"
            strokeWidth="1.05"
            strokeOpacity={p.opacity * 0.55}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </motion.svg>
    </div>
  );
};

export const Hero: React.FC = () => {
  const { language } = useStore();
  // Start on Q1 (96 Pages) and cycle through Q1 -> Q2 -> Q3 -> Q4 -> Q5 -> Q6
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4200);
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
      className="relative w-full overflow-hidden bg-[var(--bg)] min-h-[440px] sm:min-h-[540px] lg:min-h-[620px] flex items-center border-b border-[var(--border)] transition-colors duration-200"
    >
      {/* Clean Light Luxury Paper Canvas */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5] to-[#F5EFE6]"
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
          
          {/* Left Column: Clean Typography & Action (7 cols) */}
          <div className="lg:col-span-7 max-w-2xl text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4 sm:space-y-5"
              >
                {/* Quire & Page Count Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D63A3A]/10 border border-[#D63A3A]/25 text-[#D63A3A] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-[#D63A3A] animate-pulse" />
                  <span>{language === 'sw' ? slide.badgeSw : slide.badgeEn}</span>
                </div>

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

                {/* Interactive Quire Size Switcher Pills (Q1 to Q6) */}
                <div className="pt-1 space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                    {language === 'sw' ? 'CHAGUA UKUBWA WA KITABU (Q1 – Q6):' : 'SELECT QUIRE & PAGE THICKNESS (Q1 – Q6):'}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {HERO_SLIDES.map((s, idx) => {
                      const active = idx === currentIdx;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setCurrentIdx(idx)}
                          className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                            active
                              ? 'bg-[#D63A3A] text-white border-[#D63A3A] shadow-md shadow-red-600/25 scale-105'
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
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} className="inline-block">
                    <Link
                      to={slide.href}
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 min-h-[48px] rounded-full bg-[#D63A3A] hover:bg-[#b91c1c] active:scale-95 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-[0_10px_24px_rgba(214,58,58,0.32)] hover:shadow-[0_14px_32px_rgba(214,58,58,0.42)] group cursor-pointer border border-red-400/30"
                      style={{ backgroundColor: '#D63A3A', color: '#FFFFFF' }}
                    >
                      <span>{language === 'sw' ? slide.ctaSw : slide.ctaEn}</span>
                      <ArrowRight
                        size={18}
                        strokeWidth={2}
                        className="group-hover:translate-x-1.5 transition-transform"
                      />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Circular Motion Graphics Wave Ring + Pre-Mounted 0ms Instant 3D Books (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[460px] aspect-square flex items-center justify-center">
              
              {/* Animated 3D Circular Spirograph Wave Rings Behind Book */}
              <CircularMotionWaves />

              {/* All 6 Q1-Q6 3D Books Mounted Simultaneously for 0ms Instant Switching */}
              {HERO_SLIDES.map((s, idx) => {
                const isActive = idx === currentIdx;
                return (
                  <motion.div
                    key={s.id}
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scale: isActive ? 1 : 0.88,
                      y: isActive ? [0, -7, 0] : 14,
                      rotate: isActive ? 0 : -3,
                    }}
                    transition={{
                      opacity: { duration: 0.22, ease: 'easeOut' },
                      scale: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                      rotate: { duration: 0.28 },
                      y: isActive
                        ? { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
                        : { duration: 0.2 },
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
                        className="max-h-[82%] max-w-[82%] object-contain drop-shadow-[0_26px_36px_rgba(0,0,0,0.34)] transition-transform duration-300 hover:scale-105"
                      />
                    </picture>
                  </motion.div>
                );
              })}

              {/* Floating Live Quire & Page Thickness Pill Badge Below Book */}
              <div className="absolute -bottom-2 z-20 px-4 py-1.5 rounded-full bg-[#111111]/90 text-white font-mono text-xs font-bold tracking-wider shadow-lg border border-white/15 flex items-center gap-2 backdrop-blur-md">
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

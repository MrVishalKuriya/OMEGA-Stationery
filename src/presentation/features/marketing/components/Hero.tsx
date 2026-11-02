import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Feather } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/context/StoreContext';
import { HaikeiBlobGlow, HaikeiPaperLines } from '@/components/HaikeiBackgrounds';

interface HeroSlide {
  id: string;
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
  label: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    badgeEn: 'EST. 1998 · ARCHIVAL SMYTH-SEWN',
    badgeSw: 'TANGU 1998 · MSHONO THABITI WA NYUZI',
    headlinePrefix: 'Feel the Power.',
    headlineGradient: 'Own the Race.',
    subEn: 'Explore Tanzania’s benchmark writing companion. Pure 70 GSM bleed-proof bond engineered to endure.',
    subSw: 'Chunguza daftari bora na thabiti zaidi la masomo na kazi kote Tanzania.',
    ctaEn: 'Shop Counter Books',
    ctaSw: 'Nunua Vitabu Sasa',
    href: '/catalog?category=Counter+Books',
    productImage: '/omega-hero-book.png',
    label: 'Burgundy Edition',
  },
  {
    id: 'slide-2',
    badgeEn: 'EXECUTIVE FOIL EDITION',
    badgeSw: 'TOLEO MAALUM LA KIOFISI',
    headlinePrefix: 'Premium Books for a',
    headlineGradient: 'Brighter Future.',
    subEn: 'High-quality notebooks, exercise books, counter books and stationery products — trusted across Tanzania.',
    subSw: 'Madaftari yenye ubora wa juu yanayoaminika shuleni na maofisini kote Tanzania.',
    ctaEn: 'Explore All Products',
    ctaSw: 'Tazama Bidhaa Zetu',
    href: '/catalog',
    productImage: '/omega-hero-book-brown.png',
    label: 'Saddle Brown',
  },
  {
    id: 'slide-3',
    badgeEn: '31 REGIONS DISPATCH',
    badgeSw: 'USAFIRISHAJI MIKOA YOTE 31',
    headlinePrefix: 'Archival Ledgers.',
    headlineGradient: 'Built to Last.',
    subEn: 'Double Smyth-threaded spines engineered for commercial accounts, schools, and government tenders.',
    subSw: 'Karatasi ya 70 GSM isiyopenyeza wino kabisa kwa kalamu zote.',
    ctaEn: 'Explore Catalogue',
    ctaSw: 'Tazama Mkusanyiko',
    href: '/catalog',
    productImage: '/omega-hero-book-navy.png',
    label: 'Royal Navy Q3',
  },
  {
    id: 'slide-4',
    badgeEn: 'FACTORY DIRECT WHOLESALE',
    badgeSw: 'BEI ZA KIWANDANI ZA JUMLA',
    headlinePrefix: 'Engineered for',
    headlineGradient: 'Every Page.',
    subEn: '384-page Quire 4 hardcover counter books with reinforced crimson stitched spines and 180° lay-flat binding.',
    subSw: 'Vitabu vya Quire 4 vyenye kurasa 384 na mshono imara wa kudumu miaka mingi.',
    ctaEn: 'Shop Quire 4 Ledgers',
    ctaSw: 'Nunua Quire 4',
    href: '/catalog?category=Counter+Books',
    productImage: '/omega-hero-book-black.png',
    label: 'Obsidian Q4',
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
  const [currentIdx, setCurrentIdx] = useState(0);
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
      className="relative w-full overflow-hidden bg-[var(--bg)] min-h-[420px] sm:min-h-[520px] lg:min-h-[600px] flex items-center border-b border-[var(--border)] transition-colors duration-200"
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
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4 sm:space-y-5"
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

          {/* Right Column: Circular Motion Graphics Wave Ring + Transparent Cutout Book (5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[460px] aspect-square flex items-center justify-center">
              
              {/* Animated 3D Circular Spirograph Wave Rings Behind Book */}
              <CircularMotionWaves />

              {/* Floating Transparent Cutout Book in Front */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={slide.id}
                  initial={{ opacity: 0, scale: 0.88, y: 18, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -8, 0], rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -14, rotate: 2 }}
                  transition={{
                    opacity: { duration: 0.35 },
                    scale: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                    y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  whileHover={{ scale: 1.06, rotate: 1.5 }}
                  src={slide.productImage}
                  alt={slide.label}
                  onClick={handleNext}
                  className="relative z-10 max-h-[78%] max-w-[78%] object-contain drop-shadow-[0_26px_36px_rgba(0,0,0,0.34)] cursor-pointer select-none"
                  loading="eager"
                />
              </AnimatePresence>

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

      {/* Pagination Indicators */}
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
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive ? 'w-8 bg-[#D63A3A] shadow-xs' : 'w-2 bg-[var(--text-muted)]/30 hover:bg-[var(--text-muted)]/60'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Hero;

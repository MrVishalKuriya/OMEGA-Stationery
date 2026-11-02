import React, { useState, useEffect } from 'react';
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
  },
  {
    id: 'slide-2',
    badgeEn: '31 REGIONS DISPATCH',
    badgeSw: 'USAFIRISHAJI MIKOA YOTE 31',
    headlinePrefix: 'Premium Books for a',
    headlineGradient: 'Brighter Future.',
    subEn: 'High-performance notebooks and exercise books trusted by schools and firms across Tanzania.',
    subSw: 'Madaftari yenye ubora wa juu yanayoaminika shuleni na maofisini.',
    ctaEn: 'Explore All Products',
    ctaSw: 'Tazama Bidhaa Zetu',
    href: '/catalog',
    productImage: '/omega-counter-book-podium.png',
  },
  {
    id: 'slide-3',
    badgeEn: 'FACTORY DIRECT WHOLESALE',
    badgeSw: 'BEI ZA KIWANDANI ZA JUMLA',
    headlinePrefix: 'Archival Ledgers.',
    headlineGradient: 'Built to Last.',
    subEn: 'Double Smyth-threaded spines engineered for commercial accounts, schools, and government tenders.',
    subSw: 'Karatasi ya 70 GSM isiyopenyeza wino kabisa kwa kalamu zote.',
    ctaEn: 'Explore Catalogue',
    ctaSw: 'Tazama Mkusanyiko',
    href: '/catalog',
    productImage: '/omega-hero-book.png',
  },
];

export const Hero: React.FC = () => {
  const { language } = useStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
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
      className="relative w-full overflow-hidden bg-[var(--bg)] min-h-[380px] sm:min-h-[520px] lg:min-h-[600px] flex items-center border-b border-[var(--border)] transition-colors duration-200"
    >
      {/* Clean Texture Background (No Baked-In Text) */}
      <div
        className="absolute inset-0 bg-cover bg-center sm:bg-right bg-no-repeat pointer-events-none opacity-20 transition-opacity duration-700"
        style={{ backgroundImage: "url('/hero-luxury-bg.jpg')" }}
        aria-hidden="true"
      />

      {/* Light Luxury Paper Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/96 sm:via-[#FAF8F5]/88 to-[#FAF8F5]/50"
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
                {/* Headline: White Serif + Gradient Sans */}
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

                {/* Watermelon UI Quick Specs Micro-Pills */}
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

                {/* Primary Action Button: Filled Red Pill with Motion Tap Physics */}
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

          {/* Right Column: Clean Floating Product Showcase (5 cols) */}
          <div className="lg:col-span-5 hidden sm:flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative w-full max-w-sm lg:max-w-md aspect-square flex items-center justify-center"
              >
                {/* Soft Radial Ambient Glow */}
                <div
                  className="absolute inset-4 rounded-full bg-gradient-to-tr from-[var(--red)]/20 via-[var(--gold)]/15 to-transparent blur-3xl pointer-events-none"
                  aria-hidden="true"
                />

                {/* Cutout Product Image with Rich Soft Shadow */}
                <motion.img
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  transition={{ duration: 0.3 }}
                  src={slide.productImage}
                  alt={slide.headlinePrefix}
                  className="relative z-10 max-h-[85%] max-w-[85%] object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.65)] cursor-pointer"
                  loading="eager"
                />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Navigation Arrows (Hidden on Mobile to Prevent Text Overlap) */}
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

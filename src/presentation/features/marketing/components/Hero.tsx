import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface HeroSlide {
  id: string;
  badgeEn: string;
  badgeSw: string;
  headlineEn: string;
  headlineSw: string;
  subEn: string;
  subSw: string;
  ctaEn: string;
  ctaSw: string;
  href: string;
  image: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    badgeEn: 'LIMITED EDITION',
    badgeSw: 'TOLEO MAALUM',
    headlineEn: 'Feel the Power. Own the Race.',
    headlineSw: 'Hisi Nguvu. Shinda Shindano.',
    subEn: 'Explore the world’s most advanced writing companion. 70 GSM bleed-proof paper.',
    subSw: 'Chunguza daftari bora na thabiti zaidi la masomo na kazi kote Tanzania.',
    ctaEn: 'Shop Counter Books',
    ctaSw: 'Nunua Vitabu Sasa',
    href: '/catalog?category=Counter+Books',
    image: '/omega-counter-book-banner.jpg',
  },
  {
    id: 'slide-2',
    badgeEn: 'TANZANIA BENCHMARK',
    badgeSw: 'KIWANGO CHA TANZANIA',
    headlineEn: 'Premium Books for a Brighter Future.',
    headlineSw: 'Vitabu Bora Kwa Kesho Yenye Nuru.',
    subEn: 'High-quality notebooks & exercise books — trusted across all 31 regions.',
    subSw: 'Madaftari yenye ubora wa juu yanayoaminika shuleni na maofisini.',
    ctaEn: 'Explore Our Products',
    ctaSw: 'Tazama Bidhaa Zetu',
    href: '/catalog',
    image: '/omega-spiral-banner.jpg',
  },
  {
    id: 'slide-3',
    badgeEn: 'ARCHIVAL SMYTH-SEWN',
    badgeSw: 'MSHONO THABITI WA NYUZI',
    headlineEn: 'Smyth-Sewn Books. Built to Last.',
    headlineSw: 'Mshono wa Nyuzi. Hudumu Miaka.',
    subEn: 'Archival 70 GSM bleed-proof bond engineered for executives and scholars.',
    subSw: 'Karatasi ya 70 GSM isiyopenyeza wino kabisa kwa kalamu zote.',
    ctaEn: 'Shop All Products',
    ctaSw: 'Tazama Mkusanyiko',
    href: '/catalog',
    image: '/omega-products/omega-counter-book-podium.png',
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
      className="relative w-full overflow-hidden bg-[#111113] min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] flex items-center border-b border-[#E7E5E0]"
    >
      {/* Background Slides with Crossfade */}
      {HERO_SLIDES.map((s, idx) => {
        const isCurrent = idx === currentIdx;
        return (
          <div
            key={s.id}
            className={`absolute inset-0 bg-cover bg-center sm:bg-right bg-no-repeat transition-all duration-700 ease-out pointer-events-none ${
              isCurrent ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{ backgroundImage: `url('${s.image}')` }}
            aria-hidden="true"
          />
        );
      })}

      {/* Dark gradient overlay on the left so text is crisp and readable */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#111113] via-[#111113]/85 sm:via-[#111113]/70 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-xl text-left space-y-4 sm:space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-[#DC2626] text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase">
            <span>★</span>
            <span>{language === 'sw' ? slide.badgeSw : slide.badgeEn}</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'sw' ? slide.headlineSw : slide.headlineEn}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-zinc-300 max-w-lg leading-relaxed font-sans">
            {language === 'sw' ? slide.subSw : slide.subEn}
          </p>

          {/* Primary CTA Button */}
          <div className="pt-2">
            <Link
              to={slide.href}
              className="inline-flex items-center gap-2.5 px-6 py-3 min-h-[44px] rounded-xl bg-[#DC2626] hover:bg-[#b91c1c] active:scale-95 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md group cursor-pointer"
            >
              <span>{language === 'sw' ? slide.ctaSw : slide.ctaEn}</span>
              <ArrowRight
                size={18}
                strokeWidth={1.75}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#DC2626] text-white backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer border border-white/20"
      >
        <ChevronLeft className="w-5 h-5 stroke-[1.75]" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-[#DC2626] text-white backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer border border-white/20"
      >
        <ChevronRight className="w-5 h-5 stroke-[1.75]" />
      </button>

      {/* Slider Pagination Dots */}
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
                isActive
                  ? 'w-7 bg-[#DC2626] shadow-xs'
                  : 'w-2 bg-white/40 hover:bg-white/80'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Hero;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface HeroProps {
  whatsappGreetingUrl?: string;
}

interface HeroSlide {
  id: string;
  badgeEn: string;
  badgeSw: string;
  line1En: string;
  line2En: string;
  line3En: string;
  line1Sw: string;
  line2Sw: string;
  line3Sw: string;
  descEn: string;
  descSw: string;
  ctaTextEn: string;
  ctaTextSw: string;
  href: string;
  bgImage: string;
  bgPosition?: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'counter-book-flagship',
    badgeEn: 'OMEGA BOOK PRODUCTS',
    badgeSw: 'TOLEO KUU LA OMEGA',
    line1En: 'Premium Books',
    line2En: 'for a Brighter',
    line3En: 'Future.',
    line1Sw: 'Vitabu Bora',
    line2Sw: 'kwa Maisha',
    line3Sw: 'Bora Zaidi.',
    descEn: 'High-quality notebooks, exercise books, counter books and stationery products — trusted across Tanzania.',
    descSw: 'Madaftari bora, exercise books, counter books na vifaa vya stationery — vinavyoaminika kote Tanzania.',
    ctaTextEn: 'Explore Our Products',
    ctaTextSw: 'Chunguza Bidhaa Zetu',
    href: '/catalog',
    bgImage: '/hero-desk-bg.jpg',
    bgPosition: 'center right',
  },
  {
    id: 'podium-master-edition',
    badgeEn: 'LIMITED EDITION',
    badgeSw: 'TOLEO MAALUM',
    line1En: 'Feel the',
    line2En: 'Quality.',
    line3En: 'Own the Craft.',
    line1Sw: 'Hisia za',
    line2Sw: 'Ubora.',
    line3Sw: 'Miliki Ustadi.',
    descEn: 'Archival 70 GSM bleed-proof paper engineered for executives, schools & institutions.',
    descSw: 'Karatasi nzito ya 70 GSM isiyopenyeza wino kwa shule, vyuo na ofisi.',
    ctaTextEn: 'Explore Now',
    ctaTextSw: 'Chunguza Sasa',
    href: '/product/prod-omega-cb-q2',
    bgImage: '/omega-products/omega-counter-book-podium.png',
    bgPosition: 'center 42%',
  },
  {
    id: 'spiral-notebook-series',
    badgeEn: 'EXCLUSIVE COLLECTION',
    badgeSw: 'MKUSANYIKO MAALUM',
    line1En: 'Built for',
    line2En: 'Students.',
    line3En: 'Lead the Class.',
    line1Sw: 'Imetengenezwa',
    line2Sw: 'Kwa Wanafunzi.',
    line3Sw: 'Ongoza Darasa.',
    descEn: 'High-opacity single line, double line, square grid, and spiral notebooks.',
    descSw: 'Madaftari bora ya mistari mipana, mistari miwili na hesabu kwa wanafunzi.',
    ctaTextEn: 'Discover More',
    ctaTextSw: 'Chunguza Zaidi',
    href: '/catalog?category=Exercise+Books',
    bgImage: '/hero-spiral-notebook.jpg',
    bgPosition: 'center right',
  },
  {
    id: 'heritage-library-series',
    badgeEn: 'HERITAGE ARCHIVE',
    badgeSw: 'URITHI WA OMEGA',
    line1En: 'Crafted for',
    line2En: 'Excellence.',
    line3En: 'Built to Last.',
    line1Sw: 'Imeundwa kwa',
    line2Sw: 'Ubora.',
    line3Sw: 'Inadumu Miaka.',
    descEn: 'Trusted across 31 regions of Tanzania since 1998 from Soweto SIDO, Mbeya.',
    descSw: 'Inaaminika katika mikoa yote 31 ya Tanzania tangu mwaka 1998.',
    ctaTextEn: 'Explore Now',
    ctaTextSw: 'Chunguza Sasa',
    href: '/catalog',
    bgImage: '/hero-luxury-bg.jpg',
    bgPosition: 'center right',
  },
  {
    id: 'b2b-wholesale-cartons',
    badgeEn: 'FACTORY WHOLESALE',
    badgeSw: 'BEI ZA KIWANDANI',
    line1En: 'Power Your',
    line2En: 'Business.',
    line3En: 'Order in Bulk.',
    line1Sw: 'Imarisha',
    line2Sw: 'Biashara.',
    line3Sw: 'Agiza kwa Jumla.',
    descEn: 'Direct factory master cartons with same-day upcountry bus parcel dispatch.',
    descSw: 'Katoni za jumla moja kwa moja kutoka kiwandani kwenda mikoa yote Tanzania.',
    ctaTextEn: 'Explore Now',
    ctaTextSw: 'Chunguza Sasa',
    href: '/wholesale',
    bgImage: '/omega-products/manila-catalog.png',
    bgPosition: 'center right',
  },
];

export const Hero: React.FC<HeroProps> = () => {
  const { language } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeSlide = HERO_SLIDES[activeIndex];

  return (
    <section
      aria-label="Omega Book Products Hero"
      className="w-full bg-[#fafafa] pt-4 sm:pt-6 pb-4 sm:pb-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contained Rounded Hero Banner with Single Dynamic Full-Bleed Background Image */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full rounded-[26px] sm:rounded-[34px] overflow-hidden bg-[#09090b] border border-[#27272a] shadow-[0_24px_60px_rgba(9,9,11,0.18)] min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] flex items-center"
        >
          {/* Single Full-Bleed Background Image Crossfade Layer (No double image box) */}
          {HERO_SLIDES.map((slide, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 bg-cover bg-no-repeat transition-all duration-700 ease-out pointer-events-none ${
                  isCurrent ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                style={{
                  backgroundImage: `url('${slide.bgImage}')`,
                  backgroundPosition: slide.bgPosition || 'center right',
                }}
                aria-hidden="true"
              />
            );
          })}

          {/* Smooth Left-to-Right Scrim so Left Text is Crisp & Right Background Subject is Clear */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#09090b]/95 via-[#09090b]/75 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {/* Subtle Bottom Vignette & Crimson Rim Light */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#09090b]/85 via-transparent to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -top-20 left-1/3 w-[520px] h-[220px] bg-gradient-to-r from-white/[0.08] via-white/[0.03] to-transparent rotate-[-18deg] blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Left Overlay Content */}
          <div className="relative z-10 w-full px-6 sm:px-10 lg:px-14 py-8 sm:py-12 lg:py-14">
            <div className="max-w-lg flex flex-col items-start text-left space-y-4 sm:space-y-5">
              {/* Top Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 text-[#111113] shadow-md">
                <Star className="w-3.5 h-3.5 fill-[#dc2626] text-[#dc2626] shrink-0" />
                <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.14em] font-mono">
                  {language === 'sw' ? activeSlide.badgeSw : activeSlide.badgeEn}
                </span>
              </div>

              {/* 3-Line Stacked Bold Display Headline */}
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-[3.35rem] font-black tracking-tight leading-[1.06] text-white">
                <span className="block">
                  {language === 'sw' ? activeSlide.line1Sw : activeSlide.line1En}
                </span>
                <span className="block">
                  {language === 'sw' ? activeSlide.line2Sw : activeSlide.line2En}
                </span>
                <span className="block text-[#ef4444] drop-shadow-[0_2px_18px_rgba(220,38,38,0.45)]">
                  {language === 'sw' ? activeSlide.line3Sw : activeSlide.line3En}
                </span>
              </h1>

              {/* Concise 2-Line Subtitle */}
              <p className="text-xs sm:text-base text-zinc-200 max-w-md leading-relaxed font-normal">
                {language === 'sw' ? activeSlide.descSw : activeSlide.descEn}
              </p>

              {/* Primary Pill CTA Button with Circle Arrow */}
              <div className="pt-1">
                <Link
                  to={activeSlide.href}
                  className="group inline-flex items-center gap-3.5 pl-6 pr-2.5 py-2.5 rounded-full bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] hover:from-[#991b1b] hover:to-[#dc2626] text-white font-bold text-sm sm:text-base shadow-[0_8px_28px_rgba(220,38,38,0.4)] hover:shadow-[0_12px_34px_rgba(220,38,38,0.55)] transition-all active:scale-95"
                >
                  <span>
                    {language === 'sw' ? activeSlide.ctaTextSw : activeSlide.ctaTextEn}
                  </span>
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#dc2626] flex items-center justify-center shadow-xs group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom-Right Pagination Dots (directly switches the background image) */}
          <div
            role="tablist"
            aria-label="Hero slides"
            className="absolute bottom-4 right-6 sm:bottom-6 sm:right-10 z-20 flex items-center gap-2"
          >
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Slide ${idx + 1}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-7 bg-[#dc2626] shadow-[0_0_12px_rgba(220,38,38,0.8)]'
                      : 'w-2.5 bg-white/50 hover:bg-white/85'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

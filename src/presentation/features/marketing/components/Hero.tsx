import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  Award,
  MapPin,
  ArrowRight,
  MessageCircle,
  Sparkles,
  BookOpen,
  FileSpreadsheet,
  FileText,
  Boxes,
  FolderOpen,
  RefreshCw,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
  Tag,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { TRANSLATIONS } from '@/data/translations';

interface HeroProps {
  whatsappGreetingUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({ whatsappGreetingUrl }) => {
  const { language, storeConfig } = useStore();
  const t = (TRANSLATIONS[language] || TRANSLATIONS.en) as any;

  const cleanWhatsappDigits = storeConfig?.whatsappNumber
    ? storeConfig.whatsappNumber.replace(/\D/g, '')
    : '255746268391';
  const whatsappUrl =
    whatsappGreetingUrl ||
    `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
      language === 'sw'
        ? 'Habari OMEGA Stationery, ninahitaji kuagiza madaftari (Counter Books, Exercise Books na Bahasha) kwa bei ya jumla.'
        : 'Hello OMEGA Stationery, I would like to place an order and inquire about wholesale carton pricing.'
    )}`;

  // =========================================================================
  // 1. FLIPKART-STYLE BANNER SLIDER STATE & AUTO-ADVANCE
  // =========================================================================
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 3D Flip Card state for the flagship interactive book
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeInsidePage, setActiveInsidePage] = useState<1 | 2>(1);
  const [isFlipping, setIsFlipping] = useState(false);

  // Parallax tilt on mouse move
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 7;
    const rotateX = -((y - centerY) / centerY) * 7;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleFlip = () => {
    setIsFlipping(true);
    setIsFlipped((prev) => !prev);
    setTimeout(() => setIsFlipping(false), 700);
  };

  // Base 3D posture
  const baseRotX = isFlipped ? -6 : -13;
  const baseRotY = isFlipped ? 180 + 10 : 26;
  const baseRotZ = isFlipped ? -6 : 8;

  const rotX = baseRotX + tilt.x;
  const rotY = baseRotY + tilt.y;
  const rotZ = baseRotZ;

  // Total Flipkart slides
  const totalSlides = 4;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // =========================================================================
  // 2. LIVE COUNTDOWN TIMER (FLIPKART "DEALS OF THE DAY" TICKER)
  // =========================================================================
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 36, seconds: 42 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format2Digits = (n: number) => n.toString().padStart(2, '0');

  // =========================================================================
  // 3. FLIPKART TOP CATEGORY STRIP DATA (Icons + Labels)
  // =========================================================================
  const topCategories = [
    {
      title: language === 'sw' ? 'Madaftari ya Kaunta' : 'Counter Books',
      badge: 'Q2 - Q4',
      image: '/omega-products/counter-book-q3-catalog.jpeg',
      href: '/catalog?category=Counter+Books',
    },
    {
      title: language === 'sw' ? 'Exercise Books' : 'Exercise Books',
      badge: '200p / 100p',
      image: '/omega-products/exercise-book-200p-sl-catalog.jpeg',
      href: '/catalog?category=Exercise+Books',
    },
    {
      title: language === 'sw' ? 'Vifaa vya Hesabu' : 'Maths Sets',
      badge: 'Oxford Exam',
      image: '/omega-products/oxford-mathematical-set.jpeg',
      href: '/catalog?category=School+Stationery',
    },
    {
      title: language === 'sw' ? 'Karatasi za Kopi' : 'Ruled Paper',
      badge: '70 GSM A4',
      image: '/omega-products/ruled-paper-catalog.jpeg',
      href: '/catalog?category=Ruled+Paper',
    },
    {
      title: language === 'sw' ? 'Faili za Ofisi' : 'Box Files',
      badge: 'Archival',
      image: '/omega-products/folder-file-catalog.jpeg',
      href: '/catalog?category=Files+%26+Folders',
    },
    {
      title: language === 'sw' ? 'Bahasha (Kraft)' : 'Envelopes',
      badge: 'A4 / A5 / A3',
      image: '/omega-products/bahasha-a4-catalog.jpeg',
      href: '/catalog?category=Bahasha+%26+Envelopes',
    },
    {
      title: language === 'sw' ? 'Madaftari Stiff' : 'Stiff Cover',
      badge: '200 Pages',
      image: '/omega-products/stiff-cover-200-catalog.jpeg',
      href: '/catalog?category=Exercise+Books',
    },
    {
      title: language === 'sw' ? 'Katoni za Jumla' : 'Wholesale Cartons',
      badge: 'Save 25%',
      image: '/omega-products/counter-book-q4-catalog.jpeg',
      href: '/wholesale',
    },
  ];

  // =========================================================================
  // 4. FLIPKART "DEALS OF THE DAY" CARDS
  // =========================================================================
  const dealsOfTheDay = [
    {
      name: 'OMEGA Counter Book Q3 (288p)',
      price: 'TSh 3,200',
      origPrice: 'TSh 3,800',
      discount: '16% OFF',
      tag: language === 'sw' ? 'Inauza Zaidi' : 'Top Bestseller',
      image: '/omega-products/counter-book-q3-catalog.jpeg',
      link: '/product/prod-omega-cb-q3',
    },
    {
      name: 'Exercise Book 200p Single Line',
      price: 'TSh 1,400',
      origPrice: 'TSh 1,750',
      discount: '20% OFF',
      tag: language === 'sw' ? 'Pakiti ya Shule' : 'School 12-Pack',
      image: '/omega-products/exercise-book-200p-sl-catalog.jpeg',
      link: '/product/prod-omega-ex-200sl',
    },
    {
      name: 'Oxford Mathematical Exam Set',
      price: 'TSh 4,500',
      origPrice: 'TSh 5,200',
      discount: '14% OFF',
      tag: language === 'sw' ? 'Mtihani wa Taifa' : 'NECTA Approved',
      image: '/omega-products/oxford-mathematical-set.jpeg',
      link: '/catalog?category=School+Stationery',
    },
    {
      name: 'Heavyweight Box File (Spring)',
      price: 'TSh 6,500',
      origPrice: 'TSh 7,500',
      discount: '13% OFF',
      tag: language === 'sw' ? 'Ofisi na Benki' : 'Archival Grade',
      image: '/omega-products/folder-file-catalog.jpeg',
      link: '/catalog?category=Files+%26+Folders',
    },
    {
      name: 'Bahasha A4 Heavy Brown Kraft',
      price: 'TSh 500',
      origPrice: 'TSh 700',
      discount: '28% OFF',
      tag: language === 'sw' ? 'Bei ya Katoni' : 'Carton of 500',
      image: '/omega-products/bahasha-a4-catalog.jpeg',
      link: '/catalog?category=Bahasha+%26+Envelopes',
    },
  ];

  return (
    <section
      aria-label="Omega Stationery Flipkart-Style Landing Section"
      className="relative w-full overflow-hidden bg-[#0c0a09] text-white"
    >
      {/* ========================================================================= */}
      {/* BACKGROUND: CINEMATIC LUXURY ANTIQUE DESK WITH WARM LAMP */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-102 transition-transform duration-1000"
        style={{ backgroundImage: "url('/hero-luxury-bg.jpg')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#0c0a09]/95 via-[#0c0a09]/85 to-[#0c0a09]/90 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-[#0c0a09]/70 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#e8a85d]/14 blur-[140px] pointer-events-none animate-pulse"
        style={{ animationDuration: '6s' }}
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* 1. FLIPKART SIGNATURE TOP CATEGORY BAR (Horizontal Row with Icons) */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full border-b border-white/10 bg-[#14110f]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3 sm:gap-6 overflow-x-auto no-scrollbar touch-pan-x">
            {topCategories.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.href}
                className="flex flex-col items-center gap-1.5 shrink-0 group min-w-[72px] sm:min-w-[88px] text-center"
              >
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.06] border border-white/10 group-hover:border-[#c49b7c] group-hover:bg-white/[0.14] transition-all p-1.5 flex items-center justify-center overflow-hidden shadow-sm">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-contain mix-blend-screen scale-105 group-hover:scale-115 transition-transform"
                    loading="lazy"
                  />
                  {cat.badge && (
                    <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded bg-[#c49b7c] text-[#161311] font-mono font-bold text-[7px] shadow-xs">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-stone-300 group-hover:text-[#e5a962] transition-colors whitespace-nowrap">
                  {cat.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN HERO BANNER SLIDER (FLIPKART AUTO-SLIDING CAROUSEL) */}
      {/* ========================================================================= */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 sm:pt-8 sm:pb-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/15 backdrop-blur-md overflow-hidden shadow-2xl min-h-[460px] sm:min-h-[490px] flex items-center">
          
          {/* Flipkart Left / Right Navigation Arrows */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-2 sm:left-4 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 hover:border-[#c49b7c] backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#e5a962]" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-2 sm:right-4 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 hover:border-[#c49b7c] backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#e5a962]" />
          </button>

          {/* ===================================================================== */}
          {/* SLIDE 0: FLAGSHIP 3D HARDCOVER NOTEBOOK (WITH 3D FLIPCARD) */}
          {/* ===================================================================== */}
          {currentSlide === 0 && (
            <div className="w-full px-6 sm:px-12 lg:px-16 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in zoom-in-98 duration-500">
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-[#c49b7c]/40 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#e5a962] animate-ping" />
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#e5a962] uppercase">
                    {language === 'sw' ? 'OFA MAALUM YA WIKI · NECTA STANDARD' : 'TANZANIA #1 BESTSELLER · ARCHIVAL GRADE'}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#faf8f5] leading-[1.14]">
                  {language === 'sw' ? 'Madaftari ya Kaunta' : 'Hardcover Counter Books'}
                  <span className="block font-serif italic font-normal text-[#e5a962] drop-shadow-[0_2px_12px_rgba(229,169,98,0.3)]">
                    {language === 'sw' ? 'Yaliyoshonwa kwa Nyuzi Imara.' : 'Built to Endure Generations.'}
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl font-normal">
                  {language === 'sw'
                    ? 'Karatasi ya 70 GSM isiyopenyeza wino, jalada ngumu la milimita 1.8, na ushonaji wa nyuzi (Smyth-sewn). Yanayotumiwa na shule, vyuo na ofisi Tanzania nzima.'
                    : 'Bleed-proof 70 GSM archival paper, 1.8mm rigid hardboard, and reinforced thread-sewn binding. Engineered to lay flat 180° with zero loose pages.'}
                </p>

                {/* Flipkart Price & Offer Badge */}
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    TSh 3,200
                  </span>
                  <span className="text-sm sm:text-base text-stone-400 line-through font-mono">
                    TSh 3,800
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
                    16% OFF
                  </span>
                </div>

                {/* Action CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/catalog?category=Counter+Books"
                    className="px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#c49b7c] via-[#d6b59d] to-[#c49b7c] text-[#161311] font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#c49b7c]/20 hover:scale-[1.02] transition-all flex items-center gap-2 group"
                  >
                    <span>{language === 'sw' ? 'Agiza Sasa' : 'Explore Counter Books'}</span>
                    <ArrowRight className="w-4 h-4 text-[#161311] group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 sm:py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/20 font-semibold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>{language === 'sw' ? 'Bei ya Katoni' : 'Wholesale Carton Quote'}</span>
                  </a>
                </div>
              </div>

              {/* 3D Interactive Flipcard Notebook */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center select-none py-2">
                <div
                  ref={stageRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="relative w-full max-w-[280px] sm:max-w-[320px] flex flex-col items-center justify-center"
                >
                  {/* Floating Depth Chip */}
                  <div className="absolute -top-3 z-20 px-3 py-1 rounded-full bg-[#1c1815]/90 border border-[#c49b7c]/40 text-[10px] font-mono text-[#e5a962] shadow-xl backdrop-blur-md flex items-center gap-1.5 pointer-events-none">
                    {isFlipped ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Inside Ruled Folio · 70 GSM</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-[#e5a962] animate-pulse" />
                        <span>OMEGA Q3 · 288 Pages</span>
                      </>
                    )}
                  </div>

                  {/* 3D Rotating & Flipping Notebook */}
                  <div
                    className="relative z-10 w-full flex items-center justify-center py-4 animate-omega-float"
                    style={{ perspective: '1350px' }}
                  >
                    <div
                      onClick={handleFlip}
                      role="button"
                      tabIndex={0}
                      title="Click to Flip Notebook in 3D"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale3d(1.02, 1.02, 1.02)`,
                        transition: isFlipping
                          ? 'transform 0.75s cubic-bezier(0.34, 1.25, 0.64, 1)'
                          : isHovered
                          ? 'transform 0.1s ease-out'
                          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                        width: '210px',
                        height: '305px',
                      }}
                      className="relative rounded-r-xl shadow-2xl transition-transform cursor-pointer outline-none"
                    >
                      {/* FRONT FACE */}
                      <div
                        style={{
                          transform: 'translateZ(16px)',
                          backfaceVisibility: 'hidden',
                        }}
                        className="absolute inset-0 rounded-r-xl bg-[#0c192b] border border-[#2a4365]/70 overflow-hidden flex flex-col justify-between p-4 shadow-2xl"
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-luminosity scale-105"
                          style={{ backgroundImage: `url('/omega-products/counter-book-q3-catalog.jpeg')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-[#0c192b]/92 to-[#1a2c48]/60 pointer-events-none" />
                        <div className="absolute inset-2 border border-amber-400/65 rounded-lg pointer-events-none shadow-sm" />
                        
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="text-[8px] font-mono font-black tracking-widest text-amber-300 uppercase">
                            TANZANIA STANDARD
                          </span>
                          <span className="px-1.5 py-0.2 text-[8px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/60 rounded font-mono">
                            Q3 · 288P
                          </span>
                        </div>

                        <div className="relative z-10 text-center my-auto space-y-1">
                          <div className="w-11 h-11 mx-auto rounded-full border-2 border-amber-400 flex items-center justify-center bg-stone-950/90 shadow-xl ring-2 ring-amber-400/25">
                            <span className="font-serif text-xl font-black text-amber-300">Ω</span>
                          </div>
                          <h4 className="font-serif text-xl font-black tracking-widest text-white uppercase drop-shadow-md">
                            OMEGA
                          </h4>
                          <p className="text-[9px] tracking-[0.2em] font-extrabold uppercase text-amber-200">
                            COUNTER BOOK
                          </p>
                        </div>

                        <div className="relative z-10 bg-white/95 rounded-lg p-1.5 text-stone-900 shadow-lg border border-stone-300 text-[7px] font-mono font-bold">
                          <div className="border-b border-dashed border-stone-300 pb-0.5 flex justify-between">
                            <span>NAME: _____________</span>
                            <span>SUBJ: _____</span>
                          </div>
                          <div className="pt-0.5 flex justify-between text-stone-600">
                            <span>HARDCOVER</span>
                            <span className="text-red-700">BLEEDPROOF</span>
                          </div>
                        </div>

                        <div className="absolute bottom-1.5 right-1.5 z-20 px-1.5 py-0.5 rounded-full bg-[#1c1815]/90 border border-[#e5a962]/50 text-[8px] font-mono text-[#e5a962] flex items-center gap-1 shadow-md">
                          <RefreshCw className="w-2 h-2 animate-spin" style={{ animationDuration: '6s' }} />
                          <span>Flip</span>
                        </div>
                      </div>

                      {/* BACK FACE (INSIDE RULED PAGES) */}
                      <div
                        style={{
                          transform: 'translateZ(-16px) rotateY(180deg)',
                          backfaceVisibility: 'hidden',
                        }}
                        className="absolute inset-0 rounded-l-xl bg-[#fcfbf8] text-[#1c1917] border-2 border-stone-400 overflow-hidden flex flex-col justify-between p-3.5 shadow-2xl"
                      >
                        <div className="relative z-10 border-b border-red-500/80 pb-1 flex items-center justify-between text-[8px] font-mono font-bold text-stone-700">
                          <span className="text-red-700">OMEGA · Q3 (288P)</span>
                          <span>PG 0{activeInsidePage}</span>
                        </div>

                        <div className="relative z-10 my-auto space-y-2">
                          <div className="absolute top-0 bottom-0 left-5 w-[1.5px] bg-red-500/70 pointer-events-none" />
                          <div className="border-b border-blue-200/80 pb-0.5 pl-7">
                            <p className="font-serif italic text-[11px] font-bold text-stone-900">
                              OMEGA – Kiwango cha Juu.
                            </p>
                          </div>
                          <div className="border-b border-blue-200/80 pb-0.5 pl-7">
                            <p className="text-[9px] text-stone-700">
                              Karatasi 70 GSM isiyopenyeza wino.
                            </p>
                          </div>
                          <div className="border-b border-blue-200/80 pb-0.5 pl-7">
                            <p className="text-[9px] text-stone-700">
                              Ushonaji imara wa nyuzi (Smyth-sewn).
                            </p>
                          </div>
                          <div className="border-b border-blue-200/80 pb-0.5 pl-7">
                            <p className="text-[8px] font-mono text-stone-500">
                              Tanzania National Standard
                            </p>
                          </div>
                        </div>

                        <div className="relative z-10 pt-1 border-t border-stone-300 flex items-center justify-between text-[8px] font-mono">
                          <span className="text-emerald-800 font-bold">100% BLEEDPROOF</span>
                          <span className="text-stone-600">To Cover ↻</span>
                        </div>
                      </div>

                      {/* SPINE */}
                      <div
                        style={{
                          width: '32px',
                          transform: 'rotateY(-90deg) translateZ(16px)',
                          left: '-16px',
                        }}
                        className="absolute top-0 bottom-0 bg-[#2b080f] border-y border-l border-red-950 flex flex-col justify-between items-center py-3"
                      >
                        <div className="text-amber-400 font-bold text-[8px]">Ω</div>
                        <div
                          style={{ writingMode: 'vertical-rl' }}
                          className="text-amber-200 text-[9px] font-black tracking-widest uppercase transform rotate-180"
                        >
                          OMEGA · Q3 · 288P
                        </div>
                        <div className="text-amber-400 text-[9px]">★</div>
                      </div>

                      {/* RIGHT PAPER BLOCK */}
                      <div
                        style={{
                          width: '30px',
                          height: '298px',
                          top: '3px',
                          right: '2px',
                          transform: 'rotateY(90deg) translateZ(15px)',
                          transformOrigin: 'right center',
                          background: 'linear-gradient(to right, #ded9ce, #fcfbf8 25%, #f7f4eb 75%, #ded9ce)',
                        }}
                        className="absolute"
                      />
                    </div>
                  </div>

                  {/* Micro Hint */}
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-stone-400 mt-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#e5a962]" />
                    <span>{language === 'sw' ? 'Gusa kugeuza daftari' : 'Click book to flip 3D card'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SLIDE 1: BACK TO SCHOOL MEGA STATIONERY FAIR */}
          {/* ===================================================================== */}
          {currentSlide === 1 && (
            <div className="w-full px-6 sm:px-12 lg:px-16 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in zoom-in-98 duration-500">
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 backdrop-blur-md">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-emerald-300 uppercase">
                    {language === 'sw' ? 'MSIMU WA SHULE · BEI YA JUMLA' : 'BACK TO SCHOOL · SUPER SAVINGS'}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#faf8f5] leading-[1.14]">
                  {language === 'sw' ? 'Madaftari ya Wanafunzi' : 'Complete School Packs'}
                  <span className="block font-serif italic font-normal text-[#e5a962]">
                    {language === 'sw' ? 'Kurasa 200, 100 na 80.' : '200p, 100p & Oxford Maths Sets.'}
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl font-normal">
                  {language === 'sw'
                    ? 'Single Line, Double Line na Mathematics Squares. Karatasi nyeupe isiyopenyeza wino, inafaa kwa watoto wa msingi na sekondari kuanzia Form 1 hadi Form 6.'
                    : 'Classroom approved single line, double line, and mathematics grid books. Built with high-bulk 70 GSM paper resistant to ink feathering.'}
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    From TSh 1,200
                  </span>
                  <span className="text-xs sm:text-sm text-emerald-400 font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40">
                    Carton Pack of 144
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/catalog?category=Exercise+Books"
                    className="px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#c49b7c] via-[#d6b59d] to-[#c49b7c] text-[#161311] font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
                  >
                    <span>{language === 'sw' ? 'Tazama Madaftari ya Shule' : 'Shop School Catalog'}</span>
                    <ArrowRight className="w-4 h-4 text-[#161311]" />
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 sm:py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/20 font-semibold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>{language === 'sw' ? 'Omba Orodha ya Shule' : 'Get School Price List'}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-full max-w-[320px] aspect-square rounded-2xl bg-white/[0.04] border border-white/15 p-4 flex items-center justify-center overflow-hidden shadow-2xl">
                  <img
                    src="/omega-products/exercise-book-200p-sl-catalog.jpeg"
                    alt="School Exercise Books"
                    className="w-full h-full object-contain mix-blend-screen scale-110 drop-shadow-2xl"
                  />
                  <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 border border-white/10 backdrop-blur-md flex items-center justify-between text-xs">
                    <span className="font-bold text-[#e5a962]">Single & Double Line</span>
                    <span className="font-mono text-emerald-400">In Stock</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SLIDE 2: KARIAKOO WHOLESALE & REGIONAL BUS CARGO */}
          {/* ===================================================================== */}
          {currentSlide === 2 && (
            <div className="w-full px-6 sm:px-12 lg:px-16 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in zoom-in-98 duration-500">
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 backdrop-blur-md">
                  <Truck className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-blue-300 uppercase">
                    {language === 'sw' ? 'USAJILI WA MABASI · MIKOANI KOTE' : 'COUNTRYWIDE FREIGHT · ALL 31 REGIONS'}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#faf8f5] leading-[1.14]">
                  {language === 'sw' ? 'Usafirishaji wa Mabasi' : 'Direct Factory Wholesale'}
                  <span className="block font-serif italic font-normal text-[#e5a962]">
                    {language === 'sw' ? 'Kariakoo hadi Mikoani.' : 'Kariakoo Hub to Your Doorstep.'}
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl font-normal">
                  {language === 'sw'
                    ? 'Mwanza, Arusha, Mbeya, Dodoma, Morogoro, Kigoma na Zanzibar. Mizigo inapakiwa siku hiyo hiyo kwenye mabasi au malori ya mizigo kwa uhakika na usalama.'
                    : 'Direct bulk dispatch via express bus parcels and freight trucks to Mwanza, Arusha, Mbeya, Dodoma, and all Tanzania provinces with live tracking.'}
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-sm sm:text-base font-bold text-stone-200">
                    Min Order: 5 Cartons
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#c49b7c]/20 text-[#e5a962] border border-[#c49b7c]/40 text-xs font-mono font-bold">
                    Same-Day Bus Dispatch
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/wholesale"
                    className="px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#c49b7c] via-[#d6b59d] to-[#c49b7c] text-[#161311] font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
                  >
                    <span>{language === 'sw' ? 'Katalogi ya Jumla' : 'Wholesale Center'}</span>
                    <ArrowRight className="w-4 h-4 text-[#161311]" />
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 sm:py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/20 font-semibold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>{language === 'sw' ? 'Ongea na Idara ya Mizigo' : 'Talk to Cargo Desk'}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-full max-w-[320px] aspect-square rounded-2xl bg-white/[0.04] border border-white/15 p-4 flex items-center justify-center overflow-hidden shadow-2xl">
                  <img
                    src="/omega-products/counter-book-q4-catalog.jpeg"
                    alt="Wholesale Master Cartons"
                    className="w-full h-full object-contain mix-blend-screen scale-110 drop-shadow-2xl"
                  />
                  <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 border border-white/10 backdrop-blur-md flex items-center justify-between text-xs">
                    <span className="font-bold text-[#e5a962]">31 Regions Coverage</span>
                    <span className="font-mono text-emerald-400">Express Bus Cargo</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SLIDE 3: EXECUTIVE OFFICE & ARCHIVAL FILING */}
          {/* ===================================================================== */}
          {currentSlide === 3 && (
            <div className="w-full px-6 sm:px-12 lg:px-16 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in zoom-in-98 duration-500">
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 backdrop-blur-md">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-amber-300 uppercase">
                    {language === 'sw' ? 'VIFAA VYA OFISI · NYARAKA ZA SERIKALI' : 'EXECUTIVE OFFICE & ARCHIVAL FILING'}
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#faf8f5] leading-[1.14]">
                  {language === 'sw' ? 'Faili, Bahasha & Karatasi' : 'Box Files & Envelopes'}
                  <span className="block font-serif italic font-normal text-[#e5a962]">
                    {language === 'sw' ? 'Viwango vya Biashara na Ofisi.' : 'Precision Archival Supplies.'}
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl font-normal">
                  {language === 'sw'
                    ? 'Faili ngumu za spring clip, bahasha za kaki A4/A5 zilizotengenezwa kwa karatasi imara ya Kraft, na ream za karatasi za nakala (copy paper).'
                    : 'Heavy-gauge spring clamp files, tamper-evident Kraft document envelopes, and continuous stationery trusted by banking, legal, and government departments.'}
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    From TSh 500
                  </span>
                  <span className="text-xs sm:text-sm text-stone-300 font-mono">
                    VAT Invoicing Available
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/catalog?category=Files+%26+Folders"
                    className="px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#c49b7c] via-[#d6b59d] to-[#c49b7c] text-[#161311] font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
                  >
                    <span>{language === 'sw' ? 'Tazama Vifaa vya Ofisi' : 'Explore Office Line'}</span>
                    <ArrowRight className="w-4 h-4 text-[#161311]" />
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 sm:py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/20 font-semibold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>{language === 'sw' ? 'Agiza Bahasha & Faili' : 'Inquire Office Orders'}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-full max-w-[320px] aspect-square rounded-2xl bg-white/[0.04] border border-white/15 p-4 flex items-center justify-center overflow-hidden shadow-2xl">
                  <img
                    src="/omega-products/folder-file-catalog.jpeg"
                    alt="Box Files and Folders"
                    className="w-full h-full object-contain mix-blend-screen scale-110 drop-shadow-2xl"
                  />
                  <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 border border-white/10 backdrop-blur-md flex items-center justify-between text-xs">
                    <span className="font-bold text-[#e5a962]">Archival Hardboard</span>
                    <span className="font-mono text-emerald-400">Immediate Supply</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Flipkart Dot Pagination Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === idx
                    ? 'w-7 h-2 bg-gradient-to-r from-[#e5a962] to-[#c49b7c] shadow-md'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FLIPKART "DEALS OF THE DAY" / FLASH SALE SECTION WITH LIVE COUNTDOWN */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
        <div className="rounded-2xl bg-[#14110f]/90 border border-white/15 backdrop-blur-md p-4 sm:p-5 shadow-2xl space-y-4">
          
          {/* Flipkart Header: Title + Countdown Clock + View All */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black shadow-md">
                <Zap className="w-4 h-4 fill-black" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{language === 'sw' ? 'Ofa za Leo (Deals of the Day)' : 'Deals of the Day'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-600/30 border border-red-500/50 text-red-400 text-[10px] font-mono font-bold uppercase animate-pulse">
                    Live
                  </span>
                </h3>
              </div>
            </div>

            {/* Live Countdown Clock */}
            <div className="flex items-center gap-2 bg-black/60 border border-white/15 px-3 py-1.5 rounded-xl text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-[#e5a962]" />
              <span className="text-stone-300 text-[11px]">{language === 'sw' ? 'Inaisha baada ya:' : 'Ends in:'}</span>
              <div className="flex items-center gap-1 font-bold text-amber-300">
                <span className="px-1.5 py-0.5 rounded bg-white/10">{format2Digits(timeLeft.hours)}h</span>
                <span>:</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10">{format2Digits(timeLeft.minutes)}m</span>
                <span>:</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-red-400">{format2Digits(timeLeft.seconds)}s</span>
              </div>
            </div>

            {/* View All Button */}
            <Link
              to="/catalog"
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-xs font-bold text-[#e5a962] flex items-center gap-1.5 transition-all ml-auto sm:ml-0"
            >
              <span>{language === 'sw' ? 'Tazama Zote' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Flipkart Deal Cards Carousel / Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {dealsOfTheDay.map((deal, idx) => (
              <Link
                key={idx}
                to={deal.link}
                className="group flex flex-col justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#c49b7c]/60 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative w-full aspect-square rounded-lg bg-black/40 border border-white/10 p-2 flex items-center justify-center overflow-hidden mb-2.5">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-contain mix-blend-screen scale-100 group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold text-[9px] shadow-sm">
                    {deal.discount}
                  </span>
                </div>

                <div className="space-y-1 text-left">
                  <h4 className="text-xs font-semibold text-stone-200 line-clamp-1 group-hover:text-[#e5a962] transition-colors">
                    {deal.name}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-amber-300 font-mono">
                      {deal.price}
                    </span>
                    <span className="text-[10px] text-stone-500 line-through font-mono">
                      {deal.origPrice}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 font-mono">
                    {deal.tag}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FLIPKART TRUST & GUARANTEE STRIP */}
      {/* ========================================================================= */}
      <div className="w-full border-t border-white/10 bg-[#0e0c0a] py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-stone-300">
            <div className="flex items-center gap-2.5 justify-center sm:justify-start">
              <ShieldCheck className="w-4 h-4 text-[#e5a962] shrink-0" />
              <span>{language === 'sw' ? 'Karatasi 70 GSM Isiyopenyeza Wino' : 'Bleed-Proof 70 GSM Archival Paper'}</span>
            </div>
            <div className="flex items-center gap-2.5 justify-center sm:justify-start">
              <Award className="w-4 h-4 text-[#e5a962] shrink-0" />
              <span>{language === 'sw' ? 'Ushonaji wa Nyuzi (Smyth-Sewn)' : 'Smyth-Sewn Thread Durability'}</span>
            </div>
            <div className="flex items-center gap-2.5 justify-center sm:justify-start">
              <Truck className="w-4 h-4 text-[#e5a962] shrink-0" />
              <span>{language === 'sw' ? 'Mabasi Tanzania Nzima (Mikoani)' : 'Bus Freight to All 31 Regions'}</span>
            </div>
            <div className="flex items-center gap-2.5 justify-center sm:justify-start">
              <Boxes className="w-4 h-4 text-[#e5a962] shrink-0" />
              <span>{language === 'sw' ? 'Bei za Moja kwa Moja Kiwandani' : 'Direct Kariakoo Factory Pricing'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

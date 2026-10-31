import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Star,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Package,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import {
  IconNationwideBus,
  IconBleedProofPaper,
  IconLayFlatSpine,
  IconQualitySeal,
  IconWhatsAppCustom,
} from '@/presentation/common/components/CustomIcons';
import { triggerLuxuryConfetti } from '@/utils/confetti';

interface HeroProps {
  whatsappGreetingUrl?: string;
}

/**
 * Flagship PNG Books for the Hero Interactive Slider
 * Features authentic transparent cutout PNGs against a luxury stationery desk backdrop.
 */
interface SlideItem {
  id: string;
  tabLabel: string;
  badge: string;
  title: string;
  titleSw: string;
  spec: string;
  specSw: string;
  price: string;
  cartonPrice: string;
  cartonPriceSw: string;
  pngImage: string;
  link: string;
  category: string;
}

const SLIDE_ITEMS: SlideItem[] = [
  {
    id: 'cb-q4',
    tabLabel: 'Counter Q4',
    badge: 'ARCHIVAL FLAGSHIP · 384 PAGES',
    title: 'OMEGA Hardcover Counter Book Q4',
    titleSw: 'Counter Book Q4 (Kurasa 384)',
    spec: 'Smyth-Sewn 180° Flat · 1.8mm Stiff Board · 24 Pcs/Box',
    specSw: 'Mshono wa Uzi · Jalada Gumu 1.8mm · Pcs 24/Katoni',
    price: 'TSh 2,600',
    cartonPrice: 'TSh 60,000 / carton',
    cartonPriceSw: 'TSh 60,000 / katoni',
    pngImage: '/omega-hero-book.png',
    link: '/catalog?category=Counter+Books',
    category: 'Counter Books',
  },
  {
    id: 'cb-q3',
    tabLabel: 'Counter Q3',
    badge: 'MOST POPULAR · 288 PAGES',
    title: 'OMEGA Hardcover Counter Book Q3',
    titleSw: 'Counter Book Q3 (Kurasa 288)',
    spec: 'Smyth-Sewn Spine · 70 GSM Bleed-Proof · 36 Pcs/Box',
    specSw: 'Mshono wa Uzi · Hufunguka Tambarare · Pcs 36/Katoni',
    price: 'TSh 2,200',
    cartonPrice: 'TSh 57,000 / carton',
    cartonPriceSw: 'TSh 57,000 / katoni',
    pngImage: '/uploads/omega_omega_counter_book_q3__288_pag_1792584298091.png',
    link: '/catalog?category=Counter+Books',
    category: 'Counter Books',
  },
  {
    id: 'cb-podium',
    tabLabel: 'Master Edition',
    badge: 'HERITAGE CRAFT · SOWETO SIDO',
    title: 'OMEGA Premium Counter Book on Podium',
    titleSw: 'Counter Book Toleo Maalum la Kiwandani',
    spec: 'NECTA 8mm Ruling · TBS Quality Benchmark · 48 Pcs/Box',
    specSw: 'Mistari ya NECTA 8mm · Kiwango cha TBS · Pcs 48/Katoni',
    price: 'TSh 1,800',
    cartonPrice: 'TSh 56,000 / carton',
    cartonPriceSw: 'TSh 56,000 / katoni',
    pngImage: '/omega-products/omega-counter-book-podium.png',
    link: '/catalog?category=Counter+Books',
    category: 'Counter Books',
  },
  {
    id: 'ex-100',
    tabLabel: 'Exercise 100p',
    badge: 'ACADEMIC SYLLABUS · 100 PAGES',
    title: 'OMEGA Student Exercise Book 100 Pages',
    titleSw: 'Daftari la Mazoezi Kurasa 100 (Double Line)',
    spec: 'Double Line Ruling · Archival 70 GSM Bond · 144 Pcs/Box',
    specSw: 'Mistari Miwili (DL) · Karatasi Nzito 70 GSM · Pcs 144/Boksi',
    price: 'TSh 900',
    cartonPrice: 'TSh 42,000 / box',
    cartonPriceSw: 'TSh 42,000 / boksi',
    pngImage: '/uploads/omega_exercise_book_100_pages__doubl_1792587726371.png',
    link: '/catalog?category=Exercise+Books',
    category: 'Exercise Books',
  },
  {
    id: 'bahasha-a4',
    tabLabel: 'Kraft Bahasha',
    badge: 'TEAR-RESISTANT · SIZE A4',
    title: 'OMEGA Heavy Kraft Bahasha Envelopes A4',
    titleSw: 'Bahasha Nzito za Kraft A4 (Pakiti ya 50)',
    spec: '120 GSM Pure Kraft · Reinforced Seams · 250 Pcs/Box',
    specSw: 'Karatasi Nzito 120 GSM · Imara kwa Mitihani · Pcs 250/Boksi',
    price: 'TSh 350',
    cartonPrice: 'TSh 28,000 / box',
    cartonPriceSw: 'TSh 28,000 / boksi',
    pngImage: '/omega-products/bahasha-a4-catalog.png',
    link: '/catalog?category=Bahasha+%26+Envelopes',
    category: 'Bahasha & Envelopes',
  },
  {
    id: 'manila-folders',
    tabLabel: 'Manila Files',
    badge: 'OFFICE ARCHIVES · HEAVYWEIGHT',
    title: 'OMEGA Heavyweight Manila File Folders',
    titleSw: 'Mafaili Mazito ya Manila (Seti ya 100)',
    spec: 'Calendered Spring Board · 100 Pcs Bundle · Office Grade',
    specSw: 'Bodi Imara ya Manila · Seti ya Pcs 100 · Matumizi ya Ofisi',
    price: 'TSh 1,200',
    cartonPrice: 'TSh 35,000 / bundle',
    cartonPriceSw: 'TSh 35,000 / seti',
    pngImage: '/uploads/omega_manila_file_folders__bundle_of_1793135313970.png',
    link: '/catalog?category=Office+Files+%26+Folders',
    category: 'Office Files & Folders',
  },
  {
    id: 'petty-cash',
    tabLabel: 'Petty Cash',
    badge: 'FINANCIAL AUDIT · PAD OF 100',
    title: 'OMEGA Accounting Petty Cash Vouchers',
    titleSw: 'Voucher za Uhasibu Petty Cash (Kurasa 100)',
    spec: 'TRA Compliant Numbering · Perforated Counterfoils · 50 Pads/Box',
    specSw: 'Namba Sanifu za TRA · Zinararuka Kirahisi · Padi 50/Boksi',
    price: 'TSh 2,500',
    cartonPrice: 'TSh 45,000 / box',
    cartonPriceSw: 'TSh 45,000 / boksi',
    pngImage: '/uploads/omega_accounting_petty_cash_vouchers_1792587582257.png',
    link: '/catalog',
    category: 'Commercial Stationery',
  },
];

export const Hero: React.FC<HeroProps> = ({ whatsappGreetingUrl }) => {
  const { language, storeConfig } = useStore();

  const cleanWhatsappDigits = storeConfig?.whatsappNumber
    ? storeConfig.whatsappNumber.replace(/\D/g, '')
    : '255746268391';

  const defaultWhatsappUrl =
    whatsappGreetingUrl ||
    `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
      language === 'sw'
        ? 'Habari OMEGA Stationery, ninahitaji kuagiza madaftari kwa bei ya jumla kiwandani.'
        : 'Hello OMEGA Stationery, I would like to place an order and inquire about factory wholesale pricing.'
    )}`;

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = SLIDE_ITEMS.length;

  const nextSlide = () => {
    setSlideDirection('right');
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setSlideDirection('left');
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (idx: number) => {
    setSlideDirection(idx > currentSlide ? 'right' : 'left');
    setCurrentSlide(idx);
  };

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setSlideDirection('right');
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  const activeItem = SLIDE_ITEMS[currentSlide];

  return (
    <section className="w-full bg-[#F9F8F6] text-[#111113] pt-6 sm:pt-10 pb-10 sm:pb-14 border-b border-[#E7E5E0]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* ================= 1. SPLIT HERO: LEFT TEXT + RIGHT BG & PNG BOOKS SLIDER ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: BRAND PROMISE & ACTIONS (7 cols) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            
            {/* Origin Hallmark Badge (DESIGN.md: Charcoal Ink & Vellum) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111113] text-[#FFFFFF] text-[11px] font-mono font-semibold shadow-2xs tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#8C7355]" />
              <span>SOWETO SIDO INDUSTRIAL ESTATE, MBEYA · EST. 1998</span>
            </div>

            {/* Grand Headline (Bodoni Moda / Editorial serif contrast) */}
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-semibold text-[#111113] leading-[1.12] tracking-tight">
              {language === 'sw' ? (
                <>
                  Kiwango Bora cha Tanzania Katika{' '}
                  <span className="text-[#8C7355] block mt-1.5">
                    Madaftari ya Jalada Gumu &amp; Shule
                  </span>
                </>
              ) : (
                <>
                  Tanzania’s Gold Standard in{' '}
                  <span className="text-[#8C7355] block mt-1.5">
                    Archival Notebooks &amp; Stationery
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#6E6B66] leading-relaxed max-w-2xl font-normal">
              {language === 'sw'
                ? 'Madaftari yaliyoshonwa kwa nyuzi (Smyth-sewn) yasiyochana wala kudondosha kurasa, karatasi nzito ya 70 GSM isiyopenyeza wino, na bahasha thabiti za kraft. Bei rasmi za jumla kiwandani mikoa yote 31.'
                : 'Meticulously crafted Smyth thread-sewn counter books, 70 GSM bleed-proof student exercise editions, and tear-resistant kraft envelopes. Direct factory wholesale carton distribution nationwide.'}
            </p>

            {/* Feature Highlight Chips (DESIGN.md: 6px radius, hairline border) */}
            <div className="flex flex-wrap gap-2.5 pt-1 font-mono text-xs">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#FFFFFF] text-[#111113] border border-[#E7E5E0] shadow-2xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355]" />
                {language === 'sw' ? 'Mshono wa Uzi 180°' : 'Smyth-Sewn 180° Flat'}
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#FFFFFF] text-[#111113] border border-[#E7E5E0] shadow-2xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355]" />
                {language === 'sw' ? 'Karatasi 70 GSM Bond' : '70 GSM Bleed-Proof'}
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#FFFFFF] text-[#111113] border border-[#E7E5E0] shadow-2xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355]" />
                {language === 'sw' ? 'Mabasi Mikoa Yote 31' : '31 Regions Bus Parcel'}
              </span>
            </div>

            {/* High-Converting Action Buttons (DESIGN.md: Primary #111113, 6px radius) */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/catalog"
                className="px-6 py-3 rounded-md bg-[#111113] hover:bg-[#262524] text-[#FFFFFF] font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2 shadow-2xs transition-all active:scale-97 cursor-pointer"
              >
                <span>{language === 'sw' ? 'TAZAMA KATALOGI NZIMA' : 'EXPLORE CATALOGUE'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={defaultWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-md bg-[#FFFFFF] hover:bg-[#F9F8F6] text-[#111113] border border-[#E7E5E0] font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2.5 transition-all active:scale-97 shadow-2xs cursor-pointer"
              >
                <IconWhatsAppCustom className="w-4 h-4 text-[#25D366]" />
                <span>{language === 'sw' ? 'ODA WHATSAPP KIWANDANI' : 'WHATSAPP PROFORMA'}</span>
              </a>
            </div>

            {/* Social Proof Trust Bar */}
            <div className="pt-1 flex items-center gap-3 text-xs text-[#6E6B66]">
              <div className="flex items-center text-[#8C7355]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#8C7355] text-[#8C7355]" />
                ))}
              </div>
              <span className="font-bold text-[#111113]">4.9 / 5.0</span>
              <span>·</span>
              <span>
                {language === 'sw'
                  ? 'Zaidi ya vitabu 500,000+ husambazwa kila mwaka kwa shule na maduka 1,200+'
                  : '500,000+ books supplied annually across 1,200+ partner schools & stockists'}
              </span>
            </div>

          </div>

          {/* RIGHT COLUMN: RICH BACKGROUND IMAGE + PNG BOOKS SLIDER (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <div
              className="relative w-full rounded-lg overflow-hidden border border-[#E7E5E0] shadow-md bg-cover bg-center transition-all"
              style={{
                backgroundImage: 'url(/hero-luxury-bg.jpg)',
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Subtle Warm Overlay for Depth & High Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111113]/90 via-[#111113]/40 to-transparent pointer-events-none" />

              {/* Top Navigation Pill Tabs */}
              <div className="relative z-10 p-3 sm:p-4 pb-0">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {SLIDE_ITEMS.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      className={`px-2.5 py-1 rounded-[4px] text-[10px] sm:text-xs font-mono font-medium tracking-wide uppercase whitespace-nowrap transition-all cursor-pointer backdrop-blur-sm ${
                        currentSlide === idx
                          ? 'bg-[#FFFFFF] text-[#111113] shadow-xs font-bold'
                          : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white'
                      }`}
                    >
                      {item.tabLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Central Animated PNG Book Slider Area */}
              <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center justify-center min-h-[310px] sm:min-h-[340px]">
                
                {/* Floating Specs Pill */}
                <div className="self-start mb-2 px-2.5 py-1 rounded-[4px] bg-[#FFFFFF]/90 backdrop-blur-md text-[#111113] border border-white/40 text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs">
                  <span className="text-[#DC2626] font-black mr-1">●</span>
                  {activeItem.badge}
                </div>

                {/* Animated PNG Book Display Stage */}
                <div className="relative w-full h-52 sm:h-60 flex items-center justify-center my-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeItem.id}
                      initial={{
                        opacity: 0,
                        x: slideDirection === 'right' ? 40 : -40,
                        scale: 0.94,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        x: slideDirection === 'right' ? -40 : 40,
                        scale: 0.94,
                      }}
                      transition={{
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <motion.img
                        src={activeItem.pngImage}
                        alt={activeItem.title}
                        animate={{
                          y: [0, -6, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="max-h-full max-w-[85%] object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.55)] cursor-pointer"
                        onClick={nextSlide}
                        title="Click to view next book"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Previous / Next Arrow Controls */}
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous book"
                    className="absolute left-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition-all border border-white/20 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next book"
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm transition-all border border-white/20 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Dot Pagination Indicator */}
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  {SLIDE_ITEMS.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentSlide === idx
                          ? 'w-6 bg-white shadow-xs'
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer: Product Metadata & Order CTAs */}
              <div className="relative z-10 bg-[#FFFFFF] p-4 sm:p-5 border-t border-[#E7E5E0] space-y-3 text-left">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading font-semibold text-sm sm:text-base text-[#111113] truncate">
                      {language === 'sw' ? activeItem.titleSw : activeItem.title}
                    </h3>
                    <p className="text-xs text-[#6E6B66] font-mono mt-0.5 truncate">
                      {language === 'sw' ? activeItem.specSw : activeItem.spec}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-base sm:text-lg text-[#111113] block leading-none">
                      {activeItem.price}
                    </span>
                    <span className="text-[10px] text-[#8C7355] font-mono font-semibold block mt-1">
                      {language === 'sw' ? activeItem.cartonPriceSw : activeItem.cartonPrice}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2.5">
                  <Link
                    to={activeItem.link}
                    onClick={() => triggerLuxuryConfetti()}
                    className="flex-1 py-2.5 px-3 rounded-md bg-[#111113] hover:bg-[#262524] text-white text-xs font-sans font-semibold uppercase tracking-wider text-center transition-all shadow-2xs active:scale-97 flex items-center justify-center gap-1.5"
                  >
                    <Package className="w-3.5 h-3.5 text-[#C8A27A]" />
                    <span>{language === 'sw' ? 'Agiza B2B Katoni' : 'Order Bulk Cartons'}</span>
                  </Link>
                  <Link
                    to="/wholesale"
                    className="py-2.5 px-3.5 rounded-md bg-[#F9F8F6] hover:bg-[#F2EFEB] text-[#111113] border border-[#E7E5E0] text-xs font-sans font-semibold uppercase tracking-wider text-center transition-colors"
                  >
                    {language === 'sw' ? 'Bei za Jumla' : 'Wholesale Tiers'}
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ================= 2. FOUR LUXURY MANUFACTURING PILLARS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {[
            {
              Icon: IconNationwideBus,
              title: language === 'sw' ? 'Mabasi Mikoa Yote 31' : '31 Regions Bus Parcel',
              desc: language === 'sw' ? 'Kutumiwa siku hiyo hiyo ya oda' : 'Same-day waybill handoff',
            },
            {
              Icon: IconQualitySeal,
              title: language === 'sw' ? 'Karatasi Nzito 70 GSM' : '70 GSM Bleed-Proof',
              desc: language === 'sw' ? 'Haivujishi wino wa kalamu' : 'Zero ink bleed or ghosting',
            },
            {
              Icon: IconLayFlatSpine,
              title: language === 'sw' ? 'Mshono wa Uzi 180°' : 'Smyth-Sewn 180°',
              desc: language === 'sw' ? 'Hujifungua tambarare kabisa' : 'Thread stitched, opens flat',
            },
            {
              Icon: ShieldCheck,
              title: language === 'sw' ? 'Stakabadhi za TRA EFD' : 'TRA EFD Fiscal Invoices',
              desc: language === 'sw' ? 'Ankara rasmi kwa shule na ofisi' : 'Official institutional compliance',
            },
          ].map((pillar, idx) => {
            const Icon = pillar.Icon;
            return (
              <div
                key={idx}
                className="p-3.5 sm:p-4 bg-[#FFFFFF] rounded-lg transition-all flex items-center gap-3 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.03)] hover:shadow-xs group text-left h-full border border-[#E7E5E0]"
              >
                <div className="w-10 h-10 rounded-md bg-[#F9F8F6] text-[#8C7355] flex items-center justify-center shrink-0 border border-[#E7E5E0]">
                  <Icon className="w-5 h-5 text-[#8C7355]" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading font-semibold text-xs sm:text-sm text-[#111113] truncate">
                    {pillar.title}
                  </h4>
                  <p className="text-[11px] text-[#6E6B66] truncate mt-0.5">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Hero;

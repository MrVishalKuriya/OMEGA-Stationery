import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Star,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  Phone,
  MessageCircle,
  Truck,
  ShieldCheck,
  CreditCard,
  Building2,
  FileText,
  BadgePercent,
  Clock,
  Sparkles,
  Package,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { CatalogSkeletonGrid } from '@/components/ProductCardSkeleton';
import { Hero } from '../components/Hero';
import { SEOHead } from '@/components/SEOHead';
import { TRANSLATIONS } from '@/data/translations';
import { formatPrice } from '@/types/store';
import {
  IconLightningDeal,
  IconWhatsAppCustom,
  IconCounterBook,
  IconExerciseBook,
  IconKraftBahasha,
  IconNationwideBus,
  IconBleedProofPaper,
  IconLayFlatSpine,
  IconQualitySeal,
} from '@/presentation/common/components/CustomIcons';
import { triggerLuxuryConfetti } from '@/utils/confetti';

/**
 * HomePage — Unified Central UI/UX Architecture
 * Built strictly according to public/uploads/DESIGN.md
 * - Canvas: #F9F8F6 (Soft Paper Base)
 * - Pure Paper Surface: #FFFFFF
 * - Charcoal Ink: #111113
 * - Wax Seal Vermilion: #DC2626
 * - Raw Leather Ochre: #8C7355
 * - Hairline Border: #E7E5E0
 * - Centered 1360px container
 * - Radii: Cards 8px (rounded-lg), Controls 6px (rounded-md)
 */
export const HomePage: React.FC = () => {
  const { products, storeConfig, language, isCatalogLoading } = useStore();
  const t = (TRANSLATIONS[language] || TRANSLATIONS.en) as any;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'counter' | 'exercise' | 'bahasha' | 'wholesale'>('all');
  const [isTabLoading, setIsTabLoading] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'counter' | 'exercise' | 'bahasha'>('all');

  // Wholesale calculator state
  const [calcQuantity, setCalcQuantity] = useState<number>(5);
  const [calcBookType, setCalcBookType] = useState<'q2' | 'q3' | 'q4'>('q2');

  const currency = storeConfig.currencySymbol || 'TSh';

  // Dynamic products lookup with strict mutual exclusion to avoid duplicate references
  const q2Prod = useMemo(() => products.find((p) => p.sku === 'OMG-CB-Q2' || p.id === 'prod-omega-cb-q2' || (p.name.includes('Q2') && p.category === 'Counter Books')), [products]);
  const q3Prod = useMemo(() => products.find((p) => p.sku === 'OMG-CB-Q3' || p.id === 'prod-omega-cb-q3' || (p.name.includes('Q3') && p.category === 'Counter Books')), [products]);
  const q4Prod = useMemo(() => products.find((p) => p.sku === 'OMG-CB-Q4' || p.id === 'prod-omega-cb-q4' || (p.name.includes('Q4') && p.category === 'Counter Books')), [products]);
  const ex200Prod = useMemo(() => products.find((p) => (p.sku === 'OMG-EX-200SL' || p.id === 'prod-omega-ex-200sl' || (p.category === 'Exercise Books' && p.name.includes('200'))) && p.id !== 'prod-omega-stiff-200'), [products]);
  const ex100Prod = useMemo(() => products.find((p) => (p.sku === 'OMG-EX-100SL' || p.id === 'prod-omega-ex-100sl' || (p.category === 'Exercise Books' && p.name.includes('100'))) && p.id !== 'prod-omega-stiff-200'), [products]);
  const ex80Prod = useMemo(() => products.find((p) => p.sku === 'OMG-EX-80' || p.id === 'prod-omega-ex-80' || (p.category === 'Exercise Books' && p.name.includes('80'))), [products]);
  const bahashaProd = useMemo(() => products.find((p) => p.sku === 'OMG-BAHASHA-A4' || p.id === 'prod-omega-bahasha-a4' || p.name.includes('Bahasha')), [products]);
  const stiffProd = useMemo(() => products.find((p) => p.id === 'prod-omega-stiff-200' || p.name.includes('Stiff Cover')), [products]);

  // Filter products cleanly without clutter (Hick's Law)
  const filteredProducts = useMemo(() => {
    let result: typeof products = [];
    if (activeTab === 'counter') result = products.filter((p) => p.category === 'Counter Books');
    else if (activeTab === 'exercise') result = products.filter((p) => p.category === 'Exercise Books');
    else if (activeTab === 'bahasha') result = products.filter((p) => p.category === 'Bahasha & Envelopes');
    else if (activeTab === 'wholesale') result = products.filter((p) => Boolean(p.wholesalePrice));
    else result = products.slice(0, 8);

    // Deduplicate items by ID
    const seen = new Set<string>();
    return result.filter((p) => {
      if (!p?.id || seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [products, activeTab]);

  const cleanWhatsappDigits = storeConfig.whatsappNumber
    ? storeConfig.whatsappNumber.replace(/\D/g, '')
    : '255746268391';

  const whatsappGreetingUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    language === 'sw'
      ? 'Habari OMEGA Stationery, ninahitaji kuulizia kuhusu bei za jumla za katalogi.'
      : 'Hello OMEGA Stationery, I would like to inquire about wholesale catalog pricing.'
  )}`;

  // Deals of the day - Guaranteed distinct keys and target product navigation
  const dealsOfTheDay = useMemo(() => [
    {
      id: 'deal-q2-192p',
      productId: q2Prod?.id || 'prod-omega-cb-q2',
      name: language === 'sw' ? 'Counter Book Q2 (Kurasa 192)' : 'Counter Book Q2 (192p)',
      spec: language === 'sw' ? 'Mshono wa Uzi · 48 pcs/katoni' : 'Smyth-Sewn · 48 pcs/box',
      price: q2Prod?.price || 1500,
      mrp: 1800,
      discount: language === 'sw' ? 'PUNGUZO 17%' : '17% OFF',
      rating: 4.9,
      image: '/omega-products/counter-book-q2-catalog.jpeg',
      carton: language === 'sw' ? 'TSh 56,000 / katoni' : 'TSh 56,000 / ctn',
    },
    {
      id: 'deal-ex-200p',
      productId: ex200Prod?.id || 'prod-omega-ex-200sl',
      name: language === 'sw' ? 'Daftari Kurasa 200 (Wanafunzi)' : '200p Exercise Book',
      spec: language === 'sw' ? '70 GSM Bond · 36 pcs/katoni' : '70 GSM Bond · 36 pcs/box',
      price: ex200Prod?.price || 1600,
      mrp: 1950,
      discount: language === 'sw' ? 'PUNGUZO 18%' : '18% OFF',
      rating: 4.8,
      image: '/omega-products/exercise-book-200p-sl-catalog.jpeg',
      carton: language === 'sw' ? 'TSh 48,000 / katoni' : 'TSh 48,000 / ctn',
    },
    {
      id: 'deal-q3-288p',
      productId: q3Prod?.id || 'prod-omega-cb-q3',
      name: language === 'sw' ? 'Counter Book Q3 (Kurasa 288)' : 'Counter Book Q3 (288p)',
      spec: language === 'sw' ? 'Jalada Gumu · 36 pcs/katoni' : 'Hardcover · 36 pcs/box',
      price: q3Prod?.price || 2000,
      mrp: 2400,
      discount: language === 'sw' ? 'PUNGUZO 16%' : '16% OFF',
      rating: 4.9,
      image: '/omega-products/counter-book-q3-catalog.jpeg',
      carton: language === 'sw' ? 'TSh 57,000 / katoni' : 'TSh 57,000 / ctn',
    },
    {
      id: 'deal-stiff-200p',
      productId: stiffProd?.id || 'prod-omega-stiff-200',
      name: language === 'sw' ? 'Stiff Cover Kurasa 200' : 'Stiff Cover 200p Ledger',
      spec: language === 'sw' ? 'Poly Spine Imara · 36 pcs/katoni' : 'Reinforced Poly Spine · 36 pcs/box',
      price: stiffProd?.price || 1700,
      mrp: 2000,
      discount: language === 'sw' ? 'PUNGUZO 15%' : '15% OFF',
      rating: 4.8,
      image: '/omega-products/stiff-cover-200-catalog.jpeg',
      carton: language === 'sw' ? 'TSh 52,000 / katoni' : 'TSh 52,000 / ctn',
    },
    {
      id: 'deal-q4-384p',
      productId: q4Prod?.id || 'prod-omega-cb-q4',
      name: language === 'sw' ? 'Counter Book Q4 (Kurasa 384)' : 'Counter Book Q4 (384p)',
      spec: language === 'sw' ? 'Mshono wa Uzi · 24 pcs/katoni' : 'Smyth-Sewn · 24 pcs/box',
      price: q4Prod?.price || 2600,
      mrp: 3000,
      discount: language === 'sw' ? 'PUNGUZO 13%' : '13% OFF',
      rating: 5.0,
      image: '/omega-products/counter-book-q4-catalog.jpeg',
      carton: language === 'sw' ? 'TSh 60,000 / katoni' : 'TSh 60,000 / ctn',
    },
    {
      id: 'deal-bahasha-a4',
      productId: bahashaProd?.id || 'prod-omega-bahasha-a4',
      name: language === 'sw' ? 'Kraft Bahasha A4 Nzito' : 'A4 Heavy Kraft Bahasha',
      spec: language === 'sw' ? '120 GSM Kraft · 100 pcs/pakiti' : '120 GSM Tear-Proof · 100 pcs/pk',
      price: bahashaProd?.price || 350,
      mrp: 450,
      discount: language === 'sw' ? 'PUNGUZO 22%' : '22% OFF',
      rating: 4.9,
      image: '/omega-products/bahasha-a4-catalog.png',
      carton: language === 'sw' ? 'TSh 28,000 / boksi' : 'TSh 28,000 / box',
    },
  ], [language, q2Prod, q3Prod, q4Prod, ex200Prod, stiffProd, bahashaProd]);

  // Calculator computation
  const calcPricing = {
    q2: { price: 56000, units: 48, name: 'Counter Book Q2' },
    q3: { price: 57000, units: 36, name: 'Counter Book Q3' },
    q4: { price: 60000, units: 24, name: 'Counter Book Q4' },
  };
  const activeBook = calcPricing[calcBookType];
  const calcTotal = activeBook.price * calcQuantity;
  const totalUnits = activeBook.units * calcQuantity;
  const unitPrice = activeBook.price / activeBook.units;

  // 4 Primary B2B Category Cards
  const primaryB2BCategories = [
    {
      title: 'Counter Books (Q1 – Q4)',
      titleSw: 'Counter Books (Q1 – Q4)',
      desc: 'Smyth-sewn thread binding, opens 180° flat. 192p to 384p archival accounting & ledgers.',
      descSw: 'Mshono wa nyuzi imara, hujifungua tambarare 180°. Kurasa 192 hadi 384 za uhasibu na ofisi.',
      specs: '1.8mm Hardcover · Smyth-Sewn · 24–48 pcs/box',
      price: 'From TSh 1,500 / book',
      priceSw: 'Kuanzia TSh 1,500',
      image: '/omega-products/counter-book-q4-catalog.jpeg',
      link: '/catalog?category=Counter+Books',
      badge: 'ARCHIVAL GRADE',
    },
    {
      title: 'Student Exercise Books',
      titleSw: 'Madaftari ya Mazoezi ya Wanafunzi',
      desc: '70 GSM Arctic White bleed-proof paper. Single line, double line, and square mathematics rulings.',
      descSw: 'Karatasi nyeupe ya 70 GSM isiyovujisha wino. Mistari moja, miwili na miraba ya hisabati.',
      specs: '70 GSM Bond · NECTA Uniform Ruling · 36–96 pcs/box',
      price: 'From TSh 600 / book',
      priceSw: 'Kuanzia TSh 600',
      image: '/omega-products/exercise-book-200p-sl-catalog.jpeg',
      link: '/catalog?category=Exercise+Books',
      badge: 'NECTA STANDARD',
    },
    {
      title: 'Kraft Bahasha & Envelopes',
      titleSw: 'Bahasha Nzito za Kraft',
      desc: 'Heavy-duty 120 GSM reinforced kraft envelopes. Perfect for examination papers, official transit & records.',
      descSw: 'Karatasi nzito ya kraft 120 GSM isiyochanyika. Imara kwa mitihani, hati rasmi na posta.',
      specs: '120 GSM Heavy Kraft · A4 / A3 · 100 pcs/pack',
      price: 'From TSh 350 / pc',
      priceSw: 'Kuanzia TSh 350',
      image: '/omega-products/bahasha-a4-catalog.png',
      link: '/catalog?category=Bahasha+%26+Envelopes',
      badge: 'TEAR-RESISTANT',
    },
    {
      title: 'Stiff Cover Ledgers & Registers',
      titleSw: 'Stiff Cover & Rejesta za Ofisi',
      desc: 'Geometric poly spine cover engineered for high-traffic office logging, inventory & attendance rosters.',
      descSw: 'Jalada imara la plastiki lililoundwa kwa matumizi endelevu ya ofisi, daftari za mahudhurio na ghala.',
      specs: 'Heavy Poly Cover · 200p · 36 pcs/box',
      price: 'From TSh 1,700 / book',
      priceSw: 'Kuanzia TSh 1,700',
      image: '/omega-products/stiff-cover-200-catalog.jpeg',
      link: '/catalog?category=Counter+Books',
      badge: 'EXECUTIVE LOGS',
    },
  ];

  return (
    <div className="w-full bg-paper-base min-h-screen text-charcoal-ink pb-16">
      <SEOHead
        title={
          language === 'sw'
            ? 'OMEGA Stationery Tanzania | Kiwanda cha Madaftari & Bei za Jumla'
            : 'OMEGA Stationery Tanzania | Manufacturer & Factory Wholesale Catalog'
        }
        description={
          language === 'sw'
            ? 'Kiwango cha juu cha Tanzania katika Counter Books (Q1–Q4), Madaftari ya Mazoezi, na Bahasha Nzito za Kraft. Bei ya jumla ya kiwandani mikoa yote 31.'
            : "Tanzania's benchmark manufacturer of Counter Books (Q1-Q4), Exercise Books, Kraft Bahasha, and Office Files. Direct factory wholesale carton distribution across 31 regions."
        }
      />

      {/* 1. HERO SECTION (Flush edge-to-edge) */}
      <Hero whatsappGreetingUrl={whatsappGreetingUrl} />

      {/* 2. FULL-WIDTH CRIMSON RED CALLOUT BANNER WITH BOTTOM-LEFT WHITE UPWARD NOTCH & CHEVRON (Exact match to reference image) */}
      <section className="relative w-full bg-[#D62828] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1180px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="text-left space-y-2 max-w-2xl">
            <h2 className="font-heading text-xl sm:text-2xl md:text-[26px] font-extrabold uppercase tracking-wide text-white">
              {language === 'sw' ? 'KIWANDA CHA MADAFTARI OMEGA TANZANIA' : 'OMEGA STATIONERY & BOOKS TANZANIA'}
            </h2>
            <p className="text-xs sm:text-[13px] text-white leading-relaxed font-normal">
              {language === 'sw'
                ? 'Uzalishaji rasmi wa kiwandani Soweto SIDO Mbeya kwa shule, vyuo na maduka ya jumla. Madaftari yaliyoshonwa kwa nyuzi na ankara rasmi za TRA EFD.'
                : 'Manufactured at Soweto SIDO Industrial Estate in Mbeya. Supplying Smyth thread-sewn counter books, 70 GSM exercise books, and kraft envelopes across all 31 regions.'}
            </p>
          </div>

          <div className="flex items-center gap-3.5 shrink-0">
            <Link
              to="/catalog"
              className="px-7 py-3 rounded-[2px] bg-white text-charcoal-ink hover:bg-neutral-100 font-sans font-bold text-[11px] uppercase tracking-wider shadow-xs transition-all cursor-pointer"
            >
              <span>{language === 'sw' ? 'NUNUA SASA' : 'BUY NOW'}</span>
            </Link>
            <Link
              to="/wholesale"
              className="px-7 py-3 rounded-[2px] bg-transparent text-white border border-white hover:bg-white hover:text-charcoal-ink font-sans font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>{language === 'sw' ? 'JIFUNZE ZAIDI' : 'LEARN MORE'}</span>
            </Link>
          </div>
        </div>

        {/* White Upward-Pointing Triangle Notch with Small Grey Chevron at Bottom-Left (Exact match to reference image) */}
        <div className="max-w-[1180px] mx-auto relative">
          <div className="absolute -bottom-12 sm:-bottom-16 left-6 sm:left-10 w-0 h-0 border-l-[28px] border-l-transparent border-r-[28px] border-r-transparent border-b-[20px] border-b-white z-20 pointer-events-none flex items-end justify-center">
            <span className="text-charcoal-ink text-[10px] leading-none translate-y-[18px] font-sans">⌄</span>
          </div>
        </div>
      </section>

      {/* 3. "OUR SERVICES" 2-ROW ASYMMETRIC HAIRLINE GRID ON PURE WHITE (Exact match to reference image) */}
      <section className="w-full bg-[#FFFFFF] py-16 sm:py-24">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ROW 1: Left 4 cols ("Our Services" + text + wavy line) + Right 8 cols (2 bordered icon boxes) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Col 1 (4 cols): Unbordered Editorial Intro */}
            <div className="lg:col-span-4 pr-0 lg:pr-10 pb-8 lg:pb-0 flex flex-col justify-center text-left space-y-4">
              <h2 className="font-heading text-2xl sm:text-[28px] font-bold text-charcoal-ink tracking-tight">
                {language === 'sw' ? 'Huduma na Bidhaa' : 'Our Services'}
              </h2>
              <p className="text-xs sm:text-[13px] text-charcoal-ink leading-relaxed">
                {language === 'sw'
                  ? 'Kila daftari, jalada na bahasha hutengenezwa kwa umakini wa hali ya juu kukidhi mitaala ya NECTA na kumbukumbu za ofisi.'
                  : 'We manufacture archival-grade hardcover counter books, NECTA syllabus student exercise books, and heavy kraft envelopes for institutions.'}
              </p>
              <div className="pt-1">
                <svg className="w-16 h-3 text-charcoal-ink" viewBox="0 0 60 8" fill="none">
                  <path d="M0 4 Q 5 0, 10 4 T 20 4 T 30 4 T 40 4 T 50 4 T 60 4" stroke="currentColor" strokeWidth="1.8" fill="none" />
                </svg>
              </div>
            </div>

            {/* Col 2 (4 cols): Bordered Box 1 */}
            <Link
              to="/catalog?category=Counter+Books"
              className="lg:col-span-4 p-10 sm:p-12 border border-[#E7E5E0] hover:border-[#DC2626] hover:shadow-sm transition-all flex flex-col items-center justify-center text-center space-y-4 group bg-white"
            >
              <div className="w-12 h-12 flex items-center justify-center text-charcoal-ink group-hover:text-[#DC2626] transition-colors">
                <IconCounterBook className="w-9 h-9 stroke-[1.2]" />
              </div>
              <h3 className="font-sans font-semibold text-xs sm:text-[13px] text-charcoal-ink group-hover:text-[#DC2626] transition-colors">
                {language === 'sw' ? 'Counter Books (Q1–Q4)' : 'Counter Books (Q1–Q4)'}
              </h3>
            </Link>

            {/* Col 3 (4 cols): Bordered Box 2 */}
            <Link
              to="/catalog?category=Exercise+Books"
              className="lg:col-span-4 p-10 sm:p-12 border border-[#E7E5E0] lg:border-l-0 hover:border-[#DC2626] hover:shadow-sm transition-all flex flex-col items-center justify-center text-center space-y-4 group bg-white"
            >
              <div className="w-12 h-12 flex items-center justify-center text-charcoal-ink group-hover:text-[#DC2626] transition-colors">
                <IconExerciseBook className="w-9 h-9 stroke-[1.2]" />
              </div>
              <h3 className="font-sans font-semibold text-xs sm:text-[13px] text-charcoal-ink group-hover:text-[#DC2626] transition-colors">
                {language === 'sw' ? 'Madaftari ya Shule' : 'School Exercise Books'}
              </h3>
            </Link>

          </div>

          {/* ROW 2: 4 Equal Bordered Boxes spanning all 12 columns directly touching Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:-mt-[1px]">
            {[
              {
                title: language === 'sw' ? 'Mshono wa Uzi 180°' : 'Smyth-Sewn Binding',
                icon: IconLayFlatSpine,
                link: '/about',
              },
              {
                title: language === 'sw' ? 'Karatasi Nzito 70 GSM' : '70 GSM Bleed-Proof Paper',
                icon: IconBleedProofPaper,
                link: '/catalog',
              },
              {
                title: language === 'sw' ? 'Bahasha Nzito za Kraft' : 'Heavy Kraft Bahasha',
                icon: IconKraftBahasha,
                link: '/catalog?category=Bahasha+%26+Envelopes',
              },
              {
                title: language === 'sw' ? 'Mabasi Mikoa Yote 31' : '31 Regions Bus Dispatch',
                icon: IconNationwideBus,
                link: '/shipping-guide',
              },
            ].map((service, idx) => {
              const Icon = service.icon;
              return (
                <Link
                  key={idx}
                  to={service.link}
                  className={`p-10 sm:p-12 border border-[#E7E5E0] ${
                    idx > 0 ? 'lg:border-l-0' : ''
                  } hover:border-[#DC2626] hover:shadow-sm transition-all flex flex-col items-center justify-center text-center space-y-4 group bg-white`}
                >
                  <div className="w-12 h-12 flex items-center justify-center text-charcoal-ink group-hover:text-[#DC2626] transition-colors">
                    <Icon className="w-9 h-9 stroke-[1.2]" />
                  </div>
                  <h3 className="font-sans font-semibold text-xs sm:text-[13px] text-charcoal-ink group-hover:text-[#DC2626] transition-colors">
                    {service.title}
                  </h3>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. ABOUT OMEGA EDITORIAL ROW ON PAPER-BASE #F9F8F6 (WCAG AAA charcoal-ink headings & body text) */}
      <section className="w-full bg-paper-base py-16 sm:py-24">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start text-left">
            
            {/* Left Column (5 cols): Small charcoal label + Big Bold 3-line Headline */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-charcoal-ink font-bold block">
                {language === 'sw' ? 'KUHUSU OMEGA' : 'ABOUT OMEGA'}
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-[34px] font-bold text-charcoal-ink leading-[1.2] tracking-tight">
                {language === 'sw'
                  ? 'Uzalishaji thabiti wa kiwandani unazifanya shule na biashara kuwa zenye tija na faida'
                  : 'Precision manufacturing makes classic schools and businesses effective and profitable'}
              </h2>
            </div>

            {/* Right Column (7 cols): Two clean editorial paragraphs in charcoal-ink */}
            <div className="lg:col-span-7 space-y-5 text-xs sm:text-[13px] text-charcoal-ink leading-[1.8]">
              <p>
                {language === 'sw'
                  ? 'Tangu kuanzishwa kwetu mwaka 1998 katika eneo la viwanda la Soweto SIDO jijini Mbeya, OMEGA imebadilisha kabisa ubora wa madaftari ya shule na vitabu vya kumbukumbu za ofisi nchini Tanzania. Mshono wetu wa nyuzi (Smyth-sewn) pamoja na karatasi nzito ya 70 GSM vinahakikisha kurasa hazichomoki wala kuvujisha wino.'
                  : 'Manufacturing notebooks and commercial stationery since 1998 at Soweto SIDO Industrial Estate in Mbeya has transformed how Tanzanian schools, universities, and bookstores procure reliable paper goods. Every Counter Book (Q1–Q4) is Smyth thread-sewn to open 180° flat without shedding pages.'}
              </p>
              <p>
                {language === 'sw'
                  ? 'Kuu kati ya mifumo yetu ya usambazaji ni pamoja na utoaji wa ankara rasmi za kodi za TRA EFD, punguzo kubwa la bei ya jumla kwa katoni, na usafirishaji wa siku hiyo hiyo kupitia vituo vya mabasi ya mikoani kufika mikoa yote 31 ya Tanzania.'
                  : 'Chief among our institutional advantages are automated volume carton discounts, official TRA EFD fiscal tax invoicing, NECTA-compliant 8mm ruling, and same-day bus parcel waybill dispatch across all 31 regions of Tanzania.'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FEATURED PROJECT / FEATURED PRODUCT ON FACETED GEOMETRIC RED (Exact match to reference image) */}
      <section className="relative w-full py-16 sm:py-24 bg-[#D62828] overflow-hidden text-center text-white">
        {/* Geometric Angled Facets Matching Reference Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E53935] via-[#D32F2F] to-[#B71C1C]" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rotate-45 transform pointer-events-none" />
        <div className="absolute top-1/3 left-8 w-28 h-28 bg-white/5 rotate-45 transform pointer-events-none" />
        <div className="absolute -bottom-24 -right-16 w-96 h-96 bg-black/10 rotate-45 transform pointer-events-none" />
        <div className="absolute top-10 right-12 w-48 h-48 bg-black/10 rotate-45 transform pointer-events-none" />

        <div className="relative z-10 max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Centered Header + Wavy White Line */}
          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {language === 'sw' ? 'Bidhaa Maalum ya Kiwandani' : 'Featured Product'}
            </h2>
            <p className="text-xs sm:text-[13px] text-white/90 leading-relaxed font-normal">
              {language === 'sw'
                ? 'Vitabu vya Counter Books Q1–Q4 na madaftari ya mazoezi yenye mshono wa nyuzi na karatasi ya 70 GSM.'
                : 'Smyth thread-sewn Hardcover Counter Books (Q1–Q4) and 70 GSM Student Exercise Books built for endurance.'}
            </p>
            <div className="flex justify-center pt-1">
              <svg className="w-16 h-3 text-white" viewBox="0 0 60 8" fill="none">
                <path d="M0 4 Q 5 0, 10 4 T 20 4 T 30 4 T 40 4 T 50 4 T 60 4" stroke="currentColor" strokeWidth="1.8" fill="none" />
              </svg>
            </div>
          </div>

          {/* Wide Split Showcase Card: Left 8 Cols Flat-Lay Desk & Books + Right 4 Cols White Panel */}
          <div className="max-w-5xl mx-auto bg-white text-[#111113] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 text-left">
            
            {/* Left 8 Cols: Studio Product Showcase on Desk Backdrop */}
            <div
              className="md:col-span-8 min-h-[280px] sm:min-h-[360px] bg-cover bg-center relative flex items-center justify-center p-6 sm:p-8"
              style={{ backgroundImage: 'url(/hero-desk-bg.jpg)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#111113]/35 via-[#111113]/20 to-[#111113]/10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-[#F9F8F6]/15 to-white/25 pointer-events-none" />
              <div className="relative z-10 grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-xl">
                <Link
                  to="/product/prod-omega-cb-4q"
                  className="bg-white rounded-lg p-3.5 sm:p-4 shadow-xl border border-[#E7E5E0] flex flex-col items-center justify-between group hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="w-full aspect-square flex items-center justify-center overflow-hidden bg-white rounded-lg border border-[#E7E5E0]">
                    <img
                      src="/omega-products/counter-book-q4-catalog.jpeg"
                      alt="OMEGA Hardcover Counter Book Q4"
                      className="w-full h-full aspect-square object-cover object-center rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="w-full pt-3 mt-2 border-t border-[#E7E5E0] flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-[#111113] truncate">Counter Book Q4</span>
                    <span className="font-bold text-[#DC2626] shrink-0">384 Pages</span>
                  </div>
                </Link>

                <Link
                  to="/product/prod-omega-ex-144"
                  className="bg-white rounded-lg p-3.5 sm:p-4 shadow-xl border border-[#E7E5E0] flex flex-col items-center justify-between group hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="w-full aspect-square flex items-center justify-center overflow-hidden bg-white rounded-lg border border-[#E7E5E0]">
                    <img
                      src="/omega-products/exercise-book-144p-catalog.jpeg"
                      alt="OMEGA Student Exercise Book"
                      className="w-full h-full aspect-square object-cover object-center rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="w-full pt-3 mt-2 border-t border-[#E7E5E0] flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-[#111113] truncate">Exercise Book A4</span>
                    <span className="font-bold text-[#DC2626] shrink-0">70 GSM</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right 4 Cols: Crisp White Panel with Title, Copy & Red GET STARTED Button */}
            <div className="md:col-span-4 p-7 sm:p-10 flex flex-col justify-center space-y-5 bg-white text-charcoal-ink">
              <div className="space-y-3">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-charcoal-ink">
                  {language === 'sw' ? 'Vitabu vya Ofisi & Shule' : 'Corporate & School Books'}
                </h3>
                <p className="text-xs sm:text-[13px] text-charcoal-ink leading-relaxed">
                  {language === 'sw'
                    ? 'Jalada gumu la 1.8mm, mshono wa nyuzi unaofunguka tambarare 180°, na karatasi nyeupe ya 70 GSM kwa matumizi ya shule na ofisi.'
                    : '1.8mm laminated hardcover board, Smyth thread-sewn lay-flat spine, and 70 GSM bleed-proof paper for schools, banks, and enterprises.'}
                </p>
              </div>

              <div className="pt-1">
                <Link
                  to="/catalog"
                  className="inline-flex items-center justify-center py-3 px-7 rounded-[3px] bg-[#C62828] hover:bg-[#B71C1C] text-white font-sans font-bold text-[11px] uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                >
                  <span>{language === 'sw' ? 'ANZA SASA' : 'GET STARTED'}</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. BENCHMARK STATIONERY PICKS (Product Grid) */}
      <div className="space-y-12 sm:space-y-16 pt-12 sm:pt-16 bg-paper-base text-charcoal-ink">
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-[8px] p-6 sm:p-8 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04),0_1px_3px_0_rgba(17,17,19,0.02)] border border-[#E7E5E0] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E5E0]">
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B91C1C] font-semibold block mb-1">
                {language === 'sw' ? 'Mkusanyiko Maarufu' : 'Signature Collection'}
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-ink tracking-tight">
                {language === 'sw' ? 'Madaftari Yanayoongoza Tanzania' : 'Benchmark Stationery Picks'}
              </h2>
              <p className="text-xs text-charcoal-ink mt-1 font-normal">
                {language === 'sw'
                  ? 'Madaftari yanayoongoza kwa kuagizwa na shule, vyuo na wafanyabiashara'
                  : "Tanzania's most requested school and accounting books directly from factory production lines"}
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'all', label: t.catAll },
                { id: 'counter', label: t.catCounter },
                { id: 'exercise', label: t.catExercise },
                { id: 'bahasha', label: t.catBahasha },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (activeTab !== tab.id) {
                      setIsTabLoading(true);
                      setActiveTab(tab.id as any);
                      setTimeout(() => setIsTabLoading(false), 240);
                    }
                  }}
                  className={`px-4 py-2 rounded-[4px] text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#111113] text-[#FFFFFF] shadow-sm'
                      : 'bg-paper-base hover:bg-[#F2EFEB] text-charcoal-ink border border-[#E7E5E0]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {isCatalogLoading || isTabLoading ? (
            <CatalogSkeletonGrid viewMode="grid" count={4} columns={4} />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={`${product.id}-${idx}`} product={product} />
              ))}
            </div>
          )}

          <div className="pt-4 text-center">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[4px] bg-[#111113] hover:bg-[#262524] text-white text-xs font-sans font-semibold uppercase tracking-wider shadow-sm transition-all duration-200 cursor-pointer"
            >
              <span>{language === 'sw' ? 'Tazama Katalogi Kamili' : 'Explore Complete Catalogue (44 Items)'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. WHOLESALE CALCULATOR (Centered 1360px) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] text-charcoal-ink rounded-[4px] p-6 sm:p-9 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] border border-[#E5E7EB] space-y-6 max-w-2xl mx-auto text-left">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-[2px] bg-[#111113] text-[#FFFFFF] text-[10px] font-mono font-bold uppercase tracking-widest inline-block">
              {language === 'sw' ? 'BEI YA JUMLA YA KIWANDANI' : 'B2B FACTORY PRICING ESTIMATOR'}
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-black text-charcoal-ink tracking-tight">{t.bulkCalculatorTitle}</h2>
            <p className="text-xs text-charcoal-ink max-w-md mx-auto">{t.bulkCalculatorSubtitle}</p>
            <div className="pt-1 flex justify-center">
              <svg className="w-16 h-3 text-[#DC2626]" viewBox="0 0 60 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 5 Q 7.5 0, 15 5 T 30 5 T 45 5 T 60 5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-charcoal-ink uppercase tracking-wider block">
                {language === 'sw' ? 'Chagua Aina ya Kitabu' : 'Select Book Model'}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'q2', name: 'Counter Book Q2', note: '192p · 48/ctn' },
                  { id: 'q3', name: 'Counter Book Q3', note: '288p · 36/ctn' },
                  { id: 'q4', name: 'Counter Book Q4', note: '384p · 24/ctn' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setCalcBookType(b.id as any)}
                    className={`p-3.5 rounded-[2px] text-left transition-all cursor-pointer border ${
                      calcBookType === b.id
                        ? 'bg-[#DC2626] text-[#FFFFFF] border-[#DC2626] shadow-sm'
                        : 'bg-paper-base hover:bg-[#F3F4F6] text-charcoal-ink border-[#E5E7EB]'
                    }`}
                  >
                    <div className="font-bold text-xs truncate">{b.name}</div>
                    <div className={`text-[10px] font-mono mt-1 ${calcBookType === b.id ? 'text-white' : 'text-[#3F3F46]'}`}>
                      {b.note}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-charcoal-ink uppercase tracking-wider block">
                {language === 'sw' ? 'Idadi ya Katoni (Cartons)' : 'Carton Quantity'}
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCalcQuantity(Math.max(1, calcQuantity - 1))}
                  className="w-11 h-11 rounded-[2px] bg-paper-base hover:bg-[#111113] hover:text-white text-charcoal-ink border border-[#E5E7EB] flex items-center justify-center font-bold text-lg active:scale-95 transition-all cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 py-2.5 rounded-[2px] bg-paper-base border border-[#E5E7EB] text-center font-mono font-bold text-base text-charcoal-ink">
                  {calcQuantity} {language === 'sw' ? 'Katoni' : 'Cartons'}
                </div>
                <button
                  type="button"
                  onClick={() => setCalcQuantity(calcQuantity + 1)}
                  className="w-11 h-11 rounded-[2px] bg-paper-base hover:bg-[#111113] hover:text-white text-charcoal-ink border border-[#E5E7EB] flex items-center justify-center font-bold text-lg active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Total readout card */}
            <div className="p-5 rounded-[4px] bg-[#111113] text-white border border-[#262524] space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#E4E4E7]">{language === 'sw' ? 'Jumla ya Vitabu' : 'Total Book Units'}:</span>
                <span className="font-bold text-white tabular-nums">{totalUnits.toLocaleString()} pcs</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#E4E4E7]">{language === 'sw' ? 'Bei kwa Kitabu' : 'Cost Per Book'}:</span>
                <span className="font-bold text-[#F87171] tabular-nums">TSh {Math.round(unitPrice).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#262524]">
                <span className="font-heading font-bold text-sm text-[#FFFFFF]">{language === 'sw' ? 'Jumla ya Katoni' : 'Estimated Total'}:</span>
                <span className="font-mono font-black text-2xl text-white tabular-nums">TSh {calcTotal.toLocaleString()}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                `Habari OMEGA, nahitaji kuagiza katoni ${calcQuantity} za ${activeBook.name} (pcs ${totalUnits}) kwa bei ya TSh ${calcTotal.toLocaleString()}.`
              )}`}
              onClick={() => triggerLuxuryConfetti()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <IconWhatsAppCustom className="w-4 h-4" />
              <span>{language === 'sw' ? 'Tuma Oda Hii WhatsApp' : 'Submit Proforma Order'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. VERIFIED TANZANIAN CUSTOMER REVIEWS (Centered 1360px) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-[4px] p-6 sm:p-9 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] border border-[#E5E7EB] space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#3F3F46] font-mono block">
                {language === 'sw' ? 'USHUHUDA WA WATEJA' : 'VERIFIED INSTITUTIONAL REVIEWS'}
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-black text-charcoal-ink tracking-tight">
                {language === 'sw' ? 'Wateja Wetu Wanasemaje' : 'Trusted by Schools & Wholesalers'}
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-ink font-normal">
                {language === 'sw'
                  ? 'Zaidi ya vitabu 500,000+ husambazwa kila mwaka kwa shule, maduka na vyuo mikoa 31.'
                  : 'Over 500,000+ notebooks distributed annually across 1,200+ partner schools and distributors.'}
              </p>
              <div className="pt-1">
                <svg className="w-16 h-3 text-[#DC2626]" viewBox="0 0 60 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 5 Q 7.5 0, 15 5 T 30 5 T 45 5 T 60 5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#DC2626] text-[#DC2626]" />
                ))}
              </div>
              <span className="text-charcoal-ink ml-1 font-bold">4.9 / 5.0 Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-[#E5E7EB]">
            {[
              {
                name: 'Mwl. Peter Mwita',
                role: 'Headmaster, St. Joseph Secondary',
                location: 'Mbeya, Tanzania',
                review: language === 'sw'
                  ? 'Madaftari ya OMEGA 200p ndiyo pekee yasiyochana kurasa katikati ya muhula. Mshono wao wa uzi na karatasi ngumu ya 70 GSM inawasaidia sana wanafunzi kuandika vizuri bila wino kupenyeza.'
                  : 'OMEGA 200p exercise books are the only ones where pages do not fall out mid-term. The thread stitching and 70 GSM paper quality make a massive difference for student exams.',
              },
              {
                name: 'Haji Kassim Ally',
                role: 'Wholesale Stationery Stockist',
                location: 'Kariakoo, Dar es Salaam',
                review: language === 'sw'
                  ? 'Tunachukua katoni 80 hadi 100 kila mwezi za Counter Books Q4 na Q2. Bei ya kiwandani ya OMEGA inatupa faida nzuri, na ankara za EFD zinafika pamoja na mzigo kwenye basi.'
                  : 'We procure 80 to 100 cartons monthly of Q4 and Q2 counter books. OMEGA factory wholesale rates provide great margins, and EFD receipts always accompany our bus parcel dispatch.',
              },
              {
                name: 'Grace Mfinanga',
                role: 'Procurement Officer, College of Business',
                location: 'Arusha, Tanzania',
                review: language === 'sw'
                  ? 'Bahasha zao za kraft A4 ni nzito sana na hazipasuki hata zikijazwa mitihani au kumbukumbu za wanafunzi. Oda za dharura zinatufikia ndani ya masaa 24 kupitia basi la Mbeya–Arusha.'
                  : 'Their A4 kraft bahasha envelopes are genuinely tear-proof even when loaded with examination records. Urgent replenishment orders reach us in under 24 hours via express bus logistics.',
              },
            ].map((rev, idx) => (
              <div
                key={idx}
                className={`p-6 bg-[#FFFFFF] hover:bg-paper-base transition-all space-y-4 flex flex-col justify-between ${
                  idx < 2 ? 'border-b md:border-b-0 md:border-r border-[#E5E7EB]' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#DC2626] text-[#DC2626]" />
                    ))}
                  </div>
                  <p className="text-xs text-charcoal-ink leading-relaxed italic font-normal">
                    "{rev.review}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E7EB]">
                  <div className="font-heading font-bold text-xs text-charcoal-ink">{rev.name}</div>
                  <div className="text-[11px] text-[#3F3F46] font-mono mt-0.5">{rev.role} · {rev.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TANZANIA PAYMENT & DELIVERY LOGISTICS STRIP (Centered 1360px) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-[4px] p-6 sm:p-8 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] border border-[#E5E7EB] text-left space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#B91C1C] uppercase tracking-widest block mb-0.5">
                {language === 'sw' ? 'MALIPO & USAFIRISHAJI TANZANIA' : 'TANZANIA PAYMENTS & LOGISTICS'}
              </span>
              <h3 className="font-heading text-sm sm:text-base font-black text-charcoal-ink">
                {language === 'sw'
                  ? 'Mbinu za Malipo Rasmi na Usafirishaji wa Mabasi'
                  : 'Approved Payment Channels & Bus Terminal Waybills'}
              </h3>
            </div>
            <div className="text-xs text-charcoal-ink font-normal">
              {language === 'sw' ? 'Stakabadhi halisi za TRA EFD zitatolewa' : 'Official TRA EFD tax invoices included with all orders'}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border border-[#E5E7EB] text-center">
            {[
              { label: 'M-Pesa', sub: 'Vodacom Lipa Namba', tag: 'Mobile Money' },
              { label: 'Mixx by Yas', sub: 'Tigo Pesa Network', tag: 'Mobile Money' },
              { label: 'Airtel Money', sub: 'Pay Direct to Till', tag: 'Mobile Money' },
              { label: 'CRDB / NMB', sub: 'Bank Wire & Cheque', tag: 'Institutional' },
              { label: 'Pay on Delivery', sub: 'Lipa Baada ya Mzigo', tag: 'Cash on Arrival' },
              { label: 'Mabasi Mikoa 31', sub: 'Abood, Shabiby, BM', tag: 'Same-Day Dispatch' },
            ].map((p, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#FFFFFF] hover:bg-paper-base border-r border-b border-[#E5E7EB] transition-all space-y-1"
              >
                <span className="text-[9px] font-mono font-bold text-[#B91C1C] uppercase tracking-wider block">
                  {p.tag}
                </span>
                <div className="font-heading font-bold text-xs text-charcoal-ink">{p.label}</div>
                <div className="text-[10px] text-[#3F3F46]">{p.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CONTACT & FACTORY LOCATION (Centered 1360px) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-[4px] border border-[#E5E7EB] shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] text-left grid grid-cols-1 md:grid-cols-3">
          <div className="space-y-3 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-[#E5E7EB] hover:bg-paper-base transition-colors">
            <div className="w-10 h-10 rounded-[2px] bg-[#111113] text-[#FFFFFF] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#DC2626]" />
            </div>
            <h4 className="font-heading font-black text-sm text-charcoal-ink">
              {language === 'sw' ? 'Kiwanda cha Mbeya (Headquarters)' : 'Mbeya Factory (Headquarters)'}
            </h4>
            <p className="text-xs text-charcoal-ink leading-relaxed font-normal">
              Soweto SIDO Industrial Estate, Plot 14-B,<br />
              Mbeya Municipal, Tanzania.<br />
              <span className="font-mono text-charcoal-ink font-bold block mt-1.5">Mon – Sat: 8:00 AM – 5:30 PM</span>
            </p>
          </div>

          <div className="space-y-3 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-[#E5E7EB] hover:bg-paper-base transition-colors">
            <div className="w-10 h-10 rounded-[2px] bg-[#111113] text-[#FFFFFF] flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#DC2626]" />
            </div>
            <h4 className="font-heading font-black text-sm text-charcoal-ink">
              {language === 'sw' ? 'Ghala la Dar es Salaam' : 'Dar es Salaam Regional Depot'}
            </h4>
            <p className="text-xs text-charcoal-ink leading-relaxed font-normal">
              Plot 30 Block F Kilwa Road / Kariakoo Depot,<br />
              Dar es Salaam, Tanzania.<br />
              <span className="font-mono text-charcoal-ink font-bold block mt-1.5">Same-Day Bus Terminal Handoff</span>
            </p>
          </div>

          <div className="space-y-3 p-6 sm:p-8 hover:bg-paper-base transition-colors">
            <div className="w-10 h-10 rounded-[2px] bg-[#111113] text-[#FFFFFF] flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#DC2626]" />
            </div>
            <h4 className="font-heading font-black text-sm text-charcoal-ink">
              {language === 'sw' ? 'Mawasiliano ya Haraka' : 'Direct Wholesale Inquiries'}
            </h4>
            <p className="text-xs text-charcoal-ink leading-relaxed font-normal">
              Phone: +255 715 268 391 / +255 746 268 391<br />
              Email: indigoprinter06423@gmail.com<br />
              <span className="font-mono text-[#B91C1C] font-bold block mt-1.5">WhatsApp Active 24/7</span>
            </p>
          </div>
        </div>
      </section>
      </div>

    </div>
  );
};

export default HomePage;

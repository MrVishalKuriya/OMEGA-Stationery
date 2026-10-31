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
  const { products, storeConfig, language } = useStore();
  const t = (TRANSLATIONS[language] || TRANSLATIONS.en) as any;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'counter' | 'exercise' | 'bahasha' | 'wholesale'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'counter' | 'exercise' | 'bahasha'>('all');

  // Wholesale calculator state
  const [calcQuantity, setCalcQuantity] = useState<number>(5);
  const [calcBookType, setCalcBookType] = useState<'q2' | 'q3' | 'q4'>('q2');

  const currency = storeConfig.currencySymbol || 'TSh';

  // Dynamic products lookup
  const q2Prod = useMemo(() => products.find((p) => p.sku === 'OMG-CB-Q2' || p.id === 'prod-omega-cb-q2' || p.name.includes('Q2')), [products]);
  const q3Prod = useMemo(() => products.find((p) => p.sku === 'OMG-CB-Q3' || p.id === 'prod-omega-cb-q3' || p.name.includes('Q3')), [products]);
  const q4Prod = useMemo(() => products.find((p) => p.sku === 'OMG-CB-Q4' || p.id === 'prod-omega-cb-q4' || p.name.includes('Q4')), [products]);
  const ex200Prod = useMemo(() => products.find((p) => p.sku === 'OMG-EX-200SL' || p.id === 'prod-omega-ex-200sl' || p.name.includes('200 Pages')), [products]);
  const ex100Prod = useMemo(() => products.find((p) => p.sku === 'OMG-EX-100SL' || p.id === 'prod-omega-ex-100sl' || p.name.includes('100 Pages')), [products]);
  const ex80Prod = useMemo(() => products.find((p) => p.sku === 'OMG-EX-80' || p.id === 'prod-omega-ex-80' || p.name.includes('80 Pages')), [products]);
  const bahashaProd = useMemo(() => products.find((p) => p.sku === 'OMG-BAHASHA-A4' || p.id === 'prod-omega-bahasha-a4' || p.name.includes('Bahasha')), [products]);
  const stiffProd = useMemo(() => products.find((p) => p.id === 'prod-omega-stiff-200' || p.name.includes('Stiff')), [products]);

  // Filter products cleanly without clutter (Hick's Law)
  const filteredProducts = useMemo(() => {
    if (activeTab === 'counter') return products.filter((p) => p.category === 'Counter Books');
    if (activeTab === 'exercise') return products.filter((p) => p.category === 'Exercise Books');
    if (activeTab === 'bahasha') return products.filter((p) => p.category === 'Bahasha & Envelopes');
    if (activeTab === 'wholesale') return products.filter((p) => Boolean(p.wholesalePrice));
    return products.slice(0, 8);
  }, [products, activeTab]);

  const cleanWhatsappDigits = storeConfig.whatsappNumber
    ? storeConfig.whatsappNumber.replace(/\D/g, '')
    : '255746268391';

  const whatsappGreetingUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    language === 'sw'
      ? 'Habari OMEGA Stationery, ninahitaji kuulizia kuhusu bei za jumla za katalogi.'
      : 'Hello OMEGA Stationery, I would like to inquire about wholesale catalog pricing.'
  )}`;

  // Deals of the day
  const dealsOfTheDay = useMemo(() => [
    {
      id: q2Prod?.id || 'prod-omega-cb-q2',
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
      id: ex200Prod?.id || 'prod-omega-ex-200sl',
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
      id: q3Prod?.id || 'prod-omega-cb-q3',
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
      id: stiffProd?.id || 'prod-omega-stiff-200',
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
      id: q4Prod?.id || 'prod-omega-cb-q4',
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
      id: bahashaProd?.id || 'prod-omega-bahasha-a4',
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
    <div className="w-full bg-[#F9F8F6] min-h-screen text-[#111113] space-y-10 sm:space-y-14 pb-16">
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

      {/* 1. HERO SECTION (1360px Centered) */}
      <Hero whatsappGreetingUrl={whatsappGreetingUrl} />

      {/* 2. FOUR PRIMARY B2B CATEGORY CARDS (Centered 1360px Grid) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#F2EFEB] text-[#8C7355] border border-[#E7E5E0] font-mono text-[10px] font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#8C7355]" />
                <span>KIWANDA CHA MBEYA SOWETO SIDO</span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-[#111113] tracking-tight mt-2">
                {language === 'sw' ? 'Kategoria Kuu za Kiwandani' : 'Core Manufacturing Product Lines'}
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6B66] mt-1 max-w-2xl font-normal">
                {language === 'sw'
                  ? 'Madaftari na vifaa vilivyotengenezwa mahususi kwa shule za sekondari, vyuo vikuu na vituo vya jumla Tanzania.'
                  : 'Engineered specifically for schools, universities, institutional tenders, and nationwide commercial stockists.'}
              </p>
            </div>

            <Link
              to="/catalog"
              className="px-5 py-2.5 rounded-md bg-[#111113] hover:bg-[#262524] text-[#FFFFFF] text-xs font-sans font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 self-start sm:self-auto shadow-2xs transition-all active:scale-97 cursor-pointer"
            >
              <span>{language === 'sw' ? 'Katalogi Kamili' : 'Full Catalog'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {primaryB2BCategories.map((cat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                onClick={() => navigate(cat.link)}
                className="bg-[#FFFFFF] rounded-lg p-5 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(35,27,18,0.08)] transition-all flex flex-col justify-between cursor-pointer group text-left h-full border border-[#E7E5E0] hover:border-[#8C7355]/60"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[9px] font-mono font-semibold text-[#111113] bg-[#F2EFEB] border border-[#E7E5E0] px-2 py-0.5 rounded-[4px]">
                      {cat.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#8C7355]">
                      {language === 'sw' ? cat.priceSw : cat.price}
                    </span>
                  </div>

                  {/* Centered, balanced image container */}
                  <div className="aspect-square w-full bg-[#F9F8F6] rounded-md p-4 flex items-center justify-center overflow-hidden mb-3 border border-[#E7E5E0]">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-[1.025] transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] drop-shadow-2xs"
                      loading="lazy"
                    />
                  </div>

                  <h3 className="font-heading text-sm sm:text-base font-semibold text-[#111113] group-hover:text-[#DC2626] transition-colors leading-snug">
                    {language === 'sw' ? cat.titleSw : cat.title}
                  </h3>

                  <p className="text-xs text-[#6E6B66] mt-1.5 leading-relaxed font-normal">
                    {language === 'sw' ? cat.descSw : cat.desc}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-[#E7E5E0] flex items-center justify-between text-xs font-mono font-semibold text-[#111113] group-hover:text-[#DC2626]">
                  <span>{language === 'sw' ? 'Angalia Bei za Katoni' : 'Explore Carton Rates'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DEALS OF THE DAY RAIL (Centered 1360px) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-lg p-5 sm:p-7 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] border border-[#E7E5E0] space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E0]">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-md bg-[#F9F8F6] text-[#8C7355] border border-[#E7E5E0] flex items-center justify-center shrink-0">
                <IconLightningDeal className="w-5 h-5 text-[#8C7355]" />
              </span>
              <div className="text-left">
                <h2 className="font-heading text-base sm:text-lg font-semibold text-[#111113] tracking-tight">
                  {t.dealsDayTitle}
                </h2>
                <p className="text-xs text-[#6E6B66] mt-0.5">{t.dealsDaySubtitle}</p>
              </div>
            </div>

            <Link
              to="/catalog"
              className="px-4 py-2 rounded-md bg-[#111113] hover:bg-[#262524] text-white text-xs font-sans font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all shadow-2xs active:scale-97 cursor-pointer"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Cards Rail */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {dealsOfTheDay.map((deal) => (
              <motion.div
                key={deal.id}
                whileHover={{ y: -3, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                onClick={() => navigate(`/product/${deal.id}`)}
                className="group p-3 bg-[#FFFFFF] rounded-lg border border-[#E7E5E0] hover:border-[#8C7355]/60 hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer text-left relative h-full"
              >
                {/* Discount Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-[4px] bg-[#DC2626] text-[#FFFFFF] text-[9px] font-mono font-bold uppercase leading-tight z-10 shadow-2xs">
                  {deal.discount}
                </div>

                {/* Image Container */}
                <div className="aspect-square w-full bg-[#F9F8F6] rounded-md p-3 flex items-center justify-center overflow-hidden mb-2.5 border border-[#E7E5E0]">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Info Container */}
                <div className="flex flex-col flex-1 justify-between space-y-1.5">
                  <div className="space-y-1">
                    <div className="min-h-[2.2rem] flex items-start">
                      <h3 className="font-heading font-semibold text-xs text-[#111113] group-hover:text-[#DC2626] line-clamp-2 leading-snug">
                        {deal.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-1 pt-0.5">
                      <span className="px-1.5 py-0.5 rounded-[4px] bg-[#F2EFEB] text-[#111113] text-[9px] font-semibold font-mono flex items-center gap-0.5 leading-none">
                        <span>{deal.rating}</span>
                        <Star className="w-2.5 h-2.5 fill-[#8C7355] text-[#8C7355]" />
                      </span>
                      <span className="text-[10px] text-[#6E6B66] font-mono font-normal truncate">{deal.spec}</span>
                    </div>
                  </div>

                  <div className="pt-2 mt-auto space-y-0.5 border-t border-[#E7E5E0]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono font-bold text-xs sm:text-sm text-[#111113]">
                        TSh {deal.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#6E6B66] line-through font-mono">
                        TSh {deal.mrp.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8C7355] font-mono font-semibold block truncate">
                      {deal.carton}
                    </span>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. WHOLESALE & MANUFACTURER PROMISE STRIP (Centered 1360px) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111113] rounded-lg p-6 sm:p-9 text-white shadow-[0_2px_8px_-2px_rgba(17,17,19,0.06)] border border-[#E7E5E0]/20 text-left flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-1 rounded-[4px] bg-[#262524] text-[#8C7355] border border-[#8C7355]/40 font-mono text-[10px] font-semibold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#8C7355]" />
              <span>{language === 'sw' ? 'ZABUNI ZA SHULE NA BEI YA JUMLA' : 'DIRECT FACTORY WHOLESALE CATALOG'}</span>
            </span>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-tight">
              {language === 'sw'
                ? 'Agiza Moja kwa Moja Kiwandani Mbeya Kwa Bei ya Katoni'
                : 'Direct Factory Dispatch: Bulk Cartons for Schools & Wholesalers'}
            </h2>
            <p className="text-xs sm:text-sm text-[#D5D2CC] leading-relaxed font-normal">
              {language === 'sw'
                ? 'Pata punguzo la hadi 18% unapoagiza kuanzia katoni 5. Ankara rasmi za TRA EFD zitatolewa na mzigo utakabidhiwa kwenye basi siku hiyo hiyo.'
                : 'Save up to 18% on bulk carton tiers. Full institutional EFD tax invoice compliance and guaranteed same-day waybill handoff at major bus terminals.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              to="/wholesale"
              className="px-5 py-3 rounded-md bg-[#8C7355] hover:bg-[#786044] text-[#FFFFFF] font-sans font-semibold text-xs uppercase tracking-wider transition-all shadow-2xs active:scale-97 flex-1 sm:flex-none text-center cursor-pointer"
            >
              <span>{language === 'sw' ? 'TAZAMA BEI ZA JUMLA' : 'VIEW WHOLESALE TIERS'}</span>
            </Link>
            <a
              href={whatsappGreetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white font-sans font-semibold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-97 flex-1 sm:flex-none cursor-pointer"
            >
              <IconWhatsAppCustom className="w-4 h-4" />
              <span>WhatsApp Proforma</span>
            </a>
          </div>
        </div>
      </section>

      {/* 5. "HOW TO ORDER" 3-STEP GUIDE (Centered 1360px) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-lg p-6 sm:p-9 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] border border-[#E7E5E0] text-left space-y-7">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="px-3 py-0.5 rounded-[4px] bg-[#F2EFEB] text-[#8C7355] border border-[#E7E5E0] font-mono text-[10px] font-semibold uppercase tracking-wider inline-block">
              {language === 'sw' ? 'UTARATIBU WA ODA' : '3 SIMPLE STEPS'}
            </span>
            <h2 className="font-heading text-lg sm:text-2xl font-semibold text-[#111113]">
              {language === 'sw' ? 'Jinsi ya Kuagiza Madaftari' : 'How to Place Your Order'}
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6B66]">
              {language === 'sw'
                ? 'Utaratibu wa haraka na salama wa kuagiza na kupokea mzigo wako mkoani kwako.'
                : 'Fast, secure order placement with nationwide bus terminal dispatch within 24 hours.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                title: language === 'sw' ? 'Chagua Madaftari & Vipimo' : 'Select Books & Carton Volume',
                desc: language === 'sw'
                  ? 'Angalia katalogi ya kiwandani, chagua aina ya madaftari (Q1–Q4, 80p–200p, au Bahasha) na kiasi cha katoni unazohitaji.'
                  : 'Browse our full catalog, pick your quire sizes (Q2–Q4, 200p exercise, kraft envelopes), and specify your carton requirement.',
                icon: Package,
              },
              {
                step: '02',
                title: language === 'sw' ? 'Thibitisha kwa WhatsApp / Simu' : 'Confirm via WhatsApp & Get EFD Invoice',
                desc: language === 'sw'
                  ? 'Bofya kitufe cha WhatsApp ili kutuma orodha yako. Meneja wetu wa mauzo atatuma ankara rasmi ya kiwanda yenye TRA EFD mara moja.'
                  : 'Send your cart via WhatsApp with one click. Our factory sales manager issues your formal EFD proforma quote instantly.',
                icon: MessageCircle,
              },
              {
                step: '03',
                title: language === 'sw' ? 'Mzigo Unatumwa Kwenye Basi' : 'Same-Day Bus Terminal Waybill',
                desc: language === 'sw'
                  ? 'Mzigo wako unafungwa vizuri na kukabidhiwa kwenye ofisi ya basi (Abood, Shabiby, BM, New Force n.k.) na utatumiwa stakabadhi ya mzigo (waybill).'
                  : 'Your order is strapped and handed over to your preferred bus terminal courier with immediate tracking waybill confirmation.',
                icon: Truck,
              },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="p-5 rounded-md bg-[#F9F8F6] border border-[#E7E5E0] hover:border-[#8C7355]/50 transition-all space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-[#8C7355]">{s.step}</span>
                    <div className="w-9 h-9 rounded-md bg-[#FFFFFF] text-[#111113] border border-[#E7E5E0] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#8C7355]" />
                    </div>
                  </div>
                  <h3 className="font-heading text-sm sm:text-base font-semibold text-[#111113]">{s.title}</h3>
                  <p className="text-xs text-[#6E6B66] leading-relaxed font-normal">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BENCHMARK STATIONERY PICKS (Product Grid 1360px Centered) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-lg p-5 sm:p-7 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] border border-[#E7E5E0] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E7E5E0]">
            <div className="text-left">
              <h2 className="font-heading text-base sm:text-lg font-semibold text-[#111113] tracking-tight">
                {language === 'sw' ? 'Madaftari Yanayoongoza Tanzania' : 'Benchmark Stationery Picks'}
              </h2>
              <p className="text-xs text-[#6E6B66] mt-0.5">
                {language === 'sw'
                  ? 'Madaftari yanayoongoza kwa kuagizwa na shule, vyuo na wafanyabiashara'
                  : "Tanzania's most requested school and accounting books"}
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
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-[4px] text-xs font-mono font-medium uppercase whitespace-nowrap cursor-pointer transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#111113] text-[#FFFFFF] shadow-2xs'
                      : 'bg-[#F9F8F6] hover:bg-[#F2EFEB] text-[#6E6B66] border border-[#E7E5E0]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="pt-3 text-center">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-md bg-[#111113] hover:bg-[#262524] text-white text-xs font-sans font-semibold uppercase tracking-wider shadow-2xs transition-all active:scale-97 cursor-pointer"
            >
              <span>{language === 'sw' ? 'Tazama Katalogi Kamili' : 'Explore Complete Catalogue (44 Items)'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. WHOLESALE CALCULATOR (Centered 1360px) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] text-[#111113] rounded-lg p-5 sm:p-8 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] border border-[#E7E5E0] space-y-5 max-w-2xl mx-auto text-left">
          <div className="text-center space-y-1.5">
            <span className="px-3 py-0.5 rounded-[4px] bg-[#F2EFEB] text-[#8C7355] border border-[#E7E5E0] text-[10px] font-mono font-semibold uppercase tracking-wider inline-block">
              {language === 'sw' ? 'BEI YA JUMLA YA KIWANDANI' : 'B2B FACTORY PRICING'}
            </span>
            <h2 className="font-heading text-lg sm:text-2xl font-semibold text-[#111113]">{t.bulkCalculatorTitle}</h2>
            <p className="text-xs text-[#6E6B66] max-w-md mx-auto">{t.bulkCalculatorSubtitle}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-[#111113] uppercase tracking-wider block">
                {language === 'sw' ? 'Chagua Aina ya Kitabu' : 'Select Book Model'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'q2', name: 'Counter Book Q2', note: '192p · 48/ctn' },
                  { id: 'q3', name: 'Counter Book Q3', note: '288p · 36/ctn' },
                  { id: 'q4', name: 'Counter Book Q4', note: '384p · 24/ctn' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setCalcBookType(b.id as any)}
                    className={`p-3 rounded-md text-left transition-all cursor-pointer border ${
                      calcBookType === b.id
                        ? 'bg-[#111113] text-[#FFFFFF] border-[#111113] shadow-2xs'
                        : 'bg-[#F9F8F6] hover:bg-[#F2EFEB] text-[#111113] border-[#E7E5E0]'
                    }`}
                  >
                    <div className="font-semibold text-xs truncate">{b.name}</div>
                    <div className={`text-[10px] font-mono mt-0.5 ${calcBookType === b.id ? 'text-[#8C7355]' : 'text-[#6E6B66]'}`}>
                      {b.note}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-[#111113] uppercase tracking-wider block">
                {language === 'sw' ? 'Idadi ya Katoni (Cartons)' : 'Carton Quantity'}
              </label>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setCalcQuantity(Math.max(1, calcQuantity - 1))}
                  className="w-10 h-10 rounded-md bg-[#F9F8F6] hover:bg-[#F2EFEB] text-[#111113] border border-[#E7E5E0] flex items-center justify-center font-bold text-lg active:scale-95 transition-all cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 py-2 rounded-md bg-[#F9F8F6] border border-[#E7E5E0] text-center font-mono font-bold text-base text-[#111113]">
                  {calcQuantity} {language === 'sw' ? 'Katoni' : 'Cartons'}
                </div>
                <button
                  type="button"
                  onClick={() => setCalcQuantity(calcQuantity + 1)}
                  className="w-10 h-10 rounded-md bg-[#F9F8F6] hover:bg-[#F2EFEB] text-[#111113] border border-[#E7E5E0] flex items-center justify-center font-bold text-lg active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Total readout card (DESIGN.md: Charcoal Ink Surface) */}
            <div className="p-4 rounded-md bg-[#111113] text-white border border-[#262524] space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#D5D2CC]">{language === 'sw' ? 'Jumla ya Vitabu' : 'Total Book Units'}:</span>
                <span className="font-bold text-white">{totalUnits.toLocaleString()} pcs</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#D5D2CC]">{language === 'sw' ? 'Bei kwa Kitabu' : 'Cost Per Book'}:</span>
                <span className="font-bold text-[#8C7355]">TSh {Math.round(unitPrice).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#262524]">
                <span className="font-heading font-semibold text-sm text-white">{language === 'sw' ? 'Jumla ya Katoni' : 'Grand Total'}:</span>
                <span className="font-mono font-bold text-xl text-white">TSh {calcTotal.toLocaleString()}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                `Habari OMEGA, nahitaji kuagiza katoni ${calcQuantity} za ${activeBook.name} (pcs ${totalUnits}) kwa bei ya TSh ${calcTotal.toLocaleString()}.`
              )}`}
              onClick={() => triggerLuxuryConfetti()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-sans font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <IconWhatsAppCustom className="w-4 h-4" />
              <span>{language === 'sw' ? 'Tuma Oda Hii WhatsApp' : 'Submit Proforma Order'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. VERIFIED TANZANIAN CUSTOMER REVIEWS (Centered 1360px) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-lg p-5 sm:p-8 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] border border-[#E7E5E0] space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="px-3 py-0.5 rounded-[4px] bg-[#F2EFEB] text-[#8C7355] border border-[#E7E5E0] font-mono text-[10px] font-semibold uppercase tracking-wider inline-block">
                {language === 'sw' ? 'USHUHUDA WA WATEJA' : 'VERIFIED REVIEWS'}
              </span>
              <h2 className="font-heading text-lg sm:text-2xl font-semibold text-[#111113] mt-1.5">
                {language === 'sw' ? 'Wateja Wetu Wanasemaje' : 'Trusted by Schools & Wholesalers'}
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6B66] mt-0.5">
                {language === 'sw'
                  ? 'Zaidi ya vitabu 500,000+ husambazwa kila mwaka kwa shule, maduka na vyuo mikoa 31.'
                  : 'Over 500,000+ notebooks distributed annually across 1,200+ partner schools and distributors.'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#8C7355] text-[#8C7355]" />
                ))}
              </div>
              <span className="text-[#111113] ml-1">4.9 / 5.0 Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
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
              <div key={idx} className="p-5 rounded-md bg-[#F9F8F6] border border-[#E7E5E0] hover:border-[#8C7355]/40 transition-all space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#8C7355] text-[#8C7355]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#111113] leading-relaxed italic font-normal">
                    "{rev.review}"
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#E7E5E0]">
                  <div className="font-heading font-semibold text-xs text-[#111113]">{rev.name}</div>
                  <div className="text-[11px] text-[#6E6B66]">{rev.role} · {rev.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TANZANIA PAYMENT & DELIVERY LOGISTICS STRIP (Centered 1360px) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-lg p-5 sm:p-7 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] border border-[#E7E5E0] text-left space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E7E5E0]">
            <div>
              <span className="text-[10px] font-mono font-semibold text-[#8C7355] uppercase tracking-wider block">
                {language === 'sw' ? 'MALIPO & USAFIRISHAJI TANZANIA' : 'TANZANIA PAYMENTS & LOGISTICS'}
              </span>
              <h3 className="font-heading text-sm sm:text-base font-semibold text-[#111113]">
                {language === 'sw'
                  ? 'Mbinu za Malipo Rasmi na Usafirishaji wa Mabasi'
                  : 'Approved Payment Channels & Bus Terminal Waybills'}
              </h3>
            </div>
            <div className="text-xs text-[#6E6B66] font-normal">
              {language === 'sw' ? 'Stakabadhi halisi za TRA EFD zitatolewa' : 'Official TRA EFD tax invoices included with all orders'}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
            {[
              { label: 'M-Pesa', sub: 'Vodacom Lipa Namba', tag: 'Mobile Money' },
              { label: 'Mixx by Yas', sub: 'Tigo Pesa Network', tag: 'Mobile Money' },
              { label: 'Airtel Money', sub: 'Pay Direct to Till', tag: 'Mobile Money' },
              { label: 'CRDB / NMB', sub: 'Bank Wire & Cheque', tag: 'Institutional' },
              { label: 'Pay on Delivery', sub: 'Lipa Baada ya Mzigo', tag: 'Cash on Arrival' },
              { label: 'Mabasi Mikoa 31', sub: 'Abood, Shabiby, BM', tag: 'Same-Day Dispatch' },
            ].map((p, idx) => (
              <div key={idx} className="p-3 rounded-md bg-[#F9F8F6] border border-[#E7E5E0] hover:border-[#8C7355]/40 transition-all space-y-0.5">
                <span className="text-[9px] font-mono font-semibold text-[#8C7355] uppercase tracking-wider block">
                  {p.tag}
                </span>
                <div className="font-heading font-semibold text-xs text-[#111113]">{p.label}</div>
                <div className="text-[10px] text-[#6E6B66]">{p.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CONTACT & FACTORY LOCATION (Centered 1360px) */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-lg p-5 sm:p-8 shadow-[0_2px_8px_-2px_rgba(17,17,19,0.04)] border border-[#E7E5E0] text-left grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2 bg-[#F9F8F6] rounded-md p-5 border border-[#E7E5E0]">
            <div className="w-10 h-10 rounded-md bg-[#FFFFFF] text-[#8C7355] border border-[#E7E5E0] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#8C7355]" />
            </div>
            <h4 className="font-heading font-semibold text-sm text-[#111113]">
              {language === 'sw' ? 'Kiwanda cha Mbeya (Headquarters)' : 'Mbeya Factory (Headquarters)'}
            </h4>
            <p className="text-xs text-[#6E6B66] leading-relaxed font-normal">
              Soweto SIDO Industrial Estate, Plot 14-B,<br />
              Mbeya Municipal, Tanzania.<br />
              <span className="font-mono text-[#8C7355] font-semibold">Mon – Sat: 8:00 AM – 5:30 PM</span>
            </p>
          </div>

          <div className="space-y-2 bg-[#F9F8F6] rounded-md p-5 border border-[#E7E5E0]">
            <div className="w-10 h-10 rounded-md bg-[#FFFFFF] text-[#8C7355] border border-[#E7E5E0] flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#8C7355]" />
            </div>
            <h4 className="font-heading font-semibold text-sm text-[#111113]">
              {language === 'sw' ? 'Ghala la Dar es Salaam' : 'Dar es Salaam Regional Depot'}
            </h4>
            <p className="text-xs text-[#6E6B66] leading-relaxed font-normal">
              Plot 30 Block F Kilwa Road / Kariakoo Depot,<br />
              Dar es Salaam, Tanzania.<br />
              <span className="font-mono text-[#8C7355] font-semibold">Same-Day Bus Terminal Handoff</span>
            </p>
          </div>

          <div className="space-y-2 bg-[#F9F8F6] rounded-md p-5 border border-[#E7E5E0]">
            <div className="w-10 h-10 rounded-md bg-[#FFFFFF] text-[#8C7355] border border-[#E7E5E0] flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#8C7355]" />
            </div>
            <h4 className="font-heading font-semibold text-sm text-[#111113]">
              {language === 'sw' ? 'Mawasiliano ya Haraka' : 'Direct Wholesale Inquiries'}
            </h4>
            <p className="text-xs text-[#6E6B66] leading-relaxed font-normal">
              Phone: +255 715 268 391 / +255 746 268 391<br />
              Email: indigoprinter06423@gmail.com<br />
              <span className="font-mono text-emerald-700 font-semibold">WhatsApp Active 24/7</span>
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Feather,
  Package,
  Star,
  Truck,
  BookOpen,
  Mail,
  CheckCircle2,
  MessageCircle,
  Award,
  FileText,
  Building2,
  ChevronDown,
  Layers,
  FileCheck2,
  Boxes,
  X,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';
import { Hero } from '../components/Hero';
import { SEOHead } from '@/components/SEOHead';
import { TRANSLATIONS } from '@/data/translations';
import { ProductImage } from '@/components/ProductImage';
import {
  HaikeiWaveDivider,
  HaikeiBlobGlow,
  HaikeiPaperLines,
} from '@/components/HaikeiBackgrounds';

export const HomePage: React.FC = () => {
  const { products, language, addToCart, setIsCartDrawerOpen } = useStore();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [activeTab, setActiveTab] = useState<
    'all' | 'counter' | 'exercise' | 'bahasha' | 'registers'
  >('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeCollectionSlide, setActiveCollectionSlide] = useState(0);
  const [selectedCollection, setSelectedCollection] = useState<any | null>(null);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string>('');
  const bannerStudioPhoto = '/omega-products/q3-banner-light-red-bg.jpg';
  const collectionScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollToSlide = (index: number) => {
    setActiveCollectionSlide(index);
    if (collectionScrollRef.current) {
      const cardWidth = collectionScrollRef.current.clientWidth;
      collectionScrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleCollectionScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const slideIndex = Math.round(container.scrollLeft / container.clientWidth);
    if (slideIndex !== activeCollectionSlide && slideIndex >= 0 && slideIndex < 4) {
      setActiveCollectionSlide(slideIndex);
    }
  };

  // Filter products for the catalog showcase
  const filteredProducts = useMemo(() => {
    if (activeTab === 'counter') return products.filter((p) => p.category === 'Counter Books');
    if (activeTab === 'exercise') return products.filter((p) => p.category === 'Exercise Books');
    if (activeTab === 'bahasha') return products.filter((p) => p.category === 'Bahasha & Envelopes');
    if (activeTab === 'registers') return products.filter((p) => p.category === 'Registers' || p.category === 'Ruled Paper');

    const featured = products.filter((p) => p.featured || p.bestSeller);
    const regular = products.filter((p) => !p.featured && !p.bestSeller);
    return [...featured, ...regular];
  }, [products, activeTab]);

  const displayedProducts = filteredProducts.slice(0, 10);

  // 4 Collections matching user reference architecture (Horizontal card with features & book)
  const collections = useMemo(
    () => [
      {
        id: 'counter-books',
        number: '1',
        numBadge: '01',
        productId: 'prod-omega-cb-q3',
        badge: language === 'sw' ? 'JALADA GUMU' : 'ARCHIVAL SMYTH-SEWN',
        tag: 'QUIRE 2 - 4',
        title: language === 'sw' ? 'COUNTER BOOKS' : 'COUNTER BOOKS',
        subtitle: language === 'sw' ? 'Jalada Gumu la Archival, Q2, Q3 & Q4' : 'Hardcover Ledger Folios, Q2–Q4',
        features: [
          language === 'sw' ? 'Kurasa 192, 288 & 384' : '192, 288 & 384 Pages',
          language === 'sw' ? 'Smyth-Sewn 180° Flat' : 'Smyth-Sewn 180° Lay-Flat',
          language === 'sw' ? 'Karatasi ya 70 GSM Bond' : 'Pure 70 GSM Archival Bond',
        ],
        brand: 'Brand: OMEGA',
        cta: language === 'sw' ? 'EXPLORE' : 'EXPLORE',
        link: '/product/prod-omega-cb-q3',
        image: '/omega-products/counter-book-desk-podium.jpg',
        bgImage: '/omega-products/counter-book-card-bg.jpg',
        gallery: [
          '/omega-products/counter-book-desk-podium.jpg',
          '/omega-products/counter-book-card-bg.jpg',
          '/assets/aistudio/image_c7a05502.png',
          '/assets/aistudio/image_c6f045f0.png',
          '/omega-hero-book.webp',
          '/products/omega-hardcover-counter-book-q3-288-pages-800.webp',
          '/omega-products/counter-book-q3-288p.jpeg',
          '/omega-products/counter-book-q4-catalog.jpeg',
        ],
        variants: [
          { name: 'Quire 2 (Q2)', pages: '192 Pages', price: 'TSh 6,500', desc: 'Commercial Accounts & Store Ledgers' },
          { name: 'Quire 3 (Q3)', pages: '288 Pages', price: 'TSh 8,500', badge: 'BEST SELLER', desc: 'Secondary School & Institutional Standard' },
          { name: 'Quire 4 (Q4)', pages: '384 Pages', price: 'TSh 11,500', desc: 'Heavyweight Extended Ledger Folio' },
        ],
        specs: [
          'Pure 70 GSM archival white bond paper with zero ink bleed',
          'Precision Smyth-sewn binding opens 180° lay-flat',
          'Attractive rigid black & red hardcover board',
          'Manufactured to Tanzania institutional standards',
          'Daily bus cargo dispatch across all 31 regions',
        ],
      },
      {
        id: 'exercise-books',
        number: '2',
        numBadge: '02',
        productId: 'prod-omega-ex-200p-purple',
        badge: language === 'sw' ? 'VIWANGO VYA DARASA' : 'CLASSROOM BENCHMARK',
        tag: '70 GSM BOND',
        title: language === 'sw' ? 'EXERCISE BOOKS' : 'EXERCISE BOOKS',
        subtitle: language === 'sw' ? 'Madaftari ya Shule na Vyuo' : 'School & Classroom Editions',
        features: [
          language === 'sw' ? 'Kurasa 200, 100 & 80' : '200, 100 & 80 Pages',
          language === 'sw' ? 'Mistari Moja na Miwili' : 'Single & Double Line Ruling',
          language === 'sw' ? 'Jalada Ngumu lenye Ramani' : 'Durable Stiff Cover with Map',
        ],
        brand: 'Brand: OMEGA',
        cta: language === 'sw' ? 'EXPLORE' : 'EXPLORE',
        link: '/product/prod-omega-ex-200p-purple',
        image: '/products/omega-student-exercise-book-200-pages-single-line-800.webp',
        bgImage: '/omega-products/exercise-book-card-bg.jpg',
        gallery: [
          '/omega-products/exercise-book-card-bg.jpg',
          '/products/omega-student-exercise-book-200-pages-single-line-800.webp',
          '/omega-products/exercise-book-200p-sl-catalog.jpeg',
          '/omega-products/exercise-book-100p-catalog.jpeg',
          '/omega-products/exercise-book-80p-catalog.jpeg',
        ],
        variants: [
          { name: '200 Pages (Single Line / Double Line / Grid)', pages: '200 Pages', price: 'TSh 2,500', badge: 'POPULAR', desc: 'Secondary & College High-Volume Note Taking' },
          { name: '100 Pages Single Line', pages: '100 Pages', price: 'TSh 1,500', desc: 'Standard Classroom Subject Exercise Book' },
          { name: '80 Pages Single & Double Line', pages: '80 Pages', price: 'TSh 1,200', desc: 'Term Exercise Book for Primary & Secondary' },
          { name: '32 Pages Exercise Book', pages: '32 Pages', price: 'TSh 600', desc: 'Kindergarten & Early Primary Writing' },
        ],
        specs: [
          '70 GSM bright white bond writing paper',
          'Stiff protective cover featuring Tanzania national map',
          'Indigo precision ruled margins conforming to official syllabus',
          'Available in wholesale cartons of 100 pcs and 200 pcs',
        ],
      },
      {
        id: 'kraft-bahasha',
        number: '3',
        numBadge: '03',
        productId: 'prod-omega-bahasha-a4-pack',
        badge: language === 'sw' ? 'USALAMA WA HATI' : 'PEEL & SEAL SECURITY',
        tag: 'TEAR-PROOF',
        title: language === 'sw' ? 'KRAFT BAHASHA' : 'KRAFT BAHASHA',
        subtitle: language === 'sw' ? 'Bahasha za Hati Zisizochanika' : 'Tear-Resistant Document Mailers',
        features: [
          language === 'sw' ? 'Vipimo vya A3, A4, A5 & A6' : 'A3, A4, A5 & A6 Standard Sizes',
          language === 'sw' ? 'Karatasi Imara ya Kraft' : 'Heavy Tear-Resistant Kraft Paper',
          language === 'sw' ? 'Gundi ya Kujifunga Yenyewe' : 'Self-Adhesive Peel & Seal Strip',
        ],
        brand: 'Brand: OMEGA',
        cta: language === 'sw' ? 'EXPLORE' : 'EXPLORE',
        link: '/product/prod-omega-bahasha-a4-pack',
        image: '/products/omega-heavy-kraft-bahasha-envelopes-a4-pack-of-50-800.webp',
        bgImage: '/omega-products/kraft-bahasha-card-bg.jpg',
        gallery: [
          '/omega-products/kraft-bahasha-card-bg.jpg',
          '/products/omega-heavy-kraft-bahasha-envelopes-a4-pack-of-50-800.webp',
          '/omega-products/bahasha-a4-catalog.png',
          '/omega-products/bahasha-a3-catalog.jpeg',
          '/omega-products/bahasha-a5-catalog.jpeg',
        ],
        variants: [
          { name: 'A3 Heavy Kraft Bahasha', pages: 'Box of 250', price: 'TSh 35,000 / Box', desc: 'Tenders, Architectural Folios & Contracts' },
          { name: 'A4 Official Document Mailer', pages: 'Box of 500', price: 'TSh 45,000 / Box', badge: 'HIGH DEMAND', desc: 'Standard Office Mailer with Instant Peel & Seal' },
          { name: 'A5 & A6 Waybill Envelopes', pages: 'Box of 500', price: 'TSh 28,000 / Box', desc: 'Bus Parcel & Cargo Waybills' },
        ],
        specs: [
          'Extra-heavy pure virgin kraft fiber paper',
          'Tamper-evident self-adhesive peel & seal strip',
          'Water-resistant and tear-resistant protective barrier',
          'Wholesale carton box packaging for high security',
        ],
      },
      {
        id: 'registers',
        number: '4',
        numBadge: '04',
        productId: 'prod-omega-visitors-reg',
        badge: language === 'sw' ? 'KUMBUKUMBU ZA OFISI' : 'OFFICE & INSTITUTION',
        tag: 'GOLD FOIL',
        title: language === 'sw' ? 'OFFICE REGISTERS' : 'OFFICE REGISTERS',
        subtitle: language === 'sw' ? 'Daftari za Wageni na Mahudhurio' : 'Institutional Ledger Folios',
        features: [
          language === 'sw' ? 'Wageni Getini na Mahudhurio' : 'Visitor Gate & Student Attendance',
          language === 'sw' ? 'Karatasi Maalum ya 70 GSM' : '70 GSM Pure White Bond Paper',
          language === 'sw' ? 'Jalada Imara la Kudumu' : 'Rigid Foil Stamped Hardcover',
        ],
        brand: 'Brand: OMEGA',
        cta: language === 'sw' ? 'EXPLORE' : 'EXPLORE',
        link: '/product/prod-omega-visitors-reg',
        image: '/products/omega-security-gate-visitors-register-executive-foil-800.webp',
        bgImage: '/omega-products/office-register-card-bg.jpg',
        gallery: [
          '/omega-products/office-register-card-bg.jpg',
          '/products/omega-security-gate-visitors-register-executive-foil-800.webp',
          '/omega-products/stiff-cover-200-catalog.jpeg',
          '/omega-products/catalog-sheet-stiff-cover-200.jpeg',
        ],
        variants: [
          { name: 'Visitor Gate Register', pages: '200 Pages', price: 'TSh 9,500', desc: 'Security Gate, Check-In & Time Logs' },
          { name: 'Student & Staff Attendance Register', pages: '200 Pages', price: 'TSh 8,500', badge: 'INSTITUTIONAL', desc: 'Daily Official School & Ministry Attendance' },
          { name: 'Commercial Cash & Delivery Register', pages: '300 Pages', price: 'TSh 12,000', desc: 'Store Dispatch & Warehouse Waybills' },
        ],
        specs: [
          'Heavyweight stiff board binding with gold foil lettering',
          'Pure white 70 GSM ruled folio paper',
          'Reinforced spine engineered for years of frequent handling',
          'Compliant with TRA and corporate auditing guidelines',
        ],
      },
    ],
    [language]
  );

  const handleBannerBuyNow = () => {
    const featuredProd =
      products.find(
        (p) =>
          p.id === 'prod-omega-cb-q3' ||
          p.sku === 'OMG-CB-Q3' ||
          p.quire === 'Q3' ||
          p.quire === '3 Quire'
      ) ||
      products.find((p) => p.category === 'Counter Books') ||
      products[0];
    if (featuredProd) {
      addToCart(featuredProd.id, 1);
      setIsCartDrawerOpen(true);
    }
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen font-sans text-[var(--text)] selection:bg-[var(--red)]/30 selection:text-white transition-colors duration-200">
      <SEOHead
        title="OMEGA Writing Notebooks & Stationery | Quality for Every Page | Tanzania"
        description="Tanzania's benchmark manufacturer of Smyth-sewn Counter Books (Q2, Q3, Q4), Exercise Books, Kraft Bahasha, and Office Files. Factory-direct wholesale and upcountry bus parcel delivery."
      />

      {/* ========================================================================= */}
      {/* 1. HERO SHOWCASE SLIDER */}
      {/* ========================================================================= */}
      <Hero />

      {/* Haikei Organic Wave Transition between Hero & Trust Strip */}
      <HaikeiWaveDivider topFill="var(--bg)" fill="var(--surface-1)" />

      {/* ========================================================================= */}
      {/* 2. FOUR-PILLAR HALLMARK TRUST STRIP (Watermelon UI Micro-Elevation) */}
      {/* ========================================================================= */}
      <section className="bg-[var(--surface-1)] border-b border-[var(--border)] py-5 sm:py-6 relative z-10 transition-colors duration-200">
        <div className="omega-fluid-container">
          <div className="omega-trust-grid">
            
            {/* 1. Pure 70 GSM Bond */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="flex items-center gap-3.5 text-left p-2.5 rounded-xl hover:bg-[var(--surface-2)]/60 transition-colors"
            >
              <div className="w-11 h-11 rounded-2xl bg-[var(--red)]/10 border border-[var(--red)]/30 flex items-center justify-center text-[var(--red)] shrink-0 shadow-sm">
                <Award className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--text)] font-heading leading-tight">
                  PURE 70 GSM BOND
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] leading-tight mt-0.5 font-sans">
                  Zero ink-bleed, smooth writing finish
                </p>
              </div>
            </motion.div>

            {/* 2. Thread-Sewn Spines */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="flex items-center gap-3.5 text-left p-2.5 rounded-xl hover:bg-[var(--surface-2)]/60 transition-colors"
            >
              <div className="w-11 h-11 rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--text)] font-heading leading-tight">
                  THREAD-SEWN SPINES
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] leading-tight mt-0.5 font-sans">
                  Double-stitched for extreme durability
                </p>
              </div>
            </motion.div>

            {/* 3. Factory Direct Pricing */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="flex items-center gap-3.5 text-left p-2.5 rounded-xl hover:bg-[var(--surface-2)]/60 transition-colors"
            >
              <div className="w-11 h-11 rounded-2xl bg-[var(--red)]/10 border border-[var(--red)]/30 flex items-center justify-center text-[var(--red)] shrink-0 shadow-sm">
                <FileText className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--text)] font-heading leading-tight">
                  FACTORY DIRECT RATES
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] leading-tight mt-0.5 font-sans">
                  Transparent wholesale &amp; retail value
                </p>
              </div>
            </motion.div>

            {/* 4. 31 Regions Cargo */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.24 }}
              className="flex items-center gap-3.5 text-left p-2.5 rounded-xl hover:bg-[var(--surface-2)]/60 transition-colors"
            >
              <div className="w-11 h-11 rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] shrink-0 shadow-sm">
                <Truck className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--text)] font-heading leading-tight">
                  31 REGIONS CARGO
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] leading-tight mt-0.5 font-sans">
                  Daily freight via verified bus parcels
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SHOP BY COLLECTION (With Motion & Haikei Blobs) */}
      {/* ========================================================================= */}
      <section className="pt-10 sm:pt-14 pb-3 sm:pb-5 bg-[var(--bg)] relative overflow-hidden transition-colors duration-200">
        
        {/* Haikei Organic Blob Glow Accent */}
        <HaikeiBlobGlow color="gold" position="top-right" size="md" className="opacity-25" />
        <HaikeiBlobGlow color="red" position="bottom-left" size="lg" className="opacity-20" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 relative z-10">

          {/* Centered Editorial Header with Gold Hairline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2"
          >
            <span className="text-[10.5px] font-mono font-bold tracking-widest uppercase text-[var(--gold)] block">
              ★ TANZANIA BENCHMARK
            </span>
            <h2 className="omega-fluid-section-title font-serif font-bold tracking-tight text-[var(--text)]">
              {language === 'sw' ? 'MKUSANYIKO WA VITABU' : 'SHOP BY COLLECTION'}
            </h2>
            <div className="w-12 h-0.5 bg-[var(--gold)] mx-auto opacity-70" />
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto pt-1 font-sans">
              {language === 'sw'
                ? 'Gundua aina zote za madaftari ya OMEGA yaliyotengenezwa kwa viwango vya juu vya kimataifa.'
                : 'Explore archival counter folios, classroom exercise books, and tear-resistant kraft mailers.'}
            </p>
          </motion.div>

          {/* Collection Cards: shadcn/ui Inspired 2-Column Grid + Mobile Single-Slide Carousel */}
          <div
            ref={collectionScrollRef}
            onScroll={handleCollectionScroll}
            className="flex lg:grid lg:grid-cols-2 gap-6 overflow-x-auto snap-x snap-mandatory pb-4 lg:pb-0 scrollbar-none scroll-smooth px-1"
          >
            {collections.map((col: any, idx) => {
              const hasFullBg = Boolean(col.bgImage);
              return (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  onClick={() => {
                    setSelectedCollection(col);
                    setSelectedGalleryImg(col.image);
                  }}
                  className="w-[90vw] sm:w-[540px] lg:w-auto shrink-0 snap-center relative rounded-[24px] border border-zinc-200/70 bg-white p-5 sm:p-7 shadow-sm hover:shadow-xl group text-left cursor-pointer transition-all duration-300 flex flex-row items-stretch justify-between gap-3 sm:gap-5 overflow-hidden min-h-[270px] sm:min-h-[300px]"
                >
                  {/* Full-Card Seamless Photo Background (Extends behind both Text & Product, Zero White Haze) */}
                  {hasFullBg ? (
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                      <img
                        src={col.bgImage}
                        alt={col.title}
                        className="w-full h-full object-cover object-[76%_center] sm:object-right transition-transform duration-700 group-hover:scale-105"
                        loading="eager"
                      />
                      {/* Subtle natural left-side shadow strictly on the left 40% — zero white haze over the book */}
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(214,196,172,0.32)_0%,rgba(228,214,194,0.12)_30%,transparent_46%)]" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#FAF8F5] via-white to-[#F3ECE2]" />
                  )}

                  {/* Top-Right: Number & Action Link (Borderless Clean Pills) */}
                  <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20 flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 font-mono text-[11px] font-bold text-zinc-800 border-0 shadow-xs">
                      0{idx + 1}
                    </span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md text-zinc-800 group-hover:bg-zinc-900 group-hover:text-white transition-colors flex items-center justify-center border-0 shadow-xs">
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Left Side: Product Details Over Background */}
                  <div className="w-[57%] sm:w-[55%] min-w-0 flex flex-col justify-between self-stretch z-10">
                    <div>
                      {/* Badge & Tag (Borderless Single-Line Pills) */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                        <span className="inline-flex items-center whitespace-nowrap rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[8.5px] sm:text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-800 border-0 leading-none shadow-2xs">
                          {col.badge}
                        </span>
                        <span className="inline-flex items-center whitespace-nowrap rounded-full bg-[#F4F1EA]/95 backdrop-blur-xs px-2.5 py-1 text-[8.5px] sm:text-[10px] font-mono font-bold tracking-wider uppercase text-[#7A6852] border-0 leading-none shadow-2xs">
                          {col.tag}
                        </span>
                      </div>

                      {/* Book Title */}
                      <h3 className="font-serif text-xl sm:text-3xl font-bold tracking-tight text-zinc-900 group-hover:text-[var(--red)] transition-colors leading-[1.12]">
                        {col.title}
                      </h3>
                      <p className="text-[11px] sm:text-sm text-zinc-600 font-sans mt-1 mb-3 line-clamp-1 font-medium">
                        {col.subtitle}
                      </p>

                      {/* Refined Feature Checklist */}
                      <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-zinc-800 mb-4">
                        {col.features.map((feat: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-center gap-1.5 sm:gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8C7355] shrink-0" />
                            <span className="font-sans text-[11px] sm:text-xs text-zinc-800 font-medium leading-snug truncate">
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button & Brand */}
                    <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3.5 mt-auto">
                      <Link
                        to={col.link}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-zinc-900 hover:bg-[#D63A3A] active:scale-95 text-white font-mono text-[10.5px] sm:text-xs font-bold tracking-wider uppercase px-4 sm:px-5 py-2 sm:py-2.5 shadow-sm hover:shadow-md transition-all duration-200 group/btn whitespace-nowrap"
                      >
                        <span>{col.cta}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </Link>
                      <span className="text-[10px] sm:text-[11px] font-mono text-zinc-600 font-medium whitespace-nowrap">
                        {col.brand}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Visual Space for Full-Bleed Background Book OR Product Cutout */}
                  {hasFullBg ? (
                    <div className="w-[43%] sm:w-[45%] shrink-0 z-10 pointer-events-none" aria-hidden="true" />
                  ) : (
                    <div className="w-[43%] sm:w-[45%] h-48 sm:h-60 relative flex items-center justify-center shrink-0 z-10 self-center">
                      <img
                        src={col.image}
                        alt={col.title}
                        className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Carousel Single-Slide Indicators (Dots) */}
          <div className="flex md:hidden items-center justify-center gap-2 pt-1 pb-2">
            {collections.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => scrollToSlide(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeCollectionSlide === dotIdx
                    ? 'w-7 bg-[var(--red)] shadow-2xs'
                    : 'w-2 bg-[var(--border)] hover:bg-[var(--gold)]'
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* EXCLUSIVE BOOK DETAILS SLIDE-OVER DRAWER ("1 par touch Kiya to alag side") */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedCollection && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedCollection(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
              aria-label="Close modal overlay"
            />

            {/* Slide-Over Drawer Sheet */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative z-10 w-full max-w-lg bg-[var(--surface-1)] h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-[var(--border)]"
            >
              {/* Drawer Header */}
              <div className="sticky top-0 z-20 bg-[var(--surface-1)]/95 backdrop-blur-md p-5 border-b border-[var(--border)] flex items-center justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-700 bg-zinc-100 border-0 leading-none">
                      {selectedCollection.badge}
                    </span>
                    <span className="inline-flex items-center whitespace-nowrap text-[10px] font-mono font-bold tracking-wider uppercase text-[#7A6852] bg-[#F4F1EA] px-2.5 py-1 rounded-full border-0 leading-none">
                      {selectedCollection.tag}
                    </span>
                  </div>
                  <h2 className="font-heading font-black text-xl text-[var(--text)] mt-1.5 leading-tight">
                    {selectedCollection.title}
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
                    {selectedCollection.subtitle}
                  </p>
                </div>
                
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedCollection(null)}
                  className="w-10 h-10 rounded-full bg-[var(--surface-2)] hover:bg-[var(--red)] text-[var(--text)] hover:text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer border border-[var(--border)] shrink-0"
                  aria-label="Close"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Drawer Body: Exclusive Book Photos & Full Details */}
              <div className="p-5 sm:p-6 space-y-6 flex-1 text-left">
                {/* Large Featured Photo */}
                <div className="w-full aspect-[4/3] rounded-2xl bg-[#FAF8F5] border border-[#E7E5E0] overflow-hidden flex items-center justify-center p-4 relative">
                  <img
                    src={selectedGalleryImg || selectedCollection.image}
                    alt={selectedCollection.title}
                    className="max-h-full max-w-full object-contain mix-blend-multiply transition-all duration-300"
                  />
                </div>

                {/* Photo Gallery Thumbnails */}
                {selectedCollection.gallery && selectedCollection.gallery.length > 1 && (
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-2">
                      Official Factory Photos ({selectedCollection.gallery.length})
                    </span>
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                      {selectedCollection.gallery.map((imgUrl: string, gIdx: number) => (
                        <button
                          key={gIdx}
                          type="button"
                          onClick={() => setSelectedGalleryImg(imgUrl)}
                          className={`w-16 h-16 rounded-xl overflow-hidden p-1 bg-[#FAF8F5] border-2 transition-all shrink-0 cursor-pointer ${
                            (selectedGalleryImg || selectedCollection.image) === imgUrl
                              ? 'border-[#111113] shadow-sm'
                              : 'border-[#E7E5E0] hover:border-[var(--gold)] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-contain mix-blend-multiply" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Variants & Page Counts */}
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-2.5">
                    Available Quires & Editions
                  </span>
                  <div className="space-y-2">
                    {selectedCollection.variants?.map((v: any, vIdx: number) => (
                      <div
                        key={vIdx}
                        className="p-3.5 rounded-xl bg-white border border-[var(--border)] hover:border-[var(--gold)] transition-colors flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[var(--text)] font-heading leading-tight">
                              {v.name}
                            </h4>
                            {v.badge && (
                              <span className="px-2 py-0.5 rounded-full bg-[var(--red)] text-white text-[9px] font-mono font-bold">
                                {v.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11.5px] text-[var(--text-muted)] mt-0.5">
                            {v.desc}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono font-extrabold text-sm text-[var(--text)] block">
                            {v.price}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">
                            {v.pages}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benchmark Technical Specifications */}
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-2.5">
                    Certified Technical Specifications
                  </span>
                  <ul className="space-y-2 text-xs text-[var(--text)]">
                    {selectedCollection.specs?.map((spec: string, sIdx: number) => (
                      <li key={sIdx} className="flex items-start gap-2.5">
                        <span className="w-4.5 h-4.5 rounded-full bg-[var(--red)]/10 text-[var(--red)] flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                        </span>
                        <span className="leading-relaxed">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="sticky bottom-0 z-20 bg-[var(--surface-1)] border-t border-[var(--border)] p-4 sm:p-5 space-y-2.5">
                <Link
                  to={selectedCollection.link}
                  onClick={() => setSelectedCollection(null)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D63A3A] hover:bg-[#b91c1c] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md cursor-pointer"
                >
                  <span>View Product Details & Order</span>
                  <ArrowRight size={16} />
                </Link>
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono px-1">
                  <span>Factory Direct Dispatch</span>
                  <span>31 Regions Cargo</span>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. SIGNATURE FEATURED BANNER (Watermelon UI Depth + Motion) */}
      {/* ========================================================================= */}
      {/* 4. SIGNATURE FEATURED BANNER (Full-Bleed Soft Light-Red Studio Scene) */}
      {/* ========================================================================= */}
      <section
        aria-label="Signature Banner"
        className="omega-fluid-container pt-2 sm:pt-4 pb-8 sm:pb-12 omega-banner-container"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative w-full rounded-[24px] overflow-hidden bg-gradient-to-r from-[#E6ACA7] via-[#F2C4C0] to-[#F5CCC8] border border-[#E2B0AC]/70 p-6 sm:p-9 lg:p-12 shadow-xl transition-all duration-300 min-h-[300px] sm:min-h-[360px] lg:min-h-[400px] flex items-center group"
        >
          {/* Full-Card Seamless Soft Light-Red Studio Photo Background (Desktop & Tablet) */}
          <div className="hidden sm:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src={bannerStudioPhoto}
              alt="OMEGA Hardcover Counter Book 180° Lay-Flat Studio Photo"
              className="w-full h-full object-cover object-right transition-transform duration-700 group-hover:scale-[1.03]"
              loading="eager"
            />
            {/* Gentle left-side warm rose shadow strictly on the left 42% — zero white haze */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(186,118,114,0.26)_0%,rgba(210,148,144,0.10)_30%,transparent_46%)]" />
          </div>

          <div className="relative z-10 w-full omega-banner-layout">
            
            {/* Left Content Column Over Soft Light-Red Studio Backdrop */}
            <div className="space-y-4 sm:space-y-5 text-left max-w-lg">
              
              {/* Headline with Gold Badge */}
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#F3D28A] via-[#E9B44C] to-[#B8862B] text-zinc-950 text-[9.5px] sm:text-[10px] font-mono font-black uppercase tracking-wider shadow-xs border-0">
                  <span>★</span>
                  <span>BEST SELLER · QUIRE 3</span>
                </div>
                <h2 className="omega-fluid-banner-title font-serif font-bold text-zinc-950 tracking-tight leading-[1.1]">
                  Counter Book Q3, Hardcover
                </h2>
                <p className="omega-fluid-body text-zinc-800 max-w-md font-sans font-medium leading-relaxed">
                  288 pages of pure 70 GSM archival bond paper. Precision Smyth-sewn binding opens 180° flat, engineered for commercial accountants, schools, and tenders.
                </p>
              </div>

              {/* Price & Action Row */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <span className="text-2xl sm:text-3xl font-mono font-black text-zinc-950 tabular-nums mr-1">
                  TSh 8,500
                </span>

                {/* Primary Action Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleBannerBuyNow}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C92A2A] hover:bg-[#A61E1E] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-red-950/25 cursor-pointer"
                >
                  <span>BUY NOW</span>
                  <ArrowRight size={15} strokeWidth={2.2} />
                </motion.button>
              </div>

            </div>

            {/* Right Visual Space: Seamless Book & Open Spread on Studio Surface */}
            <div className="w-full flex items-center justify-center relative">
              {/* Mobile seamless blend of the right half of the light-red studio scene (no inner border box) */}
              <div className="sm:hidden w-full -mx-2 -mb-2 pt-1 overflow-hidden rounded-xl">
                <img
                  src={bannerStudioPhoto}
                  alt="OMEGA Hardcover Counter Book 180° Lay-Flat Studio Photo"
                  className="w-full h-52 object-cover object-[86%_center] scale-105"
                />
              </div>
              {/* Desktop spacer so the full-bleed background book on the right has full breathing room */}
              <div className="hidden sm:block w-full h-64 lg:h-72 pointer-events-none" aria-hidden="true" />
            </div>

          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED NOTEBOOKS & BOOKS */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[var(--bg)] border-t border-[var(--border)] transition-colors duration-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

          {/* Centered Editorial Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2"
          >
            <span className="text-[10.5px] font-mono font-bold tracking-widest uppercase text-[var(--gold)] block">
              ★ OFFICIAL CATALOGUE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--text)]">
              {language === 'sw' ? 'MKUSANYIKO WA VITABU' : 'FEATURED STATIONERY'}
            </h2>
            <div className="w-12 h-0.5 bg-[var(--gold)] mx-auto opacity-70" />
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto pt-1 font-sans">
              {language === 'sw'
                ? 'Vitabu na madaftari yenye viwango vya juu vya ubora vinavyopendwa kote Tanzania.'
                : 'Benchmark ledger books, classroom exercise books and tear-resistant kraft mailers.'}
            </p>
          </motion.div>

          {/* shadcn/ui Tabs Style Category Filter Strip */}
          <div className="w-full overflow-x-auto no-scrollbar py-2 mb-6 sm:mb-8 touch-pan-x">
            <div className="flex items-center justify-start sm:justify-center min-w-max mx-auto px-4">
              <div className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-100 p-1 border border-zinc-200/80 shadow-2xs gap-1">
                {[
                  { id: 'all', label: t.allProducts || 'All Products' },
                  { id: 'counter', label: 'Counter Books' },
                  { id: 'exercise', label: 'Exercise Books' },
                  { id: 'bahasha', label: 'Kraft Bahasha' },
                  { id: 'registers', label: 'Registers' },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-white text-zinc-900 shadow-xs ring-1 ring-black/5'
                          : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/60'
                      }`}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8C7355] mr-2 inline-block shrink-0" />
                      )}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Product Cards Grid with Proper Padding & Margins */}
          <div className="omega-product-grid pt-2">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Secondary Button: "View All Products" */}
          <div className="pt-4 text-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--gold)] text-[var(--text)] hover:text-[var(--gold)] text-xs font-mono font-bold tracking-widest uppercase transition-all group shadow-sm"
              >
                <span>{language === 'sw' ? 'TAZAMA BIDHAA ZOTE' : 'VIEW ALL PRODUCTS'}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 stroke-[2]" />
              </Link>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Haikei Organic Wave Transition */}
      <HaikeiWaveDivider topFill="var(--bg)" fill="var(--surface-1)" />

      {/* ========================================================================= */}
      {/* 5.5. THE ANATOMY OF AN OMEGA SMYTH-SEWN BOOK (Motion & Watermelon UI) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[var(--surface-1)] border-b border-[var(--border)] relative overflow-hidden transition-colors duration-200 scroll-mt-24">
        
        {/* Haikei Contour Lines for Craftsmanship */}
        <HaikeiPaperLines opacity={0.05} />
        <HaikeiBlobGlow color="gold" position="top-left" size="lg" className="opacity-20" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2.5 max-w-2xl mx-auto"
          >
            <span className="text-[10.5px] font-mono font-bold tracking-widest uppercase text-[var(--gold)] block">
              ★ THE OMEGA ENGINEERING STANDARD
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text)]">
              {language === 'sw'
                ? 'Muundo wa Ndani wa Daftari la OMEGA'
                : 'Anatomy of Archival Craftsmanship'}
            </h2>
            <div className="w-12 h-0.5 bg-[var(--gold)] mx-auto opacity-70" />
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              {language === 'sw'
                ? 'Tofauti kati ya daftari linalochakaa haraka na daftari la OMEGA inatokana na vipengele 4 vya kiufundi vilivyobuniwa kudumu miaka kumi.'
                : 'Engineered from raw greyboard to spine stitching for executives, scholars, and institutional archives across East Africa.'}
            </p>
          </motion.div>

          {/* 4 Technical Pillar Cards with Stagger Animation - Icon Left, Text Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            
            {/* Component 1: 1.8mm Greyboard */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              whileHover={{ y: -4 }}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Icon Left + Text Right */}
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[var(--red)]/10 border border-[var(--red)]/20 flex items-center justify-center text-[var(--red)] shrink-0 shadow-2xs">
                    <Layers className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="min-w-0 text-left">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-zinc-900 leading-tight truncate">
                      1.8mm Rigid Greyboard
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed text-left">
                  High-caliper dense board with protective matte laminate. Resists tropical humidity, bending, and corner fraying over decades of daily ledger filing.
                </p>
              </div>
            </motion.div>

            {/* Component 2: Smyth Thread Spine */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.12 }}
              whileHover={{ y: -4 }}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Icon Left + Text Right */}
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center text-[var(--gold)] shrink-0 shadow-2xs">
                    <BookOpen className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="min-w-0 text-left">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-zinc-900 leading-tight truncate">
                      Smyth Thread Sewing
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed text-left">
                  Double-threaded cotton stitching through the fold. Book lays 180° flat naturally on flat desks, with zero risk of leaves detaching like cheap glued books.
                </p>
              </div>
            </motion.div>

            {/* Component 3: 70 GSM Bond */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.18 }}
              whileHover={{ y: -4 }}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Icon Left + Text Right */}
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[var(--red)]/10 border border-[var(--red)]/20 flex items-center justify-center text-[var(--red)] shrink-0 shadow-2xs">
                    <Feather className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="min-w-0 text-left">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-zinc-900 leading-tight truncate">
                      70 GSM Bleed-Proof Bond
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed text-left">
                  Pure white woodfree bond paper calibrated for high opacity. Fountain pen ink, ballpoints, and highlighters write smoothly without bleed-through or ghosting.
                </p>
              </div>
            </motion.div>

            {/* Component 4: NECTA Ruling */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.24 }}
              whileHover={{ y: -4 }}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Icon Left + Text Right */}
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center text-[var(--gold)] shrink-0 shadow-2xs">
                    <FileCheck2 className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="min-w-0 text-left">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-zinc-900 leading-tight truncate">
                      NECTA &amp; Standard Ruling
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed text-left">
                  Optically balanced soft cyan feint lines with vibrant red security margin rules, compliant with Tanzanian national school curriculum guidelines.
                </p>
              </div>
            </motion.div>

          </div>

        </div>
      </section>



      {/* ========================================================================= */}
      {/* 7. PROMOTIONAL WHOLESALE CARTON RATES BANNER */}
      {/* ========================================================================= */}
      <section className="bg-[var(--surface-2)] text-[var(--text)] border-b border-[var(--border)] py-8 sm:py-12 relative overflow-hidden transition-colors duration-200">
        <HaikeiBlobGlow color="red" position="center" size="lg" className="opacity-25" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            
            {/* Left: 20% OFF Cartons */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-[var(--red)] tracking-tight leading-none">
                20<span className="text-xl sm:text-2xl font-sans">%</span>
                <span className="block text-[11px] font-mono font-bold tracking-widest uppercase text-[var(--gold)]">
                  OFF CARTONS
                </span>
              </div>
              <div className="w-px h-12 bg-[var(--border)] hidden sm:block" />
            </div>

            {/* Center: Editorial Offer Copy */}
            <div className="space-y-1 max-w-xl">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[var(--text)] tracking-wide">
                {language === 'sw'
                  ? 'Kwa sababu taasisi yako inastahili ubora usio na kifani.'
                  : 'Because your institution deserves genuine lasting quality.'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-sans">
                {language === 'sw'
                  ? 'Furahia punguzo la kiwandani kwa oda zote za jumla za katoni za vitabu na bahasha.'
                  : 'Enjoy special factory carton rates on all bulk counter books and exercise reams for schools and tenders.'}
              </p>
            </div>

            {/* Right: Filled Red CTA Button */}
            <div className="shrink-0">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/wholesale"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[var(--red)] hover:bg-[var(--red-hover)] text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors shadow-md shadow-red-950/40 cursor-pointer"
                >
                  <span>{language === 'sw' ? 'BEI ZA JUMLA' : 'SHOP WHOLESALE CARTONS'}</span>
                </Link>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7.5. B2B VOLUME TIERS & FREIGHT DISPATCH (Watermelon UI Tiers + Motion) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[var(--bg)] border-b border-[var(--border)] relative overflow-hidden transition-colors duration-200">
        
        <HaikeiBlobGlow color="gold" position="bottom-right" size="lg" className="opacity-20" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 max-w-2xl mx-auto"
          >
            <span className="text-[10.5px] font-mono font-bold tracking-widest uppercase text-[var(--gold)] block">
              ★ INSTITUTIONAL PROCUREMENT
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
              {language === 'sw'
                ? 'Viwango vya Bei ya Jumla & Usafirishaji'
                : 'B2B Wholesale Tiers & Direct Freight'}
            </h2>
            <div className="w-12 h-0.5 bg-[var(--gold)] mx-auto opacity-70" />
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              {language === 'sw'
                ? 'Agiza moja kwa moja kutoka kiwandani kwa katoni au kontena. Tunafanya usafirishaji wa haraka mikoa yote 31 ya Tanzania.'
                : 'Direct factory pricing tiers for retail bookshops, private academies, corporate offices, and government tenders.'}
            </p>
          </motion.div>

          {/* 3 Tier Cards with Motion Hover and Elevate */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tier 1: Small Enterprise */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              whileHover={{ y: -6 }}
              className="p-7 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--gold)]/40 transition-colors shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">
                    TIER 1 · STARTER
                  </span>
                  <Boxes className="w-5 h-5 text-[var(--text-muted)]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[var(--text)]">
                    Retail &amp; Private Academies
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Ideal for individual school terms, stationery shops, and private clinics.
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-[var(--border)] text-xs text-[var(--text)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0" />
                    <span>Minimum Order: <strong>1 to 5 Cartons</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0" />
                    <span>Next-Day Bus Parcel Dispatch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0" />
                    <span>Standard Factory Wholesale Rates</span>
                  </div>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/catalog"
                  className="w-full block py-3 rounded-full bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--gold)] text-center text-xs font-mono font-bold text-[var(--text)] hover:text-[var(--gold)] tracking-wider uppercase transition-colors"
                >
                  Browse Standard Cartons
                </Link>
              </motion.div>
            </motion.div>

            {/* Tier 2: Wholesale Stockist (Recommended) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.12 }}
              whileHover={{ y: -8 }}
              className="p-7 rounded-2xl bg-[var(--surface-1)] border-2 border-[var(--gold)] shadow-xl relative flex flex-col justify-between space-y-6"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-[var(--gold)] text-black text-[10px] font-mono font-black uppercase tracking-wider shadow-sm">
                MOST POPULAR
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[10px] font-mono font-bold text-[var(--gold)] uppercase">
                    TIER 2 · STOCKIST
                  </span>
                  <Award className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[var(--text)]">
                    Regional Wholesale Stockists
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Supplying districts, secondary schools, universities, and commercial suppliers.
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-[var(--border)] text-xs text-[var(--text)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0" />
                    <span>Volume: <strong>6 to 40 Cartons</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0" />
                    <span><strong>15% Additional Volume Discount</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0" />
                    <span>Free Waybill Insurance to Kariakoo &amp; Upcountry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0" />
                    <span>Priority Production Reservation</span>
                  </div>
                </div>
              </div>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                href="https://wa.me/255746268391?text=Habari%20OMEGA%2C%20ninaomba%20bei%20za%20jumla%20za%20katoni%206%2B%20(Tier%202%20Stockist)."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-full bg-[var(--red)] hover:bg-[var(--red-hover)] text-center text-xs font-mono font-bold text-white tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp RFQ</span>
              </motion.a>
            </motion.div>

            {/* Tier 3: Institutional Tenders */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.18 }}
              whileHover={{ y: -6 }}
              className="p-7 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--gold)]/40 transition-colors shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">
                    TIER 3 · ENTERPRISE
                  </span>
                  <Building2 className="w-5 h-5 text-[var(--text-muted)]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[var(--text)]">
                    National Tenders &amp; Gov
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Ministries, multinational banks, NGOs, and national examination councils.
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-[var(--border)] text-xs text-[var(--text)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0" />
                    <span>Volume: <strong>40+ Cartons / Container</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0" />
                    <span>Custom School Crest Foil Stamping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0" />
                    <span>TRA EFD Fiscal Tax Invoices Provided</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0" />
                    <span>Dedicated Pallet Truck Logistics</span>
                  </div>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/school-tenders"
                  className="w-full block py-3 rounded-full bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--gold)] text-center text-xs font-mono font-bold text-[var(--text)] hover:text-[var(--gold)] tracking-wider uppercase transition-colors"
                >
                  Inquire Tender Desk
                </Link>
              </motion.div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. "LOVED BY OUR CLIENTS" */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[var(--bg)] border-b border-[var(--border)] transition-colors duration-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2"
          >
            <span className="text-[10.5px] font-mono font-bold tracking-widest uppercase text-[var(--gold)] block">
              ★ CLIENT TESTIMONIALS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--text)]">
              {language === 'sw' ? 'WATEJA WETU WANASEMAJE' : 'LOVED BY OUR CLIENTS'}
            </h2>
            <div className="w-12 h-0.5 bg-[var(--gold)] mx-auto opacity-70" />
          </motion.div>

          {/* 3 Review Cards with Motion Entrance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Review 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--gold)]/40 space-y-4 flex flex-col justify-between transition-colors shadow-sm"
            >
              <div className="pb-3.5 border-b border-[var(--border)] flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[var(--surface-2)] text-[var(--gold)] font-mono font-bold flex items-center justify-center text-xs shrink-0 border border-[var(--border)]">
                    EK
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[var(--text)] truncate">Emanuel Kiwanga</h4>
                    <p className="text-[10.5px] text-[var(--text-muted)] font-mono truncate">
                      Chief Accountant · Dar es Salaam
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5 text-[var(--gold)] shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[var(--gold)] text-[var(--gold)]" />
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text)] italic leading-relaxed font-sans text-left">
                “Daftari la OMEGA Quire 3 lina karatasi ngumu sana na jalada lisilopinda. Linanisaidia sana kwenye mahesabu ya kila mwezi bila wino kupenya kabisa.”
              </p>
            </motion.div>

            {/* Review 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.12 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--gold)]/40 space-y-4 flex flex-col justify-between transition-colors shadow-sm"
            >
              <div className="pb-3.5 border-b border-[var(--border)] flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[var(--surface-2)] text-[var(--gold)] font-mono font-bold flex items-center justify-center text-xs shrink-0 border border-[var(--border)]">
                    GM
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[var(--text)] truncate">Grace Mhando</h4>
                    <p className="text-[10.5px] text-[var(--text-muted)] font-mono truncate">
                      Head of Academics · Arusha
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5 text-[var(--gold)] shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[var(--gold)] text-[var(--gold)]" />
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text)] italic leading-relaxed font-sans text-left">
                “The Smyth-sewn binding of OMEGA exercise books is truly unmatched. Our secondary school orders 200-page single line books every term without fail.”
              </p>
            </motion.div>

            {/* Review 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.18 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--gold)]/40 space-y-4 flex flex-col justify-between transition-colors shadow-sm"
            >
              <div className="pb-3.5 border-b border-[var(--border)] flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[var(--surface-2)] text-[var(--gold)] font-mono font-bold flex items-center justify-center text-xs shrink-0 border border-[var(--border)]">
                    JM
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[var(--text)] truncate">Joseph Mollel</h4>
                    <p className="text-[10.5px] text-[var(--text-muted)] font-mono truncate">
                      Stationery Store Owner · Mwanza
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5 text-[var(--gold)] shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[var(--gold)] text-[var(--gold)]" />
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text)] italic leading-relaxed font-sans text-left">
                “Fast bus parcel dispatch to Mwanza! The kraft envelopes and ruled reams arrived safely packed in OMEGA branded cartons within 24 hours.”
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. VIP CONCIERGE & PRICE ALERTS */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[var(--surface-1)] text-[var(--text)] relative overflow-hidden transition-colors duration-200">
        
        <HaikeiBlobGlow color="red" position="top-right" size="lg" className="opacity-25" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            
            {/* Headline */}
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] tracking-tight">
              {language === 'sw' ? 'Ungana na OMEGA Stationery' : 'Connect with OMEGA Stationery'}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed font-sans">
              {language === 'sw'
                ? 'Pata taarifa za bei mpya za jumla, katalogi ya 2026 na ofa maalum za vifaa vya shule na ofisi.'
                : 'Receive official 2026 wholesale catalogs, bulk school tender announcements, and factory-direct price updates.'}
            </p>

            {/* Form with ONE filled red button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(language === 'sw' ? 'Asante! Tumepokea mawasiliano yako.' : 'Thank you! We received your details.');
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto pt-3"
            >
              <div className="relative w-full">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.75]" />
                <input
                  type="text"
                  required
                  placeholder={language === 'sw' ? 'Weka namba au barua pepe...' : 'Enter your email or phone number...'}
                  className="w-full pl-11 pr-4 py-3 rounded-full text-xs sm:text-sm bg-[var(--surface-2)] text-[var(--text)] placeholder:text-[var(--text-muted)] border border-[var(--border)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-all font-sans"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[var(--red)] hover:bg-[var(--red-hover)] text-white text-xs sm:text-sm font-bold uppercase tracking-wider font-mono transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-red-950/40"
              >
                <span>{language === 'sw' ? 'JIUNGE' : 'SUBSCRIBE'}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2]" />
              </motion.button>
            </form>

            {/* Bottom Guarantee Indicators */}
            <div className="flex items-center justify-center gap-4 pt-3 text-[11px] font-mono text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--gold)] stroke-[2]" />
                <span>Zero Spam Guarantee</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[var(--red)] stroke-[2]" />
                <span>Instant 2026 Price Catalog</span>
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Haikei Wave to Footer */}
      <HaikeiWaveDivider topFill="var(--surface-1)" fill="var(--bg)" />

    </div>
  );
};

export default HomePage;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Feather,
  Package,
  Compass,
  Star,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCT_CATEGORIES, ProductCategory } from '../types/store';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';

export const HomePage: React.FC = () => {
  const { products, storeConfig } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<
    'all' | 'counter' | 'exercise' | 'bahasha' | 'essentials'
  >('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/catalog?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/catalog');
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 3500);
    }
  };

  // Filter products for the featured section
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'counter') return p.category === 'Counter Books';
    if (activeTab === 'exercise') return p.category === 'Exercise Books';
    if (activeTab === 'bahasha')
      return p.category === 'Bahasha & Envelopes' || p.category === 'Files & Folders';
    if (activeTab === 'essentials')
      return p.category === 'School Stationery' || p.category === 'Office Supplies';
    return p.featured || p.bestSeller;
  });

  const displayedProducts = filteredProducts.slice(0, 8);

  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');
  const whatsappGreetingUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    `Hello ${storeConfig.businessName}, I would like to inquire about stationery and book availability.`
  )}`;

  // Category cards configuration with real imagery
  const categoryHighlights = [
    {
      title: 'COUNTER BOOKS',
      subtitle: 'Plan a more intentional life',
      link: '/catalog?category=Counter+Books',
      image: '/omega-products/counter-book-q2-192p.jpeg',
    },
    {
      title: 'EXERCISE BOOKS',
      subtitle: 'Capture what matters',
      link: '/catalog?category=Exercise+Books',
      image: '/omega-products/exercise-book-200p-purple.jpeg',
    },
    {
      title: 'BAHASHA ENVELOPES',
      subtitle: 'The finer details',
      link: '/catalog?category=Bahasha+%26+Envelopes',
      image: '/omega-products/bahasha-a4-envelope.jpeg',
    },
    {
      title: 'EXECUTIVE FILING',
      subtitle: 'Thoughtful by design',
      link: '/catalog?category=Files+%26+Folders',
      image: '/omega-products/omega-pvc-spring-file.jpeg',
    },
    {
      title: 'SCHOOL ESSENTIALS',
      subtitle: 'A smoother, brighter flow',
      link: '/catalog?category=School+Stationery',
      image: '/omega-products/oxford-mathematical-set.jpeg',
    },
    {
      title: 'BULK PAPER REAMS',
      subtitle: 'Fresh inspiration',
      link: '/catalog?category=Bulk+%26+Wholesale+Paper',
      image: '/omega-products/ruled-paper-pack.jpeg',
    },
  ];

  return (
    <div className="bg-[#faf7f2] min-h-screen">
      <SEOHead
        title="Write Beautiful Ideas Into Life — Luxury Stationery & Books"
        description="Discover Tanzania's premier OMEGA Counter Books, Indigo exercise books, kraft bahasha envelopes, and school stationery crafted for excellence."
      />

      {/* ==================== 1. HERO SECTION (Velvet Note Aesthetic) ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf8f5] via-[#f7efe7] to-[#faf7f2] border-b border-[#ebdcd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Editorial Content */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6 lg:pr-4">
              <div className="space-y-4">
                <p className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#7c293a]">
                  MORE THAN STATIONERY
                </p>

                <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2d0910] leading-[1.08] tracking-tight">
                  Write Beautiful Ideas Into Life
                </h1>

                <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl font-normal">
                  Luxury academic stationery &amp; hardcover counter books for a more intentional,
                  inspired you. Thoughtfully designed. Beautifully crafted. Made for the moments
                  that matter.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/catalog"
                  className="px-7 py-3.5 bg-[#4a121c] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-lg hover:bg-[#340b13] transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2 group"
                >
                  <span>SHOP BESTSELLERS</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/about"
                  className="px-7 py-3.5 bg-transparent border border-[#4a121c] text-[#4a121c] text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-lg hover:bg-[#4a121c]/5 transition-colors inline-flex items-center gap-2"
                >
                  <span>EXPLORE OUR STORY</span>
                </Link>
              </div>

              {/* Value Proposition Icons (Row of 4 matching the image) */}
              <div className="pt-8 border-t border-[#ebdcd0] grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col items-start gap-1">
                  <Feather className="w-5 h-5 text-[#8b3d4d] stroke-[1.5]" />
                  <span className="text-[10px] font-bold tracking-wider uppercase text-stone-800">
                    PREMIUM MATERIALS
                  </span>
                  <span className="text-[11px] text-stone-500">High-opacity paper</span>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <ShieldCheck className="w-5 h-5 text-[#8b3d4d] stroke-[1.5]" />
                  <span className="text-[10px] font-bold tracking-wider uppercase text-stone-800">
                    TIMELESS DESIGN
                  </span>
                  <span className="text-[11px] text-stone-500">Stiff hardboard binding</span>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <Package className="w-5 h-5 text-[#8b3d4d] stroke-[1.5]" />
                  <span className="text-[10px] font-bold tracking-wider uppercase text-stone-800">
                    BEAUTIFUL GIFTING
                  </span>
                  <span className="text-[11px] text-stone-500">Branded cartons</span>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <Sparkles className="w-5 h-5 text-[#8b3d4d] stroke-[1.5]" />
                  <span className="text-[10px] font-bold tracking-wider uppercase text-stone-800">
                    A MORE MINDFUL YOU
                  </span>
                  <span className="text-[11px] text-stone-500">Purposeful writing</span>
                </div>
              </div>
            </div>

            {/* Right Curated Photography Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                <div className="aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden relative">
                  <img
                    src="/omega-products/counter-book-q3-288p.jpeg"
                    alt="OMEGA Luxury Counter Book and Stationery set"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Cursive Handwriting Badge Overlay */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-md border border-[#ebdcd0]/80">
                    <p className="font-script text-xl sm:text-2xl text-[#4a121c] leading-tight">
                      Stationery for a More Meaningful Life
                    </p>
                  </div>

                  {/* Bottom Product Feature Caption */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between gap-4 text-white">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest font-semibold text-[#f8d7da]">
                        OMEGA SIGNATURE COLLECTION
                      </p>
                      <h3 className="font-serif-luxury text-lg sm:text-xl font-bold">
                        Q3 Executive Counter Book · 288 Pages
                      </h3>
                    </div>
                    <Link
                      to="/product/prod-omega-cb-q3"
                      className="px-4 py-2 bg-white text-[#4a121c] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#faf7f2] transition-colors shrink-0 shadow-sm"
                    >
                      Inspect →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating Decorative Stamp Badge */}
              <div className="hidden sm:block absolute -bottom-5 -left-5 bg-[#faf7f2] p-3 rounded-2xl border border-[#ebdcd0] shadow-lg max-w-[220px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#4a121c] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    EST. 98
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#4a121c]">Ubora Unaouaminiwa</p>
                    <p className="text-[10px] text-stone-500">Proudly made in Tanzania</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. SHOP BY CATEGORY SECTION ==================== */}
      <section className="py-16 lg:py-20 bg-white border-b border-[#ebdcd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#2d0910]">
                Shop by Category
              </h2>
              <p className="text-sm text-stone-600 mt-1 font-normal">
                Curated paper goods, notebooks, and writing instruments designed to elevate your daily desk.
              </p>
            </div>
            <Link
              to="/catalog"
              className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#7c293a] hover:text-[#4a121c] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* 6 Category Photo Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {categoryHighlights.map((cat) => (
              <Link
                key={cat.title}
                to={cat.link}
                className="group flex flex-col bg-[#faf7f2] border border-[#ebdcd0] rounded-xl overflow-hidden hover:border-[#4a121c]/40 hover:shadow-md transition-all duration-300"
              >
                {/* Photo container */}
                <div className="aspect-square w-full bg-white p-3 overflow-hidden flex items-center justify-center border-b border-[#ebdcd0]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-108"
                  />
                </div>

                {/* Information */}
                <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <h3 className="text-xs font-bold tracking-wider uppercase text-stone-900 group-hover:text-[#4a121c] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{cat.subtitle}</p>
                  </div>

                  <div className="pt-1 flex items-center justify-end">
                    <span className="w-6 h-6 rounded-full bg-[#ebdcd0]/60 group-hover:bg-[#4a121c] group-hover:text-white text-stone-600 flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 3. FEATURED PRODUCTS SECTION ==================== */}
      <section className="py-16 lg:py-24 bg-[#faf7f2] border-b border-[#ebdcd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#2d0910]">
                Featured Products
              </h2>
              <p className="text-sm text-stone-600 mt-1 font-normal">
                Discover our most celebrated counter books, precision exercise notebooks, and office supplies.
              </p>
            </div>

            <Link
              to="/catalog"
              className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#7c293a] hover:text-[#4a121c] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 group"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Segmented Filter Control */}
          <div
            role="tablist"
            className="flex flex-wrap items-center gap-2 p-1 bg-[#f0e6dd] rounded-xl border border-[#ebdcd0] self-start"
          >
            {[
              { id: 'all', label: 'All Highlights' },
              { id: 'counter', label: 'Counter Books' },
              { id: 'exercise', label: 'Exercise Books' },
              { id: 'bahasha', label: 'Envelopes & Filing' },
              { id: 'essentials', label: 'School Essentials' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all uppercase tracking-wider ${
                  activeTab === tab.id
                    ? 'bg-[#4a121c] text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Luxury Product Grid (3 columns on desktop, 4 on xl) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Browse Full Catalog Button */}
          <div className="pt-6 flex justify-center">
            <Link
              to="/catalog"
              className="px-8 py-3.5 bg-white border border-[#4a121c] text-[#4a121c] hover:bg-[#4a121c] hover:text-white transition-all text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-lg inline-flex items-center gap-2 shadow-xs"
            >
              <span>Browse All {products.length} Products in Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== 4. EDITORIAL BANNER: SMALL RITUALS CREATE A BRIGHTER YOU ==================== */}
      <section className="py-16 lg:py-24 bg-white border-b border-[#ebdcd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Photographic Feature */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-[#faf7f2]">
                <img
                  src="/omega-products/exercise-book-200p-purple.jpeg"
                  alt="Open journal on styled desk with coffee and pen"
                  referrerPolicy="no-referrer"
                  className="w-full h-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#3b0d16]/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-xs p-4 rounded-xl border border-[#ebdcd0] max-w-xs shadow-md">
                  <p className="font-script text-xl text-[#4a121c]">
                    A More Intentional You
                  </p>
                  <p className="text-xs text-stone-600 mt-1">
                    Every morning starts with handwritten thoughts on smooth OMEGA pages.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Editorial Story & Value Grid */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#7c293a]">
                  A BRIGHTER EVERYDAY
                </p>
                <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2d0910] leading-tight">
                  Small Rituals Create a Brighter You
                </h2>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
                  Writing by hand sharpens memory, sparks discipline, and brings clarity to every
                  study session or business ledger. Discover tips, prompts and inspiration to make
                  thoughtful note-taking a part of your daily routine.
                </p>
              </div>

              <div>
                <Link
                  to="/catalog?category=Exercise+Books"
                  className="px-6 py-3 bg-[#4a121c] text-white text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-[#340b13] transition-colors inline-flex items-center gap-2 shadow-xs"
                >
                  <span>EXPLORE THE JOURNAL &amp; BOOKS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* 4 Feature Items with Icons */}
              <div className="pt-6 border-t border-[#ebdcd0] grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#faf0eb] text-[#4a121c] flex items-center justify-center shrink-0">
                    <Feather className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      CLARIFY YOUR THOUGHTS
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">Gain perspective through notes</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#faf0eb] text-[#4a121c] flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      SET MEANINGFUL GOALS
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">Turn curriculum into plans</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#faf0eb] text-[#4a121c] flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      CULTIVATE GRATITUDE
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">Notice the good each day</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#faf0eb] text-[#4a121c] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      LIVE MORE MINDFULLY
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">A calmer, happier student</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. GIFT & INSTITUTIONAL BUNDLES BANNER ==================== */}
      <section className="py-16 lg:py-20 bg-[#f7efe7] border-b border-[#ebdcd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white border border-[#ebdcd0] p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#7c293a]">
                THE SIGNATURE GIFT SET
              </p>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2d0910]">
                A More Meaningful Gift
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-lg font-normal">
                Beautifully packaged in authentic OMEGA protective cartons for life&apos;s special
                academic and corporate milestones. Curated stationery sets for classrooms,
                graduations, and office launches.
              </p>

              {/* Action */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={whatsappGreetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 bg-[#4a121c] text-white text-xs font-semibold tracking-wider uppercase rounded-lg hover:bg-[#340b13] transition-colors inline-flex items-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>SHOP GIFT SETS ON WHATSAPP →</span>
                </a>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold uppercase tracking-wider text-stone-700">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8b3d4d]" />
                  Premium Packaging
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8b3d4d]" />
                  A Lasting Impression
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8b3d4d]" />
                  For Dreamers &amp; Writers
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl overflow-hidden border border-[#ebdcd0] bg-[#faf7f2] p-4 shadow-md group">
                <img
                  src="/omega-products/omega-carton-box-branded.jpeg"
                  alt="OMEGA Official Packaging Box and Gift presentation"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 sm:h-72 object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#ebdcd0]">
                  <p className="font-script text-base text-[#4a121c]">
                    Thoughtful Gifts for Brighter Tomorrows
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. TESTIMONIALS SECTION (Real People. Meaningful Stories.) ==================== */}
      <section className="py-16 lg:py-24 bg-white border-b border-[#ebdcd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#2d0910]">
                Real People. Meaningful Stories.
              </h2>
              <p className="text-sm text-stone-600 mt-1 font-normal">
                Trusted by thousands of educators, accountants, and scholars across Tanzania.
              </p>
            </div>
            <Link
              to="/about"
              className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#7c293a] hover:text-[#4a121c] inline-flex items-center gap-1.5 group"
            >
              <span>View All Reviews</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="p-7 rounded-2xl bg-[#faf7f2] border border-[#ebdcd0] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-stone-700 italic leading-relaxed">
                  &ldquo;OMEGA has completely elevated our school stationery standards. The paper
                  weight prevents ink bleed, and the stiff covers endure the full school term
                  without tearing.&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#ebdcd0]/70">
                <div className="w-10 h-10 rounded-full bg-[#4a121c] text-white flex items-center justify-center font-bold text-sm">
                  SR
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-wider uppercase text-stone-900">
                    SOPHIA R.
                  </h4>
                  <p className="text-[11px] text-[#7c293a] font-medium">Verified School Headmistress</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-7 rounded-2xl bg-[#faf7f2] border border-[#ebdcd0] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-stone-700 italic leading-relaxed">
                  &ldquo;The perfect blend of durability and elegance. I bought the Q3 counter books
                  and the TRA thermal rolls for our retail audit branches. The binding is
                  exceptional.&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#ebdcd0]/70">
                <div className="w-10 h-10 rounded-full bg-[#4a121c] text-white flex items-center justify-center font-bold text-sm">
                  JT
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-wider uppercase text-stone-900">
                    JAMES T.
                  </h4>
                  <p className="text-[11px] text-[#7c293a] font-medium">Verified Chief Accountant</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-7 rounded-2xl bg-[#faf7f2] border border-[#ebdcd0] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-stone-700 italic leading-relaxed">
                  &ldquo;Such a proud Tanzanian brand. Everything arrived carefully packaged in
                  sealed OMEGA boxes. Ordering through WhatsApp was instantaneous.&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#ebdcd0]/70">
                <div className="w-10 h-10 rounded-full bg-[#4a121c] text-white flex items-center justify-center font-bold text-sm">
                  EK
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-wider uppercase text-stone-900">
                    EMILY K.
                  </h4>
                  <p className="text-[11px] text-[#7c293a] font-medium">University Scholar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 7. NEWSLETTER SECTION (Join Our Letter Club) ==================== */}
      <section className="py-14 lg:py-16 bg-[#faf7f2] border-b border-[#ebdcd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-1.5 text-center lg:text-left">
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2d0910]">
                Join Our Letter Club
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                Get exclusive catalog updates, new releases, and stationery inspiration straight to
                your inbox.
              </p>
            </div>

            {/* Form */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4">
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="px-4 py-2.5 text-xs sm:text-sm bg-white border border-[#ebdcd0] rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#4a121c] w-full sm:w-72"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4a121c] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-lg hover:bg-[#340b13] transition-colors whitespace-nowrap shrink-0 shadow-xs"
                >
                  {newsletterSubscribed ? 'SUBSCRIBED!' : 'SUBSCRIBE'}
                </button>
              </form>

              {/* Cursive Accented Note */}
              <span className="font-script text-xl sm:text-2xl text-[#7c293a] whitespace-nowrap">
                Good Ideas Brighter Days
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 8. STORE LOCATION & WHATSAPP COUNTER ==================== */}
      <section className="py-14 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-[#ebdcd0] rounded-2xl p-6 sm:p-10 bg-[#faf7f2] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c293a]">
                VISIT OR MESSAGE OUR STORE COUNTER
              </p>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2d0910]">
                Contact &amp; Store Location
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed font-normal">
                Have a school booklist, government tender, or bulk office stationery requirement?
                Reach out by phone, WhatsApp, or visit our Dar es Salaam headquarters during business hours.
              </p>

              <div className="space-y-3 pt-2 text-sm text-stone-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#7c293a] shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-stone-900">Headquarters Address: </span>
                    <span>{storeConfig.shopAddress}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#7c293a] shrink-0" />
                  <div>
                    <span className="font-semibold text-stone-900">Direct Phone: </span>
                    <span className="font-mono-tabular">{storeConfig.phoneNumber}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#7c293a] shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-stone-900">Operating Hours: </span>
                    <span>{storeConfig.businessHours}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              <a
                href={whatsappGreetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-5 py-3.5 bg-[#4a121c] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-lg hover:bg-[#340b13] transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp ({storeConfig.whatsappNumber})</span>
              </a>

              <a
                href={storeConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-5 py-3.5 bg-white text-stone-900 border border-[#ebdcd0] text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-lg hover:bg-[#faf7f2] transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Location in Google Maps</span>
              </a>

              <Link
                to="/catalog"
                className="w-full px-5 py-2 text-center text-xs font-semibold text-[#7c293a] hover:text-[#4a121c] underline underline-offset-4"
              >
                Explore All Products in Online Catalog →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

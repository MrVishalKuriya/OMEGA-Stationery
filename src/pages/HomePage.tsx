import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  MapPin,
  Phone,
  Clock,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCT_CATEGORIES } from '../types/store';
import { ProductCard } from '../components/ProductCard';
import { SEOHead } from '../components/SEOHead';
import { IMAGES } from '../data/products';

export const HomePage: React.FC = () => {
  const { products, storeConfig } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCollectionTab, setActiveCollectionTab] = useState<'featured' | 'bestsellers'>(
    'featured'
  );
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

  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const bestSellingProducts = products.filter((p) => p.bestSeller).slice(0, 6);
  const displayedProducts =
    activeCollectionTab === 'featured' ? featuredProducts : bestSellingProducts;

  const categoryCounts = PRODUCT_CATEGORIES.map((category) => ({
    category,
    count: products.filter((p) => p.category === category).length,
  }));

  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');
  const whatsappGreetingUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    `Hello ${storeConfig.businessName}, I would like to inquire about stationery and book availability.`
  )}`;

  return (
    <div>
      <SEOHead
        title="Everything You Need for Learning"
        description="Books, notebooks, stationery and school essentials for students, teachers and professionals. Browse 35+ products and order via WhatsApp."
      />

      {/* Storefront Search & Category Bar */}
      <section className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search OMEGA exercise books, A4 registers, fountain pens, SKU..."
                aria-label="Search stationery catalog"
                className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-md text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-red-700"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 text-xs text-stone-600 overflow-x-auto py-1">
            <span className="font-semibold text-stone-800 shrink-0">Quick Browse:</span>
            {PRODUCT_CATEGORIES.slice(0, 4).map((cat, idx) => (
              <React.Fragment key={cat}>
                {idx > 0 && <span aria-hidden="true">·</span>}
                <Link
                  to={`/catalog?category=${encodeURIComponent(cat)}`}
                  className="hover:text-red-700 hover:underline whitespace-nowrap shrink-0"
                >
                  {cat}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Column */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-red-700">
                  <span>{storeConfig.logoText}</span>
                  <span aria-hidden="true">·</span>
                  <span>Academic &amp; Office Storefront</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-[1.12]">
                  Everything You Need for Learning
                </h1>

                <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                  Books, notebooks, stationery and school essentials for students, teachers and
                  professionals.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to="/catalog"
                    className="px-6 py-3 bg-red-700 text-white text-sm font-semibold rounded-md hover:bg-red-800 transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/contact"
                    className="px-6 py-3 bg-white text-stone-900 border border-stone-300 text-sm font-semibold rounded-md hover:bg-stone-50 transition-colors whitespace-nowrap shrink-0"
                  >
                    Contact Us
                  </Link>
                </div>

                {/* Highlights */}
                <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-4 text-left">
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-stone-900 font-mono-tabular">
                      {products.length} Items
                    </p>
                    <p className="text-xs text-stone-500">Across 8 Categories</p>
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-stone-900 font-mono-tabular">
                      ₹{storeConfig.freeDeliveryThreshold}+
                    </p>
                    <p className="text-xs text-stone-500">Free Local Delivery</p>
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-stone-900">WhatsApp</p>
                    <p className="text-xs text-stone-500">Direct Order Summary</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-6">
              <div className="relative h-full min-h-[300px] sm:min-h-[380px] rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                <img
                  src={IMAGES.heroStationery}
                  alt="OMEGA Exercise Books, fountain pens, wooden pencils, and brass geometry instruments on a clean desk"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-xs border border-stone-200 rounded-md p-3.5 shadow-sm max-w-xs">
                  <p className="text-xs font-bold text-red-700 tracking-wide uppercase">
                    Featured Reference Line
                  </p>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5">
                    OMEGA Ruled &amp; Practical Exercise Books
                  </p>
                  <p className="text-xs text-stone-600 mt-0.5 font-mono-tabular">
                    Sample Pricing from ₹25 · 92 to 172 Pages
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-14 lg:py-16 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">Shop by Category</h2>
              <p className="text-sm text-stone-600 mt-1">
                Browse our complete range of school notebooks, writing instruments, and office supplies.
              </p>
            </div>
            <Link
              to="/catalog"
              className="text-sm font-semibold text-red-700 hover:text-red-800 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>View Full Catalog ({products.length} Products)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryCounts.map(({ category, count }, index) => (
              <Link
                key={category}
                to={`/catalog?category=${encodeURIComponent(category)}`}
                className="group p-5 bg-white border border-stone-200 rounded-lg hover:border-red-700 transition-colors flex flex-col justify-between gap-3"
              >
                <div className="flex items-center justify-between text-xs text-stone-500 font-mono-tabular">
                  <span>0{index + 1}</span>
                  <span>{count} Products</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-900 group-hover:text-red-700 transition-colors">
                    {category}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 inline-flex items-center gap-1">
                    <span>Browse department</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured & Best-Selling Section */}
      <section className="py-14 lg:py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
                {activeCollectionTab === 'featured'
                  ? 'Featured Stationery & Books'
                  : 'Best-Selling Classroom Essentials'}
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Sample catalog items with illustrative INR pricing. Switch tabs to inspect featured picks or top-moving student supplies.
              </p>
            </div>

            {/* Segmented Filter Control */}
            <div
              role="tablist"
              aria-label="Product showcase tabs"
              className="inline-flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200 self-start"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeCollectionTab === 'featured'}
                onClick={() => setActiveCollectionTab('featured')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeCollectionTab === 'featured'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Featured Products ({featuredProducts.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCollectionTab === 'bestsellers'}
                onClick={() => setActiveCollectionTab('bestsellers')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeCollectionTab === 'bestsellers'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Best-Selling Products ({bestSellingProducts.length})
              </button>
            </div>
          </div>

          {/* 3-Column Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="pt-4 flex justify-center">
            <Link
              to="/catalog"
              className="px-6 py-3 bg-stone-900 text-white text-sm font-semibold rounded-md hover:bg-stone-800 transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <span>Browse All {products.length} Products in Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Our Store? */}
      <section className="py-14 lg:py-16 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Why Choose Our Store?
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              A dependable neighborhood bookstore built around academic standards, honest pricing, and personal service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-stone-200 space-y-2.5">
              <div className="w-9 h-9 rounded-md bg-red-50 text-red-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-900">
                01. Complete Academic Range
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                From OMEGA single-line, four-line, and practical exercise books to college registers and technical instruments.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-stone-200 space-y-2.5">
              <div className="w-9 h-9 rounded-md bg-red-50 text-red-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-900">
                02. Verified Paper &amp; Ink Quality
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Smooth high-opacity writing paper and original branded pens that perform reliably through long examination hours.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-stone-200 space-y-2.5">
              <div className="w-9 h-9 rounded-md bg-red-50 text-red-700 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-900">
                03. Instant WhatsApp Ordering
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Build your list online, generate a clean itemized summary, and send it straight to our shop counter on WhatsApp.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-stone-200 space-y-2.5">
              <div className="w-9 h-9 rounded-md bg-red-50 text-red-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-900">
                04. Easy Store Pickup &amp; Local Delivery
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Reserve your school booklist for quick counter pickup or request local doorstep delivery with Cash/UPI on delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact and Location Section */}
      <section className="py-14 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-stone-200 rounded-lg p-6 sm:p-8 lg:p-10 bg-stone-50/60 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
                Visit or Message Our Shop
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
                Contact &amp; Store Location
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Have a school booklist or bulk office stationery requirement? Reach out by phone, WhatsApp, or visit our counter during business hours.
              </p>

              <div className="space-y-3 pt-2 text-sm text-stone-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-red-700 shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-stone-900">Shop Address: </span>
                    <span>{storeConfig.shopAddress}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-red-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-stone-900">Phone: </span>
                    <span className="font-mono-tabular">{storeConfig.phoneNumber}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-red-700 shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-stone-900">Business Hours: </span>
                    <span>{storeConfig.businessHours}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href={whatsappGreetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-5 py-3 bg-red-700 text-white text-sm font-semibold rounded-md hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp ({storeConfig.whatsappNumber})</span>
              </a>

              <a
                href={storeConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-5 py-3 bg-white text-stone-900 border border-stone-300 text-sm font-semibold rounded-md hover:bg-stone-100 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Location in Google Maps</span>
              </a>

              <Link
                to="/contact"
                className="w-full px-5 py-2.5 text-center text-xs font-semibold text-stone-600 hover:text-stone-900 underline underline-offset-4"
              >
                Update Store Contact Placeholders →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

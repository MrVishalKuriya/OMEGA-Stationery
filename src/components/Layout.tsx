import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  Heart,
  Phone,
  MapPin,
  Mail,
  ChevronDown,
  Instagram,
  Facebook,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCT_CATEGORIES, formatPrice } from '../types/store';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { storeConfig, cartItemCount, cartTotal, toastMessage, clearToast } = useStore();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = navSearchQuery.trim();
    if (query) {
      navigate(`/catalog?q=${encodeURIComponent(query)}`);
      setNavSearchQuery('');
    }
  };

  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    `Hello ${storeConfig.businessName}, I would like to inquire about stationery and book orders.`
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-stone-900 selection:bg-[#4a121c] selection:text-white">
      {/* Top Announcement Bar */}
      {!bannerDismissed && storeConfig.announcementText && (
        <div className="bg-[#380d16] text-[#fbf6f0] text-[11px] sm:text-xs py-2 px-4 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 text-center font-medium tracking-wide truncate">
              <span>{storeConfig.announcementText}</span>
            </div>
            <button
              type="button"
              onClick={() => setBannerDismissed(true)}
              aria-label="Dismiss announcement"
              className="text-stone-300 hover:text-white shrink-0 p-0.5 focus:outline-none"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Luxury Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ebdcd0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-20">
            {/* Brand Logo & Tagline */}
            <Link to="/" className="flex flex-col items-start group shrink-0">
              <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-widest text-[#380d16] group-hover:text-[#5f1725] transition-colors uppercase">
                OMEGA
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.2em] font-medium text-[#7c4d57] uppercase -mt-0.5">
                PAPER FOR A MORE MEANINGFUL YOU
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              aria-label="Main Navigation"
              className="hidden lg:flex items-center gap-6 xl:gap-8 text-[13px] font-medium text-stone-700"
            >
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition-colors hover:text-[#4a121c] pb-1 border-b-2 ${
                    isActive ? 'border-[#4a121c] text-[#4a121c] font-semibold' : 'border-transparent'
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/catalog"
                className={({ isActive }) =>
                  `transition-colors hover:text-[#4a121c] pb-1 border-b-2 ${
                    isActive ? 'border-[#4a121c] text-[#4a121c] font-semibold' : 'border-transparent'
                  }`
                }
              >
                Shop All
              </NavLink>

              <NavLink
                to="/catalog?category=Counter+Books"
                className="transition-colors hover:text-[#4a121c]"
              >
                Counter Books
              </NavLink>

              <NavLink
                to="/catalog?category=Exercise+Books"
                className="transition-colors hover:text-[#4a121c]"
              >
                Exercise Books
              </NavLink>

              <NavLink
                to="/catalog?category=Bahasha+%26+Envelopes"
                className="transition-colors hover:text-[#4a121c]"
              >
                Bahasha
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `transition-colors hover:text-[#4a121c] pb-1 border-b-2 ${
                    isActive ? 'border-[#4a121c] text-[#4a121c] font-semibold' : 'border-transparent'
                  }`
                }
              >
                Our Story
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `transition-colors hover:text-[#4a121c] pb-1 border-b-2 ${
                    isActive ? 'border-[#4a121c] text-[#4a121c] font-semibold' : 'border-transparent'
                  }`
                }
              >
                Contact
              </NavLink>
            </nav>

            {/* Right Tools: Embedded Search Bar, Wishlist & Cart */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Search Bar Input */}
              <form onSubmit={handleNavSearch} className="hidden md:flex items-center relative">
                <input
                  type="search"
                  value={navSearchQuery}
                  onChange={(e) => setNavSearchQuery(e.target.value)}
                  placeholder="Search notebooks, pens, files..."
                  className="w-48 lg:w-60 pl-8 pr-3 py-1.5 text-xs bg-[#faf7f2] border border-[#ebdcd0] rounded-full text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#4a121c] focus:w-64 transition-all"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </form>

              {/* WhatsApp Quick Chat */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Direct WhatsApp Order Chat"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#4a121c] bg-[#faf0eb] border border-[#ebdcd0] rounded-full hover:bg-[#4a121c] hover:text-white transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Order via WhatsApp</span>
              </a>

              {/* Cart Bag Button */}
              <Link
                to="/cart"
                className="relative px-3.5 py-2 bg-[#4a121c] hover:bg-[#340b13] text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-transform active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Bag</span>
                <span className="w-5 h-5 rounded-full bg-white text-[#4a121c] text-[11px] font-bold flex items-center justify-center">
                  {cartItemCount}
                </span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation drawer"
                className="lg:hidden p-2 rounded-lg border border-[#ebdcd0] text-stone-700 hover:bg-[#faf7f2]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#ebdcd0] bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl">
            <form onSubmit={handleNavSearch} className="flex items-center relative">
              <input
                type="search"
                value={navSearchQuery}
                onChange={(e) => setNavSearchQuery(e.target.value)}
                placeholder="Search counter books, exercise books..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#faf7f2] border border-[#ebdcd0] rounded-lg"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            <nav className="flex flex-col space-y-2 text-sm font-medium">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-stone-800 hover:text-[#4a121c]"
              >
                Home
              </Link>
              <Link
                to="/catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-stone-800 hover:text-[#4a121c]"
              >
                Full Catalog (All Products)
              </Link>
              {PRODUCT_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  to={`/catalog?category=${encodeURIComponent(cat)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 pl-3 text-xs text-stone-600 hover:text-[#4a121c] border-l-2 border-stone-200"
                >
                  {cat}
                </Link>
              ))}
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-stone-800 hover:text-[#4a121c]"
              >
                Our Story
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-stone-800 hover:text-[#4a121c]"
              >
                Contact &amp; Location
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-amber-800 hover:text-amber-900 font-semibold"
              >
                Admin Catalog Dashboard
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Luxury Footer (Matching Velvet Note image) */}
      <footer className="bg-[#300a12] text-[#faf6f0] border-t border-[#4a121c]">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            {/* Brand & Mission Column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="space-y-1">
                <span className="font-serif-luxury text-3xl font-bold tracking-widest text-white uppercase">
                  OMEGA
                </span>
                <p className="text-[10px] tracking-[0.25em] font-medium text-[#e2b9c2] uppercase">
                  PAPER FOR A MORE MEANINGFUL YOU
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
                Tanzania&apos;s premier paper and academic stationery brand. Providing high-density
                counter books, indigo-printed exercise books, and dependable institutional supplies
                since 1998.
              </p>

              {/* Social Media Links */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Shop Column */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold tracking-widest text-white uppercase font-sans">
                Shop
              </h4>
              <ul className="space-y-2 text-xs text-stone-300">
                <li>
                  <Link to="/catalog?category=Counter+Books" className="hover:text-white transition-colors">
                    Counter Books
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Exercise+Books" className="hover:text-white transition-colors">
                    Exercise Books
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Bahasha+%26+Envelopes" className="hover:text-white transition-colors">
                    Bahasha &amp; Envelopes
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Files+%26+Folders" className="hover:text-white transition-colors">
                    Files &amp; Folders
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=School+Stationery" className="hover:text-white transition-colors">
                    School Essentials
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Bulk+%26+Wholesale+Paper" className="hover:text-white transition-colors">
                    Bulk Paper Reams
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold tracking-widest text-white uppercase font-sans">
                Customer Care &amp; Orders
              </h4>
              <ul className="space-y-2 text-xs text-stone-300">
                <li className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#e2b9c2] shrink-0 mt-0.5" />
                  <span>{storeConfig.phoneNumber}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#e2b9c2] shrink-0 mt-0.5" />
                  <span>{storeConfig.emailAddress}</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#e2b9c2] shrink-0 mt-0.5" />
                  <span>{storeConfig.shopAddress}</span>
                </li>
                <li className="pt-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#e2b9c2] hover:text-white underline underline-offset-4"
                  >
                    <span>Direct WhatsApp Counter Desk →</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Poetic Editorial Column */}
            <div className="lg:col-span-3 space-y-4">
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-center sm:text-left">
                <p className="font-serif-luxury italic text-xl sm:text-2xl text-stone-100">
                  A Kinder, More Creative World.
                </p>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Every notebook holds the seed of an idea. Made with pride in Tanzania for the
                  generations who write the future.
                </p>
                <div className="pt-2">
                  <Link
                    to="/about"
                    className="text-xs font-semibold text-[#e2b9c2] hover:text-white uppercase tracking-wider inline-flex items-center gap-1"
                  >
                    Read Our Heritage →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Terms Bar */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
            <p>© {new Date().getFullYear()} OMEGA Stationery &amp; Books. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/about" className="hover:text-white transition-colors">
                About OMEGA
              </Link>
              <Link to="/contact" className="hover:text-white transition-colors">
                Contact &amp; Delivery
              </Link>
              <Link to="/admin" className="hover:text-white transition-colors">
                Admin Demo
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

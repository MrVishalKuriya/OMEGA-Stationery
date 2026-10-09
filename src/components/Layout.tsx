import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Phone, MapPin, Clock, Settings } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCT_CATEGORIES } from '../types/store';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { storeConfig, cartItemCount, toastMessage, clearToast } = useStore();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Catalog', to: '/catalog' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Admin Demo', to: '/admin' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900">
      {/* Top Announcement Bar */}
      {!bannerDismissed && storeConfig.announcementText && (
        <div className="bg-red-800 text-white text-xs h-9 px-4 flex items-center justify-between gap-4">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <p className="truncate font-medium">
              {storeConfig.announcementText}
            </p>
            <button
              type="button"
              onClick={() => setBannerDismissed(true)}
              aria-label="Dismiss announcement"
              className="text-red-100 hover:text-white shrink-0 p-1 focus:outline-none"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Header: 3-Zone Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-stone-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 font-serif-display hover:text-red-700 transition-colors"
          >
            {storeConfig.businessName}
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    isActive
                      ? 'border-red-700 text-stone-900 font-semibold'
                      : 'border-transparent hover:text-stone-900 hover:border-stone-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Primary action (Shopping Cart) + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/cart"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({cartItemCount})</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-md border border-stone-200 text-stone-700 hover:bg-stone-50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-md">
            {navItems.map((item) => {
              const active =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-sm font-medium ${
                    active
                      ? 'bg-red-50 text-red-800 font-semibold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Action Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-stone-900 text-white px-4 py-3 rounded-lg shadow-lg border border-stone-700 flex items-center justify-between gap-4 text-xs sm:text-sm"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={clearToast}
            aria-label="Close notification"
            className="text-stone-400 hover:text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: Brand & Notice */}
            <div className="space-y-3">
              <div className="inline-block border-2 border-red-600 px-3 py-1 bg-stone-900">
                <span className="text-base font-bold tracking-wider text-white font-serif-display">
                  {storeConfig.logoText}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white font-serif-display">
                {storeConfig.businessName}
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                {storeConfig.tagline}. Providing exercise books, registers, writing instruments, and academic stationery for students, teachers, and offices.
              </p>
              <p className="text-xs text-amber-300/90 pt-1 leading-relaxed">
                Note: Store branding, product prices, and contact placeholders are configurable via the Admin Demo panel.
              </p>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Store Navigation
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-400">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home Page
                  </Link>
                </li>
                <li>
                  <Link to="/catalog" className="hover:text-white transition-colors">
                    Full Product Catalog (35+ Items)
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-white transition-colors">
                    Shopping Cart &amp; WhatsApp Checkout
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About Our Bookstore
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact &amp; Location Details
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-red-400">
                    <Settings className="w-3.5 h-3.5" />
                    Admin Dashboard (Demo)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Categories */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Product Categories
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-stone-400">
                {PRODUCT_CATEGORIES.map((category) => (
                  <li key={category}>
                    <Link
                      to={`/catalog?category=${encodeURIComponent(category)}`}
                      className="hover:text-white transition-colors"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Store Contact (Configurable)
              </h3>
              <ul className="space-y-2.5 text-xs text-stone-400 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{storeConfig.shopAddress}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="font-mono-tabular">{storeConfig.phoneNumber}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{storeConfig.businessHours}</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-block text-xs font-semibold text-red-400 hover:text-red-300 underline underline-offset-4"
                >
                  Edit Contact Details or Send Inquiry →
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <p>
              © {new Date().getFullYear()} {storeConfig.businessName}. Built with configurable storefront architecture.
            </p>
            <p>
              Prices in INR (₹) · Demo Catalog Mode · WhatsApp Order Verification Ready
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

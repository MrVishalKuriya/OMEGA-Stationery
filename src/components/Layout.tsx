import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  CheckCircle2,
  Heart,
  Truck,
  ShieldCheck,
  Cookie,
  Server,
  Sparkles,
  Calculator,
  Scale,
  MessageCircle,
  ArrowUp,
  ArrowRight,
  Package,
  Download,
  Phone,
  MapPin,
  Mail,
  Percent,
  Building2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { QuickViewModal } from './QuickViewModal';
import { CartDrawer } from './CartDrawer';
import { WishlistModal } from './WishlistModal';
import { OrderTrackingModal } from './OrderTrackingModal';
import { AuthModal } from './AuthModal';
import { CookieBanner } from './CookieBanner';
import { BackendStatusModal } from './BackendStatusModal';
import { WholesaleCalculatorModal } from './WholesaleCalculatorModal';
import { ProductCompareModal } from './ProductCompareModal';
import { OmegaLogo } from './OmegaLogo';
import { Navbar } from './navbar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    wishlistCount,
    setIsWishlistModalOpen,
    setIsTrackingModalOpen,
    isCookieBannerOpen,
    openCookiePreferences,
    closeCookiePreferences,
    toastMessage,
    clearToast,
    isBackendOnline,
  } = useStore();

  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);


  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#fafafa] text-[#3b352f] font-sans selection:bg-[#c49b7c] selection:text-white">
      {/* Reusable Boutique Navbar (AnnouncementBar, Header, MegaMenu, SearchOverlay, AccountDropdown, MobileMenu, MobileBottomBar) */}
      <Navbar />


      {/* ==================== 3. TOAST NOTIFICATIONS ==================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-[12px] bg-[#4b423b] text-white border border-[#c49b7c]/50 shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#c49b7c] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            onClick={clearToast}
            className="ml-2 text-stone-300 hover:text-white p-1"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ==================== 4. MAIN PAGE CONTENT ==================== */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {children}
      </main>

      {/* ==================== 5. LEDUP ARCHITECTURAL FOOTER (#4b423b) ==================== */}
      <footer className="bg-[#4b423b] text-stone-200 pt-16 pb-12 border-t-2 border-[#c49b7c]/40 shadow-2xl mt-20 ledup-rounded-footer-top relative overflow-hidden">
        {/* Ambient Illumination Orbs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#c49b7c]/15 rounded-full blur-[140px] pointer-events-none animate-ledup-ambient" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#a46b44]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* A) Top Feature Trust Ticker (4 Architectural Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12 border-b border-white/10">
            <div className="p-4 rounded-[18px] bg-[#3b352f]/80 border border-[#e2dedb]/15 flex items-center gap-3.5 hover:border-[#c49b7c] transition-all group">
              <div className="w-11 h-11 rounded-[12px] bg-[#4b423b] border border-[#c49b7c]/40 text-[#c49b7c] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5 text-[#c49b7c]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                  Nationwide Dispatch
                </h4>
                <p className="text-[11px] text-[#beb5ae] mt-0.5">
                  Kariakoo Dar &amp; Upcountry bus parcels
                </p>
              </div>
            </div>

            <div className="p-4 rounded-[18px] bg-[#3b352f]/80 border border-[#e2dedb]/15 flex items-center gap-3.5 hover:border-[#c49b7c] transition-all group">
              <div className="w-11 h-11 rounded-[12px] bg-[#4b423b] border border-[#c49b7c]/40 text-[#c49b7c] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-[#2A9D8F]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                  100% Genuine OMEGA
                </h4>
                <p className="text-[11px] text-[#beb5ae] mt-0.5">
                  Thread-sewn hardcovers &amp; 70 GSM paper
                </p>
              </div>
            </div>

            <div className="p-4 rounded-[18px] bg-[#3b352f]/80 border border-[#e2dedb]/15 flex items-center gap-3.5 hover:border-[#c49b7c] transition-all group">
              <div className="w-11 h-11 rounded-[12px] bg-[#c49b7c] text-[#23201d] flex items-center justify-center shrink-0 shadow-sm font-bold group-hover:scale-105 transition-transform">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                  Wholesale Carton Tiers
                </h4>
                <p className="text-[11px] text-[#beb5ae] mt-0.5">
                  Direct volume savings up to 40% OFF
                </p>
              </div>
            </div>

            <div className="p-4 rounded-[18px] bg-[#3b352f]/80 border border-[#e2dedb]/15 flex items-center gap-3.5 hover:border-[#c49b7c] transition-all group">
              <div className="w-11 h-11 rounded-[12px] bg-[#2A9D8F] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                  3 WhatsApp Hotlines
                </h4>
                <p className="text-[11px] text-[#beb5ae] mt-0.5">
                  Instant live order assistance anytime
                </p>
              </div>
            </div>
          </div>

          {/* B) 5-Column Master Architectural Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/10">
            {/* Column 1: Brand Hallmark & Factory Origin (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Link to="/" className="inline-block">
                <OmegaLogo variant="badge" size="md" showSubtitle={true} />
              </Link>
              <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
                Tanzania's benchmark manufacturer and distributor of Counter Books (Q2, Q3, Q4), Exercise Books, Kraft Bahasha, and educational paper products. Manufactured for scholars, schools, and enterprises nationwide.
              </p>
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-xs text-[#c49b7c] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Double Thread-Sewn Binding Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#beb5ae]">
                  <MapPin className="w-4 h-4 text-[#c49b7c] shrink-0" />
                  <span>Kariakoo Central Warehouse · Dar es Salaam</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#beb5ae]">
                  <Building2 className="w-4 h-4 text-[#c49b7c] shrink-0" />
                  <span>Soweto SIDO Viwandani · Mbeya, Tanzania</span>
                </div>
              </div>
            </div>

            {/* Column 2: Collections (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white border-b border-white/10 pb-1.5">
                Collections
              </h4>
              <ul className="space-y-2 text-xs text-stone-300">
                <li>
                  <Link to="/wholesale" className="hover:text-white transition-colors font-bold text-[#c49b7c] flex items-center gap-1.5">
                    <span>Wholesale &amp; Bulk</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-[#c49b7c] text-[#23201d] font-bold rounded-full">B2B</span>
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Counter+Books" className="hover:text-[#c49b7c] transition-colors">
                    Counter Books (Q2-Q4)
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Exercise+Books" className="hover:text-[#c49b7c] transition-colors">
                    Exercise Books (32-200p)
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Bahasha+%26+Envelopes" className="hover:text-[#c49b7c] transition-colors">
                    Kraft Bahasha Envelopes
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Registers" className="hover:text-[#c49b7c] transition-colors">
                    Registers &amp; Accounting Ledgers
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Office+Supplies" className="hover:text-[#c49b7c] transition-colors">
                    Files &amp; Manila Folders
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Wholesale & B2B Tenders (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white border-b border-white/10 pb-1.5">
                Wholesale &amp; Tenders
              </h4>
              <ul className="space-y-2 text-xs text-stone-300">
                <li>
                  <Link to="/school-tenders" className="hover:text-[#c49b7c] transition-colors flex items-center gap-1 font-bold text-[#c49b7c]">
                    <span>School Tender Portal</span>
                    <ArrowRight className="w-3 h-3 text-[#c49b7c]" />
                  </Link>
                </li>
                <li>
                  <Link to="/wholesale" className="hover:text-[#c49b7c] transition-colors">
                    Carton Savings Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-guide" className="hover:text-[#c49b7c] transition-colors">
                    31 Regions Shipping Guide
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#c49b7c] transition-colors">
                    About OMEGA Heritage
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#c49b7c] transition-colors">
                    Contact &amp; Ordering Desks
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: 3 Dedicated WhatsApp Hotlines (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-[#c49b7c] border border-[#c49b7c]/40 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>3 HOTLINES LIVE NOW</span>
                </span>
              </div>
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                Sales &amp; Dispatch Hotlines
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="https://wa.me/255746268391"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-[12px] bg-[#3b352f]/90 border border-white/10 hover:border-[#c49b7c] flex items-center justify-between text-white hover:text-[#c49b7c] transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                      <span className="font-mono font-bold">+255 746 268 391</span>
                    </div>
                    <span className="text-[11px] text-[#beb5ae] font-sans">Desk 1 · General</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/255624265480"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-[12px] bg-[#3b352f]/90 border border-white/10 hover:border-[#c49b7c] flex items-center justify-between text-white hover:text-[#c49b7c] transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                      <span className="font-mono font-bold">+255 624 265 480</span>
                    </div>
                    <span className="text-[11px] text-[#beb5ae] font-sans">Desk 2 · Wholesale</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/255699032777"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-[12px] bg-[#3b352f]/90 border border-white/10 hover:border-[#c49b7c] flex items-center justify-between text-white hover:text-[#c49b7c] transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                      <span className="font-mono font-bold">+255 699 032 777</span>
                    </div>
                    <span className="text-[11px] text-[#beb5ae] font-sans">Desk 3 · Logistics</span>
                  </a>
                </li>
              </ul>

              {/* Official Email */}
              <div className="pt-1">
                <a
                  href="mailto:indigoprinter06423@gmail.com"
                  className="text-xs text-stone-300 hover:text-[#c49b7c] flex items-center gap-2 transition-colors font-mono"
                >
                  <Mail className="w-3.5 h-3.5 text-[#c49b7c]" />
                  <span>indigoprinter06423@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* C) Bottom Copyright, Quick Modals & Back to Top */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-stone-400 pt-2">
            <p>© {new Date().getFullYear()} OMEGA Writing Notebooks &amp; Stationery Tanzania. All rights reserved.</p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => setIsTrackingModalOpen(true)}
                className="hover:text-[#c49b7c] transition-colors flex items-center gap-1.5 text-stone-300"
              >
                <Truck className="w-3.5 h-3.5 text-[#c49b7c]" />
                <span>Track Parcel</span>
              </button>
              <button
                type="button"
                onClick={() => setIsWholesaleModalOpen(true)}
                className="hover:text-[#c49b7c] transition-colors flex items-center gap-1.5 text-stone-300"
              >
                <Calculator className="w-3.5 h-3.5 text-[#c49b7c]" />
                <span>Carton Calculator</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="hover:text-[#c49b7c] transition-colors flex items-center gap-1.5 text-stone-300"
              >
                <Scale className="w-3.5 h-3.5 text-[#c49b7c]" />
                <span>Compare</span>
              </button>
              <button
                type="button"
                onClick={() => setIsWishlistModalOpen(true)}
                className="hover:text-[#c49b7c] transition-colors flex items-center gap-1.5 text-stone-300"
              >
                <Heart className="w-3.5 h-3.5 text-[#D64545]" />
                <span>Wishlist ({wishlistCount})</span>
              </button>
              <Link to="/about" className="hover:text-[#c49b7c] transition-colors text-stone-300">
                About
              </Link>
              <Link to="/contact" className="hover:text-[#c49b7c] transition-colors text-stone-300">
                Contact
              </Link>
              <button
                type="button"
                onClick={openCookiePreferences}
                className="hover:text-[#c49b7c] transition-colors flex items-center gap-1.5 text-stone-300"
              >
                <Cookie className="w-3.5 h-3.5 text-[#c49b7c]" />
                <span>Cookies</span>
              </button>
              <button
                type="button"
                onClick={() => setIsBackendModalOpen(true)}
                className="hover:text-[#c49b7c] transition-colors flex items-center gap-1.5 text-stone-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10"
              >
                <Server className="w-3.5 h-3.5 text-[#c49b7c]" />
                <span>Backend</span>
                <span
                  className={`w-2 h-2 rounded-full inline-block ${
                    isBackendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
              </button>

              {/* Back to top smooth button */}
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-2 rounded-full bg-white/10 hover:bg-[#c49b7c] hover:text-[#23201d] text-white transition-all shadow-sm flex items-center justify-center group"
                aria-label="Scroll to top"
                title="Scroll to top"
              >
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating High-Contrast Quick Action Dock (Indra Notebooks Style) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-none">
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Direct WhatsApp Orders Quick Pill */}
          <a
            href="https://wa.me/255746268391?text=Hello%20OMEGA%20Stationery%20Tanzania,%20I%20would%20like%20to%20place%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D8F5E] hover:bg-[#25764d] text-white text-xs font-bold shadow-lg transition-all hover:scale-105"
            title="Chat with Sales Desk on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WhatsApp Orders</span>
          </a>

          {/* Wholesale Carton Calculator (LEDUP Copper Gradient) */}
          <button
            type="button"
            onClick={() => setIsWholesaleModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-ledup-copper text-xs sm:text-sm font-semibold shadow-xl hover:scale-105 transition-all group focus-ring-gold active:scale-95"
            aria-label="Open Wholesale Carton & Tender Calculator"
          >
            <Calculator className="w-4 h-4 text-white" />
            <span>Wholesale &amp; Carton Rates</span>
          </button>
        </div>
      </div>

      {/* Global E-Commerce Modals */}
      <QuickViewModal />
      <CartDrawer />
      <WishlistModal />
      <OrderTrackingModal />
      <AuthModal />
      <CookieBanner forceOpen={isCookieBannerOpen} onClose={closeCookiePreferences} />
      <BackendStatusModal isOpen={isBackendModalOpen} onClose={() => setIsBackendModalOpen(false)} />
      <WholesaleCalculatorModal isOpen={isWholesaleModalOpen} onClose={() => setIsWholesaleModalOpen(false)} />
      <ProductCompareModal isOpen={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)} />
    </div>
  );
};



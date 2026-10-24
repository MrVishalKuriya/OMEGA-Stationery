import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Clock,
  FileText,
  Award,
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
  const location = useLocation();
  const isAdminPage =
    location.pathname.startsWith('/omega-hq-portal') ||
    location.pathname.startsWith('/admin');

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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#fafafa] text-[#18181b] font-sans selection:bg-[#dc2626] selection:text-white">
      {/* Reusable Boutique Navbar (AnnouncementBar, Header, MegaMenu, SearchOverlay, AccountDropdown, MobileMenu, MobileBottomBar) */}
      <Navbar />


      {/* ==================== 3. TOAST NOTIFICATIONS ==================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-[12px] bg-[#111113] text-white border border-[#dc2626]/50 shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#dc2626] shrink-0" />
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

      {/* ==================== 5. PRESTIGE ARCHITECTURAL FOOTER ==================== */}
      <footer className="bg-[#0a0a0c] text-zinc-300 border-t border-[#dc2626]/30 mt-16 relative overflow-hidden">
        {/* Subtle Ambient Backlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#dc2626]/5 blur-3xl pointer-events-none" />

        {/* 1) Trust & Manufacturing Excellence Strip (4 Responsive Pillars) */}
        <div className="border-b border-white/10 bg-[#111114]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#dc2626]/15 border border-[#dc2626]/30 flex items-center justify-center text-[#dc2626] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                    Pure 70 GSM Bond
                  </h5>
                  <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                    Zero ink-bleed, smooth writing finish
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#dc2626]/15 border border-[#dc2626]/30 flex items-center justify-center text-[#dc2626] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                    Thread-Sewn Spines
                  </h5>
                  <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                    Double-stitched for extreme durability
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#dc2626]/15 border border-[#dc2626]/30 flex items-center justify-center text-[#dc2626] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                    Price List #PL00001
                  </h5>
                  <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                    Factory direct transparent rates
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#dc2626]/15 border border-[#dc2626]/30 flex items-center justify-center text-[#dc2626] shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                    31 Regions Cargo
                  </h5>
                  <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                    Daily freight via verified bus parcels
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2) Pre-Footer B2B & Wholesale Quick-Inquiry Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="relative rounded-2xl bg-gradient-to-r from-[#18181b] via-[#121214] to-[#09090b] border border-[#dc2626]/30 p-5 sm:p-7 shadow-xl overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-full bg-[#dc2626]/5 blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#dc2626]/15 border border-[#dc2626]/30 text-[10px] font-mono font-bold uppercase tracking-wider text-[#ef4444]">
                  <Sparkles className="w-3 h-3 text-[#dc2626]" />
                  <span>Wholesale &amp; Institutional Supply</span>
                </div>
                <h3 className="text-base sm:text-lg font-heading font-bold text-white tracking-tight">
                  Supplying Schools, Wholesalers &amp; Tender Contractors Across East Africa
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Direct factory carton lots from Indigo Printed Limited. Get tailored quotes, custom school cover branding, or download official Price List #PL00001.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsWholesaleModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-white" />
                  <span>Carton Calculator</span>
                </button>

                <a
                  href="/uploads/PL00001.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#dc2626]/50 text-white font-semibold text-xs transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95"
                >
                  <Download className="w-4 h-4 text-[#ef4444]" />
                  <span>Price List (PDF)</span>
                </a>

                <a
                  href="https://wa.me/255715268391?text=Hello%20Kanti%20Bhai,%20I%20am%20inquiring%20about%20a%20bulk%20wholesale%20order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp MD Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3) Main 4-Column Architectural Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Col 1: Heritage & Manufacturing (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Link to="/" className="inline-block">
                <OmegaLogo variant="badge" size="md" showSubtitle={true} />
              </Link>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#dc2626]/15 border border-[#dc2626]/30 text-[10px] font-mono font-bold text-[#ef4444]">
                <Building2 className="w-3 h-3 text-[#dc2626]" />
                <span>Manufactured by INDIGO PRINTED LIMITED</span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Tanzania's benchmark manufacturer of Counter Books (Q2, Q3, Q4), Exercise Books, Kraft Bahasha, and educational paper products. Engineered for scholars, schools, wholesale traders, and commercial enterprises nationwide.
              </p>

              <div className="space-y-2 text-xs pt-2 border-t border-white/10 text-zinc-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Main Factory &amp; HQ:</span>{' '}
                    <span>Plot 30, Block F Kilwa Rd, Mwanambaya-Mkuranga, P.O. Box 10424, Dar es Salaam</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Mbeya Factory Desk:</span>{' '}
                    <span>Soweto SIDO Viwandani</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-zinc-300">
                  <Mail className="w-4 h-4 text-[#dc2626] shrink-0" />
                  <a
                    href="mailto:indigoprinter06423@gmail.com"
                    className="hover:text-white transition-colors font-mono"
                  >
                    indigoprinter06423@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Col 2: Products & Collections (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
                Products
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-300">
                <li>
                  <Link to="/wholesale" className="hover:text-white transition-colors font-bold text-[#ef4444] flex items-center gap-1.5">
                    <span>Wholesale &amp; Bulk</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#dc2626] text-white font-bold rounded-full">B2B</span>
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Counter+Books" className="hover:text-[#ef4444] transition-colors flex items-center justify-between">
                    <span>Counter Books (Q2-Q4)</span>
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Exercise+Books" className="hover:text-[#ef4444] transition-colors flex items-center justify-between">
                    <span>Exercise Books (32-200p)</span>
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Exercise+Books" className="hover:text-[#ef4444] transition-colors flex items-center justify-between">
                    <span>Stiff Cover 200 Pages</span>
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Bahasha+%26+Envelopes" className="hover:text-[#ef4444] transition-colors flex items-center justify-between">
                    <span>Kraft Bahasha (A3-A6)</span>
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Registers" className="hover:text-[#ef4444] transition-colors flex items-center justify-between">
                    <span>Shorthand &amp; Registers</span>
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Office+Supplies" className="hover:text-[#ef4444] transition-colors flex items-center justify-between">
                    <span>P.V.C. &amp; Manila Files</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Wholesale & Tenders (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
                Wholesale &amp; Tenders
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-300">
                <li>
                  <Link to="/school-tenders" className="hover:text-[#ef4444] transition-colors flex items-center gap-1.5 font-bold text-[#ef4444]">
                    <span>School Tender Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </li>
                <li>
                  <a
                    href="/uploads/PL00001.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ef4444] transition-colors flex items-center gap-1.5"
                  >
                    <span>Price List (#PL00001)</span>
                    <Download className="w-3.5 h-3.5 text-zinc-400" />
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsWholesaleModalOpen(true)}
                    className="hover:text-[#ef4444] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Carton Calculator</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsTrackingModalOpen(true)}
                    className="hover:text-[#ef4444] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Waybill &amp; Bus Tracking</span>
                  </button>
                </li>
                <li>
                  <Link to="/shipping-guide" className="hover:text-[#ef4444] transition-colors">
                    31 Regions Shipping Guide
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#ef4444] transition-colors">
                    About OMEGA Heritage
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#ef4444] transition-colors">
                    Contact &amp; Ordering Desks
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Executive Factory Desks (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                  Executive Desks
                </h4>
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  DIRECT DESKS
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Kanti Bhai */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#dc2626]/40 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block">Founder &amp; MD</span>
                      <span className="text-xs font-bold text-white block">Kanti Bhai K. Halai</span>
                      <a href="tel:+255715268391" className="text-xs font-mono text-[#ef4444] hover:underline block mt-0.5">
                        +255 715 268 391
                      </a>
                    </div>
                    <a
                      href="https://wa.me/255715268391?text=Hello%20Kanti%20Bhai,%20inquiry%20from%20website"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 transition-colors shrink-0"
                      title="Chat with Kanti Bhai on WhatsApp"
                      aria-label="Chat with Kanti Bhai on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Vijesh Bhai */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#dc2626]/40 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block">Co-Founder &amp; MD</span>
                      <span className="text-xs font-bold text-white block">Vijesh K. Halai</span>
                      <a href="tel:+255624265480" className="text-xs font-mono text-[#ef4444] hover:underline block mt-0.5">
                        +255 624 265 480
                      </a>
                    </div>
                    <a
                      href="https://wa.me/255624265480?text=Hello%20Vijesh%20Bhai,%20inquiry%20from%20website"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 transition-colors shrink-0"
                      title="Chat with Vijesh Bhai on WhatsApp"
                      aria-label="Chat with Vijesh Bhai on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Live Factory Dispatch Hours */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#dc2626]/10 border border-[#dc2626]/20 text-[11px] text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-[#ef4444] shrink-0" />
                  <span>Mon – Sat: 8:00 AM – 5:30 PM (EAT)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4) Bottom Copyright & Utilities */}
        <div className="border-t border-white/10 bg-[#060608]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} OMEGA Writing Notebooks &amp; Stationery Tanzania. Manufactured by Indigo Printed Limited. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
              <button
                type="button"
                onClick={() => setIsTrackingModalOpen(true)}
                className="hover:text-[#ef4444] transition-colors cursor-pointer"
              >
                Track Parcel
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setIsWholesaleModalOpen(true)}
                className="hover:text-[#ef4444] transition-colors cursor-pointer"
              >
                Carton Calculator
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setIsWishlistModalOpen(true)}
                className="hover:text-[#ef4444] transition-colors cursor-pointer"
              >
                Wishlist ({wishlistCount})
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={openCookiePreferences}
                className="hover:text-[#ef4444] transition-colors cursor-pointer"
              >
                Cookies
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-[#dc2626] hover:text-white text-white transition-all ml-1 cursor-pointer"
                aria-label="Scroll to top"
                title="Scroll to top"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating High-Contrast Quick Action Dock (Hidden on Admin Portal) */}
      {!isAdminPage && (
        <div className="fixed bottom-4 right-3 sm:bottom-5 sm:right-5 z-40 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto bg-[#09090b]/90 backdrop-blur-md p-1.5 rounded-full border border-[#dc2626]/40 shadow-2xl">
            {/* Direct WhatsApp Orders Quick Pill */}
            <a
              href="https://wa.me/255715268391?text=Hello%20OMEGA%20Stationery%20Tanzania,%20I%20would%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-md transition-all hover:scale-105"
              title="Chat with Sales Desk on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">WhatsApp Orders</span>
            </a>

            {/* Wholesale Carton Calculator (Crimson Red Gradient) */}
            <button
              type="button"
              onClick={() => setIsWholesaleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full btn-ledup-copper text-xs font-bold shadow-md hover:scale-105 transition-all group active:scale-95 text-white cursor-pointer"
              aria-label="Open Wholesale Carton & Tender Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-white" />
              <span>Wholesale Rates</span>
            </button>
          </div>
        </div>
      )}

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



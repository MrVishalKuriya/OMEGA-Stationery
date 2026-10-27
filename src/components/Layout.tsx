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
      <footer className="bg-[#0a0a0c] text-zinc-300 border-t border-[#dc2626]/30 relative overflow-hidden">
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

        {/* 3) Main Architectural Grid: 2-Column Responsive Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Col 1: Heritage & Manufacturing (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Brand Hallmark & Manufacturing Eyebrow */}
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/" className="inline-block group focus-ring-gold rounded-lg">
                  <OmegaLogo variant="badge" size="md" showSubtitle={true} />
                </Link>

                <div className="inline-flex items-center px-3 py-1 rounded-md bg-gradient-to-r from-[#dc2626]/20 via-[#dc2626]/10 to-transparent border border-[#dc2626]/40 text-[10px] font-mono font-bold text-[#ef4444] uppercase tracking-wider shadow-xs">
                  <span>MANUFACTURED BY INDIGO PRINTED LIMITED</span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
                Tanzania&apos;s benchmark manufacturer of Counter Books (Q2, Q3, Q4), Exercise Books, Kraft Bahasha, and educational paper products. Engineered for scholars, schools, wholesale traders, and commercial enterprises nationwide.
              </p>

              {/* Manufacturing Facilities & Direct Dispatch Hubs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl pt-1">
                {/* 1. Main Factory & HQ */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#dc2626]/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#dc2626] shrink-0" />
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-400">
                        Main Factory &amp; HQ
                      </span>
                    </div>
                    <p className="text-xs text-white font-semibold leading-snug">
                      Plot 30, Block F Kilwa Rd, Mwanambaya-Mkuranga
                    </p>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-2 font-mono">
                    P.O. Box 10424, Dar es Salaam
                  </p>
                </div>

                {/* 2. Upcountry Factory Desk (Mbeya) */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#dc2626]/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#dc2626] shrink-0" />
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-400">
                        Highlands Hub Desk
                      </span>
                    </div>
                    <p className="text-xs text-white font-semibold leading-snug">
                      Mbeya Factory Desk
                    </p>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-2 font-mono">
                    Soweto SIDO Viwandani, Mbeya
                  </p>
                </div>
              </div>

              {/* Official Corporate Inquiries Bar */}
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#dc2626]/40 transition-all flex items-center justify-between gap-3 max-w-xl">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#dc2626]/15 border border-[#dc2626]/30 flex items-center justify-center text-[#ef4444] shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block leading-tight">
                      Official Inquiries
                    </span>
                    <a
                      href="mailto:indigoprinter06423@gmail.com"
                      className="text-xs font-mono font-bold text-zinc-200 hover:text-[#ef4444] transition-colors block truncate"
                    >
                      indigoprinter06423@gmail.com
                    </a>
                  </div>
                </div>
                <a
                  href="mailto:indigoprinter06423@gmail.com"
                  className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-[#dc2626] text-zinc-300 hover:text-white text-[11px] font-mono font-semibold transition-all shrink-0"
                >
                  Email Us
                </a>
              </div>
            </div>

            {/* Col 2: Executive Factory Desks & Direct Hotlines (6 cols) */}
            <div className="lg:col-span-6 space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                  Executive Desks &amp; Direct Hotlines
                </h4>
                <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  DIRECT DESKS
                </span>
              </div>

              {/* 4 Dedicated Direct Factory Hotlines Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Kanti Bhai K. Halai */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#dc2626]/40 transition-all flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block truncate">Founder &amp; MD</span>
                    <span className="text-xs font-bold text-white block truncate">Kanti Bhai K. Halai</span>
                    <a href="tel:+255715268391" className="text-xs font-mono font-bold text-[#ef4444] hover:underline block mt-0.5 truncate">
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

                {/* 2. Vijesh K. Halai */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#dc2626]/40 transition-all flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block truncate">Co-Founder &amp; MD</span>
                    <span className="text-xs font-bold text-white block truncate">Vijesh K. Halai</span>
                    <a href="tel:+255624265480" className="text-xs font-mono font-bold text-[#ef4444] hover:underline block mt-0.5 truncate">
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

                {/* 3. Mbeya Central Factory */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#dc2626]/40 transition-all flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block truncate">Soweto SIDO Estate</span>
                    <span className="text-xs font-bold text-white block truncate">Mbeya Central Factory</span>
                    <a href="tel:+255746268391" className="text-xs font-mono font-bold text-[#ef4444] hover:underline block mt-0.5 truncate">
                      +255 746 268 391
                    </a>
                  </div>
                  <a
                    href="https://wa.me/255746268391?text=Hello%20Mbeya%20Branch,%20inquiry%20from%20website"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 transition-colors shrink-0"
                    title="Chat with Mbeya Branch on WhatsApp"
                    aria-label="Chat with Mbeya Branch on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>

                {/* 4. Mwanza Dispatch Hub */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#dc2626]/40 transition-all flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block truncate">Lake Zone Waybills</span>
                    <span className="text-xs font-bold text-white block truncate">Mwanza Dispatch Hub</span>
                    <a href="tel:+255699032777" className="text-xs font-mono font-bold text-[#ef4444] hover:underline block mt-0.5 truncate">
                      +255 699 032 777
                    </a>
                  </div>
                  <a
                    href="https://wa.me/255699032777?text=Hello%20Mwanza%20Hub,%20inquiry%20from%20website"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 transition-colors shrink-0"
                    title="Chat with Mwanza Hub on WhatsApp"
                    aria-label="Chat with Mwanza Hub on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Live Factory Dispatch Hours */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#dc2626]/10 border border-[#dc2626]/20 text-[11px] text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-[#ef4444] shrink-0" />
                <span>Mon – Sat: 8:00 AM – 5:30 PM (EAT) · Tanzania Nationwide Dispatch</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4) Bottom Copyright & Utilities */}
        <div className="border-t border-white/10 bg-[#060608] pb-24 sm:pb-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} OMEGA Writing Notebooks &amp; Stationery Tanzania. Manufactured by Indigo Printed Limited. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
              <Link
                to="/tracking"
                className="hover:text-[#ef4444] transition-colors cursor-pointer"
              >
                Track Parcel
              </Link>
              <span>·</span>
              <Link
                to="/wholesale#calculator"
                className="hover:text-[#ef4444] transition-colors cursor-pointer"
              >
                Carton Calculator
              </Link>
              <span>·</span>
              <Link
                to="/wishlist"
                className="hover:text-[#ef4444] transition-colors cursor-pointer"
              >
                Wishlist ({wishlistCount})
              </Link>
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
          <div className="flex items-center gap-2 pointer-events-auto bg-[#09090b]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#dc2626]/40 shadow-2xl">
            {/* Direct WhatsApp Orders Quick Pill */}
            <a
              href="https://wa.me/255715268391?text=Hello%20OMEGA%20Stationery%20Tanzania,%20I%20would%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-md transition-all hover:scale-105"
              title="Chat with Sales Desk on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">WhatsApp Orders</span>
            </a>

            {/* Wholesale Carton Calculator (Navigates directly to /wholesale without popup window) */}
            <Link
              to="/wholesale"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg btn-ledup-copper text-xs font-bold shadow-md hover:scale-105 transition-all group active:scale-95 text-white cursor-pointer"
              aria-label="Open Wholesale Carton & Tender Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-white" />
              <span>Wholesale Rates</span>
            </Link>
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



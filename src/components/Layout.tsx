import React from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  CheckCircle2,
  Heart,
  Truck,
  ShieldCheck,
  Cookie,
  Server,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { QuickViewModal } from './QuickViewModal';
import { CartDrawer } from './CartDrawer';
import { WishlistModal } from './WishlistModal';
import { OrderTrackingModal } from './OrderTrackingModal';
import { AuthModal } from './AuthModal';
import { CookieBanner } from './CookieBanner';
import { BackendStatusModal } from './BackendStatusModal';
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

  const [isBackendModalOpen, setIsBackendModalOpen] = React.useState(false);


  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#FAF7F0] text-[#14182B] font-sans selection:bg-[#F5A623] selection:text-[#1E2A5E]">
      {/* Reusable Boutique Navbar (AnnouncementBar, Header, MegaMenu, SearchOverlay, AccountDropdown, MobileMenu, MobileBottomBar) */}
      <Navbar />


      {/* ==================== 3. TOAST NOTIFICATIONS ==================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-[12px] bg-[#1E2A5E] text-white border border-[#F5A623]/40 shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#2A9D8F] shrink-0" />
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

      {/* ==================== 5. INK & PAPER OMEGA FOOTER (#1E2A5E) ==================== */}
      <footer className="bg-[#1E2A5E] text-stone-200 pt-16 pb-12 border-t border-[#E6E0D2]/20 shadow-xl mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/10">
            {/* Brand Hallmark */}
            <div className="lg:col-span-4 space-y-4">
              <Link to="/" className="inline-block">
                <OmegaLogo variant="badge" size="md" showSubtitle={true} />
              </Link>
              <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
                Tanzania's premier manufacturer and distributor of Counter Books (Q2, Q3, Q4), Exercise Books, Kraft Bahasha, and educational paper goods since 1998.
              </p>
              <div className="flex items-center gap-3 text-xs text-[#F5A623] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Genuine OMEGA Quality Guarantee</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                Collections
              </h4>
              <ul className="space-y-2 text-xs text-stone-300">
                <li>
                  <Link to="/catalog?category=Counter+Books" className="hover:text-[#F5A623] transition-colors">
                    Counter Books (Q2-Q4)
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Exercise+Books" className="hover:text-[#F5A623] transition-colors">
                    Exercise Books (32-200p)
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Bahasha+%26+Envelopes" className="hover:text-[#F5A623] transition-colors">
                    Kraft Bahasha Envelopes
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Office+Supplies" className="hover:text-[#F5A623] transition-colors">
                    Files &amp; Manila Folders
                  </Link>
                </li>
              </ul>
            </div>

            {/* Dedicated Tanzanian Phone Hotlines */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                Sales &amp; Dispatch Hotlines
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a
                    href="https://wa.me/255715268391"
                    className="block text-white hover:text-[#F5A623] font-mono font-bold transition-colors"
                  >
                    +255 715 268 391 <span className="text-stone-300 font-sans font-normal">(Desk 1 · General)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/255624265480"
                    className="block text-white hover:text-[#F5A623] font-mono font-bold transition-colors"
                  >
                    +255 624 265 480 <span className="text-stone-300 font-sans font-normal">(Desk 2 · Wholesale)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/255699032777"
                    className="block text-white hover:text-[#F5A623] font-mono font-bold transition-colors"
                  >
                    +255 699 032 777 <span className="text-stone-300 font-sans font-normal">(Desk 3 · Logistics)</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Kariakoo Central Location */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                Warehouse Location
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Kariakoo Central Commercial Hub, P.O. Box 10424, Dar es Salaam, Tanzania.
              </p>
              <div className="p-3 rounded-[12px] bg-white/5 border border-white/10 space-y-1 text-xs">
                <span className="text-[#F5A623] font-bold block">Business Hours:</span>
                <span className="text-stone-300">Mon - Sat: 8:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Legal */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <p>© {new Date().getFullYear()} OMEGA Writing Notebooks &amp; Stationery Tanzania. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setIsTrackingModalOpen(true)}
                className="hover:text-[#F5A623] transition-colors flex items-center gap-1.5 text-stone-300"
              >
                <Truck className="w-3.5 h-3.5 text-[#F5A623]" />
                <span>Track Parcel</span>
              </button>
              <button
                type="button"
                onClick={() => setIsWishlistModalOpen(true)}
                className="hover:text-[#F5A623] transition-colors flex items-center gap-1.5 text-stone-300"
              >
                <Heart className="w-3.5 h-3.5 text-[#D64545]" />
                <span>Wishlist ({wishlistCount})</span>
              </button>
              <Link to="/about" className="hover:text-[#F5A623] transition-colors text-stone-300">
                About
              </Link>
              <Link to="/contact" className="hover:text-[#F5A623] transition-colors text-stone-300">
                Contact
              </Link>
              <button
                type="button"
                onClick={openCookiePreferences}
                className="hover:text-[#F5A623] transition-colors flex items-center gap-1.5 text-stone-300"
              >
                <Cookie className="w-3.5 h-3.5 text-[#F5A623]" />
                <span>Cookies &amp; Session</span>
              </button>
              <button
                type="button"
                onClick={() => setIsBackendModalOpen(true)}
                className="hover:text-[#F5A623] transition-colors flex items-center gap-1.5 text-stone-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10"
              >
                <Server className="w-3.5 h-3.5 text-[#F5A623]" />
                <span>Backend &amp; DB</span>
                <span
                  className={`w-2 h-2 rounded-full inline-block ${
                    isBackendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Global E-Commerce Modals */}
      <QuickViewModal />
      <CartDrawer />
      <WishlistModal />
      <OrderTrackingModal />
      <AuthModal />
      <CookieBanner forceOpen={isCookieBannerOpen} onClose={closeCookiePreferences} />
      <BackendStatusModal isOpen={isBackendModalOpen} onClose={() => setIsBackendModalOpen(false)} />
    </div>
  );
};



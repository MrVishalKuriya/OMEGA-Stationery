import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, X, MessageCircle } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { QuickViewModal, ProductCompareModal } from '@/presentation/features/products';
import { CartDrawer, OrderTrackingModal } from '@/presentation/features/cart';
import { WishlistModal } from '@/presentation/features/wishlist';
import { AuthModal } from '@/presentation/features/auth';
import { WholesaleCalculatorModal } from '@/presentation/features/wholesale';
import { CookieBanner } from '../components/CookieBanner';
import { BackendStatusModal } from '../components/BackendStatusModal';
import { Navbar } from './navbar';
import { Footer } from './footer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPage =
    location.pathname.startsWith('/omega-hq') ||
    location.pathname.startsWith('/admin');

  const {
    isCookieBannerOpen,
    closeCookiePreferences,
    toastMessage,
    clearToast,
    storeConfig,
  } = useStore();

  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const cleanWhatsappDigits = (storeConfig?.whatsappNumber || '255715268391').replace(/\D/g, '');

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-paper-base text-charcoal-ink font-sans selection:bg-[#DC2626] selection:text-white">
      {/* 1. Sleek Modern Header (AnnouncementBar, Header with Search & 2-Lang Toggle, Category Rail) */}
      <Navbar />

      {/* 2. Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-charcoal-ink text-paper-base rounded-md border border-[#E7E5E0] shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#DC2626] shrink-0" />
          <span className="text-xs font-bold text-white">{toastMessage}</span>
          <button
            onClick={clearToast}
            className="ml-2 text-white/80 hover:text-white p-1"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Main Page Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {children}
      </main>

      {/* 4. Prestige E-Commerce Footer (Trust Pillars, Directory, Hotlines, Copyright) */}
      <Footer />

      {/* 5. Floating WhatsApp Sales Help Button (Hidden on Admin Portal) */}
      {!isAdminPage && (
        <aside aria-label="WhatsApp Assistance" className="fixed bottom-5 right-5 z-40 flex items-center pointer-events-auto">
          <a
            href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
              'Habari OMEGA Stationery, ninahitaji msaada wa kuagiza vifaa vya stationery.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with OMEGA Stationery Sales Desk on WhatsApp"
            className="group relative flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_10px_30px_rgba(37,211,102,0.55)] transition-all duration-300 hover:scale-105 active:scale-95"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-5 h-5 fill-white text-transparent shrink-0" />
            <span className="hidden sm:inline font-sans font-bold text-xs tracking-wider uppercase">
              WhatsApp
            </span>
          </a>
        </aside>
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

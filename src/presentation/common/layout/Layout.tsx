import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Tag,
  MessageCircle,
  ArrowUp,
  MapPin,
  Phone,
  WifiOff,
  Mail,
  Clock,
  Building2,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { QuickViewModal, ProductCompareModal } from '@/presentation/features/products';
import { CartDrawer, OrderTrackingModal } from '@/presentation/features/cart';
import { WishlistModal } from '@/presentation/features/wishlist';
import { AuthModal } from '@/presentation/features/auth';
import { CookieBanner } from '../components/CookieBanner';
import { BackendStatusModal } from '../components/BackendStatusModal';
import { Navbar } from './navbar';
import { BrandLogo } from '@/components/BrandLogo';

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
  } = useStore();

  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hasPulsedWhatsApp, setHasPulsedWhatsApp] = useState(false);

  // Monitor scroll for Back-to-Top (> 600px)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Monitor Offline state
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // One gentle WhatsApp pulse on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPulsedWhatsApp(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[var(--bg)] text-[var(--text)] font-sans selection:bg-[var(--red)]/30 selection:text-white">
      
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="bg-[var(--red)] text-white text-xs font-mono font-bold py-2 px-4 flex items-center justify-center gap-2 sticky top-0 z-50">
          <WifiOff size={16} strokeWidth={2} />
          <span>You are currently offline. Viewing cached OMEGA catalog.</span>
        </div>
      )}

      {/* Header */}
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[var(--surface-1)] text-[var(--text)] border border-[var(--gold)]/40 shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[var(--red)] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            onClick={clearToast}
            className="ml-2 text-[var(--text-muted)] hover:text-[var(--text)] p-1 cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {children}
      </main>

      {/* ========================================================================= */}
      {/* FOOTER SECTION: Slim Icon Strip + Surface-1 Card with Gold Hairline */}
      {/* ========================================================================= */}
      <footer className="w-full max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8 pb-12 sm:pb-16 pt-8 space-y-6">
        
        {/* Slim Icon Strip */}
        <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] p-4 sm:p-6 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
            
            {/* 1. Delivery */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--red)] shrink-0">
                <Truck size={18} strokeWidth={2} />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-[var(--text)] font-sans">Fast Delivery</h4>
                <p className="text-[10.5px] text-[var(--text-muted)] font-mono">All 31 regions in Tanzania</p>
              </div>
            </div>

            {/* 2. Quality */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--gold)] shrink-0">
                <ShieldCheck size={18} strokeWidth={2} />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-[var(--text)] font-sans">100% Quality</h4>
                <p className="text-[10.5px] text-[var(--text-muted)] font-mono">70 GSM bleed-proof bond</p>
              </div>
            </div>

            {/* 3. Fair Price */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--red)] shrink-0">
                <Tag size={18} strokeWidth={2} />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-[var(--text)] font-sans">Fair Price</h4>
                <p className="text-[10.5px] text-[var(--text-muted)] font-mono">Factory-direct wholesale</p>
              </div>
            </div>

            {/* 4. WhatsApp Support */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[#25D366] shrink-0">
                <MessageCircle size={18} strokeWidth={2} />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-[var(--text)] font-sans">Direct Desk</h4>
                <p className="text-[10.5px] text-[var(--text-muted)] font-mono">+255 746 268 391</p>
              </div>
            </div>

          </div>
        </div>

        {/* Surface-1 Rounded Footer Card with Gold Hairline */}
        <div className="bg-[var(--surface-1)] text-[var(--text)] rounded-2xl p-8 sm:p-12 shadow-2xl border border-[var(--border)] border-t border-t-[var(--gold)]/35 relative overflow-hidden">
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left">
            
            {/* Col 1: Wordmark & Address (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <BrandLogo size="lg" />
              <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-sm font-sans">
                Tanzania&apos;s premier benchmark manufacturer of authentic Counter Books (Q2, Q3, Q4), Exercise Books, Kraft Bahasha, and educational paper products.
              </p>
              <div className="pt-2 flex items-start gap-2 text-xs text-[var(--text)]/90">
                <MapPin size={16} strokeWidth={2} className="shrink-0 text-[var(--red)] mt-0.5" />
                <span className="font-sans leading-snug">
                  Soweto SIDO Viwandani, Mbeya · Main Factory: Plot 30, Block F Kilwa Rd, Mkuranga, Dar es Salaam
                </span>
              </div>
            </div>

            {/* Col 2: Quick Links (3 cols) */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                Collections
              </h4>
              <ul className="space-y-2 text-xs text-[var(--text-muted)] font-sans">
                <li>
                  <Link to="/catalog?category=Counter+Books" className="hover:text-[var(--text)] transition-colors">
                    Counter Books (Q2-Q4)
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Exercise+Books" className="hover:text-[var(--text)] transition-colors">
                    Exercise Books (Single &amp; Double)
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Bahasha+%26+Envelopes" className="hover:text-[var(--text)] transition-colors">
                    Kraft Bahasha (A3–A6)
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Registers" className="hover:text-[var(--text)] transition-colors">
                    Office Registers &amp; Ruled Paper
                  </Link>
                </li>
                <li>
                  <Link to="/wholesale" className="hover:text-[var(--text)] transition-colors">
                    Wholesale Carton Rates
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Direct WhatsApp & Phone Hotline (4 cols) */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                Sales &amp; Dispatch Desk
              </h4>
              <p className="text-xs text-[var(--text-muted)] font-sans">
                Contact our factory representatives directly for bulk tenders or immediate upcountry bus parcel delivery.
              </p>
              
              <div className="pt-2 space-y-2.5">
                <a
                  href="https://wa.me/255624265480?text=Habari%20OMEGA%20Stationery,%20nahitaji%20bei%20za%20jumla."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#16a34a] text-white text-xs font-bold font-mono transition-transform active:scale-95 shadow-md"
                >
                  <MessageCircle size={16} strokeWidth={2} />
                  <span>WhatsApp: +255 624 265 480</span>
                </a>
                
                {/* Direct Phone Numbers List */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Phone size={14} strokeWidth={2} className="shrink-0 text-[var(--red)]" />
                    <a href="tel:+255715268391" className="hover:underline font-mono font-semibold text-[var(--text)]">
                      +255 715 268 391 (MD Desk)
                    </a>
                  </div>

                  {/* 2. Gupta Alok - Mbeya Branch Manager */}
                  <div className="flex items-start gap-2 text-xs">
                    <Phone size={14} strokeWidth={2} className="shrink-0 text-[var(--red)] mt-0.5" />
                    <div className="leading-snug">
                      <span className="text-[11px] font-sans text-[var(--text-muted)] block">
                        Mbeya Branch Manager · <strong className="text-[var(--text)] font-bold">Gupta Alok</strong>
                      </span>
                      <a href="tel:+255746268391" className="hover:underline font-mono font-semibold text-[var(--text)] block">
                        +255 746 268 391
                      </a>
                    </div>
                  </div>

                  {/* 3. Gupta Vivek - Mwanza Branch Manager */}
                  <div className="flex items-start gap-2 text-xs">
                    <Phone size={14} strokeWidth={2} className="shrink-0 text-[var(--red)] mt-0.5" />
                    <div className="leading-snug">
                      <span className="text-[11px] font-sans text-[var(--text-muted)] block">
                        Mwanza Branch Manager · <strong className="text-[var(--text)] font-bold">Gupta Vivek</strong>
                      </span>
                      <a href="tel:+255699032777" className="hover:underline font-mono font-semibold text-[var(--text)] block">
                        +255 699 032 777
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar inside Card */}
          <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-muted)] font-mono">
            <p>
              &copy; {new Date().getFullYear()} OMEGA Stationery Tanzania. Manufactured by Indigo Printed Limited.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/tracking" className="hover:text-[var(--gold)] transition-colors">
                Track Parcel
              </Link>
              <span>·</span>
              <Link to="/about" className="hover:text-[var(--gold)] transition-colors">
                About Us
              </Link>
              <span>·</span>
              <Link to="/contact" className="hover:text-[var(--gold)] transition-colors">
                Contact
              </Link>
            </div>
          </div>

        </div>

      </footer>

      {/* Floating Back to Top Button (> 600px) */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          className="fixed bottom-20 right-5 z-40 w-11 h-11 rounded-full bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--gold)] hover:text-[var(--gold)] shadow-lg flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer"
        >
          <ArrowUp size={18} strokeWidth={2.2} />
        </button>
      )}

      {/* Floating WhatsApp Action Button with gentle initial pulse */}
      {!isAdminPage && (
        <div className="fixed bottom-5 right-5 z-40">
          <a
            href="https://wa.me/255746268391?text=Hello%20OMEGA%20Stationery%20Tanzania,%20I%20would%20like%20to%20place%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/40 ${
              !hasPulsedWhatsApp ? 'animate-bounce' : ''
            }`}
            title="Chat with Sales Desk on WhatsApp (+255 746 268 391)"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-5 h-5 fill-white text-white" />
            <span className="font-sans font-bold">WhatsApp Orders</span>
          </a>
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
      <ProductCompareModal isOpen={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)} />
    </div>
  );
};

export default Layout;

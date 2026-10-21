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
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { QuickViewModal, ProductCompareModal } from '@/presentation/features/products';
import { CartDrawer, OrderTrackingModal } from '@/presentation/features/cart';
import { WishlistModal } from '@/presentation/features/wishlist';
import { AuthModal } from '@/presentation/features/auth';
import { WholesaleCalculatorModal } from '@/presentation/features/wholesale';
import { CookieBanner } from '../components/CookieBanner';
import { BackendStatusModal } from '../components/BackendStatusModal';
import { OmegaLogo } from '../components/OmegaLogo';
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
          {/* Top 4 Trust Signals Banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pb-8 sm:pb-12 border-b border-white/10">
            <div className="p-3 sm:p-4 rounded-[14px] sm:rounded-[18px] bg-[#3b352f]/80 border border-[#e2dedb]/15 flex items-center gap-2.5 sm:gap-3.5 hover:border-[#c49b7c] transition-all group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-[10px] sm:rounded-[12px] bg-[#4b423b] border border-[#c49b7c]/40 text-[#c49b7c] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#c49b7c]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white font-heading truncate">
                  Nationwide Dispatch
                </h4>
                <p className="text-[10px] sm:text-[11px] text-[#beb5ae] mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Kariakoo Dar &amp; Upcountry bus parcels
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-[14px] sm:rounded-[18px] bg-[#3b352f]/80 border border-[#e2dedb]/15 flex items-center gap-2.5 sm:gap-3.5 hover:border-[#c49b7c] transition-all group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-[10px] sm:rounded-[12px] bg-[#4b423b] border border-[#c49b7c]/40 text-[#c49b7c] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A9D8F]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white font-heading truncate">
                  100% Genuine OMEGA
                </h4>
                <p className="text-[10px] sm:text-[11px] text-[#beb5ae] mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Thread-sewn hardcovers &amp; 70 GSM paper
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-[14px] sm:rounded-[18px] bg-[#3b352f]/80 border border-[#e2dedb]/15 flex items-center gap-2.5 sm:gap-3.5 hover:border-[#c49b7c] transition-all group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-[10px] sm:rounded-[12px] bg-[#c49b7c] text-[#23201d] flex items-center justify-center shrink-0 shadow-sm font-bold group-hover:scale-105 transition-transform">
                <Percent className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white font-heading truncate">
                  Wholesale Carton Tiers
                </h4>
                <p className="text-[10px] sm:text-[11px] text-[#beb5ae] mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Direct volume savings up to 40% OFF
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-[14px] sm:rounded-[18px] bg-[#3b352f]/80 border border-[#e2dedb]/15 flex items-center gap-2.5 sm:gap-3.5 hover:border-[#c49b7c] transition-all group">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-[10px] sm:rounded-[12px] bg-[#2A9D8F] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white font-heading truncate">
                  4 WhatsApp Hotlines
                </h4>
                <p className="text-[10px] sm:text-[11px] text-[#beb5ae] mt-0.5 line-clamp-1 sm:line-clamp-none">
                  2 Boss Desks &amp; 2 Regional Branches
                </p>
              </div>
            </div>
          </div>

          {/* B) 4-Column Master Architectural Grid (responsive stacking) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/10">
            {/* Column 1: Brand Hallmark & Factory Origin */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 space-y-4">
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
                  <Building2 className="w-4 h-4 text-[#c49b7c] shrink-0" />
                  <span>Soweto SIDO Viwandani (Mbeya Branch &amp; Factory)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#beb5ae]">
                  <Building2 className="w-4 h-4 text-[#c49b7c] shrink-0" />
                  <span>Mwanza Regional Branch &amp; Distribution Hub</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#beb5ae]">
                  <MapPin className="w-4 h-4 text-[#c49b7c] shrink-0" />
                  <span>Kariakoo Central Warehouse · Dar es Salaam</span>
                </div>
              </div>
            </div>

            {/* Column 2: Collections */}
            <div className="col-span-1 sm:col-span-1 lg:col-span-2 space-y-3">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white border-b border-white/10 pb-1.5">
                Collections
              </h4>
              <ul className="space-y-2 text-[11px] sm:text-xs text-stone-300">
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

            {/* Column 3: Wholesale & B2B Tenders */}
            <div className="col-span-1 sm:col-span-1 lg:col-span-2 space-y-3">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white border-b border-white/10 pb-1.5">
                Wholesale &amp; Tenders
              </h4>
              <ul className="space-y-2 text-[11px] sm:text-xs text-stone-300">
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

            {/* Column 4: Executive Leadership & Regional Branches */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 space-y-4">
              {/* Executive Leadership Card (Styled per OMEGA Leadership Spec) */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#1c1815] via-[#241f1a] to-[#171412] border border-[#c49b7c]/35 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#c49b7c]/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#c49b7c] uppercase font-bold block">
                      OMEGA
                    </span>
                    <h4 className="font-heading text-xs sm:text-sm font-bold tracking-wide text-white uppercase">
                      Our Leadership
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>DIRECT DESKS</span>
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* Co-Founder 01: KANTI BHAI K. HALAI */}
                  <a
                    href="https://wa.me/255715268391?text=Hello%20Kanti%20Bhai%20K.%20Halai,%20inquiry%20from%20website"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-[#c49b7c]/50 transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-xs text-white group-hover:text-[#c49b7c] transition-colors">
                          +255 715 268 391
                        </div>
                        <div className="text-[10px] text-stone-300 font-semibold truncate">
                          KANTI BHAI K. HALAI
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#c49b7c] block">
                        Founder &amp; MD
                      </span>
                      <span className="text-[9px] text-stone-400 font-medium block">
                        Managing Director
                      </span>
                    </div>
                  </a>

                  {/* Co-Founder 02: VIJESH K. HALAI */}
                  <a
                    href="https://wa.me/255624265480?text=Hello%20VIJESH%20K.%20HALAI,%20inquiry%20from%20website"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-[#c49b7c]/50 transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-xs text-white group-hover:text-[#c49b7c] transition-colors">
                          +255 624 265 480
                        </div>
                        <div className="text-[10px] text-stone-200 font-bold truncate">
                          VIJESH K. HALAI
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#c49b7c] block">
                        Co-Founder &amp; MD
                      </span>
                      <span className="text-[9px] text-stone-400 font-medium block">
                        Managing Director
                      </span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Regional Branch Desks */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                    Regional Branches
                  </h5>
                  <span className="text-[10px] text-stone-400 font-mono">Factory &amp; Hubs</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {/* Mbeya Branch */}
                  <a
                    href="https://wa.me/255746268391?text=Hello%20Mbeya%20Branch,%20inquiry%20from%20website"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#2a241f]/80 border border-white/10 hover:border-[#c49b7c] flex items-center justify-between text-white hover:text-[#c49b7c] transition-all group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-[11px] text-white">+255 746 268 391</div>
                        <div className="text-[10px] text-stone-400 truncate">Soweto SIDO Viwandani</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-1">
                      <span className="text-[10px] text-[#beb5ae] font-bold block">Mbeya</span>
                      <span className="text-[9px] text-stone-400 block">Factory</span>
                    </div>
                  </a>

                  {/* Mwanza Branch */}
                  <a
                    href="https://wa.me/255699032777?text=Hello%20Mwanza%20Branch,%20inquiry%20from%20website"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#2a241f]/80 border border-white/10 hover:border-[#c49b7c] flex items-center justify-between text-white hover:text-[#c49b7c] transition-all group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-[11px] text-white">+255 699 032 777</div>
                        <div className="text-[10px] text-stone-400 truncate">Lake Zone Regional</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-1">
                      <span className="text-[10px] text-[#beb5ae] font-bold block">Mwanza</span>
                      <span className="text-[9px] text-stone-400 block">Regional</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Official Email */}
              <div className="pt-1">
                <a
                  href="mailto:indigoprinter06423@gmail.com"
                  className="text-[11px] sm:text-xs text-stone-300 hover:text-[#c49b7c] flex items-center gap-2 transition-colors font-mono truncate bg-white/5 p-2 rounded-xl border border-white/5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#c49b7c] shrink-0" />
                  <span className="truncate">indigoprinter06423@gmail.com</span>
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

      {/* Floating High-Contrast Quick Action Dock (Hidden on Admin Portal) */}
      {!isAdminPage && (
        <div className="fixed bottom-4 right-3 sm:bottom-5 sm:right-5 z-40 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto bg-[#1e1b18]/90 backdrop-blur-md p-1.5 rounded-full border border-[#c49b7c]/40 shadow-2xl">
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

            {/* Wholesale Carton Calculator (LEDUP Copper Gradient) */}
            <button
              type="button"
              onClick={() => setIsWholesaleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full btn-ledup-copper text-xs font-bold shadow-md hover:scale-105 transition-all group active:scale-95 text-white"
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



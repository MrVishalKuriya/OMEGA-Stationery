import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  User,
  Heart,
  Package,
  Phone,
  MessageCircle,
  Globe,
  ChevronRight,
  LogOut,
  Info,
  Layers,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import {
  IconCounterBook,
  IconExerciseBook,
  IconKraftBahasha,
  IconWholesaleCarton,
  IconSchoolTender,
} from '@/presentation/common/components/CustomIcons';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
  onOpenWishlist?: () => void;
  onOpenTracking?: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    wishlistCount,
    language,
    toggleLanguage,
    storeConfig,
    currentUser,
    logout,
  } = useStore();

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanWhatsappDigits = (storeConfig.whatsappNumber || '+255715268391').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    'Habari OMEGA Stationery, ninahitaji msaada wa kuagiza vifaa vya stationery.'
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200"
    >
      {/* Dimmed Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Slide-In Architectural Charcoal, Crimson & Pure Paper Drawer from Left */}
      <div className="relative w-full max-w-[320px] sm:max-w-sm h-full bg-[#FFFFFF] text-[#111113] flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-250">
        
        {/* 1. Header Bar: Deep Charcoal with Crimson Bottom Rule, White Logo & Close Icon */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-[#141416] text-white border-b-2 border-[#DC2626]">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[2px] bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
              <img
                src="/logo-icon.png"
                alt="OMEGA Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-base font-black tracking-wider text-white">
                OMEGA
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#DC2626] uppercase -mt-0.5 font-bold">
                STATIONERY &amp; BOOKS
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center rounded-[2px] text-white/90 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. User Profile / Welcome Section */}
        <div className="p-4 bg-[#F9F8F6] border-b border-[#E7E5E0]">
          {currentUser ? (
            <div className="flex items-center justify-between gap-3">
              <Link
                to="/account"
                onClick={onClose}
                className="flex items-center gap-2.5 min-w-0 group"
              >
                <div className="w-9 h-9 rounded-[2px] bg-[#DC2626] text-white font-bold text-xs flex items-center justify-center font-mono shrink-0 shadow-xs">
                  {currentUser.initials || currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#111113] truncate group-hover:text-[#DC2626] transition-colors">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-[#4B5563] truncate">
                    {currentUser.email}
                  </div>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="text-[#4B5563] hover:text-[#DC2626] p-1.5 rounded-[2px] hover:bg-white transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-[#111113]">
                <div className="w-8 h-8 rounded-[2px] bg-white border border-[#E7E5E0] flex items-center justify-center text-[#DC2626] shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111113]">
                    {language === 'sw' ? 'Karibu OMEGA Stationery' : 'Welcome to OMEGA'}
                  </div>
                  <div className="text-[10px] text-[#4B5563]">
                    {language === 'sw' ? 'Ingia ili uone bei ya jumla ya kiwandani' : 'Sign in for wholesale carton prices'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="py-2 px-3 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-xs font-bold text-center text-white shadow-xs transition-colors"
                >
                  {language === 'sw' ? 'Ingia' : 'Sign In'}
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="py-2 px-3 rounded-[2px] bg-white border border-[#111113] hover:bg-[#111113] hover:text-white text-xs font-bold text-center text-[#111113] transition-colors shadow-2xs"
                >
                  {language === 'sw' ? 'Jisajili' : 'Register'}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 3. Scrollable Clean Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          
          {/* Shop Categories Section */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626] px-2.5 block mb-1.5 font-mono">
              {language === 'sw' ? 'Bidhaa Kuu' : 'Shop Categories'}
            </span>

            <Link
              to="/catalog"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[2px] text-xs font-semibold text-[#111113] hover:text-[#DC2626] hover:bg-[#F9F8F6] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-[#DC2626]" />
                <span>{language === 'sw' ? 'Katalogi Nzima ya Vifaa' : 'All Stationery Catalog'}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#6E6B66]" />
            </Link>

            <Link
              to="/catalog?category=Counter+Books"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[2px] text-xs font-semibold text-[#111113] hover:text-[#DC2626] hover:bg-[#F9F8F6] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <IconCounterBook className="w-4 h-4 text-[#DC2626]" />
                <span>Counter Books (Q1 – Q4)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#6E6B66]" />
            </Link>

            <Link
              to="/catalog?category=Exercise+Books"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[2px] text-xs font-semibold text-[#111113] hover:text-[#DC2626] hover:bg-[#F9F8F6] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <IconExerciseBook className="w-4 h-4 text-[#DC2626]" />
                <span>{language === 'sw' ? 'Madaftari ya Shule' : 'Exercise Books (80p–200p)'}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#6E6B66]" />
            </Link>

            <Link
              to="/catalog?category=Bahasha+%26+Envelopes"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[2px] text-xs font-semibold text-[#111113] hover:text-[#DC2626] hover:bg-[#F9F8F6] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <IconKraftBahasha className="w-4 h-4 text-[#DC2626]" />
                <span>{language === 'sw' ? 'Bahasha Nzito za Kraft' : 'Kraft Bahasha & Envelopes'}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#6E6B66]" />
            </Link>
          </div>

          {/* B2B & Wholesale Section */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626] px-2.5 block mb-1.5 font-mono">
              {language === 'sw' ? 'Bei za Jumla & Zabuni' : 'Wholesale & Tenders'}
            </span>

            <Link
              to="/wholesale"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[2px] text-xs font-bold text-[#111113] bg-[#F9F8F6] border border-[#E7E5E0] hover:border-[#DC2626] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <IconWholesaleCarton className="w-4 h-4 text-[#DC2626]" />
                <span>{language === 'sw' ? 'Oda za Jumla (Katoni)' : 'Wholesale Bulk Cartons'}</span>
              </div>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-[2px] bg-[#DC2626] text-white">
                B2B
              </span>
            </Link>

            <Link
              to="/school-tenders"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[2px] text-xs font-semibold text-[#111113] hover:text-[#DC2626] hover:bg-[#F9F8F6] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <IconSchoolTender className="w-4 h-4 text-[#DC2626]" />
                <span>{language === 'sw' ? 'Zabuni za Shule na Vyuo' : 'School Tenders'}</span>
              </div>
              <span className="text-[9px] text-white font-mono font-bold bg-[#111113] px-1.5 py-0.5 rounded-[2px]">
                NECTA
              </span>
            </Link>
          </div>

          {/* Account, Orders & Support Section */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626] px-2.5 block mb-1.5 font-mono">
              {language === 'sw' ? 'Akaunti & Huduma' : 'Account & Service'}
            </span>

            <Link
              to={currentUser ? '/account' : '/login'}
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[2px] text-xs font-semibold text-[#111113] hover:text-[#DC2626] hover:bg-[#F9F8F6] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-[#DC2626]" />
                <span>{language === 'sw' ? 'Wasifu Wangu (Profile)' : 'My Profile & Account'}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#6E6B66]" />
            </Link>

            <Link
              to="/tracking"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[2px] text-xs font-semibold text-[#111113] hover:text-[#DC2626] hover:bg-[#F9F8F6] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-[#DC2626]" />
                <span>{language === 'sw' ? 'Fuatilia Mzigo / Oda' : 'Track Order Delivery'}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#6E6B66]" />
            </Link>

            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[2px] text-xs font-semibold text-[#111113] hover:text-[#DC2626] hover:bg-[#F9F8F6] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-[#DC2626]" />
                <span>{language === 'sw' ? 'Vitu Ninavyopenda' : 'Wishlist'}</span>
              </div>
              {wishlistCount > 0 ? (
                <span className="px-2 py-0.5 rounded-[2px] bg-[#DC2626] text-white text-[10px] font-bold font-mono">
                  {wishlistCount}
                </span>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#6E6B66]" />
              )}
            </Link>

            <Link
              to="/contact"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[2px] text-xs font-semibold text-[#111113] hover:text-[#DC2626] hover:bg-[#F9F8F6] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#DC2626]" />
                <span>{language === 'sw' ? 'Wasiliana Nasi (Contact)' : 'Contact Us & Factory'}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#6E6B66]" />
            </Link>

            <Link
              to="/about"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-[2px] text-xs font-semibold text-[#4B5563] hover:text-[#DC2626] hover:bg-[#F9F8F6] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-[#6E6B66]" />
                <span>{language === 'sw' ? 'Kuhusu Kiwanda cha OMEGA' : 'About OMEGA Tanzania'}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#6E6B66]" />
            </Link>
          </div>

        </div>

        {/* 4. Footer Quick Actions */}
        <div className="p-3.5 bg-[#F9F8F6] border-t border-[#E7E5E0] space-y-2">
          {/* Language Switcher Button */}
          <div className="flex items-center justify-between px-3 py-2 rounded-[2px] bg-white border border-[#E7E5E0] text-xs">
            <div className="flex items-center gap-2 text-[#111113]">
              <Globe className="w-4 h-4 text-[#DC2626]" />
              <span className="text-xs font-semibold">
                {language === 'sw' ? 'Lugha' : 'Language'}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-[2px] bg-[#111113] text-white font-mono font-bold text-xs uppercase transition-colors cursor-pointer"
            >
              {language === 'sw' ? '🇹🇿 Kiswahili' : '🇬🇧 English'}
            </button>
          </div>

          {/* WhatsApp Direct Order Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider shadow-xs active:scale-98 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Order on WhatsApp</span>
          </a>

          {/* Hotline Phone */}
          <a
            href={`tel:${(storeConfig.phoneNumber || '+255715268391').replace(/\s+/g, '')}`}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-[2px] bg-white border border-[#E7E5E0] text-xs font-mono font-bold text-[#111113] hover:border-[#DC2626] active:scale-98 transition-all shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>{storeConfig.phoneNumber || '+255 715 268 391'}</span>
          </a>
        </div>

      </div>
    </div>
  );
};

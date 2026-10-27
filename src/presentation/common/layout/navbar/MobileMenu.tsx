import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  ChevronDown,
  ChevronRight,
  Heart,
  Package,
  Globe,
  MessageCircle,
  Phone,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Search,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { MEGA_MENU_DATA } from './MegaMenu';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenTracking: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
  onOpenWishlist,
  onOpenTracking,
}) => {
  const {
    wishlistCount,
    language,
    toggleLanguage,
    storeConfig,
    currentUser,
    openAuthModal,
    logout,
  } = useStore();

  const navigate = useNavigate();
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('notebooks');

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      onClose();
    }
  };

  // Lock body scroll
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

  const toggleAccordion = (id: string) => {
    setExpandedCategory((prev) => (prev === id ? null : id));
  };

  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    'Habari OMEGA Stationery, ninahitaji msaada wa kuagiza vifaa vya stationery.'
  )}`;

  const categories = Object.values(MEGA_MENU_DATA);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200"
    >
      {/* Dim Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Slide-In Drawer from Left */}
      <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-[#0d0d10] text-zinc-100 flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-250 border-r border-white/10">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#141418]">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 p-1 flex items-center justify-center shadow-xs shrink-0">
              <img
                src="/logo-icon.png"
                alt="OMEGA Icon"
                className="w-full h-full object-contain brightness-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-base font-bold tracking-wider text-white">
                OMEGA
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#ef4444] uppercase -mt-0.5">
                STATIONERY
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Search Input */}
        <div className="p-3 bg-[#111115] border-b border-white/10">
          <form onSubmit={handleMobileSearch} className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              role="searchbox"
              autoCapitalize="none"
              autoCorrect="off"
              enterKeyHint="search"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              placeholder={language === 'sw' ? 'Tafuta madaftari, bahasha...' : 'Search notebooks, bahasha...'}
              className="w-full pl-9 pr-8 py-2 text-xs bg-black/40 focus:bg-black/60 rounded-lg border border-white/15 focus:border-[#dc2626] text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#dc2626] transition-all"
            />
            {mobileSearchQuery && (
              <button
                type="button"
                onClick={() => setMobileSearchQuery('')}
                className="absolute right-2.5 p-1 text-zinc-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Mobile Account Section */}
        <div className="p-3 border-b border-white/10 bg-[#141418]">
          {currentUser ? (
            <div className="flex items-center justify-between gap-2">
              <Link
                to="/account"
                onClick={onClose}
                className="flex items-center gap-2.5 min-w-0 hover:opacity-90 transition-opacity"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b91c1c] to-[#ef4444] text-white font-bold text-xs flex items-center justify-center font-mono shrink-0 shadow-xs">
                  {currentUser.initials}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 block truncate">
                    {currentUser.email} • <span className="text-zinc-300 font-semibold underline">Manage</span>
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="text-[11px] font-bold text-[#ef4444] hover:text-[#dc2626] shrink-0 px-2 py-1 rounded-md hover:bg-white/5 transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="py-2 px-3 rounded-lg bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] hover:from-[#991b1b] hover:to-[#dc2626] text-xs font-bold text-center text-white block w-full shadow-md shadow-red-900/20 active:scale-98 cursor-pointer transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="py-2 px-3 rounded-lg bg-white/5 border border-white/15 hover:bg-white/10 text-xs font-bold text-center text-zinc-200 block w-full active:scale-98 cursor-pointer transition-all"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Tools Row (Wishlist, Track, Language) */}
        <div className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10 bg-[#111115] text-xs">
          <Link
            to="/wishlist"
            onClick={onClose}
            className="py-2.5 px-2 flex flex-col items-center gap-1 text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <div className="relative">
              <Heart className="w-4 h-4 text-[#ef4444]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[14px] h-[14px] px-1 rounded-full bg-[#dc2626] text-white text-[9px] font-bold flex items-center justify-center font-mono">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium">Wishlist</span>
          </Link>

          <Link
            to="/tracking"
            onClick={onClose}
            className="py-2.5 px-2 flex flex-col items-center gap-1 text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <Package className="w-4 h-4 text-zinc-300" />
            <span className="text-[11px] font-medium">Track Order</span>
          </Link>

          <button
            type="button"
            onClick={toggleLanguage}
            className="py-2.5 px-2 flex flex-col items-center gap-1 text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <Globe className="w-4 h-4 text-[#ef4444]" />
            <span className="text-[11px] font-mono font-bold uppercase text-white">
              {language === 'en' ? 'SW' : 'EN'}
            </span>
          </button>
        </div>

        {/* Scrollable Navigation Accordion */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          {/* Home Link */}
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </Link>

          {/* Catalog Root */}
          <Link
            to="/catalog"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <span>All Stationery Catalog</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 border border-white/10">
              Full Range
            </span>
          </Link>

          {/* Wholesale & Bulk Orders */}
          <Link
            to="/wholesale"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[#dc2626]/15 to-transparent border border-[#dc2626]/40 hover:border-[#dc2626]/70 transition-all shadow-xs mt-1"
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#ef4444]" />
              <span>Wholesale &amp; Bulk Orders</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gradient-to-r from-[#b91c1c] to-[#ef4444] text-white shadow-xs">
              B2B Cartons
            </span>
          </Link>

          <div className="my-2 border-t border-white/10" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 block mb-1">
            Browse Categories
          </span>

          {/* Category Accordion Items */}
          {categories.map((cat) => {
            const isExpanded = expandedCategory === cat.id;
            return (
              <div key={cat.id} className="rounded-lg border border-white/10 bg-white/[0.03] overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => toggleAccordion(cat.id)}
                  aria-expanded={isExpanded}
                  className="w-full flex items-center justify-between p-3 text-sm font-bold text-zinc-100 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{cat.name}</span>
                    {cat.badge && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#dc2626]/20 border border-[#dc2626]/40 text-[#ef4444]">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="p-3 pt-0 border-t border-white/10 bg-black/30 space-y-3 animate-in fade-in-50 duration-150">
                    {cat.columns.slice(0, 2).map((col, idx) => (
                      <div key={idx} className="space-y-1.5 pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                          {col.title}
                        </span>
                        <div className="space-y-1">
                          {col.items.map((item, itemIdx) => (
                            <Link
                              key={itemIdx}
                              to={item.href}
                              onClick={onClose}
                              className="flex items-center justify-between text-xs text-zinc-300 hover:text-white hover:translate-x-1 py-1 transition-all"
                            >
                              <span>{item.label}</span>
                              {item.badge && (
                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-[#dc2626]/20 text-[#ef4444] border border-[#dc2626]/30">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}

                    <Link
                      to={`/catalog?category=${encodeURIComponent(cat.name)}`}
                      onClick={onClose}
                      className="mt-2 inline-flex items-center justify-between w-full p-2.5 text-xs font-bold rounded-lg bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] hover:from-[#991b1b] hover:to-[#dc2626] text-white shadow-md shadow-red-900/20 active:scale-98 transition-all"
                    >
                      <span>Explore All {cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}

          <div className="my-2 border-t border-white/10" />

          {/* Secondary Pages */}
          <Link
            to="/about"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <span>About OMEGA Tanzania</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          </Link>
          <Link
            to="/contact"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <span>Factory &amp; Wholesale Contact</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          </Link>
        </div>

        {/* Footer Contact & WhatsApp Section */}
        <div className="p-4 border-t border-white/10 bg-[#141418] space-y-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold uppercase tracking-wider shadow-md active:scale-98 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Order on WhatsApp</span>
          </a>

          <a
            href={`tel:${(storeConfig.phoneNumber || '+255715268391').replace(/\s+/g, '')}`}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-white/5 border border-white/15 text-xs font-mono font-bold text-zinc-200 hover:text-white hover:bg-white/10 active:scale-98 transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-[#ef4444]" />
            <span>{storeConfig.phoneNumber || '+255 715 268 391'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

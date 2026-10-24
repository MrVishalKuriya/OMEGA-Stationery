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
import { useStore } from '../../context/StoreContext';
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
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Slide-In Drawer from Left */}
      <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-[#fafafa] text-[#14182B] flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-250 border-r border-[#e4e4e7]">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#e4e4e7] bg-white">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#e4e4e7] p-1 flex items-center justify-center shadow-2xs shrink-0">
              <img
                src="/logo-icon.png"
                alt="OMEGA Icon"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-heading text-base font-bold tracking-wider text-[#111113]">
              OMEGA
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#6B7280] hover:text-[#14182B] hover:bg-[#F3EEE2] transition-colors focus-ring-gold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Search Input */}
        <div className="p-3 bg-white border-b border-[#e4e4e7]">
          <form onSubmit={handleMobileSearch} className="relative flex items-center">
            <Search className="w-4 h-4 text-[#111113] absolute left-3 pointer-events-none" />
            <input
              type="search"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              placeholder={language === 'sw' ? 'Tafuta madaftari, bahasha...' : 'Search notebooks, bahasha...'}
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#fafafa] focus:bg-white rounded-[8px] border border-[#e4e4e7] focus:border-[#111113] text-[#14182B] placeholder:text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#111113]"
            />
            {mobileSearchQuery && (
              <button
                type="button"
                onClick={() => setMobileSearchQuery('')}
                className="absolute right-2.5 p-1 text-[#6B7280] hover:text-[#14182B]"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Mobile Account Section */}
        <div className="p-3 border-b border-[#e4e4e7] bg-white">
          {currentUser ? (
            <div className="flex items-center justify-between">
              <Link
                to="/account"
                onClick={onClose}
                className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-[#111113] text-[#dc2626] font-bold text-xs flex items-center justify-center font-mono shrink-0 shadow-2xs">
                  {currentUser.initials}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-[#14182B] block truncate leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#6B7280] block truncate">
                    {currentUser.email} • <span className="text-[#111113] font-semibold underline">Manage Account</span>
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="text-[11px] font-bold text-[#D64545] hover:underline shrink-0 ml-2"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openAuthModal('login');
                  }}
                  className="py-2.5 px-3 rounded-[6px] btn-indra-primary text-xs font-bold text-center block w-full shadow-xs cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openAuthModal('register');
                  }}
                  className="py-2.5 px-3 rounded-[6px] bg-[#fafafa] border border-[#e4e4e7] hover:bg-[#F3EEE2] text-xs font-bold text-center text-[#111113] block w-full cursor-pointer"
                >
                  Register
                </button>
              </div>
              <div className="text-center text-[10px] text-[#6B7280]">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="hover:text-[#111113] hover:underline"
                >
                  Open Full Sign In Page →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Tools Row (Wishlist, Track, Language) */}
        <div className="grid grid-cols-3 divide-x divide-[#e4e4e7] border-b border-[#e4e4e7] bg-[#F3EEE2]/70 text-xs">
          <button
            type="button"
            onClick={() => {
              onOpenWishlist();
              onClose();
            }}
            className="py-3 px-2 flex flex-col items-center gap-1 text-[#14182B] hover:text-[#111113] font-medium"
          >
            <div className="relative">
              <Heart className="w-4 h-4 text-[#D64545]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-[#D64545] text-white text-[9px] font-bold flex items-center justify-center font-mono">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[11px]">Wishlist</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenTracking();
              onClose();
            }}
            className="py-3 px-2 flex flex-col items-center gap-1 text-[#14182B] hover:text-[#111113] font-medium"
          >
            <Package className="w-4 h-4 text-[#111113]" />
            <span className="text-[11px]">Track Order</span>
          </button>

          <button
            type="button"
            onClick={toggleLanguage}
            className="py-3 px-2 flex flex-col items-center gap-1 text-[#14182B] hover:text-[#111113] font-medium"
          >
            <Globe className="w-4 h-4 text-[#dc2626]" />
            <span className="text-[11px] font-mono font-bold uppercase">
              {language === 'en' ? 'SW' : 'EN'}
            </span>
          </button>
        </div>

        {/* Scrollable Navigation Accordion */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {/* Home Link */}
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-[8px] text-sm font-semibold text-[#14182B] hover:bg-white hover:text-[#111113] transition-colors"
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 text-[#6B7280]" />
          </Link>

          {/* Catalog Root */}
          <Link
            to="/catalog"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-[10px] text-sm font-semibold text-[#2C1E1A] hover:bg-white hover:text-[#6D4C41] transition-colors"
          >
            <span>All Stationery Catalog</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6D4C41] text-white">
              Full Range
            </span>
          </Link>

          {/* Wholesale & Bulk Orders */}
          <Link
            to="/wholesale"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-[10px] text-sm font-bold text-[#6D4C41] bg-white border border-[#D7CCC8] hover:border-[#8D6E63] transition-colors shadow-2xs mt-1"
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#8D6E63]" />
              <span>Wholesale &amp; Bulk Orders</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8D6E63] text-white">
              B2B Cartons
            </span>
          </Link>

          <div className="my-2 border-t border-[#e4e4e7]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] px-3 block mb-1">
            Browse Categories
          </span>

          {/* Category Accordion Items */}
          {categories.map((cat) => {
            const isExpanded = expandedCategory === cat.id;
            return (
              <div key={cat.id} className="rounded-[8px] border border-[#e4e4e7] bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleAccordion(cat.id)}
                  aria-expanded={isExpanded}
                  className="w-full flex items-center justify-between p-3 text-sm font-bold text-[#14182B] hover:text-[#111113] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{cat.name}</span>
                    {cat.badge && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-[#dc2626] text-white">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-[#111113]' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="p-3 pt-0 border-t border-[#e4e4e7]/50 bg-[#fafafa] space-y-3 animate-in fade-in-50 duration-150">
                    {cat.columns.slice(0, 2).map((col, idx) => (
                      <div key={idx} className="space-y-1.5 pt-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] block">
                          {col.title}
                        </span>
                        <div className="space-y-1">
                          {col.items.map((item, itemIdx) => (
                            <Link
                              key={itemIdx}
                              to={item.href}
                              onClick={onClose}
                              className="flex items-center justify-between text-xs text-[#14182B] hover:text-[#111113] py-1 transition-colors"
                            >
                              <span>{item.label}</span>
                              {item.badge && (
                                <span className="text-[8px] font-bold px-1 rounded-full bg-[#dc2626]/25 text-[#111113]">
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
                      className="mt-2 inline-flex items-center justify-between w-full p-2.5 text-xs font-bold rounded-[8px] btn-ledup-copper shadow-xs"
                    >
                      <span>Explore All {cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}

          <div className="my-2 border-t border-[#e4e4e7]" />

          {/* Secondary Pages */}
          <Link
            to="/about"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-[8px] text-xs font-semibold text-[#6B7280] hover:text-[#14182B]"
          >
            <span>About OMEGA Tanzania</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/contact"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-[8px] text-xs font-semibold text-[#6B7280] hover:text-[#14182B]"
          >
            <span>Factory &amp; Wholesale Contact</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Footer Contact & WhatsApp Section */}
        <div className="p-4 border-t border-[#e4e4e7] bg-white space-y-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[8px] bg-[#2A9D8F] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#238276] transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Order on WhatsApp</span>
          </a>

          <a
            href={`tel:${(storeConfig.phoneNumber || '+255715268391').replace(/\s+/g, '')}`}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-[8px] bg-[#fafafa] border border-[#e4e4e7] text-xs font-mono font-bold text-[#111113] hover:bg-[#f5f4f4] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#111113]" />
            <span>{storeConfig.phoneNumber || '+255 715 268 391'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

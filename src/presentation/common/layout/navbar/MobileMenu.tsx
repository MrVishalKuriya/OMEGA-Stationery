import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  ChevronRight,
  BookOpen,
  Layers,
  FileText,
  Truck,
  Building2,
  Phone,
  Globe,
  Heart,
  Package,
  Search,
  Home,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { BrandLogo } from '@/components/BrandLogo';

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
  onOpenSearch,
  onOpenWishlist,
  onOpenTracking,
}) => {
  const { language, toggleLanguage, theme, toggleTheme, wishlistCount } = useStore();
  const navigate = useNavigate();

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

  const categories = [
    {
      title: 'Counter Books (Q2 – Q4)',
      subtitle: 'Hardcover Smyth-sewn archival ledgers',
      href: '/catalog?category=Counter+Books',
      icon: BookOpen,
      accent: 'text-[var(--gold)]',
    },
    {
      title: 'Exercise Books (200p / 100p / 80p)',
      subtitle: 'Single & double line school editions',
      href: '/catalog?category=Exercise+Books',
      icon: Layers,
      accent: 'text-[var(--red)]',
    },
    {
      title: 'Kraft Bahasha & Envelopes',
      subtitle: 'A3, A4, A5 heavy tear-resistant mailers',
      href: '/catalog?category=Bahasha+%26+Envelopes',
      icon: FileText,
      accent: 'text-[var(--gold)]',
    },
    {
      title: 'Office Registers & Ruled Paper',
      subtitle: '70 GSM pure white bond folios',
      href: '/catalog?category=Registers',
      icon: FileText,
      accent: 'text-[var(--red)]',
    },
  ];

  const businessLinks = [
    {
      title: language === 'sw' ? 'Bei za Jumla za Katoni' : 'Wholesale Carton Rates',
      badge: 'UP TO 20% OFF',
      href: '/wholesale',
      icon: Package,
    },
    {
      title: language === 'sw' ? 'Zabuni za Shule na Serikali' : 'School & Gov Tenders',
      badge: 'TENDER RFQ',
      href: '/school-tenders',
      icon: Building2,
    },
    {
      title: language === 'sw' ? 'Usafirishaji Mikoa Yote 31' : '31 Regions Bus Parcel Guide',
      href: '/shipping-guide',
      icon: Truck,
    },
  ];

  const infoLinks = [
    { title: language === 'sw' ? 'Kuhusu OMEGA (Tangu 1998)' : 'About OMEGA (Est. 1998)', href: '/about' },
    { title: language === 'sw' ? 'Wasiliana Nasi & Kiwanda' : 'Contact Factory Desk', href: '/contact' },
  ];

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
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Slide-In Drawer from Left */}
      <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-[var(--surface-1)] text-[var(--text)] flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-250 border-r border-[var(--border)] overflow-hidden">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--surface-2)]">
          <BrandLogo size="sm" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-1)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Bar */}
        <div className="p-4 border-b border-[var(--border)]">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSearch?.();
            }}
            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--gold)] text-xs sm:text-sm text-[var(--text)] transition-all shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Search className="w-4 h-4 text-[var(--gold)] shrink-0 group-hover:scale-110 transition-transform stroke-[2]" />
              <span className="font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] truncate">
                {language === 'sw' ? 'Tafuta bidhaa, madaftari...' : 'Search notebooks, folios...'}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[var(--surface-1)] border border-[var(--border)] group-hover:border-[var(--gold)] text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--gold)] shrink-0 transition-colors">
              {language === 'sw' ? 'Tafuta' : 'Search'}
            </span>
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
          {/* Home Page Button */}
          <div>
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-2)]/70 hover:bg-[var(--surface-2)] border border-[var(--border)] transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2 text-left">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface-1)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4 text-[var(--red)]" />
                </div>
                <span className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--gold)] transition-colors truncate">
                  {language === 'sw' ? 'Ukurasa wa Mwanzo (Home)' : 'Home Page'}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          </div>
          
          {/* Section 1: Product Categories */}
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[var(--gold)] block px-1 mb-2">
              CATALOGUE CATEGORIES
            </span>
            <div className="space-y-1">
              {categories.map((c) => {
                const Icon = c.icon;
                return (
                  <Link
                    key={c.title}
                    to={c.href}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--surface-2)] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2 text-left">
                      <div className="w-8 h-8 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center shrink-0">
                        <Icon className={`w-4 h-4 ${c.accent}`} />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-[var(--text)] group-hover:text-[var(--gold)] transition-colors truncate">
                          {c.title}
                        </span>
                        <span className="block text-[10.5px] text-[var(--text-muted)] truncate">
                          {c.subtitle}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 2: Wholesale & Procurement */}
          <div className="pt-2 border-t border-[var(--border)]">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[var(--gold)] block px-1 mb-2">
              B2B &amp; INSTITUTIONAL
            </span>
            <div className="space-y-1">
              {businessLinks.map((b) => {
                const Icon = b.icon;
                return (
                  <Link
                    key={b.title}
                    to={b.href}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--surface-2)] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2 text-left">
                      <div className="w-8 h-8 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--gold)]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[var(--text)] group-hover:text-[var(--gold)] transition-colors truncate">
                        {b.title}
                      </span>
                    </div>
                    {b.badge && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--red)] text-white shrink-0">
                        {b.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 3: Information & Hotline */}
          <div className="pt-2 border-t border-[var(--border)]">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[var(--gold)] block px-1 mb-2">
              COMPANY &amp; SUPPORT
            </span>
            <div className="space-y-1">
              {infoLinks.map((info) => (
                <Link
                  key={info.title}
                  to={info.href}
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--surface-2)] transition-colors text-xs font-bold text-[var(--text)] hover:text-[var(--gold)] text-left"
                >
                  <span>{info.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Drawer Footer with Language Switcher */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-2)]">
          <button
            type="button"
            onClick={toggleLanguage}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border)] text-xs font-mono font-bold text-[var(--text)] hover:border-[var(--gold)] transition-colors cursor-pointer shadow-xs"
          >
            <Globe size={15} className="text-[var(--red)]" />
            <span>{language === 'en' ? 'Badili lugha: Kiswahili' : 'Switch Language: English'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default MobileMenu;

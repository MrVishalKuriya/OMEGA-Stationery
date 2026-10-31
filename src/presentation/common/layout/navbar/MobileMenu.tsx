import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  ChevronRight,
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
  onOpenWishlist?: () => void;
  onOpenTracking?: () => void;
}

interface SidebarMenuItem {
  title: string;
  subtitle?: string;
  href: string;
}

const SIDEBAR_MENU_ITEMS: SidebarMenuItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'All Stationery Catalogues',
    href: '/catalog',
  },
  {
    title: 'Office Stationery & Supplies',
    href: '/catalog?category=Office+Supplies',
  },
  {
    title: 'Wholesale & Bulk Orders',
    subtitle: 'Cartons, bulk enquiries, wholesale prices',
    href: '/wholesale',
  },
];

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
}) => {
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#141418]">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 p-1 flex items-center justify-center shadow-xs shrink-0">
              <img
                src="/logo-icon-white.png"
                alt="OMEGA Icon"
                className="w-full h-full object-contain"
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

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-5 divide-y divide-white/10">
          {SIDEBAR_MENU_ITEMS.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              onClick={onClose}
              className="group flex items-center justify-between py-4 hover:bg-white/[0.03] -mx-2 px-2 rounded-lg transition-colors"
            >
              <div className="min-w-0 pr-3">
                <span className="block text-[15px] font-bold text-white group-hover:text-[#ef4444] transition-colors leading-snug">
                  {item.title}
                </span>
                {item.subtitle && (
                  <span className="block text-xs text-zinc-400 truncate mt-0.5">
                    {item.subtitle}
                  </span>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

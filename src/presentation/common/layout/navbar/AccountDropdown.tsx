import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  LogIn,
  UserPlus,
  Package,
  Heart,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Cookie,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface AccountDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrders: () => void;
  onOpenWishlist: () => void;
}

export const AccountDropdown: React.FC<AccountDropdownProps> = ({
  isOpen,
  onClose,
  onOpenOrders,
  onOpenWishlist,
}) => {
  const navigate = useNavigate();
  const {
    wishlistCount,
    currentUser,
    activeSession,
    logout,
    openCookiePreferences,
  } = useStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 50);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleOpenSignIn = () => {
    onClose();
    navigate('/login');
  };

  const handleOpenRegister = () => {
    onClose();
    navigate('/register');
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      role="menu"
      aria-label="Account Menu"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[var(--surface-1)] text-[var(--text)] border border-[var(--border)] shadow-2xl z-[100] p-2 animate-in fade-in slide-in-from-top-1 font-sans pointer-events-auto"
    >
      {/* Header Profile Info */}
      <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] mb-2">
        {currentUser ? (
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--surface-1)] text-[var(--gold)] border border-[var(--border)] font-bold text-sm flex items-center justify-center font-mono shrink-0 shadow-xs">
                {currentUser.initials}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <span className="text-xs font-bold text-[var(--text)] block truncate">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-[var(--text-muted)] block truncate font-mono">
                  {currentUser.email}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 mt-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  {currentUser.accountType === 'wholesale'
                    ? 'Wholesale Partner'
                    : currentUser.accountType === 'school'
                    ? 'Institutional Account'
                    : 'Verified OMEGA Member'}
                </span>
              </div>
            </div>

            {/* Active Session Indicator */}
            {activeSession && (
              <div className="mt-2 pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1 text-emerald-500 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Secure Session
                </span>
                <span className="font-mono text-[9px]">30-Day Cookie</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1 text-left">
            <span className="text-xs font-bold text-[var(--text)] block">
              Welcome to OMEGA Stationery
            </span>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Sign in to track orders, manage business invoices, and access wholesale rates.
            </p>
          </div>
        )}
      </div>

      {/* Menu Actions */}
      <div className="space-y-1 text-xs font-medium">
        {currentUser ? (
          <>
            <Link
              to="/account"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text)] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-[var(--gold)]" />
                <span>My Profile &amp; Settings</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOrders();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text)] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-[var(--red)]" />
                <span>Track Orders &amp; Waybills</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenWishlist();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text)] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-[var(--red)]" />
                <span>Saved Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[var(--red)] text-white text-[10px] font-mono font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            <div className="my-1 border-t border-[var(--border)]" />

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-[var(--red)] hover:bg-[var(--red)]/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleOpenSignIn}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text)] font-semibold transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <LogIn className="w-4 h-4 text-[var(--red)]" />
                <span>Sign In to Account</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={handleOpenRegister}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text)] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-4 h-4 text-[var(--gold)]" />
                <span>Create New Account</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="my-1 border-t border-[var(--border)]" />

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOrders();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text)] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-[var(--gold)]" />
                <span>Track Parcel (No Login Required)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountDropdown;

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
import { useStore } from '../../context/StoreContext';

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
  const {
    wishlistCount,
    currentUser,
    activeSession,
    openAuthModal,
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

    // Use standard click instead of mousedown to guarantee button click events complete
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
    openAuthModal('login');
  };

  const handleOpenRegister = () => {
    onClose();
    openAuthModal('register');
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
      className="absolute right-0 top-full mt-2 w-72 rounded-[12px] bg-white text-[#14182B] border border-[#E4DDCC] shadow-2xl z-[100] p-2 animate-in fade-in slide-in-from-top-1 font-sans pointer-events-auto"
    >
      {/* Header Profile Info */}
      <div className="p-3 rounded-[8px] bg-[#FAF7F0] border border-[#E4DDCC]/50 mb-2">
        {currentUser ? (
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E2A5E] text-[#F5A623] font-bold text-sm flex items-center justify-center font-mono shrink-0 shadow-xs">
                {currentUser.initials}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-[#14182B] block truncate">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-[#6B7280] block truncate font-mono">
                  {currentUser.email}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2A9D8F] mt-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  {currentUser.accountType === 'wholesale'
                    ? 'Wholesale Partner'
                    : currentUser.accountType === 'school'
                    ? 'Institutional Account'
                    : 'Verified OMEGA Member'}
                </span>
              </div>
            </div>

            {/* Active Session Token Indicator */}
            {activeSession && (
              <div className="mt-2 pt-2 border-t border-[#E4DDCC]/60 flex items-center justify-between text-[10px] text-[#6B7280]">
                <span className="flex items-center gap-1 text-[#2A9D8F] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] animate-pulse" />
                  Active Secure Session
                </span>
                <span className="font-mono text-[9px]">30-Day Cookie</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#14182B] block">
              Welcome to OMEGA Stationery
            </span>
            <p className="text-[11px] text-[#6B7280]">
              Sign in to track orders, manage business invoices and access wholesale tiers.
            </p>
          </div>
        )}
      </div>

      {/* Menu Actions */}
      <div className="space-y-1 text-xs font-medium">
        {/* My Account & Profile */}
        {currentUser && (
          <Link
            to="/account"
            onClick={onClose}
            className="w-full flex items-center justify-between p-2.5 rounded-[8px] hover:bg-[#F3EEE2] text-[#14182B] hover:text-[#1E2A5E] transition-colors group focus-ring-gold font-bold bg-[#FAF7F0]/60 border border-[#E4DDCC]/50"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-[#1E2A5E]" />
              <span>My Account &amp; Profile</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* Track Orders */}
        <button
          type="button"
          onClick={() => {
            onOpenOrders();
            onClose();
          }}
          className="w-full flex items-center justify-between p-2.5 rounded-[8px] hover:bg-[#F3EEE2] text-[#14182B] hover:text-[#1E2A5E] transition-colors group focus-ring-gold"
        >
          <div className="flex items-center gap-2.5">
            <Package className="w-4 h-4 text-[#1E2A5E]" />
            <span>My Orders &amp; Tracking</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => {
            onOpenWishlist();
            onClose();
          }}
          className="w-full flex items-center justify-between p-2.5 rounded-[8px] hover:bg-[#F3EEE2] text-[#14182B] hover:text-[#1E2A5E] transition-colors group focus-ring-gold"
        >
          <div className="flex items-center gap-2.5">
            <Heart className="w-4 h-4 text-[#D64545]" />
            <span>Saved Wishlist</span>
          </div>
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E4DDCC] text-[#14182B]">
            {wishlistCount}
          </span>
        </button>

        {/* Cookie & Session Privacy Settings */}
        <button
          type="button"
          onClick={() => {
            onClose();
            openCookiePreferences();
          }}
          className="w-full flex items-center justify-between p-2.5 rounded-[8px] hover:bg-[#F3EEE2] text-[#14182B] hover:text-[#1E2A5E] transition-colors group focus-ring-gold"
        >
          <div className="flex items-center gap-2.5">
            <Cookie className="w-4 h-4 text-[#F5A623]" />
            <span>Cookie &amp; Session Privacy</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:translate-x-0.5 transition-transform" />
        </button>


        <div className="my-1.5 border-t border-[#E4DDCC]" />

        {/* Login / Register or Logout */}
        {currentUser ? (
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-[8px] hover:bg-[#D64545]/10 text-[#D64545] font-semibold transition-colors focus-ring-gold"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        ) : (
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="navbar-signin-btn"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenSignIn();
                }}
                className="w-full py-2.5 px-3 rounded-[8px] btn-cta-yellow text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs cursor-pointer hover:brightness-105 active:scale-95 transition-all select-none"
              >
                <LogIn className="w-3.5 h-3.5 pointer-events-none" />
                <span className="pointer-events-none">Sign In</span>
              </button>
              <button
                type="button"
                id="navbar-register-btn"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenRegister();
                }}
                className="w-full py-2.5 px-3 rounded-[8px] bg-white border border-[#E4DDCC] hover:bg-[#F3EEE2] text-xs font-bold text-center text-[#1E2A5E] flex items-center justify-center gap-1.5 cursor-pointer hover:border-[#1E2A5E] active:scale-95 transition-all select-none"
              >
                <UserPlus className="w-3.5 h-3.5 pointer-events-none" />
                <span className="pointer-events-none">Register</span>
              </button>
            </div>
            <div className="text-center text-[10px] text-[#6B7280] pt-1">
              <Link
                to="/login"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="hover:text-[#1E2A5E] hover:underline cursor-pointer select-none"
              >
                Open Full Dedicated Sign In Page →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

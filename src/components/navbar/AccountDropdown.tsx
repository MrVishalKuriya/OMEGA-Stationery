import React, { useState, useEffect, useRef } from 'react';
import { User, LogIn, UserPlus, Package, Heart, LogOut, CheckCircle, ShieldCheck, ChevronRight } from 'lucide-react';
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
  const { wishlistCount, showToast } = useStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Simulated login state stored in localStorage
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; initials: string } | null>(() => {
    try {
      const saved = localStorage.getItem('omega_demo_user');
      return saved ? JSON.parse(saved) : { name: 'Mussa Juma', email: 'mussa.juma@omega.co.tz', initials: 'MJ' };
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLoginToggle = () => {
    if (currentUser) {
      // Logout
      setCurrentUser(null);
      localStorage.removeItem('omega_demo_user');
      showToast('Logged out of OMEGA Account');
    } else {
      // Demo Login
      const demoUser = { name: 'Mussa Juma', email: 'mussa.juma@omega.co.tz', initials: 'MJ' };
      setCurrentUser(demoUser);
      localStorage.setItem('omega_demo_user', JSON.stringify(demoUser));
      showToast('Signed in as Mussa Juma (OMEGA Member)');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      role="menu"
      aria-label="Account Menu"
      className="absolute right-0 top-full mt-2 w-72 rounded-[12px] bg-white text-[#14182B] border border-[#E4DDCC] shadow-boutique-soft z-50 p-2 animate-in fade-in slide-in-from-top-1 font-sans"
    >
      {/* Header Profile Info */}
      <div className="p-3 rounded-[8px] bg-[#FAF7F0] border border-[#E4DDCC]/50 mb-2">
        {currentUser ? (
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
                Verified OMEGA Member
              </span>
            </div>
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

        <div className="my-1.5 border-t border-[#E4DDCC]" />

        {/* Login / Register or Logout */}
        {currentUser ? (
          <button
            type="button"
            onClick={handleLoginToggle}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-[8px] hover:bg-[#D64545]/10 text-[#D64545] font-semibold transition-colors focus-ring-gold"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleLoginToggle}
              className="w-full py-2 px-3 rounded-[8px] btn-cta-yellow text-xs font-bold text-center"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleLoginToggle}
              className="w-full py-2 px-3 rounded-[8px] bg-white border border-[#E4DDCC] hover:bg-[#F3EEE2] text-xs font-bold text-center text-[#1E2A5E]"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

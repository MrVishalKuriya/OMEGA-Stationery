import React, { useState } from 'react';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnnouncementBarProps {
  onDismiss?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return sessionStorage.getItem('omega_announcement_dismissed') !== 'true';
    } catch {
      return true;
    }
  });

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('omega_announcement_dismissed', 'true');
    } catch {
      // ignore
    }
    onDismiss?.();
  };

  return (
    <aside
      aria-label="Announcement"
      className="relative z-50 w-full min-h-[36px] py-1.5 bg-[#111113] text-[#f9f8f6] text-[11px] sm:text-xs font-mono tracking-wider uppercase flex items-center justify-between px-4 sm:px-6 border-b border-[#e7e5e0]/20 select-none"
    >
      <div className="w-6 shrink-0" aria-hidden="true" />

      {/* Centered Announcement with Editorial Pipe Dividers (Matching Reference Layout) */}
      <div className="flex-1 flex items-center justify-center overflow-hidden text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <Link
            to="/wholesale"
            className="hover:text-[#8c7355] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="text-[#dc2626]">✦</span>
            <span>Factory Direct Wholesale</span>
          </Link>
          <span className="text-zinc-500 hidden sm:inline">|</span>
          <Link
            to="/shipping-guide"
            className="hover:text-[#8c7355] transition-colors whitespace-nowrap"
          >
            Nationwide Bus Parcel Waybills
          </Link>
          <span className="text-zinc-500 hidden md:inline">|</span>
          <Link
            to="/catalog?category=Counter+Books"
            className="hover:text-[#8c7355] transition-colors hidden md:inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>70 GSM Thread-Sewn Spines</span>
            <ChevronRight className="w-3 h-3 text-[#dc2626]" />
          </Link>
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="w-6 h-6 shrink-0 flex items-center justify-center rounded text-zinc-400 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};

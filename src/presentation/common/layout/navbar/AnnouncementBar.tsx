import React, { useState } from 'react';
import { X, ChevronRight, Truck, Sparkles } from 'lucide-react';
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
      className="relative z-50 w-full min-h-[34px] py-1 bg-[var(--surface-2)] text-[var(--text-muted)] text-[10.5px] sm:text-[11px] font-mono tracking-wider uppercase flex items-center justify-between px-3 sm:px-6 border-b border-[var(--border)] select-none transition-colors duration-200"
    >
      <div className="w-6 shrink-0" aria-hidden="true" />

      {/* Centered Announcement with Editorial Dividers */}
      <div className="flex-1 flex items-center justify-center overflow-hidden text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
          <Link
            to="/wholesale"
            className="hover:text-[var(--gold)] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap text-[var(--text)] font-bold"
          >
            <span className="text-[var(--red)]">★</span>
            <span>Factory Direct Wholesale</span>
          </Link>
          <span className="text-[var(--border)] hidden sm:inline">•</span>
          <Link
            to="/shipping-guide"
            className="hover:text-[var(--gold)] transition-colors inline-flex items-center gap-1 whitespace-nowrap"
          >
            <Truck size={12} className="text-[var(--gold)]" />
            <span>31 Regions Bus Parcel Waybills</span>
          </Link>
          <span className="text-[var(--border)] hidden md:inline">•</span>
          <Link
            to="/catalog?category=Counter+Books"
            className="hover:text-[var(--gold)] transition-colors hidden md:inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>70 GSM Archival Smyth-Sewn</span>
            <ChevronRight className="w-3 h-3 text-[var(--red)]" />
          </Link>
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="w-6 h-6 shrink-0 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-1)] transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};

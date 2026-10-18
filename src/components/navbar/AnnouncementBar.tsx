import React, { useState, useEffect } from 'react';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnnouncementBarProps {
  onDismiss?: () => void;
}

const ANNOUNCEMENTS = [
  {
    text: 'Wholesale & School Tenders: Save up to 40% OFF Cartons — Direct From Factory',
    link: '/wholesale',
    badge: 'Wholesale',
  },
  {
    text: 'Genuine OMEGA Hardcover Counter Books (Q2, Q3, Q4) — Direct from Mbeya Factory',
    link: '/catalog?category=Counter+Books',
    badge: 'Bestseller',
  },
  {
    text: 'Free delivery on orders over TSh 250,000 | Regional bus parcel waybill dispatch',
    link: '/wholesale',
    badge: 'Logistics',
  },
];

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onDismiss }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return sessionStorage.getItem('omega_announcement_dismissed') !== 'true';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (isPaused || !isVisible) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, isVisible]);

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

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <aside
      aria-label="Announcement"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative z-50 w-full h-9 bg-[#4b423b] text-white text-[13px] font-sans flex items-center justify-between px-4 sm:px-6 border-b border-[#e2dedb]/20 overflow-hidden select-none"
    >
      <div className="w-8 shrink-0" aria-hidden="true" />

      {/* Centered Announcement with Smooth Transition */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <Link
          to={current.link}
          className="group inline-flex items-center gap-2 max-w-full truncate hover:text-[#c49b7c] transition-colors focus-ring-gold rounded-sm px-1 py-0.5"
        >
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#c49b7c] text-[#3b352f] shadow-xs">
            <Sparkles className="w-2.5 h-2.5" />
            {current.badge}
          </span>
          <span className="truncate tracking-tight font-medium text-[12.5px] sm:text-[13px]">
            {current.text}
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full text-[#fafafa]/70 hover:text-white hover:bg-white/10 transition-colors focus-ring-gold"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};

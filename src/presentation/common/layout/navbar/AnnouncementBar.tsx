import React, { useState, useEffect } from 'react';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';

interface AnnouncementBarProps {
  onDismiss?: () => void;
}

const ANNOUNCEMENTS = {
  en: [
    {
      text: '🎉 Festival Mega Offer: Special factory discounts on School & Office Stationery cartons!',
      link: '/catalog',
      badge: 'Factory Offer',
    },
    {
      text: 'Wholesale & School Tenders: Save up to 40% OFF Cartons — Direct From Mbeya Factory',
      link: '/wholesale',
      badge: 'Save 40%',
    },
    {
      text: 'Genuine OMEGA Hardcover Counter Books (Q1, Q2, Q3, Q4) — Direct from Soweto SIDO Mbeya',
      link: '/catalog?category=Counter+Books',
      badge: 'Bestseller',
    },
    {
      text: 'Fast regional bus parcel waybill dispatch across all 31 regions of Tanzania',
      link: '/wholesale',
      badge: 'Nationwide',
    },
  ],
  sw: [
    {
      text: '🎉 Ofa Maalum ya Msimu: Punguzo kubwa la bei ya kiwandani kwa katoni za madaftari ya shule na ofisi!',
      link: '/catalog',
      badge: 'Ofa Maalum',
    },
    {
      text: 'Oda za Jumla na Zabuni za Shule: Okoa hadi 40% kwa Katoni — Moja kwa Moja Kiwandani Mbeya',
      link: '/wholesale',
      badge: 'Okoa 40%',
    },
    {
      text: 'Counter Books Asilia za OMEGA (Q1, Q2, Q3, Q4) — Moja kwa Moja Kiwanda cha Soweto SIDO Mbeya',
      link: '/catalog?category=Counter+Books',
      badge: 'Bora Zaidi',
    },
    {
      text: 'Usafirishaji wa haraka mikoani kwa njia ya mabasi | Ankara rasmi za EFD hutolewa',
      link: '/wholesale',
      badge: 'Mikoa Yote',
    },
  ],
};

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onDismiss }) => {
  const { language } = useStore();
  const announcementsList = ANNOUNCEMENTS[language] || ANNOUNCEMENTS.en;

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
      setCurrentIndex((prev) => (prev + 1) % announcementsList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, isVisible, announcementsList.length]);

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

  const current = announcementsList[currentIndex] || announcementsList[0];

  return (
    <div
      role="region"
      aria-label="Announcements"
      className="relative z-40 bg-[#111113] text-[#F9F8F6] border-b border-[#E7E5E0]/15 shadow-xs"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-8 sm:h-9 text-xs">
          
          {/* Announcement content */}
          <div className="flex-1 flex items-center justify-center gap-2 overflow-hidden text-center px-4">
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#8C7355] text-white font-mono shrink-0 shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-white" />
              {current.badge}
            </span>

            <Link
              to={current.link}
              className="text-[11px] sm:text-xs font-semibold text-[#F9F8F6] hover:text-[#C8A27A] transition-colors truncate flex items-center gap-1 group"
            >
              <span className="truncate">{current.text}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C7355] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss announcement"
            className="p-1 rounded-full text-[#A39E93] hover:text-[#F9F8F6] hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

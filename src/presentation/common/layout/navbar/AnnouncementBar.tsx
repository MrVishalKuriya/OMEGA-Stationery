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
      aria-label="Contact and Announcements"
      className="relative z-40 bg-[#DC2626] text-white border-b border-[#B91C1C] text-[11px] sm:text-xs font-sans"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9 text-white/95">
          
          {/* LEFT: Phone & Address (as shown in reference screenshot) */}
          <div className="flex items-center gap-4 sm:gap-6 truncate">
            <a
              href="tel:+255715268391"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors shrink-0"
              title="Call Factory Hotline"
            >
              <span className="font-semibold tracking-wide">+255 715 268 391</span>
            </a>

            <span className="hidden md:inline-flex items-center gap-1.5 text-white/85 truncate">
              <span>📍</span>
              <span className="truncate">Soweto SIDO Estate, Mbeya, Tanzania</span>
            </span>
          </div>

          {/* CENTER: Promo Announcement (hidden on small mobile) */}
          <div className="hidden lg:flex items-center gap-2 text-center truncate px-4">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-white/20 px-2 py-0.5 rounded-[2px]">
              {current.badge}
            </span>
            <Link to={current.link} className="hover:underline truncate text-white/95">
              {current.text}
            </Link>
          </div>

          {/* RIGHT: Social Media Links (f, t, in, whatsapp) & Dismiss */}
          <div className="flex items-center gap-3 shrink-0 ml-auto sm:ml-0">
            <a
              href="https://wa.me/255715268391"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:scale-110 transition-transform text-white/90 hover:text-white"
              title="WhatsApp Direct"
            >
              <span className="font-bold text-xs">WA</span>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:scale-110 transition-transform text-white/90 hover:text-white font-bold text-xs"
            >
              f
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="hover:scale-110 transition-transform text-white/90 hover:text-white font-bold text-xs"
            >
              t
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:scale-110 transition-transform text-white/90 hover:text-white font-bold text-xs"
            >
              in
            </a>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss announcement"
              className="p-1 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

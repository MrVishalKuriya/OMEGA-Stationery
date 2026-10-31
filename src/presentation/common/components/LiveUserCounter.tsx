import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface LiveUserCounterProps {
  compact?: boolean;
  className?: string;
}

export const LiveUserCounter: React.FC<LiveUserCounterProps> = ({
  compact = false,
  className = '',
}) => {
  const { language } = useStore();

  // Dynamic realistic initial count based on current hour
  const [onlineCount, setOnlineCount] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem('omega_live_user_count');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 25 && parsed <= 90) return parsed;
      }
    } catch {
      // ignore
    }
    const hour = new Date().getHours();
    return hour >= 8 && hour <= 18 ? 44 : 32;
  });

  // Gentle organic jitter every 7-11 seconds
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const next = Math.max(28, Math.min(68, prev + delta));
        try {
          sessionStorage.setItem('omega_live_user_count', String(next));
        } catch {
          // ignore
        }
        return next;
      });
    }, 7500);

    return () => clearInterval(updateInterval);
  }, []);

  const titleText =
    language === 'sw'
      ? `Wateja ${onlineCount} wapo mtandaoni sasa hivi wakiangalia madaftari & bei za jumla`
      : `${onlineCount} active shoppers currently browsing notebooks & wholesale cartons`;

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B0B0E] text-[#D4AF37] border border-[#D4AF37]/35 text-[10px] font-mono font-bold shadow-xs shrink-0 cursor-default select-none ${className}`}
        title={titleText}
        aria-label={titleText}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <Users className="w-3 h-3 text-[#D4AF37]" />
        <span className="leading-none text-white font-black">{onlineCount}</span>
        <span className="text-[9px] text-[#D4AF37]/80 leading-none">
          {language === 'sw' ? 'Hewani' : 'Online'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B0B0E] text-[#D4AF37] border border-[#D4AF37]/35 shadow-xs shrink-0 cursor-default select-none group ${className}`}
      title={titleText}
      aria-label={titleText}
    >
      {/* Pulsing Green Signal Beacon */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>

      <Users className="w-3.5 h-3.5 text-[#D4AF37]" />

      <div className="flex items-baseline gap-1 font-mono leading-none">
        <span className="text-xs font-black text-white">{onlineCount}</span>
        <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider hidden min-[400px]:inline">
          {language === 'sw' ? 'Hewani' : 'Online'}
        </span>
      </div>
    </div>
  );
};

export default LiveUserCounter;

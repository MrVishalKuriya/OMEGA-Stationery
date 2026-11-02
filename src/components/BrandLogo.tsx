import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8 p-1 rounded-lg',
    md: 'w-10 h-10 p-1.5 rounded-xl',
    lg: 'w-12 h-12 p-2 rounded-2xl',
  }[size];

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
  }[size];

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none shrink-0 ${className}`}
      aria-label="OMEGA Stationery & Books Tanzania Home"
    >
      {/* High-Contrast Luxury Emblem Seal */}
      <div
        className={`${iconSizes} flex items-center justify-center shrink-0 transition-all duration-300 border bg-[#121214] border-black/15 text-white shadow-md group-hover:border-[var(--red)]`}
      >
        <img
          src="/logo-icon-white.png"
          alt="OMEGA Logo Emblem"
          className="w-full h-full object-contain filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Typography Hallmark */}
      <div className="flex flex-col text-left leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-heading ${titleSizes} font-black tracking-tight text-[var(--text)] group-hover:text-[var(--red)] transition-colors`}
          >
            OMEGA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] shrink-0" />
        </div>
        {showSubtitle && (
          <span className="text-[9px] sm:text-[9.5px] tracking-[0.2em] font-mono font-bold uppercase text-[var(--gold)] mt-1 hidden min-[360px]:block">
            STATIONERY TANZANIA
          </span>
        )}
      </div>
    </Link>
  );
};

export default BrandLogo;

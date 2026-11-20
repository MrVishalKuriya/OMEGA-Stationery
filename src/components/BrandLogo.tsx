import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShinyText } from '@/components/ui/ReactBitsAnimations';

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
      {/* High-Contrast Luxury Emblem Seal with Crimson/Gold Specular Glint */}
      <motion.div
        whileHover={{ scale: 1.06, rotate: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 360, damping: 20 }}
        className={`relative overflow-hidden ${iconSizes} flex items-center justify-center shrink-0 transition-colors duration-300 border bg-[#121214] border-black/15 text-white shadow-md group-hover:border-[var(--red)] group-hover:shadow-[0_6px_18px_rgba(214,58,58,0.28)]`}
      >
        <span
          aria-hidden="true"
          className="omega-emblem-glint pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-[#F3D28A]/45 to-transparent"
        />
        <img
          src="/logo-icon-white.png"
          alt="OMEGA Logo Emblem"
          className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
        />
      </motion.div>

      {/* Typography Hallmark */}
      <div className="flex flex-col text-left leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-heading ${titleSizes} font-black tracking-tight text-[var(--text)] group-hover:text-[var(--red)] transition-colors`}
          >
            OMEGA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] shrink-0 transition-transform duration-300 group-hover:scale-125" />
        </div>
        {showSubtitle && (
          <ShinyText
            tone="gold"
            speedSec={5.2}
            className="text-[9px] sm:text-[9.5px] tracking-[0.2em] font-mono font-bold uppercase mt-1 hidden min-[360px]:block"
          >
            STATIONERY TANZANIA
          </ShinyText>
        )}
      </div>
    </Link>
  );
};

export default BrandLogo;

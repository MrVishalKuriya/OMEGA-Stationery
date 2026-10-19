import React from 'react';

interface OmegaLogoProps {
  variant?: 'light' | 'dark' | 'badge' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const OmegaLogo: React.FC<OmegaLogoProps> = ({
  variant = 'badge',
  size = 'md',
  showSubtitle = true,
}) => {
  const heightClasses = {
    sm: 'h-7 sm:h-8',
    md: 'h-8 sm:h-9 md:h-10',
    lg: 'h-11 sm:h-12 md:h-14',
  }[size];

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7 sm:w-8 sm:h-8',
    lg: 'w-10 h-10 sm:w-12 sm:h-12',
  }[size];

  if (variant === 'icon') {
    return (
      <div className="flex items-center justify-center p-1 bg-white rounded-xl shadow-xs border border-stone-200">
        <img
          src="/logo-icon.png"
          alt="OMEGA Icon"
          className={`${iconSizes} object-contain`}
        />
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className="flex items-center gap-2.5">
        <div className="bg-white px-2.5 py-1.5 rounded-xl shadow-md border border-white/20 hover:border-[#c49b7c] transition-all flex items-center gap-2">
          <img
            src="/logo-icon.png"
            alt="OMEGA Icon"
            className="w-5 h-5 object-contain shrink-0"
          />
          <span className="font-heading font-black tracking-wider text-[#23201d] text-base leading-none">
            OMEGA
          </span>
        </div>
        {showSubtitle && (
          <div className="flex flex-col border-l border-white/20 pl-2.5">
            <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] text-[#D64545] uppercase leading-none font-mono">
              TANZANIA
            </span>
            <span className="text-[9px] tracking-wider font-bold text-stone-300 uppercase mt-0.5 whitespace-nowrap font-sans">
              Writing Notebooks
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/omega-logo.png"
        alt="OMEGA Stationery"
        className={`${heightClasses} w-auto object-contain ${
          variant === 'dark' ? 'brightness-0 invert' : ''
        }`}
      />
      {showSubtitle && (
        <div className="flex flex-col border-l border-stone-300 pl-2.5">
          <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] text-[#D64545] uppercase leading-none">
            TANZANIA
          </span>
          <span className="text-[10px] tracking-wider font-bold text-stone-700 uppercase mt-0.5 whitespace-nowrap">
            Writing Notebooks
          </span>
        </div>
      )}
    </div>
  );
};

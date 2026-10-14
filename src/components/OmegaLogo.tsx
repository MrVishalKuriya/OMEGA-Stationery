import React from 'react';

interface OmegaLogoProps {
  variant?: 'light' | 'dark' | 'badge';
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

  if (variant === 'badge') {
    return (
      <div className="flex items-center gap-2.5">
        <div className="bg-white px-3 py-1.5 rounded-xl shadow-md border border-stone-200/80 hover:border-red-600 transition-all flex items-center justify-center">
          <img
            src="/omega-logo.png"
            alt="OMEGA Writing Notebooks"
            className={`${heightClasses} w-auto object-contain`}
          />
        </div>
        {showSubtitle && (
          <div className="flex flex-col border-l border-stone-700/80 pl-2.5">
            <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] text-red-500 uppercase leading-none">
              TANZANIA
            </span>
            <span className="text-[10px] tracking-wider font-bold text-stone-300 uppercase mt-0.5 whitespace-nowrap">
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
          <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] text-red-600 uppercase leading-none">
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

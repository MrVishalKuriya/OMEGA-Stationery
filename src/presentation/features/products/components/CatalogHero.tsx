import React from 'react';

interface CatalogHeroProps {
  language: string;
  totalProductsCount?: number;
}

export const CatalogHero: React.FC<CatalogHeroProps> = ({
  language,
}) => {
  return (
    <div className="bg-[#111113] text-white py-10 lg:py-14 border-b border-[#111113] relative overflow-hidden">
      {/* Warm Ambient Glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#dc2626]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#b91c1c]/15 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
            {language === 'sw' ? 'Katalogi ya Vifaa vya OMEGA' : 'Official OMEGA Master Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-2.5 max-w-xl mx-auto font-normal leading-relaxed">
            {language === 'sw'
              ? 'Tazama madaftari yote ya OMEGA, kuanzia Counter Books Q2, Q3, Q4, madaftari ya shule kurasa 32-200, na bahasha ngumu za kraft.'
              : 'Direct factory catalogue of premium Smyth thread-bound counter books, primary school exercise series, and heavy-duty kraft envelopes.'}
          </p>
        </div>
      </div>
    </div>
  );
};


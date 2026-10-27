import React from 'react';
import { Layers, ShieldCheck, BookOpen } from 'lucide-react';

interface CatalogHeroProps {
  language: string;
  totalProductsCount: number;
}

export const CatalogHero: React.FC<CatalogHeroProps> = ({
  language,
  totalProductsCount,
}) => {
  return (
    <div className="bg-[#18181b] text-white py-10 lg:py-14 border-b border-[#18181b] relative overflow-hidden">
      {/* Warm Ambient Glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#dc2626]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#b91c1c]/15 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#dc2626]/20 via-[#dc2626]/10 to-transparent border border-[#dc2626]/40 text-xs font-semibold uppercase tracking-wider text-white font-mono shadow-xs mb-3">
              <span>SIDO Industrial Estate, Soweto · Mbeya Factory</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
              {language === 'sw' ? 'Katalogi ya Vifaa vya OMEGA' : 'Official OMEGA Master Catalog'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-xl font-normal leading-relaxed">
              {language === 'sw'
                ? 'Tazama madaftari yote ya OMEGA, kuanzia Counter Books Q2, Q3, Q4, madaftari ya shule kurasa 32-200, na bahasha ngumu za kraft.'
                : 'Direct factory catalogue of premium Smyth thread-bound counter books, primary school exercise series, and heavy-duty kraft envelopes.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 border border-white/15 rounded-2xl px-5 py-3 backdrop-blur-sm text-center">
              <div className="text-2xl font-black text-[#dc2626] font-mono-tabular">
                {totalProductsCount}
              </div>
              <div className="text-[11px] text-stone-300 uppercase tracking-wider font-semibold">
                {language === 'sw' ? 'Bidhaa Zilizopo' : 'Active Products'}
              </div>
            </div>
            <div className="hidden sm:flex bg-white/10 border border-white/15 rounded-2xl px-5 py-3 backdrop-blur-sm items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <div className="text-left">
                <div className="text-xs font-bold text-white">TBS Certified</div>
                <div className="text-[10px] text-stone-300">70 GSM Bleed-Proof</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

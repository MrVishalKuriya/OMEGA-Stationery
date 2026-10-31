import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, BookOpen, Layers } from 'lucide-react';

interface CatalogHeroProps {
  language: string;
  totalProductsCount: number;
}

export const CatalogHero: React.FC<CatalogHeroProps> = ({
  language,
  totalProductsCount,
}) => {
  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-[#6B140B] via-[#4A0D07] to-[#26130F] text-white rounded-3xl p-7 sm:p-10 lg:p-12 relative overflow-hidden shadow-xl border border-[#E5D8C8]/40"
      >
        {/* Top Soft Orange Foil Trim */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#E9A858] via-[#F4C486] to-[#E9A858]" />

        {/* Bookbinder Stitch Motif Line */}
        <div className="absolute top-2.5 inset-x-4 border-b border-dashed border-[#E9A858]/35 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
          <div className="space-y-3 max-w-2xl">
            {/* Hallmark Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#26130F] text-[#E9A858] border border-[#E9A858]/40 text-xs font-bold uppercase tracking-wider font-mono shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E9A858]" />
              <span>SIDO INDUSTRIAL ESTATE · SOWETO, MBEYA</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {language === 'sw' ? 'Katalogi ya Kiwandani OMEGA Tanzania' : 'Official OMEGA Master Catalog'}
            </h1>

            <p className="text-xs sm:text-sm text-[#FAF6F0]/90 font-normal leading-relaxed">
              {language === 'sw'
                ? 'Madaftari yote ya OMEGA yaliyoshonwa kwa nyuzi (Smyth-sewn), karatasi nzito 70 GSM isiyovujisha wino, na bahasha thabiti za kraft kwa bei rasmi za jumla.'
                : 'Direct factory master catalog of Smyth thread-bound archival counter books, 70 GSM bleed-proof exercise notebooks, and heavy-duty kraft envelopes.'}
            </p>

            {/* Smyth-Sewn Stitch Visual Hallmark */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[11px] font-mono text-[#E9A858]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#26130F]/80 border border-[#E9A858]/30 shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-[#E9A858]" />
                <span>Mshono wa Uzi 180° Lay-Flat</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#26130F]/80 border border-[#E9A858]/30 shadow-2xs">
                <Layers className="w-3.5 h-3.5 text-[#E9A858]" />
                <span>NECTA Standard 70 GSM Bond</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Active Products Counter */}
            <div className="bg-[#26130F] rounded-2xl px-5 py-3.5 text-center shadow-md border border-[#E9A858]/40">
              <div className="text-2xl sm:text-3xl font-black text-[#E9A858] font-mono">
                {totalProductsCount}
              </div>
              <div className="text-[10px] text-[#D8C3A5] uppercase tracking-wider font-bold mt-0.5">
                {language === 'sw' ? 'Bidhaa Zilizopo' : 'Active Items'}
              </div>
            </div>

            {/* Quality Hallmark Card */}
            <div className="hidden sm:flex bg-[#26130F]/80 rounded-2xl px-5 py-3.5 items-center gap-3 border border-[#E9A858]/40 shadow-md">
              <ShieldCheck className="w-8 h-8 text-[#E9A858]" />
              <div className="text-left">
                <div className="text-xs font-black text-white">NECTA Spec</div>
                <div className="text-[10px] text-[#E9A858]">70 GSM Bleed-Proof</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bookbinder Stitch Motif Line */}
        <div className="absolute bottom-2.5 inset-x-4 border-b border-dashed border-[#E9A858]/35 pointer-events-none" />
      </motion.div>
    </div>
  );
};

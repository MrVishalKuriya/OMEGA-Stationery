import React from 'react';
import { Link } from 'react-router-dom';
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
    <div className="w-full">
      {/* Photographic Hero Banner with Reduced Dark Filter & Warm Light Filter */}
      <section className="relative overflow-hidden bg-[#1B1B1E] text-white border-b border-[#262524]">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/hero-desk-bg.jpg"
            alt=""
            className="w-full h-full object-cover opacity-75 brightness-110 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111113]/75 via-[#111113]/50 to-[#111113]/25" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-[#F9F8F6]/15 to-white/25 mix-blend-soft-light" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.22),transparent_65%)]" />
        </div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
            <div className="space-y-3.5 max-w-2xl">
              {/* Hallmark Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#111113]/70 backdrop-blur-xs text-[#FFFFFF] border border-white/25 text-[11px] font-bold uppercase tracking-widest font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>SIDO INDUSTRIAL ESTATE · SOWETO, MBEYA</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] drop-shadow-xs">
                {language === 'sw' ? (
                  <>
                    Katalogi ya <span className="text-[#DC2626]">Kiwandani</span> OMEGA
                  </>
                ) : (
                  <>
                    Official OMEGA <span className="text-[#DC2626]">Master</span> Catalog
                  </>
                )}
              </h1>

              <p className="text-xs sm:text-sm text-[#F4F4F5] font-normal leading-relaxed max-w-xl">
                {language === 'sw'
                  ? 'Madaftari yote ya OMEGA yaliyoshonwa kwa nyuzi (Smyth-sewn), karatasi nzito 70 GSM isiyovujisha wino, na bahasha thabiti za kraft kwa bei rasmi za jumla.'
                  : 'Direct factory master catalog of Smyth thread-bound archival counter books, 70 GSM bleed-proof exercise notebooks, and heavy-duty kraft envelopes.'}
              </p>

              {/* Spec Badges */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[11px] font-mono text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-[#111113]/65 backdrop-blur-xs border border-white/25">
                  <BookOpen className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>Smyth-Sewn 180° Lay-Flat</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-[#111113]/65 backdrop-blur-xs border border-white/25">
                  <Layers className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>NECTA Standard 70 GSM Bond</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Active Products Counter */}
              <div className="bg-[#111113]/90 backdrop-blur-xs rounded-[2px] px-5 py-4 text-center border border-white/20">
                <div className="text-2xl sm:text-3xl font-black text-[#DC2626] font-mono">
                  {totalProductsCount}
                </div>
                <div className="text-[10px] text-[#E4E4E7] uppercase tracking-wider font-bold mt-0.5">
                  {language === 'sw' ? 'Bidhaa Zilizopo' : 'Active Items'}
                </div>
              </div>

              {/* Quality Hallmark Card */}
              <div className="hidden sm:flex bg-[#111113]/90 backdrop-blur-xs rounded-[2px] px-5 py-4 items-center gap-3 border border-white/20">
                <ShieldCheck className="w-8 h-8 text-[#DC2626]" />
                <div className="text-left">
                  <div className="text-xs font-black text-white">NECTA Spec</div>
                  <div className="text-[10px] text-[#E4E4E7]">70 GSM Bleed-Proof</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vibrant Red Banner Strip with Downward Triangle Notch */}
      <div className="relative bg-[#DC2626] text-white py-5 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div>
            <h2 className="font-heading text-sm sm:text-base font-black uppercase tracking-wider text-white">
              {language === 'sw'
                ? 'BEI ZA KIWANDANI MOJA KWA MOJA & STAKABADHI ZA TRA EFD'
                : 'FACTORY-DIRECT WHOLESALE RATES & OFFICIAL TRA EFD INVOICING'}
            </h2>
            <p className="text-xs text-white/90 mt-0.5">
              {language === 'sw'
                ? 'Agiza katoni 5+ kupata punguzo la hadi 40% na usafirishaji wa siku hiyo hiyo.'
                : 'Order 5+ cartons for up to 40% volume discounts and same-day regional bus parcel waybills.'}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/wholesale"
              className="px-4 py-2 rounded-[2px] bg-white text-[#111113] hover:bg-[#111113] hover:text-white text-[11px] font-bold uppercase tracking-wider transition-all"
            >
              {language === 'sw' ? 'Bei za Katoni' : 'Bulk Calculator'}
            </Link>
            <Link
              to="/school-tenders"
              className="px-4 py-2 rounded-[2px] bg-transparent border border-white text-white hover:bg-white hover:text-[#111113] text-[11px] font-bold uppercase tracking-wider transition-all"
            >
              {language === 'sw' ? 'Zabuni za Shule' : 'School Tenders'}
            </Link>
          </div>
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[12px] border-t-[#DC2626]" />
      </div>
    </div>
  );
};

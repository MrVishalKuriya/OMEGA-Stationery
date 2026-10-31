import React from 'react';
import {
  Truck,
  Percent,
  BadgeCheck,
  ShieldCheck,
} from 'lucide-react';

interface WholesaleHeroProps {
  language: string;
  cleanWhatsappDigits?: string;
  onExportCSV?: () => void;
}

export const WholesaleHero: React.FC<WholesaleHeroProps> = ({
  language,
}) => {
  return (
    <div className="w-full">
      {/* Photographic Hero with Reduced Dark Filter & Warm Light Filter */}
      <section className="relative overflow-hidden w-full bg-[#1B1B1E] text-white py-14 lg:py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-75 brightness-110 contrast-105 pointer-events-none"
          style={{ backgroundImage: 'url(/hero-desk-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111113]/75 via-[#111113]/50 to-[#111113]/25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-[#F9F8F6]/15 to-white/25 mix-blend-soft-light pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.22),transparent_65%)] pointer-events-none" />

        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="inline-flex items-center px-3 py-1 rounded-[2px] bg-[#111113]/70 backdrop-blur-xs text-white border border-white/25 mb-4">
            <span className="text-[10px] font-bold tracking-wider uppercase font-mono">
              Factory Direct Wholesale · Soweto SIDO Industrial Estate, Mbeya
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight max-w-3xl mb-4 drop-shadow-xs">
            {language === 'sw' ? (
              <>
                Mauzo ya <span className="text-[#DC2626]">Jumla</span> &amp; Katoni Kiwandani
              </>
            ) : (
              <>
                Better <span className="text-[#DC2626]">Wholesale</span> Experiences
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-[#F4F4F5] max-w-2xl mb-8 font-normal leading-relaxed">
            {language === 'sw'
              ? 'Pata bei bora za jumla kwa madaftari ya OMEGA: Hardcover Counter Books (Q1–Q4), Madaftari ya shule kurasa 32–200, na Bahasha nzito za Kraft. Usafirishaji wa haraka Tanzania nzima.'
              : 'Direct factory carton pricing with up to 40% margin for schools, colleges, bookstores, and regional tenders. Official TRA EFD tax invoices and same-day bus parcel waybills.'}
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <a
              href="#calculator"
              className="px-7 py-3.5 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              {language === 'sw' ? 'KIKOKOTOO CHA KATONI' : 'CALCULATE CARTONS'}
            </a>
            <a
              href="#inquiry"
              className="px-7 py-3.5 rounded-[2px] bg-[#111113]/50 backdrop-blur-xs hover:bg-white text-white hover:text-[#111113] border border-white font-sans font-bold text-xs uppercase tracking-wider transition-all"
            >
              {language === 'sw' ? 'OMBA PROFORMA' : 'REQUEST PROFORMA'}
            </a>
          </div>
        </div>
      </section>

      {/* Full-Width Crimson Red Callout Strip with White Upward Triangle Notch */}
      <section className="relative w-full bg-[#D62828] text-white py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1180px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-3.5 bg-white/10 border border-white/20 rounded-[2px] flex items-center gap-3">
            <Truck className="w-5 h-5 text-white shrink-0" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wide">24–48h Dispatch</div>
              <div className="text-[11px] text-white/80">31 Regions Bus Waybill</div>
            </div>
          </div>

          <div className="p-3.5 bg-white/10 border border-white/20 rounded-[2px] flex items-center gap-3">
            <Percent className="w-5 h-5 text-white shrink-0" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wide">20% to 40% Off</div>
              <div className="text-[11px] text-white/80">Volume Tiered Cartons</div>
            </div>
          </div>

          <div className="p-3.5 bg-white/10 border border-white/20 rounded-[2px] flex items-center gap-3">
            <BadgeCheck className="w-5 h-5 text-white shrink-0" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wide">TRA EFD Invoices</div>
              <div className="text-[11px] text-white/80">Fiscal Tax Compliant</div>
            </div>
          </div>

          <div className="p-3.5 bg-white/10 border border-white/20 rounded-[2px] flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-white shrink-0" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wide">Direct Factory</div>
              <div className="text-[11px] text-white/80">Soweto SIDO Mbeya</div>
            </div>
          </div>
        </div>

        <div className="max-w-[1180px] mx-auto relative">
          <div className="absolute -bottom-10 sm:-bottom-12 left-6 sm:left-10 w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[16px] border-b-white z-20 pointer-events-none flex items-end justify-center">
            <span className="text-[#9CA3AF] text-[10px] leading-none translate-y-[14px] font-sans">⌄</span>
          </div>
        </div>
      </section>
    </div>
  );
};

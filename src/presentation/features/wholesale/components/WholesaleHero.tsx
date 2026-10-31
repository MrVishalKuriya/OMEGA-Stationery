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
    <section className="relative overflow-hidden w-full bg-[#18181b] text-white py-12 lg:py-16 border-b border-[#18181b] shadow-2xl">
      {/* Soft Ambient Warm Glows */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#dc2626]/18 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-[#b91c1c]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Refined Badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#dc2626]/20 via-[#dc2626]/10 to-transparent border border-[#dc2626]/40 backdrop-blur-md mb-6 shadow-xs">
          <span className="text-xs font-semibold tracking-wider text-white uppercase font-mono">
            Factory Direct Wholesale · SIDO Industrial Estate, Mbeya
          </span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight max-w-4xl mx-auto mb-5">
          {language === 'sw' ? 'Mauzo ya Jumla & Oda Kubwa' : 'Wholesale Stationery & School Tenders'}{' '}
          <br />
          <span className="font-bold text-[#dc2626] bg-gradient-to-r from-[#e3bf9e] via-[#dc2626] to-[#e3bf9e] bg-clip-text text-transparent">
            {language === 'sw' ? 'Moja kwa Moja Kiwandani.' : 'Direct From Manufacturer.'}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          {language === 'sw'
            ? 'Pata bei bora za jumla kwa madaftari ya OMEGA: Hardcover Counter Books (Q2, Q3, Q4), Madaftari ya shule kurasa 32–200, na Bahasha nzito za Kraft. Usafirishaji wa haraka Tanzania nzima.'
            : 'Direct factory pricing with up to 40% margin for schools, colleges, bookstores, and regional tenders. Official TRA EFD tax invoices and dependable upcountry bus cargo dispatch.'}
        </p>

        {/* Quick-Trust Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#dc2626] shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">24–48h Dispatch</div>
              <div className="text-[11px] text-stone-400">Bus parcel waybill</div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <Percent className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">20% to 40% Margins</div>
              <div className="text-[11px] text-stone-400">Volume tiered discounts</div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <BadgeCheck className="w-5 h-5 text-[#dc2626] shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">TRA EFD Invoices</div>
              <div className="text-[11px] text-stone-400">Official tax compliance</div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">100% OMEGA Genuine</div>
              <div className="text-[11px] text-stone-400">70 GSM bleed-proof paper</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

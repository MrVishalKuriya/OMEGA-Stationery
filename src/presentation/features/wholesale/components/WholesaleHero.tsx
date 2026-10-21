import React from 'react';
import {
  Building2,
  Truck,
  Percent,
  BadgeCheck,
  ShieldCheck,
  Calculator,
  ChevronRight,
  MessageCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface WholesaleHeroProps {
  language: string;
  cleanWhatsappDigits: string;
  onExportCSV: () => void;
}

export const WholesaleHero: React.FC<WholesaleHeroProps> = ({
  language,
  cleanWhatsappDigits,
  onExportCSV,
}) => {
  return (
    <section className="relative overflow-hidden w-full bg-[#3b352f] text-white py-16 lg:py-24 border-b border-[#2b2520] shadow-2xl">
      {/* Soft Ambient Warm Glows */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#c49b7c]/18 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-[#a46b44]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Refined Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 shadow-sm">
          <Building2 className="w-4 h-4 text-[#c49b7c]" />
          <span className="text-xs font-semibold tracking-wider text-stone-200 uppercase">
            Factory Direct Wholesale · SIDO Industrial Estate, Mbeya
          </span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight max-w-4xl mx-auto mb-5">
          {language === 'sw' ? 'Mauzo ya Jumla & Oda Kubwa' : 'Wholesale Stationery & School Tenders'}{' '}
          <br />
          <span className="font-bold text-[#c49b7c] bg-gradient-to-r from-[#e3bf9e] via-[#c49b7c] to-[#e3bf9e] bg-clip-text text-transparent">
            {language === 'sw' ? 'Moja kwa Moja Kiwandani.' : 'Direct From Manufacturer.'}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          {language === 'sw'
            ? 'Pata bei bora za jumla kwa madaftari ya OMEGA: Hardcover Counter Books (Q2, Q3, Q4), Madaftari ya shule kurasa 32–200, na Bahasha nzito za Kraft. Usafirishaji wa haraka Tanzania nzima.'
            : 'Direct factory pricing with up to 40% margin for schools, colleges, bookstores, and regional tenders. Official TRA EFD tax invoices and dependable upcountry bus cargo dispatch.'}
        </p>

        {/* Quick-Trust Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10 text-left">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#c49b7c] shrink-0" />
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
            <BadgeCheck className="w-5 h-5 text-[#c49b7c] shrink-0" />
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

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="#calculator"
            className="btn-ledup-copper group px-7 py-3.5 rounded-full text-xs sm:text-sm uppercase tracking-wider font-bold inline-flex items-center gap-2 shadow-lg min-h-[48px] active:scale-95"
          >
            <Calculator className="w-4 h-4 text-white" />
            <span>Calculate Carton Savings</span>
            <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
              'Hello OMEGA Tanzania, I would like to inquire about wholesale prices and carton availability for bulk ordering.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 min-h-[48px] active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WhatsApp Wholesale Desk</span>
          </a>

          <button
            type="button"
            onClick={onExportCSV}
            className="px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/15 text-stone-200 border border-white/15 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 min-h-[48px] active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#c49b7c]" />
            <span>Download CSV Price List</span>
          </button>
        </div>
      </div>
    </section>
  );
};

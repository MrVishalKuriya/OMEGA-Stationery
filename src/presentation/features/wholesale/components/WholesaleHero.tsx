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
    <section className="relative overflow-hidden w-full bg-[#111113] text-[#F9F8F6] py-14 lg:py-20 border-b border-[#E7E5E0]/15">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Refined Badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-md bg-[#8C7355] text-white mb-4 shadow-xs">
          <span className="text-xs font-bold tracking-wider uppercase font-mono">
            Factory Direct Wholesale · SIDO Industrial Estate, Mbeya
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#F9F8F6] leading-tight tracking-tight max-w-4xl mx-auto mb-4">
          {language === 'sw' ? 'Mauzo ya Jumla & Oda Kubwa za Kiwandani' : 'Wholesale Stationery & School Tenders'}{' '}
          <br />
          <span className="text-[#C8A27A]">
            {language === 'sw' ? 'Moja kwa Moja Kiwandani Mbeya.' : 'Direct From Manufacturer.'}
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#A39E93] max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
          {language === 'sw'
            ? 'Pata bei bora za jumla kwa madaftari ya OMEGA: Hardcover Counter Books (Q1–Q4), Madaftari ya shule kurasa 32–200, na Bahasha nzito za Kraft. Usafirishaji wa haraka Tanzania nzima.'
            : 'Direct factory pricing with up to 40% margin for schools, colleges, bookstores, and regional tenders. Official TRA EFD tax invoices and dependable upcountry bus cargo dispatch.'}
        </p>

        {/* Quick-Trust Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-3xl mx-auto text-left">
          <div className="bg-white p-4 rounded-lg flex items-center gap-3 border border-[#E7E5E0] shadow-xs">
            <div className="w-10 h-10 rounded-md bg-[#F2EFEB] text-[#8C7355] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111113]">24–48h Dispatch</div>
              <div className="text-[11px] text-[#6E6B66]">Bus parcel waybill</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg flex items-center gap-3 border border-[#E7E5E0] shadow-xs">
            <div className="w-10 h-10 rounded-md bg-[#F2EFEB] text-[#8C7355] flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111113]">20% to 40% Off</div>
              <div className="text-[11px] text-[#6E6B66]">Volume tiered discounts</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg flex items-center gap-3 border border-[#E7E5E0] shadow-xs">
            <div className="w-10 h-10 rounded-md bg-[#F2EFEB] text-[#8C7355] flex items-center justify-center shrink-0">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111113]">EFD Tax Invoices</div>
              <div className="text-[11px] text-[#6E6B66]">Official TRA compliant</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg flex items-center gap-3 border border-[#E7E5E0] shadow-xs">
            <div className="w-10 h-10 rounded-md bg-[#F2EFEB] text-[#8C7355] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111113]">Direct Factory</div>
              <div className="text-[11px] text-[#6E6B66]">Mbeya Works</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

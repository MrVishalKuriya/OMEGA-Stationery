import React from 'react';
import { CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { triggerLuxuryConfetti } from '@/utils/confetti';

interface WholesaleVolumeTiersProps {
  onSelectTier: (quantityRange: string) => void;
}

export const WholesaleVolumeTiers: React.FC<WholesaleVolumeTiersProps> = ({ onSelectTier }) => {
  const handleSelect = (tier: string) => {
    triggerLuxuryConfetti();
    onSelectTier(tier);
  };

  return (
    <section className="py-12 lg:py-16 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
      <div className="text-center space-y-2 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#F2EFEB] text-[#8C7355] border border-[#8C7355]/30 text-xs font-bold font-mono uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#8C7355]" />
          <span>TRANSPARENT VOLUME ARCHITECTURE</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111113] tracking-tight">
          Wholesale Discount Tiers
        </h2>
        <p className="text-xs sm:text-sm text-[#6E6B66] max-w-lg mx-auto">
          Higher carton volumes unlock direct factory savings with tamper-evident strapping and official EFD tax receipts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Tier 1: Starter */}
        <div className="bg-white rounded-lg p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all border border-[#E7E5E0] hover:border-[#8C7355]/50">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#F2EFEB] text-[#8C7355] font-mono">
                Starter Tier
              </span>
              <span className="text-xs font-semibold text-[#6E6B66]">5 — 19 Cartons</span>
            </div>
            <h3 className="font-heading text-xl font-bold text-[#111113]">Retailers &amp; Kiosks</h3>
            <div className="my-4 pb-4 border-b border-[#E7E5E0]">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#DC2626] font-mono">20%</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6E6B66]">
                  OFF Retail Price
                </span>
              </div>
              <span className="text-xs text-[#6E6B66] mt-1 block">
                Perfect for local stationery shops &amp; primary day schools
              </span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#111113]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                <span>Min order: 5 Cartons (approx. 180 — 240 units)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                <span>Mixed carton varieties allowed in a single shipment</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                <span>Factory-sealed heavy kraft protective packaging</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                <span>Upcountry bus parcel waybill to all major towns</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <a
              href="#inquiry"
              onClick={() => handleSelect('5 — 19 Cartons (20% OFF)')}
              className="w-full py-3 px-4 rounded-md bg-[#F9F8F6] text-[#111113] hover:bg-[#111113] hover:text-[#F9F8F6] border border-[#E7E5E0] transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
            >
              <span>Select Starter Tier</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Tier 2: Business (Most Popular - Warm Charcoal & Ochre) */}
        <div className="relative bg-[#111113] text-[#F9F8F6] rounded-lg p-6 sm:p-7 flex flex-col justify-between shadow-xl md:-translate-y-2 border-2 border-[#8C7355] transition-all">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-md bg-[#8C7355] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>MOST POPULAR · BEST VALUE</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/10 text-[#C8A27A] border border-[#8C7355]/40 font-mono">
                Business Tier
              </span>
              <span className="text-xs font-semibold text-[#A39E93]">20 — 49 Cartons</span>
            </div>
            <h3 className="font-heading text-xl font-bold text-[#F9F8F6]">Schools &amp; Bookstores</h3>
            <div className="my-4 pb-4 border-b border-white/10">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#C8A27A] font-mono">30%</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A39E93]">
                  OFF Retail Price
                </span>
              </div>
              <span className="text-xs text-[#A39E93] mt-1 block">
                Engineered for secondary schools, colleges, and regional stockists
              </span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#F9F8F6]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                <span>Min order: 20 Cartons (approx. 720 — 960 units)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                <span>Custom institution stamp &amp; school crest option</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                <span>Subsidized shipping allowance on bus freight cargo</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                <span>Priority factory loading with official EFD Tax Invoice</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <a
              href="#inquiry"
              onClick={() => handleSelect('20 — 49 Cartons (30% OFF - Most Popular)')}
              className="w-full py-3.5 px-4 rounded-md bg-[#8C7355] hover:bg-[#725c42] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-h-[46px] shadow-sm cursor-pointer transition-colors"
            >
              <span>Select Business Tier</span>
              <ChevronRight className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>

        {/* Tier 3: Enterprise */}
        <div className="bg-white rounded-lg p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all border border-[#E7E5E0] hover:border-[#8C7355]/50">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#F2EFEB] text-[#8C7355] font-mono">
                Enterprise Tier
              </span>
              <span className="text-xs font-semibold text-[#6E6B66]">50+ Cartons</span>
            </div>
            <h3 className="font-heading text-xl font-bold text-[#111113]">Tenders &amp; Importers</h3>
            <div className="my-4 pb-4 border-b border-[#E7E5E0]">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#DC2626] font-mono">40%</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6E6B66]">
                  OFF Retail Price
                </span>
              </div>
              <span className="text-xs text-[#6E6B66] mt-1 block">
                For government bids, university bookstores, and regional tenders
              </span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#111113]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                <span>Min order: 50 Cartons (1,200 — 2,400+ units)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                <span>Full bespoke cover printing &amp; institution branding</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                <span>Dedicated corporate key account officer via WhatsApp</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                <span>100% Transit insurance coverage on logistics</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <a
              href="#inquiry"
              onClick={() => handleSelect('50 — 99 Cartons (40% OFF - Enterprise)')}
              className="w-full py-3 px-4 rounded-md bg-[#F9F8F6] text-[#111113] hover:bg-[#111113] hover:text-[#F9F8F6] border border-[#E7E5E0] transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
            >
              <span>Select Enterprise Tier</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WholesaleVolumeTiers;

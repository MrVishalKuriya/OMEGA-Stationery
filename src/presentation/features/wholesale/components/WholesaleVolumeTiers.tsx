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
    <section className="py-16 lg:py-20 bg-paper-base max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 text-left text-charcoal-ink">
      <div className="text-center space-y-2 mb-12">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#B91C1C] block">
          TRANSPARENT VOLUME ARCHITECTURE
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal-ink tracking-tight">
          Wholesale Discount Tiers
        </h2>
        <p className="text-xs sm:text-[13px] text-charcoal-ink max-w-lg mx-auto">
          Higher carton volumes unlock direct factory savings with tamper-evident strapping and official EFD tax receipts.
        </p>
        <div className="flex justify-center pt-1">
          <svg className="w-16 h-3 text-charcoal-ink" viewBox="0 0 60 8" fill="none">
            <path d="M0 4 Q 5 0, 10 4 T 20 4 T 30 4 T 40 4 T 50 4 T 60 4" stroke="currentColor" strokeWidth="1.8" fill="none" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Tier 1: Starter */}
        <div className="bg-white rounded-[2px] p-6 sm:p-8 flex flex-col justify-between border border-[#E7E5E0] hover:border-[#DC2626] transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[2px] bg-paper-base text-charcoal-ink border border-[#E7E5E0] font-mono">
                Starter Tier
              </span>
              <span className="text-xs font-semibold text-[#3F3F46]">5 — 19 Cartons</span>
            </div>
            <h3 className="font-heading text-xl font-bold text-charcoal-ink">Retailers &amp; Kiosks</h3>
            <div className="my-4 pb-4 border-b border-[#E7E5E0]">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#B91C1C] font-mono">20%</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3F3F46]">
                  OFF Retail Price
                </span>
              </div>
              <span className="text-xs text-charcoal-ink mt-1 block">
                Perfect for local stationery shops &amp; primary day schools
              </span>
            </div>
            <ul className="space-y-2.5 text-xs text-charcoal-ink">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span>Min order: 5 Cartons (approx. 180 — 240 units)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span>Mixed carton varieties allowed in a single shipment</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span>Factory-sealed heavy kraft protective packaging</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span>Upcountry bus parcel waybill to all major towns</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <a
              href="#inquiry"
              onClick={() => handleSelect('5 — 19 Cartons (20% OFF)')}
              className="w-full py-3 px-4 rounded-[2px] bg-[#111113] text-white hover:bg-[#DC2626] transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Select Starter Tier</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Tier 2: Business (Most Popular - Charcoal & Crimson Red) */}
        <div className="relative bg-[#111113] text-white rounded-[2px] p-6 sm:p-8 flex flex-col justify-between shadow-xl md:-translate-y-2 border-2 border-[#DC2626] transition-all">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-[2px] bg-[#DC2626] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>MOST POPULAR · BEST VALUE</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[2px] bg-white/10 text-white border border-white/20 font-mono">
                Business Tier
              </span>
              <span className="text-xs font-semibold text-[#E4E4E7]">20 — 49 Cartons</span>
            </div>
            <h3 className="font-heading text-xl font-bold text-white">Schools &amp; Bookstores</h3>
            <div className="my-4 pb-4 border-b border-white/15">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#F87171] font-mono">30%</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E4E4E7]">
                  OFF Retail Price
                </span>
              </div>
              <span className="text-xs text-[#E4E4E7] mt-1 block">
                Engineered for secondary schools, colleges, and regional stockists
              </span>
            </div>
            <ul className="space-y-2.5 text-xs text-white">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span>Min order: 20 Cartons (approx. 720 — 960 units)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span>Custom institution stamp &amp; school crest option</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span>Subsidized shipping allowance on bus freight cargo</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span>Priority factory loading with official EFD Tax Invoice</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <a
              href="#inquiry"
              onClick={() => handleSelect('20 — 49 Cartons (30% OFF - Most Popular)')}
              className="w-full py-3.5 px-4 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
            >
              <span>Select Business Tier</span>
              <ChevronRight className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>

        {/* Tier 3: Enterprise */}
        <div className="bg-white rounded-[2px] p-6 sm:p-8 flex flex-col justify-between border border-[#E7E5E0] hover:border-[#DC2626] transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[2px] bg-paper-base text-charcoal-ink border border-[#E7E5E0] font-mono">
                Enterprise Tier
              </span>
              <span className="text-xs font-semibold text-[#3F3F46]">50+ Cartons</span>
            </div>
            <h3 className="font-heading text-xl font-bold text-charcoal-ink">Tenders &amp; Importers</h3>
            <div className="my-4 pb-4 border-b border-[#E7E5E0]">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#B91C1C] font-mono">40%</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3F3F46]">
                  OFF Retail Price
                </span>
              </div>
              <span className="text-xs text-charcoal-ink mt-1 block">
                For government bids, university bookstores, and regional tenders
              </span>
            </div>
            <ul className="space-y-2.5 text-xs text-charcoal-ink">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span>Min order: 50 Cartons (1,200 — 2,400+ units)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span>Full bespoke cover printing &amp; institution branding</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span>Dedicated corporate key account officer via WhatsApp</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span>100% Transit insurance coverage on logistics</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <a
              href="#inquiry"
              onClick={() => handleSelect('50 — 99 Cartons (40% OFF - Enterprise)')}
              className="w-full py-3 px-4 rounded-[2px] bg-[#111113] text-white hover:bg-[#DC2626] transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
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

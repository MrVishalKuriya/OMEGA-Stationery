import React from 'react';
import { Percent, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface WholesaleVolumeTiersProps {
  onSelectTier: (quantityRange: string) => void;
}

export const WholesaleVolumeTiers: React.FC<WholesaleVolumeTiersProps> = ({ onSelectTier }) => {
  return (
    <section className="py-16 lg:py-22 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-2 mb-12">
        <div className="inline-flex items-center px-3.5 py-1 rounded-lg bg-gradient-to-r from-[#dc2626]/15 via-[#dc2626]/5 to-transparent border border-[#dc2626]/30 text-xs font-bold text-[#dc2626] font-mono uppercase tracking-widest shadow-xs">
          <span>TRANSPARENT VOLUME ARCHITECTURE</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#18181b] tracking-tight">
          Wholesale Discount Tiers
        </h2>
        <p className="text-sm text-stone-600 max-w-lg mx-auto">
          Higher carton volumes unlock direct factory savings with tamper-evident strapping and official EFD tax receipts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Tier 1: Starter */}
        <div className="bg-white p-7 sm:p-8 flex flex-col justify-between border border-stone-200 hover:border-[#dc2626] rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-stone-100 text-[#111113]">
                Starter Tier
              </span>
              <span className="text-xs font-semibold text-stone-600">5 — 19 Cartons</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#18181b]">Retailers &amp; Kiosks</h3>
            <div className="my-5 pb-5 border-b border-stone-200">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-[#111113] font-mono">20%</span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  OFF Retail MSRP
                </span>
              </div>
              <span className="text-xs text-stone-500 mt-1 block">
                Perfect for local stationery shops &amp; primary day schools
              </span>
            </div>
            <ul className="space-y-3 text-xs text-stone-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Min order: 5 Cartons (approx. 180 — 240 units)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Mixed carton varieties allowed in a single shipment</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Factory-sealed heavy kraft protective packaging</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Upcountry bus parcel waybill to all major towns</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <a
              href="#inquiry"
              onClick={() => onSelectTier('5 — 19 Cartons (20% OFF)')}
              className="w-full py-3.5 px-4 rounded-lg border-2 border-[#111113] text-[#111113] hover:bg-[#111113] hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Select Starter Tier</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Tier 2: Business (Most Popular) */}
        <div className="relative bg-[#111113] text-white p-7 sm:p-8 flex flex-col justify-between border-2 border-[#dc2626] rounded-2xl shadow-[0_12px_40px_rgba(220,38,38,0.25)] md:-translate-y-2">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-md bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] text-white text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-white" />
            <span>MOST POPULAR · BEST VALUE</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-white/10 text-stone-200 border border-white/20">
                Business Tier
              </span>
              <span className="text-xs font-semibold text-[#dc2626]">20 — 49 Cartons</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-white">Schools &amp; Bookstores</h3>
            <div className="my-5 pb-5 border-b border-white/15">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-[#dc2626] font-mono">30%</span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                  OFF Retail MSRP
                </span>
              </div>
              <span className="text-xs text-stone-300 mt-1 block">
                Engineered for secondary schools, colleges, and regional stockists
              </span>
            </div>
            <ul className="space-y-3 text-xs text-stone-200">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                <span>Min order: 20 Cartons (approx. 720 — 960 units)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                <span>Custom institution stamp &amp; school crest option</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                <span>Subsidized shipping allowance on bus freight cargo</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                <span>Priority factory loading with official EFD Tax Invoice</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <a
              href="#inquiry"
              onClick={() => onSelectTier('20 — 49 Cartons (30% OFF - Most Popular)')}
              className="w-full py-3.5 px-4 rounded-lg btn-ledup-copper group text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px] shadow-lg active:scale-95"
            >
              <span>Select Business Tier</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Tier 3: Enterprise */}
        <div className="bg-white p-7 sm:p-8 flex flex-col justify-between border border-stone-200 hover:border-[#dc2626] rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-stone-100 text-[#111113]">
                Enterprise Tier
              </span>
              <span className="text-xs font-semibold text-stone-600">50+ Cartons</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#18181b]">Tenders &amp; Importers</h3>
            <div className="my-5 pb-5 border-b border-stone-200">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-[#111113] font-mono">40%</span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  OFF Retail MSRP
                </span>
              </div>
              <span className="text-xs text-stone-500 mt-1 block">
                For government bids, university bookstores, and regional tenders
              </span>
            </div>
            <ul className="space-y-3 text-xs text-stone-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Min order: 50 Cartons (1,200 — 2,400+ units)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Full bespoke cover printing &amp; institution branding</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Dedicated corporate key account officer via WhatsApp</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>100% Transit insurance coverage on logistics</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <a
              href="#inquiry"
              onClick={() => onSelectTier('50 — 99 Cartons (40% OFF - Enterprise)')}
              className="w-full py-3.5 px-4 rounded-lg border-2 border-[#111113] text-[#111113] hover:bg-[#111113] hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px]"
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

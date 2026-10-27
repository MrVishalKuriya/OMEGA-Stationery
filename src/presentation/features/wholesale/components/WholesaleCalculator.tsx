import React, { useState } from 'react';
import { Calculator, TrendingUp, MessageCircle } from 'lucide-react';
import { formatPrice } from '@/types/store';

export type CartonSpecKey = 'q2' | 'q3' | 'q4' | 'ex200' | 'bahasha';

export interface CartonSpec {
  label: string;
  pcsPerBox: number;
  baseCarton: number;
  unitMSRP: number;
  boxWeight: string;
  packaging: string;
}

interface WholesaleCalculatorProps {
  cartonSpecs: Record<CartonSpecKey, CartonSpec>;
  currency: string;
  cleanWhatsappDigits: string;
}

export const WholesaleCalculator: React.FC<WholesaleCalculatorProps> = ({
  cartonSpecs,
  currency,
  cleanWhatsappDigits,
}) => {
  const [calcQuire, setCalcQuire] = useState<CartonSpecKey>('q2');
  const [calcCartons, setCalcCartons] = useState<number>(20);

  const currentCarton = cartonSpecs[calcQuire];

  // Tiered discount calculation
  const discountRate =
    calcCartons >= 50 ? 0.4 : calcCartons >= 20 ? 0.3 : calcCartons >= 5 ? 0.2 : 0.1;
  const grossTotal = currentCarton.baseCarton * calcCartons;
  const savingsAmount = Math.round(grossTotal * discountRate);
  const netTotal = grossTotal - savingsAmount;
  const totalUnits = calcCartons * currentCarton.pcsPerBox;
  const costPerUnit = Math.round(netTotal / totalUnits);
  const projectedRetailRevenue = totalUnits * currentCarton.unitMSRP;
  const retailerProfit = projectedRetailRevenue - netTotal;

  const whatsappUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    `*OMEGA WHOLESALE CALCULATOR ORDER*\n` +
      `Product: ${currentCarton.label}\n` +
      `Quantity: ${calcCartons} Cartons (${totalUnits.toLocaleString()} Units)\n` +
      `Unit Cost: ${currency} ${costPerUnit.toLocaleString()}\n` +
      `Tier Discount: ${Math.round(discountRate * 100)}% OFF\n` +
      `Calculated Total: ${currency} ${netTotal.toLocaleString()}\n\n` +
      `Please prepare formal proforma invoice and confirm dispatch schedule.`
  )}`;

  return (
    <section
      id="calculator"
      className="py-16 lg:py-24 bg-[#09090b] text-white border-y border-white/10 relative overflow-hidden scroll-mt-20"
    >
      {/* Ambient background lighting */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-[#dc2626]/12 via-[#dc2626]/5 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-2.5 mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-bold text-[#ef4444] bg-[#dc2626]/10 border border-[#dc2626]/30 font-mono tracking-widest uppercase shadow-xs">
            <span>DYNAMIC PROFORMA &amp; MARGIN SIMULATOR</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Calculate Exact Carton &amp; Profit Savings
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Select your product line and carton volume to calculate your net factory price, unit cost, and estimated retailer profit margins.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Inputs Column */}
          <div className="lg:col-span-7 bg-[#111113] p-6 sm:p-8 rounded-2xl border border-white/10 space-y-7 shadow-2xl relative">
            {/* Step 1: Product Selection */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-md bg-[#dc2626]/20 border border-[#dc2626]/40 text-[#ef4444] font-mono text-[11px] font-bold inline-flex items-center justify-center shrink-0">
                  1
                </span>
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                  Choose Product Line:
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(
                  [
                    { key: 'q2', title: 'Q2 Counter Book', sub: '192p · 48/Box' },
                    { key: 'q3', title: 'Q3 Counter Book', sub: '288p · 36/Box' },
                    { key: 'q4', title: 'Q4 Counter Book', sub: '384p · 24/Box' },
                    { key: 'ex200', title: 'Exercise Book', sub: '200p · 72/Box' },
                    { key: 'bahasha', title: 'Kraft Bahasha A4', sub: '250 Pcs/Box' },
                  ] as const
                ).map((item) => {
                  const isSelected = calcQuire === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setCalcQuire(item.key)}
                      className={`p-3.5 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#b91c1c] via-[#dc2626] to-[#991b1b] text-white border-[#ef4444]/60 shadow-[0_4px_20px_rgba(220,38,38,0.4)] ring-1 ring-[#ef4444]/40'
                          : 'bg-[#18181b]/80 hover:bg-[#202024] text-zinc-300 border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold leading-snug">{item.title}</div>
                      <div className={`text-[11px] mt-1 font-mono ${isSelected ? 'text-white/80' : 'text-zinc-500'}`}>
                        {item.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Carton Quantity Controls */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#dc2626]/20 border border-[#dc2626]/40 text-[#ef4444] font-mono text-[11px] font-bold inline-flex items-center justify-center shrink-0">
                    2
                  </span>
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                    Select Carton Quantity:
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={calcCartons}
                    onChange={(e) => setCalcCartons(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-1.5 text-right text-xs font-bold rounded-lg bg-[#18181b] border border-white/20 text-white font-mono focus:outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]"
                  />
                  <span className="text-xs font-mono text-zinc-400">Cartons</span>
                </div>
              </div>

              {/* Range Slider */}
              <div className="py-2 mb-3">
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={calcCartons}
                  onChange={(e) => setCalcCartons(parseInt(e.target.value))}
                  className="w-full accent-[#ef4444] cursor-pointer h-2 bg-[#27272a] rounded-lg appearance-none"
                />
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-6 gap-2">
                {[5, 10, 20, 35, 50, 100].map((qty) => {
                  const isSelected = calcCartons === qty;
                  return (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setCalcCartons(qty)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all font-mono ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] text-white border-transparent shadow-[0_2px_12px_rgba(220,38,38,0.4)]'
                          : 'bg-[#18181b] text-zinc-400 hover:text-white border-white/10 hover:border-white/20'
                      }`}
                    >
                      {qty}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specifications Box */}
            <div className="p-4 rounded-xl bg-[#18181b]/90 border border-white/10 text-xs text-zinc-300 grid grid-cols-2 gap-4">
              <div>
                <span className="text-zinc-500 block text-[11px] font-mono uppercase tracking-wider mb-0.5">
                  Packaging Spec:
                </span>
                <span className="font-semibold text-white">{currentCarton.packaging}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px] font-mono uppercase tracking-wider mb-0.5">
                  Consignment Weight:
                </span>
                <span className="font-semibold text-white font-mono">
                  Approx. {(parseFloat(currentCarton.boxWeight) * calcCartons).toFixed(0)} kg
                </span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Card (Obsidian Atelier Glass Card) */}
          <div className="lg:col-span-5 bg-[#111113] text-white p-6 sm:p-8 rounded-2xl border border-white/15 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Top Crimson Accent Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444]" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ef4444] font-mono block">
                  CALCULATED SUMMARY
                </span>
                <h3 className="font-heading text-lg font-bold text-white mt-0.5">
                  {currentCarton.label}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-md text-xs font-bold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {Math.round(discountRate * 100)}% TIER DISCOUNT
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Carton Quantity:</span>
                <span className="font-bold text-white font-mono">{calcCartons} Cartons</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Total Individual Units:</span>
                <span className="font-bold text-white font-mono">
                  {totalUnits.toLocaleString()} Books / Pcs
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Base Factory Carton Value:</span>
                <span className="font-mono text-zinc-300">
                  {formatPrice(grossTotal, currency)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Factory Volume Savings:</span>
                <span className="font-mono">- {formatPrice(savingsAmount, currency)}</span>
              </div>

              {/* Net Factory Wholesale Total */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Net Factory Wholesale Total:
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {formatPrice(netTotal, currency)}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 text-right mt-1 font-mono">
                  Unit Cost: <strong className="text-white font-bold">{formatPrice(costPerUnit, currency)}</strong> per book
                </div>
              </div>

              {/* Retailer Resale Profit Projection (Emerald Dark Card) */}
              <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/25 text-emerald-300 mt-3">
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1.5 text-emerald-400">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono uppercase tracking-wider text-[11px]">Projected Retail Resale Profit</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-200/80">
                  <span>At Standard Retail Price:</span>
                  <span className="font-mono font-bold text-emerald-100">{formatPrice(projectedRetailRevenue, currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-xs text-emerald-400 pt-2 border-t border-emerald-500/20 mt-2">
                  <span>Your Gross Profit:</span>
                  <span className="font-mono text-base font-black text-emerald-300">+{formatPrice(retailerProfit, currency)}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] hover:brightness-110 text-white font-bold font-mono text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(220,38,38,0.4)] min-h-[48px] active:scale-[0.98] transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Confirm Proforma on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

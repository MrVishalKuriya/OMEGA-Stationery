import React, { useState } from 'react';
import { Calculator, TrendingUp, MessageCircle, Sparkles } from 'lucide-react';
import { formatPrice } from '@/types/store';
import { triggerLuxuryConfetti } from '@/utils/confetti';

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
      className="py-16 lg:py-20 bg-paper-base text-charcoal-ink relative overflow-hidden scroll-mt-20 text-left border-t border-b border-[#E7E5E0]"
    >
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[11px] font-bold font-mono tracking-widest uppercase text-[#B91C1C] block">
            DYNAMIC PROFORMA &amp; MARGIN SIMULATOR
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal-ink tracking-tight">
            Calculate Exact Carton &amp; Profit Savings
          </h2>
          <p className="text-xs sm:text-[13px] text-charcoal-ink max-w-xl mx-auto leading-relaxed">
            Select your product line and carton volume to calculate your net factory price, unit cost, and estimated retailer profit margins.
          </p>
          <div className="flex justify-center pt-1">
            <svg className="w-16 h-3 text-[#DC2626]" viewBox="0 0 60 8" fill="none">
              <path d="M0 4 Q 5 0, 10 4 T 20 4 T 30 4 T 40 4 T 50 4 T 60 4" stroke="currentColor" strokeWidth="1.8" fill="none" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Inputs Column */}
          <div className="lg:col-span-7 bg-white rounded-[2px] p-6 sm:p-8 space-y-6 border border-[#E7E5E0] relative">
            {/* Step 1: Product Selection */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-[2px] bg-[#111113] text-white font-mono text-xs font-bold inline-flex items-center justify-center shrink-0">
                  1
                </span>
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-ink">
                  Choose Product Line:
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
                      className={`p-3.5 rounded-[2px] text-left transition-all relative cursor-pointer border ${isSelected
                          ? 'bg-[#DC2626] text-white border-[#DC2626] shadow-xs'
                          : 'bg-paper-base hover:bg-neutral-100 text-charcoal-ink border-[#E7E5E0]'
                        }`}
                    >
                      <div className="text-xs font-bold leading-snug">{item.title}</div>
                      <div className={`text-[10px] mt-0.5 font-mono ${isSelected ? 'text-white' : 'text-[#3F3F46]'}`}>
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
                  <span className="w-6 h-6 rounded-[2px] bg-[#111113] text-white font-mono text-xs font-bold inline-flex items-center justify-center shrink-0">
                    2
                  </span>
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-ink">
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
                    className="w-20 px-3 py-1.5 rounded-[2px] border border-[#E7E5E0] text-right text-xs font-bold bg-paper-base text-charcoal-ink font-mono focus:outline-none focus:border-[#DC2626]"
                  />
                  <span className="text-xs font-mono text-[#3F3F46]">Cartons</span>
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
                  className="w-full accent-[#DC2626] cursor-pointer h-2 bg-[#E7E5E0] rounded-[2px] appearance-none"
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
                      className={`py-2 rounded-[2px] text-xs font-bold transition-all font-mono cursor-pointer border ${isSelected
                          ? 'bg-[#111113] text-white border-[#111113] shadow-xs'
                          : 'bg-paper-base text-charcoal-ink border-[#E7E5E0] hover:border-[#111113]'
                        }`}
                    >
                      {qty}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specifications Box */}
            <div className="p-4 rounded-[2px] bg-paper-base border border-[#E7E5E0] text-xs text-charcoal-ink grid grid-cols-2 gap-4">
              <div>
                <span className="text-[#3F3F46] block text-[10px] font-mono uppercase tracking-wider mb-0.5 font-bold">
                  Packaging Spec:
                </span>
                <span className="font-bold text-charcoal-ink">{currentCarton.packaging}</span>
              </div>
              <div>
                <span className="text-[#3F3F46] block text-[10px] font-mono uppercase tracking-wider mb-0.5 font-bold">
                  Consignment Weight:
                </span>
                <span className="font-bold text-charcoal-ink font-mono">
                  Approx. {(parseFloat(currentCarton.boxWeight) * calcCartons).toFixed(0)} kg
                </span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="lg:col-span-5 bg-white rounded-[2px] text-charcoal-ink p-6 sm:p-8 border border-[#E7E5E0] space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E7E5E0]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B91C1C] font-mono block">
                  CALCULATED SUMMARY
                </span>
                <h3 className="font-heading text-base font-bold text-charcoal-ink mt-0.5">
                  {currentCarton.label}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-[2px] text-xs font-bold font-mono bg-[#111113] text-white">
                {Math.round(discountRate * 100)}% TIER OFF
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[#3F3F46]">
                <span>Carton Quantity:</span>
                <span className="font-bold text-charcoal-ink font-mono">{calcCartons} Cartons</span>
              </div>
              <div className="flex justify-between text-[#3F3F46]">
                <span>Total Individual Units:</span>
                <span className="font-bold text-charcoal-ink font-mono">
                  {totalUnits.toLocaleString()} Books / Pcs
                </span>
              </div>
              <div className="flex justify-between text-[#3F3F46]">
                <span>Base Factory Carton Value:</span>
                <span className="font-mono text-charcoal-ink">
                  {formatPrice(grossTotal, currency)}
                </span>
              </div>
              <div className="flex justify-between text-[#B91C1C] font-bold">
                <span>Factory Volume Savings:</span>
                <span className="font-mono">- {formatPrice(savingsAmount, currency)}</span>
              </div>

              {/* Net Factory Wholesale Total */}
              <div className="pt-3 border-t border-[#E7E5E0]">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3F3F46]">
                    Net Factory Total:
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#B91C1C] font-mono">
                    {formatPrice(netTotal, currency)}
                  </span>
                </div>
                <div className="text-[11px] text-[#3F3F46] text-right mt-1 font-mono">
                  Unit Cost: <strong className="text-charcoal-ink font-bold">{formatPrice(costPerUnit, currency)}</strong> per book
                </div>
              </div>

              {/* Retailer Resale Profit Projection */}
              <div className="p-4 rounded-[2px] bg-[#111113] text-white mt-2 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1 text-[#DC2626]">
                  <TrendingUp className="w-4 h-4 text-[#DC2626]" />
                  <span className="font-mono uppercase tracking-wider text-[11px] text-white">Projected Retail Resale Profit</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#E4E4E7]">
                  <span>At Standard Retail Price:</span>
                  <span className="font-mono font-bold text-white">{formatPrice(projectedRetailRevenue, currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-2 border-t border-white/15 mt-1.5">
                  <span className="text-white">Your Gross Profit:</span>
                  <span className="font-mono text-base font-bold text-[#F87171]">+{formatPrice(retailerProfit, currency)}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <a
              href={whatsappUrl}
              onClick={() => triggerLuxuryConfetti()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
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

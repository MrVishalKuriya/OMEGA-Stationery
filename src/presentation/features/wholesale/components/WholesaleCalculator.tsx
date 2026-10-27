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
      className="py-16 bg-[#2d2520] text-white border-y border-[#18181b] scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#dc2626]/20 via-[#dc2626]/10 to-transparent border border-[#dc2626]/40 font-mono shadow-xs">
            <span>DYNAMIC PROFORMA &amp; MARGIN SIMULATOR</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Calculate Exact Carton &amp; Profit Savings
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
            Select product and carton volume to calculate your net factory price, unit cost, and estimated retailer profit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Inputs */}
          <div className="lg:col-span-7 bg-[#38302a] p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 shadow-xl">
            {/* Step 1: Product Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#dc2626] mb-2.5">
                1. Choose Product Line:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(
                  [
                    { key: 'q2', title: 'Q2 Counter Book', sub: '192p · 48/Box' },
                    { key: 'q3', title: 'Q3 Counter Book', sub: '288p · 36/Box' },
                    { key: 'q4', title: 'Q4 Counter Book', sub: '384p · 24/Box' },
                    { key: 'ex200', title: 'Exercise Book', sub: '200p · 72/Box' },
                    { key: 'bahasha', title: 'Kraft Bahasha A4', sub: '250 Pcs/Box' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setCalcQuire(item.key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      calcQuire === item.key
                        ? 'bg-[#dc2626] text-white border-transparent shadow-md'
                        : 'bg-[#2d2520] text-stone-200 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.title}</div>
                    <div className="text-[11px] opacity-80 mt-0.5 font-mono">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Carton Quantity Controls */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#dc2626]">
                  2. Select Carton Quantity:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={calcCartons}
                    onChange={(e) => setCalcCartons(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-2.5 py-1 text-right text-xs font-bold rounded-lg bg-[#2d2520] border border-white/20 text-white font-mono focus:outline-none focus:border-[#dc2626]"
                  />
                  <span className="text-xs text-stone-300">Cartons</span>
                </div>
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={calcCartons}
                onChange={(e) => setCalcCartons(parseInt(e.target.value))}
                className="w-full accent-[#dc2626] cursor-pointer mb-3"
              />

              {/* Quick Presets */}
              <div className="flex gap-2">
                {[5, 10, 20, 35, 50, 100].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setCalcCartons(qty)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all font-mono ${
                      calcCartons === qty
                        ? 'bg-[#dc2626] text-white border-transparent shadow-md'
                        : 'bg-[#2d2520] text-stone-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications Box */}
            <div className="p-3.5 rounded-xl bg-[#2d2520] border border-white/10 text-xs text-stone-300 grid grid-cols-2 gap-3">
              <div>
                <span className="text-stone-400 block text-[11px]">Packaging Spec:</span>
                <span className="font-semibold text-white">{currentCarton.packaging}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Consignment Weight:</span>
                <span className="font-semibold text-white">
                  Approx. {(parseFloat(currentCarton.boxWeight) * calcCartons).toFixed(0)} kg
                </span>
              </div>
            </div>
          </div>

          {/* Live Financial Breakdown Card */}
          <div className="lg:col-span-5 bg-white text-[#18181b] p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Calculated Summary
                </span>
                <h3 className="font-heading text-lg font-bold text-[#18181b]">
                  {currentCarton.label}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                {Math.round(discountRate * 100)}% TIER DISCOUNT
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Carton Quantity:</span>
                <span className="font-bold text-[#18181b]">{calcCartons} Cartons</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Total Individual Units:</span>
                <span className="font-bold text-[#18181b] font-mono">
                  {totalUnits.toLocaleString()} Books / Pcs
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Base Factory Carton Value:</span>
                <span className="font-mono font-medium text-stone-700">
                  {formatPrice(grossTotal, currency)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Factory Volume Savings:</span>
                <span className="font-mono">- {formatPrice(savingsAmount, currency)}</span>
              </div>

              <div className="pt-3 border-t border-stone-200">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Net Factory Wholesale Total:
                  </span>
                  <span className="text-2xl font-black text-[#111113] font-mono">
                    {formatPrice(netTotal, currency)}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 text-right mt-0.5">
                  Unit Cost: <strong className="font-mono text-[#111113]">{formatPrice(costPerUnit, currency)}</strong> per book
                </div>
              </div>

              {/* Retailer Resale Profit Projection */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 mt-2">
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>Projected Retail Resale Profit</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>At Standard Retail Price:</span>
                  <span className="font-mono font-bold">{formatPrice(projectedRetailRevenue, currency)}</span>
                </div>
                <div className="flex justify-between font-black text-xs text-emerald-800 pt-1 border-t border-emerald-200 mt-1">
                  <span>Your Gross Profit:</span>
                  <span className="font-mono text-sm">+{formatPrice(retailerProfit, currency)}</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-lg btn-ledup-copper group text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg min-h-[48px] active:scale-95 text-white"
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

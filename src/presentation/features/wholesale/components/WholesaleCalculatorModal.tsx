import React, { useState } from 'react';
import {
  Calculator,
  X,
  Package,
  CheckCircle2,
  Percent,
  Truck,
  MessageCircle,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface WholesaleCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WholesaleItemConfig {
  id: string;
  name: string;
  piecesPerBox: number;
  boxPriceTzs: number;
  category: string;
}

const OFFICIAL_WHOLESALE_ITEMS: WholesaleItemConfig[] = [
  { id: 'q1', name: 'Counter Book Q1 (96 Pages)', piecesPerBox: 96, boxPriceTzs: 58000, category: 'Counter Books' },
  { id: 'q2', name: 'Counter Book Q2 (192 Pages)', piecesPerBox: 48, boxPriceTzs: 54000, category: 'Counter Books' },
  { id: 'q3', name: 'Counter Book Q3 (288 Pages)', piecesPerBox: 36, boxPriceTzs: 56000, category: 'Counter Books' },
  { id: 'q4', name: 'Counter Book Q4 (384 Pages)', piecesPerBox: 24, boxPriceTzs: 44000, category: 'Counter Books' },
  { id: 'ex-200', name: 'Exercise Book 200 Pages', piecesPerBox: 120, boxPriceTzs: 56000, category: 'Exercise Books' },
  { id: 'ex-100', name: 'Exercise Book 100 Pages', piecesPerBox: 120, boxPriceTzs: 41000, category: 'Exercise Books' },
  { id: 'ex-80', name: 'Exercise Book 80 Pages', piecesPerBox: 100, boxPriceTzs: 26000, category: 'Exercise Books' },
  { id: 'ex-32', name: 'Exercise Book 32 Pages', piecesPerBox: 300, boxPriceTzs: 42000, category: 'Exercise Books' },
  { id: 'bahasha-a4', name: 'Kraft Bahasha A4', piecesPerBox: 500, boxPriceTzs: 41000, category: 'Bahasha & Envelopes' },
  { id: 'bahasha-a3', name: 'Kraft Bahasha A3', piecesPerBox: 500, boxPriceTzs: 54000, category: 'Bahasha & Envelopes' },
  { id: 'bahasha-a5', name: 'Kraft Bahasha A5', piecesPerBox: 500, boxPriceTzs: 33000, category: 'Bahasha & Envelopes' },
];

export const WholesaleCalculatorModal: React.FC<WholesaleCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { storeConfig } = useStore();
  const [quantities, setQuantities] = useState<Record<string, number>>({
    q2: 2,
    q3: 3,
    'ex-100': 2,
  });

  if (!isOpen) return null;

  const handleQtyChange = (id: string, qty: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, qty),
    }));
  };

  // Calculations
  let totalBoxes = 0;
  let totalPieces = 0;
  let rawTotalTzs = 0;
  const activeItems: Array<{ item: WholesaleItemConfig; boxes: number; pieces: number; subtotal: number }> = [];

  OFFICIAL_WHOLESALE_ITEMS.forEach((item) => {
    const boxes = quantities[item.id] || 0;
    if (boxes > 0) {
      const pieces = boxes * item.piecesPerBox;
      const subtotal = boxes * item.boxPriceTzs;
      totalBoxes += boxes;
      totalPieces += pieces;
      rawTotalTzs += subtotal;
      activeItems.push({ item, boxes, pieces, subtotal });
    }
  });

  // Tiered volume discount
  let discountRate = 0;
  if (totalBoxes >= 20) {
    discountRate = 0.10; // 10%
  } else if (totalBoxes >= 5) {
    discountRate = 0.05; // 5%
  }

  const discountAmount = Math.round(rawTotalTzs * discountRate);
  const finalPayable = rawTotalTzs - discountAmount;
  const currency = storeConfig.currencySymbol || 'TZS';

  const generateWhatsAppQuoteUrl = () => {
    const lines = [
      `*OMEGA Official Wholesale Tender Quotation*`,
      `Factory: Soweto SIDO Viwandani, Mbeya, Tanzania`,
      `----------------------------------------`,
      `*Order Details:*`,
      ...activeItems.map(
        (it) => `• ${it.item.name}: ${it.boxes} Boxes (${it.pieces.toLocaleString()} Pcs) = TZS ${it.subtotal.toLocaleString()}`
      ),
      `----------------------------------------`,
      `Total Boxes: ${totalBoxes} Cartons`,
      `Total Notebooks/Envelopes: ${totalPieces.toLocaleString()} Pieces`,
      `Standard Factory Total: TZS ${rawTotalTzs.toLocaleString()}`,
      discountRate > 0 ? `Tier Volume Discount (${discountRate * 100}%): -TZS ${discountAmount.toLocaleString()}` : null,
      `*Final Wholesale Payable: TZS ${finalPayable.toLocaleString()}*`,
      `----------------------------------------`,
      `Please provide invoice and dispatch schedule to my region.`,
    ].filter(Boolean);

    return `https://wa.me/255624265480?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-[#fafafa] rounded-2xl shadow-2xl border border-[#e2dedb] flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#4b423b] text-white p-4 sm:p-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#c49b7c]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-sm sm:text-base font-bold text-white tracking-wide">
                  Wholesale Carton &amp; Tender Calculator
                </h3>
                <span className="heimplanet-tag text-[9px] border-[#c49b7c]/40 text-[#c49b7c]">
                  [ FACTORY SHEET 2026 ]
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Official box rates, piece counts per carton &amp; volume tiered discounts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Discount Tier Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className={`p-3 rounded-xl border transition-all ${totalBoxes < 5 ? 'bg-white border-[#4b423b] ring-2 ring-[#c49b7c]' : 'bg-white/70 border-[#e2dedb]'}`}>
              <p className="font-bold text-[#4b423b]">Tier 1: 1–4 Boxes</p>
              <p className="text-[11px] text-stone-500">Standard factory wholesale rates</p>
            </div>
            <div className={`p-3 rounded-xl border transition-all ${totalBoxes >= 5 && totalBoxes < 20 ? 'bg-white border-[#2A9D8F] ring-2 ring-[#2A9D8F]' : 'bg-white/70 border-[#e2dedb]'}`}>
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#2A9D8F]">Tier 2: 5–19 Boxes</p>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#2A9D8F]/15 font-bold text-[#2A9D8F]">5% OFF</span>
              </div>
              <p className="text-[11px] text-stone-500">For retail shops &amp; primary schools</p>
            </div>
            <div className={`p-3 rounded-xl border transition-all ${totalBoxes >= 20 ? 'bg-white border-[#c49b7c] ring-2 ring-[#c49b7c]' : 'bg-white/70 border-[#e2dedb]'}`}>
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#4b423b]">Tier 3: 20+ Boxes</p>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#c49b7c] font-bold text-[#4b423b]">10% OFF</span>
              </div>
              <p className="text-[11px] text-stone-500">Major tenders &amp; bulk regional distributors</p>
            </div>
          </div>

          {/* Product Items Table */}
          <div className="bg-white rounded-xl border border-[#e2dedb] overflow-hidden shadow-2xs">
            <div className="p-3 bg-[#fafafa] border-b border-[#e2dedb] flex items-center justify-between text-xs font-bold text-[#4b423b]">
              <span>Select Product Lines</span>
              <a
                href="/sheet/Indigo_Printed_Price_List.xlsx"
                download="Indigo_Printed_Price_List_2026.xlsx"
                className="text-[11px] text-blue-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Download Price List (.xlsx)</span>
              </a>
            </div>

            <div className="divide-y divide-[#e2dedb] max-h-72 overflow-y-auto">
              {OFFICIAL_WHOLESALE_ITEMS.map((item) => {
                const boxes = quantities[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="p-3 sm:px-4 flex items-center justify-between gap-3 text-xs hover:bg-[#fafafa]/60 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[#14182B] truncate">{item.name}</p>
                      <p className="text-[11px] text-stone-500">
                        {item.piecesPerBox} Pcs / Box · {currency} {item.boxPriceTzs.toLocaleString()} per box
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center border border-[#e2dedb] rounded-lg bg-white">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.id, boxes - 1)}
                          className="px-2.5 py-1 text-stone-600 hover:text-stone-900 font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={boxes}
                          onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value, 10) || 0)}
                          className="w-12 text-center text-xs font-bold font-mono focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.id, boxes + 1)}
                          className="px-2.5 py-1 text-stone-600 hover:text-stone-900 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="w-24 text-right font-mono font-bold text-[#4b423b]">
                        {boxes > 0 ? `${currency} ${(boxes * item.boxPriceTzs).toLocaleString()}` : '—'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quotation Summary Box */}
          <div className="bg-[#4b423b] text-white p-4 sm:p-5 rounded-2xl space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
              <span className="text-stone-300">Total Cartons:</span>
              <span className="font-mono font-bold text-[#c49b7c] text-sm">
                {totalBoxes} Boxes ({totalPieces.toLocaleString()} Notebooks)
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-300">
              <span>Gross Wholesale Subtotal:</span>
              <span className="font-mono">{currency} {rawTotalTzs.toLocaleString()}</span>
            </div>

            {discountRate > 0 && (
              <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold">
                <span>Tier Volume Discount ({discountRate * 100}%):</span>
                <span className="font-mono">- {currency} {discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/15 text-sm sm:text-base font-black">
              <span>Final Payable (Ex-Factory):</span>
              <span className="font-mono text-[#c49b7c] text-lg sm:text-xl">
                {currency} {finalPayable.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-[#e2dedb] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Truck className="w-4 h-4 text-[#2A9D8F]" />
            <span>Bus freight dispatch to Dar, Mbeya, Arusha &amp; all regions</span>
          </div>

          <a
            href={generateWhatsAppQuoteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full sm:w-auto py-3 px-6 rounded-xl bg-[#2A9D8F] hover:bg-[#238276] text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md aardvark-btn-spring ${
              totalBoxes === 0 ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Generate Official WhatsApp Tender Quote</span>
          </a>
        </div>
      </div>
    </div>
  );
};

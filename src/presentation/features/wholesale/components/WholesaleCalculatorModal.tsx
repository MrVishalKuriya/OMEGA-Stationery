import React, { useState } from 'react';
import { Calculator, X, Package, CheckCircle2, MessageSquare } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export interface WholesaleCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WHOLESALE_PRODUCTS = [
  {
    id: 'q4',
    name: 'OMEGA Counter Book 4 Quire (384 Pages)',
    cartonUnits: 24,
    baseCartonPrice: 276000,
    unitRetailPrice: 12500,
  },
  {
    id: 'q3',
    name: 'OMEGA Counter Book 3 Quire (288 Pages)',
    cartonUnits: 24,
    baseCartonPrice: 216000,
    unitRetailPrice: 9800,
  },
  {
    id: 'q2',
    name: 'OMEGA Counter Book 2 Quire (192 Pages)',
    cartonUnits: 36,
    baseCartonPrice: 234000,
    unitRetailPrice: 7200,
  },
  {
    id: 'q1',
    name: 'OMEGA Counter Book 1 Quire (96 Pages)',
    cartonUnits: 48,
    baseCartonPrice: 192000,
    unitRetailPrice: 4500,
  },
  {
    id: 'ex200',
    name: 'Msomi Student Exercise Book A4 (200 Pages)',
    cartonUnits: 60,
    baseCartonPrice: 150000,
    unitRetailPrice: 2800,
  },
  {
    id: 'envA4',
    name: 'Bahasha Kraft Envelopes A4 (Box of 250)',
    cartonUnits: 10,
    baseCartonPrice: 220000,
    unitRetailPrice: 25000,
  },
];

const REGIONS = [
  { name: 'Mbeya (Free Factory Pickup / Local Delivery)', shippingPerCarton: 0 },
  { name: 'Songwe / Njombe / Iringa', shippingPerCarton: 3500 },
  { name: 'Dar es Salaam / Morogoro', shippingPerCarton: 6000 },
  { name: 'Dodoma / Singida / Tabora', shippingPerCarton: 5500 },
  { name: 'Mwanza / Arusha / Kilimanjaro', shippingPerCarton: 8500 },
  { name: 'Ruvuma / Rukwa / Katavi', shippingPerCarton: 4500 },
];

export const WholesaleCalculatorModal: React.FC<WholesaleCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { storeConfig } = useStore();
  const [selectedProduct, setSelectedProduct] = useState(WHOLESALE_PRODUCTS[0].id);
  const [cartons, setCartons] = useState<number>(10);
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0].name);
  const [institutionName, setInstitutionName] = useState('');

  if (!isOpen) return null;

  const currency = storeConfig.currencySymbol || 'TSh';
  const formatTZS = (amount: number) => `${currency} ${Math.round(amount).toLocaleString()}`;
  const cleanWhatsappDigits = (storeConfig.whatsappNumber || '255715268391').replace(/\D/g, '');
  const whatsappDisplay = storeConfig.whatsappNumber || '+255 715 268 391';

  const product =
    WHOLESALE_PRODUCTS.find((p) => p.id === selectedProduct) || WHOLESALE_PRODUCTS[0];
  const region = REGIONS.find((r) => r.name === selectedRegion) || REGIONS[0];

  // Volume discount tiers
  let discountRate = 0;
  let tierLabel = 'Standard Wholesale (1–9 Cartons)';
  if (cartons >= 50) {
    discountRate = 0.18;
    tierLabel = 'Tier 3 Institutional / Distributor (18% Off)';
  } else if (cartons >= 20) {
    discountRate = 0.12;
    tierLabel = 'Tier 2 School & Bookshop Bulk (12% Off)';
  } else if (cartons >= 10) {
    discountRate = 0.07;
    tierLabel = 'Tier 1 Trade Volume (7% Off)';
  }

  const grossSubtotal = product.baseCartonPrice * cartons;
  const discountAmount = Math.round(grossSubtotal * discountRate);
  const netProductTotal = grossSubtotal - discountAmount;
  const estimatedShipping = region.shippingPerCarton * cartons;
  const grandTotal = netProductTotal + estimatedShipping;
  const totalUnits = product.cartonUnits * cartons;
  const effectiveUnitPrice = Math.round(netProductTotal / totalUnits);

  const handleRequestProforma = () => {
    const message = [
      `*OMEGA STATIONERY — B2B PROFORMA INVOICE REQUEST*`,
      institutionName ? `Organization: ${institutionName}` : null,
      `Product: ${product.name}`,
      `Quantity: ${cartons} Cartons (${totalUnits.toLocaleString()} units)`,
      `Tier Applied: ${tierLabel}`,
      `Region: ${region.name}`,
      `Net Product Total: ${formatTZS(netProductTotal)}`,
      `Est. Logistics: ${estimatedShipping === 0 ? 'FREE' : formatTZS(estimatedShipping)}`,
      `*Estimated Grand Total: ${formatTZS(grandTotal)}*`,
      ``,
      `Please issue an official EFD Proforma Invoice for this order.`,
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111113]/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-paper-base text-charcoal-ink rounded-[4px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E7E5E0] relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close wholesale calculator"
          className="absolute top-5 right-5 w-10 h-10 rounded-[4px] bg-white border border-[#E7E5E0] flex items-center justify-center text-charcoal-ink hover:bg-[#DC2626] hover:text-white hover:border-[#DC2626] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-[#E7E5E0]">
          <div className="w-12 h-12 rounded-[4px] bg-[#111113] text-white flex items-center justify-center border-b-2 border-[#DC2626] shrink-0">
            <Calculator className="w-6 h-6 text-[#DC2626]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B91C1C] block font-mono">
              Soweto SIDO Factory Direct
            </span>
            <h3 className="font-display text-2xl font-bold text-charcoal-ink">
              Wholesale Carton &amp; Tender Calculator
            </h3>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-ink mb-2">
              School / Bookshop / Organization Name (Optional)
            </label>
            <input
              type="text"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              placeholder="e.g. St. Mary's Secondary School or Mbeya Central Bookshop"
              className="w-full px-4 py-3 rounded-[4px] border border-[#D4D2CD] bg-white focus:border-[#DC2626] focus:outline-none text-sm font-medium text-charcoal-ink placeholder:text-[#71717A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-ink mb-2">
                Select Product Line
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-3 rounded-[4px] border border-[#D4D2CD] bg-white focus:border-[#DC2626] focus:outline-none text-sm font-bold text-charcoal-ink cursor-pointer"
              >
                {WHOLESALE_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-ink mb-2">
                Delivery Region (Tanzania)
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-3 rounded-[4px] border border-[#D4D2CD] bg-white focus:border-[#DC2626] focus:outline-none text-sm font-bold text-charcoal-ink cursor-pointer"
              >
                {REGIONS.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[4px] border border-[#E7E5E0]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-ink">
                Number of Cartons:{' '}
                <span className="text-[#B91C1C] font-mono text-base ml-1">{cartons} Cartons</span>
              </label>
              <span className="text-xs font-mono font-bold text-[#3F3F46]">
                {totalUnits.toLocaleString()} Total Units ({product.cartonUnits} / carton)
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={cartons}
              onChange={(e) => setCartons(Number(e.target.value))}
              className="w-full accent-[#DC2626] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono font-bold text-[#52525B] mt-1">
              <span>1 Carton</span>
              <span>10+ (7% Off)</span>
              <span>20+ (12% Off)</span>
              <span>50+ (18% Off)</span>
              <span>100 Cartons</span>
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-[#111113] text-white rounded-[4px] p-6 space-y-3 border-t-4 border-[#DC2626]">
            <div className="flex items-center justify-between text-xs text-[#E4E4E7]">
              <span className="flex items-center gap-1.5 font-bold">
                <Package className="w-4 h-4 text-[#F87171]" />
                {tierLabel}
              </span>
              <span className="font-mono font-bold text-[#F87171]">
                {formatTZS(effectiveUnitPrice)} / unit
              </span>
            </div>

            <div className="border-t border-white/15 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-[#E4E4E7]">
                <span>Gross Factory Price ({cartons} cartons)</span>
                <span className="font-mono font-bold text-white">{formatTZS(grossSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#4ADE80] font-bold">
                  <span>Volume Tier Savings ({Math.round(discountRate * 100)}%)</span>
                  <span className="font-mono">- {formatTZS(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#E4E4E7]">
                <span>Estimated Regional Freight</span>
                <span className="font-mono font-bold text-white">
                  {estimatedShipping === 0 ? 'FREE (Mbeya)' : formatTZS(estimatedShipping)}
                </span>
              </div>
            </div>

            <div className="border-t border-white/15 pt-4 flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#E4E4E7] font-bold block">
                  Estimated Proforma Total
                </span>
                <span className="text-[11px] text-[#D4D4D8] flex items-center gap-1 mt-0.5 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-[#4ADE80]" /> Includes TRA EFD Tax Invoice
                </span>
              </div>
              <span className="font-display text-2xl sm:text-3xl font-bold text-white font-mono">
                {formatTZS(grandTotal)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleRequestProforma}
              className="flex-1 py-4 px-6 rounded-[4px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              Request Proforma on WhatsApp ({whatsappDisplay})
            </button>
            <button
              onClick={onClose}
              className="py-4 px-6 rounded-[4px] border border-[#D4D2CD] bg-white font-bold text-xs uppercase tracking-wider text-charcoal-ink hover:bg-paper-base transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WholesaleCalculatorModal;

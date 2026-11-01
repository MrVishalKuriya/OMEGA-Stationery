import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { SEOHead } from '@/components/SEOHead';
import { WholesaleHero } from '../components/WholesaleHero';
import { WholesaleVolumeTiers } from '../components/WholesaleVolumeTiers';
import { WholesaleCalculator } from '../components/WholesaleCalculator';
import { WholesaleCatalogView } from '../components/WholesaleCatalogView';
import { WholesaleInquiryForm } from '../components/WholesaleInquiryForm';
import { WholesaleLogisticsStrip } from '../components/WholesaleLogisticsStrip';

export const WholesalePage: React.FC = () => {
  const { products, storeConfig, language, addToCart } = useStore();
  const currency = storeConfig.currencySymbol || 'TSh';
  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');

  const [selectedTier, setSelectedTier] = useState<string>('20 — 49 Cartons (30% OFF - Most Popular)');

  // Dynamic products lookup for wholesale carton specs
  const q2Prod = useMemo(() => products.find((p) => p.sku === 'OMG-CB-Q2' || p.id === 'prod-omega-cb-q2' || p.name.includes('Q2')), [products]);
  const q3Prod = useMemo(() => products.find((p) => p.sku === 'OMG-CB-Q3' || p.id === 'prod-omega-cb-q3' || p.name.includes('Q3')), [products]);
  const q4Prod = useMemo(() => products.find((p) => p.sku === 'OMG-CB-Q4' || p.id === 'prod-omega-cb-q4' || p.name.includes('Q4')), [products]);
  const ex200Prod = useMemo(() => products.find((p) => p.sku === 'OMG-EX-200SL' || p.id === 'prod-omega-ex-200sl' || p.name.includes('200 Pages')), [products]);
  const bahashaProd = useMemo(() => products.find((p) => p.sku === 'OMG-BAHASHA-A4' || p.id === 'prod-omega-bahasha-a4' || p.name.includes('Bahasha')), [products]);

  // Calculator Models dynamically populated from live MongoDB products
  const cartonSpecs = useMemo(() => ({
    q2: {
      label: q2Prod?.name || 'Counter Book 2 Quire (192p)',
      pcsPerBox: q2Prod?.wholesaleMinQty || 48,
      baseCarton: q2Prod?.wholesalePrice || 56000,
      unitMSRP: q2Prod?.price || 5800,
      boxWeight: '14.5 kg',
      packaging: q2Prod?.packaging || 'Stiff Board · 48 Pcs / Strapped Box',
    },
    q3: {
      label: q3Prod?.name || 'Counter Book 3 Quire (288p)',
      pcsPerBox: q3Prod?.wholesaleMinQty || 36,
      baseCarton: q3Prod?.wholesalePrice || 57000,
      unitMSRP: q3Prod?.price || 7500,
      boxWeight: '16.0 kg',
      packaging: q3Prod?.packaging || 'Stiff Board · 36 Pcs / Strapped Box',
    },
    q4: {
      label: q4Prod?.name || 'Counter Book 4 Quire (384p)',
      pcsPerBox: q4Prod?.wholesaleMinQty || 24,
      baseCarton: q4Prod?.wholesalePrice || 60000,
      unitMSRP: q4Prod?.price || 9500,
      boxWeight: '15.2 kg',
      packaging: q4Prod?.packaging || 'Stiff Board · 24 Pcs / Strapped Box',
    },
    ex200: {
      label: ex200Prod?.name || 'School Exercise Book 200 Pages',
      pcsPerBox: ex200Prod?.wholesaleMinQty || 72,
      baseCarton: ex200Prod?.wholesalePrice || 68000,
      unitMSRP: ex200Prod?.price || 2200,
      boxWeight: '18.0 kg',
      packaging: ex200Prod?.packaging || 'Shrink-Wrapped · 72 Pcs / Box',
    },
    bahasha: {
      label: bahashaProd?.name || 'Heavy Kraft Bahasha Envelopes A4',
      pcsPerBox: bahashaProd?.wholesaleMinQty || 250,
      baseCarton: bahashaProd?.wholesalePrice || 28000,
      unitMSRP: bahashaProd?.price || 600,
      boxWeight: '8.5 kg',
      packaging: bahashaProd?.packaging || 'Reinforced Carton · 250 Pcs',
    },
  }), [q2Prod, q3Prod, q4Prod, ex200Prod, bahashaProd]);

  const handleExportCSV = () => {
    const headers = [
      'SKU',
      'Product Name',
      'Category',
      'Retail MSRP (TSh)',
      'Wholesale Price (TSh)',
      'Wholesale Margin %',
      'Min Order Qty',
      'Packaging',
      'Stock Status',
    ];
    const rows = products.map((p) => {
      const wholesaleP = p.wholesalePrice || Math.round(p.price * 0.7);
      const marginPct = Math.round(((p.price - wholesaleP) / p.price) * 100);
      const minQty =
        p.wholesaleMinQty ||
        (p.category === 'Counter Books' ? '1 Carton (24-48 Pcs)' : '50 Pcs');
      const packaging = p.packaging || 'Standard Factory Box';
      return [
        `"${p.sku}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        p.price,
        wholesaleP,
        `"${marginPct}%"`,
        `"${minQty}"`,
        `"${packaging}"`,
        `"${p.stockStatus}"`,
      ].join(',');
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `OMEGA_Indigo_Printed_PriceList_PL00001_2026.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#F9F8F6] min-h-screen font-sans text-[#111113]">
      <SEOHead
        title="Wholesale Stationery & School Tenders | OMEGA Tanzania Factory Direct"
        description="Buy genuine OMEGA Counter Books, Exercise Books, and Kraft Envelopes at wholesale carton prices direct from our Soweto SIDO factory in Mbeya. Daily parcel dispatch across Tanzania."
      />

      {/* 1. Hero Section */}
      <WholesaleHero
        language={language}
        cleanWhatsappDigits={cleanWhatsappDigits}
        onExportCSV={handleExportCSV}
      />

      {/* 2. Transparent Volume Discount Tiers */}
      <WholesaleVolumeTiers
        onSelectTier={(tier) => setSelectedTier(tier)}
      />

      {/* 3. Interactive Wholesale Calculator */}
      <WholesaleCalculator
        cartonSpecs={cartonSpecs}
        currency={currency}
        cleanWhatsappDigits={cleanWhatsappDigits}
      />

      {/* 4. Wholesale Master Catalog (Table / Grid) */}
      <WholesaleCatalogView
        products={products}
        currency={currency}
        cleanWhatsappDigits={cleanWhatsappDigits}
        onAddToCart={addToCart}
        onExportCSV={handleExportCSV}
      />

      {/* 5. Direct Factory Proforma Desk Form */}
      <WholesaleInquiryForm
        cleanWhatsappDigits={cleanWhatsappDigits}
        selectedTierQuantity={selectedTier}
      />

      {/* 6. Factory Logistics & Dispatch Information */}
      <WholesaleLogisticsStrip />
    </div>
  );
};
export default WholesalePage;

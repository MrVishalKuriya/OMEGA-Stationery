import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  Phone,
  MessageCircle,
  Truck,
  ShieldCheck,
  Percent,
  Download,
  Search,
  ArrowRight,
  Sparkles,
  Building2,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  Clock,
  MapPin,
  Check,
  Grid,
  List,
  TrendingUp,
  Calculator,
  Send,
  FileText,
  SlidersHorizontal,
  ShoppingBag,
  Eye,
  Copy,
  BadgeCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SEOHead } from '../components/SEOHead';
import { formatPrice, Product } from '../types/store';
import { ProductCard } from '../components/ProductCard';

export const WholesalePage: React.FC = () => {
  const { products, storeConfig, language, addToCart } = useStore();
  const currency = storeConfig.currencySymbol || 'TSh';

  // Calculator State
  const [calcQuire, setCalcQuire] = useState<'q2' | 'q3' | 'q4' | 'ex200' | 'bahasha'>('q2');
  const [calcCartons, setCalcCartons] = useState<number>(20);

  // View Mode for Wholesale Catalog (Table vs Grid)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Table Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Inquiry Form State
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    productType: 'Counter Books (Q2, Q3, Q4)',
    quantityRange: '20 — 49 Cartons (30% OFF - Most Popular)',
    notes: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [inquiryRefId, setInquiryRefId] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  // Calculator Models with realistic Carton Specs & Resale Economics
  const cartonSpecs = {
    q2: {
      label: 'Counter Book 2 Quire (192p)',
      pcsPerBox: 48,
      baseCarton: 56000,
      unitMSRP: 5800,
      boxWeight: '14.5 kg',
      packaging: 'Stiff Board · 48 Pcs / Strapped Box',
    },
    q3: {
      label: 'Counter Book 3 Quire (288p)',
      pcsPerBox: 36,
      baseCarton: 57000,
      unitMSRP: 7500,
      boxWeight: '16.0 kg',
      packaging: 'Stiff Board · 36 Pcs / Strapped Box',
    },
    q4: {
      label: 'Counter Book 4 Quire (384p)',
      pcsPerBox: 24,
      baseCarton: 60000,
      unitMSRP: 9500,
      boxWeight: '15.2 kg',
      packaging: 'Stiff Board · 24 Pcs / Strapped Box',
    },
    ex200: {
      label: 'School Exercise Book 200 Pages',
      pcsPerBox: 72,
      baseCarton: 48000,
      unitMSRP: 2200,
      boxWeight: '18.0 kg',
      packaging: 'Shrink-Wrapped · 72 Pcs / Box',
    },
    bahasha: {
      label: 'Heavy Kraft Bahasha Envelopes A4',
      pcsPerBox: 250,
      baseCarton: 55000,
      unitMSRP: 600,
      boxWeight: '8.5 kg',
      packaging: 'Reinforced Carton · 250 Pcs',
    },
  };

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

  // Filtered Products for Wholesale Table / Grid
  const wholesaleProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      const matchesStock = !inStockOnly || p.stockStatus === 'In Stock';
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, selectedCategory, inStockOnly]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }, [products]);

  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRef = `OMG-WS-${Math.floor(100000 + Math.random() * 900000)}`;
    setInquiryRefId(newRef);
    setFormSubmitted(true);
  };

  const copyInquiryRef = () => {
    navigator.clipboard.writeText(inquiryRefId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const getFormWhatsappUrl = () => {
    const text =
      `*OMEGA FACTORY WHOLESALE PROFORMA INQUIRY*\n` +
      `Reference: ${inquiryRefId}\n` +
      `Business / Institution: ${formData.businessName}\n` +
      `Contact Person: ${formData.contactPerson}\n` +
      `Phone: ${formData.phone}\n` +
      `Email: ${formData.email}\n` +
      `Region / City: ${formData.city}\n` +
      `Product Line: ${formData.productType}\n` +
      `Carton Volume: ${formData.quantityRange}\n` +
      (formData.notes ? `Special Notes: ${formData.notes}\n` : '') +
      `\nPlease send official proforma invoice and dispatch waybill estimate.`;
    return `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(text)}`;
  };

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
      `OMEGA_Tanzania_Wholesale_Master_Pricelist_2026.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#faf9f8] min-h-screen font-sans text-[#2b2520]">
      <SEOHead
        title="Wholesale Stationery & School Tenders | OMEGA Tanzania Factory Direct"
        description="Buy genuine OMEGA Counter Books, Exercise Books, and Kraft Envelopes at wholesale carton prices direct from our Soweto SIDO factory in Mbeya. Daily parcel dispatch across Tanzania."
      />

      {/* ==================== 1. WHOLESALE HERO ==================== */}
      <section className="relative overflow-hidden w-full bg-[#3b352f] text-white py-16 lg:py-24 border-b border-[#2b2520] shadow-2xl">
        {/* Soft Ambient Warm Glows */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#c49b7c]/18 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-[#a46b44]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Refined Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 shadow-sm">
            <Building2 className="w-4 h-4 text-[#c49b7c]" />
            <span className="text-xs font-semibold tracking-wider text-stone-200 uppercase">
              Factory Direct Wholesale · SIDO Industrial Estate, Mbeya
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight max-w-4xl mx-auto mb-5">
            {language === 'sw' ? 'Mauzo ya Jumla & Oda Kubwa' : 'Wholesale Stationery & School Tenders'}{' '}
            <br />
            <span className="font-bold text-[#c49b7c] bg-gradient-to-r from-[#e3bf9e] via-[#c49b7c] to-[#e3bf9e] bg-clip-text text-transparent">
              {language === 'sw' ? 'Moja kwa Moja Kiwandani.' : 'Direct From Manufacturer.'}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            {language === 'sw'
              ? 'Pata bei bora za jumla kwa madaftari ya OMEGA: Hardcover Counter Books (Q2, Q3, Q4), Madaftari ya shule kurasa 32–200, na Bahasha nzito za Kraft. Usafirishaji wa haraka Tanzania nzima.'
              : 'Direct factory pricing with up to 40% margin for schools, colleges, bookstores, and regional tenders. Official TRA EFD tax invoices and dependable upcountry bus cargo dispatch.'}
          </p>

          {/* Quick-Trust Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10 text-left">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <Truck className="w-5 h-5 text-[#c49b7c] shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">24–48h Dispatch</div>
                <div className="text-[11px] text-stone-400">Bus parcel waybill</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <Percent className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">20% to 40% Margins</div>
                <div className="text-[11px] text-stone-400">Volume tiered discounts</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <BadgeCheck className="w-5 h-5 text-[#c49b7c] shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">TRA EFD Invoices</div>
                <div className="text-[11px] text-stone-400">Official tax compliance</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">100% OMEGA Genuine</div>
                <div className="text-[11px] text-stone-400">70 GSM bleed-proof paper</div>
              </div>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="#calculator"
              className="btn-ledup-copper group px-7 py-3.5 rounded-full text-xs sm:text-sm uppercase tracking-wider font-bold inline-flex items-center gap-2 shadow-lg min-h-[48px] active:scale-95"
            >
              <Calculator className="w-4 h-4 text-white" />
              <span>Calculate Carton Savings</span>
              <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                'Hello OMEGA Tanzania, I would like to inquire about wholesale prices and carton availability for bulk ordering.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 min-h-[48px] active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Wholesale Desk</span>
            </a>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/15 text-stone-200 border border-white/15 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 min-h-[48px] active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#c49b7c]" />
              <span>Download CSV Price List</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== 2. PRICING TIERS SECTION ==================== */}
      <section className="py-16 lg:py-22 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#4b423b]">
            <Percent className="w-4 h-4 text-[#c49b7c]" />
            <span>TRANSPARENT VOLUME ARCHITECTURE</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#2b2520] tracking-tight">
            Wholesale Discount Tiers
          </h2>
          <p className="text-sm text-stone-600 max-w-lg mx-auto">
            Higher carton volumes unlock direct factory savings with tamper-evident strapping and official EFD tax receipts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Tier 1: Starter */}
          <div className="bg-white p-7 sm:p-8 flex flex-col justify-between border border-stone-200 hover:border-[#c49b7c] rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-stone-100 text-[#4b423b]">
                  Starter Tier
                </span>
                <span className="text-xs font-semibold text-stone-600">5 — 19 Cartons</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#2b2520]">Retailers &amp; Kiosks</h3>
              <div className="my-5 pb-5 border-b border-stone-200">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-[#4b423b] font-mono">20%</span>
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
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantityRange: '5 — 19 Cartons (20% OFF)',
                  }))
                }
                className="w-full py-3.5 px-4 rounded-full border-2 border-[#4b423b] text-[#4b423b] hover:bg-[#4b423b] hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Select Starter Tier</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Tier 2: Business (Most Popular) */}
          <div className="relative bg-[#2d2520] text-white p-7 sm:p-8 flex flex-col justify-between border-2 border-[#c49b7c] rounded-2xl shadow-xl md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#c49b7c] text-white text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-3 h-3 text-white" />
              <span>MOST POPULAR · BEST VALUE</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-stone-200 border border-white/20">
                  Business Tier
                </span>
                <span className="text-xs font-semibold text-[#c49b7c]">20 — 49 Cartons</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-white">Schools &amp; Bookstores</h3>
              <div className="my-5 pb-5 border-b border-white/15">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-[#c49b7c] font-mono">30%</span>
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
                  <CheckCircle2 className="w-4 h-4 text-[#c49b7c] shrink-0 mt-0.5" />
                  <span>Min order: 20 Cartons (approx. 720 — 960 units)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c49b7c] shrink-0 mt-0.5" />
                  <span>Custom institution stamp &amp; school crest option</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c49b7c] shrink-0 mt-0.5" />
                  <span>Subsidized shipping allowance on bus freight cargo</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c49b7c] shrink-0 mt-0.5" />
                  <span>Priority factory loading with official EFD Tax Invoice</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <a
                href="#inquiry"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantityRange: '20 — 49 Cartons (30% OFF - Most Popular)',
                  }))
                }
                className="w-full py-3.5 px-4 rounded-full btn-ledup-copper group text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px] shadow-lg active:scale-95"
              >
                <span>Select Business Tier</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="bg-white p-7 sm:p-8 flex flex-col justify-between border border-stone-200 hover:border-[#c49b7c] rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-stone-100 text-[#4b423b]">
                  Enterprise Tier
                </span>
                <span className="text-xs font-semibold text-stone-600">50+ Cartons</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#2b2520]">Tenders &amp; Importers</h3>
              <div className="my-5 pb-5 border-b border-stone-200">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-[#4b423b] font-mono">40%</span>
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
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantityRange: '50 — 99 Cartons (40% OFF - Enterprise)',
                  }))
                }
                className="w-full py-3.5 px-4 rounded-full border-2 border-[#4b423b] text-[#4b423b] hover:bg-[#4b423b] hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Select Enterprise Tier</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. INTERACTIVE WHOLESALE CALCULATOR ==================== */}
      <section
        id="calculator"
        className="py-16 bg-[#2d2520] text-white border-y border-[#3b352f] scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-[#c49b7c] bg-white/10 border border-[#c49b7c]/30">
              <Calculator className="w-3.5 h-3.5 text-[#c49b7c]" />
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
                <label className="block text-xs font-bold uppercase tracking-wider text-[#c49b7c] mb-2.5">
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
                          ? 'bg-[#c49b7c] text-white border-transparent shadow-md'
                          : 'bg-[#2d2520] text-stone-200 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.title}</div>
                      <div className="text-[11px] opacity-80 mt-0.5 font-mono">{item.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Carton Quantity Controls (Slider + Quick Buttons + Input) */}
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#c49b7c]">
                    2. Select Carton Quantity:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={calcCartons}
                      onChange={(e) => setCalcCartons(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 px-2.5 py-1 text-right text-xs font-bold rounded-lg bg-[#2d2520] border border-white/20 text-white font-mono focus:outline-none focus:border-[#c49b7c]"
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
                  className="w-full accent-[#c49b7c] cursor-pointer mb-3"
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
                          ? 'bg-[#c49b7c] text-white border-transparent shadow-md'
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
            <div className="lg:col-span-5 bg-white text-[#2b2520] p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Calculated Summary
                  </span>
                  <h3 className="font-heading text-lg font-bold text-[#2b2520]">
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
                  <span className="font-bold text-[#2b2520]">{calcCartons} Cartons</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Total Individual Units:</span>
                  <span className="font-bold text-[#2b2520] font-mono">
                    {totalUnits.toLocaleString()} Books / Pcs
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Standard MSRP Value:</span>
                  <span className="font-mono line-through text-stone-400">
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
                    <span className="text-2xl font-black text-[#4b423b] font-mono">
                      {formatPrice(netTotal, currency)}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 text-right mt-0.5">
                    Unit Cost: <strong className="font-mono text-[#4b423b]">{formatPrice(costPerUnit, currency)}</strong> per book
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
                href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                  `*OMEGA WHOLESALE CALCULATOR ORDER*\n` +
                    `Product: ${currentCarton.label}\n` +
                    `Quantity: ${calcCartons} Cartons (${totalUnits.toLocaleString()} Units)\n` +
                    `Unit Cost: ${currency} ${costPerUnit.toLocaleString()}\n` +
                    `Tier Discount: ${Math.round(discountRate * 100)}% OFF\n` +
                    `Calculated Total: ${currency} ${netTotal.toLocaleString()}\n\n` +
                    `Please prepare formal proforma invoice and confirm dispatch schedule.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-full btn-ledup-copper group text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg min-h-[48px] active:scale-95 text-white"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Confirm Proforma on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. WHOLESALE PRODUCTS CATALOG ==================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#4b423b]">
              <Layers className="w-4 h-4 text-[#c49b7c]" />
              <span>OFFICIAL FACTORY PRICE SCHEDULE</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-[#2b2520] tracking-tight mt-1">
              Wholesale Master Catalog
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Transparent bulk pricing with clear carton specifications and minimum order quantities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher (Table vs Grid) */}
            <div className="flex items-center bg-white p-1 rounded-full border border-stone-200 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                aria-label="Table View"
                className={`p-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-[#4b423b] text-white shadow-xs'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid View"
                className={`p-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#4b423b] text-white shadow-xs'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-xs font-bold text-[#4b423b] inline-flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#c49b7c]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, SKU, or specs..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-stone-200 focus:outline-none focus:border-[#4b423b] bg-stone-50 text-[#2b2520] placeholder:text-stone-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#4b423b] text-white'
                    : 'bg-stone-50 text-stone-600 hover:text-black border border-stone-200'
                }`}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            ))}

            <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer pl-2 border-l border-stone-200 whitespace-nowrap">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5 text-[#4b423b] rounded focus:ring-0"
              />
              <span>In Stock</span>
            </label>
          </div>
        </div>

        {/* Listing Display */}
        {wholesaleProducts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500">
            <Package className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <p className="text-sm font-semibold">No wholesale products found matching your filter.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setInStockOnly(false);
              }}
              className="mt-3 text-xs font-bold text-[#4b423b] underline"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* ================= 1. TABLE VIEW ================= */
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#3b352f] text-white uppercase tracking-wider text-[11px] font-heading">
                    <th className="py-3.5 px-4 font-bold">Product</th>
                    <th className="py-3.5 px-4 font-bold">Category</th>
                    <th className="py-3.5 px-4 font-bold">Retail MSRP</th>
                    <th className="py-3.5 px-4 font-bold text-amber-200">Wholesale Price</th>
                    <th className="py-3.5 px-4 font-bold">Min Order</th>
                    <th className="py-3.5 px-4 font-bold">Margin</th>
                    <th className="py-3.5 px-4 font-bold text-center">Procurement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-[#2b2520]">
                  {wholesaleProducts.map((p) => {
                    const wholesalePrice = p.wholesalePrice || Math.round(p.price * 0.7);
                    const saving = p.price - wholesalePrice;
                    const savePct = Math.round((saving / p.price) * 100);
                    const minOrderQty =
                      p.wholesaleMinQty
                        ? `${p.wholesaleMinQty} Pcs`
                        : p.category === 'Counter Books'
                        ? '1 Carton'
                        : '50 Pcs';

                    const directWa = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                      `Hello OMEGA Tanzania, I want to place a wholesale order for: ${p.name} (SKU: ${p.sku}) - Wholesale Price: ${currency} ${wholesalePrice.toLocaleString()}. Please confirm availability.`
                    )}`;

                    return (
                      <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-medium">
                          <Link
                            to={`/product/${p.id}`}
                            className="flex items-center gap-3 group/item"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              loading="lazy"
                              className="w-12 h-12 object-contain rounded-lg bg-stone-50 p-1 border border-stone-200 shrink-0"
                            />
                            <div>
                              <span className="font-bold block text-sm group-hover/item:text-[#c49b7c] transition-colors line-clamp-1">
                                {p.name}
                              </span>
                              <span className="text-[11px] text-stone-500 font-mono">
                                SKU: {p.sku} {p.packaging ? `· ${p.packaging}` : ''}
                              </span>
                            </div>
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-stone-600 font-medium whitespace-nowrap">
                          {p.category}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-stone-400 line-through whitespace-nowrap">
                          {formatPrice(p.price, currency)}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-black text-sm text-emerald-700 whitespace-nowrap">
                          {formatPrice(wholesalePrice, currency)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#4b423b] whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px]">
                            {minOrderQty}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            {savePct}% OFF
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <a
                              href={directWa}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-1.5 px-3 rounded-full bg-[#4b423b] text-white hover:bg-[#2b2520] transition-colors text-xs font-bold inline-flex items-center gap-1 shadow-xs"
                              title="Order Carton on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>Order</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => addToCart(p.id, 1, true)}
                              className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[#4b423b] border border-stone-200 transition-colors shadow-xs"
                              title="Add to cart / bag"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ================= 2. GRID VIEW (Product Cards) ================= */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {wholesaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ==================== 5. INQUIRY FORM SECTION ==================== */}
      <section className="py-16 bg-white border-t border-stone-200" id="inquiry">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#4b423b]">
              <Building2 className="w-4 h-4 text-[#c49b7c]" />
              <span>DIRECT FACTORY PROFORMA DESK</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-[#2b2520] tracking-tight">
              Request Official Wholesale Proforma Quote
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
              Submit your school, institution, or commercial order. Our sales desk in Soweto SIDO issues stamped proformas within 4 business hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-[#faf9f8] rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              {formSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-[#2b2520]">
                    Wholesale Inquiry Dispatched!
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                    Your reference number is{' '}
                    <strong className="font-mono text-[#4b423b]">{inquiryRefId}</strong>. A dedicated wholesale manager from our Soweto SIDO factory desk is reviewing your requirements.
                  </p>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={copyInquiryRef}
                      className="px-4 py-2 rounded-full border border-stone-300 text-xs font-bold text-[#4b423b] inline-flex items-center gap-1.5 hover:bg-stone-100"
                    >
                      {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRef ? 'Copied Ref!' : 'Copy Reference ID'}</span>
                    </button>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={getFormWhatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ledup-mocha group px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Send to Factory on WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({
                          businessName: '',
                          contactPerson: '',
                          email: '',
                          phone: '',
                          city: '',
                          productType: 'Counter Books (Q2, Q3, Q4)',
                          quantityRange: '20 — 49 Cartons (30% OFF - Most Popular)',
                          notes: '',
                        });
                      }}
                      className="px-6 py-3 rounded-full border border-stone-300 text-xs font-bold text-[#4b423b] hover:bg-white"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider mb-1.5">
                        Business or School Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g. Mbeya High School / Alpha Stationery"
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#2b2520] focus:outline-none focus:border-[#4b423b]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider mb-1.5">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        placeholder="Headmaster / Procurement Officer"
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#2b2520] focus:outline-none focus:border-[#4b423b]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider mb-1.5">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="procurement@institution.ac.tz"
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#2b2520] focus:outline-none focus:border-[#4b423b]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+255 7XX XXX XXX"
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#2b2520] focus:outline-none focus:border-[#4b423b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider mb-1.5">
                      Destination City / Region in Tanzania *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Dar es Salaam, Dodoma, Arusha, Mwanza, Mbeya, Morogoro"
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#2b2520] focus:outline-none focus:border-[#4b423b]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider mb-1.5">
                        Product Category
                      </label>
                      <select
                        value={formData.productType}
                        onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#2b2520] focus:outline-none focus:border-[#4b423b]"
                      >
                        <option>Counter Books (Q2, Q3, Q4)</option>
                        <option>School Exercise Books (32–200 Pages)</option>
                        <option>Kraft Bahasha Envelopes (A3, A4, A5)</option>
                        <option>Registers &amp; Examination Ruled Paper</option>
                        <option>Office Files &amp; Manila Folders</option>
                        <option>Mixed Full Catalog Wholesale Consignment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider mb-1.5">
                        Estimated Volume
                      </label>
                      <select
                        value={formData.quantityRange}
                        onChange={(e) => setFormData({ ...formData, quantityRange: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#2b2520] focus:outline-none focus:border-[#4b423b]"
                      >
                        <option>5 — 19 Cartons (20% OFF)</option>
                        <option>20 — 49 Cartons (30% OFF - Most Popular)</option>
                        <option>50 — 99 Cartons (40% OFF - Enterprise)</option>
                        <option>100+ Cartons (Commercial Tender Pricing)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2b2520] uppercase tracking-wider mb-1.5">
                      Special Requirements / Delivery Deadlines
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Custom school logo stamping, preferred bus parcel agency (Tahmeed, Shabiby, Abood), required delivery date, etc."
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#2b2520] focus:outline-none focus:border-[#4b423b]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-full btn-ledup-mocha group text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg min-h-[48px]"
                    >
                      <span>Submit Proforma Request →</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Live Sidebar Guarantee Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#3b352f] text-white rounded-2xl p-6 sm:p-7 shadow-lg space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                  <ShieldCheck className="w-5 h-5 text-[#c49b7c]" />
                  <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                    Factory Procurement Guarantees
                  </h4>
                </div>

                <ul className="space-y-3 text-xs text-stone-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#c49b7c] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">EFD Fiscal Receipt:</strong> Every wholesale consignment includes a genuine TRA electronic fiscal receipt.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#c49b7c] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Tamper-Proof Strapping:</strong> High-tensile plastic band strapping and waterproof inner lining.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#c49b7c] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Bus Waybill Terminal:</strong> Same-day dispatch to regional bus terminals in Mbeya with live waybill tracking.
                    </span>
                  </li>
                </ul>

                <div className="pt-3 border-t border-white/10">
                  <div className="text-[11px] text-stone-400">Direct Wholesale Hotlines:</div>
                  <div className="text-xs font-mono font-bold text-[#c49b7c] mt-1 space-y-0.5">
                    <div>+255 746 268 391 (Sales Desk 1)</div>
                    <div>+255 624 265 480 (Wholesale Desk 2)</div>
                    <div>+255 689 032 777 (Institutional Tenders)</div>
                  </div>
                </div>
              </div>

              {/* Regional Transit Timelines */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4b423b]" />
                  <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#2b2520]">
                    Estimated Delivery Timelines
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="font-bold text-[#2b2520] block">Dar es Salaam</span>
                    <span className="text-[11px] text-stone-500">24 — 36 Hours</span>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="font-bold text-[#2b2520] block">Dodoma &amp; Singida</span>
                    <span className="text-[11px] text-stone-500">24 Hours</span>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="font-bold text-[#2b2520] block">Arusha &amp; Moshi</span>
                    <span className="text-[11px] text-stone-500">36 Hours</span>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="font-bold text-[#2b2520] block">Mwanza &amp; Lake Zone</span>
                    <span className="text-[11px] text-stone-500">36 — 48 Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. FACTORY GUARANTEE & LOCATION STRIP ==================== */}
      <section className="bg-stone-100 py-12 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
              <MapPin className="w-6 h-6 text-[#4b423b] mx-auto" />
              <h4 className="font-heading text-sm font-bold text-[#2b2520]">Soweto SIDO Viwandani</h4>
              <p className="text-xs text-stone-600">
                Central Factory &amp; Warehouse in Mbeya, Tanzania with regional bus freight terminal access.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
              <Phone className="w-6 h-6 text-[#4b423b] mx-auto" />
              <h4 className="font-heading text-sm font-bold text-[#2b2520]">3 Dedicated Desks</h4>
              <p className="text-xs text-stone-600 font-mono">
                +255 746 268 391 · +255 624 265 480 · +255 689 032 777
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#4b423b] mx-auto" />
              <h4 className="font-heading text-sm font-bold text-[#2b2520]">100% Genuine OMEGA</h4>
              <p className="text-xs text-stone-600">
                TBS standard compliance, reinforced thread-sewn bindings &amp; 70 GSM paper guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

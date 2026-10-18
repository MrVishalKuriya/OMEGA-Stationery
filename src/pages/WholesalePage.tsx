import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ArrowUpRight,
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
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SEOHead } from '../components/SEOHead';
import { formatPrice, Product } from '../types/store';

export const WholesalePage: React.FC = () => {
  const { products, storeConfig, language, addToCart } = useStore();
  const currency = storeConfig.currencySymbol || 'TSh';

  // Calculator State
  const [calcQuire, setCalcQuire] = useState<'q2' | 'q3' | 'q4'>('q2');
  const [calcCartons, setCalcCartons] = useState<number>(10);

  // Table Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Inquiry Form State
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    productType: 'Counter Books (Q2, Q3, Q4)',
    quantityRange: '20 — 49 Cartons (30% OFF)',
    notes: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [inquiryRefId, setInquiryRefId] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Calculator rates
  const cartonSpecs = {
    q2: { label: 'Counter Book 2 Quire (198p)', pcsPerBox: 48, baseCarton: 56000, unitMSRP: 5800 },
    q3: { label: 'Counter Book 3 Quire (288p)', pcsPerBox: 36, baseCarton: 57000, unitMSRP: 7500 },
    q4: { label: 'Counter Book 4 Quire (384p)', pcsPerBox: 24, baseCarton: 60000, unitMSRP: 9500 },
  };

  const currentCarton = cartonSpecs[calcQuire];
  const discountRate = calcCartons >= 50 ? 0.4 : calcCartons >= 20 ? 0.3 : calcCartons >= 5 ? 0.2 : 0.1;
  const grossTotal = currentCarton.baseCarton * calcCartons;
  const savingsAmount = Math.round(grossTotal * discountRate);
  const netTotal = grossTotal - savingsAmount;
  const totalBooks = calcCartons * currentCarton.pcsPerBox;

  // Filtered Products for Wholesale Table
  const wholesaleProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

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

  const getFormWhatsappUrl = () => {
    const text =
      `*OMEGA FACTORY WHOLESALE PROFORMA INQUIRY*\n` +
      `Reference: ${inquiryRefId}\n` +
      `Business / School: ${formData.businessName}\n` +
      `Contact Person: ${formData.contactPerson}\n` +
      `Phone: ${formData.phone}\n` +
      `Email: ${formData.email}\n` +
      `Location: ${formData.city}\n` +
      `Products: ${formData.productType}\n` +
      `Estimated Volume: ${formData.quantityRange}\n` +
      (formData.notes ? `Requirements: ${formData.notes}\n` : '') +
      `\nPlease send official proforma invoice and dispatch waybill estimate.`;
    return `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(text)}`;
  };

  const handleExportCSV = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Retail MSRP (TSh)', 'Wholesale Price (TSh)', 'Min Order Qty', 'Packaging'];
    const rows = products.map((p) => {
      const wholesaleP = p.wholesalePrice || Math.round(p.price * 0.7);
      const minQty = p.wholesaleMinQty || (p.category === 'Counter Books' ? '1 Carton (24-48 Pcs)' : '50 Pcs');
      const packaging = p.packaging || 'Standard Factory Box';
      return [
        `"${p.sku}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        p.price,
        wholesaleP,
        `"${minQty}"`,
        `"${packaging}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OMEGA_Tanzania_Wholesale_Price_List_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans text-[#3b352f]">
      <SEOHead
        title="Wholesale & Bulk Orders | Factory Direct Pricing | OMEGA Tanzania"
        description="Buy OMEGA Counter Books, Exercise Books, and Kraft Bahasha envelopes in bulk at factory-direct wholesale prices. Perfect for schools, institutions, and distributors across Tanzania."
      />

      {/* ==================== 1. WHOLESALE HERO (Rustic Charm #4b423b) ==================== */}
      <section className="relative overflow-hidden w-full bg-[#4b423b] text-white py-16 lg:py-24 border-b border-[#e2dedb]/30 ledup-rounded-hero-bottom shadow-2xl">
        {/* Soft Ambient Warm Glows */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#c49b7c]/25 rounded-full blur-[140px] pointer-events-none animate-ledup-ambient" />
        <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-[#a69d98]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#e2dedb]/40 backdrop-blur-md mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#e2dedb] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#fafafa]">
              [ FACTORY DIRECT PRICES // SIDO INDUSTRIAL MBEYA ]
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight max-w-4xl mx-auto mb-4">
            {language === 'sw' ? 'Mauzo ya Jumla & Oda Kubwa' : 'Wholesale & Bulk Orders'} <br />
            <span className="font-bold text-[#fafafa] bg-gradient-to-r from-white via-[#e2dedb] to-white bg-clip-text text-transparent">
              {language === 'sw' ? 'Moja kwa Moja Kiwandani.' : 'Direct From Manufacturer.'}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#fafafa]/90 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            {language === 'sw'
              ? 'Pata bei bora za jumla moja kwa moja kutoka kiwanda chetu cha Mbeya. Punguzo maalum kwa shule, vyuo, ofisi, wauzaji wa rejareja na wasambazaji wa mikoani kote Tanzania.'
              : 'Unlock tiered wholesale carton discounts on genuine OMEGA thread-sewn Counter Books, Exercise Books, and Kraft Bahasha. Direct regional bus parcel waybill dispatch across Tanzania.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="#inquiry"
              className="btn-ledup-copper group px-8 py-4 rounded-full text-xs sm:text-sm uppercase tracking-wider font-bold inline-flex items-center gap-2 shadow-lg min-h-[48px] active:scale-95"
            >
              <span>Get Wholesale Quote</span>
              <ArrowRight className="w-4 h-4 text-white ledup-arrow-icon" />
            </a>

            <a
              href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                'Hello OMEGA Tanzania, I would like to inquire about wholesale prices and carton availability for bulk ordering.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-[#e2dedb]/40 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 min-h-[48px] active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Wholesale Desk</span>
            </a>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-6 py-4 rounded-full bg-white/5 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 min-h-[48px] active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#e2dedb]" />
              <span>Export Price List (CSV)</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== 2. PRICING TIERS SECTION (Indranotebook 3-Tier Model) ==================== */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#4b423b]">
            <Percent className="w-4 h-4 text-[#c49b7c]" />
            <span>VOLUME-BASED DISCOUNT ARCHITECTURE</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#3b352f] tracking-tight">
            Wholesale Pricing Tiers
          </h2>
          <p className="text-sm text-[#c49b7c] max-w-lg mx-auto">
            Higher carton volumes unlock higher factory margins. Standardized packaging with tamper-evident strapping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Tier 1: Starter */}
          <div className="ledup-card ledup-sheen bg-white p-7 sm:p-8 flex flex-col justify-between border border-[#e2dedb] hover:border-[#c49b7c] rounded-[20px] shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#fafafa] text-[#4b423b] border border-[#e2dedb]">
                  Starter Tier
                </span>
                <span className="text-xs font-semibold text-[#c49b7c]">5 — 19 Cartons</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#3b352f]">Retailer / Small School</h3>
              <div className="my-5 pb-5 border-b border-[#e2dedb]">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#4b423b] font-mono">20%</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#c49b7c]">OFF Retail MRP</span>
                </div>
                <span className="text-xs text-[#c49b7c] mt-1 block">Ideal for local stationery kiosks &amp; day schools</span>
              </div>
              <ul className="space-y-3 text-xs text-[#3b352f]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <span>Min order: 5 Cartons (approx. 180 — 240 units)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <span>Mixed product varieties allowed in single consignment</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <span>Factory-sealed heavy kraft protective boxes</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <span>Upcountry bus parcel waybill delivery (Arusha, Mwanza, etc.)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <span>24 — 48 hour dispatch guarantee from Mbeya</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <a
                href="#inquiry"
                onClick={() => setFormData((prev) => ({ ...prev, quantityRange: '5 — 19 Cartons (20% OFF)' }))}
                className="w-full py-3.5 px-4 rounded-full btn-rustic-outline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Select Starter Quote</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Tier 2: Business (Most Popular) */}
          <div className="relative ledup-card ledup-sheen bg-[#5D4037] text-white p-7 sm:p-8 flex flex-col justify-between border-2 border-[#c49b7c] rounded-[20px] shadow-xl md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#c49b7c] text-white text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-white" />
              <span>MOST POPULAR · BEST VALUE</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-[#e2dedb] border border-white/20">
                  Business Tier
                </span>
                <span className="text-xs font-semibold text-[#e2dedb]">20 — 49 Cartons</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-white">Schools &amp; Wholesalers</h3>
              <div className="my-5 pb-5 border-b border-white/15">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#e2dedb] font-mono">30%</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-white">OFF Retail MRP</span>
                </div>
                <span className="text-xs text-stone-200 mt-1 block">Best for secondary schools, colleges, and regional stockists</span>
              </div>
              <ul className="space-y-3 text-xs text-[#fafafa]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Min order: 20 Cartons (approx. 720 — 960 units)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Custom institution stamp &amp; school logo stamping available</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Branded OMEGA heavy-duty reinforced shipping cartons</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Subsidized shipping allowance to Dar es Salaam &amp; Dodoma</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Priority factory loading with official EFD Tax Invoice</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <a
                href="#inquiry"
                onClick={() => setFormData((prev) => ({ ...prev, quantityRange: '20 — 49 Cartons (30% OFF)' }))}
                className="w-full py-3.5 px-4 rounded-full btn-ledup-copper group text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px] shadow-lg active:scale-95"
              >
                <span>Select Business Quote</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="ledup-card ledup-sheen bg-white p-7 sm:p-8 flex flex-col justify-between border border-[#e2dedb] hover:border-[#c49b7c] rounded-[20px] shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#fafafa] text-[#4b423b] border border-[#e2dedb]">
                  Enterprise Tier
                </span>
                <span className="text-xs font-semibold text-[#c49b7c]">50+ Cartons</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#3b352f]">Tenders &amp; Distributors</h3>
              <div className="my-5 pb-5 border-b border-[#e2dedb]">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#4b423b] font-mono">40%</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#c49b7c]">OFF Retail MRP</span>
                </div>
                <span className="text-xs text-[#c49b7c] mt-1 block">Tailored for government bids, university bookstores, and regional importers</span>
              </div>
              <ul className="space-y-3 text-xs text-[#3b352f]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <span>Min order: 50 Cartons (1,200 — 2,400+ units)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <span>Full bespoke cover printing, school crest &amp; custom ruling lines</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <span>Dedicated corporate key account manager &amp; WhatsApp line</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <span>100% Transit insurance coverage on long-distance logistics</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <span>Staged quarterly delivery schedules &amp; wholesale credit options</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <a
                href="#inquiry"
                onClick={() => setFormData((prev) => ({ ...prev, quantityRange: '50+ Cartons (40% OFF)' }))}
                className="w-full py-3.5 px-4 rounded-full btn-rustic-outline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Select Enterprise Quote</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. INTERACTIVE WHOLESALE CALCULATOR ==================== */}
      <section className="py-14 bg-[#5D4037] text-white border-y border-[#e2dedb]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white bg-white/10 border border-[#e2dedb]/30">
                <Package className="w-3.5 h-3.5 text-[#e2dedb]" />
                <span>DYNAMIC PROFORMA ESTIMATOR</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight">
                Calculate Exact Carton Savings
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                Choose your Counter Book quire and carton quantity to see the immediate factory-direct proforma totals.
              </p>

              <div className="p-4 rounded-[16px] bg-[#3E2723] border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-stone-300">
                  <span>Selected Model:</span>
                  <span className="font-bold text-white">{currentCarton.label}</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Box Capacity:</span>
                  <span className="font-mono text-white">{currentCarton.pcsPerBox} Books / Carton</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Total Notebooks:</span>
                  <span className="font-mono text-emerald-400 font-bold">{totalBooks.toLocaleString()} Books</span>
                </div>
                <div className="flex justify-between text-stone-300 pt-2 border-t border-white/10">
                  <span>Standard Factory MSRP:</span>
                  <span className="line-through font-mono text-stone-400">{formatPrice(grossTotal, currency)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Volume Savings ({Math.round(discountRate * 100)}%):</span>
                  <span className="font-mono">- {formatPrice(savingsAmount, currency)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/15">
                  <span>Wholesale Total:</span>
                  <span className="text-[#e2dedb] text-xl font-mono">{formatPrice(netTotal, currency)}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#4E342E] p-6 sm:p-8 rounded-[20px] border border-[#e2dedb]/30 space-y-6 shadow-xl">
              {/* Step 1: Quire Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#e2dedb] mb-2">
                  1. Choose Counter Book Quire:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['q2', 'q3', 'q4'] as const).map((qKey) => (
                    <button
                      key={qKey}
                      type="button"
                      onClick={() => setCalcQuire(qKey)}
                      className={`p-3.5 rounded-[12px] border text-center transition-all ${
                        calcQuire === qKey
                          ? 'bg-[#c49b7c] text-white border-transparent shadow-md'
                          : 'bg-[#3E2723] text-stone-200 border-[#e2dedb]/20 hover:border-[#e2dedb]'
                      }`}
                    >
                      <div className="text-xs font-bold">{qKey.toUpperCase()} Folio</div>
                      <div className="text-[11px] text-[#e2dedb] mt-1 font-mono">
                        {qKey === 'q2' ? '198p · 48/Box' : qKey === 'q3' ? '288p · 36/Box' : '384p · 24/Box'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Carton Count */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#e2dedb]">
                    2. Select Cartons:
                  </label>
                  <span className="text-white font-mono text-sm font-bold">
                    {calcCartons} Cartons ({totalBooks} Units)
                  </span>
                </div>
                <div className="flex gap-2">
                  {[5, 10, 20, 35, 50, 100].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setCalcCartons(qty)}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-[10px] border transition-all font-mono ${
                        calcCartons === qty
                          ? 'bg-[#c49b7c] text-white border-transparent shadow-md'
                          : 'bg-[#3E2723] text-stone-300 border-[#e2dedb]/20 hover:border-white/40'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <a
                href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                  `*OMEGA WHOLESALE CALCULATOR ORDER*\n` +
                    `Product: ${currentCarton.label}\n` +
                    `Quantity: ${calcCartons} Cartons (${totalBooks} Units)\n` +
                    `Discount Tier: ${Math.round(discountRate * 100)}% OFF\n` +
                    `Calculated Total: ${currency} ${netTotal.toLocaleString()}\n\n` +
                    `Please prepare proforma invoice and confirm dispatch.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-4 rounded-full btn-ledup-copper group text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg min-h-[48px] active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Confirm Quote with Factory on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. WHOLESALE PRODUCTS CATALOG TABLE (From Indranotebook) ==================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#4b423b]">
              <Layers className="w-4 h-4 text-[#c49b7c]" />
              <span>OFFICIAL FACTORY PRICE SCHEDULE</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-[#3b352f] tracking-tight mt-1">
              Wholesale Master Catalog
            </h2>
            <p className="text-xs sm:text-sm text-[#c49b7c] mt-0.5">
              Transparent bulk pricing with clear carton specifications and minimum order requirements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-full border border-[#e2dedb] bg-white hover:bg-[#fafafa] text-xs font-bold text-[#4b423b] inline-flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#c49b7c]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white p-4 rounded-[16px] border border-[#e2dedb] shadow-sm mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#c49b7c] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by product name or SKU..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-[#e2dedb] focus:outline-none focus:border-[#4b423b] bg-[#fafafa]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#4b423b] text-white'
                    : 'bg-[#fafafa] text-[#c49b7c] hover:text-[#3b352f] border border-[#e2dedb]'
                }`}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="bg-white rounded-[20px] border border-[#e2dedb] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#5D4037] text-white uppercase tracking-wider text-[11px] font-heading">
                  <th className="py-3.5 px-4 font-bold">Product</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Retail MRP</th>
                  <th className="py-3.5 px-4 font-bold text-[#e2dedb]">Wholesale Price</th>
                  <th className="py-3.5 px-4 font-bold">Min Order</th>
                  <th className="py-3.5 px-4 font-bold">Savings</th>
                  <th className="py-3.5 px-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2dedb]/60 text-[#3b352f]">
                {wholesaleProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#c49b7c]">
                      No products found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  wholesaleProducts.map((p) => {
                    const wholesalePrice = p.wholesalePrice || Math.round(p.price * 0.7);
                    const saving = p.price - wholesalePrice;
                    const savePct = Math.round((saving / p.price) * 100);
                    const minOrderQty =
                      p.wholesaleMinQty ? `${p.wholesaleMinQty} Pcs` : p.category === 'Counter Books' ? '1 Carton' : '50 Pcs';

                    const directWa = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                      `Hello OMEGA Tanzania, I want to place a wholesale order for: ${p.name} (SKU: ${p.sku}) - Wholesale Price: ${currency} ${wholesalePrice.toLocaleString()}. Please confirm stock.`
                    )}`;

                    return (
                      <tr key={p.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="py-3 px-4 font-medium">
                          <Link
                            to={`/product/${p.id}`}
                            className="flex items-center gap-3 group/item hover:text-[#4b423b]"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 object-contain rounded bg-[#fafafa] p-1 border border-[#e2dedb] shrink-0"
                            />
                            <div>
                              <span className="font-bold block text-sm group-hover/item:text-[#4b423b] transition-colors">
                                {p.name}
                              </span>
                              <span className="text-[10px] text-[#c49b7c] font-mono">
                                SKU: {p.sku} {p.packaging ? `· ${p.packaging}` : ''}
                              </span>
                            </div>
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-[#c49b7c] font-medium">{p.category}</td>
                        <td className="py-3 px-4 font-mono font-medium text-[#c49b7c] line-through">
                          {formatPrice(p.price, currency)}
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-sm text-[#2E7D32]">
                          {formatPrice(wholesalePrice, currency)}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#4b423b]">
                          <span className="px-2 py-0.5 rounded-full bg-[#fafafa] border border-[#e2dedb]">
                            {minOrderQty}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-bold text-[#2E7D32] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            {savePct}% OFF
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <a
                              href={directWa}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-full bg-[#4b423b] text-white hover:bg-[#5D4037] transition-all shadow-xs"
                              title="Order on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            </a>
                            <button
                              type="button"
                              onClick={() => addToCart(p.id, 1, true)}
                              className="p-2 rounded-full bg-[#c49b7c] text-white hover:bg-[#795548] transition-all shadow-xs"
                              title="Add sample / carton to bag"
                            >
                              <Package className="w-3.5 h-3.5 text-white" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ==================== 5. INQUIRY FORM SECTION (From Indranotebook) ==================== */}
      <section className="py-16 bg-[#EFEBE9] border-t border-[#e2dedb]" id="inquiry">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#4b423b]">
              <Building2 className="w-4 h-4 text-[#c49b7c]" />
              <span>DIRECT PROFORMA REQUEST</span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-[#3b352f] tracking-tight">
              Wholesale Order Inquiry
            </h2>
            <p className="text-xs sm:text-sm text-[#c49b7c]">
              Fill out your institutional or retail details below. Our wholesale desk issues formal quotes within 4 business hours.
            </p>
          </div>

          <div className="bg-white rounded-[20px] p-6 sm:p-10 border border-[#e2dedb] shadow-xl">
            {formSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#3b352f]">
                  Wholesale Inquiry Received!
                </h3>
                <p className="text-xs sm:text-sm text-[#c49b7c] max-w-md mx-auto">
                  Your reference ID is <strong className="font-mono text-[#4b423b]">{inquiryRefId}</strong>. A dedicated wholesale manager from our Soweto SIDO factory desk is reviewing your requirements.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={getFormWhatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ledup-mocha group px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Send Directly via WhatsApp</span>
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
                        quantityRange: '20 — 49 Cartons (30% OFF)',
                        notes: '',
                      });
                    }}
                    className="px-6 py-3 rounded-full border border-[#e2dedb] text-xs font-bold text-[#4b423b] hover:bg-[#fafafa]"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3b352f] uppercase tracking-wider mb-1.5">
                      Business or School Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. Mbeya Secondary School / St. Mary Bookstore"
                      className="w-full px-4 py-3 rounded-[10px] text-xs bg-[#fafafa] border border-[#e2dedb] text-[#3b352f] focus:outline-none focus:border-[#4b423b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3b352f] uppercase tracking-wider mb-1.5">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="e.g. Headmaster / Procurement Officer"
                      className="w-full px-4 py-3 rounded-[10px] text-xs bg-[#fafafa] border border-[#e2dedb] text-[#3b352f] focus:outline-none focus:border-[#4b423b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3b352f] uppercase tracking-wider mb-1.5">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="procurement@school.ac.tz"
                      className="w-full px-4 py-3 rounded-[10px] text-xs bg-[#fafafa] border border-[#e2dedb] text-[#3b352f] focus:outline-none focus:border-[#4b423b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3b352f] uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+255 7XX XXX XXX"
                      className="w-full px-4 py-3 rounded-[10px] text-xs bg-[#fafafa] border border-[#e2dedb] text-[#3b352f] focus:outline-none focus:border-[#4b423b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3b352f] uppercase tracking-wider mb-1.5">
                    City / Region in Tanzania *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Dar es Salaam, Mbeya, Arusha, Dodoma, Mwanza, Morogoro"
                    className="w-full px-4 py-3 rounded-[10px] text-xs bg-[#fafafa] border border-[#e2dedb] text-[#3b352f] focus:outline-none focus:border-[#4b423b]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3b352f] uppercase tracking-wider mb-1.5">
                      Product Category Interested In
                    </label>
                    <select
                      value={formData.productType}
                      onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                      className="w-full px-4 py-3 rounded-[10px] text-xs bg-[#fafafa] border border-[#e2dedb] text-[#3b352f] focus:outline-none focus:border-[#4b423b]"
                    >
                      <option>Counter Books (Q2, Q3, Q4)</option>
                      <option>Exercise Books (32-200 Pages)</option>
                      <option>Kraft Bahasha Envelopes (A3, A4, A5)</option>
                      <option>Registers &amp; Examination Ruled Paper</option>
                      <option>Office Files &amp; Manila Folders</option>
                      <option>Mixed Full Catalog Wholesale Consignment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3b352f] uppercase tracking-wider mb-1.5">
                      Estimated Quantity (Cartons)
                    </label>
                    <select
                      value={formData.quantityRange}
                      onChange={(e) => setFormData({ ...formData, quantityRange: e.target.value })}
                      className="w-full px-4 py-3 rounded-[10px] text-xs bg-[#fafafa] border border-[#e2dedb] text-[#3b352f] focus:outline-none focus:border-[#4b423b]"
                    >
                      <option>5 — 19 Cartons (20% OFF)</option>
                      <option>20 — 49 Cartons (30% OFF - Most Popular)</option>
                      <option>50 — 99 Cartons (40% OFF - Enterprise)</option>
                      <option>100+ Cartons (Commercial Tender Pricing)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3b352f] uppercase tracking-wider mb-1.5">
                    Special Specifications / Tender Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Custom cover stamping, delivery schedule deadlines, bus parcel agent preferred, etc."
                    className="w-full px-4 py-3 rounded-[10px] text-xs bg-[#fafafa] border border-[#e2dedb] text-[#3b352f] focus:outline-none focus:border-[#4b423b]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-full btn-ledup-mocha group text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg min-h-[48px]"
                  >
                    <span>Submit Wholesale Inquiry →</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ==================== 6. FACTORY GUARANTEE & HOTLINES STRIP ==================== */}
      <section className="bg-white py-12 border-t border-[#e2dedb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-[16px] bg-[#fafafa] border border-[#e2dedb] space-y-2">
              <MapPin className="w-6 h-6 text-[#4b423b] mx-auto" />
              <h4 className="font-heading text-sm font-bold text-[#3b352f]">Soweto SIDO Viwandani</h4>
              <p className="text-xs text-[#c49b7c]">
                Central Factory &amp; Warehouse in Mbeya with direct bus parcel freight terminal.
              </p>
            </div>

            <div className="p-4 rounded-[16px] bg-[#fafafa] border border-[#e2dedb] space-y-2">
              <Phone className="w-6 h-6 text-[#4b423b] mx-auto" />
              <h4 className="font-heading text-sm font-bold text-[#3b352f]">3 Dedicated Desks</h4>
              <p className="text-xs text-[#c49b7c] font-mono">
                +255 746 268 391 · +255 624 265 480 · +255 699 032 777
              </p>
            </div>

            <div className="p-4 rounded-[16px] bg-[#fafafa] border border-[#e2dedb] space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#4b423b] mx-auto" />
              <h4 className="font-heading text-sm font-bold text-[#3b352f]">100% Genuine OMEGA</h4>
              <p className="text-xs text-[#c49b7c]">
                TBS standard compliance, reinforced thread-sewn bindings &amp; 70 GSM paper guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

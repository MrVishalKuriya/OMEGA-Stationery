import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, PackageCheck, Truck, CheckCircle2, MessageCircle, ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { SEOHead } from '@/components/SEOHead';
import { TRANSLATIONS } from '@/data/translations';

export const OrderTrackingPage: React.FC = () => {
  const { storeConfig, language } = useStore();
  const [orderRef, setOrderRef] = useState<string>('');
  const [searched, setSearched] = useState<boolean>(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderRef.trim()) {
      setSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111113]">
      <SEOHead
        title="Track Order Dispatch & Bus Waybills | OMEGA Stationery Tanzania"
        description="Track your real-time stationery orders, counter book bulk dispatches, and upcountry bus parcel waybills across Tanzania."
      />

      {/* 1. Photographic Hero with Reduced Dark Filter & Warm Light Filter */}
      <section className="relative overflow-hidden w-full bg-[#1B1B1E] text-white py-16 lg:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-75 brightness-110 contrast-105 pointer-events-none"
          style={{ backgroundImage: `url('/hero-desk-bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111113]/75 via-[#111113]/50 to-[#111113]/25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-[#F9F8F6]/15 to-white/25 mix-blend-soft-light pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.22),transparent_65%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs text-white/90 font-semibold mb-2">
              <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.home}</span>
              </Link>
              <span>/</span>
              <span className="text-[#DC2626] font-bold">Order Tracking</span>
            </div>

            <div className="inline-flex items-center px-3 py-1 rounded-[2px] bg-[#DC2626] text-white text-[11px] font-bold uppercase tracking-widest">
              <span>NATIONWIDE DISPATCH &amp; WAYBILL VERIFICATION</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-xs">
              {language === 'sw' ? 'Fuatilia Mzigo wa' : 'Track Upcountry Parcel'} <br />
              <span className="text-[#DC2626]">
                {language === 'sw' ? 'Madaftari Yako Tanzania.' : '& Factory Bus Waybills.'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#F4F4F5] leading-relaxed font-normal max-w-2xl">
              {language === 'sw'
                ? 'Ingiza namba ya oda au namba ya simu uliyotumia kufanya oda kuona hatua ya upakiaji na stakabadhi ya basi (waybill).'
                : 'Enter your order confirmation reference or WhatsApp phone number to view live factory dispatch, packaging confirmation, and upcountry bus waybill receipts.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Full-Width Crimson Red Callout Strip with Upward White Triangle Notch */}
      <section className="relative bg-[#D62828] text-white py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl text-left">
            <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-white">
              REAL-TIME FACTORY CARTON PACKING &amp; BUS TERMINAL DROP-OFF STATUS
            </h2>
            <p className="text-xs text-white/85 leading-relaxed">
              Dispatched daily from Soweto SIDO Mbeya and Kariakoo Commercial Hub via Shabiby, BM Coach, Abood, and New Force.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/shipping-guide"
              className="px-6 py-2.5 bg-white text-[#111113] hover:bg-zinc-100 text-[11px] font-bold uppercase tracking-[0.14em] rounded-[2px] transition-colors"
            >
              BUS TERMINALS GUIDE
            </Link>
          </div>
        </div>

        <div className="absolute -bottom-[1px] left-12 sm:left-24 lg:left-36 w-0 h-0 border-l-[26px] border-l-transparent border-r-[26px] border-r-transparent border-b-[18px] border-b-white">
          <span className="absolute -left-1.5 top-1.5 text-[10px] text-zinc-400 font-bold leading-none select-none">
            ⌄
          </span>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-charcoal-ink">
        
        {/* Search Card */}
        <div className="p-6 sm:p-8 bg-white rounded-[2px] border border-[#E7E5E0] space-y-6">
          <form onSubmit={handleSearch} className="space-y-4 text-left">
            <label className="text-xs font-bold text-charcoal-ink uppercase tracking-wider block font-mono">
              Enter Order Reference or Mobile Number:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  placeholder="e.g. OMG-2026-4891 or 0715 268 391"
                  className="w-full px-4 py-3.5 bg-paper-base border border-[#E5E7EB] focus:border-[#DC2626] rounded-[2px] focus:bg-white focus:outline-none font-mono text-sm uppercase text-charcoal-ink placeholder:text-[#3F3F46] transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-7 py-3.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-[0.14em] rounded-[2px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Track Waybill</span>
              </button>
            </div>
            <p className="text-xs text-charcoal-ink">
              Tip: You can use your proforma reference number, invoice ID, or WhatsApp contact number.
            </p>
          </form>

          {/* Results Timeline */}
          {searched && (
            <div className="p-6 bg-paper-base border border-[#E7E5E0] rounded-[2px] space-y-6 text-left">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#3F3F46] font-mono">Order Tracking ID:</span>
                  <p className="text-base font-extrabold font-mono text-charcoal-ink">{orderRef.toUpperCase() || 'OMG-DEMO-7842'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#111113] text-white font-mono rounded-[2px]">
                    ● Dispatched / In Transit
                  </span>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="space-y-5 pt-2">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-[#111113] text-white rounded-[2px] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-charcoal-ink">Order Confirmed &amp; Stamped Proforma Issued</h4>
                    <p className="text-xs text-charcoal-ink mt-0.5">Stock confirmed directly at Soweto SIDO Central Factory &amp; Kariakoo Hub.</p>
                    <span className="text-[10px] text-[#3F3F46] font-mono">Stage 1 · Verified</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-[#111113] text-white rounded-[2px] flex items-center justify-center shrink-0">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-charcoal-ink">Packed in Reinforced OMEGA Heavy Cartons</h4>
                    <p className="text-xs text-charcoal-ink mt-0.5">Strapped with tamper-evident security banding for cross-regional road transport.</p>
                    <span className="text-[10px] text-[#3F3F46] font-mono">Stage 2 · Quality Checked</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-[#DC2626] text-white rounded-[2px] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-charcoal-ink">Handed over to Regional Bus Terminal</h4>
                    <p className="text-xs text-charcoal-ink mt-0.5">Consignment booked onto scheduled upcountry bus service with registered parcel waybill.</p>
                    <span className="text-[10px] text-[#B91C1C] font-mono font-bold">Stage 3 · Live Waybill Active</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-charcoal-ink">
                  Need live bus driver contacts or the printed waybill receipt photo?
                </div>
                <a
                  href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                    `Hello OMEGA Dispatch Desk, please share the waybill details for reference: ${orderRef || 'OMG-DEMO-7842'}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-2 transition-colors shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Dispatch Desk</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-[#E7E5E0] text-left">
          <div className="p-6 bg-white border-r border-b border-[#E7E5E0] space-y-3">
            <div className="w-10 h-10 bg-paper-base text-[#DC2626] rounded-[2px] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-charcoal-ink">Expected Delivery Times</h3>
            <p className="text-xs sm:text-sm text-charcoal-ink leading-relaxed">
              Standard bus dispatches from Mbeya and Dar es Salaam arrive within <strong>24 to 48 hours</strong> to major regional terminals across Tanzania including Arusha, Mwanza, Dodoma, Morogoro, and Iringa.
            </p>
          </div>

          <div className="p-6 bg-white border-r border-b border-[#E7E5E0] space-y-3">
            <div className="w-10 h-10 bg-paper-base text-[#DC2626] rounded-[2px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-charcoal-ink">Official EFD Receipts</h3>
            <p className="text-xs sm:text-sm text-charcoal-ink leading-relaxed">
              Every dispatched carton contains your printed TRA EFD tax invoice and signed packing slip inside the waterproof pouch on the lead carton.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            to="/shipping-guide"
            className="text-xs font-bold font-mono uppercase tracking-wider text-[#B91C1C] hover:underline"
          >
            → View Full Regional Bus Parcels Directory &amp; Hub Schedules
          </Link>
        </div>
      </div>
    </div>
  );
};
export default OrderTrackingPage;

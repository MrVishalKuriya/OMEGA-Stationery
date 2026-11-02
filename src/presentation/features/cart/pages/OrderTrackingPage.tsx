import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, PackageCheck, Truck, CheckCircle2, MapPin, MessageCircle, ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SEOHead
        title="Track Order Dispatch & Bus Waybills | OMEGA Stationery Tanzania"
        description="Track your real-time stationery orders, counter book bulk dispatches, and upcountry bus parcel waybills across Tanzania."
      />

      {/* Header Banner */}
      <section className="relative overflow-hidden w-full bg-[var(--surface-1)] text-[var(--text)] py-14 lg:py-20 border-b border-[var(--border)]">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[var(--red)]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[550px] h-[550px] bg-[var(--gold)]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-semibold mb-2">
              <Link to="/" className="hover:text-[var(--text)] flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.home}</span>
              </Link>
              <span>/</span>
              <span className="text-[var(--red)] font-bold">Order Tracking</span>
            </div>

            <div className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[var(--gold)] bg-[var(--surface-2)] border border-[var(--gold)]/30 font-mono shadow-xs">
              <span>NATIONWIDE DISPATCH &amp; WAYBILL VERIFICATION</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-light text-[var(--text)] leading-tight">
              {language === 'sw' ? 'Fuatilia Mzigo wa' : 'Track Upcountry Parcel'} <br />
              <span className="font-bold text-[var(--red)]">
                {language === 'sw' ? 'Madaftari Yako Tanzania.' : '& Factory Bus Waybills.'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-normal">
              {language === 'sw'
                ? 'Ingiza namba ya oda au namba ya simu uliyotumia kufanya oda kuona hatua ya upakiaji na stakabadhi ya basi (waybill).'
                : 'Enter your order confirmation reference or WhatsApp phone number to view live factory dispatch, packaging confirmation, and upcountry bus waybill receipts.'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        
        {/* Search Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] shadow-xl space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="text-xs font-bold text-[var(--text)] uppercase tracking-wider block font-mono">
              Enter Order Reference or Mobile Number:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  placeholder="e.g. OMG-2026-4891 or 0715 268 391"
                  className="w-full px-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] focus:outline-none focus:border-[var(--red)] font-mono text-sm uppercase text-[var(--text)] transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-7 py-3.5 rounded-full bg-[var(--red)] hover:opacity-90 text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Track Waybill</span>
              </button>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Tip: You can use your proforma reference number, invoice ID, or WhatsApp contact number.
            </p>
          </form>

          {/* Results Timeline */}
          {searched && (
            <div className="p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] font-mono">Order Tracking ID:</span>
                  <p className="text-base font-black font-mono text-[var(--text)]">{orderRef.toUpperCase() || 'OMG-DEMO-7842'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                    ● Dispatched / In Transit
                  </span>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="space-y-5 pt-2">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text)]">Order Confirmed &amp; Stamped Proforma Issued</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Stock confirmed directly at Soweto SIDO Central Factory &amp; Kariakoo Hub.</p>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">Stage 1 · Verified</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text)]">Packed in Reinforced OMEGA Heavy Cartons</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Strapped with tamper-evident security banding for cross-regional road transport.</p>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">Stage 2 · Quality Checked</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-[var(--red)] text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text)]">Handed over to Regional Bus Terminal</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Consignment booked onto scheduled upcountry bus service with registered parcel waybill.</p>
                    <span className="text-[10px] text-[var(--red)] font-mono font-bold">Stage 3 · Live Waybill Active</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[var(--text-muted)]">
                  Need live bus driver contacts or the printed waybill receipt photo?
                </div>
                <a
                  href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                    `Hello OMEGA Dispatch Desk, please share the waybill details for reference: ${orderRef || 'OMG-DEMO-7842'}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-105 shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Dispatch Desk</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--surface-2)] text-[var(--gold)] flex items-center justify-center border border-[var(--border)]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[var(--text)]">Expected Delivery Times</h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Standard bus dispatches from Mbeya and Dar es Salaam arrive within <strong>24 to 48 hours</strong> to major regional terminals across Tanzania including Arusha, Mwanza, Dodoma, Morogoro, and Iringa.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--surface-2)] text-[var(--gold)] flex items-center justify-center border border-[var(--border)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[var(--text)]">Official EFD Receipts</h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Every dispatched carton contains your printed TRA EFD tax invoice and signed packing slip inside the waterproof pouch on the lead carton.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            to="/shipping-guide"
            className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--red)] hover:underline"
          >
            → View Full Regional Bus Parcels Directory &amp; Hub Schedules
          </Link>
        </div>
      </div>
    </div>
  );
};

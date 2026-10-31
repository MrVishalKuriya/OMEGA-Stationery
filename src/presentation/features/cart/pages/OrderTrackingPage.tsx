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
    <div className="min-h-screen bg-[#FAF6F0] text-[#26130F]">
      <SEOHead
        title="Track Order Dispatch & Bus Waybills | OMEGA Stationery Tanzania"
        description="Track your real-time stationery orders, counter book bulk dispatches, and upcountry bus parcel waybills across Tanzania."
      />

      {/* Header Banner */}
      <section className="relative overflow-hidden w-full bg-[#111113] text-[#F9F8F6] py-14 lg:py-20 border-b border-[#E7E5E0]/15">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#A39E93] font-semibold mb-2">
              <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.home}</span>
              </Link>
              <span>/</span>
              <span className="text-[#C8A27A] font-bold">Order Tracking</span>
            </div>

            <div className="inline-flex items-center px-3.5 py-1.5 rounded-md bg-[#8C7355] text-white text-xs font-bold font-mono shadow-xs">
              <span>NATIONWIDE DISPATCH &amp; WAYBILL VERIFICATION</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#F9F8F6] leading-tight">
              {language === 'sw' ? 'Fuatilia Mzigo wa' : 'Track Upcountry Parcel'} <br />
              <span className="text-[#C8A27A]">
                {language === 'sw' ? 'Madaftari Yako Tanzania.' : '& Factory Bus Waybills.'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#A39E93] leading-relaxed font-normal">
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
        <div className="p-6 sm:p-8 bg-white rounded-lg border border-[#E7E5E0] shadow-xs space-y-6">
          <form onSubmit={handleSearch} className="space-y-4 text-left">
            <label className="text-xs font-bold text-[#26130F] uppercase tracking-wider block font-mono">
              Enter Order Reference or Mobile Number:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  placeholder="e.g. OMG-2026-4891 or 0715 268 391"
                  className="w-full px-4 py-3.5 bg-[#FAF6F0] focus:bg-white focus:outline-none font-mono text-sm uppercase text-[#26130F] transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-7 py-3.5 bg-[#9E3618] hover:bg-[#6B140B] text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Track Waybill</span>
              </button>
            </div>
            <p className="text-xs text-[#7D685E]">
              Tip: You can use your proforma reference number, invoice ID, or WhatsApp contact number.
            </p>
          </form>

          {/* Results Timeline */}
          {searched && (
            <div className="p-6 bg-[#FAF6F0] space-y-6 text-left">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D8C3A5]/40">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7D685E] font-mono">Order Tracking ID:</span>
                  <p className="text-base font-black font-mono text-[#26130F]">{orderRef.toUpperCase() || 'OMG-DEMO-7842'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#E9A858] text-[#26130F] font-mono">
                    ● Dispatched / In Transit
                  </span>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="space-y-5 pt-2">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-[#9E3618] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#26130F]">Order Confirmed &amp; Stamped Proforma Issued</h4>
                    <p className="text-xs text-[#7D685E] mt-0.5">Stock confirmed directly at Soweto SIDO Central Factory &amp; Kariakoo Hub.</p>
                    <span className="text-[10px] text-[#7D685E] font-mono">Stage 1 · Verified</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-[#9E3618] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#26130F]">Packed in Reinforced OMEGA Heavy Cartons</h4>
                    <p className="text-xs text-[#7D685E] mt-0.5">Strapped with tamper-evident security banding for cross-regional road transport.</p>
                    <span className="text-[10px] text-[#7D685E] font-mono">Stage 2 · Quality Checked</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-[#6B140B] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#26130F]">Handed over to Regional Bus Terminal</h4>
                    <p className="text-xs text-[#7D685E] mt-0.5">Consignment booked onto scheduled upcountry bus service with registered parcel waybill.</p>
                    <span className="text-[10px] text-[#9E3618] font-mono font-bold">Stage 3 · Live Waybill Active</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-4 border-t border-[#D8C3A5]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#7D685E]">
                  Need live bus driver contacts or the printed waybill receipt photo?
                </div>
                <a
                  href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                    `Hello OMEGA Dispatch Desk, please share the waybill details for reference: ${orderRef || 'OMG-DEMO-7842'}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#9E3618] hover:bg-[#6B140B] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Dispatch Desk</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="p-6 bg-white shadow-xs space-y-3">
            <div className="w-10 h-10 bg-[#FAF6F0] text-[#9E3618] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#26130F]">Expected Delivery Times</h3>
            <p className="text-xs sm:text-sm text-[#7D685E] leading-relaxed">
              Standard bus dispatches from Mbeya and Dar es Salaam arrive within <strong>24 to 48 hours</strong> to major regional terminals across Tanzania including Arusha, Mwanza, Dodoma, Morogoro, and Iringa.
            </p>
          </div>

          <div className="p-6 bg-white shadow-xs space-y-3">
            <div className="w-10 h-10 bg-[#FAF6F0] text-[#9E3618] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#26130F]">Official EFD Receipts</h3>
            <p className="text-xs sm:text-sm text-[#7D685E] leading-relaxed">
              Every dispatched carton contains your printed TRA EFD tax invoice and signed packing slip inside the waterproof pouch on the lead carton.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            to="/shipping-guide"
            className="text-xs font-bold font-mono uppercase tracking-wider text-[#9E3618] hover:underline"
          >
            → View Full Regional Bus Parcels Directory &amp; Hub Schedules
          </Link>
        </div>
      </div>
    </div>
  );
};
export default OrderTrackingPage;

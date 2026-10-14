import React, { useState } from 'react';
import { X, Search, PackageCheck, Truck, CheckCircle2, Clock, MapPin, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderTrackingModal: React.FC = () => {
  const { isTrackingModalOpen, setIsTrackingModalOpen, storeConfig } = useStore();
  const [orderRef, setOrderRef] = useState<string>('');
  const [searched, setSearched] = useState<boolean>(false);

  if (!isTrackingModalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderRef.trim()) {
      setSearched(true);
    }
  };

  const cleanWhatsappDigits = storeConfig.whatsappNumber.replace(/\D/g, '');

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsTrackingModalOpen(false)}
    >
      <div
        className="relative w-full max-w-lg bg-[#FBF8F1] rounded-[12px] overflow-hidden shadow-2xl border border-[#E6E0D2] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Deep Ink Blue #1E2A5E */}
        <div className="bg-[#1E2A5E] text-white px-6 py-4 flex items-center justify-between border-b border-[#E6E0D2]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#F5A623] flex items-center justify-center text-[#1E2A5E]">
              <Truck className="w-4 h-4 text-[#1E2A5E]" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase font-heading text-white">
                OMEGA Order Dispatch Tracker
              </h2>
              <span className="text-xs text-[#F5A623] font-mono">Tanzania Real-time Status</span>
            </div>
          </div>
          <button
            onClick={() => setIsTrackingModalOpen(false)}
            className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Tracking Input Form */}
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="text-xs font-bold text-[#1B1F2A] uppercase tracking-wider block">
              Enter Order / Quotation Reference:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value)}
                placeholder="e.g. OMG-DEMO-4891 or Phone Number"
                className="flex-1 px-4 py-2.5 rounded-[8px] border border-[#E6E0D2] bg-white focus:outline-none focus:border-[#1E2A5E] font-mono text-sm uppercase text-[#1B1F2A]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 btn-cta-yellow text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-[8px] shadow-xs"
              >
                <Search className="w-4 h-4 text-[#1E2A5E]" />
                <span className="text-[#1E2A5E]">Track</span>
              </button>
            </div>
            <p className="text-[11px] text-[#6B7280]">
              Tip: You can use your demo reference or contact number used on WhatsApp.
            </p>
          </form>

          {/* Timeline Demo Result */}
          {searched && (
            <div className="p-5 rounded-[12px] bg-white border border-[#E6E0D2] space-y-5 animate-in fade-in shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D2]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6B7280]">Reference:</span>
                  <p className="text-sm font-black font-mono text-[#1B1F2A]">{orderRef || 'OMG-DEMO-7842'}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#2A9D8F] border border-emerald-200">
                  In Transit
                </span>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1B1F2A]">Order Confirmed on WhatsApp</h4>
                    <p className="text-[11px] text-[#6B7280]">Stock confirmed from Kariakoo Central Warehouse.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center shrink-0">
                    <PackageCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1B1F2A]">Packed in Heavy OMEGA Cartons</h4>
                    <p className="text-[11px] text-[#6B7280]">Reinforced packaging for counter books &amp; envelopes.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#F5A623] text-[#1E2A5E] flex items-center justify-center shrink-0 animate-pulse font-bold">
                    <Truck className="w-4 h-4 text-[#1E2A5E]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E2A5E]">Out for Delivery / Upcountry Bus Parcel</h4>
                    <p className="text-[11px] text-[#6B7280]">Direct courier delivery in Dar es Salaam or dispatched to regional bus terminals.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                    `Hello OMEGA Dispatch, please update me on order reference: ${orderRef || 'OMG-DEMO-7842'}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-[8px] bg-[#2A9D8F] hover:bg-[#238276] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Ask Dispatch Manager on WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

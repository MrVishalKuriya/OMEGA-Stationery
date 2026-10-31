import React from 'react';
import { MapPin, Phone, ShieldCheck } from 'lucide-react';

export const WholesaleLogisticsStrip: React.FC = () => {
  return (
    <section className="bg-white py-12 border-t border-[#E7E5E0]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-lg bg-[#F9F8F6] border border-[#E7E5E0] shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-md bg-[#F2EFEB] text-[#8C7355] flex items-center justify-center mx-auto shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-heading text-sm font-bold text-[#111113]">Soweto SIDO Viwandani</h4>
            <p className="text-xs text-[#6E6B66]">
              Central Factory &amp; Warehouse in Mbeya, Tanzania with direct bus freight terminal handoff.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-[#F9F8F6] border border-[#E7E5E0] shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-md bg-[#F2EFEB] text-[#8C7355] flex items-center justify-center mx-auto shadow-xs">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-heading text-sm font-bold text-[#111113]">Factory Hotlines</h4>
            <p className="text-[11px] text-[#6E6B66] font-mono font-medium">
              +255 715 268 391 · +255 624 265 480 · +255 746 268 391
            </p>
          </div>

          <div className="p-6 rounded-lg bg-[#F9F8F6] border border-[#E7E5E0] shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-md bg-[#F2EFEB] text-[#8C7355] flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-heading text-sm font-bold text-[#111113]">100% Genuine OMEGA</h4>
            <p className="text-xs text-[#6E6B66]">
              NECTA &amp; TBS benchmark: Smyth-sewn archival bindings &amp; 70 GSM bleed-proof guarantee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { MapPin, Phone, ShieldCheck } from 'lucide-react';

export const WholesaleLogisticsStrip: React.FC = () => {
  return (
    <section className="bg-paper-base py-14 border-t border-[#E7E5E0] text-charcoal-ink">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 border border-[#E7E5E0] text-center">
          <div className="p-8 bg-white border-b md:border-b-0 md:border-r border-[#E7E5E0] space-y-2.5 hover:bg-paper-base transition-colors">
            <div className="w-10 h-10 rounded-[2px] bg-[#111113] text-[#DC2626] flex items-center justify-center mx-auto">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-heading text-sm font-bold text-charcoal-ink">Soweto SIDO Viwandani</h4>
            <p className="text-xs text-charcoal-ink">
              Central Factory &amp; Warehouse in Mbeya, Tanzania with direct bus freight terminal handoff.
            </p>
          </div>

          <div className="p-8 bg-white border-b md:border-b-0 md:border-r border-[#E7E5E0] space-y-2.5 hover:bg-paper-base transition-colors">
            <div className="w-10 h-10 rounded-[2px] bg-[#111113] text-[#DC2626] flex items-center justify-center mx-auto">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-heading text-sm font-bold text-charcoal-ink">Factory Hotlines</h4>
            <p className="text-[11px] text-charcoal-ink font-mono font-medium">
              +255 715 268 391 · +255 624 265 480 · +255 746 268 391
            </p>
          </div>

          <div className="p-8 bg-white space-y-2.5 hover:bg-paper-base transition-colors">
            <div className="w-10 h-10 rounded-[2px] bg-[#111113] text-[#DC2626] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-heading text-sm font-bold text-charcoal-ink">100% Genuine OMEGA</h4>
            <p className="text-xs text-charcoal-ink">
              NECTA &amp; TBS benchmark: Smyth-sewn archival bindings &amp; 70 GSM bleed-proof guarantee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

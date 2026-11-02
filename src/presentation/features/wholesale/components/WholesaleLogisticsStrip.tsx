import React from 'react';
import { MapPin, Phone, ShieldCheck } from 'lucide-react';

export const WholesaleLogisticsStrip: React.FC = () => {
  return (
    <section className="bg-[var(--surface-1)] py-12 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] shadow-xs space-y-2">
            <MapPin className="w-6 h-6 text-[var(--red)] mx-auto" />
            <h4 className="font-heading text-sm font-bold text-[var(--text)]">Soweto SIDO Viwandani</h4>
            <p className="text-xs text-[var(--text-muted)]">
              Central Factory &amp; Warehouse in Mbeya, Tanzania with regional bus freight terminal access.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] shadow-xs space-y-2">
            <Phone className="w-6 h-6 text-[var(--gold)] mx-auto" />
            <h4 className="font-heading text-sm font-bold text-[var(--text)]">4 Dedicated Desks (2 Boss &amp; 2 Branches)</h4>
            <p className="text-[11px] text-[var(--text-muted)] font-mono">
              +255 715 268 391 · +255 624 265 480 · +255 746 268 391 · +255 699 032 777
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] shadow-xs space-y-2">
            <ShieldCheck className="w-6 h-6 text-[var(--gold)] mx-auto" />
            <h4 className="font-heading text-sm font-bold text-[var(--text)]">100% Genuine OMEGA</h4>
            <p className="text-xs text-[var(--text-muted)]">
              TBS standard compliance, reinforced thread-sewn bindings &amp; 70 GSM paper guarantee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

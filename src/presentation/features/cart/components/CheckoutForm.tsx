import React from 'react';
import { MessageCircle } from 'lucide-react';
import { CustomerOrderInput } from '@/types/store';

interface CheckoutFormProps {
  formData: CustomerOrderInput;
  setFormData: React.Dispatch<React.SetStateAction<CustomerOrderInput>>;
  selectedWhatsAppNumber: string;
  setSelectedWhatsAppNumber: (number: string) => void;
  errors: Record<string, string>;
  onSubmit: (e: React.FormEvent) => void;
  subtotal: number;
  effectiveDeliveryFee: number;
  finalTotal: number;
  currency: string;
  language: string;
  t: any;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  formData,
  setFormData,
  selectedWhatsAppNumber,
  setSelectedWhatsAppNumber,
  errors,
  onSubmit,
  subtotal,
  effectiveDeliveryFee,
  finalTotal,
  currency,
  language,
  t,
}) => {
  return (
    <div className="lg:col-span-5 space-y-6">
      <form
        onSubmit={onSubmit}
        className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] p-6 shadow-sm space-y-5"
      >
        <h2 className="text-base font-bold text-[var(--text)] uppercase tracking-wider border-b border-[var(--border)] pb-3 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
          <span>{t.whatsAppOrderingTitle}</span>
        </h2>

        {/* Choose WhatsApp Sales Desk */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text)] uppercase tracking-wider block">
            {t.choosePhone}
          </label>
          <div className="space-y-1.5">
            {[
              {
                digits: '255715268391',
                label: 'KANTI BHAI K. HALAI: +255 715 268 391',
                desc: 'Co-Founder & Managing Director (Executive Desk 01)',
              },
              {
                digits: '255624265480',
                label: 'VIJESH K. HALAI: +255 624 265 480',
                desc: 'Co-Founder & Managing Director (Wholesale Desk 02)',
              },
              {
                digits: '255746268391',
                label: 'Mbeya Branch: +255 746 268 391',
                desc: 'Mbeya Branch (Soweto SIDO Factory Depot)',
              },
              {
                digits: '255699032777',
                label: 'Mwanza Branch: +255 699 032 777',
                desc: 'Mwanza Branch & Lake Zone Regional Desk',
              },
            ].map((d) => (
              <label
                key={d.digits}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedWhatsAppNumber === d.digits
                    ? 'bg-[var(--surface-2)] border-[var(--gold)]/60 shadow-xs'
                    : 'bg-[var(--surface-2)]/40 border-[var(--border)] hover:border-[var(--border)]'
                }`}
              >
                <input
                  type="radio"
                  name="sales_desk"
                  value={d.digits}
                  checked={selectedWhatsAppNumber === d.digits}
                  onChange={() => setSelectedWhatsAppNumber(d.digits)}
                  className="mt-1 text-[var(--red)] focus:ring-[var(--red)]"
                />
                <div>
                  <p className="text-xs font-bold text-[var(--text)]">{d.label}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{d.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Customer Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--text)] uppercase tracking-wider block">
            {t.fullName} *
          </label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            placeholder="e.g. Juma Rashid / St. Joseph School"
            className="w-full px-3.5 py-2.5 text-sm bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] rounded-xl focus:outline-none focus:border-[var(--red)]"
          />
          {errors.customerName && (
            <p className="text-xs text-[var(--red)] font-semibold">{errors.customerName}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--text)] uppercase tracking-wider block">
            {t.phoneNumber} *
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="e.g. +255 712 345 678"
            className="w-full px-3.5 py-2.5 text-sm bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] rounded-xl focus:outline-none focus:border-[var(--red)]"
          />
          {errors.phoneNumber && (
            <p className="text-xs text-[var(--red)] font-semibold">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Delivery Option */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--text)] uppercase tracking-wider block">
            {t.deliveryOptions}
          </label>
          <select
            value={formData.fulfillmentType}
            onChange={(e) =>
              setFormData({ ...formData, fulfillmentType: e.target.value as any })
            }
            className="w-full px-3.5 py-2.5 text-sm bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] rounded-xl focus:outline-none focus:border-[var(--red)]"
          >
            <option value="Home Delivery">{t.homeDelivery}</option>
            <option value="In-Store Pickup">{t.pickupStore}</option>
            <option value="Upcountry Bus Parcel (Mikoani)">{t.mikoaniParcel}</option>
          </select>
        </div>

        {/* Delivery Location */}
        {formData.fulfillmentType !== 'In-Store Pickup' && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--text)] uppercase tracking-wider block">
              {t.deliveryLocation} *
            </label>
            <input
              type="text"
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
              placeholder="e.g. Kariakoo / Sinza / Mwanza (Nyegezi Terminal)"
              className="w-full px-3.5 py-2.5 text-sm bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] rounded-xl focus:outline-none focus:border-[var(--red)]"
            />
            {errors.deliveryAddress && (
              <p className="text-xs text-[var(--red)] font-semibold">{errors.deliveryAddress}</p>
            )}
          </div>
        )}

        {/* Payment Preference */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--text)] uppercase tracking-wider block">
            {t.paymentMethod}
          </label>
          <select
            value={formData.paymentPreference}
            onChange={(e) =>
              setFormData({ ...formData, paymentPreference: e.target.value as any })
            }
            className="w-full px-3.5 py-2.5 text-sm bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] rounded-xl focus:outline-none focus:border-[var(--red)]"
          >
            <option value="Mobile Money (M-Pesa / Tigo / Airtel)">{t.mobileMoney}</option>
            <option value="Cash on Delivery (COD)">{t.cashOnDelivery}</option>
            <option value="Bank Transfer (CRDB/NMB)">{t.bankTransfer}</option>
          </select>
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--text)] uppercase tracking-wider block">
            {t.orderNotes}
          </label>
          <textarea
            rows={2}
            value={formData.orderNotes}
            onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
            placeholder="Optional notes or instructions..."
            className="w-full px-3.5 py-2.5 text-xs bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] rounded-xl focus:outline-none focus:border-[var(--red)]"
          />
        </div>

        {/* Order Totals Summary */}
        <div className="pt-3 border-t border-[var(--border)] space-y-2 text-xs text-[var(--text-muted)]">
          <div className="flex justify-between">
            <span>{language === 'sw' ? 'Jumla ya Bidhaa:' : 'Items Subtotal:'}</span>
            <span className="font-bold text-[var(--text)] font-mono-tabular">
              {currency} {subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{language === 'sw' ? 'Gharama ya Usafiri:' : 'Delivery Charges:'}</span>
            <span className="font-bold text-[var(--text)] font-mono-tabular">
              {effectiveDeliveryFee === 0 ? 'Free / Pickup' : `${currency} ${effectiveDeliveryFee.toLocaleString()}`}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[var(--border)] text-sm font-black text-[var(--text)]">
            <span>{language === 'sw' ? 'Jumla Kuu ya Kulipa:' : 'Total Payable:'}</span>
            <span className="font-mono-tabular text-[var(--red)] text-lg font-black">
              {currency} {finalTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Submit Order Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm uppercase tracking-wider rounded-full shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span>{t.sendWhatsAppBtn}</span>
        </button>
      </form>
    </div>
  );
};

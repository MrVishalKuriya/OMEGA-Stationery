import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { triggerLuxuryConfetti } from '@/utils/confetti';

interface WholesaleInquiryFormProps {
  cleanWhatsappDigits: string;
  selectedTierQuantity?: string;
}

export const WholesaleInquiryForm: React.FC<WholesaleInquiryFormProps> = ({
  cleanWhatsappDigits,
  selectedTierQuantity,
}) => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    productType: 'Counter Books (Q2, Q3, Q4)',
    quantityRange: selectedTierQuantity || '20 — 49 Cartons (30% OFF - Most Popular)',
    notes: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [inquiryRefId, setInquiryRefId] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  React.useEffect(() => {
    if (selectedTierQuantity) {
      setFormData((prev) => ({ ...prev, quantityRange: selectedTierQuantity }));
    }
  }, [selectedTierQuantity]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRef = `OMG-WS-${Math.floor(100000 + Math.random() * 900000)}`;
    setInquiryRefId(newRef);
    setFormSubmitted(true);
    triggerLuxuryConfetti();
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
      `City / Region: ${formData.city}\n` +
      `Product: ${formData.productType}\n` +
      `Tier / Quantity: ${formData.quantityRange}\n` +
      (formData.notes ? `Notes: ${formData.notes}\n` : '') +
      `\nPlease issue formal proforma invoice with official EFD tax calculation.`;
    return `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section className="py-16 lg:py-20 bg-paper-base text-charcoal-ink border-t border-b border-[#E7E5E0]" id="inquiry">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[11px] font-bold font-mono uppercase tracking-widest text-[#B91C1C] block">
            DIRECT FACTORY PROFORMA DESK
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal-ink tracking-tight">
            Request Official Wholesale Proforma Quote
          </h2>
          <p className="text-xs sm:text-[13px] text-charcoal-ink max-w-lg mx-auto">
            Submit your school, institution, or commercial order. Our sales desk in Soweto SIDO issues stamped proformas within 4 business hours.
          </p>
          <div className="flex justify-center pt-1">
            <svg className="w-16 h-3 text-charcoal-ink" viewBox="0 0 60 8" fill="none">
              <path d="M0 4 Q 5 0, 10 4 T 20 4 T 30 4 T 40 4 T 50 4 T 60 4" stroke="currentColor" strokeWidth="1.8" fill="none" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-[1180px] mx-auto">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white rounded-[2px] p-6 sm:p-8 border border-[#E7E5E0]">
            {formSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#111113] text-[#DC2626] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9 text-[#DC2626]" />
                </div>
                <h3 className="font-heading text-2xl font-black text-charcoal-ink">
                  Wholesale Inquiry Dispatched!
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-ink max-w-md mx-auto">
                  Your reference number is{' '}
                  <strong className="font-mono text-[#B91C1C] font-black">{inquiryRefId}</strong>. A dedicated wholesale manager from our Soweto SIDO factory desk is reviewing your requirements.
                </p>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={copyInquiryRef}
                    className="px-4 py-2 rounded-[2px] bg-paper-base border border-[#E7E5E0] text-xs font-bold text-charcoal-ink inline-flex items-center gap-1.5 hover:bg-neutral-200 cursor-pointer transition-colors"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-[#DC2626]" /> : <Copy className="w-3.5 h-3.5 text-[#DC2626]" />}
                    <span>{copiedRef ? 'Copied Ref!' : 'Copy Reference ID'}</span>
                  </button>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={getFormWhatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-xs transition-all"
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
                    className="px-6 py-3.5 rounded-[2px] bg-[#111113] text-xs font-bold text-white hover:bg-black transition-colors cursor-pointer"
                  >
                    New Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-ink uppercase tracking-wider mb-1.5">
                      Business or School Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. Mbeya Day Secondary School"
                      className="w-full px-4 py-2.5 rounded-[2px] border border-[#E7E5E0] text-xs bg-paper-base text-charcoal-ink placeholder:text-[#3F3F46] focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-ink uppercase tracking-wider mb-1.5">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="Full Name / Headmaster / Manager"
                      className="w-full px-4 py-2.5 rounded-[2px] border border-[#E7E5E0] text-xs bg-paper-base text-charcoal-ink placeholder:text-[#3F3F46] focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-ink uppercase tracking-wider mb-1.5">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 0715 268 391"
                      className="w-full px-4 py-2.5 rounded-[2px] border border-[#E7E5E0] text-xs bg-paper-base text-charcoal-ink placeholder:text-[#3F3F46] focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-ink uppercase tracking-wider mb-1.5">
                      Delivery Town / Region *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Mwanza, Arusha, Dodoma"
                      className="w-full px-4 py-2.5 rounded-[2px] border border-[#E7E5E0] text-xs bg-paper-base text-charcoal-ink placeholder:text-[#3F3F46] focus:outline-none focus:border-[#DC2626]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-ink uppercase tracking-wider mb-1.5">
                      Primary Stationery Required
                    </label>
                    <select
                      value={formData.productType}
                      onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-[2px] border border-[#E7E5E0] text-xs bg-paper-base text-charcoal-ink focus:outline-none focus:border-[#DC2626] cursor-pointer"
                    >
                      <option>Counter Books (Q1, Q2, Q3, Q4)</option>
                      <option>Exercise Books (80p, 100p, 200p)</option>
                      <option>Kraft Bahasha &amp; Envelopes</option>
                      <option>Office Files &amp; Manila Folders</option>
                      <option>Mixed Full School Consignment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-ink uppercase tracking-wider mb-1.5">
                      Target Volume Range
                    </label>
                    <select
                      value={formData.quantityRange}
                      onChange={(e) => setFormData({ ...formData, quantityRange: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-[2px] border border-[#E7E5E0] text-xs bg-paper-base text-charcoal-ink focus:outline-none focus:border-[#DC2626] cursor-pointer"
                    >
                      <option>5 — 19 Cartons (20% OFF)</option>
                      <option>20 — 49 Cartons (30% OFF - Most Popular)</option>
                      <option>50 — 99 Cartons (40% OFF - Enterprise)</option>
                      <option>100+ Cartons (Commercial Tender Pricing)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-ink uppercase tracking-wider mb-1.5">
                    Special Requirements / Delivery Deadlines
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Custom school logo stamping, preferred bus parcel agency (Tahmeed, Shabiby, Abood), required delivery date, etc."
                    className="w-full px-4 py-2.5 rounded-[2px] border border-[#E7E5E0] text-xs bg-paper-base text-charcoal-ink placeholder:text-[#3F3F46] focus:outline-none focus:border-[#DC2626]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Submit Proforma Request →</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Guarantee Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-[2px] text-charcoal-ink p-6 sm:p-8 border border-[#E7E5E0] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E7E5E0]">
                <ShieldCheck className="w-5 h-5 text-[#DC2626]" />
                <h4 className="font-heading text-sm font-black text-charcoal-ink uppercase tracking-wider">
                  Factory Procurement Guarantees
                </h4>
              </div>

              <ul className="space-y-3.5 text-xs text-charcoal-ink">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-charcoal-ink">EFD Fiscal Receipt:</strong> Every wholesale consignment includes a genuine TRA electronic fiscal receipt.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-charcoal-ink">Tamper-Proof Strapping:</strong> High-tensile plastic band strapping and waterproof inner lining.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-charcoal-ink">Bus Waybill Terminal:</strong> Same-day dispatch to regional bus terminals in Mbeya with live waybill tracking.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-charcoal-ink">Standard NECTA Ruling:</strong> Bleed-proof 70 GSM archival bond paper guaranteed across all books.
                  </span>
                </li>
              </ul>

              <div className="pt-3 border-t border-[#E7E5E0] flex items-center gap-2 text-xs text-[#B91C1C] font-semibold">
                <Clock className="w-4 h-4 text-[#B91C1C]" />
                <span>Response Time: Stamped proforma in &lt; 4 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

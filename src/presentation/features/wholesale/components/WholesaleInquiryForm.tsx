import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  ShieldCheck,
  Clock,
} from 'lucide-react';

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

  // Update quantityRange if prop changes
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
      `Email: ${formData.email}\n` +
      `Region / City: ${formData.city}\n` +
      `Product Line: ${formData.productType}\n` +
      `Carton Volume: ${formData.quantityRange}\n` +
      (formData.notes ? `Special Notes: ${formData.notes}\n` : '') +
      `\nPlease send official proforma invoice and dispatch waybill estimate.`;
    return `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section className="py-16 bg-white border-t border-stone-200" id="inquiry">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <div className="inline-flex items-center px-3.5 py-1 rounded-lg bg-gradient-to-r from-[#dc2626]/15 via-[#dc2626]/5 to-transparent border border-[#dc2626]/30 text-xs font-bold text-[#dc2626] font-mono uppercase tracking-widest shadow-xs">
            <span>DIRECT FACTORY PROFORMA DESK</span>
          </div>
          <h2 className="font-heading text-3xl font-bold text-[#18181b] tracking-tight">
            Request Official Wholesale Proforma Quote
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
            Submit your school, institution, or commercial order. Our sales desk in Soweto SIDO issues stamped proformas within 4 business hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-[#fafafa] rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            {formSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#18181b]">
                  Wholesale Inquiry Dispatched!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  Your reference number is{' '}
                  <strong className="font-mono text-[#111113]">{inquiryRefId}</strong>. A dedicated wholesale manager from our Soweto SIDO factory desk is reviewing your requirements.
                </p>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={copyInquiryRef}
                    className="px-4 py-2 rounded-full border border-stone-300 text-xs font-bold text-[#111113] inline-flex items-center gap-1.5 hover:bg-stone-100"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRef ? 'Copied Ref!' : 'Copy Reference ID'}</span>
                  </button>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={getFormWhatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ledup-mocha group px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md"
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
                    className="px-6 py-3 rounded-full border border-stone-300 text-xs font-bold text-[#111113] hover:bg-white"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#18181b] uppercase tracking-wider mb-1.5">
                      Business or School Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. Mbeya High School / Alpha Stationery"
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#18181b] focus:outline-none focus:border-[#111113]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18181b] uppercase tracking-wider mb-1.5">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="Headmaster / Procurement Officer"
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#18181b] focus:outline-none focus:border-[#111113]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#18181b] uppercase tracking-wider mb-1.5">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="procurement@institution.ac.tz"
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#18181b] focus:outline-none focus:border-[#111113]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18181b] uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+255 7XX XXX XXX"
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#18181b] focus:outline-none focus:border-[#111113]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181b] uppercase tracking-wider mb-1.5">
                    Destination City / Region in Tanzania *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Dar es Salaam, Dodoma, Arusha, Mwanza, Mbeya, Morogoro"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#18181b] focus:outline-none focus:border-[#111113]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#18181b] uppercase tracking-wider mb-1.5">
                      Product Category
                    </label>
                    <select
                      value={formData.productType}
                      onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#18181b] focus:outline-none focus:border-[#111113]"
                    >
                      <option>Counter Books (Q2, Q3, Q4)</option>
                      <option>School Exercise Books (32–200 Pages)</option>
                      <option>Kraft Bahasha Envelopes (A3, A4, A5)</option>
                      <option>Registers &amp; Examination Ruled Paper</option>
                      <option>Office Files &amp; Manila Folders</option>
                      <option>Mixed Full Catalog Wholesale Consignment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18181b] uppercase tracking-wider mb-1.5">
                      Estimated Volume
                    </label>
                    <select
                      value={formData.quantityRange}
                      onChange={(e) => setFormData({ ...formData, quantityRange: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#18181b] focus:outline-none focus:border-[#111113]"
                    >
                      <option>5 — 19 Cartons (20% OFF)</option>
                      <option>20 — 49 Cartons (30% OFF - Most Popular)</option>
                      <option>50 — 99 Cartons (40% OFF - Enterprise)</option>
                      <option>100+ Cartons (Commercial Tender Pricing)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181b] uppercase tracking-wider mb-1.5">
                    Special Requirements / Delivery Deadlines
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Custom school logo stamping, preferred bus parcel agency (Tahmeed, Shabiby, Abood), required delivery date, etc."
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-white border border-stone-200 text-[#18181b] focus:outline-none focus:border-[#111113]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-full btn-ledup-mocha group text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg min-h-[48px]"
                  >
                    <span>Submit Proforma Request →</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Live Sidebar Guarantee Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#18181b] text-white rounded-2xl p-6 sm:p-7 shadow-lg space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <ShieldCheck className="w-5 h-5 text-[#dc2626]" />
                <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                  Factory Procurement Guarantees
                </h4>
              </div>

              <ul className="space-y-3 text-xs text-stone-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">EFD Fiscal Receipt:</strong> Every wholesale consignment includes a genuine TRA electronic fiscal receipt.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Tamper-Proof Strapping:</strong> High-tensile plastic band strapping and waterproof inner lining.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Bus Waybill Terminal:</strong> Same-day dispatch to regional bus terminals in Mbeya with live waybill tracking.
                  </span>
                </li>
              </ul>

              <div className="pt-3 border-t border-white/10">
                <div className="text-[11px] text-stone-400">Direct Wholesale Hotlines:</div>
                <div className="text-xs font-mono font-bold text-[#dc2626] mt-1 space-y-0.5">
                  <div>Kanti Bhai K. Halai: +255 715 268 391 (Co-Founder &amp; MD)</div>
                  <div>Vijesh K. Halai: +255 624 265 480 (Co-Founder &amp; MD)</div>
                  <div>Branch: +255 746 268 391 (Mbeya SIDO Depot)</div>
                  <div>Branch: +255 699 032 777 (Mwanza Regional)</div>
                </div>
              </div>
            </div>

            {/* Regional Transit Timelines */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#111113]" />
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#18181b]">
                  Estimated Delivery Timelines
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="font-bold text-[#18181b] block">Dar es Salaam</span>
                  <span className="text-[11px] text-stone-500">24 — 36 Hours</span>
                </div>
                <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="font-bold text-[#18181b] block">Dodoma &amp; Singida</span>
                  <span className="text-[11px] text-stone-500">24 Hours</span>
                </div>
                <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="font-bold text-[#18181b] block">Arusha &amp; Moshi</span>
                  <span className="text-[11px] text-stone-500">36 Hours</span>
                </div>
                <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="font-bold text-[#18181b] block">Mwanza &amp; Lake Zone</span>
                  <span className="text-[11px] text-stone-500">36 — 48 Hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

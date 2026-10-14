import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ExternalLink,
  Edit3,
  Check,
  RotateCcw,
  Mail,
  Send,
  Building2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SEOHead } from '../components/SEOHead';
import { TRANSLATIONS } from '../data/translations';

export const ContactPage: React.FC = () => {
  const { storeConfig, updateStoreConfig, language } = useStore();
  const t = TRANSLATIONS[language];

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubject, setInquirySubject] = useState('School Booklist / Bulk Stationery Inquiry');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [selectedDesk, setSelectedDesk] = useState<string>('255715268391');

  const formattedInquiryText = [
    `*${storeConfig.businessName} — Customer Inquiry*`,
    `----------------------------------------`,
    `Customer Name: ${inquiryName.trim() || 'Visitor'}`,
    `Phone / WhatsApp: ${inquiryPhone.trim() || 'Not provided'}`,
    `Topic: ${inquirySubject}`,
    `Message: ${inquiryMessage.trim() || 'Please share stationery availability and wholesale prices.'}`,
    `----------------------------------------`,
    `Sent from OMEGA Official Website`,
  ].join('\n');

  const inquiryWhatsappUrl = `https://wa.me/${selectedDesk}?text=${encodeURIComponent(
    formattedInquiryText
  )}`;

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.open(inquiryWhatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 w-full max-w-full overflow-hidden">
      <SEOHead
        title="Contact Us &amp; Official Desks — OMEGA Tanzania"
        description="Official contact numbers (+255 715 268 391, +255 624 265 480, +255 699 032 777), WhatsApp ordering desks, and store location in Dar es Salaam."
      />

      {/* Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-red-700">
            {language === 'sw' ? 'Mawasiliano Rasmi ya OMEGA' : 'Official OMEGA Tanzanian Directory'}
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 font-serif-luxury">
            {t.contact}
          </h1>
          <p className="text-sm sm:text-base text-stone-600">
            {language === 'sw'
              ? 'Wasiliana nasi kwa simu, WhatsApp, au fika stoo yetu Dar es Salaam. Tunasambaza mikoani kote Tanzania.'
              : 'Reach our sales and logistics desks via direct phone calls or WhatsApp. We deliver wholesale and retail orders across all regions of Tanzania.'}
          </p>
        </div>
      </div>

      {/* 3 Official Phone Desks Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Desk 1 */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4 hover:border-red-500 transition-all">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-700 bg-red-50 px-2 py-0.5 rounded">
              Sales Desk 1
            </span>
            <h3 className="text-lg font-black text-stone-900 mt-1">General Orders</h3>
            <p className="text-base font-mono font-bold text-stone-800 mt-1">+255 715 268 391</p>
            <p className="text-xs text-stone-500 mt-1">
              Notebook and stationery retail orders &amp; product inquiries.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-2">
            <a
              href="tel:+255715268391"
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-colors"
            >
              Voice Call
            </a>
            <a
              href={`https://wa.me/255715268391?text=${encodeURIComponent(
                'Habari OMEGA Desk 1, ninahitaji kuagiza madaftari.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Desk 2 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-blue-500 transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Wholesale Desk 2
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1">Schools &amp; Tenders</h3>
            <p className="text-base font-mono font-bold text-slate-800 mt-1">+255 624 265 480</p>
            <p className="text-xs text-slate-500 mt-1">
              Carton quantity bulk pricing for schools, colleges, and bookstores.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-2">
            <a
              href="tel:+255624265480"
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-colors"
            >
              Voice Call
            </a>
            <a
              href={`https://wa.me/255624265480?text=${encodeURIComponent(
                'Habari OMEGA Wholesale Desk 2, naomba quotation ya katoni za madaftari.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Desk 3 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-blue-500 transition-all">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              Logistics Desk 3
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1">Support &amp; Mikoani</h3>
            <p className="text-base font-mono font-bold text-slate-800 mt-1">+255 699 032 777</p>
            <p className="text-xs text-slate-500 mt-1">
              Parcel dispatch tracking, bus freight, and delivery confirmations.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-2">
            <a
              href="tel:+255699032777"
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-colors"
            >
              Voice Call
            </a>
            <a
              href={`https://wa.me/255699032777?text=${encodeURIComponent(
                'Habari OMEGA Desk 3, nina swali kuhusu kusafirisha mzigo mikoani.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Split: Form & Location Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Direct WhatsApp Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif-luxury">
              {language === 'sw' ? 'Tuma Ujumbe Moja kwa Moja WhatsApp' : 'Send Instant WhatsApp Inquiry'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Fill in your requirement below and click send to open prefilled chat with our team.
            </p>
          </div>

          <form onSubmit={handleSubmitInquiry} className="space-y-4">
            {/* Target Desk Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Choose Department Desk
              </label>
              <select
                value={selectedDesk}
                onChange={(e) => setSelectedDesk(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-medium"
              >
                <option value="255715268391">Desk 1: General Orders (+255 715 268 391)</option>
                <option value="255624265480">Desk 2: Wholesale &amp; Schools (+255 624 265 480)</option>
                <option value="255699032777">Desk 3: Logistics &amp; Upcountry (+255 699 032 777)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  {t.phoneNumber}
                </label>
                <input
                  type="tel"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  placeholder="+255..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Subject / Topic
              </label>
              <input
                type="text"
                value={inquirySubject}
                onChange={(e) => setInquirySubject(e.target.value)}
                placeholder="e.g. Quire 2, 3, 4 Carton Pricing"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Your Message / Product List
              </label>
              <textarea
                rows={4}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Write your notebook quantity, size, or delivery location..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-700/25"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Launch WhatsApp Chat</span>
            </button>
          </form>
        </div>

        {/* Right Column: Physical Location & Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-blue-700">
              <MapPin className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">
                Shop &amp; Warehouse Address
              </h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {language === 'sw' ? storeConfig.shopAddressSw : storeConfig.shopAddress}
            </p>
            <div className="pt-2">
              <a
                href={storeConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
              >
                <span>Open on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-emerald-700">
              <Clock className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">
                {t.workingHours}
              </h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {language === 'sw' ? storeConfig.businessHoursSw : storeConfig.businessHours}
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-amber-700">
              <Mail className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">
                Official Email
              </h3>
            </div>
            <p className="text-sm font-mono text-slate-800">
              {storeConfig.emailAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

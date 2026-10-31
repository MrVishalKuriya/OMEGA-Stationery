import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  Building2,
  Truck,
  Package,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { SEOHead } from '@/components/SEOHead';
import { TRANSLATIONS } from '@/data/translations';

export const ContactPage: React.FC = () => {
  const { language } = useStore();
  const t = TRANSLATIONS[language];

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryOrg, setInquiryOrg] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubject, setInquirySubject] = useState('B2B Wholesale Carton Pricing');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [selectedDesk, setSelectedDesk] = useState<string>('255715268391');

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const formattedInquiryText = [
    `*OMEGA STATIONERY & BOOKS — INQUIRY*`,
    `----------------------------------------`,
    `Contact Name: ${inquiryName.trim() || 'Valued Customer'}`,
    `School / Company: ${inquiryOrg.trim() || 'Independent Order'}`,
    `Phone: ${inquiryPhone.trim() || 'Not provided'}`,
    `Topic: ${inquirySubject}`,
    `Message: ${inquiryMessage.trim() || 'Please share product availability, wholesale prices, and bus parcel dispatch schedule.'}`,
    `----------------------------------------`,
    `Sent via OMEGA Official Directory`,
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

  const salesDesks = [
    {
      id: 'desk-boss-1',
      title: 'KANTI BHAI K. HALAI: Co-Founder & Managing Director',
      phone: '+255 715 268 391',
      numberDigits: '255715268391',
      tag: 'KANTI BHAI K. HALAI',
      desc: language === 'sw'
        ? 'Mawasiliano ya moja kwa moja ya uongozi mkuu kwa oda maalum, maswali ya mikataba na oda za haraka.'
        : 'Co-Founder & Managing Director - direct line for priority purchasing, special contract terms, and escalated service.',
    },
    {
      id: 'desk-boss-2',
      title: 'VIJESH K. HALAI: Co-Founder & Managing Director',
      phone: '+255 624 265 480',
      numberDigits: '255624265480',
      tag: 'VIJESH K. HALAI',
      desc: language === 'sw'
        ? 'Mkurugenzi Mtendaji na Mwanzilishi Mwenza anayesimamia uzalishaji, bei za katoni na mikataba mikubwa ya B2B.'
        : 'Co-Founder & Managing Director overseeing factory production dispatches, volume carton pricing, and distributor supply.',
    },
    {
      id: 'desk-branch-mbeya',
      title: language === 'sw' ? 'Tawi la Mbeya: Kiwanda cha Soweto SIDO' : 'Mbeya Branch: Soweto SIDO Factory Depot',
      phone: '+255 746 268 391',
      numberDigits: '255746268391',
      tag: 'Mbeya Branch',
      desc: language === 'sw'
        ? 'Ofisi ya kiwandani Soweto SIDO Viwandani Mbeya. Mauzo ya rejareja, stoo kuu, na vifurushi vya mabasi mikoani.'
        : 'Main production facility depot in Soweto SIDO Viwandani, Mbeya. Retail walk-ins, stock checks, and regional bus dispatch.',
    },
    {
      id: 'desk-branch-mwanza',
      title: language === 'sw' ? 'Tawi la Mwanza: Usambazaji Kanda ya Ziwa' : 'Mwanza Branch: Lake Zone Regional Desk',
      phone: '+255 699 032 777',
      numberDigits: '255699032777',
      tag: 'Mwanza Branch',
      desc: language === 'sw'
        ? 'Tawi letu la Mwanza linalohudumia mikoa ya Ziwa (Mwanza, Geita, Mara, Kagera, Simiyu, Shinyanga).'
        : 'Dedicated regional branch hub for Lake Zone fulfillment across Mwanza, Geita, Mara, Kagera, and Shinyanga.',
    },
  ];

  const faqs = [
    {
      q: language === 'sw' ? 'Mizigo ya mikoani inasafirishwaje?' : 'How are upcountry bus parcel orders delivered?',
      a: language === 'sw'
        ? 'Mizigo yote ya mikoani nje ya Mbeya na Dar es Salaam inafungashwa vizuri kwa katoni imara za OMEGA na kukabidhiwa kwenye ofisi za mabasi ya kuaminika (kama Shabiby, BM Coach, Abood, New Force, Saibaba). Unapewa picha ya stakabadhi na namba ya waybill ndani ya saa chache.'
        : 'All upcountry orders outside Mbeya and Dar es Salaam are securely packed in heavy OMEGA branded cartons and dispatched via reputable bus companies (Shabiby, BM Coach, Abood, New Force, Saibaba). You receive a photo of the bus parcel waybill and driver receipt immediately.',
    },
    {
      q: language === 'sw' ? 'Kiwango cha chini cha kuagiza kwa bei ya jumla ni nini?' : 'What is the minimum quantity for wholesale carton pricing?',
      a: language === 'sw'
        ? 'Kiwango cha chini cha bei ya jumla ni katoni 1 (ina vitabu 48 vya Q2, 36 vya Q3, au 24 vya Q4). Kwa katoni 5 na kuendelea unapata punguzo la 10%, na kuanzia katoni 20 unapata punguzo la 18% kutoka kiwandani.'
        : 'Wholesale pricing starts at just 1 carton (48 pcs for Q2, 36 pcs for Q3, 24 pcs for Q4). Tier 1 volume savings of 10% apply at 5+ cartons, and maximum tier savings of 18% apply at 20+ cartons.',
    },
    {
      q: language === 'sw' ? 'Njia gani za malipo zinakubalika?' : 'What payment methods do you accept?',
      a: language === 'sw'
        ? 'Tunapokea malipo kupitia M-Pesa Lipa Namba, Mixx by Yas, Airtel Money, pamoja na akaunti za benki (CRDB Bank na NMB Bank). Stakabadhi rasmi ya TRA (EFD Receipt) inatolewa kwa kila malipo.'
        : 'We accept M-Pesa Lipa Namba, Mixx by Yas, Airtel Money, and direct bank transfers (CRDB Bank and NMB Bank). Official TRA EFD receipts and stamped proforma invoices are issued for all orders.',
    },
    {
      q: language === 'sw' ? 'Je, ninaweza kuja kuchukua mzigo wangu stoo?' : 'Can I collect my order directly from the warehouse?',
      a: language === 'sw'
        ? 'Ndiyo! Unaweza kuchukua mzigo wako moja kwa moja kwenye stoo yetu kuu ya Soweto SIDO Mbeya au kituo chetu cha usambazaji Kariakoo, Dar es Salaam bila gharama za ziada za usafirishaji.'
        : 'Yes! Self-pickup is welcome at both our Central Bindery in Soweto SIDO Mbeya and our Commercial Dispatch Hub in Kariakoo, Dar es Salaam during normal operating hours (Monday to Saturday).',
    },
  ];

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-[#26130F]">
      <SEOHead
        title="Contact Us & Official Sales Desks — OMEGA Stationery Tanzania"
        description="Official contact numbers: Kanti Bhai K. Halai (+255 715 268 391), Vijesh K. Halai (+255 624 265 480), Mbeya Branch (+255 746 268 391), Mwanza Branch (+255 699 032 777), WhatsApp ordering desks, factory depots in Mbeya and Kariakoo."
      />

      {/* 1. Hero Header */}
      <section className="relative overflow-hidden w-full bg-gradient-to-r from-[#6B140B] via-[#852512] to-[#9E3618] text-white py-12 lg:py-16 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center px-3.5 py-1.5 bg-[#E9A858] text-[#26130F] text-xs font-semibold font-mono shadow-xs">
              <span>Desks Active: Mon – Sat (08:00 – 18:00 EAT)</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-black text-white leading-tight">
              {language === 'sw' ? 'Mawasiliano Rasmi na' : 'Official Directory &'} <br />
              <span className="text-[#E9A858]">
                {language === 'sw' ? 'Madawati ya Mauzo OMEGA.' : 'Ordering Desks — Tanzania.'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
              {language === 'sw'
                ? 'Wasiliana moja kwa moja na madawati yetu ya mauzo kwa simu au WhatsApp. Tunahudumia oda za jumla na rejareja katika mikoa yote ya Tanzania kupitia vituo vyetu vya Mbeya na Kariakoo.'
                : 'Connect directly with our dedicated phone and WhatsApp dispatch lines. We deliver wholesale carton tenders and retail stationery parcels across all 31 regions of Tanzania.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Four Dedicated Hotlines */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9E3618] font-heading block">
              DEDICATED HOTLINES
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#26130F]">
              {language === 'sw' ? 'Madawati Rasmi ya Simu & WhatsApp' : 'Direct Order & Support Hotlines'}
            </h2>
            <p className="text-xs sm:text-sm text-[#7D685E] max-w-lg mx-auto">
              {language === 'sw'
                ? 'Chagua dawati husika kulingana na aina ya oda yako kwa huduma ya haraka zaidi.'
                : 'Choose the appropriate department below for instant quotes and dispatch coordination.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {salesDesks.map((desk) => (
              <div
                key={desk.id}
                className="p-6 bg-[#FAF6F0] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-[#E9A858] text-[#26130F]">
                      {desk.tag}
                    </span>
                    <span className="w-2.5 h-2.5 bg-emerald-500 inline-block" title="Online" />
                  </div>

                  <h3 className="font-heading font-bold text-sm text-[#26130F] line-clamp-2">
                    {desk.title}
                  </h3>

                  <p className="font-mono text-base font-bold text-[#9E3618]">
                    {desk.phone}
                  </p>

                  <p className="text-xs text-[#7D685E] leading-relaxed line-clamp-3">
                    {desk.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D8C3A5]/40 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${desk.numberDigits}`}
                    className="py-2.5 px-3 bg-white text-[#26130F] text-xs font-bold text-center transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#D8C3A5]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#9E3618]" />
                    <span>Call</span>
                  </a>

                  <a
                    href={`https://wa.me/${desk.numberDigits}?text=${encodeURIComponent(
                      language === 'sw'
                        ? `Habari OMEGA Tanzania, ninahitaji msaada wa kuweka oda ya madaftari.`
                        : `Hello OMEGA Stationery, I would like to inquire about placing a notebook order.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-[#9E3618] hover:bg-[#6B140B] text-white text-xs font-bold text-center transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Interactive Inquiry Form + Depot Locations */}
      <section className="py-14 lg:py-20 bg-[#FAF6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
            {/* Left: Interactive Inquiry Form */}
            <div className="lg:col-span-7 bg-white p-7 sm:p-9 shadow-xs space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9E3618] font-heading block">
                  FAST QUOTATION
                </span>
                <h2 className="font-heading text-2xl font-bold text-[#26130F]">
                  {language === 'sw' ? 'Tuma Ombi la Bei au Proforma' : 'Request Instant Proforma Quotation'}
                </h2>
                <p className="text-xs text-[#7D685E]">
                  {language === 'sw'
                    ? 'Jaza taarifa zako hapa chini kupata makadirio rasmi ya gharama yaliyofomatiwa moja kwa moja.'
                    : 'Fill out your requirements below to automatically generate an official inquiry message on WhatsApp.'}
                </p>
              </div>

              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#26130F] uppercase">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="e.g. Mwalimu Joseph Mwita"
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] text-xs text-[#26130F] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#26130F] uppercase">School / Business Name</label>
                    <input
                      type="text"
                      value={inquiryOrg}
                      onChange={(e) => setInquiryOrg(e.target.value)}
                      placeholder="e.g. St. Peter Secondary School"
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] text-xs text-[#26130F] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#26130F] uppercase">WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="e.g. 0746 268 391"
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] text-xs text-[#26130F] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#26130F] uppercase">Route To Desk</label>
                    <select
                      value={selectedDesk}
                      onChange={(e) => setSelectedDesk(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] text-xs text-[#26130F] focus:outline-none cursor-pointer"
                    >
                      <option value="255715268391">KANTI BHAI K. HALAI (+255 715 268 391) — Co-Founder &amp; MD</option>
                      <option value="255624265480">VIJESH K. HALAI (+255 624 265 480) — Co-Founder &amp; MD</option>
                      <option value="255746268391">Mbeya Branch (+255 746 268 391) — SIDO Factory</option>
                      <option value="255699032777">Mwanza Branch (+255 699 032 777) — Lake Zone</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#26130F] uppercase">Inquiry Topic</label>
                  <select
                    value={inquirySubject}
                    onChange={(e) => setInquirySubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] text-xs text-[#26130F] focus:outline-none cursor-pointer"
                  >
                    <option value="B2B Wholesale Carton Pricing">B2B Wholesale Carton Pricing (5+ Boxes)</option>
                    <option value="School Syllabus Booklist Tender">School Syllabus Booklist Tender</option>
                    <option value="Counter Books Q2, Q3, Q4 Order">Counter Books (Q2, Q3, Q4) Direct Order</option>
                    <option value="Kraft Bahasha Envelope Supply">Kraft Bahasha &amp; Filing Supplies</option>
                    <option value="Upcountry Bus Parcel Waybill Check">Upcountry Bus Parcel Waybill Tracking</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#26130F] uppercase">Your Requirements / Order Details</label>
                  <textarea
                    rows={4}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Specify required book types, quantities (e.g. 10 cartons of Q3 Counter Books, 5 cartons of 200p single line), and your delivery region..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] text-xs text-[#26130F] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-[#9E3618] hover:bg-[#6B140B] text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer min-h-[46px]"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{language === 'sw' ? 'Tuma Kupitia WhatsApp' : 'Send Quotation Request via WhatsApp'}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </form>
            </div>

            {/* Right: Depot Locations */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 bg-white space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-[#9E3618]">
                  <Building2 className="w-5 h-5 text-[#9E3618]" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#9E3618]">
                    MAIN WORKS &amp; CENTRAL STOO
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-[#26130F]">
                  Soweto SIDO Industrial Estate
                </h3>
                <p className="text-xs text-[#7D685E] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#9E3618] shrink-0" />
                  <span>Mbeya City, Southern Highlands, Tanzania</span>
                </p>
                <p className="text-xs text-[#7D685E] leading-relaxed">
                  Direct factory pickup for schools and wholesalers in Mbeya, Songwe, Iringa, Ruvuma, and Rukwa.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#26130F] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#9E3618]" />
                  <span>Mon – Sat: 08:00 – 17:30 EAT</span>
                </div>
              </div>

              <div className="p-6 bg-white space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-[#9E3618]">
                  <Truck className="w-5 h-5 text-[#9E3618]" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#9E3618]">
                    DISPATCH &amp; COMMERCIAL DEPOT
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-[#26130F]">
                  Kariakoo Commercial District
                </h3>
                <p className="text-xs text-[#7D685E] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#9E3618] shrink-0" />
                  <span>Dar es Salaam, Coastal Region, Tanzania</span>
                </p>
                <p className="text-xs text-[#7D685E] leading-relaxed">
                  Hub for daily bus parcel drop-offs to all upcountry routes via Magufuli Bus Terminal &amp; Kariakoo courier depots.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#26130F] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#9E3618]" />
                  <span>Mon – Sat: 08:00 – 18:00 EAT</span>
                </div>
              </div>

              <div className="p-5 bg-[#6B140B] text-white space-y-2">
                <div className="flex items-center gap-2 text-[#E9A858]">
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Bus Parcel Packaging Protocol</span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed">
                  Every carton is double-strapped with waterproof tape and marked with clear consignee name, destination town, and phone number before bus terminal drop-off.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9E3618] font-heading block">
              HELP &amp; INQUIRIES
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#26130F]">
              {language === 'sw' ? 'Maswali Yanayoulizwa Mara kwa Mara' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#FAF6F0] shadow-xs overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left font-heading font-bold text-sm text-[#26130F] flex items-center justify-between gap-4 hover:text-[#9E3618] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#9E3618] shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#7D685E] leading-relaxed border-t border-[#D8C3A5]/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default ContactPage;

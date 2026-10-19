import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  Building2,
  CheckCircle2,
  Truck,
  Package,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SEOHead } from '../components/SEOHead';
import { TRANSLATIONS } from '../data/translations';

export const ContactPage: React.FC = () => {
  const { storeConfig, language } = useStore();
  const t = TRANSLATIONS[language];

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryOrg, setInquiryOrg] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubject, setInquirySubject] = useState('B2B Wholesale Carton Pricing');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [selectedDesk, setSelectedDesk] = useState<string>('255746268391');

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
      id: 'desk-1',
      title: language === 'sw' ? 'Dawati 1: Mauzo ya Jumla & Rejareja' : 'Desk 1: General & Retail Inquiries',
      phone: '+255 746 268 391',
      numberDigits: '255746268391',
      tag: 'General Sales',
      desc: language === 'sw'
        ? 'Oda za vitabu vya Counter Books na vifaa vya shule kwa maduka ya rejareja na watu binafsi.'
        : 'Assistance with single orders, retail counter books, student sets, and catalogue downloads.',
    },
    {
      id: 'desk-2',
      title: language === 'sw' ? 'Dawati 2: Katoni za Kiwanda (B2B)' : 'Desk 2: B2B Wholesale & Cartons',
      phone: '+255 624 265 480',
      numberDigits: '255624265480',
      tag: 'Wholesale Tenders',
      desc: language === 'sw'
        ? 'Bei za punguzo za katoni (5 hadi 50+ katoni) kwa maduka ya jumla na wasambazaji wa mikoani.'
        : 'Tiered volume carton orders, distributor contracts, and direct factory waybill dispatches.',
    },
    {
      id: 'desk-3',
      title: language === 'sw' ? 'Dawati 3: Zabuni za Shule & Taasisi' : 'Desk 3: Institutional & School Tenders',
      phone: '+255 689 032 777',
      numberDigits: '255689032777',
      tag: 'School Contracts',
      desc: language === 'sw'
        ? 'Utoaji wa proforma invoice rasmi za manunuzi ya shule, orodha za vitabu (booklists), na majalada ya ofisi.'
        : 'Official government/private school tenders, syllabi booklists, stamped invoices, and board quotations.',
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
        ? 'Tunapokea malipo kupitia M-Pesa Lipa Namba, Airtel Money, Tigo Pesa, pamoja na akaunti za benki (CRDB Bank na NMB Bank). Stakabadhi rasmi ya TRA (EFD Receipt) inatolewa kwa kila malipo.'
        : 'We accept M-Pesa Lipa Namba, Airtel Money, Tigo Pesa, and direct bank transfers (CRDB Bank and NMB Bank). Official TRA EFD receipts and stamped proforma invoices are issued for all orders.',
    },
    {
      q: language === 'sw' ? 'Je, ninaweza kuja kuchukua mzigo wangu stoo?' : 'Can I collect my order directly from the warehouse?',
      a: language === 'sw'
        ? 'Ndiyo! Unaweza kuchukua mzigo wako moja kwa moja kwenye stoo yetu kuu ya Soweto SIDO Mbeya au kituo chetu cha usambazaji Kariakoo, Dar es Salaam bila gharama za ziada za usafirishaji.'
        : 'Yes! Self-pickup is welcome at both our Central Bindery in Soweto SIDO Mbeya and our Commercial Dispatch Hub in Kariakoo, Dar es Salaam during normal operating hours (Monday to Saturday).',
    },
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#3b352f]">
      <SEOHead
        title="Contact Us & Official Sales Desks — OMEGA Stationery Tanzania"
        description="Official contact numbers (+255 746 268 391, +255 624 265 480, +255 689 032 777), WhatsApp ordering desks, factory depots in Mbeya and Kariakoo."
      />

      {/* ==================== 1. HERO HEADER ==================== */}
      <section className="relative overflow-hidden w-full bg-[#4b423b] text-white py-14 lg:py-20 border-b border-[#3b352f]">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[#c49b7c]/18 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[550px] h-[550px] bg-[#a46b44]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#c49b7c] bg-white/10 border border-[#c49b7c]/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Desks Active: Mon – Sat (08:00 – 18:00 EAT)</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-light text-white leading-tight">
              {language === 'sw' ? 'Mawasiliano Rasmi na' : 'Official Directory &'} <br />
              <span className="font-bold text-[#c49b7c] bg-gradient-to-r from-[#c49b7c] via-white to-[#c49b7c] bg-clip-text text-transparent">
                {language === 'sw' ? 'Madawati ya Mauzo OMEGA.' : 'Ordering Desks — Tanzania.'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-normal">
              {language === 'sw'
                ? 'Wasiliana moja kwa moja na madawati yetu ya mauzo kwa simu au WhatsApp. Tunahudumia oda za jumla na rejareja katika mikoa yote ya Tanzania kupitia vituo vyetu vya Mbeya na Kariakoo.'
                : 'Connect directly with our dedicated phone and WhatsApp dispatch lines. We deliver wholesale carton tenders and retail stationery parcels across all 31 regions of Tanzania.'}
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 2. 3 DEDICATED PHONE DESKS ==================== */}
      <section className="py-12 lg:py-16 bg-white border-b border-[#e2dedb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c49b7c] font-heading block">
              DEDICATED HOTLINES
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#3b352f]">
              {language === 'sw' ? 'Madawati 3 Rasmi ya Simu & WhatsApp' : 'Three Direct Order & Support Hotlines'}
            </h2>
            <p className="text-xs sm:text-sm text-[#736c67] max-w-lg mx-auto">
              {language === 'sw'
                ? 'Chagua dawati husika kulingana na aina ya oda yako kwa huduma ya haraka zaidi.'
                : 'Choose the appropriate department below for instant quotes and dispatch coordination.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {salesDesks.map((desk) => (
              <div
                key={desk.id}
                className="p-6 rounded-[20px] bg-[#fafafa] border border-[#e2dedb] hover:border-[#c49b7c] transition-all space-y-4 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#4b423b] text-[#c49b7c]">
                      {desk.tag}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Online" />
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#3b352f]">
                    {desk.title}
                  </h3>

                  <p className="font-mono text-lg font-bold text-[#4b423b]">
                    {desk.phone}
                  </p>

                  <p className="text-xs text-[#736c67] leading-relaxed">
                    {desk.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#e2dedb] grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${desk.numberDigits}`}
                    className="py-2.5 px-3 rounded-full bg-white hover:bg-[#f5f4f4] text-[#3b352f] border border-[#e2dedb] text-xs font-bold text-center transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#4b423b]" />
                    <span>Call Desk</span>
                  </a>

                  <a
                    href={`https://wa.me/${desk.numberDigits}?text=${encodeURIComponent(
                      language === 'sw'
                        ? `Habari OMEGA Tanzania, ninahitaji msaada wa kuweka oda ya madaftari.`
                        : `Hello OMEGA Stationery, I would like to inquire about placing a notebook order.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold text-center transition-all inline-flex items-center justify-center gap-1.5 shadow-xs"
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

      {/* ==================== 3. INTERACTIVE INQUIRY FORM + DEPOT LOCATIONS ==================== */}
      <section className="py-14 lg:py-20 bg-[#fafafa] border-b border-[#e2dedb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Interactive Inquiry Form */}
            <div className="lg:col-span-7 bg-white p-7 sm:p-9 rounded-[24px] border border-[#e2dedb] shadow-xs space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c49b7c] font-heading block">
                  FAST QUOTATION
                </span>
                <h2 className="font-heading text-2xl font-bold text-[#3b352f]">
                  {language === 'sw' ? 'Tuma Ombi la Bei au Proforma' : 'Request Instant Proforma Quotation'}
                </h2>
                <p className="text-xs text-[#736c67]">
                  {language === 'sw'
                    ? 'Jaza taarifa zako hapa chini kupata makadirio rasmi ya gharama yaliyofomatiwa moja kwa moja.'
                    : 'Fill out your requirements below to automatically generate an official inquiry message on WhatsApp.'}
                </p>
              </div>

              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4b423b] uppercase">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="e.g. Mwalimu Joseph Mwita"
                      className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#e2dedb] text-xs focus:ring-1 focus:ring-[#4b423b] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4b423b] uppercase">School / Business Name</label>
                    <input
                      type="text"
                      value={inquiryOrg}
                      onChange={(e) => setInquiryOrg(e.target.value)}
                      placeholder="e.g. St. Peter Secondary School"
                      className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#e2dedb] text-xs focus:ring-1 focus:ring-[#4b423b] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4b423b] uppercase">WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="e.g. 0746 268 391"
                      className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#e2dedb] text-xs focus:ring-1 focus:ring-[#4b423b] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4b423b] uppercase">Route To Desk</label>
                    <select
                      value={selectedDesk}
                      onChange={(e) => setSelectedDesk(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#e2dedb] text-xs focus:ring-1 focus:ring-[#4b423b] focus:outline-none bg-white"
                    >
                      <option value="255746268391">Sales Desk 1 (+255 746 268 391)</option>
                      <option value="255624265480">Wholesale Desk 2 (+255 624 265 480)</option>
                      <option value="255689032777">Institutional Tender Desk 3 (+255 689 032 777)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4b423b] uppercase">Inquiry Topic</label>
                  <select
                    value={inquirySubject}
                    onChange={(e) => setInquirySubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#e2dedb] text-xs focus:ring-1 focus:ring-[#4b423b] focus:outline-none bg-white"
                  >
                    <option value="B2B Wholesale Carton Pricing">B2B Wholesale Carton Pricing (5+ Boxes)</option>
                    <option value="School Syllabus Booklist Tender">School Syllabus Booklist Tender</option>
                    <option value="Counter Books Q2, Q3, Q4 Order">Counter Books (Q2, Q3, Q4) Direct Order</option>
                    <option value="Kraft Bahasha Envelope Supply">Kraft Bahasha &amp; Filing Supplies</option>
                    <option value="Upcountry Bus Parcel Waybill Check">Upcountry Bus Parcel Waybill Tracking</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4b423b] uppercase">Your Requirements / Order Details</label>
                  <textarea
                    rows={4}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Specify required book types, quantities (e.g. 10 cartons of Q3 Counter Books, 5 cartons of 200p single line), and your delivery region..."
                    className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#e2dedb] text-xs focus:ring-1 focus:ring-[#4b423b] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full btn-ledup-copper text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span className="text-white">{language === 'sw' ? 'Tuma Kupitia WhatsApp' : 'Send Quotation Request via WhatsApp'}</span>
                  <ArrowRight className="w-4 h-4 text-white ledup-arrow-icon" />
                </button>
              </form>
            </div>

            {/* Right: Depot Locations & Operating Standards */}
            <div className="lg:col-span-5 space-y-6">
              {/* Depot 1: Mbeya */}
              <div className="p-6 rounded-[20px] bg-white border border-[#e2dedb] space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-[#c49b7c]">
                  <Building2 className="w-5 h-5 text-[#4b423b]" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#4b423b]">
                    MAIN WORKS &amp; CENTRAL STOO
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-[#3b352f]">
                  Soweto SIDO Industrial Estate
                </h3>
                <p className="text-xs text-[#736c67] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#c49b7c] shrink-0" />
                  <span>Mbeya City, Southern Highlands, Tanzania</span>
                </p>
                <p className="text-xs text-[#736c67] leading-relaxed">
                  Direct factory pickup for schools and wholesalers in Mbeya, Songwe, Iringa, Ruvuma, and Rukwa.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#4b423b] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#2A9D8F]" />
                  <span>Mon – Sat: 08:00 – 17:30 EAT</span>
                </div>
              </div>

              {/* Depot 2: Kariakoo */}
              <div className="p-6 rounded-[20px] bg-white border border-[#e2dedb] space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-[#c49b7c]">
                  <Truck className="w-5 h-5 text-[#4b423b]" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#4b423b]">
                    DISPATCH &amp; COMMERCIAL DEPOT
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-[#3b352f]">
                  Kariakoo Commercial District
                </h3>
                <p className="text-xs text-[#736c67] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#c49b7c] shrink-0" />
                  <span>Dar es Salaam, Coastal Region, Tanzania</span>
                </p>
                <p className="text-xs text-[#736c67] leading-relaxed">
                  Hub for daily bus parcel drop-offs to all upcountry routes via Magufuli Bus Terminal &amp; Kariakoo courier depots.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#4b423b] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#2A9D8F]" />
                  <span>Mon – Sat: 08:00 – 18:00 EAT</span>
                </div>
              </div>

              {/* Logistics Assurance */}
              <div className="p-5 rounded-[16px] bg-[#4b423b] text-white space-y-2">
                <div className="flex items-center gap-2 text-[#c49b7c]">
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Bus Parcel Packaging Protocol</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Every carton is double-strapped with waterproof tape and marked with clear consignee name, destination town, and phone number before bus terminal drop-off.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. FREQUENTLY ASKED QUESTIONS (FAQ) ==================== */}
      <section className="py-14 lg:py-20 bg-white border-b border-[#e2dedb]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c49b7c] font-heading block">
              HELP &amp; INQUIRIES
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#3b352f]">
              {language === 'sw' ? 'Maswali Yanayoulizwa Mara kwa Mara' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-[16px] border border-[#e2dedb] overflow-hidden bg-[#fafafa] transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left font-heading font-bold text-sm text-[#3b352f] flex items-center justify-between gap-4 hover:text-[#c49b7c] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#c49b7c] shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#736c67] leading-relaxed border-t border-[#e2dedb]/60">
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

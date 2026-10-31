import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUp,
  Building2,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { TRANSLATIONS } from '@/data/translations';
import {
  IconBleedProofPaper,
  IconLayFlatSpine,
  IconNationwideBus,
  IconQualitySeal,
  IconWhatsAppCustom,
} from '@/presentation/common/components/CustomIcons';

export const Footer: React.FC = () => {
  const { language, wishlistCount, storeConfig, openCookiePreferences } = useStore();
  const t = (TRANSLATIONS[language] || TRANSLATIONS.en) as any;

  const cleanWhatsappDigits = (storeConfig?.whatsappNumber || '255715268391').replace(/\D/g, '');
  const hotline = storeConfig?.phoneNumber || '+255 715 268 391';

  return (
    <footer
      className="bg-[#111113] text-[#FFFFFF] border-t-4 border-[#DC2626] relative overflow-hidden"
      role="contentinfo"
    >
      {/* 1. TOP ARCHITECTURAL TRUST & MANUFACTURING PILLARS */}
      <div className="bg-[#18181B] border-b border-[#27272A]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-r border-[#27272A]">
            {/* Pillar 1: Bus Delivery */}
            <div className="p-5 sm:p-6 bg-[#18181B] hover:bg-[#1E1E22] border-b lg:border-b-0 sm:border-r border-[#27272A] transition-colors text-left flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-[2px] bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <IconNationwideBus className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-[#FFFFFF] font-heading truncate">
                  {language === 'sw' ? 'Mabasi Mikoa Yote 31' : '31 Regions Bus Freight'}
                </h5>
                <p className="text-xs text-[#D4D4D8] leading-snug mt-0.5 truncate font-normal">
                  {language === 'sw' ? 'Kutumiwa siku hiyo hiyo' : 'Same-day parcel waybills'}
                </p>
              </div>
            </div>

            {/* Pillar 2: Smyth-Sewn Spines */}
            <div className="p-5 sm:p-6 bg-[#18181B] hover:bg-[#1E1E22] border-b lg:border-b-0 lg:border-r border-[#27272A] transition-colors text-left flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-[2px] bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <IconLayFlatSpine className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-[#FFFFFF] font-heading truncate">
                  {language === 'sw' ? 'Mshono wa Uzi 180°' : 'Smyth-Sewn Binding'}
                </h5>
                <p className="text-xs text-[#D4D4D8] leading-snug mt-0.5 truncate font-normal">
                  {language === 'sw' ? 'Hujifungua tambarare kabisa' : 'Thread-stitched lay-flat'}
                </p>
              </div>
            </div>

            {/* Pillar 3: 70 GSM Bleed-Proof Paper */}
            <div className="p-5 sm:p-6 bg-[#18181B] hover:bg-[#1E1E22] border-b sm:border-b-0 sm:border-r border-[#27272A] transition-colors text-left flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-[2px] bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <IconBleedProofPaper className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-[#FFFFFF] font-heading truncate">
                  {language === 'sw' ? 'Karatasi Nzito 70 GSM' : '70 GSM Bleed-Proof'}
                </h5>
                <p className="text-xs text-[#D4D4D8] leading-snug mt-0.5 truncate font-normal">
                  {language === 'sw' ? 'Haivujishi wino kabisa' : 'Zero ink bleed guarantee'}
                </p>
              </div>
            </div>

            {/* Pillar 4: NECTA Compliant */}
            <div className="p-5 sm:p-6 bg-[#18181B] hover:bg-[#1E1E22] transition-colors text-left flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-[2px] bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <IconQualitySeal className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-[#FFFFFF] font-heading truncate">
                  {language === 'sw' ? 'Viwango vya NECTA' : 'NECTA Standards'}
                </h5>
                <p className="text-xs text-[#D4D4D8] leading-snug mt-0.5 truncate font-normal">
                  {language === 'sw' ? 'Mistari sanifu ya mitihani' : 'Uniform 8mm exam ruling'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN 5-COLUMN ARCHITECTURAL DIRECTORY */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-[#111113]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Brand & Factory Heritage (4 cols) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 bg-white p-1.5 rounded-[2px] border border-[#27272A] flex items-center justify-center shrink-0 shadow-xs">
                <img src="/logo-icon.png" alt="OMEGA" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-black tracking-wider text-[#FFFFFF] group-hover:text-[#DC2626] transition-colors">
                  OMEGA
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#DC2626] uppercase -mt-0.5 font-bold">
                  STATIONERY &amp; BOOKS
                </span>
              </div>
            </Link>

            <div className="inline-flex items-center px-2.5 py-1 rounded-[2px] bg-[#DC2626]/15 border border-[#DC2626]/40 text-[#FCA5A5] text-[10px] font-mono font-bold uppercase tracking-wider">
              MANUFACTURED BY INDIGO PRINTERS LTD · EST. 1998
            </div>

            <p className="text-xs sm:text-[13px] text-[#E4E4E7] leading-relaxed max-w-sm font-normal">
              {language === 'sw'
                ? 'Kiwango cha juu cha madaftari ya shule, vitabu vya hesabu vya jalada gumu (Counter Books), na bahasha nzito za kraft Tanzania tangu 1998.'
                : "Tanzania's benchmark manufacturer of Smyth-sewn counter books, academic exercise notebooks, and heavy kraft bahasha since 1998."}
            </p>

            <div className="space-y-2.5 pt-1 font-normal">
              <div className="flex items-start gap-2.5 text-xs text-[#E4E4E7]">
                <Building2 className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span>Soweto SIDO Industrial Estate, Mbeya HQ</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-[#E4E4E7]">
                <MapPin className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <span>Plot 30 Block F Kilwa Rd / Kariakoo, Dar es Salaam</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === 'sw'
                    ? 'Stakabadhi Rasmi za TRA EFD Zinatolewa'
                    : 'Official TRA EFD Tax Receipts Included'}
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Products & Catalog (2 cols) */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <div className="space-y-1.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#FFFFFF] font-heading">
                {language === 'sw' ? 'Katalogi ya Bidhaa' : 'Product Lines'}
              </h4>
              <div className="w-8 h-0.5 bg-[#DC2626]" />
            </div>
            <ul className="space-y-2.5 text-xs text-[#E4E4E7] font-medium">
              <li>
                <Link
                  to="/catalog?category=Counter+Books"
                  className="hover:text-[#DC2626] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#DC2626] shrink-0" />
                  <span>Counter Books (Q1–Q4)</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=Exercise+Books"
                  className="hover:text-[#DC2626] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#DC2626] shrink-0" />
                  <span>{language === 'sw' ? 'Madaftari ya Mazoezi' : 'Exercise Books (80p–200p)'}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=Bahasha+%26+Envelopes"
                  className="hover:text-[#DC2626] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#DC2626] shrink-0" />
                  <span>{language === 'sw' ? 'Bahasha Nzito za Kraft' : 'Heavy Kraft Bahasha'}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog?category=Counter+Books"
                  className="hover:text-[#DC2626] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#DC2626] shrink-0" />
                  <span>Stiff Cover Ledgers</span>
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-1 text-[#FCA5A5] font-bold hover:text-white transition-colors"
                >
                  <span>{language === 'sw' ? 'Tazama Katalogi Yote →' : 'Browse All Products →'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Wholesale & B2B (2 cols) */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <div className="space-y-1.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#FFFFFF] font-heading">
                {language === 'sw' ? 'Oda za Jumla (B2B)' : 'Wholesale & B2B'}
              </h4>
              <div className="w-8 h-0.5 bg-[#DC2626]" />
            </div>
            <ul className="space-y-2.5 text-xs text-[#E4E4E7] font-medium">
              <li>
                <Link
                  to="/wholesale"
                  className="hover:text-[#DC2626] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#DC2626] shrink-0" />
                  <span>{language === 'sw' ? 'Bei za Katoni za Kiwandani' : 'Carton Bulk Pricing'}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/school-tenders"
                  className="hover:text-[#DC2626] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#DC2626] shrink-0" />
                  <span>{language === 'sw' ? 'Zabuni za Shule & Vyuo' : 'School & Govt Tenders'}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/wholesale#calculator"
                  className="hover:text-[#DC2626] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#DC2626] shrink-0" />
                  <span>{language === 'sw' ? 'Kikokotoo cha Katoni' : 'Carton Price Calculator'}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-guide"
                  className="hover:text-[#DC2626] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#DC2626] shrink-0" />
                  <span>{language === 'sw' ? 'Usafirishaji kwa Mabasi' : 'Bus Freight Waybills'}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-[#DC2626] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#DC2626] shrink-0" />
                  <span>{language === 'sw' ? 'Kuhusu Kiwanda cha OMEGA' : 'Factory Quality Benchmark'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Help & Account (2 cols) */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <div className="space-y-1.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#FFFFFF] font-heading">
                {language === 'sw' ? 'Huduma kwa Wateja' : 'Customer Service'}
              </h4>
              <div className="w-8 h-0.5 bg-[#DC2626]" />
            </div>
            <ul className="space-y-2.5 text-xs text-[#E4E4E7] font-medium">
              <li>
                <Link
                  to="/tracking"
                  className="hover:text-[#DC2626] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#DC2626] shrink-0" />
                  <span>{language === 'sw' ? 'Fuatilia Oda Yako' : 'Track Order Delivery'}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  className="hover:text-[#DC2626] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#DC2626] shrink-0" />
                  <span>{language === 'sw' ? 'Wasifu & Oda Zangu' : 'My Account & Orders'}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="hover:text-[#DC2626] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#DC2626] shrink-0" />
                  <span>
                    {language === 'sw' ? 'Vitu Ninavyopenda' : 'Saved Wishlist'}{' '}
                    {wishlistCount > 0 && `(${wishlistCount})`}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#DC2626] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#DC2626] shrink-0" />
                  <span>{language === 'sw' ? 'Mawasiliano na Ofisi' : 'Contact & Desks'}</span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openCookiePreferences}
                  className="hover:text-[#DC2626] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#DC2626] shrink-0" />
                  <span>{language === 'sw' ? 'Vidakuzi na Faragha' : 'Privacy & Cookie Settings'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Factory Hotlines & WhatsApp (2 cols) */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <div className="space-y-1.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#FFFFFF] font-heading">
                {language === 'sw' ? 'Mawasiliano Rasmi' : 'Factory Helpline'}
              </h4>
              <div className="w-8 h-0.5 bg-[#DC2626]" />
            </div>

            <div className="p-4 rounded-[2px] bg-[#18181B] border border-[#27272A] space-y-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#D4D4D8] block font-bold">
                  {language === 'sw' ? 'Simu ya Oda na Mauzo' : 'Sales & Orders'}
                </span>
                <a
                  href={`tel:${hotline.replace(/\s+/g, '')}`}
                  className="text-xs font-mono font-bold text-[#FFFFFF] hover:text-[#DC2626] transition-colors block mt-0.5"
                >
                  {hotline}
                </a>
                <a
                  href="tel:+255624265480"
                  className="text-[11px] font-mono font-semibold text-[#E4E4E7] hover:text-[#DC2626] transition-colors block mt-0.5"
                >
                  +255 624 265 480
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-[#D4D4D8] block font-bold">
                  {language === 'sw' ? 'Barua Pepe Rasmi' : 'Email Inquiry'}
                </span>
                <a
                  href="mailto:indigoprinter06423@gmail.com"
                  className="text-xs font-mono text-[#FFFFFF] hover:text-[#DC2626] transition-colors block truncate mt-0.5"
                >
                  indigoprinter06423@gmail.com
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-[#D4D4D8] block font-bold">
                  {language === 'sw' ? 'Muda wa Kazi' : 'Dispatch Hours'}
                </span>
                <span className="text-[11px] text-[#FFFFFF] font-medium block mt-0.5">
                  Mon – Sat: 8:00 AM – 5:30 PM
                </span>
              </div>

              {/* Direct WhatsApp Action Button */}
              <a
                href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                  language === 'sw'
                    ? 'Habari OMEGA Stationery, ninahitaji kuagiza madaftari kwa bei ya jumla.'
                    : 'Hello OMEGA Stationery, I would like to place an order from the factory.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <IconWhatsAppCustom className="w-3.5 h-3.5" />
                <span>WhatsApp Order</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM COPYRIGHT & UTILITIES STRIP */}
      <div className="bg-[#0B0B0E] border-t border-[#27272A] py-5">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#D4D4D8]">
          <p className="text-center md:text-left font-normal">
            © {new Date().getFullYear()} <strong className="text-white font-semibold">OMEGA Stationery &amp; Writing Books Tanzania</strong> · Indigo Printers Limited.{' '}
            {language === 'sw' ? 'Haki zote zimehifadhiwa.' : 'All rights reserved.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium text-[#E4E4E7]">
            <Link to="/tracking" className="hover:text-[#DC2626] transition-colors">
              {language === 'sw' ? 'Fuatilia Mzigo' : 'Track Parcel'}
            </Link>
            <span className="text-[#52525B]">·</span>
            <Link to="/wholesale" className="hover:text-[#DC2626] transition-colors">
              {language === 'sw' ? 'Bei za Jumla' : 'Wholesale'}
            </Link>
            <span className="text-[#52525B]">·</span>
            <Link to="/wishlist" className="hover:text-[#DC2626] transition-colors">
              {language === 'sw' ? 'Vitu Vilivyohifadhiwa' : 'Wishlist'}
            </Link>
            <span className="text-[#52525B]">·</span>
            <Link to="/contact" className="hover:text-[#DC2626] transition-colors">
              {language === 'sw' ? 'Mawasiliano' : 'Contact Us'}
            </Link>
            <span className="text-[#52525B]">·</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-white transition-all ml-1 cursor-pointer shadow-xs"
              aria-label="Scroll to top"
              title="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

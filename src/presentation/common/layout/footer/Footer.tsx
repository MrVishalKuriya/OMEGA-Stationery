import React from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUp,
  MessageCircle,
  Package,
  Layers,
  FileText,
  Building2,
  CheckCircle2,
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
    <footer className="bg-[#111113] text-[#F9F8F6] relative overflow-hidden" role="contentinfo">
      
      {/* 1. TOP TRUST & MANUFACTURING PILLARS */}
      <div className="bg-[#0C0C0E] py-6 sm:py-8 border-b border-[#E7E5E0]/15">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Pillar 1: Bus Delivery */}
            <div className="p-4 sm:p-5 rounded-lg bg-[#18181C] border border-[#8C7355]/25 hover:border-[#8C7355]/60 shadow-xs hover:shadow-md transition-all text-left flex items-center gap-3.5 group">
              <div className="w-11 h-11 rounded-md bg-[#111113] text-[#C8A27A] border border-[#8C7355]/30 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <IconNationwideBus className="w-5 h-5 text-[#C8A27A]" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#F9F8F6] font-heading truncate">
                  {language === 'sw' ? 'Mabasi Mikoa Yote 31' : '31 Regions Bus Freight'}
                </h5>
                <p className="text-[11px] text-[#A39E93] leading-tight mt-0.5 truncate">
                  {language === 'sw' ? 'Kutumiwa siku hiyo hiyo' : 'Same-day parcel waybills'}
                </p>
              </div>
            </div>

            {/* Pillar 2: Smyth-Sewn Spines */}
            <div className="p-4 sm:p-5 rounded-lg bg-[#18181C] border border-[#8C7355]/25 hover:border-[#8C7355]/60 shadow-xs hover:shadow-md transition-all text-left flex items-center gap-3.5 group">
              <div className="w-11 h-11 rounded-md bg-[#111113] text-[#C8A27A] border border-[#8C7355]/30 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <IconLayFlatSpine className="w-5 h-5 text-[#C8A27A]" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#F9F8F6] font-heading truncate">
                  {language === 'sw' ? 'Mshono wa Uzi 180°' : 'Smyth-Sewn Binding'}
                </h5>
                <p className="text-[11px] text-[#A39E93] leading-tight mt-0.5 truncate">
                  {language === 'sw' ? 'Hujifungua tambarare kabisa' : 'Thread-stitched lay-flat'}
                </p>
              </div>
            </div>

            {/* Pillar 3: 70 GSM Bleed-Proof Paper */}
            <div className="p-4 sm:p-5 rounded-lg bg-[#18181C] border border-[#8C7355]/25 hover:border-[#8C7355]/60 shadow-xs hover:shadow-md transition-all text-left flex items-center gap-3.5 group">
              <div className="w-11 h-11 rounded-md bg-[#111113] text-[#C8A27A] border border-[#8C7355]/30 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <IconBleedProofPaper className="w-5 h-5 text-[#C8A27A]" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#F9F8F6] font-heading truncate">
                  {language === 'sw' ? 'Karatasi Nzito 70 GSM' : '70 GSM Bleed-Proof'}
                </h5>
                <p className="text-[11px] text-[#A39E93] leading-tight mt-0.5 truncate">
                  {language === 'sw' ? 'Haivujishi wino kabisa' : 'Zero ink bleed guarantee'}
                </p>
              </div>
            </div>

            {/* Pillar 4: NECTA Compliant */}
            <div className="p-4 sm:p-5 rounded-lg bg-[#18181C] border border-[#8C7355]/25 hover:border-[#8C7355]/60 shadow-xs hover:shadow-md transition-all text-left flex items-center gap-3.5 group">
              <div className="w-11 h-11 rounded-md bg-[#111113] text-[#C8A27A] border border-[#8C7355]/30 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <IconQualitySeal className="w-5 h-5 text-[#C8A27A]" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#F9F8F6] font-heading truncate">
                  {language === 'sw' ? 'Viwango vya NECTA' : 'NECTA Standards'}
                </h5>
                <p className="text-[11px] text-[#A39E93] leading-tight mt-0.5 truncate">
                  {language === 'sw' ? 'Mistari sanifu ya mitihani' : 'Uniform 8mm exam ruling'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN 5-COLUMN E-COMMERCE DIRECTORY */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#111113]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Col 1: Brand & Factory Heritage (4 cols) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-white p-1 rounded-md border border-[#E7E5E0] flex items-center justify-center shrink-0 shadow-xs">
                <img src="/logo-icon.png" alt="OMEGA" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-lg font-bold tracking-wider text-[#F9F8F6] group-hover:text-[#C8A27A] transition-colors">
                  OMEGA
                </span>
                <span className="text-[9px] font-mono tracking-widest text-[#C8A27A] uppercase -mt-1 font-bold">
                  STATIONERY &amp; BOOKS
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#A39E93] leading-relaxed max-w-sm">
              {language === 'sw'
                ? 'Kiwango cha juu cha madaftari ya shule, vitabu vya hesabu vya jalada gumu (Counter Books), na bahasha nzito za kraft Tanzania tangu 1998.'
                : "Tanzania's benchmark manufacturer of Smyth-sewn counter books, academic exercise notebooks, and heavy kraft bahasha since 1998."}
            </p>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs text-[#A39E93]">
                <Building2 className="w-4 h-4 text-[#8C7355] shrink-0" />
                <span>Indigo Printers Ltd · Soweto SIDO, Mbeya</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#A39E93]">
                <MapPin className="w-4 h-4 text-[#8C7355] shrink-0" />
                <span>Plot 30 Block F Kilwa Rd, Dar es Salaam</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === 'sw' ? 'Stakabadhi Rasmi za EFD Zinatolewa' : 'Official EFD Tax Receipts Available'}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Products & Catalog (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8A27A] font-heading pb-1">
              {language === 'sw' ? 'Katalogi ya Bidhaa' : 'Product Lines'}
            </h4>
            <ul className="space-y-2 text-xs text-[#A39E93] font-medium">
              <li>
                <Link to="/catalog?category=Counter+Books" className="hover:text-[#F9F8F6] hover:underline transition-colors block">
                  Counter Books (Q1–Q4)
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Exercise+Books" className="hover:text-[#F9F8F6] hover:underline transition-colors block">
                  {language === 'sw' ? 'Madaftari ya Mazoezi' : 'Exercise Books (80p–200p)'}
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Bahasha+%26+Envelopes" className="hover:text-[#F9F8F6] hover:underline transition-colors block">
                  {language === 'sw' ? 'Bahasha Nzito za Kraft' : 'Heavy Kraft Bahasha'}
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Counter+Books" className="hover:text-[#F9F8F6] hover:underline transition-colors block">
                  Stiff Cover Ledgers
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-[#C8A27A] font-bold hover:underline transition-colors block">
                  {language === 'sw' ? 'Tazama Katalogi Yote →' : 'Browse All Products →'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Wholesale & B2B (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8A27A] font-heading pb-1">
              {language === 'sw' ? 'Oda za Jumla (B2B)' : 'Wholesale & B2B'}
            </h4>
            <ul className="space-y-2 text-xs text-[#A39E93] font-medium">
              <li>
                <Link to="/wholesale" className="hover:text-[#F9F8F6] hover:underline transition-colors block">
                  {language === 'sw' ? 'Bei za Katoni za Kiwandani' : 'Carton Bulk Pricing'}
                </Link>
              </li>
              <li>
                <Link to="/school-tenders" className="hover:text-[#F9F8F6] hover:underline transition-colors block">
                  {language === 'sw' ? 'Zabuni za Shule & Vyuo' : 'School & Govt Tenders'}
                </Link>
              </li>
              <li>
                <Link to="/wholesale#calculator" className="hover:text-[#F9F8F6] hover:underline transition-colors block">
                  {language === 'sw' ? 'Kikokotoo cha Katoni' : 'Carton Price Calculator'}
                </Link>
              </li>
              <li>
                <Link to="/shipping-guide" className="hover:text-[#F9F8F6] hover:underline transition-colors block">
                  {language === 'sw' ? 'Usafirishaji kwa Mabasi' : 'Bus Freight Waybills'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F9F8F6] hover:underline transition-colors block">
                  {language === 'sw' ? 'Kuhusu Kiwanda cha OMEGA' : 'Factory Quality Benchmark'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Help & Account (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8A27A] font-heading pb-1">
              {language === 'sw' ? 'Huduma kwa Wateja' : 'Customer Service'}
            </h4>
            <ul className="space-y-2 text-xs text-[#A39E93] font-medium">
              <li>
                <Link to="/tracking" className="hover:text-[#F9F8F6] hover:underline transition-colors block">
                  {language === 'sw' ? 'Fuatilia Oda Yako' : 'Track Order Delivery'}
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#F9F8F6] hover:underline transition-colors block">
                  {language === 'sw' ? 'Wasifu & Oda Zangu' : 'My Account & Orders'}
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-[#F9F8F6] hover:underline transition-colors block">
                  {language === 'sw' ? 'Vitu Ninavyopenda' : 'Saved Wishlist'} {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F9F8F6] hover:underline transition-colors block">
                  {language === 'sw' ? 'Mawasiliano na Ofisi' : 'Contact & Desks'}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openCookiePreferences}
                  className="hover:text-[#F9F8F6] hover:underline transition-colors text-left block"
                >
                  {language === 'sw' ? 'Vidakuzi na Faragha' : 'Privacy & Cookie Settings'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Factory Hotlines & WhatsApp */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8A27A] font-heading pb-1">
              {language === 'sw' ? 'Mawasiliano Rasmi' : 'Factory Helpline'}
            </h4>
            
            <div className="p-4 rounded-lg bg-[#18181C] border border-[#8C7355]/30 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#C8A27A] block font-bold">
                  {language === 'sw' ? 'Simu ya Oda na Mauzo' : 'Sales & Orders'}
                </span>
                <a
                  href={`tel:${hotline.replace(/\s+/g, '')}`}
                  className="text-xs font-mono font-bold text-[#F9F8F6] hover:text-[#C8A27A] transition-colors block"
                >
                  {hotline}
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-[#C8A27A] block font-bold">
                  {language === 'sw' ? 'Barua Pepe Rasmi' : 'Email Inquiry'}
                </span>
                <a
                  href="mailto:indigoprinter06423@gmail.com"
                  className="text-xs font-mono text-[#A39E93] hover:text-[#C8A27A] transition-colors block truncate"
                >
                  indigoprinter06423@gmail.com
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-[#6E6B66] block font-medium">
                  {language === 'sw' ? 'Muda wa Kazi' : 'Dispatch Hours'}
                </span>
                <span className="text-[11px] text-[#F9F8F6] font-semibold block">
                  Mon – Sat: 8:00 AM – 5:30 PM (EAT)
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
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95"
              >
                <IconWhatsAppCustom className="w-3.5 h-3.5" />
                <span>WhatsApp Order</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM COPYRIGHT & UTILITIES STRIP */}
      <div className="bg-[#0C0C0E] border-t border-[#E7E5E0]/15 py-5">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A39E93]">
          <p className="text-center md:text-left font-medium">
            © {new Date().getFullYear()} OMEGA Stationery &amp; Writing Books Tanzania · Indigo Printers Limited. {language === 'sw' ? 'Haki zote zimehifadhiwa.' : 'All rights reserved.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium">
            <Link to="/tracking" className="hover:text-[#C8A27A] transition-colors">
              {language === 'sw' ? 'Fuatilia Mzigo' : 'Track Parcel'}
            </Link>
            <span>·</span>
            <Link to="/wholesale" className="hover:text-[#C8A27A] transition-colors">
              {language === 'sw' ? 'Bei za Jumla' : 'Wholesale'}
            </Link>
            <span>·</span>
            <Link to="/wishlist" className="hover:text-[#C8A27A] transition-colors">
              {language === 'sw' ? 'Vitu Vilivyohifadhiwa' : 'Wishlist'}
            </Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-[#C8A27A] transition-colors">
              {language === 'sw' ? 'Mawasiliano' : 'Contact Us'}
            </Link>
            <span>·</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-md bg-[#18181C] hover:bg-[#8C7355] text-[#C8A27A] hover:text-white border border-[#8C7355]/30 transition-all ml-1 cursor-pointer shadow-xs"
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

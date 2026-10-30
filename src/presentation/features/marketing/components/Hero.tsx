import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  BookOpen,
  Feather,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { TRANSLATIONS } from '@/data/translations';

interface HeroProps {
  whatsappGreetingUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({ whatsappGreetingUrl }) => {
  const { language, storeConfig } = useStore();
  const t = (TRANSLATIONS[language] || TRANSLATIONS.en) as any;

  const cleanWhatsappDigits = storeConfig?.whatsappNumber
    ? storeConfig.whatsappNumber.replace(/\D/g, '')
    : '255715268391';

  const defaultWhatsappUrl =
    whatsappGreetingUrl ||
    `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
      language === 'sw'
        ? 'Habari OMEGA Stationery, ninahitaji kuagiza madaftari (Counter Books, Exercise Books na Bahasha).'
        : 'Hello OMEGA Stationery, I would like to place an order and inquire about wholesale pricing.'
    )}`;

  // 4 Minimalist Trust Pillars (Stitch Atelier Standard)
  const trustPillars = [
    {
      icon: BookOpen,
      metric: '500,000+',
      title: language === 'sw' ? 'Vitabu Vilisambazwa' : 'Books Distributed',
      subtitle: language === 'sw' ? 'Usambazaji wa moja kwa moja kiwandani' : 'Annual factory supply to schools & firms',
    },
    {
      icon: Truck,
      metric: '31 Regions',
      title: language === 'sw' ? 'Mizigo ya Mabasi' : 'Nationwide Bus Parcel',
      subtitle: language === 'sw' ? 'Waybill za siku hiyo hiyo mikoani kote' : 'Same-day waybill handoff to bus terminals',
    },
    {
      icon: Feather,
      metric: '70 GSM',
      title: language === 'sw' ? 'Karatasi Imara' : 'Bleed-Proof Paper',
      subtitle: language === 'sw' ? 'Wino haupenyi hata chembe' : 'Zero feathering with fountain & gel ink',
    },
    {
      icon: ShieldCheck,
      metric: '100%',
      title: language === 'sw' ? 'Kushonwa kwa Uzi' : 'Thread-Sewn Spine',
      subtitle: language === 'sw' ? 'Karatasi hazichomoki milele' : 'Double-stitched archival longevity',
    },
  ];

  return (
    <section
      aria-label="Omega Stationery Hero Stage"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#f9f9f9] via-white to-white border-b border-[#e4e4e7]"
    >
      {/* Subtle architectural grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#111113_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" 
        aria-hidden="true"
      />

      {/* Gentle crimson aura in the center top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[280px] bg-[#dc2626]/5 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 sm:pb-16 relative z-10 text-center flex flex-col items-center">
        
        {/* Tagline / Curated Elegance Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#dc2626]/30 shadow-xs mb-5 animate-in fade-in duration-500">
          <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-ping" />
          <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#18181b]">
            {language === 'sw' ? '🎉 MSIMU WA SIKUKUU • OFA MAALUM KIWANDANI' : '🎉 FESTIVAL SEASON • FACTORY MEGA OFFERS'}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-[#111113] leading-[1.12] tracking-tight max-w-4xl">
          {language === 'sw' ? (
            <>
              Ubora kwa Kila Ukurasa: Madaftari ya <span className="text-[#dc2626]">OMEGA</span>
            </>
          ) : (
            <>
              Premium Quality Stationery &amp; Notebooks for <span className="text-[#dc2626]">Better Futures</span>
            </>
          )}
        </h1>

        {/* Minimal Subtitle */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-[#27272a] max-w-2xl leading-relaxed font-normal">
          {language === 'sw'
            ? 'Madaftari bora ya Q2–Q4 yenye jalada gumu, madaftari ya shule za msingi na sekondari, na bahasha imara — yanayoaminika kote Tanzania.'
            : 'Meticulously crafted Smyth-sewn counter books, archival exercise notebooks, and office stationery — factory-direct across all 31 regions of Tanzania.'}
        </p>

        {/* Clean Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6 sm:pt-8 w-full max-w-md">
          <Link
            to="/catalog"
            className="flex-1 min-w-[150px] px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] hover:from-[#991b1b] hover:to-[#dc2626] text-white font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-red-900/20 transition-all active:scale-95 cursor-pointer font-mono"
          >
            <span>{language === 'sw' ? 'NUNUA SASA' : 'EXPLORE CATALOG'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/wholesale"
            className="flex-1 min-w-[140px] px-5 py-3.5 rounded-xl bg-white hover:bg-[#f4f4f5] border border-[#e4e4e7] hover:border-[#dc2626] text-[#111113] font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer font-mono"
          >
            <span>{language === 'sw' ? 'BEI ZA JUMLA' : 'WHOLESALE B2B'}</span>
          </Link>

          <a
            href={defaultWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#0d6e62] font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer font-mono"
          >
            <MessageCircle className="w-4 h-4 fill-[#25D366] text-transparent" />
            <span>{language === 'sw' ? 'Oda kwa WhatsApp' : 'WhatsApp Orders'}</span>
          </a>
        </div>

        {/* Minimal 4 Trust Pillars Bar */}
        <div className="w-full mt-10 sm:mt-14 pt-8 border-t border-[#e4e4e7] grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
          {trustPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border border-[#e4e4e7] hover:border-[#dc2626]/60 transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="font-heading font-black text-lg sm:text-xl text-[#09090b] tracking-tight">
                    {item.metric}
                  </span>
                </div>
                <h2 className="text-sm font-bold text-[#09090b] truncate">
                  {item.title}
                </h2>
                <p className="text-xs font-medium text-[#3f3f46] mt-0.5 line-clamp-1">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Hero;

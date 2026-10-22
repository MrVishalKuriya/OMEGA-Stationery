import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  Handshake,
  MapPin,
  BookOpen,
  FileSpreadsheet,
  FileText,
  Boxes,
  FolderOpen,
  ArrowRight,
  Sparkles,
  Pencil,
  RotateCw,
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
    : '255746268391';
  const whatsappUrl =
    whatsappGreetingUrl ||
    `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
      language === 'sw'
        ? 'Habari OMEGA Stationery, ninahitaji kuagiza madaftari (Counter Books, Exercise Books na Bahasha).'
        : language === 'gu'
        ? 'નમસ્તે ઓમેગા સ્ટેશનરી, મારે નોટબુક્સ અને કાઉન્ટર બુક્સનો ઓર્ડર કરવો છે.'
        : 'Hello OMEGA Stationery, I would like to place an order and inquire about wholesale pricing.'
    )}`;

  // 4 Trust Badges from Reference Image
  const trustBadges = [
    {
      icon: ShieldCheck,
      line1: language === 'sw' ? 'Ubora wa' : language === 'gu' ? 'શ્રેષ્ઠ' : 'Premium',
      line2: language === 'sw' ? 'Kiwango cha Juu' : language === 'gu' ? 'ગુણવત્તા' : 'Quality',
    },
    {
      icon: Truck,
      line1: language === 'sw' ? 'Oda za Jumla' : language === 'gu' ? 'જથ્થાબંધ' : 'Bulk Orders',
      line2: language === 'sw' ? 'Zinapatikana' : language === 'gu' ? 'ઓર્ડર ઉપલબ્ધ' : 'Available',
    },
    {
      icon: Handshake,
      line1: language === 'sw' ? 'Msambazaji' : language === 'gu' ? 'વિશ્વાસપાત્ર' : 'Trusted',
      line2: language === 'sw' ? 'Anayeaminika' : language === 'gu' ? 'સપ્લાયર' : 'Supplier',
    },
    {
      icon: MapPin,
      line1: language === 'sw' ? 'Kuhudumia' : language === 'gu' ? 'સમગ્ર ટાંઝાનિયા' : 'Serving',
      line2: language === 'sw' ? 'Tanzania Nzima' : language === 'gu' ? 'સર્વિસ' : 'Tanzania',
    },
  ];

  // 5 Feature Categories on Right Column from Reference Image
  const rightFeatures = [
    {
      icon: BookOpen,
      label: language === 'sw' ? 'Madaftari & Exercise Books' : language === 'gu' ? 'નોટબુક્સ અને એક્સરસાઇઝ બુક્સ' : 'Notebooks & Exercise Books',
      href: '/catalog?category=Exercise+Books',
    },
    {
      icon: FileSpreadsheet,
      label: language === 'sw' ? 'Counter Books (Q2, Q3, Q4)' : language === 'gu' ? 'કાઉન્ટર બુક્સ (Q2, Q3, Q4)' : 'Counter Books',
      href: '/catalog?category=Counter+Books',
    },
    {
      icon: FileText,
      label: language === 'sw' ? 'Padi za Kuandikia' : language === 'gu' ? 'રાઇટિંગ પેડ્સ' : 'Writing Pads',
      href: '/catalog?category=Ruled+Paper',
    },
    {
      icon: Boxes,
      label: language === 'sw' ? 'Karatasi za Kopi (A4/A3)' : language === 'gu' ? 'કોપી પેપર (A4/A3)' : 'Copy Paper',
      href: '/catalog?category=Ruled+Paper',
    },
    {
      icon: FolderOpen,
      label: language === 'sw' ? 'Faili, Bahasha & Vifaa' : language === 'gu' ? 'ફાઇલ્સ અને સ્ટેશનરી' : 'Files & Stationery',
      href: '/catalog?category=Files+%26+Folders',
    },
  ];

  // 8 Bottom Category Chips from Reference Image
  const bottomCategoryChips = [
    {
      title: language === 'sw' ? 'Madaftari' : 'Notebooks',
      image: '/omega-products/exercise-book-200p-sl-catalog.jpeg',
      href: '/catalog?category=Exercise+Books',
    },
    {
      title: language === 'sw' ? 'Exercise Books' : 'Exercise Books',
      image: '/omega-products/exercise-book-100p-catalog.jpeg',
      href: '/catalog?category=Exercise+Books',
    },
    {
      title: language === 'sw' ? 'Padi za Kuandika' : 'Writing Pads',
      image: '/omega-products/shorthand-notebook-catalog.jpeg',
      href: '/catalog?category=Ruled+Paper',
    },
    {
      title: language === 'sw' ? 'Vifaa vya Shule' : 'Stationery',
      image: '/omega-products/oxford-mathematical-set.jpeg',
      href: '/catalog?category=School+Stationery',
    },
    {
      title: language === 'sw' ? 'Karatasi' : 'Copy Paper',
      image: '/omega-products/ruled-paper-catalog.jpeg',
      href: '/catalog?category=Ruled+Paper',
    },
    {
      title: language === 'sw' ? 'Faili & Bahasha' : 'Files',
      image: '/omega-products/folder-file-catalog.jpeg',
      href: '/catalog?category=Files+%26+Folders',
    },
    {
      title: language === 'sw' ? 'Counter Books' : 'Counter Books',
      image: '/omega-products/counter-book-q4-catalog.jpeg',
      href: '/catalog?category=Counter+Books',
    },
  ];

  return (
    <section aria-label="Omega Book Products Hero" className="relative w-full overflow-hidden bg-[#161311]">
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO MAIN STAGE (STUDIO DESK ATMOSPHERE) */}
      {/* ========================================================================= */}
      <div className="relative w-full min-h-[520px] lg:min-h-[580px] flex items-center overflow-hidden">
        
        {/* Photorealistic Background Image of Wooden Desk Studio */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: "url('/hero-desk-bg.jpg')",
          }}
          aria-hidden="true"
        />

        {/* Ambient Dark Gradient Overlays for High Text Contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#14110f]/92 via-[#14110f]/65 to-[#14110f]/90 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#14110f] via-transparent to-[#14110f]/40 pointer-events-none"
          aria-hidden="true"
        />

        {/* Warm Golden Glow Centered behind the Podium */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[550px] h-[420px] sm:h-[550px] rounded-full bg-[#e8a85d]/18 blur-[130px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Main 3-Column Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 items-center">
            
            {/* =================================================================== */}
            {/* LEFT COLUMN: BRAND HEADLINE, SUBTITLE, PARAGRAPH & 4 TRUST BADGES */}
            {/* =================================================================== */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-4 sm:space-y-5 text-left order-1">
              
              {/* Small Tagline with Dot Separator */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-[13px] font-bold tracking-[0.2em] uppercase text-[#e5a962] font-mono">
                  {language === 'sw'
                    ? 'VITABU BORA • MAISHA BORA'
                    : language === 'gu'
                    ? 'શ્રેષ્ઠ પુસ્તકો • ઉજ્જવળ ભવિષ્ય'
                    : 'QUALITY BOOKS • BETTER FUTURE'}
                </span>
              </div>

              {/* Large Bold H1 & Subheading */}
              <div className="space-y-2">
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.65rem] font-black text-white leading-[1.1] tracking-tight">
                  {language === 'sw'
                    ? 'Madaftari ya OMEGA'
                    : language === 'gu'
                    ? 'ઓમેગા બુક પ્રોડક્ટ્સ'
                    : 'Omega Book Products'}
                </h1>

                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white/95 leading-snug">
                  {language === 'sw'
                    ? 'Mshirika Wako Anayeaminika Katika Vitabu & Stationery'
                    : language === 'gu'
                    ? 'સ્ટેશનરી અને નોટબુક્સમાં તમારો વિશ્વસનીય ભાગીદાર'
                    : 'Your Trusted Partner in Books & Stationery'}
                </h2>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal max-w-md pt-1">
                  {language === 'sw'
                    ? 'Tunasambaza madaftari bora ya shule, counter books zenye jalada gumu, na vifaa vya stationery — vinavyoaminika kote Tanzania kwa shule, vyuo, ofisi na biashara.'
                    : language === 'gu'
                    ? 'અમે સમગ્ર ટાંઝાનિયામાં શાળાઓ, ઓફિસો અને વ્યવસાયો માટે ઉચ્ચ ગુણવત્તાવાળી નોટબુક્સ, કાઉન્ટર બુક્સ અને સ્ટેશનરી સપ્લાય કરીએ છીએ.'
                    : 'We supply high-quality notebooks, exercise books, counter books, and stationery products — trusted across Tanzania for schools, offices and businesses.'}
                </p>
              </div>

              {/* Row of 4 Trust Badges (Horizontal Row with Thin Vertical Dividers) */}
              <div className="pt-4 border-t border-white/15 grid grid-cols-4 divide-x divide-white/15 text-center">
                {trustBadges.map((badge, idx) => {
                  const Icon = badge.icon;
                  return (
                    <div key={idx} className="px-1.5 sm:px-2 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#e5a962] mb-1.5">
                        <Icon className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-white leading-tight block">
                        {badge.line1}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-stone-300 font-medium leading-tight block">
                        {badge.line2}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* =================================================================== */}
            {/* CENTER COLUMN: 3D SPIRAL NOTEBOOK ON ILLUMINATED PODIUM */}
            {/* =================================================================== */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center order-2 my-2 lg:my-0 select-none">
              <div className="relative w-full max-w-[360px] sm:max-w-[420px] flex items-center justify-center">
                
                {/* Center Visual: Standing Spiral Notebook with Podium & Curved Arrows */}
                <div className="relative z-10 w-full flex items-center justify-center animate-aardvark-float">
                  <img
                    src="/hero-spiral-notebook.jpg"
                    alt="OMEGA Flagship Spiral Notebook on Illuminated 360 Podium"
                    className="w-full max-h-[380px] sm:max-h-[440px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] rounded-2xl"
                    loading="eager"
                  />
                </div>

                {/* Floor Pedestal Glow & Shadow */}
                <div
                  className="absolute bottom-4 w-3/4 h-8 bg-black/75 rounded-full blur-xl pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* =================================================================== */}
            {/* RIGHT COLUMN: SCRIPT TAGLINE & 5 VERTICAL CATEGORY ITEMS */}
            {/* =================================================================== */}
            <div className="lg:col-span-3 flex flex-col justify-center space-y-5 text-left order-3">
              
              {/* Handwritten / Script Tagline */}
              <div className="space-y-0.5">
                <span className="font-serif italic font-normal text-white text-xl sm:text-2xl block leading-tight">
                  {language === 'sw' ? 'Ugavi wa Jumla kwa' : 'Wholesale Supply for a'}
                </span>
                <span className="font-serif italic font-bold text-[#e5a962] text-2xl sm:text-3xl block leading-tight drop-shadow-[0_2px_10px_rgba(229,169,98,0.35)]">
                  {language === 'sw' ? 'Tanzania Yenye Nuru' : language === 'gu' ? 'ઉજ્જવળ ટાંઝાનિયા' : 'Brighter Tanzania'}
                </span>
              </div>

              {/* Vertical List of 5 Category Items with Outline Icons */}
              <div className="space-y-2.5 pt-1">
                {rightFeatures.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={idx}
                      to={item.href}
                      className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/[0.06] transition-all group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e5a962]"
                    >
                      <div className="w-7 h-7 rounded border border-white/20 group-hover:border-[#e5a962] flex items-center justify-center shrink-0 transition-colors">
                        <Icon className="w-4 h-4 text-white group-hover:text-[#e5a962] transition-colors stroke-[1.5]" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-white/95 group-hover:text-[#e5a962] transition-colors leading-tight">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. BOTTOM HORIZONTAL STRIP: 8 CATEGORY CHIPS ON CLEAN WHITE SURFACE */}
      {/* ========================================================================= */}
      <div className="w-full bg-white border-t border-b border-[#e2dedb] py-3.5 sm:py-4 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-1 pt-1 touch-pan-x">
            
            {/* Category Cards 1 through 7 */}
            {bottomCategoryChips.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.href}
                className="flex flex-col items-center gap-1.5 shrink-0 group min-w-[76px] sm:min-w-[92px] text-center"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border border-[#e2dedb] group-hover:border-[#c49b7c] group-hover:shadow-md transition-all p-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-contain mix-blend-multiply scale-110 group-hover:scale-120 transition-transform"
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-[#3b352f] group-hover:text-[#c49b7c] transition-colors whitespace-nowrap">
                  {cat.title}
                </span>
              </Link>
            ))}

            {/* 8th Card: Wholesale Enquiries with Tanzania Flag Badge & Arrow */}
            <Link
              to="/wholesale"
              className="flex flex-col items-center gap-1.5 shrink-0 group min-w-[84px] sm:min-w-[100px] text-center"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#fafafa] border border-[#e2dedb] group-hover:border-[#c49b7c] group-hover:shadow-md transition-all p-1 flex items-center justify-center relative">
                {/* Tanzania Flag Circle */}
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-xs border border-stone-200 flex items-center justify-center relative group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 32 32" className="w-full h-full">
                    {/* Top Green */}
                    <polygon points="0,0 32,0 0,32" fill="#1eb53a" />
                    {/* Bottom Blue */}
                    <polygon points="32,0 32,32 0,32" fill="#00a3dd" />
                    {/* Diagonal Black with Yellow Edges */}
                    <polygon points="0,32 32,0 32,6 6,32" fill="#fcd116" />
                    <polygon points="0,26 26,0 32,0 0,32" fill="#fcd116" />
                    <polygon points="0,29 29,0 32,0 32,3 3,32 0,32" fill="#000000" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] sm:text-xs font-bold text-[#3b352f] group-hover:text-[#c49b7c] transition-colors whitespace-nowrap">
                  {language === 'sw' ? 'Mauzo ya Jumla' : 'Wholesale Enquiries'}
                </span>
                <ArrowRight className="w-3 h-3 text-[#c49b7c] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
};

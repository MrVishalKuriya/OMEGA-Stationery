import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  Award,
  MapPin,
  ArrowRight,
  MessageCircle,
  Sparkles,
  BookOpen,
  FileSpreadsheet,
  FileText,
  Boxes,
  FolderOpen,
  RefreshCw,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
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
        : 'Hello OMEGA Stationery, I would like to place an order and inquire about wholesale pricing.'
    )}`;

  // Single Flagship Hero Product: OMEGA Q3 Hardcover (Tanzania National Standard)
  const flagshipProduct = {
    name: 'OMEGA Counter Book Q3',
    pages: language === 'sw' ? 'Kurasa 288 · Jalada Gumu' : '288 Pages · Stiff Hardboard',
    image: '/omega-products/counter-book-q3-catalog.jpeg',
    spineText: 'OMEGA · Q3 · 288 PAGES · TANZANIA',
  };

  // 3D Flip Card state ("update like Flipcard")
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeInsidePage, setActiveInsidePage] = useState<1 | 2>(1);
  const [isFlipping, setIsFlipping] = useState(false);

  // Small, subtle interactive 3D mouse parallax tilt ("smal animetion")
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Delicate, subtle parallax tilt (-7deg to +7deg)
    const rotateY = ((x - centerX) / centerX) * 7;
    const rotateX = -((y - centerY) / centerY) * 7;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Flip trigger with smooth micro-animation lock
  const handleFlip = () => {
    setIsFlipping(true);
    setIsFlipped((prev) => !prev);
    setTimeout(() => setIsFlipping(false), 700);
  };

  // Base luxury 3D posture:
  // When front is active: 3/4 isometric tilt showing front cover & spine
  // When flipped: 180deg flip revealing authentic inside ruled stationery pages
  const baseRotX = isFlipped ? -6 : -13;
  const baseRotY = isFlipped ? 180 + 10 : 26;
  const baseRotZ = isFlipped ? -6 : 8;

  const rotX = baseRotX + tilt.x;
  const rotY = baseRotY + tilt.y;
  const rotZ = baseRotZ;

  // Minimal refined trust highlights
  const trustHighlights = [
    {
      icon: ShieldCheck,
      text: language === 'sw' ? 'Karatasi 70 GSM Isiyopenyeza Wino' : 'Bleed-Proof 70 GSM Archival Paper',
    },
    {
      icon: Award,
      text: language === 'sw' ? 'Ushonaji wa Nyuzi (Smyth-Sewn)' : 'Reinforced Smyth-Sewn Thread Binding',
    },
    {
      icon: Truck,
      text: language === 'sw' ? 'Usafirishaji wa Mabasi Tanzania Nzima' : 'Countrywide Bus Parcel Freight',
    },
    {
      icon: MapPin,
      text: language === 'sw' ? 'Kariakoo, Arusha, Mwanza & Mikoani' : 'Kariakoo Hub · Serving All 31 Regions',
    },
  ];

  // 8 Minimal Bottom Category Chips
  const bottomCategoryChips = [
    {
      title: language === 'sw' ? 'Madaftari Q2-Q4' : 'Counter Books',
      image: '/omega-products/counter-book-q3-catalog.jpeg',
      href: '/catalog?category=Counter+Books',
    },
    {
      title: language === 'sw' ? 'Exercise Books' : 'Exercise Books',
      image: '/omega-products/exercise-book-200p-sl-catalog.jpeg',
      href: '/catalog?category=Exercise+Books',
    },
    {
      title: language === 'sw' ? 'Kurasa 100 & 80' : 'School Books',
      image: '/omega-products/exercise-book-100p-catalog.jpeg',
      href: '/catalog?category=Exercise+Books',
    },
    {
      title: language === 'sw' ? 'Padi za Kuandika' : 'Writing Pads',
      image: '/omega-products/shorthand-notebook-catalog.jpeg',
      href: '/catalog?category=Ruled+Paper',
    },
    {
      title: language === 'sw' ? 'Vifaa vya Hesabu' : 'Maths Sets',
      image: '/omega-products/oxford-mathematical-set.jpeg',
      href: '/catalog?category=School+Stationery',
    },
    {
      title: language === 'sw' ? 'Karatasi za Kopi' : 'Copy Paper',
      image: '/omega-products/ruled-paper-catalog.jpeg',
      href: '/catalog?category=Ruled+Paper',
    },
    {
      title: language === 'sw' ? 'Faili & Bahasha' : 'Files & Folders',
      image: '/omega-products/folder-file-catalog.jpeg',
      href: '/catalog?category=Files+%26+Folders',
    },
  ];

  return (
    <section
      aria-label="Omega Stationery Luxury Hero"
      className="relative w-full overflow-hidden bg-[#0c0a09] text-white"
    >
      {/* ========================================================================= */}
      {/* 1. CINEMATIC LUXURY BACKGROUND (ANTIQUE STUDY WITH WARM LAMP) */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-102 transition-transform duration-1000"
        style={{
          backgroundImage: "url('/hero-luxury-bg.jpg')",
        }}
        aria-hidden="true"
      />

      {/* Atmospheric Editorial Gradient Overlays (Preserves lamp glow while ensuring crisp text contrast) */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#0c0a09]/95 via-[#0c0a09]/82 to-[#0c0a09]/88 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-[#0c0a09]/60 pointer-events-none"
        aria-hidden="true"
      />

      {/* Warm Ambient Lamp Glow Pulse */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#e8a85d]/16 blur-[140px] pointer-events-none animate-pulse"
        style={{ animationDuration: '6s' }}
        aria-hidden="true"
      />

      {/* Subtle Golden Spotlight behind the 3D Book */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[#c49b7c]/14 blur-[130px] pointer-events-none"
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* 2. MAIN HERO CONTENT: MINIMAL, LUXURIOUS & BALANCED (NO CLUTTER) */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 lg:pt-20 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN: EDITORIAL LUXURY TYPOGRAPHY & CALLS TO ACTION */}
          {/* ===================================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">
            
            {/* Elegant Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-white/[0.06] border border-[#c49b7c]/35 backdrop-blur-md shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e5a962] animate-ping" />
              <span className="text-[11px] font-mono font-semibold tracking-[0.22em] text-[#e5a962] uppercase">
                {language === 'sw' ? 'OMEGA TANZANIA · UBORA WA HALI YA JUU' : 'OMEGA TANZANIA · HERITAGE STATIONERY'}
              </span>
            </div>

            {/* Luxury Heading (Serif & Modern sans harmony) */}
            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.4rem] font-bold text-[#faf8f5] leading-[1.12] tracking-tight">
                {language === 'sw' ? 'Kiwango cha Juu cha' : 'The Benchmark of'}
                <span className="block font-serif italic font-normal text-[#e5a962] drop-shadow-[0_2px_12px_rgba(229,169,98,0.3)]">
                  {language === 'sw' ? 'Uandishi Tanzania.' : 'Writing Excellence.'}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl pt-2 font-normal">
                {language === 'sw'
                  ? 'Madaftari ya kiwango cha juu yaliyoshonwa kwa nyuzi imara, kurasa zisizopenyeza wino, na vifaa vya ofisi — vinavyoaminika kote Tanzania kwa shule, vyuo na biashara.'
                  : 'Handcrafted thread-sewn counter books, archival exercise folios, and premium paper goods — precision manufactured for durability and trusted across schools, universities, and offices throughout Tanzania.'}
              </p>
            </div>

            {/* Action Buttons: Minimal, High-Impact & Luxurious */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/catalog"
                className="px-6 sm:px-7 py-3 rounded-xl bg-gradient-to-r from-[#c49b7c] via-[#d6b59d] to-[#c49b7c] text-[#161311] font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#c49b7c]/20 hover:shadow-[#c49b7c]/40 hover:scale-[1.02] transition-all flex items-center gap-2 group"
              >
                <span>{language === 'sw' ? 'Tazama Katalogi ya Jumla' : 'Explore Wholesale Catalog'}</span>
                <ArrowRight className="w-4 h-4 text-[#161311] group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 sm:px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/20 hover:border-[#e5a962]/60 font-semibold text-xs sm:text-sm tracking-wide backdrop-blur-md transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{language === 'sw' ? 'Agiza kwa WhatsApp' : 'Order via WhatsApp'}</span>
              </a>
            </div>

            {/* 4 Minimal Trust Bullets (Grid of 2x2 with Gold Dots) */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl">
              {trustHighlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-stone-300">
                    <div className="w-5 h-5 rounded-full bg-[#c49b7c]/15 border border-[#c49b7c]/30 flex items-center justify-center shrink-0">
                      <Icon className="w-3 h-3 text-[#e5a962]" />
                    </div>
                    <span className="font-medium text-stone-200">{item.text}</span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: INTERACTIVE 3D FLIPCARD LUXURY BOOK */}
          {/* ===================================================================== */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative select-none">
            
            <div
              ref={stageRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[340px] sm:max-w-[390px] flex flex-col items-center justify-center py-2 group/bookstage"
            >
              {/* Floating Depth Chip (Top Right) */}
              <div
                style={{
                  transform: 'translateZ(45px)',
                }}
                className="absolute -top-2 right-2 z-20 px-3 py-1 rounded-full bg-[#1c1815]/90 border border-[#c49b7c]/40 text-[10px] font-mono text-[#e5a962] shadow-xl backdrop-blur-md flex items-center gap-1.5 pointer-events-none transition-all duration-300"
              >
                {isFlipped ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-300 font-semibold">
                      {language === 'sw' ? 'Kurasa za Ndani · 70 GSM' : 'Inside Ruled Folio · 70 GSM'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-[#e5a962] animate-pulse" />
                    <span>Official Q3 · 288 Pages · Hardcover</span>
                  </>
                )}
              </div>

              {/* The 3D Floating Flipcard Book (Breathing float + smooth 180° flip) */}
              <div
                className="relative z-10 w-full flex items-center justify-center py-3 animate-omega-float"
                style={{
                  perspective: '1350px',
                  perspectiveOrigin: '50% 50%',
                }}
              >
                <div
                  onClick={handleFlip}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleFlip();
                    }
                  }}
                  title={isFlipped ? 'Click to flip back to Cover' : 'Click to flip open inside pages'}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale3d(1.02, 1.02, 1.02)`,
                    transition: isFlipping
                      ? 'transform 0.75s cubic-bezier(0.34, 1.25, 0.64, 1)'
                      : isHovered
                      ? 'transform 0.1s ease-out'
                      : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    width: '235px',
                    height: '340px',
                  }}
                  className="relative rounded-r-xl shadow-2xl transition-transform cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#e5a962]"
                >
                  {/* ========================================================= */}
                  {/* FACE 1: FRONT HARDCOVER (Visible when isFlipped is FALSE) */}
                  {/* ========================================================= */}
                  <div
                    style={{
                      transform: 'translateZ(18px)',
                      backfaceVisibility: 'hidden',
                    }}
                    className="absolute inset-0 rounded-r-xl bg-[#0c192b] border border-[#2a4365]/70 overflow-hidden flex flex-col justify-between p-4 sm:p-5 shadow-2xl"
                  >
                    {/* Authentic Catalog Book Texture */}
                    <div
                      className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-luminosity scale-105"
                      style={{ backgroundImage: `url(${flagshipProduct.image})` }}
                    />

                    {/* Deep Midnight Navy Gradient Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-[#0c192b]/92 to-[#1a2c48]/60 pointer-events-none" />

                    {/* Classic Gold Foil Double Border */}
                    <div className="absolute inset-2 border border-amber-400/65 rounded-lg pointer-events-none shadow-sm" />
                    <div className="absolute inset-3 border border-amber-400/35 rounded-md pointer-events-none" />

                    {/* Top Specification Bar on Cover */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[9px] font-mono font-black tracking-widest text-amber-300 uppercase">
                        TANZANIA STANDARD
                      </span>
                      <span className="px-2 py-0.5 text-[9px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/60 rounded font-mono">
                        Q3 · 288P
                      </span>
                    </div>

                    {/* Luxury Center Gold Emblem & OMEGA Logo */}
                    <div className="relative z-10 text-center my-auto space-y-1">
                      <div className="w-13 h-13 mx-auto rounded-full border-2 border-amber-400 flex items-center justify-center bg-stone-950/90 shadow-xl shadow-black/60 ring-2 ring-amber-400/25">
                        <span className="font-serif text-2xl font-black text-amber-300">Ω</span>
                      </div>
                      <h4 className="font-serif text-2xl font-black tracking-widest text-white uppercase pt-1 drop-shadow-md">
                        OMEGA
                      </h4>
                      <p className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-amber-200">
                        WRITING NOTEBOOK
                      </p>
                      <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-1" />
                      <p className="text-xs font-bold text-stone-200 font-sans tracking-wide">
                        {flagshipProduct.pages}
                      </p>
                    </div>

                    {/* Authentic Tanzanian White Register Index Label at Bottom */}
                    <div className="relative z-10 bg-white/95 rounded-lg p-2 text-stone-900 shadow-lg border border-stone-300">
                      <div className="border-b border-dashed border-stone-300 pb-1 flex justify-between text-[8px] font-bold uppercase tracking-wider text-stone-700">
                        <span>NAME: ________________</span>
                        <span>SUBJ: _________</span>
                      </div>
                      <div className="pt-1 flex justify-between text-[7px] text-stone-600 font-mono font-bold">
                        <span>HARDCOVER REGISTER</span>
                        <span className="text-red-700">HIGH-GSM BLEEDPROOF</span>
                      </div>
                    </div>

                    {/* Left Spine Shadow Edge */}
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/80 via-[#1e0a10]/40 to-transparent pointer-events-none" />

                    {/* Diagonal Specular Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent pointer-events-none" />

                    {/* Flip Card Corner Ribbon (Prompt) */}
                    <div className="absolute bottom-2 right-2 z-20 px-2 py-0.5 rounded-full bg-[#1c1815]/85 border border-[#e5a962]/50 text-[9px] font-mono text-[#e5a962] flex items-center gap-1 shadow-md">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '6s' }} />
                      <span>{language === 'sw' ? 'Geuza Kadi' : 'Flip Card'}</span>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* FACE 2: INSIDE RULED SPREAD (Visible when isFlipped is TRUE) */}
                  {/* ========================================================= */}
                  <div
                    style={{
                      transform: 'translateZ(-18px) rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                    }}
                    className="absolute inset-0 rounded-l-xl bg-[#fcfbf8] text-[#1c1917] border-2 border-stone-400 overflow-hidden flex flex-col justify-between p-4 shadow-2xl"
                  >
                    {/* Authentic Cream Paper Texture */}
                    <div
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        backgroundImage:
                          'radial-gradient(#d6cebe 1px, transparent 1px), radial-gradient(#d6cebe 1px, #fcfbf8 1px)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 10px 10px',
                      }}
                    />

                    {/* Top Inside Register Header */}
                    <div className="relative z-10 border-b border-red-500/80 pb-1.5 flex items-center justify-between text-[9px] font-mono font-bold text-stone-700">
                      <span className="text-red-700 uppercase tracking-wider">OMEGA · Q3 (288P)</span>
                      <span>DATE: ___/___/2026</span>
                      <span className="px-1.5 py-0.2 rounded bg-stone-200 text-stone-800 text-[8px]">
                        PG 0{activeInsidePage}
                      </span>
                    </div>

                    {/* Inside Ruled Page Content with Vertical Red Margin */}
                    <div className="relative z-10 my-auto py-1 space-y-2.5">
                      {/* Red Left Margin Line */}
                      <div className="absolute top-0 bottom-0 left-7 w-[1.5px] bg-red-500/70 pointer-events-none" />

                      {activeInsidePage === 1 ? (
                        <>
                          <div className="border-b border-blue-200/80 pb-0.5 pl-9">
                            <p className="font-serif italic text-xs font-semibold text-stone-900 leading-tight">
                              {language === 'sw'
                                ? 'OMEGA – Kiwango cha Juu cha Uandishi.'
                                : 'OMEGA – The Benchmark of Writing.'}
                            </p>
                          </div>
                          <div className="border-b border-blue-200/80 pb-0.5 pl-9">
                            <p className="text-[10px] text-stone-700 leading-tight">
                              {language === 'sw'
                                ? 'Karatasi ya 70 GSM isiyopenyeza wino wa kalamu zote.'
                                : 'Bleed-proof 70 GSM archival paper for fountain & gel pens.'}
                            </p>
                          </div>
                          <div className="border-b border-blue-200/80 pb-0.5 pl-9">
                            <p className="text-[10px] text-stone-700 leading-tight">
                              {language === 'sw'
                                ? 'Ushonaji imara wa nyuzi (Smyth-sewn) usioachia kurasa.'
                                : 'Reinforced Smyth-sewn stitching — stays flat 180°.'}
                            </p>
                          </div>
                          <div className="border-b border-blue-200/80 pb-0.5 pl-9">
                            <p className="text-[10px] text-stone-700 leading-tight">
                              {language === 'sw'
                                ? 'Inayotumiwa na shule, vyuo na ofisi kote Tanzania.'
                                : 'Trusted across schools, universities & offices in Tanzania.'}
                            </p>
                          </div>
                          <div className="border-b border-blue-200/80 pb-0.5 pl-9">
                            <p className="text-[9px] font-mono text-stone-500">
                              ✓ Kariakoo Wholesale Hub · Countrywide Bus Cargo
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="border-b border-blue-200/80 pb-0.5 pl-9">
                            <p className="font-mono text-[10px] font-bold text-stone-800">
                              SPECIFICATION ARCHIVE:
                            </p>
                          </div>
                          <div className="border-b border-blue-200/80 pb-0.5 pl-9">
                            <p className="text-[9px] text-stone-700 font-mono">
                              • Binding: 16-Fold Smyth Thread Sewn
                            </p>
                          </div>
                          <div className="border-b border-blue-200/80 pb-0.5 pl-9">
                            <p className="text-[9px] text-stone-700 font-mono">
                              • Paper: 70 GSM Bleed-Proof Archival
                            </p>
                          </div>
                          <div className="border-b border-blue-200/80 pb-0.5 pl-9">
                            <p className="text-[9px] text-stone-700 font-mono">
                              • Cover: 1.8mm High-Density Hardboard
                            </p>
                          </div>
                          <div className="border-b border-blue-200/80 pb-0.5 pl-9">
                            <p className="text-[9px] text-stone-700 font-mono">
                              • Ruling: Indigo 8mm Feint + Red Margin
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Inside Page Footer with Inspection Seal & Page Turn Buttons */}
                    <div className="relative z-10 pt-2 border-t border-stone-300 flex items-center justify-between text-[9px]">
                      <div className="flex items-center gap-1 font-mono text-emerald-800 font-bold">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>100% BLEED-PROOF</span>
                      </div>

                      {/* Mini Page Toggle inside book */}
                      <div className="flex items-center gap-1 bg-stone-200/80 rounded-md px-1 py-0.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveInsidePage((prev) => (prev === 1 ? 2 : 1));
                          }}
                          className="px-1 font-bold hover:text-red-700 transition-colors"
                          title="Toggle Page"
                        >
                          {activeInsidePage === 1 ? 'Page 2 →' : '← Page 1'}
                        </button>
                      </div>

                      {/* Flip Back Prompt */}
                      <div className="text-[8px] font-mono text-stone-600 hover:text-red-700 font-bold">
                        <span>{language === 'sw' ? 'Rudi Jalada ↻' : 'To Cover ↻'}</span>
                      </div>
                    </div>

                    {/* Right Crease Shadow (Flipped Book Spine Shadow) */}
                    <div className="absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-stone-400/40 via-stone-300/20 to-transparent pointer-events-none" />
                  </div>

                  {/* ========================================================= */}
                  {/* 2. REINFORCED CLOTH SPINE (Left Face) */}
                  {/* ========================================================= */}
                  <div
                    style={{
                      width: '36px',
                      transform: 'rotateY(-90deg) translateZ(18px)',
                      left: '-18px',
                    }}
                    className="absolute top-0 bottom-0 bg-[#2b080f] border-y border-l border-red-950 flex flex-col justify-between items-center py-4 shadow-inner"
                  >
                    <div className="text-amber-400 font-bold text-[9px] font-mono">Ω</div>
                    <div
                      style={{ writingMode: 'vertical-rl' }}
                      className="text-amber-200 text-[10px] font-black tracking-widest uppercase transform rotate-180 select-none"
                    >
                      {flagshipProduct.spineText}
                    </div>
                    <div className="text-amber-400 text-xs">★</div>
                  </div>

                  {/* ========================================================= */}
                  {/* 3. PAPER BLOCK EDGE (Right Face) */}
                  {/* ========================================================= */}
                  <div
                    style={{
                      width: '34px',
                      height: '332px',
                      top: '4px',
                      right: '2px',
                      transform: 'rotateY(90deg) translateZ(17px)',
                      transformOrigin: 'right center',
                      background: 'linear-gradient(to right, #ded9ce, #fcfbf8 25%, #f7f4eb 75%, #ded9ce)',
                    }}
                    className="absolute shadow-sm"
                  >
                    <div
                      className="w-full h-full opacity-35"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(0deg, transparent, transparent 1.5px, rgba(0,0,0,0.18) 1.5px, rgba(0,0,0,0.18) 2.5px)',
                      }}
                    />
                  </div>

                  {/* ========================================================= */}
                  {/* 4. PAPER BLOCK BOTTOM (Underneath) */}
                  {/* ========================================================= */}
                  <div
                    style={{
                      width: '229px',
                      height: '34px',
                      bottom: '2px',
                      left: '0px',
                      transform: 'rotateX(-90deg) translateZ(17px)',
                      transformOrigin: 'center bottom',
                      background: 'linear-gradient(to bottom, #d5cfc2, #fbfaf7 35%, #f1ece1 80%, #cdc7b9)',
                    }}
                    className="absolute shadow-md"
                  >
                    <div
                      className="w-full h-full opacity-30"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(90deg, transparent, transparent 1.5px, rgba(0,0,0,0.14) 1.5px, rgba(0,0,0,0.14) 2.5px)',
                      }}
                    />
                  </div>

                  {/* ========================================================= */}
                  {/* 5. TOP PAPER EDGE */}
                  {/* ========================================================= */}
                  <div
                    style={{
                      width: '229px',
                      height: '34px',
                      top: '2px',
                      left: '0px',
                      transform: 'rotateX(90deg) translateZ(17px)',
                      transformOrigin: 'center top',
                      background: 'linear-gradient(to top, #d5cfc2, #faf8f5 45%, #e5e0d4)',
                    }}
                    className="absolute"
                  />
                </div>
              </div>

              {/* Dynamic Responsive Floor Shadow */}
              <div
                className="w-52 sm:w-64 h-5 bg-black/85 rounded-full blur-lg transition-transform duration-300 pointer-events-none mt-2"
                style={{
                  transform: `translateX(${tilt.y * 1.5}px) translateY(${-tilt.x * 0.4}px) scale(${
                    1 - Math.abs(tilt.x) * 0.015
                  })`,
                }}
                aria-hidden="true"
              />

              {/* ========================================================= */}
              {/* FLIPCARD CONTROL BUTTONS & INTERACTION HINT */}
              {/* ========================================================= */}
              <div className="mt-3 flex flex-col items-center gap-2">
                {/* 3-Button Flip Controls */}
                <div className="inline-flex items-center p-1 rounded-xl bg-black/50 border border-white/15 backdrop-blur-md shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      if (isFlipped) handleFlip();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      !isFlipped
                        ? 'bg-[#c49b7c] text-[#161311] shadow-xs'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    {language === 'sw' ? 'Jalada (Cover)' : 'Front Cover'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isFlipped) handleFlip();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      isFlipped
                        ? 'bg-[#c49b7c] text-[#161311] shadow-xs'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    {language === 'sw' ? 'Kurasa za Ndani' : 'Inside Pages'}
                  </button>

                  <button
                    type="button"
                    onClick={handleFlip}
                    title="Flip Card"
                    className="p-1.5 ml-1 rounded-lg text-[#e5a962] hover:bg-white/10 transition-colors flex items-center gap-1 text-xs font-mono"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${isFlipping ? 'animate-spin' : ''}`}
                    />
                    <span className="hidden sm:inline">Flip</span>
                  </button>
                </div>

                {/* Micro-interaction hint */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-stone-300">
                  <Sparkles className="w-3 h-3 text-[#e5a962]" />
                  <span>
                    {language === 'sw'
                      ? 'Gusa daftari au vibonyezo kugeuza kadi'
                      : 'Click notebook or buttons to flip in 3D'}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MINIMAL LUXURY BOTTOM CATEGORY STRIP */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#14110f]/90 border-t border-white/10 py-3.5 sm:py-4 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-1 pt-1 touch-pan-x">
            
            {/* Category Cards */}
            {bottomCategoryChips.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.href}
                className="flex flex-col items-center gap-1.5 shrink-0 group min-w-[76px] sm:min-w-[92px] text-center"
              >
                <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-xl bg-white/[0.06] border border-white/10 group-hover:border-[#c49b7c] group-hover:bg-white/[0.12] transition-all p-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-contain mix-blend-screen scale-105 group-hover:scale-115 transition-transform"
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-stone-300 group-hover:text-[#e5a962] transition-colors whitespace-nowrap">
                  {cat.title}
                </span>
              </Link>
            ))}

            {/* Wholesale Direct Inquiry Card with Tanzania Flag */}
            <Link
              to="/wholesale"
              className="flex flex-col items-center gap-1.5 shrink-0 group min-w-[84px] sm:min-w-[100px] text-center"
            >
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-xl bg-white/[0.06] border border-white/10 group-hover:border-[#c49b7c] group-hover:bg-white/[0.12] transition-all p-1 flex items-center justify-center relative">
                {/* Tanzania Flag Emblem */}
                <div className="w-9 h-9 rounded-full overflow-hidden shadow-xs border border-white/20 flex items-center justify-center relative group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 32 32" className="w-full h-full">
                    <polygon points="0,0 32,0 0,32" fill="#1eb53a" />
                    <polygon points="32,0 32,32 0,32" fill="#00a3dd" />
                    <polygon points="0,32 32,0 32,6 6,32" fill="#fcd116" />
                    <polygon points="0,26 26,0 32,0 0,32" fill="#fcd116" />
                    <polygon points="0,29 29,0 32,0 32,3 3,32 0,32" fill="#000000" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] sm:text-xs font-bold text-[#e5a962] group-hover:text-white transition-colors whitespace-nowrap">
                  {language === 'sw' ? 'Mauzo ya Jumla' : 'Wholesale Desk'}
                </span>
                <ArrowRight className="w-3 h-3 text-[#e5a962] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
};

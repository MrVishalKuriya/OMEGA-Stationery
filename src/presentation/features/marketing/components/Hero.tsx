import React, { useState, useRef, useEffect } from 'react';
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
  Play,
  Pause,
  Film,
  Star,
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

  // User Directive: ONLY ONE IMAGE for the 3D Hero Showcase
  // Flagship OMEGA Counter Book Q3 (Tanzania National Standard Specification)
  const singleHeroProduct = {
    name: 'OMEGA Counter Book Q3',
    subtitle: language === 'sw' ? 'Kurasa 288 · Jalada Gumu' : '288 Pages · Stiff Hardboard Cover',
    image: '/omega-products/counter-book-q3-catalog.jpeg',
    spineText: 'OMEGA · Q3 · 288 PAGES · TANZANIA',
  };

  // 60-Frame Precision Scroll Scrubbing System ("criyeting vide and add in frem vaied like if user scrol up so vide play frems scroling velu same frems")
  const TOTAL_FRAMES = 60;
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isVideoAutoPlaying, setIsVideoAutoPlaying] = useState(false);
  const videoIntervalRef = useRef<number | null>(null);

  // Mouse & Touch 3D Tilt Movement ("3D ma book movement hova joiye")
  const stageRef = useRef<HTMLDivElement>(null);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Container ref for Sticky Scroll Runway ("hero section is Stuck if vide frems is not finished")
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll Frame Sync with Sticky Pinning:
  // Hero section stays STUCK on screen while frames 1..60 scrub.
  // When frames finish (progress = 1.0), page continues scrolling freely down!
  // When scrolling up, it sticks again and reverses frames smoothly back to 1.
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (isVideoAutoPlaying) return; // Allow user video mode when active
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const totalScrollDistance = rect.height - window.innerHeight;
          if (totalScrollDistance > 0) {
            const scrolled = Math.max(0, -rect.top);
            const progress = Math.min(Math.max(scrolled / totalScrollDistance, 0), 1);
            setScrollProgress(progress);
            const frame = Math.min(
              Math.max(Math.round(progress * (TOTAL_FRAMES - 1)) + 1, 1),
              TOTAL_FRAMES
            );
            setCurrentFrame(frame);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVideoAutoPlaying]);

  // Video Auto-Play mode: continuously loops through frames like a video
  useEffect(() => {
    if (!isVideoAutoPlaying) {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
      return;
    }
    let frame = currentFrame;
    let dir = 1;
    videoIntervalRef.current = window.setInterval(() => {
      frame += dir;
      if (frame >= TOTAL_FRAMES) {
        frame = TOTAL_FRAMES;
        dir = -1; // Smooth bounce loop
      } else if (frame <= 1) {
        frame = 1;
        dir = 1;
      }
      setCurrentFrame(frame);
      setScrollProgress((frame - 1) / (TOTAL_FRAMES - 1));
    }, 42);

    return () => {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    };
  }, [isVideoAutoPlaying]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate subtle interactive tilt (-12deg to +12deg)
    const rotateY = ((x - centerX) / centerX) * 12;
    const rotateX = -((y - centerY) / centerY) * 12;
    setMouseTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseTilt({ x: 0, y: 0 });
  };

  // Derive 3D Book Angles and Coordinates strictly from Frame/Scroll Position:
  // Frame 1: Resting 3/4 beauty perspective (rotY: -14deg, rotX: 8deg)
  // Frame 60: Dynamically rotated & elevated perspective (rotY: +22deg, rotX: -7deg)
  const rotY = -14 + scrollProgress * 36 + (isHovered ? mouseTilt.y : 0);
  const rotX = 8 - scrollProgress * 15 + (isHovered ? mouseTilt.x : 0);
  const rotZ = -1.5 + scrollProgress * 3.5;
  const transY = -scrollProgress * 28;
  const transZ = scrollProgress * 35;
  const scaleVal = 1 + Math.sin(scrollProgress * Math.PI) * 0.05;
  const sheenPos = Math.round(scrollProgress * 100);

  // 4 Trust Badges from Reference Image
  const trustBadges = [
    {
      icon: ShieldCheck,
      line1: language === 'sw' ? 'Ubora wa' : 'Premium',
      line2: language === 'sw' ? 'Kiwango cha Juu' : 'Quality',
    },
    {
      icon: Truck,
      line1: language === 'sw' ? 'Oda za Jumla' : 'Bulk Orders',
      line2: language === 'sw' ? 'Zinapatikana' : 'Available',
    },
    {
      icon: Handshake,
      line1: language === 'sw' ? 'Msambazaji' : 'Trusted',
      line2: language === 'sw' ? 'Anayeaminika' : 'Supplier',
    },
    {
      icon: MapPin,
      line1: language === 'sw' ? 'Kuhudumia' : 'Serving',
      line2: language === 'sw' ? 'Tanzania Nzima' : 'Tanzania',
    },
  ];

  // 5 Feature Categories on Right Column from Reference Image
  const rightFeatures = [
    {
      icon: BookOpen,
      label: language === 'sw' ? 'Madaftari & Exercise Books' : 'Notebooks & Exercise Books',
      href: '/catalog?category=Exercise+Books',
    },
    {
      icon: FileSpreadsheet,
      label: language === 'sw' ? 'Counter Books (Q2, Q3, Q4)' : 'Counter Books',
      href: '/catalog?category=Counter+Books',
    },
    {
      icon: FileText,
      label: language === 'sw' ? 'Padi za Kuandikia' : 'Writing Pads',
      href: '/catalog?category=Ruled+Paper',
    },
    {
      icon: Boxes,
      label: language === 'sw' ? 'Karatasi za Kopi (A4/A3)' : 'Copy Paper',
      href: '/catalog?category=Ruled+Paper',
    },
    {
      icon: FolderOpen,
      label: language === 'sw' ? 'Faili, Bahasha & Vifaa' : 'Files & Stationery',
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
    <section
      ref={containerRef}
      aria-label="Omega Book Products Hero"
      className="relative w-full bg-[#161311]"
      style={{ minHeight: '220vh' }}
    >
      {/* ========================================================================= */}
      {/* 1. STICKY HERO VIEWPORT (PINS IN PLACE UNTIL FRAMES FINISH) */}
      {/* ========================================================================= */}
      <div className="sticky top-0 w-full min-h-screen flex flex-col justify-between overflow-hidden">
        
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 relative z-10 w-full flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 items-center w-full">
            
            {/* =================================================================== */}
            {/* LEFT COLUMN: BRAND HEADLINE, SUBTITLE, PARAGRAPH & 4 TRUST BADGES */}
            {/* =================================================================== */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-4 sm:space-y-5 text-left order-1">
              
              {/* Small Tagline with Dot Separator */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-[13px] font-bold tracking-[0.2em] uppercase text-[#e5a962] font-mono">
                  {language === 'sw'
                    ? 'VITABU BORA • MAISHA BORA'
                    : 'QUALITY BOOKS • BETTER FUTURE'}
                </span>
              </div>

              {/* Large Bold H1 & Subheading */}
              <div className="space-y-2">
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.65rem] font-black text-white leading-[1.1] tracking-tight">
                  {language === 'sw'
                    ? 'Madaftari ya OMEGA'
                    : 'Omega Book Products'}
                </h1>

                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white/95 leading-snug">
                  {language === 'sw'
                    ? 'Mshirika Wako Anayeaminika Katika Vitabu & Stationery'
                    : 'Your Trusted Partner in Books & Stationery'}
                </h2>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal max-w-md pt-1">
                  {language === 'sw'
                    ? 'Tunasambaza madaftari bora ya shule, counter books zenye jalada gumu, na vifaa vya stationery — vinavyoaminika kote Tanzania kwa shule, vyuo, ofisi na biashara.'
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
            {/* CENTER COLUMN: PROPER 3D OMEGA HARDCOVER BOOK (FRAME-BY-FRAME) */}
            {/* =================================================================== */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center order-2 my-2 lg:my-0 select-none">
              <div
                ref={stageRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative w-full max-w-[360px] sm:max-w-[420px] flex flex-col items-center justify-center py-2 cursor-grab active:cursor-grabbing group/stage"
              >
                {/* Dynamic Ambient Golden Glow */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-radial from-[#e5a962]/20 via-[#c49b7c]/15 to-transparent blur-3xl pointer-events-none transition-all duration-500"
                  style={{
                    transform: `translate(-50%, -50%) scale(${1 + scrollProgress * 0.25})`,
                  }}
                  aria-hidden="true"
                />

                {/* Subtle orbital dashed rotation ring */}
                <div
                  className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-[#c49b7c]/30 border-dashed animate-omega-spin pointer-events-none"
                  aria-hidden="true"
                />

                {/* PROPER 3D Rotating Hardcover Book with True Physical Dimensions */}
                <div
                  className="relative z-10 w-full flex items-center justify-center py-2"
                  style={{
                    perspective: '1250px',
                    perspectiveOrigin: '50% 50%',
                  }}
                >
                  <div
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `translateY(${transY}px) translateZ(${transZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale3d(${scaleVal}, ${scaleVal}, ${scaleVal})`,
                      transition: isHovered && !isVideoAutoPlaying ? 'transform 0.08s ease-out' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                      width: '235px',
                      height: '335px',
                    }}
                    className="relative rounded-r-xl shadow-2xl"
                  >
                    {/* 1. FRONT HARDCOVER FACE (Authentic OMEGA Cover Design) */}
                    <div
                      style={{
                        transform: 'translateZ(15px)',
                        backfaceVisibility: 'hidden',
                      }}
                      className="absolute inset-0 rounded-r-xl bg-[#0d1b2a] border border-stone-600/70 overflow-hidden flex flex-col justify-between p-4 sm:p-5 shadow-2xl"
                    >
                      {/* Real authentic catalog cover photo texture */}
                      <div
                        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-luminosity scale-105"
                        style={{ backgroundImage: `url(${singleHeroProduct.image})` }}
                      />

                      {/* Dark gradient gloss overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-[#0d1b2a]/90 to-red-950/40 pointer-events-none" />

                      {/* Gold foil classic double border */}
                      <div className="absolute inset-2 border border-amber-400/60 rounded-lg pointer-events-none shadow-sm" />
                      <div className="absolute inset-3 border border-amber-400/30 rounded-md pointer-events-none" />

                      {/* Dynamic Specular Light Reflection (Sweeps across cover in sync with scroll frames) */}
                      <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-150"
                        style={{
                          background: `linear-gradient(${115 + scrollProgress * 30}deg, transparent ${Math.max(0, sheenPos - 35)}%, rgba(255,255,255,0.3) ${sheenPos}%, transparent ${Math.min(100, sheenPos + 35)}%)`,
                          mixBlendMode: 'overlay',
                        }}
                        aria-hidden="true"
                      />

                      {/* Top Bar on Cover */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-[9px] font-mono font-black tracking-widest text-amber-300 uppercase">
                          TANZANIA STANDARD
                        </span>
                        <span className="px-2 py-0.5 text-[9px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/60 rounded font-mono">
                          Q3 · 288P
                        </span>
                      </div>

                      {/* Center Emblem & OMEGA Logo */}
                      <div className="relative z-10 text-center my-auto space-y-1">
                        <div className="w-13 h-13 mx-auto rounded-full border-2 border-amber-400 flex items-center justify-center bg-stone-950/90 shadow-xl shadow-black/60 ring-2 ring-amber-400/20">
                          <span className="font-serif-luxury text-2xl font-black text-amber-300">Ω</span>
                        </div>
                        <h4 className="font-serif-luxury text-2xl font-black tracking-widest text-white uppercase pt-1 drop-shadow-md">
                          OMEGA
                        </h4>
                        <p className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-amber-200">
                          WRITING NOTEBOOK
                        </p>
                        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-1" />
                        <p className="text-xs font-bold text-stone-200 font-sans tracking-wide">
                          {language === 'sw' ? 'Kurasa 288 · Quire 3' : '288 Pages · 3 Quire'}
                        </p>
                      </div>

                      {/* Authentic White Index Label on Bottom */}
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
                      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/70 via-red-950/40 to-transparent pointer-events-none" />

                      {/* Diagonal Gloss Shine */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                    </div>

                    {/* 2. REINFORCED CLOTH SPINE (Left Face) */}
                    <div
                      style={{
                        width: '30px',
                        transform: 'rotateY(-90deg) translateZ(15px)',
                        left: '-15px',
                      }}
                      className="absolute top-0 bottom-0 bg-[#2b080f] border-y border-l border-red-950 flex flex-col justify-between items-center py-4 shadow-inner"
                    >
                      <div className="text-amber-400 font-bold text-[9px] font-mono">Ω</div>
                      <div
                        style={{ writingMode: 'vertical-rl' }}
                        className="text-amber-200 text-[10px] font-black tracking-widest uppercase transform rotate-180"
                      >
                        OMEGA · Q3 · 288 PAGES · TANZANIA
                      </div>
                      <div className="flex items-center justify-center">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      </div>
                    </div>

                    {/* 3. PAPER BLOCK EDGE (Right Face) */}
                    <div
                      style={{
                        width: '30px',
                        transform: 'rotateY(90deg) translateZ(220px)',
                        right: '-15px',
                      }}
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-amber-50 via-white to-stone-200 border-y border-stone-400 shadow-md overflow-hidden"
                    >
                      <div className="w-full h-full opacity-40 bg-[repeating-linear-gradient(0deg,#cbd5e1,#cbd5e1_1px,transparent_1px,transparent_3px)]" />
                    </div>

                    {/* 4. TOP & BOTTOM EDGES */}
                    <div
                      style={{
                        height: '30px',
                        transform: 'rotateX(90deg) translateZ(15px)',
                        top: '-15px',
                      }}
                      className="absolute left-0 right-0 bg-stone-200 border border-stone-400"
                    />
                    <div
                      style={{
                        height: '30px',
                        transform: 'rotateX(-90deg) translateZ(320px)',
                        bottom: '-15px',
                      }}
                      className="absolute left-0 right-0 bg-stone-300 border border-stone-400 shadow-xl"
                    />
                  </div>
                </div>

                {/* Dynamic Responsive Floor Shadow */}
                <div
                  className="w-52 sm:w-64 h-6 bg-black/85 rounded-full blur-lg transition-transform duration-100 pointer-events-none mt-2"
                  style={{
                    transform: `translateX(${rotY * 1.5}px) translateY(${-rotX * 0.35}px) scale(${1 - Math.abs(rotX) * 0.012})`,
                  }}
                  aria-hidden="true"
                />

                {/* Apple-Style Scroll-Scrubbed Frame HUD & Video Controls */}
                <div className="mt-3 flex flex-col items-center gap-1.5 w-full max-w-[320px] px-3 py-2 bg-[#1a1614]/90 rounded-2xl border border-white/15 backdrop-blur-md shadow-xl">
                  <div className="flex items-center justify-between w-full text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-stone-300">
                      <span className={`w-2 h-2 rounded-full ${currentFrame === TOTAL_FRAMES ? 'bg-emerald-400' : 'bg-[#e5a962] animate-pulse'}`} />
                      <span className="font-bold tracking-wider text-white">3D FRAME</span>
                      <span className="text-[#e5a962] font-black">
                        {String(currentFrame).padStart(2, '0')} / {TOTAL_FRAMES}
                      </span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setIsVideoAutoPlaying(!isVideoAutoPlaying)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white transition-colors"
                      title={isVideoAutoPlaying ? 'Pause Video Mode' : 'Play Video Loop'}
                    >
                      {isVideoAutoPlaying ? (
                        <>
                          <Pause className="w-2.5 h-2.5 text-[#e5a962]" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-2.5 h-2.5 text-[#e5a962]" />
                          <span>Auto Play</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Interactive Scrub Progress Bar */}
                  <div
                    className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden relative cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                      setScrollProgress(clickRatio);
                      setCurrentFrame(Math.min(Math.max(Math.round(clickRatio * (TOTAL_FRAMES - 1)) + 1, 1), TOTAL_FRAMES));
                    }}
                    title="Click or drag to scrub frames"
                  >
                    <div
                      className="h-full bg-gradient-to-r from-[#c49b7c] via-[#e5a962] to-[#fcd116] rounded-full transition-[width] duration-75"
                      style={{ width: `${(currentFrame / TOTAL_FRAMES) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between w-full text-[9px] font-mono text-stone-400">
                    <span>{currentFrame < TOTAL_FRAMES ? '↑ SCROLL UP (REWIND)' : '↑ SCROLL UP'}</span>
                    <span className={currentFrame === TOTAL_FRAMES ? 'text-emerald-400 font-bold' : ''}>
                      {currentFrame === TOTAL_FRAMES ? '✓ UNLOCKED (SCROLL DOWN ↓)' : '↓ SCROLL DOWN (STUCK TIL 60)'}
                    </span>
                  </div>
                </div>

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
                  {language === 'sw' ? 'Tanzania Yenye Nuru' : 'Brighter Tanzania'}
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

        {/* ========================================================================= */}
        {/* 2. BOTTOM HORIZONTAL STRIP: 8 CATEGORY CHIPS ON CLEAN WHITE SURFACE */}
        {/* ========================================================================= */}
        <div className="w-full bg-white border-t border-b border-[#e2dedb] py-3.5 sm:py-4 shadow-xs relative z-20">
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
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border border-[#e2dedb] group-hover:border-[#c49b7c] group-hover:shadow-md transition-all p-1 flex items-center justify-center relative">
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

      </div>
    </section>
  );
};

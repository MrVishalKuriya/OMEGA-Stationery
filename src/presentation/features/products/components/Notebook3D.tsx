import React, { useState, useEffect, useRef } from 'react';
import { Rotate3d, Play, Pause, BookOpen, Layers, CheckCircle2, MessageCircle, Sparkles, SlidersHorizontal, RefreshCw, Star, Check } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { TRANSLATIONS } from '@/data/translations';

interface Notebook3DProps {
  onSelectProduct?: (sku: string) => void;
}

export const Notebook3D: React.FC<Notebook3DProps> = () => {
  const { language, storeConfig } = useStore();
  const t = TRANSLATIONS[language];

  // Active Quire selection matching official PPTX: Q2 (198p / 56,000/-), Q3 (288p / 57,000/-), Q4 (384p / 60,000/-)
  const [selectedQuire, setSelectedQuire] = useState<'Q2' | 'Q3' | 'Q4'>('Q3');
  const [viewMode, setViewMode] = useState<'3d' | 'open' | 'front'>('3d');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotationAngle, setRotationAngle] = useState<number>(18);
  const [tiltX, setTiltX] = useState<number>(7);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartX = useRef<number>(0);
  const startAngle = useRef<number>(18);

  const quireData = {
    Q2: {
      title: 'OMEGA Counter Book Q2',
      titleSw: 'OMEGA Daftari la Kaunta Q2',
      pages: '198 Pages · 2 Quire',
      pagesSw: 'Kurasa 198 · Quire 2',
      thickness: 24,
      price: 56000,
      wholesale: 52000,
      sku: 'OMG-CB-Q2',
      spineText: 'OMEGA · Q2 · 198 PAGES · TANZANIA',
      image: '/omega-products/counter-book-q2-catalog.jpeg',
      description:
        language === 'sw'
          ? 'Ubora wa hali ya juu kwa matumizi ya kila siku! Inafaa kwa shule, ofisi, biashara na kuandika kumbukumbu zako kwa mpangilio. Kurasa 198 | Imara | Nadhifu | Rahisi kutumia.'
          : 'Premium quality 2-Quire counter book with 198 numbered pages. Stiff protective hardboard cover with reinforced thread-sewn cloth spine.',
    },
    Q3: {
      title: 'OMEGA Counter Book Q3',
      titleSw: 'OMEGA Daftari la Kaunta Q3',
      pages: '288 Pages · 3 Quire',
      pagesSw: 'Kurasa 288 · Quire 3',
      thickness: 32,
      price: 57000,
      wholesale: 53000,
      sku: 'OMG-CB-Q3',
      spineText: 'OMEGA · Q3 · 288 PAGES · TANZANIA',
      image: '/omega-products/counter-book-q3-catalog.jpeg',
      description:
        language === 'sw'
          ? 'Ubora wa hali ya juu kwa matumizi ya kila siku! Inafaa kwa shule, ofisi, biashara na kuandika kumbukumbu zako kwa mpangilio. Kurasa 288 | Imara | Nadhifu | Rahisi kutumia.'
          : 'The national standard 3-Quire OMEGA counter book featuring 288 bleed-proof pages with rigid hardboard protective cover.',
    },
    Q4: {
      title: 'OMEGA Counter Book Q4',
      titleSw: 'OMEGA Daftari la Kaunta Q4',
      pages: '384 Pages · 4 Quire',
      pagesSw: 'Kurasa 384 · Quire 4',
      thickness: 42,
      price: 60000,
      wholesale: 56000,
      sku: 'OMG-CB-Q4',
      spineText: 'OMEGA · Q4 · 384 PAGES · TANZANIA',
      image: '/omega-products/counter-book-q4-catalog.jpeg',
      description:
        language === 'sw'
          ? 'Ubora wa hali ya juu kwa matumizi ya kila siku! Inafaa kwa shule, ofisi, biashara na kuandika kumbukumbu zako kwa mpangilio. Kurasa 384 | Imara | Nadhifu | Rahisi kutumia.'
          : 'Maximum capacity 4-Quire ledger with 384 heavy-gauge archival pages. Heavy-duty construction for lifelong record keeping.',
    },
  };

  const currentBook = quireData[selectedQuire];

  // Gentle, elegant oscillation for 3D showcase
  useEffect(() => {
    if (viewMode !== '3d' || isHovered || isDragging || !autoRotate) return;
    let step = 0;
    const interval = setInterval(() => {
      step += 0.035;
      const nextAngle = Math.sin(step) * 22 + 8;
      setRotationAngle(nextAngle);
    }, 45);
    return () => clearInterval(interval);
  }, [viewMode, isHovered, isDragging, autoRotate]);

  // Touch and mouse drag handlers
  const handleDragStart = (clientX: number) => {
    if (viewMode === 'open') return;
    setIsDragging(true);
    setAutoRotate(false);
    dragStartX.current = clientX;
    startAngle.current = rotationAngle;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || viewMode === 'open') return;
    const delta = clientX - dragStartX.current;
    const clamped = Math.max(-55, Math.min(55, startAngle.current + delta * 0.45));
    setRotationAngle(clamped);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const cleanWhatsappDigits = (storeConfig.whatsappNumber || '255715268391').replace(/\D/g, '');
  const directWhatsAppUrl = `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
    `Hello OMEGA Tanzania, I would like to order: ${currentBook.title} (${currentBook.pages}) - SKU: ${currentBook.sku}. Price: TSh ${currentBook.price.toLocaleString()}. Official Catalog 2026.`
  )}`;

  return (
    <div className="w-full max-w-full bg-gradient-to-b from-stone-900 via-stone-950 to-black rounded-3xl p-4 sm:p-7 text-white shadow-2xl border border-red-900/40 backdrop-blur-md relative overflow-visible select-none">
      {/* Ambient background light glows */}
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar inside 3D Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800 relative z-10 w-full">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-stone-200 flex items-center gap-2">
            <Rotate3d className="w-4 h-4 text-red-500" />
            <span>{language === 'sw' ? 'Mwonekano Halisi wa 3D' : '3D Interactive Showcase'}</span>
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-red-950 text-amber-300 border border-red-800 font-bold">
            {selectedQuire} · {currentBook.pages.split('·')[0].trim()}
          </span>
        </div>

        {/* View Mode Tabs & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setViewMode('3d');
                setRotationAngle(18);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                viewMode === '3d'
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Mzunguko wa 3D' : '3D Angle'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('open');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'open'
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Kurasa za Ndani' : 'Inside Pages'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('front');
                setRotationAngle(0);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'front'
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {language === 'sw' ? 'Jalada' : 'Cover'}
            </button>
          </div>

          {/* Auto rotate toggle */}
          {viewMode === '3d' && (
            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
              className={`p-2 rounded-xl border text-xs transition-colors hidden sm:flex items-center justify-center ${
                autoRotate
                  ? 'bg-red-900/40 border-red-700 text-amber-300'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Stage (No overflow clipping, ample height and padding) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 w-full">
        {/* Left Side: 3D Turntable Perspective Box */}
        <div
          className="lg:col-span-7 flex flex-col items-center justify-center min-h-[420px] sm:min-h-[460px] relative cursor-grab active:cursor-grabbing w-full overflow-visible py-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            handleDragEnd();
          }}
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseMove={(e) => handleDragMove(e.clientX)}
          onMouseUp={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
          onTouchEnd={handleDragEnd}
        >
          {/* Subtle Drag Hint Badge */}
          <div className="absolute top-1 text-[11px] text-stone-300 bg-stone-900/90 px-3.5 py-1 rounded-full border border-stone-700/80 pointer-events-none flex items-center gap-1.5 shadow-md z-20">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>
              {language === 'sw'
                ? 'Gusa au buruta kuzungusha daftari kwa pande zote'
                : 'Drag or swipe to rotate & inspect authentic hardboard binding'}
            </span>
          </div>

          {/* MODE 1: 3D TURNTABLE PERSPECTIVE VIEW */}
          {viewMode !== 'open' ? (
            <div
              style={{
                perspective: '1300px',
                perspectiveOrigin: '50% 48%',
              }}
              className="w-full flex flex-col items-center justify-center pt-8 pb-4"
            >
              {/* 3D Rotating Hardcover Book with True Physical Dimensions */}
              <div
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${rotationAngle}deg) rotateX(${tiltX}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  width: '235px',
                  height: '335px',
                }}
                className="relative rounded-r-xl shadow-2xl"
              >
                {/* 1. FRONT HARDCOVER FACE */}
                <div
                  style={{
                    transform: `translateZ(${currentBook.thickness / 2}px)`,
                    backfaceVisibility: 'hidden',
                  }}
                  className="absolute inset-0 rounded-r-xl bg-[#0d1b2a] border border-stone-600/70 overflow-hidden flex flex-col justify-between p-4 sm:p-5 shadow-2xl"
                >
                  {/* Real authentic catalog cover photo texture */}
                  <div
                    className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-luminosity scale-105"
                    style={{ backgroundImage: `url(${currentBook.image})` }}
                  />

                  {/* Dark gradient gloss overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-[#0d1b2a]/90 to-red-950/40 pointer-events-none" />

                  {/* Gold foil classic double border */}
                  <div className="absolute inset-2 border border-amber-400/60 rounded-lg pointer-events-none shadow-sm" />
                  <div className="absolute inset-3 border border-amber-400/30 rounded-md pointer-events-none" />

                  {/* Top Bar on Cover */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[9px] font-mono font-black tracking-widest text-amber-300 uppercase">
                      TANZANIA STANDARD
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/60 rounded font-mono">
                      {selectedQuire}
                    </span>
                  </div>

                  {/* Center Emblem & OMEGA Logo */}
                  <div className="relative z-10 text-center my-auto space-y-1">
                    <div className="w-14 h-14 mx-auto rounded-full border-2 border-amber-400 flex items-center justify-center bg-stone-950/90 shadow-xl shadow-black/60 ring-2 ring-amber-400/20">
                      <span className="font-serif-luxury text-3xl font-black text-amber-300">Ω</span>
                    </div>
                    <h4 className="font-serif-luxury text-2xl font-black tracking-widest text-white uppercase pt-1 drop-shadow-md">
                      OMEGA
                    </h4>
                    <p className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-amber-200">
                      WRITING NOTEBOOK
                    </p>
                    <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-1" />
                    <p className="text-xs font-bold text-stone-200 font-sans tracking-wide">
                      {currentBook.pages}
                    </p>
                  </div>

                  {/* Authentic White Index Label on Bottom */}
                  <div className="relative z-10 bg-white/95 rounded-lg p-2.5 text-stone-900 shadow-lg border border-stone-300">
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

                  {/* Realistic diagonal gloss shine */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                </div>

                {/* 2. REINFORCED CLOTH SPINE (Left Face) */}
                <div
                  style={{
                    width: `${currentBook.thickness}px`,
                    transform: `rotateY(-90deg) translateZ(${currentBook.thickness / 2}px)`,
                    left: `-${currentBook.thickness / 2}px`,
                  }}
                  className="absolute top-0 bottom-0 bg-[#2b080f] border-y border-l border-red-950 flex flex-col justify-between items-center py-4 shadow-inner"
                >
                  <div className="text-amber-400 font-bold text-[9px] font-mono">Ω</div>
                  <div
                    style={{ writingMode: 'vertical-rl' }}
                    className="text-amber-200 text-[10px] font-black tracking-widest uppercase transform rotate-180"
                  >
                    {currentBook.spineText}
                  </div>
                  <div className="flex items-center justify-center">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  </div>
                </div>

                {/* 3. PAPER BLOCK EDGE (Right Face) */}
                <div
                  style={{
                    width: `${currentBook.thickness}px`,
                    transform: `rotateY(90deg) translateZ(${235 - currentBook.thickness / 2}px)`,
                    right: `-${currentBook.thickness / 2}px`,
                  }}
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-amber-50 via-white to-stone-200 border-y border-stone-400 shadow-md overflow-hidden"
                >
                  <div className="w-full h-full opacity-40 bg-[repeating-linear-gradient(0deg,#cbd5e1,#cbd5e1_1px,transparent_1px,transparent_3px)]" />
                </div>

                {/* 4. TOP & BOTTOM EDGES */}
                <div
                  style={{
                    height: `${currentBook.thickness}px`,
                    transform: `rotateX(90deg) translateZ(${currentBook.thickness / 2}px)`,
                    top: `-${currentBook.thickness / 2}px`,
                  }}
                  className="absolute left-0 right-0 bg-stone-200 border border-stone-400"
                />
                <div
                  style={{
                    height: `${currentBook.thickness}px`,
                    transform: `rotateX(-90deg) translateZ(${335 - currentBook.thickness / 2}px)`,
                    bottom: `-${currentBook.thickness / 2}px`,
                  }}
                  className="absolute left-0 right-0 bg-stone-300 border border-stone-400 shadow-xl"
                />
              </div>

              {/* Realistic Ground Shadow Oval */}
              <div
                style={{
                  width: '260px',
                  height: '24px',
                  transform: `translateX(${rotationAngle * 0.75}px)`,
                }}
                className="bg-black/80 rounded-full blur-md mt-7 transition-transform duration-300"
              />

              {/* Interactive Rotation Slider */}
              <div className="mt-4 flex items-center gap-3 w-64 max-w-full bg-stone-900/80 px-3 py-1.5 rounded-full border border-stone-800">
                <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={rotationAngle}
                  onChange={(e) => {
                    setAutoRotate(false);
                    setRotationAngle(parseFloat(e.target.value));
                  }}
                  className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    setRotationAngle(18);
                    setAutoRotate(true);
                  }}
                  title="Reset Angle"
                  className="text-stone-400 hover:text-white"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* MODE 2: OPEN BOOK SPREAD (FEINT RULED INSIDE PAGES) */
            <div className="w-full max-w-lg pt-4 animate-in fade-in zoom-in-95">
              <div className="relative bg-white text-stone-900 rounded-2xl shadow-2xl border-4 border-[#0d1b2a] overflow-hidden p-5 sm:p-7 space-y-4">
                {/* Center Spine Crease */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-stone-300/40 via-stone-400/20 to-stone-300/40 pointer-events-none" />

                {/* Page Header */}
                <div className="flex items-center justify-between border-b-2 border-red-600 pb-2 text-[11px] font-mono text-stone-700 font-bold">
                  <span className="text-red-700">OMEGA · {currentBook.pages}</span>
                  <span>DATE: ____ / ____ / 20___</span>
                  <span>PAGE NO: 01</span>
                </div>

                {/* Ruled Lines Grid with Vertical Red Margin */}
                <div className="relative py-2 space-y-3.5">
                  {/* Left Red Margin Line */}
                  <div className="absolute top-0 bottom-0 left-12 w-0.5 bg-red-600/80" />

                  {/* Feint Ruled Lines with Poetic Handwritten Thoughts from PPTX */}
                  <div className="border-b border-blue-200 pb-1 pl-16">
                    <p className="font-serif italic text-base sm:text-lg text-stone-900 leading-none">
                      OMEGA – Ubora Unaouaminiwa.
                    </p>
                  </div>
                  <div className="border-b border-blue-200 pb-1 pl-16">
                    <p className="font-sans text-xs sm:text-sm text-stone-700 leading-none font-medium">
                      Inafaa kwa shule, ofisi, biashara na kuandika kumbukumbu zako kwa mpangilio.
                    </p>
                  </div>
                  <div className="border-b border-blue-200 pb-1 pl-16">
                    <p className="font-sans text-xs sm:text-sm text-stone-700 leading-none font-medium">
                      Kurasa {currentBook.pages.split('·')[0].trim()} | Imara | Nadhifu | Rahisi kutumia.
                    </p>
                  </div>
                  <div className="border-b border-blue-200 pb-1 pl-16">
                    <p className="font-mono text-[11px] text-stone-400">
                      Standard Feint Ruled · Indigo Precision Ruling · Tanzania
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
                  <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" /> 100% Bleed-Proof Guarantee
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className="font-bold text-red-700 hover:text-red-900 underline"
                  >
                    Close &amp; Back to 3D View →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Product Details, Quire Selector & Direct Order */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-l border-stone-800 pt-5 lg:pt-0 lg:pl-8 w-full">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-950 text-amber-300 border border-red-800/80 mb-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>{selectedQuire} Series · Hardcover Edition</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {language === 'sw' ? currentBook.titleSw : currentBook.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
              {currentBook.description}
            </p>
          </div>

          {/* Quire Selector Buttons (Q2, Q3, Q4) with exact PPTX details */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              {t.selectQuire}
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {(['Q2', 'Q3', 'Q4'] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setSelectedQuire(q)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    selectedQuire === q
                      ? 'bg-red-700/30 border-red-500 text-white shadow-lg ring-1 ring-red-500'
                      : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base">{q}</span>
                    {selectedQuire === q && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="text-[11px] text-stone-300 font-bold font-mono mt-0.5">
                    {quireData[q].pages.split('·')[0].trim()}
                  </div>
                  <div className="text-[10px] text-amber-300/90 font-semibold font-mono mt-0.5">
                    TSh {quireData[q].price.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & Specifications Pill */}
          <div className="bg-stone-900/90 rounded-2xl p-4 sm:p-5 border border-stone-800 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">
                  {language === 'sw' ? 'Bei ya Rejareja' : 'Retail Price'}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  TSh {currentBook.price.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">
                  {language === 'sw' ? 'Bei ya Jumla' : 'Wholesale Price'}
                </span>
                <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
                  TSh {currentBook.wholesale.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-stone-800 flex items-center justify-between text-xs text-stone-300">
              <span className="flex items-center gap-1.5 text-[11px] font-medium">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Thread-Sewn Cloth Spine · Bleed-Proof</span>
              </span>
              <span className="font-mono text-[10px] bg-stone-950 px-2.5 py-1 rounded text-stone-400 border border-stone-800">
                {currentBook.sku}
              </span>
            </div>
          </div>

          {/* Quick Direct WhatsApp CTA */}
          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition-all hover:scale-[1.01] active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{t.orderOnWhatsApp} ({selectedQuire} - TSh {currentBook.price.toLocaleString()})</span>
          </a>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldCheck, Feather, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroGraphicAnimation: React.FC = () => {
  return (
    <div className="relative w-full flex items-center justify-center py-6 sm:py-8 lg:py-0 select-none">
      <div className="relative w-full max-w-md sm:max-w-lg flex items-center justify-center">
        {/* ================= 1. SIMPLE CLEAN BACKGROUND GRAPHICS & LOGO AURA ================= */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Soft warm ambient light pool */}
          <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-[#dc2626]/20 via-amber-600/10 to-[#D64545]/15 blur-3xl animate-omega-pulse-halo" />

          {/* Delicate thin geometric orbital rings */}
          <div className="absolute w-64 h-64 sm:w-84 sm:h-84 rounded-full border border-[#dc2626]/25 border-dashed animate-omega-spin" />
          <div className="absolute w-52 h-52 sm:w-70 sm:h-70 rounded-full border border-white/10 animate-omega-spin-reverse" />

          {/* Clean Greek Omega Watermark */}
          <span className="absolute font-serif text-[160px] sm:text-[220px] font-black text-white/[0.035] select-none pointer-events-none">
            Ω
          </span>
        </div>

        {/* ================= 2. ANIMATED OMEGA LOGO PILL (Floating Top Left) ================= */}
        <div className="absolute -top-2 left-2 sm:left-6 z-20 inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#1a1614]/90 border border-[#dc2626]/40 shadow-xl backdrop-blur-md animate-omega-float">
          <div className="w-5 h-5 rounded-full bg-[#dc2626]/20 flex items-center justify-center p-0.5">
            <img
              src="/logo-icon-white.png"
              alt="OMEGA Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-[#fce3c7]">
            OMEGA TANZANIA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* ================= 3. CLEAN FLOATING PRODUCT VISUAL ================= */}
        <div className="relative z-10 flex flex-col items-center">
          <Link
            to="/catalog?category=Counter+Books"
            className="group relative block transition-transform duration-500 hover:scale-[1.03] cursor-pointer"
            title="Explore OMEGA Counter Books Collection"
          >
            {/* The Book Image with natural 3D floating shadow */}
            <img
              src="/omega-products/counter-book-q4-catalog.jpeg"
              alt="OMEGA Flagship Counter Book Q4"
              className="max-h-[300px] sm:max-h-[380px] lg:max-h-[420px] w-auto object-contain rounded-xl drop-shadow-[0_25px_35px_rgba(0,0,0,0.75)] transition-all duration-500 group-hover:drop-shadow-[0_30px_45px_rgba(196,155,124,0.35)]"
            />

            {/* Subtle natural ground shadow */}
            <div className="w-3/4 mx-auto h-5 bg-black/70 rounded-full blur-lg -mt-2 pointer-events-none" />
          </Link>
        </div>

        {/* ================= 4. FLOATING QUALITY BADGES ================= */}
        {/* Badge 1: Smyth Double Thread-Sewn Spine (Bottom-Left) */}
        <div className="absolute -bottom-3 left-0 sm:left-4 z-20 p-2.5 sm:p-3 rounded-2xl bg-[#1a1614]/90 border border-[#dc2626]/35 shadow-2xl backdrop-blur-md flex items-center gap-2.5 max-w-[210px] animate-omega-float">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-[9px] font-mono font-bold text-[#dc2626] uppercase">
              180° Lay-Flat
            </div>
            <div className="text-[11px] font-bold text-white leading-tight">
              Smyth Thread-Sewn Spine
            </div>
          </div>
        </div>

        {/* Badge 2: 70 GSM Bleed-Proof Paper (Middle-Right) */}
        <div
          style={{ animationDelay: '2.5s' }}
          className="absolute top-1/4 -right-1 sm:right-2 z-20 p-2.5 sm:p-3 rounded-2xl bg-[#1a1614]/90 border border-[#dc2626]/35 shadow-2xl backdrop-blur-md flex items-center gap-2.5 max-w-[190px] animate-omega-float"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Feather className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="text-[9px] font-mono font-bold text-[#dc2626] uppercase">
              70 GSM Bond
            </div>
            <div className="text-[11px] font-bold text-white leading-tight">
              Bleed-Proof Paper
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

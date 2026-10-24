import React from 'react';

export const RouteLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fafafa]/80 backdrop-blur-xs transition-opacity duration-300">
      {/* Top ambient progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#f5f4f4] overflow-hidden z-50">
        <div className="h-full bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#b91c1c] animate-pulse w-full" />
      </div>

      <div className="flex flex-col items-center gap-3 p-6 rounded-[20px] bg-white border border-[#e4e4e7] shadow-xl">
        <div className="w-10 h-10 rounded-full border-2 border-[#e4e4e7] border-t-[#dc2626] animate-spin" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#111113]">
          OMEGA · LOADING
        </span>
      </div>
    </div>
  );
};

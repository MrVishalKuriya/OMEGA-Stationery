import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Language } from '@/types/store';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Clean up any old Google Translate artifacts or cookies that might corrupt words
  useEffect(() => {
    try {
      const hostname = window.location.hostname;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${hostname}; path=/;`;
      const script = document.getElementById('google-translate-script');
      if (script) script.remove();
      const elem = document.getElementById('google_translate_element');
      if (elem) elem.remove();
    } catch {
      // ignore
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left z-40" ref={dropdownRef}>
      {/* Trigger Button: Shows current flag and code (EN / SW) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#e4e4e7] hover:border-[#dc2626] bg-white text-[#18181b] hover:text-[#dc2626] text-xs font-semibold transition-all shadow-2xs hover:bg-[#fafafa]"
        aria-label="Change language (English or Kiswahili)"
        title="Change language / Badili lugha"
      >
        <span className="text-sm leading-none" role="img" aria-label={language === 'sw' ? 'Tanzania' : 'UK'}>
          {language === 'sw' ? '🇹🇿' : '🇬🇧'}
        </span>
        <span className="font-mono font-bold uppercase tracking-wider text-[11px]">
          {language === 'sw' ? 'SW' : 'EN'}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-[#71717a] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#dc2626]' : ''
          }`}
        />
      </button>

      {/* 2-Option Language Dropdown (Strictly English & Swahili Only) */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white border border-[#e4e4e7] shadow-xl overflow-hidden py-1 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-[#f4f4f5] bg-[#fafafa]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717a] block">
              {language === 'sw' ? 'Chagua Lugha' : 'Select Language'}
            </span>
          </div>

          {/* Option 1: English */}
          <button
            type="button"
            onClick={() => handleSelectLanguage('en')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
              language === 'en'
                ? 'bg-[#dc2626]/10 text-[#dc2626] font-bold'
                : 'text-[#18181b] hover:bg-[#f4f4f5]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">🇬🇧</span>
              <div>
                <span className="block leading-tight font-medium">English</span>
                <span className="text-[9px] text-[#71717a] block">Official &amp; Commerce</span>
              </div>
            </div>
            {language === 'en' && <Check className="w-3.5 h-3.5 text-[#dc2626]" />}
          </button>

          {/* Option 2: Kiswahili */}
          <button
            type="button"
            onClick={() => handleSelectLanguage('sw')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
              language === 'sw'
                ? 'bg-[#dc2626]/10 text-[#dc2626] font-bold'
                : 'text-[#18181b] hover:bg-[#f4f4f5]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">🇹🇿</span>
              <div>
                <span className="block leading-tight font-medium">Kiswahili</span>
                <span className="text-[9px] text-[#71717a] block">Lugha ya Taifa</span>
              </div>
            </div>
            {language === 'sw' && <Check className="w-3.5 h-3.5 text-[#dc2626]" />}
          </button>
        </div>
      )}
    </div>
  );
};


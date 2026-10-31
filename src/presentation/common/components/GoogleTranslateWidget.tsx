import React, { useEffect, useState } from 'react';
import { Globe, Languages, ChevronDown, Check } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const POPULAR_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
];

export const GoogleTranslateWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Translate script already exists
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,sw,hi,ar,fr,es,gu,zh-CN,de,pt,ru,ja,ko,it,ur,tr,nl,fa',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            'google_translate_element'
          );
          setIsLoaded(true);
        }
      };
    } else if (window.google && window.google.translate) {
      setIsLoaded(true);
    }

    // Read cookie to detect current language
    const match = document.cookie.match(/googtrans=\/([^/]+)\/([^;]+)/);
    if (match && match[2]) {
      setSelectedLanguage(match[2]);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    setSelectedLanguage(langCode);
    setIsOpen(false);

    // Set google translate cookies across domain and path
    const domain = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    document.cookie = `googtrans=/en/${langCode}; domain=${domain}; path=/;`;

    // Trigger select change if element exists
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      window.location.reload();
    }
  };

  const currentLang = POPULAR_LANGUAGES.find((l) => l.code === selectedLanguage) || {
    code: selectedLanguage,
    name: selectedLanguage.toUpperCase(),
    nativeName: selectedLanguage.toUpperCase(),
    flag: '🌐',
  };

  return (
    <div className="relative inline-block text-left z-50">
      {/* Hidden real Google Translate container */}
      <div id="google_translate_element" className="hidden" />

      {/* Styled Brand Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#e4e4e7] hover:border-[#dc2626] bg-white hover:bg-[#fafafa] text-xs font-bold text-[#18181b] transition-all min-h-[34px] shadow-2xs group focus:outline-none focus:ring-1 focus:ring-[#dc2626]"
        aria-label="Translate website into any language"
        title="Translate Website (Google Translate)"
      >
        <Languages className="w-3.5 h-3.5 text-[#dc2626] group-hover:scale-110 transition-transform" />
        <span className="text-[12px] font-mono font-bold tracking-tight">
          {currentLang.flag} {currentLang.code.toUpperCase()}
        </span>
        <ChevronDown className={`w-3 h-3 text-[#71717a] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#dc2626]' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-[#e4e4e7] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 border-b border-[#e4e4e7] flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#71717a] flex items-center gap-1">
                <Globe className="w-3 h-3 text-[#dc2626]" />
                Google Translate
              </span>
              <span className="text-[9px] font-mono font-bold text-[#dc2626] bg-[#dc2626]/10 px-1.5 py-0.5 rounded">
                All Languages
              </span>
            </div>

            <div className="max-h-64 overflow-y-auto py-1 divide-y divide-[#f4f4f5]">
              {POPULAR_LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors hover:bg-[#fafafa] ${
                      isSelected ? 'bg-[#dc2626]/5 text-[#dc2626] font-bold' : 'text-[#27272a]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <div>
                        <span className="block font-medium">{lang.nativeName}</span>
                        <span className="text-[10px] text-[#71717a] font-mono">{lang.name}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#dc2626]" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Google Trigger link for 100+ languages */}
            <div className="pt-1.5 px-3 border-t border-[#e4e4e7] mt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
                  if (combo) {
                    combo.focus();
                  }
                  setIsOpen(false);
                }}
                className="text-[11px] font-mono text-[#dc2626] hover:underline font-bold"
              >
                + More Languages via Google
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import {
  Cookie,
  ShieldCheck,
  Check,
  X,
  SlidersHorizontal,
  Lock,
  Sparkles,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import {
  CookiePreferences,
  DEFAULT_COOKIE_PREFERENCES,
  getStoredCookieConsent,
  saveCookieConsent,
} from '@/utils/cookieSession';

interface CookieBannerProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ forceOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_COOKIE_PREFERENCES);

  useEffect(() => {
    const existing = getStoredCookieConsent();
    if (existing) {
      setPreferences(existing);
      if (forceOpen) {
        setIsVisible(true);
        setIsPreferencesOpen(true);
      } else {
        setIsVisible(false);
      }
    } else {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    saveCookieConsent(allAccepted);
    setPreferences(allAccepted);
    setIsVisible(false);
    setIsPreferencesOpen(false);
    onClose?.();
  };

  const handleEssentialOnly = () => {
    const essentialOnly: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    saveCookieConsent(essentialOnly);
    setPreferences(essentialOnly);
    setIsVisible(false);
    setIsPreferencesOpen(false);
    onClose?.();
  };

  const handleSaveCustom = () => {
    saveCookieConsent(preferences);
    setIsVisible(false);
    setIsPreferencesOpen(false);
    onClose?.();
  };

  if (!isVisible && !forceOpen) return null;

  return (
    <>
      {/* 1. Quick Bottom Notification Banner */}
      {!isPreferencesOpen && (
        <aside
          role="region"
          aria-label="Cookie and Privacy Consent"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-5 bg-[#111113] text-white border-t border-[#dc2626]/30 shadow-2xl animate-in slide-in-from-bottom-5 font-sans"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 max-w-3xl">
              <div className="w-10 h-10 rounded-full bg-[#162047] border border-[#dc2626]/40 flex items-center justify-center shrink-0 text-[#dc2626]">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-sm text-white">
                    Cookies &amp; Active Session Privacy
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dc2626] text-white uppercase tracking-wider">
                    Privacy First
                  </span>
                </div>
                <p className="text-xs text-stone-200 leading-relaxed">
                  We use secure cookies and active session tokens to keep your shopping bag intact, verify wholesale institutional accounts, remember your language choice (English/Swahili), and provide reliable bus parcel order tracking across Tanzania.
                </p>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2.5 w-full lg:w-auto shrink-0 justify-end">
              <button
                type="button"
                onClick={() => setIsPreferencesOpen(true)}
                className="px-3.5 py-2 rounded-[8px] bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors focus-ring-gold flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize</span>
              </button>

              <button
                type="button"
                onClick={handleEssentialOnly}
                className="px-3.5 py-2 rounded-[8px] bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors focus-ring-gold"
              >
                Essential Only
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 rounded-[8px] btn-indra-primary text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept All Cookies</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Detailed Cookie Preferences Modal */}
      {isPreferencesOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cookie Preferences Manager"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            className="fixed inset-0"
            onClick={() => {
              setIsPreferencesOpen(false);
              onClose?.();
            }}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-xl bg-[#fafafa] text-[#14182B] rounded-[12px] border border-[#e4e4e7] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 font-sans">
            {/* Modal Header */}
            <div className="bg-[#111113] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Cookie className="w-5 h-5 text-[#dc2626]" />
                <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                  Cookie &amp; Session Preferences Center
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPreferencesOpen(false);
                  onClose?.();
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Choose which categories of cookies and persistent session tokens you permit OMEGA Stationery to store on your device. Essential session cookies cannot be disabled as they are required for shopping bag persistence and checkout security.
              </p>

              <div className="space-y-3 pt-2">
                {/* 1. Necessary Cookies (Always On) */}
                <div className="p-3.5 rounded-[8px] bg-white border border-[#e4e4e7] flex items-start justify-between gap-3 shadow-2xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-xs sm:text-sm text-[#14182B]">
                        Strictly Necessary &amp; Session Tokens
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#111113] text-white">
                        Required
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      Essential for user authentication sessions, CSRF protection, shopping bag contents, and order submission.
                    </p>
                    <span className="text-[10px] text-[#6B7280] font-mono block">
                      Expires: 30 days session / local storage
                    </span>
                  </div>

                  <div className="shrink-0 pt-1">
                    <Lock className="w-4 h-4 text-[#2A9D8F]" />
                  </div>
                </div>

                {/* 2. Functional Cookies */}
                <div className="p-3.5 rounded-[8px] bg-white border border-[#e4e4e7] flex items-start justify-between gap-3 shadow-2xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-xs sm:text-sm text-[#14182B]">
                        Functional &amp; Personalization
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2A9D8F]/20 text-[#2A9D8F]">
                        Convenience
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      Remembers your Swahili/English language choice, saved wishlist items, and recent search history.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) =>
                        setPreferences({ ...preferences, functional: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#111113]"></div>
                  </label>
                </div>

                {/* 3. Analytics Cookies */}
                <div className="p-3.5 rounded-[8px] bg-white border border-[#e4e4e7] flex items-start justify-between gap-3 shadow-2xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-xs sm:text-sm text-[#14182B]">
                        Catalog Analytics &amp; Inventory Metrics
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#dc2626]/25 text-[#111113]">
                        Performance
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      Helps our Kariakoo logistics warehouse understand high-demand books (Q2, Q3, Q4) to prevent stockouts.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({ ...preferences, analytics: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#111113]"></div>
                  </label>
                </div>

                {/* 4. Marketing & B2B Tenders */}
                <div className="p-3.5 rounded-[8px] bg-white border border-[#e4e4e7] flex items-start justify-between gap-3 shadow-2xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-xs sm:text-sm text-[#14182B]">
                        Wholesale Tenders &amp; Discounts
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-200 text-[#14182B]">
                        Optional
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      Enables personalized carton discounts and alerts when seasonal school stationery tenders open.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences({ ...preferences, marketing: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#111113]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-[#e4e4e7] bg-white flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="text-xs font-bold text-[#111113] hover:underline"
              >
                Accept All
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPreferencesOpen(false);
                    onClose?.();
                  }}
                  className="px-3 py-2 rounded-[8px] bg-white border border-[#e4e4e7] hover:bg-[#F3EEE2] text-xs font-bold text-[#14182B]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="px-4 py-2 rounded-[8px] btn-indra-primary text-xs font-bold"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

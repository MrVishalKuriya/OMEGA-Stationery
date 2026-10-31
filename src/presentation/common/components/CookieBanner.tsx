import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X, Check, Sliders } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'omega_cookie_consent_v1';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  preferences: boolean;
  timestamp: string;
}

export interface CookieBannerProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ forceOpen = false, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [preferencesEnabled, setPreferencesEnabled] = useState(true);

  useEffect(() => {
    if (forceOpen) {
      setIsVisible(true);
      setShowDetails(true);
      return;
    }
    try {
      const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!saved) {
        const timer = setTimeout(() => setIsVisible(true), 900);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [forceOpen]);

  // Listen for footer "Cookie Preferences" trigger
  useEffect(() => {
    const handleOpenCookieSettings = () => {
      try {
        const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (saved) {
          const parsed: CookiePreferences = JSON.parse(saved);
          setAnalyticsEnabled(Boolean(parsed.analytics));
          setPreferencesEnabled(Boolean(parsed.preferences));
        }
      } catch {
        // Ignore parse errors
      }
      setShowDetails(true);
      setIsVisible(true);
    };

    window.addEventListener('omega:open-cookie-settings', handleOpenCookieSettings);
    return () =>
      window.removeEventListener('omega:open-cookie-settings', handleOpenCookieSettings);
  }, []);

  const saveConsent = (prefs: Omit<CookiePreferences, 'timestamp'>) => {
    const payload: CookiePreferences = {
      ...prefs,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage errors
    }
    setIsVisible(false);
    setShowDetails(false);
    onClose?.();
  };

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      preferences: true,
    });
  };

  const handleEssentialOnly = () => {
    saveConsent({
      essential: true,
      analytics: false,
      preferences: false,
    });
  };

  const handleSaveCustom = () => {
    saveConsent({
      essential: true,
      analytics: analyticsEnabled,
      preferences: preferencesEnabled,
    });
  };

  if (!isVisible && !forceOpen) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and data privacy consent"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-lg z-50 animate-fade-in"
    >
      <div className="bg-paper-base text-charcoal-ink rounded-[4px] shadow-2xl border-2 border-[#111113] p-5 sm:p-6 relative overflow-hidden">
        {/* Top Crimson Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#DC2626]" />

        <div className="flex items-start justify-between gap-3 mb-3 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[4px] bg-[#111113] text-white flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4 text-[#DC2626]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-charcoal-ink text-base leading-tight">
                Privacy &amp; Cookie Notice
              </h4>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B91C1C] flex items-center gap-1 mt-0.5 font-mono">
                <ShieldCheck className="w-3 h-3" /> Tanzania PDPA 2022 &amp; GDPR Compliant
              </span>
            </div>
          </div>

          <button
            onClick={handleEssentialOnly}
            aria-label="Dismiss with essential cookies only"
            className="w-8 h-8 rounded-[4px] bg-white border border-[#E7E5E0] flex items-center justify-center text-charcoal-ink hover:bg-[#DC2626] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#3F3F46] font-medium leading-relaxed mb-4">
          We use strictly necessary storage to keep your{' '}
          <strong className="text-charcoal-ink font-bold">shopping cart</strong>,{' '}
          <strong className="text-charcoal-ink font-bold">saved wishlist</strong>, and{' '}
          <strong className="text-charcoal-ink font-bold">language preference (EN/SW)</strong>{' '}
          active across visits. In accordance with the{' '}
          <span className="font-bold text-charcoal-ink">
            Tanzania Personal Data Protection Act (PDPA)
          </span>
          , we never sell your personal or institutional procurement data.
        </p>

        {showDetails && (
          <div className="mb-4 p-3.5 rounded-[4px] bg-white border border-[#E7E5E0] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-charcoal-ink">Strictly Necessary (Always Active)</p>
                <p className="text-[11px] text-[#3F3F46] font-medium">
                  Shopping bag, B2B quote calculator, and security tokens.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-[4px] bg-[#15803D] text-white font-bold text-[10px] uppercase tracking-wider">
                Required
              </span>
            </div>

            <label className="flex items-center justify-between pt-2.5 border-t border-[#E7E5E0] cursor-pointer">
              <div>
                <p className="font-bold text-charcoal-ink">Functional Preferences</p>
                <p className="text-[11px] text-[#3F3F46] font-medium">
                  Remembers Kiswahili/English language and regional delivery defaults.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferencesEnabled}
                onChange={(e) => setPreferencesEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#DC2626] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between pt-2.5 border-t border-[#E7E5E0] cursor-pointer">
              <div>
                <p className="font-bold text-charcoal-ink">Anonymous Catalog Analytics</p>
                <p className="text-[11px] text-[#3F3F46] font-medium">
                  Helps our Mbeya factory forecast school season paper stock demand.
                </p>
              </div>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#DC2626] rounded cursor-pointer"
              />
            </label>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {showDetails ? (
            <button
              onClick={handleSaveCustom}
              className="flex-1 py-2.5 px-4 rounded-[4px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> Save Preferences
            </button>
          ) : (
            <button
              onClick={handleAcceptAll}
              className="flex-1 py-2.5 px-4 rounded-[4px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> Accept All
            </button>
          )}

          <button
            onClick={handleEssentialOnly}
            className="py-2.5 px-3.5 rounded-[4px] border border-[#D4D2CD] bg-white hover:bg-paper-base text-charcoal-ink font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Essential Only
          </button>

          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className="py-2.5 px-3 rounded-[4px] text-[#3F3F46] hover:text-charcoal-ink font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            {showDetails ? 'Hide' : 'Customize'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default CookieBanner;

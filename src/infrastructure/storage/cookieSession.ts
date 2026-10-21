import { UserProfile } from '@/types/store';

export interface CookiePreferences {
  necessary: boolean; // Always true
  functional: boolean; // Cart, language, wishlist
  analytics: boolean; // Catalog view statistics
  marketing: boolean; // B2B wholesale tenders & custom alerts
  consentGivenAt?: string;
}

export interface SessionData {
  sessionId: string;
  userId: string;
  userEmail: string;
  userName: string;
  accountType: string;
  createdAt: string;
  expiresAt: string;
  device: string;
  ipLocation: string;
}

const COOKIE_NAMES = {
  CONSENT: 'omega_cookie_consent_v1',
  SESSION: 'omega_session_token_v1',
  PREFERENCES: 'omega_pref_v1',
};

/**
 * Standard secure cookie getter
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Standard secure cookie setter with SameSite and Max-Age
 */
export function setCookie(name: string, value: string, days = 30): void {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

/**
 * Standard cookie deleter
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Cookie Consent Handlers
 */
export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: false,
};

export function getStoredCookieConsent(): CookiePreferences | null {
  try {
    const raw = getCookie(COOKIE_NAMES.CONSENT);
    if (raw) return JSON.parse(raw);
    const local = localStorage.getItem(COOKIE_NAMES.CONSENT);
    if (local) return JSON.parse(local);
  } catch {
    // Ignore error
  }
  return null;
}

export function saveCookieConsent(prefs: CookiePreferences): void {
  const updated = {
    ...prefs,
    necessary: true,
    consentGivenAt: new Date().toISOString(),
  };
  try {
    setCookie(COOKIE_NAMES.CONSENT, JSON.stringify(updated), 365);
    localStorage.setItem(COOKIE_NAMES.CONSENT, JSON.stringify(updated));
  } catch {
    // Ignore error
  }
}

/**
 * Session Token & State Handlers
 */
export function createSession(user: UserProfile, rememberMe = true): SessionData {
  const now = new Date();
  const days = rememberMe ? 30 : 1;
  const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

  const session: SessionData = {
    sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    accountType: user.accountType || 'individual',
    createdAt: now.toISOString(),
    expiresAt,
    device: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 48) : 'Web Client',
    ipLocation: 'Dar es Salaam, Tanzania (EAC Region)',
  };

  try {
    setCookie(COOKIE_NAMES.SESSION, JSON.stringify(session), days);
    localStorage.setItem(COOKIE_NAMES.SESSION, JSON.stringify(session));
  } catch {
    // Ignore error
  }

  return session;
}

export function getActiveSession(): SessionData | null {
  try {
    let sessionRaw = getCookie(COOKIE_NAMES.SESSION);
    if (!sessionRaw) {
      sessionRaw = localStorage.getItem(COOKIE_NAMES.SESSION);
    }
    if (sessionRaw) {
      const parsed: SessionData = JSON.parse(sessionRaw);
      // Validate expiration
      if (new Date(parsed.expiresAt).getTime() > Date.now()) {
        return parsed;
      }
      // Expired
      destroySession();
    }
  } catch {
    destroySession();
  }
  return null;
}

export function destroySession(): void {
  try {
    deleteCookie(COOKIE_NAMES.SESSION);
    localStorage.removeItem(COOKIE_NAMES.SESSION);
  } catch {
    // Ignore error
  }
}

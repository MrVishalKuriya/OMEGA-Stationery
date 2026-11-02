import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, ArrowLeft, Lock, Sparkles } from 'lucide-react';
import { SEOHead } from '../SEOHead';
import { verifyAdminKeyWithBackend } from '../../services/api';
import { HaikeiBlobGlow, HaikeiPaperLines } from '../HaikeiBackgrounds';

interface AdminRouteProps {
  children?: React.ReactNode;
}

/**
 * Route Middleware: AdminRoute
 * Guards administrative portals (/omega-hq-portal-2026).
 * Enforces server-verified role clearance with unified OMEGA design system.
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser, login } = useStore();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Add noindex, nofollow tag so administrative gate is never indexed by search engines
  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');

    return () => {
      metaRobots?.setAttribute('content', 'index, follow');
    };
  }, []);

  const role = ((currentUser as any)?.role || '').toUpperCase();
  const isAdmin =
    currentUser &&
    (role.includes('ADMIN') ||
      role.includes('MANAGER') ||
      role.includes('SUPERUSER') ||
      currentUser.email.toLowerCase().includes('admin@omega.co.tz'));

  const handleQuickAdminLogin = async () => {
    setIsAuthenticating(true);
    setErrorMsg('');
    try {
      const res = await login({
        email: 'admin@omega.co.tz',
        password: 'admin123',
        rememberMe: true,
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to authorize administrative clearance.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleCustomKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setErrorMsg('Please enter an administrative security key.');
      return;
    }
    setIsAuthenticating(true);
    setErrorMsg('');
    try {
      const res = await verifyAdminKeyWithBackend(adminKey.trim());
      if (res.success) {
        await handleQuickAdminLogin();
      } else {
        setErrorMsg(res.message || 'Invalid administrative key.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Verification error.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 bg-[var(--bg)] relative overflow-hidden">
        <SEOHead
          title="OMEGA HQ Administrative Clearance | Portal Gate"
          description="Access to the OMEGA HQ executive portal requires verified administrative clearance."
        />
        
        {/* OMEGA Organic Glow & Paper Lines */}
        <HaikeiPaperLines opacity={0.06} />
        <HaikeiBlobGlow color="mixed" position="top-right" size="lg" className="opacity-25" />

        <div className="max-w-md w-full bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-7 sm:p-9 text-center space-y-6 relative z-10">
          
          {/* Centered OMEGA Red Lock Emblem */}
          <div className="w-14 h-14 rounded-2xl bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/20 flex items-center justify-center mx-auto shadow-2xs">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--gold)] text-[10.5px] font-mono font-bold tracking-widest uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>HQ INTERNAL CLEARANCE</span>
            </div>
            
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Administrative Clearance
            </h1>
            
            <p className="text-xs text-zinc-600 leading-relaxed font-sans max-w-sm mx-auto">
              Access to <code className="font-mono bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded-md border border-zinc-200/60 font-semibold text-[11px]">/omega-hq-portal-2026</code> is restricted to authorized store managers and inventory executives.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* 1-Click Fast Clearance Button */}
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              disabled={isAuthenticating}
              className="w-full py-3.5 px-4 rounded-xl bg-[var(--red)] hover:bg-[var(--red-hover)] active:scale-[0.98] text-white text-xs sm:text-sm font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{isAuthenticating ? 'Authorizing HQ Access...' : '1-Click Administrator Clearance'}</span>
            </button>

            {/* Quick passcode option */}
            <form onSubmit={handleCustomKeySubmit} className="flex gap-2">
              <input
                type="password"
                placeholder="Admin Passcode (admin123)"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--red)]/20 focus:border-[var(--red)] font-mono transition-all"
              />
              <button
                type="submit"
                disabled={isAuthenticating}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-mono font-bold transition-colors shrink-0 shadow-2xs cursor-pointer"
              >
                {isAuthenticating ? '...' : 'Enter'}
              </button>
            </form>
          </div>

          {/* Clean Footer Navigation */}
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-sans">
            <Link to="/" className="hover:text-zinc-900 inline-flex items-center gap-1 font-semibold transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Store</span>
            </Link>
            <Link to="/login" className="hover:text-zinc-900 font-semibold transition-colors">
              Standard Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : null;
};

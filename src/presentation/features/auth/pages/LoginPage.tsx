import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  UserCheck,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { SEOHead } from '@/components/SEOHead';

export const LoginPage: React.FC = () => {
  const { currentUser, login, isBackendOnline } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      // If already logged in, redirect to account page
      // Allow slight delay so user can choose to sign out if desired
    }
  }, [currentUser]);

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await login({ email, password, rememberMe });
      if (res.success) {
        navigate('/account');
      } else {
        setErrorMessage(res.error || 'Failed to sign in. Please check your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-[#fafafa]">
        <SEOHead
          title="Account Active | OMEGA Stationery & Books"
          description="Manage your OMEGA account, order history and wholesale profile."
        />
        <div className="max-w-md w-full bg-white rounded-[16px] border border-[#e4e4e7] shadow-boutique p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white font-bold text-xl flex items-center justify-center font-mono mx-auto shadow-sm">
            {currentUser.initials}
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-[#0f172a]">
              Already Signed In
            </h1>
            <p className="text-sm text-[#6B7280] mt-1 font-mono">
              {currentUser.email}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold mt-3">
              <ShieldCheck className="w-4 h-4" />
              <span>{currentUser.accountType.toUpperCase()} ACCOUNT</span>
            </div>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              to="/account"
              className="w-full py-3 px-4 rounded-[8px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Go to My Account &amp; Orders</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/catalog"
              className="w-full py-2.5 px-4 rounded-[8px] bg-white border border-[#e4e4e7] hover:bg-[#fafafa] text-[#0f172a] text-xs font-bold block"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#fafafa]">
      <SEOHead
        title="Sign In | OMEGA Stationery & Books Tanzania"
        description="Sign in to your OMEGA account to access order tracking, institutional quotas, and wholesale pricing."
      />

      <div className="max-w-lg w-full">
        {/* Main Card */}
        <div className="bg-white rounded-[16px] border border-[#e4e4e7] shadow-boutique overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#991b1b] via-[#dc2626] to-[#b91c1c] text-white p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-[#dc2626] uppercase font-bold">
                  OMEGA Member Portal
                </span>
                <h1 className="text-2xl font-serif font-bold mt-1 text-white">
                  Sign In to Account
                </h1>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#dc2626]">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-stone-300 mt-2">
              Access order tracking, commercial invoices, and wholesale stationery discounts.
            </p>

            {/* Backend connection status pill */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-white/10 border border-white/20 text-stone-200">
              <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isBackendOnline ? 'MongoDB Atlas Backend: Online' : 'Local Resilient Session Active'}</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {/* 1-Click Demo Logins */}
            <div className="p-3.5 rounded-[10px] bg-[#fafafa] border border-[#e4e4e7]">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#0f172a]">
                <Sparkles className="w-4 h-4 text-[#dc2626]" />
                <span>Quick Test Accounts (1-Click Fill)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoFill('admin@omega.co.tz', 'admin123')}
                  className="p-2 rounded-[6px] bg-[#111113]/5 border-2 border-[#dc2626] hover:bg-[#111113]/10 text-left transition-colors text-xs"
                >
                  <div className="font-bold text-[#0f172a] flex items-center gap-1">
                    <span>HQ Admin</span>
                    <span className="text-[9px] bg-[#dc2626] text-white px-1.5 py-0.2 rounded font-bold">PORTAL</span>
                  </div>
                  <div className="text-[10px] text-[#0f172a] font-medium">admin@omega.co.tz</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('mussa.juma@omega.co.tz', 'password123')}
                  className="p-2 rounded-[6px] bg-white border border-[#e4e4e7] hover:border-[#dc2626] text-left transition-colors text-xs"
                >
                  <div className="font-bold text-[#0f172a]">Mussa Juma</div>
                  <div className="text-[10px] text-[#6B7280]">Wholesale Partner</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('purchasing@daracademy.sc.tz', 'school123')}
                  className="p-2 rounded-[6px] bg-white border border-[#e4e4e7] hover:border-[#dc2626] text-left transition-colors text-xs"
                >
                  <div className="font-bold text-[#0f172a]">Dar Academy</div>
                  <div className="text-[10px] text-[#6B7280]">School / Tender</div>
                </button>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 rounded-[8px] bg-[#D64545]/10 border border-[#D64545]/30 text-[#D64545] text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] mb-1">
                  Email Address or Phone
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. mussa.juma@omega.co.tz"
                    className="w-full pl-9 pr-3 py-2.5 rounded-[8px] bg-white border border-[#e4e4e7] text-xs focus:border-[#dc2626] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#0f172a]">
                    Password
                  </label>
                  <span className="text-[11px] text-[#0f172a] font-medium hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-[8px] bg-white border border-[#e4e4e7] text-xs focus:border-[#dc2626] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#6B7280] hover:text-[#0f172a]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#0f172a]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#e4e4e7] text-[#0f172a] focus:ring-[#dc2626]"
                  />
                  <span>Remember me for 30 days</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-[8px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Sign In to OMEGA Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer switcher */}
            <div className="pt-4 border-t border-[#e4e4e7] text-center text-xs text-[#6B7280]">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                className="font-bold text-[#0f172a] hover:underline"
              >
                Create Account (Individual, Wholesale or School)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

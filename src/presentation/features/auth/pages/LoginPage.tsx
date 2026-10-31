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
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-[#F7F7F7]">
        <SEOHead
          title="Account Active | OMEGA Stationery & Books"
          description="Manage your OMEGA account, order history and wholesale profile."
        />
        <div className="max-w-md w-full bg-white rounded-[2px] border border-[#EEEEEE] p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-[2px] bg-[#DC2626] text-white font-bold text-xl flex items-center justify-center font-mono mx-auto">
            {currentUser.initials}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#111113]">
              Already Signed In
            </h1>
            <p className="text-sm text-[#77767B] mt-1 font-mono">
              {currentUser.email}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-[#111113] text-white text-xs font-bold mt-3">
              <ShieldCheck className="w-4 h-4 text-[#DC2626]" />
              <span>{currentUser.accountType.toUpperCase()} ACCOUNT</span>
            </div>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              to="/account"
              className="w-full py-3 px-4 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Go to My Account &amp; Orders</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/catalog"
              className="w-full py-2.5 px-4 rounded-[2px] bg-white border border-[#E5E7EB] hover:bg-[#F7F7F7] text-[#111113] text-xs font-bold uppercase tracking-wider block"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#F7F7F7]">
      <SEOHead
        title="Sign In | OMEGA Stationery & Books Tanzania"
        description="Sign in to your OMEGA account to access order tracking, institutional quotas, and wholesale pricing."
      />

      <div className="max-w-lg w-full">
        {/* Main Card */}
        <div className="bg-white rounded-[2px] border border-[#EEEEEE] overflow-hidden">
          {/* Card Header with Reduced Dark Filter & Warm Light Filter */}
          <div className="relative overflow-hidden bg-[#1B1B1E] text-white p-6 sm:p-8 border-b-4 border-[#DC2626]">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-75 brightness-110 contrast-105 pointer-events-none"
              style={{ backgroundImage: `url('/hero-desk-bg.jpg')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111113]/65 via-[#111113]/45 to-[#111113]/20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-[#F9F8F6]/15 to-white/25 mix-blend-soft-light pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-[#DC2626] uppercase font-bold">
                  OMEGA Member Portal
                </span>
                <h1 className="text-2xl font-extrabold mt-1 text-white">
                  Sign In to Account
                </h1>
              </div>
              <div className="w-12 h-12 rounded-[2px] bg-[#DC2626] flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <p className="relative z-10 text-xs text-white/85 mt-2">
              Access order tracking, commercial invoices, and wholesale stationery discounts.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {/* 1-Click Demo Logins */}
            <div className="p-3.5 rounded-[2px] bg-[#F7F7F7] border border-[#EEEEEE]">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#111113]">
                <Sparkles className="w-4 h-4 text-[#DC2626]" />
                <span>Quick Test Accounts (1-Click Fill)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoFill('admin@omega.co.tz', 'admin123')}
                  className="p-2 rounded-[2px] bg-white border border-[#DC2626] hover:bg-[#F7F7F7] text-left transition-colors text-xs cursor-pointer"
                >
                  <div className="font-bold text-[#111113] flex items-center gap-1">
                    <span>HQ Admin</span>
                    <span className="text-[9px] bg-[#DC2626] text-white px-1.5 py-0.2 rounded-[2px] font-bold">PORTAL</span>
                  </div>
                  <div className="text-[10px] text-[#77767B] font-medium">admin@omega.co.tz</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('mussa.juma@omega.co.tz', 'password123')}
                  className="p-2 rounded-[2px] bg-white border border-[#E5E7EB] hover:border-[#DC2626] text-left transition-colors text-xs cursor-pointer"
                >
                  <div className="font-bold text-[#111113]">Mussa Juma</div>
                  <div className="text-[10px] text-[#77767B]">Wholesale Partner</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('purchasing@daracademy.sc.tz', 'school123')}
                  className="p-2 rounded-[2px] bg-white border border-[#E5E7EB] hover:border-[#DC2626] text-left transition-colors text-xs cursor-pointer"
                >
                  <div className="font-bold text-[#111113]">Dar Academy</div>
                  <div className="text-[10px] text-[#77767B]">School / Tender</div>
                </button>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 rounded-[2px] bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111113] mb-1">
                  Email Address or Phone
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#77767B] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. mussa.juma@omega.co.tz"
                    className="w-full pl-9 pr-3 py-2.5 rounded-[2px] bg-[#F7F7F7] border border-[#E5E7EB] text-xs focus:border-[#DC2626] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#111113]">
                    Password
                  </label>
                  <span className="text-[11px] text-[#DC2626] font-medium hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#77767B] absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-[2px] bg-[#F7F7F7] border border-[#E5E7EB] text-xs focus:border-[#DC2626] focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#77767B] hover:text-[#111113]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#111113]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded-[2px] border-[#E5E7EB] accent-[#DC2626]"
                  />
                  <span>Remember me for 30 days</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-all cursor-pointer"
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
            <div className="pt-4 border-t border-[#EEEEEE] text-center text-xs text-[#77767B]">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                className="font-bold text-[#DC2626] hover:underline"
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

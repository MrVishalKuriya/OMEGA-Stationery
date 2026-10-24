import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Building2,
  GraduationCap,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export const AuthModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    register,
  } = useStore();

  // Mode state: 'login' | 'register'
  const isLogin = authModalMode === 'login';

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<'individual' | 'wholesale' | 'school'>('individual');
  const [rememberMe, setRememberMe] = useState(true);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset or clear errors when modal opens or mode changes
  useEffect(() => {
    if (isAuthModalOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAuthModalOpen, authModalMode]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleDemoFill = () => {
    setEmail('mussa.juma@omega.co.tz');
    setPassword('password123');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        // Sign In Flow with persistent session cookie option
        const result = await login({ email, password, rememberMe });
        if (!result.success) {
          setErrorMessage(result.error || 'Failed to sign in. Please verify your credentials.');
        } else {
          closeAuthModal();
          navigate('/account');
        }

      } else {
        // Register Flow
        if (password && confirmPassword && password !== confirmPassword) {
          setErrorMessage('Passwords do not match. Please re-enter.');
          setIsLoading(false);
          return;
        }

        const result = await register({
          name,
          email,
          phone: phone || '+255 715 268 391',
          password,
          accountType,
        });

        if (!result.success) {
          setErrorMessage(result.error || 'Failed to create account. Please try again.');
        } else {
          closeAuthModal();
          navigate('/account');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isLogin ? 'Sign In to OMEGA' : 'Create OMEGA Account'}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-[#fafafa] text-[#14182B] rounded-[12px] border border-[#e4e4e7] shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Top Header Banner */}
        <div className="bg-[#111113] text-white p-6 relative">
          <button
            type="button"
            onClick={closeAuthModal}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus-ring-gold"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white p-1 rounded-[10px] border border-white/20 shadow-xs w-9 h-9 flex items-center justify-center shrink-0">
              <img
                src="/logo-icon.png"
                alt="OMEGA Icon"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-heading text-lg font-bold tracking-tight text-white block leading-none">
                OMEGA Stationery
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#dc2626] font-bold">
                Tanzania · Est. 1998
              </span>
            </div>
          </div>

          <h3 className="font-heading text-xl font-bold text-white mt-3">
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </h3>
          <p className="text-xs text-stone-200 mt-0.5">
            {isLogin
              ? 'Sign in to access order tracking, invoices and wholesale pricing.'
              : 'Join OMEGA to save delivery addresses and access wholesale discount tiers.'}
          </p>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 mt-4 p-1 rounded-[8px] bg-[#162047] border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className={`py-2 rounded-[6px] transition-all flex items-center justify-center gap-1.5 ${
                isLogin
                  ? 'btn-indra-primary shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              className={`py-2 rounded-[6px] transition-all flex items-center justify-center gap-1.5 ${
                !isLogin
                  ? 'btn-indra-primary shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 rounded-[8px] bg-[#D64545]/10 border border-[#D64545]/30 text-[#D64545] text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="p-3 rounded-[8px] bg-[#2A9D8F]/10 border border-[#2A9D8F]/30 text-[#2A9D8F] text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1-Click Test Credentials Helper */}
          {isLogin && (
            <div className="p-2.5 rounded-[8px] bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-[11px] text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-[#dc2626] shrink-0" />
                <span>Test: <strong className="font-mono text-[#111113]">mussa.juma@omega.co.tz</strong></span>
              </div>
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-[11px] font-bold text-[#111113] bg-white border border-[#e4e4e7] hover:bg-[#111113] hover:text-white px-2.5 py-1 rounded-[6px] transition-colors shrink-0 shadow-xs"
              >
                Auto-Fill
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* REGISTER: Full Name */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#14182B] mb-1">
                  Full Name <span className="text-[#D64545]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mussa Juma"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white rounded-[8px] border border-[#e4e4e7] text-[#14182B] placeholder:text-[#6B7280] focus-ring-gold shadow-xs"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#14182B] mb-1">
                Email Address <span className="text-[#D64545]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-white rounded-[8px] border border-[#e4e4e7] text-[#14182B] placeholder:text-[#6B7280] focus-ring-gold shadow-xs"
                />
              </div>
            </div>

            {/* REGISTER: Phone / WhatsApp Number */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#14182B] mb-1">
                  Phone / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+255 715 268 391"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white rounded-[8px] border border-[#e4e4e7] text-[#14182B] placeholder:text-[#6B7280] focus-ring-gold shadow-xs"
                  />
                </div>
              </div>
            )}

            {/* REGISTER: Account Type Selector */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#14182B] mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType('individual')}
                    className={`p-2.5 rounded-[8px] border text-center transition-all ${
                      accountType === 'individual'
                        ? 'bg-[#111113] text-white border-[#111113] font-bold shadow-xs'
                        : 'bg-white text-[#14182B] border-[#e4e4e7] hover:bg-[#F3EEE2] text-xs'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 mx-auto mb-1 opacity-80" />
                    <span className="text-[11px] block leading-tight">Student / Retail</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('wholesale')}
                    className={`p-2.5 rounded-[8px] border text-center transition-all ${
                      accountType === 'wholesale'
                        ? 'bg-[#111113] text-white border-[#111113] font-bold shadow-xs'
                        : 'bg-white text-[#14182B] border-[#e4e4e7] hover:bg-[#F3EEE2] text-xs'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1 opacity-80" />
                    <span className="text-[11px] block leading-tight">Wholesale Desk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('school')}
                    className={`p-2.5 rounded-[8px] border text-center transition-all ${
                      accountType === 'school'
                        ? 'bg-[#111113] text-white border-[#111113] font-bold shadow-xs'
                        : 'bg-white text-[#14182B] border-[#e4e4e7] hover:bg-[#F3EEE2] text-xs'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 mx-auto mb-1 opacity-80" />
                    <span className="text-[11px] block leading-tight">School / College</span>
                  </button>
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#14182B]">
                  Password <span className="text-[#D64545]">*</span>
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={handleDemoFill}
                    className="text-[11px] font-semibold text-[#111113] hover:text-[#dc2626] transition-colors"
                  >
                    Fill Demo Account
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-white rounded-[8px] border border-[#e4e4e7] text-[#14182B] placeholder:text-[#6B7280] focus-ring-gold shadow-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#14182B] p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* REGISTER: Confirm Password */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#14182B] mb-1">
                  Confirm Password <span className="text-[#D64545]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white rounded-[8px] border border-[#e4e4e7] text-[#14182B] placeholder:text-[#6B7280] focus-ring-gold shadow-xs font-mono"
                  />
                </div>
              </div>
            )}

            {/* Remember Me & Terms Checkbox */}
            {isLogin ? (
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#111113] focus:ring-[#dc2626]"
                  />
                  <span>Remember this device</span>
                </label>
                <span className="text-[11px] text-[#111113] cursor-pointer hover:underline">
                  Need help?
                </span>
              </div>
            ) : (
              <div className="text-[11px] text-[#6B7280] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2A9D8F] shrink-0" />
                <span>Your data is protected under Tanzania official data privacy policy.</span>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-[8px] btn-indra-primary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#111113]" />
                  <span>Processing...</span>
                </>
              ) : isLogin ? (
                <>
                  <span>Sign In to OMEGA</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch Hint */}
          <div className="pt-2 border-t border-[#e4e4e7] text-center text-xs text-[#6B7280]">
            {isLogin ? (
              <p>
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="font-bold text-[#111113] hover:text-[#dc2626] transition-colors underline ml-1"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an OMEGA account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="font-bold text-[#111113] hover:text-[#dc2626] transition-colors underline ml-1"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

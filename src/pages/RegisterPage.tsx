import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  GraduationCap,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SEOHead } from '../components/SEOHead';

export const RegisterPage: React.FC = () => {
  const { register, isBackendOnline } = useStore();
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState<'individual' | 'wholesale' | 'school'>('individual');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreeTerms) {
      setErrorMessage('Please accept the OMEGA Stationery terms of service.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const displayName = organization.trim()
        ? `${name.trim()} (${organization.trim()})`
        : name.trim();

      const res = await register({
        name: displayName,
        email: email.trim(),
        phone: phone.trim() || '+255 715 000 000',
        password,
        accountType,
      });

      if (res.success) {
        navigate('/account');
      } else {
        setErrorMessage(res.error || 'Failed to create account. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-[#FAF7F0]">
      <SEOHead
        title="Create Account | OMEGA Stationery & Books Tanzania"
        description="Register for an OMEGA Stationery account: retail member, wholesale partner, or educational institution."
      />

      <div className="max-w-xl w-full">
        {/* Main Registration Card */}
        <div className="bg-white rounded-[16px] border border-[#E4DDCC] shadow-boutique overflow-hidden">
          {/* Header */}
          <div className="bg-[#1E2A5E] text-white p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-[#F5A623] uppercase font-bold">
                  New Customer Registration
                </span>
                <h1 className="text-2xl font-serif font-bold mt-1 text-white">
                  Join OMEGA Stationery
                </h1>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#F5A623]">
                <UserPlus className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-stone-300 mt-2">
              Select your account type below to receive tailored commercial discounts, tax receipts, and order tracking.
            </p>

            {/* Backend connection status pill */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-white/10 border border-white/20 text-stone-200">
              <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isBackendOnline ? 'MongoDB Account Sync: Ready' : 'Instant Resilient Local Storage'}</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {/* Account Type Selector */}
            <div>
              <label className="block text-xs font-bold text-[#14182B] mb-2 uppercase tracking-wider font-mono">
                1. Select Account Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Individual */}
                <button
                  type="button"
                  onClick={() => setAccountType('individual')}
                  className={`p-3 rounded-[10px] border text-left transition-all ${
                    accountType === 'individual'
                      ? 'border-[#1E2A5E] bg-[#1E2A5E]/5 shadow-xs ring-1 ring-[#1E2A5E]'
                      : 'border-[#E4DDCC] hover:border-stone-400 bg-white'
                  }`}
                >
                  <ShoppingBag className={`w-5 h-5 mb-1.5 ${accountType === 'individual' ? 'text-[#1E2A5E]' : 'text-[#6B7280]'}`} />
                  <div className="font-bold text-xs text-[#14182B]">Individual</div>
                  <div className="text-[10px] text-[#6B7280] mt-0.5">Personal &amp; Retail</div>
                </button>

                {/* Wholesale */}
                <button
                  type="button"
                  onClick={() => setAccountType('wholesale')}
                  className={`p-3 rounded-[10px] border text-left transition-all ${
                    accountType === 'wholesale'
                      ? 'border-[#1E2A5E] bg-[#1E2A5E]/5 shadow-xs ring-1 ring-[#1E2A5E]'
                      : 'border-[#E4DDCC] hover:border-stone-400 bg-white'
                  }`}
                >
                  <Building2 className={`w-5 h-5 mb-1.5 ${accountType === 'wholesale' ? 'text-[#1E2A5E]' : 'text-[#6B7280]'}`} />
                  <div className="font-bold text-xs text-[#14182B]">Wholesale</div>
                  <div className="text-[10px] text-[#6B7280] mt-0.5">Bulk / Corporate</div>
                </button>

                {/* School */}
                <button
                  type="button"
                  onClick={() => setAccountType('school')}
                  className={`p-3 rounded-[10px] border text-left transition-all ${
                    accountType === 'school'
                      ? 'border-[#1E2A5E] bg-[#1E2A5E]/5 shadow-xs ring-1 ring-[#1E2A5E]'
                      : 'border-[#E4DDCC] hover:border-stone-400 bg-white'
                  }`}
                >
                  <GraduationCap className={`w-5 h-5 mb-1.5 ${accountType === 'school' ? 'text-[#1E2A5E]' : 'text-[#6B7280]'}`} />
                  <div className="font-bold text-xs text-[#14182B]">School / Inst.</div>
                  <div className="text-[10px] text-[#6B7280] mt-0.5">Educational Quotas</div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-[8px] bg-[#D64545]/10 border border-[#D64545]/30 text-[#D64545] text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-xs font-bold text-[#14182B] uppercase tracking-wider font-mono">
                2. Contact &amp; Security Credentials
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#14182B] mb-1">
                    Contact Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Mussa Juma"
                      className="w-full pl-9 pr-3 py-2.5 rounded-[8px] bg-white border border-[#E4DDCC] text-xs focus:border-[#1E2A5E] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#14182B] mb-1">
                    {accountType === 'school'
                      ? 'School / University Name'
                      : accountType === 'wholesale'
                      ? 'Company / Store Name'
                      : 'City / Region'}
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder={accountType === 'school' ? 'e.g. Dar Academy' : 'e.g. Dar es Salaam'}
                      className="w-full pl-9 pr-3 py-2.5 rounded-[8px] bg-white border border-[#E4DDCC] text-xs focus:border-[#1E2A5E] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#14182B] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.co.tz"
                      className="w-full pl-9 pr-3 py-2.5 rounded-[8px] bg-white border border-[#E4DDCC] text-xs focus:border-[#1E2A5E] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#14182B] mb-1">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+255 715 268 391"
                      className="w-full pl-9 pr-3 py-2.5 rounded-[8px] bg-white border border-[#E4DDCC] text-xs focus:border-[#1E2A5E] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#14182B] mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 4 characters"
                      className="w-full pl-9 pr-10 py-2.5 rounded-[8px] bg-white border border-[#E4DDCC] text-xs focus:border-[#1E2A5E] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#6B7280] hover:text-[#14182B]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#14182B] mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-9 pr-3 py-2.5 rounded-[8px] bg-white border border-[#E4DDCC] text-xs focus:border-[#1E2A5E] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#14182B]">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-[#E4DDCC] text-[#1E2A5E] focus:ring-[#F5A623]"
                  />
                  <span>
                    I agree to OMEGA Stationery terms of business, privacy policy, and commercial wholesale conditions.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-[8px] btn-cta-yellow font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering Account in Database...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create My OMEGA Account</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="pt-4 border-t border-[#E4DDCC] text-center text-xs text-[#6B7280]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#1E2A5E] hover:underline">
                Sign In here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

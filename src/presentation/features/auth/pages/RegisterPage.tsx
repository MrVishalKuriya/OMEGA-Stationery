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
import { useStore } from '@/context/StoreContext';
import { SEOHead } from '@/components/SEOHead';

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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-[#F7F7F7]">
      <SEOHead
        title="Create Account | OMEGA Stationery & Books Tanzania"
        description="Register for an OMEGA Stationery account: retail member, wholesale partner, or educational institution."
      />

      <div className="max-w-xl w-full">
        {/* Main Registration Card */}
        <div className="bg-white rounded-[2px] border border-[#EEEEEE] overflow-hidden">
          {/* Header with Reduced Dark Filter & Warm Light Filter */}
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
                  New Customer Registration
                </span>
                <h1 className="text-2xl font-extrabold mt-1 text-white">
                  Join OMEGA Stationery
                </h1>
              </div>
              <div className="w-12 h-12 rounded-[2px] bg-[#DC2626] flex items-center justify-center text-white">
                <UserPlus className="w-6 h-6" />
              </div>
            </div>
            <p className="relative z-10 text-xs text-white/85 mt-2">
              Select your account type below to receive tailored commercial discounts, tax receipts, and order tracking.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {/* Account Type Selector */}
            <div>
              <label className="block text-xs font-bold text-[#111113] mb-2 uppercase tracking-wider font-mono">
                1. Select Account Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Individual */}
                <button
                  type="button"
                  onClick={() => setAccountType('individual')}
                  className={`p-3 rounded-[2px] border text-left transition-all cursor-pointer ${
                    accountType === 'individual'
                      ? 'border-[#DC2626] bg-[#F7F7F7]'
                      : 'border-[#E5E7EB] hover:border-[#111113] bg-white'
                  }`}
                >
                  <ShoppingBag className={`w-5 h-5 mb-1.5 ${accountType === 'individual' ? 'text-[#DC2626]' : 'text-[#77767B]'}`} />
                  <div className="font-bold text-xs text-[#111113]">Individual</div>
                  <div className="text-[10px] text-[#77767B] mt-0.5">Personal &amp; Retail</div>
                </button>

                {/* Wholesale */}
                <button
                  type="button"
                  onClick={() => setAccountType('wholesale')}
                  className={`p-3 rounded-[2px] border text-left transition-all cursor-pointer ${
                    accountType === 'wholesale'
                      ? 'border-[#DC2626] bg-[#F7F7F7]'
                      : 'border-[#E5E7EB] hover:border-[#111113] bg-white'
                  }`}
                >
                  <Building2 className={`w-5 h-5 mb-1.5 ${accountType === 'wholesale' ? 'text-[#DC2626]' : 'text-[#77767B]'}`} />
                  <div className="font-bold text-xs text-[#111113]">Wholesale</div>
                  <div className="text-[10px] text-[#77767B] mt-0.5">Bulk / Corporate</div>
                </button>

                {/* School */}
                <button
                  type="button"
                  onClick={() => setAccountType('school')}
                  className={`p-3 rounded-[2px] border text-left transition-all cursor-pointer ${
                    accountType === 'school'
                      ? 'border-[#DC2626] bg-[#F7F7F7]'
                      : 'border-[#E5E7EB] hover:border-[#111113] bg-white'
                  }`}
                >
                  <GraduationCap className={`w-5 h-5 mb-1.5 ${accountType === 'school' ? 'text-[#DC2626]' : 'text-[#77767B]'}`} />
                  <div className="font-bold text-xs text-[#111113]">School / Inst.</div>
                  <div className="text-[10px] text-[#77767B] mt-0.5">Educational Quotas</div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-[2px] bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-xs font-bold text-[#111113] uppercase tracking-wider font-mono">
                2. Contact &amp; Security Credentials
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111113] mb-1">
                    Contact Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#77767B] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Mussa Juma"
                      className="w-full pl-9 pr-3 py-2.5 rounded-[2px] bg-[#F7F7F7] border border-[#E5E7EB] text-xs focus:border-[#DC2626] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111113] mb-1">
                    {accountType === 'school'
                      ? 'School / University Name'
                      : accountType === 'wholesale'
                      ? 'Company / Store Name'
                      : 'City / Region'}
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#77767B] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder={accountType === 'school' ? 'e.g. Dar Academy' : 'e.g. Dar es Salaam'}
                      className="w-full pl-9 pr-3 py-2.5 rounded-[2px] bg-[#F7F7F7] border border-[#E5E7EB] text-xs focus:border-[#DC2626] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111113] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#77767B] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.co.tz"
                      className="w-full pl-9 pr-3 py-2.5 rounded-[2px] bg-[#F7F7F7] border border-[#E5E7EB] text-xs focus:border-[#DC2626] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111113] mb-1">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#77767B] absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+255 715 268 391"
                      className="w-full pl-9 pr-3 py-2.5 rounded-[2px] bg-[#F7F7F7] border border-[#E5E7EB] text-xs focus:border-[#DC2626] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111113] mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#77767B] absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 4 characters"
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

                <div>
                  <label className="block text-xs font-bold text-[#111113] mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#77767B] absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-9 pr-3 py-2.5 rounded-[2px] bg-[#F7F7F7] border border-[#E5E7EB] text-xs focus:border-[#DC2626] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#111113]">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded-[2px] border-[#E5E7EB] accent-[#DC2626]"
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
                className="w-full py-3.5 px-4 rounded-[2px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering Account...</span>
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
            <div className="pt-4 border-t border-[#EEEEEE] text-center text-xs text-[#77767B]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#DC2626] hover:underline">
                Sign In here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

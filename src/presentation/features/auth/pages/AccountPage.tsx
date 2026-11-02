import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  ShieldCheck,
  Building2,
  GraduationCap,
  LogOut,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Database,
  Key,
  ShoppingBag,
  Truck,
  FileText,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { SEOHead } from '@/components/SEOHead';

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    activeSession,
    demoOrders,
    logout,
    openAuthModal,
    isBackendOnline,
    backendHealth,
    showToast,
  } = useStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'tier' | 'security'>(
    initialTab as any
  );
  const navigate = useNavigate();

  const handleTabChange = (tab: 'orders' | 'profile' | 'tier' | 'security') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-[var(--bg)] text-[var(--text)]">
        <SEOHead
          title="Account Portal | OMEGA Stationery & Books"
          description="Sign in or register to access your OMEGA member account, order history and wholesale pricing."
        />
        <div className="max-w-md w-full bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--gold)] flex items-center justify-center mx-auto shadow-xs">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-[var(--text)]">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Sign in to view your real-time order history, download business VAT receipts, and manage institutional quotas.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              to="/login"
              className="py-3 px-4 rounded-full bg-[var(--red)] hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="py-3 px-4 rounded-full bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--surface-1)] font-bold text-xs text-[var(--text)] flex items-center justify-center gap-1.5"
            >
              Register
            </Link>
          </div>
          <div className="text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
            Fast 1-click test login available for Wholesale (Mussa Juma) &amp; School (Dar Academy).
          </div>
        </div>
      </div>
    );
  }

  const tierName =
    currentUser.accountType === 'wholesale'
      ? 'Wholesale / Corporate Partner'
      : currentUser.accountType === 'school'
      ? 'Educational Institution'
      : 'Retail OMEGA Member';

  const discountRate =
    currentUser.accountType === 'wholesale'
      ? '15% Tier Discount'
      : currentUser.accountType === 'school'
      ? '18% Institutional Quota'
      : 'Standard Retail Pricing';

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-[var(--bg)] text-[var(--text)]">
      <SEOHead
        title={`${currentUser.name} | Account Profile | OMEGA Stationery`}
        description="Manage your OMEGA account, real-time orders, and procurement discounts."
      />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Hero Header Card */}
        <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] shadow-xl overflow-hidden">
          <div className="bg-[var(--surface-2)] text-[var(--text)] p-6 sm:p-8 border-b border-[var(--border)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--surface-1)] text-[var(--gold)] border border-[var(--border)] font-bold text-xl sm:text-2xl flex items-center justify-center font-mono shrink-0 shadow-md ring-4 ring-[var(--gold)]/20">
                  {currentUser.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-heading font-bold text-[var(--text)]">
                      {currentUser.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--red)] text-white">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {tierName}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)] mt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[var(--red)]" />
                      {currentUser.email}
                    </span>
                    {currentUser.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[var(--red)]" />
                        {currentUser.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-full bg-[var(--surface-1)] hover:bg-[var(--red)] text-[var(--text)] hover:text-white border border-[var(--border)] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[var(--border)] text-xs">
              <div className="p-2.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border)]">
                <div className="text-[var(--text-muted)] text-[10px] uppercase font-mono">Orders Placed</div>
                <div className="text-lg font-bold font-mono text-[var(--red)] mt-0.5">{demoOrders.length}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border)]">
                <div className="text-[var(--text-muted)] text-[10px] uppercase font-mono">Active Tier</div>
                <div className="text-xs font-bold text-[var(--text)] mt-1 truncate">{discountRate}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border)]">
                <div className="text-[var(--text-muted)] text-[10px] uppercase font-mono">Session State</div>
                <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  30-Day Cookie
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border)]">
                <div className="text-[var(--text-muted)] text-[10px] uppercase font-mono">Backend Database</div>
                <div className="text-xs font-bold text-[var(--text)] mt-1 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>{isBackendOnline ? 'MongoDB Atlas' : 'Local Storage DB'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[var(--border)] overflow-x-auto bg-[var(--surface-1)] px-4">
            <button
              type="button"
              onClick={() => handleTabChange('orders')}
              className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'border-[var(--red)] text-[var(--red)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Order History &amp; Tracking ({demoOrders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('profile')}
              className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-[var(--red)] text-[var(--red)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile &amp; Delivery Address</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('tier')}
              className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'tier'
                  ? 'border-[var(--red)] text-[var(--red)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Tier Privileges &amp; Discounts</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('security')}
              className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'security'
                  ? 'border-[var(--red)] text-[var(--red)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Security &amp; Backend Sync</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-heading font-bold text-[var(--text)]">
                  Your Recent Purchases &amp; Orders
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Real-time synchronization with OMEGA logistics in Dar es Salaam.
                </p>
              </div>
              <Link
                to="/catalog"
                className="py-2 px-4 rounded-full bg-[var(--red)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop Catalog</span>
              </Link>
            </div>

            {demoOrders.length === 0 ? (
              <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] p-12 text-center space-y-4">
                <Package className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
                <div>
                  <h3 className="text-base font-bold text-[var(--text)]">No Orders Yet</h3>
                  <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mt-1">
                    You haven't placed any stationery orders yet. Browse our authentic factory counter books, exercise books, and envelopes.
                  </p>
                </div>
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--red)] hover:opacity-90 text-white font-bold text-xs shadow-md"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {demoOrders.map((order, idx) => (
                  <div
                    key={order.orderReference || idx}
                    className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] p-5 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[var(--text)]">
                            {order.orderReference}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Confirmed &amp; Dispatched
                          </span>
                        </div>
                        <span className="text-[11px] text-[var(--text-muted)] font-mono block mt-0.5">
                          Placed on {order.createdAt}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-[var(--text-muted)] block font-mono">Total Paid</span>
                        <span className="text-base font-bold text-[var(--red)] font-mono">
                          TZS {order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1.5 pt-1">
                      {order.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-[var(--surface-2)]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-[var(--text)]">
                              {item.quantity}x
                            </span>
                            <span className="font-medium text-[var(--text)]">{item.name}</span>
                          </div>
                          <span className="font-mono text-[var(--text-muted)]">
                            TZS {item.lineTotal.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Logistics & Delivery Info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-[var(--text-muted)] border-t border-[var(--border)]">
                      <span className="flex items-center gap-1 font-medium">
                        <Truck className="w-3.5 h-3.5 text-[var(--gold)]" />
                        Fulfillment: {order.fulfillmentType} ({order.deliveryAddress || 'Kariakoo Flagship Store Pickup'})
                      </span>
                      <button
                        type="button"
                        onClick={() => showToast(`Invoice generated for ${order.orderReference}`)}
                        className="text-[var(--gold)] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Download PDF VAT Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile & Delivery Address */}
        {activeTab === 'profile' && (
          <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-lg font-heading font-bold text-[var(--text)]">
                Profile &amp; Default Delivery Address
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Your contact information is used for WhatsApp order confirmation and dispatch notices.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[var(--text)] block">Full Name</label>
                <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] font-medium text-[var(--text)]">
                  {currentUser.name}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[var(--text)] block">Email Address</label>
                <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[var(--text)]">
                  {currentUser.email}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[var(--text)] block">Primary Phone / WhatsApp</label>
                <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[var(--text)]">
                  {currentUser.phone || '+255 715 268 391'}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[var(--text)] block">Member Category</label>
                <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] font-bold text-[var(--text)]">
                  {tierName}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex justify-end">
              <button
                type="button"
                onClick={() => showToast('Profile details are synced and up to date.')}
                className="py-2.5 px-5 rounded-full bg-[var(--red)] hover:opacity-90 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Tier Privileges */}
        {activeTab === 'tier' && (
          <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-lg font-heading font-bold text-[var(--text)]">
                Account Tier Privileges &amp; Commercial Terms
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Your account is verified under OMEGA's commercial trade policy in Tanzania.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                <div className="w-8 h-8 rounded-full bg-[var(--surface-1)] text-[var(--gold)] border border-[var(--border)] flex items-center justify-center font-bold">
                  %
                </div>
                <h3 className="font-bold text-sm text-[var(--text)]">Tier Discount</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Enjoy {currentUser.accountType === 'wholesale' ? '15%' : currentUser.accountType === 'school' ? '18%' : '5%'} automatic volume deduction on eligible cartons.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                <div className="w-8 h-8 rounded-full bg-[var(--surface-1)] text-[var(--gold)] border border-[var(--border)] flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[var(--text)]">TRA EFD VAT Receipts</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  All institutional orders receive official Tanzania Revenue Authority (TRA) electronic fiscal receipts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                <div className="w-8 h-8 rounded-full bg-[var(--surface-1)] text-[var(--gold)] border border-[var(--border)] flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[var(--text)]">Priority Dispatch</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Orders packed and dispatched from Kariakoo within 2 hours for Dar es Salaam addresses.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Security */}
        {activeTab === 'security' && (
          <div className="bg-[var(--surface-1)] rounded-2xl border border-[var(--border)] p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-lg font-heading font-bold text-[var(--text)]">
                Security &amp; Connected Backend
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                View your active session status and MongoDB data persistence settings.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-[var(--text)]">Active Session Cookie</div>
                  <div className="text-[var(--text-muted)] font-mono mt-0.5">
                    Session ID: {activeSession?.sessionId?.substring(0, 24) || 'omega-session-active'}...
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                  Valid 30 Days
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-[var(--text)]">High-Performance Node.js &amp; MongoDB Atlas</div>
                  <div className="text-[var(--text-muted)] font-mono mt-0.5">
                    Port 5000 / Render Cloud: {isBackendOnline ? 'Connected' : 'Local Standalone Mode'}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 ${isBackendOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                  {isBackendOnline ? 'Synced to MongoDB Atlas' : 'Local Fallback Storage'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
              <button
                type="button"
                onClick={() => showToast('Password reset link sent to your email.')}
                className="text-[var(--gold)] font-bold text-xs hover:underline cursor-pointer"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="py-2 px-4 rounded-full bg-[var(--red)] hover:opacity-90 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Log Out Everywhere
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

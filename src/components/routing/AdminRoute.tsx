import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { SEOHead } from '../SEOHead';

interface AdminRouteProps {
  children?: React.ReactNode;
}

/**
 * Route Middleware: AdminRoute
 * Guards administrative portals (/omega-hq-portal-2026).
 * Enforces role verification (ADMIN, MANAGER) with dedicated access-denied handling.
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser } = useStore();
  const location = useLocation();

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          adminRequired: true,
          message: 'Please sign in with administrative credentials to access the HQ portal.',
        }}
        replace
      />
    );
  }

  const role = (currentUser.role || '').toUpperCase();
  const isAdmin =
    role.includes('ADMIN') ||
    role.includes('MANAGER') ||
    role.includes('SUPERUSER') ||
    currentUser.email.includes('admin@omega.co.tz');

  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-[#fafafa]">
        <SEOHead
          title="Access Restricted | OMEGA Stationery"
          description="Access to this administrative section requires verified administrative clearance."
        />
        <div className="max-w-md w-full bg-white rounded-[16px] border border-red-200 shadow-boutique p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-[#14182B]">
              Administrative Clearance Required
            </h1>
            <p className="text-xs text-[#6B7280] mt-2">
              Signed in as <strong className="font-mono text-stone-800">{currentUser.email}</strong> ({currentUser.accountType.toUpperCase()}). This portal is restricted to authorized OMEGA management personnel.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              to="/account"
              className="py-2.5 px-4 rounded-[8px] btn-indra-primary font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to My Customer Account</span>
            </Link>
            <Link
              to="/login"
              className="py-2.5 px-4 rounded-[8px] bg-white border border-[#e2dedb] hover:bg-[#fafafa] font-bold text-xs text-[#4b423b] flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Switch to Admin Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : null;
};

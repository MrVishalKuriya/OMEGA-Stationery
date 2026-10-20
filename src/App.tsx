import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RouteLoader } from './components/RouteLoader';

// Eager load Home Page for instant above-the-fold paint
import { HomePage } from './pages/HomePage';

// Lazy-load other routes for optimal performance and instant initial bundle
const CatalogPage = lazy(() => import('./pages/CatalogPage').then((m) => ({ default: m.CatalogPage })));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage').then((m) => ({ default: m.ProductDetailsPage })));
const CartAndCheckoutPage = lazy(() => import('./pages/CartAndCheckoutPage').then((m) => ({ default: m.CartAndCheckoutPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const WholesalePage = lazy(() => import('./pages/WholesalePage').then((m) => ({ default: m.WholesalePage })));
const SchoolTendersPage = lazy(() => import('./pages/SchoolTendersPage').then((m) => ({ default: m.SchoolTendersPage })));
const ShippingGuidePage = lazy(() => import('./pages/ShippingGuidePage').then((m) => ({ default: m.ShippingGuidePage })));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then((m) => ({ default: m.AccountPage })));

import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { AdminRoute } from './components/routing/AdminRoute';
import { GuestRoute } from './components/routing/GuestRoute';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);
  return null;
};

const NotFoundPage: React.FC = () => (
  <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
    <div className="w-16 h-16 rounded-[16px] bg-[#f5f4f4] text-[#4b423b] flex items-center justify-center mx-auto border border-[#e2dedb]">
      <span className="font-heading text-xl font-bold">404</span>
    </div>
    <h1 className="text-3xl font-bold text-[#3b352f] font-heading">Page Not Found</h1>
    <p className="text-xs text-[#8c847e] max-w-md mx-auto leading-relaxed">
      The requested stationery catalogue destination does not exist. Use the shortcuts below to continue browsing.
    </p>
    <div className="pt-2 flex justify-center gap-3">
      <Link
        to="/"
        className="px-6 py-2.5 rounded-full btn-ledup-copper text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
      >
        Return Home
      </Link>
      <Link
        to="/catalog"
        className="px-6 py-2.5 rounded-full btn-ledup-mocha text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
      >
        Browse Catalog
      </Link>
    </div>
  </div>
);

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.status === 403 || error?.status === 404) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: true,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Layout>
              <Suspense fallback={<RouteLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<CartAndCheckoutPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/wholesale" element={<WholesalePage />} />
                <Route path="/wholesale.html" element={<WholesalePage />} />
                <Route path="/school-tenders" element={<SchoolTendersPage />} />
                <Route path="/tenders" element={<SchoolTendersPage />} />
                <Route path="/shipping-guide" element={<ShippingGuidePage />} />
                <Route path="/dispatch-locations" element={<ShippingGuidePage />} />

                {/* Guest-only Authentication Routes */}
                <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                <Route path="/signin" element={<GuestRoute><LoginPage /></GuestRoute>} />
                <Route path="/sign-in" element={<GuestRoute><LoginPage /></GuestRoute>} />
                <Route path="/loging" element={<GuestRoute><LoginPage /></GuestRoute>} />
                <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
                <Route path="/registration" element={<GuestRoute><RegisterPage /></GuestRoute>} />
                <Route path="/signup" element={<GuestRoute><RegisterPage /></GuestRoute>} />
                <Route path="/sign-up" element={<GuestRoute><RegisterPage /></GuestRoute>} />

                {/* Protected Customer Account Routes */}
                <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                <Route path="/my-account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />

                {/* Protected Administrative Portal */}
                <Route path="/omega-hq-portal-2026" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />

                {/* Catch-all 404 */}
                <Route path="/admin" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </StoreProvider>
    </QueryClientProvider>
  </ErrorBoundary>
  );
}

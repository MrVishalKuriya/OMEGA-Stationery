import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { StoreProvider } from './application';
import {
  Layout,
  ErrorBoundary,
  RouteLoader,
  ServerWakingBanner,
  ProtectedRoute,
  AdminRoute,
  GuestRoute,
} from './presentation/common';

// Eager load Home Page from Marketing Feature
import { HomePage } from './presentation/features/marketing';

// Lazy-load other routes from their respective Domain Features
const CatalogPage = lazy(() =>
  import('./presentation/features/products').then((m) => ({ default: m.CatalogPage }))
);
const ProductDetailsPage = lazy(() =>
  import('./presentation/features/products').then((m) => ({ default: m.ProductDetailsPage }))
);
const CartAndCheckoutPage = lazy(() =>
  import('./presentation/features/cart').then((m) => ({ default: m.CartAndCheckoutPage }))
);
const AboutPage = lazy(() =>
  import('./presentation/features/marketing').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./presentation/features/marketing').then((m) => ({ default: m.ContactPage }))
);
const WishlistPage = lazy(() =>
  import('./presentation/features/wishlist').then((m) => ({ default: m.WishlistPage }))
);
const WholesalePage = lazy(() =>
  import('./presentation/features/wholesale').then((m) => ({ default: m.WholesalePage }))
);
const SchoolTendersPage = lazy(() =>
  import('./presentation/features/wholesale').then((m) => ({ default: m.SchoolTendersPage }))
);
const ShippingGuidePage = lazy(() =>
  import('./presentation/features/marketing').then((m) => ({ default: m.ShippingGuidePage }))
);
const OrderTrackingPage = lazy(() =>
  import('./presentation/features/cart').then((m) => ({ default: m.OrderTrackingPage }))
);
const AdminDashboardPage = lazy(() =>
  import('./presentation/features/admin').then((m) => ({ default: m.AdminDashboardPage }))
);
const LoginPage = lazy(() =>
  import('./presentation/features/auth').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('./presentation/features/auth').then((m) => ({ default: m.RegisterPage }))
);
const AccountPage = lazy(() =>
  import('./presentation/features/auth').then((m) => ({ default: m.AccountPage }))
);

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
    <div className="w-16 h-16 rounded-[16px] bg-[#f4f4f5] text-[#111113] flex items-center justify-center mx-auto border border-[#e4e4e7]">
      <span className="font-heading text-xl font-bold">404</span>
    </div>
    <h1 className="text-3xl font-bold text-[#111113] font-heading">Page Not Found</h1>
    <p className="text-xs text-[#71717a] max-w-md mx-auto leading-relaxed">
      The requested stationery catalogue destination does not exist. Use the shortcuts below to continue browsing.
    </p>
    <div className="pt-2 flex justify-center gap-3">
      <Link
        to="/"
        className="px-6 py-2.5 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
      >
        Return Home
      </Link>
      <Link
        to="/catalog"
        className="px-6 py-2.5 rounded-full bg-[#111113] hover:bg-[#27272a] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
      >
        Browse Catalog
      </Link>
    </div>
  </div>
);

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { omegaMuiTheme } from './presentation/theme/omegaMuiTheme';

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
          <ThemeProvider theme={omegaMuiTheme}>
            <ServerWakingBanner />
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
                  <Route path="/tracking" element={<OrderTrackingPage />} />
                  <Route path="/order-tracking" element={<OrderTrackingPage />} />
                  <Route path="/track-order" element={<OrderTrackingPage />} />

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
                  <Route path="/omega-hq" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                  <Route path="/omega-hq-portal" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />

                  {/* Catch-all 404 */}
                  <Route path="/admin" element={<NotFoundPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </Layout>
          </BrowserRouter>
        </ThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  </ErrorBoundary>
  );
}

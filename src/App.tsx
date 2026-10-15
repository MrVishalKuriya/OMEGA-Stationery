import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartAndCheckoutPage } from './pages/CartAndCheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { WishlistPage } from './pages/WishlistPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
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
    <h1 className="text-3xl font-bold text-stone-900">Page Not Found</h1>
    <p className="text-sm text-stone-600">
      The page you are looking for does not exist. Use the links below to return to our stationery storefront.
    </p>
    <div className="pt-2 flex justify-center gap-3">
      <Link
        to="/"
        className="px-5 py-2.5 bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-red-800"
      >
        Return Home
      </Link>
      <Link
        to="/catalog"
        className="px-5 py-2.5 bg-white border border-stone-300 text-stone-800 text-xs sm:text-sm font-semibold rounded-md hover:bg-stone-50"
      >
        Browse Catalog
      </Link>
    </div>
  </div>
);

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartAndCheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Guest-only Authentication Routes (redirect to destination or /account if already signed in) */}
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/signin" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/sign-in" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/loging" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
            <Route path="/registration" element={<GuestRoute><RegisterPage /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><RegisterPage /></GuestRoute>} />
            <Route path="/sign-up" element={<GuestRoute><RegisterPage /></GuestRoute>} />

            {/* Protected Customer Account Routes (guards unauthorized access, preserves state.from) */}
            <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            <Route path="/my-account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />

            {/* Protected Administrative Portal (enforces ADMIN / MANAGER role guard) */}
            <Route path="/omega-hq-portal-2026" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />

            {/* Explicit 404 for standard /admin scans & catch-all */}
            <Route path="/admin" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </StoreProvider>
  );
}

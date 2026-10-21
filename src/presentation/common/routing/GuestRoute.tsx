import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';

interface GuestRouteProps {
  children?: React.ReactNode;
}

/**
 * Route Middleware: GuestRoute
 * Guards guest-only authentication routes (/login, /register, /signin, etc.).
 * If the user is already authenticated, redirects them smoothly to /account
 * or their intended destination stored in location.state.from.
 */
export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { currentUser } = useStore();
  const location = useLocation();

  if (currentUser) {
    const destination = (location.state as any)?.from?.pathname || '/account';
    return <Navigate to={destination} replace />;
  }

  return children ? <>{children}</> : null;
};

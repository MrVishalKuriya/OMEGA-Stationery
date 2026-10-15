import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

/**
 * Route Middleware: ProtectedRoute
 * Guards private user routes (e.g. /account, /orders, /profile).
 * Redirects unauthenticated visitors to /login while preserving the target route in state.from.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useStore();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : null;
};

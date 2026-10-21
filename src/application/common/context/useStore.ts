import { useContext } from 'react';
import { StoreContext, StoreContextType } from './StoreContext';

/**
 * Custom hook for accessing the OMEGA stationery store context.
 * Separated into a dedicated hook file for optimal Vite React Fast Refresh.
 */
export const useStore = (): StoreContextType => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
};

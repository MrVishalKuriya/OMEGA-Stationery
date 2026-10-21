import React, { useState } from 'react';
import { RefreshCw, Server, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export const ServerWakingBanner: React.FC = () => {
  const { isServerWakingUp, retryConnection } = useStore();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  if (!isServerWakingUp || isDismissed) {
    return null;
  }

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await retryConnection();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div
      role="alert"
      className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs z-50 sticky top-0 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div className="flex items-center gap-2.5 max-w-4xl mx-auto flex-1">
        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <Server className="w-3.5 h-3.5 text-white animate-pulse" />
        </div>
        <div className="flex-1">
          <span className="font-bold">⚡ Cloud Server is waking up:</span>{' '}
          <span className="text-amber-100">
            Render free tier services spin down after inactivity (~30s boot time). Products &amp; live orders will display automatically once initialized.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="px-3 py-1 bg-white text-amber-900 rounded-lg font-bold hover:bg-amber-50 active:scale-95 transition-all inline-flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Connecting...' : 'Retry Connection'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1 text-amber-200 hover:text-white rounded-md"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

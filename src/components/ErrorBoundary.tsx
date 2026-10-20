import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, MessageCircle, WifiOff, LogIn, Clock } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isOffline: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
  };

  private handleOnline = () => {
    this.setState({ isOffline: false });
    if (this.state.hasError) {
      this.handleReset();
    }
  };

  private handleOffline = () => {
    this.setState({ isOffline: true });
  };

  public componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  public componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🛡️ [ErrorBoundary Caught]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleHardReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.isOffline) {
      return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 text-[#3b352f] font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#e2dedb] p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto shadow-md border border-amber-200">
              <WifiOff className="w-8 h-8 text-amber-600" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-amber-700">
                [ NETWORK OFFLINE // OMEGA ]
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#3b352f]">
                No Internet Connection
              </h2>
              <p className="text-xs text-[#8c847e] leading-relaxed">
                Your device appears to be offline. Reconnect your Wi-Fi or mobile data to resume live catalog and order synchronization.
              </p>
            </div>

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-full btn-ledup-copper text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Connection</span>
            </button>
          </div>
        </div>
      );
    }

    if (this.state.hasError) {
      const errStr = (this.state.error?.message || '').toLowerCase();
      const isAuthError = errStr.includes('401') || errStr.includes('403') || errStr.includes('unauthorized') || errStr.includes('clearance');
      const isRateLimit = errStr.includes('429') || errStr.includes('too many requests');
      const isServerColdStart = errStr.includes('502') || errStr.includes('503') || errStr.includes('504') || errStr.includes('timeout');

      return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 text-[#3b352f] font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#e2dedb] p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#4b423b] text-[#c49b7c] flex items-center justify-center mx-auto shadow-md border border-[#c49b7c]/40">
              {isRateLimit ? (
                <Clock className="w-8 h-8 text-[#c49b7c]" />
              ) : isAuthError ? (
                <LogIn className="w-8 h-8 text-[#c49b7c]" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-[#c49b7c]" />
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#c49b7c]">
                {isAuthError
                  ? '[ CLEARANCE REQUIRED // OMEGA ]'
                  : isRateLimit
                  ? '[ RATE LIMIT OBSERVED // OMEGA ]'
                  : isServerColdStart
                  ? '[ SERVER RE-ENGAGING // OMEGA ]'
                  : '[ SYSTEM RECOVERY // OMEGA ]'}
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#3b352f]">
                {isAuthError
                  ? 'Session Expired'
                  : isRateLimit
                  ? 'High Traffic Notice'
                  : isServerColdStart
                  ? 'Cloud Server Waking Up'
                  : 'Something went wrong'}
              </h2>
              <p className="text-xs text-[#8c847e] leading-relaxed">
                {isAuthError
                  ? 'Your administrative clearance has expired. Sign in again to access the portal.'
                  : isRateLimit
                  ? 'Too many rapid requests were sent to the database. Retrying in a few moments...'
                  : isServerColdStart
                  ? 'The backend server is spinning up from standby. This usually takes 10–20 seconds.'
                  : 'An unexpected application issue occurred. Use the options below to resume browsing.'}
              </p>
            </div>

            {this.state.error && !isAuthError && (
              <div className="p-3 rounded-xl bg-[#f5f4f4] border border-[#e2dedb] text-[11px] text-[#736c67] font-mono text-left max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-full btn-ledup-copper text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>

              <button
                type="button"
                onClick={this.handleHardReload}
                className="flex-1 py-3 px-4 rounded-full bg-stone-100 hover:bg-stone-200 text-[#4b423b] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-stone-200"
              >
                <span>Reload</span>
              </button>
            </div>

            <div className="pt-2 border-t border-[#e2dedb]/60 flex items-center justify-between text-xs text-[#8c847e]">
              <a href="/" className="hover:text-black inline-flex items-center gap-1 font-semibold">
                <Home className="w-3.5 h-3.5" />
                <span>Store Home</span>
              </a>

              <a
                href="https://wa.me/255746268391?text=Hello%20OMEGA,%20reporting%20an%20issue."
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#4b423b] hover:text-[#c49b7c] font-semibold inline-flex items-center gap-1 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#2A9D8F]" />
                <span>WhatsApp Help</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

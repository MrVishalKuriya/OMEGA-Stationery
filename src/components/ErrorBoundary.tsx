import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 text-[#3b352f] font-sans">
          <div className="max-w-md w-full bg-white rounded-[24px] border border-[#e2dedb] p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-[16px] bg-[#4b423b] text-[#c49b7c] flex items-center justify-center mx-auto shadow-md">
              <AlertTriangle className="w-8 h-8 text-[#c49b7c]" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#c49b7c]">
                [ SYSTEM RECOVERY // OMEGA ]
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#3b352f]">
                Something went wrong
              </h2>
              <p className="text-xs text-[#8c847e] leading-relaxed">
                An unexpected interface issue occurred. You can reload the page or return to the main catalog.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-[12px] bg-[#f5f4f4] border border-[#e2dedb] text-[11px] text-[#736c67] font-mono text-left max-h-24 overflow-y-auto">
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
                <span>Reload Page</span>
              </button>

              <a
                href="/"
                className="flex-1 py-3 px-4 rounded-full btn-ledup-mocha text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Store Home</span>
              </a>
            </div>

            <div className="pt-2 border-t border-[#e2dedb]/60">
              <a
                href="https://wa.me/255746268391?text=Hello%20OMEGA,%20I%20noticed%20an%20error%20on%20your%20website."
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#4b423b] hover:text-[#c49b7c] font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#2A9D8F]" />
                <span>Report to WhatsApp Support</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

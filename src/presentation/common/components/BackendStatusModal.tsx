import React from 'react';
import { X, Server, Database, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Cpu, Clock, Zap } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface BackendStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendStatusModal: React.FC<BackendStatusModalProps> = ({ isOpen, onClose }) => {
  const { backendUrl, isBackendOnline, backendHealth, refreshBackendHealth } = useStore();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBackendHealth();
    setIsRefreshing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#4b423b] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Server className="w-5 h-5 text-[#c49b7c]" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-lg text-white">High-Performance Backend &amp; MongoDB</h3>
              <p className="text-xs text-stone-300">Node.js microservice + MongoDB Atlas + Redis &amp; AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3.5 ${
              isBackendOnline
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {isBackendOnline ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs">
              <p className="font-bold text-sm">
                {isBackendOnline
                  ? 'Connected to Live Node.js & MongoDB Atlas Backend'
                  : 'Backend Offline or Standby (High-Resilience Local Mode Active)'}
              </p>
              <p className="mt-1 leading-relaxed opacity-90">
                {isBackendOnline
                  ? 'Connected to high-performance Node.js API with live MongoDB Atlas synchronization, caching, and AI model endpoints.'
                  : 'Operating in high-resilience offline mode with full local catalog access.'}
              </p>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                Backend API URL:
              </span>
              <span className="font-mono font-bold text-[#4b423b] truncate max-w-[240px]">
                {backendUrl}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium flex items-center gap-2">
                <Database className="w-3.5 h-3.5" />
                Database Engine:
              </span>
              <span className="font-semibold text-stone-900">
                {backendHealth?.database?.engine || 'MongoDB Atlas'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium flex items-center gap-2">
                <Database className="w-3.5 h-3.5" />
                MongoDB Connection:
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                  backendHealth?.database?.connected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {backendHealth?.database?.connected ? 'Connected (Atlas)' : isBackendOnline ? 'Connecting...' : 'Standby'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                Cache Layer:
              </span>
              <span className="font-bold text-emerald-700 flex items-center gap-1.5 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {backendHealth?.cache?.engine || 'Sub-millisecond LRU Cache'} (Live Active · {backendHealth?.cache?.averageLatencyMs ?? '<0.5'}ms)
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-stone-100">
              <span className="text-stone-500 font-medium flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" />
                Runtime Engine:
              </span>
              <span className="font-mono text-stone-700">
                {backendHealth?.runtime || 'Node.js Express (Mongoose + Helmet + AI)'}
              </span>
            </div>

            {backendHealth?.uptimeSeconds !== undefined && (
              <div className="flex items-center justify-between text-xs py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Backend Uptime:
                </span>
                <span className="font-mono text-stone-700">
                  {backendHealth.uptimeSeconds} seconds
                </span>
              </div>
            )}
          </div>

          {/* Quick Render Action */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#4b423b]">Render Native Node.js Service</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#4b423b]/10 text-[#4b423b]">
                Blueprint Ready
              </span>
            </div>
            <p className="text-stone-600 text-[11px]">
              Deploy the <code className="bg-stone-200 px-1 rounded font-mono">server</code> folder directly to Render as a native Node.js Web Service with zero container overhead.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#4b423b] hover:bg-[#2A3B82] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

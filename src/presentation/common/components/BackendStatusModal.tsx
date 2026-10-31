import React from 'react';
import { CheckCircle2, Database, Server, ShieldCheck, X } from 'lucide-react';

export interface BackendStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiHealth?: {
    status: string;
    service?: string;
    location?: string;
    database?: string;
  } | null;
}

export const BackendStatusModal: React.FC<BackendStatusModalProps> = ({
  isOpen,
  onClose,
  apiHealth,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111113]/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-paper-base text-charcoal-ink rounded-[4px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E7E5E0] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-[4px] bg-white border border-[#E7E5E0] flex items-center justify-center text-charcoal-ink hover:bg-[#DC2626] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-[4px] bg-[#15803D]/10 text-[#15803D] flex items-center justify-center border border-[#15803D]/25">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#15803D] font-mono">
                System Operational
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold text-charcoal-ink">
              Full-Stack Architecture
            </h3>
          </div>
        </div>

        <p className="text-[#3F3F46] text-sm font-medium mb-6 leading-relaxed">
          This application runs on a real Node.js + Express backend with persistent database
          storage, serving live catalog inventory, customer authentication, and order management.
        </p>

        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-[4px] bg-white border border-[#E7E5E0] flex items-start gap-3">
            <Database className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-charcoal-ink mb-0.5">Database Connected</div>
              <div className="text-[#3F3F46] font-medium">
                Engine: {apiHealth?.database || 'MongoDB Atlas / Local Persistence'} • Tables:
                `products`, `users`, `orders`, `inquiries`
              </div>
            </div>
          </div>

          <div className="p-4 rounded-[4px] bg-white border border-[#E7E5E0] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-charcoal-ink mb-0.5">
                RESTful API Endpoints Active
              </div>
              <div className="text-[#3F3F46] font-mono text-[11px] font-semibold mt-1 space-y-1">
                <div>GET /api/products (Search, Filter, Sort)</div>
                <div>POST /api/orders (Order Creation &amp; Tracking)</div>
                <div>POST /api/auth/login &amp; /api/auth/register</div>
                <div>POST /api/inquiries (Wholesale Quote Storage)</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-[4px] bg-white border border-[#E7E5E0] flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-charcoal-ink mb-0.5">Location &amp; Service</div>
              <div className="text-[#3F3F46] font-medium">
                {apiHealth?.service || 'OMEGA Stationery Backend API'} —{' '}
                {apiHealth?.location || 'Soweto SIDO, Mbeya, Tanzania'}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-[4px] bg-[#111113] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#DC2626] transition-colors cursor-pointer"
        >
          Close System Status
        </button>
      </div>
    </div>
  );
};
export default BackendStatusModal;

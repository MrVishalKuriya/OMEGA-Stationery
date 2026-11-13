import React from 'react';

interface IconProps {
  className?: string;
  active?: boolean;
}

/**
 * Custom animated 4-quadrant bento / catalog stack icon for "All Items"
 * Features a floating top-right quadrant with smooth rotation and scale pulse.
 */
export const AnimatedAllItemsIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', active = false }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} overflow-visible group`}
  >
    <rect
      x="3"
      y="3"
      width="7.5"
      height="7.5"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      className="transition-transform duration-300 group-hover:scale-95"
    />
    <rect
      x="13.5"
      y="3"
      width="7.5"
      height="7.5"
      rx="2"
      fill={active ? 'currentColor' : 'none'}
      fillOpacity={active ? '0.22' : '0'}
      stroke="currentColor"
      strokeWidth="2"
      className="origin-center transition-all duration-500 animate-[pulse_2.4s_ease-in-out_infinite] group-hover:rotate-12 group-hover: -translate-y-0.5"
    />
    <rect
      x="3"
      y="13.5"
      width="7.5"
      height="7.5"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      className="transition-transform duration-300 group-hover:scale-95"
    />
    <rect
      x="13.5"
      y="13.5"
      width="7.5"
      height="7.5"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      className="transition-transform duration-300 group-hover:scale-95"
    />
  </svg>
);

/**
 * Custom animated verified pulse icon for "In Stock"
 * Combines a breathing outer halo ring with a crisp checkmark shield core.
 */
export const AnimatedInStockIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', active = false }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} overflow-visible`}
  >
    <circle
      cx="12"
      cy="12"
      r="9.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="4 2.5"
      className="origin-center animate-[spin_10s_linear_infinite] opacity-45"
    />
    <circle
      cx="12"
      cy="12"
      r="7.5"
      fill={active ? 'currentColor' : 'none'}
      fillOpacity={active ? '0.18' : '0'}
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M8.5 12.2L10.9 14.6L15.8 9.7"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-[pulse_2s_ease-in-out_infinite]"
    />
  </svg>
);

/**
 * Custom animated warning beacon triangle for "Low Stock Attention"
 * Replaces system emoji with a custom vector warning triangle and pulsing indicator dot.
 */
export const AnimatedLowStockIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', active = false }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} overflow-visible`}
  >
    {/* Subtle outer radar wave */}
    <path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      stroke="currentColor"
      strokeWidth="1.2"
      className="origin-center scale-105 opacity-30 animate-[ping_2.8s_cubic-bezier(0,0,0.2,1)_infinite]"
    />
    <path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      fill={active ? 'currentColor' : 'none'}
      fillOpacity={active ? '0.18' : '0.08'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="12"
      y1="9"
      x2="12"
      y2="13.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle
      cx="12"
      cy="17"
      r="1.25"
      fill="currentColor"
      className="animate-pulse"
    />
  </svg>
);

/**
 * Custom animated depleted stock octagon / box icon for "Out of Stock"
 */
export const AnimatedOutOfStockIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', active = false }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} overflow-visible`}
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      fill={active ? 'currentColor' : 'none'}
      fillOpacity={active ? '0.16' : '0.06'}
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M9 9L15 15M15 9L9 15"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      className="origin-center transition-transform duration-300 group-hover:rotate-90"
    />
  </svg>
);

/**
 * Custom animated 3D isometric cube icon for SKU & Carton Box metrics
 */
export const AnimatedCartonBoxIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} overflow-visible`}
  >
    <path
      d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="3.27 6.96 12 12.01 20.73 6.96"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="12"
      y1="22.08"
      x2="12"
      y2="12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="7.5"
      y1="4.21"
      x2="16.5"
      y2="9.42"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className="animate-[pulse_2.5s_ease-in-out_infinite]"
    />
  </svg>
);

/**
 * Custom animated telemetry / trend sparkline icon for financial valuation cards
 */
export const AnimatedTrendPulseIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} overflow-visible`}
  >
    <path
      d="M3 17L9 11L13 15L21 7"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="15 7 21 7 21 13"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="21"
      cy="7"
      r="2.5"
      fill="currentColor"
      className="animate-ping opacity-60"
    />
  </svg>
);

/**
 * Custom animated sliders icon for Quick Edit button
 */
export const AnimatedQuickSlidersIcon: React.FC<IconProps> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} overflow-visible`}
  >
    <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle
      cx="9"
      cy="6"
      r="2.5"
      fill="currentColor"
      className="transition-transform duration-300 group-hover:translate-x-5"
    />
    <circle
      cx="15"
      cy="12"
      r="2.5"
      fill="currentColor"
      className="transition-transform duration-300 group-hover:-translate-x-5"
    />
    <circle
      cx="10"
      cy="18"
      r="2.5"
      fill="currentColor"
      className="transition-transform duration-300 group-hover:translate-x-4"
    />
  </svg>
);

/**
 * Custom animated status beacon dot with dual concentric ripple rings
 */
export const AnimatedStatusBeacon: React.FC<{ status: 'In Stock' | 'Low Stock' | 'Out of Stock' }> = ({
  status,
}) => {
  const colorClasses =
    status === 'In Stock'
      ? { ring: 'bg-emerald-400', dot: 'bg-emerald-500' }
      : status === 'Low Stock'
      ? { ring: 'bg-amber-400', dot: 'bg-amber-500' }
      : { ring: 'bg-red-400', dot: 'bg-red-500' };

  return (
    <span className="relative inline-flex items-center justify-center w-2.5 h-2.5 shrink-0">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${colorClasses.ring}`}
      />
      <span className={`relative inline-flex rounded-full w-2 h-2 ${colorClasses.dot}`} />
    </span>
  );
};

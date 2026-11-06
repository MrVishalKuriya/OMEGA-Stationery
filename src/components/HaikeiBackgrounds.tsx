import React from 'react';

/**
 * Haikei-inspired generative vector backgrounds and organic SVG wave accents.
 * Pure mathematical SVG curves: zero image weight, instantaneous rendering, responsive.
 */

interface WaveProps {
  topFill?: string;
  fill?: string;
  secondaryFill?: string;
  flip?: boolean;
  className?: string;
}

export const HaikeiWaveDivider: React.FC<WaveProps> = ({
  topFill = 'transparent',
  fill = 'var(--surface-1)',
  flip = false,
  className = '',
}) => {
  const waveGrad1 = React.useId();
  const waveGrad2 = React.useId();

  return (
    <div
      style={{ backgroundColor: topFill }}
      className={`w-full overflow-hidden leading-none pointer-events-none select-none border-0 ${
        flip ? 'rotate-180 -mb-px' : '-mt-px'
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-12 sm:h-16 lg:h-20 block"
      >
        <defs>
          {/* Pure Clean OMEGA Crimson & Soft Rose Ribbon (Zero Brownish Tint) */}
          <linearGradient id={waveGrad1} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D63A3A" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#EF4444" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#D63A3A" stopOpacity="0.18" />
          </linearGradient>

          {/* Soft Coral-Crimson Secondary Wave (Zero Brownish Tint) */}
          <linearGradient id={waveGrad2} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.24" />
            <stop offset="50%" stopColor="#D63A3A" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.24" />
          </linearGradient>
        </defs>

        {/* Layer 0: Soft Crimson Ambient Wave (No harsh top border stroke) */}
        <path
          d="M0,22L60,32C120,42,240,64,360,66C480,68,600,48,720,36C840,24,960,20,1080,34C1200,48,1320,78,1380,92L1440,104L1440,120L0,120Z"
          fill={`url(#${waveGrad1})`}
        />

        {/* Layer 1: Clean Secondary Crimson Wave (No brownish fill or border) */}
        <path
          d="M0,34L48,44C96,54,192,74,288,74C384,74,480,54,576,44C672,34,768,34,864,48C960,62,1056,92,1152,92C1248,92,1344,62,1392,48L1440,34L1440,120L0,120Z"
          fill={`url(#${waveGrad2})`}
        />

        {/* Layer 2: Main Smooth Surface Curve (Blends 100% seamlessly into next section) */}
        <path
          d="M0,64L48,69.3C96,75,192,85,288,74.7C384,64,480,32,576,26.7C672,21,768,43,864,58.7C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L0,120Z"
          fill={fill}
        />
      </svg>
    </div>
  );
};

interface BlobProps {
  color?: 'red' | 'gold' | 'mixed';
  position?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left' | 'center';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const HaikeiBlobGlow: React.FC<BlobProps> = ({
  color = 'red',
  position = 'top-right',
  size = 'md',
  className = '',
}) => {
  const positionClasses = {
    'top-left': '-top-20 -left-20',
    'top-right': '-top-20 -right-20',
    'bottom-right': '-bottom-24 -right-20',
    'bottom-left': '-bottom-24 -left-20',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }[position];

  const sizeClasses = {
    sm: 'w-64 h-64',
    md: 'w-96 h-96',
    lg: 'w-[520px] h-[520px]',
    xl: 'w-[720px] h-[720px]',
  }[size];

  const gradientId = React.useId();

  return (
    <div
      className={`absolute pointer-events-none select-none z-0 overflow-hidden ${positionClasses} ${sizeClasses} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter blur-3xl opacity-35 transition-opacity duration-700"
      >
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            {color === 'red' && (
              <>
                <stop offset="0%" stopColor="#D63A3A" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#E5484D" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#121214" stopOpacity="0" />
              </>
            )}
            {color === 'gold' && (
              <>
                <stop offset="0%" stopColor="#E9B44C" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#B8862B" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#121214" stopOpacity="0" />
              </>
            )}
            {color === 'mixed' && (
              <>
                <stop offset="0%" stopColor="#E5484D" stopOpacity="0.35" />
                <stop offset="45%" stopColor="#E9B44C" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#121214" stopOpacity="0" />
              </>
            )}
          </radialGradient>
        </defs>
        {/* Haikei Organic Multi-Lobe Blob Path */}
        <path
          d="M421.5,313.5Q379,377,313.5,417Q248,457,177.5,425Q107,393,73.5,321.5Q40,250,74.5,180.5Q109,111,179.5,74.5Q250,38,324.5,69.5Q399,101,431.5,175.5Q464,250,421.5,313.5Z"
          fill={`url(#${gradientId})`}
        />
      </svg>
    </div>
  );
};

export const HaikeiPaperLines: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.04,
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M-50,100 C200,80 350,180 600,120 C850,60 950,150 1100,110"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <path
          d="M-50,220 C180,190 320,290 580,240 C840,190 920,270 1100,230"
          strokeWidth="1.2"
        />
        <path
          d="M-50,340 C220,300 370,410 620,350 C870,290 940,390 1100,350"
          strokeWidth="1.2"
          strokeDasharray="6 6"
        />
        <path
          d="M-50,460 C190,430 340,530 610,470 C880,410 930,510 1100,470"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
};

export const HaikeiGridPattern: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none bg-[radial-gradient(rgba(233,180,76,0.08)_1px,transparent_1px)] [background-size:24px_24px] ${className}`}
      aria-hidden="true"
    />
  );
};


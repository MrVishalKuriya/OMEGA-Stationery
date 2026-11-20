import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useVelocity,
  useAnimationFrame,
} from 'motion/react';

/* =========================================================================
   1. BlurText — ReactBits-inspired staggered word blur-to-sharp reveal
   ========================================================================= */
interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  immediate?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  className = '',
  delay = 0.045,
  immediate = false,
  as = 'span',
}) => {
  const words = text.split(' ');
  const MotionTag = motion[as] as typeof motion.span;

  return (
    <MotionTag
      className={`inline-flex flex-wrap gap-x-[0.26em] ${className}`}
      aria-label={text}
    >
      {words.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          aria-hidden="true"
          initial={{ opacity: 0, filter: 'blur(7px)', y: 8 }}
          {...(immediate
            ? { animate: { opacity: 1, filter: 'blur(0px)', y: 0 } }
            : {
                whileInView: { opacity: 1, filter: 'blur(0px)', y: 0 },
                viewport: { once: true, amount: 0.3 },
              })}
          transition={{
            duration: 0.42,
            delay: idx * delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block will-change-transform"
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
};

/* =========================================================================
   2. ShinyText — ReactBits-inspired metallic gold/crimson specular sheen
   ========================================================================= */
interface ShinyTextProps {
  children: React.ReactNode;
  className?: string;
  tone?: 'gold' | 'crimson' | 'light-gold';
  speedSec?: number;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  children,
  className = '',
  tone = 'gold',
  speedSec = 4.2,
}) => {
  const toneClass =
    tone === 'crimson'
      ? 'omega-shiny-crimson'
      : tone === 'light-gold'
        ? 'omega-shiny-light-gold'
        : 'omega-shiny-gold';

  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${toneClass} ${className}`}
      style={{ animationDuration: `${speedSec}s` }}
    >
      {children}
    </span>
  );
};

/* =========================================================================
   3. SpotlightCard — ReactBits-inspired pointer-tracking radial spotlight
   ========================================================================= */
interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightTone?: 'gold' | 'crimson' | 'dual';
  className?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  spotlightTone = 'gold',
  className = '',
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    onMouseMove?.(e);
  };

  const gradient =
    spotlightTone === 'crimson'
      ? `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, rgba(214, 58, 58, 0.12), transparent 72%)`
      : spotlightTone === 'dual'
        ? `radial-gradient(300px circle at ${coords.x}px ${coords.y}px, rgba(214, 58, 58, 0.11), rgba(184, 134, 43, 0.09) 42%, transparent 74%)`
        : `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, rgba(184, 134, 43, 0.14), transparent 72%)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseEnter={(e) => {
        setActive(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setActive(false);
        onMouseLeave?.(e);
      }}
      className={`relative overflow-hidden ${className}`}
      {...rest}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: gradient,
        }}
      />
      <div className="relative z-20 h-full w-full">{children}</div>
    </div>
  );
};

/* =========================================================================
   4. Magnet — ReactBits-inspired spring-physics magnetic CTA attraction
   ========================================================================= */
interface MagnetProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  strength = 0.24,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    x.set(Math.max(-10, Math.min(10, dx)));
    y.set(Math.max(-8, Math.min(8, dy)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

/* =========================================================================
   5. TiltedCard — ReactBits-inspired subtle 3D perspective studio hover tilt
   ========================================================================= */
interface TiltedCardProps {
  children: React.ReactNode;
  maxTilt?: number;
  className?: string;
}

export const TiltedCard: React.FC<TiltedCardProps> = ({
  children,
  maxTilt = 7,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 220,
    damping: 22,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ perspective: 1000 }}
      className={className}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

/* =========================================================================
   6. CountUp — ReactBits-inspired viewport-triggered tabular number counter
   ========================================================================= */
interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 1.15,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return;
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setValue(to);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const totalMs = duration * 1000;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / totalMs);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, from, to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
};

/* =========================================================================
   7. ScrollVelocityRibbon — ReactBits-inspired scroll-velocity ticker band
      Themed to OMEGA's Obsidian + Crimson + Archival Gold & Emblem Mark
   ========================================================================= */
interface ScrollVelocityRibbonProps {
  items: string[];
  baseVelocity?: number;
  className?: string;
}

export const ScrollVelocityRibbon: React.FC<ScrollVelocityRibbonProps> = ({
  items,
  baseVelocity = 26,
  className = '',
}) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 320 });
  const velocityFactor = useTransform(smoothVelocity, [-1800, 0, 1800], [-2.5, 0, 2.5], {
    clamp: true,
  });

  const trackRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return;
    const track = trackRef.current;
    if (!track) return;
    const halfWidth = track.scrollWidth / 2;
    if (halfWidth <= 0) return;

    const moveBy = (baseVelocity + Math.abs(velocityFactor.get()) * 32) * (delta / 1000);
    let next = baseX.get() - moveBy;
    if (Math.abs(next) >= halfWidth) {
      next = 0;
    }
    baseX.set(next);
  });

  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      aria-label="OMEGA Quality Highlights"
      className={`relative w-full overflow-hidden bg-[#161518] border-y border-[#B8862B]/30 py-3.5 select-none ${className}`}
    >
      {/* Subtle left & right vignette edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 z-10 bg-gradient-to-r from-[#161518] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 z-10 bg-gradient-to-l from-[#161518] to-transparent"
      />

      <motion.div
        ref={trackRef}
        style={{ x: baseX }}
        className="flex items-center whitespace-nowrap will-change-transform"
      >
        {repeated.map((label, idx) => (
          <div key={idx} className="inline-flex items-center shrink-0">
            <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#FAF8F5]/90 px-4 sm:px-6">
              {label}
            </span>
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#D63A3A]/15 border border-[#D63A3A]/40 shrink-0"
            >
              <img
                src="/logo-icon-white.png"
                alt=""
                className="w-3 h-3 object-contain opacity-90"
              />
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

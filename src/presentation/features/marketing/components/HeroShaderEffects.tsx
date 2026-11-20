import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

/* =========================================================================
   WEBGL SHADERS (Shaders.com-Inspired, OMEGA Stationery Color Theme & Logo)
   ========================================================================= */

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Flowing luxury stationery silk-shading + archival parchment mesh in OMEGA palette
const HERO_PARCHMENT_SILK_FRAG = `
  precision mediump float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.02 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    float t = u_time * 0.16;
    vec2 mOffset = (u_mouse - 0.5) * 0.22;

    // Domain-warped organic silk ribbons
    vec2 q = vec2(
      fbm(p * 1.35 + vec2(t * 0.55, -t * 0.42) + mOffset),
      fbm(p * 1.35 + vec2(-t * 0.48, t * 0.62) + vec2(4.2, 1.9))
    );

    float silkFold = fbm(p * 1.75 + 1.4 * q + vec2(t * 0.28, -t * 0.2));
    float crimsonVeil = smoothstep(0.36, 0.82, silkFold);
    float goldSheen = smoothstep(0.46, 0.88, fbm(p * 2.15 - q * 1.15 + vec2(-t * 0.35, t * 0.28)));

    // Specular highlight wave across diagonal
    float specWave = pow(max(0.0, 0.5 + 0.5 * sin((p.x * 2.4 - p.y * 1.6) + silkFold * 4.2 + t * 1.3)), 3.0);

    // Interactive warm pointer studio glow
    vec2 mousePos = vec2((u_mouse.x - 0.5) * aspect, u_mouse.y - 0.5);
    float pointerGlow = exp(-dot(p - mousePos, p - mousePos) * 3.4);

    // OMEGA Brand Colors: Warm Parchment (#FAF8F5), Soft Linen (#F2ECE4), Crimson (#D63A3A), Archival Gold (#C89637)
    vec3 parchment = vec3(0.980, 0.973, 0.961);
    vec3 warmLinen = vec3(0.945, 0.918, 0.882);
    vec3 crimson   = vec3(0.839, 0.227, 0.227);
    vec3 gold      = vec3(0.825, 0.620, 0.235);

    // Subtle right-side focus glow toward the 3D OMEGA Counter Book
    float bookFocus = exp(-dot(p - vec2(aspect * 0.24, 0.0), p - vec2(aspect * 0.24, 0.0)) * 2.1);

    vec3 col = mix(parchment, warmLinen, smoothstep(0.18, 0.85, silkFold));
    col = mix(col, gold, (goldSheen * 0.16 + specWave * 0.06 + bookFocus * 0.09));
    col = mix(col, crimson, (crimsonVeil * 0.10 + pointerGlow * 0.08 + bookFocus * 0.06));
    col += gold * pointerGlow * 0.065;

    // Tactile 70 GSM cotton paper grain
    float grain = (hash(gl_FragCoord.xy * 0.85 + fract(u_time)) - 0.5) * 0.016;
    col += grain;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

// Radial luminous studio halo shader behind the 3D OMEGA book
const HERO_BOOK_CAUSTIC_FRAG = `
  precision mediump float;
  varying vec2 v_uv;
  uniform float u_time;

  void main() {
    vec2 uv = v_uv * 2.0 - 1.0;
    float r = length(uv);
    float angle = atan(uv.y, uv.x);
    float t = u_time * 0.55;

    float wave1 = sin(angle * 3.0 + t) * 0.045 + cos(angle * 5.0 - t * 0.7) * 0.024;
    float wave2 = cos(angle * 2.0 - t * 0.9) * 0.038;

    float ring = exp(-pow((r - (0.55 + wave1)) * 6.4, 2.0));
    float innerGlow = exp(-r * r * 3.5);
    float outerRing = exp(-pow((r - (0.73 + wave2)) * 9.0, 2.0));

    vec3 crimson   = vec3(0.839, 0.227, 0.227);
    vec3 gold      = vec3(0.875, 0.655, 0.235);
    vec3 warmCream = vec3(0.985, 0.950, 0.900);

    float blend = 0.5 + 0.5 * sin(angle * 2.0 + t * 0.85);
    vec3 ringColor = mix(crimson, gold, blend);

    vec3 color = warmCream * innerGlow * 0.52 + ringColor * ring * 0.92 + gold * outerRing * 0.45;
    float alpha = clamp(innerGlow * 0.25 + ring * 0.34 + outerRing * 0.16, 0.0, 0.70);
    alpha *= smoothstep(1.0, 0.78, r);

    gl_FragColor = vec4(color, alpha);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vsSrc: string, fsSrc: string): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

function useHeroWebGL(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  fragmentSource: string,
  { alpha = false, interactive = true }: { alpha?: boolean; interactive?: boolean } = {}
) {
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      setFallback(true);
      return;
    }

    const program = createProgram(gl, VERTEX_SHADER, fragmentSource);
    if (!program) {
      setFallback(true);
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'a_position');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let isVisible = true;
    let rafId = 0;
    const startTime = performance.now();
    const targetMouse = { x: 0.62, y: 0.5 };
    const currentMouse = { x: 0.62, y: 0.5 };

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const drawFrame = (sec: number) => {
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      if (alpha) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }

      if (timeLoc) gl.uniform1f(timeLoc, sec);
      if (resLoc) gl.uniform2f(resLoc, canvas.width, canvas.height);
      if (mouseLoc) gl.uniform2f(mouseLoc, currentMouse.x, currentMouse.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reducedMotion) drawFrame(2.5);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !reducedMotion && !rafId) {
          rafId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.02 }
    );
    io.observe(canvas);

    const onPointerMove = (e: PointerEvent) => {
      if (!interactive || !isVisible) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1.0 - (e.clientY - rect.top) / rect.height;
      if (nx >= -0.2 && nx <= 1.2 && ny >= -0.2 && ny <= 1.2) {
        targetMouse.x = Math.min(1, Math.max(0, nx));
        targetMouse.y = Math.min(1, Math.max(0, ny));
      }
    };

    if (interactive) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    const render = (now: number) => {
      if (!isVisible) {
        rafId = 0;
        return;
      }
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;
      drawFrame((now - startTime) * 0.001);
      rafId = requestAnimationFrame(render);
    };

    if (reducedMotion) {
      drawFrame(2.5);
    } else {
      rafId = requestAnimationFrame(render);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      if (interactive) window.removeEventListener('pointermove', onPointerMove);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [fragmentSource, alpha, interactive]);

  return fallback;
}

export const HeroArchivalShader: React.FC<{ className?: string }> = ({ className = '' }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const fallback = useHeroWebGL(ref, HERO_PARCHMENT_SILK_FRAG, {
    alpha: false,
    interactive: true,
  });

  if (fallback) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_38%,rgba(233,180,76,0.16),transparent_55%),radial-gradient(ellipse_at_20%_82%,rgba(214,58,58,0.12),transparent_55%)] ${className}`}
      />
    );
  }

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full block ${className}`}
    />
  );
};

export const HeroBookCausticShader: React.FC<{ className?: string }> = ({ className = '' }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const fallback = useHeroWebGL(ref, HERO_BOOK_CAUSTIC_FRAG, {
    alpha: true,
    interactive: false,
  });

  if (fallback) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-full blur-2xl opacity-75 ${className}`}
        style={{
          background:
            'radial-gradient(circle, rgba(214,58,58,0.14) 0%, rgba(233,180,76,0.16) 48%, rgba(214,58,58,0) 72%)',
        }}
      />
    );
  }

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full block ${className}`}
    />
  );
};

/* =========================================================================
   REACTBITS-INSPIRED HERO ANIMATION PRIMITIVES
   ========================================================================= */

export const HeroBlurText: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = '' }) => {
  const words = text.split(' ');
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`} aria-label={text}>
      {words.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          aria-hidden="true"
          initial={{ opacity: 0, filter: 'blur(7px)', y: 8 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: 0.4,
            delay: idx * 0.045,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block will-change-transform"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export const HeroShinyText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <span className={`inline-block bg-clip-text text-transparent hero-shiny-crimson ${className}`}>
      {children}
    </span>
  );
};

export const HeroMagnet: React.FC<{
  children: React.ReactNode;
  strength?: number;
  className?: string;
}> = ({ children, strength = 0.22, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.5 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    x.set(Math.max(-10, Math.min(10, dx)));
    y.set(Math.max(-8, Math.min(8, dy)));
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const HeroTiltedBook: React.FC<{
  children: React.ReactNode;
  maxTilt?: number;
  className?: string;
}> = ({ children, maxTilt = 7, className = '' }) => {
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

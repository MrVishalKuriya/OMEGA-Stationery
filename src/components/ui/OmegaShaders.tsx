import React, { useEffect, useRef, useState } from 'react';

type ShaderVariant = 'parchment' | 'crimson-blush' | 'obsidian-crimson' | 'parchment-gold';

interface BaseShaderProps {
  className?: string;
  speed?: number;
  intensity?: number;
  interactive?: boolean;
}

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Shaders.com-inspired fluid mesh + archival paper grain shader tailored to OMEGA palette
const AURORA_MESH_FRAG = `
  precision mediump float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_intensity;
  uniform vec3 u_base;
  uniform vec3 u_surface;
  uniform vec3 u_crimson;
  uniform vec3 u_gold;

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

    vec2 mouseOffset = (u_mouse - 0.5) * 0.16;
    float t = u_time * 0.14;

    vec2 q = vec2(
      fbm(p * 1.45 + vec2(t * 0.6, -t * 0.4) + mouseOffset),
      fbm(p * 1.45 + vec2(-t * 0.5, t * 0.7) + vec2(4.2, 1.9))
    );

    float wave = fbm(p * 1.8 + 1.35 * q + vec2(t * 0.25, -t * 0.2));
    float ribbon = smoothstep(0.32, 0.78, wave);
    float goldBand = smoothstep(0.45, 0.86, fbm(p * 2.1 - q * 1.1 + vec2(-t * 0.35, t * 0.3)));

    // Pointer-reactive warm studio highlight
    vec2 mousePos = vec2((u_mouse.x - 0.5) * aspect, u_mouse.y - 0.5);
    float pointerGlow = exp(-dot(p - mousePos, p - mousePos) * 3.8);

    vec3 col = mix(u_base, u_surface, smoothstep(0.15, 0.85, wave));
    col = mix(col, u_gold, goldBand * 0.16 * u_intensity);
    col = mix(col, u_crimson, ribbon * (0.11 + pointerGlow * 0.09) * u_intensity);
    col += u_gold * pointerGlow * 0.06 * u_intensity;

    // Fine archival cotton paper micro-grain
    float grain = (hash(gl_FragCoord.xy * 0.75 + fract(u_time)) - 0.5) * 0.018;
    col += grain;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

// Shaders.com-inspired liquid silk ribbon shader (crimson, archival gold & deep obsidian/blush)
const SILK_RIBBON_FRAG = `
  precision mediump float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_intensity;
  uniform vec3 u_bg;
  uniform vec3 u_mid;
  uniform vec3 u_crimson;
  uniform vec3 u_gold;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = vec2(uv.x * aspect, uv.y);

    float t = u_time * 0.32;
    vec2 m = (u_mouse - 0.5) * 0.35;

    // Domain-warped silk folds
    vec2 warp = p * 2.1 + m;
    for (int i = 1; i <= 4; i++) {
      float fi = float(i);
      warp.x += 0.32 / fi * sin(fi * 2.2 * warp.y + t * (0.8 + fi * 0.15));
      warp.y += 0.32 / fi * cos(fi * 2.0 * warp.x - t * (0.65 + fi * 0.12));
    }

    float fold = 0.5 + 0.5 * sin(warp.x * 2.6 + warp.y * 1.9);
    float crest = pow(smoothstep(0.35, 0.98, fold), 2.2);
    float sheen = pow(smoothstep(0.68, 1.0, 0.5 + 0.5 * cos(warp.x * 3.8 - warp.y * 2.4 + t * 0.5)), 3.0);

    vec3 col = mix(u_bg, u_mid, smoothstep(0.05, 0.9, fold));
    col = mix(col, u_crimson, crest * 0.58 * u_intensity);
    col = mix(col, u_gold, sheen * 0.48 * u_intensity);

    // Subtle pointer specular caustic
    vec2 mp = vec2(u_mouse.x * aspect, u_mouse.y);
    float halo = exp(-dot(p - mp, p - mp) * 3.2);
    col += u_gold * halo * 0.12 * u_intensity;

    float grain = (hash(gl_FragCoord.xy) - 0.5) * 0.015;
    col += grain;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

// Radial caustic studio halo shader for behind the 3D OMEGA books & emblem
const LOGO_HALO_FRAG = `
  precision mediump float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_intensity;

  void main() {
    vec2 uv = v_uv * 2.0 - 1.0;
    float r = length(uv);
    float angle = atan(uv.y, uv.x);
    float t = u_time * 0.55;

    // Gentle organic radial ripple
    float wave1 = sin(angle * 3.0 + t) * 0.045 + cos(angle * 5.0 - t * 0.7) * 0.025;
    float wave2 = cos(angle * 2.0 - t * 0.9) * 0.04;

    float ring = exp(-pow((r - (0.54 + wave1)) * 6.5, 2.0));
    float innerGlow = exp(-r * r * 3.6);
    float outerRing = exp(-pow((r - (0.72 + wave2)) * 9.0, 2.0));

    // OMEGA Brand Crimson (#D63A3A) & Archival Gold (#D9A036)
    vec3 crimson = vec3(0.839, 0.227, 0.227);
    vec3 gold = vec3(0.851, 0.627, 0.212);
    vec3 warmCream = vec3(0.980, 0.945, 0.895);

    float mixFactor = 0.5 + 0.5 * sin(angle * 2.0 + t * 0.8);
    vec3 ringColor = mix(crimson, gold, mixFactor);

    vec3 color = warmCream * innerGlow * 0.55 + ringColor * ring * 0.9 + gold * outerRing * 0.45;
    float alpha = clamp((innerGlow * 0.26 + ring * 0.34 + outerRing * 0.16) * u_intensity, 0.0, 0.72);
    // Soft circular edge fade
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

function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
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

interface UseWebGLShaderOptions {
  fragmentSource: string;
  speed: number;
  intensity: number;
  interactive: boolean;
  alpha?: boolean;
  setUniforms?: (gl: WebGLRenderingContext, program: WebGLProgram) => void;
}

function useWebGLShader(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: UseWebGLShaderOptions
) {
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: Boolean(options.alpha),
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

    const program = createProgram(gl, VERTEX_SHADER, options.fragmentSource);
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
    const intensityLoc = gl.getUniformLocation(program, 'u_intensity');

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let isVisible = true;
    let rafId = 0;
    let startTime = performance.now();
    const targetMouse = { x: 0.55, y: 0.5 };
    const currentMouse = { x: 0.55, y: 0.5 };

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const drawFrame = (elapsedSec: number) => {
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      if (options.alpha) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }

      if (timeLoc) gl.uniform1f(timeLoc, elapsedSec * options.speed);
      if (resLoc) gl.uniform2f(resLoc, canvas.width, canvas.height);
      if (mouseLoc) gl.uniform2f(mouseLoc, currentMouse.x, currentMouse.y);
      if (intensityLoc) gl.uniform1f(intensityLoc, options.intensity);
      options.setUniforms?.(gl, program);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reducedMotion) drawFrame(2.4);
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

    const handlePointerMove = (e: PointerEvent) => {
      if (!options.interactive || !isVisible) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1.0 - (e.clientY - rect.top) / rect.height;
      if (nx >= -0.2 && nx <= 1.2 && ny >= -0.2 && ny <= 1.2) {
        targetMouse.x = Math.min(1, Math.max(0, nx));
        targetMouse.y = Math.min(1, Math.max(0, ny));
      }
    };

    if (options.interactive) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
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
      drawFrame(2.4);
    } else {
      rafId = requestAnimationFrame(render);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      if (options.interactive) {
        window.removeEventListener('pointermove', handlePointerMove);
      }
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [options.fragmentSource, options.speed, options.intensity, options.interactive, options.alpha]);

  return fallback;
}

/**
 * OmegaAuroraMeshShader
 * Shaders.com-inspired flowing parchment, archival gold & crimson ink mesh shader.
 */
export const OmegaAuroraMeshShader: React.FC<
  BaseShaderProps & { variant?: 'parchment' | 'parchment-gold' }
> = ({
  className = '',
  variant = 'parchment',
  speed = 1,
  intensity = 1,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fallback = useWebGLShader(canvasRef, {
    fragmentSource: AURORA_MESH_FRAG,
    speed,
    intensity,
    interactive,
    setUniforms: (gl, program) => {
      const baseLoc = gl.getUniformLocation(program, 'u_base');
      const surfLoc = gl.getUniformLocation(program, 'u_surface');
      const crimLoc = gl.getUniformLocation(program, 'u_crimson');
      const goldLoc = gl.getUniformLocation(program, 'u_gold');

      if (variant === 'parchment-gold') {
        if (baseLoc) gl.uniform3f(baseLoc, 0.992, 0.986, 0.976); // #FDFBF9
        if (surfLoc) gl.uniform3f(surfLoc, 0.955, 0.931, 0.896); // #F4EDE4
        if (crimLoc) gl.uniform3f(crimLoc, 0.839, 0.227, 0.227); // #D63A3A
        if (goldLoc) gl.uniform3f(goldLoc, 0.722, 0.525, 0.169); // #B8862B
      } else {
        if (baseLoc) gl.uniform3f(baseLoc, 0.980, 0.973, 0.961); // #FAF8F5
        if (surfLoc) gl.uniform3f(surfLoc, 0.949, 0.925, 0.894); // #F2ECE4
        if (crimLoc) gl.uniform3f(crimLoc, 0.839, 0.227, 0.227); // #D63A3A
        if (goldLoc) gl.uniform3f(goldLoc, 0.785, 0.588, 0.215); // #C89637
      }
    },
  });

  if (fallback) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_82%_20%,rgba(184,134,43,0.12),transparent_55%),radial-gradient(ellipse_at_15%_85%,rgba(214,58,58,0.10),transparent_55%)] ${className}`}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full block ${className}`}
    />
  );
};

/**
 * OmegaSilkShader
 * Shaders.com-inspired liquid silk folds in OMEGA Obsidian, Crimson Red & Archival Gold.
 */
export const OmegaSilkShader: React.FC<
  BaseShaderProps & { variant?: ShaderVariant }
> = ({
  className = '',
  variant = 'obsidian-crimson',
  speed = 0.85,
  intensity = 1,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fallback = useWebGLShader(canvasRef, {
    fragmentSource: SILK_RIBBON_FRAG,
    speed,
    intensity,
    interactive,
    setUniforms: (gl, program) => {
      const bgLoc = gl.getUniformLocation(program, 'u_bg');
      const midLoc = gl.getUniformLocation(program, 'u_mid');
      const crimLoc = gl.getUniformLocation(program, 'u_crimson');
      const goldLoc = gl.getUniformLocation(program, 'u_gold');

      if (variant === 'obsidian-crimson') {
        if (bgLoc) gl.uniform3f(bgLoc, 0.082, 0.078, 0.090);     // #151417 Obsidian
        if (midLoc) gl.uniform3f(midLoc, 0.165, 0.118, 0.125);   // Deep Burgundy Charcoal
        if (crimLoc) gl.uniform3f(crimLoc, 0.720, 0.155, 0.165); // OMEGA Crimson
        if (goldLoc) gl.uniform3f(goldLoc, 0.840, 0.630, 0.250); // Burnished Gold
      } else if (variant === 'crimson-blush') {
        if (bgLoc) gl.uniform3f(bgLoc, 0.945, 0.757, 0.741);     // #F1C1BD Signature Banner Blush
        if (midLoc) gl.uniform3f(midLoc, 0.965, 0.835, 0.812);   // Soft Rose Parchment
        if (crimLoc) gl.uniform3f(crimLoc, 0.839, 0.227, 0.227); // OMEGA Crimson
        if (goldLoc) gl.uniform3f(goldLoc, 0.914, 0.706, 0.298); // Archival Gold
      } else {
        if (bgLoc) gl.uniform3f(bgLoc, 0.980, 0.973, 0.961);     // #FAF8F5
        if (midLoc) gl.uniform3f(midLoc, 0.949, 0.925, 0.894);   // #F2ECE4
        if (crimLoc) gl.uniform3f(crimLoc, 0.839, 0.227, 0.227);
        if (goldLoc) gl.uniform3f(goldLoc, 0.722, 0.525, 0.169);
      }
    },
  });

  if (fallback) {
    const fallbackBg =
      variant === 'obsidian-crimson'
        ? 'bg-[radial-gradient(ellipse_at_20%_50%,rgba(214,58,58,0.28),transparent_60%),radial-gradient(ellipse_at_85%_30%,rgba(233,180,76,0.22),transparent_55%),linear-gradient(135deg,#161518,#221518)]'
        : 'bg-[radial-gradient(ellipse_at_25%_50%,rgba(214,58,58,0.16),transparent_60%),radial-gradient(ellipse_at_80%_30%,rgba(233,180,76,0.16),transparent_55%)]';
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${fallbackBg} ${className}`}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full block ${className}`}
    />
  );
};

/**
 * OmegaLogoHaloShader
 * Radial luminous crimson-and-gold WebGL caustic ring behind the 3D OMEGA books in the Hero.
 */
export const OmegaLogoHaloShader: React.FC<BaseShaderProps> = ({
  className = '',
  speed = 0.85,
  intensity = 1,
  interactive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fallback = useWebGLShader(canvasRef, {
    fragmentSource: LOGO_HALO_FRAG,
    speed,
    intensity,
    interactive,
    alpha: true,
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
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full block ${className}`}
    />
  );
};

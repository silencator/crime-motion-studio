import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {H, W, hash, noise1, stepF} from './time';

/* ------------------------------------------------------------------ */
/* SVG defs: hatching, gradients. Include <Defs/> once in every Stage. */
/* ------------------------------------------------------------------ */
export const Defs: React.FC = () => (
  <defs>
    {[
      ['hatch', 7, 1.6, 35],
      ['hatchFine', 5, 1.1, 40],
      ['hatchWide', 11, 2.2, 30],
      ['hatchX', 6, 1.2, -40],
      ['hatchV', 9, 1.6, 0],
    ].map(([id, gap, w, rot]) => (
      <pattern key={id as string} id={id as string} width={gap as number} height={gap as number} patternUnits="userSpaceOnUse" patternTransform={`rotate(${rot})`}>
        <line x1={0} y1={0} x2={0} y2={gap as number} stroke="#0b0706" strokeWidth={w as number} />
      </pattern>
    ))}
    <pattern id="concrete" width={60} height={60} patternUnits="userSpaceOnUse">
      <rect width={60} height={60} fill="none" />
      <circle cx={8} cy={12} r={1.6} fill="#000" opacity={0.35} />
      <circle cx={41} cy={7} r={1.1} fill="#000" opacity={0.3} />
      <circle cx={27} cy={38} r={2} fill="#000" opacity={0.25} />
      <circle cx={52} cy={49} r={1.3} fill="#000" opacity={0.3} />
      <circle cx={14} cy={53} r={0.9} fill="#fff" opacity={0.15} />
      <path d="M33 20 l6 3 M4 30 l3 5 M46 30 l-4 6" stroke="#000" strokeWidth={0.9} opacity={0.35} />
    </pattern>
    <pattern id="tweed" width={8} height={8} patternUnits="userSpaceOnUse">
      <path d="M0 8 L8 0 M-2 2 L2 -2 M6 10 L10 6" stroke="#2a1d12" strokeWidth={1.4} opacity={0.55} />
      <path d="M0 0 L8 8" stroke="#8a7255" strokeWidth={0.8} opacity={0.35} />
    </pattern>
    <pattern id="stubble" width={6} height={6} patternUnits="userSpaceOnUse">
      <circle cx={1.5} cy={2} r={0.75} fill="#2b1b14" opacity={0.55} />
      <circle cx={4.5} cy={4.6} r={0.65} fill="#2b1b14" opacity={0.45} />
    </pattern>
    <pattern id="chainlink" width={22} height={22} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width={22} height={22} fill="none" stroke="#0c0808" strokeWidth={2.2} />
    </pattern>
    <pattern id="parquet" width={80} height={40} patternUnits="userSpaceOnUse">
      <rect width={80} height={40} fill="none" />
      <path d="M0 0 H80 M0 20 H80 M40 0 V20 M0 20 V40 M80 20 V40 M20 20 V40 M60 20 V40" stroke="#000" strokeWidth={1.6} opacity={0.45} />
    </pattern>
    <pattern id="wallpaper" width={70} height={90} patternUnits="userSpaceOnUse">
      <path d="M35 8 C45 25 45 35 35 45 C25 35 25 25 35 8 Z M0 53 C10 70 10 80 0 90 M70 53 C60 70 60 80 70 90" fill="none" stroke="#000" strokeWidth={1.4} opacity={0.22} />
    </pattern>
    <radialGradient id="warmGlow">
      <stop offset="0" stopColor="#ffcf7a" stopOpacity={0.95} />
      <stop offset="0.35" stopColor="#ff9a3c" stopOpacity={0.45} />
      <stop offset="1" stopColor="#ff7a20" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="coldGlow">
      <stop offset="0" stopColor="#cfe6ff" stopOpacity={0.8} />
      <stop offset="0.4" stopColor="#7fa7d6" stopOpacity={0.3} />
      <stop offset="1" stopColor="#3a5f8f" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="redGlow">
      <stop offset="0" stopColor="#ff3a2a" stopOpacity={0.9} />
      <stop offset="0.45" stopColor="#c0141a" stopOpacity={0.35} />
      <stop offset="1" stopColor="#7a0008" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="blueGlow">
      <stop offset="0" stopColor="#6fa8ff" stopOpacity={0.9} />
      <stop offset="0.45" stopColor="#2457d6" stopOpacity={0.35} />
      <stop offset="1" stopColor="#0a1f7a" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="softDark">
      <stop offset="0.5" stopColor="#000" stopOpacity={0} />
      <stop offset="1" stopColor="#000" stopOpacity={0.85} />
    </radialGradient>
    <linearGradient id="fadeDown" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#000" stopOpacity={0} />
      <stop offset="1" stopColor="#000" stopOpacity={0.9} />
    </linearGradient>
  </defs>
);

/* ------------------------------------------------------------------ */
/* Ink shape: flat gouache fill + bold black outline whose weight      */
/* varies (thicker on the shadow side via an offset under-shape).      */
/* ------------------------------------------------------------------ */
export const Ink: React.FC<{d: string; fill: string; w?: number; heavy?: number; hatch?: string; hatchOp?: number; op?: number; stroke?: string}> = ({
  d,
  fill,
  w = 3.2,
  heavy = 3,
  hatch,
  hatchOp = 0.35,
  op = 1,
  stroke = '#0b0706',
}) => (
  <g opacity={op}>
    {heavy > 0 && <path d={d} fill={stroke} transform={`translate(${heavy * 0.7} ${heavy})`} />}
    <path d={d} fill={fill} stroke={stroke} strokeWidth={w} strokeLinejoin="round" />
    {hatch && <path d={d} fill={`url(#${hatch})`} opacity={hatchOp} />}
  </g>
);

/** A plain ink line (variable feel via round caps). */
export const Line: React.FC<{d: string; w?: number; c?: string; op?: number}> = ({d, w = 3, c = '#0b0706', op = 1}) => (
  <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={op} />
);

/* ------------------------------------------------------------------ */
/* Snow: three depth layers, stepped (on 4s), wind-driven.             */
/* Coordinates are screen space (draw outside the camera, or in Layer).*/
/* ------------------------------------------------------------------ */
export const Snow: React.FC<{f: number; n?: number; wind?: number; speed?: number; seed?: number; color?: string; w?: number; h?: number; sizes?: [number, number]; op?: number; step?: number}> = ({
  f,
  n = 140,
  wind = 0.6,
  speed = 1,
  seed = 1,
  color = '#efe9e4',
  w = W,
  h = H,
  sizes = [2, 6],
  op = 0.9,
  step = 4,
}) => {
  const t = stepF(f, step) / 60;
  const flakes = [];
  for (let i = 0; i < n; i++) {
    const r = sizes[0] + hash(i * 3.1 + seed) * (sizes[1] - sizes[0]);
    const v = (60 + r * 22) * speed;
    const x0 = hash(i * 7.7 + seed * 3) * (w + 400) - 200;
    const y0 = hash(i * 1.3 + seed * 5) * (h + 200);
    const y = ((y0 + t * v) % (h + 200)) - 100;
    const x = (((x0 + t * v * wind + noise1(i + t * 0.6) * 30) % (w + 400)) + (w + 400)) % (w + 400) - 200;
    flakes.push(<circle key={i} cx={x} cy={y} r={r} fill={color} opacity={op * (0.55 + hash(i + 9) * 0.45)} />);
  }
  return <g>{flakes}</g>;
};

/** Screen-space snow in 3 depths as an HTML overlay (SVG). Big blurry flakes in front. */
export const SnowOverlay: React.FC<{f: number; wind?: number; density?: number; tint?: string; front?: boolean; speed?: number}> = ({
  f,
  wind = 0.5,
  density = 1,
  tint = '#f2ece6',
  front = true,
  speed = 1,
}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <Snow f={f} n={Math.round(220 * density)} sizes={[1.2, 3]} wind={wind * 0.8} speed={0.55 * speed} seed={3} color={tint} op={0.7} />
      <Snow f={f} n={Math.round(90 * density)} sizes={[3, 6]} wind={wind} speed={0.9 * speed} seed={7} color={tint} op={0.85} />
      {front && (
        <g style={{filter: 'blur(3px)'}}>
          <Snow f={f} n={Math.round(16 * density)} sizes={[9, 16]} wind={wind * 1.3} speed={1.6 * speed} seed={13} color={tint} op={0.75} />
        </g>
      )}
    </svg>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* Smoke column (chimneys, cigarettes): stepped puffs rising + drifting */
/* ------------------------------------------------------------------ */
export const Smoke: React.FC<{f: number; x: number; y: number; scale?: number; color?: string; edge?: string; drift?: number; n?: number; rate?: number; seed?: number; op?: number; step?: number; rise?: number}> = ({
  f,
  x,
  y,
  scale = 1,
  color = '#140c0b',
  edge = '#000',
  drift = 1,
  n = 14,
  rate = 0.5,
  seed = 1,
  op = 1,
  step = 6,
  rise = 1,
}) => {
  const t = stepF(f, step) / 60;
  const puffs = [];
  for (let i = 0; i < n; i++) {
    const age = (t * rate + i / n) % 1; // 0..1 life
    const k = Math.floor(t * rate + i / n);
    const r = (18 + age * 70) * scale * (0.8 + hash(i + k * 13 + seed) * 0.5);
    const px = x + (age * age * 260 * drift + noise1(i * 2 + k + age * 3) * 25 * age) * scale;
    const py = y - age * 420 * scale * rise;
    const o = op * (1 - age) * Math.min(1, age * 8);
    puffs.push(
      <g key={i} opacity={o}>
        <circle cx={px} cy={py} r={r} fill={color} stroke={edge} strokeWidth={2.5 * scale} />
        <circle cx={px - r * 0.45} cy={py + r * 0.2} r={r * 0.7} fill={color} />
        <circle cx={px + r * 0.5} cy={py - r * 0.1} r={r * 0.6} fill={color} />
      </g>,
    );
  }
  return <g>{puffs}</g>;
};

/** Thin cigarette smoke: a wavering ribbon, stepped. */
export const CigSmoke: React.FC<{f: number; x: number; y: number; scale?: number; color?: string; op?: number; len?: number}> = ({f, x, y, scale = 1, color = '#b9c2cc', op = 0.6, len = 320}) => {
  const t = stepF(f, 5) / 60;
  const pts: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const s = i / 24;
    const px = x + (noise1(s * 3 - t * 1.4) * 40 * s + Math.sin(s * 6 - t * 2) * 16 * s + s * 60) * scale;
    const py = y - s * len * scale;
    pts.push(`${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  return (
    <g opacity={op}>
      <path d={pts.join(' ')} fill="none" stroke={color} strokeWidth={9 * scale} strokeLinecap="round" opacity={0.35} />
      <path d={pts.join(' ')} fill="none" stroke={color} strokeWidth={3.5 * scale} strokeLinecap="round" />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Post FX (HTML overlays above the SVG)                               */
/* ------------------------------------------------------------------ */
/** 35 mm film grain + paper grain + vignette. Grain frames change every 2 frames with random offsets. */
export const FilmFinish: React.FC<{f: number; grain?: number; paper?: number; vignette?: number; flicker?: number}> = ({f, grain = 0.2, paper = 0.1, vignette = 0.75, flicker = 0.03}) => {
  const g = Math.floor(f / 2);
  const idx = g % 8;
  const ox = Math.floor(hash(g * 1.7) * 200) - 100;
  const oy = Math.floor(hash(g * 2.9) * 200) - 100;
  const fl = 1 - flicker * (hash(Math.floor(f / 3)) > 0.85 ? 1 : hash(Math.floor(f / 3) + 3) * 0.4);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <Img
        src={staticFile('tex/paper.png')}
        style={{position: 'absolute', inset: 0, width: W, height: H, mixBlendMode: 'multiply', opacity: paper}}
      />
      <Img
        src={staticFile(`tex/grain${idx}.png`)}
        style={{position: 'absolute', left: -120 + ox, top: -120 + oy, width: W + 240, height: H + 240, mixBlendMode: 'overlay', opacity: grain}}
      />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 62% at 50% 46%, rgba(0,0,0,0) 45%, rgba(0,0,0,${vignette}) 100%)`}} />
      <AbsoluteFill style={{background: '#000', opacity: 1 - fl}} />
    </AbsoluteFill>
  );
};

/** Colour grade: tint layer with blend mode (multiply for darken/tint, screen for glow, color for mono). */
export const Grade: React.FC<{color: string; mode?: React.CSSProperties['mixBlendMode']; op?: number}> = ({color, mode = 'multiply', op = 1}) => (
  <AbsoluteFill style={{background: color, mixBlendMode: mode, opacity: op, pointerEvents: 'none'}} />
);

/** Full-frame flash (white/red) that decays. */
export const Flash: React.FC<{f: number; at: number; color?: string; dur?: number; peak?: number; mode?: React.CSSProperties['mixBlendMode']}> = ({f, at, color = '#fff', dur = 18, peak = 0.8, mode = 'screen'}) => {
  const k = f - at;
  if (k < 0 || k > dur) return null;
  const o = peak * Math.pow(1 - k / dur, 2);
  return <AbsoluteFill style={{background: color, opacity: o, mixBlendMode: mode}} />;
};

/** Police light bar wash: alternating red/blue pulses (stepped, 2 bursts per colour). Use inside svg. */
export const policePhase = (f: number) => {
  const cyc = f % 48; // 0.8 s per full red+blue cycle
  const red = cyc < 24 ? (Math.floor(cyc / 4) % 2 === 0 ? 1 : 0.25) : 0;
  const blue = cyc >= 24 ? (Math.floor((cyc - 24) / 4) % 2 === 0 ? 1 : 0.25) : 0;
  return {red, blue};
};

/** Dust motes floating in a light beam (stepped). */
export const Dust: React.FC<{f: number; x: number; y: number; w: number; h: number; n?: number; color?: string}> = ({f, x, y, w, h, n = 40, color = '#ffe2b0'}) => {
  const t = stepF(f, 4) / 60;
  return (
    <g>
      {Array.from({length: n}).map((_, i) => {
        const px = x + ((hash(i * 3.3) * w + noise1(i + t * 0.3) * 40 + t * 8) % w);
        const py = y + ((hash(i * 5.1) * h - t * 12 * (0.5 + hash(i))) % h + h) % h;
        return <circle key={i} cx={px} cy={py} r={1 + hash(i * 9) * 2.2} fill={color} opacity={0.25 + 0.5 * hash(i * 2 + Math.floor(t * 4))} />;
      })}
    </g>
  );
};

export const Black: React.FC<{op?: number}> = ({op = 1}) => <AbsoluteFill style={{background: '#000', opacity: op}} />;

/**
 * Flashlight / torch pool (screen space, HTML overlay): darkens the frame except a soft circle at (x, y),
 * adds a cool-white hot spot and a faint beam from (sx, sy) when given. Stepped jitter = hand-held.
 */
export const Torch: React.FC<{f: number; x: number; y: number; r?: number; dark?: number; tint?: string; sx?: number; sy?: number; jitter?: number}> = ({
  f,
  x,
  y,
  r = 330,
  dark = 0.9,
  tint = 'rgba(235,240,255,0.22)',
  sx,
  sy,
  jitter = 6,
}) => {
  const k = stepF(f, 3);
  const jx = x + noise1(k * 0.05 + 3) * jitter;
  const jy = y + noise1(k * 0.05 + 41) * jitter;
  const beam = sx !== undefined && sy !== undefined;
  const ang = beam ? Math.atan2(jy - sy!, jx - sx!) : 0;
  const len = beam ? Math.hypot(jx - sx!, jy - sy!) : 0;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle ${r * 1.35}px at ${jx}px ${jy}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,${dark}) 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(circle ${r}px at ${jx}px ${jy}px, ${tint} 0%, rgba(0,0,0,0) 80%)`, mixBlendMode: 'screen'}} />
      {beam && (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', inset: 0, mixBlendMode: 'screen', filter: 'blur(14px)'}}>
          <g transform={`translate(${sx} ${sy}) rotate(${(ang * 180) / Math.PI})`}>
            <polygon points={`0,-14 ${len},${-r * 0.8} ${len},${r * 0.8} 0,14`} fill="#dfe8ff" opacity={0.1} />
          </g>
        </svg>
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Rain (CASE 003): slanted streaks in 3 depths, stepped on 2s, with   */
/* optional ground splashes. Screen-space HTML overlay.                */
/* ------------------------------------------------------------------ */
const RainLayer: React.FC<{f: number; n: number; len: number; w: number; speed: number; slant: number; seed: number; color: string; op: number}> = ({f, n, len, w, speed, slant, seed, color, op}) => {
  const t = stepF(f, 2) / 60;
  const out = [];
  for (let i = 0; i < n; i++) {
    const v = speed * (0.85 + hash(i * 5.3 + seed) * 0.3);
    const x0 = hash(i * 7.1 + seed) * (W + 600) - 300;
    const y0 = hash(i * 3.7 + seed * 2) * (H + 400);
    const y = ((y0 + t * v) % (H + 400)) - 200;
    const x = x0 + (y + 200) * slant;
    out.push(<line key={i} x1={x} y1={y} x2={x - len * slant} y2={y - len} stroke={color} strokeWidth={w} strokeLinecap="round" opacity={op * (0.5 + hash(i + seed) * 0.5)} />);
  }
  return <g>{out}</g>;
};

export const Rain: React.FC<{f: number; density?: number; slant?: number; tint?: string; front?: boolean; splashY?: number; op?: number}> = ({
  f,
  density = 1,
  slant = 0.18,
  tint = '#cfd8e0',
  front = true,
  splashY,
  op = 1,
}) => (
  <AbsoluteFill style={{pointerEvents: 'none', opacity: op}}>
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <RainLayer f={f} n={Math.round(160 * density)} len={36} w={1.4} speed={1900} slant={slant} seed={2} color={tint} op={0.35} />
      <RainLayer f={f} n={Math.round(70 * density)} len={70} w={2.4} speed={2600} slant={slant} seed={5} color={tint} op={0.5} />
      {front && (
        <g style={{filter: 'blur(2.5px)'}}>
          <RainLayer f={f} n={Math.round(14 * density)} len={180} w={5} speed={3600} slant={slant} seed={9} color={tint} op={0.45} />
        </g>
      )}
      {splashY !== undefined &&
        Array.from({length: Math.round(26 * density)}).map((_, i) => {
          const k = Math.floor(stepF(f, 2) / 6) + i * 3;
          const life = (stepF(f, 2) % 6) / 6;
          const x = hash(k * 1.9 + i) * W;
          const y = splashY + hash(k * 2.7 + i) * (H - splashY);
          const r = 4 + life * 16 * (0.6 + (y - splashY) / (H - splashY + 1));
          return <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.3} fill="none" stroke={tint} strokeWidth={1.6} opacity={(1 - life) * 0.6} />;
        })}
    </svg>
  </AbsoluteFill>
);

/** 4-point sparkle (diamond glint). Use inside svg. k = 0..1 intensity. */
export const Glint: React.FC<{x: number; y: number; r?: number; k?: number; color?: string; rot?: number}> = ({x, y, r = 40, k = 1, color = '#ffffff', rot = 0}) =>
  k <= 0.01 ? null : (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} opacity={Math.min(1, k * 1.4)}>
      <circle r={r * 0.6} fill={color} opacity={0.18} />
      <path d={`M0 ${-r} L${r * 0.09} ${-r * 0.09} L${r} 0 L${r * 0.09} ${r * 0.09} L0 ${r} L${-r * 0.09} ${r * 0.09} L${-r} 0 L${-r * 0.09} ${-r * 0.09} Z`} fill={color} />
      <path d={`M0 ${-r * 0.5} L${r * 0.06} 0 L0 ${r * 0.5} L${-r * 0.06} 0 Z`} fill={color} transform="rotate(45)" />
    </g>
  );

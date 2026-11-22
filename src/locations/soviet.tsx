import React from 'react';
import {Ink, Line, Smoke, policePhase} from '../kit/fx';
import {hash, noise1, stepF} from '../kit/time';

/** Reusable painted-Soviet set pieces. All are drawn in world units with an ink outline + flat fills + hatching. */

export const INK = '#0b0706';
export const CONCRETE = {base: '#4b4a3c', lit: '#5f5d4b', shade: '#2d2c24', deep: '#1c1b16'};

/* ---------------- sky ---------------- */
export const RedSky: React.FC<{w: number; h: number; x?: number; y?: number; top?: string; mid?: string; low?: string}> = ({
  w,
  h,
  x = 0,
  y = 0,
  top = '#4a0709',
  mid = '#9c1216',
  low = '#d2321e',
}) => (
  <g>
    <defs>
      <linearGradient id={`sky${w}${h}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="0.55" stopColor={mid} />
        <stop offset="1" stopColor={low} />
      </linearGradient>
    </defs>
    <rect x={x} y={y} width={w} height={h} fill={`url(#sky${w}${h})`} />
    {/* painted brush streaks (flat-ceiling sky) */}
    {Array.from({length: 26}).map((_, i) => (
      <rect
        key={i}
        x={x + hash(i * 3.3) * w * 0.9 - 100}
        y={y + hash(i * 1.9) * h * 0.85}
        width={200 + hash(i * 7.1) * 700}
        height={4 + hash(i * 2.2) * 14}
        rx={6}
        fill={hash(i) > 0.5 ? '#000' : '#ff5a3a'}
        opacity={0.05 + hash(i * 4.4) * 0.06}
      />
    ))}
  </g>
);

/* ---------------- khrushchyovka block ---------------- */
export const Block: React.FC<{
  x: number;
  y: number; // ground y (bottom)
  w: number;
  floors: number;
  cols: number;
  fh?: number; // floor height
  seed?: number;
  lit?: number; // fraction of lit windows
  f?: number;
  color?: string;
  shade?: string;
  balconies?: boolean;
  side?: number; // width of the visible shaded side wall
  snow?: boolean;
  litColor?: string;
}> = ({x, y, w, floors, cols, fh = 90, seed = 1, lit = 0.12, f = 0, color = CONCRETE.base, shade = CONCRETE.shade, balconies = true, side = 0, snow = true, litColor = '#ffb347'}) => {
  const h = floors * fh;
  const top = y - h;
  const cw = w / cols;
  const win = [];
  for (let r = 0; r < floors; r++) {
    for (let c = 0; c < cols; c++) {
      const k = seed * 100 + r * 31 + c * 7;
      const on = hash(k) < lit;
      const flick = on && hash(k * 3.1) > 0.85 ? (hash(Math.floor(stepF(f, 8) / 8) + k) > 0.3 ? 1 : 0.35) : 1;
      const wx = x + c * cw + cw * 0.22;
      const wy = top + r * fh + fh * 0.25;
      const ww = cw * 0.56;
      const wh = fh * 0.48;
      win.push(
        <g key={`${r}-${c}`}>
          <rect x={wx} y={wy} width={ww} height={wh} fill={on ? litColor : '#15130f'} opacity={on ? flick : 0.95} stroke={INK} strokeWidth={2} />
          {on && <rect x={wx - ww * 0.6} y={wy - wh * 0.5} width={ww * 2.2} height={wh * 2} fill="url(#warmGlow)" opacity={0.35 * flick} />}
          {!on && <line x1={wx + ww / 2} y1={wy} x2={wx + ww / 2} y2={wy + wh} stroke="#2a2620" strokeWidth={2} />}
          {balconies && c % 2 === 1 && r > 0 && r % 1 === 0 && (
            <g>
              <rect x={wx - cw * 0.12} y={wy + wh * 0.72} width={ww + cw * 0.24} height={fh * 0.24} fill={shade} stroke={INK} strokeWidth={2} />
              {snow && <rect x={wx - cw * 0.12} y={wy + wh * 0.68} width={ww + cw * 0.24} height={4} fill="#d8d2cc" opacity={0.8} />}
            </g>
          )}
          {snow && <rect x={wx - 2} y={wy + wh} width={ww + 4} height={3} fill="#d8d2cc" opacity={0.7} />}
        </g>,
      );
    }
  }
  return (
    <g>
      {side > 0 && <Ink d={`M${x + w} ${top} L${x + w + side} ${top + side * 0.25} L${x + w + side} ${y} L${x + w} ${y} Z`} fill={shade} hatch="hatch" hatchOp={0.4} heavy={0} />}
      <Ink d={`M${x} ${top} H${x + w} V${y} H${x} Z`} fill={color} heavy={0} w={3} />
      <rect x={x} y={top} width={w} height={h} fill="url(#concrete)" />
      {/* weather streaks */}
      {Array.from({length: Math.round(cols * 1.2)}).map((_, i) => (
        <rect key={i} x={x + hash(seed + i * 5.3) * w} y={top + hash(seed + i) * h * 0.3} width={3 + hash(i) * 8} height={h * (0.2 + hash(i * 2) * 0.5)} fill="#000" opacity={0.12} />
      ))}
      {/* panel seams */}
      {Array.from({length: floors - 1}).map((_, r) => (
        <line key={r} x1={x} x2={x + w} y1={top + (r + 1) * fh} y2={top + (r + 1) * fh} stroke={INK} strokeWidth={1.4} opacity={0.4} />
      ))}
      {win}
      {/* roof snow + antennas */}
      {snow && <path d={`M${x - 4} ${top} C${x + w * 0.3} ${top - 10} ${x + w * 0.7} ${top - 8} ${x + w + 4} ${top} L${x + w + 4} ${top + 8} L${x - 4} ${top + 8} Z`} fill="#dcd6d0" stroke={INK} strokeWidth={2} />}
      {[0.2, 0.55, 0.8].map((k, i) => (
        <path key={i} d={`M${x + w * k} ${top} V${top - 40 - i * 12} M${x + w * k - 16} ${top - 30 - i * 12} H${x + w * k + 16}`} stroke={INK} strokeWidth={3} />
      ))}
      {/* shaded lower edge */}
      <rect x={x} y={y - fh * 0.6} width={w} height={fh * 0.6} fill="#000" opacity={0.3} />
    </g>
  );
};

/* ---------------- pylon (lattice tower) ---------------- */
export const Pylon: React.FC<{x: number; y: number; h: number; color?: string}> = ({x, y, h, color = '#120909'}) => {
  const w = h * 0.22;
  const segs = 9;
  const pts: (readonly [number, number])[] = [];
  for (let i = 0; i <= segs; i++) {
    const yy = y - (h * i) / segs;
    const ww = w * (1 - (i / segs) * 0.85);
    pts.push([yy, ww] as const);
  }
  const lines: string[] = [];
  pts.forEach(([yy, ww], i) => {
    lines.push(`M${x - ww / 2} ${yy} H${x + ww / 2}`);
    if (i < segs) {
      const [y2, w2] = pts[i + 1];
      lines.push(`M${x - ww / 2} ${yy} L${x + w2 / 2} ${y2} M${x + ww / 2} ${yy} L${x - w2 / 2} ${y2}`);
      lines.push(`M${x - ww / 2} ${yy} L${x - w2 / 2} ${y2} M${x + ww / 2} ${yy} L${x + w2 / 2} ${y2}`);
    }
  });
  const ay = y - h * 0.72;
  const by = y - h * 0.9;
  return (
    <g stroke={color} fill="none" strokeLinecap="round">
      <path d={lines.join(' ')} strokeWidth={Math.max(1.5, h / 160)} />
      <path d={`M${x - w * 0.9} ${ay} H${x + w * 0.9} M${x - w * 0.6} ${by} H${x + w * 0.6}`} strokeWidth={Math.max(2, h / 110)} />
      <path d={`M${x - w * 0.9} ${ay} L${x - w * 0.9} ${ay + 18} M${x + w * 0.9} ${ay} L${x + w * 0.9} ${ay + 18}`} strokeWidth={2} />
    </g>
  );
};

export const Cables: React.FC<{from: [number, number]; to: [number, number]; sag?: number; n?: number; gap?: number; color?: string}> = ({from, to, sag = 60, n = 3, gap = 14, color = '#120909'}) => (
  <g fill="none" stroke={color} strokeWidth={2}>
    {Array.from({length: n}).map((_, i) => (
      <path key={i} d={`M${from[0]} ${from[1] + i * gap} Q${(from[0] + to[0]) / 2} ${(from[1] + to[1]) / 2 + sag + i * gap} ${to[0]} ${to[1] + i * gap}`} />
    ))}
  </g>
);

/* ---------------- factory + smokestacks ---------------- */
export const Factory: React.FC<{x: number; y: number; s?: number; f: number; color?: string; smoke?: string; seed?: number}> = ({x, y, s = 1, f, color = '#160b0a', smoke = '#1a0e0d', seed = 1}) => (
  <g>
    {[0, 1, 2].map((i) => (
      <Smoke key={i} f={f + i * 37} x={x + (40 + i * 120) * s} y={y - (420 + i * 40) * s} scale={0.9 * s} color={smoke} edge="#0a0505" drift={1.4} n={12} rate={0.22} seed={seed + i} step={6} />
    ))}
    <path
      d={`M${x - 80 * s} ${y} V${y - 160 * s} L${x - 20 * s} ${y - 200 * s} V${y - 160 * s} L${x + 40 * s} ${y - 200 * s} V${y - 160 * s} L${x + 100 * s} ${y - 200 * s} V${y - 150 * s} H${x + 330 * s} V${y} Z`}
      fill={color}
    />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${x + (25 + i * 120) * s} ${y - 150 * s} L${x + (31 + i * 120) * s} ${y - (420 + i * 40) * s} H${x + (49 + i * 120) * s} L${x + (55 + i * 120) * s} ${y - 150 * s} Z`} fill={color} />
    ))}
    {[0, 1, 2].map((i) => (
      <rect key={i} x={x + (31 + i * 120) * s} y={y - (380 + i * 40) * s} width={18 * s} height={8 * s} fill="#5a1a12" opacity={0.6} />
    ))}
  </g>
);

/* ---------------- street lamp (sodium) ---------------- */
export const Lamp: React.FC<{x: number; y: number; h?: number; f: number; color?: string; on?: number; glow?: boolean; flicker?: boolean}> = ({x, y, h = 560, f, color = '#ffb44a', on = 1, glow = true, flicker = false}) => {
  const fl = flicker ? (hash(Math.floor(f / 5)) > 0.9 ? 0.3 : 1) : 1;
  const k = on * fl;
  return (
    <g>
      {glow && <polygon points={`${x + 70},${y - h + 30} ${x - 120},${y} ${x + 300},${y}`} fill={color} opacity={0.12 * k} />}
      {glow && <ellipse cx={x + 90} cy={y - 4} rx={220} ry={30} fill={color} opacity={0.22 * k} />}
      <path d={`M${x - 10} ${y} H${x + 10} L${x + 6} ${y - h} C${x + 6} ${y - h - 40} ${x + 50} ${y - h - 50} ${x + 80} ${y - h - 20}`} fill="#120a08" stroke={INK} strokeWidth={4} />
      <path d={`M${x + 50} ${y - h - 22} H${x + 104} L${x + 92} ${y - h + 8} H${x + 62} Z`} fill="#1d120c" stroke={INK} strokeWidth={3} />
      <ellipse cx={x + 77} cy={y - h + 10} rx={16} ry={7} fill={color} opacity={k} />
      {glow && <circle cx={x + 77} cy={y - h + 14} r={120} fill="url(#warmGlow)" opacity={0.85 * k} />}
      <rect x={x + 52} y={y - h - 28} width={50} height={7} fill="#e0dad2" opacity={0.85} />
    </g>
  );
};

/* ---------------- chain-link fence ---------------- */
export const Fence: React.FC<{x: number; y: number; w: number; h: number; post?: number}> = ({x, y, w, h, post = 240}) => (
  <g>
    <rect x={x} y={y - h} width={w} height={h} fill="url(#chainlink)" opacity={0.85} />
    <line x1={x} y1={y - h} x2={x + w} y2={y - h + 6} stroke={INK} strokeWidth={6} />
    {Array.from({length: Math.floor(w / post) + 1}).map((_, i) => (
      <g key={i}>
        <rect x={x + i * post - 6} y={y - h - 20} width={12} height={h + 20} fill="#1a1412" stroke={INK} strokeWidth={2} />
        <rect x={x + i * post - 8} y={y - h - 24} width={16} height={6} fill="#ddd6cf" />
      </g>
    ))}
    <line x1={x} y1={y - h - 2} x2={x + w} y2={y - h + 4} stroke="#ddd6cf" strokeWidth={3} opacity={0.8} />
  </g>
);

/* ---------------- bare tree ---------------- */
export const BareTree: React.FC<{x: number; y: number; s?: number; seed?: number; color?: string}> = ({x, y, s = 1, seed = 1, color = '#0d0807'}) => {
  const br: string[] = [];
  const grow = (px: number, py: number, ang: number, len: number, w: number, d: number) => {
    if (d > 5 || len < 12) return;
    const ex = px + Math.sin(ang) * len;
    const ey = py - Math.cos(ang) * len;
    br.push(`${px},${py},${ex},${ey},${w}`);
    const n = d < 2 ? 2 : 2 + (hash(seed + d * 7 + px) > 0.5 ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const a = ang + (hash(seed + px * 0.13 + i * 3.1 + d) - 0.5) * 1.3;
      grow(ex, ey, a, len * (0.62 + hash(i + d + seed) * 0.15), w * 0.62, d + 1);
    }
  };
  grow(x, y, 0, 220 * s, 26 * s, 0);
  return (
    <g stroke={color} strokeLinecap="round">
      {br.map((b, i) => {
        const [a, bb, c, d, w] = b.split(',').map(Number);
        return <line key={i} x1={a} y1={bb} x2={c} y2={d} strokeWidth={w} />;
      })}
    </g>
  );
};

/* ---------------- militia car (GAZ-style sedan) with light bar ---------------- */
export const PoliceCar: React.FC<{x: number; y: number; s?: number; f: number; body?: string}> = ({x, y, s = 1, f, body = '#1b1a1c'}) => {
  const {red, blue} = policePhase(f);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* light wash on the snow */}
      <ellipse cx={-40} cy={10} rx={520} ry={70} fill="#ff2a1a" opacity={0.25 * red} />
      <ellipse cx={60} cy={10} rx={520} ry={70} fill="#2a5aff" opacity={0.25 * blue} />
      <Ink d="M-330 -40 C-330 -80 -300 -100 -250 -104 L-170 -110 C-140 -170 -90 -190 0 -190 C90 -190 140 -170 170 -112 L270 -104 C320 -100 340 -80 340 -40 L340 -10 L-330 -10 Z" fill={body} w={4} heavy={4} />
      <path d="M-150 -112 C-128 -160 -90 -174 -10 -174 L-10 -112 Z M10 -112 L10 -174 C80 -174 120 -160 150 -112 Z" fill="#0e1418" stroke={INK} strokeWidth={3} />
      <path d="M-120 -120 L-60 -168" stroke="#7aa0c0" strokeWidth={4} opacity={0.3} />
      <rect x={-330} y={-70} width={670} height={14} fill="#c8c2bb" opacity={0.75} />
      <text x={-40} y={-74} fontFamily="IFStamp" fontSize={26} fill="#c8c2bb" opacity={0.85}>
        МИЛИЦИЯ
      </text>
      {[-200, 200].map((wx) => (
        <g key={wx}>
          <circle cx={wx} cy={-10} r={52} fill="#0a0808" stroke={INK} strokeWidth={4} />
          <circle cx={wx} cy={-10} r={20} fill="#3a3632" />
        </g>
      ))}
      {/* snow on roof + hood */}
      <path d="M-150 -188 C-80 -200 80 -200 150 -186 L140 -178 C80 -190 -80 -190 -140 -178 Z" fill="#e2dcd6" />
      {/* light bar */}
      <rect x={-60} y={-214} width={50} height={24} rx={6} fill={red > 0.5 ? '#ff3a2a' : '#5a0d0a'} stroke={INK} strokeWidth={3} />
      <rect x={10} y={-214} width={50} height={24} rx={6} fill={blue > 0.5 ? '#5a8cff' : '#0a1a5a'} stroke={INK} strokeWidth={3} />
      <circle cx={-35} cy={-202} r={260} fill="url(#redGlow)" opacity={red * 0.75} />
      <circle cx={35} cy={-202} r={260} fill="url(#blueGlow)" opacity={blue * 0.75} />
      {/* headlight */}
      <ellipse cx={330} cy={-56} rx={14} ry={18} fill="#ffe9b0" />
      <polygon points="340,-60 900,-160 900,40" fill="#ffe9b0" opacity={0.08} />
    </g>
  );
};

/* ---------------- Stalinist mansion (dacha-palace) ---------------- */
export const Mansion: React.FC<{x: number; y: number; s?: number; f: number; litWindow?: number}> = ({x, y, s = 1, f, litWindow = 1}) => {
  const W2 = 520;
  const fl = 0.85 + 0.15 * (hash(Math.floor(stepF(f, 6) / 6)) > 0.8 ? 0.4 : 1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* main body */}
      <Ink d={`M${-W2} 0 V-520 H${W2} V0 Z`} fill="#46453a" heavy={0} />
      <rect x={-W2} y={-520} width={W2 * 2} height={520} fill="url(#concrete)" />
      <rect x={W2 - 260} y={-520} width={260} height={520} fill="#000" opacity={0.25} />
      <rect x={W2 - 260} y={-520} width={260} height={520} fill="url(#hatch)" opacity={0.18} />
      {/* side wings */}
      <Ink d={`M${-W2 - 260} 0 V-380 H${-W2} V0 Z`} fill="#3d3c32" heavy={0} />
      <Ink d={`M${W2} 0 V-380 H${W2 + 260} V0 Z`} fill="#302f27" heavy={0} hatch="hatch" hatchOp={0.25} />
      {/* cornice + roof */}
      <Ink d={`M${-W2 - 30} -520 H${W2 + 30} V-552 H${-W2 - 30} Z`} fill="#2e2d25" heavy={0} />
      <Ink d={`M${-W2 + 10} -552 L${-W2 + 60} -680 H${W2 - 60} L${W2 - 10} -552 Z`} fill="#24231d" heavy={0} hatch="hatchWide" hatchOp={0.4} />
      <path d={`M${-W2 + 60} -680 H${W2 - 60} L${W2 - 40} -668 H${-W2 + 40} Z`} fill="#ddd7d0" />
      {/* pediment + columns portico */}
      <Ink d="M-230 -560 L0 -700 L230 -560 Z" fill="#3a392f" heavy={0} />
      <path d="M-180 -572 L0 -680 L180 -572 Z" fill="#2c2b24" />
      <circle cx={0} cy={-610} r={26} fill="#2a2921" stroke={INK} strokeWidth={3} />
      <path d="M-14 -610 L0 -628 L14 -610 L0 -594 Z" fill="#7a1a14" />
      {[-190, -110, -30, 30, 110, 190].map((cx) => (
        <g key={cx}>
          <rect x={cx - 18} y={-540} width={36} height={470} fill="#5a5848" stroke={INK} strokeWidth={3} />
          <rect x={cx + 2} y={-540} width={16} height={470} fill="#000" opacity={0.28} />
          <rect x={cx - 26} y={-552} width={52} height={14} fill="#3a392f" stroke={INK} strokeWidth={2.5} />
        </g>
      ))}
      <Ink d="M-250 -70 H250 V-40 H-250 Z" fill="#2c2b24" heavy={0} />
      <Ink d="M-280 -40 H280 V0 H-280 Z" fill="#26251f" heavy={0} />
      {/* door */}
      <rect x={-50} y={-250} width={100} height={180} fill="#130d0a" stroke={INK} strokeWidth={3} />
      <rect x={-50} y={-250} width={100} height={180} fill="#ffb347" opacity={0.12} />
      {/* windows: two floors */}
      {[-470, -400, -330, 330, 400, 470, -720, -650, 650, 720].map((wx, i) =>
        [-430, -230].map((wy, j) => {
          const isLit = i === 3 && j === 0; // the one lit window (crime room)
          const dim = !isLit && hash(i * 7 + j) < 0.18;
          return (
            <g key={`${wx}${wy}`}>
              <rect x={wx - 24} y={wy} width={48} height={110} fill={isLit ? '#ffc35a' : dim ? '#6a4a22' : '#120f0c'} opacity={isLit ? litWindow * fl : 1} stroke={INK} strokeWidth={3} />
              {isLit && <rect x={wx - 120} y={wy - 80} width={240} height={270} fill="url(#warmGlow)" opacity={0.8 * litWindow * fl} />}
              {isLit && <path d={`M${wx - 24} ${wy} H${wx + 24} V${wy + 50} C${wx + 10} ${wy + 30} ${wx - 6} ${wy + 30} ${wx - 24} ${wy + 46} Z`} fill="#7a2a10" opacity={0.6} />}
              <path d={`M${wx - 30} ${wy - 6} H${wx + 30} L${wx + 24} ${wy - 18} H${wx - 24} Z`} fill="#2a2921" stroke={INK} strokeWidth={2} />
              <rect x={wx - 28} y={wy + 108} width={56} height={6} fill="#ddd7d0" />
            </g>
          );
        }),
      )}
      {/* snow on ledges */}
      <rect x={-W2 - 260} y={-386} width={260} height={8} fill="#ddd7d0" />
      <rect x={W2} y={-386} width={260} height={8} fill="#ddd7d0" />
      {/* chimneys with smoke */}
      <rect x={-380} y={-760} width={44} height={110} fill="#22211b" stroke={INK} strokeWidth={3} />
      <rect x={340} y={-740} width={40} height={90} fill="#22211b" stroke={INK} strokeWidth={3} />
      <Smoke f={f} x={-358} y={-770} scale={0.45} color="#2a1716" drift={1.6} n={10} rate={0.3} step={6} />
    </g>
  );
};

/* ---------------- snowy ground ---------------- */
export const SnowGround: React.FC<{x: number; y: number; w: number; h: number; color?: string; shade?: string; tracks?: boolean; seed?: number}> = ({x, y, w, h, color = '#bdb6b2', shade = '#8d8784', tracks = true, seed = 3}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={color} />
    <path d={`M${x} ${y} C${x + w * 0.2} ${y - 14} ${x + w * 0.5} ${y + 10} ${x + w * 0.8} ${y - 8} S${x + w} ${y} ${x + w} ${y} V${y + 30} H${x} Z`} fill={shade} opacity={0.5} />
    {Array.from({length: 30}).map((_, i) => (
      <ellipse key={i} cx={x + hash(i * 3 + seed) * w} cy={y + 20 + hash(i * 5 + seed) * (h - 40)} rx={30 + hash(i) * 120} ry={4 + hash(i * 2) * 8} fill={shade} opacity={0.35} />
    ))}
    {tracks && (
      <g stroke={shade} strokeWidth={10} opacity={0.6} fill="none">
        <path d={`M${x} ${y + h * 0.45} C${x + w * 0.3} ${y + h * 0.4} ${x + w * 0.6} ${y + h * 0.5} ${x + w} ${y + h * 0.42}`} />
        <path d={`M${x} ${y + h * 0.6} C${x + w * 0.3} ${y + h * 0.55} ${x + w * 0.6} ${y + h * 0.65} ${x + w} ${y + h * 0.57}`} />
      </g>
    )}
    {Array.from({length: 40}).map((_, i) => (
      <circle key={`d${i}`} cx={x + hash(i * 9.1 + seed) * w} cy={y + hash(i * 4.7 + seed) * h} r={2 + hash(i) * 4} fill="#2a2420" opacity={0.5} />
    ))}
  </g>
);

export const windSway = (t: number, k = 1) => noise1(t * 0.8) * 4 * k;
export {Line};

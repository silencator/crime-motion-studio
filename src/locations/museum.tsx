import React from 'react';
import {Dust, Ink, Line} from '../kit/fx';
import {hash, stepF} from '../kit/time';
import {IFC} from '../characters/palette';

/** CASE 002 set: a Soviet art museum (exterior, gallery hall, service corridor) + clue inserts. Same ink/gouache language. */
const INK = '#0b0706';
const STONE = {base: '#6b6c6a', lit: '#8a8b86', shade: '#3e4044', deep: '#24262b'};
const GILT = {base: '#b38b3c', lit: '#e2c06a', shade: '#6e521c', deep: '#3e2c0c'};

/* ================================================================== */
/* Paintings                                                            */
/* ================================================================== */
export type ArtKind = 'portrait' | 'landscape' | 'still' | 'sea';
/** Painted canvas content in a 0..w × 0..h box. 'portrait' is THE stolen painting (lady in red). */
export const Art: React.FC<{w: number; h: number; kind: ArtKind}> = ({w, h, kind}) => {
  if (kind === 'portrait')
    return (
      <g>
        <rect width={w} height={h} fill="#2a2a1a" />
        <rect width={w} height={h} fill="url(#hatchFine)" opacity={0.25} />
        <ellipse cx={w * 0.5} cy={h * 0.45} rx={w * 0.55} ry={h * 0.5} fill="#4a4426" opacity={0.6} />
        {/* red dress, shoulders */}
        <path d={`M${w * 0.08} ${h} C${w * 0.1} ${h * 0.72} ${w * 0.3} ${h * 0.6} ${w * 0.5} ${h * 0.6} C${w * 0.7} ${h * 0.6} ${w * 0.9} ${h * 0.72} ${w * 0.92} ${h} Z`} fill="#9c1a16" stroke={INK} strokeWidth={3} />
        <path d={`M${w * 0.5} ${h * 0.6} C${w * 0.7} ${h * 0.6} ${w * 0.9} ${h * 0.72} ${w * 0.92} ${h} L${w * 0.66} ${h} Z`} fill="#5e0d0b" opacity={0.7} />
        {/* neck + face */}
        <path d={`M${w * 0.44} ${h * 0.5} L${w * 0.43} ${h * 0.62} L${w * 0.57} ${h * 0.62} L${w * 0.56} ${h * 0.5} Z`} fill="#c8977a" />
        <ellipse cx={w * 0.5} cy={h * 0.4} rx={w * 0.13} ry={h * 0.13} fill="#dcae8e" stroke={INK} strokeWidth={2.5} />
        <path d={`M${w * 0.5} ${h * 0.27} C${w * 0.6} ${h * 0.27} ${w * 0.64} ${h * 0.36} ${w * 0.62} ${h * 0.46} C${w * 0.58} ${h * 0.36} ${w * 0.54} ${h * 0.32} ${w * 0.5} ${h * 0.32} Z`} fill="#a77a5e" opacity={0.7} />
        {/* dark hair + bun */}
        <path d={`M${w * 0.36} ${h * 0.42} C${w * 0.34} ${h * 0.26} ${w * 0.44} ${h * 0.22} ${w * 0.52} ${h * 0.23} C${w * 0.62} ${h * 0.24} ${w * 0.66} ${h * 0.32} ${w * 0.63} ${h * 0.4} C${w * 0.58} ${h * 0.3} ${w * 0.46} ${h * 0.29} ${w * 0.38} ${h * 0.44} Z`} fill="#1a110c" />
        <circle cx={w * 0.6} cy={h * 0.22} r={w * 0.07} fill="#1a110c" />
        {/* eyes, lips */}
        <path d={`M${w * 0.44} ${h * 0.39} h${w * 0.04} M${w * 0.52} ${h * 0.39} h${w * 0.04}`} stroke={INK} strokeWidth={2.5} />
        <path d={`M${w * 0.47} ${h * 0.47} q${w * 0.03} ${h * 0.012} ${w * 0.06} 0`} stroke="#8a1a16" strokeWidth={4} fill="none" />
        {/* gold necklace */}
        <path d={`M${w * 0.42} ${h * 0.62} Q${w * 0.5} ${h * 0.7} ${w * 0.58} ${h * 0.62}`} stroke="#e2c06a" strokeWidth={4} fill="none" />
        <circle cx={w * 0.5} cy={h * 0.67} r={w * 0.018} fill="#e2c06a" />
        {/* varnish sheen */}
        <path d={`M0 ${h * 0.15} L${w * 0.35} 0 L${w * 0.5} 0 L0 ${h * 0.25} Z`} fill="#fff" opacity={0.05} />
      </g>
    );
  if (kind === 'landscape')
    return (
      <g>
        <rect width={w} height={h * 0.55} fill="#6a7a88" />
        <rect y={h * 0.55} width={w} height={h * 0.45} fill="#cfcac2" />
        <path d={`M0 ${h * 0.55} L${w * 0.2} ${h * 0.42} L${w * 0.38} ${h * 0.5} L${w * 0.6} ${h * 0.36} L${w} ${h * 0.55} Z`} fill="#3a4450" />
        {Array.from({length: 6}).map((_, i) => (
          <path key={i} d={`M${w * (0.1 + i * 0.15)} ${h * 0.75} l${w * 0.02} -${h * 0.12} l${w * 0.02} ${h * 0.12} Z`} fill="#1e2a22" />
        ))}
        <path d={`M0 ${h * 0.85} C${w * 0.3} ${h * 0.8} ${w * 0.6} ${h * 0.92} ${w} ${h * 0.86}`} stroke="#8a8478" strokeWidth={4} fill="none" />
      </g>
    );
  if (kind === 'still')
    return (
      <g>
        <rect width={w} height={h} fill="#2c1e16" />
        <rect y={h * 0.7} width={w} height={h * 0.3} fill="#5a3a22" />
        <path d={`M${w * 0.4} ${h * 0.72} C${w * 0.3} ${h * 0.6} ${w * 0.32} ${h * 0.42} ${w * 0.45} ${h * 0.38} L${w * 0.55} ${h * 0.38} C${w * 0.68} ${h * 0.42} ${w * 0.7} ${h * 0.6} ${w * 0.6} ${h * 0.72} Z`} fill="#3a5a6a" stroke={INK} strokeWidth={3} />
        {[0.38, 0.5, 0.6].map((x, i) => (
          <circle key={i} cx={w * x} cy={h * (0.3 - i * 0.03)} r={w * 0.07} fill={['#c4a23a', '#a32a1a', '#e0d2b0'][i]} stroke={INK} strokeWidth={2} />
        ))}
        <circle cx={w * 0.25} cy={h * 0.76} r={w * 0.06} fill="#c46a2a" stroke={INK} strokeWidth={2} />
      </g>
    );
  return (
    <g>
      <rect width={w} height={h * 0.5} fill="#3a4a5a" />
      <rect y={h * 0.5} width={w} height={h * 0.5} fill="#1e2e3a" />
      {Array.from({length: 7}).map((_, i) => (
        <path key={i} d={`M0 ${h * (0.55 + i * 0.06)} C${w * 0.3} ${h * (0.52 + i * 0.06)} ${w * 0.6} ${h * (0.58 + i * 0.06)} ${w} ${h * (0.54 + i * 0.06)}`} stroke="#8aa0b0" strokeWidth={3} opacity={0.5} fill="none" />
      ))}
      <path d={`M${w * 0.4} ${h * 0.52} L${w * 0.7} ${h * 0.52} L${w * 0.64} ${h * 0.58} L${w * 0.44} ${h * 0.58} Z M${w * 0.55} ${h * 0.52} V${h * 0.2} L${w * 0.68} ${h * 0.46} Z`} fill="#1a120c" />
    </g>
  );
};

/** Heavy carved gilt frame. Inner opening = (x, y, w, h). `bevel` frame width. */
export const GiltFrame: React.FC<{x: number; y: number; w: number; h: number; bevel?: number; children?: React.ReactNode; light?: number}> = ({x, y, w, h, bevel = 44, children, light = 1}) => {
  const b = bevel;
  return (
    <g>
      <rect x={x - b + 14} y={y - b + 18} width={w + b * 2} height={h + b * 2} fill="#000" opacity={0.45} />
      <Ink d={`M${x - b} ${y - b} H${x + w + b} V${y + h + b} H${x - b} Z`} fill={GILT.base} heavy={0} w={3} />
      {/* bevel planes: lit top/left, shaded bottom/right */}
      <path d={`M${x - b} ${y - b} H${x + w + b} L${x + w} ${y} H${x} V${y + h} L${x - b} ${y + h + b} Z`} fill={GILT.lit} opacity={0.55 * light} />
      <path d={`M${x + w + b} ${y + h + b} H${x - b} L${x} ${y + h} H${x + w} V${y} L${x + w + b} ${y - b} Z`} fill={GILT.shade} opacity={0.7} />
      <rect x={x - b * 0.55} y={y - b * 0.55} width={w + b * 1.1} height={h + b * 1.1} fill="none" stroke={GILT.deep} strokeWidth={b * 0.12} opacity={0.8} />
      <rect x={x - b * 0.55} y={y - b * 0.55} width={w + b * 1.1} height={h + b * 1.1} fill="none" stroke="url(#hatchFine)" strokeWidth={b * 0.3} opacity={0.5} />
      {/* corner ornaments */}
      {[
        [x - b * 0.5, y - b * 0.5],
        [x + w + b * 0.5, y - b * 0.5],
        [x - b * 0.5, y + h + b * 0.5],
        [x + w + b * 0.5, y + h + b * 0.5],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={b * 0.42} fill={GILT.base} stroke={INK} strokeWidth={2.5} />
          <circle cx={cx} cy={cy} r={b * 0.2} fill={GILT.lit} stroke={INK} strokeWidth={1.6} />
        </g>
      ))}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={INK} strokeWidth={3} />
      {children && <g transform={`translate(${x} ${y})`}>{children}</g>}
    </g>
  );
};

/** Brass picture light above a painting, with a warm cone. */
const PictureLight: React.FC<{x: number; y: number; w: number; on?: number; f?: number; seed?: number}> = ({x, y, w, on = 1, f = 0, seed = 0}) => {
  const fl = on * (hash(Math.floor(stepF(f, 6) / 6) + seed * 11) > 0.95 ? 0.6 : 1);
  return (
    <g>
      <polygon points={`${x - w * 0.3},${y} ${x + w * 0.3},${y} ${x + w * 0.65},${y + 560} ${x - w * 0.65},${y + 560}`} fill="#ffc06a" opacity={0.1 * fl} />
      <path d={`M${x} ${y - 70} C${x} ${y - 30} ${x} ${y - 20} ${x} ${y - 10}`} stroke="#6e521c" strokeWidth={6} />
      <rect x={x - w * 0.3} y={y - 16} width={w * 0.6} height={22} rx={10} fill={GILT.shade} stroke={INK} strokeWidth={2.5} />
      <rect x={x - w * 0.28} y={y + 2} width={w * 0.56} height={5} fill="#ffd690" opacity={fl} />
    </g>
  );
};

/* ================================================================== */
/* Gallery hall: long wall, pilasters, paintings, the empty frame.    */
/* World x −700..3700, floor line y 1500 (characters' feet ≈ 1700).  */
/* Empty frame centred at x = EMPTY_X.                                 */
/* ================================================================== */
export const EMPTY_X = 2200;
const HANG: {x: number; kind: ArtKind | null; w: number; h: number}[] = [
  {x: -350, kind: 'sea', w: 380, h: 280},
  {x: 400, kind: 'landscape', w: 460, h: 320},
  {x: 1200, kind: 'still', w: 300, h: 380},
  {x: EMPTY_X, kind: null, w: 360, h: 470},
  {x: 3100, kind: 'landscape', w: 420, h: 300},
];

export const GalleryHall: React.FC<{f: number; light?: number; red?: number}> = ({f, light = 1, red = 0}) => (
  <g>
    <defs>
      <pattern id="marble" width={180} height={180} patternUnits="userSpaceOnUse" patternTransform="scale(1 0.42) rotate(45)">
        <rect width={180} height={180} fill="#cbbfa9" />
        <rect width={90} height={90} fill="#1d1a17" />
        <rect x={90} y={90} width={90} height={90} fill="#1d1a17" />
      </pattern>
    </defs>
    {/* ceiling with dark skylight coffers */}
    <rect x={-2000} y={-600} width={7000} height={940} fill="#0d0e10" />
    {Array.from({length: 12}).map((_, i) => (
      <g key={i}>
        <rect x={-1600 + i * 600} y={-200} width={420} height={420} fill="#141a22" stroke={INK} strokeWidth={4} />
        <path d={`M${-1600 + i * 600} 10 H${-1180 + i * 600} M${-1390 + i * 600} -200 V220`} stroke={INK} strokeWidth={4} />
      </g>
    ))}
    {/* cornice */}
    <rect x={-2000} y={300} width={7000} height={46} fill={STONE.shade} stroke={INK} strokeWidth={3} />
    <rect x={-2000} y={300} width={7000} height={12} fill={STONE.lit} opacity={0.5} />
    {/* wall */}
    <rect x={-2000} y={346} width={7000} height={1120} fill={red > 0 ? '#3a2422' : '#33413a'} />
    <rect x={-2000} y={346} width={7000} height={1120} fill="url(#hatchWide)" opacity={0.08} />
    {/* pilasters */}
    {[-750, 0, 800, 1700, 2700, 3500].map((x) => (
      <g key={x}>
        <rect x={x - 50} y={346} width={100} height={1120} fill={STONE.base} stroke={INK} strokeWidth={3} />
        <rect x={x + 10} y={346} width={40} height={1120} fill={STONE.shade} opacity={0.75} />
        <path d={`M${x - 25} 400 V1420 M${x} 400 V1420 M${x + 25} 400 V1420`} stroke={INK} strokeWidth={2} opacity={0.35} />
        <rect x={x - 66} y={346} width={132} height={34} fill={STONE.lit} stroke={INK} strokeWidth={3} />
        <rect x={x - 66} y={1420} width={132} height={46} fill={STONE.shade} stroke={INK} strokeWidth={3} />
      </g>
    ))}
    {/* paintings + lights */}
    {HANG.map((p, i) => {
      const y = 900 - p.h / 2;
      return (
        <g key={i}>
          <PictureLight x={p.x} y={y - 90} w={p.w} on={light} f={f} seed={i} />
          {p.kind ? (
            <GiltFrame x={p.x - p.w / 2} y={y} w={p.w} h={p.h} bevel={34}>
              <Art w={p.w} h={p.h} kind={p.kind} />
            </GiltFrame>
          ) : (
            <GiltFrame x={p.x - p.w / 2} y={y} w={p.w} h={p.h} bevel={40}>
              <CutCanvas w={p.w} h={p.h} />
            </GiltFrame>
          )}
          <rect x={p.x - 40} y={y + p.h + 80} width={80} height={30} fill={GILT.shade} stroke={INK} strokeWidth={2} />
        </g>
      );
    })}
    {/* police tape across the empty frame */}
    <g transform={`translate(${EMPTY_X - 330} 1080) rotate(-12)`}>
      <rect width={660} height={36} fill="#e8c21e" stroke={INK} strokeWidth={3} />
      {Array.from({length: 10}).map((_, i) => (
        <path key={i} d={`M${20 + i * 66} 0 l26 0 l-20 36 l-26 0 Z`} fill={INK} opacity={0.85} />
      ))}
    </g>
    {/* dado + skirting */}
    <rect x={-2000} y={1466} width={7000} height={34} fill="#1d1612" stroke={INK} strokeWidth={3} />
    {/* marble checker floor */}
    <rect x={-2000} y={1500} width={7000} height={900} fill="url(#marble)" />
    <rect x={-2000} y={1500} width={7000} height={900} fill="#000" opacity={0.35} />
    <rect x={-2000} y={1500} width={7000} height={60} fill="#000" opacity={0.5} />
    {/* reflections of the picture lights */}
    {HANG.map((p, i) => (
      <ellipse key={i} cx={p.x} cy={1640} rx={p.w * 0.6} ry={50} fill="#ffc06a" opacity={0.12 * light} />
    ))}
    {/* bench + rope stanchions */}
    <g>
      <rect x={1080} y={1590} width={340} height={40} fill="#3a2414" stroke={INK} strokeWidth={3} />
      <rect x={1100} y={1630} width={20} height={70} fill="#1a110b" />
      <rect x={1380} y={1630} width={20} height={70} fill="#1a110b" />
    </g>
    {[EMPTY_X - 380, EMPTY_X + 380].map((x) => (
      <g key={x}>
        <rect x={x - 8} y={1480} width={16} height={190} fill={GILT.base} stroke={INK} strokeWidth={2.5} />
        <ellipse cx={x} cy={1672} rx={40} ry={10} fill={GILT.shade} stroke={INK} strokeWidth={2} />
        <circle cx={x} cy={1478} r={14} fill={GILT.lit} stroke={INK} strokeWidth={2} />
      </g>
    ))}
    <path d={`M${EMPTY_X - 372} 1490 C${EMPTY_X - 200} 1590 ${EMPTY_X + 200} 1590 ${EMPTY_X + 372} 1490`} stroke="#6a0f12" strokeWidth={14} fill="none" />
    {/* evidence marker */}
    <g transform={`translate(${EMPTY_X + 60} 1600)`}>
      <path d="M-30 30 L0 -20 L30 30 Z" fill="#e8c21e" stroke={INK} strokeWidth={3} />
      <text x={0} y={24} textAnchor="middle" fontFamily="IFStamp" fontSize={30} fill={INK}>
        1
      </text>
    </g>
  </g>
);

/** Inside of a frame whose canvas was cut out: dark backing board + ragged canvas strips on the edges. */
export const CutCanvas: React.FC<{w: number; h: number}> = ({w, h}) => {
  /** Ragged strip along one edge: points from the edge inward by depth d (jittered). */
  const strip = (edge: 'top' | 'bottom' | 'left' | 'right', d: number, seed: number) => {
    const horiz = edge === 'top' || edge === 'bottom';
    const len = horiz ? w : h;
    const n = Math.ceil(len / 14);
    const pts: string[] = [];
    for (let i = n; i >= 0; i--) {
      const t = Math.min(len, i * 14);
      const k = d * (0.35 + hash(i * 1.7 + seed) * 0.9);
      if (edge === 'top') pts.push(`${t},${k}`);
      if (edge === 'bottom') pts.push(`${t},${h - k}`);
      if (edge === 'left') pts.push(`${k},${t}`);
      if (edge === 'right') pts.push(`${w - k},${t}`);
    }
    const base = edge === 'top' ? `0,0 ${w},0` : edge === 'bottom' ? `0,${h} ${w},${h}` : edge === 'left' ? `0,0 0,${h}` : `${w},0 ${w},${h}`;
    // base runs 0→len, jag runs len→0: one closed polygon
    return `${base} ${pts.join(' ')}`;
  };
  return (
    <g>
      <rect width={w} height={h} fill="#1c140e" />
      <rect width={w} height={h} fill="url(#hatchV)" opacity={0.35} />
      <path d={`M${w * 0.1} ${h * 0.2} H${w * 0.9} M${w * 0.1} ${h * 0.8} H${w * 0.9}`} stroke="#2e2218" strokeWidth={10} />
      <polygon points={strip('left', w * 0.05, 5)} fill="#3a3620" stroke={INK} strokeWidth={2} />
      <polygon points={strip('right', w * 0.05, 9)} fill="#3a3620" stroke={INK} strokeWidth={2} />
      <polygon points={strip('top', h * 0.04, 1)} fill="#4a4426" stroke={INK} strokeWidth={2} />
      {/* bits of the red dress left along the bottom */}
      <polygon points={strip('bottom', h * 0.05, 2)} fill="#8a1814" stroke={INK} strokeWidth={2} />
    </g>
  );
};

/** Hook close-up: the cut-out frame on the gallery wall, brass plaque, tape. World ≈ 1080×1920. */
export const EmptyFrameWall: React.FC<{f: number}> = ({f}) => (
  <g>
    <rect x={-400} y={-400} width={1900} height={2800} fill="#2f3b35" />
    <rect x={-400} y={-400} width={1900} height={2800} fill="url(#wallpaper)" opacity={0.6} />
    <rect x={-400} y={-400} width={1900} height={2800} fill="url(#hatchWide)" opacity={0.08} />
    {/* faded, cleaner rectangle of wall around where the frame always hung */}
    <rect x={110} y={380} width={860} height={1080} fill="#3a4740" opacity={0.6} />
    <PictureLight x={540} y={270} w={700} on={0.4} f={f} />
    <GiltFrame x={200} y={470} w={680} h={900} bevel={80}>
      <CutCanvas w={680} h={900} />
    </GiltFrame>
    {/* brass plaque */}
    <g>
      <rect x={400} y={1530} width={280} height={110} fill={GILT.base} stroke={INK} strokeWidth={3} />
      <rect x={412} y={1542} width={256} height={86} fill="none" stroke={GILT.shade} strokeWidth={2} />
      {[1568, 1590, 1612].map((y, i) => (
        <rect key={y} x={430} y={y} width={i === 0 ? 220 : i === 1 ? 160 : 190} height={8} fill={GILT.deep} opacity={0.8} />
      ))}
    </g>
    {/* tape across the lower corner */}
    <g transform="translate(-120 1500) rotate(-16)">
      <rect width={1400} height={70} fill="#e8c21e" stroke={INK} strokeWidth={4} />
      {Array.from({length: 18}).map((_, i) => (
        <path key={i} d={`M${30 + i * 80} 0 l40 0 l-30 70 l-40 0 Z`} fill={INK} opacity={0.85} />
      ))}
    </g>
    <Dust f={f} x={60} y={300} w={960} h={1300} n={50} color="#e6eefc" />
  </g>
);

/* ================================================================== */
/* Service corridor + back door. World x −400..2700, floor y 1500.   */
/* Back door centred at x = DOOR_X; radiator hiding spot at x ≈ 1380. */
/* ================================================================== */
export const DOOR_X = 1900;
export const BackCorridor: React.FC<{f: number; light?: number}> = ({f, light = 1}) => {
  const fl = light * (hash(Math.floor(stepF(f, 4) / 4) * 1.3) > 0.82 ? 0.25 : 1);
  return (
    <g>
      <rect x={-1500} y={-600} width={6000} height={940} fill="#0a0c0b" />
      {/* whitewashed upper wall, green-painted lower wall */}
      <rect x={-1500} y={330} width={6000} height={720} fill="#77786a" />
      <rect x={-1500} y={330} width={6000} height={720} fill="url(#concrete)" />
      <rect x={-1500} y={1050} width={6000} height={450} fill="#2c4638" stroke={INK} strokeWidth={3} />
      <rect x={-1500} y={1046} width={6000} height={10} fill="#1a2a22" />
      {/* damp stains + peeled paint */}
      {Array.from({length: 9}).map((_, i) => (
        <ellipse key={i} cx={-1200 + i * 480 + hash(i) * 200} cy={500 + hash(i * 3) * 400} rx={60 + hash(i * 5) * 120} ry={40 + hash(i * 7) * 90} fill="#3e3a2e" opacity={0.35} />
      ))}
      {/* pipes along the ceiling */}
      {[400, 455].map((y, j) => (
        <g key={y}>
          <rect x={-1500} y={y - 16 + j * 4} width={6000} height={30 - j * 8} fill="#3a3a34" stroke={INK} strokeWidth={3} />
          <rect x={-1500} y={y - 14 + j * 4} width={6000} height={6} fill="#8a8a7a" opacity={0.5} />
        </g>
      ))}
      {Array.from({length: 12}).map((_, i) => (
        <rect key={i} x={-1300 + i * 450} y={370} width={18} height={110} fill="#1c1c18" />
      ))}
      {/* caged bulbs */}
      {[200, 1100].map((x, i) => {
        const on = i === 1 ? fl : light * 0.8;
        return (
          <g key={x}>
            <circle cx={x} cy={560} r={360} fill="url(#warmGlow)" opacity={0.45 * on} />
            <rect x={x - 4} y={470} width={8} height={50} fill={INK} />
            <circle cx={x} cy={545} r={24} fill={on > 0.5 ? '#ffd690' : '#5a4a30'} stroke={INK} strokeWidth={3} />
            <path d={`M${x - 26} 535 H${x + 26} M${x - 22} 555 H${x + 22} M${x} 520 V572`} stroke={INK} strokeWidth={3} />
          </g>
        );
      })}
      {/* mop bucket + crates */}
      <Ink d="M300 1500 L320 1380 H460 L480 1500 Z" fill="#5a5f58" heavy={2} />
      <path d="M380 1390 L350 900" stroke="#6a4a2a" strokeWidth={12} />
      <Ink d="M560 1500 V1250 H880 V1500 Z" fill="#5a4026" hatch="hatchV" hatchOp={0.3} />
      <Ink d="M620 1250 V1060 H860 V1250 Z" fill="#4a341f" hatch="hatchV" hatchOp={0.3} />
      <path d="M560 1375 H880 M620 1155 H860" stroke={INK} strokeWidth={3} />
      {/* radiator (the hiding spot) with the wrapped roll behind it */}
      <g>
        <path d="M1330 1180 L1342 1120 C1346 1100 1370 1100 1376 1120 L1388 1190 Z" fill="#8a8272" stroke={INK} strokeWidth={3} />
        <path d="M1340 1130 L1384 1150 M1338 1155 L1386 1172" stroke="#5a5448" strokeWidth={3} />
        <Ink d="M1240 1460 V1190 H1560 V1460 Z" fill="#4a4e48" heavy={3} />
        {Array.from({length: 11}).map((_, i) => (
          <rect key={i} x={1252 + i * 28} y={1200} width={18} height={250} rx={8} fill="#3a3e38" stroke={INK} strokeWidth={2} />
        ))}
        <path d="M1560 1300 H1620 V1060" stroke="#3a3a34" strokeWidth={16} fill="none" />
      </g>
      {/* the back door */}
      <g>
        <rect x={DOOR_X - 200} y={540} width={400} height={960} fill="#14140f" stroke={INK} strokeWidth={6} />
        <Ink d={`M${DOOR_X - 180} 1500 V570 H${DOOR_X + 180} V1500 Z`} fill="#3d443c" hatch="hatch" hatchOp={0.15} heavy={0} />
        {Array.from({length: 2}).map((_, j) =>
          Array.from({length: 9}).map((_, i) => <circle key={`${i}${j}`} cx={DOOR_X - 160 + j * 320} cy={600 + i * 104} r={5} fill="#22261f" stroke={INK} strokeWidth={1.5} />),
        )}
        {/* wired window: cold blue snowy night outside */}
        <rect x={DOOR_X - 70} y={660} width={140} height={170} fill="#22385a" stroke={INK} strokeWidth={5} />
        <rect x={DOOR_X - 70} y={660} width={140} height={170} fill="url(#chainlink)" opacity={0.5} />
        {Array.from({length: 7}).map((_, i) => (
          <circle key={i} cx={DOOR_X - 60 + hash(i * 3 + Math.floor(f / 8)) * 120} cy={670 + ((hash(i * 7) * 160 + stepF(f, 4) * 0.8) % 150)} r={3} fill="#e6eefc" opacity={0.8} />
        ))}
        <polygon points={`${DOOR_X - 70},830 ${DOOR_X + 70},830 ${DOOR_X + 260},1500 ${DOOR_X - 220},1500`} fill="#6a9ad6" opacity={0.08} />
        {/* push bar + kick plate */}
        <rect x={DOOR_X - 150} y={1010} width={300} height={34} rx={8} fill="#8a8a7a" stroke={INK} strokeWidth={3} />
        <rect x={DOOR_X - 180} y={1380} width={360} height={110} fill="#2c312b" stroke={INK} strokeWidth={3} />
        {/* cold light under the door */}
        <rect x={DOOR_X - 180} y={1494} width={360} height={6} fill="#9fc4ff" opacity={0.9} />
        {/* exit sign */}
        <circle cx={DOOR_X} cy={470} r={190} fill="url(#redGlow)" opacity={0.5 * light} />
        <rect x={DOOR_X - 90} y={440} width={180} height={60} fill="#5a0d0a" stroke={INK} strokeWidth={3} />
        <text x={DOOR_X} y={486} textAnchor="middle" fontFamily="IFStamp" fontSize={40} fill="#ff5a3a" letterSpacing={4}>
          ВЫХОД
        </text>
      </g>
      {/* concrete floor + drain */}
      <rect x={-1500} y={1500} width={6000} height={900} fill="#2a2a25" />
      <rect x={-1500} y={1500} width={6000} height={900} fill="url(#concrete)" />
      <rect x={-1500} y={1500} width={6000} height={40} fill="#000" opacity={0.55} />
      <ellipse cx={DOOR_X} cy={1580} rx={380} ry={40} fill="#9fc4ff" opacity={0.08} />
      {/* wet footprints leading to the radiator */}
      {Array.from({length: 6}).map((_, i) => (
        <ellipse key={i} cx={DOOR_X - 140 - i * 90} cy={1600 + (i % 2) * 40} rx={26} ry={10} fill="#4a5860" opacity={0.5} />
      ))}
    </g>
  );
};

/**
 * Reveal insert: the rolled canvas hidden behind the radiator, unrolled by IF's gloved hand.
 * unroll 0..1, world ≈ 1080×1920.
 */
export const HiddenCanvas: React.FC<{f: number; unroll: number; cloth: number}> = ({f, unroll, cloth}) => {
  const W = 620;
  const H = 820;
  const shown = H * unroll;
  const x0 = 230;
  const y0 = 520;
  return (
    <g>
      <rect x={-400} y={-400} width={1900} height={2800} fill="#2c4638" />
      <rect x={-400} y={-400} width={1900} height={2800} fill="url(#concrete)" />
      <rect x={-400} y={1640} width={1900} height={800} fill="#22221e" />
      <rect x={-400} y={1640} width={1900} height={30} fill="#000" opacity={0.5} />
      {/* radiator fins behind */}
      {Array.from({length: 14}).map((_, i) => (
        <rect key={i} x={-100 + i * 90} y={1140} width={60} height={500} rx={24} fill="#3a3e38" stroke={INK} strokeWidth={3} />
      ))}
      <rect x={-140} y={1110} width={1400} height={40} fill="#4a4e48" stroke={INK} strokeWidth={3} />
      {/* grey cloth that wrapped it, slipping off */}
      <g transform={`translate(${-cloth * 260} ${cloth * 240}) rotate(${-cloth * 12} ${x0} ${y0})`} opacity={1 - cloth * 0.15}>
        <Ink d={`M${x0 - 70} ${y0 - 70} C${x0 + 200} ${y0 - 110} ${x0 + W} ${y0 - 80} ${x0 + W + 60} ${y0 - 40} C${x0 + W + 40} ${y0 + 120} ${x0 + W - 60} ${y0 + 300} ${x0 + W - 200} ${y0 + 360} C${x0 + 300} ${y0 + 320} ${x0 + 60} ${y0 + 320} ${x0 - 90} ${y0 + 260} C${x0 - 120} ${y0 + 140} ${x0 - 110} ${y0} ${x0 - 70} ${y0 - 70} Z`} fill="#7a786e" hatch="hatchX" hatchOp={0.3} />
        <path d={`M${x0} ${y0 - 40} C${x0 + 150} ${y0 + 80} ${x0 + 300} ${y0 + 120} ${x0 + W - 120} ${y0 + 300} M${x0 + 200} ${y0 - 70} C${x0 + 260} ${y0 + 40} ${x0 + 420} ${y0 + 90} ${x0 + W} ${y0 + 80}`} stroke="#4a4840" strokeWidth={4} fill="none" />
      </g>
      {/* unrolled part of the canvas (THE portrait) */}
      <clipPath id="unrolled">
        <rect x={x0} y={y0} width={W} height={Math.max(1, shown)} />
      </clipPath>
      <g clipPath="url(#unrolled)">
        <rect x={x0 + 14} y={y0 + 18} width={W} height={H} fill="#000" opacity={0.5} />
        <g transform={`translate(${x0} ${y0})`}>
          <Art w={W} h={H} kind="portrait" />
          <rect width={W} height={H} fill="none" stroke="#d8cdb6" strokeWidth={10} />
        </g>
      </g>
      {/* ragged cut edge at the bottom of what's shown */}
      {unroll > 0.02 && (
        <path d={`M${x0} ${y0 + shown} ${Array.from({length: 23}).map((_, i) => `L${x0 + i * (W / 22)} ${y0 + shown + (hash(i * 3.3) - 0.5) * 10}`).join(' ')}`} stroke="#d8cdb6" strokeWidth={6} fill="none" />
      )}
      {/* the roll itself (top) */}
      <Ink d={`M${x0 - 30} ${y0 - 46} H${x0 + W + 30} C${x0 + W + 56} ${y0 - 46} ${x0 + W + 56} ${y0 + 46} ${x0 + W + 30} ${y0 + 46} H${x0 - 30} C${x0 - 56} ${y0 + 46} ${x0 - 56} ${y0 - 46} ${x0 - 30} ${y0 - 46} Z`} fill="#d8cdb6" hatch="hatchFine" hatchOp={0.2} />
      <path d={`M${x0 - 30} ${y0 + 20} H${x0 + W + 30}`} stroke="#8a1814" strokeWidth={10} opacity={0.7} />
      <ellipse cx={x0 + W + 30} cy={y0} rx={24} ry={46} fill="#b8ad96" stroke={INK} strokeWidth={3} />
      <path d={`M${x0 + W + 30} ${y0 - 30} a14 30 0 1 1 0 60 a8 18 0 1 1 0 -36`} stroke="#8a7e66" strokeWidth={3} fill="none" />
      {/* IF's gloved hand pulling the bottom edge down */}
      {unroll > 0.05 && (
        <g transform={`translate(${x0 + W * 0.62} ${y0 + shown + 6}) rotate(-8)`}>
          <path d="M-60 -10 C-30 -40 50 -40 80 -10 L90 80 C40 110 -30 110 -70 80 Z" fill={IFC.glove} stroke={INK} strokeWidth={4} />
          <path d="M-50 -14 C-40 -40 -10 -44 0 -30 M0 -30 C10 -48 40 -48 46 -28 M46 -28 C56 -40 76 -34 76 -16" stroke={INK} strokeWidth={3} fill="none" />
          <path d="M80 -10 L90 80 C70 92 50 96 30 98" fill={IFC.gloveShade} opacity={0.7} />
          <path d="M-70 80 L-90 260 H110 L90 80 Z" fill={IFC.coat} stroke={INK} strokeWidth={4} />
          <path d="M-74 110 H96" stroke={IFC.coatShade} strokeWidth={14} />
        </g>
      )}
    </g>
  );
};

/* ================================================================== */
/* Night log (ledger insert): circle = red pencil around NONE.        */
/* ================================================================== */
export const NightLog: React.FC<{f: number; circle?: number}> = ({circle = 0}) => {
  const rows: [string, string][] = [
    ['22:00', 'SHIFT START'],
    ['00:00', 'ROUND — ALL CLEAR'],
    ['02:00', 'ROUND — ALL CLEAR'],
    ['04:00', 'ROUND — ALL CLEAR'],
    ['06:00', 'ROUND — ALL CLEAR'],
  ];
  return (
    <g>
      <rect x={-300} y={-300} width={1700} height={2600} fill="#1a1512" />
      <rect x={-300} y={-300} width={1700} height={2600} fill="url(#hatchWide)" opacity={0.25} />
      <g transform="rotate(4 540 960)">
        <rect x={90} y={300} width={920} height={1320} fill="#000" opacity={0.55} transform="translate(20 26)" />
        <Ink d="M90 300 H1010 V1620 H90 Z" fill="#d6cbb2" heavy={0} w={3} />
        <rect x={90} y={300} width={920} height={1320} fill="url(#concrete)" opacity={0.35} />
        {/* binding shadow + red margin */}
        <rect x={90} y={300} width={60} height={1320} fill="#000" opacity={0.18} />
        <line x1={250} y1={300} x2={250} y2={1620} stroke="#b02a22" strokeWidth={3} opacity={0.7} />
        {Array.from({length: 15}).map((_, i) => (
          <line key={i} x1={110} y1={480 + i * 76} x2={990} y2={480 + i * 76} stroke="#7a8aa0" strokeWidth={2} opacity={0.5} />
        ))}
        <text x={280} y={420} fontFamily="IFType" fontSize={48} fill="#1a120c">
          NIGHT LOG — 23.11
        </text>
        {rows.map(([t, v], i) => (
          <g key={t}>
            <text x={120} y={540 + i * 152} fontFamily="IFType" fontSize={36} fill="#4a3a2a">
              {t}
            </text>
            <text x={280} y={540 + i * 152} fontFamily="IFType" fontSize={40} fill="#1a120c">
              {v}
            </text>
          </g>
        ))}
        <text x={120} y={1330} fontFamily="IFType" fontSize={38} fill="#4a3a2a">
          ENTRIES:
        </text>
        <text x={340} y={1330} fontFamily="IFType" fontSize={60} fill="#1a120c">
          NONE
        </text>
        {/* guard's signature scribble */}
        <path d="M620 1480 C650 1430 680 1500 700 1450 C720 1410 740 1500 770 1440 C790 1410 810 1470 860 1450" stroke="#1d2a4a" strokeWidth={4} fill="none" />
        {circle > 0 && (
          <path
            d="M310 1290 C360 1240 560 1250 580 1300 C600 1360 420 1370 330 1350 C280 1330 290 1300 330 1280"
            fill="none"
            stroke="#d01c14"
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={900}
            strokeDashoffset={900 * (1 - circle)}
          />
        )}
      </g>
    </g>
  );
};

/* ================================================================== */
/* Museum exterior facade (neoclassical, Soviet). Ground at y = 0.     */
/* ~2200 wide incl. wings (x −1100..1100), pediment apex ≈ y −1080.   */
/* ================================================================== */
export const MuseumFacade: React.FC<{x: number; y: number; s?: number; f: number; doorLight?: number}> = ({x, y, s = 1, f, doorLight = 1}) => {
  const cols = Array.from({length: 8}).map((_, i) => -560 + i * 160);
  const fl = doorLight * (0.9 + 0.1 * hash(Math.floor(stepF(f, 6) / 6)));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* wings */}
      {[-1, 1].map((sx) => (
        <g key={sx}>
          <Ink d={`M${sx * 700} 0 V-640 H${sx * 1120} V0 Z`} fill={sx < 0 ? STONE.base : STONE.shade} heavy={0} />
          <rect x={Math.min(sx * 700, sx * 1120)} y={-640} width={420} height={640} fill="url(#concrete)" />
          <rect x={Math.min(sx * 700, sx * 1120) - 10} y={-676} width={440} height={36} fill={STONE.deep} stroke={INK} strokeWidth={3} />
          <rect x={Math.min(sx * 700, sx * 1120) - 10} y={-684} width={440} height={10} fill="#e6e0da" />
          {[0, 1, 2].map((k) =>
            [-520, -260].map((wy) => {
              const wx = sx * (780 + k * 120);
              const lit = sx > 0 && k === 2 && wy === -260;
              return (
                <g key={`${k}${wy}`}>
                  <rect x={wx - 30} y={wy} width={60} height={150} fill={lit ? '#ffc35a' : '#0d1016'} stroke={INK} strokeWidth={3} opacity={lit ? fl : 1} />
                  {lit && <circle cx={wx} cy={wy + 75} r={130} fill="url(#warmGlow)" opacity={0.7 * fl} />}
                  <rect x={wx - 36} y={wy + 150} width={72} height={8} fill="#e6e0da" />
                </g>
              );
            }),
          )}
        </g>
      ))}
      {/* recessed portico wall */}
      <rect x={-680} y={-780} width={1360} height={600} fill="#2a2d33" />
      <rect x={-680} y={-780} width={1360} height={600} fill="url(#hatch)" opacity={0.2} />
      {/* big bronze doors, warm light in the gap */}
      <rect x={-110} y={-500} width={220} height={320} fill="#1a1410" stroke={INK} strokeWidth={4} />
      <rect x={-100} y={-490} width={96} height={300} fill="#3a2a18" stroke={INK} strokeWidth={3} />
      <rect x={4} y={-490} width={96} height={300} fill="#33240f" stroke={INK} strokeWidth={3} />
      <rect x={-4} y={-490} width={8} height={300} fill="#ffc35a" opacity={fl} />
      <circle cx={0} cy={-300} r={200} fill="url(#warmGlow)" opacity={0.45 * fl} />
      {/* tall dark windows between columns */}
      {[-400, -240, 240, 400].map((wx) => (
        <rect key={wx} x={wx - 32} y={-640} width={64} height={260} fill="#0d1016" stroke={INK} strokeWidth={3} />
      ))}
      {/* banners */}
      {[-320, 320].map((bx) => (
        <g key={bx}>
          <rect x={bx - 40} y={-740} width={80} height={330} fill="#7a1612" stroke={INK} strokeWidth={3} />
          <rect x={bx - 26} y={-700} width={52} height={70} fill="none" stroke="#c9a24a" strokeWidth={3} />
          <path d={`M${bx - 40} -410 L${bx} -380 L${bx + 40} -410`} fill="#7a1612" stroke={INK} strokeWidth={3} />
        </g>
      ))}
      {/* columns */}
      {cols.map((cx) => (
        <g key={cx}>
          <rect x={cx - 30} y={-780} width={60} height={600} fill={STONE.lit} stroke={INK} strokeWidth={3} />
          <rect x={cx + 6} y={-780} width={24} height={600} fill={STONE.shade} opacity={0.7} />
          <path d={`M${cx - 14} -770 V-190 M${cx} -770 V-190 M${cx + 14} -770 V-190`} stroke={INK} strokeWidth={1.6} opacity={0.35} />
          <rect x={cx - 40} y={-800} width={80} height={26} fill={STONE.base} stroke={INK} strokeWidth={3} />
          <rect x={cx - 40} y={-196} width={80} height={20} fill={STONE.base} stroke={INK} strokeWidth={3} />
        </g>
      ))}
      {/* entablature + frieze lettering */}
      <Ink d="M-720 -800 H720 V-900 H-720 Z" fill={STONE.base} heavy={0} />
      <rect x={-720} y={-800} width={1440} height={100} fill="url(#concrete)" />
      <text x={0} y={-832} textAnchor="middle" fontFamily="IFStamp" fontSize={64} letterSpacing={22} fill="#2a2a28" opacity={0.85}>
        МУЗЕЙ ИСКУССТВ
      </text>
      <Ink d="M-760 -900 H760 V-936 H-760 Z" fill={STONE.shade} heavy={0} />
      <rect x={-760} y={-944} width={1520} height={12} fill="#e6e0da" />
      {/* pediment */}
      <Ink d="M-740 -936 L0 -1140 L740 -936 Z" fill={STONE.base} heavy={0} />
      <path d="M-640 -950 L0 -1110 L640 -950 Z" fill={STONE.shade} />
      <path d="M-740 -936 L0 -1140 L740 -936" stroke="#e6e0da" strokeWidth={10} fill="none" />
      {/* star in a wreath */}
      <g transform="translate(0 -1010)">
        <circle r={48} fill="none" stroke={STONE.lit} strokeWidth={8} strokeDasharray="10 8" />
        <path d="M0 -34 L9 -10 L34 -10 L14 6 L22 30 L0 15 L-22 30 L-14 6 L-34 -10 L-9 -10 Z" fill="#8a1a14" stroke={INK} strokeWidth={2.5} />
      </g>
      {/* steps with snow on each tread */}
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const w = 1440 - k * 50;
        const yy = -k * 30;
        return (
          <g key={k}>
            <rect x={-w / 2} y={yy - 30} width={w} height={30} fill={k % 2 ? STONE.base : STONE.shade} stroke={INK} strokeWidth={2.5} />
            <rect x={-w / 2} y={yy - 30} width={w} height={8} fill="#e6e0da" opacity={0.9} />
          </g>
        );
      })}
      {/* Line kept for parity with other sets */}
      <Line d="M-720 -178 H720" w={3} />
    </g>
  );
};

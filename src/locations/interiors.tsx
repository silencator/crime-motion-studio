import React from 'react';
import {Dust, Ink, Line} from '../kit/fx';
import {hash, stepF} from '../kit/time';

const INK = '#0b0706';

/* ------------------------------------------------------------------ */
/* Mansion corridor: wallpaper, wainscot, sconces, portraits, taped door */
/* World: x −200..2900, floor line y ≈ 1500. Door at x ≈ 2350.          */
/* ------------------------------------------------------------------ */
export const Sconce: React.FC<{x: number; y: number; f: number; on?: number; seed?: number}> = ({x, y, f, on = 1, seed = 0}) => {
  const fl = on * (hash(Math.floor(stepF(f, 5) / 5) + seed * 13) > 0.93 ? 0.55 : 1);
  return (
    <g>
      <circle cx={x} cy={y} r={300} fill="url(#warmGlow)" opacity={0.55 * fl} />
      <path d={`M${x - 8} ${y + 60} H${x + 8} V${y + 10} H${x - 8} Z`} fill="#3a2a14" stroke={INK} strokeWidth={2.5} />
      <path d={`M${x - 26} ${y + 14} L${x - 18} ${y - 36} H${x + 18} L${x + 26} ${y + 14} Z`} fill={fl > 0.6 ? '#ffd08a' : '#b07a3a'} stroke={INK} strokeWidth={3} />
      <path d={`M${x - 30} ${y + 70} C${x - 10} ${y + 90} ${x + 10} ${y + 90} ${x + 30} ${y + 70}`} stroke="#6a4a1a" strokeWidth={6} fill="none" />
    </g>
  );
};

export const Corridor: React.FC<{f: number; doorTape?: boolean; light?: number}> = ({f, doorTape = true, light = 1}) => (
  <g>
    {/* ceiling */}
    <rect x={-1200} y={-400} width={5200} height={760} fill="#0f0d0b" />
    <rect x={-1200} y={330} width={5200} height={40} fill="#2a241c" stroke={INK} strokeWidth={3} />
    {/* wallpaper */}
    <rect x={-1200} y={370} width={5200} height={760} fill="#2d3a31" />
    <rect x={-1200} y={370} width={5200} height={760} fill="url(#wallpaper)" />
    <rect x={-1200} y={370} width={5200} height={760} fill="url(#hatchWide)" opacity={0.12} />
    {/* wainscot */}
    <rect x={-1200} y={1130} width={5200} height={370} fill="#2a1a12" stroke={INK} strokeWidth={3} />
    <rect x={-1200} y={1120} width={5200} height={18} fill="#4a3020" stroke={INK} strokeWidth={2} />
    {Array.from({length: 26}).map((_, i) => (
      <rect key={i} x={-1150 + i * 200} y={1170} width={160} height={290} fill="none" stroke={INK} strokeWidth={3} opacity={0.6} />
    ))}
    {/* portraits */}
    {[-650, 330, 1030, 1730].map((x, i) => (
      <g key={x}>
        <rect x={x - 110} y={520} width={220} height={290} fill="#5a4320" stroke={INK} strokeWidth={4} />
        <rect x={x - 92} y={538} width={184} height={254} fill="#1c1612" />
        <ellipse cx={x} cy={640} rx={42} ry={54} fill="#3a2c22" />
        <path d={`M${x - 80} 790 C${x - 60} 700 ${x + 60} 700 ${x + 80} 790 Z`} fill="#241a14" />
        {i === 2 && <path d={`M${x - 92} 538 L${x + 92} 792`} stroke="#000" strokeWidth={3} opacity={0.4} />}
      </g>
    ))}
    {/* sconces between people */}
    {[-300, 680, 1380, 2080, 2700].map((x, i) => (
      <Sconce key={x} x={x} y={700} f={f + i * 7} on={light} seed={i} />
    ))}
    {/* the door (crime scene) */}
    <g>
      <rect x={2200} y={420} width={330} height={1080} fill="#1a110b" stroke={INK} strokeWidth={5} />
      <rect x={2215} y={440} width={145} height={1050} fill="#3a2414" stroke={INK} strokeWidth={3} />
      <rect x={2370} y={440} width={145} height={1050} fill="#331f12" stroke={INK} strokeWidth={3} />
      {[2240, 2395].map((x) => (
        <g key={x}>
          <rect x={x} y={480} width={95} height={380} fill="none" stroke={INK} strokeWidth={3} />
          <rect x={x} y={920} width={95} height={480} fill="none" stroke={INK} strokeWidth={3} />
        </g>
      ))}
      <circle cx={2348} cy={980} r={10} fill="#b8964e" stroke={INK} strokeWidth={2} />
      <circle cx={2382} cy={980} r={10} fill="#b8964e" stroke={INK} strokeWidth={2} />
      {/* cold light leaking under the door */}
      <rect x={2215} y={1490} width={300} height={10} fill="#9fc4ff" opacity={0.85} />
      <polygon points="2215,1500 2515,1500 2700,1640 2030,1640" fill="#9fc4ff" opacity={0.12} />
      {doorTape && (
        <g>
          <Tape x1={2150} y1={700} x2={2580} y2={1000} />
          <Tape x1={2150} y1={1020} x2={2580} y2={760} />
        </g>
      )}
    </g>
    {/* floor */}
    <rect x={-1200} y={1500} width={5200} height={700} fill="#24170f" />
    <rect x={-1200} y={1500} width={5200} height={700} fill="url(#parquet)" />
    <rect x={-1200} y={1500} width={5200} height={14} fill="#000" opacity={0.6} />
    <rect x={-1200} y={1560} width={5200} height={220} fill="#5a1414" opacity={0.55} />
    <path d="M-1200 1572 H4000 M-1200 1768 H4000" stroke="#b8964e" strokeWidth={4} opacity={0.4} />
  </g>
);

export const Tape: React.FC<{x1: number; y1: number; x2: number; y2: number; w?: number}> = ({x1, y1, x2, y2, w = 46}) => {
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <g transform={`translate(${x1} ${y1}) rotate(${ang})`}>
      <rect x={0} y={-w / 2} width={len} height={w} fill="#e8c21e" stroke={INK} strokeWidth={3} />
      {Array.from({length: Math.floor(len / 170)}).map((_, i) => (
        <text key={i} x={20 + i * 170} y={w * 0.18} fontFamily="IFStamp" fontSize={w * 0.55} fill="#111" letterSpacing={2}>
          НЕ ВХОДИТЬ
        </text>
      ))}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Crime-scene room, seen from above (top-down), cold blue moonlight.  */
/* Centre ≈ (540, 960). The covered body lies diagonally on the rug.   */
/* ------------------------------------------------------------------ */
export const BodyRoomTop: React.FC<{f: number}> = ({f}) => (
  <g>
    {/* parquet floor */}
    <rect x={-800} y={-600} width={2700} height={3200} fill="#2a1c14" />
    <rect x={-800} y={-600} width={2700} height={3200} fill="url(#parquet)" transform="rotate(0)" />
    {/* rug */}
    <Ink d="M-60 300 H1140 V1640 H-60 Z" fill="#4e1012" heavy={0} w={4} />
    <rect x={0} y={360} width={1080} height={1220} fill="none" stroke="#b8964e" strokeWidth={8} opacity={0.6} />
    <rect x={60} y={420} width={960} height={1100} fill="none" stroke="#2a0608" strokeWidth={22} />
    {Array.from({length: 7}).map((_, i) => (
      <path key={i} d={`M540 ${520 + i * 140} l60 50 l-60 50 l-60 -50 Z`} fill="none" stroke="#b8964e" strokeWidth={4} opacity={0.35} />
    ))}
    {Array.from({length: 40}).map((_, i) => (
      <line key={`f${i}`} x1={-60 + i * 31} y1={1640} x2={-60 + i * 31} y2={1672} stroke="#7a5a3a" strokeWidth={3} />
    ))}
    {/* moonlight window shapes */}
    {[0, 1, 2].map((i) => (
      <polygon key={i} points={`${-300 + i * 420},${-200} ${-60 + i * 420},${-200} ${260 + i * 420},${2200} ${20 + i * 420},${2200}`} fill="#a9cdf5" opacity={0.1} />
    ))}
    {/* the covered body (white sheet, NOT graphic) */}
    <g transform="translate(540 980) rotate(-24)">
      <ellipse cx={20} cy={30} rx={190} ry={520} fill="#000" opacity={0.4} />
      <Ink
        d="M-60 -470 C-30 -520 40 -520 70 -470 C90 -430 80 -400 120 -380 C200 -340 210 -260 200 -160 C196 -40 170 60 160 160 C150 260 170 360 150 430 C130 490 60 500 0 500 C-60 500 -130 490 -150 430 C-170 360 -150 260 -160 160 C-170 60 -196 -40 -200 -160 C-210 -260 -200 -340 -120 -380 C-80 -400 -90 -430 -60 -470 Z"
        fill="#d9dde2"
        w={4}
        heavy={5}
      />
      <ellipse cx={4} cy={-420} rx={74} ry={66} fill="none" stroke="#0b0706" strokeWidth={3} opacity={0.55} />
      <path d="M-180 -300 C-110 -350 110 -350 180 -300" fill="none" stroke="#0b0706" strokeWidth={3} opacity={0.5} />
      <path d="M-120 60 C-60 20 -20 30 0 60 C30 20 80 20 120 60" fill="none" stroke="#0b0706" strokeWidth={2.5} opacity={0.35} />
      {/* folds */}
      <Line d="M-120 -300 C-60 -200 -40 -60 -60 120" w={3} op={0.4} />
      <Line d="M110 -300 C60 -160 70 0 60 160" w={3} op={0.4} />
      <Line d="M-140 200 C-60 260 40 260 140 210" w={3} op={0.35} />
      <Line d="M-20 -380 C0 -300 10 -200 0 -100" w={2.5} op={0.35} />
      <path d="M0 -420 C80 -300 160 -100 140 300 C120 420 60 480 0 490 Z" fill="#7c93ad" opacity={0.35} />
      {/* shoe tips under the sheet edge */}
      <path d="M-70 500 C-80 540 -40 552 -30 512 Z M40 500 C30 540 70 552 80 512 Z" fill="#1a110b" stroke={INK} strokeWidth={3} />
    </g>
    {/* evidence markers */}
    {[
      [250, 560, '1'],
      [860, 760, '2'],
      [880, 1360, '3'],
      [190, 1300, '4'],
    ].map(([x, y, n]) => (
      <g key={n as string} transform={`translate(${x} ${y})`}>
        <path d="M-34 30 L0 -34 L34 30 Z" fill="#f0c419" stroke={INK} strokeWidth={4} />
        <text x={0} y={22} fontFamily="IFStamp" fontSize={34} textAnchor="middle" fill="#111">
          {n}
        </text>
      </g>
    ))}
    {/* tipped chair + broken glass */}
    <g transform="translate(900 380) rotate(30)">
      <rect x={-80} y={-60} width={160} height={120} fill="#3a2414" stroke={INK} strokeWidth={4} />
      <rect x={-80} y={-110} width={160} height={40} fill="#2a1a0e" stroke={INK} strokeWidth={4} />
    </g>
    {Array.from({length: 9}).map((_, i) => (
      <path key={i} d={`M${170 + hash(i) * 80} ${880 + hash(i * 3) * 80} l${10 + hash(i * 5) * 16} ${-6} l${-4} ${14} Z`} fill="#bfe0ff" stroke={INK} strokeWidth={1.5} opacity={0.85} />
    ))}
    {/* police tape across the frame */}
    <Tape x1={-300} y1={250} x2={1400} y2={60} w={56} />
    <Tape x1={-300} y1={1860} x2={1400} y2={1640} w={56} />
    <Dust f={f} x={0} y={0} w={1080} h={1920} n={50} color="#cfe3ff" />
  </g>
);

/* ------------------------------------------------------------------ */
/* Police report card (insert).                                         */
/* ------------------------------------------------------------------ */
export const ReportCard: React.FC<{f: number; circle?: number; stamp?: number}> = ({f, circle = 0, stamp = 0}) => {
  const lines: [string, string][] = [
    ['CASE NO.', '001'],
    ['VICTIM', 'MALE, 58'],
    ['LOCATION', 'MANSION, 2ND FLOOR'],
    ['BODY', 'COVERED — NO ACCESS'],
    ['CAUSE OF DEATH', 'NOT DISCLOSED'],
    ['WEAPON', 'NONE FOUND'],
    ['WITNESSES', 'NONE'],
  ];
  return (
    <g>
      <rect x={-200} y={-200} width={1500} height={2400} fill="#1a1512" />
      <rect x={-200} y={-200} width={1500} height={2400} fill="url(#hatchWide)" opacity={0.25} />
      <g transform="rotate(-3 540 960)">
        <rect x={110} y={330} width={880} height={1260} fill="#000" opacity={0.5} transform="translate(18 24)" />
        <Ink d="M110 330 H990 V1590 H110 Z" fill="#d9ccb0" heavy={0} w={3} />
        <rect x={110} y={330} width={880} height={1260} fill="url(#concrete)" opacity={0.4} />
        <text x={150} y={430} fontFamily="IFType" fontSize={40} fill="#2a1f16">
          MILITIA REPORT — HOMICIDE
        </text>
        <line x1={150} y1={460} x2={950} y2={460} stroke="#2a1f16" strokeWidth={3} />
        {lines.map(([k, v], i) => (
          <g key={k}>
            <text x={150} y={560 + i * 120} fontFamily="IFType" fontSize={32} fill="#4a3a2a">
              {k}:
            </text>
            <text x={150} y={606 + i * 120} fontFamily="IFType" fontSize={44} fill="#1a120c">
              {v}
            </text>
          </g>
        ))}
        {/* red pencil circle around WEAPON: NONE FOUND */}
        {circle > 0 && (
          <path
            d="M130 1170 C150 1120 520 1110 600 1150 C660 1190 600 1240 380 1250 C200 1256 120 1230 140 1180"
            fill="none"
            stroke="#d01c14"
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={1400}
            strokeDashoffset={1400 * (1 - circle)}
          />
        )}
        {stamp > 0 && (
          <g transform={`translate(730 520) rotate(14) scale(${1 + (1 - stamp) * 0.6})`} opacity={stamp}>
            <rect x={-170} y={-50} width={340} height={100} fill="none" stroke="#c0140e" strokeWidth={8} />
            <text x={0} y={22} textAnchor="middle" fontFamily="IFStamp" fontSize={58} fill="#c0140e" letterSpacing={4}>
              CLASSIFIED
            </text>
          </g>
        )}
        {/* paper clip */}
        <path d="M800 290 V420 C800 450 850 450 850 420 V300 C850 280 820 280 820 300 V400" fill="none" stroke="#9a9a9a" strokeWidth={8} />
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Plain wallpapered wall for the reveal (shadow play).                 */
/* ------------------------------------------------------------------ */
export const RevealWall: React.FC = () => (
  <g>
    <rect x={-800} y={-400} width={2700} height={2800} fill="#5a3a2e" />
    <rect x={-800} y={-400} width={2700} height={2800} fill="url(#wallpaper)" />
    <rect x={-800} y={1480} width={2700} height={40} fill="#3a2418" stroke={INK} strokeWidth={3} />
    <rect x={-800} y={1520} width={2700} height={900} fill="#2a1a12" />
  </g>
);

import React from 'react';
import {Glint, Ink, Line} from '../kit/fx';
import {F} from '../kit/fonts';
import {clamp, hash, lerp, noise1, stepF} from '../kit/time';

/**
 * CASE 003 "The Perfect Crime" locations + props (all reusable):
 *  PlanWall (thief's planning corkboard + 12-month calendar), JewelleryFront (shop at night in rain),
 *  StoreInterior + DisplayCase + Diamond, CCTVCam, LEDClock (7-seg), Stopwatch, PrepTable (top-down kit),
 *  FlatRoom (thief's flat), PaddedDoor (Soviet leatherette door), Sedan (boxy 70s saloon, side),
 *  PayTerminal (parking card machine), BankCard, EvidenceBag + Receipt, WetStreet (reflections).
 */
const INK = '#0b0706';

/* ------------------------------------------------------------------ */
/* Planning wall                                                       */
/* ------------------------------------------------------------------ */
const Photo: React.FC<{x: number; y: number; w: number; h: number; rot?: number; children?: React.ReactNode}> = ({x, y, w, h, rot = 0, children}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2 + 6} y={-h / 2 + 8} width={w} height={h} fill="#000" opacity={0.45} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#e6dccb" stroke={INK} strokeWidth={3} />
    <g transform={`translate(${-w / 2 + 12} ${-h / 2 + 12})`}>
      <rect width={w - 24} height={h - 46} fill="#2a2c2a" />
      <svg width={w - 24} height={h - 46} viewBox={`0 0 ${w - 24} ${h - 46}`}>
        {children}
      </svg>
    </g>
  </g>
);
const Pin: React.FC<{x: number; y: number; c?: string}> = ({x, y, c = '#c8231b'}) => (
  <g>
    <circle cx={x + 3} cy={y + 4} r={11} fill="#000" opacity={0.5} />
    <circle cx={x} cy={y} r={11} fill={c} stroke={INK} strokeWidth={2.5} />
    <circle cx={x - 3} cy={y - 3} r={3.5} fill="#fff" opacity={0.6} />
  </g>
);

/** Pins in world coords (used for strings). */
export const PLAN_PINS: [number, number][] = [
  [300, 520],
  [760, 470],
  [250, 980],
  [800, 930],
  [540, 760],
];

/** progress: 0..1 how many months are crossed (12 X's). takeDown: 0..1 police removing photos (ending). */
export const PlanWall: React.FC<{f: number; months?: number; lamp?: number; takeDown?: number; receipt?: number}> = ({f, months = 1, lamp = 1, takeDown = 0, receipt = 0}) => {
  const fl = 0.94 + 0.06 * noise1(stepF(f, 3) * 0.2);
  const strings: [number, number][] = [
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [0, 1],
  ];
  const gone = (i: number) => clamp(takeDown * 5 - i);
  return (
    <g>
      {/* wall: peeling green-grey paint */}
      <rect x={-400} y={-200} width={1900} height={2400} fill="#2f3529" />
      <rect x={-400} y={-200} width={1900} height={2400} fill="url(#concrete)" opacity={0.6} />
      {Array.from({length: 9}).map((_, i) => (
        <path key={i} d={`M${-300 + i * 220} ${-200} L${-260 + i * 220} 2200`} stroke="#000" strokeWidth={2} opacity={0.12} />
      ))}
      {/* cork board */}
      <Ink d="M80 300 L1000 300 L1000 1200 L80 1200 Z" fill="#7a5532" heavy={5} />
      <rect x={96} y={316} width={888} height={868} fill="#8d6438" />
      {Array.from({length: 120}).map((_, i) => (
        <circle key={i} cx={100 + hash(i * 3.1) * 880} cy={320 + hash(i * 7.7) * 860} r={1.5 + hash(i) * 2.5} fill="#5a3c1e" opacity={0.6} />
      ))}
      {/* photos */}
      <g opacity={1 - gone(0)} transform={`translate(0 ${gone(0) * 60})`}>
        <Photo x={300} y={560} w={300} h={240} rot={-4}>
          {/* shop front photo */}
          <rect width={276} height={194} fill="#3a4248" />
          <rect x={30} y={60} width={216} height={134} fill="#1a1d20" />
          <rect x={50} y={80} width={176} height={80} fill="#d8c27a" opacity={0.8} />
          <rect x={20} y={30} width={236} height={30} fill="#111" />
          <text x={138} y={52} fontFamily={F.stamp} fontSize={22} fill="#e7d48b" textAnchor="middle" letterSpacing={3}>
            JEWELLERY
          </text>
        </Photo>
      </g>
      <g opacity={1 - gone(1)} transform={`translate(0 ${gone(1) * 60})`}>
        <Photo x={760} y={520} w={260} h={220} rot={5}>
          {/* guard photo: figure at a desk */}
          <rect width={236} height={174} fill="#30343a" />
          <circle cx={118} cy={64} r={30} fill="#b98a6d" />
          <path d="M80 50 C80 20 156 20 156 50 Z" fill="#1d232c" />
          <path d="M60 174 C60 110 176 110 176 174 Z" fill="#1d232c" />
          <rect x={20} y={140} width={196} height={34} fill="#4a3624" />
        </Photo>
      </g>
      <g opacity={1 - gone(2)} transform={`translate(0 ${gone(2) * 60})`}>
        <Photo x={250} y={1000} w={250} h={210} rot={3}>
          {/* CCTV camera photo */}
          <rect width={226} height={164} fill="#42474b" />
          <path d="M40 60 L150 40 L170 90 L60 110 Z" fill="#d8d6cf" stroke="#111" strokeWidth={3} />
          <rect x={150} y={50} width={30} height={40} fill="#111" />
          <path d="M60 110 L50 160" stroke="#111" strokeWidth={8} />
          <circle cx={168} cy={70} r={6} fill="#ff3020" />
        </Photo>
      </g>
      <g opacity={1 - gone(3)} transform={`translate(0 ${gone(3) * 60})`}>
        {/* floor plan sheet */}
        <g transform="translate(800 960) rotate(-3)">
          <rect x={-150} y={-120} width={300} height={240} fill="#d9d4c3" stroke={INK} strokeWidth={3} />
          <path d="M-120 -90 H120 V90 H-120 Z M-120 0 H20 V90 M20 -90 V-20 H120" stroke="#2a3a6a" strokeWidth={4} fill="none" />
          <path d="M60 30 L100 60 M100 30 L60 60" stroke="#c8231b" strokeWidth={6} />
          <path d="M-100 70 C-60 40 -20 60 40 40" stroke="#c8231b" strokeWidth={3} strokeDasharray="8 6" fill="none" />
          <text x={-110} y={-100} fontFamily={F.type} fontSize={20} fill="#1b2a5a">
            PLAN · 10 MIN
          </text>
        </g>
      </g>
      {/* receipt in evidence bag pinned at the centre (ending) */}
      {receipt > 0 && (
        <g transform={`translate(540 ${760 + (1 - receipt) * 60}) rotate(${(1 - receipt) * -10})`} opacity={clamp(receipt * 2)}>
          <EvidenceBag w={250} h={340} />
        </g>
      )}
      {/* red strings */}
      {strings.map(([a, b], i) => {
        const o = 1 - Math.max(gone(a), gone(b));
        const [x1, y1] = PLAN_PINS[a];
        const [x2, y2] = PLAN_PINS[b];
        return <path key={i} d={`M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + 30} ${x2} ${y2}`} stroke="#c8231b" strokeWidth={4} fill="none" opacity={o * 0.95} />;
      })}
      {PLAN_PINS.map(([x, y], i) => (i === 4 && receipt > 0 ? null : <Pin key={i} x={x} y={y} c={i === 4 ? '#e8c23a' : '#c8231b'} />))}
      {receipt > 0 && <Pin x={540} y={610 + (1 - receipt) * 60} c="#e8c23a" />}
      {/* centre index card "D-DAY" */}
      {receipt === 0 && (
        <g transform="translate(540 790) rotate(2)">
          <rect x={-110} y={-60} width={220} height={120} fill="#efe8d6" stroke={INK} strokeWidth={3} />
          <text x={0} y={-8} fontFamily={F.type} fontSize={30} fill="#1a1410" textAnchor="middle">
            03:12
          </text>
          <text x={0} y={34} fontFamily={F.type} fontSize={24} fill="#c8231b" textAnchor="middle">
            D-DAY
          </text>
        </g>
      )}
      {/* calendar: 12 months, crossed one by one */}
      <g transform="translate(140 1290)">
        <rect x={0} y={0} width={800} height={430} fill="#e4dccb" stroke={INK} strokeWidth={4} />
        <rect x={0} y={0} width={800} height={70} fill="#9a2a20" />
        <text x={400} y={50} fontFamily={F.stamp} fontSize={44} fill="#f0e6d2" textAnchor="middle" letterSpacing={10}>
          1 9 7 8
        </text>
        {Array.from({length: 12}).map((_, i) => {
          const cx = 20 + (i % 4) * 192;
          const cy = 86 + Math.floor(i / 4) * 112;
          const k = clamp(months * 12 - i);
          return (
            <g key={i}>
              <rect x={cx} y={cy} width={176} height={100} fill="#d6ccb6" stroke={INK} strokeWidth={2} />
              {Array.from({length: 15}).map((_, d) => (
                <rect key={d} x={cx + 10 + (d % 5) * 32} y={cy + 30 + Math.floor(d / 5) * 22} width={24} height={14} fill="#bfb39a" />
              ))}
              <text x={cx + 10} y={cy + 24} fontFamily={F.type} fontSize={18} fill="#2a2018">
                {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i]}
              </text>
              {k > 0 && (
                <path
                  d={`M${cx + 14} ${cy + 12} L${cx + 14 + 148 * Math.min(1, k * 2)} ${cy + 12 + 78 * Math.min(1, k * 2)} ${k > 0.5 ? `M${cx + 162} ${cy + 12} L${cx + 162 - 148 * (k * 2 - 1)} ${cy + 12 + 78 * (k * 2 - 1)}` : ''}`}
                  stroke="#c8231b"
                  strokeWidth={9}
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </g>
          );
        })}
      </g>
      {/* desk-lamp light pool (warm tungsten), flickers */}
      <ellipse cx={560} cy={900} rx={760} ry={900} fill="url(#warmGlow)" opacity={0.42 * lamp * fl} style={{mixBlendMode: 'screen'}} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Evidence bag with a tiny parking receipt                           */
/* ------------------------------------------------------------------ */
export const Receipt: React.FC<{w?: number; h?: number}> = ({w = 150, h = 240}) => (
  <g>
    <path d={`M${-w / 2} ${-h / 2} H${w / 2} V${h / 2 - 10} l-15 10 l-15 -10 l-15 10 l-15 -10 l-15 10 l-15 -10 l-15 10 l-15 -10 l-15 10 l-15 -10 L${-w / 2} ${h / 2} Z`} fill="#f2ede1" stroke={INK} strokeWidth={2.5} />
    <text x={0} y={-h / 2 + 30} fontFamily={F.type} fontSize={w * 0.12} fill="#2a2420" textAnchor="middle">
      PARKING
    </text>
    {['ZONE 7 · KIROV ST', '02:58 AM', 'CARD **** 4417', 'M. VOLKOV', 'PAID  2.00'].map((t, i) => (
      <text key={i} x={-w / 2 + 12} y={-h / 2 + 64 + i * (h * 0.13)} fontFamily={F.type} fontSize={w * 0.085} fill={i === 3 ? '#b31d16' : '#3a332c'}>
        {t}
      </text>
    ))}
  </g>
);
export const EvidenceBag: React.FC<{w: number; h: number}> = ({w, h}) => (
  <g>
    <rect x={-w / 2 + 8} y={-h / 2 + 10} width={w} height={h} fill="#000" opacity={0.4} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill="#cfd6d8" opacity={0.35} stroke="#e8f0f2" strokeWidth={3} />
    <rect x={-w / 2} y={-h / 2} width={w} height={42} fill="#c8231b" opacity={0.9} />
    <text x={0} y={-h / 2 + 30} fontFamily={F.stamp} fontSize={26} fill="#fff" textAnchor="middle" letterSpacing={4}>
      EVIDENCE
    </text>
    <g transform={`translate(0 ${30}) scale(${(w * 0.75) / 150})`}>
      <Receipt />
    </g>
    <path d={`M${-w / 2 + 14} ${-h / 2 + 60} L${-w / 2 + 40} ${h / 2 - 20}`} stroke="#fff" strokeWidth={6} opacity={0.35} />
  </g>
);

/* ------------------------------------------------------------------ */
/* Jewellery shop front (night, rain) — ground floor of a concrete block */
/* ------------------------------------------------------------------ */
export const JewelleryFront: React.FC<{x: number; y: number; s?: number; f: number; inside?: number; neon?: number; shutter?: number}> = ({x, y, s = 1, f, inside = 1, neon = 1, shutter = 0}) => {
  const nf = neon * (hash(Math.floor(f / 5)) > 0.93 ? 0.3 : 1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* building above: concrete with dark windows */}
      <rect x={-620} y={-1500} width={1240} height={1500} fill="#3b4144" />
      <rect x={-620} y={-1500} width={1240} height={1500} fill="url(#concrete)" opacity={0.7} />
      {Array.from({length: 12}).map((_, i) => {
        const cx = -520 + (i % 4) * 280;
        const cy = -1420 + Math.floor(i / 4) * 260;
        const lit = hash(i * 9.1) > 0.8;
        return (
          <g key={i}>
            <rect x={cx} y={cy} width={150} height={170} fill={lit ? '#e8a54a' : '#151a1d'} stroke={INK} strokeWidth={5} />
            <path d={`M${cx + 75} ${cy} V${cy + 170} M${cx} ${cy + 70} H${cx + 150}`} stroke={INK} strokeWidth={4} />
          </g>
        );
      })}
      <path d="M-620 -620 H620" stroke="#22272a" strokeWidth={22} />
      {/* sign board */}
      <rect x={-560} y={-600} width={1120} height={130} fill="#111416" stroke={INK} strokeWidth={6} />
      <text x={0} y={-505} fontFamily={F.stamp} fontSize={96} fill={nf > 0.5 ? '#ffe7a0' : '#6a5a3a'} textAnchor="middle" letterSpacing={18} style={{filter: nf > 0.5 ? 'drop-shadow(0 0 14px #ffb83a)' : undefined}}>
        JEWELLERY
      </text>
      {/* shop window + door */}
      <rect x={-560} y={-460} width={760} height={460} fill="#151719" stroke={INK} strokeWidth={8} />
      <rect x={-540} y={-440} width={720} height={420} fill="#f3d78f" opacity={0.85 * inside} />
      <rect x={-540} y={-440} width={720} height={420} fill="url(#warmGlow)" opacity={0.6 * inside} />
      {/* display busts and trays in the window */}
      {[-420, -180, 60].map((bx, i) => (
        <g key={bx}>
          <path d={`M${bx - 60} -60 C${bx - 60} -150 ${bx - 30} -190 ${bx} -200 C${bx + 30} -190 ${bx + 60} -150 ${bx + 60} -60 Z`} fill="#2a1418" stroke={INK} strokeWidth={4} />
          <path d={`M${bx - 36} -170 C${bx - 20} -120 ${bx + 20} -120 ${bx + 36} -170`} stroke="#fff" strokeWidth={4} fill="none" strokeDasharray="3 6" />
          <Glint x={bx} y={-128} r={22} k={0.4 + 0.6 * Math.max(0, Math.sin(stepF(f, 4) * 0.05 + i * 2))} />
        </g>
      ))}
      <rect x={-540} y={-60} width={720} height={40} fill="#5a3a22" />
      {/* steel shutter (half down) */}
      {shutter > 0 && (
        <g>
          <rect x={-560} y={-460} width={760} height={460 * shutter} fill="#6d7377" stroke={INK} strokeWidth={4} />
          {Array.from({length: Math.floor(shutter * 18)}).map((_, i) => (
            <path key={i} d={`M-560 ${-460 + i * 26} H200`} stroke="#3c4144" strokeWidth={3} />
          ))}
        </g>
      )}
      <rect x={250} y={-460} width={300} height={460} fill="#0f1214" stroke={INK} strokeWidth={8} />
      <rect x={270} y={-440} width={260} height={300} fill="#c9a660" opacity={0.35 * inside} />
      <circle cx={500} cy={-220} r={10} fill="#b8964e" stroke={INK} strokeWidth={2} />
      {/* awning stub + drip line */}
      <Ink d="M-600 -470 L600 -470 L640 -440 L-640 -440 Z" fill="#1d2426" heavy={2} />
      {Array.from({length: 18}).map((_, i) => {
        const dy = ((stepF(f, 2) * 9 + i * 53) % 420) - 0;
        return <line key={i} x1={-620 + i * 72} y1={-436 + dy} x2={-620 + i * 72} y2={-420 + dy} stroke="#cfe0ea" strokeWidth={3} opacity={0.5} />;
      })}
      {/* CCTV over the door */}
      <g transform="translate(470 -700) scale(0.5)">
        <CCTVCam f={f} pan={Math.sin(stepF(f, 4) * 0.02) * 20} led />
      </g>
    </g>
  );
};

/** Wet street: dark asphalt, sodium reflections streaked vertically, puddles. Use as foreground plane. */
export const WetStreet: React.FC<{x: number; y: number; w: number; h: number; f: number; glow?: string; glowX?: number[]; base?: string}> = ({x, y, w, h, f, glow = '#ff9b3a', glowX = [], base = '#15181b'}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={base} />
    <rect x={x} y={y} width={w} height={h} fill="url(#concrete)" opacity={0.4} />
    {glowX.map((gx, i) => (
      <g key={i} opacity={0.8 + 0.2 * noise1(stepF(f, 4) * 0.1 + i)}>
        {Array.from({length: 10}).map((_, k) => (
          <rect key={k} x={gx - 30 + noise1(k * 3 + stepF(f, 4) * 0.08) * 16} y={y + 20 + k * (h / 12)} width={60 - k * 3} height={h / 24} fill={glow} opacity={0.35 * (1 - k / 11)} />
        ))}
      </g>
    ))}
    {Array.from({length: 7}).map((_, i) => (
      <ellipse key={i} cx={x + hash(i * 5.3) * w} cy={y + 80 + hash(i * 2.1) * (h - 120)} rx={90 + hash(i) * 140} ry={14 + hash(i + 3) * 18} fill="#2c3338" opacity={0.7} />
    ))}
  </g>
);

/* ------------------------------------------------------------------ */
/* Store interior, display cases, diamonds                            */
/* ------------------------------------------------------------------ */
export const Diamond: React.FC<{x: number; y: number; r?: number; f?: number; seed?: number; tint?: string}> = ({x, y, r = 20, f = 0, seed = 0, tint = '#dff3ff'}) => {
  const tw = Math.max(0, Math.sin(stepF(f, 4) * 0.07 + seed * 2.3));
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-r} ${-r * 0.3} L${-r * 0.5} ${-r * 0.8} L${r * 0.5} ${-r * 0.8} L${r} ${-r * 0.3} L0 ${r} Z`} fill={tint} stroke={INK} strokeWidth={Math.max(1.2, r * 0.08)} />
      <path d={`M${-r} ${-r * 0.3} H${r} M${-r * 0.5} ${-r * 0.8} L${-r * 0.2} ${-r * 0.3} L0 ${r} L${r * 0.2} ${-r * 0.3} L${r * 0.5} ${-r * 0.8}`} stroke="#6f93ab" strokeWidth={Math.max(1, r * 0.05)} fill="none" />
      <path d={`M${-r * 0.5} ${-r * 0.8} L${-r * 0.2} ${-r * 0.3} L${-r} ${-r * 0.3} Z`} fill="#fff" opacity={0.8} />
      <Glint x={-r * 0.3} y={-r * 0.5} r={r * 1.4} k={tw * 0.9} />
    </g>
  );
};

/** A glass-topped display case on a wooden plinth. full 0..1 (jewels left), cut = glass circle cut. */
export const DisplayCase: React.FC<{x: number; y: number; w?: number; f: number; full?: number; cut?: number; light?: string; tag?: number}> = ({x, y, w = 520, f, full = 1, cut = 0, light = '#bfe9d6', tag = 0}) => {
  const h = 200;
  const items = 7;
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* plinth */}
      <Ink d={`M${-w / 2} 0 L${w / 2} 0 L${w / 2 - 20} 420 L${-w / 2 + 20} 420 Z`} fill="#3a2418" hatch="hatchV" hatchOp={0.25} />
      <rect x={-w / 2} y={-14} width={w} height={20} fill="#c9a24a" stroke={INK} strokeWidth={3} />
      {/* velvet bed */}
      <rect x={-w / 2 + 16} y={-h + 20} width={w - 32} height={h - 34} fill="#1b2a3a" />
      <rect x={-w / 2 + 16} y={-h + 20} width={w - 32} height={h - 34} fill="url(#hatchFine)" opacity={0.25} />
      {Array.from({length: items}).map((_, i) => {
        const ix = -w / 2 + 50 + (i * (w - 100)) / (items - 1);
        const iy = -h * 0.45 + (i % 2) * 34;
        const here = full * items > i;
        return here ? (
          <g key={i}>
            <path d={`M${ix - 28} ${iy - 20} C${ix - 20} ${iy + 14} ${ix + 20} ${iy + 14} ${ix + 28} ${iy - 20}`} stroke="#e8e2d4" strokeWidth={3} fill="none" strokeDasharray="2 5" />
            <Diamond x={ix} y={iy + 12} r={13} f={f} seed={i + x * 0.01} />
          </g>
        ) : (
          <g key={i}>
            <rect x={ix - 18} y={iy - 2} width={36} height={22} rx={4} fill="#0f1a26" />
          </g>
        );
      })}
      {/* glass box */}
      <path d={`M${-w / 2} ${-h} L${w / 2} ${-h} L${w / 2} -10 L${-w / 2} -10 Z`} fill={light} opacity={0.12} stroke="#d8f0ea" strokeWidth={4} />
      <path d={`M${-w / 2 + 30} ${-h + 10} L${-w / 2 + 110} -20`} stroke="#ffffff" strokeWidth={8} opacity={0.22} />
      <path d={`M${-w / 2 + 70} ${-h + 10} L${-w / 2 + 130} -60`} stroke="#ffffff" strokeWidth={3} opacity={0.25} />
      {cut > 0 && (
        <g>
          <circle cx={w * 0.1} cy={-h * 0.55} r={70} fill="#000" opacity={0.35 * cut} />
          <circle cx={w * 0.1} cy={-h * 0.55} r={70} fill="none" stroke="#e8fbff" strokeWidth={3} strokeDasharray={`${cut * 440} 440`} />
        </g>
      )}
      {tag > 0 && (
        <g transform={`translate(${w * 0.3} -40) rotate(${Math.sin(stepF(f, 4) * 0.09) * 18 * tag})`}>
          <path d="M0 0 L0 50" stroke="#d8d0bd" strokeWidth={2} />
          <rect x={-22} y={50} width={44} height={60} fill="#efe6d0" stroke={INK} strokeWidth={2} />
          <text x={0} y={88} fontFamily={F.type} fontSize={14} fill="#2a2018" textAnchor="middle">
            SOLD?
          </text>
        </g>
      )}
    </g>
  );
};

/** Dark shop interior: wood panelling, a back wall of glass cabinets, blind-stripe moonlight, green exit sign. */
export const StoreInterior: React.FC<{f: number; stripes?: number; exit?: number; door?: number}> = ({f, stripes = 1, exit = 1, door = 0}) => (
  <g>
    <rect x={-600} y={-200} width={2400} height={2400} fill="#18221f" />
    {/* panelling */}
    {Array.from({length: 14}).map((_, i) => (
      <g key={i}>
        <rect x={-560 + i * 180} y={700} width={160} height={620} fill="#2a1d15" stroke={INK} strokeWidth={4} />
        <rect x={-540 + i * 180} y={730} width={120} height={250} fill="none" stroke="#120c08" strokeWidth={3} />
      </g>
    ))}
    {/* back cabinets */}
    {Array.from({length: 6}).map((_, i) => (
      <g key={i}>
        <rect x={-500 + i * 380} y={260} width={330} height={420} fill="#0f1816" stroke={INK} strokeWidth={6} />
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <rect x={-480 + i * 380} y={300 + k * 130} width={290} height={8} fill="#c9a24a" opacity={0.6} />
            {[0, 1, 2, 3].map((d) => (
              <Diamond key={d} x={-440 + i * 380 + d * 70} y={286 + k * 130} r={9} f={f} seed={i * 7 + k * 3 + d} tint="#cfe7f0" />
            ))}
          </g>
        ))}
      </g>
    ))}
    {/* the entrance door (back of the room, screen right) */}
    <rect x={1340} y={240} width={360} height={1080} fill="#0b0f12" stroke={INK} strokeWidth={8} />
    <rect x={1360} y={260} width={320} height={1040 * door} fill="#4d6f86" opacity={0.75} />
    {/* floor (checker tiles in perspective) */}
    <rect x={-600} y={1320} width={2400} height={900} fill="#1d2321" />
    {Array.from({length: 22}).map((_, i) => (
      <path key={i} d={`M${540 + (i - 11) * 60} 1320 L${540 + (i - 11) * 300} 2200`} stroke="#000" strokeWidth={3} opacity={0.45} />
    ))}
    {[1380, 1470, 1590, 1750, 1960].map((y) => (
      <path key={y} d={`M-600 ${y} H1800`} stroke="#000" strokeWidth={3} opacity={0.45} />
    ))}
    {/* blind-stripe moonlight */}
    <g opacity={0.22 * stripes} style={{mixBlendMode: 'screen'}}>
      {Array.from({length: 9}).map((_, i) => (
        <polygon key={i} points={`${-300 + i * 10},${300 + i * 70} ${600 + i * 10},${200 + i * 70} ${1400 + i * 60},${1500 + i * 90} ${100 + i * 60},${1600 + i * 90}`} fill="#9fc7ff" opacity={i % 2 ? 0 : 0.8} />
      ))}
    </g>
    {/* green exit sign */}
    <g transform="translate(1420 170)">
      <rect x={-10} y={-10} width={220} height={80} fill="#0d1a12" stroke={INK} strokeWidth={4} />
      <rect x={0} y={0} width={200} height={60} fill="#3ad07a" opacity={0.85 * exit} />
      <text x={100} y={46} fontFamily={F.stamp} fontSize={44} fill="#0d2a18" textAnchor="middle" letterSpacing={8}>
        EXIT
      </text>
      <ellipse cx={100} cy={30} rx={420} ry={260} fill="#3ad07a" opacity={0.08 * exit} />
    </g>
  </g>
);

/* ------------------------------------------------------------------ */
/* CCTV camera (wall bracket), pan in degrees, red LED                 */
/* ------------------------------------------------------------------ */
export const CCTVCam: React.FC<{f: number; pan?: number; led?: boolean; cone?: number}> = ({f, pan = 0, led = true, cone = 0}) => {
  const on = led && Math.floor(f / 30) % 2 === 0;
  return (
    <g>
      <Ink d="M-30 -120 L30 -120 L30 40 L-30 40 Z" fill="#3a3e42" />
      <path d="M0 0 L0 60" stroke={INK} strokeWidth={16} />
      <g transform={`translate(0 70) rotate(${pan + 14})`}>
        {cone > 0 && <polygon points="400,0 1800,-520 1800,620" fill="#ffefb0" opacity={0.1 * cone} />}
        <Ink d="M-60 -50 L340 -70 L360 60 L-40 60 Z" fill="#d9d6ce" hatch="hatchFine" hatchOp={0.2} />
        <Ink d="M330 -60 L420 -50 L420 50 L340 54 Z" fill="#1a1b1d" />
        <circle cx={400} cy={0} r={30} fill="#0a0c10" stroke="#4a5058" strokeWidth={5} />
        <circle cx={392} cy={-8} r={8} fill="#7fa7d6" opacity={0.7} />
        <Ink d="M-80 -80 L380 -100 L400 -70 L-60 -50 Z" fill="#b9b5ac" heavy={0} />
        <circle cx={300} cy={34} r={9} fill={on ? '#ff2a1a' : '#4a0d08'} />
        {on && <circle cx={300} cy={34} r={30} fill="url(#redGlow)" />}
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Seven-segment LED clock (bedside alarm clock)                       */
/* ------------------------------------------------------------------ */
const SEG: Record<string, string> = {
  '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abfgcd', ' ': '',
};
const Digit: React.FC<{d: string; x: number; s: number; on: string; off: string; flip?: number}> = ({d, x, s, on, off, flip = 0}) => {
  const segs = SEG[d] ?? '';
  const w = 60 * s;
  const h = 110 * s;
  const t = 12 * s;
  const R: Record<string, [number, number, number, number]> = {
    a: [t, 0, w - 2 * t, t], g: [t, h / 2 - t / 2, w - 2 * t, t], d: [t, h - t, w - 2 * t, t],
    f: [0, t, t, h / 2 - 1.5 * t], b: [w - t, t, t, h / 2 - 1.5 * t], e: [0, h / 2 + t / 2, t, h / 2 - 1.5 * t], c: [w - t, h / 2 + t / 2, t, h / 2 - 1.5 * t],
  };
  return (
    <g transform={`translate(${x} 0) scale(1 ${1 - flip * 0.9})`} style={{transformOrigin: `${x}px ${h / 2}px`}}>
      {Object.entries(R).map(([k, [rx, ry, rw, rh]]) => (
        <rect key={k} x={rx} y={ry} width={rw} height={rh} rx={t / 2} fill={segs.includes(k) ? on : off} transform={`skewX(-6)`} />
      ))}
    </g>
  );
};
export const LEDClock: React.FC<{text: string; s?: number; on?: string; off?: string; flip?: number; pm?: boolean}> = ({text, s = 1, on = '#ff2a1a', off = '#1a0403', flip = 0}) => {
  const chars = text.split('');
  let x = 0;
  const W0 = chars.reduce((a, c) => a + (c === ':' ? 34 : 80), 0) - 20;
  return (
    <g>
      <Ink d={`M${-40 * s} ${-50 * s} L${(W0 + 40) * s} ${-50 * s} L${(W0 + 60) * s} ${170 * s} L${-60 * s} ${170 * s} Z`} fill="#1a1716" heavy={6} />
      <rect x={-20 * s} y={-30 * s} width={(W0 + 40) * s} height={180 * s} fill="#080303" />
      <g style={{filter: `drop-shadow(0 0 ${10 * s}px ${on})`}}>
        {chars.map((c, i) => {
          if (c === ':') {
            const cx = x + 12 * s;
            x += 34 * s;
            return (
              <g key={i}>
                <rect x={cx} y={30 * s} width={12 * s} height={12 * s} fill={on} />
                <rect x={cx} y={70 * s} width={12 * s} height={12 * s} fill={on} />
              </g>
            );
          }
          const dx = x;
          x += 80 * s;
          return <Digit key={i} d={c} x={dx} s={s} on={on} off={off} flip={i === chars.length - 1 ? flip : 0} />;
        })}
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Stopwatch / chronograph face (close insert)                         */
/* ------------------------------------------------------------------ */
export const Stopwatch: React.FC<{secs: number; r?: number; red?: number}> = ({secs, r = 300, red = 0}) => {
  const a = (secs / 60) * 360;
  const am = (secs / 600) * 360; // 10-min sub-dial
  return (
    <g>
      <rect x={-30} y={-r - 90} width={60} height={70} fill="#9a958c" stroke={INK} strokeWidth={4} />
      <rect x={-50} y={-r - 120} width={100} height={36} rx={8} fill="#b9b4aa" stroke={INK} strokeWidth={4} />
      <circle r={r + 30} fill="#8f8a82" stroke={INK} strokeWidth={6} />
      <circle r={r + 30} fill="url(#hatchFine)" opacity={0.25} />
      <circle r={r} fill="#ece4d2" stroke={INK} strokeWidth={5} />
      {Array.from({length: 60}).map((_, i) => {
        const ang = (i / 60) * Math.PI * 2;
        const L = i % 5 ? 16 : 38;
        return <line key={i} x1={Math.sin(ang) * (r - 10)} y1={-Math.cos(ang) * (r - 10)} x2={Math.sin(ang) * (r - 10 - L)} y2={-Math.cos(ang) * (r - 10 - L)} stroke={INK} strokeWidth={i % 5 ? 2.5 : 6} />;
      })}
      {[0, 10, 20, 30, 40, 50].map((n) => {
        const ang = (n / 60) * Math.PI * 2;
        return (
          <text key={n} x={Math.sin(ang) * (r - 80)} y={-Math.cos(ang) * (r - 80) + 16} fontFamily={F.stamp} fontSize={44} fill="#1a1410" textAnchor="middle">
            {n || 60}
          </text>
        );
      })}
      {/* 10-minute sub-dial, red sector */}
      <g transform={`translate(0 ${r * 0.38})`}>
        <circle r={r * 0.26} fill="#ddd3bd" stroke={INK} strokeWidth={3} />
        <path d={`M0 0 L0 ${-r * 0.26} A${r * 0.26} ${r * 0.26} 0 ${am > 180 ? 1 : 0} 1 ${Math.sin((am * Math.PI) / 180) * r * 0.26} ${-Math.cos((am * Math.PI) / 180) * r * 0.26} Z`} fill="#c8231b" opacity={0.75} />
        <line x1={0} y1={0} x2={Math.sin((am * Math.PI) / 180) * r * 0.22} y2={-Math.cos((am * Math.PI) / 180) * r * 0.22} stroke={INK} strokeWidth={5} />
      </g>
      <g transform={`rotate(${a})`}>
        <path d={`M-6 ${r * 0.18} L-3 ${-r * 0.9} L3 ${-r * 0.9} L6 ${r * 0.18} Z`} fill={red > 0.5 ? '#c8231b' : '#1a1410'} stroke={INK} strokeWidth={2} />
      </g>
      <circle r={16} fill="#1a1410" />
      <path d={`M${-r * 0.7} ${-r * 0.5} A${r} ${r} 0 0 1 ${-r * 0.1} ${-r * 0.86}`} stroke="#fff" strokeWidth={14} opacity={0.35} fill="none" strokeLinecap="round" />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Prep table (top-down): kit laid out on a bedsheet                   */
/* show: number of items revealed (1 map+tools, 2 gloves, 3 mask)      */
/* ------------------------------------------------------------------ */
export const PrepTable: React.FC<{f: number; tools?: number; gloves?: number; mask?: number}> = ({f, tools = 1, gloves = 0, mask = 0}) => {
  const slide = (k: number, dx: number, dy: number) => `translate(${(1 - k) * dx} ${(1 - k) * dy})`;
  return (
    <g>
      {/* army blanket on a bed */}
      <rect x={-400} y={-200} width={1900} height={2400} fill="#3e4a37" />
      {Array.from({length: 40}).map((_, i) => (
        <path key={i} d={`M-400 ${-200 + i * 60} C200 ${-180 + i * 60 + noise1(i) * 30} 800 ${-220 + i * 60} 1500 ${-200 + i * 60}`} stroke="#2c3627" strokeWidth={3} fill="none" opacity={0.6} />
      ))}
      <rect x={-400} y={430} width={1900} height={40} fill="#6e1c18" opacity={0.7} />
      {/* city map */}
      <g transform={`${slide(tools, -300, 0)} translate(330 380) rotate(-6)`} opacity={clamp(tools * 3)}>
        <rect x={-260} y={-200} width={520} height={400} fill="#d6cfb9" stroke={INK} strokeWidth={4} />
        {Array.from({length: 8}).map((_, i) => (
          <path key={i} d={`M-260 ${-200 + i * 52} L260 ${-180 + i * 48} M${-260 + i * 70} -200 L${-240 + i * 66} 200`} stroke="#9a9078" strokeWidth={3} />
        ))}
        <circle cx={80} cy={20} r={46} fill="none" stroke="#c8231b" strokeWidth={7} />
        <path d="M-180 140 C-100 80 0 70 70 30" stroke="#c8231b" strokeWidth={5} strokeDasharray="12 8" fill="none" />
      </g>
      {/* glass cutter + torch + crowbar */}
      <g transform={`${slide(tools, 400, 0)} translate(800 360) rotate(28)`} opacity={clamp(tools * 3 - 0.5)}>
        <Ink d="M-30 -160 L30 -160 L24 120 L-24 120 Z" fill="#2c2c30" />
        <Ink d="M-46 -230 L46 -230 L36 -160 L-36 -160 Z" fill="#8a8a90" />
        <circle cx={0} cy={-196} r={26} fill="#e6e0c0" stroke={INK} strokeWidth={3} />
      </g>
      <g transform={`${slide(tools, 400, 200)} translate(760 760) rotate(-50)`} opacity={clamp(tools * 3 - 1)}>
        <Ink d="M-200 -14 L180 -14 C210 -14 220 -40 200 -70 L214 -76 C240 -40 230 14 180 14 L-200 14 Z" fill="#7a1814" />
      </g>
      <g transform={`${slide(tools, 0, 300)} translate(560 640) rotate(12)`} opacity={clamp(tools * 3 - 1.5)}>
        <Ink d="M-16 -110 L16 -110 L12 40 L-12 40 Z" fill="#3a2a1e" />
        <Ink d="M-50 40 L50 40 L10 70 L-10 70 Z" fill="#b8b8be" />
        <circle cx={0} cy={60} r={10} fill="#e8fbff" />
      </g>
      {/* gloves */}
      <g transform={`${slide(gloves, -500, 200)} translate(300 1060) rotate(-14)`} opacity={clamp(gloves * 3)}>
        {[-1, 1].map((sx) => (
          <g key={sx} transform={`translate(${sx * 110} 0) scale(${sx} 1)`}>
            <Ink d="M-60 120 L-70 -10 C-90 -40 -90 -80 -70 -90 L-60 -50 L-56 -150 C-54 -170 -30 -170 -30 -150 L-24 -70 L-20 -170 C-18 -190 8 -190 8 -170 L10 -70 L18 -160 C20 -178 44 -178 44 -158 L40 -60 L56 -130 C60 -146 80 -144 78 -126 L60 20 L60 120 Z" fill="#141313" hatch="hatchFine" hatchOp={0.2} />
            <path d="M-60 90 H60" stroke="#3a3a3e" strokeWidth={6} />
          </g>
        ))}
      </g>
      {/* balaclava mask */}
      <g transform={`${slide(mask, 500, 200)} translate(780 1120) rotate(10)`} opacity={clamp(mask * 3)}>
        <Ink d="M-150 160 C-170 0 -150 -170 0 -190 C150 -170 170 0 150 160 Z" fill="#121214" hatch="hatchFine" hatchOp={0.3} />
        <path d="M-110 -40 C-60 -70 60 -70 110 -40 L100 10 C60 -10 -60 -10 -100 10 Z" fill="#3e4a37" stroke={INK} strokeWidth={3} />
        {Array.from({length: 7}).map((_, i) => (
          <path key={i} d={`M${-140 + i * 46} 60 L${-140 + i * 46} 150`} stroke="#000" strokeWidth={4} opacity={0.6} />
        ))}
      </g>
      {/* bare bulb light from above */}
      <ellipse cx={540} cy={760} rx={700} ry={800} fill="url(#warmGlow)" opacity={0.35 + 0.04 * noise1(stepF(f, 3) * 0.3)} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Big-shoe insert: sock foot sliding into a shoe two sizes too big   */
/* ------------------------------------------------------------------ */
export const BigShoe: React.FC<{k: number; f: number}> = ({k}) => {
  return (
    <g>
      {/* floorboards */}
      <rect x={-800} y={140} width={1700} height={900} fill="#3a2a1e" />
      {Array.from({length: 8}).map((_, i) => (
        <path key={i} d={`M-800 ${150 + i * 90} H900`} stroke="#1c130c" strokeWidth={4} />
      ))}
      {/* sock foot + ankle + trouser leg, lowering into the shoe from above-left */}
      <g transform={`translate(${lerp(-260, 0, k)} ${lerp(-260, -40, k)}) rotate(${lerp(-18, 0, k)} -150 0)`}>
        <Ink d="M-250 -700 L-60 -700 L-70 -80 L-250 -60 Z" fill="#26262a" hatch="hatch" hatchOp={0.25} />
        <path d="M-250 -110 H-66" stroke="#111" strokeWidth={8} />
        <Ink d="M-240 -80 C-250 -10 -240 40 -210 60 C-120 76 40 72 150 60 C200 54 214 24 196 4 C170 -20 90 -30 0 -40 C-50 -50 -70 -70 -80 -90 Z" fill="#7a7c80" hatch="hatchFine" hatchOp={0.25} />
        <path d="M-80 -90 C-60 -40 -40 -30 0 -30" stroke="#5a5c60" strokeWidth={4} fill="none" />
      </g>
      {/* shoe (oversized oxford) */}
      <g>
        <Ink d="M-300 140 L-310 40 C-306 -40 -260 -70 -200 -70 C-120 -60 -60 -60 40 -40 C190 -20 330 20 380 80 C400 110 390 140 360 140 Z" fill="#3b2418" hatch="hatch" hatchOp={0.2} />
        <path d="M-310 120 H380" stroke="#120a06" strokeWidth={18} />
        <path d="M-60 -50 C20 -60 120 -40 170 -10" stroke="#120a06" strokeWidth={4} fill="none" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${-20 + i * 40} ${-58 + i * 6} l30 18`} stroke="#d8d0bd" strokeWidth={4} />
        ))}
        {/* newspaper stuffed in the toe */}
        <path d="M200 -10 C240 -30 290 -10 300 30 L230 40 Z" fill="#d6d0bf" stroke={INK} strokeWidth={2} opacity={k > 0.9 ? 0 : 1} />
        <path d="M-200 -70 C-180 -90 -150 -90 -120 -66" stroke="#5a3a26" strokeWidth={5} fill="none" />
      </g>
      {/* gap: how much room is left in the toe */}
      {k > 0.95 && <path d="M260 30 L370 90" stroke="#c8231b" strokeWidth={0} />}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Thief's flat: Soviet room with rug, window, armchair, TV           */
/* day 0 (night, lamp + TV) … 1 (grey morning)                         */
/* ------------------------------------------------------------------ */
export const FlatRoom: React.FC<{f: number; day?: number}> = ({f, day = 0}) => {
  const tv = 0.6 + 0.4 * hash(Math.floor(f / 6));
  return (
    <g>
      <rect x={-600} y={-200} width={2400} height={2400} fill={day > 0.5 ? '#6a6e6c' : '#2a2222'} />
      <rect x={-600} y={-200} width={2400} height={2400} fill="url(#wallpaper)" opacity={0.8} />
      {/* wall rug (classic) */}
      <g transform="translate(-60 380)">
        <rect x={0} y={0} width={620} height={440} fill="#7a1c1c" stroke={INK} strokeWidth={5} />
        <rect x={30} y={30} width={560} height={380} fill="none" stroke="#d8b25a" strokeWidth={6} />
        <path d="M310 60 L560 220 L310 380 L60 220 Z" fill="#2a1a3a" stroke="#d8b25a" strokeWidth={5} />
        <path d="M310 130 L450 220 L310 310 L170 220 Z" fill="#c8a04a" opacity={0.6} />
      </g>
      {/* window */}
      <g transform="translate(860 300)">
        <rect x={0} y={0} width={480} height={640} fill={day > 0.5 ? '#c8d0d4' : '#0d1626'} stroke={INK} strokeWidth={10} />
        <path d="M240 0 V640 M0 260 H480" stroke={INK} strokeWidth={10} />
        {day <= 0.5 &&
          Array.from({length: 18}).map((_, i) => (
            <rect key={i} x={20 + hash(i * 3) * 440} y={300 + hash(i * 5) * 320} width={20} height={26} fill="#e8a54a" opacity={hash(i + Math.floor(f / 90)) > 0.3 ? 0.8 : 0.1} />
          ))}
        {Array.from({length: 14}).map((_, i) => {
          const y = (stepF(f, 3) * 6 + i * 47) % 640;
          return <path key={i} d={`M${20 + hash(i) * 440} ${y} l-3 26`} stroke="#9fb3c8" strokeWidth={3} opacity={0.5} />;
        })}
        <rect x={-40} y={-30} width={120} height={720} fill="#4a2a24" opacity={0.95} />
        <rect x={420} y={-30} width={120} height={720} fill="#4a2a24" opacity={0.95} />
      </g>
      {/* floor */}
      <rect x={-600} y={1260} width={2400} height={900} fill={day > 0.5 ? '#5a4632' : '#2a1c12'} />
      <rect x={-600} y={1260} width={2400} height={900} fill="url(#parquet)" />
      {/* TV on a stand (glow) */}
      <g transform="translate(1180 1000)">
        <Ink d="M-160 0 L160 0 L160 230 L-160 230 Z" fill="#3a2a1c" />
        <Ink d="M-190 -230 L190 -230 L190 10 L-190 10 Z" fill="#2a2420" />
        <rect x={-160} y={-205} width={260} height={190} rx={30} fill="#7fb0d6" opacity={day > 0.5 ? 0.2 : tv} />
        <circle cx={150} cy={-150} r={14} fill="#8a7a62" stroke={INK} strokeWidth={2} />
        <circle cx={150} cy={-100} r={14} fill="#8a7a62" stroke={INK} strokeWidth={2} />
        {day <= 0.5 && <ellipse cx={-40} cy={-110} rx={700} ry={600} fill="url(#coldGlow)" opacity={0.35 * tv} />}
      </g>
      {/* floor lamp */}
      {day <= 0.5 && (
        <g transform="translate(-160 1260)">
          <path d="M0 0 V-720" stroke={INK} strokeWidth={10} />
          <Ink d="M-110 -720 L110 -720 L70 -880 L-70 -880 Z" fill="#c88a3a" />
          <ellipse cx={0} cy={-700} rx={640} ry={720} fill="url(#warmGlow)" opacity={0.5} />
        </g>
      )}
    </g>
  );
};

/** Soviet padded leatherette front door (diamond-button pattern), inner view; shake = knock jolt px; open 0..1. */
export const PaddedDoor: React.FC<{f: number; shake?: number; open?: number; daylight?: number}> = ({shake = 0, open = 0, daylight = 1}) => {
  const W0 = 520;
  const H0 = 1180;
  return (
    <g>
      {/* hallway wall */}
      <rect x={-600} y={-200} width={2400} height={2400} fill="#5d5a50" />
      <rect x={-600} y={-200} width={2400} height={2400} fill="url(#concrete)" opacity={0.5} />
      <rect x={-600} y={1300} width={2400} height={900} fill="#3a2c20" />
      <rect x={-600} y={1300} width={2400} height={900} fill="url(#parquet)" />
      {/* coat hooks */}
      <rect x={-20} y={420} width={260} height={30} fill="#3a2418" stroke={INK} strokeWidth={3} />
      <Ink d="M30 450 C-10 560 -20 820 10 1000 L180 1000 C200 820 190 560 150 450 Z" fill="#2c2f36" hatch="hatch" hatchOp={0.2} />
      {/* frame */}
      <rect x={540 - W0 / 2 - 40} y={1300 - H0 - 40} width={W0 + 80} height={H0 + 40} fill="#2a2420" stroke={INK} strokeWidth={6} />
      {/* opening: stairwell beyond */}
      <rect x={540 - W0 / 2} y={1300 - H0} width={W0} height={H0} fill="#8f9a9a" opacity={daylight} />
      {/* door leaf, swinging open toward camera-left */}
      <g transform={`translate(${540 - W0 / 2 + shake} 0) scale(${1 - open * 0.85} 1)`}>
        <rect x={0} y={1300 - H0} width={W0} height={H0} fill="#5e2a1e" stroke={INK} strokeWidth={6} />
        {Array.from({length: 6}).map((_, r) =>
          Array.from({length: 4}).map((_, c) => {
            const cx = 70 + c * 125;
            const cy = 1300 - H0 + 110 + r * 190;
            return (
              <g key={`${r}-${c}`}>
                <path d={`M${cx} ${cy - 90} L${cx + 62} ${cy} L${cx} ${cy + 90} L${cx - 62} ${cy} Z`} fill="#6d3424" stroke="#2a0f08" strokeWidth={3} />
                <circle cx={cx} cy={cy - 90} r={6} fill="#c9a24a" />
              </g>
            );
          }),
        )}
        <path d={`M14 ${1300 - H0 + 14} L${W0 - 14} ${1300 - H0 + 14} L${W0 - 14} 1286 L14 1286 Z`} fill="none" stroke="#c9a24a" strokeWidth={4} strokeDasharray="2 12" />
        {/* peephole, handle, chain */}
        <circle cx={W0 / 2} cy={1300 - H0 + 420} r={12} fill="#c9a24a" stroke={INK} strokeWidth={3} />
        <rect x={W0 - 90} y={720} width={60} height={22} rx={8} fill="#c9a24a" stroke={INK} strokeWidth={3} />
        <path d={`M${W0 - 40} 600 C${W0 + 20} 640 ${W0 + 40} 620 ${W0 + 60} 600`} stroke="#c9c4bc" strokeWidth={6} fill="none" strokeDasharray="10 4" />
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Thief's car: boxy 1970s saloon (generic, no badges), side, faces right. ~900 long, wheels on y=0. */
/* ------------------------------------------------------------------ */
export const Sedan: React.FC<{roll?: number; lights?: number; brake?: number; body?: string; rim?: string; rimOp?: number}> = ({roll = 0, lights = 0, brake = 0, body = '#8a8770', rim = '#ffb45a', rimOp = 0.6}) => (
  <g>
    <ellipse cx={0} cy={6} rx={480} ry={22} fill="#000" opacity={0.5} />
    <Ink d="M-450 -60 L-450 -170 L-300 -180 L-200 -300 L200 -300 L300 -185 L450 -170 L455 -60 L330 -60 A70 70 0 0 0 190 -60 L-190 -60 A70 70 0 0 0 -330 -60 Z" fill={body} hatch="hatch" hatchOp={0.15} />
    <path d="M-450 -150 H455" stroke="#000" strokeWidth={4} opacity={0.45} />
    {/* glass */}
    <path d="M-280 -185 L-190 -285 L-10 -285 L-10 -185 Z" fill="#1a232c" stroke={INK} strokeWidth={4} />
    <path d="M10 -185 L10 -285 L190 -285 L280 -185 Z" fill="#1a232c" stroke={INK} strokeWidth={4} />
    <path d="M-240 -195 L-180 -270" stroke="#9fb3c8" strokeWidth={6} opacity={0.35} />
    <path d="M-450 -170 L-300 -180 L-200 -300 L200 -300 L300 -185 L450 -170" stroke={rim} strokeWidth={4} fill="none" opacity={rimOp} />
    {/* chrome bumpers, handles */}
    <rect x={-470} y={-90} width={40} height={24} fill="#c9c4bc" stroke={INK} strokeWidth={3} />
    <rect x={430} y={-90} width={40} height={24} fill="#c9c4bc" stroke={INK} strokeWidth={3} />
    <rect x={-80} y={-160} width={40} height={10} fill="#c9c4bc" />
    <rect x={120} y={-160} width={40} height={10} fill="#c9c4bc" />
    {/* lights */}
    <rect x={438} y={-150} width={18} height={40} fill={lights > 0 ? '#ffe2a0' : '#d8cfb0'} stroke={INK} strokeWidth={2} />
    {lights > 0 && <polygon points="456,-130 1300,-200 1300,40 456,-110" fill="#ffe2a0" opacity={0.12 * lights} />}
    <rect x={-458} y={-150} width={16} height={36} fill="#b31d16" stroke={INK} strokeWidth={2} />
    {brake > 0 && <circle cx={-450} cy={-132} r={60} fill="url(#redGlow)" opacity={brake} />}
    {[-260, 260].map((x) => (
      <g key={x} transform={`translate(${x} -60)`}>
        <circle r={62} fill="#0a0a0a" stroke={INK} strokeWidth={4} />
        <circle r={36} fill="#9a968e" stroke={INK} strokeWidth={3} />
        <g transform={`rotate(${(roll * 180) / Math.PI})`}>
          {[0, 90].map((a) => (
            <path key={a} d="M-30 0 H30" stroke="#5a5852" strokeWidth={5} transform={`rotate(${a})`} />
          ))}
        </g>
      </g>
    ))}
  </g>
);

/* ------------------------------------------------------------------ */
/* Parking pay terminal (on a post) — wide or close                    */
/* ------------------------------------------------------------------ */
export const PayTerminal: React.FC<{f: number; screen?: string[]; card?: number; approved?: number; glow?: number}> = ({f, screen = ['PARKING', 'INSERT CARD'], card = 0, approved = 0, glow = 1}) => {
  const blink = Math.floor(f / 24) % 2 === 0;
  return (
    <g>
      <rect x={-40} y={300} width={80} height={1400} fill="#2a2e30" stroke={INK} strokeWidth={5} />
      <Ink d="M-220 -380 L220 -380 L240 340 L-240 340 Z" fill="#355a58" hatch="hatch" hatchOp={0.2} heavy={5} />
      <Ink d="M-230 -440 L230 -440 L220 -370 L-220 -370 Z" fill="#244240" />
      <text x={0} y={-393} fontFamily={F.stamp} fontSize={40} fill="#e8e2d0" textAnchor="middle" letterSpacing={12}>
        P · PAY
      </text>
      {/* LCD */}
      <rect x={-170} y={-320} width={340} height={200} rx={10} fill="#0c1410" stroke={INK} strokeWidth={5} />
      <rect x={-156} y={-306} width={312} height={172} rx={6} fill={approved > 0.5 ? '#9ae0a0' : '#7fd0a8'} opacity={0.85 * glow} />
      {screen.map((t, i) => (
        <text key={i} x={0} y={-262 + i * 52} fontFamily={F.type} fontSize={i === 0 ? 30 : 34} fill="#0c2016" textAnchor="middle">
          {t}
        </text>
      ))}
      <ellipse cx={0} cy={-220} rx={300} ry={220} fill="#7fd0a8" opacity={0.12 * glow} />
      {/* keypad */}
      {Array.from({length: 12}).map((_, i) => (
        <rect key={i} x={-130 + (i % 3) * 90} y={-80 + Math.floor(i / 3) * 62} width={70} height={46} rx={6} fill="#c9c4bc" stroke={INK} strokeWidth={3} />
      ))}
      {/* card slot */}
      <rect x={-130} y={200} width={260} height={30} rx={8} fill="#060606" stroke="#8a8a8a" strokeWidth={4} />
      <rect x={140} y={204} width={22} height={22} rx={4} fill={approved > 0.5 ? '#3ad07a' : blink ? '#ffb43a' : '#4a3a10'} />
      {card > 0 && (
        <g transform={`translate(0 ${215 + (1 - card) * 260})`}>
          <rect x={-110} y={0} width={220} height={300} fill="#1b3c7a" stroke={INK} strokeWidth={3} />
        </g>
      )}
    </g>
  );
};

/** Bank card (front), ~860 x 540 at s=1. Fictional bank, no real logos. */
export const BankCard: React.FC<{name?: string; s?: number; hl?: number}> = ({name = 'M. VOLKOV', s = 1, hl = 0}) => (
  <g transform={`scale(${s})`}>
    <rect x={-430 + 10} y={-270 + 14} width={860} height={540} rx={40} fill="#000" opacity={0.5} />
    <rect x={-430} y={-270} width={860} height={540} rx={40} fill="#1d3f80" stroke={INK} strokeWidth={6} />
    <path d="M-430 120 C-200 20 120 200 430 60 L430 230 C430 252 412 270 390 270 L-390 270 C-412 270 -430 252 -430 230 Z" fill="#163266" />
    <path d="M-300 -270 C-100 -150 200 -200 430 -120 L430 -230 C430 -252 412 -270 390 -270 Z" fill="#2a56a8" opacity={0.6} />
    <text x={-360} y={-170} fontFamily={F.stamp} fontSize={58} fill="#e8eef8" letterSpacing={6}>
      NORDBANK
    </text>
    {/* chip */}
    <rect x={-360} y={-100} width={130} height={100} rx={14} fill="#d8b25a" stroke={INK} strokeWidth={3} />
    <path d="M-360 -50 H-230 M-295 -100 V0 M-330 -100 V-50 M-260 0 V-50" stroke="#8a6a2a" strokeWidth={3} />
    <text x={-360} y={90} fontFamily={F.type} fontSize={56} fill="#e8eef8" letterSpacing={6}>
      4417 •••• •••• 9032
    </text>
    {hl > 0 && <rect x={-372} y={136} width={(name.length * 40 + 30) * hl} height={70} fill="#f4d447" opacity={0.35} />}
    <text x={-360} y={190} fontFamily={F.type} fontSize={52} fill="#e8eef8" letterSpacing={4}>
      {name}
    </text>
    <text x={200} y={190} fontFamily={F.type} fontSize={40} fill="#c8d4ea">
      09/79
    </text>
    <path d="M-400 -250 L-300 -250" stroke="#fff" strokeWidth={6} opacity={0.3} strokeLinecap="round" />
  </g>
);

export {Line};

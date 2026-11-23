import React from 'react';
import {Ink, Line, Smoke} from '../kit/fx';
import {hash, noise1, stepF} from '../kit/time';
import {Block, CONCRETE} from './soviet';

/**
 * CASE 004 set: a Soviet pawn shop ("ЛОМБАРД") and its back alley on a still, cold-blue night.
 * Snow lies everywhere but none is falling (the story says it stopped at midnight).
 * All pieces are reusable: NightSky, PawnFacade, PawnInterior, WallClock, Safe, BackWindowInside,
 * AlleyBack (+ footprints), SnowTop (top-down snow under the window), GlassShards, ClaimForm, BreathFog.
 */
const INK = '#0b0706';

/* ---------------- night sky (cold navy, moon, thin clouds) ---------------- */
export const NightSky: React.FC<{x: number; y: number; w: number; h: number; moon?: [number, number]; moonR?: number; top?: string; low?: string}> = ({
  x,
  y,
  w,
  h,
  moon = [x + w * 0.7, y + h * 0.25],
  moonR = 90,
  top = '#050a18',
  low = '#1d3352',
}) => (
  <g>
    <defs>
      <linearGradient id={`nsky${w}${h}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="1" stopColor={low} />
      </linearGradient>
    </defs>
    <rect x={x} y={y} width={w} height={h} fill={`url(#nsky${w}${h})`} />
    {Array.from({length: 40}).map((_, i) => (
      <circle key={i} cx={x + hash(i * 3.7) * w} cy={y + hash(i * 1.3) * h * 0.6} r={1 + hash(i) * 1.8} fill="#cfe0ff" opacity={0.25 + hash(i * 5) * 0.4} />
    ))}
    <circle cx={moon[0]} cy={moon[1]} r={moonR * 5} fill="url(#coldGlow)" opacity={0.55} />
    <circle cx={moon[0]} cy={moon[1]} r={moonR} fill="#dfe8f2" stroke={INK} strokeWidth={3} />
    <circle cx={moon[0] - moonR * 0.3} cy={moon[1] - moonR * 0.2} r={moonR * 0.22} fill="#b9c7d6" />
    <circle cx={moon[0] + moonR * 0.35} cy={moon[1] + moonR * 0.25} r={moonR * 0.15} fill="#b9c7d6" />
    <circle cx={moon[0] + moonR * 0.1} cy={moon[1] - moonR * 0.5} r={moonR * 0.1} fill="#b9c7d6" />
    {/* painted cloud streaks */}
    {Array.from({length: 12}).map((_, i) => (
      <rect key={i} x={x + hash(i * 2.9) * w - 200} y={y + h * 0.1 + hash(i * 4.1) * h * 0.5} width={300 + hash(i * 7) * 700} height={10 + hash(i) * 18} rx={10} fill="#0a1424" opacity={0.35 + hash(i * 3) * 0.3} />
    ))}
  </g>
);

/* ---------------- shop front (ground floor of a block), origin = bottom centre ---------------- */
export const PawnFacade: React.FC<{x: number; y: number; s?: number; f: number}> = ({x, y, s = 1, f}) => {
  const neon = hash(Math.floor(stepF(f, 6) / 6) * 1.3) > 0.92 ? 0.35 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* the block above */}
      <Block x={-700} y={-420} w={1400} floors={5} cols={12} fh={110} seed={41} lit={0.1} f={f} color="#3b4148" shade="#22262c" litColor="#ffb347" />
      {/* shop storey */}
      <Ink d="M-720 0 V-430 H720 V0 Z" fill="#2e3238" heavy={0} />
      <rect x={-720} y={-430} width={1440} height={430} fill="url(#concrete)" />
      <rect x={-720} y={-440} width={1440} height={20} fill="#1a1d21" stroke={INK} strokeWidth={3} />
      {/* sign board */}
      <Ink d="M-460 -420 H460 V-320 H-460 Z" fill="#141a20" heavy={2} />
      <text x={0} y={-345} textAnchor="middle" fontFamily="IFStamp" fontSize={78} letterSpacing={14} fill="#ffb347" opacity={neon} style={{filter: 'drop-shadow(0 0 10px #ff9a30)'}}>
        ЛОМБАРД
      </text>
      <rect x={-500} y={-460} width={1000} height={200} fill="url(#warmGlow)" opacity={0.35 * neon} />
      {/* shop window, amber inside, goods silhouettes, iron grille */}
      <rect x={-640} y={-290} width={620} height={230} fill="#c9802e" stroke={INK} strokeWidth={4} />
      <rect x={-640} y={-290} width={620} height={230} fill="url(#warmGlow)" opacity={0.6} />
      <g fill="#2a160a">
        {/* guitar */}
        <path d="M-580 -70 C-610 -80 -615 -120 -590 -135 C-600 -160 -580 -180 -560 -170 L-545 -260 L-532 -258 L-545 -168 C-525 -160 -520 -135 -535 -122 C-515 -100 -530 -66 -560 -66 Z" />
        {/* samovar */}
        <path d="M-430 -70 L-450 -90 C-470 -140 -460 -180 -420 -190 L-420 -205 L-380 -205 L-380 -190 C-340 -180 -330 -140 -350 -90 L-370 -70 Z" />
        <rect x={-410} y={-222} width={20} height={18} />
        {/* radio + clock + camera */}
        <rect x={-300} y={-150} width={130} height={80} rx={10} />
        <circle cx={-110} cy={-120} r={40} />
        <rect x={-170} y={-250} width={90} height={55} rx={6} />
        <circle cx={-125} cy={-222} r={18} fill="#c9802e" />
      </g>
      {Array.from({length: 13}).map((_, i) => (
        <rect key={i} x={-640 + i * 50} y={-290} width={7} height={230} fill="#111" />
      ))}
      <rect x={-640} y={-180} width={620} height={7} fill="#111" />
      <rect x={-650} y={-62} width={640} height={14} fill="#e4e0dc" />
      {/* door with a "closed" card and police tape */}
      <rect x={60} y={-320} width={200} height={320} fill="#1a120c" stroke={INK} strokeWidth={4} />
      <rect x={80} y={-300} width={160} height={120} fill="#7a4a1c" opacity={0.8} />
      <rect x={125} y={-260} width={70} height={40} fill="#e8e0d0" stroke={INK} strokeWidth={2} />
      <circle cx={230} cy={-150} r={8} fill="#b99a5c" />
      <path d="M40 -250 L280 -150" stroke="#e8c330" strokeWidth={22} />
      <path d="M40 -150 L280 -240" stroke="#e8c330" strokeWidth={22} />
      {/* second window */}
      <rect x={340} y={-290} width={320} height={230} fill="#2a1a10" stroke={INK} strokeWidth={4} />
      <rect x={340} y={-290} width={320} height={230} fill="#ffb347" opacity={0.25} />
      {Array.from({length: 7}).map((_, i) => (
        <rect key={i} x={340 + i * 50} y={-290} width={7} height={230} fill="#111" />
      ))}
      <rect x={330} y={-62} width={340} height={14} fill="#e4e0dc" />
      {/* snow drift on the step */}
      <path d="M-740 0 C-500 -26 -200 -16 0 -20 C300 -24 500 -14 740 0 Z" fill="#c9d3de" />
    </g>
  );
};

/* ---------------- shop interior wall: shelves of pawned goods + counter cage ---------------- */
export const PawnInterior: React.FC<{f: number; clock?: boolean}> = ({f, clock = true}) => (
  <g>
    <rect x={-600} y={-400} width={2600} height={2800} fill="#3a2c1e" />
    <rect x={-600} y={-400} width={2600} height={2800} fill="url(#wallpaper)" />
    {/* three shelf runs */}
    {[520, 860, 1200].map((sy, r) => (
      <g key={sy}>
        <rect x={-500} y={sy} width={2400} height={22} fill="#2a1a0e" stroke={INK} strokeWidth={3} />
        {Array.from({length: 16}).map((_, i) => {
          const k = r * 31 + i;
          const ix = -460 + i * 150 + hash(k) * 40;
          const typ = Math.floor(hash(k * 3.3) * 6);
          const c = ['#6a4a2a', '#4a4f55', '#7a5a30', '#3a3028', '#8a6a3a', '#556070'][typ];
          return (
            <g key={i}>
              {typ === 0 && <Ink d={`M${ix} ${sy} V${sy - 90} H${ix + 110} V${sy} Z`} fill={c} w={2.6} heavy={2} />}
              {typ === 1 && <Ink d={`M${ix + 10} ${sy} C${ix} ${sy - 70} ${ix + 20} ${sy - 120} ${ix + 55} ${sy - 120} C${ix + 90} ${sy - 120} ${ix + 110} ${sy - 70} ${ix + 100} ${sy} Z`} fill={c} w={2.6} heavy={2} />}
              {typ === 2 && <Ink d={`M${ix} ${sy} V${sy - 60} H${ix + 120} V${sy} Z M${ix + 20} ${sy - 60} V${sy - 110} H${ix + 100} V${sy - 60} Z`} fill={c} w={2.6} heavy={2} />}
              {typ === 3 && <Ink d={`M${ix + 30} ${sy} L${ix + 20} ${sy - 140} H${ix + 80} L${ix + 70} ${sy} Z`} fill={c} w={2.6} heavy={2} />}
              {typ === 4 && <circle cx={ix + 55} cy={sy - 50} r={48} fill={c} stroke={INK} strokeWidth={3} />}
              {typ === 5 && <Ink d={`M${ix} ${sy} V${sy - 75} H${ix + 130} V${sy} Z`} fill={c} w={2.6} heavy={2} hatch="hatchFine" hatchOp={0.3} />}
              <rect x={ix + 30} y={sy - 30} width={26} height={16} fill="#e4dccb" stroke={INK} strokeWidth={1.6} opacity={0.85} />
            </g>
          );
        })}
      </g>
    ))}
    {clock && <WallClock x={1500} y={260} r={95} h={2} m={0} f={f} />}
    {/* counter with brass cage */}
    <Ink d="M-600 1450 H2000 V2400 H-600 Z" fill="#2a1a10" heavy={0} hatch="hatch" hatchOp={0.2} />
    <rect x={-600} y={1430} width={2600} height={30} fill="#4a3020" stroke={INK} strokeWidth={3} />
    {Array.from({length: 30}).map((_, i) => (
      <rect key={i} x={-600 + i * 90} y={1250} width={8} height={190} fill="#8a6a30" stroke={INK} strokeWidth={1.4} />
    ))}
    <rect x={-600} y={1244} width={2600} height={10} fill="#8a6a30" stroke={INK} strokeWidth={1.4} />
    {/* hanging bulbs */}
    {[200, 1100].map((bx, i) => {
      const fl = hash(Math.floor(stepF(f, 5) / 5) + i * 7) > 0.94 ? 0.6 : 1;
      return (
        <g key={bx}>
          <line x1={bx} y1={-400} x2={bx} y2={120} stroke={INK} strokeWidth={3} />
          <circle cx={bx} cy={140} r={26} fill="#ffd08a" opacity={fl} stroke={INK} strokeWidth={3} />
          <circle cx={bx} cy={140} r={420} fill="url(#warmGlow)" opacity={0.5 * fl} />
        </g>
      );
    })}
  </g>
);

/* ---------------- wall clock (h, m in clock units; second hand ticks) ---------------- */
export const WallClock: React.FC<{x: number; y: number; r: number; h: number; m: number; f: number; sec?: boolean}> = ({x, y, r, h, m, f, sec = true}) => {
  const hA = ((h % 12) + m / 60) * 30;
  const mA = m * 6;
  const sA = Math.floor(f / 60) * 6 + 12;
  return (
    <g>
      <circle cx={x + 10} cy={y + 14} r={r * 1.12} fill="#000" opacity={0.4} />
      <circle cx={x} cy={y} r={r * 1.12} fill="#4a2e18" stroke={INK} strokeWidth={4} />
      <circle cx={x} cy={y} r={r} fill="#e8dcc0" stroke={INK} strokeWidth={3} />
      {Array.from({length: 12}).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return <line key={i} x1={x + Math.sin(a) * r * 0.8} y1={y - Math.cos(a) * r * 0.8} x2={x + Math.sin(a) * r * 0.93} y2={y - Math.cos(a) * r * 0.93} stroke={INK} strokeWidth={i % 3 ? r * 0.03 : r * 0.06} />;
      })}
      <line x1={x} y1={y} x2={x + Math.sin((hA * Math.PI) / 180) * r * 0.5} y2={y - Math.cos((hA * Math.PI) / 180) * r * 0.5} stroke={INK} strokeWidth={r * 0.08} strokeLinecap="round" />
      <line x1={x} y1={y} x2={x + Math.sin((mA * Math.PI) / 180) * r * 0.78} y2={y - Math.cos((mA * Math.PI) / 180) * r * 0.78} stroke={INK} strokeWidth={r * 0.05} strokeLinecap="round" />
      {sec && <line x1={x} y1={y} x2={x + Math.sin((sA * Math.PI) / 180) * r * 0.85} y2={y - Math.cos((sA * Math.PI) / 180) * r * 0.85} stroke="#b0201a" strokeWidth={r * 0.018} />}
      <circle cx={x} cy={y} r={r * 0.06} fill="#b0201a" stroke={INK} strokeWidth={2} />
      <path d={`M${x - r * 0.9} ${y - r * 0.2} A${r * 0.92} ${r * 0.92} 0 0 1 ${x - r * 0.2} ${y - r * 0.9}`} stroke="#fff" strokeWidth={r * 0.05} fill="none" opacity={0.4} />
    </g>
  );
};

/* ---------------- steel safe, door swung open, empty; origin = bottom centre ---------------- */
export const Safe: React.FC<{x: number; y: number; s?: number; open?: number}> = ({x, y, s = 1, open = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={8} rx={340} ry={30} fill="#000" opacity={0.5} />
    {/* body */}
    <Ink d="M-260 0 V-640 H260 V0 Z" fill="#3a4044" w={4} heavy={5} hatch="hatch" hatchOp={0.15} />
    <rect x={-250} y={-630} width={500} height={14} fill="#5a6266" />
    {/* empty interior */}
    <Ink d="M-210 -40 V-590 H210 V-40 Z" fill="#121416" heavy={0} />
    <rect x={-210} y={-590} width={420} height={550} fill="url(#hatchFine)" opacity={0.35} />
    {[-420, -250].map((sy) => (
      <g key={sy}>
        <rect x={-210} y={sy} width={420} height={14} fill="#2c3236" stroke={INK} strokeWidth={2} />
        <rect x={-210} y={sy + 14} width={420} height={20} fill="#000" opacity={0.4} />
      </g>
    ))}
    {/* a lone torn cash band on the bottom shelf */}
    <path d="M-60 -60 h70 l6 -12 l8 12 h20 v10 h-104 Z" fill="#c8b070" stroke={INK} strokeWidth={2} />
    {/* door (perspective swing to the left) */}
    <g transform={`translate(-260 0) scale(${1 - open * 0.55} 1)`}>
      <Ink d="M0 0 V-640 L-480 -610 V-30 Z" fill="#4a5256" w={4} heavy={3} />
      <path d="M-40 -60 V-580 L-440 -556 V-74 Z" fill="#3a4044" stroke={INK} strokeWidth={3} />
      <circle cx={-240} cy={-330} r={64} fill="#8a8e88" stroke={INK} strokeWidth={4} />
      <circle cx={-240} cy={-330} r={20} fill="#2a2e30" stroke={INK} strokeWidth={3} />
      {Array.from({length: 12}).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={-240 + Math.cos(a) * 46} y1={-330 + Math.sin(a) * 46} x2={-240 + Math.cos(a) * 60} y2={-330 + Math.sin(a) * 60} stroke={INK} strokeWidth={3} />;
      })}
      <rect x={-320} y={-180} width={160} height={24} rx={8} fill="#b99a5c" stroke={INK} strokeWidth={3} />
    </g>
    {/* hinges */}
    {[-560, -100].map((hy) => (
      <rect key={hy} x={-276} y={hy} width={22} height={60} fill="#222" stroke={INK} strokeWidth={2} />
    ))}
  </g>
);

/* ---------------- broken back window seen from inside (moonlight pours in) ---------------- */
export const BackWindowInside: React.FC<{f: number}> = ({f}) => {
  const sway = noise1(stepF(f, 6) * 0.03) * 18;
  return (
    <g>
      <rect x={-600} y={-400} width={2400} height={2800} fill="#23272c" />
      <rect x={-600} y={-400} width={2400} height={2800} fill="url(#concrete)" />
      {/* window opening: night outside */}
      <rect x={290} y={520} width={500} height={640} fill="#0c1628" />
      <rect x={290} y={520} width={500} height={640} fill="url(#coldGlow)" opacity={0.6} />
      <Block x={150} y={1260} w={700} floors={6} cols={8} fh={90} seed={51} lit={0.12} f={f} color="#17202b" shade="#0e141c" litColor="#ffb347" snow />
      {/* moon shafts across the room */}
      <polygon points="290,520 790,520 1300,2000 -200,2000" fill="#9fc4ff" opacity={0.1} />
      <polygon points="420,520 640,520 900,2000 100,2000" fill="#cfe6ff" opacity={0.08} />
      {/* frame + muntins */}
      <Ink d="M270 500 H810 V1180 H270 Z M290 520 V1160 H790 V520 Z" fill="#3a2e22" heavy={3} />
      <rect x={530} y={520} width={20} height={640} fill="#3a2e22" stroke={INK} strokeWidth={3} />
      <rect x={290} y={830} width={500} height={20} fill="#3a2e22" stroke={INK} strokeWidth={3} />
      {/* remaining jagged glass (upper right pane intact, lower left smashed) */}
      <path d="M550 520 H790 V830 H550 Z" fill="#9fc4ff" opacity={0.18} />
      <path d="M550 520 H790 V830 H550 Z" fill="none" stroke="#dfeeff" strokeWidth={2} opacity={0.4} />
      <path d="M290 520 H530 V640 L470 600 L430 700 L380 610 L330 690 L290 640 Z" fill="#9fc4ff" opacity={0.35} stroke="#e6f2ff" strokeWidth={2.4} />
      <path d="M290 850 H530 V900 L480 960 L450 880 L400 1000 L350 900 L290 980 Z" fill="#9fc4ff" opacity={0.35} stroke="#e6f2ff" strokeWidth={2.4} />
      <path d="M550 850 H790 V1160 H550 Z" fill="#9fc4ff" opacity={0.15} />
      {/* clean sill inside: no glass here */}
      <rect x={250} y={1180} width={580} height={30} fill="#4a3c2e" stroke={INK} strokeWidth={3} />
      {/* curtain moving in the draught */}
      <Ink d={`M800 460 C${830 + sway} 700 ${850 + sway * 1.5} 950 ${830 + sway * 2} 1250 L960 1250 C${950 + sway} 900 940 700 960 460 Z`} fill="#5a2a22" heavy={2} hatch="hatchV" hatchOp={0.3} />
      <rect x={200} y={440} width={820} height={24} rx={8} fill="#2a2018" stroke={INK} strokeWidth={3} />
      {/* floor */}
      <rect x={-600} y={1600} width={2400} height={900} fill="#1a1410" />
      <rect x={-600} y={1600} width={2400} height={900} fill="url(#parquet)" />
    </g>
  );
};

/* ---------------- back alley: shop's rear wall, open back door, broken window, smooth snow ---------------- */
/** World: x −300..2600. Wall base y = 1350; snow from 1350 to 2400. Window x 1150–1450, sill y 1080. Door x 480–700. */
export const AlleyBack: React.FC<{f: number; door?: number; prints?: number; glass?: number; moon?: boolean}> = ({f, door = 1, prints = 0, glass = 1, moon = true}) => (
  <g>
    <NightSky x={-1200} y={-1200} w={5200} h={2600} moon={[1900, -200]} moonR={110} />
    {/* back blocks */}
    <Block x={-900} y={700} w={900} floors={10} cols={10} fh={100} seed={61} lit={0.1} f={f} color="#1e2732" shade="#121820" litColor="#ffb347" />
    <Block x={2500} y={700} w={900} floors={10} cols={10} fh={100} seed={63} lit={0.12} f={f} color="#1e2732" shade="#121820" litColor="#ffb347" />
    {/* rear wall of the shop block */}
    <Ink d="M-300 1350 V-200 H2500 V1350 Z" fill="#3a434e" heavy={0} />
    <rect x={-300} y={-200} width={2800} height={1550} fill="url(#concrete)" />
    <rect x={-300} y={-200} width={2800} height={1550} fill="#0a1830" opacity={0.35} />
    {Array.from({length: 14}).map((_, i) => (
      <rect key={i} x={-300 + hash(i * 5.3) * 2800} y={-200 + hash(i) * 400} width={4 + hash(i) * 9} height={600 + hash(i * 2) * 700} fill="#000" opacity={0.14} />
    ))}
    {[-200, 400, 1000, 1600, 2200].map((px) => (
      <line key={px} x1={px} y1={-200} x2={px} y2={1350} stroke={INK} strokeWidth={2} opacity={0.35} />
    ))}
    {/* upper storey windows */}
    {[0, 500, 1700, 2150].map((wx, i) => (
      <g key={wx}>
        <rect x={wx} y={150} width={180} height={260} fill={i === 2 ? '#ffb347' : '#0d1218'} stroke={INK} strokeWidth={3} />
        {i === 2 && <rect x={wx - 100} y={60} width={380} height={440} fill="url(#warmGlow)" opacity={0.4} />}
        <rect x={wx - 8} y={410} width={196} height={12} fill="#d6e0ea" />
      </g>
    ))}
    {/* drain pipe */}
    <rect x={960} y={-200} width={34} height={1550} fill="#2a2f34" stroke={INK} strokeWidth={3} />
    {[150, 600, 1050].map((py) => (
      <rect key={py} x={950} y={py} width={54} height={18} fill="#1c2024" stroke={INK} strokeWidth={2} />
    ))}
    {/* back door, open, warm light spilling onto the snow */}
    <polygon points="480,1350 700,1350 900,1900 240,1900" fill="#ffb347" opacity={0.22 * door} />
    <rect x={480} y={940} width={220} height={410} fill={door > 0 ? '#c9802e' : '#1a120c'} stroke={INK} strokeWidth={4} />
    <rect x={480} y={940} width={220} height={410} fill="url(#warmGlow)" opacity={0.7 * door} />
    <g transform={`translate(480 0) scale(${1 - door * 0.7} 1)`}>
      <Ink d="M0 940 H220 V1350 H0 Z" fill="#3a2a1c" heavy={0} hatch="hatchV" hatchOp={0.3} />
      <circle cx={190} cy={1150} r={9} fill="#b99a5c" />
    </g>
    <rect x={460} y={920} width={260} height={24} fill="#22262a" stroke={INK} strokeWidth={3} />
    <circle cx={590} cy={890} r={16} fill="#ffd08a" stroke={INK} strokeWidth={2} />
    <circle cx={590} cy={890} r={160} fill="url(#warmGlow)" opacity={0.5} />
    {/* THE broken window (dark inside, jagged edges, frame) */}
    <rect x={1150} y={760} width={300} height={320} fill="#07090c" />
    <Ink d="M1130 740 H1470 V1100 H1130 Z M1150 760 V1080 H1450 V760 Z" fill="#2c241c" heavy={3} />
    <rect x={1290} y={760} width={16} height={320} fill="#2c241c" stroke={INK} strokeWidth={2.5} />
    <path d="M1306 760 H1450 V1080 H1306 Z" fill="#9fc4ff" opacity={0.22} />
    <path d="M1310 770 L1440 1070" stroke="#e6f2ff" strokeWidth={3} opacity={0.35} />
    <path d="M1150 760 H1290 V830 L1250 800 L1220 870 L1185 810 L1150 860 Z" fill="#9fc4ff" opacity={0.4} stroke="#e6f2ff" strokeWidth={2.4} />
    <path d="M1150 1080 H1290 V1030 L1260 1050 L1240 990 L1200 1060 L1170 1010 L1150 1040 Z" fill="#9fc4ff" opacity={0.4} stroke="#e6f2ff" strokeWidth={2.4} />
    <rect x={1120} y={1100} width={360} height={24} fill="#d6e0ea" stroke={INK} strokeWidth={2} />
    {/* bins */}
    <Ink d="M1800 1350 L1820 1150 H2020 L2040 1350 Z" fill="#26313a" heavy={2} hatch="hatchV" hatchOp={0.3} />
    <path d="M1800 1150 C1850 1120 1990 1120 2040 1150 L2040 1162 H1800 Z" fill="#d6e0ea" stroke={INK} strokeWidth={2} />
    {/* snow: one smooth sheet (no tracks), drift against the wall */}
    <rect x={-1200} y={1340} width={5200} height={1300} fill="#aebccb" />
    <path d="M-1200 1340 C-600 1300 0 1330 600 1316 C1200 1300 1800 1326 2500 1310 C3200 1300 3600 1330 4000 1320 V1380 H-1200 Z" fill="#cdd8e4" />
    <rect x={-1200} y={1380} width={5200} height={1260} fill="url(#fadeDown)" opacity={0.25} />
    {Array.from({length: 18}).map((_, i) => (
      <ellipse key={i} cx={-800 + hash(i * 3.3) * 4400} cy={1420 + hash(i * 5.1) * 700} rx={80 + hash(i) * 200} ry={6 + hash(i * 2) * 10} fill="#8697aa" opacity={0.3} />
    ))}
    {/* the glass lying ON the snow, fanned out from the wall */}
    {glass > 0 && <GlassShards cx={1300} cy={1430} spread={300} depth={190} n={46} f={f} op={glass} seed={4} />}
    {/* IF's own boot prints from the door (stop short of the window) */}
    {prints > 0 && <Prints from={[620, 1450]} to={[1060, 1620]} n={8} upto={prints} />}
  </g>
);

/** Boot prints along a line; upto = how many are visible (fractional fades the last). */
export const Prints: React.FC<{from: [number, number]; to: [number, number]; n: number; upto: number; s?: number; color?: string}> = ({from, to, n, upto, s = 1, color = '#5f7186'}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const k = i / (n - 1);
      const vis = Math.max(0, Math.min(1, upto - i));
      if (vis <= 0) return null;
      const x = from[0] + (to[0] - from[0]) * k;
      const y = from[1] + (to[1] - from[1]) * k + (i % 2 ? 18 : -18) * s;
      const ang = (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI;
      return (
        <g key={i} transform={`translate(${x} ${y}) rotate(${ang}) scale(${s})`} opacity={vis}>
          <ellipse cx={0} cy={0} rx={30} ry={13} fill={color} opacity={0.85} />
          <ellipse cx={-34} cy={0} rx={13} ry={11} fill={color} opacity={0.85} />
          <ellipse cx={0} cy={-4} rx={26} ry={6} fill="#2e3a48" opacity={0.35} />
        </g>
      );
    })}
  </g>
);

/** Glass shards resting on snow (perspective fan), with stepped glints. */
export const GlassShards: React.FC<{cx: number; cy: number; spread: number; depth: number; n?: number; f: number; op?: number; seed?: number; scale?: number}> = ({cx, cy, spread, depth, n = 40, f, op = 1, seed = 1, scale = 1}) => {
  const gl = Math.floor(stepF(f, 6) / 6);
  return (
    <g opacity={op}>
      {Array.from({length: n}).map((_, i) => {
        const a = hash(i * 1.7 + seed);
        const r = Math.pow(hash(i * 2.9 + seed), 0.7);
        const x = cx + (a - 0.5) * spread * 2 * (0.4 + r * 0.6);
        const y = cy + r * depth - depth * 0.15;
        const sz = (8 + hash(i * 4.3 + seed) * 22) * scale;
        const rot = hash(i * 6.1) * 180;
        const glint = hash(i * 9.7 + gl * 3.1) > 0.86;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(1 0.45)`}>
            <ellipse cx={sz * 0.2} cy={sz * 0.6} rx={sz * 0.9} ry={sz * 0.35} fill="#5f7186" opacity={0.35} />
            <path d={`M${-sz} 0 L${-sz * 0.2} ${-sz * 0.7} L${sz} ${-sz * 0.1} L${sz * 0.3} ${sz * 0.6} Z`} fill="#bcd9f5" opacity={0.6} stroke="#0b0706" strokeWidth={1.6} />
            <path d={`M${-sz * 0.6} -2 L${sz * 0.6} ${-sz * 0.2}`} stroke="#ffffff" strokeWidth={2} opacity={0.7} />
            {glint && (
              <g transform="scale(1 2.2)">
                <path d={`M0 ${-sz * 1.2} L${sz * 0.12} 0 L0 ${sz * 1.2} L${-sz * 0.12} 0 Z M${-sz * 1.2} 0 L0 ${sz * 0.12} L${sz * 1.2} 0 L0 ${-sz * 0.12} Z`} fill="#ffffff" />
                <circle cx={0} cy={0} r={sz * 0.9} fill="url(#coldGlow)" />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

/* ---------------- top-down snow under the window ---------------- */
/** World 0..1080 x 0..1920 (designed for zoom ~1). Wall edge along the top (y < 300). */
export const SnowTop: React.FC<{f: number; prints?: number; glass?: number; beam?: [number, number, number]}> = ({f, prints = 0, glass = 1, beam}) => (
  <g>
    <rect x={-800} y={-800} width={2700} height={3600} fill="#b4c3d2" />
    {/* wind ripples in the crust */}
    {Array.from({length: 26}).map((_, i) => (
      <path
        key={i}
        d={`M${-400 + hash(i * 3.1) * 1600} ${200 + hash(i * 1.7) * 2400} c120 -14 260 -10 380 6`}
        stroke="#8a9bb0"
        strokeWidth={4 + hash(i) * 6}
        fill="none"
        opacity={0.35}
        strokeLinecap="round"
      />
    ))}
    {Array.from({length: 120}).map((_, i) => (
      <circle key={`s${i}`} cx={-400 + hash(i * 7.7) * 1900} cy={-200 + hash(i * 3.9) * 2900} r={1.4 + hash(i) * 2} fill="#ffffff" opacity={0.3 + 0.5 * hash(i + Math.floor(stepF(f, 8) / 8) * 0.37)} />
    ))}
    {/* wall + sill shadow along the top */}
    <rect x={-800} y={-800} width={2700} height={1060} fill="#2c3440" />
    <rect x={-800} y={-800} width={2700} height={1060} fill="url(#concrete)" />
    <rect x={-800} y={240} width={2700} height={26} fill="#d6e0ea" stroke={INK} strokeWidth={3} />
    <rect x={-800} y={266} width={2700} height={70} fill="#5f7186" opacity={0.45} />
    <rect x={300} y={160} width={480} height={80} fill="#07090c" stroke={INK} strokeWidth={3} />
    {/* glass, flat on top of the crust, fanned away from the wall */}
    {glass > 0 && <GlassShards cx={540} cy={420} spread={330} depth={520} n={60} f={f} op={glass} seed={9} scale={1.5} />}
    {/* IF's prints come in from the bottom-left and stop well short */}
    {prints > 0 && <Prints from={[-120, 2100]} to={[300, 1350]} n={7} upto={prints} s={1.8} />}
    {beam && <circle cx={beam[0]} cy={beam[1]} r={beam[2]} fill="#fff6dc" opacity={0.18} style={{mixBlendMode: 'screen'}} />}
  </g>
);

/* ---------------- insurance claim form ---------------- */
export const ClaimForm: React.FC<{circle?: number}> = ({circle = 0}) => {
  const lines: [string, string][] = [
    ['CLAIMANT', 'OWNER, PAWN SHOP No. 7'],
    ['INCIDENT', 'BURGLARY, 02:00'],
    ['ENTRY POINT', 'BACK WINDOW'],
    ['STOLEN FROM SAFE', '48 000 ROUBLES'],
    ['WITNESSES', 'NONE'],
  ];
  return (
    <g>
      <rect x={-300} y={-300} width={1700} height={2600} fill="#2a1c12" />
      <rect x={-300} y={-300} width={1700} height={2600} fill="url(#hatchWide)" opacity={0.22} />
      <g transform="rotate(4 540 960)">
        <rect x={120} y={360} width={860} height={1180} fill="#000" opacity={0.5} transform="translate(18 24)" />
        <Ink d="M120 360 H980 V1540 H120 Z" fill="#e4dcc4" heavy={0} w={3} />
        <rect x={120} y={360} width={860} height={1180} fill="url(#concrete)" opacity={0.35} />
        <text x={160} y={450} fontFamily="IFType" fontSize={30} fill="#3a2a1a">
          ГОССТРАХ · STATE INSURANCE
        </text>
        <text x={160} y={510} fontFamily="IFType" fontSize={46} fill="#1a120c">
          CLAIM FOR LOSS
        </text>
        <line x1={160} y1={540} x2={940} y2={540} stroke="#2a1f16" strokeWidth={3} />
        {lines.map(([k, v], i) => (
          <g key={k}>
            <text x={160} y={630 + i * 120} fontFamily="IFType" fontSize={30} fill="#5a4a3a">
              {k}:
            </text>
            <text x={160} y={676 + i * 120} fontFamily="IFType" fontSize={42} fill="#1a120c">
              {v}
            </text>
          </g>
        ))}
        {/* signature + date */}
        <path d="M200 1380 C240 1330 260 1400 300 1350 C330 1310 340 1400 380 1360 C420 1320 460 1380 520 1350" stroke="#1a2a6a" strokeWidth={5} fill="none" strokeLinecap="round" />
        <text x={620} y={1390} fontFamily="IFType" fontSize={34} fill="#3a2a1a">
          FILED 08:15
        </text>
        {circle > 0 && (
          <path
            d="M140 990 C170 940 620 930 700 980 C760 1030 690 1080 430 1088 C230 1094 130 1066 150 1006"
            fill="none"
            stroke="#d01c14"
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={1500}
            strokeDashoffset={1500 * (1 - circle)}
          />
        )}
        {/* pen */}
        <g transform="translate(780 1240) rotate(-35)">
          <rect x={0} y={-12} width={300} height={24} rx={10} fill="#1a1a1a" stroke={INK} strokeWidth={2} />
          <path d="M0 -12 L-40 0 L0 12 Z" fill="#b99a5c" stroke={INK} strokeWidth={2} />
        </g>
      </g>
    </g>
  );
};

/** Breath fog: a soft puff every ~1.6 s from a mouth point, drifting forward (stepped). */
export const BreathFog: React.FC<{f: number; x: number; y: number; dir?: number; s?: number; period?: number; op?: number}> = ({f, x, y, dir = 1, s = 1, period = 96, op = 0.5}) => {
  const sf = stepF(f, 4);
  const k = (sf % period) / period;
  if (k > 0.55) return null;
  const a = k / 0.55;
  return (
    <g opacity={op * (1 - a) * Math.min(1, a * 6)} style={{filter: 'blur(4px)'}}>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + dir * (20 + a * 110 + i * 26) * s} cy={y - (a * 30 + i * 8) * s} r={(14 + a * 36 + i * 6) * s} fill="#e6eef6" />
      ))}
    </g>
  );
};

export {CONCRETE, Line, Smoke};

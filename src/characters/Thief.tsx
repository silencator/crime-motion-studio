import React from 'react';
import {Ink, Line} from '../kit/fx';

/**
 * CASE 003 thief (reusable as any lean side-view NPC): full-body side rig facing screen-right.
 * Feet on y = 0, ~940 units tall. Same FK approach as IFBody (stepped phase for cel motion).
 *
 *  phase   walk-cycle angle (radians)     walk  0 stand … 1 full stride
 *  mask    black balaclava on (eye slit)  bag   duffel bag in the back hand (0 none, 1 empty, 2 full)
 *  cuffed  hands cuffed behind the back   big   oversized shoes ("two sizes too big")
 *  rim     rim-light colour (back edge)   dark  silhouette amount 0..1
 */
export type ThiefProps = {phase?: number; walk?: number; mask?: boolean; bag?: 0 | 1 | 2; cuffed?: boolean; big?: boolean; rim?: string; rimOp?: number; dark?: number; hunch?: number};

type P = [number, number];
const rot = (v: P, deg: number): P => {
  const r = (deg * Math.PI) / 180;
  return [v[0] * Math.cos(r) - v[1] * Math.sin(r), v[0] * Math.sin(r) + v[1] * Math.cos(r)];
};
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];
const circ = (x: number, y: number, r: number) => `M${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} Z`;
const limb = (a: P, b: P, w1: number, w2: number) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  return [`M${a[0] + nx * w1} ${a[1] + ny * w1} L${b[0] + nx * w2} ${b[1] + ny * w2} L${b[0] - nx * w2} ${b[1] - ny * w2} L${a[0] - nx * w1} ${a[1] - ny * w1} Z`, circ(a[0], a[1], w1), circ(b[0], b[1], w2)];
};
const INK = '#0b0706';
const Limb: React.FC<{d: string[]; fill: string; outline?: boolean}> = ({d, fill, outline = true}) => (
  <g>
    {outline && d.map((p, i) => <path key={`o${i}`} d={p} fill={INK} stroke={INK} strokeWidth={7} strokeLinejoin="round" />)}
    {d.map((p, i) => (
      <path key={i} d={p} fill={fill} />
    ))}
  </g>
);

const COL = {jacket: '#1f1d1f', jacketShade: '#111012', trousers: '#2a2a2e', trousersShade: '#18181b', shoe: '#2b1d14', skin: '#c9997c', skinShade: '#94674f', glove: '#141313', beanie: '#141416', bag: '#191a1c'};

export const ThiefBody: React.FC<ThiefProps> = ({phase = 0, walk = 1, mask = false, bag = 0, cuffed = false, big = false, rim = '#ffb45a', rimOp = 0.6, dark = 0, hunch = 0}) => {
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  const Wk = walk;
  const bob = -Math.abs(Math.cos(phase)) * 14 * Wk + 7 * Wk;
  const hip: P = [0, -450 + bob];
  const leg = (ph: number) => {
    const ss = Math.sin(ph);
    const cc = Math.cos(ph);
    const th = 24 * ss * Wk;
    const kn = (4 + 36 * Math.pow(Math.max(0, cc), 1.4)) * Wk + 3;
    const k = add(hip, rot([0, 232], -th));
    const an = add(k, rot([0, 220], -th + kn));
    return {k, an, foot: (-th + kn) * 0.35 * Wk};
  };
  const front = leg(phase);
  const back = leg(phase + Math.PI);
  const sh: P = [12 + hunch * 30, -790 + bob + hunch * 20];
  const arm = (ph: number) => {
    const sw = -22 * Math.sin(ph) * Wk;
    const el = add(sh, rot([0, 190], sw));
    const ha = add(el, rot([0, 175], sw - 14 - 10 * Wk));
    return {el, ha};
  };
  const aF = cuffed ? {el: add(sh, rot([0, 190], 28)), ha: add(sh, [-110, 300])} : arm(phase + Math.PI);
  const aB = cuffed ? {el: add(sh, rot([0, 190], 22)), ha: add(sh, [-100, 306])} : arm(phase);
  const shoeL = big ? 1.5 : 1;
  const Foot: React.FC<{an: P; a: number; fill: string}> = ({an, a, fill}) => (
    <g transform={`translate(${an[0]} ${an[1]}) rotate(${a})`}>
      <Ink d={`M-30 -12 C-34 18 -26 34 -18 40 L${110 * shoeL} 40 C${118 * shoeL} 40 ${124 * shoeL} 28 ${116 * shoeL} 14 C${90 * shoeL} -2 ${40 * shoeL} -6 22 -16 Z`} fill={fill} w={3} heavy={0} />
      <path d={`M-20 34 L${114 * shoeL} 34`} stroke="#0d0907" strokeWidth={7} />
      {big && <path d={`M${60 * shoeL} 4 C${74 * shoeL} 8 ${86 * shoeL} 14 ${92 * shoeL} 22`} stroke="#5a4232" strokeWidth={3} fill="none" />}
    </g>
  );
  const headY = sh[1] - 120;
  const headX = sh[0] + 26 + hunch * 30;
  return (
    <g>
      {/* back arm + leg (darker) */}
      {!cuffed && <Limb d={[...limb(sh, aB.el, 34, 28), ...limb(aB.el, aB.ha, 28, 22)]} fill={COL.jacketShade} />}
      {!cuffed && bag > 0 && (
        <g transform={`translate(${aB.ha[0]} ${aB.ha[1] + 20}) rotate(${-Math.sin(phase) * 6 * Wk})`}>
          <path d="M-14 -14 C-6 -40 6 -40 14 -14" stroke={INK} strokeWidth={8} fill="none" />
          <Ink d={bag === 2 ? 'M-130 0 C-140 70 -120 150 -60 160 L70 160 C130 150 140 70 130 0 Z' : 'M-110 0 C-118 50 -100 110 -60 120 L60 120 C100 110 118 50 110 0 Z'} fill={COL.bag} hatch="hatch" hatchOp={0.2} />
          <path d="M-100 30 H100" stroke="#3a3a40" strokeWidth={4} />
        </g>
      )}
      <Limb d={[...limb(hip, back.k, 46, 38), ...limb(back.k, back.an, 38, 30)]} fill={COL.trousersShade} />
      <Foot an={back.an} a={back.foot} fill="#1f150e" />
      {/* torso: hooded short jacket */}
      <Ink
        d={`M${hip[0] - 70} ${hip[1] + 40} C${hip[0] - 90} ${hip[1] - 120} ${sh[0] - 110} ${sh[1] + 80} ${sh[0] - 70} ${sh[1] - 10} C${sh[0] - 30} ${sh[1] - 50} ${sh[0] + 60} ${sh[1] - 50} ${sh[0] + 86} ${sh[1] + 10} C${sh[0] + 110} ${sh[1] + 120} ${hip[0] + 100} ${hip[1] - 120} ${hip[0] + 84} ${hip[1] + 40} Z`}
        fill={COL.jacket}
        hatch="hatch"
        hatchOp={0.2}
      />
      <path d={`M${sh[0] - 80} ${sh[1] + 30} C${sh[0] - 104} ${sh[1] + 160} ${hip[0] - 84} ${hip[1] - 80} ${hip[0] - 66} ${hip[1] + 36}`} stroke={rim} strokeWidth={5} fill="none" opacity={rimOp} />
      <path d={`M${hip[0] - 76} ${hip[1] + 10} H${hip[0] + 90}`} stroke="#000" strokeWidth={10} opacity={0.5} />
      {/* front leg */}
      <Limb d={[...limb(hip, front.k, 46, 38), ...limb(front.k, front.an, 38, 30)]} fill={COL.trousers} />
      <Foot an={front.an} a={front.foot} fill={COL.shoe} />
      {/* head */}
      <g transform={`translate(${headX} ${headY})`}>
        <Ink d="M-26 100 L-30 40 L34 40 L30 100 Z" fill={mask ? COL.beanie : COL.skinShade} heavy={0} />
        {mask ? (
          <g>
            <Ink d="M-70 -10 C-80 -90 -20 -130 30 -120 C80 -110 100 -60 96 -10 C110 0 112 16 98 22 C96 60 70 86 20 90 C-30 92 -70 60 -70 -10 Z" fill={COL.beanie} hatch="hatchFine" hatchOp={0.25} />
            <path d="M28 -28 C50 -36 80 -34 98 -22 L96 -2 C76 -10 50 -12 28 -6 Z" fill={COL.skin} stroke={INK} strokeWidth={2.4} />
            <circle cx={70} cy={-16} r={6} fill="#0a0604" />
            <path d="M-70 -10 C-80 -90 -20 -130 30 -120" stroke={rim} strokeWidth={4} fill="none" opacity={rimOp} />
          </g>
        ) : (
          <g>
            <Ink d="M-60 -10 C-66 -90 -10 -120 36 -112 C78 -104 98 -66 96 -30 C104 -22 116 -4 104 4 C102 10 96 12 92 14 C98 26 92 36 84 40 C86 60 70 84 30 88 C-20 92 -60 60 -60 -10 Z" fill={COL.skin} />
            <path d="M-60 -10 C-60 40 -30 80 20 88 C-10 60 -20 30 -22 -20 Z" fill={COL.skinShade} opacity={0.6} />
            <circle cx={66} cy={-26} r={5.5} fill="#0a0604" />
            <path d="M52 -44 L82 -40" stroke={INK} strokeWidth={4} strokeLinecap="round" />
            <path d="M74 44 C80 46 88 44 92 40" stroke={INK} strokeWidth={2.6} fill="none" />
            {/* beanie */}
            <Ink d="M-70 -20 C-80 -110 0 -150 60 -120 C90 -104 100 -80 98 -56 C40 -70 -20 -60 -70 -20 Z" fill={COL.beanie} />
            <path d="M-72 -24 C-20 -64 40 -74 100 -58" stroke="#2a2a2e" strokeWidth={10} fill="none" />
            <path d="M-60 -10 C-60 40 -30 80 20 88" stroke={rim} strokeWidth={4} fill="none" opacity={rimOp * 0.8} />
          </g>
        )}
      </g>
      {/* front arm */}
      <Limb d={[...limb(sh, aF.el, 36, 30), ...limb(aF.el, aF.ha, 30, 24)]} fill={COL.jacket} />
      <circle cx={aF.ha[0]} cy={aF.ha[1]} r={26} fill={COL.glove} stroke={INK} strokeWidth={3} />
      {cuffed && (
        <g>
          <circle cx={aF.ha[0] + 6} cy={aF.ha[1] - 18} r={20} fill="none" stroke="#c8ccd2" strokeWidth={6} />
          <circle cx={aB.ha[0] + 18} cy={aB.ha[1] - 10} r={20} fill="none" stroke="#9aa0a8" strokeWidth={6} />
        </g>
      )}
      {dark > 0 && <Line d="M0 0" />}
    </g>
  );
};

/**
 * Uniformed police officer / store guard: simple side-or-front silhouette figure (feet on y = 0, ~960 tall).
 *  pose  'stand' | 'yawn' (arms up stretch) | 'walk'   torch: flashlight beam forward
 */
export const Officer: React.FC<{pose?: 'stand' | 'yawn' | 'walk'; phase?: number; torch?: boolean; color?: string; rim?: string; rimOp?: number; cap?: boolean}> = ({
  pose = 'stand',
  phase = 0,
  torch = false,
  color = '#1d232c',
  rim = '#6f9cff',
  rimOp = 0.6,
  cap = true,
}) => {
  const sw = pose === 'walk' ? Math.sin(phase) * 16 : 0;
  const yawn = pose === 'yawn';
  return (
    <g>
      {/* legs */}
      <g transform={`rotate(${sw} 0 -440)`}>
        <Ink d="M-40 -460 L-56 -10 L10 -10 L20 -460 Z" fill={color} heavy={0} />
        <Ink d="M-62 -26 L30 -26 L40 0 L-66 0 Z" fill="#0c0c0e" heavy={0} />
      </g>
      <g transform={`rotate(${-sw} 0 -440)`}>
        <Ink d="M-10 -460 L-2 -10 L64 -10 L50 -460 Z" fill={color} heavy={0} />
        <Ink d="M-6 -26 L84 -26 L92 0 L-10 0 Z" fill="#0c0c0e" heavy={0} />
      </g>
      {/* coat */}
      <Ink d="M-110 -820 C-150 -700 -140 -520 -120 -380 L130 -380 C150 -520 150 -700 110 -820 C60 -850 -60 -850 -110 -820 Z" fill={color} hatch="hatch" hatchOp={0.2} />
      <path d="M-4 -830 L-4 -390" stroke="#000" strokeWidth={4} opacity={0.5} />
      <path d="M-120 -500 H130" stroke="#0a0a0a" strokeWidth={14} opacity={0.7} />
      {/* arms */}
      {yawn ? (
        <g>
          <Ink d="M-96 -800 L-170 -1020 L-130 -1036 L-60 -810 Z" fill={color} heavy={0} />
          <Ink d="M96 -800 L170 -1020 L130 -1036 L60 -810 Z" fill={color} heavy={0} />
        </g>
      ) : (
        <g>
          <Ink d={`M-100 -800 L${-130 - sw} -470 L${-86 - sw} -462 L-60 -790 Z`} fill={color} heavy={0} />
          <Ink d={`M100 -800 L${torch ? 260 : 130 + sw} ${torch ? -620 : -470} L${torch ? 250 : 86 + sw} ${torch ? -580 : -462} L60 -790 Z`} fill={color} heavy={0} />
          {torch && (
            <g>
              <rect x={240} y={-640} width={70} height={30} fill="#2a2a2c" stroke={INK} strokeWidth={3} transform="rotate(-12 260 -620)" />
              <polygon points="300,-640 900,-760 900,-380 300,-610" fill="#fff6d8" opacity={0.14} />
            </g>
          )}
        </g>
      )}
      {/* head + cap */}
      <Ink d="M-56 -900 C-60 -980 60 -980 56 -900 C56 -850 30 -832 0 -830 C-30 -832 -56 -850 -56 -900 Z" fill="#b98a6d" />
      {yawn && <ellipse cx={0} cy={-870} rx={14} ry={20} fill="#2a0c0a" stroke={INK} strokeWidth={2} />}
      {cap && (
        <g>
          <Ink d="M-70 -940 C-80 -1010 80 -1010 70 -940 Z" fill={color} />
          <Ink d="M-72 -944 L92 -944 L70 -924 L-60 -926 Z" fill="#0b0b0c" heavy={0} />
          <circle cx={0} cy={-966} r={9} fill="#b8964e" stroke={INK} strokeWidth={2} />
        </g>
      )}
      <path d="M-110 -820 C-150 -700 -140 -520 -120 -380" stroke={rim} strokeWidth={5} fill="none" opacity={rimOp} />
    </g>
  );
};

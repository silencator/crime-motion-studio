import React from 'react';
import {Ink, Line} from '../kit/fx';
import {IFC as C} from './palette';

/**
 * Detective IF: full-body side rig, facing screen-right. Feet on y = 0, ~1000 units tall.
 * Forward kinematics: thighs/shins/feet, upper/lower arms, coat panels follow the legs, head bobs.
 *
 *  phase  walk-cycle angle in radians (advance ~2π per 1.1 s; feed a STEPPED frame for choppy cel motion)
 *  walk   0 = standing, 1 = full stride (blend)
 *  wind   coat-tail flutter 0..1        t = seconds (for flutter)
 *  rim    rim-light colour (back edge)  dark = 0..1 silhouette amount (for backlit shots)
 *  look   head turn toward camera 0..1 (shows more face)
 */
export type IFBodyProps = {phase?: number; walk?: number; wind?: number; t?: number; rim?: string; rimOp?: number; dark?: number; cig?: boolean; hat?: boolean};

type P = [number, number];
const rot = (v: P, deg: number): P => {
  const r = (deg * Math.PI) / 180;
  return [v[0] * Math.cos(r) - v[1] * Math.sin(r), v[0] * Math.sin(r) + v[1] * Math.cos(r)];
};
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];

/** Tapered limb between two points: quad + round caps (returned as separate subpaths, same winding). */
const circ = (x: number, y: number, r: number) => `M${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} Z`;
const limb = (a: P, b: P, w1: number, w2: number) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  const q = `M${a[0] + nx * w1} ${a[1] + ny * w1} L${b[0] + nx * w2} ${b[1] + ny * w2} L${b[0] - nx * w2} ${b[1] - ny * w2} L${a[0] - nx * w1} ${a[1] - ny * w1} Z`;
  return [q, circ(a[0], a[1], w1), circ(b[0], b[1], w2)];
};
const Limb: React.FC<{d: string[]; fill: string; op?: number}> = ({d, fill, op = 1}) => (
  <g opacity={op}>
    {d.map((p, i) => (
      <path key={i} d={p} fill={fill} />
    ))}
  </g>
);

const legFK = (hip: P, thigh: number, knee: number, footPitch: number) => {
  const k = add(hip, rot([0, 248], -thigh));
  const an = add(k, rot([0, 238], -thigh + knee));
  return {k, an, foot: -thigh + knee + footPitch};
};

export const IFBody: React.FC<IFBodyProps> = ({phase = 0, walk = 1, wind = 0.4, t = 0, rim = '#ffb45a', rimOp = 0.7, dark = 0, cig = false, hat = false}) => {
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  const sb = Math.sin(phase + Math.PI);
  const cb = Math.cos(phase + Math.PI);
  const W = walk;
  // legs: thigh swing, knee bends during forward swing
  const tF = 25 * s * W;
  const kF = (4 + 34 * Math.pow(Math.max(0, c), 1.4)) * W + 3;
  const tB = 25 * sb * W;
  const kB = (4 + 34 * Math.pow(Math.max(0, cb), 1.4)) * W + 3;
  const hip0: P = [0, -486];
  const lF = legFK(hip0, tF, kF, -12 * Math.max(0, c) * W);
  const lB = legFK(hip0, tB, kB, -12 * Math.max(0, cb) * W);
  // plant: lift whole body so the lowest ankle sits at foot height
  const lowest = Math.max(lF.an[1], lB.an[1]);
  const lift = lowest - -14;
  const bob = -lift;
  const lean = 3 * W;
  // arms (opposite to legs)
  const aF = -22 * s * W;
  const aB = -22 * sb * W;
  const eF = 14 + 16 * Math.max(0, -s) * W;
  const eB = 14 + 16 * Math.max(0, -sb) * W;
  const sh: P = [6, -800];
  const armFK = (a: number, e: number) => {
    const el = add(sh, rot([0, 205], -a));
    const wr = add(el, rot([0, 180], -a - e));
    return {el, wr, ang: -a - e};
  };
  const arF = armFK(aF, eF);
  const arB = armFK(aB, eB);
  const flutter = Math.sin(t * 7.3) * 0.5 + Math.sin(t * 3.1 + 1) * 0.5;
  // coat hem points follow thighs; back hem trails + wind
  const hemY = -205;
  const hemFront = add(rot([0, 300], -tF * 0.75), [70, -486]);
  const hemBack: P = [-95 - 30 * W - wind * (28 + 18 * flutter), hemY + 10 - wind * 12 * flutter];
  const dk = (col: string) => col; // colours stay; darkness handled by overlay

  const Shoe: React.FC<{an: P; ang: number; back?: boolean}> = ({an, ang, back}) => (
    <g transform={`translate(${an[0]} ${an[1]}) rotate(${ang})`}>
      <Ink d="M-26 -10 C-26 -24 -8 -26 10 -22 C34 -18 58 -10 66 4 C68 14 60 18 40 18 L-24 18 C-30 14 -30 4 -26 -10 Z" fill={back ? '#24150e' : C.shoe} w={3} heavy={2} />
      <path d="M-24 14 L64 14" stroke="#120a06" strokeWidth={6} />
    </g>
  );

  const Leg: React.FC<{l: ReturnType<typeof legFK>; back?: boolean}> = ({l, back}) => {
    const col = back ? C.trousersShade : C.trousers;
    return (
      <g>
        <Limb d={limb(hip0, l.k, 53, 43)} fill={C.ink} />
        <Limb d={limb(l.k, l.an, 43, 34)} fill={C.ink} />
        <Limb d={limb(hip0, l.k, 49.5, 39.5)} fill={col} />
        <Limb d={limb(l.k, l.an, 39.5, 30.5)} fill={col} />
        {back && <Limb d={limb(l.k, l.an, 39.5, 30.5)} fill="url(#hatch)" op={0.4} />}
        <Shoe an={l.an} ang={l.foot} back={back} />
      </g>
    );
  };

  const Arm: React.FC<{a: ReturnType<typeof armFK>; back?: boolean}> = ({a, back}) => (
    <g>
      <Limb d={limb(sh, a.el, 47, 40)} fill={C.ink} />
      <Limb d={limb(a.el, a.wr, 40, 33)} fill={C.ink} />
      <Limb d={limb(sh, a.el, 43.5, 36.5)} fill={back ? C.coatShade : C.coat} />
      <Limb d={limb(a.el, a.wr, 36.5, 29.5)} fill={back ? C.coatShade : C.coat} />
      {back && <Limb d={[...limb(sh, a.el, 43.5, 36.5), ...limb(a.el, a.wr, 36.5, 29.5)]} fill="url(#hatch)" op={0.4} />}
      <path d={`M${a.el[0]} ${a.el[1]} m-20 -10 q16 14 34 4`} stroke={C.ink} strokeWidth={2} fill="none" opacity={0.5} />
      {/* shirt cuff + glove */}
      <g transform={`translate(${a.wr[0]} ${a.wr[1]}) rotate(${a.ang})`}>
        <rect x={-24} y={-6} width={48} height={12} fill={C.shirt} stroke={C.ink} strokeWidth={2.4} />
        <Ink d="M-26 4 C-30 30 -22 58 -2 62 C18 64 30 46 28 22 C27 12 24 6 20 4 Z" fill={back ? C.gloveShade : C.glove} w={3} heavy={2} />
        <Line d="M-12 30 C-6 40 6 42 14 36" w={2} op={0.6} />
      </g>
    </g>
  );

  return (
    <g>
    <ellipse cx={10} cy={14} rx={190} ry={22} fill="#000" opacity={0.35} />
    <g transform={`translate(0 ${bob})`}>
      <g transform={`rotate(${lean} 0 -486)`}>
        {/* BACK ARM */}
        <Arm a={arB} back />
        {/* back coat panel */}
        <Leg l={lB} back />
        <Leg l={lF} />
        {/* TORSO coat + skirt front */}
        <Ink
          d={`M-62 -820 C-88 -760 -96 -640 -84 -520 C-92 -420 ${hemBack[0] + 6} ${hemY - 60} ${hemBack[0]} ${hemBack[1]} C-50 ${hemY + 4} 10 ${hemY + 12} ${hemFront[0]} ${hemFront[1]} C${hemFront[0] - 4} -330 76 -430 72 -520 C84 -620 82 -760 60 -830 C30 -850 -30 -850 -62 -820 Z`}
          fill={C.coat}
          w={3.6}
          heavy={4}
          hatch="hatch"
          hatchOp={0.12}
        />
        {/* back half of coat in shadow */}
        <path d={`M-62 -820 C-88 -760 -96 -640 -84 -520 C-92 -420 ${hemBack[0] + 6} ${hemY - 60} ${hemBack[0]} ${hemBack[1]} C-60 ${hemY + 4} -40 ${hemY + 6} -20 ${hemY + 8} C-30 -420 -36 -620 -20 -840 Z`} fill={C.coatShade} opacity={0.6} />
        <path d={`M-10 -480 C-14 -380 -20 -300 -24 ${hemY + 8}`} stroke={C.ink} strokeWidth={3} fill="none" opacity={0.7} />
        {/* front opening: waistcoat, shirt, tie peeking */}
        <path d="M44 -800 L66 -800 C74 -720 76 -620 72 -540 L50 -540 C52 -620 50 -720 44 -800 Z" fill={C.vest} stroke={C.ink} strokeWidth={2.4} />
        <path d="M54 -805 L68 -805 L70 -760 L58 -740 Z" fill={C.tie} stroke={C.ink} strokeWidth={2} />
        {/* belt line + badge glint */}
        <path d="M30 -540 L74 -540" stroke="#1b120c" strokeWidth={8} />
        <circle cx={60} cy={-530} r={8} fill={C.badge} stroke={C.ink} strokeWidth={2} />
        {/* coat seam + pocket flap */}
        <Line d="M30 -800 C38 -650 40 -470 40 -260" w={2.4} op={0.55} />
        <path d="M-40 -470 L26 -470 L24 -448 L-38 -448 Z" fill={C.coatShade} stroke={C.ink} strokeWidth={2.4} />
        {/* HEAD */}
        <g transform={`translate(18 ${-948 + Math.abs(s) * 3 * W}) scale(0.62)`}>
          <ProfileHead rim={rim} rimOp={rimOp} cig={cig} />
          {hat && <ProfileFedora rim={rim} rimOp={rimOp} />}
        </g>
        {/* raised collar */}
        <Ink d="M-70 -812 C-86 -860 -78 -905 -60 -930 L-10 -880 L30 -870 L66 -905 C76 -870 74 -840 60 -818 C20 -800 -30 -800 -70 -812 Z" fill={C.coat} heavy={2} />
        <path d="M-70 -812 C-86 -860 -78 -905 -60 -930 L-30 -870 Z" fill={C.coatShade} opacity={0.7} />
        <Ink d="M6 -868 C30 -878 52 -898 66 -905 C78 -872 74 -840 60 -818 C40 -810 20 -808 -4 -812 Z" fill={C.coat} heavy={0} w={3} />
        <path d="M20 -866 C40 -880 56 -896 64 -900 C70 -880 68 -856 60 -836 Z" fill={C.coatLit} opacity={0.5} />
        {/* rim light down the back edge */}
        <Line d={`M-62 -820 C-88 -760 -96 -640 -84 -520 C-92 -420 ${hemBack[0] + 6} ${hemY - 60} ${hemBack[0]} ${hemBack[1]}`} w={5} c={rim} op={rimOp} />
        {/* FRONT ARM */}
        <Arm a={arF} />
        <Line d={`M${sh[0] - 40} ${sh[1] + 20} L${arF.el[0] - 34} ${arF.el[1]}`} w={4} c={rim} op={rimOp * 0.6} />
      </g>
    </g>
    </g>
  );
};

/** Profile head facing right (≈ 220 units tall), used at full-body scale. */
export const ProfileHead: React.FC<{rim: string; rimOp: number; cig?: boolean}> = ({rim, rimOp, cig}) => (
  <g>
    {/* neck */}
    <Ink d="M-46 70 C-44 110 -48 140 -52 170 L52 170 C46 130 46 100 54 80 Z" fill={C.skinShade} heavy={0} />
    {/* skull + face */}
    <Ink
      d="M-50 100 C-80 70 -92 20 -92 -30 C-92 -90 -50 -128 10 -128 C56 -128 82 -100 86 -64 C88 -50 90 -40 88 -32 C92 -22 96 -14 98 -4 C106 10 116 24 120 34 C112 40 102 42 94 42 C96 50 94 56 92 62 C96 70 96 78 92 86 C92 100 88 112 74 120 C50 128 10 124 -20 116 Z"
      fill={C.skin}
      w={4}
      heavy={4}
    />
    {/* shade: back of jaw + cheek */}
    <path d="M-50 100 C-80 70 -92 20 -92 -30 C-60 -20 -20 10 10 60 C20 80 30 100 40 122 C10 124 -20 116 -50 100 Z" fill={C.skinShade} opacity={0.6} />
    <path d="M-30 40 C0 60 20 90 30 118 L-20 116 Z" fill="url(#stubble)" />
    <path d="M60 60 C70 70 84 74 92 70 C94 90 88 110 74 120 C60 124 50 110 50 90 Z" fill="url(#stubble)" />
    {/* ear */}
    <Ink d="M-26 -18 C-46 -26 -60 -10 -58 12 C-56 34 -40 46 -20 40 Z" fill={C.skin} w={3} heavy={1} />
    <path d="M-26 -18 C-46 -26 -60 -10 -58 12 C-56 34 -40 46 -20 40 Z" fill={C.skinShade} opacity={0.4} />
    {/* eye (heavy lid) + brow + scar */}
    <path d="M50 -30 C58 -36 70 -36 76 -30 C70 -24 58 -22 50 -26 Z" fill={C.sclera} stroke={C.ink} strokeWidth={2.4} />
    <circle cx={70} cy={-28} r={4.4} fill="#1a110b" />
    <path d="M46 -34 C56 -42 72 -42 80 -32" stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M40 -52 C56 -60 74 -58 88 -50 L86 -44 C72 -50 56 -50 42 -46 Z" fill={C.hairShade} />
    <path d="M58 -66 L68 -50 M68 -64 L60 -50" stroke={C.scar} strokeWidth={3.4} strokeLinecap="round" />
    {/* nostril, mouth, moustache */}
    <path d="M96 30 C100 26 106 28 108 34" stroke={C.ink} strokeWidth={2.4} fill="none" />
    <path d="M78 48 C88 44 100 44 108 42 C104 50 96 54 86 54 C82 54 78 52 78 48 Z" fill={C.hair} stroke={C.ink} strokeWidth={1.6} />
    <path d="M82 62 C88 64 92 64 94 62" stroke={C.ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />
    {/* hair: slicked back, strand */}
    <Ink d="M-96 -20 C-104 -80 -70 -140 0 -146 C60 -150 96 -120 92 -76 C80 -86 64 -92 44 -92 C20 -92 0 -84 -14 -70 C-30 -50 -34 -30 -30 -10 C-44 -16 -60 -6 -66 20 C-80 10 -92 0 -96 -20 Z" fill={C.hair} w={3.6} heavy={3} />
    <Line d="M-80 -60 C-60 -110 -10 -136 60 -128" w={3} c={C.hairLit} op={0.8} />
    <Line d="M-60 -40 C-40 -90 0 -110 70 -108" w={2.4} c={C.hairShade} op={0.8} />
    <path d="M70 -96 C86 -80 90 -62 84 -50" stroke={C.hair} strokeWidth={6} fill="none" strokeLinecap="round" />
    {/* rim on the back of the skull */}
    <path d="M-50 100 C-80 70 -92 20 -96 -20 C-104 -80 -70 -140 0 -146" fill="none" stroke={rim} strokeWidth={5} opacity={rimOp} strokeLinecap="round" />
    {cig && (
      <g transform="translate(96 64) rotate(10)">
        <rect x={0} y={-5} width={60} height={10} rx={2} fill="#efe8dc" stroke={C.ink} strokeWidth={2} />
        <circle cx={62} cy={0} r={7} fill="#ff7a2a" />
        <circle cx={62} cy={0} r={22} fill="url(#warmGlow)" />
      </g>
    )}
  </g>
);

/** Fedora for the profile head (CASE 003 rain outfit). */
export const ProfileFedora: React.FC<{rim: string; rimOp: number}> = ({rim, rimOp}) => (
  <g transform="rotate(-5 0 -100)">
    <Ink d="M-150 -86 C-100 -112 80 -116 170 -92 C186 -86 180 -74 164 -76 C80 -94 -90 -90 -146 -72 C-162 -68 -166 -80 -150 -86 Z" fill="#1c1a1c" heavy={2} />
    <Ink d="M-96 -96 C-104 -150 -90 -200 -40 -214 C0 -206 30 -212 60 -216 C96 -204 112 -160 104 -100 C40 -110 -40 -110 -96 -96 Z" fill="#232126" hatch="hatch" hatchOp={0.25} />
    <path d="M-98 -104 C-40 -118 40 -118 104 -108 L106 -130 C40 -140 -40 -140 -100 -126 Z" fill="#4a1418" stroke={C.ink} strokeWidth={2.4} />
    <path d="M-150 -86 C-100 -112 80 -116 170 -92" fill="none" stroke={rim} strokeWidth={4} opacity={rimOp * 0.8} />
  </g>
);

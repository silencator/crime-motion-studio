import React from 'react';
import {Ink, Line} from '../kit/fx';
import {IFC as C} from './palette';

/**
 * Detective IF: close-up / medium-close-up bust rig, 3/4 view facing screen-left.
 * Local units: head centre ≈ (0,0); chin ≈ y 215; crown ≈ y −300; bust cut ≈ y 900.
 * Mirror with flip to face right.
 *
 * Controls
 *  mouth  0..1  (0 closed line → 1 wide open)       blink 0..1 (1 = shut)
 *  lookX/lookY  −1..1 iris offset                    brow  0..1 (1 = narrowed, suspicious)
 *  tilt   degrees (head only)                         rim   rim-light colour on the face edge
 *  shade  shadow-side darkness 0..1                   cig   cigarette in mouth
 */
export type IFBustProps = {
  mouth?: number;
  blink?: number;
  lookX?: number;
  lookY?: number;
  brow?: number;
  tilt?: number;
  rim?: string;
  rimOp?: number;
  shade?: number;
  flip?: boolean;
  cig?: boolean;
  cigGlow?: number;
  breathe?: number; // shoulder rise px
  /** outfit: 'coat' = charcoal overcoat (default), 'trench' = tan rain trench coat (CASE 003) */
  outfit?: 'coat' | 'trench';
  /** fedora on (CASE 003 rain outfit) */
  hat?: boolean;
  /** 0..1 faint dry half-smile (amused IF) */
  smile?: number;
};

/** Outfit palettes for the coat layer. */
const OUTFIT = {
  coat: {coat: C.coat, coatShade: C.coatShade},
  trench: {coat: '#8d7556', coatShade: '#5c4a35'},
};

export const IFBust: React.FC<IFBustProps> = ({
  mouth = 0,
  blink = 0,
  lookX = 0,
  lookY = 0,
  brow = 0,
  tilt = 0,
  rim = '#ffb45a',
  rimOp = 0.8,
  shade = 0.55,
  flip = false,
  cig = false,
  cigGlow = 0.6,
  breathe = 0,
  outfit = 'coat',
  hat = false,
  smile = 0,
}) => {
  return (
    <g transform={flip ? 'scale(-1 1)' : undefined}>
      <Torso breathe={breathe} rim={rim} rimOp={rimOp} outfit={outfit} />
      <g transform={`rotate(${tilt} 0 230)`}>
        <Head mouth={mouth} blink={blink} lookX={lookX} lookY={lookY} brow={brow} rim={rim} rimOp={rimOp} shade={shade} cig={cig} cigGlow={cigGlow} smile={smile} />
        {hat && <Fedora rim={rim} rimOp={rimOp} />}
      </g>
    </g>
  );
};

/* ---------------------------------------------------------------- */
const Torso: React.FC<{breathe: number; rim: string; rimOp: number; outfit: 'coat' | 'trench'}> = ({breathe, rim, rimOp, outfit}) => {
  const O = OUTFIT[outfit];
  return (
  <g transform={`translate(0 ${-breathe - 105})`}>
    {/* coat body */}
    <Ink
      d="M-470 1500 C-470 760 -450 600 -330 520 C-260 470 -190 440 -150 420 L150 400 C230 430 330 470 420 540 C510 620 520 780 520 1500 Z"
      fill={O.coat}
      hatch="hatch"
      hatchOp={0.18}
    />
    {/* shadow side of coat (screen right = away from key light) */}
    <path d="M160 410 C260 450 360 500 430 560 C500 640 515 790 520 1500 L260 1500 C250 800 230 600 160 410 Z" fill={O.coatShade} opacity={0.75} />
    <path d="M160 410 C260 450 360 500 430 560 C500 640 515 790 520 1500 L260 1500 C250 800 230 600 160 410 Z" fill="url(#hatch)" opacity={0.35} />
    {/* shirt + vest V */}
    <Ink d="M-150 420 L-60 400 L70 395 L150 405 L120 620 L40 1500 L-90 1500 L-150 640 Z" fill={C.vest} heavy={0} hatch="tweed" hatchOp={0.9} />
    <Ink d="M-112 400 L-40 392 L60 388 L118 400 L60 560 L-10 640 L-70 560 Z" fill={C.shirt} heavy={0} />
    <path d="M20 392 L118 400 L60 560 L10 600 Z" fill={C.shirtShade} opacity={0.7} />
    {/* tie (loosened knot) */}
    <Ink d="M-38 412 L22 410 L14 452 L-30 455 Z" fill={C.tie} heavy={1} />
    <Ink d="M-30 452 L14 450 L40 600 L-5 650 L-50 600 Z" fill={C.tie} heavy={1} />
    <path d="M0 452 L14 450 L40 600 L-5 650 Z" fill={C.tieShade} opacity={0.7} />
    {/* open shirt collar points */}
    <Ink d="M-112 398 L-150 330 L-60 360 L-34 412 Z" fill={C.shirt} heavy={1} />
    <Ink d="M118 392 L140 320 L60 352 L26 410 Z" fill={C.shirtShade} heavy={1} />
    {/* raised coat collar + lapels */}
    <Ink d="M-160 430 C-210 380 -235 300 -228 220 L-150 250 C-140 320 -110 380 -60 410 L-120 520 C-140 600 -150 700 -160 1500 L-300 1500 C-280 760 -240 560 -160 430 Z" fill={O.coat} hatch="hatch" hatchOp={0.15} />
    <Ink d="M150 410 C210 360 240 280 236 200 L150 236 C145 310 120 370 80 405 L130 520 C150 610 165 720 175 1500 L300 1500 C290 760 250 560 150 410 Z" fill={O.coatShade} hatch="hatch" hatchOp={0.4} />
    <Line d="M-228 220 C-235 300 -210 380 -160 430" w={4} c={rim} op={rimOp * 0.6} />
    {/* lapel notch lines + coat button */}
    <Line d="M-120 520 L-200 560 M130 520 L205 555" w={3} />
    <circle cx={-205} cy={760} r={11} fill={O.coatShade} stroke={C.ink} strokeWidth={3} />
    {/* shoulder holster strap peeking */}
    <path d="M70 560 L110 1500" stroke="#3b2418" strokeWidth={14} opacity={0.6} />
    {/* rim light on the shoulder */}
    <Line d="M-470 900 C-470 760 -450 610 -330 520" w={5} c={rim} op={rimOp * 0.55} />
    {outfit === 'trench' && (
      <g>
        {/* trench details: storm flap, epaulette, double-breasted buttons, rain dark spots */}
        <Ink d="M-460 640 L-300 560 L-280 600 L-440 690 Z" fill={O.coatShade} heavy={0} />
        <path d="M-330 620 C-300 700 -280 800 -290 900" stroke="#0b0706" strokeWidth={3} fill="none" opacity={0.6} />
        {[760, 900].map((y) => (
          <g key={y}>
            <circle cx={-250} cy={y} r={13} fill="#3a2c1c" stroke="#0b0706" strokeWidth={3} />
            <circle cx={-110} cy={y + 10} r={13} fill="#3a2c1c" stroke="#0b0706" strokeWidth={3} />
          </g>
        ))}
        {Array.from({length: 22}).map((_, i) => (
          <circle key={i} cx={-440 + ((i * 197) % 900)} cy={600 + ((i * 131) % 820)} r={4 + (i % 3) * 2} fill="#3b2f20" opacity={0.35} />
        ))}
      </g>
    )}
  </g>
  );
};

/* ---------------------------------------------------------------- */
const Head: React.FC<Required<Pick<IFBustProps, 'mouth' | 'blink' | 'lookX' | 'lookY' | 'brow' | 'rim' | 'rimOp' | 'shade' | 'cig' | 'cigGlow' | 'smile'>>> = ({
  mouth,
  blink,
  lookX,
  lookY,
  brow,
  rim,
  rimOp,
  shade,
  cig,
  cigGlow,
  smile,
}) => {
  const FACE =
    'M-138 -185 C-152 -140 -168 -100 -166 -70 C-162 -50 -150 -40 -152 -25 C-170 5 -196 30 -210 48 C-205 60 -188 66 -168 68 C-162 78 -166 88 -166 98 C-162 112 -160 124 -162 138 C-160 150 -150 158 -152 175 C-152 198 -134 216 -108 224 C-60 232 -4 222 46 200 C80 182 100 150 108 112 L114 40 C125 -20 135 -80 130 -150 C110 -230 -80 -250 -150 -175 Z';
  const m = Math.max(0, Math.min(1, mouth));
  const lo = 112 + m * 22; // lower-lip y
  const mw = 1 + m * 0.12;
  const lidClose = Math.max(0, Math.min(1, blink));
  const lx = lookX * 9;
  const ly = lookY * 6;
  const bd = brow * 9; // brow lowers

  return (
    <g>
      {/* neck */}
      <Ink d="M-88 175 C-84 220 -92 262 -100 300 L98 292 C88 250 86 190 96 120 Z" fill={C.skinShade} heavy={0} />
      <path d="M-90 200 C-40 240 50 232 96 170 L96 240 C50 280 -40 282 -96 262 Z" fill={C.skinDeep} opacity={0.55} />
      {/* back hair mass (behind ear) */}
      <Ink d="M40 -270 C170 -280 222 -170 210 -80 C204 -30 182 10 150 40 L120 30 L95 -40 Z" fill={C.hair} />
      <path d="M150 -200 C196 -150 206 -80 190 -20" fill="none" stroke={C.hairShade} strokeWidth={10} opacity={0.6} />
      {/* face */}
      <Ink d={FACE} fill={C.skin} w={3.6} heavy={4} />
      {/* shadow side of face (cheek, jaw, temple) */}
      <path d="M70 -170 C110 -130 128 -70 120 0 L112 70 C104 140 82 180 46 200 C10 216 -30 224 -56 226 C-10 196 20 150 30 96 C40 40 52 0 50 -40 C48 -90 56 -130 70 -170 Z" fill={C.skinShade} opacity={shade} />
      <path d="M92 -120 C118 -70 122 0 112 70 C104 140 84 178 50 198 C80 150 96 90 96 20 C96 -40 94 -80 92 -120 Z" fill={C.skinDeep} opacity={shade * 0.6} />
      <path d="M50 -60 C70 -20 80 40 70 110 C60 150 40 175 20 190 C40 130 55 60 50 -60 Z" fill="url(#hatchFine)" opacity={0.35 * shade + 0.1} />
      {/* lit planes: forehead, cheekbone, nose ridge */}
      <path d="M-130 -170 C-100 -176 -60 -176 -30 -168 C-60 -150 -100 -140 -140 -130 Z" fill={C.skinLit} opacity={0.45} />
      <path d="M-150 -20 C-130 -14 -100 -12 -80 -4 C-100 20 -130 30 -160 30 Z" fill={C.skinLit} opacity={0.35} />
      <path d="M-160 -30 C-176 0 -196 28 -204 46 C-196 46 -186 40 -176 28 C-166 10 -160 -10 -156 -30 Z" fill={C.skinLit} opacity={0.5} />
      {/* cheekbone hatching under the near eye */}
      <path d="M-60 10 C-20 25 20 20 40 0 C30 40 -10 60 -50 50 Z" fill="url(#hatchFine)" opacity={0.28} />
      {/* stubble on jaw + upper lip */}
      <path d="M-160 70 C-120 80 -80 82 -40 70 C0 60 40 70 80 110 C95 140 70 175 40 190 C-10 214 -60 224 -110 220 C-132 214 -152 198 -152 175 C-150 158 -160 150 -162 138 C-160 124 -162 112 -166 98 Z" fill="url(#stubble)" opacity={0.9} />
      <path d="M-160 70 C-120 80 -80 82 -40 70 C0 60 40 70 80 110 C95 140 70 175 40 190 C-10 214 -60 224 -110 220 C-132 214 -152 198 -152 175 Z" fill={C.skinShade} opacity={0.18} />
      {/* ear */}
      <Ink d="M100 -30 C130 -45 158 -30 156 5 C154 40 135 65 108 70 L102 30 Z" fill={C.skin} w={3} heavy={2} />
      <Line d="M118 -12 C140 -16 145 10 132 30 C126 40 118 42 112 40" w={2.4} op={0.8} />
      <path d="M100 -30 C130 -45 158 -30 156 5 C154 40 135 65 108 70 Z" fill={C.skinShade} opacity={0.35} />
      {/* nose: bridge shadow, wing, nostril */}
      <path d="M-140 -40 C-150 -10 -175 20 -196 44 C-180 50 -168 52 -160 50 C-150 20 -138 -10 -128 -38 Z" fill={C.skinShade} opacity={0.35} />
      <Line d="M-168 66 C-160 60 -150 58 -142 64 C-140 70 -146 76 -158 74" w={2.6} />
      <path d="M-206 50 C-196 58 -186 62 -172 66" fill="none" stroke={C.skinLit} strokeWidth={3} opacity={0.6} />
      <Line d="M-142 64 C-130 80 -126 100 -132 122" w={2} op={0.55} />
      {/* eye bags + crow's feet (tired) */}
      <Line d="M-58 -8 C-35 2 -5 2 18 -8" w={2} op={0.5} />
      <Line d="M28 -40 L44 -46 M28 -30 L44 -30 M28 -20 L42 -14" w={1.6} op={0.45} />
      <Line d="M-150 -12 C-138 -6 -120 -6 -108 -12" w={1.6} op={0.45} />
      {/* EYES */}
      <Eye cx={-22} cy={-38} w={66} h={30} lx={lx} ly={ly} close={lidClose} heavy={0.48 + brow * 0.12} />
      <Eye cx={-128} cy={-38} w={34} h={24} lx={lx * 0.7} ly={ly} close={lidClose} heavy={0.5 + brow * 0.12} far />
      {/* BROWS (heavy, tired droop at outer end) */}
      <Ink d={`M-66 ${-78 + bd * 0.4} C-40 ${-92 + bd} 0 ${-96 + bd} 34 ${-86 + bd * 0.6} C44 ${-80 + bd * 0.4} 48 ${-70 + bd * 0.2} 46 ${-64} C20 ${-78 + bd * 0.6} -20 ${-80 + bd} -66 ${-70 + bd * 0.4} Z`} fill={C.hairShade} w={2} heavy={0} />
      <Ink d={`M-158 ${-76 + bd * 0.6} C-140 ${-86 + bd} -118 ${-88 + bd} -98 ${-82 + bd * 0.7} L-100 ${-74 + bd * 0.6} C-120 ${-78 + bd} -140 ${-76 + bd} -156 ${-68 + bd * 0.5} Z`} fill={C.hairShade} w={2} heavy={0} />
      {/* SCAR: small X through the brow */}
      <g transform={`translate(-6 ${-104 + bd * 0.8}) rotate(-8)`}>
        <path d="M-12 -14 L12 16 M10 -12 L-8 14" stroke={C.scar} strokeWidth={5.5} strokeLinecap="round" />
        <path d="M-12 -14 L12 16 M10 -12 L-8 14" stroke="#c8574a" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
      </g>
      {/* forehead lines */}
      <Line d="M-120 -140 C-80 -150 -30 -150 10 -138" w={1.6} op={0.3} />
      {/* MOUTH */}
      <Mouth m={m} lo={lo} mw={mw} smile={smile} />
      {/* MOUSTACHE: thin, slightly drooping */}
      <Ink d="M-180 86 C-164 74 -140 72 -122 79 C-102 74 -80 80 -58 98 C-66 102 -80 101 -94 97 C-110 92 -124 92 -134 94 C-152 97 -168 99 -182 95 Z" fill={C.hair} w={2} heavy={0} />
      {/* chin cleft + jaw definition */}
      <Line d="M-132 186 C-128 196 -126 202 -128 210" w={1.8} op={0.4} />
      {/* HAIR: slicked back with a loose strand */}
      <Ink
        d="M-150 -180 C-176 -230 -150 -292 -84 -318 C-10 -344 86 -330 146 -284 C192 -244 202 -170 188 -106 C182 -74 166 -44 144 -22 C138 -62 132 -100 114 -130 C92 -160 56 -176 10 -180 C-44 -190 -96 -192 -150 -180 Z"
        fill={C.hair}
        w={3.6}
        heavy={4}
      />
      {/* sideburn */}
      <Ink d="M98 -120 C110 -90 112 -50 108 -10 L96 0 C94 -40 92 -80 86 -112 Z" fill={C.hair} w={2} heavy={0} />
      {/* hair comb lines (sheen) */}
      <Line d="M-140 -200 C-90 -260 0 -290 110 -262" w={3} c={C.hairLit} op={0.8} />
      <Line d="M-120 -186 C-60 -240 40 -262 150 -220" w={2.4} c={C.hairLit} op={0.6} />
      <Line d="M-60 -182 C0 -220 80 -230 168 -170" w={2} c={C.hairShade} op={0.8} />
      <Line d="M10 -178 C60 -200 120 -190 176 -128" w={2} c={C.hairShade} op={0.8} />
      {/* loose strand falling on forehead */}
      <Ink d="M-60 -232 C-100 -205 -124 -170 -122 -130 C-121 -116 -112 -110 -108 -118 C-114 -150 -96 -186 -54 -220 Z" fill={C.hair} w={2} heavy={0} />
      <Line d="M-40 -226 C-70 -200 -84 -172 -86 -146 C-87 -136 -82 -132 -78 -138" w={2.6} c={C.hair} />
      {/* RIM LIGHT on the profile edge (key light from screen-left) */}
      <path
        d="M-138 -185 C-152 -140 -168 -100 -166 -70 C-162 -50 -150 -40 -152 -25 C-170 5 -196 30 -210 48 M-166 98 C-162 112 -160 124 -162 138 C-160 150 -150 158 -152 175 C-152 198 -132 214 -110 220"
        fill="none"
        stroke={rim}
        strokeWidth={4}
        opacity={rimOp}
        strokeLinecap="round"
      />
      <path d="M-150 -180 C-176 -230 -150 -292 -84 -318" fill="none" stroke={rim} strokeWidth={4} opacity={rimOp * 0.7} strokeLinecap="round" />
      {cig && <Cigarette glow={cigGlow} />}
    </g>
  );
};

const Eye: React.FC<{cx: number; cy: number; w: number; h: number; lx: number; ly: number; close: number; heavy: number; far?: boolean}> = ({
  cx,
  cy,
  w,
  h,
  lx,
  ly,
  close,
  heavy,
  far,
}) => {
  const id = `eye${cx}`;
  const lid = Math.min(1, heavy + close * (1 - heavy)); // fraction of eye covered by upper lid
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const shape = far
    ? `M${x0} ${cy + 2} C${x0 + w * 0.3} ${cy - h * 0.55} ${x1 - w * 0.2} ${cy - h * 0.55} ${x1} ${cy - 2} C${x1 - w * 0.25} ${cy + h * 0.45} ${x0 + w * 0.3} ${cy + h * 0.45} ${x0} ${cy + 2} Z`
    : `M${x0} ${cy + 4} C${x0 + w * 0.25} ${cy - h * 0.6} ${x1 - w * 0.25} ${cy - h * 0.62} ${x1} ${cy - 3} C${x1 - w * 0.2} ${cy + h * 0.5} ${x0 + w * 0.25} ${cy + h * 0.55} ${x0} ${cy + 4} Z`;
  const lidY = cy - h * 0.55 + lid * h * 1.05;
  if (close > 0.85)
    return (
      <g>
        <path d={`M${x0} ${cy + 2} C${cx - w * 0.2} ${cy + h * 0.35} ${cx + w * 0.2} ${cy + h * 0.35} ${x1} ${cy - 1}`} fill="none" stroke={C.ink} strokeWidth={far ? 3 : 4.5} strokeLinecap="round" />
        <path d={`M${x0 + 2} ${cy - h * 0.2} C${cx - w * 0.15} ${cy - h * 0.6} ${cx + w * 0.25} ${cy - h * 0.6} ${x1 + 2} ${cy - h * 0.15}`} fill="none" stroke={C.ink} strokeWidth={1.8} opacity={0.5} />
      </g>
    );
  return (
    <g>
      <clipPath id={id}>
        <path d={shape} />
      </clipPath>
      <path d={shape} fill={C.sclera} />
      <g clipPath={`url(#${id})`}>
        <circle cx={cx - (far ? 2 : 4) + lx} cy={cy + 1 + ly} r={h * 0.48} fill={C.iris} />
        <circle cx={cx - (far ? 2 : 4) + lx} cy={cy + 1 + ly} r={h * 0.22} fill="#120a06" />
        <circle cx={cx - (far ? 5 : 9) + lx} cy={cy - 3 + ly} r={h * 0.09} fill="#fff" opacity={0.85} />
        {/* heavy upper lid */}
        <path d={`M${x0 - 10} ${cy - h} L${x1 + 10} ${cy - h} L${x1 + 10} ${lidY - 2} C${cx + w * 0.2} ${lidY + 3} ${cx - w * 0.2} ${lidY + 3} ${x0 - 10} ${lidY + 2} Z`} fill={C.skinShade} />
        <path d={`M${x0 - 10} ${lidY + 2} C${cx - w * 0.2} ${lidY + 3} ${cx + w * 0.2} ${lidY + 3} ${x1 + 10} ${lidY - 2}`} stroke={C.ink} strokeWidth={far ? 3 : 4.5} fill="none" />
      </g>
      <path d={shape} fill="none" stroke={C.ink} strokeWidth={far ? 2 : 2.6} />
      {/* lid crease */}
      <path d={`M${x0 + 2} ${cy - h * 0.55} C${cx - w * 0.15} ${cy - h * 0.95} ${cx + w * 0.25} ${cy - h * 0.95} ${x1 + 2} ${cy - h * 0.5}`} fill="none" stroke={C.ink} strokeWidth={1.8} opacity={0.55} />
    </g>
  );
};

const Mouth: React.FC<{m: number; lo: number; mw: number; smile: number}> = ({m, lo, mw, smile}) => {
  const xl = -164;
  const xr = -84 * mw - 8;
  if (m < 0.06) {
    const sm = smile * 12;
    return (
      <g>
        <Line d={`M${xl} ${110 - sm * 0.3} C${xl + 30} ${106 + sm * 0.4} ${xr - 20} ${108 + sm * 0.2} ${xr} ${116 - sm}`} w={3.2} />
        {smile > 0.2 && <Line d={`M${xr - 2} ${112 - sm} C${xr + 6} ${108 - sm} ${xr + 10} ${102 - sm} ${xr + 10} ${96 - sm}`} w={2} op={0.6 * smile} />}
        <path d={`M${xl + 8} 116 C${xl + 30} 128 ${xr - 20} 128 ${xr - 6} 120`} fill="none" stroke={C.lip} strokeWidth={5} opacity={0.6} />
      </g>
    );
  }
  return (
    <g>
      <Ink d={`M${xl} 108 C${xl + 30} 103 ${xr - 20} 104 ${xr} 113 C${xr - 10} ${lo} ${xl + 20} ${lo + 4} ${xl + 2} ${112 + m * 10} Z`} fill="#2a0d0a" w={3} heavy={0} />
      {m > 0.6 && <path d={`M${xl + 10} 109 C${xl + 30} 106 ${xr - 22} 107 ${xr - 6} 113 L${xr - 10} 118 C${xl + 30} 114 ${xl + 20} 114 ${xl + 10} 115 Z`} fill="#d8cdbd" opacity={0.5} />}
      <path d={`M${xl + 10} ${lo + 4} C${xl + 30} ${lo + 14} ${xr - 24} ${lo + 12} ${xr - 8} ${lo}`} fill="none" stroke={C.lip} strokeWidth={6} opacity={0.6} />
    </g>
  );
};

const Cigarette: React.FC<{glow: number}> = ({glow}) => (
  <g transform="translate(-150 116) rotate(-14)">
    <rect x={-120} y={-7} width={120} height={14} rx={3} fill="#efe8dc" stroke={C.ink} strokeWidth={2.4} />
    <rect x={-120} y={-7} width={14} height={14} rx={3} fill="#5a3a2a" />
    <circle cx={-122} cy={0} r={9} fill="#ff7a2a" opacity={0.6 + glow * 0.4} />
    <circle cx={-122} cy={0} r={30} fill="url(#warmGlow)" opacity={glow} />
  </g>
);

/** Dark felt fedora (CASE 003 rain outfit). Sits on the slicked hair, brim dipping toward the face side. */
const Fedora: React.FC<{rim: string; rimOp: number}> = ({rim, rimOp}) => (
  <g transform="rotate(-6 0 -230)">
    {/* back brim */}
    <Ink d="M-250 -222 C-200 -262 120 -282 250 -236 C262 -226 250 -214 232 -214 C90 -246 -150 -232 -238 -206 C-256 -204 -262 -212 -250 -222 Z" fill="#1c1a1c" heavy={2} />
    {/* crown with centre dent and pinch */}
    <Ink d="M-168 -236 C-176 -300 -160 -380 -110 -410 C-60 -394 -20 -398 20 -414 C80 -420 150 -390 170 -330 C182 -296 178 -262 172 -240 C80 -258 -80 -256 -168 -236 Z" fill="#232126" hatch="hatch" hatchOp={0.25} />
    <path d="M-60 -400 C-40 -360 -10 -340 30 -332" stroke="#0b0706" strokeWidth={3.5} fill="none" opacity={0.7} />
    <path d="M60 -410 C110 -380 150 -330 160 -270 L172 -240 C150 -300 120 -350 60 -410 Z" fill="#0f0e10" opacity={0.6} />
    {/* band */}
    <path d="M-170 -246 C-80 -268 80 -268 172 -250 L174 -282 C80 -298 -80 -298 -172 -276 Z" fill="#4a1418" stroke="#0b0706" strokeWidth={3} />
    {/* front brim (over the face side) */}
    <Ink d="M-290 -196 C-250 -236 -120 -250 0 -246 C-60 -228 -180 -210 -240 -186 C-262 -178 -296 -182 -290 -196 Z" fill="#18161a" heavy={2} />
    {/* rain on the brim edge + rim light */}
    <path d="M-290 -196 C-250 -236 -120 -250 0 -246" fill="none" stroke={rim} strokeWidth={4} opacity={rimOp * 0.8} />
    <path d="M-168 -236 C-176 -300 -160 -380 -110 -410" fill="none" stroke={rim} strokeWidth={3.5} opacity={rimOp * 0.6} />
  </g>
);

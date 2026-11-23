import React from 'react';
import {Ink, Line} from '../kit/fx';
import {hash} from '../kit/time';

/**
 * Detective IF's signature car: black 1965–67-style fastback (references/if_car.png).
 * No logos, badges or lettering anywhere (blank grille centre, plain flanks).
 *
 * <FastbackSide> faces screen-right. Units: ~1010 long (x −505..505), wheels on y = 0, roof ≈ y −300.
 *   roll       wheel rotation in radians (distance / 60)
 *   lights     headlights 0..1 (amber, with a forward beam)
 *   brake      tail-light glow 0..1
 *   rim        rim-light colour along the top edge, rimOp its strength
 *   beam       draw the long headlight beam (off for tight framing)
 * <FastbackFront> head-on view for arrivals and headlight close-ups. ~880 wide (x −440..440), tyres on y = 0.
 */
const INK = '#0b0706';
export const CAR = {
  paint: '#131315',
  paintLit: '#2c2c31',
  paintShade: '#070708',
  chrome: '#c9c4bc',
  chromeShade: '#6d6a66',
  glass: '#0c1116',
  glassLit: '#3a4a58',
  tyre: '#0a0a0a',
  rimMetal: '#2b2b2e',
  amber: '#ffc56a',
  tail: '#d0281c',
};

const Wheel: React.FC<{x: number; roll: number}> = ({x, roll}) => (
  <g transform={`translate(${x} -62)`}>
    <circle r={62} fill={CAR.tyre} stroke={INK} strokeWidth={4} />
    <circle r={58} fill="none" stroke="#1b1b1b" strokeWidth={6} />
    <circle r={39} fill={CAR.rimMetal} stroke={CAR.chromeShade} strokeWidth={3} />
    <g transform={`rotate(${(roll * 180) / Math.PI})`}>
      {Array.from({length: 5}).map((_, i) => (
        <path key={i} d="M-7 -8 L-10 -36 L10 -36 L7 -8 Z" fill="#141416" stroke={INK} strokeWidth={1.6} transform={`rotate(${i * 72})`} />
      ))}
    </g>
    <circle r={12} fill={CAR.chrome} stroke={INK} strokeWidth={2.5} />
    <path d="M-30 -24 A38 38 0 0 1 24 -30" stroke="#5a5a60" strokeWidth={3} fill="none" opacity={0.7} />
  </g>
);

const SIDE_BODY =
  'M498 -104 L507 -150 C507 -174 494 -186 470 -189 L132 -199 L-8 -290 C-40 -300 -100 -301 -132 -292 C-220 -266 -380 -216 -468 -205 L-500 -196 L-506 -122 L-496 -72 L-382 -62 A80 80 0 0 1 -218 -62 L218 -60 A80 80 0 0 1 382 -60 L490 -66 Z';

export const FastbackSide: React.FC<{roll?: number; lights?: number; brake?: number; rim?: string; rimOp?: number; beam?: boolean; f?: number; dust?: number}> = ({
  roll = 0,
  lights = 1,
  brake = 0,
  rim = '#e0402e',
  rimOp = 0.8,
  beam = true,
  f = 0,
  dust = 0.5,
}) => (
  <g>
    {/* ground shadow */}
    <ellipse cx={0} cy={4} rx={540} ry={24} fill="#000" opacity={0.55} />
    {/* headlight beam on the road */}
    {beam && lights > 0 && (
      <g opacity={lights}>
        <polygon points="505,-150 1500,-260 1500,40 505,-120" fill={CAR.amber} opacity={0.1} />
        <ellipse cx={900} cy={8} rx={360} ry={26} fill={CAR.amber} opacity={0.18} />
      </g>
    )}
    {/* body */}
    <Ink d={SIDE_BODY} fill={CAR.paint} w={4} heavy={4} />
    {/* lower body shade + crease */}
    <path d="M500 -120 L-505 -125 L-496 -72 L-382 -62 A80 80 0 0 1 -218 -62 L218 -60 A80 80 0 0 1 382 -60 L490 -66 Z" fill={CAR.paintShade} opacity={0.8} />
    <path d="M500 -120 L-505 -125 L-500 -100 L500 -96 Z" fill="url(#hatch)" opacity={0.25} />
    <Line d="M495 -150 C300 -154 -200 -160 -500 -168" w={2.4} c={CAR.paintLit} op={0.9} />
    {/* dusty, weathered paint */}
    {dust > 0 &&
      Array.from({length: 46}).map((_, i) => (
        <circle key={i} cx={-480 + hash(i * 3.7) * 960} cy={-70 - hash(i * 5.3) * 110} r={1 + hash(i) * 2.6} fill="#6a625c" opacity={dust * (0.25 + hash(i * 9) * 0.4)} />
      ))}
    {/* side scoop + door shut lines */}
    <path d="M-150 -96 C-190 -112 -230 -118 -265 -112 C-240 -138 -200 -146 -150 -140 Z" fill={CAR.paintShade} stroke={INK} strokeWidth={2.4} />
    <Line d="M128 -196 L132 -70 M-150 -206 C-152 -160 -152 -110 -146 -70" w={2.4} op={0.9} />
    <rect x={-128} y={-178} width={34} height={7} rx={3} fill={CAR.chrome} stroke={INK} strokeWidth={1.4} />
    {/* windows: door glass + rear-quarter louvres */}
    <path d="M116 -203 L-6 -282 C-36 -290 -92 -291 -122 -284 L-146 -276 L-146 -207 Z" fill={CAR.glass} stroke={CAR.chrome} strokeWidth={5} strokeLinejoin="round" />
    <path d="M60 -208 L-30 -270 L-70 -270 L20 -208 Z" fill={CAR.glassLit} opacity={0.35} />
    <path d="M-165 -270 L-268 -240 L-268 -210 L-165 -208 Z" fill={CAR.glass} stroke={CAR.chrome} strokeWidth={4} strokeLinejoin="round" />
    {[0, 1, 2].map((i) => (
      <line key={i} x1={-180 - i * 26} y1={-262 + i * 7} x2={-194 - i * 26} y2={-212} stroke={CAR.chromeShade} strokeWidth={6} />
    ))}
    {/* mirror */}
    <path d="M104 -214 L96 -232 C98 -244 120 -246 124 -232 Z" fill={CAR.chrome} stroke={INK} strokeWidth={2} />
    {/* antenna on the front fender */}
    <line x1={352} y1={-192} x2={372} y2={-470} stroke="#8a8680" strokeWidth={2.4} />
    {/* chrome: rocker strip, bumpers, drip rail */}
    <path d="M-218 -66 L218 -64" stroke={CAR.chrome} strokeWidth={5} strokeLinecap="round" />
    <path d="M466 -104 H512 C516 -98 516 -88 510 -84 H470 Z" fill={CAR.chrome} stroke={INK} strokeWidth={2.4} />
    <path d="M-470 -108 H-512 C-516 -102 -516 -92 -510 -88 H-474 Z" fill={CAR.chrome} stroke={INK} strokeWidth={2.4} />
    <path d="M132 -199 L-8 -290 C-40 -300 -100 -301 -132 -292 C-220 -266 -380 -216 -468 -205" fill="none" stroke={CAR.chromeShade} strokeWidth={2} opacity={0.9} />
    {/* headlight + turn light (seen edge-on) */}
    <ellipse cx={500} cy={-150} rx={7} ry={20} fill={lights > 0.1 ? CAR.amber : '#5a4a30'} stroke={INK} strokeWidth={2} />
    {lights > 0 && <circle cx={505} cy={-150} r={90} fill="url(#warmGlow)" opacity={0.8 * lights} />}
    <circle cx={492} cy={-82} r={7} fill="#c98a2a" stroke={INK} strokeWidth={1.6} />
    {/* tail lights */}
    <rect x={-508} y={-178} width={10} height={36} rx={3} fill={brake > 0.1 ? '#ff3a24' : CAR.tail} stroke={INK} strokeWidth={2} />
    <circle cx={-512} cy={-160} r={110} fill="url(#redGlow)" opacity={0.25 + brake * 0.6} />
    {/* rim light along roofline + hood */}
    <path d="M470 -189 L132 -199 L-8 -290 C-40 -300 -100 -301 -132 -292 C-220 -266 -380 -216 -468 -205" fill="none" stroke={rim} strokeWidth={4} opacity={rimOp} strokeLinecap="round" />
    <path d="M300 -194 L132 -199 L60 -246" fill="none" stroke="#fff" strokeWidth={2} opacity={rimOp * 0.35} />
    {/* snow dusting on roof */}
    <path d="M-10 -292 C-40 -302 -100 -303 -130 -294 L-120 -290 C-90 -297 -40 -297 -16 -289 Z" fill="#e6e0da" opacity={0.85} />
    <Wheel x={-300} roll={roll} />
    <Wheel x={300} roll={roll} />
    {/* exhaust vapour in the cold */}
    {f > 0 && <ellipse cx={-540 - (f % 40) * 1.5} cy={-40 - (f % 40) * 0.6} rx={30 + (f % 40)} ry={16 + (f % 40) * 0.4} fill="#cfd6dc" opacity={0.16 * (1 - (f % 40) / 40)} />}
  </g>
);

/* ------------------------------------------------------------------ */
/* Head-on view                                                        */
/* ------------------------------------------------------------------ */
export const FastbackFront: React.FC<{lights?: number; rim?: string; rimOp?: number; flicker?: number}> = ({lights = 1, rim = '#e0402e', rimOp = 0.7, flicker = 1}) => {
  const L = lights * flicker;
  return (
    <g>
      <ellipse cx={0} cy={6} rx={500} ry={30} fill="#000" opacity={0.6} />
      {/* tyres */}
      {[-1, 1].map((s) => (
        <rect key={s} x={s * 365 - 52} y={-120} width={104} height={124} rx={20} fill={CAR.tyre} stroke={INK} strokeWidth={4} />
      ))}
      {/* roof + windshield */}
      <Ink d="M-250 -380 C-150 -392 150 -392 250 -380 L312 -250 L-312 -250 Z" fill={CAR.paint} w={4} heavy={3} />
      <path d="M-232 -368 C-140 -378 140 -378 232 -368 L288 -262 L-288 -262 Z" fill={CAR.glass} stroke={CAR.chrome} strokeWidth={5} />
      <path d="M-180 -362 L-110 -366 L-200 -266 L-262 -266 Z" fill={CAR.glassLit} opacity={0.35} />
      <path d="M-90 -300 C-40 -312 10 -310 40 -300" stroke="#1a1d22" strokeWidth={8} />
      {/* body + hood */}
      <Ink d="M-430 -110 L-440 -200 C-438 -230 -420 -250 -380 -254 L380 -254 C420 -250 438 -230 440 -200 L430 -110 Z" fill={CAR.paint} w={4} heavy={4} />
      <path d="M-380 -254 L380 -254 C410 -250 428 -238 434 -222 L-434 -222 C-428 -238 -410 -250 -380 -254 Z" fill={CAR.paintLit} opacity={0.6} />
      <path d="M-120 -252 L-150 -222 M120 -252 L150 -222" stroke={CAR.paintShade} strokeWidth={3} />
      {/* grille: wide chrome surround, mesh, blank centre bar (no emblem) */}
      <path d="M-262 -214 H262 C276 -214 282 -206 282 -194 V-136 C282 -124 276 -118 262 -118 H-262 C-276 -118 -282 -124 -282 -136 V-194 C-282 -206 -276 -214 -262 -214 Z" fill="#050506" stroke={CAR.chrome} strokeWidth={7} />
      <rect x={-268} y={-208} width={536} height={84} fill="url(#chainlink)" opacity={0.6} />
      <rect x={-268} y={-208} width={536} height={84} fill="url(#hatchX)" opacity={0.35} />
      <path d="M-276 -166 H-70 M70 -166 H276" stroke={CAR.chromeShade} strokeWidth={4} />
      <rect x={-62} y={-186} width={124} height={40} rx={8} fill="#0a0a0b" stroke={CAR.chrome} strokeWidth={4} />
      {/* headlights (round, amber) with chrome bezels */}
      {[-1, 1].map((s) => (
        <g key={s}>
          {L > 0 && <circle cx={s * 352} cy={-172} r={210} fill="url(#warmGlow)" opacity={0.85 * L} />}
          <circle cx={s * 352} cy={-172} r={50} fill="#1a1612" stroke={CAR.chrome} strokeWidth={7} />
          <circle cx={s * 352} cy={-172} r={41} fill={L > 0.1 ? CAR.amber : '#4a3a24'} opacity={0.4 + 0.6 * L} />
          <circle cx={s * 352} cy={-172} r={41} fill="url(#hatchFine)" opacity={0.25} />
          <circle cx={s * 352 - 12} cy={-184} r={12} fill="#fff6dc" opacity={0.5 + 0.5 * L} />
        </g>
      ))}
      {/* bumper */}
      <path d="M-450 -112 C-440 -84 -400 -74 -300 -72 H300 C400 -74 440 -84 450 -112 C452 -100 448 -90 440 -84 C400 -60 360 -56 300 -56 H-300 C-360 -56 -400 -60 -440 -84 C-448 -90 -452 -100 -450 -112 Z" fill={CAR.chrome} stroke={INK} strokeWidth={3} />
      <path d="M-440 -100 C-400 -82 -360 -78 -300 -78 H300" stroke="#fff" strokeWidth={2} opacity={0.6} fill="none" />
      {/* fog / turn lights under the bumper */}
      {[-1, 1].map((s) => (
        <circle key={s} cx={s * 250} cy={-34} r={17} fill="#e0a23a" stroke={INK} strokeWidth={3} opacity={0.6 + 0.4 * L} />
      ))}
      {/* rim light on the hood edge and roof */}
      <path d="M-440 -200 C-438 -230 -420 -250 -380 -254 L-250 -254" stroke={rim} strokeWidth={4} opacity={rimOp} fill="none" />
      <path d="M-250 -380 C-150 -392 150 -392 250 -380" stroke={rim} strokeWidth={3} opacity={rimOp * 0.7} fill="none" />
      <path d="M-240 -384 C-150 -396 150 -396 240 -384 L230 -378 C150 -388 -150 -388 -230 -378 Z" fill="#e6e0da" opacity={0.85} />
      {/* antenna */}
      <line x1={330} y1={-254} x2={350} y2={-520} stroke="#8a8680" strokeWidth={2.4} />
    </g>
  );
};

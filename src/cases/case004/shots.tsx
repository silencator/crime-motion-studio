import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Layer, Stage} from '../../kit/camera';
import {Defs, Dust, Flash, Glint, Grade, Ink, policePhase} from '../../kit/fx';
import {clamp, easeI, easeIO, easeO, hash, inv, lerp, noise1, sec, stepF} from '../../kit/time';
import {IFBody} from '../../characters/IFBody';
import {Suspect} from '../../characters/Suspects';
import {Block, Lamp, PoliceCar} from '../../locations/soviet';
import {AlleyBack, BackWindowInside, BreathFog, ClaimForm, GlassShards, NightSky, PawnFacade, PawnInterior, Prints, Safe, SnowTop, WallClock} from '../../locations/pawnshop';
import timing from '../../../public/data/case004_vo.timing.json';
import {HIT_S, SHOTS} from './timeline';

/** f = frame inside the shot, g = global frame. */
export type ShotP = {f: number; g: number};

const ENV: number[] = (timing as {envelope: number[]}).envelope;
/** Mouth opening from the voice loudness, stepped on 3s (cel lip-flap). */
const talk = (g: number, gain = 1) => clamp(((ENV[Math.min(ENV.length - 1, stepF(g, 3))] ?? 0) - 0.1) * 1.9 * gain);
const blinkAt = (f: number, seed: number) => {
  const period = 150 + Math.floor(hash(seed) * 90);
  const ph = (f + seed * 37) % period;
  return ph < 4 ? 1 : ph < 7 ? 0.5 : 0;
};
const T = (g: number) => g / 60;

/** Police light bar wash entering from one side of frame (the militia car parked out of shot). */
const PoliceWash: React.FC<{g: number; side?: 'left' | 'right'; k?: number}> = ({g, side = 'left', k = 1}) => {
  const {red, blue} = policePhase(g);
  const dir = side === 'left' ? '90deg' : '270deg';
  return (
    <>
      <AbsoluteFill style={{background: `linear-gradient(${dir}, rgba(255,40,26,${0.45 * red * k}) 0%, rgba(255,40,26,0) 60%)`, mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: `linear-gradient(${dir}, rgba(50,100,255,${0.5 * blue * k}) 0%, rgba(50,100,255,0) 60%)`, mixBlendMode: 'screen'}} />
    </>
  );
};

/** Blurred pawn-shop interior behind close-ups. */
const ShopBokeh: React.FC<{g: number; x?: number; dark?: number; blur?: number}> = ({g, x = 600, dark = 0.35, blur = 16}) => (
  <AbsoluteFill>
    <Stage cam={{x, y: 900, zoom: 0.9}} bg="#1a120c">
      <Defs />
      <Layer blur={blur}>
        <PawnInterior f={g} clock={false} />
      </Layer>
    </Stage>
    <AbsoluteFill style={{background: '#000', opacity: dark}} />
  </AbsoluteFill>
);

const Pawnbroker: React.FC<{g: number; mouth?: number; look?: [number, number]; fear?: number; sweat?: number; rim?: string; rimOp?: number; smirk?: number}> = ({g, mouth = 0, look = [0, 0], fear = 0, sweat = 0, rim = '#ffb45a', rimOp = 0.7, smirk = 0}) => (
  <Suspect kind="pawnbroker" mouth={mouth} lookX={look[0]} lookY={look[1]} fear={fear} sweat={sweat} rim={rim} rimOp={rimOp} smirk={smirk} blink={blinkAt(stepF(g, 2), 13)} />
);

/* ================================================================== */
/* HOOK (trial): 3 cuts in 2.5 s, bright, on the crime, not on IF     */
/* ================================================================== */
export const HookFace: React.FC<ShotP> = ({f, g}) => {
  const dart = f < 22 ? 0.7 : -0.9;
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: 900, zoom: 0.62, f}} bg="#1c2a3e">
        <Defs />
        <Layer blur={5}>
          <PawnFacade x={540} y={1500} s={1} f={g} />
          <rect x={-1200} y={1498} width={3400} height={900} fill="#9fb0c4" />
        </Layer>
      </Stage>
      <Stage cam={{x: 540, y: 760, zoom: lerp(1.55, 1.68, f / 55), f, shake: 1.4}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(540 820) scale(1.3)">
            <Pawnbroker g={g} look={[dart, 0.05]} fear={0.1} rim="#ff4a3a" rimOp={0.9} />
          </g>
        </Layer>
      </Stage>
      <PoliceWash g={g} side="left" k={1.3} />
      <PoliceWash g={g + 24} side="right" k={0.8} />
      <AbsoluteFill style={{background: '#fff', opacity: 0.06, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

export const HookGlass: React.FC<ShotP> = ({f, g}) => {
  const {red, blue} = policePhase(g);
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(1270, 1320, f / 48), y: 930, zoom: lerp(2.9, 3.2, f / 48), rot: -6, f, shake: 1.2}}>
        <Defs />
        <Layer>
          <AlleyBack f={g} />
          <rect x={1150} y={760} width={300} height={320} fill="#ff2a1a" opacity={0.35 * red} style={{mixBlendMode: 'screen'}} />
          <rect x={1150} y={760} width={300} height={320} fill="#3a6aff" opacity={0.4 * blue} style={{mixBlendMode: 'screen'}} />
          <Glint x={1225} y={815} r={34} k={0.6 + 0.4 * hash(stepF(f, 6))} />
          <Glint x={1262} y={1030} r={22} k={0.8} />
        </Layer>
      </Stage>
      <Grade color="#9fb4d8" mode="multiply" op={0.2} />
    </AbsoluteFill>
  );
};

export const HookLights: React.FC<ShotP> = ({f, g}) => (
  <AbsoluteFill>
    <Stage cam={{x: 0, y: -210, zoom: lerp(3.0, 3.25, f / 44), rot: 4, f, shake: 1.5}} bg="#0b1220">
      <Defs />
      <Layer depth={0.3}>
        <NightSky x={-1500} y={-1500} w={3000} h={2000} moon={[300, -700]} moonR={60} />
      </Layer>
      <Layer>
        <PoliceCar x={0} y={0} s={1} f={g} />
      </Layer>
    </Stage>
    <PoliceWash g={g} side="left" k={0.8} />
    <PoliceWash g={g + 24} side="right" k={0.8} />
  </AbsoluteFill>
);

/* ================================================================== */
/* "The proof is in the snow": glide over the crust                   */
/* ================================================================== */
export const SnowGlide: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 95));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(600, 540, k), y: lerp(1500, 700, k), zoom: lerp(1.25, 1.45, k), rot: lerp(8, 0, k), f, shake: 0.5}}>
        <Defs />
        <Layer>
          <SnowTop f={g} />
        </Layer>
      </Stage>
      <Grade color="#7f98c0" mode="multiply" op={0.45} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.7) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* "Can you catch it?": IF's magnifying glass sweeps the snow (NEW)   */
/* ================================================================== */
export const Lens: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 52));
  const lx = lerp(330, 620, k);
  const ly = lerp(1150, 860, k);
  const R = 250;
  // world point under the lens (base cam: x 540,y 700, zoom 1)
  const wx = 540 + (lx - 540) / 1.0;
  const wy = 700 + (ly - 960) / 1.0;
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: 700, zoom: 1.0, f}}>
        <Defs />
        <Layer blur={3}>
          <SnowTop f={g} />
        </Layer>
      </Stage>
      <Grade color="#7f98c0" mode="multiply" op={0.5} />
      <AbsoluteFill style={{clipPath: `circle(${R}px at ${lx}px ${ly}px)`}}>
        <Stage cam={{x: wx + (540 - lx) / 2.3, y: wy + (960 - ly) / 2.3, zoom: 2.3, f}}>
          <Defs />
          <Layer>
            <SnowTop f={g} />
          </Layer>
        </Stage>
        <Grade color="#a9bedc" mode="multiply" op={0.25} />
      </AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(${lx} ${ly})`}>
          <path d={`M${R * 0.62} ${R * 0.62} L${R * 1.6} ${R * 1.75}`} stroke="#2a1a10" strokeWidth={52} strokeLinecap="round" />
          <path d={`M${R * 0.62} ${R * 0.62} L${R * 1.6} ${R * 1.75}`} stroke="#5a3a20" strokeWidth={38} strokeLinecap="round" />
          <circle r={R + 14} fill="none" stroke="#0b0706" strokeWidth={34} />
          <circle r={R + 14} fill="none" stroke="#b99a5c" strokeWidth={22} />
          <path d={`M${-R * 0.7} ${-R * 0.45} A${R * 0.85} ${R * 0.85} 0 0 1 ${-R * 0.2} ${-R * 0.8}`} stroke="#fff" strokeWidth={10} fill="none" opacity={0.45} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 4 · Pawn shop facade, militia car, sodium lamp                     */
/* ================================================================== */
export const Facade: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 102));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(470, 560, k), y: lerp(1080, 1180, k), zoom: lerp(0.95, 1.12, k), f, shake: 0.6}}>
        <Defs />
        <Layer depth={0.05}>
          <NightSky x={-800} y={-400} w={2700} h={1800} moon={[860, 260]} moonR={70} />
        </Layer>
        <Layer depth={0.3}>
          <Block x={-600} y={1100} w={700} floors={9} cols={9} fh={80} seed={71} lit={0.1} f={g} color="#1c2530" shade="#111820" side={50} />
          <Block x={850} y={1100} w={700} floors={10} cols={9} fh={80} seed={73} lit={0.1} f={g} color="#1c2530" shade="#111820" side={50} />
          <rect x={-900} y={1098} width={2900} height={400} fill="#0e141c" />
        </Layer>
        <Layer depth={0.7}>
          <PawnFacade x={560} y={1440} s={0.62} f={g} />
          <rect x={-900} y={1438} width={2900} height={900} fill="#9fb0c4" />
          <rect x={-900} y={1438} width={2900} height={40} fill="#c9d3de" />
          <Lamp x={-40} y={1440} h={720} f={g} />
        </Layer>
        <Layer depth={1.05}>
          <rect x={-900} y={1640} width={2900} height={600} fill="#8a9aae" />
          <PoliceCar x={760} y={1800} s={0.85} f={g} />
        </Layer>
      </Stage>
      <Grade color="#8aa0c8" mode="multiply" op={0.2} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 5 · Insert: the shop clock, 2:00                                   */
/* ================================================================== */
export const ClockInsert: React.FC<ShotP> = ({f, g}) => {
  const k = easeO(clamp(f / 66));
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: 900, zoom: lerp(1.25, 1.05, k), rot: lerp(-6, -2, k), f, shake: 0.5}} bg="#24180e">
        <Defs />
        <Layer>
          <rect x={-400} y={-400} width={1900} height={2800} fill="#3a2c1e" />
          <rect x={-400} y={-400} width={1900} height={2800} fill="url(#wallpaper)" />
          <WallClock x={540} y={900} r={330} h={2} m={0} f={g} />
          {/* window-grille shadow across the face */}
          {Array.from({length: 9}).map((_, i) => (
            <rect key={i} x={-300 + i * 180} y={-400} width={60} height={2800} fill="#000" opacity={0.28} transform="rotate(18 540 900)" />
          ))}
        </Layer>
      </Stage>
      <Grade color="#c08a50" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 6 · The empty safe, IF's flashlight sweeps it                      */
/* ================================================================== */
export const SafeShot: React.FC<ShotP> = ({f, g}) => {
  const open = lerp(0.75, 1, easeO(inv(5, 40, f)));
  const bx = lerp(260, 600, easeIO(inv(5, 70, f)));
  const by = lerp(1250, 1080, easeIO(inv(5, 70, f)));
  const on = f >= 3;
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: 1150, zoom: lerp(1.05, 1.15, f / 100), f, shake: 1}} bg="#0d0b09">
        <Defs />
        <Layer depth={0.9}>
          <rect x={-600} y={-400} width={2400} height={1900} fill="#2a2a24" />
          <rect x={-600} y={-400} width={2400} height={1900} fill="url(#wallpaper)" />
          <rect x={-600} y={1500} width={2400} height={1000} fill="#1a140e" />
          <rect x={-600} y={1500} width={2400} height={1000} fill="url(#parquet)" />
        </Layer>
        <Layer>
          <Safe x={600} y={1560} s={1.05} open={open} />
        </Layer>
      </Stage>
      {/* darkness with the flashlight pool */}
      <AbsoluteFill
        style={{
          background: on
            ? `radial-gradient(circle 440px at ${bx}px ${by}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.82) 100%)`
            : 'rgba(0,0,0,0.92)',
        }}
      />
      {on && <AbsoluteFill style={{background: `radial-gradient(circle 300px at ${bx}px ${by}px, rgba(255,236,190,0.35) 0%, rgba(255,236,190,0) 100%)`, mixBlendMode: 'screen'}} />}
      <Grade color="#9aa0a8" mode="multiply" op={0.15} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 7 · The broken back window from inside, moonlight                  */
/* ================================================================== */
export const WindowShot: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 126));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(600, 540, k), y: lerp(1100, 880, k), zoom: lerp(1.0, 1.28, k), f, shake: 0.7}}>
        <Defs />
        <Layer>
          <BackWindowInside f={g} />
          <Dust f={g} x={200} y={900} w={800} h={900} n={50} color="#dfeeff" />
        </Layer>
      </Stage>
      <Grade color="#6f8ab8" mode="multiply" op={0.45} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 8 · The pawnbroker's story (two angles, lip flap)                  */
/* ================================================================== */
export const OwnerA: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 121));
  return (
    <AbsoluteFill>
      <ShopBokeh g={g} x={500} blur={4} dark={0.25} />
      <Stage cam={{x: 560, y: 940, zoom: lerp(1.0, 1.06, k), f, shake: 0.8}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(600 860) scale(1.2)">
            <Pawnbroker g={g} mouth={talk(g)} look={[-0.7, 0]} rim="#ffb45a" rimOp={0.7} />
          </g>
        </Layer>
      </Stage>
      <Grade color="#b08a60" mode="multiply" op={0.25} />
    </AbsoluteFill>
  );
};

export const OwnerB: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 113));
  return (
    <AbsoluteFill>
      <ShopBokeh g={g} x={1500} blur={5} dark={0.35} />
      <Stage cam={{x: 520, y: 760, zoom: lerp(1.0, 1.1, k), rot: 2, f, shake: 1}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(500 900) scale(1.8)">
            <Pawnbroker g={g} mouth={talk(g)} look={[-0.8, 0.05]} smirk={clamp((f - 70) / 12) * 0.8} rim="#ffb45a" rimOp={0.8} />
          </g>
        </Layer>
      </Stage>
      <Grade color="#a8805a" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* Alley helpers                                                      */
/* ================================================================== */
const IF_Y = 1600;
const IFAt: React.FC<{x: number; s?: number; sf: number; walk: number; crouch?: number; torch?: number; aim?: number; flip?: boolean; g: number; fog?: boolean}> = ({
  x,
  s = 0.9,
  sf,
  walk,
  crouch = 0,
  torch = 0,
  aim = 0,
  flip = false,
  g,
  fog = true,
}) => (
  <g>
    <g transform={`translate(${x} ${IF_Y}) scale(${flip ? -s : s} ${s})`}>
      <IFBody phase={(sf / 66) * Math.PI * 2} walk={walk} wind={0.15} t={sf / 60} rim="#9fc4ff" rimOp={0.85} crouch={crouch} torch={torch} aim={aim} />
    </g>
    {fog && <BreathFog f={g} x={x + (flip ? -1 : 1) * (100 - crouch * 0) * s} y={IF_Y - (900 - crouch * 330) * s} dir={flip ? -1 : 1} s={s} op={0.55} />}
  </g>
);

/* ================================================================== */
/* 9 · IF steps out the back door                                     */
/* ================================================================== */
export const StepOut: React.FC<ShotP> = ({f, g}) => {
  const sf = stepF(f, 4);
  const px = 560 + sf * 2.6;
  const prints = clamp((px - 560) / 62, 0, 8);
  return (
    <AbsoluteFill>
      <Stage cam={{x: 640 + f * 2.4, y: 1140, zoom: 1.0, f, shake: 1}}>
        <Defs />
        <Layer>
          <AlleyBack f={g} />
          <Prints from={[560, IF_Y - 6]} to={[1060, IF_Y + 4]} n={9} upto={prints} s={0.9} />
          <IFAt x={px} sf={sf} walk={1} g={g} />
        </Layer>
      </Stage>
      <Grade color="#8aa4cc" mode="multiply" op={0.3} />
      <PoliceWash g={g} side="left" k={0.4} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 10 · Wide alley: still air, the moon, the window                   */
/* ================================================================== */
export const AlleyWide: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 133));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(1500, 1100, k), y: lerp(300, 1180, k), zoom: lerp(0.8, 0.86, k), f, shake: 0.5}}>
        <Defs />
        <Layer>
          <AlleyBack f={g} />
          <Prints from={[560, IF_Y - 6]} to={[1060, IF_Y + 4]} n={9} upto={6} s={0.9} />
          <IFAt x={900} sf={stepF(f, 4)} walk={0} g={g} />
        </Layer>
      </Stage>
      <Grade color="#7f98c4" mode="multiply" op={0.35} />
      <PoliceWash g={g} side="left" k={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 11 · IF crouches, flashlight on                                    */
/* ================================================================== */
export const Crouch: React.FC<ShotP> = ({f, g}) => {
  const cr = easeIO(inv(2, 32, f));
  const torch = f > 30 ? 1 : 0;
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(1120, 1160, f / 80), y: lerp(1260, 1320, f / 80), zoom: 1.3, f, shake: 0.9}}>
        <Defs />
        <Layer>
          <AlleyBack f={g} />
          <Prints from={[560, IF_Y - 6]} to={[1060, IF_Y + 4]} n={9} upto={9} s={0.9} />
          <IFAt x={1000} sf={stepF(f, 4)} walk={0} crouch={cr} torch={torch} aim={-18} g={g} />
        </Layer>
      </Stage>
      <Grade color="#7f98c4" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 12 · "It was smooth": low close on the snow under the window       */
/* ================================================================== */
export const Smooth: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 80));
  const bx = lerp(260, 640, k);
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(1180, 1320, k), y: 1300, zoom: 2.3, f, shake: 0.6}}>
        <Defs />
        <Layer>
          <AlleyBack f={g} />
        </Layer>
      </Stage>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 380px 260px at ${bx}px 1200px, rgba(255,246,220,0.22) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)`}} />
      <Grade color="#86a0c8" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 13 · Top-down: IF's prints stop; no one else's                     */
/* ================================================================== */
export const TopDown: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 132));
  const prints = clamp(inv(0, 54, f) * 7, 0, 7);
  const bx = lerp(300, 760, easeIO(inv(6, 72, f)));
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: lerp(1150, 980, k), zoom: lerp(0.85, 0.95, k), rot: lerp(-5, -1, k), f, shake: 0.5}}>
        <Defs />
        <Layer>
          <SnowTop f={g} prints={prints} beam={[bx, 640, 260]} />
        </Layer>
      </Stage>
      <Grade color="#7f98c0" mode="multiply" op={0.45} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 16 · Flashback (red): the window bursts OUTWARD from inside        */
/* ================================================================== */
const OwnerSilhouette: React.FC<{swing: number}> = ({swing}) => (
  <g fill="#120404">
    <ellipse cx={0} cy={-260} rx={78} ry={92} />
    <path d="M-210 400 C-220 60 -190 -110 -90 -160 L90 -160 C190 -110 220 60 210 400 Z" />
    {/* arm + crowbar */}
    <g transform={`rotate(${lerp(-70, 40, swing)} 120 -110)`}>
      <path d="M100 -140 L150 -110 L80 220 L30 200 Z" transform="rotate(-90 120 -110)" />
      <path d="M118 -120 L132 -100 L-200 -330 L-214 -312 Z" />
      <path d="M-214 -330 l-30 -20 l10 -16 l32 22 Z" />
    </g>
  </g>
);

export const Burst: React.FC<ShotP> = ({f, g}) => {
  const hit = sec(HIT_S) - sec(SHOTS.burst[0]);
  const swing = easeI(inv(0, hit, f));
  const after = Math.max(0, f - hit);
  const shake = after > 0 && after < 26 ? 14 * (1 - after / 26) : 0.8;
  const land = clamp((after - 26) / 20);
  return (
    <AbsoluteFill>
      <Stage cam={{x: 1300, y: lerp(1060, 1120, clamp(f / 60)), zoom: after > 0 ? 1.9 : 1.75, f, shake}}>
        <Defs />
        <Layer>
          <AlleyBack f={g} glass={land} door={0} />
          {/* lit interior behind the window, the owner inside */}
          <rect x={1150} y={760} width={300} height={320} fill="#c95a2a" />
          <rect x={1150} y={760} width={300} height={320} fill="url(#warmGlow)" />
          <svg x={1150} y={760} width={300} height={320} viewBox="1150 760 300 320" overflow="hidden">
            <g transform="translate(1300 1050) scale(0.75)">
              <OwnerSilhouette swing={swing} />
            </g>
          </svg>
          <Ink2 />
          {/* intact pane before the hit */}
          {after === 0 && <rect x={1150} y={760} width={300} height={320} fill="#cfe6ff" opacity={0.25} stroke="#e6f2ff" strokeWidth={3} />}
          {/* shards flying OUT toward camera and down onto the snow */}
          {after > 0 &&
            Array.from({length: 60}).map((_, i) => {
              const tt = Math.min(after, 40) / 60;
              const vx = (hash(i * 1.3) - 0.5) * 900;
              const vy = -200 - hash(i * 2.1) * 400;
              const x = 1300 + (hash(i * 3.7) - 0.5) * 280 + vx * tt;
              const y = Math.min(1520, 920 + (hash(i * 5.3) - 0.5) * 300 + vy * tt + 0.5 * 2600 * tt * tt);
              const sz = 6 + hash(i * 7.9) * 22;
              const r = hash(i) * 360 + after * (hash(i * 4) - 0.5) * 30;
              return (
                <path
                  key={i}
                  d={`M${-sz} 0 L${-sz * 0.2} ${-sz * 0.7} L${sz} ${-sz * 0.1} L${sz * 0.3} ${sz * 0.6} Z`}
                  transform={`translate(${x} ${y}) rotate(${r})`}
                  fill="#ffffff"
                  opacity={0.95 * (1 - land)}
                  stroke="#9fd0ff"
                  strokeWidth={2.4}
                  style={{mixBlendMode: 'screen'}}
                />
              );
            })}
          {after > 0 && <GlassShards cx={1300} cy={1430} spread={300} depth={190} n={46} f={g} op={land} seed={4} />}
        </Layer>
      </Stage>
      <Grade color="#e8963a" mode="multiply" op={0.5} />
      <Flash f={f} at={hit} color="#ffffff" dur={10} peak={0.6} />
      <Flash f={f} at={hit + 4} color="#ffb050" dur={22} peak={0.4} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.8) 100%)'}} />
    </AbsoluteFill>
  );
};
/** Window frame redrawn over the inside light (keeps the ink edge crisp). */
const Ink2: React.FC = () => (
  <g>
    <path d="M1130 740 H1470 V1100 H1130 Z M1150 760 V1080 H1450 V760 Z" fill="#2c241c" fillRule="evenodd" stroke="#0b0706" strokeWidth={3} />
    <rect x={1290} y={760} width={16} height={320} fill="#2c241c" stroke="#0b0706" strokeWidth={2.5} />
  </g>
);


/* ================================================================== */
/* Props: IF's gloved hand, the hero shard, evidence bag with shard   */
/* ================================================================== */
/** IF's gloved hand pinching at (0,0); the coat sleeve runs off toward +x/+y (rotate the group to aim it). */
const GloveHand: React.FC<{open?: number}> = ({open = 0}) => (
  <g>
    <Ink d="M60 40 L900 520 L900 900 L-20 260 Z" fill="#2b2d33" w={4} heavy={4} hatch="hatch" hatchOp={0.15} />
    <rect x={10} y={60} width={110} height={40} fill="#e4dccd" stroke="#0b0706" strokeWidth={3} transform="rotate(30 60 80)" />
    <Ink d="M-10 10 C-40 30 -40 90 0 130 C40 170 120 170 150 120 C170 80 150 40 110 20 C80 0 30 -10 -10 10 Z" fill="#3A251D" w={3.4} heavy={3} />
    {/* index finger + thumb meeting at the pinch point */}
    <Ink d={`M10 40 C-10 ${20 - open * 20} -24 ${0 - open * 30} -8 ${-12 - open * 30} C6 ${-20 - open * 30} 24 ${0 - open * 10} 40 30 Z`} fill="#3A251D" w={3} heavy={2} />
    <Ink d={`M30 80 C0 ${70 + open * 10} -16 ${40 + open * 20} -4 ${14 + open * 20} C10 0 30 30 56 60 Z`} fill="#22140F" w={3} heavy={2} />
    <path d="M40 60 C70 70 100 90 120 120" stroke="#0b0706" strokeWidth={2} fill="none" opacity={0.6} />
  </g>
);

const HeroShard: React.FC<{s?: number; glint?: number}> = ({s = 1, glint = 0}) => (
  <g transform={`scale(${s})`}>
    <path d="M-46 -6 L-10 -40 L50 -14 L18 34 L-30 22 Z" fill="#cfe6ff" opacity={0.75} stroke="#0b0706" strokeWidth={2.4} />
    <path d="M-34 -2 L40 -12" stroke="#fff" strokeWidth={3} opacity={0.8} />
    <path d="M-10 -40 L18 34" stroke="#9fc4ff" strokeWidth={2} opacity={0.6} />
    {glint > 0 && <Glint x={30} y={-14} r={46} k={glint} />}
  </g>
);

const ShardBag: React.FC = () => (
  <g>
    <rect x={-150} y={-190} width={300} height={380} rx={10} fill="#000" opacity={0.35} transform="translate(10 14)" />
    <rect x={-150} y={-190} width={300} height={380} rx={10} fill="#d4dde2" opacity={0.32} stroke="#eef4f6" strokeWidth={4} />
    <rect x={-150} y={-190} width={300} height={54} fill="#c8231b" opacity={0.92} />
    <text x={0} y={-152} fontFamily="IFStamp" fontSize={32} fill="#fff" textAnchor="middle" letterSpacing={5}>
      EVIDENCE
    </text>
    <g transform="translate(0 40) rotate(-14)">
      <HeroShard s={1.9} />
    </g>
    <path d="M-130 -110 L-96 170" stroke="#fff" strokeWidth={8} opacity={0.3} />
  </g>
);

/* ================================================================== */
/* "…lay on top of the snow": IF lifts one shard, clean crust beneath */
/* ================================================================== */
export const ShardLift: React.FC<ShotP> = ({f, g}) => {
  const focus = easeIO(inv(0, 40, f));
  const reach = easeO(inv(56, 92, f));
  const lift = easeIO(inv(98, 130, f));
  const k = easeIO(clamp(f / 182));
  const SX = 560;
  const SY = 520;
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(520, 570, k), y: lerp(560, 600, k), zoom: lerp(2.4, 2.7, k), rot: -4, f, shake: 0.5}}>
        <Defs />
        <Layer blur={lerp(10, 0, focus)}>
          <SnowTop f={g} beam={[600, 520, 240]} />
          {/* the spot under the hero shard: clean, unbroken crust */}
          <ellipse cx={SX} cy={SY} rx={60} ry={42} fill="#c4d2e0" />
          <ellipse cx={SX + 10} cy={SY + 6} rx={58} ry={14} fill="#5f7186" opacity={0.3 * (1 - lift)} />
          <g transform={`translate(${SX + lift * 60} ${SY - lift * 120})`}>
            <ellipse cx={lift * 30} cy={lift * 130} rx={46} ry={18} fill="#5f7186" opacity={0.25 * (1 - lift * 0.6)} />
            <HeroShard s={1 + lift * 0.35} glint={lift > 0.6 ? 0.9 : 0} />
          </g>
          {reach > 0 && (
            <g transform={`translate(${SX + 20 + (1 - reach) * 420 + lift * 60} ${SY + 10 + (1 - reach) * 380 - lift * 120}) rotate(-8) scale(0.55)`}>
              <GloveHand open={1 - reach} />
            </g>
          )}
        </Layer>
      </Stage>
      <Grade color="#86a0c8" mode="multiply" op={0.3} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.7) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* "The window was smashed": low angle, shard held up to the window  */
/* ================================================================== */
export const LookUp: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 97));
  const raise = easeO(clamp(f / 40));
  return (
    <AbsoluteFill>
      <Stage cam={{x: 1300, y: lerp(1000, 940, k), zoom: lerp(1.45, 1.7, k), rot: -7, f, shake: 0.7}}>
        <Defs />
        <Layer>
          <AlleyBack f={g} />
          <rect x={-1200} y={1180} width={5200} height={400} fill="url(#fadeDown)" opacity={0.0} />
        </Layer>
      </Stage>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <Defs />
        <g transform={`translate(${300} ${lerp(1750, 1380, raise)}) rotate(-30) scale(1.4)`}>
          <GloveHand />
          <g transform="translate(-6 -30)">
            <HeroShard s={1.9} glint={0.8 + 0.2 * hash(stepF(f, 6))} />
          </g>
        </g>
      </svg>
      <Grade color="#7f98c4" mode="multiply" op={0.35} />
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 40%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* "There was no thief.": the imagined burglar dissolves (NEW)        */
/* ================================================================== */
const GhostThief: React.FC<{k: number; f: number}> = ({k, f}) => {
  const body = 'M-40 -330 C-70 -330 -80 -290 -70 -260 L-120 -240 C-170 -200 -190 -120 -180 -40 L-200 120 L-150 130 L-120 -10 L-110 140 L-150 380 L-90 390 L-40 160 L10 390 L70 380 L30 140 L40 -20 L100 40 L140 0 L60 -140 C50 -200 30 -240 0 -260 C20 -290 10 -330 -40 -330 Z';
  return (
    <g>
      <g opacity={(1 - k) * 0.85}>
        <path d={body} fill="#cfe6ff" opacity={0.18} />
        <path d={body} fill="none" stroke="#e6f2ff" strokeWidth={4} strokeDasharray="14 12" />
        {/* cap + sack */}
        <path d="M-90 -320 C-80 -370 20 -370 30 -320 Z" fill="none" stroke="#e6f2ff" strokeWidth={4} strokeDasharray="10 10" />
        <circle cx={120} cy={-60} r={70} fill="none" stroke="#e6f2ff" strokeWidth={4} strokeDasharray="12 10" />
      </g>
      {/* disintegrates into drifting snow */}
      {k > 0 &&
        Array.from({length: 70}).map((_, i) => {
          const x0 = (hash(i * 1.9) - 0.5) * 360;
          const y0 = (hash(i * 2.7) - 0.5) * 760;
          const dx = 60 + hash(i * 4.1) * 260;
          const dy = -40 - hash(i * 3.3) * 220;
          return <circle key={i} cx={x0 + dx * k + noise1(i + stepF(f, 4) * 0.05) * 10} cy={y0 + dy * k} r={3 + hash(i) * 5} fill="#eef6ff" opacity={(1 - k) * 0.9} />;
        })}
    </g>
  );
};

export const Ghost: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(inv(22, 70, f));
  return (
    <AbsoluteFill>
      <Stage cam={{x: 1300, y: lerp(1120, 1080, f / 82), zoom: 1.25, f, shake: 0.5}}>
        <Defs />
        <Layer>
          <AlleyBack f={g} />
          {/* the footprints a thief would have left: shown, then gone */}
          <g opacity={(1 - k) * 0.8}>
            <Prints from={[1700, 1700]} to={[1340, 1440]} n={6} upto={6} s={0.9} color="#e6f2ff" />
          </g>
          <g transform="translate(1290 1060) scale(0.62)">
            <GhostThief k={k} f={g} />
          </g>
        </Layer>
      </Stage>
      <Grade color="#7f98c4" mode="multiply" op={0.35} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* "He robbed his own shop,": 2 AM, his hands hide the cash (NEW)     */
/* ================================================================== */
const KnitHands: React.FC = () => (
  <g>
    <Ink d="M-30 -40 L420 -560 L560 -440 L110 60 Z" fill="#5b4a2c" w={3.4} heavy={3} hatch="hatchV" hatchOp={0.25} />
    <rect x={-50} y={-70} width={120} height={50} fill="#3a2f1b" stroke="#0b0706" strokeWidth={3} transform="rotate(-48 10 -45)" />
    <Ink d="M-70 -30 C-100 0 -96 60 -50 80 C0 100 60 80 70 30 C76 -10 40 -40 0 -46 Z" fill="#C8917A" w={3} heavy={2} />
    <path d="M-60 40 C-30 50 0 50 30 40" stroke="#0b0706" strokeWidth={2} fill="none" opacity={0.6} />
  </g>
);

export const Stash: React.FC<ShotP> = ({f, g}) => {
  const cyc = (stepF(f, 3) % 54) / 54;
  const k = cyc < 0.55 ? easeIO(cyc / 0.55) : 1;
  const hx = lerp(380, 770, k);
  const hy = lerp(1120, 1330, k) - Math.sin(k * Math.PI) * 140;
  const piled = Math.min(4, Math.floor(stepF(f, 3) / 54) + 1);
  const flick = 0.88 + 0.12 * hash(stepF(f, 5));
  const z = lerp(1.15, 1.25, f / 109);
  return (
    <AbsoluteFill>
      <Stage cam={{x: 600, y: 1080, zoom: z, f, shake: 0.9}} bg="#120c08">
        <Defs />
        <Layer depth={0.9}>
          <rect x={-600} y={-400} width={2400} height={1820} fill="#3a2c1e" />
          <rect x={-600} y={-400} width={2400} height={1820} fill="url(#wallpaper)" />
          <WallClock x={880} y={560} r={120} h={2} m={0} f={g} />
          <circle cx={500} cy={500} r={900} fill="url(#warmGlow)" opacity={0.45 * flick} />
        </Layer>
        <Layer>
          <rect x={-600} y={1400} width={2400} height={900} fill="#2a1a10" />
          <rect x={-600} y={1400} width={2400} height={900} fill="url(#parquet)" />
          <Safe x={330} y={1420} s={0.7} open={1} />
          {/* lifted floorboard + hiding hole */}
          <rect x={660} y={1400} width={260} height={70} fill="#050302" stroke="#0b0706" strokeWidth={3} />
          {Array.from({length: piled}).map((_, i) => (
            <rect key={i} x={680 + (i % 2) * 110} y={1440 - Math.floor(i / 2) * 22} width={96} height={24} fill="#c8b070" stroke="#0b0706" strokeWidth={2} />
          ))}
          <g transform="translate(925 1400) rotate(-28)">
            <rect x={0} y={-16} width={200} height={32} fill="#4a3020" stroke="#0b0706" strokeWidth={3} />
          </g>
          {/* the bundle in transit */}
          {k < 1 && <rect x={hx - 50} y={hy - 14} width={100} height={30} fill="#c8b070" stroke="#0b0706" strokeWidth={2.5} transform={`rotate(${lerp(-10, 12, k)} ${hx} ${hy})`} />}
          <g transform={`translate(${hx + 30} ${hy - 6}) scale(0.8)`}>
            <KnitHands />
          </g>
        </Layer>
      </Stage>
      <Grade color="#d8a060" mode="multiply" op={0.45} />
      <AbsoluteFill style={{background: '#000', opacity: 0.12, mixBlendMode: 'saturation'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.85) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* "for the insurance.": the claim typed out, letter by letter (NEW)  */
/* ================================================================== */
export const TYPED_LINE = 'STOLEN: 48 000 ROUBLES';
export const TYPE_F0 = 4;
export const TYPE_STEP = 2.5;
export const Typed: React.FC<ShotP> = ({f}) => {
  const n = clamp(Math.floor((f - TYPE_F0) / TYPE_STEP) + 1, 0, TYPED_LINE.length);
  const CW = 27;
  const shift = 0;
  const tx = 300 + n * CW;
  const strike = (f - TYPE_F0) % TYPE_STEP < 1.2 && n < TYPED_LINE.length;
  const k = easeIO(clamp(f / 74));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(520, 600, k), y: lerp(760, 720, k), zoom: lerp(1.15, 1.3, k), rot: -3, f, shake: 0.6}} bg="#1a120c">
        <Defs />
        <Layer>
          <rect x={-600} y={-400} width={2400} height={2800} fill="#24180e" />
          <g transform={`translate(${shift} 0)`}>
            <Ink d="M160 200 H1100 V1120 H160 Z" fill="#e4dcc4" heavy={0} w={3} />
            <rect x={160} y={200} width={940} height={920} fill="url(#concrete)" opacity={0.3} />
            {[
              ['ГОССТРАХ · CLAIM FOR LOSS', 380],
              ['INCIDENT: BURGLARY, 02:00', 520],
              ['ENTRY:    BACK WINDOW', 620],
            ].map(([txt, y]) => (
              <text key={txt as string} x={300} y={y as number} fontFamily="IFType" fontSize={44} fill="#1a120c">
                {txt}
              </text>
            ))}
            <text x={300} y={720} fontFamily="IFType" fontSize={44} fill="#1a120c" letterSpacing={0}>
              {TYPED_LINE.slice(0, n)}
            </text>
          </g>
          {/* platen + carriage, typebar guide at the type point */}
          <rect x={60} y={760} width={1000} height={130} rx={60} fill="#151515" stroke="#0b0706" strokeWidth={4} />
          <rect x={60} y={770} width={1000} height={24} fill="#3a3a3a" opacity={0.6} />
          <path d={`M${tx - 10} 740 L${tx + 4} 770 L${tx + 18} 740`} fill="#9a9a9a" stroke="#0b0706" strokeWidth={2} />
          {strike && <rect x={tx - 4} y={686} width={22} height={40} fill="#2a2a2a" />}
          {/* key rows */}
          {Array.from({length: 3}).map((_, r) =>
            Array.from({length: 9}).map((_, c) => {
              const down = strike && hash(n * 3.1) * 27 > r * 9 + c - 0.5 && hash(n * 3.1) * 27 < r * 9 + c + 0.5;
              return <circle key={`${r}${c}`} cx={150 + c * 100 + r * 30} cy={1050 + r * 110 + (down ? 8 : 0)} r={38} fill="#1e1e1e" stroke="#c9c2b0" strokeWidth={4} />;
            }),
          )}
        </Layer>
      </Stage>
      <Grade color="#b08a5a" mode="multiply" op={0.3} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 55% 40%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* ENDING: the pawnbroker behind the militia car window, IF holds the */
/* evidence (the shard) — framed like frame 1, so the loop is seamless */
/* ================================================================== */
export const CarEnd: React.FC<ShotP> = ({f, g}) => {
  const rack = easeIO(inv(40, 80, f));
  const push = easeIO(clamp(f / 150));
  const lookUp = f > 170 ? 1 : 0;
  const {red, blue} = policePhase(g);
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: lerp(880, 790, push), zoom: lerp(1.0, 1.25, push), f, shake: 0.7}} bg="#0b1220">
        <Defs />
        <Layer depth={0.9} blur={lerp(0, 2, 1 - rack) + 4 * (1 - rack)}>
          {/* car door + rear side window */}
          <rect x={-600} y={-400} width={2400} height={2800} fill="#1b1a1c" />
          <rect x={-600} y={-400} width={2400} height={2800} fill="url(#hatch)" opacity={0.12} />
          <rect x={150} y={330} width={790} height={980} rx={60} fill="#0e1418" stroke="#9a9a96" strokeWidth={14} />
          <g style={{filter: `blur(${(1 - rack) * 4}px)`}}>
            <svg x={150} y={330} width={790} height={980} viewBox="150 330 790 980" overflow="hidden">
              <rect x={150} y={330} width={790} height={980} fill="#162030" />
              <g transform="translate(560 860) scale(1.3)">
                <Pawnbroker g={g} look={lookUp ? [0, 0] : [0.2, 0.7]} fear={0.15} rim="#ff4a3a" rimOp={0.9} />
              </g>
              <rect x={150} y={330} width={790} height={980} fill="#ff2a1a" opacity={0.28 * red} style={{mixBlendMode: 'screen'}} />
              <rect x={150} y={330} width={790} height={980} fill="#3a6aff" opacity={0.3 * blue} style={{mixBlendMode: 'screen'}} />
            </svg>
          </g>
          {/* glass reflections */}
          <path d="M200 380 L420 380 L200 700 Z" fill="#cfe6ff" opacity={0.12} />
          <path d="M700 1250 L900 900 L900 1250 Z" fill="#cfe6ff" opacity={0.08} />
          <rect x={-600} y={1330} width={2400} height={14} fill="#9a9a96" />
          <text x={540} y={1460} textAnchor="middle" fontFamily="IFStamp" fontSize={70} letterSpacing={10} fill="#c8c2bb" opacity={0.85}>
            МИЛИЦИЯ
          </text>
        </Layer>
      </Stage>
      {/* foreground: IF's gloved hand holds up the bagged shard (sharp first, then out of focus as focus racks to his face) */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: `blur(${rack * 9}px)`}}>
        <Defs />
        <g transform={`translate(${lerp(300, 220, push)} ${lerp(1180, 1300, push)}) rotate(-8) scale(1.1)`}>
          <ShardBag />
          <g transform="translate(30 190) rotate(95) scale(0.7)">
            <GloveHand />
          </g>
        </g>
      </svg>
      <PoliceWash g={g} side="left" k={0.9} />
      <PoliceWash g={g + 24} side="right" k={0.5} />
      <AbsoluteFill style={{background: '#fff', opacity: 0.05, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

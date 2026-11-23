import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Layer, Stage} from '../../kit/camera';
import {CigSmoke, Defs, Dust, Flash, Grade, policePhase} from '../../kit/fx';
import {clamp, easeI, easeIO, easeO, hash, inv, lerp, noise1, sec, stepF} from '../../kit/time';
import {IFBust} from '../../characters/IFBust';
import {IFBody} from '../../characters/IFBody';
import {Suspect} from '../../characters/Suspects';
import {Block, Lamp, PoliceCar} from '../../locations/soviet';
import {AlleyBack, BackWindowInside, BreathFog, ClaimForm, GlassShards, NightSky, PawnFacade, PawnInterior, Prints, Safe, SnowTop, WallClock} from '../../locations/pawnshop';
import timing from '../../../public/data/case004.timing.json';

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
const ShopBokeh: React.FC<{g: number; x?: number; dark?: number}> = ({g, x = 600, dark = 0.35}) => (
  <AbsoluteFill>
    <Stage cam={{x, y: 900, zoom: 0.9}} bg="#1a120c">
      <Defs />
      <Layer blur={16}>
        <PawnInterior f={g} clock={false} />
      </Layer>
    </Stage>
    <AbsoluteFill style={{background: '#000', opacity: dark}} />
  </AbsoluteFill>
);

/** Cold night bokeh (street lights, blue). */
const NightBokeh: React.FC<{g: number; seed?: number; dark?: number}> = ({g, seed = 1, dark = 0.3}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #1b2a40 0%, #05080e 75%)'}}>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: 'blur(20px)'}}>
      <rect x={0} y={1300} width={1080} height={700} fill="#5a6a80" opacity={0.5} />
      {Array.from({length: 8}).map((_, i) => (
        <circle key={i} cx={hash(i * 3 + seed) * 1080} cy={250 + hash(i * 7 + seed) * 900} r={40 + hash(i + seed) * 80} fill={i % 3 === 0 ? '#ffb347' : '#8fb4ff'} opacity={0.18 + 0.15 * hash(i + Math.floor(g / 40))} />
      ))}
    </svg>
    <AbsoluteFill style={{background: '#000', opacity: dark}} />
  </AbsoluteFill>
);

const Pawnbroker: React.FC<{g: number; mouth?: number; look?: [number, number]; fear?: number; sweat?: number; rim?: string; rimOp?: number}> = ({g, mouth = 0, look = [0, 0], fear = 0, sweat = 0, rim = '#ffb45a', rimOp = 0.7}) => (
  <Suspect kind="pawnbroker" mouth={mouth} lookX={look[0]} lookY={look[1]} fear={fear} sweat={sweat} rim={rim} rimOp={rimOp} blink={blinkAt(stepF(g, 2), 13)} />
);

/* ================================================================== */
/* 1 · HOOK: the pawnbroker under police lights (frame 1 already lit) */
/* ================================================================== */
export const Hook: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 150));
  const dart = Math.floor(stepF(f, 4) / 40) % 2 ? -0.9 : 0.5;
  return (
    <AbsoluteFill>
      <NightBokeh g={g} seed={3} />
      <Stage cam={{x: 540, y: 900, zoom: lerp(1.05, 1.22, k), f, shake: 0.9}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(540 820) scale(1.3)">
            <Pawnbroker g={g} look={[dart, 0.1]} sweat={0.35} fear={0.15} rim="#8fb4ff" rimOp={0.8} />
          </g>
        </Layer>
      </Stage>
      <Grade color="#7a8cb0" mode="multiply" op={0.35} />
      <PoliceWash g={g} side="left" k={1.2} />
      <PoliceWash g={g + 24} side="right" k={0.6} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 2 · "The proof is in the snow": glide over the crust               */
/* ================================================================== */
export const SnowHook: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 115));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(600, 540, k), y: lerp(1500, 700, k), zoom: lerp(1.25, 1.45, k), rot: lerp(8, 0, k), f, shake: 0.5}}>
        <Defs />
        <Layer>
          <SnowTop f={g} />
        </Layer>
      </Stage>
      <Grade color="#7f98c0" mode="multiply" op={0.5} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.8) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 3 · IF close-up: "Can you catch it?"                               */
/* ================================================================== */
export const IFAsk: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const k = easeIO(clamp(f / 90));
  const sf = stepF(f, 3);
  return (
    <AbsoluteFill>
      <NightBokeh g={g} seed={7} dark={0.45} />
      <Stage cam={{x: 520, y: 860, zoom: lerp(1.0, 1.1, k), f, shake: 0.8}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(560 1000) scale(1.9)">
            <IFBust lookX={t < 4.9 ? -0.6 : 0.15} lookY={0.1} brow={clamp((t - 4.85) / 0.4)} blink={blinkAt(sf, 4)} rim="#9fc4ff" rimOp={0.9} cig cigGlow={0.5 + 0.4 * hash(stepF(f, 6))} shade={0.65} />
          </g>
          <CigSmoke f={g} x={300} y={1310} scale={0.9} op={0.35} len={380} />
        </Layer>
      </Stage>
      <Grade color="#7f93b8" mode="multiply" op={0.3} />
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
  const t = T(g);
  const open = lerp(0.75, 1, easeO(inv(8.8, 9.4, t)));
  const bx = lerp(260, 600, easeIO(inv(8.8, 9.9, t)));
  const by = lerp(1250, 1080, easeIO(inv(8.8, 9.9, t)));
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
      <ShopBokeh g={g} x={500} />
      <Stage cam={{x: 560, y: 940, zoom: lerp(1.0, 1.06, k), f, shake: 0.8}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(600 860) scale(1.2)">
            <Pawnbroker g={g} mouth={talk(g)} look={[-0.7, 0]} sweat={0.3} rim="#ffb45a" rimOp={0.7} />
          </g>
        </Layer>
      </Stage>
      <Grade color="#b08a60" mode="multiply" op={0.25} />
    </AbsoluteFill>
  );
};

export const OwnerB: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 113));
  const dart = Math.floor(stepF(f, 4) / 28) % 3 === 1 ? 0.9 : -0.6;
  return (
    <AbsoluteFill>
      <ShopBokeh g={g} x={900} dark={0.5} />
      <Stage cam={{x: 520, y: 760, zoom: lerp(1.0, 1.1, k), rot: 2, f, shake: 1}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(500 900) scale(1.8)">
            <Pawnbroker g={g} mouth={talk(g)} look={[dart, 0.15]} sweat={0.7} fear={0.2} rim="#ffb45a" rimOp={0.8} />
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
  const t = T(g);
  const cr = easeIO(inv(20.78, 21.3, t));
  const torch = t > 21.25 ? 1 : 0;
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
  const t = T(g);
  const k = easeIO(clamp(f / 146));
  const prints = clamp(inv(23.4, 24.3, t) * 7, 0, 7);
  const bx = lerp(300, 760, easeIO(inv(23.5, 24.6, t)));
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
/* 14 · Macro: the glass lies ON TOP of the snow (rack focus)         */
/* ================================================================== */
export const GlassMacro: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const focus = easeIO(inv(25.9, 26.7, t));
  const k = easeIO(clamp(f / 203));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(470, 600, k), y: lerp(560, 470, k), zoom: lerp(2.3, 2.75, k), rot: lerp(-8, 4, k), f, shake: 0.5}}>
        <Defs />
        <Layer blur={lerp(12, 0, focus)}>
          <SnowTop f={g} beam={[lerp(380, 640, k), 480, 220]} />
        </Layer>
      </Stage>
      <Grade color="#86a0c8" mode="multiply" op={0.35} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 15 · IF's eyes: "The window was smashed…" (punch-in)               */
/* ================================================================== */
export const IFEyes: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const punch = t >= 30.1 ? 1 : 0;
  const zoom = lerp(1.0, 1.06, clamp(f / 50)) + punch * 0.22;
  const shake = t >= 30.1 && t < 30.4 ? 8 : 0.6;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: '#06080c'}} />
      <Stage cam={{x: 455, y: 700, zoom, f, shake}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(560 900) scale(3.4)">
            <IFBust lookX={t < 29.7 ? 0 : -1} lookY={0.2} brow={clamp((t - 29.5) / 0.4)} rim={punch ? '#ff4a3a' : '#9fc4ff'} rimOp={0.95} shade={0.7} />
          </g>
        </Layer>
      </Stage>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.9) 75%)'}} />
      <Grade color={punch ? '#c07060' : '#7f93b8'} mode="multiply" op={0.35} />
      <Flash f={f} at={sec(30.1) - sec(29.22)} color="#ff3a2a" dur={14} peak={0.45} />
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
  const t = T(g);
  const hitT = 31.02;
  const hit = sec(hitT) - sec(30.6);
  const swing = easeI(inv(30.62, hitT, t));
  const after = Math.max(0, f - hit);
  const shake = after > 0 && after < 26 ? 14 * (1 - after / 26) : 0.8;
  const land = clamp((after - 26) / 20);
  return (
    <AbsoluteFill>
      <Stage cam={{x: 1300, y: lerp(1060, 1120, clamp(f / 87)), zoom: after > 0 ? 1.9 : 1.75, f, shake}}>
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
      <Grade color="#e0402e" mode="multiply" op={0.55} />
      <Flash f={f} at={hit} color="#ffffff" dur={10} peak={0.6} />
      <Flash f={f} at={hit + 4} color="#ff2a1a" dur={22} peak={0.5} />
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
/* 17 · "There was no thief." the pawnbroker freezes                  */
/* ================================================================== */
export const NoThief: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const frozen = t >= 32.4;
  return (
    <AbsoluteFill>
      <NightBokeh g={frozen ? sec(32.4) : g} seed={11} dark={0.55} />
      <Stage cam={{x: 540, y: 860, zoom: frozen ? lerp(1.12, 1.18, clamp((f - 20) / 76)) : 1.0, f, shake: frozen ? 0 : 1.2}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(540 900) scale(1.75)">
            <Pawnbroker g={frozen ? sec(32.4) : g} look={frozen ? [0, 0] : [noise1(stepF(g, 8) * 0.1), 0]} fear={frozen ? 1 : 0.4} sweat={1} rim="#ff4a3a" rimOp={0.85} />
          </g>
        </Layer>
      </Stage>
      <Grade color={frozen ? '#a46a64' : '#8a7a90'} mode="multiply" op={0.45} />
      <PoliceWash g={g} side="right" k={0.5} />
      {frozen && <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 90%)'}} />}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 18 · Flashback (red): his shadow empties his own safe              */
/* ================================================================== */
const StuffShadow: React.FC<{k: number}> = ({k}) => (
  <g fill="#050101">
    <ellipse cx={0} cy={-300} rx={110} ry={125} />
    <path d="M-290 900 C-300 200 -270 -60 -130 -150 L130 -150 C270 -60 300 200 290 900 Z" />
    {/* arm reaching to the safe then to the bag */}
    <g transform={`rotate(${lerp(-60, 10, k)} -150 -80)`}>
      <path d="M-170 -110 L-120 -60 L-460 120 L-490 70 Z" />
      <rect x={-560} y={40} width={90} height={60} rx={10} transform="rotate(-20 -520 70)" />
    </g>
    {/* bag */}
    <path d="M200 520 C180 360 240 300 330 300 C420 300 480 360 460 520 C470 640 420 700 330 700 C240 700 190 640 200 520 Z" />
  </g>
);

export const Robbed: React.FC<ShotP> = ({f, g}) => {
  const cyc = (stepF(f, 4) % 56) / 56;
  const k = cyc < 0.5 ? easeIO(cyc * 2) : easeIO(2 - cyc * 2);
  const pull = easeIO(clamp(f / 115));
  const flick = 0.85 + 0.15 * hash(stepF(f, 4));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(620, 560, pull), y: lerp(1000, 1060, pull), zoom: lerp(1.3, 1.0, pull), f, shake: 0.8}}>
        <Defs />
        <Layer depth={0.9}>
          <rect x={-800} y={-400} width={2700} height={2800} fill="#5a3a2e" />
          <rect x={-800} y={-400} width={2700} height={2800} fill="url(#wallpaper)" />
          <rect x={-800} y={1480} width={2700} height={900} fill="#2a1a12" />
          <circle cx={300} cy={1100} r={1200} fill="url(#redGlow)" opacity={0.6 * flick} />
          <g transform="translate(720 760) scale(1.2)" opacity={0.92}>
            <StuffShadow k={k} />
          </g>
        </Layer>
        <Layer>
          <Safe x={250} y={1720} s={0.8} open={1} />
          {/* bundles of notes leaving the safe */}
          {k < 0.5 && <rect x={260 + k * 300} y={1300 - k * 200} width={90} height={50} fill="#c8b070" stroke="#0b0706" strokeWidth={2} transform={`rotate(-15 300 1300)`} />}
        </Layer>
      </Stage>
      <Grade color="#e0402e" mode="multiply" op={0.55} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 40% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.8) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 19 · Insert: the insurance claim, amount circled                   */
/* ================================================================== */
export const Claim: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const k = easeIO(clamp(f / 90));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(560, 480, k), y: lerp(840, 900, k), zoom: lerp(1.25, 1.45, k), f, shake: 0.7}}>
        <Defs />
        <Layer>
          <ClaimForm circle={easeO(inv(35.95, 36.6, t))} />
          <circle cx={300} cy={600} r={900} fill="url(#warmGlow)" opacity={0.25} />
        </Layer>
      </Stage>
      <Grade color="#a88a62" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 20 · OUTRO: IF walks off past the window, leaving the only prints  */
/* ================================================================== */
export const Outro: React.FC<ShotP> = ({f, g}) => {
  const sf = stepF(f, 4);
  const walkF = Math.min(sf, 200);
  const stop = clamp((f - 190) / 24);
  const px = 1080 + walkF * 2.6;
  const zoom = lerp(1.0, 0.78, easeIO(clamp(f / 240)));
  const camX = lerp(1200, 1500, easeIO(clamp(f / 260)));
  return (
    <AbsoluteFill>
      <Stage cam={{x: camX, y: lerp(1200, 1080, easeIO(clamp(f / 260))), zoom, f, shake: 0.8}}>
        <Defs />
        <Layer>
          <AlleyBack f={g} door={0.6} />
          <Prints from={[560, IF_Y - 6]} to={[1060, IF_Y + 4]} n={9} upto={9} s={0.9} />
          <Prints from={[1080, IF_Y + 10]} to={[1600, IF_Y + 20]} n={9} upto={clamp((px - 1080) / 62, 0, 9)} s={0.9} />
          <IFAt x={px} sf={walkF} walk={1 - stop} g={g} />
        </Layer>
      </Stage>
      <Grade color="#7f98c4" mode="multiply" op={0.3} />
      <PoliceWash g={g} side="left" k={0.6} />
    </AbsoluteFill>
  );
};

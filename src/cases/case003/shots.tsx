import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Layer, Stage} from '../../kit/camera';
import {Defs, Dust, Flash, Glint, Grade, Ink, Rain, policePhase} from '../../kit/fx';
import {F} from '../../kit/fonts';
import {clamp, easeIO, easeO, easeOutBack, hash, inv, lerp, noise1, sec, stepF} from '../../kit/time';
import {IFBust} from '../../characters/IFBust';
import {IFBody} from '../../characters/IFBody';
import {Suspect} from '../../characters/Suspects';
import {Officer, ThiefBody} from '../../characters/Thief';
import {FastbackSide} from '../../characters/IFCar';
import {Block, Lamp, PoliceCar} from '../../locations/soviet';
import {
  BankCard,
  BigShoe,
  CCTVCam,
  Diamond,
  DisplayCase,
  EvidenceBag,
  FlatRoom,
  JewelleryFront,
  LEDClock,
  PaddedDoor,
  PayTerminal,
  PlanWall,
  PrepTable,
  Sedan,
  Stopwatch,
  StoreInterior,
  WetStreet,
} from '../../locations/heist';

/** f = frame inside the shot, g = global frame. */
export type ShotP = {f: number; g: number};

const blinkAt = (f: number, seed: number) => {
  const period = 150 + Math.floor(hash(seed) * 90);
  const ph = (f + seed * 37) % period;
  return ph < 4 ? 1 : ph < 7 ? 0.5 : 0;
};
const T = (g: number) => g / 60;
/** stepped seconds (cel timing on 3s) */
const TS = (g: number, n = 3) => stepF(g, n) / 60;

/** Out-of-focus background for close-ups (used sparingly this case). */
const Bokeh: React.FC<{g: number; base?: string; tint?: string; seed?: number; dark?: number}> = ({g, base = '#262c28', tint = '#ffb45a', seed = 1, dark = 0.35}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${base} 0%, #070707 78%)`}}>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: 'blur(20px)'}}>
      {Array.from({length: 7}).map((_, i) => (
        <circle key={i} cx={hash(i * 3 + seed) * 1080} cy={300 + hash(i * 7 + seed) * 900} r={50 + hash(i + seed) * 90} fill={tint} opacity={(0.25 + 0.2 * hash(i + Math.floor(g / 40))) * 0.8} />
      ))}
    </svg>
    <AbsoluteFill style={{background: '#000', opacity: dark}} />
  </AbsoluteFill>
);

const PoliceWash: React.FC<{g: number; k?: number}> = ({g, k = 1}) => {
  const {red, blue} = policePhase(g);
  return (
    <>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 0% 30%, rgba(255,40,30,0.9), rgba(0,0,0,0) 60%)', opacity: 0.24 * red * k, mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 100% 30%, rgba(50,90,255,0.9), rgba(0,0,0,0) 60%)', opacity: 0.28 * blue * k, mixBlendMode: 'screen'}} />
    </>
  );
};

/** Typewriter label (stamped info line), top of frame under the case tag. Types in letter by letter. */
const Label: React.FC<{text: string; f: number; x?: number; y?: number; color?: string; size?: number; bg?: boolean}> = ({text, f, x = 64, y = 230, color = '#F4D447', size = 34, bg = true}) => {
  const n = Math.min(text.length, Math.floor(f / 2));
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: F.type, fontSize: size, color, letterSpacing: 3, whiteSpace: 'pre', padding: bg ? '6px 14px' : 0, background: bg ? 'rgba(0,0,0,0.55)' : undefined, textShadow: '0 2px 0 #000'}}>
      {text.slice(0, n)}
      <span style={{opacity: Math.floor(f / 15) % 2 ? 1 : 0}}>▌</span>
    </div>
  );
};

/** Dark scrim behind lower-third text (captions / accent) on busy frames. */
const Scrim: React.FC<{op?: number}> = ({op = 0.75}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,${op}) 68%, rgba(0,0,0,${op}) 82%, rgba(0,0,0,0) 96%)`}} />
);

/** Generic hand seen from above / side. fill = glove or skin. grab 0..1 curls the fingers. */
const Hand: React.FC<{fill: string; grab?: number; sleeve?: string; s?: number; rot?: number; x: number; y: number; card?: boolean; sl?: number}> = ({fill, grab = 0, sleeve = '#1f1d1f', s = 1, rot = 0, x, y, card, sl = 540}) => {
  const L = 100 * (1 - grab * 0.55);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <Ink d={`M-70 60 L-80 ${60 + sl} L80 ${60 + sl} L70 60 Z`} fill={sleeve} hatch="hatch" hatchOp={0.2} />
      <path d="M-74 90 H74" stroke="#000" strokeWidth={10} opacity={0.4} />
      {card && <rect x={-90} y={-L - 160} width={180} height={120} rx={10} fill="#1d3f80" stroke="#0b0706" strokeWidth={3} transform="rotate(-8)" />}
      {[-48, -16, 16, 48].map((fx, i) => (
        <Ink key={i} d={`M${fx - 15} 0 L${fx - 13} ${-L + i * (i === 3 ? 18 : 4)} C${fx - 12} ${-L - 22 + i * 4} ${fx + 12} ${-L - 22 + i * 4} ${fx + 13} ${-L + i * 4} L${fx + 15} 0 Z`} fill={fill} w={2.6} heavy={0} />
      ))}
      <Ink d="M-72 -20 C-80 30 -70 80 -50 90 L50 90 C70 80 80 30 72 -20 C40 -30 -40 -30 -72 -20 Z" fill={fill} w={3} heavy={2} />
      <Ink d={`M66 30 C100 0 118 -40 ${120 - grab * 30} -70 C126 -84 104 -92 96 -78 C84 -50 70 -20 50 0 Z`} fill={fill} w={2.6} heavy={0} />
    </g>
  );
};

/* ================================================================== */
/* 1 · HOOK: the planning wall, the calendar crossed to the last month */
/* ================================================================== */
export const PlanHook: React.FC<ShotP> = ({f, g}) => {
  const t = TS(g, 4);
  const k = easeIO(clamp(f / 160));
  const months = 8 / 12 + (4 / 12) * clamp((t - 0.1) / 1.8);
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: lerp(1540, 1060, k), zoom: lerp(1.32, 1.1, k), rot: lerp(-2, 0.5, k), f, shake: 1}}>
        <Defs />
        <Layer>
          <PlanWall f={g} months={months} />
        </Layer>
        <Layer depth={1}>
          <Dust f={g} x={100} y={400} w={900} h={1300} n={36} />
        </Layer>
      </Stage>
      <Grade color="#d59a52" mode="multiply" op={0.28} />
      <Scrim op={0.7} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 2 · The jewellery store at night (rain, sodium + teal)             */
/* ================================================================== */
const StreetNight: React.FC<{g: number; f: number; cam: {x: number; y: number; zoom: number}; inside?: number; children?: React.ReactNode; storeS?: number; storeX?: number}> = ({g, f, cam, inside = 1, children, storeS = 0.62, storeX = 540}) => (
  <Stage cam={{...cam, f, shake: 0.8}}>
    <Defs />
    <Layer depth={0.08}>
      <rect x={-1200} y={-600} width={3500} height={2000} fill="#0a1517" />
      <rect x={-1200} y={500} width={3500} height={900} fill="#13242a" />
    </Layer>
    <Layer depth={0.3}>
      {[-700, -200, 1000, 1500].map((x, i) => (
        <Block key={x} x={x} y={1440} w={420 + (i % 2) * 140} floors={10} cols={5} fh={80} seed={i + 41} lit={0.08} f={g} color="#1a2a2e" shade="#0f1a1d" snow={false} balconies={false} />
      ))}
    </Layer>
    <Layer depth={0.7}>
      <JewelleryFront x={storeX} y={1480} s={storeS} f={g} inside={inside} />
      <rect x={-1400} y={1478} width={3800} height={30} fill="#1a1e20" />
    </Layer>
    <Layer depth={0.85}>
      <WetStreet x={-1400} y={1500} w={3800} h={900} f={g} glowX={[storeX - 100, storeX + 100, 60, 1020]} />
      <Lamp x={-20} y={1560} h={700} f={g} color="#ff9b3a" />
      <Lamp x={1000} y={1560} h={700} f={g} color="#ff9b3a" flicker />
    </Layer>
    {children}
  </Stage>
);

export const StoreExt: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 102));
  return (
    <AbsoluteFill>
      <StreetNight g={g} f={f} cam={{x: lerp(560, 520, k), y: lerp(1180, 1140, k), zoom: lerp(1.0, 1.14, k)}} />
      <Rain f={g} density={1} splashY={1560} tint="#c9d6dc" />
      <Grade color="#5f8c92" mode="multiply" op={0.22} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 3 · Insert: the stopwatch, 10 minutes                              */
/* ================================================================== */
export const WatchInsert: React.FC<ShotP> = ({f, g}) => {
  const t = TS(g, 2);
  const press = f < 14 ? Math.sin((f / 14) * Math.PI) : 0;
  const secs = clamp((t - 4.5) / 0.85) * 600;
  const k = easeO(clamp(f / 58));
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #1d2a3a 0%, #05070a 75%)'}}>
      <Stage cam={{x: 540, y: 860, zoom: lerp(1.08, 1.2, k), rot: lerp(-7, -3, k), f, shake: 1}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(540 860)">
            <Stopwatch secs={secs} r={320} />
          </g>
          <Hand x={560} y={300 + press * 26} fill="#141313" rot={180} s={0.9} grab={0.6} />
        </Layer>
      </Stage>
      <Grade color="#7f9cc8" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 4 · ZERO MISTAKES: the thief, under one swinging bulb (smug)       */
/* ================================================================== */
export const ZeroThief: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const sw = Math.sin(TS(g, 3) * 2.6);
  const smirk = easeIO(inv(5.9, 6.6, t));
  const k = easeIO(clamp(f / 105));
  const bx = 540 + sw * 160;
  return (
    <AbsoluteFill style={{background: '#070606'}}>
      <Stage cam={{x: 540, y: 960, zoom: lerp(1.0, 1.08, k), f, shake: 0.8}} bg="transparent">
        <Defs />
        <Layer depth={0.4}>
          <rect x={-400} y={-200} width={1900} height={2400} fill="#141110" />
          <rect x={-400} y={-200} width={1900} height={2400} fill="url(#concrete)" opacity={0.5} />
        </Layer>
        <Layer>
          {/* bulb + cord */}
          <path d={`M540 -100 L${bx} 190`} stroke="#0b0706" strokeWidth={5} />
          <circle cx={bx} cy={215} r={28} fill="#ffe7a8" />
          <circle cx={bx} cy={215} r={180} fill="url(#warmGlow)" opacity={0.9} />
          <g transform="translate(540 860) scale(1.3)">
            <Suspect kind="thief" smirk={smirk} lookY={lerp(-0.6, 0, smirk)} lookX={sw * 0.3} blink={blinkAt(stepF(f, 4), 9)} rim="#ffd27a" rimOp={0.75} />
          </g>
        </Layer>
      </Stage>
      {/* moving key light from the bulb */}
      <AbsoluteFill style={{background: `radial-gradient(circle 900px at ${bx}px 240px, rgba(0,0,0,0) 30%, rgba(0,0,0,0.75) 100%)`}} />
      <Grade color="#c79a62" mode="multiply" op={0.25} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 5 · Binocular POV across the street: the guard yawns               */
/* ================================================================== */
export const GuardsPOV: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const yawn = t > 7.85 && t < 8.5;
  const k = easeIO(clamp(f / 90));
  const focus = Math.max(0, 6 - f * 0.4);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{filter: focus > 0.2 ? `blur(${focus}px)` : undefined}}>
        <Stage cam={{x: lerp(420, 340, k), y: 1150, zoom: 1.0, f, shake: 2.2}}>
          <Defs />
          <Layer depth={0.4}>
            <rect x={-1200} y={-600} width={3500} height={2600} fill="#0a1214" />
          </Layer>
          <Layer>
            <JewelleryFront x={540} y={1500} s={1.5} f={g} />
            <g transform="translate(170 1440) scale(0.5)">
              <rect x={-260} y={-280} width={520} height={60} fill="#4a3624" stroke="#0b0706" strokeWidth={4} transform="translate(0 0)" />
              <Officer pose={yawn ? 'yawn' : 'stand'} rim="#ffd27a" rimOp={0.5} />
            </g>
          </Layer>
        </Stage>
        <Rain f={g} density={0.5} front={false} />
      </AbsoluteFill>
      {/* binocular mask + reticle */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs>
          <mask id="bino">
            <rect width={1080} height={1920} fill="white" />
            <circle cx={340} cy={900} r={400} fill="black" />
            <circle cx={740} cy={900} r={400} fill="black" />
          </mask>
          <radialGradient id="binoV">
            <stop offset="0.7" stopColor="#000" stopOpacity={0} />
            <stop offset="1" stopColor="#000" stopOpacity={0.85} />
          </radialGradient>
        </defs>
        <circle cx={340} cy={900} r={400} fill="url(#binoV)" />
        <circle cx={740} cy={900} r={400} fill="url(#binoV)" />
        <rect width={1080} height={1920} fill="#000" mask="url(#bino)" />
        <path d="M540 760 V1040 M400 900 H680" stroke="#e8e2d0" strokeWidth={2} opacity={0.5} />
        {[-2, -1, 1, 2].map((i) => (
          <path key={i} d={`M${540 + i * 40} 890 V910`} stroke="#e8e2d0" strokeWidth={2} opacity={0.5} />
        ))}
      </svg>
      <Grade color="#7fa2a6" mode="multiply" op={0.25} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 6 · Tracked the cameras: CCTV sweep with tracking brackets          */
/* ================================================================== */
export const CamsShot: React.FC<ShotP> = ({f, g}) => {
  const ts = TS(g, 4);
  const pan = Math.sin((ts - 8.66) * 2.4) * 26;
  const k = easeIO(clamp(f / 80));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(520, 560, k), y: 880, zoom: lerp(1.0, 1.1, k), f, shake: 0.7}}>
        <Defs />
        <Layer depth={0.6}>
          <rect x={-600} y={-400} width={2400} height={2800} fill="#2e3438" />
          <rect x={-600} y={-400} width={2400} height={2800} fill="url(#concrete)" opacity={0.8} />
          <path d="M-600 1400 H1800" stroke="#000" strokeWidth={8} opacity={0.4} />
          {Array.from({length: 12}).map((_, i) => (
            <path key={i} d={`M-600 ${-300 + i * 160} H1800`} stroke="#000" strokeWidth={2} opacity={0.2} />
          ))}
        </Layer>
        <Layer>
          <g transform="translate(300 720) scale(1.1)">
            <CCTVCam f={g} pan={pan} cone={1} />
            <g transform={`translate(0 70) rotate(${pan + 14}) translate(180 0)`} stroke="#ff3b30" strokeWidth={6} fill="none">
              <path d="M-280 -90 V-140 H-230 M230 -140 H280 V-90 M280 90 V140 H230 M-230 140 H-280 V90" />
            </g>
          </g>
        </Layer>
      </Stage>
      <Label text="CAM 2 · SWEEP 40 s" f={f - 6} x={90} y={1180} color="#ff5a4a" size={36} />
      {f > 40 && <Label text="BLIND SPOT 6 s" f={f - 40} x={90} y={1250} color="#ff5a4a" size={36} />}
      <Grade color="#8aa0b4" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 7 · Prepared everything: top-down kit on the bed                    */
/* ================================================================== */
export const PrepTop: React.FC<ShotP> = ({f, g}) => {
  const t = TS(g, 3);
  const k = easeIO(clamp(f / 213));
  return (
    <AbsoluteFill>
      <Stage cam={{x: 560, y: lerp(820, 900, k), zoom: lerp(1.02, 1.16, k), rot: lerp(4, -3, k), f, shake: 0.6}}>
        <Defs />
        <Layer>
          <PrepTable f={g} tools={easeO(inv(10.05, 10.9, t))} gloves={easeO(inv(11.94, 12.3, t))} mask={easeO(inv(12.86, 13.2, t))} />
        </Layer>
      </Stage>
      <Grade color="#c6a56a" mode="multiply" op={0.22} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 8 · Shoes two sizes too big (side insert)                           */
/* ================================================================== */
export const ShoesInsert: React.FC<ShotP> = ({f, g}) => {
  const t = TS(g, 3);
  const kIn = easeIO(inv(13.7, 14.75, t));
  const big = easeO(inv(15.05, 15.3, T(g)));
  const k = easeIO(clamp(f / 146));
  return (
    <AbsoluteFill style={{background: '#0d0907'}}>
      <Stage cam={{x: lerp(560, 600, k), y: 1000, zoom: lerp(1.0, 1.1, k) + big * 0.05, f, shake: 0.6}} bg="transparent">
        <Defs />
        <Layer depth={0.5}>
          <rect x={-600} y={-400} width={2400} height={1500} fill="#2a2520" />
          <rect x={-600} y={-400} width={2400} height={1500} fill="url(#wallpaper)" opacity={0.8} />
        </Layer>
        <Layer>
          <g transform="translate(560 1020) scale(1.15)">
            <BigShoe k={kIn} f={g} />
            {big > 0 && (
              <g opacity={big}>
                <path d="M150 -110 H370 M150 -130 V-90 M370 -130 V-90" stroke="#ff3b30" strokeWidth={6} />
                <text x={260} y={-140} fontFamily={F.stamp} fontSize={52} fill="#ff3b30" textAnchor="middle" letterSpacing={4}>
                  +2
                </text>
              </g>
            )}
          </g>
        </Layer>
      </Stage>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 45% at 55% 52%, rgba(255,200,120,0.16), rgba(0,0,0,0) 70%)', mixBlendMode: 'screen'}} />
      <Grade color="#b88a5a" mode="multiply" op={0.25} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 9 · 3:12 AM: the LED clock flips                                    */
/* ================================================================== */
export const ClockShot: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const flipT = 16.62;
  const flip = t >= flipT - 0.1 && t < flipT ? (t - (flipT - 0.1)) / 0.1 : 0;
  const text = t < flipT ? '3:11' : '3:12';
  const k = easeIO(clamp(f / 98));
  return (
    <AbsoluteFill>
      <Bokeh g={g} base="#0c1420" tint="#6f8fb8" seed={11} dark={0.55} />
      <Stage cam={{x: 540, y: 900, zoom: lerp(1.0, 1.18, k), f, shake: 0.5}} bg="transparent">
        <Defs />
        <Layer>
          <rect x={-400} y={1060} width={1900} height={1000} fill="#140c0a" />
          <ellipse cx={540} cy={1080} rx={520} ry={60} fill="#ff2a1a" opacity={0.25} />
          <g transform="translate(265 760) scale(2.2)">
            <LEDClock text={text} flip={flip} />
          </g>
          {/* reflection */}
          <g transform="translate(265 1500) scale(2.2 -0.9)" opacity={0.18}>
            <LEDClock text={text} />
          </g>
        </Layer>
      </Stage>
      <Grade color="#8a7aa0" mode="multiply" op={0.2} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 10 · He walked in (store interior, the door opens on the night)    */
/* ================================================================== */
export const WalkIn: React.FC<ShotP> = ({f, g}) => {
  const sf = stepF(f, 4);
  const door = easeO(clamp(f / 22));
  const px = 1520 - sf * 3.0;
  const k = easeIO(clamp(f / 80));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(960, 900, k), y: 920, zoom: lerp(0.72, 0.78, k), f, shake: 0.8}}>
        <Defs />
        <Layer depth={1}>
          <StoreInterior f={g} door={door} />
          <DisplayCase x={240} y={1500} w={700} f={g} light="#bfe9d6" />
        </Layer>
        <Layer depth={1}>
          <g transform={`translate(${px} 1330) scale(-0.95 0.95)`}>
            <ThiefBody phase={(sf / 60) * Math.PI * 2} walk={f < 8 ? 0.4 : 1} mask bag={1} big rim="#7fb6ff" rimOp={0.9} />
          </g>
        </Layer>
        <Layer depth={1.5} blur={10}>
          <rect x={-500} y={-200} width={240} height={2600} fill="#0b0f0e" />
        </Layer>
      </Stage>
      <Grade color="#5fa08a" mode="multiply" op={0.25} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 11 · Split screen: hands empty the case / stopwatch races          */
/* ================================================================== */
export const SplitShot: React.FC<ShotP> = ({f, g}) => {
  const t = TS(g, 3);
  const p = clamp((t - 18.95) / 1.2);
  const items = 7;
  const grabI = Math.min(items - 1, Math.floor(p * items));
  const ix = -450 + 50 + (grabI * (900 - 100)) / (items - 1);
  const handPh = (p * items) % 1;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* top: stopwatch */}
      <AbsoluteFill style={{clipPath: 'inset(0 0 50% 0)'}}>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 25%, #1d2a3a 0%, #05070a 70%)'}} />
        <Stage cam={{x: 540, y: 960, zoom: 1, f, shake: 0.8}} bg="transparent">
          <Defs />
          <Layer>
            <g transform="translate(540 500) scale(0.95)">
              <Stopwatch secs={p * 600} r={320} red={p > 0.95 ? 1 : 0} />
            </g>
          </Layer>
        </Stage>
      </AbsoluteFill>
      {/* bottom: the case being emptied */}
      <AbsoluteFill style={{clipPath: 'inset(50% 0 0 0)'}}>
        <Stage cam={{x: 540, y: 1150, zoom: 1.05, f, shake: 1.5}} bg="#101a18">
          <Defs />
          <Layer>
            <rect x={-400} y={900} width={1900} height={1200} fill="#14201d" />
            <DisplayCase x={540} y={1500} w={900} f={g} full={1 - p} cut={1} />
            <Hand x={540 + ix} y={1340 - Math.abs(handPh - 0.5) * 2 * 110} fill="#3a3a40" sleeve="#2a2a30" grab={handPh > 0.5 ? 1 : 0.2} s={0.95} rot={180} sl={300} />
          </Layer>
        </Stage>
        <AbsoluteFill style={{background: 'radial-gradient(circle 420px at 50% 72%, rgba(230,240,255,0.16), rgba(0,0,0,0.6) 100%)'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{top: 956, height: 8, background: '#c8231b', boxShadow: '0 0 14px #ff2a1a'}} />
      <Grade color="#7f9cc8" mode="multiply" op={0.18} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 12 · He walked out into the rain with a full bag                    */
/* ================================================================== */
export const WalkOut: React.FC<ShotP> = ({f, g}) => {
  const sf = stepF(f, 4);
  const px = 760 + sf * 3.2;
  return (
    <AbsoluteFill>
      <StreetNight g={g} f={f} cam={{x: 700 + f * 1.6, y: 1180, zoom: 1.22}} storeS={0.9} storeX={400} inside={0.7}>
        <Layer depth={0.85}>
          <g transform={`translate(${px} 1560) scale(0.62)`}>
            <ThiefBody phase={(sf / 54) * Math.PI * 2} walk={1} mask bag={2} big rim="#ffb45a" rimOp={0.8} />
          </g>
        </Layer>
      </StreetNight>
      <Rain f={g} density={1.1} splashY={1600} tint="#c9d6dc" />
      <Grade color="#5f8c92" mode="multiply" op={0.22} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 13 · Two million dollars in diamonds: they pour onto black velvet   */
/* ================================================================== */
export const PourShot: React.FC<ShotP> = ({f, g}) => {
  const ts = TS(g, 3) - 21.36;
  const k = easeIO(clamp(f / 156));
  const N = 46;
  return (
    <AbsoluteFill style={{background: '#050608'}}>
      <Stage cam={{x: 540, y: 900, zoom: lerp(1.08, 1.26, k), rot: lerp(-3, 5, k), f, shake: 0.5}} bg="transparent">
        <Defs />
        <Layer>
          <rect x={-400} y={-200} width={1900} height={2400} fill="#0e1016" />
          <rect x={-400} y={-200} width={1900} height={2400} fill="url(#hatchFine)" opacity={0.15} />
          {/* bag mouth at the top */}
          <Ink d="M300 -60 C320 120 760 120 780 -60 L820 220 C700 300 380 300 260 220 Z" fill="#191a1c" hatch="hatch" hatchOp={0.25} />
          {Array.from({length: N}).map((_, i) => {
            const t0 = i * 0.045;
            const dt = ts - t0;
            if (dt < 0) return null;
            const a = hash(i * 2.1) * Math.PI * 2;
            const rr = Math.sqrt(hash(i * 5.7)) * 250;
            const px = 540 + Math.cos(a) * rr;
            const py = 950 + Math.sin(a) * rr * 0.7 - (N - i) * 0.6;
            const fall = clamp(dt / 0.42);
            const x = lerp(540 + (hash(i) - 0.5) * 80, px, fall);
            const y = lerp(230, py, fall * fall);
            const bounce = fall >= 1 ? Math.max(0, Math.sin(clamp((dt - 0.42) / 0.14) * Math.PI)) * 14 : 0;
            return <Diamond key={i} x={x} y={y - bounce} r={18 + hash(i * 3.3) * 14} f={g} seed={i} />;
          })}
        </Layer>
      </Stage>
      <AbsoluteFill style={{background: 'radial-gradient(circle 560px at 50% 48%, rgba(240,248,255,0.22), rgba(0,0,0,0.7) 100%)', mixBlendMode: 'normal'}} />
      <Grade color="#9ab4d6" mode="multiply" op={0.2} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 14 · Gone: the empty case, a neat circle cut in the glass           */
/* ================================================================== */
export const GoneShot: React.FC<ShotP> = ({f, g}) => {
  const k = easeO(clamp(f / 50));
  return (
    <AbsoluteFill>
      <Stage cam={{x: 560, y: 960, zoom: lerp(1.0, 1.18, k), f, shake: 0.6}} bg="#1a2224">
        <Defs />
        <Layer depth={0.6}>
          <rect x={-600} y={-400} width={2400} height={2800} fill="#3a4648" />
          <rect x={-600} y={-400} width={2400} height={2800} fill="url(#concrete)" opacity={0.5} />
          <rect x={-600} y={1260} width={2400} height={1000} fill="#252b2b" />
        </Layer>
        <Layer>
          <DisplayCase x={560} y={1080} w={940} f={g} full={0} cut={1} tag={1} light="#e8f4ff" />
        </Layer>
      </Stage>
      <AbsoluteFill style={{background: 'linear-gradient(115deg, rgba(220,235,255,0.25) 0%, rgba(0,0,0,0) 45%)', mixBlendMode: 'screen'}} />
      <Grade color="#9fb4c4" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 15 · No fingerprints: forensic brush, powder, nothing               */
/* ================================================================== */
export const PrintsShot: React.FC<ShotP> = ({f, g}) => {
  const sf = stepF(f, 3);
  const bx = 300 + Math.sin(sf * 0.12) * 200 + sf * 2;
  const by = 760 + Math.cos(sf * 0.09) * 90;
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: 900, zoom: 1.05 + f * 0.0015, f, shake: 0.6}} bg="#0c1214">
        <Defs />
        <Layer>
          {/* glass surface, cold forensic light */}
          <rect x={-200} y={200} width={1500} height={1300} fill="#c9dde2" opacity={0.35} />
          <rect x={-200} y={200} width={1500} height={1300} fill="url(#hatchFine)" opacity={0.12} />
          {/* dusted area: grey powder, smooth glove smears only */}
          {Array.from({length: 70}).map((_, i) => {
            const on = hash(i * 3.1) * 64 < sf * 0.9;
            return on ? <circle key={i} cx={200 + hash(i * 5.3) * 680} cy={560 + hash(i * 1.7) * 420} r={5 + hash(i) * 16} fill="#e8eaea" opacity={0.35} /> : null;
          })}
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${330 + i * 150} 700 C${380 + i * 150} 660 ${430 + i * 150} 700 ${450 + i * 150} 760 C${440 + i * 150} 820 ${370 + i * 150} 830 ${330 + i * 150} 790 Z`} fill="url(#hatchX)" opacity={clamp(sf / 40 - i * 0.2) * 0.4} />
          ))}
          {/* brush */}
          <g transform={`translate(${bx} ${by}) rotate(-35)`}>
            {Array.from({length: 16}).map((_, i) => (
              <path key={i} d={`M${-20 + i * 2.6} 20 Q${-60 + i * 8} -60 ${-70 + i * 9.5} ${-120 + Math.abs(i - 7.5) * 6}`} stroke="#c8b48a" strokeWidth={5} fill="none" strokeLinecap="round" />
            ))}
            <Ink d="M-26 10 L26 10 L22 40 L-22 40 Z" fill="#b8b8be" heavy={0} />
            <Ink d="M-12 20 L12 20 L18 420 L-18 420 Z" fill="#7a1814" />
          </g>
        </Layer>
      </Stage>
      <Label text="PRINTS FOUND: 0" f={f - 10} x={64} y={1080} color="#ff5a4a" size={40} />
      <AbsoluteFill style={{background: 'radial-gradient(circle 600px at 45% 42%, rgba(230,250,255,0.2), rgba(0,0,0,0.65) 100%)'}} />
      <Grade color="#a8c8d4" mode="multiply" op={0.25} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 16 · No witnesses: foggy dawn street, every window dark            */
/* ================================================================== */
export const WitnessShot: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const lampOn = t < 26.35 ? 1 : t < 26.5 ? (Math.floor(f / 3) % 2 ? 1 : 0.2) : 0;
  return (
    <AbsoluteFill>
      <Stage cam={{x: 480 + f * 1.4, y: 1060, zoom: 0.95, f, shake: 0.5}}>
        <Defs />
        <Layer depth={0.06}>
          <rect x={-1200} y={-600} width={3500} height={2400} fill="#7f8c94" />
          <rect x={-1200} y={700} width={3500} height={600} fill="#b7a998" opacity={0.6} />
        </Layer>
        <Layer depth={0.35}>
          {[-700, -150, 500, 1100, 1650].map((x, i) => (
            <Block key={x} x={x} y={1420} w={460 + (i % 2) * 100} floors={9} cols={5} fh={84} seed={i + 61} lit={0} f={g} color="#56626a" shade="#3c454b" snow={false} />
          ))}
          <rect x={-1400} y={900} width={3800} height={600} fill="#9aa6ad" opacity={0.45} />
        </Layer>
        <Layer depth={0.8}>
          <rect x={-1400} y={1460} width={3800} height={900} fill="#3a4246" />
          <WetStreet x={-1400} y={1460} w={3800} h={900} f={g} glow="#c8d4dc" glowX={[540]} base="#3a4246" />
          <Lamp x={1080} y={1500} h={760} f={g} color="#ffb45a" on={lampOn} />
        </Layer>
        <Layer depth={1.1}>
          <rect x={-1400} y={1100} width={3800} height={700} fill="#c4c8c8" opacity={0.25} />
        </Layer>
      </Stage>
      <Rain f={g} density={0.5} front={false} tint="#e0e6ea" op={0.6} />
      <Grade color="#a6b0b8" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 17 · No trace: the oversized shoe prints dissolve in the rain       */
/* ================================================================== */
const SoleD = 'M0 -170 C60 -170 80 -110 78 -40 C76 20 60 50 56 90 C54 140 40 170 0 170 C-40 170 -54 140 -56 90 C-60 50 -76 20 -78 -40 C-80 -110 -60 -170 0 -170 Z';
export const TraceShot: React.FC<ShotP> = ({f, g}) => {
  const t = TS(g, 3);
  const fade = clamp((t - 27.35) / 0.9);
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: 960, zoom: 1.05 + f * 0.0012, rot: -4 + f * 0.03, f, shake: 0.6}} bg="#1a1e21">
        <Defs />
        <Layer>
          <rect x={-400} y={-200} width={1900} height={2400} fill="#4a5458" />
          <rect x={-400} y={-200} width={1900} height={2400} fill="url(#concrete)" opacity={0.9} />
          {[
            [380, 1180, -8],
            [660, 860, 6],
            [420, 520, -6],
          ].map(([x, y, r], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(1.25)`} opacity={(1 - fade) * (1 - i * 0.1)}>
              <path d={SoleD} fill="#14191b" opacity={0.9} stroke="#0b0706" strokeWidth={4} />
              <path d={SoleD} fill="#8fa4b0" opacity={0.18} transform="translate(-8 -10) scale(0.9)" />
              {Array.from({length: 9}).map((_, k) => (
                <path key={k} d={`M-60 ${-140 + k * 34} H60`} stroke="#3a4448" strokeWidth={8} />
              ))}
            </g>
          ))}
          {/* puddle sheen spreading over */}
          <ellipse cx={540} cy={900} rx={200 + fade * 600} ry={140 + fade * 500} fill="#5f7480" opacity={0.18 + fade * 0.2} />
        </Layer>
      </Stage>
      <Rain f={g} density={0.8} splashY={0} front={false} tint="#cfd8e0" />
      <Grade color="#7f98a8" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 18 · The perfect crime: the thief in his flat, a diamond to the lamp */
/* ================================================================== */
export const PerfectShot: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 140));
  const lift = easeO(clamp(f / 40));
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: 940, zoom: lerp(1.0, 1.08, k), f, shake: 0.5}}>
        <Defs />
        <Layer depth={0.5} blur={12}>
          <FlatRoom f={g} />
        </Layer>
        <Layer>
          <g transform="translate(470 860) scale(1.18)">
            <Suspect kind="thief" smirk={1} lookX={0.7} lookY={-0.4} blink={blinkAt(stepF(f, 4), 3)} rim="#ffcf7a" rimOp={0.8} />
          </g>
          <g transform={`translate(0 ${(1 - lift) * 300})`}>
            <Hand x={880} y={720} fill="#d0a184" sleeve="#221e1c" grab={0.7} rot={-10} s={0.9} />
            <Diamond x={880} y={560} r={46} f={g} seed={2} />
            <Glint x={870} y={545} r={120} k={0.6 + 0.4 * Math.sin(stepF(f, 4) * 0.1)} color="#fff6e0" />
          </g>
        </Layer>
      </Stage>
      <Grade color="#c99a5f" mode="multiply" op={0.22} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 19 · Or so he thought: pull out from his window → IF's car below    */
/* ================================================================== */
export const ThoughtShot: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const k = easeIO(clamp(f / 105));
  const lights = t > 31.95 ? (t < 32.1 ? (Math.floor(f / 3) % 2 ? 1 : 0.3) : 1) : 0;
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(640, 560, k), y: lerp(640, 1240, k), zoom: lerp(2.3, 0.9, k), f, shake: 0.6}}>
        <Defs />
        <Layer depth={0.05}>
          <rect x={-1400} y={-1400} width={4000} height={3400} fill="#07101c" />
        </Layer>
        <Layer depth={1}>
          <Block x={150} y={1520} w={820} floors={10} cols={5} fh={120} seed={77} lit={0.12} f={g} color="#28323e" shade="#18202a" snow={false} side={90} />
          {/* his window: warm, with his silhouette */}
          <rect x={150 + 2 * 164 + 36} y={1520 - 1200 + 2 * 120 + 30} width={92} height={58} fill="#ffcf7a" stroke="#0b0706" strokeWidth={2} />
          <rect x={150 + 2 * 164 - 20} y={1520 - 1200 + 2 * 120} width={200} height={120} fill="url(#warmGlow)" opacity={0.6} />
          <path d={`M${150 + 2 * 164 + 64} ${1520 - 1200 + 2 * 120 + 88} C${150 + 2 * 164 + 64} ${1520 - 1200 + 2 * 120 + 50} ${150 + 2 * 164 + 92} ${1520 - 1200 + 2 * 120 + 50} ${150 + 2 * 164 + 92} ${1520 - 1200 + 2 * 120 + 88} Z`} fill="#140c08" />
          <circle cx={150 + 2 * 164 + 78} cy={1520 - 1200 + 2 * 120 + 46} r={10} fill="#140c08" />
          <rect x={-1400} y={1520} width={3800} height={1000} fill="#121619" />
          <WetStreet x={-1400} y={1540} w={3800} h={900} f={g} glowX={[200, 860]} />
          <Lamp x={140} y={1700} h={600} f={g} color="#ffb45a" />
          <g transform="translate(700 1790) scale(0.6)">
            <FastbackSide lights={lights} rim="#9fc4ff" rimOp={0.8} f={g} beam={lights > 0} />
          </g>
        </Layer>
      </Stage>
      <Rain f={g} density={1} splashY={1640} tint="#c9d6dc" />
      <Grade color="#6f88b0" mode="multiply" op={0.28} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 20 · Three days later (grey morning): the knocks shake the door     */
/* ================================================================== */
export const KNOCKS = [34.5, 34.7, 34.9];
export const KnockShot: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const hit = KNOCKS.reduce((m, kt) => Math.max(m, t >= kt ? Math.max(0, 1 - (t - kt) / 0.12) : 0), 0);
  const k = easeIO(clamp(f / 108));
  const ripple = KNOCKS.reduce((m, kt) => (t >= kt ? t - kt : m), -1);
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: lerp(880, 860, k), zoom: lerp(0.95, 1.05, k) + hit * 0.02, f, shake: 0.5 + hit * 9}}>
        <Defs />
        <Layer>
          <PaddedDoor f={g} shake={hit * 7} />
        </Layer>
        <Layer depth={1.25} blur={4}>
          {/* hallway shelf with a glass of tea: rings on each knock */}
          <rect x={-300} y={1360} width={620} height={40} fill="#3a2418" />
          <g transform="translate(120 1360)">
            <path d="M-60 -170 L60 -170 L50 0 L-50 0 Z" fill="#c9d6dc" opacity={0.5} stroke="#0b0706" strokeWidth={3} />
            <ellipse cx={0} cy={-150} rx={58} ry={12} fill="#8a4a1a" />
            {ripple >= 0 && ripple < 0.6 && [0, 1].map((i) => <ellipse key={i} cx={0} cy={-150} rx={10 + (ripple * 120 + i * 18) % 56} ry={2 + ((ripple * 120 + i * 18) % 56) * 0.2} fill="none" stroke="#f0c890" strokeWidth={2} />)}
          </g>
        </Layer>
      </Stage>
      <AbsoluteFill style={{background: 'linear-gradient(100deg, rgba(220,228,235,0.28) 0%, rgba(0,0,0,0) 50%)', mixBlendMode: 'screen'}} />
      <Label text="3 DAYS LATER · 07:40" f={f - 4} />
      <Grade color="#a8b0b4" mode="multiply" op={0.25} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 21 · The door opens: IF in the rain outfit, police on the stairs    */
/* ================================================================== */
export const DoorwayShot: React.FC<ShotP> = ({f, g}) => {
  const k = easeO(clamp(f / 52));
  const open = easeO(clamp(f / 10));
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: 900, zoom: lerp(1.0, 1.1, k), f, shake: 0.8}} bg="#2a3034">
        <Defs />
        <Layer depth={0.6}>
          {/* stairwell: concrete, green paint dado, window with police lights */}
          <rect x={-600} y={-400} width={2400} height={2800} fill="#6a6e68" />
          <rect x={-600} y={1000} width={2400} height={1400} fill="#3d5a4a" />
          <rect x={-600} y={-400} width={2400} height={2800} fill="url(#concrete)" opacity={0.6} />
          <rect x={720} y={260} width={300} height={440} fill="#c8d4dc" stroke="#0b0706" strokeWidth={8} />
          <g transform="translate(250 1500) scale(0.78)">
            <Officer rim="#9fc4ff" rimOp={0.6} color="#28323e" />
          </g>
          <g transform="translate(900 1560) scale(0.72)">
            <Officer rim="#ff6a5a" rimOp={0.5} color="#232a34" />
          </g>
        </Layer>
        <Layer>
          <g transform="translate(560 1000) scale(1.12)">
            <IFBust outfit="trench" hat lookX={0.5} lookY={0.1} brow={0.5} blink={blinkAt(stepF(f, 4), 5)} rim="#cfe0ff" rimOp={0.8} />
          </g>
        </Layer>
        <Layer depth={1.3}>
          {/* door frame + the opening door leaf (foreground) */}
          <rect x={-400} y={-400} width={420} height={2800} fill="#1a1512" />
          <rect x={1060} y={-400} width={420} height={2800} fill="#1a1512" />
          <rect x={20 + open * 0} y={-400} width={(1 - open) * 1040} height={2800} fill="#5e2a1e" />
        </Layer>
      </Stage>
      <PoliceWash g={g} k={0.9} />
      <Rain f={g} density={0.25} front={false} op={0.4} />
      <Grade color="#9aa8b8" mode="multiply" op={0.22} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 22 · And the reason? IF, a dry half-smile, raises an evidence bag   */
/* ================================================================== */
export const ReasonShot: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const smile = easeIO(inv(35.95, 36.5, t));
  const bag = easeOutBack(clamp(inv(36.25, 36.7, t)));
  const k = easeIO(clamp(f / 67));
  return (
    <AbsoluteFill>
      <Bokeh g={g} base="#3a4448" tint="#8fb0d6" seed={21} dark={0.3} />
      <Stage cam={{x: 540, y: 900, zoom: lerp(1.0, 1.07, k), f, shake: 0.5}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(600 900) scale(1.45)">
            <IFBust outfit="trench" hat smile={smile} brow={0.3 - smile * 0.2} lookX={0.4} blink={blinkAt(stepF(f, 4), 14)} rim="#cfe0ff" rimOp={0.75} />
          </g>
          <g transform={`translate(230 ${lerp(2300, 1340, bag)}) rotate(${lerp(-20, -6, bag)})`}>
            {/* back side of the bag: label only, the receipt hidden */}
            <rect x={-150} y={-190} width={300} height={380} rx={8} fill="#cfd6d8" opacity={0.4} stroke="#e8f0f2" strokeWidth={3} />
            <rect x={-150} y={-190} width={300} height={44} fill="#c8231b" />
            <text x={0} y={-158} fontFamily={F.stamp} fontSize={28} fill="#fff" textAnchor="middle" letterSpacing={4}>
              EVIDENCE
            </text>
            <Hand x={-20} y={250} fill="#3A251D" sleeve="#8d7556" grab={0.85} s={0.8} sl={400} />
          </g>
        </Layer>
      </Stage>
      <PoliceWash g={g} k={0.45} />
      <Grade color="#a0aab4" mode="multiply" op={0.22} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 23 · FLASHBACK (rewind): 02:58, his own car parks across the street */
/* ================================================================== */
const Rewind: React.FC<{f: number; dur?: number}> = ({f, dur = 22}) => {
  if (f >= dur) return null;
  const k = 1 - f / dur;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        {Array.from({length: 14}).map((_, i) => (
          <rect key={i} x={0} y={hash(i * 3.3 + Math.floor(f / 2)) * 1920} width={1080} height={10 + hash(i + f) * 50} fill="#fff" opacity={0.18 * k} />
        ))}
      </svg>
      <AbsoluteFill style={{background: '#e8e0d0', opacity: 0.35 * k * k, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};
const FlashGrade: React.FC = () => (
  <>
    <Grade color="#808080" mode="saturation" op={0.55} />
    <Grade color="#c89a60" mode="multiply" op={0.35} />
  </>
);
export const ParkShot: React.FC<ShotP> = ({f, g}) => {
  const t = TS(g, 3);
  const arrive = easeO(clamp((t - 37.1) / 1.9));
  const carX = lerp(-700, 540, arrive);
  const brake = clamp((t - 38.3) / 0.15) * (1 - clamp((t - 39.4) / 0.3));
  const k = easeIO(clamp(f / 183));
  const smear = f < 22 ? (1 - f / 22) * 60 : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${Math.sin(f * 1.7) * smear}px)`}}>
        <Stage cam={{x: lerp(520, 560, k), y: 1220, zoom: lerp(0.92, 1.02, k), f, shake: 0.6}}>
          <Defs />
          <Layer depth={0.08}>
            <rect x={-1200} y={-600} width={3500} height={2000} fill="#0a1517" />
          </Layer>
          <Layer depth={0.45}>
            <Block x={-800} y={1300} w={600} floors={10} cols={5} fh={80} seed={44} lit={0.06} f={g} color="#1a2a2e" shade="#0f1a1d" snow={false} />
            <JewelleryFront x={540} y={1300} s={0.5} f={g} inside={0.9} />
            <Block x={900} y={1300} w={600} floors={10} cols={5} fh={80} seed={45} lit={0.06} f={g} color="#1a2a2e" shade="#0f1a1d" snow={false} />
            <rect x={-1400} y={1298} width={3800} height={30} fill="#1a1e20" />
          </Layer>
          <Layer depth={0.8}>
            <WetStreet x={-1400} y={1320} w={3800} h={1000} f={g} glowX={[440, 640, 1000]} />
            <Lamp x={1000} y={1660} h={720} f={g} color="#ff9b3a" />
          </Layer>
          <Layer depth={1}>
            {/* parking signs + the pay terminal on the near pavement */}
            <rect x={-1400} y={1740} width={3800} height={600} fill="#2a2e30" />
            <path d="M-1400 1742 H2400" stroke="#c9c4bc" strokeWidth={6} />
            <g transform="translate(150 1500) scale(0.42)">
              <PayTerminal f={g} />
            </g>
            <g transform={`translate(${carX} 1760) scale(0.78)`}>
              <Sedan roll={(carX + 700) / 48} lights={1} brake={brake} rim="#ffb45a" rimOp={0.7} />
            </g>
          </Layer>
        </Stage>
        <Rain f={g} density={0.6} splashY={1700} tint="#d8d0c0" />
      </AbsoluteFill>
      <FlashGrade />
      <Rewind f={f} />
      <Label text="◀◀ 02:58 AM" f={f - 8} color="#f0e6d2" />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 24 · And to pay for parking: his BARE hand, gloves still in pocket  */
/* ================================================================== */
export const MeterShot: React.FC<ShotP> = ({f, g}) => {
  const t = TS(g, 3);
  const reach = easeIO(clamp((t - 40.15) / 1.4));
  const k = easeIO(clamp(f / 110));
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: lerp(880, 940, k), zoom: lerp(1.0, 1.1, k), f, shake: 0.6}} bg="#0a1214">
        <Defs />
        <Layer depth={0.5} blur={8}>
          <rect x={-600} y={-400} width={2400} height={2800} fill="#0f1a1d" />
          <circle cx={900} cy={400} r={160} fill="#ff9b3a" opacity={0.5} />
          <circle cx={100} cy={600} r={110} fill="#ff9b3a" opacity={0.35} />
        </Layer>
        <Layer>
          <g transform="translate(500 760) scale(1.35)">
            <PayTerminal f={g} screen={['PARKING', 'INSERT CARD']} />
          </g>
          {/* bare hand pushes the card up into the slot (card hidden above the slot mouth) */}
          <clipPath id="slotClip">
            <rect x={-400} y={1046} width={1900} height={1400} />
          </clipPath>
          <g clipPath="url(#slotClip)">
            <g transform={`translate(${lerp(760, 500, reach)} ${lerp(1520, 1060, reach)}) rotate(${lerp(18, 0, reach)})`}>
              <rect x={-95} y={0} width={190} height={300} rx={14} fill="#1d3f80" stroke="#0b0706" strokeWidth={4} />
              <rect x={-60} y={200} width={60} height={46} rx={6} fill="#d8b25a" stroke="#0b0706" strokeWidth={2} />
              <path d="M-80 20 H80" stroke="#2a56a8" strokeWidth={10} />
              <Hand x={0} y={340} fill="#d0a184" sleeve="#221e1c" grab={0.45} s={1.0} sl={700} />
            </g>
          </g>
        </Layer>
        <Layer depth={1.4}>
          {/* his jacket pocket with the black gloves sticking out (foreground, bottom-left) */}
          <Ink d="M-200 1500 C0 1460 300 1470 420 1520 L460 2300 L-200 2300 Z" fill="#1f1d1f" hatch="hatch" hatchOp={0.2} />
          {[0, 1, 2, 3].map((i) => (
            <Ink key={i} d={`M${40 + i * 70} 1530 L${30 + i * 70 - i * 6} ${1360 + Math.abs(i - 1.5) * 30} C${32 + i * 70} ${1330 + Math.abs(i - 1.5) * 30} ${84 + i * 70} ${1330 + Math.abs(i - 1.5) * 30} ${86 + i * 70} ${1360 + Math.abs(i - 1.5) * 30} L${96 + i * 70} 1530 Z`} fill="#141313" heavy={2} />
          ))}
          <path d="M30 1360 C60 1340 280 1340 330 1380" stroke="#7fb6ff" strokeWidth={4} fill="none" opacity={0.6} />
          <path d="M-200 1530 C0 1490 300 1500 420 1550" stroke="#0b0706" strokeWidth={8} fill="none" />
        </Layer>
      </Stage>
      <FlashGrade />
      <Label text="◀◀ 02:58 AM" f={60} color="#f0e6d2" />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 25 · His own bank card: the name, APPROVED                          */
/* ================================================================== */
export const CardShot: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const punch = t > 42.8 ? easeO(clamp((t - 42.8) / 0.18)) : 0;
  const hl = easeIO(inv(43.55, 44.0, t));
  const slide = easeIO(clamp(f / 145));
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: 760, zoom: lerp(1.0, 1.05, slide) + punch * 0.16, rot: lerp(-6, -3, slide), f, shake: 0.6 + (t > 42.8 && t < 43.1 ? 8 : 0)}} bg="#070a0c">
        <Defs />
        <Layer depth={0.5} blur={8}>
          <rect x={-600} y={-400} width={2400} height={2800} fill="#0f1a16" />
          <ellipse cx={540} cy={300} rx={700} ry={300} fill="#7fd0a8" opacity={0.18} />
        </Layer>
        <Layer>
          <g transform={`translate(${lerp(620, 480, slide)} 760)`}>
            <BankCard s={1.0} hl={hl} />
          </g>
          {/* thumb */}
          <Ink d={`M${lerp(1060, 920, slide)} 900 C${lerp(1010, 870, slide)} 860 ${lerp(1010, 870, slide)} 760 ${lerp(1060, 920, slide)} 720 L1300 700 L1300 940 Z`} fill="#d0a184" />
        </Layer>
      </Stage>
      {t > 43.6 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', justifyContent: 'center'}}>
          <div style={{fontFamily: F.type, fontSize: 46, color: '#0c2016', background: '#9ae0a0', padding: '14px 30px', letterSpacing: 4, boxShadow: '0 0 40px rgba(130,230,160,0.55)', border: '4px solid #0b0706', opacity: clamp((t - 43.6) / 0.1)}}>
            APPROVED · M. VOLKOV
          </div>
        </div>
      )}
      <Flash f={f} at={sec(42.8) - sec(41.86)} color="#ff2a1a" dur={16} peak={0.45} mode="screen" />
      <FlashGrade />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 26 · One tiny mistake: the planning wall, taken down; the receipt   */
/* ================================================================== */
export const TinyShot: React.FC<ShotP> = ({f, g}) => {
  const t = TS(g, 3);
  const take = clamp((t - 44.35) / 0.9);
  const rec = easeOutBack(clamp((t - 45.15) / 0.4));
  const k = easeIO(clamp(f / 123));
  const press = t > 45.45 && t < 45.85;
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: lerp(900, 790, k), zoom: lerp(1.0, 1.4, k), f, shake: 0.6}}>
        <Defs />
        <Layer>
          <PlanWall f={g} months={1} lamp={0} takeDown={take} receipt={rec} />
          {t > 45.1 && <Hand x={600} y={press ? 640 : 700} fill="#3A251D" sleeve="#8d7556" rot={200} grab={0.5} s={0.8} sl={280} />}
        </Layer>
      </Stage>
      <AbsoluteFill style={{background: 'linear-gradient(120deg, rgba(225,232,240,0.3) 0%, rgba(0,0,0,0) 55%)', mixBlendMode: 'screen'}} />
      <PoliceWash g={g} k={0.35} />
      <Grade color="#a4b0bc" mode="multiply" op={0.28} />
      <Scrim op={0.6} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 27 · Ruined: led out in cuffs in the rain; a diamond in the puddle  */
/* ================================================================== */
export const RuinedShot: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const sf = stepF(f, 4);
  const walkF = Math.min(sf, sec(2.0));
  const px = 260 + walkF * 2.6;
  const rack = easeIO(inv(47.9, 48.45, t));
  const drop = clamp((t - 48.0) / 0.22);
  const splash = t - 48.22;
  const k = easeIO(clamp(f / 300));
  const {red, blue} = policePhase(g);
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(560, 600, k), y: 1150, zoom: lerp(0.9, 0.98, k), f, shake: 0.6}}>
        <Defs />
        <Layer depth={0.08} blur={rack * 6}>
          <rect x={-1400} y={-800} width={3800} height={2600} fill="#4f5a62" />
        </Layer>
        <Layer depth={0.5} blur={rack * 7}>
          <Block x={-300} y={1460} w={1600} floors={9} cols={9} fh={110} seed={77} lit={0.05} f={g} color="#56606a" shade="#3a434b" snow={false} />
          <rect x={430} y={1160} width={240} height={300} fill="#1a1512" stroke="#0b0706" strokeWidth={6} />
          <rect x={-1400} y={1460} width={3800} height={900} fill="#2c3236" />
        </Layer>
        <Layer depth={0.8} blur={rack * 8}>
          <WetStreet x={-1400} y={1480} w={3800} h={900} f={g} glow="#c8d4dc" glowX={[300, 900]} base="#2c3236" />
          <PoliceCar x={1050} y={1740} s={0.7} f={g} />
          <rect x={-1400} y={1300} width={3800} height={600} fill="#ff2a1a" opacity={0.06 * red} />
          <rect x={-1400} y={1300} width={3800} height={600} fill="#2a5aff" opacity={0.07 * blue} />
          {/* IF watching, rain outfit (hat) */}
          <g transform="translate(900 1760) scale(-0.62 0.62)">
            <IFBody walk={0} t={sf / 60} wind={0.3} hat rim="#cfe0ff" rimOp={0.7} />
          </g>
          {/* the thief, cuffed, led out by an officer */}
          <g transform={`translate(${px} 1770) scale(0.6)`}>
            <ThiefBody phase={(Math.min(sf, sec(2.0)) / 60) * Math.PI * 2} walk={sf < sec(2.0) ? 1 : 0} cuffed hunch={0.6} rim="#ff6a5a" rimOp={0.6} />
          </g>
          <g transform={`translate(${px - 180} 1770) scale(0.62)`}>
            <Officer pose={sf < sec(2.0) ? 'walk' : 'stand'} phase={(sf / 30) * Math.PI} rim="#6f9cff" color="#262e38" />
          </g>
        </Layer>
        <Layer depth={1.3} blur={(1 - rack) * 9}>
          {/* foreground puddle: the dropped diamond */}
          <ellipse cx={700} cy={1720} rx={330} ry={70} fill="#5f7480" opacity={0.5} />
          <ellipse cx={700} cy={1720} rx={330} ry={70} fill="#ff2a1a" opacity={0.12 * red} />
          {splash > 0 &&
            [0, 1, 2].map((i) => {
              const r = ((splash * 260 + i * 70) % 300) + 10;
              return <ellipse key={i} cx={700} cy={1718} rx={r} ry={r * 0.22} fill="none" stroke="#d8e4ea" strokeWidth={3} opacity={Math.max(0, 1 - r / 300) * 0.8} />;
            })}
          {t > 48.0 && <Diamond x={700} y={lerp(900, 1705, drop * drop)} r={34} f={g} seed={5} />}
          {splash > 0 && <Glint x={690} y={1690} r={90} k={0.5 + 0.5 * Math.abs(Math.sin(stepF(f, 4) * 0.08))} />}
        </Layer>
      </Stage>
      <Rain f={g} density={1} splashY={1700} tint="#d0d8de" />
      <Grade color="#8a98a8" mode="multiply" op={0.28} />
    </AbsoluteFill>
  );
};

export {noise1};

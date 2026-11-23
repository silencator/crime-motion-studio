import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Layer, Stage} from '../../kit/camera';
import {CigSmoke, Defs, Flash, Grade, SnowOverlay, Torch, policePhase} from '../../kit/fx';
import {clamp, easeI, easeIO, easeO, hash, inv, lerp, noise1, sec, stepF} from '../../kit/time';
import {IFBust} from '../../characters/IFBust';
import {IFBody, ProfileHead} from '../../characters/IFBody';
import {Suspect} from '../../characters/Suspects';
import {FastbackSide} from '../../characters/IFCar';
import {BareTree, Block, Lamp, PoliceCar, Pylon, Cables, RedSky, SnowGround} from '../../locations/soviet';
import {BackCorridor, DOOR_X, EMPTY_X, EmptyFrameWall, GalleryHall, HiddenCanvas, MuseumFacade, NightLog} from '../../locations/museum';
import timing from '../../../public/data/case002.timing.json';

/** f = frame inside the shot, g = global frame. */
export type ShotP = {f: number; g: number};

const ENV: number[] = (timing as {envelope: number[]}).envelope;
/** Mouth opening from the voice loudness, stepped on 3s (cel lip-flap). */
const talk = (g: number, gain = 1) => {
  const v = ENV[Math.min(ENV.length - 1, stepF(g, 3))] ?? 0;
  return clamp((v - 0.1) * 1.9 * gain);
};
const blinkAt = (f: number, seed: number) => {
  const period = 150 + Math.floor(hash(seed) * 90);
  const ph = (f + seed * 37) % period;
  return ph < 4 ? 1 : ph < 7 ? 0.5 : 0;
};
const S = (s: number) => sec(s);
const T = (g: number) => g / 60;

/** Out-of-focus background for close-ups. */
const Bokeh: React.FC<{g: number; base?: string; tint?: string; seed?: number; dark?: number; floor?: string}> = ({g, base = '#262c28', tint = '#ffb45a', seed = 1, dark = 0.35, floor = '#2a1a12'}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${base} 0%, #0b0b0a 75%)`}}>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: 'blur(18px)'}}>
      <rect x={0} y={1300} width={1080} height={700} fill={floor} />
      {Array.from({length: 7}).map((_, i) => (
        <circle key={i} cx={hash(i * 3 + seed) * 1080} cy={300 + hash(i * 7 + seed) * 700} r={50 + hash(i + seed) * 90} fill={tint} opacity={(0.25 + 0.2 * hash(i + Math.floor(g / 40))) * 0.8} />
      ))}
    </svg>
    <AbsoluteFill style={{background: '#000', opacity: dark}} />
  </AbsoluteFill>
);

/** Police light bar spill through windows (screen wash). */
const PoliceWash: React.FC<{g: number; k?: number}> = ({g, k = 1}) => {
  const {red, blue} = policePhase(g);
  return (
    <>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 0% 30%, rgba(255,40,30,0.9), rgba(0,0,0,0) 60%)', opacity: 0.22 * red * k, mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 100% 30%, rgba(50,90,255,0.9), rgba(0,0,0,0) 60%)', opacity: 0.26 * blue * k, mixBlendMode: 'screen'}} />
    </>
  );
};

/* ================================================================== */
/* 1 · HOOK: the cut-out frame in a sweeping flashlight (lit frame 1) */
/* ================================================================== */
export const FrameHook: React.FC<ShotP> = ({f}) => {
  const k = easeIO(clamp(f / 117));
  const tx = lerp(330, 640, easeIO(clamp(f / 110)));
  const ty = lerp(820, 760, k);
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: lerp(1090, 1040, k), zoom: lerp(1.0, 1.09, k), f, shake: 1}}>
        <Defs />
        <Layer>
          <EmptyFrameWall f={f} />
        </Layer>
      </Stage>
      <Torch f={f} x={tx} y={ty} r={480} dark={0.8} sx={1180} sy={1900} />
      <Grade color="#7f9cc8" mode="multiply" op={0.35} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 2 · MUSEUM exterior, cold blue night; IF's fastback pulls up       */
/* ================================================================== */
const CAR_S = 0.72;
const Exterior: React.FC<{g: number; f: number; carX: number; roll: number; brake: number; cam: {x: number; y: number; zoom: number}; carLights?: number}> = ({g, f, carX, roll, brake, cam, carLights = 1}) => {
  const {red, blue} = policePhase(g);
  return (
    <Stage cam={{...cam, f, shake: 0.7}}>
      <Defs />
      <Layer depth={0.05}>
        <RedSky x={-900} y={-400} w={2900} h={1800} top="#03060c" mid="#0d1a2e" low="#28405e" />
      </Layer>
      <Layer depth={0.25}>
        {[-600, -40, 820, 1400].map((x, i) => (
          <Block key={x} x={x} y={1210} w={460 + (i % 2) * 120} floors={8 + (i % 2)} cols={7} fh={64} seed={i + 21} lit={0.1} f={g} color="#1e2532" shade="#12161e" side={50} />
        ))}
        <Pylon x={300} y={1210} h={420} color="#070a10" />
        <Cables from={[-800, 840]} to={[260, 830]} sag={60} color="#070a10" />
        <rect x={-1200} y={1205} width={3400} height={400} fill="#151a22" />
      </Layer>
      <Layer depth={0.6}>
        <SnowGround x={-1200} y={1330} w={3500} h={900} color="#8f9aa8" shade="#5e6876" tracks={false} />
        <MuseumFacade x={540} y={1340} s={0.5} f={g} />
        {/* police light wash on the facade */}
        <rect x={0} y={760} width={1080} height={590} fill="#ff2a1a" opacity={0.1 * red} />
        <rect x={0} y={760} width={1080} height={590} fill="#2a5aff" opacity={0.13 * blue} />
        <BareTree x={-120} y={1340} s={1.5} seed={4} color="#05070b" />
        <BareTree x={1230} y={1340} s={1.3} seed={12} color="#05070b" />
      </Layer>
      <Layer depth={0.85}>
        <Lamp x={40} y={1560} h={520} f={g} color="#ffb45a" />
        <Lamp x={960} y={1560} h={520} f={g} color="#ffb45a" flicker />
        <rect x={-1200} y={1550} width={3500} height={800} fill="#9aa4b2" />
        <rect x={-1200} y={1550} width={3500} height={40} fill="#5e6876" opacity={0.7} />
      </Layer>
      <Layer depth={1}>
        <PoliceCar x={900} y={1760} s={0.62} f={g} />
        <g transform={`translate(${carX} 1830) scale(${CAR_S})`}>
          <FastbackSide roll={roll} lights={carLights} brake={brake} rim="#9fc4ff" rimOp={0.8} f={g} />
        </g>
      </Layer>
      <Layer depth={1.5} blur={7}>
        <BareTree x={-80} y={2150} s={2.2} seed={31} color="#020305" />
      </Layer>
    </Stage>
  );
};

export const MuseumExt: React.FC<ShotP> = ({f, g}) => {
  const arrive = easeO(clamp(f / 100));
  const carX = lerp(-760, 250, arrive);
  const roll = (carX + 760) / (62 * CAR_S);
  const brake = clamp((f - 60) / 10) * (1 - clamp((f - 115) / 15));
  const k = easeIO(clamp(f / 132));
  return (
    <AbsoluteFill>
      <Exterior g={g} f={f} carX={carX} roll={roll} brake={brake} cam={{x: lerp(520, 470, k), y: lerp(1060, 1100, k), zoom: lerp(0.98, 1.08, k)}} />
      <SnowOverlay f={g} wind={0.5} density={1.1} tint="#e8eef6" />
      <Grade color="#7a92c0" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 3 · The night guard shakes his head (police lights through glass) */
/* ================================================================== */
export const GuardShot: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const sf = stepF(f, 4);
  const shake = t > 4.75 && t < 5.9 ? Math.sin(((t - 4.75) / 0.55) * Math.PI * 2) * 0.9 : 0;
  const k = easeIO(clamp(f / 108));
  return (
    <AbsoluteFill>
      <Bokeh g={g} base="#22303a" tint="#ffc06a" seed={3} dark={0.4} floor="#1a1d22" />
      <Stage cam={{x: 540, y: 960, zoom: lerp(1.0, 1.07, k), f, shake: 1}} bg="transparent">
        <Defs />
        <Layer>
          <g transform={`translate(540 1000) scale(1.32) rotate(${shake * 2} 0 170)`}>
            <Suspect kind="guard" turn={stepF(shake * 100, 25) / 100} lookX={stepF(shake * 100, 25) / 100} blink={blinkAt(sf, 4)} rim="#ffb45a" rimOp={0.6} />
          </g>
        </Layer>
      </Stage>
      <PoliceWash g={g} k={0.8} />
      <Grade color="#8a96a8" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 4 · Insert: the night log, "ENTRIES: NONE" circled                 */
/* ================================================================== */
export const LogInsert: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const k = easeIO(clamp(f / 90));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(540, 470, k), y: lerp(900, 1180, k), zoom: lerp(1.2, 1.4, k), rot: -2, f, shake: 0.8}}>
        <Defs />
        <Layer>
          <NightLog f={g} circle={easeO(inv(6.55, 7.15, t))} />
        </Layer>
        <Layer>
          <circle cx={900} cy={500} r={900} fill="url(#warmGlow)" opacity={0.28} />
        </Layer>
      </Stage>
      <Grade color="#a8865a" mode="multiply" op={0.3} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 12%, rgba(0,0,0,0) 24%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 5 · IF walks the gallery (sodium light), empty frame ahead         */
/* ================================================================== */
export const GalleryWalk: React.FC<ShotP> = ({f, g}) => {
  const sf = stepF(f, 4);
  const camX = 1180 + f * 3.1;
  const px = 1060 + sf * 3.25;
  return (
    <AbsoluteFill>
      <Stage cam={{x: camX, y: 1060, zoom: 0.9, f, shake: 1.1}}>
        <Defs />
        <Layer depth={0.94}>
          <GalleryHall f={g} />
        </Layer>
        <Layer depth={1}>
          <g transform={`translate(${px} 1700) scale(1.08)`}>
            <IFBody phase={(sf / 66) * Math.PI * 2} walk={1} wind={0.08} t={sf / 60} rim="#ffb45a" rimOp={0.85} />
          </g>
        </Layer>
        <Layer depth={1.5} blur={9}>
          {[1500, 2400].map((x) => (
            <g key={x}>
              <rect x={x} y={-200} width={170} height={2600} fill="#4a4a44" />
              <rect x={x + 70} y={-200} width={100} height={2600} fill="#1e1f1d" />
            </g>
          ))}
        </Layer>
      </Stage>
      <Grade color="#d29a55" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 6 · IF asks: "Did you notice anything unusual?"                    */
/* ================================================================== */
export const IFAsk: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 138));
  const sf = stepF(f, 3);
  return (
    <AbsoluteFill>
      <Bokeh g={g} base="#2c3a32" seed={4} dark={0.45} />
      <Stage cam={{x: 480, y: 830, zoom: lerp(1.0, 1.09, k), f, shake: 1}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(570 1020) scale(1.95)">
            <IFBust mouth={talk(g)} blink={blinkAt(sf, 5)} lookX={-0.8} brow={0.3} tilt={-2} rim="#ffb45a" rimOp={0.9} />
          </g>
        </Layer>
      </Stage>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)'}} />
      <Grade color="#c9985e" mode="multiply" op={0.18} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 7 · Guard, relaxed: "Nothing… except the thief must have used…"   */
/* ================================================================== */
export const GuardNothing: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const sf = stepF(f, 3);
  const shrug = t > 12.25 && t < 13.1 ? Math.sin(((t - 12.25) / 0.85) * Math.PI) : 0;
  const k = easeIO(clamp(f / 162));
  return (
    <AbsoluteFill>
      <Bokeh g={g} base="#2c3a32" tint="#ffc06a" seed={8} dark={0.4} />
      <Stage cam={{x: lerp(600, 520, k), y: 940, zoom: lerp(1.1, 1.18, k), f, shake: 1}} bg="transparent">
        <Defs />
        <Layer>
          <g transform={`translate(600 ${980 - shrug * 26}) scale(1.3) rotate(${noise1(stepF(g, 8) * 0.03) * 3} 0 170)`}>
            <Suspect kind="guard" mouth={talk(g, 1.1)} blink={blinkAt(stepF(g, 2), 9)} lookX={t < 13.3 ? 0.5 : noise1(stepF(g, 12) * 0.05) * 0.6} lookY={0.1} rim="#ffb45a" rimOp={0.7} />
          </g>
        </Layer>
      </Stage>
      <Grade color="#b08860" mode="multiply" op={0.22} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 8 · Insert: the back entrance at the end of the service corridor  */
/* ================================================================== */
export const BackDoorInsert: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 81));
  return (
    <AbsoluteFill>
      <Stage cam={{x: DOOR_X - 60, y: 1010, zoom: lerp(0.95, 1.14, k), f, shake: 0.6}}>
        <Defs />
        <Layer>
          <BackCorridor f={g} light={0.55} />
        </Layer>
      </Stage>
      <Grade color="#6a8a80" mode="multiply" op={0.4} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 95%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 9 · "Detective stopped." Eyes close-up, hit                        */
/* ================================================================== */
export const IFStopped: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const hit = S(16.86) - S(16.2);
  const after = f >= hit;
  const shake = after && f < hit + 24 ? 10 * (1 - (f - hit) / 24) : 0.6;
  const zoom = after ? lerp(1.18, 1.24, clamp((f - hit) / 50)) : lerp(1.0, 1.04, f / hit);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: '#06070a'}} />
      <Stage cam={{x: 455, y: 790, zoom, f, shake}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(560 900) scale(3.4)">
            <IFBust lookX={after ? -1 : -0.2} brow={after ? 1 : 0.2} blink={0} rim="#ff8a4a" rimOp={0.9} shade={0.7} />
          </g>
        </Layer>
      </Stage>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.9) 75%)'}} />
      <Grade color={t > 16.86 ? '#9a8a96' : '#7f93b8'} mode="multiply" op={0.35} />
      <Flash f={f} at={hit} color="#fff" dur={12} peak={0.35} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 10 · "Why the back entrance?" IF facing right, cold low angle      */
/* ================================================================== */
export const IFWhy: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 108));
  const sf = stepF(f, 3);
  return (
    <AbsoluteFill>
      <Bokeh g={g} base="#1a2232" tint="#7fa7d6" seed={6} dark={0.5} floor="#10131a" />
      <Stage cam={{x: 560, y: 960, zoom: lerp(1.0, 1.14, k), rot: -3, f, shake: 1}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(480 860) scale(1.75)">
            <IFBust flip mouth={talk(g)} blink={blinkAt(sf, 8)} lookX={-1} brow={0.8} rim="#9fc4ff" rimOp={0.9} shade={0.7} />
          </g>
        </Layer>
      </Stage>
      <Grade color="#7f93b8" mode="multiply" op={0.35} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 11 · OTS: IF (fg) → rack focus to the guard (bg)                   */
/* ================================================================== */
export const ToldOTS: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const focus = easeIO(inv(20.55, 21.0, t));
  return (
    <AbsoluteFill>
      <Bokeh g={g} base="#26302c" tint="#ffc06a" seed={2} dark={0.5} />
      <Stage cam={{x: 560, y: 900, zoom: lerp(1, 1.07, f / 168), f, shake: 1}} bg="transparent">
        <Defs />
        <Layer depth={0.85} blur={lerp(10, 0, focus)}>
          <g transform="translate(720 880) scale(1.02)">
            <Suspect kind="guard" lookX={-0.8} lookY={0.1} sweat={focus * 0.5} fear={0.15 + focus * 0.35} rim="#ffb45a" rimOp={0.6} blink={blinkAt(stepF(g, 2), 11)} />
          </g>
        </Layer>
        <Layer depth={1.25} blur={lerp(0, 9, focus)}>
          <g transform="translate(40 1160) scale(3.3)" style={{filter: 'brightness(0.35)'}}>
            <ProfileHead rim="#ffc070" rimOp={1} />
          </g>
          <path d="M-420 2000 C-220 1700 230 1560 400 1700 L480 2000 Z" fill="#0d0c0e" />
        </Layer>
      </Stage>
      <Grade color="#8a8a80" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 12 · "The guard went silent." Freeze, sweat, heartbeat             */
/* ================================================================== */
export const GuardSilent: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const frozen = t >= 23.2;
  const hb = (t > 23.3 && t < 23.42) || (t > 23.9 && t < 24.02) ? 1.018 : 1;
  const snap = frozen ? 1.6 : lerp(1.4, 1.46, f / 50);
  return (
    <AbsoluteFill>
      <Bokeh g={frozen ? S(23.2) : g} base="#1f2028" tint="#ff6a4a" seed={5} dark={0.6} />
      <Stage cam={{x: 540, y: 820, zoom: snap * hb, f, shake: frozen ? 0 : 1.2}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(540 900) scale(1.3)">
            <Suspect kind="guard" fear={frozen ? 0.9 : 0.45} sweat={1} lookX={frozen ? 0 : noise1(stepF(g, 8) * 0.1)} lookY={0} rim="#ff5a3a" rimOp={0.7} />
          </g>
        </Layer>
      </Stage>
      <Grade color={frozen ? '#9a6a64' : '#8a7a90'} mode="multiply" op={0.45} />
      {frozen && <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 90%)'}} />}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 13 · "Only the thief could know that." Hard red punch-in           */
/* ================================================================== */
export const ThiefPunch: React.FC<ShotP> = ({f, g}) => {
  const hit = S(24.86) - S(24.3);
  const red = clamp((f - hit) / 6);
  const shake = f >= hit && f < hit + 30 ? 14 * (1 - (f - hit) / 30) : 0.8;
  const zoom = f < hit ? lerp(2.0, 2.1, f / hit) : lerp(2.5, 2.62, clamp((f - hit) / 90));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: red > 0 ? '#2a0504' : '#0d0f14'}} />
      <Stage cam={{x: 540, y: 820, zoom, f, shake}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(540 900) scale(1.3)">
            <Suspect kind="guard" lookX={0.15} lookY={0.25} sweat={0.9} fear={0.7} rim={red > 0 ? '#ff3a2a' : '#9fc4ff'} rimOp={0.9} />
          </g>
        </Layer>
      </Stage>
      <Grade color={red > 0 ? '#c0281e' : '#7d8fb0'} mode="multiply" op={0.45 + red * 0.25} />
      <Flash f={f} at={hit} color="#ff2a1a" dur={20} peak={0.75} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 14 · Service corridor in the dark, flashlight sweeps to the radiator */
/* ================================================================== */
export const CorridorTorch: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 180));
  const camX = lerp(620, 1420, k);
  const zoom = 1.05;
  // flashlight: sweeps the crates, then settles on the radiator gap
  const target = (wx: number, wy: number) => [(wx - camX) * zoom + 540, (wy - 1080) * zoom + 960];
  const [ax, ay] = target(700, 1250);
  const [bx, by] = target(1360, 1180);
  const s = easeIO(clamp((f - 20) / 130));
  return (
    <AbsoluteFill>
      <Stage cam={{x: camX, y: 1080, zoom, f, shake: 1.4}}>
        <Defs />
        <Layer>
          <BackCorridor f={g} light={0.45} />
        </Layer>
      </Stage>
      <Torch f={f} x={lerp(ax, bx, s)} y={lerp(ay, by, s)} r={330} dark={0.85} sx={-120} sy={1980} jitter={9} />
      <Grade color="#7e9a90" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 15 · The hidden canvas: cloth slips, the portrait unrolls          */
/* ================================================================== */
export const HiddenReveal: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const cloth = easeIO(inv(29.75, 30.35, t));
  const unroll = easeO(inv(30.2, 31.0, t));
  const hit = S(30.9) - S(29.6);
  const shake = f >= hit && f < hit + 20 ? 8 * (1 - (f - hit) / 20) : 1;
  const k = easeIO(clamp(f / 162));
  return (
    <AbsoluteFill>
      <Stage cam={{x: 560, y: lerp(980, 900, k), zoom: lerp(0.98, 1.08, k), f, shake}}>
        <Defs />
        <Layer>
          <HiddenCanvas f={g} unroll={unroll} cloth={cloth} />
        </Layer>
      </Stage>
      <Torch f={f} x={540} y={lerp(720, 860, unroll)} r={520} dark={0.82} tint="rgba(255,236,200,0.2)" />
      <Grade color="#9a9080" mode="multiply" op={0.2} />
      <Flash f={f} at={hit} color="#ffd690" dur={16} peak={0.35} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 16 · Red light: the guard's huge shadow beside the empty frame     */
/* ================================================================== */
const GuardShadow: React.FC = () => (
  <g fill="#060101">
    <path d="M-150 -60 C-150 -190 150 -190 150 -60 L180 -40 C190 -10 -190 -10 -180 -40 Z" />
    <ellipse cx={0} cy={60} rx={140} ry={170} />
    <path d="M-420 1300 C-420 640 -380 400 -200 320 L200 320 C380 400 420 640 420 1300 Z" />
    <rect x={-70} y={180} width={140} height={180} />
  </g>
);

export const RedShadow: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 132));
  const flick = 0.85 + 0.15 * hash(stepF(f, 4));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(EMPTY_X + 120, EMPTY_X + 260, k), y: lerp(980, 1020, k), zoom: lerp(0.95, 1.02, k), f, shake: 0.8}}>
        <Defs />
        <Layer depth={0.9}>
          <GalleryHall f={g} light={0.2} red={1} />
          <circle cx={EMPTY_X - 200} cy={1500} r={1300} fill="url(#redGlow)" opacity={0.6 * flick} />
          <g transform={`translate(${EMPTY_X + 560} 520) scale(${lerp(1.5, 1.6, k)})`} opacity={0.9}>
            <GuardShadow />
          </g>
        </Layer>
        <Layer depth={1}>
          <g transform={`translate(${EMPTY_X + 60} 1200) scale(0.85)`}>
            <Suspect kind="guard" fear={0.6} sweat={0.8} lookX={-0.7} lookY={0.2} rim="#ff3a2a" rimOp={1} />
          </g>
        </Layer>
      </Stage>
      <Grade color="#e0402e" mode="multiply" op={0.55} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 45% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.8) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 17 · "He was protecting his secret." IF lights up, amber + red     */
/* ================================================================== */
export const IFSecret: React.FC<ShotP> = ({f, g}) => {
  const t = T(g);
  const k = easeIO(clamp(f / 129));
  const glow = 0.5 + 0.5 * clamp(1 - Math.abs(t - 35.15) / 0.35) + 0.08 * hash(stepF(f, 4));
  const sf = stepF(f, 3);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 30%, #3a120a 0%, #0a0403 70%)'}} />
      <Stage cam={{x: 520, y: 820, zoom: lerp(1.0, 1.1, k), f, shake: 0.8}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(640 760) scale(1.6)">
            <IFBust cig cigGlow={glow} blink={blinkAt(sf, 12)} lookX={-0.6} brow={0.5} rim="#ff7a3a" rimOp={1} shade={0.7} />
          </g>
          <CigSmoke f={g} x={640 - 266 * 1.6} y={760 + 145 * 1.6} scale={1.1} op={0.45} len={520} />
        </Layer>
      </Stage>
      <Grade color="#c07050" mode="multiply" op={0.25} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.7) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 18 · OUTRO: the fastback pulls away into the snow, CASE CLOSED     */
/* ================================================================== */
export const Outro: React.FC<ShotP> = ({f, g}) => {
  const go = easeI(clamp((f - 60) / 140));
  const carX = lerp(150, 1500, go);
  const roll = (carX - 150) / (62 * CAR_S);
  const k = easeIO(clamp(f / 200));
  return (
    <AbsoluteFill>
      <Exterior g={g} f={f} carX={carX} roll={roll} brake={0} cam={{x: lerp(470, 560, k), y: 1080, zoom: lerp(1.06, 0.98, k)}} />
      <SnowOverlay f={g} wind={0.75} density={1.25} tint="#e8eef6" />
      <Grade color="#7a92c0" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

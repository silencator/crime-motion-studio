import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Layer, Stage} from '../../kit/camera';
import {CigSmoke, Defs, Dust, Flash, Grade, SnowOverlay, Snow, policePhase} from '../../kit/fx';
import {clamp, easeIO, easeO, hash, inv, lerp, noise1, ramp, sec, stepF} from '../../kit/time';
import {IFBust} from '../../characters/IFBust';
import {IFBody, ProfileHead} from '../../characters/IFBody';
import {Suspect, SuspectKind} from '../../characters/Suspects';
import {BareTree, Cables, Factory, Fence, Mansion, PoliceCar, Pylon, RedSky, SnowGround} from '../../locations/soviet';
import {BodyRoomTop, Corridor, ReportCard, RevealWall} from '../../locations/interiors';
import {StreetBack, StreetFront, StreetGround, StreetMid} from '../../locations/StreetScene';
import timing from '../../../public/data/case001.timing.json';

/** f = frame inside the shot, g = global frame. */
export type ShotP = {f: number; g: number};

const ENV: number[] = (timing as {envelope: number[]}).envelope;
/** Mouth opening from the voice loudness, stepped on 3s (cel lip-flap, not smooth sync). */
export const talk = (g: number, gain = 1) => {
  const k = stepF(g, 3);
  const v = ENV[Math.min(ENV.length - 1, k)] ?? 0;
  return clamp((v - 0.1) * 1.9 * gain);
};
const blinkAt = (f: number, seed: number) => {
  const period = 150 + Math.floor(hash(seed) * 90);
  const ph = (f + seed * 37) % period;
  return ph < 4 ? 1 : ph < 7 ? 0.5 : 0;
};
const S = (s: number) => sec(s);

/* ================================================================== */
/* 1 · HOOK: painted close-up, Zippo snaps alight                     */
/* ================================================================== */
export const Hook: React.FC<ShotP> = ({f}) => {
  const lit = f >= 8;
  const fl = lit ? 0.86 + 0.14 * hash(stepF(f, 3)) : 0;
  const bright = lit ? lerp(0.35, 1, easeO(clamp((f - 8) / 10))) * fl : 0.04;
  const sc = lerp(1.0, 1.1, easeIO(f / 81));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', left: 540 - 650 * sc, top: 880 - 615 * sc, width: 1300 * sc, height: 1232 * sc}}>
        <Img src={staticFile('img/if_lighter.jpg')} style={{width: '100%', height: '100%', filter: `brightness(${bright}) contrast(1.15) saturate(0.85) sepia(0.15)`}} />
        {/* soft edge into the darkness */}
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 58% 55% at 45% 50%, rgba(0,0,0,0) 55%, #000 100%)'}} />
        {/* flame glow */}
        {lit && <div style={{position: 'absolute', left: '32.5%', top: '54.8%', width: 10, height: 10, borderRadius: 5, boxShadow: `0 0 ${140 * fl}px ${70 * fl}px rgba(255,150,50,0.38)`}} />}
      </div>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {lit && <CigSmoke f={f} x={300} y={830} scale={1.2} op={0.35} len={420} />}
      </svg>
      <Grade color="#3a0c08" mode="screen" op={0.25} />
      <AbsoluteFill style={{background: 'linear-gradient(#000 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 70%, #000 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 2 · MANSION exterior: blood sky, militia lights                    */
/* ================================================================== */
export const MansionExt: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 102));
  const cam = {x: lerp(540, 600, k), y: lerp(990, 950, k), zoom: lerp(1.0, 1.14, k), f, shake: 0.6};
  const {red, blue} = policePhase(g);
  return (
    <AbsoluteFill>
      <Stage cam={cam}>
        <Defs />
        <Layer depth={0.05}>
          <RedSky x={-600} y={-300} w={2400} h={1700} top="#3a0507" mid="#8e0f13" low="#cc2a1c" />
        </Layer>
        <Layer depth={0.2}>
          <Factory x={-250} y={1180} s={0.8} f={g} seed={2} />
          <Factory x={760} y={1180} s={1} f={g + 40} seed={6} />
          <Pylon x={120} y={1190} h={430} />
          <Pylon x={1000} y={1190} h={470} />
          <Cables from={[160, 880]} to={[960, 840]} sag={80} />
          <rect x={-800} y={1178} width={2800} height={300} fill="#1a0c0b" />
        </Layer>
        <Layer depth={0.55}>
          <SnowGround x={-900} y={1290} w={2900} h={800} color="#8e8483" shade="#5e5556" tracks={false} />
          <Mansion x={540} y={1310} s={0.62} f={g} />
          <BareTree x={-60} y={1300} s={1.6} seed={3} />
          <BareTree x={1120} y={1300} s={1.4} seed={11} />
          {/* police light wash on the facade */}
          <rect x={150} y={700} width={800} height={620} fill="#ff2a1a" opacity={0.18 * red} style={{mixBlendMode: 'screen'}} />
          <rect x={150} y={700} width={800} height={620} fill="#2a5aff" opacity={0.2 * blue} style={{mixBlendMode: 'screen'}} />
        </Layer>
        <Layer depth={0.85}>
          <Fence x={-900} y={1560} w={2900} h={260} post={300} />
          <rect x={-900} y={1556} width={2900} height={700} fill="#a49a98" />
          <rect x={-900} y={1556} width={2900} height={60} fill="#6d6465" opacity={0.6} />
        </Layer>
        <Layer depth={1.1}>
          <PoliceCar x={250} y={1760} s={0.9} f={g} />
        </Layer>
        <Layer depth={1.6} blur={6}>
          <BareTree x={980} y={2100} s={2.4} seed={21} />
        </Layer>
      </Stage>
      <SnowOverlay f={g} wind={0.55} density={1.1} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 3 · LINEUP: three suspects lit as they are named                   */
/* ================================================================== */
type Trio = Exclude<SuspectKind, 'pawnbroker'>;
const SUSPECT_X: Record<Trio, number> = {wife: 420, driver: 1120, assistant: 1820};
const Lineup: React.FC<{g: number; lit: Record<Trio, number>; look?: Partial<Record<Trio, [number, number]>>; fear?: number}> = ({g, lit, look = {}, fear = 0}) => (
  <>
    {(['wife', 'driver', 'assistant'] as Trio[]).map((k, i) => {
      const b = lit[k];
      const sway = noise1(stepF(g, 6) * 0.02 + i * 9) * 4;
      return (
        <g key={k} transform={`translate(${SUSPECT_X[k] + sway} 860) scale(0.95)`} style={{filter: `brightness(${0.14 + b * 0.86}) saturate(${0.5 + b * 0.5})`}}>
          <Suspect
            kind={k}
            blink={blinkAt(stepF(g, 2), i + 1)}
            lookX={look[k]?.[0] ?? 0}
            lookY={look[k]?.[1] ?? 0}
            rim={k === 'assistant' ? '#9fc4ff' : '#ffb45a'}
            rimOp={0.35 + b * 0.5}
            fear={k === 'assistant' ? fear : 0}
          />
        </g>
      );
    })}
  </>
);

export const LineupShot: React.FC<ShotP> = ({f, g}) => {
  const t = g / 60;
  // camera: wife → driver → assistant → pull back to the taped door
  let x = 420;
  x = lerp(x, 1120, easeIO(inv(3.72, 4.02, t)));
  x = lerp(x, 1820, easeIO(inv(4.72, 5.04, t)));
  x = lerp(x, 2080, easeIO(inv(5.8, 7.0, t)));
  const zoom = lerp(1.0, 0.72, easeIO(inv(5.8, 7.2, t)));
  const y = lerp(1000, 1060, easeIO(inv(5.8, 7.2, t)));
  const lit = {
    wife: clamp((t - 3.2) / 0.12) * (t > 3.95 ? 0.55 : 1),
    driver: clamp((t - 3.98) / 0.12) * (t > 5.0 ? 0.55 : 1),
    assistant: clamp((t - 5.02) / 0.12),
  };
  return (
    <AbsoluteFill>
      <Stage cam={{x, y, zoom, f, shake: 0.8}}>
        <Defs />
        <Layer depth={0.92}>
          <Corridor f={g} />
        </Layer>
        <Layer depth={1}>
          {/* spotlight cones per suspect */}
          {(['wife', 'driver', 'assistant'] as Trio[]).map((k) => (
            <polygon key={k} points={`${SUSPECT_X[k] - 60},0 ${SUSPECT_X[k] + 60},0 ${SUSPECT_X[k] + 420},1900 ${SUSPECT_X[k] - 420},1900`} fill="#ffd89a" opacity={0.08 * lit[k]} />
          ))}
          <Lineup g={g} lit={lit} look={{wife: [0.3, 0.4], driver: [-0.4, 0], assistant: [noise1(stepF(g, 10) * 0.05) * 0.8, 0]}} />
        </Layer>
      </Stage>
      <Grade color="#7a8aa6" mode="multiply" op={0.25} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 4 · BODY: top-down crime scene, cold blue                          */
/* ================================================================== */
export const BodyShot: React.FC<ShotP> = ({f, g}) => {
  const k = easeO(clamp(f / 132));
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: 980, zoom: lerp(1.35, 1.02, k), rot: lerp(9, 0, k), f, shake: 0.5}}>
        <Defs />
        <Layer>
          <BodyRoomTop f={g} />
        </Layer>
      </Stage>
      <Grade color="#5f86c4" mode="multiply" op={0.55} />
      <Grade color="#0d1a33" mode="screen" op={0.35} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 5 · IF walks down the corridor toward the taped door               */
/* ================================================================== */
export const WalkIn: React.FC<ShotP> = ({f, g}) => {
  const sf = stepF(f, 4);
  const walk = 1 - clamp((f - 132) / 20);
  const px = 1240 + Math.min(sf, 140) * 3.3;
  const camX = 1340 + f * 3.0;
  return (
    <AbsoluteFill>
      <Stage cam={{x: camX, y: 1000, zoom: 1.0, f, shake: 1.2}}>
        <Defs />
        <Layer depth={0.92}>
          <Corridor f={g} />
        </Layer>
        <Layer depth={1}>
          <g transform={`translate(${px} 1700) scale(1.12)`}>
            <IFBody phase={(Math.min(sf, 140) / 66) * Math.PI * 2} walk={walk} wind={0.1} t={sf / 60} rim="#ffb45a" rimOp={0.8} />
          </g>
        </Layer>
        <Layer depth={1.5} blur={8}>
          <rect x={camX * 1.5 - 1600} y={-200} width={120} height={2400} fill="#0d0a08" transform={`translate(${-f * 1.5} 0)`} />
        </Layer>
      </Stage>
      <Grade color="#c9a27a" mode="multiply" op={0.25} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* Close-up backgrounds: blurred corridor bokeh                       */
/* ================================================================== */
const Bokeh: React.FC<{g: number; tint?: string; seed?: number; dark?: number}> = ({g, tint = '#ffb45a', seed = 1, dark = 0.35}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2b2a22 0%, #0d0b09 75%)'}}>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: 'blur(18px)'}}>
      <rect x={0} y={1250} width={1080} height={700} fill="#2a1a12" />
      <rect x={0} y={300} width={1080} height={950} fill="#24302a" opacity={0.8} />
      {Array.from({length: 7}).map((_, i) => (
        <circle key={i} cx={hash(i * 3 + seed) * 1080} cy={300 + hash(i * 7 + seed) * 700} r={50 + hash(i + seed) * 90} fill={tint} opacity={(0.25 + 0.2 * hash(i + Math.floor(g / 40))) * 0.8} />
      ))}
    </svg>
    <AbsoluteFill style={{background: '#000', opacity: dark}} />
  </AbsoluteFill>
);

/* ================================================================== */
/* 6–7 · IF medium / close: "Detective asked" + the question          */
/* ================================================================== */
export const IFAsked: React.FC<ShotP> = ({f, g}) => {
  const t = g / 60;
  const k = easeIO(clamp(f / 87));
  const sf = stepF(f, 4);
  return (
    <AbsoluteFill>
      <Bokeh g={g} />
      <Stage cam={{x: 540, y: 960, zoom: lerp(1, 1.08, k), f, shake: 1}} bg="transparent">
        <Defs />
        <Layer>
          <g transform={`translate(${600} ${1050}) scale(1.25)`}>
            <IFBust blink={blinkAt(sf, 3)} lookX={t > 13.2 ? -1 : -0.2} tilt={t > 13.2 ? -3 : 0} brow={0.2} rim="#ffb45a" breathe={Math.sin(sf / 40) * 4} />
          </g>
        </Layer>
      </Stage>
      <Grade color="#8a6a50" mode="multiply" op={0.25} />
    </AbsoluteFill>
  );
};

export const IFQuestion: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 123));
  const sf = stepF(f, 3);
  return (
    <AbsoluteFill>
      <Bokeh g={g} seed={4} dark={0.5} />
      <Stage cam={{x: 470, y: 820, zoom: lerp(1.0, 1.1, k), f, shake: 1}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(560 1020) scale(2.0)">
            <IFBust mouth={talk(g)} blink={blinkAt(sf, 5)} lookX={-0.8} brow={0.35} tilt={-2} rim="#ffb45a" rimOp={0.9} />
          </g>
        </Layer>
      </Stage>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 8 · SILENCE: slow pan across the three faces, cold                 */
/* ================================================================== */
export const Silence: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 97));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(520, 1720, k), y: 860, zoom: 1.55, f, shake: 0.5}}>
        <Defs />
        <Layer depth={0.92} blur={6}>
          <Corridor f={g} light={0.5} />
        </Layer>
        <Layer>
          <Lineup g={g} lit={{wife: 0.7, driver: 0.7, assistant: 0.75}} look={{wife: [0.2, 0.8], driver: [0.9, 0.2], assistant: [noise1(stepF(g, 9) * 0.07) * 1.0, 0.1]}} fear={0.2} />
        </Layer>
      </Stage>
      <Grade color="#6c84ad" mode="multiply" op={0.5} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 9–10 · ASSISTANT whisper (medium → hard punch-in)                  */
/* ================================================================== */
export const WhisperPre: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 113));
  const dart = noise1(stepF(g, 10) * 0.09) * 1.0;
  return (
    <AbsoluteFill>
      <Bokeh g={g} tint="#9fc4ff" seed={9} dark={0.45} />
      <Stage cam={{x: 540, y: 900, zoom: lerp(1, 1.12, k), f, shake: 1}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(540 900) scale(1.45)">
            <Suspect kind="assistant" lookX={dart} lookY={0.2} sweat={0.3} fear={0.25} blink={blinkAt(stepF(g, 2), 7)} rim="#9fc4ff" rimOp={0.7} />
          </g>
        </Layer>
      </Stage>
      <Grade color="#7d8fb0" mode="multiply" op={0.35} />
    </AbsoluteFill>
  );
};

export const Whisper: React.FC<ShotP> = ({f, g}) => {
  const hit = S(19.92) - S(19.5);
  const red = clamp((f - hit) / 6);
  const shake = f >= hit && f < hit + 30 ? 14 * (1 - (f - hit) / 30) : 0.8;
  const zoom = f < hit ? lerp(2.5, 2.65, f / hit) : lerp(3.0, 3.15, clamp((f - hit) / 90));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: red > 0 ? '#2a0504' : '#0d0f14'}} />
      <Stage cam={{x: 540, y: 1080, zoom, f, shake}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(540 900) scale(1.45)">
            <Suspect kind="assistant" mouth={talk(g, 0.7)} lookX={0.2} lookY={0.3} sweat={0.6} fear={0.15} rim={red > 0 ? '#ff3a2a' : '#9fc4ff'} rimOp={0.9} />
          </g>
        </Layer>
      </Stage>
      <Grade color={red > 0 ? '#c0281e' : '#7d8fb0'} mode="multiply" op={0.45 + red * 0.25} />
      <Flash f={f} at={hit} color="#ff2a1a" dur={20} peak={0.75} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 11 · IF eyes: "Wait—what had he just revealed?"                    */
/* ================================================================== */
export const IFWait: React.FC<ShotP> = ({f, g}) => {
  const t = g / 60;
  const k = easeIO(clamp(f / 166));
  const look = t < 21.66 ? 0 : -1;
  const brow = clamp((t - 22.4) / 0.5);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: '#07080b'}} />
      <Stage cam={{x: 455, y: 700, zoom: lerp(1, 1.12, k), f, shake: 0.8}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(560 900) scale(3.4)">
            <IFBust lookX={look} brow={brow} blink={t > 23.6 && t < 23.68 ? 1 : 0} rim="#ff8a4a" rimOp={0.9} shade={0.7} />
          </g>
        </Layer>
      </Stage>
      {/* cold key across the eyes, darkness elsewhere */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.9) 75%)'}} />
      <Grade color="#7f93b8" mode="multiply" op={0.35} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 12 · Insert: the sheet, still covered                              */
/* ================================================================== */
export const SheetInsert: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 96));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(470, 600, k), y: lerp(760, 1180, k), zoom: 2.0, rot: -24 + 24, f, shake: 0.6}}>
        <Defs />
        <Layer>
          <BodyRoomTop f={g} />
        </Layer>
      </Stage>
      <Grade color="#5f86c4" mode="multiply" op={0.55} />
      <Grade color="#0d1a33" mode="screen" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 13 · Insert: report card, "WEAPON: NONE FOUND" circled             */
/* ================================================================== */
export const ReportInsert: React.FC<ShotP> = ({f, g}) => {
  const t = g / 60;
  const k = easeIO(clamp(f / 135));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(520, 460, k), y: lerp(820, 1090, k), zoom: lerp(1.3, 1.5, k), f, shake: 0.8}}>
        <Defs />
        <Layer>
          <ReportCard f={g} circle={easeO(inv(27.2, 27.75, t))} stamp={0} />
        </Layer>
        <Layer>
          <circle cx={300} cy={600} r={900} fill="url(#warmGlow)" opacity={0.25} />
        </Layer>
      </Stage>
      <Grade color="#a88a62" mode="multiply" op={0.3} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 14 · Over-the-shoulder: IF turns to the assistant (rack focus)     */
/* ================================================================== */
export const TurnOTS: React.FC<ShotP> = ({f, g}) => {
  const t = g / 60;
  const turn = easeIO(inv(28.85, 29.3, t));
  const focus = turn; // rack: foreground sharp → background sharp
  return (
    <AbsoluteFill>
      <Bokeh g={g} tint="#9fc4ff" seed={2} dark={0.55} />
      <Stage cam={{x: 560, y: 900, zoom: lerp(1, 1.06, f / 108), f, shake: 1}} bg="transparent">
        <Defs />
        <Layer depth={0.85} blur={lerp(10, 0, focus)}>
          <g transform="translate(700 860) scale(1.05)">
            <Suspect kind="assistant" lookX={-0.9} lookY={0.1} sweat={0.5} fear={0.35 + turn * 0.3} rim="#9fc4ff" rimOp={0.6} blink={blinkAt(stepF(g, 2), 11)} />
          </g>
        </Layer>
        <Layer depth={1.25} blur={lerp(0, 9, focus)}>
          <g transform={`translate(${lerp(-140, 110, turn)} ${1180}) scale(${lerp(3.2, 3.5, turn)})`} style={{filter: 'brightness(0.3)'}}>
            <ProfileHead rim="#ffc070" rimOp={1} />
          </g>
          <path d={`M${lerp(-400, -200, turn)} 2000 C${lerp(-200, 0, turn)} 1700 ${lerp(250, 420, turn)} 1560 ${lerp(420, 600, turn)} 1700 L${lerp(500, 700, turn)} 2000 Z`} fill="#0d0c0e" />
        </Layer>
      </Stage>
      <Grade color="#6f85ab" mode="multiply" op={0.35} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 15 · IF: "I never said he was stabbed." (low angle, red rim)       */
/* ================================================================== */
export const IFNever: React.FC<ShotP> = ({f, g}) => {
  const k = easeIO(clamp(f / 129));
  const sf = stepF(f, 3);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 30%, #3a0a08 0%, #0a0303 70%)'}} />
      <Stage cam={{x: 560, y: 960, zoom: lerp(1.0, 1.12, k), rot: -3, f, shake: 1}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(470 840) scale(1.75)">
            <IFBust flip mouth={talk(g)} blink={blinkAt(sf, 8)} lookX={-1} brow={0.9} rim="#ff3a2a" rimOp={1} shade={0.75} />
          </g>
        </Layer>
      </Stage>
      <Grade color="#b05a48" mode="multiply" op={0.3} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 16 · The assistant freezes (heartbeat, hold)                       */
/* ================================================================== */
export const Froze: React.FC<ShotP> = ({f, g}) => {
  const t = g / 60;
  const frozen = t >= 33.0;
  const snap = frozen ? 1.12 : lerp(1.0, 1.04, f / 50);
  const hb = (t > 33.0 && t < 33.15) || (t > 33.72 && t < 33.87) ? 1.015 : 1;
  return (
    <AbsoluteFill>
      <Bokeh g={frozen ? S(33) : g} tint="#ff5a3a" seed={5} dark={0.6} />
      <Stage cam={{x: 540, y: 880, zoom: snap * hb, f, shake: frozen ? 0 : 1.2}} bg="transparent">
        <Defs />
        <Layer>
          <g transform="translate(540 900) scale(1.75)">
            <Suspect kind="assistant" fear={frozen ? 1 : 0.5} sweat={1} lookX={frozen ? 0 : noise1(stepF(g, 8) * 0.1)} lookY={0} rim="#ff4a3a" rimOp={0.8} />
          </g>
        </Layer>
      </Stage>
      <AbsoluteFill style={{background: '#000', opacity: frozen ? 0.0 : 0, mixBlendMode: 'saturation'}} />
      <Grade color={frozen ? '#9a6a64' : '#8a7a90'} mode="multiply" op={0.45} />
      {frozen && <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 90%)'}} />}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 17 · REVEAL: red light, the shadow on the wall holds the knife     */
/* ================================================================== */
const KnifeShadow: React.FC<{raise: number}> = ({raise}) => (
  <g fill="#050101">
    {/* head + shoulders silhouette */}
    <ellipse cx={0} cy={0} rx={125} ry={175} />
    <path d="M-360 1200 C-360 700 -330 420 -170 330 L170 330 C330 420 360 700 360 1200 Z" />
    <rect x={-60} y={120} width={120} height={240} />
    {/* raised arm + knife */}
    {/* glasses rims catch light through the silhouette */}
    <g transform={`rotate(${lerp(40, -8, raise)} 230 430)`}>
      <path d="M170 400 C190 300 230 150 250 -40 L340 -40 C330 150 320 300 300 420 Z" />
      <ellipse cx={295} cy={-80} rx={70} ry={72} />
      <path d="M240 -150 H350 V-128 H240 Z" />
      <path d="M268 -150 L322 -150 L300 -520 Z" />
    </g>
  </g>
);

export const Reveal: React.FC<ShotP> = ({f, g}) => {
  const t = g / 60;
  const pull = easeIO(inv(34.1, 36.0, t));
  const raise = easeO(inv(35.6, 36.3, t));
  const hit = S(36.3) - S(33.98);
  const shake = f >= hit && f < hit + 26 ? 12 * (1 - (f - hit) / 26) : 0.8;
  const flick = 0.85 + 0.15 * hash(stepF(f, 4));
  return (
    <AbsoluteFill>
      <Stage cam={{x: lerp(420, 640, pull), y: lerp(900, 820, pull), zoom: lerp(1.55, 0.92, pull), f, shake}}>
        <Defs />
        <Layer depth={0.9}>
          <RevealWall />
          {/* red light pool */}
          <circle cx={380} cy={1100} r={1200} fill="url(#redGlow)" opacity={0.65 * flick} />
          {/* the shadow (bigger, offset, armed) */}
          <g transform="translate(780 760) scale(1.4)" opacity={0.93}>
            <KnifeShadow raise={raise} />
          </g>
        </Layer>
        <Layer depth={1}>
          <g transform="translate(360 960) scale(0.9)">
            <Suspect kind="assistant" fear={0.4} sweat={0.8} lookX={0.6} lookY={0.2} rim="#ff3a2a" rimOp={1} />
          </g>
        </Layer>
      </Stage>
      <Grade color="#e0402e" mode="multiply" op={0.55} />
      <Flash f={f} at={hit} color="#ff2a1a" dur={22} peak={0.7} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 40% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.8) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 18–19 · OUTRO: IF walks into the snow under the red sky            */
/* ================================================================== */
export const Outro: React.FC<ShotP> = ({f, g}) => {
  const sf = stepF(f, 4);
  const stop = clamp((f - 230) / 30); // he stops before the stamp
  const camX = 540 + Math.min(f, 260) * 3.4 + 0;
  const px = 520 + Math.min(sf, 250) * 3.4;
  const zoom = lerp(1.0, 0.9, easeIO(clamp(f / 300)));
  return (
    <AbsoluteFill>
      <Stage cam={{x: camX, y: 1080, zoom, f, shake: 1}}>
        <StreetBack f={g} />
        <StreetMid f={g} />
        <StreetGround f={g} />
        <Layer depth={1}>
          <g transform={`translate(${px} 1660) scale(0.95)`}>
            <IFBody phase={(Math.min(sf, 250) / 66) * Math.PI * 2} walk={1 - stop} wind={0.6} t={sf / 60} rim="#ff6a3a" rimOp={0.75} cig />
          </g>
          <CigSmokeAt f={g} x={px + 0.95 * (18 + 96 * 0.62 + 62 * 0.62)} y={1660 - 0.95 * (948 - 64 * 0.62)} />
        </Layer>
        <StreetFront f={g} />
      </Stage>
      <SnowOverlay f={g} wind={0.7} density={1.2} />
      <Grade color="#a06a5a" mode="multiply" op={0.15} />
    </AbsoluteFill>
  );
};
const CigSmokeAt: React.FC<{f: number; x: number; y: number}> = ({f, x, y}) => <CigSmoke f={f} x={x} y={y} scale={0.6} op={0.45} len={200} />;

export {Snow, Dust};

import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CaseClosed, CaseTag, Captions} from '../../kit/captions';
import {FilmFinish} from '../../kit/fx';
import {clamp, sec} from '../../kit/time';
import {ACCENTS, CLOSED_S, DURATION_S, SHOTS, SUBS} from './timeline';
import * as Sh from './shots';

export const CASE004_FRAMES = sec(DURATION_S);
const CLOSED_AT = sec(CLOSED_S);

const SHOT_LIST: [keyof typeof SHOTS, React.FC<Sh.ShotP>][] = [
  ['hook', Sh.Hook],
  ['snowHook', Sh.SnowHook],
  ['ifAsk', Sh.IFAsk],
  ['facade', Sh.Facade],
  ['clock', Sh.ClockInsert],
  ['safe', Sh.SafeShot],
  ['window', Sh.WindowShot],
  ['ownerA', Sh.OwnerA],
  ['ownerB', Sh.OwnerB],
  ['stepOut', Sh.StepOut],
  ['alley', Sh.AlleyWide],
  ['crouch', Sh.Crouch],
  ['smooth', Sh.Smooth],
  ['topDown', Sh.TopDown],
  ['glass', Sh.GlassMacro],
  ['ifEyes', Sh.IFEyes],
  ['burst', Sh.Burst],
  ['noThief', Sh.NoThief],
  ['robbed', Sh.Robbed],
  ['claim', Sh.Claim],
  ['outro', Sh.Outro],
];

const ShotHost: React.FC<{C: React.FC<Sh.ShotP>; from: number}> = ({C, from}) => {
  const f = useCurrentFrame();
  return <C f={f} g={f + from} />;
};

/* ------------------------------ sound ------------------------------ */
type Cue = {at: number; src: string; vol: number; dur?: number};
const SFX: Cue[] = [
  // hook: nothing hissy under the first words; the drone + far siren carry it
  {at: 2.48, src: 'whoosh-soft', vol: 0.28},
  {at: 4.4, src: 'whoosh-low', vol: 0.3},
  {at: 5.4, src: 'exhale', vol: 0.22},
  {at: 5.9, src: 'whoosh-soft', vol: 0.28},
  // clock
  {at: 7.66, src: 'tick', vol: 0.6},
  {at: 8.16, src: 'tock', vol: 0.55},
  {at: 8.66, src: 'tick', vol: 0.5},
  // safe
  {at: 8.74, src: 'flash-click', vol: 0.8},
  {at: 8.82, src: 'safe-clank', vol: 0.55},
  // window
  {at: 10.38, src: 'whoosh-low', vol: 0.3},
  {at: 10.7, src: 'glass-tinkle', vol: 0.45},
  {at: 15.98, src: 'glass-break', vol: 0.22},
  // outside
  {at: 16.4, src: 'door-creak', vol: 0.45},
  {at: 18.5, src: 'whoosh-soft', vol: 0.22},
  {at: 20.86, src: 'step-snow-2', vol: 0.45},
  {at: 21.25, src: 'flash-click', vol: 0.8},
  {at: 22.04, src: 'whoosh-soft', vol: 0.2},
  {at: 23.38, src: 'whoosh-low', vol: 0.3},
  {at: 24.62, src: 'hit-deep', vol: 0.3},
  {at: 25.86, src: 'glass-tinkle', vol: 0.55},
  {at: 27.5, src: 'glass-tinkle', vol: 0.35},
  // twist
  {at: 28.9, src: 'riser', vol: 0.45},
  {at: 30.08, src: 'whoosh-fast', vol: 0.4},
  {at: 31.0, src: 'glass-break', vol: 0.9},
  {at: 31.02, src: 'hit-deep', vol: 1.0},
  // aftermath
  {at: 32.4, src: 'heartbeat', vol: 0.9},
  {at: 33.12, src: 'heartbeat', vol: 0.75},
  {at: 33.64, src: 'whoosh-low', vol: 0.35},
  {at: 34.1, src: 'paper', vol: 0.35},
  {at: 35.0, src: 'paper', vol: 0.3},
  {at: 35.58, src: 'paper', vol: 0.55},
  {at: 36.0, src: 'paper', vol: 0.25},
  {at: 37.06, src: 'whoosh-soft', vol: 0.3},
  {at: CLOSED_S, src: 'stamp', vol: 1.0},
  {at: CLOSED_S, src: 'sting', vol: 0.55},
];
// footsteps in snow on the walk-cycle contacts (every 33 frames)
for (let i = 0; i < 4; i++) SFX.push({at: 16.55 + i * 0.55, src: `step-snow-${i % 4}`, vol: 0.5});
for (let i = 0; i < 6; i++) SFX.push({at: 37.2 + i * 0.55, src: `step-snow-${(i + 1) % 4}`, vol: 0.45 - i * 0.03});

const INTERIOR: (keyof typeof SHOTS)[] = ['clock', 'safe', 'window', 'ownerA', 'ownerB', 'robbed', 'claim'];
const inShots = (t: number, keys: (keyof typeof SHOTS)[]) => keys.some((k) => t >= SHOTS[k][0] && t < SHOTS[k][1]);
const inside = (fr: number) => inShots(fr / 60, INTERIOR);

const Sound: React.FC = () => (
  <>
    <Html5Audio src={staticFile('audio/case004.mp3')} volume={1} />
    <Html5Audio src={staticFile('sfx/bed-drone.wav')} volume={(fr) => 0.2 * clamp((sec(DURATION_S) - fr) / 60)} />
    {/* still night after the snowfall: wind kept low */}
    <Html5Audio src={staticFile('sfx/bed-wind.wav')} volume={(fr) => (inside(fr) ? 0.05 : 0.2)} />
    <Html5Audio src={staticFile('sfx/bed-hum.wav')} volume={(fr) => (inside(fr) ? 0.05 : 0.14)} />
    <Html5Audio src={staticFile('sfx/bed-room.wav')} volume={(fr) => (inside(fr) ? 0.22 : 0)} />
    <Html5Audio src={staticFile('sfx/siren-far.wav')} volume={(fr) => 0.22 * (fr < 300 ? 1 : Math.max(0, 1 - (fr - 300) / 200))} />
    <Sequence from={sec(16.4)} durationInFrames={sec(9)}>
      <Html5Audio src={staticFile('sfx/siren-far.wav')} volume={0.1} />
    </Sequence>
    {SFX.map((c, i) => (
      <Sequence key={i} from={sec(c.at)} durationInFrames={sec(c.dur ?? 4)}>
        <Html5Audio src={staticFile(`sfx/${c.src}.wav`)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

/* ------------------------------ edit ------------------------------- */
export const Case004: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOT_LIST.map(([k, C]) => {
        const from = sec(SHOTS[k][0]);
        const to = sec(SHOTS[k][1]);
        return (
          <Sequence key={k} from={from} durationInFrames={to - from}>
            <ShotHost C={C} from={from} />
          </Sequence>
        );
      })}
      <FilmFinish f={f} />
      <Captions subs={SUBS} accents={ACCENTS} f={f} />
      {f < CLOSED_AT && <CaseTag n="004" f={f + 20} />}
      <CaseClosed f={f} at={CLOSED_AT} />
      <Sound />
    </AbsoluteFill>
  );
};

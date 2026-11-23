import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CaseClosed, CaseTag, Captions} from '../../kit/captions';
import {FilmFinish} from '../../kit/fx';
import {clamp, sec} from '../../kit/time';
import {ACCENTS, CLOSED_S, DURATION_S, HIT_S, SHOTS, SUBS} from './timeline';
import * as Sh from './shots';

export const CASE004_FRAMES = sec(DURATION_S);
const CLOSED_AT = sec(CLOSED_S);

const SHOT_LIST: [keyof typeof SHOTS, React.FC<Sh.ShotP>][] = [
  ['hookFace', Sh.HookFace],
  ['hookGlass', Sh.HookGlass],
  ['hookLights', Sh.HookLights],
  ['snowGlide', Sh.SnowGlide],
  ['lens', Sh.Lens],
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
  ['shard', Sh.ShardLift],
  ['lookUp', Sh.LookUp],
  ['burst', Sh.Burst],
  ['ghost', Sh.Ghost],
  ['stash', Sh.Stash],
  ['typed', Sh.Typed],
  ['car', Sh.CarEnd],
];

const ShotHost: React.FC<{C: React.FC<Sh.ShotP>; from: number}> = ({C, from}) => {
  const f = useCurrentFrame();
  return <C f={f} g={f + from} />;
};

/* ------------------------------ sound ------------------------------ */
type Cue = {at: number; src: string; vol: number; dur?: number};
const SFX: Cue[] = [
  // hook: 3 cuts, only low/soft cues under the first words (no hiss)
  {at: 0.9, src: 'whoosh-low', vol: 0.22},
  {at: 0.95, src: 'glass-tinkle', vol: 0.22},
  {at: 1.7, src: 'whoosh-low', vol: 0.22},
  {at: 2.44, src: 'whoosh-soft', vol: 0.2},
  {at: 4.03, src: 'whoosh-low', vol: 0.25},
  {at: 4.94, src: 'whoosh-soft', vol: 0.22},
  {at: 6.66, src: 'tick', vol: 0.6},
  {at: 7.16, src: 'tock', vol: 0.55},
  {at: 7.62, src: 'flash-click', vol: 0.8},
  {at: 7.7, src: 'safe-clank', vol: 0.5},
  {at: 9.0, src: 'whoosh-low', vol: 0.28},
  {at: 9.3, src: 'glass-tinkle', vol: 0.4},
  {at: 14.32, src: 'glass-break', vol: 0.2},
  {at: 14.5, src: 'door-creak', vol: 0.45},
  {at: 16.38, src: 'whoosh-soft', vol: 0.2},
  {at: 18.62, src: 'step-snow-2', vol: 0.45},
  {at: 19.02, src: 'flash-click', vol: 0.8},
  {at: 19.74, src: 'whoosh-soft', vol: 0.2},
  {at: 20.84, src: 'whoosh-low', vol: 0.28},
  {at: 21.88, src: 'hit-deep', vol: 0.3},
  {at: 23.06, src: 'glass-tinkle', vol: 0.45},
  {at: 24.7, src: 'glass-tinkle', vol: 0.5},
  {at: 25.8, src: 'riser', vol: 0.4},
  {at: 26.08, src: 'whoosh-soft', vol: 0.22},
  // twist
  {at: HIT_S - 0.02, src: 'glass-break', vol: 0.9},
  {at: HIT_S, src: 'hit-deep', vol: 1.0},
  {at: 28.7, src: 'whoosh-low', vol: 0.3},
  {at: 30.06, src: 'whoosh-soft', vol: 0.25},
  {at: 30.5, src: 'paper', vol: 0.3},
  {at: 31.4, src: 'paper', vol: 0.28},
  {at: 33.16, src: 'car-door', vol: 0.4},
  {at: CLOSED_S, src: 'stamp', vol: 1.0},
  {at: CLOSED_S, src: 'sting', vol: 0.5},
];
// footsteps in snow on the walk-cycle contacts
for (let i = 0; i < 3; i++) SFX.push({at: 14.62 + i * 0.55, src: `step-snow-${i % 4}`, vol: 0.5});
// typewriter keys, one per typed character
for (let i = 0; i < Sh.TYPED_LINE.length; i++) if (Sh.TYPED_LINE[i] !== ' ') SFX.push({at: SHOTS.typed[0] + (Sh.TYPE_F0 + i * Sh.TYPE_STEP) / 60, src: 'watch-click', vol: 0.4, dur: 0.5});

const INTERIOR: (keyof typeof SHOTS)[] = ['clock', 'safe', 'window', 'ownerA', 'ownerB', 'stash', 'typed'];
const inShots = (t: number, keys: (keyof typeof SHOTS)[]) => keys.some((k) => t >= SHOTS[k][0] && t < SHOTS[k][1]);
const inside = (fr: number) => inShots(fr / 60, INTERIOR);

const Sound: React.FC = () => (
  <>
    <Html5Audio src={staticFile('audio/case004_vo.wav')} volume={1} />
    {/* Theme 99, CASE 004 arrangement (scripts/make-music-case004.py): ducking + level baked in */}
    <Html5Audio src={staticFile('music/case004_music.wav')} volume={1} />
    <Html5Audio src={staticFile('sfx/bed-drone.wav')} volume={(fr) => 0.2 * clamp((sec(DURATION_S) - fr) / 60)} />
    {/* still night after the snowfall: wind kept low */}
    <Html5Audio src={staticFile('sfx/bed-wind.wav')} volume={(fr) => (inside(fr) ? 0.05 : 0.2)} />
    <Html5Audio src={staticFile('sfx/bed-hum.wav')} volume={(fr) => (inside(fr) ? 0.05 : 0.14)} />
    <Html5Audio src={staticFile('sfx/bed-room.wav')} volume={(fr) => (inside(fr) ? 0.22 : 0)} />
    <Html5Audio src={staticFile('sfx/siren-far.wav')} volume={(fr) => 0.18 * (fr < 240 ? 1 : Math.max(0, 1 - (fr - 240) / 200))} />
    <Sequence from={sec(33.1)} durationInFrames={sec(4)}>
      <Html5Audio src={staticFile('sfx/siren-far.wav')} volume={0.12} />
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
      <FilmFinish f={f} grain={f < 120 ? 0.1 : 0.2} paper={f < 120 ? 0.05 : 0.1} />
      <Captions subs={SUBS} accents={ACCENTS} f={f} />
      {f < CLOSED_AT && <CaseTag n="004" f={f + 20} />}
      <CaseClosed f={f} at={CLOSED_AT} />
      <Sound />
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CaseClosed, CaseTag, Captions} from '../../kit/captions';
import {FilmFinish} from '../../kit/fx';
import {clamp, sec} from '../../kit/time';
import {ACCENTS, CLOSED_S, DURATION_S, SHOTS, SUBS} from './timeline';
import * as Sh from './shots';

export const CASE002_FRAMES = sec(DURATION_S);
const CLOSED_AT = sec(CLOSED_S);

const SHOT_LIST: [keyof typeof SHOTS, React.FC<Sh.ShotP>][] = [
  ['frame', Sh.FrameHook],
  ['museum', Sh.MuseumExt],
  ['guard', Sh.GuardShot],
  ['log', Sh.LogInsert],
  ['walk', Sh.GalleryWalk],
  ['ask', Sh.IFAsk],
  ['nothing', Sh.GuardNothing],
  ['backdoor', Sh.BackDoorInsert],
  ['stopped', Sh.IFStopped],
  ['why', Sh.IFWhy],
  ['told', Sh.ToldOTS],
  ['silent', Sh.GuardSilent],
  ['thief', Sh.ThiefPunch],
  ['never', Sh.CorridorTorch],
  ['hidden', Sh.HiddenReveal],
  ['red', Sh.RedShadow],
  ['secret', Sh.IFSecret],
  ['outro', Sh.Outro],
];

const ShotHost: React.FC<{C: React.FC<Sh.ShotP>; from: number}> = ({C, from}) => {
  const f = useCurrentFrame();
  return <C f={f} g={f + from} />;
};

/* ------------------------------ sound ------------------------------ */
type Cue = {at: number; src: string; vol: number; dur?: number};
const SFX: Cue[] = [
  // hook: quiet, low (no hiss under the first words)
  {at: 0.0, src: 'tick', vol: 0.2},
  {at: 1.9, src: 'whoosh-low', vol: 0.4},
  // IF's fastback rolls up
  {at: 1.95, src: 'car-arrive', vol: 0.3},
  // guard
  {at: 4.12, src: 'whoosh-soft', vol: 0.28},
  {at: 4.9, src: 'keys', vol: 0.35},
  // log
  {at: 5.95, src: 'paper', vol: 0.5},
  {at: 6.6, src: 'paper', vol: 0.25},
  // gallery walk
  {at: 7.45, src: 'whoosh-soft', vol: 0.25},
  // guard relaxed
  {at: 12.15, src: 'whoosh-soft', vol: 0.2},
  // back door insert
  {at: 14.85, src: 'whoosh-low', vol: 0.35},
  {at: 15.0, src: 'door-creak', vol: 0.22},
  // detective stopped
  {at: 16.86, src: 'hit-deep', vol: 0.8},
  {at: 17.1, src: 'tick', vol: 0.45},
  {at: 17.55, src: 'tock', vol: 0.45},
  {at: 17.75, src: 'whoosh-soft', vol: 0.22},
  // the line
  {at: 20.2, src: 'riser', vol: 0.3},
  // silence
  ...[22.4, 22.9].map((t, i) => ({at: t, src: i % 2 ? 'tock' : 'tick', vol: 0.45})),
  {at: 23.3, src: 'heartbeat', vol: 0.9},
  {at: 23.9, src: 'heartbeat', vol: 0.8},
  // thief
  {at: 24.3, src: 'whoosh-fast', vol: 0.4},
  {at: 24.86, src: 'hit-deep', vol: 1.0},
  // corridor + flashlight
  {at: 26.6, src: 'whoosh-low', vol: 0.4},
  {at: 26.66, src: 'lighter-close', vol: 0.35},
  // reveal
  {at: 29.6, src: 'riser', vol: 0.3},
  {at: 29.8, src: 'paper', vol: 0.55},
  {at: 30.3, src: 'paper', vol: 0.4},
  {at: 30.9, src: 'hit-deep', vol: 0.7},
  {at: 30.92, src: 'sting', vol: 0.35},
  // red shadow
  {at: 32.3, src: 'whoosh-low', vol: 0.4},
  {at: 33.4, src: 'heartbeat', vol: 0.7},
  // IF lights up
  {at: 34.5, src: 'lighter-open', vol: 0.35},
  {at: 34.95, src: 'inhale', vol: 0.3},
  {at: 35.95, src: 'exhale', vol: 0.28},
  // outro: the fastback pulls away, stamp
  {at: 36.62, src: 'whoosh-soft', vol: 0.3},
  {at: 37.55, src: 'car-depart', vol: 0.4, dur: 2.45},
  {at: CLOSED_S, src: 'stamp', vol: 1.0},
  {at: CLOSED_S, src: 'sting', vol: 0.5},
];
// marble footsteps in the gallery (walk-cycle contacts every 33 frames)
for (let i = 0; i < 4; i++) SFX.push({at: 7.55 + i * 0.55, src: `step-wood-${i % 3}`, vol: 0.45});

const inShots = (t: number, keys: (keyof typeof SHOTS)[]) => keys.some((k) => t >= SHOTS[k][0] && t < SHOTS[k][1]);
const EXTERIOR: (keyof typeof SHOTS)[] = ['museum', 'outro'];
const CORRIDOR: (keyof typeof SHOTS)[] = ['backdoor', 'never', 'hidden'];

const Sound: React.FC = () => (
  <>
    <Html5Audio src={staticFile('audio/case002_vo.wav')} volume={1} />
    <Html5Audio src={staticFile('sfx/bed-drone.wav')} volume={(fr) => 0.2 * clamp(fr / 30) * clamp((sec(DURATION_S) - fr) / 60)} />
    <Html5Audio src={staticFile('sfx/bed-wind.wav')} volume={(fr) => (inShots(fr / 60, EXTERIOR) ? 0.38 : 0.06)} />
    <Html5Audio src={staticFile('sfx/bed-hum.wav')} volume={(fr) => (inShots(fr / 60, CORRIDOR) ? 0.2 : 0.05)} />
    <Html5Audio src={staticFile('sfx/bed-room.wav')} volume={(fr) => (inShots(fr / 60, EXTERIOR) || fr < 60 ? 0.04 : 0.2)} />
    <Sequence from={sec(2.0)} durationInFrames={sec(8)}>
      <Html5Audio src={staticFile('sfx/siren-far.wav')} volume={(fr) => 0.22 * (fr < 100 ? 1 : Math.max(0, 1 - (fr - 100) / 200))} />
    </Sequence>
    {/* idle under the guard shot, after the car settles */}
    <Sequence from={sec(4.6)} durationInFrames={sec(1.4)}>
      <Html5Audio src={staticFile('sfx/car-idle.wav')} volume={(fr) => 0.18 * clamp(1 - fr / 84)} />
    </Sequence>
    {SFX.map((c, i) => (
      <Sequence key={i} from={sec(c.at)} durationInFrames={sec(c.dur ?? 4)}>
        <Html5Audio src={staticFile(`sfx/${c.src}.wav`)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

/* ------------------------------ edit ------------------------------- */
export const Case002: React.FC = () => {
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
      {f < CLOSED_AT && <CaseTag n="002" f={f + 20} />}
      <CaseClosed f={f} at={CLOSED_AT} />
      <Sound />
    </AbsoluteFill>
  );
};
